---
title: C# 数据结构学习笔记(五):字典
published: 2026-09-03
description: C# Dictionary 学习笔记:用"查字典"类比理解键值对与哈希查找,掌握 Add/索引器/TryGetValue/ContainsKey/Remove 与遍历,记录重复键等易错点。
tags:
  - C#
  - Unity
  - 数据结构
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/ynoteshare/index.html?id=8b0d4f5ac232e5257a6720fad5f24aa5&type=notebook#/WEB982ffa653c304e958198da1bb85a9108
---

这节 Unity 课讲的是 C# 的字典(Dictionary\<TKey, TValue\>)。说实话,上课那会儿我还有点懵,觉得"键值对"是个抽象的名词;直到课后亲手把商品价格、字符统计几个例子跑通,才慢慢咂摸出味道来。这篇笔记就记一下我复习后的理解:字典是什么、怎么声明添加取值遍历、常用方法有哪些,以及我踩过和差点踩的坑。

## 字典我这样理解

第一次听到"键值对"三个字,我脑子里没什么画面。后来把字典想成现实里的《新华字典》就顺了:查"苹果"这个词,不是从第一页往后翻,而是先按拼音或部首定位到它那一页,直接看到解释。在程序里,键(Key)就是那个"词条",值(Value)就是"解释",一个键带一个值,组成一对,所以叫键值对。

把它和我用惯的数组、List 一比,差别立刻出来了:数组只能按下标 0、1、2……顺序访问,想知道"张三"的年龄,得挨个元素翻过去比;字典却是拿键去定位,内部基于哈希表把键直接换算成存储位置,平均一次就能命中,时间复杂度是 O(1)。数据少时感觉不到,数据一多差距就非常明显。

我一开始还困惑:为什么键不能重复,值却可以?后来想明白了——键是"身份",好比学号,必须唯一,程序靠它把键和值对上号;值只是附带的记录,两个人同岁完全正常。另外键和值的类型都能自己指定,比如 Dictionary\<string, int\> 就是字符串键配整数,泛型设计也避免了装箱拆箱的开销。

## 声明、添加、取值与遍历

课上用商品价格做例子,苹果、香蕉、橙子三种水果,正好把两种"写入"方式和一种安全"读取"方式都过了一遍:

```csharp
using System.Collections.Generic;
using UnityEngine;

public class ShopDemo : MonoBehaviour
{
    void Start()
    {
        // 声明并初始化:键是商品名(string),值是价格(float)
        Dictionary<string, float> prices = new Dictionary<string, float>();

        prices.Add("苹果", 5.99f);   // Add 方法:把苹果、香蕉放进去
        prices.Add("香蕉", 3.50f);

        prices["橙子"] = 4.20f;      // 索引器赋值:键不存在时相当于"新增"

        prices["苹果"] = 6.50f;      // 键已存在时再赋值,就是"改"

        // TryGetValue:键存在则返回 true 并写入 out 参数,否则返回 false
        if (prices.TryGetValue("苹果", out float price))
            Debug.Log("苹果现在的价格是 " + price);

        prices.Remove("香蕉");       // 按键删除,香蕉下架

        // foreach 遍历:每次取出一个键值对,分别拿到 Key 和 Value
        foreach (KeyValuePair<string, float> pair in prices)
            Debug.Log(pair.Key + " 的价格是 " + pair.Value);
    }
}
```

老师留的"统计 hello world 字符次数"作业,又让我发现键不一定是字符串,char 也行,而且 ContainsKey 加索引器特别适合做"有就加一、没有就记为 1"这类累加:

```csharp
using System.Collections.Generic;
using UnityEngine;

public class CharCounter : MonoBehaviour
{
    void Start()
    {
        string str = "hello world";
        Dictionary<char, int> charCount = new Dictionary<char, int>();

        foreach (char c in str)
        {
            if (c == ' ')
                continue;                   // 按题目要求忽略空格

            if (charCount.ContainsKey(c))   // 这个字符之前出现过?
                charCount[c]++;             // 出现过:次数加一
            else
                charCount[c] = 1;           // 没出现过:记为第一次
        }

        foreach (KeyValuePair<char, int> pair in charCount)
            Debug.Log(pair.Key + " 出现 " + pair.Value + " 次");
    }
}
```

## 常用方法小结

复习时我把今天用到的成员整理成一张表,方便以后回来查:

| 成员 | 作用 |
| --- | --- |
| Add(key, value) | 新增键值对;键已存在会抛异常 |
| dict[key] = value | 索引器赋值:键不存在就新增,存在就覆盖 |
| dict[key] | 按键取值,键不存在会抛异常 |
| ContainsKey(key) | 只判断键是否存在,返回 bool |
| TryGetValue(key, out value) | 安全取值:存在才给 value 赋值,不抛异常 |
| Remove(key) | 删除指定键的那一对 |
| Count | 当前字典里键值对的个数 |

记起来不难:想"判断在不在"用 ContainsKey,想"顺便取值"就用 TryGetValue,尽量别让程序走到抛异常那一步。

## 容易踩的坑

下面几条是我实打实遇到、或者看了报错才明白的:

- 对同一个键连续 Add 两次,运行时会直接抛异常。字典要求键唯一,不会自动帮你覆盖旧值;想覆盖就得主动用索引器赋值。
- 反过来,用索引器去读一个不存在的键,同样会抛异常。我一开始纳闷"为什么读不到就报错",后来想通了:键是访问的凭据,凭据对不上,程序宁愿明确告诉你,也不该瞎给个结果。
- 所以读值之前最好先问一句:用 ContainsKey 判断一下,或者直接上 TryGetValue。写字符统计作业时我先在这一点上栽了跟头,改成先判断再加,逻辑就顺了。
- 别把键和值的类型弄反。声明成 Dictionary\<string, float\> 后,键的位置就只能放 string,因为泛型是强类型的,写错类型在编译期就会被拦下来——这反而是好事,不用等到运行时才抓瞎。

## 小结与我的思考

收一收这节内容:Dictionary 是按键快速存取键值对的泛型集合,键唯一、值可重复,底层是哈希表,平均查找 O(1);写入用 Add 或索引器,读取用索引器或 TryGetValue,判断用 ContainsKey,删除用 Remove,遍历用 foreach。跟数组、List 的"按位置访问"相比,它更像"按名字访问",更贴近我们记东西的习惯。

我目前留着一个小疑问:哈希查找平均是 O(1),数组按下标访问也是 O(1),那是不是意味着只要频繁"按名字找人",就该无脑优先选字典?等以后学到更细的性能对比,我想把这笔账算清楚,而不是只记住"字典快"这个结论。
