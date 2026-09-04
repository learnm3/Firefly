---
title: 【坑】脚本挂上却没反应：检查生命周期方法名与类名
published: 2026-09-08T10:00:00+08:00
type: pitfall
branch: unity
topic: 生命周期
description: Unity 靠名字认方法：Start 拼错、类名与文件名不一致都会导致"挂上没反应"。
tags:
  - Unity
  - MonoBehaviour
  - 生命周期
relatedPosts:
  - csharp-hello-world
---

## 问题现象

1. 脚本明明挂到了物体上，点运行却什么日志都没有。
2. 新建的类在别处 `new` 找不到、或者组件挂不上。

## 原因分析

- **Unity 靠"方法名"自动调用**生命周期方法：`Awake`、`Start`、`Update` 名字不能乱改。`Start` 拼成 `starts` 之类，Unity 根本不认识，方法永远不会执行，表现就是"挂上没反应"。
- C# 区分大小写，类名与文件名不一致时（如文件 `student.cs` 类却叫 `Student`）脚本无法正确挂载/引用。

## 解决方法

```csharp
using UnityEngine;

public class HelloWorld : MonoBehaviour  // 类名 = 文件名
{
    void Start()   // 拼写、大小写必须一字不差
    {
        Debug.Log("Hello World");
    }
}
```

## 排查顺序（下次先查这四条）

1. 方法名拼写 / 大小写对不对（Unity 认名不认注释）。
2. 类名与文件名是否一致。
3. 脚本是否真的拖到了 GameObject 上（Inspector 有没有组件）。
4. Console 有没有红色报错被忽略。

## 预防

生命周期方法名当"关键词"对待，直接复制官方签名，别手敲。
