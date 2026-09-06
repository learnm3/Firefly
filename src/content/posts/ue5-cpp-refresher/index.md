---
title: UE5 C++ 学前复习：继承、虚函数、多态与类型转换
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 35 集整理：进入 UE C++ 编码前必会的面向对象概念——类与继承、虚函数与重写、多态、父指针指向子对象、向下转换（static_cast / dynamic_cast），以及 Unreal 自身的 UObject→AActor→APawn→ACharacter 类层次与 is-a / has-a 关系。
image: ""
tags: [UE5, C++, 游戏开发, C++复习, 继承, 多态]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 35 集「C++ Refresher」整理，UP 主：**黑子的游戏空间**。本集是纯概念复习（无代码演示），为接下来真正写 UE C++ 做准备。

---

## 本集在讲什么

从下一节开始就要在 UE 里动手写 C++ 了。这一集把写游戏代码前**必须心里有数**的 C++ 面向对象概念快速过一遍，同时把 Unreal 自己的类层次串起来：

- 类、继承、继承链（层次）
- 虚函数与重写、多态
- 指针与"父指针指向子对象"
- 向下转换（`dynamic_cast` / `static_cast`）
- UE 的 `UObject → AActor → APawn → ACharacter` 继承链与命名前缀
- **is-a 与 has-a** 两种关系

如果你对其中某些概念还不熟，视频建议去系统学一门 C++ 基础课再回来；本集可以随时回看。

---

## 一、继承：子类"是"父类

想象一个 C++ 类：它有自己的变量和函数，并且可以**从父类派生**：

- 子类**继承**父类的变量和函数，同时可以有自己的成员；
- 父类可以把部分函数标记为 **virtual（虚函数）**，子类就能**重写（override）**它们，提供自己的版本；
- 子类既可以调用自己重写的版本，也可以通过作用域限定继续调用父类的版本。

继承可以一层层继续：父类 → 子类 → 孙类……形成**继承层次（inheritance hierarchy）**，也叫**继承链（inheritance chain）**。

两个额外的知识点：

- 一个类可以有**多个子类**，所以继承层次会很快变复杂；
- 一个子类也可以有**多个父类**，这就是**多重继承（multiple inheritance）**——每个父类贡献自己的变量和函数，子类全部继承。

---

## 二、父类指针可以指向子类对象 → 多态

**指针**是一种用于**存储对象地址**的变量。指向父类的指针不仅可以指向父类对象，也可以指向**任何从父类派生（继承链上位于其下的）子类对象**。

加上虚函数后，就出现了本集最核心的现象——**多态（polymorphism）**：

> 有一个"父类指针类型的变量"，但它指向的是某个子类对象。调用虚函数时，**决定调用哪个版本的，是"指针所指向的对象"的真实类型**，而不是指针本身的声明类型。

因此即使变量类型是父类指针，只要它指向子类，调用虚函数就会执行**子类的重写版本**。

---

## 三、想调用子类"独有函数"：向下转换

继承链里还有一种情况：

- 假设有 `ChildOne` 指针，指向一个 `ChildThree` 类型的对象（`ChildThree` 是 `ChildOne` 的后代，这在 C++ 里合法）；
- `ChildThree` 有一个**自己独有的函数**（在 `ChildOne` 中不存在，这不是重写）；
- 此时**不能用 ChildOne 指针调用它**——编译器只认指针的声明类型 `ChildOne`，而 `ChildOne` 里没有这个函数。

解决办法是**向下转换（downcasting）**：

```cpp
ChildThree* third = dynamic_cast<ChildThree*>(onePointer);
if (third)
{
    third->UniqueFunctionOfChildThree();
}
```

几个要点：

- 这种转换发生在**运行时**，依赖**运行时类型检查（RTTI）**：必须检查对象真实类型是不是 `ChildThree`；
- 成功 → 返回指向 `ChildThree` 的指针；失败 → 返回 `nullptr`；
- 转换的是"对象真实类型"，所以转换前先想清楚对象到底是什么；
- 你大概已经学过 `static_cast` 和 `dynamic_cast`：
  - `static_cast` 在**编译期**完成，适合"你确定类型没错"的场景（如 `int` → `float`）；
  - `dynamic_cast` 在**运行时**做类型检查，适合这里这种"取决于游戏运行状态、无法在编译期确定"的向下转换（因为对象是运行时动态创建的）；
- **每次 dynamic_cast 之后都要检查指针是否为 null**，因为转换可能失败。

---

## 四、Unreal 的类层次与命名前缀

UE 自己有一套继承层次，顶上是 `UObject`：

| 类 | 说明 |
| --- | --- |
| `UObject` | 非常基础的类，能存数据，但**没有把自己放进世界的能力** |
| `AActor` | 继承自 UObject，最大的升级是**可以被放进关卡（Level）**；游戏关卡里的一切都至少从 Actor 派生 |
| `APawn` | 继承自 AActor，关键能力：**可以被 Controller（控制器）拥有** |
| `ACharacter` | 继承自 APawn，在 Pawn 之上加了适合**双足生物**（如人类）的功能，核心是 `UCharacterMovementComponent`（角色移动组件） |

> UE 里 `ACharacter` 提供的移动能力（行走、跳跃等）就是由角色移动组件完成的；这部分会在后面课程专门讲。

**命名前缀的约定**（一眼识别类属于哪条链）：

- 从 `UObject` 派生、**不是 Actor** 的类 → 类名以 **`U`** 开头；
- 从 Actor 派生的类 → 类名以 **`A`** 开头。

（例如本集提到的 `APawn`、`ACharacter` 都继承自 Actor；而 `UObject` 家族的非 Actor 类用 `U`。）

**为什么 Pawn 有用**：能被"拥有"就意味着它能响应输入——按 W 键 → 控制器接收输入、处理、转换成"让角色向前移动"的动作。所以"需要根据某种输入移动的东西"，不管是玩家按键/鼠标还是 AI，都适合做成 Pawn；需要更多特定能力（移动组件、双足形态）时再用 Character。

> 补充/延伸：实际 UE 里 `UObject → AActor` 之间还有 `UObject → UActorComponent` 等其它分支，本集只是概述最主线的一条链，后面的课程会逐个展开。

---

## 五、is-a 与 has-a：面向对象的两类关系

### is-a（"是"的关系）：靠继承

子类继承父类的变量与函数，所以**子类是父类的一种**（Child is a Parent），但反过来不成立：

- 子类 is-a 父类，**父类不是子类**；
- 孙类既 is-a 子类、也 is-a 父类（它把两层都继承了）；
- 同理在 UE 里：`AActor` is-a `UObject`，但 `UObject` 不是 Actor；`APawn` 既是 Actor 也是 UObject。

### has-a（"拥有"的关系）：靠嵌套/成员变量

一个类可以**拥有**其它类/结构体类型的成员变量：

- 外层类叫"外部类"，被包含的成员类型叫"内部类"；
- 内部类里又可以再嵌套其它类，一层套一层。

UE 里典型的嵌套关系（也是后面会用的组织方式）：

```
Package（包）
 └─ World（世界）      ← Package has a World
     └─ Level（关卡）  ← World has a Level
         └─ Actor     ← Level has Actor（关卡里的物体大多从 Actor 派生）
             └─ Component（组件）  ← Actor has Component（组件为 Actor 提供额外功能）
```

组件（Component）就是**设计成被 Actor 拥有的子对象**，给 Actor 加功能（渲染、碰撞、移动等）。

> 注意区分：**关卡里的 Actor** 是"子对象"式的嵌套拥有关系；而**资产**（网格、贴图、声音文件等）也是打包在 Package 里的，但它们一般**不称为子对象**，是另一种组织概念。

---

## 小结

- 子类继承父类成员，虚函数 + 重写实现**多态**：**调用哪个版本由"对象真实类型"决定，不由指针类型决定**；
- 父指针能指向子对象，但要调用子类**独有**函数必须**向下转换**，运行时转换要用 `dynamic_cast` 并**判空**；
- UE 主线类链：`UObject → AActor → APawn → ACharacter`，`U` 前缀 vs `A` 前缀；
- **is-a（继承）**与**has-a（拥有）**是两种不同关系，UE 用"Package 拥有 World/Level，Level 拥有 Actor，Actor 拥有 Component"来组织游戏内容。

下一集（36）会讲 Unreal 的**反射（Reflection）与垃圾回收（Garbage Collection）**——理解了本集的类层次，再去看 UObject 的这两大机制会顺很多。
