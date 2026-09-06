---
title: UE5 DrawDebugSphere：让"看不见的 Actor"现形
published: 2026-09-06
type: note
branch: ue
topic: 调试可视化
description: 蓝图与 C++ 中绘制调试球体的参数速记（中心/半径/分段/颜色/时长/厚度），以及用 #define 宏把一次绘制收成一行并放进公共头文件。
tags: [UE5, C++, DrawDebugSphere, 调试, 宏]
relatedPosts:
  - ue5-draw-debug-spheres
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ DrawDebugSphere：可视化"看不见的"Actor](/posts/ue5-draw-debug-spheres/)。

## 一句话理解

调试形状 = 开发期在场景里画临时图形，把"看不见的逻辑位置"变成"看得见的球/线/点"。

## 蓝图节点参数（Draw Debug Sphere）

| 输入 | 说明 |
| --- | --- |
| Center | 球心位置（Vector），不连默认画在世界原点 |
| Radius | 半径，默认 100 |
| Segments | 分段数，默认 12，越大越圆 |
| Line Color | 线条颜色（LinearColor） |
| Duration | 持续秒数，到点消失 |
| Thickness | 线条粗细 |

## C++ 调用

```cpp
#include "DrawDebugHelpers.h"

UWorld* World = GetWorld();
if (World)   // GetWorld() 在 Actor 未生成时可能返回 nullptr，先判空
{
	FVector Location = GetActorLocation();     // 蓝图 Vector == C++ FVector
	DrawDebugSphere(World, Location, 25.f, 24, FColor::Red, false, 30.f);
	//             (世界,     球心,   半径, 分段,    颜色, 持久?,    持续秒)
}
```

- 整数用 `int32`（引擎内置、保证 32 位），不要用裸 `int`；
- `bPersistentLines = true` 时球永不消失；`false` 时需给 `LifeTime`。

## 函数式宏：一行画球

```cpp
#define DRAW_SPHERE(Location) \
	if (GetWorld()) \
	{ \
		DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, true); \
	}
```

- 宏是编译期**文本替换**：调用处 `DRAW_SPHERE(Location)` 会被替换成整段代码；
- 宏要全项目复用，就把它定义在**公共头文件**（课程项目 `Slash.h`，即你的 `<项目名>.h`），需要处 `#include "Slash.h"`。

## 避坑

- 调试形状数量多了性能骤降，**不进打包版**，只是调试工具；
- Segments 越低画线越少越快，12 段"够看"即可。
