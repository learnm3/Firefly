---
title: "02 · 电脑环境体检与配置"
order: 2
description: "电脑实测、磁盘清理结果、软件/性能/目录配置。"
draft: false
---

> 体检时间：**2026-11-06** ｜ 检测方式：本机 PowerShell / nvidia-smi / 注册表 / VS Installer / 目录大小扫描
> 结论先说：**硬件完全够用；准备工作已于 2026-11-06 晚完成——E 盘从 19.8GB 清到 266GB，工作区已建好、软件已装、系统已优化，可以直接开始 D1。**

---

## 0. 准备工作完成情况（2026-11-06 晚）

| 项目 | 结果 |
| --- | --- |
| 工作区 | ✅ `E:\TA_Workspace`（00_Admin / 01_Learning / 02_Portfolio / 03_Assets / 04_Refs / 05_Renders / 06_Docs / 07_Backup） |
| UE 缓存 | ✅ `E:\UE_DDC` 已建；用户环境变量 `UE-LocalDataCachePath=E:\UE_DDC` |
| E 盘清理 | ✅ 删除 `E:\解包\FModel\Output`（217.9GB）+ 重复 RTTR zip（28.85GB）→ **E 剩余 266GB** |
| C 盘清理 | ✅ 删除 7 个视频（约 26.8GB）+ pip/uv/poetry/npm/Temp/DXCache（约 8.5GB）→ **C 剩余 138GB** |
| 项目归位 | ✅ `E:\learn ue` 工程移入 `01_Learning`；P2 种子工程复制到 `02_Portfolio\P2_NeonStreet` |
| 工具资产 | ✅ Fuluoluo 相关解包资产、FModel/WuWa2UE、弗洛洛修模 zip 移入 `03_Assets` |
| PipeCheck | ✅ 复制到 `02_Portfolio\P5_DCC_Tool\PipeCheck`，git init + 首次提交 |
| 快捷方式 | ✅ 桌面：TA学习面板 / TA工作区 / 技术向30天 / 今日行动 / OBS Studio / PureRef / DaVinci Resolve |
| 系统优化 | ✅ **已完成**：电源=高性能；Defender 排除 5 个路径（E:\UE_5.7、E:\TA_Workspace、E:\UE_DDC、Blender 目录、TA 目录） |
| 软件 | ✅ OBS Studio 33.0.1（便携版）+ PureRef 2.1.3（便携版）+ DaVinci Resolve 21.2.0.6（官方安装）已装好，桌面有快捷方式；详见 `E:\TA_Workspace\00_Admin\已安装软件.md` |
| 待你手动 | ⏳ 只剩可选项：NVIDIA 控制面板指定独显、显示器色域确认、Epic/Fab 登录 |

---

## 1. 硬件实测

| 部件 | 实测结果 | 评级 | 说明 |
| --- | --- | --- | --- |
| 机型 | ASUS TUF Gaming A16 `FA607PI` | ✅ | 游戏本，性能释放好；注意插电 + 垫高散热 |
| CPU | AMD Ryzen 9 7940HX，16 核 32 线程 | ✅ 优秀 | UE 编译、烘焙、Blender 渲染、Houdini 模拟都够 |
| GPU | NVIDIA RTX 4070 Laptop，**8GB 显存**，驱动 617.14（NVIDIA App 11.0.9） | ✅ 够用 / ⚠️ 显存是上限 | Lumen/Nanite/路径追踪都支持；**8GB 显存决定你主攻 1080p** |
| 核显 | AMD Radeon 610M | — | 平时省电；UE/Blender 必须指定独显 |
| 内存 | **32GB**（实测 31.2GB；当前空闲约 10GB） | ✅ 达标 | 同时开 UE + 浏览器 + 参考图会吃满，渲染时关掉多余标签页 |
| 系统 | Windows 11 | ✅ | 保持更新，但大版本更新前先备份项目 |
| 屏幕 | 注册表里出现过 4 个显示器 ID（CSW1632 / MAY2408 / SHS2380 / SKG2728） | ⚠️ 待确认 | 无法远程确认当前屏幕色域；见 §8 |
| 电源计划 | **高性能**（已切换） | ✅ | UE 编译/渲染不再降频 |
| Defender 排除项 | **已加 5 个路径**（UE/工作区/DDC/Blender/TA 目录） | ✅ | 编译和资产导入不被实时扫描拖慢 |

> **一句话**：这台机器是"能跑影视级写实"的入场券，但 8GB 显存意味着你要学会**做取舍**（分辨率、贴图、光影精度）——这恰好也是 TA 岗位要求的"性能约束下实现艺术"。

---

## 2. 磁盘实测（已清理完成）

| 盘 | 总容量 | 剩余 | 状态 | 用途建议 |
| --- | --- | --- | --- | --- |
| C: | 926.3 GB | **138.0 GB** | ✅ 充足 | 系统 + 软件；保持 ≥60GB 空闲 |
| D: | 476.9 GB | **51.6 GB** | 🟡 暂不动 | 游戏按你的选择全部保留；后续可作备份盘 |
| E: | 476.9 GB | **266.0 GB** | ✅ 充足 | 引擎 28GB + TA 工作区；清理后剩余 |

### 大目录实测（清理前记录，已完成）

| 位置 | 占用 | 怎么处理 |
| --- | --- | --- |
| **E:\解包** | **218.8 GB** | FModel 解包导出（鸣潮等）；**只保留弗洛洛练习要用的资产，其余删除** → 预计释放 150GB+ |
| **E:\计算机图形学** | **83.8 GB** | 课程/资料；移到移动硬盘或网盘，需要时再取 → 释放 80GB+ |
| D:\Games + D:\miHoYo Launcher + D:\steam | 93.8 + 83.9 + 23.8 = **201.5 GB** | 只留 1–2 个常玩游戏，其余卸载/迁移 → 释放 100GB+ |
| C:\Program Files | 110.1 GB | 卸载不用的大型软件；VS/UE 别动 |
| C:\Users\11060\Desktop | 96.5 GB | 旧压缩包/素材/项目缓存归档到网盘或移动硬盘 |
| C:\Users\11060\Documents | 90.1 GB | 微信/QQ 文件、下载、旧资料 → 迁移到 E/D 或网盘 |
| C:\Users\11060\AppData\Local | 84.3 GB | Temp/浏览器缓存/pip/npm/旧版本程序 → 清 20GB+ |
| E:\Anaconda | 28.9 GB | 保留（工具环境） |
| E:\UE_5.7 | 28.0 GB | 保留（引擎） |
| E:\learn ue | 4.4 GB | 旧教程工程，迁走/清缓存 |

**结论**：最划算的顺序是 **E（解包 + 课程资料，可释放 ~230GB）→ D（游戏，可释放 ~100GB）→ C（临时文件 + 桌面旧包）**。
清理后建议把工作区放在 **`E:\TA_Workspace`**（和引擎同盘，省事；目标 E 剩 ≥150GB），D 作为资产/备份盘。如果你不想动游戏，就把工作区放 D（清到 ≥100GB）。

### 磁盘清理结果（已完成，2026-11-06）

| 操作 | 释放 | 说明 |
| --- | --- | --- |
| 删除 `E:\解包\FModel\Output` | **217.9 GB** | 只保留 Fuluoluo 相关资产（已移到 `03_Assets\WuWa_Fuluoluo`）与 FModel 工具 |
| 删除 E 盘重复 RTTR zip | **28.85 GB** | 解压目录保留（17.5GB） |
| 删除 C 盘 7 个视频 | **约 26.8 GB** | 按你的确认删除 |
| 清理 C 盘缓存 | 约 **8.5 GB** | pip / uv / poetry / npm / Temp / DXCache |
| 整理工程/缓存 | 约 0.4 GB | TA 工程旧缓存、`E:\learn ue` 归位 |

**保留**：GAMES101/104/105/106/202 全部课程、所有游戏、FModel 工具（以后可重新导出资产）。

> **环境红线**：C 剩 <40GB / 工作区盘 <50GB / 任意盘 <10GB 时，**停止下载新资产**，先清理。每周末看一眼。

---

## 3. 软件实测

### 已安装（可直接用）

| 软件 | 版本 | 路径 | 用途 |
| --- | --- | --- | --- |
| Unreal Engine | **5.7.4** | `E:\UE_5.7` | 核心引擎 ✅ |
| Blender | 5.1 / 4.3 / 4.5 / 5.0（多版本） | `C:\Program Files\Blender Foundation\Blender 5.1` | 建模 / UV / 脚本 ✅ |
| Visual Studio 2022 | 17.14 Community，**NativeGame + ManagedDesktop 工作负载已装** | `C:\Program Files\Microsoft Visual Studio\2022\Community` | UE C++ 就绪 ✅ |
| Python | 3.9.13（用户安装）、3.14.3、Anaconda | 用户目录 / E 盘 | 脚本 / 工具 ✅ |
| Git | 2.53 | — | 版本管理 ✅ |
| Node.js / npm | 24.18 / 12.0 | — | 博客/面板开发 ✅ |
| VS Code | 1.144 | `E:\Microsoft VS Code` | 代码 / 脚本 ✅ |
| 7-Zip / WinRAR / Everything / PowerToys | 最新 | — | 工具 ✅ |
| FModel / 解包工具 | — | `E:\解包` | 学习用；**注意版权，别公开发布解包资产** |
| Office 2019 | — | — | 文档 ✅ |

### 缺失（按优先级装）

> 2026-11-06 已装好：OBS Studio、PureRef、DaVinci Resolve（见 `E:\TA_Workspace\00_Admin\已安装软件.md`）。下表保留给换机参考。

| 优先级 | 软件 | 为什么 | 怎么装 |
| --- | --- | --- | --- |
| ✅ 已完成 | **PureRef**（便携版） | 参考图拼板（美术/拉片必备） | 已解压到 `03_Assets\Tools\PureRef`，桌面有快捷方式 |
| ✅ 已完成 | **OBS Studio 33**（便携版） | 录屏：作品演示、Bug 复盘、Showreel | 已解压到 `03_Assets\Tools\OBS`，桌面有快捷方式 |
| **P1 一个月内** | **Substance 3D Painter** | 贴图绘制，TA 常用（学生可试用/订阅；先用 Blender 纹理绘制过渡） | adobe.com |
| **P1 一个月内** | **DaVinci Resolve** | 免费调色 + 剪辑，作品集出片用 | blackmagicdesign.com |
| **P1 两个月内** | **Maya 学生版** | 公司常用 DCC，简历关键词（Autodesk 教育免费 1 年） | autodesk.com/education |
| **P2 三个月内** | **Houdini Apprentice** | 程序化/特效认知，免费非商业 | sidefx.com |
| 不装 | 3ds Max / C4D / Marmoset | 现阶段用不上，别分散精力 | — |

### 账号（本周注册/登录）
Epic Games（UE + Fab/Megascans 免费资产）、ArtStation（作品集）、TalkArtist（国内 TA 社区）、GitHub（工具代码）、B站 + 知乎（输出）、百度网盘（备份）。**统一昵称**，方便 HR 搜到你。

---

## 4. GPU 与性能设置（8GB 显存专属）

### 系统层
- [ ] 电源计划改为 **高性能**（设置 → 系统 → 电源 → 电源模式 → 最佳性能；或 `powercfg /setactive SCHEME_MIN`）。
- [ ] NVIDIA 控制面板 → 管理 3D 设置 → 程序设置：`UnrealEditor.exe`、`blender.exe` 指定 **高性能 NVIDIA 处理器**；全局设置里首选图形处理器选独显。
- [ ] ASUS Armoury Crate 开 **性能/增强模式**，插电使用，垫高散热。
- [ ] 渲染/编译时关掉浏览器多余标签页（32GB 内存当前可用只有约 10GB）。

### UE5 项目设置（新建项目时照抄）
- 分辨率：**1080p 为主**；出图可用 2K（MRQ 慢慢渲）；不要碰 4K 实时。
- 项目设置 → 渲染：
  - `Dynamic Global Illumination = Lumen`，`Reflections = Lumen`
  - `Virtual Shadow Maps = 开`（阴影分辨率别全开最高）
  - `Nanite = 开`
  - `Auto Exposure = 关`（美术控制曝光）、`Motion Blur = 关`（静帧/干净画面）
  - `Default RHI = DX12`，Shader Model 6
  - 纹理流送池（`r.Streaming.PoolSize`）**3500–4500MB**，别设满 8GB
- 材质：2K 贴图为主，4K 只给特写；同类材质尽量共用母材质 + 实例。
- Lumen 硬件光追（Hardware Ray Tracing）按需开：更真实但更吃显存，8GB 下先做软件光追版本。
- 每次项目结束记录：分辨率、帧率、显存占用、DrawCall、三角面数（作品集会用到）。

> 你已有的 `SUN_TA_01/Config/DefaultEngine.ini` 已经配好 Lumen + VSM + Nanite + SM6 + 关自动曝光/动态模糊，**可以直接当模板复用**。

---

## 5. 软件配置清单

### UE5
- [ ] 插件启用：`Python Editor Script Plugin`、`Editor Scripting Utilities`、`Niagara`、`Movie Render Queue`（MRQ）、`Modeling Tools Editor Mode`。实验性插件（Substrate 等）先不开，稳定优先。
- [ ] 自动保存 10 分钟；开启"保存时编译"提醒。
- [ ] 新建模板建议：**Film, Video, and Live Events**（写实影视向）或 Blank + Lumen。
- [ ] 项目路径统一在 `E:\TA_Workspace\02_Portfolio\...`，不要放桌面/中文路径/OneDrive。

### Blender
- [ ] 主用 **Blender 4.3 LTS**（教程兼容性最好）；5.1 用来试新功能。教程若基于 4.x，别用 5.x 硬跟。
- [ ] 单位：Metric，1.0；导出 FBX 时勾选 `Apply Scalings: FBX All`（避免 UE 里模型巨大，你已踩过 0.01 缩放的坑）。
- [ ] 启用内置插件：`Node Wrangler`、`LoopTools`；已装的 PSK 导入插件保留。
- [ ] 不要开 "Auto Run Python Scripts" 跑来源不明的脚本。

### Python / 工具链
- [ ] Blender 插件开发用 **Blender 自带 Python**（版本必须匹配）；普通脚本用系统 Python。
- [ ] 建议 `conda create -n ta python=3.11`（放 E 盘）作为工具环境；资产检查工具先只用标准库 + Pillow。
- [ ] Git 仓库只管"代码 + 文档 + 小图"，**不要提交 .uasset/.blend/大资产**；大文件用网盘/移动硬盘备份。

### Windows
- [ ] Defender 排除项（设置 → 病毒和威胁防护 → 管理设置 → 排除项）：`E:\UE_5.7`、`E:\TA_Workspace`、`E:\UE_DDC`、`C:\Program Files\Blender Foundation`。
- [ ] 关闭 OneDrive 对 UE 项目/工作区的同步（会锁文件、拖慢编译）。
- [ ] 页面文件保持"系统管理"即可（当前提交上限 45.9GB）；若 UE 编译报内存不足，再把页面文件设到 E 盘 32–64GB。
- [ ] 关闭"传递优化"以外的后台下载；Windows 大更新前备份项目。

---

## 6. 项目目录规范（建一次，用 12 个月）

根目录：`E:\TA_Workspace`（**已创建，2026-11-06**；P2 种子工程位于 `02_Portfolio\P2_NeonStreet`）。

```
E:\TA_Workspace\
├─ 00_Admin\          账号/订阅/计划/密码提示
├─ 01_Learning\       跟教程的工程（可整目录删）
├─ 02_Portfolio\
│  ├─ P1_Interior\        UE 室内写实小景（M1）
│  ├─ P2_NeonStreet\      UE 霓虹街角（v0.5 主作品）
│  ├─ P3_ShaderPack\      材质/Shader 包
│  ├─ P4_CharacterVFX\    角色渲染 + Niagara
│  └─ P5_DCC_Tool\        Blender/UE 管线工具
├─ 03_Assets\          原始资产库（Megascans/Fab/HDRI/模型，只读不改）
├─ 04_Refs\            参考图 + PureRef 拼板
├─ 05_Renders\         渲染输出（按 项目/日期 分组）
├─ 06_Docs\            Breakdown、笔记、简历、作品集文案
└─ 07_Backup\          每周备份（脚本/文档/小图）
```

**规则**
1. 原始资产解压到 `03_Assets` 后不再修改；项目里只放副本。
2. 每个项目必须有 `README.md`：目标、技术点、截图、性能数据、踩坑。
3. 命名：`P2_NeonStreet_20270220_v03.png`（项目_日期_版本），别用"最终版2新"。
4. 每周日备份 `06_Docs` + 渲染图 + 工具代码到网盘/GitHub。

---

## 7. 准备工作：已完成 + 待你手动

### 已完成（2026-11-06，由我执行）
- [x] 建 `E:\TA_Workspace` 目录树 + `E:\UE_DDC`
- [x] 清 E 盘（解包导出 217.9GB + 重复 zip 28.85GB）
- [x] 清 C 盘（7 个视频 26.8GB + 缓存 8.5GB）
- [x] 工程/资产归位（`01_Learning`、`02_Portfolio\P2_NeonStreet`、`03_Assets`）
- [x] PipeCheck 复制到 `P5_DCC_Tool` 并 git init
- [x] 桌面快捷方式（TA学习面板 / TA工作区 / 技术向30天）
- [x] 环境变量 `UE-LocalDataCachePath=E:\UE_DDC`
- [x] 生成 `环境检测报告.txt`

### 待你手动（只剩可选项）
- [x] **管理员优化**：电源=高性能、Defender 排除已加（2026-11-06 已完成）
- [x] **PureRef / OBS Studio**：便携版已就位（桌面快捷方式）
- [x] **DaVinci Resolve 21.2**：已安装（官方签名安装包，`Resolve.exe` 21.2.0.6），P2 出片可直接用
- [ ] 登录 Epic/Fab，领免费 Megascans 资产（先下 10 个 HDRI + 20 个材质）
- [ ] NVIDIA 控制面板指定 UE/Blender 用独显；确认显示器型号/色域
- [ ] 打开 `学习面板.html` → 技术 Tab → 勾掉 D1

---

## 8. 屏幕与色彩（美术方向待办）

- 游戏本屏幕常见 100% sRGB / 165Hz，但**不能靠猜**。确认方法：Windows 设置 → 系统 → 显示 → 高级显示 → 查看显示器型号；到官网查色域参数。
- 在确认之前：**不要凭肉眼"调准颜色"**。用参考图 + 数值（色温 6500K、对比度、直方图）作为判断依据；调色交给 DaVinci Resolve。
- 有条件时外接一台 **100% sRGB / 出厂校色** 的显示器（优先级低于软件和作品，别现在花钱）。
- Laptop 屏亮度建议 60–70%，环境光避免直射；调色时关掉夜间模式/护眼模式。

---

## 9. 每周体检（1 分钟）

双击 `tools/check_env.ps1`，或者手动看三件事：
1. 三个盘剩余空间是否高于红线（C 40 / 工作区盘 50 / 任意盘 10 GB）。
2. NVIDIA 驱动是否正常（nvidia-smi 能跑）。
3. UE 项目是否能打开、DDC 是否堆到 60GB 上限。

> 环境不是一次配好就完事；它是你的"工位"。工位乱，学得慢。

---

## 10. 环境问题速查

| 现象 | 优先检查 |
| --- | --- |
| UE 打开项目很慢 / 卡顿 | DDC 是否在机械盘/空间不足；Defender 是否排除；显存是否被浏览器占满 |
| 编译着色器卡在 0% | 关掉其他 GPU 程序；检查 C/D/E 空间；重启编辑器 |
| 模型导入巨大/极小 | Blender 单位 + FBX 缩放；UE 导入时缩放 0.01 或 100 |
| 材质发黑/贴图丢失 | 贴图路径、sRGB/法线压缩设置、UV 通道 |
| 渲染出图发灰/过曝 | 关 Auto Exposure；检查 PostProcess 曝光补偿；色彩空间 |
| Blender 插件装了没反应 | Blender 4.2+ 用 Extensions 系统；确认版本目录匹配 |

---

*配套脚本：`tools/check_env.ps1`（体检）、`tools/setup_workspace.ps1`（建目录树）｜ 下一篇：`03_12个月学习路线图.md`*
