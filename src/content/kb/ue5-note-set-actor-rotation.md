---
title: UE5 SetActorRotation：FRotator 设定 Actor 朝向
published: 2026-09-06
type: note
branch: ue
topic: Actor 变换
description: SetActorRotation 蓝图与 C++ 速记：Rotator 分量（Roll/Pitch/Yaw）、Teleport Physics 含义、FRotator 三参构造与 ETeleportType 重载。
tags: [UE5, C++, SetActorRotation, FRotator, Actor]
relatedPosts:
  - ue5-set-actor-rotation
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ SetActorRotation：用 FRotator 设定 Actor 的朝向](/posts/ue5-set-actor-rotation/)。

## 一句话理解

`SetActorRotation` = 把 Actor 的朝向**设置**为指定的旋转值（与 `SetActorLocation` 设定位置是同一类"绝对设置"操作）。

## Rotator 分量（两套顺序别记混）

| 位置 | 蓝图面板分量 | 含义 |
| --- | --- | --- |
| X | Roll | 翻滚（绕前进轴） |
| Y | Pitch | 俯仰（抬头/低头） |
| Z | Yaw | 偏航（水平转向，绕 Z 轴） |

- 蓝图输入 `(0,0,90)` → Yaw 90°，绕 Z 转 90°；负值反向。
- C++ `FRotator(Pitch, Yaw, Roll)`：构造顺序是 Pitch→Yaw→Roll。

## 蓝图 Teleport Physics 选项

- **true（传送）**：物理速度不变，身上柔软挂件（链/马尾/绳索/ragdoll）不被甩动；
- **false（默认）**：物理按旋转变化更新，挂件会跟着晃动。

## C++ 用法

```cpp
// 两个重载：FQuat（未学）与 FRotator（本集用）
SetActorRotation(FRotator(0.f, 45.f, 0.f));   // Pitch=0, Yaw=45, Roll=0 → 绕 Z 转 45°

// 可选 ETeleportType 枚举参数（对应蓝图 Teleport 勾选框）
SetActorRotation(NewRotation, ETeleportType::TeleportPhysics);
```

## 速记

位置用 `SetActorLocation`，朝向用 `SetActorRotation`；想"相对当前再转一点"则用后续课程的 `AddActorWorldRotation`。
