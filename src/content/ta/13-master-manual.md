---
title: "13 · 总执行手册（所有任务 + 系列教程）"
order: 13
description: "所有任务（45 项）+ 系列教程总表。"
draft: false
---

> 唯一靶子：库洛 **SUN-美术 TA 实习生** JD ｜ 方向：**程序向 TA** 的打法 ｜ 技术 70% / 美术判断 15% / 输出 15%
> 网页版（可勾选进度）：`技术向/SUN美术TA_总执行手册.html`（桌面快捷方式：总执行手册）
> 配套：[00 总览](/ta/00-start/) · [09 技术向30天](/ta/09-tech-30days/) · [10 零基础10天](/ta/10-zero-10days/) · [07 作品集](/ta/07-portfolio/) · [12 最终清单](/ta/12-final-list/)

---

## 0. 现在只做这一件

**Day 1（40 分钟）**：双击桌面「零基础10天重启」→ 看 [GenJi UE5 新手课](https://www.bilibili.com/video/BV1Cd4y1V7G5/) 前 2–3 集 → 在 P2 放 1 Plane + 3 Cube → F9 截图到 `05_Renders\零基础\Day1_三个方块.png` → 面板勾 Day1。

---

## 1. 四阶段总路线

| 阶段 | 时间 | 做什么 | 产出 |
| --- | --- | --- | --- |
| 0 零基础重启 | 现在 10 天 | UE 界面/物体/材质/灯光/相机/曝光/小场景/Blender 道具 | 2 张图 |
| 1 技术冲刺 | 第 11–40 天 | 灯光/材质/后期/MRQ → Shader/HLSL → Blender+UE 工具 → P1 整合 | P2 成图、Material Lab v0.1、PipeCheck v0.1、性能基线 |
| 2 作品集 | 第 41–100 天 | P1 场景 → P2 霓虹街角 → P3 Shader 包 → P4 角色/VFX → P5 工具 | 4 件作品 + Breakdown + 性能卡 |
| 3 投递/面试 | 2027 春–秋招 | 日常/暑期实习练手；2027-08 下旬秋招（SUN 美术 TA + 程序向 TA 双投） | Showreel + 简历 + 面试 |

---

## 2. 阶段 0：零基础 10 天（每天 40–60 分钟）

| 天 | 具体任务 | 产出 | 教程 |
| --- | --- | --- | --- |
| D1 | UE5 界面 + 移动 + 放 1 Plane + 3 Cube；保存 | Day1_三个方块.png | GenJi 新手课（前 2–3 集） |
| D2 | 材质 M_Basic：BaseColor/Roughness/Metallic；3 个实例 | 3 张材质球截图 | 第一个材质 + 节点基础 |
| D3 | Directional + SkyLight + SkyAtmosphere；3 个主光角度 | Day3_灯光_01/02/03.png | 室内灯光全流程（前 10 分钟） |
| D4 | Camera Actor + 构图 + F9 1920×1080 | Day4_相机成图.png | 新手课摄像机章节 |
| D5 | PPV（Unbound）+ 曝光 -1.0 / +0.5 各一张 | Day5_曝光_*.png | 2025 渲染指南 |
| D6 | 5 物件小场景 + 材质 + 灯光 + 曝光 | Day6 白模 + 成图 | 峡谷深处小案例 |
| D7 | 选最好图 + 3 行复盘 + 发 1 条动态 + 面板勾 D1 | 笔记 + 动态 | — |
| D8 | Blender 界面 + 一个简单道具 | 1 个 .blend | Blender 4.0 入门（选章节） |
| D9 | 导出 FBX → 导入 UE → 检查单位/法线/材质槽/UV | Day9_导入UE.png + 3 条踩坑 | Blender→UE 资产流程 |
| D10 | 道具放进 D6 场景 + 调灯光/曝光 + 第二张成图；面板勾 D2 | Day10_成图2.png | — |

---

## 3. 阶段 1：技术冲刺 D1–D30（第 11 天起，每天 60–90 分钟）

### W1 · UE5 技术地基
| D | 任务 | 产出 |
| --- | --- | --- |
| D1 | P2 灯光/曝光对比：基线 + 曝光 -1/+0.5 + 色温 3200/6500；3 行"参数→画面→为什么" | 3 张对比图 + 笔记 |
| D2 | 资产导入：Blender→FBX→UE；单位/缩放/材质槽/sRGB/法线 | 流程截图 + 3 条踩坑 |
| D3 | 母材质 M_Basic + 3 实例（地面/墙/金属）+ 参数表 | 3 实例 + 参数表 |
| D4 | 同一场景 3 个主光角度/色温对比 | 3 张灯光对比 |
| D5 | PPV：曝光/Bloom/DOF/Color Grading 逐项测试 | 参数对照表 + 2 图 |
| D6 | HighRes Screenshot vs MRQ；出 1920×1080 | 成图 + 设置 + 耗时 |
| D7 | 性能基线：stat unit/gpu/rhi、显存、DrawCall、三角面、材质指令 | 性能基线表 |

### W2 · Shader / 材质编程
| D | 任务 | 产出 |
| --- | --- | --- |
| D8 | 材质函数（UV 平铺/色阶调整）复用 3 处 | 函数 + 复用说明 |
| D9 | Rim Light（HLSL） | GIF + 节点图 + 3 行原理 |
| D10 | Dissolve 溶解 + 边缘发光 | GIF + HLSL + 参数 |
| D11 | 扫描线 / UV 流动 | 2 个 GIF + 参数 |
| D12 | 三平面映射（节点版）+ 接缝对比 | GIF + 对比图 |
| D13 | 后处理材质：暗角 + 描边 | 2 个 GIF + 参数 |
| D14 | 每个效果记录指令数/帧时间；整理 Material Lab v0.1 | 6 效果 + 性能表 + 一页文档 |

### W3 · 工具链
| D | 任务 | 产出 |
| --- | --- | --- |
| D15 | Blender Python：bpy 场景/对象/网格/材质；打印选中物体信息 | 脚本 + 运行截图 |
| D16 | 批量重命名 + 资产体检 v0.1（三角面/贴图/UV） | 脚本 + CSV |
| D17 | 安装并运行 PipeCheck v0.1（P5_DCC_Tool） | 安装截图 + 首次报告 |
| D18 | PipeCheck 加 HTML 报告 + FBX 导出预设 | 报告 + 导出文件 |
| D19 | UE Python 批量重命名/列出贴图尺寸 | 脚本 + 结果 |
| D20 | 用 PipeCheck 检查 P1/P2 资产，修复 3 个问题 | 修复前后对比 |
| D21 | 工具 README + 2 分钟演示视频/GIF | README + 演示 |

### W4 · 技术整合到 P1
| D | 任务 | 产出 |
| --- | --- | --- |
| D22 | P1 材质：地面/墙面/金属/布料 | 4 材质 + 节点图 |
| D23 | P1 灯光 + 后期：主光/补光/环境光 + 体积雾 + 调色 | 第一版 3 图 |
| D24 | P1 MRQ 出图 1920×1080，3 机位，记录耗时 | 3 张成图 + 耗时 |
| D25 | 灯光 3 方案（早/黄昏/夜）对比 | 3 图 + 每套 3 行理由 |
| D26 | 性能优化：贴图 4K→2K、阴影/Overdraw；记录前后 | 优化前后对比表 |
| D27 | 技术 Breakdown：目标→方案→参数→取舍→数据 | 800–1200 字 + 图 |
| D28 | 15 题技术自测（见 09），录音回答 5 题 | 录音 + 不会清单 |
| D29 | 作品集技术页：节点图/性能数据/工具截图 | 技术页草稿 |
| D30 | 按 07 rubric 自评 + 更新面板 + 下月 3 目标 | 复盘 + 路线更新 |

---

## 4. 阶段 2：作品集 P1–P5（第 41–100 天）

| 项目 | 具体交付 | 验收 |
| --- | --- | --- |
| P1 室内写实小景 | 参考板 + 白模 + 材质 5–8 + 3 套灯光 + 后期 + MRQ；3–5 图 + 10s 镜头 + Breakdown + 性能 | 能讲 5 分钟；无明显穿帮 |
| P2 霓虹街角 | 湿地面/霓虹/体积雾/Niagara 雨 + 15s 镜头 + Breakdown + 性能页 | 画面有电影感；3 个技术点能讲取舍 |
| P3 材质/Shader 包 | PBR 5 + 风格化 3 + HLSL 2–3 + 后处理 1 + GIF/节点/文档 | 别人按文档复现 80% |
| P4 角色/VFX | MetaHuman/授权角色 + 皮肤/眼睛/头发 + 三点布光 + Niagara 1 个 + 25s | 材质/灯光/特效参数能讲清 |
| P5 PipeCheck 工具 | 命名/面数/UV/材质/贴图检查 + HTML 报告 + FBX 导出 + UI + README + 演示 | 能装能跑，别人能复现 |

---

## 5. 阶段 3：投递/面试

- 简历 1 页：项目写"做了什么 + 技术 + 量化结果"。
- 作品集 PDF ≤20 页 + 在线页面（ArtStation/B站/博客）。
- Showreel 60–90s；3 份项目讲解稿（各 5 分钟）。
- GAMES101 进度、性能数据、GitHub 工具链接。
- 2027 春投日常/暑期实习练手；2027-08 下旬秋招 SUN 美术 TA + 程序向 TA 双投。
- 每场面试后 30 分钟复盘；每周 1 次模拟面试。

---

## 6. 系列教程整理（B站 API 已核验，2026-11-06）

### 6.1 主线系列（同一时间只跟一个）

| 系列 | 数据 | 看哪部分 | 产出 |
| --- | --- | --- | --- |
| [GenJi · UE5.1 全中文新手入门](https://www.bilibili.com/video/BV1Cd4y1V7G5/) | 472:54 · 287 万播放 | 前 2–3 集（界面/移动/放物体） | Day1 三个方块 |
| [星露 · UE5 零基础完整系列](https://www.bilibili.com/video/BV1qYSvBHELW/) | 400:40 · 138 万播放 | 备选，不要同时看两套 | Day1 备选 |
| [叶桑讲UE5 · 室内灯光全流程](https://www.bilibili.com/video/BV1VTtyzeENo/) | 21:54 · 1.2 万播放 | 前 10 分钟（项目设置/主光） | D3/D5 成图 |
| [-AOV视觉科学- · 角色照明与渲染全流程](https://www.bilibili.com/video/BV1Pr3i63EuY/) | 41:37 · 5728 播放 | 三点布光/光比部分 | D4 扩展 |
| [2025 虚幻引擎5渲染指南](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 13:06 · 5850 播放 | 整看（曝光/画质/性能） | D5 |
| [UE5 创建第一个材质](https://www.bilibili.com/video/BV1gBa7zAEED/) | 11:34 | 整看 | D2 M_Basic |
| [UE5 材质节点基础](https://www.bilibili.com/video/BV1qw4bzZEy5/) | 6:27 | 整看 | D2 节点 |

### 6.2 字典系列（不整刷，按问题查）

| 系列 | 数据 | 用途 |
| --- | --- | --- |
| [JaysongShao · UE5 光照与渲染大师班（上）](https://www.bilibili.com/video/BV1AJgbzbEjB/) | 285:12 · 6801 播放 | 光比/IES/体积光/后期查章节 |
| [-AOV视觉科学- · 写实光照环境全流程](https://www.bilibili.com/video/BV1GnqVYtEfC/) | 177:25 · 2405 播放 | P2 白模/材质完成后看灯光 |
| [Unreal Engine 5.7 过场渲染工作流](https://www.bilibili.com/video/BV1SaDhBbE7k/) | 343:58 · 1148 播放 | Sequencer→MRQ 流程段 |
| [Ben Cloward · UE5 高级材质（中英）](https://www.bilibili.com/video/BV1Yy9zBPEYf/) | 1526:31 · 6499 播放 | 多层混合/法线/顶点动画 |
| [Blender 4.0 零基础入门](https://www.bilibili.com/video/BV11H4y1P7RV/) | 1604:40 · 173 万播放 | 只挑界面/建模/UV/导出 |
| [Blender 到 UE5 可交互资产](https://www.bilibili.com/video/BV1N1Yk6EEwD/) | 481:04 · 935 播放 | 导出/导入章节 |
| [MetaHuman 国风女侠全流程](https://www.bilibili.com/video/BV1pm54zKEKJ/) | 114:20 · 2.5 万播放 | P4 前看流程 |

### 6.3 专项短课（按需）

| 教程 | 数据 | 用途 |
| --- | --- | --- |
| [10 分钟学会 Sequencer](https://www.bilibili.com/video/BV1XUaSeKEYA/) | 9:35 · 2.2 万播放 | P2 镜头 |
| [暴走喵哥 · 认识 Sequencer](https://www.bilibili.com/video/BV1oS4y1Z7gD/) | 11:39 · 4.8 万播放 | Sequencer 补充 |
| [菲涅尔边缘光](https://www.bilibili.com/video/BV1vM411x7YE/) | 1:52 · 8170 播放 | D9 Rim Light |
| [原神三渲二材质（边缘光/matcap/高光）](https://www.bilibili.com/video/BV1cU411f7D1/) | 26:21 · 1.7 万播放 | 风格化参考 |
| [Niagara 剑气充能特效](https://www.bilibili.com/video/BV1884g62EMg/) | 13:21 · 177 播放 | P4 特效入门 |
| [RenderDoc 工具介绍](https://www.bilibili.com/video/BV14N4y1F7Sq/) | 25:54 · 5360 播放 | D26 性能定位 |
| [虚幻官方 · Unreal Insights](https://www.bilibili.com/video/BV1Ay4y1q7Kj/) | 33:50 · 8021 播放 | 性能分析 |
| [Axiss_F · Insights 新手指南](https://www.bilibili.com/video/BV14MNtzJEaF/) | 17:07 · 1168 播放 | 更短上手 |
| [UE Python 启用脚本](https://www.bilibili.com/video/BV1WqsgeRE7m/) / [一键生成材质](https://www.bilibili.com/video/BV1hFLjzHE3D/) | 3:59 / 3:23 | D19 |
| [Blender Guru 5.0 全流程](https://www.bilibili.com/video/BV1nTL76xEca/) | 6:42（导入集） | D8 补充 |

### 6.4 图形学（选讲）

| 系列 | 数据 | 选看 |
| --- | --- | --- |
| [GAMES101](https://www.bilibili.com/video/BV1X7411F744/) | 1682:34 · 385 万播放 | 第 11 天起每周 2 讲：L03/05/06/07/08/09/13/15/16/19/20；PA1/2 可选 |
| [GAMES202](https://www.bilibili.com/video/BV1YK4y1T7yY/) | 多集 | 2027 春选 3 主题：阴影/PBR/IBL |

### 6.5 行业/参考

| 资源 | 用途 |
| --- | --- |
| [鸣潮 UFSH2023 技术分享](https://www.bilibili.com/video/BV1BK411v7FY/) | 目标公司的效果/性能平衡 |
| [鸣潮抓帧分析](https://whlsl.github.io/2024/10/10/%E9%B8%A3%E6%BD%AE%E6%8A%93%E5%B8%A7%E5%88%86%E6%9E%90/) | 逐 pass 拆解，面试杀手锏 |
| [Rain Yan 灯光 Breakdown](https://80.lv/articles/the-changing-seasons-ue5-feudal-japan-cinematic-lighting-studies/) | Breakdown 结构参考 |
| [27 届 TA 复合型作品集](https://www.bilibili.com/video/BV12bimBvEKY/) | 作品集结构参考 |
| [Proko 绘画基础（可选）](https://www.bilibili.com/video/BV1RG5CzPEni/) | 美术判断补充；不报长期绘画课 |

---

## 7. 每天 / 每周 / 每月固定动作

| 频率 | 动作 |
| --- | --- |
| 每天 | 美术判断 10–15 分钟（拉片/看图）→ 技术块 60–90 分钟 → 3 行复盘 → 面板打卡 |
| 每周 | 技术主线 ≥5 天；GAMES101 2 讲；交付 1 个可展示物；周日 30 分钟复盘 |
| 每两周 | 发 1 条动态/文章；整理笔记；检查资产工具 |
| 每月 | 按 07 rubric 自评；砍 1 条低价值线；补 1 个缺证据；更新作品集页面 |

---

## 8. 不学清单（现在）

- GAMES101 全 23 讲 + 全部 PA（只选 10–11 讲，PA1/2 可选）
- GAMES202 全课（最多 3 主题）
- UE C++ Gameplay / 蓝图系统 / 网络同步
- 算法刷题 / 后端 / 数据库（学校课除外）
- Maya/Houdini 系统课；角色雕刻/绑定/动画/毛发/布料
- 纯绘画/素描/厚涂长期课（程序向只做判断）
- Unity / 3ds Max / ZBrush / C4D
- 影视后期全流程 / DaVinci 高级调色
- 4K/8K、Path Tracer 动画、Substrate/PCG 大世界（过早）
- 付费长课囤积 / 作品集堆数量 / 先学完再做 / 硬件升级

---

## 9. 现在开始（Day 1，40 分钟）

1. 双击桌面「零基础10天重启」→ 看 [GenJi 新手课](https://www.bilibili.com/video/BV1Cd4y1V7G5/) 前 2–3 集。
2. 在 P2 放 1 Plane + 3 Cube；Ctrl+S。
3. F9 截图 → `E:\TA_Workspace\05_Renders\零基础\Day1_三个方块.png`。
4. 面板 → 技术 Tab → 勾 Day1。
