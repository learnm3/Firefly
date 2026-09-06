---
title: UE5 Actor 世界偏移与 DeltaTime：帧率无关的移动与旋转
published: 2026-09-06
type: note
branch: ue
topic: Actor 变换
description: "AddActorWorldOffset / AddActorWorldRotation 是相对当前位姿叠加偏移（Delta 输入不是目标点）；每帧叠加固定量会导致速度依赖帧率，必须用 Tick 的 DeltaTime 缩放（速率 × 秒）得到恒定速度。"
tags: [UE5, C++, Actor, DeltaTime]
relatedPosts:
  - ue5-actor-world-offset
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ Actor 世界偏移与 DeltaTime：帧率无关的移动与旋转](/posts/ue5-actor-world-offset/)。

## 一句话理解

- **偏移 ≠ 坐标**：`AddActorWorldOffset` 的输入是"相对当前位置走多少"，不是"放到哪个点"；旋转同理。
- **每帧固定增量 = 帧率依赖 Bug**：120 FPS 每秒走 120 单位、60 FPS 只走 60；一律改成 `速率 × DeltaTime`。

## 两个 API

| 函数 | 输入 | 语义 |
| --- | --- | --- |
| `AddActorWorldOffset` | `FVector`（Delta Location） | 沿**世界轴**叠加位移 |
| `AddActorWorldRotation` | `FRotator` / `FQuat` | 叠加旋转量（相对） |

对比：`SetActorLocation / SetActorRotation` 是**绝对设置**，会覆盖之前的叠加结果。

## DeltaTime 单位推演

`Tick(float DeltaTime)` 的 DeltaTime 是"距上一帧经过的秒数"：

```text
50 cm/s × 0.016s(≈60fps) ≈ 0.83 cm/帧
50 cm/s × 0.008s(≈120fps) ≈ 0.42 cm/帧
→ 每秒都累计 50 cm，与帧率无关
```

## 用法要点

```cpp
void AItem::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    AddActorWorldOffset(FVector(MovementRate * DeltaTime, 0.f, 0.f));   // cm/s
    AddActorWorldRotation(FRotator(0.f, RotationRate * DeltaTime, 0.f)); // deg/s
}
```

- 旋转的每个分量（Pitch/Yaw/Roll）分别乘 DeltaTime；
- `World` 后缀 = 沿世界轴；沿自身朝向移动要等后续的 `AddActorLocalOffset`；
- 单帧调试绘制：`bPersistentLines=false` + `LifeTime=-1.f`，适合在 Tick 里画每帧都在变的位置/向量。
