---
title: 多态三兄弟:virtual / override / abstract
published: 2026-09-04T10:20:00+08:00
type: note
branch: csharp
topic: 面向对象
description: virtual 父类有默认实现、子类可 override;abstract 父类只声明、子类必须实现;声明为基类调用时执行子类重写版本。
tags:
  - C#
  - 多态
  - 继承
relatedPosts:
  - csharp-oop-features
  - csharp-oop-interface
---

## 三个关键字的分工

| 关键字 | 父类怎么写 | 子类 | 典型用途 |
| --- | --- | --- | --- |
| `virtual` | 有默认实现 | 可选 `override` 改写 | 提供通用行为、允许子类定制 |
| `abstract` | 只有声明 | **必须** `override` 实现 | 定义"必须有什么能力"的模板 |
| `interface` | 纯能力清单 | 必须全部实现 | 跨继承体系的"能做什么"契约 |

```csharp
public class GameCharacter
{
    public virtual void Attack() { Debug.Log("基础攻击"); }
}

public class Warrior : GameCharacter
{
    public override void Attack() { Debug.Log("重斩"); }
}

// 声明成基类、装的却是子类 → 调用时执行子类重写版
GameCharacter c = new Warrior();
c.Attack();   // 输出"重斩"
```

## 核心理解：编译看左边，运行看右边

- 变量类型是 `GameCharacter`，但它 `new` 的是 `Warrior`。
- 调用 `Attack()` 时，**实际执行的是运行时刻对象（子类）重写后的版本**。
- 好处：一段代码只依赖基类接口，就能操作各种子类（换职业不用改调用方）。

## 与抽象类的区别提醒

- `abstract` 类可以有普通字段和已实现方法，只是不允许直接 `new`。
- 类只能单继承；想"多继承能力"用接口（一个类可实现多个接口）。
