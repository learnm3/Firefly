---
title: C++ 多态与虚函数完全解析：vtable、纯虚函数与 RTTI，面试一次问透
published: 2026-08-17
description: 多态是 C++ 面试出现率最高的考点。本文深入虚函数表 vtable/vptr 的内存布局、继承下的覆盖与隐藏、构造析构中的虚函数陷阱、纯虚函数与抽象类、override/final、dynamic_cast 与 RTTI，每节附面试标准答案与手画内存图。
image: api
tags: [C++, 多态, 虚函数, vtable, RTTI, 面试, 游戏客户端]
category: C++
draft: false
---

> 这是求职路线图「阶段一：地基补强」的产出之二。上一篇《[C++ 内存管理完全指南](/posts/cpp-memory-management/)》解决了"内存长什么样"，这一篇解决"C++ 怎么实现多态"——**虚函数是 C++ 面试提问频率最高的单点话题**，面试官会从"什么是多态"一路追到"vtable 在内存里长什么样"。

---

## 一、多态：C++ 面向对象的灵魂

多态（Polymorphism）指**同一接口，多种实现**。C++ 有两种多态：

| 类型 | 机制 | 绑定时机 | 例子 |
|---|---|---|---|
| **静态多态** | 函数重载 / 模板 | 编译期 | 重载 `print(int)` / `print(string)` |
| **动态多态** | 虚函数 | 运行期 | 基类指针调用派生类重写的虚函数 |

> **面试标准答案开头**：多态分为编译期多态（重载、模板）和运行期多态（虚函数）。游戏客户端里最典型的就是——引擎用 `AActor*` 基类指针管理成百上千种 Actor，调用 `Tick()` 时运行时找到正确的实现。

```cpp
class Actor {
public:
    virtual void Tick(float dt) { /* 默认实现 */ }
    virtual ~Actor() = default;
};

class Enemy : public Actor {
public:
    void Tick(float dt) override { /* 敌人的 AI 逻辑 */ }
};

Actor* a = new Enemy();
a->Tick(0.016f);   // 运行期找到 Enemy::Tick —— 这就是动态多态
delete a;          // 虚析构 → 正确调用 ~Enemy() → ~Actor()
```

---

## 二、vtable 与 vptr：虚函数的底层真相

### 2.1 内存布局

**每个含虚函数的类**在编译期生成一张**虚函数表（vtable）**——一个存函数指针的数组。**每个对象**内部隐藏一个**虚表指针（vptr）**，指向自己所属类的 vtable。

```cpp
class Base {
public:
    virtual void f1();   // 加入 vtable 槽位 0
    virtual void f2();   // 槽位 1
    int data;            // 普通成员，不进 vtable
};
// 对象内存布局：
// [ vptr ] [ data ]
//    │
//    └──→ vtable: [ &Base::f1 ][ &Base::f2 ]  ← 函数指针数组

class Derived : public Base {
public:
    void f1() override;  // 覆盖槽位 0 → 指向 Derived::f1
    virtual void f3();   // 追加槽位 2
};
// Derived 的 vtable: [ &Derived::f1 ][ &Base::f2 ][ &Derived::f3 ]
```

**关键点**：

- 派生类**继承并覆盖**基类的槽位，**追加**新虚函数的槽位
- 调用 `p->f1()` 实际执行：`(*(p->vptr[0]))(p)` —— **间接调用**
- 这就是虚函数比普通函数慢一点点（一次指针跳转）的原因，但现代 CPU 分支预测让它几乎无感

### 2.2 手画面试答案

> **面试官：解释虚函数的工作原理。**
>
> 答：编译期，每个含虚函数的类生成一张虚函数表，按声明顺序存放虚函数指针；每个对象在内存开头（或偏移处）隐藏一个 vptr 指向所属类的 vtable。调用虚函数时，编译器生成通过 vptr 查表的间接调用代码。派生类继承基类 vtable：覆盖的函数替换对应槽位，新增虚函数追加槽位。所以运行期 `p` 实际指向哪个对象，就查哪个对象的 vtable——多态由此实现。

### 2.3 vptr 什么时候初始化？

**构造函数中初始化**——每层构造函数的初始化列表执行时，把 vptr 指向**当前层**的 vtable。

这引出一个经典陷阱（见下节）：**构造函数里调用虚函数，不会触发动态绑定**。

---

## 三、构造与析构中的虚函数：经典陷阱

```cpp
class Base {
public:
    Base() { Print(); }          // 调用的是 Base::Print！
    virtual void Print() { std::cout << "Base\n"; }
};

class Derived : public Base {
public:
    Derived() : Base() {}        // Base 构造时，vptr 还指向 Base 的 vtable
    void Print() override { std::cout << "Derived\n"; }
};

Derived d;  // 输出 "Base"，不是 "Derived"！
```

**原因**：构造 `Derived` 时，先构造 `Base` 部分——此时 vptr 被初始化为**指向 Base 的 vtable**（因为 Derived 还没开始构造，其部分还不存在）。`Base` 构造函数返回后，vptr 才被更新为指向 Derived 的 vtable。

**析构同理**：析构时先执行 `~Derived()`（此时 vptr 指向 Derived），再执行 `~Base()`（vptr 已被改回 Base）——所以析构函数里调虚函数也只会调到当前层的版本。

> **面试必答**：构造/析构函数中调用虚函数**不产生动态绑定**，调用的是当前正在构造/析构的类自己的版本。设计上应避免在构造函数中依赖虚函数行为（可用普通私有函数替代）。

---

## 四、基类析构函数为什么必须是虚的？

这是 C++ 面试**出现率 100%** 的问题：

```cpp
class Base { public: ~Base() {} };            // ❌ 非虚析构
class Derived : public Base { int* data_; public: ~Derived() { delete data_; } };

Base* p = new Derived();
delete p;   // 只调用 ~Base()！~Derived() 没执行 → data_ 泄漏
```

**为什么非虚析构会这样**：`delete` 一个对象时，编译器根据**静态类型**（`Base*`）决定调用哪个析构函数。析构函数不是虚的，就不会查 vtable——直接调 `~Base()`，派生类的资源释放被跳过。

**修复**：把基类析构函数声明为 `virtual`，`delete` 时通过 vtable 找到 `~Derived()`，执行完派生类析构后**自动链式调用**基类析构。

```cpp
class Base {
public:
    virtual ~Base() = default;   // ✅ 正确姿势
};
```

> **加分细节**：vtable 中析构函数其实占**两个槽位**——`~Class()`（析构本体）和 `operator delete`（清除删除器），用于支持 `delete` 时的正确释放。UE 的 `UObject` 有 `BeginDestroy`/`FinishDestroy` 虚函数同理，就是给引擎一个链式销毁钩子。

---

## 五、纯虚函数与抽象类

```cpp
class ICharacterController {          // 抽象类（接口）
public:
    virtual void Move(const FVector& dir) = 0;   // 纯虚函数
    virtual void Jump() = 0;
    virtual ~ICharacterController() = default;
};
```

- **纯虚函数**：`= 0`，本类不提供实现（或提供但派生类必须重写）
- **抽象类**：含至少一个纯虚函数，**不能实例化**
- **接口 vs 抽象类**：C++ 没有 interface 关键字，约定"全纯虚 + 虚析构"的类即接口（UE 用 `UINTERFACE` 宏表达）

**游戏里的典型用法**：

```cpp
// 策略模式：不同 Boss 共享同一套攻击接口
class IBossBehavior {
public:
    virtual void Attack(APawn* Target) = 0;
    virtual ~IBossBehavior() = default;
};

class MeleeBoss : public IBossBehavior { /* 近战实现 */ };
class RangedBoss : public IBossBehavior { /* 远程实现 */ };
```

> **面试延伸**：为什么游戏引擎到处都是接口？为了**解耦**——战斗系统只依赖 `IBossBehavior` 接口，新增 Boss 类型不需要改战斗系统代码（开闭原则）。UE 里 `UInterface` + `Implements` 就是 C++ 接口的引擎化实现。

---

## 六、override 与 final：现代 C++ 的保护

```cpp
class Derived : public Base {
public:
    void f1() override;    // ✅ 明确覆盖，签名不匹配编译报错
    void f2() final;       // ✅ 派生类不可再覆盖
};

class Derived2 : public Derived {
public:
    // void f2() override;  // ❌ 编译错误：f2 被 final 锁死
};
```

- **override**：告诉编译器"我要覆盖基类虚函数"，签名写错立刻报错（防呆）
- **final**：禁止进一步覆盖，也让编译器可以做**去虚化**优化（devirtualization）
- UE 中大量使用 `virtual ... override`，配合 `UPROPERTY`/`UFUNCTION` 宏做反射

---

## 七、RTTI 与 dynamic_cast

### 7.1 dynamic_cast 的安全向下转型

```cpp
Base* b = GetSomeActor();          // 实际可能是 Enemy

// 安全转型：失败返回 nullptr
if (auto* enemy = dynamic_cast<Enemy*>(b)) {
    enemy->DoEnemyStuff();          // 只有真的是 Enemy 才执行
}
```

- `dynamic_cast` 依赖 RTTI（运行时类型信息），**多态类型（有虚函数）才能用**
- 失败：指针返回 `nullptr`，引用抛 `std::bad_cast`
- **性能**：需要查 RTTI 信息，比静态转换慢；高频路径慎用

### 7.2 typeid 与 type_info

```cpp
#include <typeinfo>
if (typeid(*b) == typeid(Enemy)) { /* ... */ }
std::cout << typeid(*b).name();   // 类型名字符串
```

### 7.3 游戏引擎中的转型哲学

> **面试加分回答**：UE 不直接用 dynamic_cast，而是用引擎自带的类型系统——`Cast<UEnemy>(Actor)`（基于 UClass 的反射表查找，快且可控）、`Actor->IsA<T>()`、`GetClass()->IsChildOf(...)`。因为 UObject 有完整的反射元数据，比 C++ RTTI 更强大。这也解释了 UE 为什么要求 `UCLASS()` 宏——一切反射能力的来源。

---

## 八、静态多态：模板与 CRTP

动态多态（虚函数）有运行时开销且类型信息运行时才知道；**静态多态**在编译期完成，零开销：

```cpp
// 模板：编译期确定类型
template <typename T>
void ApplyDamage(T& target, float dmg) {
    target.TakeDamage(dmg);   // 编译期绑定到 T::TakeDamage
}

// CRTP：奇异递归模板模式 —— 模拟虚函数但无 vtable
template <typename Derived>
class BaseAI {
public:
    void Think() { static_cast<Derived*>(this)->ThinkImpl(); }
};
```

**游戏性能优化视角**：ECS（实体组件系统）大量用静态多态避免虚函数调用开销——这正是"数组比链表快 + 无虚函数调用"的极致形态，面试聊到数据导向设计（DOD）时是重要加分点。

---

## 九、总结：一份面试 Checklist

- [ ] 静态多态 vs 动态多态的区别？各自绑定时机？
- [ ] 虚函数的工作原理？vtable/vptr 内存布局？（能手画）
- [ ] vptr 什么时候初始化？为什么构造函数里调虚函数是静态绑定？
- [ ] 基类析构函数为什么必须 virtual？非虚析构的后果？
- [ ] 纯虚函数与抽象类？C++ 接口怎么表达？
- [ ] override/final 的作用？final 能带来什么优化？
- [ ] dynamic_cast 的原理与限制？为什么 UE 用 Cast<> 而不是 dynamic_cast？
- [ ] 模板与虚函数的选择？CRTP 是什么？
- [ ] 虚函数有运行时开销吗？ECS 为什么倾向静态多态？
- [ ] UE 的 UCLASS 反射与 C++ RTTI 的关系？

把文中的代码放进 IDE 里，用调试器看 vptr 和 vtable 的实际地址与内容，你会彻底理解多态。

---

## 参考资源

- [cppreference — Virtual functions](https://en.cppreference.com/w/cpp/language/virtual)
- [cppreference — RTTI / dynamic_cast](https://en.cppreference.com/w/cpp/language/dynamic_cast)
- [cppreference — CRTP](https://en.cppreference.com/w/cpp/language/crtp)
- [Effective C++（第3版）条款 7：将多态基类的析构函数声明为 virtual](https://www.artima.com/cppsource/nevercall.html)
- [Unreal Engine — Casting / IsA 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/casting-and-isa-in-unreal-engine)
