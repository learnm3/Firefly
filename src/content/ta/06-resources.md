---
title: "06 · 资源库：视频清单"
order: 6
description: "按任务整理的视频/课程资源（含核验状态）。"
draft: false
---

> 基于 2026-11-06 的调研（原始核验记录：`research/资源调研.md`；42 条资源中 34 条已核验 BV 号/标题/作者）。
> **使用规则：一条线只留 1 个主课，其余当字典查。收藏 ≠ 学会，每个资源必须产出东西才算学完。**

---

## 0. 三条使用规则

1. **一条线一个主课**：Blender 跟一个、UE 跟一个、材质跟一个、图形学跟一个；其他视频只在卡住时查片段。
2. **每个资源以产出物结束**：下表每行都有"产出"，做不出来就不算学完。
3. **8GB 显存是硬约束**：贴图控 2K、单关卡场景、路径追踪只出静帧、动画一律 Lumen。

---

## 1. 最小启动包：前 4 周只看这 6 个

| # | 资源 | 看多少 | 产出 |
| --- | --- | --- | --- |
| 1 | [Blender 4.0 零基础入门（BV11H4y1P7RV）](https://www.bilibili.com/video/BV11H4y1P7RV/) | 前 12P，每天 1.5h × 5 天 | 5 个练习截图 + 快捷键笔记 |
| 2 | [Blender Guru 5.0 全流程·中文字幕（BV1nTL76xEca）](https://www.bilibili.com/video/BV1nTL76xEca/) | 跟做 1 遍甜甜圈 | 1 张 1920×1080 渲染图 |
| 3 | [UE5 零基础·峡谷深处写实场景（BV1zg4y1375m）](https://www.bilibili.com/video/BV1zg4y1375m/) | 跟做 1 个场景，然后换掉全部资产 | 1 个写实场景 + 5 张机位截图 |
| 4 | [UE5 材质：第一个材质（BV1gBa7zAEED）](https://www.bilibili.com/video/BV1gBa7zAEED/) | 全看（单集） | 1 个参数化母材质 + 3 张材质球 |
| 5 | [Proko 绘画基础（BV1RG5CzPEni）](https://www.bilibili.com/video/BV1RG5CzPEni/) | 只做"线条 + 透视"约 10 集 | 30 张透视速写（不用好看，要准） |
| 6 | [UFSH2023 鸣潮技术分享（BV1BK411v7FY）](https://www.bilibili.com/video/BV1BK411v7FY/) | 看 1 遍，抄下 10 个不认识的术语 | 10 条术语卡（建立目标感） |

> 第 5 周立刻接：GAMES101 第 L02 → L03 → L05 → L07 讲（见 §2 P1）。**注意：最低 6 讲（L03/L05-L06/L07/L09 等），程序向 TA 按 `09_技术向_30天启动.md` §0.5 的 10–11 讲清单执行；一律不刷全课、不追 PA4+。如果基础忘了，先做 `10_零基础10天重启.md`。**

---

## 2. 分阶段资源表

### P0 破冰期（第 1–4 周）

| 资源 | 平台 | 看多少 | 产出 |
| --- | --- | --- | --- |
| [UE 官方 Artist Quick Start（中文）](https://dev.epicgames.com/documentation/unreal-engine/artist-quick-start-in-unreal-engine) | Epic 文档 | 前 2 节，边看边做 | 会界面/视口/导入/放置 |
| [UE5 材质节点基础（BV1qw4bzZEy5）](https://www.bilibili.com/video/BV1qw4bzZEy5/) | B站 | 单集 | 会连节点（UV/法线/Fresnel） |
| [Blender 4.0 零基础（BV11H4y1P7RV）](https://www.bilibili.com/video/BV11H4y1P7RV/) | B站 | 前 12P | 建模界面 + 简单物件 |
| [Blender Guru 5.0（BV1nTL76xEca）](https://www.bilibili.com/video/BV1nTL76xEca/) | B站 | 全流程 1 遍 | 第一张完整渲染图 |
| [Proko（BV1RG5CzPEni）](https://www.bilibili.com/video/BV1RG5CzPEni/) | B站 | 线条 + 透视约 10 集（可选） | 有时间再练；不占主线 |
| [鸣潮 UFSH2023（BV1BK411v7FY）](https://www.bilibili.com/video/BV1BK411v7FY/) | B站 | 1 遍 + 记术语 | 目标感 + 术语表 |

### P1 基础期（第 5–16 周）

| 资源 | 平台 | 看多少 | 产出 |
| --- | --- | --- | --- |
| [2025 虚幻引擎 5 渲染指南（BV1NUGtzqEhW）](https://www.bilibili.com/video/BV1NUGtzqEhW/) | B站 | 全看 1 遍 | 知道每个渲染参数影响什么 |
| [写实光照环境全流程（BV1GnqVYtEfC）](https://www.bilibili.com/video/BV1GnqVYtEfC/) | B站 | 跟做 1 遍 | 同一场景 3 种光的对比图 |
| [Ben Cloward UE5 高级材质·中英（BV1Yy9zBPEYf）](https://www.bilibili.com/video/BV1Yy9zBPEYf/) | B站 | 每周 2 集 | 5 个材质样本 |
| [GAMES101（BV1X7411F744）](https://www.bilibili.com/video/BV1X7411F744/) | B站 | **程序向 TA 选 10–11 讲 + 可选 PA1/PA2**（第 11 天起每周 2 讲；见 `09` §0.5） | 能讲清管线/着色/纹理/光追；不做全课作业 |
| [HLSL Custom Node 中文专栏](https://zhuanlan.zhihu.com/p/638823646) | 知乎 | 1 篇 | 能在 Custom Node 塞 HLSL |
| [Blender 5.0 极速进阶（BV1gDAYzuE2z）](https://www.bilibili.com/video/BV1gDAYzuE2z/) | B站 | 按需 | 补 Blender 5 新界面 |

### P2 作品集期（第 17–32 周）

| 资源 | 平台 | 看多少 | 产出 |
| --- | --- | --- | --- |
| [UE 5.7 过场渲染工作流（BV1SaDhBbE7k）](https://www.bilibili.com/video/BV1SaDhBbE7k/) | B站 | 全看 | 用自己场景出 5–15 秒 1080p 视频 |
| [MRQ 官方文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) | Epic 文档 | 查参数 | 出图/出片参数速查表 |
| [Ben Cloward 水面/折射（BV137zyYmEP9）](https://www.bilibili.com/video/BV137zyYmEP9/) | B站 | 单集 | 一个水面材质 |
| [Blender 插件开发与 Python（BV1GFfsBiE6c）](https://www.bilibili.com/video/BV1GFfsBiE6c/) | B站 | 前 1/3 | 第一个能跑的插件（含 UI） |
| [Blender Python 脚本入门（BV1goryB7EL9）](https://www.bilibili.com/video/BV1goryB7EL9/) | B站 | 按需 | 批量处理脚本 |
| [oeasy Blender 合集（BV1Yvgf6SE6V）](https://www.bilibili.com/video/BV1Yvgf6SE6V/) | B站 | 当字典查 | 不顺序刷 |
| Substance 3D Painter 官方入门 | Adobe 官方 | 搜 `Substance 3D Painter 入门 中文 2025` | 给自建模型画一套 PBR 贴图 |
| [3D 建模 100 集（BV1RSLR6HEii）](https://www.bilibili.com/video/BV1RSLR6HEii/) | B站 | 只挑 Maya 部分前 15 集 | 认识 Maya 菜单（认知级） |

### P3 进阶 / 秋招期（第 33–48 周）

| 资源 | 平台 | 看多少 | 产出 |
| --- | --- | --- | --- |
| [GAMES202（BV1YK4y1T7yY）](https://www.bilibili.com/video/BV1YK4y1T7yY/) | B站 | 阴影/GI/PBR/SSR/TAA 5 个主题 | 1 份"实时渲染名词解释"（面试用） |
| [Houdini 20 零基础（BV11S421X79N）](https://www.bilibili.com/video/BV11S421X79N/) | B站 | 前 1/4（P3 才看） | 1 个程序化小资产 |
| [Houdini 初学者系列（BV1ERCpY2Eiw）](https://www.bilibili.com/video/BV1ERCpY2Eiw/) | B站 | 按需 | 理解节点式思维 |
| [库洛·鸣潮 TypeScript/PuerTS 分享（BV1vW4y117Kh）](https://www.bilibili.com/video/BV1vW4y117Kh/) | B站 | 1 遍 | 了解库洛技术栈 |
| [鸣潮抓帧分析（逐 pass 拆解）](https://whlsl.github.io/2024/10/10/%E9%B8%A3%E6%BD%AE%E6%8A%93%E5%B8%A7%E5%88%86%E6%9E%90/) | 博客 | 精读 1 篇 | 面试杀手锏：说得清鸣潮渲染 pass |
| [Rain Yan UE5 影视级灯光 breakdown（80.lv）](https://80.lv/articles/the-changing-seasons-ue5-feudal-japan-cinematic-lighting-studies/) | 80.lv | 精读 1 篇 | 照结构写自己的 Breakdown（CS 转美术路径参考） |
| [27 届 TA 复合型作品集（BV12bimBvEKY）](https://www.bilibili.com/video/BV12bimBvEKY/) | B站 | 1 遍 | 参考"美术+程序+管线+交互"四线结构 |
| [UFSH2025 主旨演讲（BV1Fz4bzeEih）](https://www.bilibili.com/video/BV1Fz4bzeEih/) | B站 | 1 遍 | 2025 官方技术风向 |
| [ArtStation](https://www.artstation.com/) / [80.lv](https://80.lv/) / TalkArtist | 网站 | 每周 30 分钟 | 每周拆 3 张作品，反推技术点 |
| GDC（YouTube 官方频道） | YouTube | 搜 `GDC rendering talk` | 英文术语 + 工程视角（B站有零散搬运） |

---

## 3. 美术判断专节（程序向：每天 10–15 分钟，不刷绘画课）

> 调研结论：程序向 TA 的美术线目标是"能判断"，不是"会画"；每天 10–15 分钟拉片/看图即可。Krenz 正课等有余力再考虑，Proko 只做线条/透视 10 集可选。

| 资源 | 类型 | 建议 |
| --- | --- | --- |
| **Krenz 透视 / 色彩正课** | 付费，系统课 | **预算允许时最值得买的一项**。B站散片多是学员作业，不能替代正课；先搜 `Krenz 透视 作业` 看作业标准 |
| [Proko 绘画基础（BV1RG5CzPEni）](https://www.bilibili.com/video/BV1RG5CzPEni/) | 免费 | 先做线条 + 透视 10 集，每天 20 分钟 |
| Marco Bucci（YouTube） | 免费英文 | 搜 `Marco Bucci 10 minutes to better painting`；看色彩/光影，不跟画 |
| Ctrl+Paint（官网） | 免费英文 | 数字绘画基础，选"基础篇"看 |
| [2024 自学画画全套 368 集（BV19z421k7g8）](https://www.bilibili.com/video/BV19z421k7g8/) | 免费 | **只按目录挑 5 集**，别刷 |
| 拾艺·场景厚涂基础课 | 付费 | 想练场景气氛图时再买，P1 之后 |
| 《色彩与光线》（James Gurney） | 书 | 选读，当画册翻，不从头背 |

**每天 10–15 分钟怎么用（循环，程序向：判断为主，速写可选）**
```
周一：拉片/看图 1 张（速写可选）
周二：光影拉片 1 张（标主光/补光/色温）
周三：拉片/看图 1 张（速写可选）
周四：色彩分析 1 张（主色/辅色/点缀色）
周五：构图分析 1 张（视觉中心/引导线/层次）
周六：临摹 1 张喜欢的小图（可选，不占主线）
周日：休息 / 翻 ArtStation 10 分钟
```

---

## 4. 官方文档速查（遇到问题先查这里，别先刷视频）

| 主题 | 链接 |
| --- | --- |
| UE 官方文档首页 | https://dev.epicgames.com/documentation/unreal-engine |
| UE 官方学习社区 | https://dev.epicgames.com/community/learning |
| UE 材质系统 | https://dev.epicgames.com/documentation/en-us/unreal-engine/materials-in-unreal-engine |
| UE Lumen | https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine |
| UE Movie Render Queue | https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine |
| UE Niagara | https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-visual-effects-in-unreal-engine |
| UE Sequencer | https://dev.epicgames.com/documentation/en-us/unreal-engine/sequencer-in-unreal-engine |
| Blender 手册 | https://docs.blender.org/manual/zh-hans/ |
| Blender Python API | https://docs.blender.org/api/current/ |
| Microsoft HLSL 文档 | https://learn.microsoft.com/zh-cn/windows/win32/direct3dhlsl/dx-graphics-hlsl |
| LearnOpenGL 中文 | https://learnopengl-cn.github.io/ |
| The Book of Shaders 中文 | https://thebookofshaders.com/?lan=ch |
| Real-Time Rendering 资源站 | https://www.realtimerendering.com/ |
| 库洛游戏招聘 | https://kurogame.jobs.feishu.cn |

---

## 5. 前 4 周资源使用排期（直接照做）

| 周 | 主线看什么 | 副线看什么 | 产出 |
| --- | --- | --- | --- |
| W1 | Artist Quick Start 前 2 节 + UE5 材质第一个材质（BV1gBa7zAEED） | Proko 前 3 集 | 环境+首场景截图 |
| W2 | Blender 4.0 前 12P（每天 1.5h） | Proko 4–7 集 + 速写 | 5 个 Blender 练习 |
| W3 | Blender Guru 甜甜圈全流程 + 峡谷深处（BV1zg4y1375m）前 1/3 | 光影拉片 2 张 | 第一张完整渲染图 |
| W4 | 峡谷深处剩余 + 弗洛洛练习收尾 | 鸣潮 UFSH2023 + 术语卡 | 3 张渲染图 + 复盘 |

---

## 6. P3 之前不要碰（省时间清单）

- ❌ Maya / Houdini 系统课（P3 才做认知级；现在学了用不上）
- ❌ 角色雕刻 / 人物建模全流程（TA 岗不考，投入产出低）
- ❌ UE 蓝图/Gameplay 系统课（你是美术 TA，不是客户端）
- ❌ 3A 全流程 100 小时大课（看着爽，学完做不出作品）
- ❌ 付费英文课（Youngjo Cho/Coloso 等，P2 前不买）
- ❌ 囤课/囤资产：收藏夹里的课等于没学

---

## 7. 核验说明（对调研文件负责）

- 表中 BV 号来自 `research/资源调研.md`，核验方式为"BV 号 + 标题 + 作者"三重命中；B站页面直连被验证码拦截。
- **UNR207 / UNR208 没有找到可信 BV 号**，网传编号不可信，不要按编号搜；用 `Unreal Fest 写实渲染 中文` 或表中替代资源。
- 标注"未核"的时长以页面为准；本系统**不编造时长**。
- Krenz / Marco Bucci / Ctrl+Paint / Substance / GDC 等只有搜索词，属正常（付费或英文资源），按搜索词找最新版本。

---

## 8. 账号与社区（本周注册）

| 平台 | 链接 | 用途 |
| --- | --- | --- |
| Epic Games / Fab | https://www.fab.com | 免费 Megascans 资产、UE 资源 |
| ArtStation | https://www.artstation.com | 作品集主页（HR 会看） |
| TalkArtist | https://talkartist.cn | 国内 TA 社区，发作品找反馈 |
| B站 | https://www.bilibili.com | 学习视频 + 发作品动态 |
| 知乎 | https://www.zhihu.com | 技术文章/面试经验 |
| GitHub | https://github.com | 工具代码、作业仓库 |
| 库洛招聘 | https://kurogame.jobs.feishu.cn | 岗位/投递 |

---

*配套：`research/资源调研.md`（原始核验记录）｜ 下一篇：`07_作品集规划.md`*
