---
title: UE5 DrawDebugLine：用"线"可视化向量方向
published: 2026-09-06
type: note
branch: ue
topic: 调试可视化
description: "绘制调试线的套路：起点 = Actor 位置，终点 = 位置 + 前向向量 × 100；DrawDebugLine 需显式传 World；封装成 DRAW_LINE 宏后代码更整洁。"
tags: [UE5, C++, DrawDebugLine, 调试]
relatedPosts:
  - ue5-draw-debug-lines
relatedKb:
  - ue5-note-draw-debug-spheres
draft: false
---

> 完整文章见 [UE5 C++ 绘制调试线：用 DrawDebugLine 可视化前向向量](/posts/ue5-draw-debug-lines/)。

## 一句话理解

**点**标记位置，**线**标记方向：线起点放在 Actor 位置，终点放在"位置 + 前向向量"，放大后就能看清 Actor 朝向哪。

## 画方向线的标准套路

```cpp
FVector Location = GetActorLocation();        // 起点：Actor 当前位置
FVector Forward  = GetActorForwardVector();   // 归一化向量，长度 1
FVector LineEnd  = Location + Forward * 100.f; // 放大 100 → 约 1 米
```

- 前向向量长度是 1（单位=厘米），**直接画只有 1 厘米**，必须乘放大系数；
- `FVector` 重载了 `+`、`*`，`Location + Forward * 100.f` 可直接写；
- 位置是"原点→Actor"的向量，加方向向量得到新端点（分量加法）。

## DrawDebugLine 参数要点

```cpp
DrawDebugLine(GetWorld(), Location, LineEnd,
    FColor::Red, true /*持久*/, -1.f /*持久时无意义*/,
    0 /*深度优先级 uint8，越低越靠前*/, 1.f /*线宽*/);
```

- C++ 需要显式传 `UWorld*`（蓝图节点自动有 World Context）；
- `bPersistentLines = true` 时生命周期填 `-1.f`（填 30/60 秒无意义）。

## 宏化（DRAW_LINE）

```cpp
#define DRAW_LINE(Start, End)                        \
    if (GetWorld())                                  \
    {                                                \
        DrawDebugLine(GetWorld(), Start, End,        \
            FColor::Red, true, -1.f, 0, 1.f);        \
    }
```

先判 `GetWorld()` 空指针，颜色暂时固定红——**把颜色变成输入参数**正是第 5 节挑战（046）的练习。
