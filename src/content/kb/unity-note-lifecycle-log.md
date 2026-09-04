---
title: Unity 生命周期速记：Awake / Start / Update 与 Debug.Log
published: 2026-09-09T10:00:00+08:00
type: note
branch: unity
topic: 生命周期
description: MonoBehaviour 的生命周期方法由 Unity 到点自动调用、靠名字认；日志三兄弟 Debug.Log/Warning/Error。
tags:
  - Unity
  - MonoBehaviour
relatedPosts:
  - csharp-hello-world
---

> 摘要自博客文章 [Unity C# 学习笔记(一):Hello World](/posts/csharp-hello-world/)。

## 核心认知

- Unity 脚本类要继承 `MonoBehaviour`，它装着 `Awake`、`Start`、`Update` 等**生命周期方法**。
- Unity 到点自动调用这些方法——**靠名字认方法**，方法名不能乱改、不能拼错。
- 类本身更像"盒子/模板"，真正干活的是方法。

## 生命周期方法表

| 方法 | 调用时机 | 用途 |
| --- | --- | --- |
| `Awake` | 对象被创建时 | 初始化（不依赖其他对象就绪） |
| `Start` | 第一次 `Update` 前 | 初始化，适合做启动逻辑 |
| `Update` | 每帧调用 | 帧率相关的游戏逻辑 |

## 日志三兄弟

```csharp
Debug.Log("普通日志");       // 白色
Debug.LogWarning("警告");    // 黄色
Debug.LogError("错误");      // 红色
```

## 编码格式规矩（记成口诀）

- 全部英文半角输入，全角符号直接编译报错。
- 完整语句用英文分号收尾；调用方法必带圆括号。
- 类与方法主体放进成对花括号；静态方法 `类名.方法名`，普通方法 `对象.方法名`。
- 注释写给人看：`//` 单行、`/* */` 多行，不影响运行。

## 待办疑问

`Debug.Log` 按"类名.方法名"调用，应该是静态方法——为什么有的方法不用对象就能调？答：`static` 关键字（讲义后文才讲）。
