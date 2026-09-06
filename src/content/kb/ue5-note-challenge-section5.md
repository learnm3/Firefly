---
title: UE5 第 5 节挑战：给调试球宏加颜色参数
published: 2026-09-06
type: note
branch: ue
topic: 课程挑战
description: "第 5 节收尾练习：自建带 Color 输入参数的调试球体宏；可选扩展 DrawDebugCircle/Box/Capsule 等形状；把成果与其它同学方案对比。"
tags: [UE5, C++, 宏, 调试, 练习]
relatedPosts:
  - ue5-challenge-section5
relatedKb:
  - ue5-note-draw-debug-lines
  - ue5-note-draw-debug-points
draft: false
---

> 完整文章见 [UE5 C++ 第 5 节挑战：给调试宏加"颜色参数"并探索更多调试形状](/posts/ue5-challenge-section5/)。

## 一句话理解

把前面封装的"写死颜色"的调试宏，升级成**带 `Color` 输入参数**的版本，并顺带探索其它调试形状——练的是"宏参数化 + 查函数签名"的能力。

## 挑战目标

1. **必做**：创建带颜色参数（额外输入 `Color`）的调试球体宏：

```cpp
#define DRAW_SPHERE_COLOR(Location, Color) \
    if (GetWorld()) \
        DrawDebugSphere(GetWorld(), Location, 25.f, 12, Color, false, -1.f);
```

2. **可选加分**：用同样模式为 `DrawDebugCircle` / `DrawDebugBox` / `DrawDebugCapsule` 写宏；
3. 把代码发到课程 Discord 展示，并对照其它同学的方案找差异。

## 自查要点

- 宏参数展开后要落到函数签名的**正确形参位**上（`Color` 接 `Color`）；
- 不会时查 `DrawDebugHelpers.h` 里对应函数的完整签名再排参；
- 对比他人代码时重点看：颜色/生命周期是否可配、是否判空 `GetWorld()`、命名习惯。
