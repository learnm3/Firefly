---
title: Unity C# 学习笔记(八):字符串
published: 2026-09-03T16:30:00+08:00
description: C# 字符串学习笔记:理解不可变性与转义符,掌握 + 拼接与 $ 插值、Length/Substring/Replace/Split 等常用方法,记录忘转义、越界等易错点。
tags:
  - C#
  - Unity
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/s/SKnjiHf8
---

大二这学期开始用 Unity 2023.2.20f1c1 和 Visual Studio 2022 正经学 C#,字符串是其中让我"眼高手低"的一节:讲义读着不难,自己敲代码却处处是坑。这篇写的是我上完课、又做完练习之后的个人理解,不是把讲义复述一遍,希望能给同样入门的朋友一点参考。

## 字符串,我这样理解

字符串在我眼里就是"一串有顺序的字符"。C# 里 string 是 System.String 的别名,属于引用类型,平时 `string s = "text";` 直接赋值就行;讲义里用字符数组构造的例子让我第一次看到它与字符的关系——`new string(new[] { 'H', 'e', 'l', 'l', 'o' })` 也能得到 "Hello",底层其实就是一组 char 按顺序排着。

"不可变"是我这节最需要绕弯的词:字符串一旦创建,内容就定死了,所有看起来在"修改"的方法——ToUpper、Trim、Replace——都不会动原串,而是返回一个改好的新串。我写了小例子验证:调 Replace 后把返回值赋给新变量,再打印原来的变量,原样没变。从此记住一条:方法调完不接住返回值,等于白调。

还有引号与转义:双引号是字符串的边界,内容里想出现一个 ",直接写会被当成字符串结束,必须写成 \";换行 \n、制表符 \t 也是用反斜杠开头的写法。我是想给 Debug.Log 加一段带引号的提示文字时被编译错误教育了一顿,才彻底记住的。

## 拼接与插值

游戏里常要把变量塞进一句话,比如"玩家 xxx 的等级是 xx"。最直白的是用 + 一块块拼,变量一多,加号满天飞,读起来很累;后来我试了 $ 插值,把模板和变量分开,清爽很多。

```csharp
using UnityEngine;

public class StringConcatNote : MonoBehaviour
{
    void Start()
    {
        string playerName = "小火";
        int level = 12;

        // 方式一:+ 拼接,一段文字一段变量连起来
        string message1 = "玩家 " + playerName + " 的等级是 " + level;
        Debug.Log(message1);

        // 方式二:$ 插值,花括号里直接放变量,像填空
        string message2 = $"玩家 {playerName} 的等级是 {level}";
        Debug.Log(message2);   // 和 message1 输出完全一致
    }
}
```

两条日志输出一模一样,差别只在写法:$ 插值会把花括号里的变量值"填"进模板,句子结构一目了然,也不容易漏空格。现在我拼接前会先想:用 $ 是不是更清楚?

## 常用方法

讲义这节的方法最多,第一遍看得我发懵。复习时我换了个问法:不管名字多花哨,先问它返回什么。下面是我在 Unity 里逐个试过的验证代码。

```csharp
using UnityEngine;

public class StringMethodNote : MonoBehaviour
{
    void Start()
    {
        string line = "  Hello, Unity 2023!  ";

        Debug.Log(line.Length);             // 返回 int:字符总数,首尾空格也算
        Debug.Log(line.Trim());             // 返回新串:去掉首尾空白符
        Debug.Log(line.ToUpper());          // 返回新串:全部转大写
        Debug.Log(line.ToLower());          // 返回新串:全部转小写

        Debug.Log(line.Contains("Unity"));  // 返回 bool:是否包含某段文字
        Debug.Log(line.IndexOf("Unity"));   // 返回 int:第一次出现的位置,从 0 数

        Debug.Log("Hello".Substring(1, 3));  // 返回新串:下标 1 起取 3 个 → "ell"
        Debug.Log("a-b-c".Replace("-", "/"));// 返回新串:所有 "-" 换 "/" → "a/b/c"

        string[] parts = "a,b,c".Split(','); // 返回 string[]:按逗号拆成 3 段
        for (int i = 0; i < parts.Length; i++)
        {
            Debug.Log(parts[i]);   // 依次输出 a、b、c
        }
    }
}
```

跑完代码,规律其实很清晰:Length、IndexOf 返回数字(长度、位置),Contains 返回 bool(有没有),ToUpper、ToLower、Trim、Replace、Substring 都属于"返回新串"一族,只有 Split 特殊,把一个字符串拆成 string[] 数组。我还实测过,找不到时 IndexOf 会返回 -1,这在讲义"从 URL 里提取 vipskill"的案例里很关键:先定位,再拿 Substring 掐中间那一段。Remove(删掉一段)、Join(按分隔符合并数组,正好和 Split 相反)思路同族,我就不逐一贴代码了。

另一个小体会:课后作业是删掉 "Abc123XyZ456" 里所有数字,提示用 Replace。我照着思路用 for 让字符从 '0' 到 '9' 循环,把每个数字替换成空串,几行就解决了——原来"删除某种字符"本质上就是"把它替换成空"。

## 容易踩的坑

- **忘写转义**:字符串里要输出双引号必须写成 \",换行、制表用 \n、\t,漏了就是编译错误。
- **全角标点混进代码**:语法和分隔符必须半角;我有一次 Split(',') 里不小心打了中文逗号,数据里明明是英文逗号,结果怎么拆都只有一整段。
- **数错下标、越界报错**:索引从 0 开始,Substring(1, 3) 是从第二个字符往后取 3 个;做"掐头去尾取中间"的需求最怕数错一位,不是取错内容就是运行时越界。
- **方法返回新串,原串不变**:ToUpper、Trim、Replace 调完要用变量接住结果;作业答案里那句 result = result.Replace(...) 每次重新赋值,就是这个道理。
- **null 和空串不是一回事**:null 是什么都没有,"" 或 string.Empty 是"长度为 0 的字符串";讲义特意介绍 IsNullOrEmpty,就是提醒别把两者混着用。

## 小结与我的思考

复习完这节,我觉得字符串方法虽多,但有两条主线:一是"不可变",所以凡是看起来在改字符串的方法都返回新串;二是按返回类型记方法,查的返回数字或 bool,改的返回新串,拆分的返回数组。想通这两条,那些方法签名基本不用背。

更实际的收获是:光看讲义没用。URL 提取案例、删数字作业,都是我自己在 Unity 里敲一遍、再故意改错看报错,才算真正理解。下一节学数组之前,我想先用 Trim、ToLower 加 Contains 给玩家昵称比较写个"忽略大小写和首尾空格也能认出人"的小功能练手——做游戏,字符串处理几乎天天见。讲义最后那句"多练习常用方法",现在我是真的认同了。
