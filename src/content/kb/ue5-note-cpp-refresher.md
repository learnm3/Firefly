---
title: UE5 C++ 学前复习：继承、虚函数、多态与类型转换速记
published: 2026-09-06
type: note
branch: ue
topic: C++复习
description: 进 UE C++ 编码前的概念清单：继承与虚函数、多态（看对象不看指针）、父指针向下转换要 dynamic_cast 且判空，以及 Unreal 的 UObject→AActor→APawn→ACharacter 类链与 is-a/has-a 关系。
tags:
  - UE5
  - C++
  - 面向对象
  - 多态
relatedPosts:
  - ue5-cpp-refresher
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ 学前复习：继承、虚函数、多态与类型转换](/posts/ue5-cpp-refresher/)。

## 一句话理解

- **继承**：子类复用父类成员并可有自己的成员；虚函数让子类能重写，调用哪个版本**看对象真实类型、不看指针类型**（多态）。
- **向下转换**：把父指针还原成子指针去调子类独有函数；运行时转换用 `dynamic_cast`，**必须判空**。

## 多态三句话

- 父类指针可以指向任何后代对象。
- 通过父指针调虚函数 → 执行**指针所指对象**的重写版本。
- 子类独有函数编译器"看不见"（指针类型里没有），必须先向下转换。

## 向下转换写法

```cpp
ChildThree* third = dynamic_cast<ChildThree*>(onePointer);
if (third)
{
    third->UniqueFunctionOfChildThree(); // 只有转换成功才能调
}
```

- `static_cast`：编译期，自己确信类型时用（int→float 等）。
- `dynamic_cast`：运行期做类型检查，失败返回 `nullptr` → 判空再使用。

## Unreal 主线类链

```
UObject → AActor → APawn → ACharacter
```

| 类 | 能力 | 命名 |
| --- | --- | --- |
| UObject | 存数据，不能放关卡 | U 前缀 |
| AActor | 能被放进关卡 | A 前缀 |
| APawn | 可被 Controller 拥有（响应输入/AI） | A 前缀 |
| ACharacter | Pawn + 双足移动（角色移动组件） | A 前缀 |

## is-a 与 has-a

- **is-a**：继承。子类 is-a 父类，父类**不是**子类（不可逆）。
- **has-a**：拥有。类内嵌套成员：Package 拥有 World → Level → Actor → Component。
- 关卡里放的是 Actor；Actor 的功能靠挂 Component 叠加。

## 我的用法准则

写代码前先自问两句：**这个类该继承谁（is-a）？功能该内聚到组件还是拆成成员（has-a）？** 在 UE 里，"该用 Actor 还是 Component"其实就是这两句话的落地。
