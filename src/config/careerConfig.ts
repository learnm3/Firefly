// ============================================================================
// 求职路线图配置 - 目标：库洛游戏客户端开发实习（Unity 方向）
// Career Roadmap Configuration
// 基于用户 2026-09-03 ~ 2027-03-09 的 188 天 Unity 学习计划
// ============================================================================
import type { CareerConfig } from "../types/career";

export const careerConfig: CareerConfig = {
	target: "入职库洛游戏客户端开发实习岗（Unity）",
	targetRole: "游戏客户端开发实习生（Unity / C# / Lua）",
	// 当前日期锚点：用于计算距离投递截止的剩余天数
	anchorDate: "2026-09-03",
	// 春招实习投递截止（含寒假实习窗口）
	deadline: "2027-03-09",
	dailyHours: "4-6 小时/天",

	// ============================================================================
	// 学习阶段（基于 188 天 Unity 计划）
	// ============================================================================
	phases: [
		{
			id: "phase-1",
			title: "Unity 极速入门：C# 基础与 Unity 核心",
			period: "09-03 ~ 10-02（30 天）",
			goal: "零基础进入 Unity：先用 15 天学透 C# 基础（语法/数据结构/逻辑），再用 15 天掌握 Unity 核心（组件化、物理、UI、动画、资源管理），完成课后作业打牢地基。",
			status: "in-progress",
			accent: "#3b82f6",
			icon: "material-symbols:code-blocks",
			tasks: [
				{
					id: "t1-1",
					title: "C# 基础语法 / 数据结构 / 编程逻辑（第 1-5 章）",
					detail:
						"《Unity 极速入门与实战 3.0》第 1-5 章：C# 语法、数据结构、常用技巧，完成课后作业。Unity 岗第一语言是 C#。",
					estimate: "15 天",
					tags: ["C#", "Unity"],
				},
				{
					id: "t1-2",
					title:
						"Unity 核心：组件化 / 物理 / UI / 动画 / 资源管理（第 6-17 章）",
					detail:
						"第 6-17 章：Unity 核心功能全掌握，培养游戏开发基础。理解 GameObject/Component 架构。",
					estimate: "15 天",
					tags: ["Unity"],
				},
			],
		},
		{
			id: "phase-2",
			title: "实战小项目：疯狂小岛大战",
			period: "10-03 ~ 10-07（5 天）",
			goal: "一周做出第一个完整小游戏，把入门知识串起来，产出第一个可展示的作品。",
			status: "not-started",
			accent: "#10b981",
			icon: "material-symbols:videogame-asset",
			tasks: [
				{
					id: "t2-1",
					title: "完成《疯狂小岛大战》全部章节（重点前 5 节）",
					detail:
						"游戏开发必学实战项目。完成后录屏存档，作为第一个作品放进项目页。",
					estimate: "5 天",
					tags: ["Unity", "实战"],
				},
			],
		},
		{
			id: "phase-3",
			title: "MMORPG 架构与核心系统（商业级全栈 P2）",
			period: "10-08 ~ 11-26（50 天）",
			goal: "进入商业级 MMORPG 全栈开发：先掌握网络架构（Protobuf/登录/同步/传送），再完成 UI 框架与背包/商店等六大系统。这是简历的核心项目。",
			status: "not-started",
			accent: "#8b5cf6",
			icon: "material-symbols:swords",
			tasks: [
				{
					id: "t3-1",
					title:
						"MMO 架构：Protobuf / SQLService / 登录注册 / 角色创建（第 2-5 章）",
					detail:
						"网络通信基础：Protobuf 序列化、SQLService 数据层、登录/注册/创建角色、移动同步、地图传送。量力而行循序渐进。",
					estimate: "25 天",
					tags: ["MMO", "网络"],
				},
				{
					id: "t3-2",
					title: "UI 框架与背包/商店等系统（第 6 章）",
					detail:
						"UI 框架搭建、背包/商店等六大系统、系统集成、性能优化、模块化架构、调试技巧。",
					estimate: "25 天",
					tags: ["MMO", "UI"],
				},
			],
		},
		{
			id: "phase-4",
			title: "MMORPG 进阶：实时交互与智能系统",
			period: "11-27 ~ 01-05（40 天）",
			goal: "深化 MMO 开发：实时数据同步与复杂 UI 交互、社交机制；音效混音、NavMesh 动态烘焙与任务系统。",
			status: "not-started",
			accent: "#f59e0b",
			icon: "material-symbols:group",
			tasks: [
				{
					id: "t4-1",
					title: "实时交互：数据同步 / 复杂 UI / 社交机制（第 7 章）",
					detail:
						"实时交互（数据同步、复杂 UI 交互）、MMO 社交机制，提升 Unity 熟练度与调试能力。",
					estimate: "20 天",
					tags: ["MMO", "实时"],
				},
				{
					id: "t4-2",
					title: "音效混音 / NavMesh 烘焙 / 任务系统（第 8 章）",
					detail:
						"音效混音配置、NavMesh 动态烘焙、路径搜索优化、任务系统智能衔接。",
					estimate: "20 天",
					tags: ["MMO", "寻路"],
				},
			],
		},
		{
			id: "phase-5",
			title: "Lua 与 XLua 热更新（客户端核心技能）",
			period: "01-06 ~ 02-22（48 天）",
			goal: "热更新是国内游戏公司（含库洛）客户端岗的核心考点：学 Lua 语法 → 搭 XLua 热更框架 → 完成商业级热更 Demo。",
			status: "not-started",
			accent: "#ef4444",
			icon: "material-symbols:bolt",
			tasks: [
				{
					id: "t5-1",
					title: "Lua 语法基础（语法 / 技巧 / OOP）",
					detail:
						"Lua 基本语法、编程技巧、面向对象实现方式。热更新脚本语言基础。",
					estimate: "3 天",
					tags: ["Lua"],
				},
				{
					id: "t5-2",
					title: "P2 从 0 搭建 XLua 热更新框架",
					detail:
						"AssetBundle 打包、资源管理、热更新流程、UI 层级管理、Lua 与 C# 交互、对象池、真机调试。",
					estimate: "30 天",
					tags: ["XLua", "热更新"],
				},
				{
					id: "t5-3",
					title: "商业级热更框架入门到精通（XLua 第 1-3 章）",
					detail:
						"熟练使用 XLua 热更新，完成单机和网络游戏 Demo——这是投递时的核心作品。",
					estimate: "15 天",
					tags: ["XLua", "热更新"],
				},
			],
		},
		{
			id: "phase-6",
			title: "就业冲刺：简历 / 面试 / 投递",
			period: "02-23 ~ 03-09（15 天）",
			goal: "求职全流程准备：简历撰写、复习资料整理、模拟面试，正式投递寒假/春招实习。",
			status: "not-started",
			accent: "#16a34a",
			icon: "material-symbols:rocket-launch",
			tasks: [
				{
					id: "t6-1",
					title: "简历撰写（STAR 法则）+ 复习资料整理",
					detail:
						"把 MMO 项目 / 热更 Demo 写成简历亮点，整理 Unity/C#/网络/热更复习材料。",
					estimate: "5 天",
					tags: ["简历"],
				},
				{
					id: "t6-2",
					title: "模拟面试 + 正式投递实习",
					detail:
						"用博客模拟面试功能演练，投递库洛 Unity 岗及米哈游/鹰角/叠纸等，每场面试 24h 内复盘写进求职日记。",
					estimate: "10 天",
					tags: ["面试", "投递"],
				},
			],
		},
	],

	// ============================================================================
	// 求职里程碑
	// ============================================================================
	milestones: [
		{
			id: "m1",
			title: "C# 基础 + Unity 核心掌握",
			date: "2026-10-02",
			detail: "完成《Unity 极速入门》1-17 章",
			done: false,
			type: "prepare",
		},
		{
			id: "m2",
			title: "第一个小游戏《疯狂小岛大战》完成",
			date: "2026-10-07",
			detail: "实战小项目可运行，录屏存档",
			done: false,
			type: "prepare",
		},
		{
			id: "m3",
			title: "MMO 核心系统完成（网络 + UI + 背包等）",
			date: "2026-11-26",
			detail: "商业级 MMORPG P2 第 2-6 章",
			done: false,
			type: "prepare",
		},
		{
			id: "m4",
			title: "MMO 进阶完成（实时交互 + NavMesh + 任务）",
			date: "2027-01-05",
			detail: "P2 第 7-8 章，简历核心项目成型",
			done: false,
			type: "prepare",
		},
		{
			id: "m5",
			title: "XLua 热更 Demo 完成（单机 + 网络）",
			date: "2027-02-22",
			detail: "热更新框架搭建 + 商业级热更 Demo",
			done: false,
			type: "prepare",
		},
		{
			id: "m6",
			title: "开始投递寒假/春招实习",
			date: "2027-02-23",
			detail: "库洛 Unity 岗 + 米哈游/鹰角/叠纸等",
			done: false,
			type: "apply",
		},
		{
			id: "m7",
			title: "目标：拿到库洛客户端实习 Offer",
			date: "2027-03-31",
			detail: "求职主线目标达成，进入实习准备阶段",
			done: false,
			type: "offer",
		},
	],
};
