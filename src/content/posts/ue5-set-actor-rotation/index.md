---
title: UE5 C++ SetActorRotation：用 FRotator 设定 Actor 的朝向
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 48 集整理：蓝图 Set Actor Rotation 的 Rotator 输入与 Teleport Physics 含义，以及 C++ SetActorRotation 的 FRotator/FQuat 两个重载与 ETeleportType 参数。
image: ""
tags: [UE5, C++, SetActorRotation, FRotator, Actor, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 48 集「SetActorRotation」整理，UP 主：**黑子的游戏空间**。与上一集 `SetActorLocation` 对称：一个是"设定位置"，一个是"设定旋转"。

---

## 本集要解决的问题

上一集把 Actor 的位置**设置**到某个坐标；本集做旋转的对称操作：把 Actor 的**朝向**设置为指定的旋转值——蓝图与 C++ 各演示一遍。

---

## 一、蓝图：Set Actor Rotation 节点

`BeginPlay` 里拖出 **Set Actor Rotation**，输入是 **Rotator（旋转器）**。

### 1.1 Rotator 的三个分量

Rotator 和向量一样有三个分量，在蓝图中把输入展开后看到的是：

| 分量 | 含义 |
| --- | --- |
| X | **Roll（翻滚）**——绕前进轴转 |
| Y | **Pitch（俯仰）**——抬头/低头 |
| Z | **Yaw（偏航）**——水平转向 |

> 注意：这是**蓝图面板里 Rotator 结构的分量显示顺序**（Roll(X)、Pitch(Y)、Yaw(Z)），而 C++ 里 `FRotator` 构造参数顺序是 **(Pitch, Yaw, Roll)**，两边别记混。

### 1.2 演示：Yaw = 90°

把旋转设为 `(0, 0, 90)`——即 Roll=0、Pitch=0、**Yaw=90°**，播放后 Actor **绕 Z 轴转了 90°**；改成 `-90` 则往反方向转，非常直观。

### 1.3 Teleport Physics（传送物理）

节点上有 **Teleport Physics** 选项（布尔，默认不勾选）：

- **勾选（true）**：相当于"传送"旋转，**物理速度保持不变**——身上用物理模拟的柔软部分（链子、马尾辫、绳索、ragdoll 布娃娃等）不会因为这次旋转而被甩动；
- **不勾选（false）**：物理速度会**根据位置/旋转变化而更新**，柔软部分会跟着晃来晃去。

> 一句话：想让角色身上物理挂件"安静地瞬移"就开 Teleport；想让它自然受带动就关掉。本集蓝图里默认不勾选。

---

## 二、C++：SetActorRotation

删除蓝图节点，回到 C++。调用方式和 `SetActorLocation` 一样简单：

```cpp
SetActorRotation(FRotator(0.f, 45.f, 0.f));   // Pitch=0, Yaw=45°, Roll=0
```

### 2.1 函数重载

工具提示显示 SetActorRotation 有两个重载：

- 一个接收 **`FQuat`**（四元数，本集还没学，先跳过）；
- 一个接收 **`FRotator`**（本集用的就是它）。

### 2.2 FRotator 的三参构造函数

`FRotator` 有一个接受三个值的构造函数重载，顺序是 **(Pitch, Yaw, Roll)**（注意与蓝图 X/Y/Z 的 Roll/Pitch/Yaw 对应关系不同）：

```cpp
FRotator(0.f, 45.f, 0.f)
//       ^Pitch  ^Yaw   ^Roll
```

示例 `FRotator(0.f, 45.f, 0.f)` 让 Actor **沿 Z 轴旋转 45°**（俯视视角下朝一个方向转，负值则反向）。

### 2.3 可选的 ETeleportType 参数

C++ 版除了旋转值，还可以带一个 **`ETeleportType`** 枚举参数（蓝图里对应那个 Teleport 选项，勾选框就是它）：

```cpp
SetActorRotation(NewRotation, ETeleportType::TeleportPhysics);   // 对应蓝图勾选 Teleport
```

> `ETeleportType` 是枚举类型，本集先知道"有这么个参数、后面课程会正式学枚举"即可。

---

## 小结

本集收获：

- **蓝图 Set Actor Rotation**：输入 Rotator；面板展开是 X=Roll / Y=Pitch / Z=Yaw；(0,0,90) → Yaw 90° 绕 Z 转；
- **Teleport Physics**：true = 保持物理速度、柔软挂件不被甩动；false = 按变化更新物理、挂件会晃；
- **C++ `SetActorRotation`**：两个重载（`FQuat` / `FRotator`），配 `FRotator(Pitch, Yaw, Roll)` 三参构造，可选 `ETeleportType`；
- 与 `SetActorLocation`（第 47 集）是一对：**绝对设置位置 / 绝对设置旋转**。

下一步：第 49 集「Actor World Offset」——从"设置"转向"叠加偏移"，并引出 DeltaTime 做帧率无关的持续运动（已有对应文章：[UE5 C++ Actor 世界偏移与 DeltaTime](/posts/ue5-actor-world-offset/)）。
