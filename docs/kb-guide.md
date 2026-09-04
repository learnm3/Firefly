# 个人知识库（/kb/）使用与扩展指南

博客新增的"个人知识库"是一个独立于文章（`posts`）的第二内容体系，主界面在 **/kb/**（导航栏"知识库"）。
它用一棵**放射状层级思维导图**组织内容，支持"按领域 / 按类型"双视图切换。

## 一句话架构

- **内容**：每个知识条目 = `src/content/kb/<名字>.md` 一个 Markdown 文件。
- **元数据**：frontmatter 里的 `type`、`branch`、`topic` 决定它在导图里的位置。
- **界面**：`src/pages/kb/index.astro`（导图总览）+ `src/pages/kb/[...slug].astro`（条目详情页）。
- **导图组件**：`src/components/pages/kb/KbMindMap.svelte`（纯 SVG 径向树，无第三方图表依赖）。

## 新增一条知识（最常见操作）

在 `src/content/kb/` 下新建一个 `.md` 文件，参考任意现有条目或下面模板：

```markdown
---
title: 你的标题
published: 2026-09-15T10:00:00+08:00
updated: 2026-09-16T10:00:00+08:00   # 可选
type: pitfall                          # note 学习笔记 | pitfall 踩坑手册 | practice 项目实践 | journey 成长历程
branch: csharp                         # csharp | unity | project | growth
topic: 变量与常量                      # 该领域下的子主题，自由起名
description: 一句话摘要（导图 hover / 搜索用）
tags:
  - C#
  - 常量
relatedPosts:
  - csharp-variable                    # 关联博客文章（posts 的 slug），可选
draft: false
---

正文用 Markdown 写；踩坑类建议按「问题现象 / 原因分析 / 解决方法 / 预防」组织。
```

保存即生效：导图、分类统计、详情页、站点搜索（Pagefind）都会自动包含新条目，
**不需要**改任何配置文件——除非你想新增"领域"（见下）。

## 四类内容 type 约定

| type | 含义 | 建议结构 |
| --- | --- | --- |
| `note` | 学习笔记 | 知识点理解 + 代码示例 |
| `pitfall` | 踩坑手册 | 问题 → 原因 → 解决 → 预防（未来查参考的核心） |
| `practice` | 项目实践 / 代码片段 | 可复用实现 + 适用场景 |
| `journey` | 成长历程 | 决策复盘、里程碑、阶段总结 |

## 领域（branch）与配色

- 领域是导图"按领域"视图的第一圈，目前：`csharp` C# 基础、`unity` Unity 引擎、`project` 项目实战、`growth` 求职与成长。
- 名称 / 颜色在 `src/config/kbConfig.ts` 的 `kbBranchMetaList` 中维护；类型元数据在同文件 `kbTypeMetaList`。
- 若要加领域：先在 `src/types/kb.ts` 的 `kbBranches` 加 id，再在 `kbConfig.ts` 加元数据。

## 相关文件索引

| 文件 | 作用 |
| --- | --- |
| `src/content.config.ts` | `kb` 内容集合 schema（frontmatter 校验） |
| `src/types/kb.ts` | 领域/类型枚举、节点与 payload 类型 |
| `src/config/kbConfig.ts` | 领域/类型的文案与配色 |
| `src/utils/kb-utils.ts` | 取条目、构建两棵导图树、序列化 |
| `src/pages/kb/index.astro` | /kb/ 总览页 |
| `src/pages/kb/[...slug].astro` | 条目详情页 |
| `src/components/pages/kb/KbMindMap.svelte` | 思维导图组件 |

## 常见问题

- **想让导图默认收起/展开？** `KbMindMap.svelte` 里 `applyDefaultView` 控制初始折叠深度。
- **条目没出现？** 检查 frontmatter 的 `type`/`branch` 是否在枚举内、`draft` 是否误为 `true`、
  `published` 是否是合法日期（内容集合 schema 会校验，`pnpm check` 会报错）。
- **以后想批量导入 DeepSeek 对话**：把对话导出为 Markdown，按上面模板加好 frontmatter 放进来即可；
  若量大可以分批处理，每条文件保持一个知识点的粒度更容易检索。
