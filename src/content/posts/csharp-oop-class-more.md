---
title: Unity C# 学习笔记(十七):类的更多知识
published: 2026-09-03T07:30:00+08:00
description: C# 类的进阶形态:静态类、抽象类、密封类、泛型类与方法四种特殊写法,各自用途与"不能 new、漏实现、类型要显式指定"等坑。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/PHuYhaz8
---

这节 C#/Unity 课像是给"类"查漏补缺。之前我们总在 new 对象、往类里塞字段和方法,我以为类只有那一种写法;直到 TOM 老师把静态类、抽象类、密封类、泛型类四种"特殊形态"摆出来,我才发现类原来还能变形。课后我把每种写法都敲了一遍,下面是理解笔记,也记几个容易踩的坑。

## 静态类:不需要"new"的工具箱

第一个让我意外的是静态类。普通类要先 new 出对象才能用,静态类恰恰相反:它不能被实例化,成员也必须是静态的,用的时候直接拿类名点。讲义里的 MathUtils 把加法、平方这类计算收进工具类,就是这个思路。我偷偷试过 new MathUtils(),被编译器拦下,才彻底记住静态类没有"对象",静态方法里也就只能使用静态成员。

```csharp
// 静态类:像工具箱,不需要也不允许 new
public static class MathUtils
{
    public static double Pi = 3.1415926;   // 静态字段

    public static double Add(double a, double b)  // 静态方法
    {
        return a + b;
    }
}

public class Display : MonoBehaviour
{
    void Start()
    {
        // 不 new,直接用"类名.成员"调用
        double sum = MathUtils.Add(3.5, 2.5);
        Debug.Log("sum = " + sum);
    }
}
```

## 抽象类:把"实现"留给子类补全

抽象类同样不能 new,原因却相反:它不是不要对象,而是故意不把实现写完。TOM 用图形举例,我一下就懂了:Shape 规定"图形都有面积、能被画出来",但面积怎么算、怎么画,只有圆、矩形这些具体子类知道,父类不该写死。所以抽象类里可以有 abstract 修饰的抽象属性和抽象方法——只有声明、没有方法体——也可以有已经实现好的普通方法;子类用 override 把抽象成员补全后才能 new,漏掉一个就只能是抽象类。另外还有条硬规矩:类里只要有抽象方法,类就必须声明成 abstract。

```csharp
using System;
using UnityEngine;

// 抽象类:立规矩"要有面积、能被画",但不写具体实现
public abstract class Shape
{
    public abstract double Area { get; }   // 抽象属性:只有声明

    public abstract void Draw();           // 抽象方法:没有方法体

    public void SayHello()                 // 普通方法:已实现
    {
        Debug.Log("我是一种图形");
    }
}

// 子类把抽象成员全部 override 之后,才可以被 new
public class Circle : Shape
{
    public double Radius { get; set; }

    public override double Area
    {
        get { return Math.PI * Radius * Radius; }
    }

    public override void Draw()
    {
        Debug.Log("画一个圆");
    }
}
```

## 密封类:把"继承"这条路堵死

密封类管的是继承的"下游":给类加 sealed 表示定稿,不允许再被继承;给方法加 sealed 则不允许再被重写。我起初觉得这功能多余,细想却很实用,像立了块"到此为止"的牌子,防止别人随意改动你的类。讲义里把强行派生、强行重写的代码注释起来演示,一放开就编译报错,没有任何商量余地。

```csharp
// 密封类:设计已经定稿,不允许再被继承
public sealed class SoundManager
{
    public void PlayBgm(string name)
    {
        Debug.Log("播放:" + name);
    }
}

// 下面这行一旦取消注释,编译立刻报错:
// public class MySound : SoundManager { }
```

## 泛型类与方法:把"类型"变成参数

泛型是我这节课最喜欢的部分。以前两个功能只是数据类型不同,我只能复制粘贴两份代码;泛型允许我写类或方法时先用 T 占位,等 new 或调用时再把真实类型告诉编译器。`Box<int>` 里的 T 就是 int,存进去、取出来都是 int,不用强转;想装字符串,再 new 一个 `Box<string>` 就行。泛型方法也类似,在方法名后加 `<V>`,调用时才指定。类型写错编译期就能抓住,这就是讲义说的"类型安全"。

```csharp
// 泛型类:尖括号里的 T 是占位符,真正类型等 new 的时候再告诉它
public class Box<T>
{
    private T content;

    public Box(T value)
    {
        content = value;
    }

    public T GetContent()
    {
        return content;
    }

    // 泛型方法:方法名后跟 <V>,调用时才指定类型
    public void Show<V>(V info)
    {
        Debug.Log(info + " | 内容:" + content);
    }
}

public class Display : MonoBehaviour
{
    void Start()
    {
        Box<int> box = new Box<int>(100);   // 此刻 T 就是 int
        int n = box.GetContent();           // 直接拿回 int,不用转换

        Box<string> strBox = new Box<string>("笔记");
        strBox.Show<string>("开箱");         // 此刻 V 就是 string
    }
}
```

## 容易踩的坑

- 静态类不能 new 也不能被继承,new MathUtils() 会直接编译报错。
- 抽象类也不能 new;子类漏实现一个抽象成员,子类照样不能 new,只能继续当抽象类。
- 类里有抽象方法,类就必须加 abstract,抽象方法还不许写方法体。
- 静态方法里只能用静态成员,想访问实例字段会报错。
- 泛型要显式给出类型:new 用 `Box<int>`,调泛型方法用 `Show<string>`,编译器才替换。

## 小结与我的思考

复习完整节,我把四种形态放在一起看,发现它们回答的是"类该怎么被用":static 是不靠对象也能用,abstract 是等子类把约定实现完才能用,sealed 是不许再向下扩展,泛型是让类型晚点再定。abstract 和 sealed 正好站在继承的两端,一个逼着子类实现,一个禁止子类继承,这个对比我印象很深。以前我以为类就是图纸,现在明白图纸也分好几种:静态类像贴在墙上的说明书,抽象类像等人画完的草图,密封类是定稿的设计图,泛型类是能套不同尺寸的模具。TOM 老师说入门阶段先认得这些关键字、看得懂别人代码里的它们就算过关,至于什么时候该用哪种,留到以后写项目再慢慢体会。
