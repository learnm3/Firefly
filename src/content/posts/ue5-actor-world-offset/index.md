---
title: UE5 C++ Actor 世界偏移与 DeltaTime：帧率无关的移动与旋转
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 49 集整理：AddActorWorldOffset / AddActorWorldRotation 的"偏移叠加"用法，为什么"每帧加固定量"会让移动速度依赖帧率，以及如何用 Tick 的 DeltaTime 缩放出恒定速度。
image: ""
tags: [UE5, C++, Actor, DeltaTime, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 49 集「Actor World Offset」整理，UP 主：**黑子的游戏空间**。代码风格沿用课程自建项目的 `Item` 类与 Debug Macros 头文件。

---

## 本集要解决的问题

前面两集学了 `SetActorLocation` / `SetActorRotation`：把 Actor **直接设置到**某个绝对位置/朝向。这一集换一个思路：不在某个"点"上做文章，而是给 Actor **叠加一个偏移量**，并且把叠加动作放到**每一帧**执行，从而实现连续移动——随即引出游戏开发最基础也最重要的概念之一：**DeltaTime（帧时间）**。

---

## 一、AddActorWorldOffset：叠加而不是设置

蓝图节点 `AddActorWorldOffset` 的输入不叫 Location，而叫 **Delta Location**：

- 它是一个 **向量（相对偏移量）**，语义是"在当前位置上再走这么多"，**不是**一个空间中的目标坐标点；
- 函数的作用：把传入的偏移向量**加到 Actor 当前的位置上**；
- 还有 `Sweep`（扫掠：移动时检测碰撞）与 `Teleport`（传送：忽略物理）两个选项，本集保持默认即可。

### 演示：BeginPlay 里把 Z 抬高 200

给蓝图 `BP Item` 的 `BeginPlay` 加一个 `AddActorWorldOffset`，`Delta Location = (0, 0, 200)`，播放后所有 item 会在 **Z 方向被整体抬高 200 个单位**。

这里藏着一个本集强调的易混点：

> 项目里 C++ 的 `BeginPlay` 之前会把所有 item 的位置**设置回 `(0, 0, 50)`**。由于它先执行，蓝图的偏移再叠加到 `(0,0,50)` 上结果还是"看不出被抬高 200"——因为绝对设置把起点拉回去了。视频里删掉 C++ 那两行 `SetActorLocation/Rotation` 后，蓝图的 `Z + 200` 才真正可见。

**要点**：`SetActorLocation`（绝对设置）与 `AddActorWorldOffset`（相对叠加）谁后执行谁"赢"；初始化位置写在哪个 BeginPlay（C++ 还是蓝图）里，决定了最终效果，动手前要想清楚执行顺序。

---

## 二、AddActorWorldRotation：旋转也可以"叠加"

对称地，还有 `AddActorWorldRotation` 节点：输入是一个 **Rotator**（Pitch / Yaw / Roll）。

演示里把 **Pitch 改成 45°**，播放后 Actor 绕自身轴倾斜"抬头"约 45°——它同样是**在原有朝向上叠加一个相对旋转量**，而不是把朝向设成某个绝对角度。

---

## 三、要连续运动，就得每帧都调用

只在 `BeginPlay` 里调用一次，Actor 只动一下。想要**持续移动**，就要让偏移发生在**每一帧**，也就是放进 **Tick（`TickActor` / 蓝图 `Event Tick`）**。

### 调试可视化：需要一个"单帧绘制"版本

问题来了：之前课程里的调试绘制（`DrawDebugSphere` 等）都是**持久绘制**，只在 `BeginPlay` 调用一次、画完就留在场景里；放到 Tick 里每帧重复画同一批"永久线"并不合适。于是本集把调试宏改成**单帧版本**：

- 原理：`DrawDebug*` 系列在 `bPersistentLines = false` 且 **`LifeTime = -1.f`** 时，图形只显示**当前这一帧**；
- 于是把课程自定义的 Debug Macros 头文件里的宏各复制一份 `SingleFrame` 变体：

| 单帧宏 | 输入 | 用途 |
| --- | --- | --- |
| `DrawSphere_SingleFrame` | 圆心位置 | 标记 Actor 当前所在点 |
| `DrawLine_SingleFrame` | 起点、终点 | 画一段线段 |
| `DrawPoint_SingleFrame` | 位置 | 画一个点 |
| `DrawVector_SingleFrame` | 起点、终点 | 画方向向量（箭头） |

这类"只在当帧可见"的绘制非常适合放在 Tick 里调试每一帧都在变化的量。

---

## 四、每帧加固定量的陷阱：移动速度依赖帧率

把下面这行放进 `Tick`：

```cpp
AddActorWorldOffset(FVector(1.f, 0.f, 0.f));   // 每帧在世界 X 方向 +1
```

Actor 确实动起来了，而且是沿**世界 X 方向**（因为函数名带 `World`）移动，但速度取决于帧率：

- 当前机器约 **120 FPS**：每秒移动约 120 个单位（≈120 cm/s）；
- 换一台只能跑 **60 FPS** 的机器：每秒只移动约 60 个单位，**同样的代码，速度差一倍**。

视频里做了验证实验：`项目设置 → 搜索"帧率" → 勾选 Use Fixed Frame Rate`（默认固定 30 FPS）后，Actor 肉眼可见地变慢——**代码一行没改，行为却变了**。

更关键的是：游戏帧率**从来不是恒定的**。场景复杂、大量计算时（比如游戏中后期）掉帧是常态，如果移动按"每帧固定量"算，角色就会忽快忽慢。

> **结论：不要在 Tick 里直接加固定常量。** 任何"每帧变化量"都要考虑帧率。

---

## 五、解法：所有每帧增量都乘上 DeltaTime

`Tick` 函数的参数：

```cpp
void AItem::Tick(float DeltaTime)
```

`DeltaTime` 是一个**浮点数，表示自上一帧以来经过了多少秒**（单位：秒/帧）。把增量按它缩放，就能得到**与帧率无关的恒定速度**：

```cpp
// 每帧在世界 X 方向移动 50 单位/秒（这里写作厘米/秒）
AddActorWorldOffset(FVector(50.f * DeltaTime, 0.f, 0.f));
```

### 单位推演（视频里的经典讲解）

- 移动速率 `MovementRate`：`50 cm/s`（每秒 50 厘米）；
- `DeltaTime`：`s/帧`（每帧多少秒）；
- 相乘：`50 cm/s × s/帧 = 50 cm/帧`——即**每一帧该走的厘米数**；

秒在分子分母上相互抵消，剩下"每帧的厘米"。于是：

- 一帧内只走"该走的那一小段"，**一秒钟累计恰好 50 厘米**；
- 30 FPS 时每帧走 50/30 ≈ 1.67，120 FPS 时每帧走 50/120 ≈ 0.42，**每秒总量相同**。

视频验证：固定 30 FPS 与放开跑 120 FPS，两种帧率下 Actor 的视觉速度完全一致。✅

> **经验法则：凡是"每一帧要改变的量"（位移、旋转、颜色渐变、冷却计时……），都要乘以 DeltaTime，把单位换算成"每秒多少"，才能保证帧率无关。**

---

## 六、旋转速率同样处理

用同样的思路做持续旋转：

```cpp
float RotationRate = 45.f;   // 度/秒

// AddActorWorldRotation 有两个重载：FQuat 与 FRotator，这里用 FRotator
AddActorWorldRotation(FRotator(0.f, RotationRate * DeltaTime, 0.f));
```

- `FRotator(Pitch, Yaw, Roll)`：这里 Pitch / Roll 为 0，**Yaw 每帧增加 `RotationRate * DeltaTime`**，得到每秒 45° 的稳定旋转；
- 旋转速率也乘了 DeltaTime，因此同样是**帧率无关**的。

为了"看见"旋转，本集还顺手演示了前进向量可视化：每帧取 `GetActorLocation()` 作为起点，终点为 `GetActorLocation() + GetActorForwardVector() * 100.f`（把单位向量拉长 100 倍才看得清），再用 `DrawVector_SingleFrame` 画出来——Actor 旋转时，箭头方向跟着转，非常直观。

---

## 七、Tick 里的最终形态（课程版）

```cpp
void AItem::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    float MovementRate = 50.f;   // cm/s —— 每秒移动 50 厘米
    float RotationRate = 45.f;   // deg/s —— 每秒转 45°

    // 沿世界 X 方向移动；帧率无关
    AddActorWorldOffset(FVector(MovementRate * DeltaTime, 0.f, 0.f));
    // 绕自身持续旋转；帧率无关
    AddActorWorldRotation(FRotator(0.f, RotationRate * DeltaTime, 0.f));

    // 调试：画出 Actor 当前位置与朝前的向量
    DrawSphere_SingleFrame(GetActorLocation());
    DrawVector_SingleFrame(
        GetActorLocation(),
        GetActorLocation() + GetActorForwardVector() * 100.f);
}
```

> 注：本集 `MovementRate` / `RotationRate` 还是函数内的**局部变量**；后续课程（如「Exposing Variables to Blueprint」）会教怎么把它们暴露成可在编辑器里调整的 `UPROPERTY`。这里先记住"乘 DeltaTime"这一核心。

---

## 八、本集小结：两个新 API

| 函数 | 输入 | 语义 | 与绝对设置的区别 |
| --- | --- | --- | --- |
| `AddActorWorldOffset` | `Delta Location`（FVector） | 在**世界空间**沿轴叠加一段位移 | 相对当前位移动，不是设置目标点 |
| `AddActorWorldRotation` | `Delta Rotation`（FRotator / FQuat） | 叠加一段旋转量 | 相对当前朝向转，不是设置绝对朝向 |
| （对比）`SetActorLocation` / `SetActorRotation` | 绝对位置/朝向 | 直接放到某处 | 会覆盖之前的叠加结果 |

### 易错点速查

- **Delta 不是坐标**：`AddActorWorldOffset` 的输入是"走多少"，不是"去哪"；
- **每帧固定增量 = 帧率依赖 Bug**：一律改写成 `速率 × DeltaTime`；
- **DeltaTime 单位是秒**：速度习惯写成"单位/秒"再乘，不要写成"单位/帧"；
- **`World` 后缀 = 沿世界轴**：想让 Actor 沿**自身朝向**移动/旋转，用的是 `AddActorLocalOffset` / `AddActorLocalRotation`（后续课程展开）；
- **旋转每个分量分别乘 DeltaTime**：只转 Yaw 就只让 Yaw 乘，别整个 Rotator 一锅炖。

---

## 附：本集在课程中的位置

- 前两集（47–48）：`SetActorLocation` / `SetActorRotation` —— 学会"绝对设置"；
- 本集（49）：`AddActorWorldOffset` / `AddActorWorldRotation` + DeltaTime —— 学会"相对叠加 + 帧率无关的持续运动"；
- 下一集（50）：Trig Functions（三角函数）——把"每帧的速度"表达成关于时间的函数（如 `Sin`），配合 DeltaTime 就能做出来回摆动、圆周运动等更生动的动作。

理解 DeltaTime 是本集最重要的收获：**它是 UE 里所有持续行为（移动、动画推进、计时、渐变）的基石。**
