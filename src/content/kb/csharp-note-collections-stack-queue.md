---
title: 常用集合速记:Dictionary / Stack / Queue 与遍历陷阱
published: 2026-09-03T18:20:00+08:00
type: note
branch: csharp
topic: 集合与查找
description: Dictionary 键值对与"值可以是任意复杂类型",Stack/Queue 的 Push/Pop、Enqueue/Dequeue,以及"遍历集合时不要修改自身"的陷阱。
tags:
  - C#
  - Dictionary
  - Stack
  - Queue
relatedPosts:
  - csharp-ds-02-list
  - csharp-ds-03-stack
  - csharp-ds-04-queue
  - csharp-ds-05-dictionary
---

## Dictionary：按 key 查找的字典

- 结构 `Dictionary<TKey, TValue>`：一种 key 类型 + 一种 value 类型。
- **value 可以是任意类型**：类、`List`、元组、甚至另一个 `Dictionary`——所以理论上可以表达无限复杂的数据结构。
- 典型场景：`Dictionary<int, PlayerData>`，用玩家 ID 秒查对应对象。
- 坑：key 不能重复；不确定 key 存在时先 `TryGetValue`（见 [Dictionary 查表实战](/kb/unity-practice-dictionary-lookup/)）。

## Stack：后进先出（LIFO）

- 压入 `Push`，弹出 `Pop`。
- 经典用途：**反转字符串**——遍历字符串逐个 `Push`，再全部 `Pop`，出来的顺序就是反的。

## Queue：先进先出（FIFO）

- 入队 `Enqueue`，出队 `Dequeue`。
- 适合"排队干活"：先到的先处理，天然保证顺序（Unity 里做指令/消息队列）。

## ⚠️ 遍历陷阱

- `foreach` 遍历数组同时往 Stack/Queue 里压是**安全**的——因为遍历的是数组，修改的是另一个集合。
- **不能一边 `foreach` Stack/Queue、一边修改同一个集合**（增/删），会抛"集合已修改"异常。
- 需要边遍历边改 → 先 `ToList()` 复制一份再遍历。
