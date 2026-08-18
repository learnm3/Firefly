// ============================================================================
// LeetCode 刷题打卡配置
// LeetCode Daily Practice Configuration
// 修改 records 即可更新热力图（格式：日期 "YYYY-MM-DD" → 当日刷题数）
// ============================================================================
import type { LeetCodeConfig } from "../types/leetcode";

export const leetCodeConfig: LeetCodeConfig = {
	title: "LeetCode 热题 100 打卡",
	description:
		"热力图保留全部刷题痕迹（含 E:\\LeetCode-Solutions 题解库的历史记录）；目标为 LeetCode 官方「热题 100」题单，从今天重新打卡。每道题都用游戏客户端的视角去理解（场景映射见题解）。",

	// 目标题数（热题 100 共 100 题）
	targetTotal: 100,

	// 历史做题开始日期（E:\LeetCode-Solutions 首题时间，热力图展示用）
	startDate: "2026-04-10",

	// 热题 100 重新开始打卡的日期
	hot100StartDate: "2026-08-18",

	// 历史打卡记录：日期 → 当日刷题数（保留做题痕迹）
	// 数据来源：E:\LeetCode-Solutions\improve 下的题解文件（按修改日期统计）
	records: {
		"2026-04-10": 1,
		"2026-04-12": 1,
		"2026-04-13": 1,
		"2026-04-14": 1,
		"2026-04-16": 4,
		"2026-04-17": 3,
		"2026-04-18": 3,
		"2026-04-19": 3,
		"2026-04-20": 3,
		"2026-04-21": 3,
		"2026-04-23": 3,
		"2026-04-26": 1,
		"2026-04-27": 7,
		"2026-04-28": 3,
		"2026-05-20": 3,
		"2026-05-25": 3,
		"2026-05-26": 40,
		"2026-05-27": 3,
		"2026-06-02": 3,
		"2026-06-03": 3,
		"2026-06-04": 6,
		"2026-06-05": 2,
		"2026-06-06": 1,
		"2026-08-18": 1,
	},

	// 已发布的题解文章
	solutions: {
		"leetcode-two-sum": "两数之和 × 背包合成",
		"leetcode-valid-parentheses": "有效的括号 × 技能配对",
		"leetcode-maximum-subarray": "最大子数组和 × DPS 峰值",
		"leetcode-merge-two-lists": "合并两个有序链表 × 掉落排序",
		"leetcode-move-zeroes": "移动零 × 场景清理",
		"leetcode-longest-consecutive": "最长连续序列 × 图块合并",
		"leetcode-3sum": "三数之和 × 技能组合",
		"leetcode-group-anagrams": "字母异位词分组 × 资源分类",
		"leetcode-container-with-most-water": "盛最多水的容器 × 战斗边界",
		"leetcode-longest-substring": "无重复字符的最长子串 × 滑动窗口",
		"algorithm-handwriting-templates": "算法手撕模板专题",
	},

	// 本机题解库中的情境注释题（E:\LeetCode-Solutions\improve\src，64 题全部带游戏情境）
	// 该字段供展示用：显示你为每道题设计的游戏场景，后续可逐题发布为博客题解
	localSceneHighlights: {
		1: "背包合成：两材料等级之和 = 目标值",
		3: "技能 CD：最长无重复连招窗口",
		5: "角色名回文检查",
		11: "战斗边界：容器与水体容量",
		15: "技能组合：三技能凑阈值",
		128: "任务链：最长连续关卡",
		239: "战斗伤害：滑动窗口最大值",
		283: "背包整理：零元素归位",
		438: "异位词：技能资源分类",
		560: "金币凑数：子数组和为 K",
	},
};
