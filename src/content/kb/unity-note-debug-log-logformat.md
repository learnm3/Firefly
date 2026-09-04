---
title: Debug.Log 与 Debug.LogFormat:字符串拼接的 GC 差异
published: 2026-09-03T19:00:00+08:00
type: note
branch: unity
topic: 调试与日志
description: Log 用 + 拼接会产生多个临时字符串,LogFormat 用占位符+StringBuilder 更省 GC;以及正式包日志、Update 高频打印的注意点。
tags:
  - Unity
  - Debug.Log
  - 性能
relatedPosts:
  - csharp-hello-world
  - csharp-string
---

## 两种写法

```csharp
// Log:用 + 拼接 → 产生多个临时字符串,GC 压力大
Debug.Log("HP:" + hp + " MP:" + mp);

// LogFormat:占位符 + StringBuilder,代码清晰且更省 GC
Debug.LogFormat("HP:{0} MP:{1}", hp, mp);
```

- `LogFormat` 内部用格式化缓冲区，避免了连续 `+` 创建的多段临时字符串。
- 代码上也更好读——占位符 `{0}`、`{1}` 一目了然。

## ⚠️ 注意点

1. **正式发布包**：非 Development Build 里日志通常会被剥离/不显示，别把日志当线上排障手段；真机排查用 Development Build + Profiler。
2. **Update 中严禁高频打印**：每帧 `Debug.Log` 会拖垮帧率（字符串分配 + 控制台开销），需要留痕就加开关或隔帧打印。
3. 数据本身是 string 时（如 `Debug.Log(playerName)`）不存在拼接问题，不用为了"省 GC"强行 Format。
