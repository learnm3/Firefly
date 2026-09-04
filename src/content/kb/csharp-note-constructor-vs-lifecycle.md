---
title: 构造函数 vs 成员方法 vs Awake/Start:初始化的分工
published: 2026-09-04T10:00:00+08:00
type: note
branch: csharp
topic: 面向对象
description: 构造函数 new 时只跑一次用于初始化,成员方法可反复调用;MonoBehaviour 不能用构造函数,必须交给 Awake/Start。
tags:
  - C#
  - 构造函数
  - MonoBehaviour
relatedPosts:
  - csharp-oop-class
  - csharp-hello-world
---

## 三者对比

| 入口 | 调用时机 | 次数 | 用途 |
| --- | --- | --- | --- |
| 构造函数 | `new` 创建对象时 | 每次 new 一次 | 初始化字段、建立对象初始状态 |
| 成员方法 | 代码显式调用 | 任意多次 | 平时干活 |
| `Awake` / `Start` | Unity 自动调用 | 一次（生命周期内） | **MonoBehaviour 的"构造"** |

## 构造函数要点

- 类名与类同名、无返回值。
- 只要类不是静态类，编译器会给默认无参构造函数；一旦自己写了带参构造，需要时得显式补无参构造。

## ⚠️ Unity 陷阱：MonoBehaviour 别写构造函数

- `MonoBehaviour` 是 Unity 引擎创建的，**不能 `new`**，所以写构造函数基本无效且容易误导。
- 初始化请放在 **`Awake()` / `Start()`**：
  - `Awake`：对象创建即调用（比 Start 早），适合不依赖其他对象就绪的初始化；
  - `Start`：第一次 `Update` 前调用，适合需要其他组件已就绪的初始化。
- 详见 [Unity 生命周期速记](/kb/unity-note-lifecycle-log/)。
