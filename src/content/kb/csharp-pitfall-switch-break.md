---
title: 【坑】switch case 忘写 break / 判断端点写错
published: 2026-09-07T10:00:00+08:00
type: pitfall
branch: csharp
topic: 条件与循环
description: switch 每个分支必须 break 否则编译报错；if 范围判断端点、|| 与 && 写反，会让非法值漏进来。
tags:
  - C#
  - 判断语句
  - 编译错误
relatedPosts:
  - csharp-condition
---

## 问题现象

1. switch 里只给最后一段写 `break`，Visual Studio 直接报编译错误。
2. 判断合法范围 `1~12` 时，非法值 0、13 竟然通过了检查，没被拦下来。

## 原因分析

- C# 语法**硬性要求**每个 switch 分支（含 default）都以 `break`（或 return 等）显式收尾，不允许"贯穿"。
- 把逻辑与写成了逻辑或：合法范围是 `1~12`，非法判断应是 `month < 1 || month > 12`；写成 `month < 1 && month > 12` 永远为假，0 和 13 就溜进来了。

## 解决方法

```csharp
switch (month)
{
    case 12: case 1: case 2:
        Debug.Log("冬季");
        break;   // 每个分支都要 break
    // ...
    default:
        Debug.Log("未知");
        break;
}

// 先拦非法，再分区间：非法判断用 ||
if (month < 1 || month > 12) { /* 拦截 */ }
```

## 预防

- 写完 switch 数一遍每个 case 后面有没有 break。
- 区间判断先写"非法要拦的条件"，用 `||`；想不清就画个数轴。
- 默写时特别警惕把 `==` 写成 `=`（一个是比较、一个是赋值）。
