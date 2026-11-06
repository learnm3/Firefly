---
title: "技术向 · 软件安装清单"
order: 25
description: "PureRef / OBS / DaVinci / Substance / Maya / Houdini 安装与用途。"
draft: false
---

> ✅ **2026-11-06 已全部装好**：OBS Studio 33.0.1（便携版）、PureRef 2.1.3（便携版）、DaVinci Resolve 21.2.0.6（官方安装，数字签名校验通过）。
> 路径与快捷方式见 `E:\TA_Workspace\00_Admin\已安装软件.md`。下面保留原始清单，供以后换机/重装参考。

> 当前环境里 agent 无法联网下载安装包（沙箱限制），winget 在当前会话也不可用。
> 你按下面顺序手动装即可；装完把 `tools\check_env.ps1` 再跑一遍。

## P0 · 本周必装（免费）

| 软件 | 用途 | 状态 |
| --- | --- | --- |
| **PureRef** | 参考图拼板（拉片/美术必备） | ✅ 已装便携版：`E:\TA_Workspace\03_Assets\Tools\PureRef`（桌面快捷方式） |
| **OBS Studio** | 录屏：作品演示、Bug 复盘、Showreel | ✅ 已装便携版：`E:\TA_Workspace\03_Assets\Tools\OBS`（桌面快捷方式） |
| **DaVinci Resolve** | 调色 + 剪辑（作品集出片） | ✅ 已装：DaVinci Resolve 21.2（P2 出片时直接用） |

## P1 · 一个月内

| 软件 | 用途 | 链接 |
| --- | --- | --- |
| **Substance 3D Painter** | 贴图绘制（写实作品集必须） | https://www.adobe.com/products/substance3d/apps/painter.html |
| **Maya 学生版** | 公司常用 DCC（简历关键词） | https://www.autodesk.com/education/edu-software/overview |
| **Visual Studio 2022 游戏开发 C++ 工作负载** | 已装（check_env 已确认） | — |

## P2 · 三个月内

| 软件 | 用途 | 链接 |
| --- | --- | --- |
| **Houdini Apprentice** | 程序化/特效认知（免费非商业） | https://www.sidefx.com/products/houdini-apprentice/ |
| **Blender / UE 官方插件** | 按需装（PSK 导入、Node Wrangler 等） | — |

## 如果 winget 正常可用（可选）

在普通 PowerShell 窗口里执行：

```powershell
winget install --id OBSProject.OBSStudio -e
winget install --id BlackmagicDesign.DaVinciResolve -e
# PureRef 在 winget 里没有稳定 id，建议官网下载
```

## 装完后的验证

1. 双击 `TA学习系统_v2\tools\检查环境.cmd`，确认可选软件里能看到新装的软件。
2. 打开 OBS：设置 → 输出 → 录像格式 MP4，分辨率 1920×1080。
3. 打开 DaVinci：新建项目 → 导入一张渲染图 → 试一次调色。

## 待确认

- 显示器型号/色域：设置 → 系统 → 显示 → 高级显示 → 查看型号；到官网查 sRGB 覆盖率。
- 是否外接显示器：外接优先用 100% sRGB 的屏做调色判断。
