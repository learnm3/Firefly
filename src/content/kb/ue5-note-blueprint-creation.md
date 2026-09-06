---
title: UE5 蓝图创建：从 C++ 类派生 BP_Item 的流程与蓝图编辑器速记
published: 2026-09-06
type: note
branch: ue
topic: 蓝图
description: "基于 C++ 类创建蓝图子类（BP_ 前缀）的标准流程；蓝图编辑器四大区域；Event BeginPlay 与 Print String；UE_LOG(LogTemp, Warning, TEXT(...)) 打印输出日志；热重载与 Live Coding 的边界。"
tags: [UE5, C++, 蓝图, UE_LOG, 热重载]
relatedPosts:
  - ue5-blueprint-creation
relatedKb:
  - ue5-actor-creation
draft: false
---

> 完整文章见 [UE5 蓝图创建：从 C++ 类派生 BP_Item 并理解蓝图编辑器](/posts/ue5-blueprint-creation/)。

## 一句话理解

C++ 类不直接拖进场景，而是**基于它创建蓝图子类（BP_ 前缀）**来使用；蓝图是 C++ 的子类，继承其全部功能，再给你一个友好的编辑器界面。

## 标准流程

1. C++ 类 `AItem`（继承 Actor）→ 内容浏览器右键 **Blueprint Class** → All Classes 里搜 `Item` → 创建；
2. 命名 `BP_Item`（`BP_` = 蓝图，与 `A` 开头 C++ 类区分）；
3. 蓝图编辑器内：**视口**（局部轴 gizmo）、**组件面板**（默认场景根 DefaultSceneRoot）、**详情面板**（选中物切换）、**事件图/构造脚本**；
4. 事件（红）vs 函数（蓝）：BeginPlay 是事件，Print String 是函数；事件无输入执行引脚，蓝图里"事件=委托"。

## 打印三板斧

```cpp
// 屏幕消息：Print String 蓝图节点（可调 Text Color / Duration）
// 日志消息：
UE_LOG(LogTemp, Warning, TEXT("Begin Play called")); // 大小写敏感
```

- `LogTemp`：临时调试日志类别；`Warning`：黄色、默认会显示到输出日志；
- `TEXT()`：字符串字面量转 Unicode，UE 编码标准要求一律使用；
- 屏幕消息（Print String）在离 Actor 太远时可能看不到——别用它验证远处的逻辑。

## 热重载注意

- 编辑器底部**热重载图标** / **Live Coding**：编辑器内快速看 C++ 改动；
- **Live Coding 不持久**：关编辑器重开后需 VS 真编译（`Ctrl+Shift+B`）或 `Ctrl+F5` 编译并启动。
