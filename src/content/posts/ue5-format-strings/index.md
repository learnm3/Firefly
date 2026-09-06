---
title: UE5 字符串格式化：UE_LOG 与 FString::Printf 的 %f / %s
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 41 集整理：用格式说明符把 DeltaTime 等值打印到输出日志与屏幕（%f），以及用 FString::Printf 构造格式化字符串、用 %s 打印对象名时为何必须写 *Name。
image: ""
tags: [UE5, C++, FString, Printf, UE_LOG, 格式说明符, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 41 集「Formatting Strings」整理，UP 主：**黑子的游戏空间**。上一集只会打印写死的文本，本集学会把**变量的值**（浮点、字符串）拼进日志消息。

---

## 本集要解决的问题

调试时最想看到的往往不是固定文本，而是**某个值**——比如 Tick 里每一帧的 `DeltaTime` 是多少。写死字符串做不到，需要"**把值格式化进字符串**"。

---

## 一、在 Tick 里打印 DeltaTime：UE_LOG + %f

```cpp
void AItem::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    UE_LOG(LogTemp, Warning, TEXT("Delta Time: %f"), DeltaTime);
}
```

关键点：

- `UE_LOG` 支持**可变参数**（上一集见过的 `...`）——在 `TEXT(...)` 之后用逗号追加实参；
- 字符串里用**格式说明符** `%f` 占位，运行时 `UE_LOG` 会把 `%f` 替换成传入的 `DeltaTime` 浮点值；
- 播放后输出日志**每帧刷屏**，滚动条不断上移——能看到 DeltaTime 每帧都在变化（约 0.016 秒等）。

> **格式说明符来自 C 的 `printf`**（C++ 的前身 C 的函数）：`%f`/`%F` 浮点、`%d`/`%i` 有符号整数（int）、`%u` 无符号、`%c` 字符……想查全表可以看 C++ 参考站的 printf 说明页。

---

## 二、屏幕调试消息也格式化：FString::Printf

`AddOnScreenDebugMessage` 要的是一个 `FString`，所以不能直接往里塞 `DeltaTime`——先构造一个**格式化字符串**：

```cpp
// Tick 中
FString Message = FString::Printf(TEXT("Delta Time: %f"), DeltaTime);

// key 用 -1：新消息替换旧消息（屏幕上只留一行，不断更新数值）
GEngine->AddOnScreenDebugMessage(-1, 1.f, FColor::Cyan, Message);
```

- `FString::Printf`：`FString` 的一个静态函数，用法像 `printf`——传入带 `%f` 的模板和值，返回格式化好的 `FString`；
- 效果：屏幕上一行 `Delta Time: 0.016` 之类，每帧更新（示例里数值在 3 与 4 毫秒间跳变，取决于机器）；
- `FString` 是 **UE 内置的字符串类型**（对应标准库的 `std::string`）。能用 UE 内置类型就用它：引擎保证这些类型/函数**跨平台**（不止 Windows）。

---

## 三、打印字符串变量：%s 与 *Name 的坑

接下来把"这个 Actor 叫什么"打出来：用继承来的 `GetName()`（返回对象内部名）：

```cpp
FString Name = GetName();            // 例如 "BP_Item"
FString Message = FString::Printf(TEXT("Item Name: %s"), *Name);
```

**为什么 `%s` 前面要加 `*`？**

- 字符串的格式说明符是 **`%s`**；
- 但 `%s` 期望的是 **C 风格字符串**（`TCHAR*`，一个字符数组指针），**不能直接传 `FString` 对象**；
- `FString` 重载了**解引用运算符 `*`**：在变量前写 `*Name`，返回该字符串内部的 `TCHAR*`（C 风格字符数组），正是 `%s` 需要的；
- 所以规则很直接：**用 `%s` 格式化 `FString` 时，必须写 `*Name`**（对 `UE_LOG` 同样适用）。

> 想验证？在 `FString` 上按"转到定义"能打开 `UnrealString.h`：能看到它大量重载的构造器与运算符（包括 `*`），文档里注明"获取字符串的指针，指向 `TCHAR` 数组"。`TCHAR` 就是 UE 的宽字符类型——因为 UE 走 Unicode，单个字符能表达的信息比普通 `char` 多。

---

## 四、顺带发现：对象内部名会自动加后缀

播放后消息里打印的名字带着额外后缀（如 `BP_Item_C0`、`BP_Item_C1`）——因为引擎要求**世界中每个对象内部名唯一**，同名对象会被自动追加后缀以便区分（按住 Alt 拖一个副本即可复现）。

---

## 五、别让日志刷屏

每条 Tick 都打印 2 条消息（这里有两个 Item 各打一遍）会极快地塞满输出日志——**用完记得删掉这些调试打印**。

---

## 小结

| 需求 | 写法 |
| --- | --- |
| 打印浮点/整数 | `UE_LOG(LogTemp, Warning, TEXT("Delta Time: %f"), DeltaTime)` |
| 屏幕显示格式化文本 | `FString::Printf(...)` 结果传入 `AddOnScreenDebugMessage` |
| 把 `FString` 拼进 `%s` | **必须写 `*Name`**（返回 `TCHAR*` C 风格字符串） |
| 每帧刷屏 | key 用 `-1` 让新消息替换旧消息 |

- 格式说明符体系来自 C 的 `printf`（`%f`、`%d`、`%s`……）；
- 调完记得清理日志，避免输出日志被刷爆。

下一步：既然能打印出"看得见"的数值，就可以边跑边验证各种函数/事件到底发生了什么——这也为后面调试 Actor 行为打好了基础。
