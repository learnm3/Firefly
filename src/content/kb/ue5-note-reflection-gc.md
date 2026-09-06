---
title: UE5 反射与垃圾回收：UCLASS / UPROPERTY / UFUNCTION 速记
published: 2026-09-06
type: note
branch: ue
topic: 反射与垃圾回收
description: "反射=程序运行时检查自身（C++ 无内置，UE 自研）；GC=自动删除无引用对象防内存泄漏；UHT 扫描 UCLASS/UPROPERTY/UFUNCTION 宏生成代码；.generated.h 与 GENERATED_BODY() 是自动代码入口。"
tags: [UE5, C++, 反射, 垃圾回收, UHT]
relatedPosts:
  - ue5-reflection-gc
relatedKb:
  - ue5-cpp-refresher
draft: false
---

> 完整文章见 [UE5 反射与垃圾回收：UCLASS / UPROPERTY / UFUNCTION 背后的机制](/posts/ue5-reflection-gc/)。

## 一句话理解

C++ 没有反射，UE 用**宏 + UHT（头文件工具）**自建反射系统：宏标记类/变量/函数 → UHT 编译时生成代码 → 编辑器、蓝图、垃圾回收才能"认识并管理"它们。

## 三件事

1. **反射**：程序运行时检查自身（分析自己、收集自身数据）；
2. **GC（垃圾回收）**：跟踪引用计数，对象无引用时自动删除——不用手写 `delete`，防内存泄漏；
3. **UHT**：项目编译时扫描 UE 宏，自动生成额外代码。

## 三个宏

| 宏 | 位置 | 作用 |
| --- | --- | --- |
| `UCLASS()` | 类声明顶部（继承 UObject） | 类参与反射 → 参与 GC |
| `UPROPERTY()` | 变量前 | 变量暴露给反射/蓝图 |
| `UFUNCTION()` | 函数前 | 函数暴露给反射/蓝图 |

括号里的内容叫**指定符（Specifier）**，用来定制暴露方式（可编辑/只读/蓝图可调用等）。

## 自动代码入口（别手写别删）

```cpp
#include "MyActor.generated.h" // 类头文件顶部

UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY() // UHT 生成的类主体代码
    // ...
};
```

- `.generated.h` 与 `GENERATED_BODY()` 都是 **UHT 根据宏自动生成代码**的载体；
- 宏是"被命名的代码片段"，编译开始时由预处理器展开。
