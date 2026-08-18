// ============================================================================
// 求职路线图类型定义
// Career Roadmap Type Definitions
// ============================================================================

/** 学习阶段状态 */
export type RoadmapPhaseStatus = "not-started" | "in-progress" | "completed";

/** 学习阶段 */
export interface RoadmapPhase {
	/** 阶段唯一 id */
	id: string;
	/** 阶段名称 */
	title: string;
	/** 阶段副标题/时间范围 */
	period: string;
	/** 阶段目标 */
	goal: string;
	/** 阶段状态 */
	status: RoadmapPhaseStatus;
	/** 主题色（CSS 变量值或任意颜色） */
	accent?: string;
	/** 图标名（astro-icon） */
	icon?: string;
	/** 任务列表 */
	tasks: RoadmapTask[];
}

/** 单个学习任务 */
export interface RoadmapTask {
	/** 任务唯一 id（用于本地进度记录） */
	id: string;
	/** 任务内容 */
	title: string;
	/** 任务说明/产出物 */
	detail?: string;
	/** 关联博客文章 slug（可选） */
	postSlug?: string;
	/** 任务分类标签 */
	tags?: string[];
	/** 预计耗时 */
	estimate?: string;
}

/** 求职里程碑/时间节点 */
export interface CareerMilestone {
	/** 里程碑唯一 id */
	id: string;
	/** 里程碑名称 */
	title: string;
	/** 时间节点 */
	date: string;
	/** 描述 */
	detail: string;
	/** 是否已达成 */
	done: boolean;
	/** 里程碑类型 */
	type: "prepare" | "apply" | "interview" | "offer";
}

/** 求职路线图完整配置 */
export interface CareerConfig {
	/** 求职目标描述 */
	target: string;
	/** 目标公司/岗位 */
	targetRole: string;
	/** 当前日期锚点（用于倒计时） */
	anchorDate: string;
	/** 投递截止日期 */
	deadline: string;
	/** 每日投入时间 */
	dailyHours: string;
	/** 阶段列表 */
	phases: RoadmapPhase[];
	/** 求职里程碑 */
	milestones: CareerMilestone[];
}
