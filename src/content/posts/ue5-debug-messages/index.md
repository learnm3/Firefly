---
title: UE5 屏幕调试消息：Print String 的 Key 机制与 C++ 的 AddOnScreenDebugMessage
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 40 集整理：Print String / Log String 的区别、Key 如何控制消息替换与堆叠、C++ 里用 GEngine->AddOnScreenDebugMessage 把消息打到屏幕。
image: ""
tags: [UE5, C++, 调试, PrintString, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 40 集「Onscreen Debug Messages」整理，UP 主：**黑子的游戏空间**。代码风格沿用课程自建项目（`Item` 类）。

---

## 本集要解决的问题

前几集我们学会了用日志（UE_LOG / 输出日志）记录信息，但日志藏在**输出日志窗口**里。这一集的目标很实用：**把调试消息直接打印到游戏屏幕的左上角**——蓝图里有 `Print String`，C++ 里有 `GEngine->AddOnScreenDebugMessage`。

---

## 一、前提：Actor 必须在世界中，代码才会跑

讲师先做了一个实验：清空地图后播放，输出日志里**什么都看不到**——连 `BeginPlay` 的打印都没有。

> **原因：你的 Actor 必须存在于你正在模拟的世界中，它的代码才会运行。** 如果某个日志消息怎么都不出现，先检查：这个 Actor 到底有没有真的被放进关卡里？

把 `BP Item` 从蓝图文件夹拖进世界中再播放，`BeginPlay` 消息立刻出现在输出日志里。

---

## 二、蓝图：Print String 与 Log String

### Print String 打印到屏幕左上角

从 `Event BeginPlay` 拖出 `Print String`，编译并播放后，消息会显示在**屏幕左上角**。

### Print String 同时也会进输出日志

屏幕之外，`Print String` 的内容**也会被输出日志捕获**——视频里能看到 `Hello` 也出现在日志中（归类为「蓝图用户消息」）。

于是蓝图里其实有两个选择：

| 节点 | 作用 |
| --- | --- |
| `Print String` | 打到**屏幕**（同时也会写日志） |
| `Log String` | 只写进**输出日志**（灰色文本，不像警告那样黄色） |

---

## 三、关键输入：Key —— 控制消息"替换"还是"堆叠"

`Print String` 的 `Key`（类型为 Name）用来控制同一条消息槽的行为：

- **不设 Key / 不同 Key**：每条消息各自显示，新消息默认堆在旧消息上面（`Newer on Top`）；
- **相同 Key**：新的消息会**替换掉旧的消息**，而不是不断叠加。

演示：用 `Ctrl + D` 复制出两个 `Print String`：

- 都不设 Key → 播放时两条同时堆叠显示；
- 两个都设 `Key = 1` → 只看到第二条（第一条被替换）；
- 第一个 `Key = 1`、第二个 `Key = 2` → 两条都显示（分属不同槽）。

### 实战价值：Event Tick 里每帧打印不刷屏

屏幕上图像每秒刷新很多次（通常 60，高配机器可达 120），如果直接让 `Print String` 接上 `Event Tick` 每帧执行：

- **不设 Key** → 消息疯狂刷屏、不断往下堆；
- **设一个固定 Key（如 1）** → 每帧新消息替换旧消息，屏幕上始终只有一行在刷新，非常适合实时观察某个值。

视频里正好用它实时打印 **Delta Seconds**（蓝图中对 C++ `DeltaTime` 的称呼）：每帧时间是很小的值（示例约 `0.000083333` 秒），而且**每帧都在变化**——这直观证明了帧时间不是恒定的，为后续"用 DeltaTime 缩放运动"埋下伏笔。

> 顺带一提：把 float 直接连到字符串插槽时，编辑器会自动插入一个**转换节点**（float/double → string）。`Delta Seconds` 是 float，但转换节点可以同时接受 float 和 double——就像 C++ 里接受 double 的函数可以隐式接收 float 一样。

---

## 四、C++：GEngine->AddOnScreenDebugMessage

把消息从蓝图挪到 C++。目标函数挂在 `GEngine` 这个全局指针上。

### 1. GEngine 是什么

在 C++ 里输入 `GEngine`，提示显示它是 **`UEngine*` 类型的全局指针变量**，并且**可能为零（空指针）**——解引用空指针会崩溃，所以使用前先判空：

```cpp
if (GEngine)   // 不为空才进入
{
    // 在这里调用 GEngine 的函数
}
```

> 它是全局指针，任何类里都能访问；用箭头运算符 `->` 调用它的成员函数。绝大多数情况下（尤其 `BeginPlay` 时）它都有效，但"用指针前先检查"是良好的编程习惯。

### 2. 函数签名与参数

输入 `GEngine->AddOnScreenDebugMessage(` 后，IntelliSense 提示它有两个重载（用上下箭头切换查看）。本集用的是主版本，参数依次为：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `Key` | int32 | 和蓝图 `Key` 同理：同 Key 替换旧消息，不同 Key 各自显示 |
| `TimeToDisplay` | float | 消息显示时长，如 `60.f` 表示 60 秒 |
| `DisplayColor` | FColor | 显示颜色，用 `FColor::Cyan` 等**静态成员**（颜色含 R/G/B 与 Alpha） |
| `FString` | FString | 要显示的消息文本 |
| `bNewerOnTop` | bool（有默认值） | 是否新消息盖在旧消息上，默认 `true` |
| 其余参数 | — | 均有默认值，可省略 |

几个写法细节：

- **浮点字面量**：`60` 是 int，传给 float 会隐式转换；更规范的做法是直接写 `60.f`（加 `f` 后缀的浮点字面量），省去编译器的隐式转换；
- **颜色**：`FColor::` 后接类名 + 作用域解析运算符 `::` 访问其**静态变量**（青 = `FColor::Cyan`），不需要先创建 FColor 对象；
- **FString**：用 `FString("...")` 调用构造函数临时构造，它有一个接受**字符串字面量**的构造函数重载；
- 最后一个必要参数之后不用再传逗号——后续参数都有默认值，直接以分号收尾。

完整调用示例：

```cpp
if (GEngine)
{
    GEngine->AddOnScreenDebugMessage(1, 60.f, FColor::Cyan,
        FString("Item On Screen Message!"));
}
```

保存 → 回编辑器热加载 → 播放，屏幕上出现**青色的 "Item On Screen Message!"，持续 60 秒**。

---

## 五、本集小结

| 场景 | 用什么 |
| --- | --- |
| 消息进输出日志（不占屏幕） | `UE_LOG` / 蓝图 `Log String` |
| 消息打到屏幕左上角（顺带进日志） | 蓝图 `Print String` |
| C++ 里打到屏幕 | `GEngine->AddOnScreenDebugMessage(Key, Time, FColor, FString)` |
| 每帧刷新同一行、不刷屏 | 固定同一个 `Key` |
| 让消息不相互堆叠 | 相同 `Key` 自动替换旧消息 |
| 使用 `GEngine` 前 | 先 `if (GEngine)` 判空 |

**经验要点：**
- Actor 不在世界中就没有代码执行、没有消息——日志/屏幕没输出时先检查关卡里有没有这个 Actor；
- `Key` 是控制屏幕消息"替换 vs 堆叠"的核心旋钮，每帧打印务必设固定 Key；
- C++ 里 `FColor::` 静态成员、`FString(...)` 构造、`60.f` 浮点字面量这些小习惯要刻意养成。

**下一集预告**：本集只在蓝图里打印了 Delta Seconds，下一集会学习**如何在 C++ 里把 DeltaTime（蓝图中叫 Delta Seconds）的值打印/格式化出来**——也就是 Formatting Strings。

---

> 屏幕调试消息是把"看不见的程序状态"变"看得见"的第一步。配合前几集的 UE_LOG 和后续的 Debug Draw（场景内绘制球/线/点），你就有了游戏开发中最常用的三板斧调试工具箱。
