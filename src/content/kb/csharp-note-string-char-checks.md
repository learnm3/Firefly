---
title: 字符串不可变性与字符判断(char.IsDigit / 范围比较)
published: 2026-09-03T18:40:00+08:00
type: note
branch: csharp
topic: 字符串
description: string 不可变、方法返回新串;判断字符是否数字:char.IsDigit 认 Unicode,范围比较最快但仅限 ASCII;foreach 遍历字符。
tags:
  - C#
  - 字符串
relatedPosts:
  - csharp-string
---

> 与 [字符串 String 常用方法](/kb/csharp-note-string-methods/) 互补：那篇按"返回什么"记方法，这篇记不可变性与字符级判断。

## 字符串不可变性

- `Replace`、`ToUpper`/`ToLower` 等方法都**返回新字符串**，原字符串保持不变。
- 想要结果必须接住返回值：`s = s.Replace("a", "b");`。

## 判断字符是否为数字

| 写法 | 识别范围 | 速度 |
| --- | --- | --- |
| `char.IsDigit(c)` | Unicode 数字（含全角/其他语言数字） | 一般 |
| `c >= '0' && c <= '9'` | 仅 ASCII `0`-`9` | 最快 |

- 如果只处理玩家输入的普通数字，用范围比较又快又直观；需要兼容各种数字字符再用 `char.IsDigit`。

## 遍历字符串

```csharp
foreach (char c in str) { /* 逐个字符处理 */ }
```

- 配合上面两种判断 + `if / else if` 即可做"数字/字母/其他"分类。

## 实战小抄

- 遍历字符串判断：`char.IsDigit` 认数字、`char.IsUpper/IsLower` 认大小写字母。
- 组合：逐字符判断类型做输入校验或文本分类。
