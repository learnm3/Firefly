---
title: 枚举与 [Flags] 位运算状态机
published: 2026-09-04T10:40:00+08:00
type: note
branch: csharp
topic: 枚举与位运算
description: enum 给整数起名字;Switch 按值分流;想叠加多个状态用 [Flags] + 2 的幂,配合 &、|、~ 做添加/移除/检查。
tags:
  - C#
  - 枚举
  - Flags
  - 位运算
relatedPosts:
  - csharp-enum
---

## 基础枚举

```csharp
public enum Season { Spring, Summer, Autumn, Winter }
```

- 本质是给整数起别名，默认从 0 递增，可指定值。
- 配合 `switch` 按值分流很清晰；注意给 `default` 兜底，别假设覆盖了所有分支（编译器并不强制检查全覆盖）。

## 想"同时有多个状态"→ [Flags]

布尔字段一多就散（中毒？减速？冰冻？），把状态位压进一个枚举：

```csharp
[Flags]
public enum Status
{
    None     = 0,
    Poisoned = 1 << 0,   // 0001
    Frozen   = 1 << 1,   // 0010
    Burned   = 1 << 2,   // 0100
}
```

## 三件套操作

| 操作 | 写法 |
| --- | --- |
| 添加状态 | `status \|= Status.Poisoned;` |
| 移除状态 | `status &= ~Status.Poisoned;` |
| 检查有无 | `status.HasFlag(Status.Poisoned)` 或 `(status & Status.Poisoned) != 0` |

## 坑与建议

- 值必须是 2 的幂（`1 << n`），否则位会互相覆盖；`None = 0` 表示"空"。
- `HasFlag` 有**装箱开销**，高频代码（每帧）建议用 `(status & flag) != 0`。
- Flags 命名建议复数（`Status`），一眼知道能叠加。
- 需求复杂时也可改用类 + 布尔字段，可读性优先——Flags 适合"状态少且高频判断"（如 Buff 判定）。
