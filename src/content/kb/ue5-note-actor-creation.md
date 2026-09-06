---
title: UE5 C++ 创建第一个 Actor 类：AItem 模板逐行速记
published: 2026-09-06
type: note
branch: ue
topic: Actor 创建
description: "用类向导创建第一个 C++ Actor（AItem）的要点：Public/Private 目录约定、生成代码含义（generated.h / UCLASS / GENERATED_BODY、API 宏）、BeginPlay 与 Tick 覆写、Super:: 调用、PrimaryActorTick.bCanEverTick 控制是否每帧 Tick。"
tags: [UE5, C++, Actor, 反射]
relatedPosts:
  - ue5-actor-creation
relatedKb: []
draft: false
---

> 完整文章见 [UE5 C++ 创建第一个 Actor 类：从蓝图项目起步的完整流程](/posts/ue5-actor-creation/)。

## 一句话理解

蓝图项目想写 C++，第一步是用**类向导**建一个派生自 `AActor` 的类；向导生成的模板代码里，`generated.h + UCLASS + GENERATED_BODY` 是接入 UE **反射系统**的钥匙。

## 创建步骤速记

1. `Tools → New C++ Class` → 基类选 **Actor**。
2. 类名 `Item`，路径放 `items/`：`.h` → `Public/Items`，`.cpp` → `Private/Items`（头文件公开、源文件私有是 UE 约定）。
3. `Create Class`；内容抽屉出现 `C++ Classes/Public/Items/Item`。

## Item.h 模板要点

```cpp
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"   // 想继承 AActor 就必须 include
#include "Item.generated.h"        // 反射代码，勿手改

UCLASS()
class /* <模块>_API */ AItem : public AActor  // API 宏=可跨 DLL 使用，别动它
{
	GENERATED_BODY()              // 编译时被替换为反射代码
public:
	AItem();
protected:
	virtual void BeginPlay() override;   // 游戏开始/生成时调用一次
public:
	virtual void Tick(float DeltaTime) override; // 每帧调用
};
```

## 关键规则

- 重写虚函数后记得 `Super::BeginPlay(); / Super::Tick(DeltaTime);` —— 调用父类版本，父类可能有你需要但不知道的逻辑。
- `PrimaryActorTick.bCanEverTick = true;`（构造函数里）→ 每帧 Tick；`false` → 不 Tick，省性能。
- `PrimaryActorTick` 是 `FActorTickFunction` 结构体成员——UE 用结构体给类成员"按行为分组"，避免 Actor 类被变量淹没。

## 我的用法准则

每建一个新类先问自己三件事：**继承谁（基类选对了吗）？需不需要每帧动（bCanEverTick）？哪几个生命周期函数要覆写（BeginPlay/Tick/...）？** 答案就是新类的骨架。
