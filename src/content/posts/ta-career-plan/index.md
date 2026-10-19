---
title: 技术美术程序向求职计划：从 GAMES101/202 到库洛渲染作品集
published: 2026-09-24
updated: 2026-09-24
description: 从游戏客户端方向转向技术美术程序向后的第一份可执行计划。以库洛校招“游戏技术美术工程师（程序向）”的真实 JD 为靶子，拆解 GAMES101、GAMES202、UE5 Shader、性能优化和作品集项目的推进节奏。
image: api
tags: [求职, 技术美术, TA, 程序向, 库洛, GAMES101, GAMES202, UE5, Shader, 性能优化, 学习计划]
category: 求职日记
draft: true
pinned: true
---

> 这篇是技术美术程序向路线的“开工文档”。目标不是继续堆笔记，而是用**可运行的 Shader、可复用的工具、可量化的性能报告**证明自己具备 TA 程序向岗位能力。

## 一、先看岗位，再定学习

库洛校招官网当前的主攻岗位是：

- [游戏技术美术工程师（程序向）](https://kurogame.jobs.feishu.cn/campus/position/7674850708331694382/detail)：强调编程、数学、计算机图形学、工程能力和作品集。

岗位要求可以压缩成四条：

1. 渲染效果开发，能把美术需求转成技术方案。
2. 通过引擎底层修改定制渲染管线，突破功能限制。
3. 优化渲染相关 CPU、GPU、内存开销，保障 PC/移动端流畅。
4. 完善工具流程，提高制作效率和质量。

也就是说，**GAMES101/202 是理论主干，UE5 Material/DCC/Python 是实践主干，作品集是把两者连起来的证据。**

## 二、现状盘点

| 维度 | 已有 | 差距 |
| --- | --- | --- |
| 编程 | C++/C#、UE5 基础、算法题解 | 缺少 Python 工具项目 |
| 图形学 | 渲染管线/光照/阴影笔记，开始 GAMES101/202 | 课程作业与引擎复现不足 |
| 引擎 | UE5 C++ 和 Actor/动画笔记 | Material/Shader 笔记不足 |
| 工具 | 已有 Python 资产校验器雏形 | 补齐引擎/DCC 集成和测试 |
| 作品集 | 博客知识库完善 | 缺视频 Demo、性能报告、管线工具 |

## 三、每天的时间安排

以每天 4-6 小时为基准，优先保证前两项：

| 时段 | 内容 | 产出 |
| --- | --- | --- |
| 30-60 分钟 | GAMES101/202 视频或 Shader 阅读 | 纸质/数字笔记 |
| 60 分钟 | 课程作业、矩阵推导或 Shader 复现 | 可运行效果 |
| 60-90 分钟 | UE5 Material Editor 实操 | Material Function 或 Demo |
| 30 分钟 | Python 工具或渲染分析 | 一个可复用小工具或数据 |
| 30 分钟 | 写博客知识库 + 复盘 | 当天笔记 |
| 30-60 分钟 | 算法或 C++（可选） | 保持笔试手感 |

周节奏：

- 周一到周五：推进理论、Shader、DCC 三条线。
- 周六：完成本周 Demo、录屏、性能数据。
- 周日：写复盘文章，更新路线图和知识库。

## 四、12 周执行计划

### 第 1-2 周：图形学地基

- GAMES101：变换、光栅化、着色、几何、光线追踪。
- GAMES101 作业 0-3：旋转/缩放、三角形光栅化、Blinn-Phong、BVH。
- LearnOpenGL 复现三角形、纹理、光照、MVP。

**里程碑**：一个可交互 OpenGL 小场景 + 一篇 MVP/光栅化笔记。

### 第 3-4 周：实时渲染与 PBR

- GAMES202：阴影、环境光照、IBL、全局光照、SSR。
- UE5 Material Editor：Material、Material Instance、Parameter Collection。
- PBR 参数：BaseColor、Metallic、Roughness、Fresnel。

**里程碑**：UE5 PBR 材质包（金属/塑料/布料/皮肤）。

### 第 5-6 周：风格化渲染

- 二次元/NPR：Ramp 光照、描边、边缘光、阴影颜色控制。
- UE5 Post Process Material、Vertex Normal 膨胀描边、SDF。
- 拆解《鸣潮》角色和场景的公开渲染素材。

**里程碑**：UE5 卡通角色 Shader Demo。

### 第 7-8 周：生产管线与工具

- Blender/Maya：重点理解资产导出和校验，不追求建模深度。
- Python：命名规范、三角面、LOD、贴图尺寸检查。
- Houdini 入门：程序化地形或建筑。

**里程碑**：一个可复用 DCC 管线校验工具。

### 第 9-10 周：性能与调试

- RenderDoc、ProfileGPU、Unreal Insights。
- Draw Call、Overdraw、Shader 复杂度、纹理内存、LOD。
- 移动端与 PC 端的限制和取舍。

**里程碑**：一份带前后对比的性能优化报告。

### 第 11-12 周：作品集与投递

- 每个项目补齐目标、方案、结果、复盘。
- 制作视频 Demo，发布 B 站/GitHub/博客。
- 简历 STAR 化，对照两个校招 JD。

**里程碑**：TA 作品集页、简历初稿、2 场模拟面试。

## 五、教程扩展

理论课之外，这四条资源线要同步推进：

- **Shader**：LearnOpenGL、The Book of Shaders、Shadertoy、Catlike Coding。
- **UE5**：Epic Learning、官方 Material 文档、Ben Cloward 材质教程、Unreal Insights。
- **DCC**：Blender/Substance/Houdini 官方教程、Blender Python API。
- **数学**：3Blue1Brown、Immersive Math、Real-Time Rendering。

完整资源清单放在知识库的「TA 图形与管线」分支。

## 六、项目作品集

1. **UE5 Stylized Shader Pack**：Ramp、Outline、Rim、Dissolve、Vertex Wave。
2. **DCC Pipeline Tool**：Python 资产检查与批量导入导出。
3. **Kuro TA Capstone**：风格化渲染 Demo + RenderDoc/Unreal Insights 性能报告。

每个项目都按这个模板复盘：

> 美术需求是什么，我选了什么技术方案，为什么选它，实现中踩了哪些坑，最终性能/效果如何。

## 七、立一个 Flag

12 周结束时，作品集里必须有：

- [ ] 至少 3 个可运行 Shader/Demo
- [ ] 1 个带测试的 Python 管线工具
- [ ] 1 份有前后对比的性能报告
- [ ] 1 个 30-60 秒的视频 Demo

**不再只当“看课程的人”，开始当一个能交付效果的 TA。**

## 相关页面

- [求职路线图](/roadmap/)
- [项目作品集](/projects/)
- [个人知识库](/kb/)
- [面试题库](/interview/)
