---
title: Unity C# 学习笔记(七):枚举
published: 2026-09-03T17:30:00+08:00
description: C# 枚举学习笔记:用"有名字的固定取值"替代魔法数字,掌握 enum 定义、与 int/string 互转、switch 搭配与 [Flags] 位运算,记录底层 int 等易错点。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/SKnjiHf8
---

这周的 C#/Unity 入门课上,讲师用 Unity2023.2.20f1c1 和 Visual Studio 2022 讲了枚举。课上我跟着敲,觉得不过是给数字起名字;晚上把例子跑通后,才品出好处,于是写下这篇复习笔记。

## 枚举,我这样理解

我把枚举理解成:自己定义的一种类型,用来装一组"有名字的固定取值"。比如角色状态无非待机、移动、攻击,直接写 0、1、2,久了根本不知道 1 是什么。改成枚举,取值被限定在集合里,写错名字直接编译不过——用有意义的名称代替数字,可读性和可维护性都上来了。它底层是整数,默认从 0 递增,也可指定类型和具体值;首个成员习惯设 None = 0 作占位符表示空状态,这个约定我也用顺了。

## 怎么定义和使用

先看定义,我把"一周七天"敲成了枚举:

```csharp
// 一组命名的常量,底层默认是 int,成员值自动递增
public enum WeekDays
{
    None,      // 默认值 0,占位符,表示空状态
    Monday,    // 1
    Tuesday,   // 2
    Wednesday, // 3
    Thursday,  // 4
    Friday,    // 5
    Saturday,  // 6
    Sunday     // 7
}
```

在 Unity 里我新建脚本,像普通类型一样声明、赋值、输出:

```csharp
using UnityEngine;

public class WeekDemo : MonoBehaviour
{
    private WeekDays today = WeekDays.Saturday;

    void Start()
    {
        Debug.Log("今天是:" + today); // 输出:今天是:Saturday

        // 讲义案例:工作日搬砖,休息日睡觉
        if (today == WeekDays.Saturday || today == WeekDays.Sunday)
        {
            Debug.Log("休息日,睡觉");
        }
        else
        {
            Debug.Log("工作日,搬砖");
        }
    }
}
```

判断状态时不用再记"6 是星期六还是星期日";排查定义时,还能用讲义里的 Enum.GetValues(typeof(WeekDays)) 配 foreach 一次打印全部成员。

## 枚举与 int 的转换,和 switch 搭配

讲义讲了三种转换,我整理成一段:

```csharp
WeekDays day;

// 1. 枚举转整数:显式强转
int value = (int)WeekDays.Monday;      // value = 1

// 2. 整数转枚举:同样要显式强转
day = (WeekDays)1;                     // day = WeekDays.Monday

// 3. 字符串转枚举:用 Enum.Parse,名字要完全一致
day = Enum.Parse<WeekDays>("Tuesday"); // day = WeekDays.Tuesday
```

枚举是独立类型,整数塞不进来,双向都需显式转换。复习时我把 switch 和它组合验证:要区分工作日和休息日,一串 if 太啰嗦,正好试试。

```csharp
switch (today)
{
    case WeekDays.Saturday:
    case WeekDays.Sunday:
        Debug.Log("休息日,睡觉");
        break;
    default:
        Debug.Log("工作日,搬砖");
        break;
}
```

两个休息日并排放 case 共用一段代码,比那串 if 清爽。

## 容易踩的坑

我给自己攒了几条坑:

1. **忘了底层是 int。** 成员默认从 0 递增,中途插入或删掉成员,编号会整体平移,别依赖"Monday 就是 1"写死数据。
2. **用时不写枚举名。** 该写 WeekDays.Monday 却只写 Monday,或直接丢数字,编译器不认——独立类型不会隐式转换,报错是在提醒你别绕过类型检查。
3. **Enum.Parse 的字符串要分毫不差。** 大小写错、写成"周一"都不匹配,运行到那一行才抛异常,不像编译错误当场暴露。
4. **switch 分支忘 break。** C# 会直接编译报错,不允许落到下一个分支,每个 case 要么 break 要么 return。
5. **[Flags] 没按 2 的幂取值。** 成员应是 1、2、4、8 这类互不重叠的位:叠加用 |、判断用 &(或 HasFlag)、移除用 & ~;按 1、2、3 编号,或起来就撞车,判断永不准。

## 小结与我的思考

复习完,我最大的感受:枚举的价值不在语法,而在把意图写进代码——0、1、2 只说明"有个数字",WeekDays.Monday 直接说"这是星期一"。配上 None 占位和 [Flags] 位运算,讲义课后那道"主角同时中中毒、燃烧等 buff,用 | 叠加、用 & 判断"的作业,我写起来几乎没卡壳。往后还想弄明白状态多了位运算会不会触及可读性极限、状态机该怎么设计,先把螺丝拧紧再说。
