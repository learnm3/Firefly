---
title: UE5 字符串格式化：%f / %s 与 *FString
published: 2026-09-06
type: note
branch: ue
topic: 字符串格式化
description: "用格式说明符打印数值：UE_LOG(..., TEXT(\"...%f\"), 值)；屏幕消息用 FString::Printf；用 %s 嵌入 FString 时必须在变量前加 *（返回 TCHAR* 的运算符重载）。"
tags: [UE5, C++, FString, UE_LOG, 格式化]
relatedPosts:
  - ue5-format-strings
relatedKb:
  - ue5-debug-messages
draft: false
---

> 完整文章见 [UE5 字符串格式化：UE_LOG 与 FString::Printf 的 %f / %s](/posts/ue5-format-strings/)。

## 一句话理解

把**变量的值**印进日志/屏幕消息靠"格式说明符"（来自 C 的 `printf`）；格式化 `FString` 用 `FString::Printf`；`%s` 需要 C 风格字符串，所以 `FString` 前要加 `*`。

## 用法速查

```cpp
// 1) 打印浮点值到输出日志
UE_LOG(LogTemp, Warning, TEXT("Delta Time: %f"), DeltaTime);

// 2) 屏幕消息显示格式化文本（key=-1 让新值覆盖旧值）
FString Message = FString::Printf(TEXT("Delta Time: %f"), DeltaTime);
GEngine->AddOnScreenDebugMessage(-1, 1.f, FColor::Cyan, Message);

// 3) 把 FString 拼进去：%s + *Name
FString Name = GetName();
FString Msg  = FString::Printf(TEXT("Item Name: %s"), *Name);
```

## 高频格式说明符

| 说明符 | 类型 |
| --- | --- |
| `%f` / `%F` | float / double |
| `%d` / `%i` | 有符号整数（int） |
| `%u` | 无符号整数 |
| `%s` | C 风格字符串（`TCHAR*`） |
| `%c` | 字符 |

## 关键坑

- **`%s` 不能直接接 `FString`**：`FString` 重载了 `*` 运算符，`*Name` 返回内部 `TCHAR*`（C 风格字符串），`%s` 才认；
- `FString` 是 UE 内置类型（跨平台），优于裸 `std::string`；
- `GetName()` 返回的对象名会被引擎追加后缀以保证唯一（`BP_Item_C0/_C1`）；
- 调试打印用完记得删，避免输出日志刷屏。
