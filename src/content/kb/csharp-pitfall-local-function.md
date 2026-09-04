---
title: 局部函数(Local Function):方法内的函数要"先定义后使用"
published: 2026-09-05T10:00:00+08:00
type: pitfall
branch: csharp
topic: 面向对象
description: 定义在方法内部的局部函数,作用域只在方法体内且必须先定义后使用;适合把重复小逻辑藏进方法内部。
tags:
  - C#
  - 局部函数
relatedPosts:
  - csharp-oop-class
---

## 什么是局部函数

- 定义在**方法内部**的函数，作用域限制在包含它的方法体内。
- 可以访问外层方法的局部变量（闭包），适合"只有这个方法用得到"的小逻辑。

```csharp
int CalculateDamage(int baseDmg, int armor)
{
    int Reduction(int dmg)   // 局部函数:必须先定义
    {
        return Math.Max(0, dmg - armor);
    }
    return Reduction(baseDmg);
}
```

## 坑：必须"先定义后使用"

- 局部函数和局部变量一样，**要先用 `定义` 再用**——在定义之前调用会编译报错"使用了未赋值的变量/未定义"。
- 也就是说，方法体里**别把调用写在局部函数定义之前**。

## 为什么值得用

- 小助手逻辑不用单独建成员方法/类，就近封装更清晰。
- 能捕获外层变量，避免为一段逻辑传一堆参数。
- Unity 中做递归/回调包装、LINQ 处理时很顺手。

## 注意

- 局部函数 vs lambda：局部函数无需委托包装、可递归，性能通常更好；lambda 更偏向"作为参数传入"。
- 嵌套过深会难读——一个方法里塞太多局部函数就该考虑拆方法了。
