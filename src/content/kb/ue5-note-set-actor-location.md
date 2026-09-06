---
title: UE5 SetActorLocation：把 Actor 放到指定坐标
published: 2026-09-06
type: note
branch: ue
topic: Actor 变换
description: SetActorLocation 速记：蓝图节点与 C++ FVector 用法、bSweep/Teleport 参数含义、"先设置位置再画调试形状"的时机顺序。
tags:
  - UE5
  - C++
  - Actor
relatedPosts:
  - ue5-set-actor-location
relatedKb: []
draft: false
---

> 完整文章见 [UE5 SetActorLocation：把 Actor 放到指定位置（蓝图与 C++）](/posts/ue5-set-actor-location/)。

## 一句话理解

`SetActorLocation` 把 Actor **绝对设置**到某个世界坐标（区别于之后学的"相对偏移"），蓝图与 C++ 都能用，是控制对象位置的第一块基石。

## 蓝图版

`Event BeginPlay → Set Actor Location`：

- `Target`：默认 `self`；
- `New Location`：填 X/Y/Z 或连入向量。例：`(0, 0, 200)` 把 Actor 移到该点。

## C++ 版

```cpp
void AItem::BeginPlay()
{
    Super::BeginPlay();

    // 先设位置，再画调试形状 —— 形状会出现在新位置
    SetActorLocation(FVector(0.f, 0.f, 50.f));
    DrawSphere(GetActorLocation());
    DrawVector(GetActorLocation(),
               GetActorLocation() + GetActorForwardVector() * 100.f);
}
```

- 位置可以是 FVector 构造函数临时值或局部变量；
- 目标位置 == 当前位置时"看起来没动"是正常的。

## 与扫掠相关的可选参数（有默认值）

| 参数 | 作用 |
| --- | --- |
| `bSweep` | 移动时做扫掠检测，避免穿透/卡进其它物体 |
| `Out Sweep Hit Result` | 输出命中信息（扫掠时才有意义） |
| `Teleport Type` | 传送方式 |

## 我的用法准则

"把 Actor 放到某个确切坐标"用 `SetActorLocation`；调试形状要在移动之后画，先 `SetActorLocation` 再 `Draw*`，避免在旧位置误导自己。
