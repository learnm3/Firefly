---
title: "技术向 · 视频课表（按任务）"
order: 23
description: "按阶段整理的中文视频教程，含观看范围与产出。"
draft: false
---

> 全部链接用 B 站公开 API 核验过标题/时长/UP/播放量；时长以页面为准。
> 规则：**只看当前任务相关片段，看 5–10 分钟就暂停动手**；长课当字典，不整刷。

## 1. 现在：P2 灯光 / 曝光（D1）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [UE5 室内灯光全流程实战教程](https://www.bilibili.com/video/BV1VTtyzeENo/) | 叶桑讲UE5 · 21:54 · 1.2 万播放 | **主参考**。看：项目设置→主光/补光→曝光→体积雾/粉尘；边看边在自己的 P2 里改参数 |
| [UE5 角色照明与渲染全流程：三点布光到电影级输出](https://www.bilibili.com/video/BV1Pr3i63EuY/) | -AOV视觉科学- · 41:37 · 5728 播放 | 看"主光/补光/轮廓光"的思路与色温搭配，不要求跟做角色 |
| [2025 年虚幻引擎 5 渲染指南](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 小小效果 · 13:06 · 5850 播放 | 看曝光/渲染设置/画质与性能权衡；13 分钟可整看 |
| [【国语】UE5 光照与渲染技术大师班-上](https://www.bilibili.com/video/BV1AJgbzbEjB/) | JaysongShao · 285:12 · 6801 播放 | **字典**：遇到光比/IES/体积光问题再搜章节，不整刷 |
| [Auto Exposure 官方文档](https://dev.epicgames.com/documentation/unreal-engine/auto-exposure-in-unreal-engine) | Epic 官方 | 搞清"自动曝光 vs 手动曝光补偿"的原理，5 分钟 |

**产出**：3–4 张对比图（基线 / 曝光 -1 / +0.5 / 色温 3200K / 6500K）+ 3 行笔记。

## 2. 下一课：材质（D2）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [UE5 材质-创建你的第一个材质](https://www.bilibili.com/video/BV1gBa7zAEED/) | v麦兜她爹v · 11:34 | 跟做一遍：母材质 + 参数 + 实例 |
| [UE5 基础教程 \| 材质节点基础](https://www.bilibili.com/video/BV1qw4bzZEy5/) | 数字教育小镇培训中心 · 6:27 | 搞清 UV/法线/Fresnel/数学节点怎么连 |
| [Ben Cloward UE5 高级材质（中英）](https://www.bilibili.com/video/BV1Yy9zBPEYf/) | 常青藤字幕 · 1526:31 · 6499 播放 | **字典**：P2 阶段按需查（多层混合/法线/顶点动画） |

**产出**：`M_Basic` 母材质 + 地面/墙/金属 3 个实例 + 3 张材质球 + 参数表。

## 3. 后期与出图（D3）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [Unreal Engine 5.7 过场渲染工作流构建](https://www.bilibili.com/video/BV1SaDhBbE7k/) | 弃疗中心 · 343:58 · 1148 播放 | 只看 Sequencer→MRQ→输出这段；版本正对 5.7 |
| [2025 年虚幻引擎 5 渲染指南](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 小小效果 · 13:06 | 已看过，可回看画质设置 |
| [MRQ 官方文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) | Epic 官方 | 出图参数速查 |

**产出**：1 张 1080p MRQ 成图 + 参数截图 + 耗时记录。

## 4. Shader（D5）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [UE5 菲涅尔边缘光制作全流程](https://www.bilibili.com/video/BV1vM411x7YE/) | 香草味的多莉酱 · 1:52 · 8170 播放 | 先看思路，再对照我们的 HLSL 模板 1 |
| [【UE5】从零开始做原神（33）边缘光+matcap+高光](https://www.bilibili.com/video/BV1cU411f7D1/) | 栗川彼方 · 26:21 · 1.7 万播放 | 风格化边缘光参考；写实角色只用它的 Rim 思路 |
| [Custom Material Expressions 官方文档（中文）](https://dev.epicgames.com/documentation/unreal-engine/custom-material-expressions-in-unreal-engine?application_version=5.5&lang=zh-CN) | Epic 官方 | Custom Node 输入/输出/Include 的权威说明 |

**产出**：Rim Light 效果 GIF + 参数表 + 3 行原理。

## 5. DCC / Blender（D4）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [Blender 4.0 零基础入门教程（全流程）](https://www.bilibili.com/video/BV11H4y1P7RV/) | 浩克肥虫 · 1604:40 · 173 万播放 | 只挑"界面/建模/UV/导出"相关章节，不整刷 |
| [Blender Guru 5.0 全流程（中文字幕）](https://www.bilibili.com/video/BV1nTL76xEca/) | 图层实验室 · 6:42（导入集） | 看开头的甜甜圈流程，建立"完整流程"概念 |
| [Blender 到 UE5 可交互资产（海盗宝箱）](https://www.bilibili.com/video/BV1N1Yk6EEwD/) | 海盗CG · 481:04 · 935 播放 | P2 阶段不用跟；等做道具时按需查"导出/导入"章节 |

**产出**：一个自制小道具导入 UE + 3 条踩坑（单位/缩放/材质槽）。

## 6. 写实场景全流程（P2 后续，不急于现在）

| 视频 | 数据 | 怎么看 |
| --- | --- | --- |
| [UE5 写实光照环境全流程](https://www.bilibili.com/video/BV1GnqVYtEfC/) | -AOV视觉科学- · 177:25 · 2405 播放 | 等 P2 白模/材质完成后，按需看灯光部分 |
| [【国语精翻】UE5 建筑游戏场景全流程（第一章 白盒）](https://www.bilibili.com/video/BV18J2CBpEh2/) | CGShark · 242:13 · 6043 播放 | 看白盒/构图思路，不跟做整章 |

## 三条铁律

1. **视频 ≤ 动手时间**：看 10 分钟，至少做 30 分钟；每段结束必须有截图/GIF。
2. **一次只跟一个视频**：同一时间只开一个教程，其余记在清单里。
3. **不整刷长课**：285 分钟 / 26 小时的课是字典，不是任务。
