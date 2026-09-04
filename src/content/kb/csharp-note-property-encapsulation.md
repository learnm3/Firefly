---
title: C# 属性(Property)与封装:用公开接口藏私有数据
published: 2026-09-16T09:10:00+08:00
type: note
branch: csharp
topic: 面向对象
description: 属性是"带访问控制的方法外壳":private 字段存数据、public 属性控制读写,set 里可加校验逻辑(如血量不为负)。
tags:
  - C#
  - 属性
  - 封装
relatedPosts:
  - csharp-oop-features
  - csharp-oop-class
---

## 为什么需要属性

裸 `public` 字段会让外部随意改数据(血量能被改成 -100)；字段全 `private` 又没法读。**属性 = 给字段套一层受控的"出入口"**。

## 基本写法

```csharp
private int hp = 100;

public int HP
{
    get { return hp; }
    set { hp = value >= 0 ? value : 0; }   // set 里加逻辑:不允许负数
}
```

- `get` / `set` 分别管"读"与"写"。
- `set` 的隐式参数叫 `value`，代表外部传入的新值——这里就是加校验的地方。

## 自动属性

只有"存取值、不需要额外逻辑"时用简写：

```csharp
public int Strength { get; private set; }   // 外部只读,内部可写
```

- 编译器自动生成背后字段。
- 常见组合：`get` 公开、`set` 私有 → 外部只能读、只能由类内部修改（很常用）。

## 与字段/方法的分工

- 字段：类内部直接存取，名字小写/`_` 开头约定。
- 属性：对外暴露的接口，本质是方法外壳，可以加逻辑、加访问控制。
- 判断口诀：**"要不要让外面读写？读和写是否都允许？读写时要不要校验/联动？"** —— 决定用字段还是属性、get/set 的访问级别。
