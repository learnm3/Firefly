---
title: UE5 蓝图创建：从 C++ 类派生 BP_Item 并理解蓝图编辑器
published: 2026-09-06
description: 基于《虚幻5 C++ 游戏开发从入门到秃头》第 39 集整理：为什么不直接拖 C++ 类进场景，而是"基于 C++ 类创建蓝图子类"；蓝图编辑器四大区域、Event BeginPlay + Print String、UE_LOG 打印到输出日志、热重载与 Live Coding。
image: ""
tags: [UE5, C++, 蓝图, PrintString, UE_LOG, 热重载, 游戏开发, 学习笔记]
category: 游戏开发
draft: false
---

> 本文基于 B 站教程《[虚幻5 C++ 游戏开发从入门到秃头](https://www.bilibili.com/video/BV1Wk9EYvEoy)》第 39 集「Blueprint Creation」整理，UP 主：**黑子的游戏空间**。第 38 集创建了第一个 C++ 类 `AItem`，本集回答"怎么把它用起来"——用蓝图。

---

## 本集要解决的问题

C++ 类 `AItem` 可以直接拖进世界（它继承自 Actor），但**它没有任何外观**（没有网格），在编辑器里只是一个空对象，直接拖原始 C++ 类很"无聊"、不实用。

标准做法是：**基于 C++ 类创建一个蓝图子类（Blueprint Class）**。可以把蓝图理解成 C++ 类的子类：

- C++ 类是**父类**，蓝图**继承 C++ 的所有功能**；
- 蓝图给"与类交互"提供了一种对编辑器更友好的方式。

---

## 一、创建蓝图子类 BP_Item

1. 在内容浏览器里建文件夹 `Blueprints`，再建子文件夹 `Items`（用来集中放物品类蓝图）；
2. 右键 → **Blueprint Class（蓝图类）** → 在"All Classes"下拉里搜到我们的类 `Item`（即 C++ 的 `AItem`）→ 选择并创建；
3. 命名加 **`BP_` 前缀**：`BP_Item`。这样一眼就知道它是蓝图而不是 C++ 类（C++ 类是 `AItem`）。

> 给资产起好前缀是让项目"对自己友好"的简单习惯：`BP_` 蓝图、`A` 开头的 C++ Actor 类……越早养成越好。

把 `BP_Item` 拖进世界：这次能拖动、有可移动性，且会显示一个小图标（billboard）提示"这里有个 Actor"。

---

## 二、蓝图编辑器速览

双击 `BP_Item` 打开蓝图编辑器，布局和关卡编辑器类似：

- **视口（Viewport）**：左键/右键拖拽、旋转物体；底部 gizmo 旋转时能看到 Actor 的**局部 X/Y/Z 轴**——记住每个 Actor 都有自己的局部坐标系；
- **组件面板（Components）**：默认每个 Actor 至少有一个**根组件**（这里叫 **Default Scene Root**，即使你没手动创建，Actor 也自带一个）；
- **详情面板（Details）**：很"灵活"——选组件时显示组件属性（移动设置等），点蓝图类自身（带 `self` 的 `BP_Item`）时显示蓝图类的整体属性；
- 顶部标签三个视图：**Viewport / Construction Script（构造脚本）/ Event Graph（事件图）**。

### Event Graph（事件图）是什么

事件图 = 放蓝图节点来"执行逻辑"的地方，就像 C++ 写代码、只是不用打字。新建蓝图里已经预置了几个事件节点：

- `Event BeginPlay`（开始播放）、`ActorBeginOverlap`（重叠开始）、`Tick`——现在没用上所以是灰色；
- 它们提示"这些事件你可以用"，就像 C++ 类里的 `BeginPlay()` 一样。

> 区别速记：**事件是红色的（如 BeginPlay），函数是蓝色的（如 Print String）**。事件没有输入执行引脚；把鼠标悬停在事件节点上会看到 "output delegate"——**蓝图里"事件"就是"委托（delegate）"的术语**，委托的细节以后专章讲。

---

## 三、Print String：往屏幕打印消息

拖一个 **Print String** 节点接到 `Event BeginPlay`：

- 它的输入 `In String` 就是要显示的文本（悬停粉色圆点可看参数名和类型：String）；
- 值可以来自变量，也可以直接硬编码——把默认的 "Hello" 改成 "Begin Play"；
- 蓝图改动也要**编译**（像 C++ 一样）：点工具栏 Compile，或者直接点 Play 会自动编译。

### 在蓝图里直接试玩

- 蓝图窗口自带 **Play 按钮**，点它会在独立窗口试玩，Esc 停止——这是快速获得全屏窗口试玩的好方法；
- 回关卡播放时，屏幕顶部会短暂显示 "Begin Play" 约 2~3 秒，**很容易错过**；
- 节点下方展开属性：可改 **Text Color**（示例改粉红）、**Duration**（示例改 30 秒）——消息就会在屏幕上停留 30 秒。

**Print String 的价值：验证某个函数或事件有没有被执行。** 例如玩到一半想确认 `Event BeginPlay` 是否真的触发了，打印一下最直接。

### 一个容易踩的现象：离得太远看不到

如果 `BP_Item` 在关卡里离你很远，播放时可能看不到它打出的屏幕消息——因为它离你"太远、与你无关"，消息不会显示。选中它按 **F** 聚焦靠近后再播放，就能看到消息出现。这既演示了消息是否显示与距离有关，也说明：**别指望远处的 Actor 帮你确认逻辑**。

---

## 四、从 C++ 打印：UE_LOG

蓝图演示完，验证 C++ 版的 `BeginPlay()` 是否也被调用：删掉蓝图里的 Print String 节点，回到 Visual Studio 的 `Item.cpp`，在 `AItem::BeginPlay()` 里打印：

```cpp
#include "Item.h" // 确保已包含

void AItem::BeginPlay()
{
    Super::BeginPlay();

    // 打印到输出日志（不是屏幕）
    UE_LOG(LogTemp, Warning, TEXT("Begin Play called"));
}
```

逐个拆解：

| 部分 | 含义 |
| --- | --- |
| `UE_LOG` | Unreal 的日志宏，**区分大小写**，不能写小写 |
| `LogTemp` | 日志类别；临时调试用的类别，适合"随时加、随时删"的日志 |
| `Warning` | 日志级别（verbosity）；项目设置默认会显示 Warning 到输出日志，显示为黄色 |
| `TEXT("...")` | **TEXT 宏**：把字符串字面量转成 Unicode 格式（UE 编码标准建议：字符串字面量一律用 TEXT 包裹） |
| `...`（变参） | `UE_LOG` 支持**可变数量参数**（`__VA_ARGS__`），像函数一样可传多个值，后续集数会展开 |

> 视频资源里还推荐读 UE 官方文档的 **编码标准（Coding Standard）** 文章——里面明确建议"始终用 TEXT 宏包裹字符串字面量"。Unicode 能表达比普通字符更多的字符（中文、希伯来文等），UE 的 `FString` 基于它。

---

## 五、编译与热重载（Live Coding）

改完 C++ 后如何生效：

1. **Save All** 保存；
2. 回到编辑器，底部工具栏有个**热重载图标**（悬停提示 "Recompile and reload..."）——点它会重新编译并热加载 C++ 改动；
3. 旁边"三点"菜单里可勾选 **Live Coding（实时编码）**：在当前进程里直接热修补 C++ 函数，比编译整个 VS 项目快得多；
4. 完成后底部显示 "Live Coding succeeded"。

**Play 后到 窗口(Window) → Output Log（输出日志）** 查看消息：如果看到 `Begin Play called`，说明 C++ 的 `BeginPlay` 确实被执行了。

### 两个坑

- **红色错误文本**：示例中世界里的材质报错 "requires non-virtual texture"——去 `项目设置 → 搜索 Virtual Texture → 启用虚拟纹理支持`，需要重启编辑器；
- **Live Coding 只在编辑器开着时有效**：关闭编辑器再打开后，改动可能"不见了"——因为热补丁没有写入磁盘的二进制。要持久生效必须**真正编译**：VS 里 Build → Build Solution（常用快捷键 **Ctrl+Shift+B**，或只构建你那个游戏模块），或者用 **Ctrl+F5**（编译并启动编辑器）一步到位。

---

## 小结

- C++ 类 → **蓝图子类**（`BP_` 前缀）是 UE 日常使用 C++ 类的标准姿势；
- 蓝图编辑器核心：视口 + 组件面板（默认场景根）+ 详情面板 + 事件图/构造脚本；
- 事件（红）vs 函数（蓝）；`Event BeginPlay` 在游戏开始/生成时执行；
- 屏幕消息用 **Print String**（可调颜色/时长），日志消息用 **UE_LOG**（LogTemp + Warning + TEXT）；
- **热重载/Live Coding** 提速调试，但关编辑器后要靠 Ctrl+Shift+B / Ctrl+F5 真编译。

下一步：屏幕上与日志里都能打印了，接下来就是学习**格式化输出**（把数值拼进字符串）与更丰富的调试工具。
