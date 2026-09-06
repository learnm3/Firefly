---
title: UE5 DrawDebugPoint 与 DRAW_VECTOR：画点看清向量两端
published: 2026-09-06
type: note
branch: ue
topic: 调试可视化
description: 调试点（DrawDebugPoint）不随距离缩放、适合标记空间点；把"线+末端点"封装成跨行宏 DRAW_VECTOR(Start, End)，一行可视化向量。
tags: [UE5, C++, DrawDebugPoint, 调试, 宏, 向量]
relatedPosts:
  - ue5-draw-debug-points
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ DrawDebugPoint 与 DRAW_VECTOR 宏](/posts/ue5-draw-debug-points/)。

## 一句话理解

球体表示"有体积的位置"，调试点表示"一个精确的点"——点**不随距离缩放**（屏幕恒定大小），适合标记向量末端等单个位置。

## 蓝图节点（Draw Debug Point）

Position（位置）、Size（大小，示例 15）、Color（示例红）、Duration（示例 60 秒）。

> 观察特性：镜头远离时点"变大"、拉近时几乎消失——点本身大小没变，只是参照物变了。调试球则正常随距离变小。

## C++ 在向量末端画点

```cpp
if (GetWorld())
{
	FVector Location = GetActorLocation();
	FVector ForwardEnd = Location + GetActorForwardVector() * 100.f;
	DrawDebugPoint(GetWorld(), ForwardEnd, 15.f, FColor::Red, true);
	// (世界, 位置, 大小, 颜色, bPersistentLines=true 无限期)
}
```

## 跨行宏：线 + 点 = 向量

```cpp
// DRAW_POINT：只画一个点
#define DRAW_POINT(Location) \
	if (GetWorld()) \
	{ \
		DrawDebugPoint(GetWorld(), Location, 15.f, FColor::Red, true); \
	}

// DRAW_VECTOR：画线并在末端画点（跨行宏）
#define DRAW_VECTOR(Start, End) \
	if (GetWorld()) \
	{ \
		DrawDebugLine(GetWorld(), Start, End, FColor::Red, true); \
		DrawDebugPoint(GetWorld(), End, 15.f, FColor::Red, true); \
	}
```

调用：

```cpp
DRAW_SPHERE(Location);
DRAW_VECTOR(Location, Location + GetActorForwardVector() * 100.f);
```

## 跨行宏语法

- 行尾**反斜杠 `\`** = "定义没完，接下一行"；
- 多条语句用**花括号**包住再续行；
- 宏进公共头文件（`Slash.h`）后全项目可用。

## 避坑

改完宏后热重载即可验证；正式编译请先关编辑器再在 VS 按 **Ctrl+B** 编译模块。
