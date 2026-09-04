---
title: Unity C# 学习笔记(十六):面向对象三大特征
published: 2026-09-03T08:30:00+08:00
description: C# 面向对象三大特征学习笔记:封装把状态收进类、继承让子类复用扩展、多态统一调用,virtual/override 动态绑定,配玩家属性与敌人基类示例。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/PHuYhaz8
---

这节 C#/Unity 入门课(Unity 2023.2.20f1c1 加 Visual Studio 2022,讲师 TOM)讲面向对象三大特征。课上我把"封装、继承、多态"当口号听,真正读懂是课后重读讲义、亲手敲完示例之后,这篇就记我复习后的理解。

## 面向对象三大特征,先来个总览

三大特征指封装、继承、多态。我的概括:封装把状态和行为收进类里,只留该开的门;继承让子类站在基类肩上,复用代码再扩展;多态让同一句调用在不同对象身上做出不同的事。几乎所有面向对象语言都以这三样为骨架,故称"三大"。

## 封装:把状态和行为收进类里

封装给我的感觉,是"把东西收进盒子,再决定开几扇门":状态(字段)和行为(方法)打包进类,对外只露必要接口。访问修饰符定边界:public 谁都能碰,private 只有本类能访问、连派生类都挡在门外,protected 才放行本类和子类。为了验证我写了小例子,把血量放进私有字段,想改只能走公共属性,set 里顺手加了约束:

```csharp
public class Player
{
    private int _hp; // 私有字段,类外碰不到

    public int mHp // 公共属性:对外唯一的门
    {
        get { return _hp; }                   // 读走 get
        set { _hp = value >= 0 ? value : 0; } // 写走 set,血量不允许为负
    }
}
```

## 继承:子类站在基类肩膀上

继承解决的是重复:与其各写一份,不如抽个基类,让派生类用冒号去继承——左边是子类,右边是基类,是 is-a 的关系。子类自动继承基类的非私有成员再自己扩展,讲义里 Dog 继承 Eat() 又新增 Bark() 正是如此。放进 Unity,最顺手的场景是敌人基类:Enemy 放公共血量和受伤逻辑,再派生近战、远程等不同敌人。另注意:this 指当前对象,base 指基类,想先走父类构造就写 : base(...)。

```csharp
// 敌人基类:血量、受伤逻辑是所有敌人共有的
public class Enemy
{
    protected int mHp; // protected:子类能读,类外不行
    public string mName { get; set; }

    public Enemy(string name, int hp)
    {
        mName = name;
        mHp = hp;
    }

    public void TakeDamage(int dmg) // 普通方法,子类直接继承复用
    {
        mHp -= dmg;
        Debug.Log(mName + " 受到伤害,剩余血量 " + mHp);
    }
}

// 近战敌人:继承基类,只扩展自己的攻击
public class MeleeEnemy : Enemy
{
    public MeleeEnemy() : base("近战小兵", 100) { } // base 调用基类构造函数

    public void Attack()
    {
        Debug.Log(mName + " 挥刀攻击");
    }
}
```

## 多态:一句调用,多种表现

多态最让我有"原来如此"的感觉,讲义一句话:一个接口,多种形态。同样一句 animal.MakeSound(),背后是 Dog 就"汪汪汪",是猫就"喵喵喵"。做法:基类方法标 virtual 表示允许替换,子类用 override 覆盖,名字、返回值和参数列表必须一致;真正调用时是动态绑定,按对象真实类型挑实现,而不是变量声明类型。第一次敲 Animal animal = new Dog(); animal.MakeSound(); 打出"汪汪汪"我很意外,才明白系统会顺着继承链找到 Dog 那版。

```csharp
public class Animal
{
    public virtual void MakeSound() // virtual:允许子类替换
    {
        Debug.Log("动物发出声音");
    }
}

public class Dog : Animal
{
    public override void MakeSound() // 签名一致地覆盖父类实现
    {
        Debug.Log("汪汪汪");
    }
}

// 基类引用 + 子类对象,运行期才决定执行哪份实现
Animal pet = new Dog();
pet.MakeSound(); // 输出:汪汪汪
```

## 容易踩的坑

踩过的坑,讲义大多提前点过名:

- private 只限本类,连派生类都碰不到;想给子类用,得改成 protected。
- 重写三件事:父类 virtual、子类 override、签名一致;只写同名方法,替换不会发生。
- 想先走父类的带参构造,就得写 : base(...);漏了它,父类参数没人初始化。
- 静态方法里不能用 this 或 base——静态方法不属于实例,没有"当前对象"。
- 别把重载当多态:同名不同参的方法编译期就定死了;多态靠 override,运行时才挑实现。

## 小结与我的思考

复习完再看作业里"亚瑟、梅林"的例子,我有了自己的理解:封装定边界,把数据圈在类里设好规则;继承定关系,让公共代码只写一份;多态定扩展,加新角色不用改旧代码。三者互相咬合:没有封装,数据到处裸奔;没有继承,多态无从谈起。做作业时把三者一起用才最顺手:属性守住血量不为负,子类各加力量或魔法,Attack() 留成虚方法,两个角色各打各的。我也提醒自己别滥用继承,C# 一个类只有一个父类,层级越深越难维护。说到底,光背定义没用,多敲例子才是真懂。
