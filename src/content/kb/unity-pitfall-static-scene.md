---
title: 【坑】static 变量跨场景残留:场景切换不重置
published: 2026-09-05T09:40:00+08:00
type: pitfall
branch: unity
topic: 生命周期
description: 静态变量/静态方法属于类本身、程序运行期常驻,SceneManager.LoadScene 不会重置,重开一局会残留上一局数据。
tags:
  - Unity
  - 静态变量
  - 场景切换
relatedPosts:
  - csharp-oop-class-more
---

## 问题现象

- 游戏重开一局（切场景再回来），血量/分数/临时状态"莫名其妙"是上一局留下的。
- 明明没有存盘，数据却跨场景"存活"。

## 原因分析

- **静态变量属于类本身、全局唯一、程序运行期常驻内存**——不随对象销毁而释放。
- `SceneManager.LoadScene` 会销毁场景对象，但**不会重置静态变量**。
- 静态方法同理：只能直接访问静态成员，别指望它带实例状态。

## 解决方法

- 需要"跨场景保留"的数据（全局设置、登录态）才用静态/单例，并设计**显式重置入口**：

```csharp
public static class GameState
{
    public static int score;

    public static void ResetForNewGame()
    {
        score = 0;
    }
}

// 开始新游戏时调用,而不是依赖场景卸载
GameState.ResetForNewGame();
```

- 只是"当前场景临时状态" → 用实例变量（MonoBehaviour 字段），场景卸载自动清掉，最省心。
- 场景切换逻辑放在生命周期回调里统一处理：`Awake`（进入场景）重置、`OnDestroy`（离开场景）清理。

## 预防

- 凡见 `static` 字段，先问一句：**这个值场景切换后还想不想要？**
- 想要 → 设计重置函数；不想要 → 换实例字段。
- 与单例搭配时，注意 DontDestroyOnLoad 常驻对象的初始化顺序。
