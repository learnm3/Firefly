---
title: 字符串 String：把字符连成一串的常用方法
published: 2026-09-06T10:00:00+08:00
type: note
branch: csharp
topic: 字符串
description: 字符串不可变，方法大多返回"新结果"而非修改原串。整理常用方法按返回值归类的方法。
tags:
  - C#
  - 字符串
relatedPosts:
  - csharp-string
---

> 摘要自博客文章 [Unity C# 学习笔记(八):字符串](/posts/csharp-string/)。

## 记法：不管方法名多花哨，先问它返回什么

- 返回 `bool`：`Contains("Unity")` 是否包含某段、`StartsWith`/`EndsWith` 前缀后缀。
- 返回 `int`：`IndexOf("Unity")` 首次出现位置（从 0 数）、`Length` 长度。
- 返回 `string`：`Trim()` 去首尾空格、`ToLower()`/`ToUpper()` 转大小写、`Replace(old,new)` 替换。

## 核心认知

- **字符串是不可变的**：几乎所有方法都返回"新串"，原串不变；想保留结果必须接住返回值。
- 光看讲义没用：在 Unity 里敲一遍、故意改错看报错，才算真正理解。

## 实战场景备忘

忽略大小写、去掉首尾空格地比较玩家昵称：先 `Trim()` 再 `ToLower()` 再比较，或者用 `string.Equals(a, b, StringComparison.OrdinalIgnoreCase)`。做游戏字符串处理几乎天天见。
