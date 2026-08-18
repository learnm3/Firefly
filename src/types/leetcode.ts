// ============================================================================
// LeetCode 刷题打卡类型定义
// LeetCode Daily Practice Type Definitions
// ============================================================================

/** 打卡记录：日期(YYYY-MM-DD) → 当日刷题数 */
export type LeetCodeRecords = Record<string, number>;

/** LeetCode 打卡完整配置 */
export interface LeetCodeConfig {
	/** 页面标题 */
	title: string;
	/** 页面说明 */
	description: string;
	/** 刷题总数目标 */
	targetTotal: number;
	/** 历史做题开始日期（热力图展示起点） */
	startDate: string;
	/** 热题 100 重新开始打卡的日期 */
	hot100StartDate?: string;
	/** 打卡记录（历史痕迹 + 新打卡） */
	records: LeetCodeRecords;
	/** 已发布的题解文章（slug → 标题） */
	solutions: Record<string, string>;
	/** 本机题解库中的情境注释题（题号 → 游戏场景描述） */
	localSceneHighlights?: Record<number, string>;
}
