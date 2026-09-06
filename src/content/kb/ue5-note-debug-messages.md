---
title: UE5 屏幕调试消息：Print String 的 Key 与 AddOnScreenDebugMessage
published: 2026-09-06
type: note
branch: ue
topic: 调试输出
description: 屏幕调试消息速记：蓝图 Print String / Log String 的区别、Key 的替换-堆叠机制、C++ 里 GEngine->AddOnScreenDebugMessage 的签名与判空写法。
tags:
  - UE5
  - C++
  - 调试
relatedPosts:
  - ue5-debug-messages
relatedKb: []
draft: false
---

> 完整文章见 [UE5 屏幕调试消息：Print String 的 Key 机制与 C++ 的 AddOnScreenDebugMessage](/posts/ue5-debug-messages/)。

## 一句话理解

- **输出日志**：藏在日志窗口里的文字，适合"事后查"；
- **屏幕消息**：直接打在屏幕左上角，适合"边跑边看"；
- **Actor 必须存在于世界中**，它的代码（含打印）才会执行——没输出先查关卡里有没有这个 Actor。

## 蓝图两个节点

| 节点 | 去哪 |
| --- | --- |
| `Print String` | 屏幕（同时写进输出日志） |
| `Log String` | 只写输出日志（灰色文本） |

## Key：替换还是堆叠

- 同一条 `Key` → **新消息替换旧消息**；
- 不同/空 Key → 各自堆叠显示（新在上，`Newer on Top`）。

典型用法：Event Tick 每帧打印一个值时**设固定 Key**（如 1），否则每帧刷屏堆满屏幕。

## C++：AddOnScreenDebugMessage

```cpp
if (GEngine)   // GEngine 是 UEngine* 全局指针，可能为空，先判空
{
    GEngine->AddOnScreenDebugMessage(
        1,                 // Key：同 Key 替换旧消息
        60.f,              // TimeToDisplay：显示 60 秒（用 .f 浮点字面量）
        FColor::Cyan,      // 显示颜色（FColor 静态成员，:: 作用域访问）
        FString("Item On Screen Message!")  // FString 构造函数接收字面量
    );
    // 其余参数（如 bNewerOnTop）有默认值，可省略
}
```

要点：颜色用 `FColor::` 静态成员、文本用 `FString("...")` 构造、时长写 `60.f`；使用 `GEngine` 前先 `if (GEngine)`。

## 我的用法准则

每帧观察一个数值（速度/距离/计时）→ 屏幕消息 + 固定 Key；需要历史记录 → UE_LOG / 输出日志。屏幕消息只留给"当下最关心的那一行"。
