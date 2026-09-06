---
title: UE5 C++ 绘制调试线：用 DrawDebugLine 可视化前向向量
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 43 集整理：蓝图与 C++ 中绘制调试线的方法——以 Actor 位置为起点、位置加前向向量为终点，向量放大技巧，DrawDebugLine 参数，以及封装 DRAW_LINE 宏。
image: ""
tags: [UE5, C++, DrawDebugLine, GetActorForwardVector, 调试, 宏, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 43 集「Drawing Debug Lines」整理，UP 主：**黑子的游戏空间**。代码风格沿用课程自建项目的 `Item` 类与调试宏头文件（本集字幕所称主头文件 `Slash.h`）。

---

## 本集要解决的问题

上一集用调试球体"点亮"了空间中的**点**；这一集换成**调试线**，用来可视化**方向**——最典型的用途：把 Actor 的**前向向量（Forward Vector）**画出来，一眼看清这个 Actor 正朝向哪里。蓝图先演示原理，再落到 C++，最后封装成宏。

---

## 一、蓝图版：Draw Debug Line

在 `BP Item` 的 `Event BeginPlay`（或 Event Tick）中搜索 **Draw Debug Line** 节点：

- 它需要**线的起点（Line Start）**和**线的终点（Line End）**——就像向量由"起点 + 终点"定义；
- **起点** = `Get Actor Location`；
- **终点** = `Location + Get Actor Forward Vector`（两个向量相加，节点做的是**分量加法**：X+X、Y+Y、Z+Z）。

### 为什么终点要"位置 + 前向向量"？

回忆向量部分的内容：

- Actor 的位置本质是"从原点指向 Actor 的向量"；
- **前向向量是归一化向量（长度为 1）**，只描述方向、不包含位置信息；
- 向量相加的几何意义：`起点向量 + 方向向量 = 从原点到新尖端的向量`。所以"位置 + 前向向量"得到的就是**Actor 前方 1 个单位处**的那个点。

于是这条线 = 从 Actor 所在点出发、朝前向伸出一小段。

### 线太短了：只有 1 厘米

播放后会发现这条线**几乎看不见**——因为 UE 默认单位是**厘米**，前向向量长度是 1，这条线实际只有 **1 厘米长**。

解决办法：把前向向量**放大**，例如每个分量都乘以 100：

```text
前向向量 × 100  →  长度 100 单位 = 100 厘米 ≈ 1 米
```

在蓝图里从 `Get Actor Forward Vector` 拉出 `*`（乘法）节点，把 X、Y、Z 都乘以 `100`，再把结果接回加法节点。此时线的终点变成 `位置 + 前向向量 × 100`，一条 1 米长的方向线清晰可见。

### 顺带设置的参数

- **颜色**：`Color` 输入设为红色（Red 分量给 1）；
- **Duration（持续时间）**：示例设为 60 秒；
- **Thickness（线宽）**：示例设为 0（很细）。

---

## 二、C++ 版：DrawDebugLine

删掉蓝图节点，回到 Visual Studio 的 `Item.cpp`（本课项目已包含 `DrawDebugHelpers` 头文件）：

1. 清理前面课程留下的大量测试代码，避免输出日志被刷屏；
2. 在 `BeginPlay` 里**保留 `GetWorld()` 并判空**——`DrawDebugLine` 在 C++ 中需要显式传入 `UWorld*`（蓝图节点自动有 World Context，所以不需要）；
3. 把 `FVector Location = GetActorLocation();` 的声明**提前**到使用它的代码之前（C++ 从上到下执行）；
4. 终点复用蓝图同样的逻辑：

```cpp
FVector Forward = GetActorForwardVector();            // 归一化，长度 1
FVector LineEnd  = Location + Forward * 100.f;         // 放大 100 再偏移
```

> 小知识点：`FVector` 类型**重载了 `+` 与 `*` 运算符**，所以 `Location + Forward * 100.f` 直接可用；同时很多函数（如 `GetActorForwardVector`）在**蓝图和 C++ 中同名**，方便对照——当然并非总是如此。

5. 调用绘制：

```cpp
DrawDebugLine(
    GetWorld(),   // 必需：World 指针
    Location,     // 线起点
    LineEnd,      // 线终点
    FColor::Red,  // 颜色
    true,         // bPersistentLines：持久线（永不消失）
    -1.f,         // LifeTime：持久线时该值无意义，默认 -1
    0,            // DepthPriority：uint8；值越低越画在最上层
    1.f           // Thickness：线宽 1
);
```

播放即可看到从 Actor 位置朝前向伸出的**红色粗线**——和蓝图结果一致。

> 参数细节（本课明确讲到）：
> - `bPersistentLines = true` 时线会持续整个游戏运行期，此时给 LifeTime 填 30/60 秒都没有意义，填 `-1.f` 即可；
> - **DepthPriority（深度优先级）**类型是 `uint8`（8 位无符号整数），传 `0` 表示优先级最高、线会绘制在其他几何之上。

---

## 三、封装成宏：DRAW_LINE

逐参数写 `DrawDebugLine` 很啰嗦（和上一集 `DrawDebugSphere` 一样）。于是回到项目的主头文件（字幕中称 `Slash.h`，本课课程把它当作公共调试宏头文件使用），定义一个新的宏：

```cpp
#define DRAW_LINE(Start, End)                                    \
    if (GetWorld())                                              \
    {                                                            \
        DrawDebugLine(GetWorld(), Start, End,                    \
            FColor::Red, true, -1.f, 0, 1.f);                    \
    }
```

要点：

- 宏名叫 `DRAW_LINE`，需要**两个输入：起始位置、结束位置**；
- 开头做 `GetWorld()` **空指针检查**（与球体宏一致），避免无效 World；
- 宏内部把颜色固定为红色、持久线、厚度 1——"一条不需要生命周期管理的粗红线"；
- 若想以后换颜色，正是第 5 节挑战让你做的事（把颜色变成参数）。

`Item.cpp` 里原来的裸调用就可以替换成宏，代码立刻变得干净、易维护：

```cpp
DRAW_SPHERE(Location);                    // 上一集的球体宏
DRAW_LINE(Location, Location + Forward * 100.f);   // 本集线条宏
```

（调用处先按代码顺序把 `Forward` 变量移到使用位置附近，再删除旧的裸代码。）

---

## 小结与下一步

本集收获：

- **调试线 = 可视化向量方向**：起点 + 单位向量 × 放大倍数，是画"朝向"的标准套路；
- `DrawDebugLine` 的完整参数含义（World / 起终点 / 颜色 / 持久 / LifeTime / 深度优先级 / 厚度）；
- 用宏包装繁琐调用，让 C++ 调试代码更整洁（这也是**用 C++ 而不是蓝图的好处**之一）。

下一步就是动手练习：把球体宏升级成"带颜色参数"，并试试为其它调试形状（圆、方形、胶囊……）也写宏——对应第 5 节挑战（046 集）。
