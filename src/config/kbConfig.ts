import type {
	KbBranch,
	KbBranchMeta,
	KbEntryType,
	KbTypeMeta,
} from "../types/kb";

/**
 * 知识库领域元数据（导图"按领域"视图的第一圈分支）
 * 新增领域时在此追加即可；label/color 与内容文件 frontmatter 的 branch 字段对应
 */
export const kbBranchMetaList: KbBranchMeta[] = [
	{
		id: "csharp",
		name: "C# 基础",
		description:
			"语言语法、数据结构与面向对象等 C# 知识（在 Unity 中学习与验证）",
		color: "#6366f1",
	},
	{
		id: "unity",
		name: "Unity 引擎",
		description: "引擎核心：生命周期、组件、物理、UI、协程、资源与热更新等",
		color: "#a855f7",
	},
	{
		id: "project",
		name: "项目实战",
		description: "小游戏 Demo、MMORPG 全栈等实战项目的过程记录与架构沉淀",
		color: "#f97316",
	},
	{
		id: "growth",
		name: "求职与成长",
		description: "方向决策、阶段复盘、求职日记等成长历程记录",
		color: "#14b8a6",
	},
];

export const kbBranchMetaMap: Record<KbBranch, KbBranchMeta> =
	Object.fromEntries(kbBranchMetaList.map((b) => [b.id, b])) as Record<
		KbBranch,
		KbBranchMeta
	>;

/**
 * 知识库类型元数据（导图"按类型"视图的第一圈分支）
 * 与内容文件 frontmatter 的 type 字段对应
 */
export const kbTypeMetaList: KbTypeMeta[] = [
	{
		id: "note",
		name: "学习笔记",
		description: "系统的学习理解笔记，按主题沉淀知识点",
		color: "#0ea5e9",
	},
	{
		id: "pitfall",
		name: "踩坑手册",
		description: "问题 → 原因 → 解决：真实踩过的坑，未来可直接检索参考",
		color: "#ef4444",
	},
	{
		id: "practice",
		name: "项目实践",
		description: "可复用代码片段、小功能实现与项目实战经验",
		color: "#f59e0b",
	},
	{
		id: "journey",
		name: "成长历程",
		description: "方向决策、里程碑与阶段复盘，记录 Unity 学习成长轨迹",
		color: "#22c55e",
	},
];

export const kbTypeMetaMap: Record<KbEntryType, KbTypeMeta> =
	Object.fromEntries(kbTypeMetaList.map((t) => [t.id, t])) as Record<
		KbEntryType,
		KbTypeMeta
	>;
