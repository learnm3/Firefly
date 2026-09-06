---
title: UE5 自定义头文件：把调试宏搬进 DebugMacros.h
published: 2026-09-06
type: note
branch: ue
topic: 调试宏与头文件
description: 自定义头文件速记：调试宏从总头文件拆到专属 DebugMacros.h、必须放 Source 目录（别放 Intermediate）、头文件内自包含 include、按需引用的模块化习惯。
tags:
  - UE5
  - C++
  - 头文件
relatedPosts:
  - ue5-custom-header-files
relatedKb: []
draft: false
---

> 完整文章见 [UE5 调试宏搬家：创建自己的 DebugMacros.h 自定义头文件](/posts/ue5-custom-header-files/)。

## 一句话理解

把调试宏（球/线/点/向量绘制）从"项目总头文件"里拆出来，住进**只干调试这一件事**的 `DebugMacros.h`——谁需要调试，谁才 include 它。

## 三个关键动作

1. **新建头文件**：VS 右键项目 → 添加 → 新项 → 头文件(.h) → 命名 `DebugMacros.h`；
2. **放对位置**：默认落在 Intermediate（自动生成、每次编译被清空）——必须挪到 **Source 文件夹**（与 Private/Public 同级）才持久；
3. **剪切粘贴**：把宏从 `Slash.h` 剪切到 `DebugMacros.h`，并把 `#include "DrawDebugHelpers.h"` 也放进新头文件（部分引擎版本默认已包含，显式 include 更稳妥）。

## 使用侧改动

```cpp
// Item.cpp：不再 include 总头文件，改为按需引入
#include "DebugMacros.h"
```

## 编译提醒

头文件结构变化 → 热重载可能检测不到：完全关闭编辑器 → VS 里 `Ctrl+Shift+B` 构建整个解决方案 → 重新启动编辑器。

## 我的用法准则

- 一组强相关的工具函数/宏 → 独立头文件，按需 include；
- 绝不把源码放进 Intermediate 之类的自动生成目录；
- 别写魔法数字宏（`#define 30` 这种），宏名要表达意图。
