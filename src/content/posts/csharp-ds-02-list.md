---
title: C# 数据结构学习笔记(二):List<T>
published: 2026-09-03
description: C# List<T> 学习笔记:自动扩容的动态数组,梳理增删改查、遍历、排序反转与类型转换,记录 foreach 中增删元素、Remove 语义等常见坑。
tags:
  - C#
  - Unity
  - 数据结构
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/ynoteshare/index.html?id=8b0d4f5ac232e5257a6720fad5f24aa5&type=notebook#/WEB55319449f16d4d5e86de323459f91b3d
---

这节 Unity 课的 C# 部分讲的是 List\<T\>,上完课我最直接的感受是:以后再也不用为"数组到底该开多长"发愁了。以前写数组,长度写小了装不下,写大了又觉得浪费;而 List\<T\> 似乎天生就是给"数量不确定"的场景准备的。这篇笔记,我想先从"它究竟是个什么东西"说起,再把我亲手验证过的增删、查询、遍历、排序、类型转换整理一遍,最后记几条课下踩过的坑,当作给自己的复习笔记。

## List\<T\> 我这样理解

我一开始以为 List\<T\> 是什么能凭空变长度的魔法容器,后来才想明白:它底层仍然是一块连续内存,本质上还是数组,只是由封装好的逻辑替我们管理——装满了就换一块更大的空间,把旧元素整体搬过去。所以它保留了数组"按下标访问很快"的优点,又去掉了数组"长度写死"的限制。

尖括号里的 T 是泛型,声明时写什么,列表就只能装什么:List\<int\> 只放整数,List\<string\> 只放字符串,装错类型在编译期就会被发现。对 int 这类值类型,元素是直接以"值"的形式存放的,省掉了塞进 object 再取出来时的那套装箱拆箱开销。和数组比一下:数组长度固定、用 Length;List 长度随增删变化、用 Count。讲义还提到 List 默认初始容量为 0,也就是说空列表并不预先占一块现成的内存,真要往里装东西时才逐步自动扩容——所以新人完全不用手动管容量。

## 声明、增删改查与遍历

声明初始化有两种顺手写法:先 new 一个空列表再慢慢 Add,或声明时用花括号直接给初始值。下面的小例子我照着敲过:

```csharp
// 方式一:先建空列表,再往末尾追加
List<int> numbers = new List<int>();
numbers.Add(10);
numbers.Add(20);

// 方式二:声明时直接给初始值
List<int> more = new List<int> { 1, 2, 3 };

numbers.Insert(0, 5);                    // 在索引 0 处插入 5
numbers.Remove(10);                      // 删掉第一个值为 10 的元素
numbers.RemoveAt(1);                     // 删掉索引 1 处的元素
numbers.RemoveAll(n => n > 100);         // 按条件批量删除
numbers.Clear();                         // 全部清空
Debug.Log(numbers.Count);                // 看看还剩几个
```

增删其实是一套"家族":末尾加一个用 Add,一次加一批用 AddRange,任意位置插用 Insert;删单个值用 Remove,按下标删用 RemoveAt,按条件批量清用 RemoveAll,全清用 Clear。查询和遍历我单独试了一遍:

```csharp
List<int> scores = new List<int> { 80, 95, 60 };

bool has = scores.Contains(95);          // 检查是否存在
int pos = scores.IndexOf(60);            // 60 第一次出现在哪个下标
List<int> good = scores.FindAll(n => n >= 90);   // 筛出 90 分以上

for (int i = 0; i < scores.Count; i++)   // 需要下标时用 for
    Debug.Log(scores[i]);

foreach (int s in scores)                // 只读一遍用 foreach 更省心
    Debug.Log(s);
```

对了,课上还做了个拆分练习:把 1~6 的整数按奇偶分别装进两个 List,最后再合并输出。做完我才意识到,"先把数据收集起来、再统一加工"才是 List 最常见的打开方式。

## 排序、反转与类型转换

这几个方法用法都不复杂,但细节值得记一笔:

```csharp
List<int> nums = new List<int> { 3, 1, 4, 1, 5 };
nums.Sort();                             // 默认升序:1 1 3 4 5
nums.Reverse();                          // 整体反转,变成从大到小

// 想保持降序,也可以直接自定义比较规则
nums.Sort((a, b) => b.CompareTo(a));

// ConvertAll 把 int 元素逐个转成字符串,返回的是新列表
List<string> texts = nums.ConvertAll(n => n.ToString());
```

## 容易踩的坑

课后我把容易翻车的地方整理成了几条:

- foreach 里别动集合。我试过在 foreach 中 Add,运行直接抛 InvalidOperationException。想删一部分元素,可以先记到另一个列表,循环结束再统一 Remove。
- Remove 只删第一个匹配项。讲义特意强调过"首个匹配项",列表里有两个相同的 10 时,Remove(10) 只干掉前面那个;想全删得靠 RemoveAll。
- 按下标操作前先看边界。RemoveAt、Insert 都用索引说话,合法范围是 0 到 Count-1。我一开始想当然写 RemoveAt(numbers.Count) 删最后一个,结果越界报错,正确的是 Count - 1。
- Sort 默认升序,想降序必须自己写比较规则;而且 Sort、Reverse 都是就地修改,并没有新列表返回——我曾经想写 var x = nums.Sort(),结果什么也接不到。
- ConvertAll、FindAll 返回的是新列表,原列表纹丝不动,得用返回值接住。看到作业答案里 strNumbers、filtered 都是新变量,我才反应过来。

## 小结与我的思考

收拢一下要点:List\<T\> 是会自动扩容、带类型约束的动态数组;增删靠 Add 一族和 Remove 一族,查询用 Contains、IndexOf、FindAll,遍历时 for 和 foreach 各有用处,排序反转交给 Sort、Reverse,类型转换找 ConvertAll。我现在的习惯是:运行中数量会变的数据用 List,数量固定不变才考虑数组。唯一还惦记着的问题是:讲义只说它会"自动扩容",我很想知道扩容到底是怎么个扩法——一下子翻倍还是按需慢慢加?频繁 Add 会不会悄悄浪费性能?这个问题我打算回头自己查一查。
