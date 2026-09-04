---
title: Unity C# 学习笔记(十五):类
published: 2026-09-03T09:30:00+08:00
description: C# 类学习笔记:类是模板、对象是实例,梳理类定义、new 实例化、构造函数与 public/private 访问修饰符,记录忘 new、构造名错等易错点。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/PHuYhaz8
---

这节讲"类"的课,讲师 TOM 把 3.1 的面向对象思想落到了语法上:定义一个 Student 类,再用 new 造出对象。课后我把讲义翻了两遍,又自己敲了小例子,才踏实。下面是我复习后的理解。

## 类,我这样理解

3.1 里讲过,面向过程是把问题拆成一步步执行,面向对象则是先想"这里有哪些对象"。类就是给对象画的设计图,讲义里叫"抽象模板":它规定怪物该有哪些数据(名字、血量)和哪些行为(攻击、受伤),但本身还不是一只具体的怪物。

能用的怪物是按图造出来的对象,也就是用 new 实例化出来的那个实例。同一个类能 new 出很多对象,每个对象各带一份成员变量——我改灰狼的血量,史莱姆不受影响。

## 怎么定义一个类

定义的骨架是:访问修饰符 + class + 类名,大括号里放成员;类名按规范首字母大写(PascalCase),如 Student。最常见的成员是字段和方法:字段存状态、方法做行为。我给自己写的小例子:

```csharp
public class Monster
{
    // 字段: 保存怪物的状态(成员变量)
    public string Name;
    public int Hp;

    // 方法: 定义怪物的行为
    public void ShowInfo()
    {
        Debug.Log("我是 " + Name + ", 剩余血量 " + Hp);
    }
}
```

## 实例化与使用对象

光定义类还不够,讲义强调:对象要靠 new 才创建得出来,new 执行时构造函数自动运行(一个构造函数都不写,编译器会默认补一个无参的)。拿到实例后用"对象.成员"访问字段、调用方法:

```csharp
public class GameTest : MonoBehaviour
{
    void Start()
    {
        // 同一个 Monster 模板, 造出两只互相独立的怪物
        Monster wolf = new Monster();
        wolf.Name = "灰狼";
        wolf.Hp = 100;
        wolf.ShowInfo();

        Monster slime = new Monster();
        slime.Name = "史莱姆";
        slime.Hp = 80;
        slime.ShowInfo();
    }
}
```

跑起来后 Console 打出两行不同信息:同一个类造出的 wolf 和 slime 互相独立、各改各的。讲义那句"每个对象实例独立拥有成员变量副本",我到这一刻才真正看懂。

## 构造函数与成员访问

构造函数在对象诞生的那一刻自动执行初始化,把名字、年龄这类状态一次定好。它的规矩:名字必须和类名一模一样;不能写返回值,void 也不行;参数个数、类型或顺序不同就能写多个——这正是后面要学的函数重载。我复习时写的小例子:

```csharp
public class Player
{
    private string _name;   // 私有字段, 类外部不能直接访问

    // 构造函数: new Player("张三") 时自动执行
    public Player(string name)
    {
        _name = name;
    }

    // public 属性: 用 get/set 间接读写私有字段
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }
}

// 使用处: 挂在场景物体上的脚本
public class PlayerTest : MonoBehaviour
{
    void Start()
    {
        // new 的那一刻, 构造函数自动执行, 名字直接定好
        Player zhangSan = new Player("张三");
        Debug.Log("我叫 " + zhangSan.Name);
    }
}
```

public 和 private 决定成员对外的可见范围:public 类外随便碰,private 只有类内部能用。想安全暴露私有数据,就靠属性访问器——_name 藏起来,Name 用 get/set 读写,set 里还能做校验。构造函数也能写成 private,类外就 new 不出对象,常用于单例这类设计。

## 容易踩的坑

我把讲义要点和自己的报错对照了一遍,几处容易栽的地方:

- 忘了 new:只写 `Monster wolf;` 就去访问成员,对象还没创建就会报错。new 是创建实例、触发构造函数的唯一入口。
- 构造函数写错:名字和类名差一个字都不行;加上返回类型(哪怕 void)会被当成普通方法,于是到处是"找不到构造函数"的报错。
- 类名大小写、与文件名不一致:C# 区分大小写,`new student()` 找不到 `Student`;Unity 里脚本类名还要和文件名对上,否则挂不上组件。
- 字段忘初始化:没在构造函数里赋值,打出 null 或 0 才回头找。构造函数的意义就是让对象"一出生"状态齐全。
- 访问修饰符用反:该 public 写成 private,外部一碰就编译报错;反过来全 public,谁都能乱改。思路是字段私有、靠属性访问器开口。

## 小结与我的思考

串一遍线索:类是模板,字段存状态、方法做行为;new 造出独立对象;构造函数负责出生时的初始化;用"对象.成员"使用它;public/private 决定对外的口子。单看都不难,合起来才是"类"这个最基础的面向对象单元。

我的体会是:以前写代码只关心步骤顺序,现在更关心职责怎么划分、何时初始化、对外暴露多少。随堂作业里小猫小狗共用一份 Animal 模板,new 两次就得到行为不同的对象,那一刻我真切懂了 3.1 说的模块化和易扩展。后面学继承和多态,应该就是在这张模板上继续做文章。
