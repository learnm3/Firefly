---
title: Unity C# 学习笔记(五):判断语句
published: 2026-09-03T19:30:00+08:00
description: C# 判断语句学习笔记:if/else if/switch/三元运算符各自适合什么,配月份分季节、字符分类案例,记录漏 else 兜底、switch 忘 break 等易错点。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/SKnjiHf8
---

这周的 C#/Unity 入门课讲判断语句,环境是 Unity 2023.2.20f1c1 + Visual Studio 2022。上课时我觉得"不就是 if 嘛",等下课自己把"月份判断季节"的作业做完、再对着讲义复习一遍,才发觉门道不少。这篇就当学习笔记,记下我现在理解的判断语句。

## 判断语句,我这样理解

程序默认从上到下一条条跑,可游戏里到处是"血量归零吗""按了空格吗"这样的岔路,判断语句就是负责选路的部分。所有条件最终都会化成一个布尔表达式,只有 true 或 false 两种结果,程序就拿着它决定走哪一段。五种写法,我各配了一句适用场景:

- if:只检查一个条件,成立就执行、不成立就跳过,适合"要不要做"的单选。
- if-else:非此即彼,条件不成立必然走 else,保证至少执行一个分支。
- else if:接着 if 一层层问,适合成绩分段、月份分季这类互斥区间。
- switch:把变量和几个离散值逐个比对,适合枚举、菜单这类"按值分流"。
- 三元运算符:成立取甲、不成立取乙,把最简单的二选一赋值压成一行。

## if / else if / else:按顺序问下去

老师的作业是把 1~12 的月份对应成季节,还要处理 0、13 这类非法输入。我先按直觉写 if 版本:先拦非法月份,再用 else if 把 3~5、6~8、9~11 挨个问过去,剩下的 12、1、2 交给 else 兜底。

```csharp
// 代码写在 MonoBehaviour 子类的 Start() 方法里
int month = 2; // 复习时我会改 0、13 和别的月份反复试

if (month < 1 || month > 12) // 先处理非法输入
{
    Debug.Log("无效值,月份必须在 1~12 之间");
}
else if (month >= 3 && month <= 5)
{
    Debug.Log("春季");
}
else if (month >= 6 && month <= 8)
{
    Debug.Log("夏季");
}
else if (month >= 9 && month <= 11)
{
    Debug.Log("秋季");
}
else
{
    Debug.Log("冬季"); // 剩下的 12、1、2 在这里兜底
}
```

写的时候我嘀咕:程序会不会把每个 else if 都检查一遍?跑过才确认,它是从上往下找第一个成立的分支,命中就停,后面不再看。

## switch 与三元运算符:按值分流、单行赋值

同一道月份题,讲义作业答案用的是 switch 版,一对比就看出差别:if 靠比较区间判断,switch 则把 month 的值直接拿去和 case 后的离散值比对,命中哪段就执行哪段;12、1、2 都算冬季这种"多个值共用一个结果"的情况,把几个 case 叠在一起写就行。三元运算符是另一种简化:它只处理最简单的二选一赋值,像讲义里 `score >= 60 ? "及格" : "不及格"` 那样,一行写完。我把两个写法放在一起复习:

```csharp
// month 已经通过 1~12 的校验,switch 直接按值分流
switch (month)
{
    case 12:
    case 1:
    case 2:
        Debug.Log("冬季"); // 三个 case 叠在一起,共用一段输出
        break;
    case 3:
    case 4:
    case 5:
        Debug.Log("春季");
        break;
    case 6:
    case 7:
    case 8:
        Debug.Log("夏季");
        break;
    case 9:
    case 10:
    case 11:
        Debug.Log("秋季");
        break;
}

// 三元运算符:适合这种最简单的二选一赋值
int score = 85;
string result = score >= 60 ? "及格" : "不及格";
Debug.Log("成绩:" + result); // 输出:成绩:及格
```

## 小案例:字符分类 Ab3#

讲义里的字符分类案例把判断和字符串结合起来:给定 `"Ab3#"`,用 C# 自带的字符 API 逐个判断——char.IsLower 认小写、char.IsUpper 认大写、char.IsDigit 认数字。我用 foreach 把字符一个个取出来,再套一层 if / else if / else,A、b、3、# 就分别被认成大写字母、小写字母、数字和其他字符:

```csharp
string str = "Ab3#";
foreach (char c in str) // 逐个取出字符串里的字符
{
    if (char.IsLower(c))
    {
        Debug.Log(c + " 是小写字母");
    }
    else if (char.IsUpper(c))
    {
        Debug.Log(c + " 是大写字母");
    }
    else if (char.IsDigit(c))
    {
        Debug.Log(c + " 是数字");
    }
    else
    {
        Debug.Log(c + " 是其他字符");
    }
}
```

## 容易踩的坑

- 少了 else 兜底。讲义强调 if-else"至少执行一个分支",我只顾着把季节区间问完,忘了给区间外留出口,结果输入 12 这类边界值时什么输出都没有。
- switch 漏写 break。讲义里每个 case 连 default 后面都跟着 break,我偷懒只写最后一段,Visual Studio 2022 直接报编译错误——这是语法硬性要求,每个分支都必须显式收尾。
- 条件写反、端点漏掉。合法范围是 1~12,非法判断要写 `month < 1 || month > 12`;我第一次把 || 写成 &&,0 和 13 反而溜了进来。
- 把 == 写成 =。默写时我打出过 `if (month = 1)`,编辑器立刻标红:一个等号是赋值,两个才是比较,讲义示例里的条件用的也都是 ==、> 这类比较运算符。
- 滥用三元运算符。讲义说它适合"单行条件赋值",一行讲得清才用;要是条件套条件、再塞几个操作,读起来比 if-else 还费劲。

## 小结与我的思考

复习完这节,我脑中判断语句的轮廓是:if 做单选,if-else 做二选一,else if 处理互斥区间,switch 应对离散取值,三元给最简单的二选一赋值做减法——本质都是把"接下来走哪条路"翻译成布尔问题。对我这种新手,先把 if / else if 写对、把边界和兜底想全,比追求花哨写法更重要。下一步我打算啃循环语句,毕竟字符分类里那个 foreach 只是个开头,等会用 for、while,才能把"逐个处理"真正用起来。
