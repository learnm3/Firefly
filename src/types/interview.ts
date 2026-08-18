// ============================================================================
// 面试题库类型定义
// Interview Question Bank Type Definitions
// ============================================================================

/** 题目难度 */
export type QuestionDifficulty = "easy" | "medium" | "hard";

/** 掌握状态 */
export type MasteryState = "unseen" | "learning" | "mastered";

/** 面试题目 */
export interface InterviewQuestion {
	/** 题目唯一 id */
	id: string;
	/** 问题内容 */
	question: string;
	/** 考察点/提示 */
	hint: string;
	/** 参考答案要点 */
	answer: string[];
	/** 难度 */
	difficulty: QuestionDifficulty;
	/** 关联标签 */
	tags?: string[];
	/** 关联博客文章 slug（可选） */
	postSlug?: string;
}

/** 题库分类 */
export interface QuestionCategory {
	/** 分类唯一 id */
	id: string;
	/** 分类名称 */
	name: string;
	/** 分类说明 */
	description: string;
	/** 分类图标（astro-icon） */
	icon: string;
	/** 题目列表 */
	questions: InterviewQuestion[];
}

/** 面试题库完整配置 */
export interface InterviewConfig {
	/** 题库标题 */
	title: string;
	/** 题库说明 */
	description: string;
	/** 分类列表 */
	categories: QuestionCategory[];
}
