---
title: UE5 C++ DrawDebugPoint 与 DRAW_VECTOR 宏：用"点"看清向量的两端
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 44 集整理：DrawDebugPoint 调试点的大小特性（不随距离缩放）、在向量末端画点辅助观察方向，以及用跨行宏 DRAW_POINT / DRAW_VECTOR 把"线 + 点"打包。
image: ""
tags: [UE5, C++, DrawDebugPoint, 调试, 宏, 向量, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 44 集「Drawing Debug Points」整理，UP 主：**黑子的游戏空间**。代码沿用课程项目风格（上一集画了调试线，本集在线的末端加点）。

---

## 本集要解决的问题

调试线能画出向量的方向，但一条线段**看不出"终点"在哪一侧**。想要一个类似箭头尖端的视觉标记，最省事的办法是：在线的末端画一个**调试点**，用"起点线 + 末端点"的组合直观看到向量的起止。

---

## 一、蓝图：Draw Debug Point 与它的"奇怪特性"

搜索 **Draw Debug Point** 节点（就是"在空间里画一个点"）：

- **Position**：点的位置；
- **Size**：点的大小，示例用 15；
- **Color**：颜色（示例红色）；
- **Duration**：持续秒数（示例 60 秒）。

### 关键特性：点的大小不随距离缩放

播放后注意观察——**调试点始终保持同一像素大小**：

- 摄像机**远离**时，它看起来"变大"（其实是场景里其它物体在变小，点没变）；
- 摄像机**拉近**时，点几乎像消失了一样（没变大）。

> 调试球体会随距离正常缩小，而调试点是"屏幕恒定大小"。这是调试点本身的特性，不是 bug——它更适合用来**标记空间中的单个位置**，而不是表示有体积的东西。

---

## 二、C++：在向量末端画点

想画在"Actor 位置 + 朝前向量 × 100"那个点上：

```cpp
// 沿用上一集的 DRAW_LINE：先画线
// 现在在线的末端画个点，形成"向量头"
UWorld* World = GetWorld();
if (World)
{
	FVector Location = GetActorLocation();
	FVector ForwardEnd = Location + GetActorForwardVector() * 100.f;

	DrawDebugPoint(World, ForwardEnd, 15.f, FColor::Red, true);
	//            (世界,   位置,     大小,   颜色,   bPersistentLines=true)
}
```

- `bPersistentLines = true` 表示无限期显示；
- 这样"线 + 末端点"组合起来，看起来接近一个向量箭头（虽然不是真正的箭头贴图）。

---

## 三、宏化：DRAW_POINT 与跨行宏 DRAW_VECTOR

### 3.1 DRAW_POINT(Location)

把"判空世界 + 画点"收进宏（放进公共头文件 `Slash.h`）：

```cpp
#define DRAW_POINT(Location) \
	if (GetWorld()) \
	{ \
		DrawDebugPoint(GetWorld(), Location, 15.f, FColor::Red, true); \
	}
```

调用处从"取世界、判空、调函数"三件事变成一行：

```cpp
DRAW_POINT(Location + GetActorForwardVector() * 100.f);
```

### 3.2 跨行宏：DRAW_VECTOR(Start, End)

上面的做法每次要写两行（线 + 点）。干脆做一个**同时画线并在线末端画点**的宏，输入只有起点和终点：

```cpp
#define DRAW_VECTOR(Start, End) \
	if (GetWorld()) \
	{ \
		DrawDebugLine(GetWorld(), Start, End, FColor::Red, true); \
		DrawDebugPoint(GetWorld(), End, 15.f, FColor::Red, true); \
	}
```

跨行宏的语法要点：

- 行尾的 **反斜杠 `\`** 告诉预处理器"宏定义还没结束，接下一行"；
- 中间想写多条语句，就用**花括号**包起来（配合反斜杠续行）；
- 最后一个反斜杠后面补上结束的花括号。

调用处一次搞定：

```cpp
DRAW_SPHERE(Location);                                        // 上一集的宏
DRAW_VECTOR(Location, Location + GetActorForwardVector() * 100.f);
```

> 小经验：把原来分开的 `DrawDebugLine` / `DrawDebugPoint` 调用替换成 `DRAW_VECTOR` 后，行为完全一致，但代码量大幅减少。热重载验证无误后，本集用 **Ctrl+B** 在 Visual Studio 里真正编译一次模块（编译前需先关闭编辑器）。

---

## 小结

本集收获：

- **DrawDebugPoint**：画一个空间点，Size / Color / Duration；记住它**大小不随距离缩放**；
- 组合用法：**线（方向）+ 末端点（尖端）** = 可视化的向量；
- **跨行宏**：用反斜杠续行 + 花括号，把 `DRAW_LINE + DRAW_POINT` 合成一个 `DRAW_VECTOR(Start, End)`；
- 从蓝图演示 → C++ 实现 → 宏封装 → 放进公共头文件，是这套课程反复出现的套路。

下一步：把这些调试宏集中整理进自定义头文件（第 45 集「Custom Header Files」），或继续 Actor 的变换（第 47 集 SetActorLocation）。
