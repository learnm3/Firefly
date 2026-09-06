---
title: UE5 SetActorLocation：把 Actor 放到指定位置（蓝图与 C++）
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 47 集整理：蓝图 SetActorLocation 节点、C++ 里 SetActorLocation(FVector) 的用法、Sweep/Teleport 参数的含义，以及"先设位置再画调试形状"的时机技巧。
image: ""
tags: [UE5, C++, Actor, SetActorLocation, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 47 集「SetActorLocation」整理，UP 主：**黑子的游戏空间**。代码风格沿用课程自建项目（`Item` 类与调试宏）。

---

## 本集要解决的问题

前面我们学会了用 `GetActorLocation` 读取 Actor 的位置。本集反其道而行：**把 Actor 设置到我们指定的一个世界坐标**，蓝图与 C++ 各做一遍——这是我们控制游戏对象位置的第一步。

---

## 一、蓝图版：SetActorLocation 节点

从 `Event BeginPlay` 拖出 **Set Actor Location** 节点，它有几个输入：

- **Target（目标 Actor）**：默认是 `self`，即调用这个函数的 Actor 自己；
- **New Location（新位置向量）**：可以分别填 X / Y / Z 三个分量，也可以连入一个向量值。

演示：把 `New Location` 设为 `X = 0, Y = 0, Z = 200`，播放后场景里两个 Actor 都移动到了同一个位置 **`(0, 0, 200)`**。

> 视频里由此观察到一个执行顺序现象：蓝图 `BeginPlay` 里的设置，发生在（C++ 侧）绘制调试形状（球体/线/点）之前，因此设置位置后再去画调试形状，画出来的就是新位置上的形状。
>
> 补充说明：UE 中原生 `BeginPlay` 与蓝图 `Event BeginPlay` 的先后受引擎分发时机与项目结构影响，**不要在代码里依赖这种隐式顺序**；确定"先移动后绘制"最稳妥的方式，就是在同一段代码里显式先调用 `SetActorLocation` 再去绘制（见下文 C++ 做法）。

---

## 二、C++ 版：SetActorLocation(FVector)

打开 `Item.cpp`，在绘制调试形状**之前**调用 `SetActorLocation`，让形状画在正确的新位置上：

```cpp
void AItem::BeginPlay()
{
    Super::BeginPlay();

    // 先设置 Actor 的位置
    SetActorLocation(FVector(0.f, 0.f, 50.f));

    // 再画调试形状——此时 GetActorLocation() 已经是新位置
    DrawSphere(GetActorLocation());
    DrawVector(GetActorLocation(),
               GetActorLocation() + GetActorForwardVector() * 100.f);
}
```

写法要点：

- 可以像上面这样用 **FVector 构造函数**临时构造 `FVector(0.f, 0.f, 50.f)` 作为新位置（X/Y/Z 分别指定），也可以先建一个局部 `FVector NewLocation` 变量再传入；
- 视频演示把位置设到 `(0, 0, 50)`——注意：如果目标位置恰好就是当前位置，调用后 Actor 自然"看起来没动"，这是正常的；
- 调用之后调试宏再取 `GetActorLocation()`，画出来的球/向量就在**新的位置**上（这也解释了为什么"先设置、后绘制"的顺序很重要）。

### 其余输入参数（有默认值，本集可省略）

`SetActorLocation` 还有几个与**扫掠（Sweep）**相关的参数，它们都有默认值：

| 参数 | 类型 | 作用 |
| --- | --- | --- |
| `bSweep` | bool | 是否开启**扫掠检测**：移动 Actor 时检测它是否会穿透/卡进其它物体，开启则避免与障碍物重叠 |
| `Out Sweep Hit Result` | FHitResult（引用） | 输出扫掠命中信息，仅在扫掠时有用 |
| `Teleport Type` | ETeleportType | 传送方式，与扫掠/物理行为相关 |

本集保持默认、不传这些参数；它们的细节会在课程后面章节展开。

---

## 三、验证与小结

保存 → 编辑器热加载 → 播放：Actor 出现在新位置 `(0, 0, 50)`，调试球与方向向量也画在新位置上。✅

| 用法 | 关键点 |
| --- | --- |
| 蓝图 `Set Actor Location` | `Target`（默认 self）+ `New Location` 向量 |
| C++ `SetActorLocation(FVector)` | 传入目标坐标；`bSweep` 等参数有默认值可省略 |
| 想"设完立刻在正确位置画调试" | 把 `SetActorLocation` 放在绘制调用**之前** |

**经验要点：**
- `SetActorLocation` 是**绝对设置**（放到某个坐标），与后面会学的 `AddActorWorldOffset`（相对叠加）语义不同；
- 位置相关的调试形状，记得在移动**之后**再画，否则画在旧位置会误导你。

**下一集预告**：第 48 集会学对称的 `SetActorRotation`——把 Actor 的**朝向**设置为指定的旋转（Rotator）。
