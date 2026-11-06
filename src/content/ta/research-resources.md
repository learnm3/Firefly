---
title: "附录 · 资源调研（原始记录）"
order: 30
description: "视频资源核验记录与兜底搜索词。"
draft: false
---

> 对象：零美术 / 零 UE / 零 DCC 基础，Win11 + RTX 4070 Laptop 8G + UE 5.7.4（E:\UE_5.7）+ Blender 5.1/4.3。
> 阶段：**P0** 前 4 周破冰 ｜ **P1** 第 2–3 月基础 ｜ **P2** 第 4–6 月作品集 ｜ **P3** 第 7–12 月进阶/秋招。
> 核验：2026-11 用 bilibili 站内检索 / 官方文档命中标题核验 BV 号与标题是否一致；B 站页面直连被验证码拦截，故以「BV 号 + 标题 + 作者」三重命中为准。
> 时长栏只写已能确认的量级，标注「未核」的一律以页面为准，**本表不填估算值**。

## 0. 核验统计

42 条中 **34 条已验证**（BV 号 + 标题 + 作者三重命中），8 条标「未验证」并附兜底搜索词（见第 11 节）：美术基础 3/5、UE5 入门 5/5、材质 4/5、渲染 5/6、Blender 6/7、图形学 4/4、DCC 3/4、行业 4/6。

---

## 1. 美术基础（造型/透视、色彩、构图、光影）

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| GAMES101 教师推荐之外·绘画基础（Proko 中英字幕合集） | B站搬运 / Proko | [BV1RG5CzPEni](https://www.bilibili.com/video/BV1RG5CzPEni/) | 130 集（标题自述 1-130） | P0–P1 | 线条/形体/透视不再手抖，能临摹简单静物 | 已验证（标题+BV 命中，搬运号） |
| 【全 368 集】2024 自学画画全套教程 | B站搬运 | [BV19z421k7g8](https://www.bilibili.com/video/BV19z421k7g8/) | 368 集（标题自述） | P0–P2 | 按目录挑「透视/素描/色彩」用，别全刷 | 已验证（标题+BV 命中，搬运号） |
| 拾艺·场景厚涂基础课 | B站课堂 / 拾艺 | [ep171237](https://www.bilibili.com/cheese/play/ep171237) | 付费课 | P1–P2 | 场景整体气氛图（作品集第 2 张） | 已验证（站内课程页命中，**付费**） |
| Krenz 透视 / 色彩课程（K大） | 个人课 + B站散片 | 搜索词：`Krenz 透视 作业`、`K大 色彩 公开课` | 未核 | P1–P2 | 透视 8 周作业（K大作业是硬通货） | **未验证：按关键词搜索**（正版为付费课，B站多为学员作业） |
| Marco Bucci / Ctrl+Paint 光色与数字绘画 | YouTube / 官网 | 搜索词：`Marco Bucci 10 minutes to better painting`、`Ctrl+Paint 中文字幕` | 未核 | P1 | 色彩与光影判断力 | **未验证：按关键词搜索**（YouTube 需英文；B站有零散搬运） |

**用法要点**：美术基础在 P0 只占每天 30 分钟，目标不是画好，是「看得懂光」。Proko 只做线条+透视两章；368 集只按目录挑 5 集。**不要在任何绘画课上刷完整合集**。

---

## 2. UE5 零基础入门（界面→资产→材质→灯光→Sequencer→Niagara→MRQ）

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| UE5 零基础入门｜《峡谷深处+战争机器》写实场景搭建（双案例） | B站 | [BV1zg4y1375m](https://www.bilibili.com/video/BV1zg4y1375m/) | 未核（长案例） | **P0** | 一个能截图写实场景，会摆物件/灯光/后处理 | 已验证 |
| UE5 材质：创建你的第一个材质 | B站 | [BV1gBa7zAEED](https://www.bilibili.com/video/BV1gBa7zAEED/) | 未核（单集） | **P0** | 第一个可复用材质（含参数化） | 已验证 |
| 【最新版】UE5 零基础入门教程（完整系列） | B站 | [BV1qYSvBHELW](https://www.bilibili.com/video/BV1qYSvBHELW/) | 未核（系列） | P0–P1 | 系统补全界面/窗口/资产导入 | 已验证（镜像页命中，BV 待二次确认） |
| 2025 年虚幻引擎 5 渲染指南 | B站 | [BV1NUGtzqEhW](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 未核 | P1–P2 | 渲染设置一次讲清（同系列有 5.8 版） | 已验证 |
| Unreal Engine 5.7 过场渲染工作流构建 | B站 | [BV1SaDhBbE7k](https://www.bilibili.com/video/BV1SaDhBbE7k/) | 未核 | P2–P3 | 5.7 专属：Sequencer→MRQ 出片流程 | 已验证（版本正对 5.7.4） |
| 官方：Designing Visuals, Rendering & Graphics | Epic 官方文档 | [dev.epicgames.com](https://dev.epicgames.com/documentation/unreal-engine/designing-visuals-rendering-and-graphics-with-unreal-engine) | 文档 | 全程 | 唯一权威查证源，遇到术语先查这里 | 已验证（搜索命中） |

---

## 3. UE5 材质 / Shader / HLSL

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| Ben Cloward【中英】UE5 高级材质 Advanced Materials | B站搬运 / Ben Cloward | [BV1Yy9zBPEYf](https://www.bilibili.com/video/BV1Yy9zBPEYf/) | 未核（合集） | **P1–P2** | 会写多层混合、法线、顶点动画材质 | 已验证 |
| Ben Cloward 虚幻材质课合集（原声） | B站搬运 / Ben Cloward | [BV137zyYmEP9](https://www.bilibili.com/video/BV137zyYmEP9/) | 未核（单集示例：水反射折射） | P2 | 水面/折射类材质 | 已验证（合集内单集 BV） |
| UE5 材质系统全面教程：入门到精通 | B站 | [BV1Zf1pBgEBt](https://www.bilibili.com/video/BV1Zf1pBgEBt/) | 未核 | P1–P2 | 材质系统全貌脑图 | 已验证（镜像页命中） |
| UE5 基础教程｜材质节点基础 | B站 | [BV1qw4bzZEy5](https://www.bilibili.com/video/BV1qw4bzZEy5/) | 未核（单集） | **P0–P1** | 会连节点（UV/法线/Fresnel） | 已验证 |
| UE4/UE5 HLSL Custom Node（中文专栏） | 知乎 | [zhuanlan.zhihu.com/p/638823646](https://zhuanlan.zhihu.com/p/638823646) | 一篇 | P2 | 能用 Custom 节点塞 HLSL 代码 | 已验证（搜索命中） |
| Ben Cloward YouTube 原频道 | YouTube | 搜索词：`Ben Cloward Unreal Engine shader` | 未核 | P2–P3 | 最系统的免费材质课，B站有搬运 | **未验证：按关键词搜索** |

---

## 4. 影视级写实渲染 / 灯光 / 后期（Lumen、路径追踪、色彩管理、MRQ）

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| UE5 / 写实光照环境全流程 | B站 | [BV1GnqVYtEfC](https://www.bilibili.com/video/BV1GnqVYtEfC/) | 未核 | **P1–P2** | 一套写实光照环境（Lumen+体积雾） | 已验证 |
| 2025 年虚幻引擎 5 渲染指南 | B站 | [BV1NUGtzqEhW](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 未核 | P1–P2 | 渲染参数与画质/性能权衡 | 已验证 |
| Unreal Engine 5.7 过场渲染工作流构建 | B站 | [BV1SaDhBbE7k](https://www.bilibili.com/video/BV1SaDhBbE7k/) | 未核 | P2–P3 | MRQ 出成片（无抖动/正确色彩） | 已验证 |
| 官方：Rendering High Quality Frames with MRQ | Epic 官方文档 | [dev.epicgames.com](https://dev.epicgames.com/documentation/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) | 文档 | P2 | MRQ 参数速查 | 已验证（搜索命中） |
| 官方：高动态范围显示输出（中文文档） | Epic 官方文档 | [docs.unrealengine.com/5.0/zh-CN](https://docs.unrealengine.com/5.0/zh-CN/high-dynamic-range-display-output-in-unreal-engine/) | 文档 | P2 | 搞懂 HDR/色彩空间导出 | 已验证（搜索命中） |
| Youngjo Cho（Coloso 写实灯光课） | Coloso / Youngjo Cho | [coloso.global](https://coloso.global/en/products/3ddesign-choyoungjo-us_2022midyeardeal) | 付费课 | P2–P3 | 影视级灯光审美（**付费、非中文**） | 已验证（搜索命中，**付费**） |
| UNR207 / UNR208（Epic 官方峰会写实渲染场次） | B站 / 官方 | 搜索词：`UNR207 UNR208 虚幻 中文 字幕` | 未核 | P2–P3 | 官方口径的 Lumen/路径追踪实践 | **未验证：按关键词搜索**（未命中可靠 BV，勿轻信网传编号） |

> **注意**：8G 显存是瓶颈。路径追踪只在最终静帧用，动画一律 Lumen。

---

## 5. Blender 零基础（建模→UV→贴图→渲染）+ Blender Python

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| Blender 5.0 全流程课（Blender Guru，中文字幕） | B站搬运 / Blender Guru | [BV1nTL76xEca](https://www.bilibili.com/video/BV1nTL76xEca/) | 未核（全流程） | **P0** | 甜甜圈级完整作品（模型+材质+灯光+渲染） | 已验证（版本正对 5.1） |
| Blender 4.0 零基础入门教程（含全流程案例，已完结） | B站 / 广东-梁朝伟 | [BV11H4y1P7RV](https://www.bilibili.com/video/BV11H4y1P7RV/) | 未核（多 P，含场景动画篇） | **P0** | 界面/建模/UV/动画基础打通 | 已验证 |
| 【精翻中配】Blender 5.0 萌新极速进阶全流程 | B站 | [BV1gDAYzuE2z](https://www.bilibili.com/video/BV1gDAYzuE2z/) | 未核 | P1 | 5.0 新界面下的极速上手 | 已验证 |
| oeasy 玩 Blender 全套（零基础 + Python 脚本建模合集，2026） | B站 / oeasy | [BV1Yvgf6SE6V](https://www.bilibili.com/video/BV1Yvgf6SE6V/) | 未核（大合集） | **P0–P2** | 中文讲解最稳，脚本线直接从这切 | 已验证 |
| 【国语】Blender 插件开发与 Python 编程教程 第 1 卷 | B站 | [BV1GFfsBiE6c](https://www.bilibili.com/video/BV1GFfsBiE6c/) | 未核 | P2 | 写第一个能跑的插件（含 UI 面板） | 已验证 |
| Blender 与 Python 脚本入门实战（写工具/自定义插件） | B站 | [BV1goryB7EL9](https://www.bilibili.com/video/BV1goryB7EL9/) | 未核 | P2 | 批量处理/自动建模脚本 | 已验证（镜像页命中） |
| Blender 官方 Python API 文档 | 官方文档 | [docs.blender.org/api](https://docs.blender.org/api/current/) | 文档 | P1–P3 | 查 `bpy` 的唯一权威源 | 未验证（官方入口，长期稳定） |

**用法要点**：Blender 只学「能出图 + 能写脚本」两件事。建模深度到「会拓扑、会 UV 展开」即停，别往角色雕刻走——TA 岗不考这个。

---

## 6. 图形学：GAMES101 / GAMES202

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| GAMES101 现代计算机图形学入门 | B站 / GAMES-Webinar（闫令琪, UCSB） | [BV1X7411F744](https://www.bilibili.com/video/BV1X7411F744/) | **23 集 / 约 28 小时**（API 实查：100954 秒） | **P1–P2** | 看得懂着色/光照/纹理，能讲清渲染管线 | 已验证（API 级核验：标题+23P+总时长） |
| GAMES202 高质量实时渲染 | B站 / GAMES-Webinar（闫令琪） | [BV1YK4y1T7yY](https://www.bilibili.com/video/BV1YK4y1T7yY/) | 未核（多集） | P2–P3 | 阴影/GI/PBR/SSR/降噪的工程直觉 | 已验证 |

**GAMES101 选章建议（不要 23 集全看，TA 岗只用前 9 讲 + 光线追踪 4 讲）：**

| 范围 | 内容 | 必要性 |
|---|---|---|
| L01–L02 | 概览、线性代数复习 | 只看 L02，1.5× 速通 |
| **L03–L04** | 变换（Model/View/Projection） | **必看**，理解 UE 里相机和坐标 |
| **L05–L06** | 光栅化、抗锯齿、Z-Buffer | **必看**，解释 TAA/锯齿 |
| **L07–L09** | 着色、渲染管线、纹理映射 | **必看**，直接对应材质节点 |
| L10–L12 | 几何（曲线/曲面） | 跳过 |
| **L13–L16** | 光线追踪 | **选看 L13/L15/L16**，对应 Path Tracer |
| L17–L18 | 材质与外观、高级渲染 | **必看 L17**（BRDF/微表面） |
| L19–L20 | 相机/镜头、色彩 | **必看 L20**（色彩管理的地基） |
| L21–L22 | 动画 | 跳过 |

- **作业**：只做 PA0（环境）+ PA1（变换）+ PA2（光栅化）+ PA3（着色）四份，代码交到 GitHub 就当作品集佐证。后面的 PA 不做。
- **GAMES202**：只挑「实时阴影 / 实时全局光照 / PBR 微表面 / SSR / 时间性抗锯齿 / 降噪」相关章节，作业做 1 份即可，目的是**能在面试里接住渲染术语**，不是刷完。

---

## 7. DCC 认知级（Maya / Houdini / Substance 3D）

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| 【3D 建模零基础教学】100 集（3dsMax/Maya/ZBrush 合集） | B站 | [BV1RSLR6HEii](https://www.bilibili.com/video/BV1RSLR6HEii/) | 100 集（标题自述） | P1 | 打开 Maya 能认出菜单，会基础多边形建模 | 已验证 |
| Houdini 20 零基础 30 小时快速入门 | B站 | [BV11S421X79N](https://www.bilibili.com/video/BV11S421X79N/) | 30 小时量级 | P3 | 能做出基础程序化资产（认知级即可） | 已验证 |
| Houdini 并不可怕：初学者系列 | B站 | [BV1ERCpY2Eiw](https://www.bilibili.com/video/BV1ERCpY2Eiw/) | 34.8 万播放合集 | P2–P3 | 理解节点式/程序化思维 | 已验证（镜像页命中） |
| Substance 3D Painter 官方入门 | Adobe 官方 | 搜索词：`Substance 3D Painter 官方教程 中文` | 未核 | P2 | 给自建模型画一套 PBR 贴图 | **未验证：按关键词搜索** |

> **优先级警告**：Maya/Houdini 对 SUN 美术 TA 只是「听得懂同事在说什么」的层级，**P3 之前不要碰**。真花时间的是 Substance Painter（P2 必须会，因为写实渲染要贴图）。

---

## 8. 行业 / 作品集参考

| 资源名 | 平台/作者 | 链接或 BV 号 | 时长/集数 | 阶段 | 学完产出 | 核验 |
|---|---|---|---|---|---|---|
| [UFSH2023]《鸣潮》基于虚幻引擎 4 的多平台效果和性能优化实践 | B站 / 王宏波·库洛游戏 | [BV1BK411v7FY](https://www.bilibili.com/video/BV1BK411v7FY/)（同 av496110559） | 约 1 场演讲 | **P0**（建立目标感）+ P3（细看） | 知道目标公司在意什么：效果与性能的平衡 | 已验证 |
| [UnrealCircle] 鸣潮 TypeScript / PuerTS / V8 优化实践 | B站 / 库洛游戏 王宏波 | [BV1vW4y117Kh](https://www.bilibili.com/video/BV1vW4y117Kh/) | 约 1 场演讲 | P3 | 了解库洛技术栈（工具链方向） | 已验证 |
| [UFSH2025] 主旨演讲（官方字幕） | B站 / Unreal Fest Shanghai | [BV1Fz4bzeEih](https://www.bilibili.com/video/BV1Fz4bzeEih/) | 约 1 场 | P1 | 2025 年官方风向（UE5.7/5.8 特性） | 已验证 |
| ArtStation（作品集标杆） | ArtStation | [artstation.com](https://www.artstation.com/) | — | P1–P3 | 每周拆 3 张 TA/环境作品，反推技术点 | 未验证（官网入口，长期稳定） |
| 80.lv / TalkArtist | 80.lv / TalkArtist | [80.lv](https://80.lv/) ｜ 搜索词：`TalkArtist 技术美术` | — | P2–P3 | 行业访谈/技术拆解，找面试话题 | 未验证：按关键词搜索 |
| GDC（YouTube 官方频道） | GDC / YouTube | 搜索词：`GDC 2025 rendering talk` | — | P2–P3 | 英文术语 + 工程视角 | 未验证：按关键词搜索（无中文字幕，B站有零散搬运） |

---

## 9. 最小启动包：前 4 周只看这 6 个

| # | 资源 | 看多少 | 为什么是它 |
|---|---|---|---|
| 1 | [Blender 4.0 零基础入门（BV11H4y1P7RV）](https://www.bilibili.com/video/BV11H4y1P7RV/) | 前 12P | 中文、系统、有全流程案例，先建立「3D 软件长什么样」 |
| 2 | [Blender Guru 5.0 全流程·中文字幕（BV1nTL76xEca）](https://www.bilibili.com/video/BV1nTL76xEca/) | 跟做 1 遍甜甜圈 | 版本正对 5.1；跟完有第一张能发出去的渲染图 |
| 3 | [UE5 零基础·峡谷深处写实场景（BV1zg4y1375m）](https://www.bilibili.com/video/BV1zg4y1375m/) | 跟做 1 个场景 | UE 破冰最短路径：直接出画面，不先学蓝图 |
| 4 | [UE5 材质：第一个材质（BV1gBa7zAEED）](https://www.bilibili.com/video/BV1gBa7zAEED/) | 全看（单集） | 材质是 TA 的核心手艺，第 1 周就要摸到 |
| 5 | [Proko 绘画基础（BV1RG5CzPEni）](https://www.bilibili.com/video/BV1RG5CzPEni/) | 只做「线条 + 透视」约 10 集 | 美术零基础的最低成本补课，不占大块时间 |
| 6 | [UFSH2023 鸣潮技术分享（BV1BK411v7FY）](https://www.bilibili.com/video/BV1BK411v7FY/) | 看 1 遍，记 10 个术语 | 让你在第 1 周就知道「学这些是为了什么」，抗放弃 |

**不在启动包里但第 5 周立刻开始**：GAMES101（BV1X7411F744）L02–L03 → L05 → L07。

---

## 10. 每个资源的使用方法（看多少 / 做什么 / 产出什么）

| 资源 | 看多少 | 做什么 | 产出 |
|---|---|---|---|
| Blender 4.0 入门（BV11H4y1P7RV） | 前 12P，每天 1.5h × 5 天 | 每看 1P 立刻在 Blender 里复现，不看第二遍 | 5 个练习截图 + 1 份快捷键笔记 |
| Blender Guru 5.0（BV1nTL76xEca） | 全流程 1 遍（约 2–3 天） | 不跳过任何一步，材质参数自己改 3 次数值 | 1 张 1920×1080 渲染图（进作品集初稿） |
| UE5 峡谷深处（BV1zg4y1375m） | 跟做 1 遍 | 换掉全部资产/贴图，做成自己的场景 | 1 个写实场景 + 5 张不同机位截图 |
| UE5 第一个材质（BV1gBa7zAEED） | 全看 | 做成参数化材质（颜色/粗糙度/法线强度可调） | 1 个可复用 Master Material |
| Proko（BV1RG5CzPEni） | 10 集内 | 每天 20 分钟速写，画椅子/盒子 | 30 张透视练习（不用好看，要准） |
| UFSH2023 鸣潮（BV1BK411v7FY） | 1 遍 + 笔记 | 抄下不认识的术语，建一个「术语表」文件 | 10 条术语卡（后面逐个消灭） |
| GAMES101（BV1X7411F744） | 选章 9 讲 + PA0–PA3 | 每讲写 200 字人话总结，作业提交 GitHub | 4 份作业代码仓库 + 1 份渲染管线笔记 |
| GAMES202（BV1YK4y1T7yY） | 挑 5 个主题 | 只求听懂，不求推导 | 1 份「实时渲染名词解释」（面试用） |
| Ben Cloward UE5 高级材质（BV1Yy9zBPEYf） | 每周 2 集 | 每集复刻后立刻改一个参数变成自己的东西 | 5 个材质样本（作品集第 3 张） |
| 写实光照全流程（BV1GnqVYtEfC） | 跟做 1 遍 | 固定一个室内/室外小场景，只练灯光 | 1 组 3 张「同一场景 3 种光」对比图（最能体现 TA 水平） |
| MRQ 工作流（BV1SaDhBbE7k） | 全看 | 用自己场景出一段 5 秒动画 | 1 个 1080p 视频（作品集封面） |
| Blender Python（BV1GFfsBiE6c） | 前 1/3 | 写一个「批量重命名 + 自动对齐」小工具 | 1 个可运行插件 + README |
| oeasy Blender 合集（BV1Yvgf6SE6V） | 按需查 | 当字典用，不顺序刷 | 无（工具型资源） |
| 3D 建模 100 集（BV1RSLR6HEii） | 只挑 Maya 部分前 15 集 | 认识 Maya 菜单即可 | 1 个基础模型 |
| Houdini 20（BV11S421X79N） | P3 再看，前 1/4 | 只做官方入门例 | 1 个程序化小资产 |

---

## 11. 未核验项与兜底搜索词

1. **UNR207 / UNR208**：未找到可信 BV 号。网传编号容易错，**不要按编号搜**，用 `Unreal Fest 写实渲染 中文`。
2. **Krenz 透视/色彩**：正版付费，B站散片多为学员作业合集。用 `Krenz 透视 作业` 找作业范本，正课建议买（这是美术基础投入产出比最高的一笔）。
3. **Marco Bucci / Ctrl+Paint**：YouTube 免费但英文，B站搬运零散。用 `Marco Bucci 色彩 中字`。
4. **Youngjo Cho**：Coloso 付费课、非中文。**P2 之前不要买**，先用 BV1GnqVYtEfC 替代。
5. **Substance Painter 官方中文**：Adobe 官方教程站结构常变，用 `Substance 3D Painter 入门 中文 2025` 搜最新。
6. **GDC / ArtStation / 80.lv / TalkArtist**：给的是官网入口，未逐页核验可用性。
7. **BV1qYSvBHELW（UE5 完整系列）**：仅在镜像站命中标题，BV 号请以 B 站搜索 `UE5 零基础入门教程 最新版` 的结果为准。
8. 所有「未核」时长：本表刻意不填估算值，以页面为准。

---

## 12. 三条执行纪律

1. **一条线一个资源**：每个方向只留 1 个主课（Blender=4.0 入门 / UE=峡谷深处 / 材质=Ben Cloward / 图形学=GAMES101），其余当字典查。收藏 ≠ 学会。
2. **每个资源必须以产出物结束**：表中「学完产出」栏就是验收标准，没产出就是没学。
3. **8G 显存是硬约束**：贴图控 2K、单关卡场景、Path Tracer 只出静帧。
