---
title: "10 · 零基础 10 天重启"
order: 10
description: "零基础 10 天重启：每天 40–60 分钟恢复 UE 手感。"
draft: false
---

> 你说"很多东西忘了 / 没完全实现"——正常。**不用重装环境、不用重看长课、不用从头刷 GAMES101。**
> 这份计划做一件事：用 10 天、每天 40–60 分钟，把"打开 UE 会动、会放东西、会材质、会打光、会截图"重新变成肌肉记忆，产出 2 张能看的图。
> **方向：程序向 TA**——技术主线 70%，美术只做每天 10–15 分钟"判断"训练；GAMES101 从第 11 天起每周 2 讲穿插。
> 配套视频引导页：`技术向/零基础10天重启_视频引导.html`（桌面快捷方式：零基础10天重启）

---

## 0. 先回答：GAMES101 还要看吗？

**要看，但不是前 10 天；第 11 天起每周 2 讲，选 10–11 讲，不刷全课。**

原因：
- 你是**程序向 TA**：图形学是底子，但不需要先刷完整门课才动手；先用 10 天恢复 UE 手感，第 11 天起把 GAMES101 作为"每周 2 讲"的理论线穿插。
- GAMES101 全课 23 集 / 约 28 小时；程序向 TA 真正要反复用的是 10–11 讲，其余当字典。
- 面试需要的是"听得懂术语、能接住追问"，并能把它和 UE 里的参数对上。

**什么时候看**：第 11 天起，每周 2 讲；先保证 UE 动手，不要为了刷课停主线。选看：

| GAMES101 讲 | 内容 | 为什么看 | 链接（B站，p=集数） |
| --- | --- | --- | --- |
| L03 | 变换（Model/View/Projection） | 理解 UE 里的相机与坐标 | [p=3](https://www.bilibili.com/video/BV1X7411F744/?p=3) |
| L05–L06 | 光栅化、抗锯齿、Z-Buffer | 解释锯齿/TAA/深度 | [p=5](https://www.bilibili.com/video/BV1X7411F744/?p=5) / [p=6](https://www.bilibili.com/video/BV1X7411F744/?p=6) |
| L07–L08 | 着色、渲染管线 | 对应材质节点/光照 | [p=7](https://www.bilibili.com/video/BV1X7411F744/?p=7) / [p=8](https://www.bilibili.com/video/BV1X7411F744/?p=8) |
| L09 | 纹理映射 | 对应 UV/贴图/Texel | [p=9](https://www.bilibili.com/video/BV1X7411F744/?p=9) |
| L13 | 光线追踪概念 | 对应 Lumen/Path Tracer | [p=13](https://www.bilibili.com/video/BV1X7411F744/?p=13) |
| L15–L16 | 光追进阶（加速、蒙特卡洛） | 理解 Path Tracer 的噪声/收敛 | [p=15](https://www.bilibili.com/video/BV1X7411F744/?p=15) / [p=16](https://www.bilibili.com/video/BV1X7411F744/?p=16) |
| L19–L20 | 相机/镜头、色彩 | 对应曝光/景深/色彩管理 | [p=19](https://www.bilibili.com/video/BV1X7411F744/?p=19) / [p=20](https://www.bilibili.com/video/BV1X7411F744/?p=20) |

**看法**：1.25x，每周 2 讲（30–40 分钟）；看完立刻在 UE 里找一个对应参数验证；**PA1/PA2 可选**（代码放 GitHub 是程序向证据），PA3 选做，不追 PA4+。
**GAMES202**：现在不看；等做 PBR/阴影专项时选看「实时阴影 / IBL / PBR」3 个主题即可。

---

## 1. 10 天总览

| 天 | 只做这一件事 | 视频参考 | 产出 |
| --- | --- | --- | --- |
| D1 | UE5 界面 + 移动视角 + 放物体 | UE5 新手入门（只看前 2–3 集） | 1 张"三个方块"截图 |
| D2 | 材质第一课：颜色/粗糙度/金属度 | 第一个材质 + 材质节点基础 | 3 张材质球截图 |
| D3 | 灯光第一课：主光 + 天光 + 3 个角度 | 室内灯光全流程（前 10 分钟） | 3 张灯光对比图 |
| D4 | 相机与截图：Camera Actor + F9 | 新手课里的"摄像机"章节 | 1 张 1920×1080 成图 |
| D5 | 后期与曝光：PPV + Exposure -1/+0.5 | 2025 渲染指南 | 2 张曝光对比图 |
| D6 | 搭一个 5 物件的小场景 | 峡谷深处小案例 | 1 张成图 + 1 张白模 |
| D7 | 复盘 + 发布 + 勾 D1 | 无 | 3 行笔记 + 1 条动态 |
| D8 | Blender 界面 + 建一个简单道具 | Blender 4.0 入门（只看基础章节） | 1 个道具 `.blend` |
| D9 | 导出 FBX → 导入 UE → 赋材质 | Blender→UE 资产流程（导出/导入章节） | 道具进 UE 的截图 |
| D10 | 组合 + 第二张成图 + 勾 D2 | 无 | 第二张成图 + 3 行笔记 |

**每天规则**
- 视频最多看 20 分钟：**看 5–10 分钟就暂停，动手做**；做不出来先跳过，明天继续。
- 不追求好看，追求"今天有一个能截图的东西"。
- 做完在面板技术 Tab 勾掉对应天（D1/D2）。
- 卡住超过 30 分钟：把"我在做什么/现象/试过什么"发我，不要死磕。

---

## 2. 每天具体做什么

### D1 · UE5 界面 + 移动 + 放物体（40 分钟）
1. 打开 `E:\TA_Workspace\02_Portfolio\P2_NeonStreet\P2_NeonStreet.uproject`。
2. 看视频（任选一个，只看前 2–3 集/前 30 分钟）：
   - [GenJi UE5.1 全中文新手入门](https://www.bilibili.com/video/BV1Cd4y1V7G5/)（287 万播放，看界面/移动/放置）
   - 或 [星露 UE5 零基础完整系列](https://www.bilibili.com/video/BV1qYSvBHELW/)（138 万播放）
3. 动手：鼠标左键选物体、右键+WASD 移动视角、F 聚焦；放 1 个 Plane + 3 个 Cube（拖进视口或 Place Actors）。
4. 保存（Ctrl+S）；F9 截图存 `E:\TA_Workspace\05_Renders\零基础\Day1_三个方块.png`。

### D2 · 材质第一课（40 分钟）
1. 看：[UE5 创建第一个材质](https://www.bilibili.com/video/BV1gBa7zAEED/) 11:34 + [材质节点基础](https://www.bilibili.com/video/BV1qw4bzZEy5/) 6:27。
2. 新建材质 `M_Basic`：BaseColor 改颜色、Roughness 0.2/0.5/0.8、Metallic 0/1；每个参数做一个材质实例。
3. 把 3 个 Cube 分别赋不同实例；截图 3 张 → `05_Renders/零基础/Day2_材质球_*.png`。
4. 写 1 行：粗糙度/金属度分别改变画面的什么。

### D3 · 灯光第一课（40 分钟）
1. 看：[UE5 室内灯光全流程](https://www.bilibili.com/video/BV1VTtyzeENo/) 的前 10 分钟（项目设置/主光）。
2. 放 DirectionalLight + SkyLight + SkyAtmosphere；同一机位换 3 个主光角度/强度，各截 1 张。
3. 存 `05_Renders/零基础/Day3_灯光_01/02/03.png`。
4. 观察：阴影方向、明暗对比、天光补色。

### D4 · 相机与截图（40 分钟）
1. Place Actors → Camera Actor，调整机位；视口左上角切到这个 Camera（Pilot）。
2. 学习构图：视觉中心/三分法/前景中景背景（手机参考图也行）。
3. F9 截图 1920×1080 → `05_Renders/零基础/Day4_相机成图.png`。
4. 保存；面板记录 Day4。

### D5 · 后期与曝光（40 分钟）
1. 看：[2025 虚幻引擎 5 渲染指南](https://www.bilibili.com/video/BV1NUGtzqEhW/) 13:06。
2. 放 PostProcessVolume，勾 Infinite Extent；Exposure Compensation 设 -1.0 截一张、+0.5 截一张。
3. 存 `05_Renders/零基础/Day5_曝光_-1.png` 和 `Day5_曝光_+0.5.png`。
4. 写 1 行：哪张更适合夜景/室内，为什么。

### D6 · 搭一个小场景（60 分钟）
1. 看：[UE5 峡谷深处写实场景小案例](https://www.bilibili.com/video/BV1zg4y1375m/) 11:05（只看搭建思路）。
2. 用 5 个物件（2 个 Box + 2 个 Cylinder + 1 个 Plane）摆一个有前后层次的小场景；给 3 个不同材质。
3. 按 D3/D5 的方法打光 + 曝光；截 1 张白模 + 1 张成图 → `05_Renders/零基础/Day6_*`。

### D7 · 复盘 + 发布（30 分钟）
1. 把 D1–D6 的图按顺序看一遍，选 1 张最好的。
2. 写 3 行：我做了什么 / 卡在哪 / 下周先学什么。
3. 发 1 条 B站动态或朋友圈（哪怕只有一张图）。
4. 面板：技术 Tab 勾 D1；写周复盘。

### D8 · Blender 界面 + 一个道具（50 分钟）
1. 看：[Blender 4.0 零基础入门](https://www.bilibili.com/video/BV11H4y1P7RV/) 的"界面/移动/建模基础"章节（只看 3–5 集，不整刷）。
2. 建一个简单硬表面道具（箱子/灯柱/杯子），保存 `.blend` 到 `01_Learning\Blender_NeonSign` 同级目录。
3. 学会：移动 G / 旋转 R / 缩放 S / 编辑模式 Tab / 挤出 E。

### D9 · Blender → UE 管线（50 分钟）
1. Blender 导出 FBX：勾 `Apply Scalings: FBX All`，`-Z Forward / Y Up`。
2. UE 导入：检查缩放/法线/材质槽/UV；导入后赋 `M_Basic` 材质实例。
3. 截图保存 → `05_Renders/零基础/Day9_导入UE.png`。
4. 记 3 条踩坑（单位/缩放/材质槽/UV）。

### D10 · 组合 + 第二张图（50 分钟）
1. 把 D9 的道具放进 D6 场景；调 1 次灯光/曝光。
2. F9 出第二张成图 → `05_Renders/零基础/Day10_成图2.png`。
3. 写 3 行：这次比 Day6 好在哪、差在哪。
4. 面板：技术 Tab 勾 D2；准备进入 P2 正式项目。

---

## 3. 视频清单（2026-11-06 B站 API 核验）

| 视频 | 数据 | 用在哪天 |
| --- | --- | --- |
| [GenJi UE5.1 全中文新手入门](https://www.bilibili.com/video/BV1Cd4y1V7G5/) | 472:54 · 287 万播放 | D1（只看前 2–3 集） |
| [星露 UE5 零基础完整系列](https://www.bilibili.com/video/BV1qYSvBHELW/) | 400:40 · 138 万播放 | D1 备选 |
| [UE5 创建第一个材质](https://www.bilibili.com/video/BV1gBa7zAEED/) | 11:34 | D2 |
| [UE5 材质节点基础](https://www.bilibili.com/video/BV1qw4bzZEy5/) | 6:27 | D2 |
| [UE5 室内灯光全流程](https://www.bilibili.com/video/BV1VTtyzeENo/) | 21:54 · 1.2 万播放 | D3（前 10 分钟） |
| [2025 虚幻引擎 5 渲染指南](https://www.bilibili.com/video/BV1NUGtzqEhW/) | 13:06 | D5 |
| [UE5 峡谷深处写实场景小案例](https://www.bilibili.com/video/BV1zg4y1375m/) | 11:05 | D6 |
| [Blender 4.0 零基础入门](https://www.bilibili.com/video/BV11H4y1P7RV/) | 1604:40 · 173 万播放 | D8（只看基础章节） |
| [Blender 到 UE5 资产流程](https://www.bilibili.com/video/BV1N1Yk6EEwD/) | 481:04 | D9（只看导出/导入章节） |
| [GAMES101](https://www.bilibili.com/video/BV1X7411F744/) | 1682:34 · 385 万播放 | **第 11 天起每周 2 讲，选 10–11 讲** |

---

## 4. 第 11 天以后（进入程序向 TA 主线）

- 回到 `09_技术向_30天启动.md` 的 D1（P2 灯光/曝光对比），你会发现自己已经会一半了。
- 然后 D2 材质、D3 后期/MRQ、D4 资产、D5 Rim Light；第 2 周起写 Custom Node/HLSL。
- **GAMES101 从第 11 天起每周 2 讲**（按 `09` §0.5 的 10–11 讲清单），PA1/PA2 可选。
- 每天 10–15 分钟美术判断（拉片/看图）；P1 场景会自然接上，作品集从 Day6/Day10 的图开始长。

---

## 5. 卡住怎么办

1. 先看视频对应片段（不要重看整集）。
2. 用 `ta_guide.help()` 查工具命令；场景空就 `ta_guide.setup_lighting_scene()`。
3. 30 分钟搞不定 → 把"我在做什么 / 现象 / 试过什么"三段发我，附截图。
4. 当天没做完不补，第二天继续——**连续 10 天每天 40 分钟 > 周末突击 5 小时**。
