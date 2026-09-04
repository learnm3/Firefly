/** 知识库条目类型：内容形态（"按类型"视图的第一圈分支） */
export const kbEntryTypes = ["note", "pitfall", "practice", "journey"] as const;
export type KbEntryType = (typeof kbEntryTypes)[number];

/** 知识库条目所属领域（"按领域"视图的第一圈分支） */
export const kbBranches = ["csharp", "unity", "project", "growth"] as const;
export type KbBranch = (typeof kbBranches)[number];

/** 领域元数据 */
export type KbBranchMeta = {
	id: KbBranch;
	name: string;
	description: string;
	color: string;
};

/** 类型元数据 */
export type KbTypeMeta = {
	id: KbEntryType;
	name: string;
	description: string;
	color: string;
};

/** 传给导图/列表的可序列化条目摘要（无 Date / CollectionEntry） */
export type KbEntrySummary = {
	id: string;
	title: string;
	description: string;
	type: KbEntryType;
	branch: KbBranch;
	topic: string;
	published: string;
	updated?: string;
	tags: string[];
	relatedPosts: string[];
	url: string;
};

/** 导图视图 */
export type KbView = "branch" | "type";

/** 导图节点 kind：root 中心 / branch 领域 / type 类型 / topic 主题 / entry 条目 */
export type KbNodeKind = "root" | "branch" | "type" | "topic" | "entry";

/** 导图节点（领域视图与类型视图共用同一结构） */
export type KbTreeNode = {
	id: string;
	label: string;
	kind: KbNodeKind;
	/** 归属的分组元数据 id（branch 或 type），用于取色 */
	metaId?: string;
	color?: string;
	/** 叶子条目数（用于径向布局权重与角标） */
	leafCount: number;
	/** 条目详情链接（仅 entry 有） */
	url?: string;
	children?: KbTreeNode[];
};

/** 序列化入组件的完整数据 */
export type KbMapPayload = {
	/** 领域视图树：root → branch → topic → entry */
	branchTree: KbTreeNode;
	/** 类型视图树：root → type → branch → entry */
	typeTree: KbTreeNode;
	entries: KbEntrySummary[];
	branchMeta: KbBranchMeta[];
	typeMeta: KbTypeMeta[];
	stats: {
		total: number;
		byBranch: Record<string, number>;
		byType: Record<string, number>;
	};
};
