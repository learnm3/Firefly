---
title: C# 变量与常量：给数据起名与"焊死"不变的值
published: 2026-09-04T10:00:00+08:00
type: note
branch: csharp
topic: 变量与常量
description: 变量是可变的"名字"，常量是声明即初始化、之后不可改的"焊死值"。整理变量/常量的声明、命名习惯与对比表。
tags:
  - C#
  - 变量
  - 常量
relatedPosts:
  - csharp-variable
  - csharp-constant
---

> 摘要自博客文章 [Unity C# 学习笔记(二):变量](/posts/csharp-variable/) 与 [(三):常量](/posts/csharp-constant/)。

## 一句话理解

- **变量**：给一块会变的数据起个名字，先声明后赋值，可反复改。
- **常量**：用 `const` 焊死"从头到尾都不该变的值"，声明**同时必须初始化**，运行期不能再改。

## 变量速记

新手最常用四个类型：`int`、`float`、`string`、`bool`，用"玩家数据"串起来在 Unity 里 `Debug.Log` 验证最直观。

## 常量速记

```csharp
public class GameConfig
{
    public const int MAX_PLAYER_COUNT = 4;       // 全大写 + 下划线
    public const double PI = 3.14159;
    public const string GAME_VERSION = "0.1.0";
}
```

- 命名习惯全大写、下划线分词（`MAX_PLAYER_COUNT`），与驼峰变量一眼区分。
- 常量默认静态，必须**通过类名访问**，不能走实例。
- 只有**编译期可确定**的值才能当常量：基本类型 / string / 枚举可以；`DateTime.Now`、`List` 等运行时值不行。

## 对比表

| 对比项 | 变量 | 常量 |
| --- | --- | --- |
| 可否修改 | 声明后可反复赋值 | 定义后运行期不能改 |
| 何时赋值 | 可先声明后赋值 | 声明同时必须初始化 |
| 命名 | 驼峰 `maxCount` | 全大写 `MAX_COUNT` |
| 访问 | 变量名 | 默认静态，类名访问 |

## 我的用法准则

动手前先问一句"这个值会不会变"：不会变（版本号、人数上限、π）就交给常量，会变才用变量。
