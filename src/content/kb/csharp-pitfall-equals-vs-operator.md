---
title: 【坑】Equals vs ==:string 与 Unity Vector3 的行为差异
published: 2026-09-05T09:20:00+08:00
type: pitfall
branch: csharp
topic: 面向对象
description: string 的 == 与 Equals 都比内容;Unity Vector3 的 == 带容差而 Equals 精确;重写 Equals 必须同步重写 GetHashCode。
tags:
  - C#
  - Equals
  - 哈希
relatedPosts:
  - csharp-oop-class
  - csharp-oop-struct
---

## 问题现象

1. 判断 `Vector3` 位置是否相等，有时 `==` 说相等、`Equals` 说不相等，搞不清哪个对。
2. 自定义类重写了 `Equals` 却报编译器警告 / 放进 `Dictionary` 找不到。

## 原因分析

- **`==` vs `Equals` 语义不一定相同**：
  - `string`：两者都按**内容**比较（运算符被重载）。
  - Unity `Vector3`：`==` 是**带容差**的近似比较（约 1e-5，防浮点抖动）；`Equals` 是逐分量**精确**比较。
- 自定义类型：`==` 默认比引用，`Equals` 默认也比引用（struct 例外）；要按值比，两者都要重载。

## 解决方法

```csharp
// 移动/位置判断:用带容差的 == 或 Distance,别用精确 Equals
if (Vector3.Distance(a, b) < 0.1f) { /* 到达 */ }
// 或
if (a == b) { /* Unity 的 == 自带容差 */ }

// 自定义类按值比较:Equals 与 == 都要重写
public override bool Equals(object obj) { ... }
public override int GetHashCode() { ... }   // ⚠️ 必须一起重写!
public static bool operator ==(MyClass a, MyClass b) { ... }
public static bool operator !=(MyClass a, MyClass b) { ... }
```

## 预防

- **重写 `Equals` 必须同步重写 `GetHashCode`**：相等对象哈希必须一致，否则 `Dictionary`/`HashSet` 会找不到它。
- 高频代码里字符串拼接会产生垃圾（见 [LogFormat 笔记](/kb/unity-note-debug-log-logformat/)），字符串比较尽量少用临时拼接结果当 key。
- 位置判断：移动端判断"到没到"用距离阈值，别依赖精确相等。
