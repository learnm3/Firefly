---
title: 【坑】除数为 0 / 整数除法丢精度
published: 2026-09-12T10:00:00+08:00
type: pitfall
branch: csharp
topic: 运算符
description: 变量作除数时先确认不为 0；两个 int 相除结果是 int，想要小数得先转 float/double。
tags:
  - C#
  - 运算符
relatedPosts:
  - csharp-operator
---

## 问题现象

1. 除数用变量，运行到那行 Unity 控制台立刻报错（除数为 0）。
2. 想算"平均分/进度百分比"，结果却一直是 0，没有小数。

## 原因分析

- C# 整数除法会**截断小数**：`3 / 2 == 1` 而不是 `1.5`。只有当操作数里有浮点类型时才会做浮点除法。
- 除数为 0 在整数运算里直接抛运行时异常（`DivideByZeroException`），不会静默。

## 解决方法

```csharp
// 百分比：至少一边转成 float/double
float hp = 30, maxHp = 100;
float pct = hp / maxHp;                 // 0.3
Debug.Log($"{pct * 100:F1}%");

// 除数为变量时先判 0
int divisor = GetSomeValue();
if (divisor != 0)
{
    int result = total / divisor;
}
```

## 预防

- 想拿小数结果 → 让至少一个操作数是浮点（字面量加 `f`/`.0` 或强转）。
- 凡是用变量做除数，写之前先确认它不可能为 0。
