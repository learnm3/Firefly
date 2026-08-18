// ============================================================================
// 项目展示类型定义
// Projects Showcase Type Definitions
// ============================================================================

/** 项目状态 */
export type ProjectStatus = "planning" | "in-progress" | "completed" | "paused";

/** 项目展示条目 */
export interface ProjectItem {
	/** 项目唯一 id */
	id: string;
	/** 项目名称 */
	name: string;
	/** 项目一句话介绍 */
	description: string;
	/** 详细说明（支持 markdown 简写） */
	details: string[];
	/** 技术栈标签 */
	techStack: string[];
	/** 项目状态 */
	status: ProjectStatus;
	/** 状态显示文本 */
	statusText: string;
	/** 开始时间 */
	startDate: string;
	/** 结束时间（未完成可为空） */
	endDate?: string;
	/** 关联博客文章 slug（可选） */
	postSlug?: string;
	/** GitHub 链接（可选） */
	github?: string;
	/** 演示链接（可选） */
	demo?: string;
	/** 项目封面图（可选） */
	image?: string;
	/** 亮点列表 */
	highlights: string[];
	/** 分类（如：UE5 Demo / 图形学 / 工具） */
	category: string;
}

/** 项目展示完整配置 */
export interface ProjectsConfig {
	/** 页面标题 */
	title: string;
	/** 页面说明 */
	description: string;
	/** 项目列表 */
	projects: ProjectItem[];
}
