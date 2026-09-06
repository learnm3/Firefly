---
title: UE5 C++ 创建第一个 Actor 类：从蓝图项目起步的完整流程
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 38 集整理：在 UE 中创建第一个 C++ 类 AItem 的完整流程——类向导选基类、public/private 目录组织、生成的 Item.h/Item.cpp 模板代码逐行解读（反射、GENERATED_BODY、BeginPlay/Tick 覆写、Super 调用、bCanEverTick）。
image: ""
tags: [UE5, C++, 游戏开发, Actor, 类向导, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 38 集「Actor Creation」整理，UP 主：**黑子的游戏空间**。本集是"第一次真正写 UE C++"：在蓝图项目里创建第一个派生自 Actor 的 C++ 类。

---

## 本集在做什么

学完类层次后，终于要动手写第一个 C++ 类了。既然"关卡里的一切都从 Actor 派生"，就从 **Actor** 开始：用编辑器向导创建类，并逐行看懂引擎**自动生成的模板代码**（`Item.h` / `Item.cpp`）。

> 关键点：**项目是蓝图项目也能加 C++**——只要创建第一个 C++ 类，项目就自动具备 C++ 能力（需要本机装有编译环境与 Visual Studio）。

---

## 一、创建类：编辑器向导

1. 顶部菜单 **Tools（工具）** → 找到 **New C++ Class（新 C++ 类）**（位于 Programming 分类下）；
2. 弹出**类创建向导**，第一步选基类：
   - 可以创建一个"空的 C++ 类"（不派生自引擎类；向导会默认带上构造函数和析构函数）；
   - 也可以**从某个引擎类派生**——列表里是常用类（Character、Pawn、Actor 等），点 **All Classes** 能看全部并可搜索；
   - 悬停在类名上有提示，例如 Actor 的说明是："**可在关卡中放置/实例化的对象的基类**"。多看看这类提示，能帮你熟悉各个类的继承关系；
3. 选 **Actor** → Next。

### 第二步：命名与目录

接下来填写类信息：

- **Name（类名）**：如 `Item`；
- **Path（路径）**：头文件与源文件默认在 `Source/<项目模块名>/` 下，可以放进子文件夹。本集建一个 `items` 文件夹，类名叫 `Item` → 生成 `public/items/` 与 `private/items/`；
- **Class Type**：
  - 选 `Public`：`.h` 进 `Public/Items/`，`.cpp` 进 `Private/Items/`；
  - 选 `Private`：两个文件都会进 `Private/Items/` 下的嵌套文件夹。
  - UE 的约定是**头文件放 Public、源文件放 Private**，把类声明（公共接口）和实现分开，后续项目会经常见到这种结构；
- 点 **Create Class（创建类）**。

---

## 二、创建后能看到什么

回到编辑器，用 `Ctrl + Space` 打开内容抽屉（Content Drawer）：

```
Content/
├── Content/            # 原来的资源文件夹
└── C++ Classes/        # 新增的 C++ 类文件夹
    └── Public/
        └── Items/
            └── Item    # 悬停可见：父类 Actor、C++ 类、模块名等
```

双击这个 C++ 类会启动 Visual Studio 打开它。

> 提示：编辑器里看不到关卡地形，是因为开放世界用的 **World Partition 单元格**默认没加载——打开迷你地图，拖选周围单元格后点 **Load Selected Cells** 即可（与本节主线无关，略过即可）。

### Visual Studio 里的项目结构

打开解决方案，`Source` 下能看到（模块就是 VS 解决方案里的一个项目）：

```
Source/<模块名>/
├── *.cs 构建文件          # 声明模块依赖，一般不用管
├── <模块名>.h / .cpp      # 项目默认生成的入口文件（含 CoreMinimal 等），基本为空
├── Public/Items/Item.h    # 我们的类声明
└── Private/Items/Item.cpp # 我们的类实现
```

---

## 三、逐行看 Item.h 模板代码

向导生成的 `Item.h` 大概长这样（为便于阅读，按本集讲解顺序整理）：

```cpp
#pragma once                                  // 防止被重复包含

#include "CoreMinimal.h"                       // 引擎核心基础
#include "GameFramework/Actor.h"               // 要继承 AActor，必须包含它的头文件
#include "Item.generated.h"                    // 反射系统自动生成的代码（勿手改）

UCLASS()
class /* <模块名>_API */ AItem : public AActor // 继承 AActor
{
	GENERATED_BODY()                          // 编译时会被 generated.h 里的代码替换

public:
	AItem();                                  // 构造函数：为属性设置默认值

protected:
	virtual void BeginPlay() override;        // 游戏开始 / Actor 生成时调用（虚函数重写）

public:
	virtual void Tick(float DeltaTime) override; // 每一帧调用（虚函数重写）
};
```

逐点解读（视频原话要点）：

- **`#pragma once`**：保证 `Item.h` 在其它文件里无论被 include 多少次，只生效一次；
- **`#include "GameFramework/Actor.h"`**：想从 `AActor` 继承就必须包含它——如果删掉这行，编译器就不认识 `Actor` 类型；
- **那个 API 宏**（悬停展开是 `DECLARE_SPEC... / DLL Export` 一类）：让这个类能被从 **DLL（动态链接库）** 使用；是向导自动生成的，**不需要动它**，以后每次建类都会有；
- **`#include "Item.generated.h"` + `UCLASS()` + `GENERATED_BODY()`**：这是 Unreal **反射系统**的关键。`GENERATED_BODY()` 编译时会被替换成 generated.h 里的代码，让这个类能参与 UE 的底层机制——**能做成蓝图、向蓝图暴露属性**等等。可以把这类 C++ 类理解为"带增强功能的普通 C++ 类"；
- **`AItem : public AActor`**：类名前缀 `A` 表示它继承自 Actor。

---

## 四、BeginPlay 与 Tick：两个最常用的虚函数

向导默认重写了 Actor 的两个生命周期函数：

| 函数 | 签名 | 何时调用 |
| --- | --- | --- |
| `BeginPlay` | `virtual void BeginPlay() override` | **游戏开始**，或 Actor **在游戏中途被生成（Spawn）** 时 |
| `Tick` | `virtual void Tick(float DeltaTime) override` | **每一帧**（屏幕每刷新一次调一次） |

- `Tick` 每帧被调用：老机器约 60 次/秒，新机器可达 120+ 次/秒，所以 Tick 里**不要做重活**；
- 类里出现两个 `public:` 段只是向导的排版习惯，不是必须的——本集把 `Tick` 声明**拖到最上面的 public 段**，让类更紧凑；受保护的 `BeginPlay` 保留。

---

## 五、Item.cpp 与 Super::

```cpp
#include "Item.h"

AItem::AItem()
{
	PrimaryActorTick.bCanEverTick = true;   // 开启每帧 Tick（见下）
}

void AItem::BeginPlay()
{
	Super::BeginPlay();                     // 调用父类（AActor）版本的 BeginPlay
}

void AItem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);                 // 调用父类版本的 Tick
}
```

### `Super::` 是什么

`Super` + **作用域解析运算符 `::`** + 函数名，表示**调用父类的同名函数**：

> 当你重写一个从父类继承来的虚函数时，**最好调用一次 `Super::` 版本**——父类可能实现了一些"你不知道但需要"的逻辑（比如 AActor 在 BeginPlay 里要做的事）。这是 UE C++ 的通用好习惯。

### `PrimaryActorTick.bCanEverTick = true`

- `PrimaryActorTick` 是 Actor 上一个类型为 **`FActorTickFunction`** 的成员——它是一个**结构体**，里面装着控制"能否 Tick"的布尔值 `bCanEverTick`；
- 设为 `true`：每帧调用本 Actor 的 `Tick`；
- 设为 `false`：这个 Actor **永远不会 Tick**——如果 Actor 不需要每帧做事情，关掉可以**提升性能**；
- 这类"把相关变量打包成结构体"的做法，是 UE 避免 Actor 类被海量成员淹没、把类按"行为类别"组织的设计手法（类内成员并非全声明在类本身，很多在引擎定义的结构体里）。

### 清理模板

理解了这些代码的作用后，本集顺手把模板里的大段注释和多余的空 public 段删掉（`Item.h`、`Item.cpp` 都清理），类看起来更简洁——想留注释当提醒也完全可以，风格自选。

---

## 小结

- 蓝图项目同样可以创建 C++ 类：**Tools → New C++ Class**；
- 第一个类选基类 **Actor**，放进 `items` 文件夹，命名 `Item`；头文件放 `Public`、源文件放 `Private`；
- `Item.h` 模板 = `#pragma once` + `CoreMinimal` + 父类头文件 + `generated.h` + `UCLASS/GENERATED_BODY` + `A` 前缀类名——这些是 UE 反射/蓝图能力的根基；
- `BeginPlay`（开始/生成时一次）与 `Tick`（每帧）是要最先掌握的两个虚函数重写；重写后记得调 `Super::`；
- `PrimaryActorTick.bCanEverTick` 控制是否每帧 Tick，用不上就关掉以省性能。

这个类现在还是"空的"，下一集会开始用 `BeginPlay` 验证它、让它真的做事情。
