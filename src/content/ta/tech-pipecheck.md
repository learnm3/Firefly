---
title: "技术向 · PipeCheck 插件说明"
order: 26
description: "Blender 资产检查插件 v0.1：安装、使用、扩展路线。"
draft: false
---

> 一个**能装、能跑、能改**的 Blender 插件：检查命名 / 三角面 / UV / 材质槽 / 贴图尺寸，输出 HTML + CSV 报告，并支持一键导出选中物体为 FBX。
> 用途：`09_技术向_30天启动.md` 第 3 周（D17–D21）的起步工程，也是作品集 P5「DCC 管线工具」的 v0.1。

---

## 1. 安装（Blender 4.2+ / 5.x）

1. 打开 Blender → `Edit → Preferences → Add-ons`。
2. 右上角下拉菜单（或 Add-ons 页面顶部）→ **Install from Disk...**。
3. 选择本文件夹里的 `pipecheck.py` → 勾选启用 **PipeCheck - TA Asset Checker**。
4. 3D 视图按 `N` → 找到 **PipeCheck** 标签页。

> 如果 Blender 版本提示扩展系统（Extensions），用 `Install from Disk` 安装单个 .py 仍然可用；若失败，把 `pipecheck.py` 复制到：
> `%APPDATA%\Blender Foundation\Blender\<版本>\scripts\addons\` 后重启 Blender。

## 2. 使用

1. 打开你的 .blend 文件（建议先保存，报告会写在 .blend 同级的 `pipecheck_reports/`）。
2. `N` 面板 → PipeCheck：
   - **Prefix**：命名前缀（默认 `SM_`；留空则不检查前缀）
   - **Max Tris**：单物体三角面上限（默认 50000）
   - **Max Tex**：贴图边长上限（默认 2048）
   - **Export Dir**：FBX 导出目录（默认 `//export`）
3. 点 **检查并生成报告**：几秒后面板显示汇总，报告文件路径显示在面板里。
4. 点 **打开报告**：浏览器打开 HTML 报告（红黄绿分级）。
5. 选中物体 → 点 **导出选中为 FBX**：按 UE 约定导出（`FBX All` 缩放、`-Z Forward / Y Up`）。

## 3. 报告内容

- 每个网格：命名、三角面、UV 层数、材质槽数、未应用缩放、问题列表
- 贴图：尺寸、是否超过上限、是否非 2 的幂、命名前缀
- 汇总：总物体数、总三角面、错误数、警告数
- 输出：`pipecheck_YYYYMMDD_HHMMSS.html` + `.csv`

## 4. 已知局限（v0.1，面试时如实说）

- 只检查当前场景里可见的网格对象，不递归集合/库链接。
- 贴图检查基于材质节点里的 `TEX_IMAGE` 节点的 `image`，不检查打包/外部路径。
- 命名规范只做了"合法字符 + 前缀"，没有做项目级白名单。
- 未做 LOD / 材质槽合并 / 骨骼检查。
- 单文件插件，未做本地化（中英混杂）。

## 5. 你的作业（把 v0.1 做成 v1.0，也是 P5 的路线）

| 周 | 扩展 | 验收 |
| --- | --- | --- |
| 1 | 加 LOD 检查（`_LOD0/1/2` 命名与数量） | 报告里出现 LOD 问题 |
| 2 | 加材质槽检查（空槽、重复材质、材质命名） | 能发现空材质槽 |
| 3 | 加贴图路径/打包检查 + 批量多文件 | 能对一个文件夹批量出报告 |
| 4 | 加"按项目规范配置"（JSON 配置：前缀/上限/白名单） | 换项目不用改代码 |
| 5 | 写 pytest/最小测试 + GitHub Actions | CI 绿灯 |

> 面试讲法：**"原来我每次导入资产要手动检查 20 分钟，现在 30 秒出报告；v0.1 有 X 个局限，v1.0 我加了 Y。"**

## 6. 文件

- `pipecheck.py`：插件本体（单文件，约 300 行）
- `README.md`：本文件

## 7. 许可

学习/作品集用途。代码可自由修改；发布时保留作者与来源说明即可。
