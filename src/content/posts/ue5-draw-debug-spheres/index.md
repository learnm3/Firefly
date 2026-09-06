---
title: UE5 C++ DrawDebugSphere：可视化"看不见的"Actor
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 42 集整理：为什么需要调试形状、蓝图与 C++ 里用 DrawDebugSphere 在 Actor 位置绘制球体（中心/半径/分段/颜色/持续时长/厚度），以及如何用 #define 宏把一次绘制收成一行。
image: ""
tags: [UE5, C++, DrawDebugSphere, 调试, 宏, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 42 集「Drawing Debug Spheres」整理，UP 主：**黑子的游戏空间**。代码沿用课程项目 `Item` 类风格。

---

## 本集要解决的问题

日志能告诉我们"发生了什么"，但有些信息**用文字很难描述**：某个不可见的物体到底在哪、多大多小。调试形状（Debug Shapes）就是为此而生——在场景里画一个临时球体/线/点，把"看不见的逻辑位置"变成"看得见的图形"。

本集场景：`BP_Item` 对象目前**没有网格体**（还没加 Static Mesh），场景里看不到它们，但我们仍然想知道它们的位置——于是画一个**调试球体**。

---

## 一、蓝图：Draw Debug Sphere 节点的参数

在蓝图 `BeginPlay` 里搜索 **Draw Debug Sphere** 节点。绘制一个球需要的信息：

| 输入 | 类型 | 说明 |
| --- | --- | --- |
| Center（中心） | Vector | 球心在三维空间中的位置 |
| Radius（半径） | Float（默认 100） | 球的大小 |
| Segments（分段） | Integer（默认 12） | 球体用多少段构成，越大越圆 |
| Line Color（线条颜色） | LinearColor | 与 C++ 的 `FColor` 很接近，含 R/G/B |
| Duration（持续时间） | Float（秒） | 画完多少秒后消失 |
| Thickness（厚度） | Float | 线条的粗细 |

演示要点：

- 直接播放时，球画在**世界原点 (0,0,0)**——因为没连 Center，默认值是零向量；两个 item 的球叠在一起，看起来只有一个。
- 把 **Get Actor Location**（返回值是 Vector）连到 Center，每个球就画在各自 Actor 的位置上，这时能看到两个球。
- 调参示例：半径 50、Segments 从 12 调到 24（球更圆）、Duration 60 秒、Thickness 1（线更粗）。
- 这就是调试形状的核心价值：**即使 Actor 本身不可见，我们也能可视化它们**，游戏开发中经常要"看见看不见的东西"。

> 小提示：Segments 越小，引擎需要画的线条越少；12 段已经能看出多边形感，24 段接近圆形。

---

## 二、C++：在 Item 的 BeginPlay 里画球

### 2.1 包含头文件

绘制函数声明在引擎头文件里，先 include：

```cpp
#include "DrawDebugHelpers.h"
```

### 2.2 空指针安全：先检查 World

`DrawDebugSphere` 的第一个参数是 `UWorld*` 指针——球画在哪个世界里。获取方式是 `GetWorld()`：

```cpp
void AItem::BeginPlay()
{
	Super::BeginPlay();

	UWorld* World = GetWorld();   // 缓存世界指针
	if (World)                    // 空指针检查：Actor 未在世界里生成时可能返回 nullptr
	{
		DrawDebugSphere(World, Location, Radius, Segments, Color, bPersistentLines, LifeTime);
	}
}
```

> 工具提示里写着：GetWorld 是"缓存的世界指针获取器"，如果 Actor 没有被实际生成到关卡中会返回 `nullptr`。BeginPlay 时世界通常一定有效（Actor 能 BeginPlay 说明世界已存在），但**养成先判空再使用的习惯**是良好 C++ 实践。

### 2.3 各参数对应

```cpp
FVector Location = GetActorLocation();   // 蓝图的"Vector"在 C++ 里叫 FVector

DrawDebugSphere(
	World,
	Location,                    // 球心
	25.f,                        // 半径（本集示例用小半径）
	24,                          // Segments：24 段更圆
	FColor::Red,                 // 颜色：FColor 内置静态颜色之一
	false,                       // bPersistentLines：false 表示非持久
	30.f                         // LifeTime：持续 30 秒
);
```

本集顺带澄清两个 C++ 类型点：

- **`int32` 而不是 `int`**：整数在多数平台是 32 位，但不保证所有平台一致；UE 为此内置了 `int32` 类型，保证永远是 32 位整数。写 UE 代码时用 `int32`。
- **蓝图 Vector ↔ C++ `FVector`**、**蓝图 LinearColor ↔ C++ `FColor`**，是同一类东西在两种语言里的名字。

---

## 三、用 `#define` 宏收成一行

每次画球都要写一堆参数很啰嗦。如果"红色、24 段、持续 30 秒"就是默认画法，可以打包成宏。

### 3.1 简单常量宏

```cpp
#define THIRTY 30
```

之后代码里写 `THIRTY` 的地方，预处理器会在编译前把它**文本替换**成 `30`。

### 3.2 函数式宏：DRAW_SPHERE(Location)

和函数不同，宏不写参数类型，只写参数名：

```cpp
#define DRAW_SPHERE(Location) \
	if (GetWorld()) \
	{ \
		DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, true); \
	}
```

- 展开逻辑：先判断 `GetWorld()` 不返回空指针，再画球；
- `true` 表示 `bPersistentLines`——球**永不消失**（本集宏的默认选择，之后课程会做"单帧"版本）；
- 单行 `if` 不写花括号在 C++ 里合法，这里为了紧凑写成一行；**多行语句必须用花括号**，日常代码仍建议写规范的花括号版本。

调用处一下子简单了：

```cpp
FVector Location = GetActorLocation();
DRAW_SPHERE(Location);
```

### 3.3 宏放进公共头文件，全项目复用

宏在 `.cpp` 里定义的话，只有这个类能用。把它**剪切到项目公共头文件**（课程项目里是 `Slash.h`，等价于你自己项目的 `<项目名>.h`）后，任何 `#include "Slash.h"` 的类都能用 `DRAW_SPHERE`：

```cpp
// Item.cpp 顶部
#include "Slash.h"   // 让编译器知道 DRAW_SPHERE 的存在
```

---

## 四、性能提醒

- 调试形状**不是给打包发布版用的**，它们只是开发期工具；
- 用多了性能会迅速下降：形状越多、Segments 越高，每帧要画的线条越多；
- 本集宏默认 12 段、持久线，就是"够看、少画"的取舍（相比 24 段更不圆，但引擎负担小）。

---

## 小结

本集收获：

- **调试形状的价值**：可视化不可见的逻辑位置；
- **蓝图 Draw Debug Sphere**：Center / Radius / Segments / Line Color / Duration / Thickness；
- **C++ `DrawDebugSphere`**：先判空 `GetWorld()`，`FVector` 定位，`int32` 分段，`FColor` 上色；
- **`#define` 宏**：常量宏 + 函数式宏，放进 `Slash.h` 全项目复用。

下一步：第 43 集「Drawing Debug Lines」会用同样的思路画**调试线**，为可视化向量做准备。
