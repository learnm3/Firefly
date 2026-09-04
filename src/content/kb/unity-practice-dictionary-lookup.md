---
title: Dictionary 实战：用键值对做配置查表
published: 2026-09-10T10:00:00+08:00
type: practice
branch: unity
topic: 集合与查找
description: 用 Dictionary<TKey,TValue> 管理"按键找值"的场景：敌人名→血量、商品→价格，查找 O(1)。
tags:
  - C#
  - Dictionary
  - 查表
relatedPosts:
  - csharp-ds-05-dictionary
---

> 背景：来自博客文章 [Unity C# 学习笔记(十三):字典](/posts/csharp-ds-05-dictionary/) 的课后验证代码提炼。

## 何时用

"根据某个 key 快速取到对应值"且 key 不重复：商品价格、字符统计、角色属性表、排行榜名次→奖励。查找接近 O(1)。

## 最小模板

```csharp
using UnityEngine;
using System.Collections.Generic;

public class PriceTable : MonoBehaviour
{
    void Start()
    {
        // 声明 + 添加
        var prices = new Dictionary<string, int>();
        prices.Add("sword", 100);
        prices["shield"] = 150;          // 或直接索引赋值

        // 取值（KeyNotFoundException 风险 → 先 TryGetValue）
        if (prices.TryGetValue("sword", out int p))
        {
            Debug.Log($"sword: {p}");
        }

        // 遍历
        foreach (var kv in prices)
        {
            Debug.Log($"{kv.Key} -> {kv.Value}");
        }
    }
}
```

## 踩坑要点

- **key 不能重复**，重复 Add 抛异常；不确定就先用 `ContainsKey` 或 `TryGetValue`。
- 取值前不确定 key 存在 → 用 `TryGetValue`，别裸用 `prices["xxx"]`。
- key 相等性依赖类型的 `Equals`；自定义类做 key 时注意这点（多数场景用 string/int 足够）。
