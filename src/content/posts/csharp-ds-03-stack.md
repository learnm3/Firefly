---
title: Unity C# 学习笔记(十一):栈
published: 2026-09-03T13:30:00+08:00
description: C# Stack 学习笔记:用"叠盘子"理解后进先出,掌握 Push/Pop/Peek/Count,以及"先全部压栈、再依次弹出实现逆序"的经典玩法。
tags:
  - C#
  - Unity
  - 数据结构
  - 学习笔记
category: C# 学习笔记
draft: false
sourceLink: https://share.note.youdao.com/ynoteshare/index.html?id=8b0d4f5ac232e5257a6720fad5f24aa5&type=notebook#/WEB0a9cc688b9f04021b7aa134460edff21
---

这一节学的是 C# 里的栈(Stack)。上课前我以为它又是什么高深抽象的概念,结果老师只用一个叠盘子的例子,我就把栈"看懂"了。课后我把讲义里的例子重新敲了一遍,又独立完成了"字符逆序"那道作业。下面按我的理解聊聊栈是什么、常用操作怎么用、"逆序"玩法,还有我踩过的坑。

## 栈:我这样理解

老师用"叠盘子"打比方:后洗的盘子叠在上面,要用的时候先拿最上面那只——也就是说,后放进去的会先被拿出来,这正是后进先出(LIFO)。我记不住这个缩写,干脆把它想成"后来者居上",一下就记住了。

顺着这个思路想,身边到处是栈:浏览器"后退"、编辑器 Ctrl+Z 撤销,回退的总是最近一步。后来听说队列(Queue)是先进先出、先来先走,正好和栈相反:一个像只能从顶上拿放的盘子,一个像排队打饭的队伍,两者对比着记就不会混。

## 常用操作:Push / Pop / Peek / Count

栈的 API 很少,拢共就四个:**Push 放、Pop 拿、Peek 看、Count 数**。Push 把元素压到栈顶;Pop 把栈顶元素拿走,并把这个元素返回给我们;Peek 只探头看栈顶是什么,不拿走;Count 返回栈里当前的元素个数。我照着讲义敲了一段验证代码:

```csharp
Stack<string> stack = new Stack<string>();

stack.Push("Apple");   // Apple 先进栈
stack.Push("Banana");  // Banana 后进栈 成为栈顶

Debug.Log(stack.Peek()); // 只看不移除 输出 Banana
Debug.Log(stack.Count);  // 栈里有 2 个元素

string item = stack.Pop(); // 移除栈顶并返回
Debug.Log(item);           // 输出 Banana
Debug.Log(stack.Count);    // 现在剩 1 个元素
```

运行前我猜会先看到 Apple,结果先看到的是后放的 Banana;再连试两次 Peek,栈顶一直是 Banana,说明 Peek 确实只是"看"而已。

## 栈的典型用法:逆序

栈最经典的用法是逆序。原理其实很朴素:按原顺序把元素一个个 Push 进栈,再一个个 Pop 出来,因为后进先出,取出来的顺序自然就和放进去的顺序相反。讲义里课堂案例是 `int[] nums = { 1, 2, 3, 4, 5, 6 }`:把数字按顺序全部压栈。由于后进先出,无论是用 foreach 遍历还是依次 Pop,拿出来的顺序都会变成 6、5、4、3、2、1,正好和入栈顺序相反。

随堂作业是它的字符版:输入"Hello",输出"olleH"。我起初觉得绕:直接倒着拼不就行了,为什么要借栈?后来想明白,题目要的不是"最快的逆序写法",而是体会"先全部 Push、再依次 Pop 就能逆序"这种能力。核心代码就几行:

```csharp
Stack<char> stack = new Stack<char>();

// 第一步:把字符按原顺序全部压入栈
foreach (char c in "Hello")
    stack.Push(c);

// 第二步:依次 Pop 出来 顺序自然反转
string result = "";
while (stack.Count > 0)
    result += stack.Pop();

Debug.Log(result); // 输出 olleH
```

把字符换成数字、换成任意元素,这套思路都能照搬。

## 容易踩的坑

复习时我整理了四个容易踩的坑:

- **Pop 之前先判空。** 讲义专门提醒过:空栈没有栈顶可移除,硬调会直接报错。我一开始默认"栈里肯定有东西",直到空栈报错才长记性——只要存在可能没 Push 过的分支,就先判断 `stack.Count > 0`,Peek 同理。
- **别忽略 Pop 的返回值。** Pop 不是"只删不还",它会把被移除的元素返回给我们。讲义示例里 `string item = stack.Pop();` 就是把拿掉的元素接住了;真需要这个值时,记得接收。
- **foreach 遍历从栈顶到栈底。** 先 Push Apple 再 Push Banana 时,遍历会先输出 Banana 再输出 Apple,和入栈顺序恰好相反。想当然按 Push 的顺序读遍历结果,最容易看走眼。
- **声明不等于初始化。** 讲义把两步分开写:`Stack<string> stack;` 只是声明,后面还得 `new Stack<string>()` 真正创建对象。我最初以为声明完就能直接 Push,结果一运行就报空引用错误,从此习惯一步到位。

## 小结与我的思考

小结一下:栈是后进先出的结构,核心成员是 Push(压入)、Pop(移除并返回栈顶)、Peek(查看不移除)和 Count(元素个数);foreach 会从栈顶一路走到栈底;而"先全部 Push、再依次 Pop"就是实现逆序的基本套路。课下我忍不住想:编辑器的撤销、浏览器的后退,底层会不会也是栈?如果真的是,操作成千上万次后栈越堆越深,程序又该如何限制它的深度?这个疑问我打算找老师问一问。
