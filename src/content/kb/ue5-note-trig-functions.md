---
title: UE5 三角函数速记：单位圆、弧度与正弦波
published: 2026-09-06
type: note
branch: ue
topic: 三角函数
description: "sin=对边/斜边、cos=邻边/斜边；单位圆上 x=cosθ、y=sinθ；360°=2π 弧度；sin/cos 周期 2π、值域[-1,1]；把累计时间 t 喂给 FMath::Sin 可得平滑正弦波运动。"
tags: [UE5, C++, 三角函数, 正弦, 弧度]
relatedPosts:
  - ue5-trig-functions
relatedKb:
  - ue5-actor-world-offset
draft: false
---

> 完整文章见 [UE5 三角函数入门：sin/cos、弧度与"正弦波"运动](/posts/ue5-trig-functions/)。

## 一句话理解

`sin`/`cos` 把"角度/时间"变成 `[-1, 1]` 的周期值；把累计时间喂给它，就得到平滑往复的**正弦波**——游戏里浮动、摇摆类运动的标准做法。

## 核心公式

- 直角三角形：`sin(θ) = 对边/斜边`，`cos(θ) = 邻边/斜边`
- 单位圆（半径 1）：某点坐标 = `(cos θ, sin θ)`，即 `x = cos θ`、`y = sin θ`
- 周期 `2π`，值域 `[-1, 1]`；`sin` 与 `cos` 相差 `π/2` 相位

## 弧度速查

| 角度 | 弧度 |
| --- | --- |
| 360° | 2π |
| 180° | π |
| 90° | π/2 |
| 45° | π/4 |

引擎里的三角函数**默认用弧度**。

## 正弦波用法（UE 里）

```cpp
float t = GetWorld()->GetTimeSeconds();      // 或自己每帧累加 DeltaTime
float Offset = FMath::Sin(t);                // -1 ~ 1
// 位移量 = Offset * 幅度，加到 Z/X 上 → 上下/来回浮动
```

记忆点：**时间当角度，sin 当位移，幅度控制大小**。
