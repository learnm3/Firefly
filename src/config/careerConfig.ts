// ============================================================================
// 求职路线图配置 - 目标：库洛游戏客户端开发实习（UE5 方向）
// Career Roadmap Configuration
// 基于《虚幻5 C++ 游戏开发从入门到秃头》BV1Wk9EYvEoy（200 集）学习进度
// ============================================================================
import type { CareerConfig } from "../types/career";

export const careerConfig: CareerConfig = {
	target: "入职库洛游戏客户端开发实习岗（UE5）",
	targetRole: "游戏客户端开发实习生（UE5 / C++）",
	// 当前日期锚点
	anchorDate: "2026-09-03",
	// 秋招/日常实习投递窗口
	deadline: "2027-03-09",
	dailyHours: "4-6 小时/天",

	// ============================================================================
	// 学习阶段（按 UE5 C++ 教程 200 集 + 项目落地）
	// ============================================================================
	phases: [
		{
			id: "phase-1",
			title: "UE5 C++ 基础语法与核心概念",
			period: "已进行中（教程第 1-70 集）",
			goal: "UE5 C++ 开发的地基：从 C++ 语法、变量/函数、Actor 基础到世界偏移、三角函数、蓝图交互、Component、Pawn/Character 类。当前学到第 49 集，持续跟进。",
			status: "in-progress",
			accent: "#e4572e",
			icon: "material-symbols:code-blocks",
			tasks: [
				{
					id: "t1-1",
					title: "C++ 入门与 UE 基础（第 1-40 集）",
					detail:
						"UE5 安装、C++ 类、变量/函数、日志、调试（Drawing Debug Points）、自定义头文件。基础已过，产出部分笔记。",
					estimate: "已完成",
					tags: ["C++", "UE5", "基础"],
				},
				{
					id: "t1-2",
					title: "Actor 变换与数学基础（第 41-60 集）",
					detail:
						"SetActorLocation/Rotation、Actor World Offset、三角函数（Sine）、暴露变量/函数给蓝图、Template 函数。当前在第 49 集（Actor World Offset）。",
					estimate: "进行中",
					tags: ["UE5", "数学"],
				},
				{
					id: "t1-3",
					title: "Components 与 Pawn/Character 类（第 57-70 集）",
					detail:
						"USceneComponent/UActorComponent、APawn、ACharacter 类（已产出第 8 集 Character 深度笔记）。学完可独立搭建可控角色。",
					estimate: "剩余约 20 集",
					tags: ["UE5", "Character"],
					postSlug: "ue5-character-class",
				},
			],
		},
		{
			id: "phase-2",
			title: "玩家控制与武器战斗系统",
			period: "教程第 70-110 集",
			goal: "从角色控制到武器战斗：Character 类、输入、动画蓝图、武器类（已产出 IK/武器笔记）。这是客户端岗面试最常问的 3C + 战斗方向。",
			status: "not-started",
			accent: "#2e86e4",
			icon: "material-symbols:videogame-asset",
			tasks: [
				{
					id: "t2-1",
					title: "角色移动与输入系统（第 70-80 集）",
					detail:
						"ACharacter + Enhanced Input + CharacterMovementComponent，产出移动系统深度笔记。",
					estimate: "约 10 集",
					tags: ["UE5", "3C"],
				},
				{
					id: "t2-2",
					title: "动画蓝图与 BlendSpace（第 80-100 集）",
					detail:
						"Animation Blueprint 状态机、BlendSpace 移动混合、动画蓝图与 C++ 通信。",
					estimate: "约 20 集",
					tags: ["UE5", "动画"],
					postSlug: "ue5-montage-metasound",
				},
				{
					id: "t2-3",
					title: "武器系统与 IK（第 90-110 集）",
					detail:
						"武器类设计、Socket 挂载、IK 重定向（已产出第 11 集武器/IK 笔记）。",
					estimate: "约 20 集",
					tags: ["UE5", "武器", "IK"],
					postSlug: "ue5-weapon-ik-retargeter",
				},
			],
		},
		{
			id: "phase-3",
			title: "AI 与战斗进阶",
			period: "教程第 110-160 集",
			goal: "让敌人活起来：AI Controller、行为树、受击反应、敌人类型。这是动作游戏（鸣潮/战双类）客户端面试的加分方向。",
			status: "not-started",
			accent: "#8b5cf6",
			icon: "material-symbols:smart-toy",
			tasks: [
				{
					id: "t3-1",
					title: "敌人 AI 与行为树（第 110-130 集）",
					detail:
						"AIController、BehaviorTree、黑板、寻路；敌人巡逻/追击/攻击状态。",
					estimate: "约 20 集",
					tags: ["UE5", "AI"],
				},
				{
					id: "t3-2",
					title: "受击反馈与伤害系统（第 129-150 集）",
					detail:
						"方向受击（Directional Hit Reactions）、伤害数字、敌人血条、蓝图中原生事件。",
					estimate: "约 20 集",
					tags: ["UE5", "战斗"],
				},
				{
					id: "t3-3",
					title: "敌人类型与策略（第 150-160 集）",
					detail: "敌人类层次、Boss 设计基础、敌人失去兴趣/回位逻辑。",
					estimate: "约 10 集",
					tags: ["UE5", "AI"],
				},
			],
		},
		{
			id: "phase-4",
			title: "动画进阶与毕业项目",
			period: "教程第 160-200 集",
			goal: "完成教程最终 Boss 战项目：Root Motion 攻击、蒙太奇重构、Echo Boss 完整战斗。教程结束后收获一个完整的 UE 动作游戏项目。",
			status: "not-started",
			accent: "#16a34a",
			icon: "material-symbols:swords",
			tasks: [
				{
					id: "t4-1",
					title: "动画蒙太奇重构与 Root Motion（第 160-190 集）",
					detail:
						"Refactoring Montage Functions、Root Motion Attacks——攻击动作与位移由动画驱动。",
					estimate: "约 30 集",
					tags: ["UE5", "动画"],
				},
				{
					id: "t4-2",
					title: "最终 Boss 战项目（第 190-200 集）",
					detail:
						"Echo Boss 完整战斗：这是教程毕业项目，可作为简历上的 UE 动作 Demo。",
					estimate: "约 10 集",
					tags: ["UE5", "项目"],
				},
				{
					id: "t4-3",
					title: "项目沉淀：完整动作 Demo + 复盘文章",
					detail:
						"教程项目录屏存档、写项目复盘、更新作品集。教程项目的 Boss 战可作为简历核心 Demo。",
					estimate: "1 周",
					tags: ["项目", "博客"],
				},
			],
		},
		{
			id: "phase-5",
			title: "求职冲刺与投递",
			period: "教程完成后",
			goal: "基于教程 200 集的完整 UE 动作项目 + UE 面试题库复习，正式投递库洛 UE5 岗（鸣潮方向）及腾讯/网易/莉莉丝等 UE 厂商。",
			status: "not-started",
			accent: "#f59e0b",
			icon: "material-symbols:rocket-launch",
			tasks: [
				{
					id: "t5-1",
					title: "简历 STAR 化 + 作品集整理",
					detail: "把教程 Boss 战项目写成简历亮点，UE Demo 录屏放作品集。",
					estimate: "1 周",
					tags: ["简历"],
				},
				{
					id: "t5-2",
					title: "模拟面试 + 投递库洛 UE5 岗",
					detail:
						"用博客模拟面试功能演练 UE/C++ 题，投递库洛（鸣潮 UE5 项目）及 UE 厂商。每场面试 24h 内复盘写求职日记。",
					estimate: "持续",
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
			title: "UE5 基础完成（教程第 70 集：Character 类）",
			date: "2026-10-15",
			detail: "掌握 Actor/Component/Pawn/Character + 蓝图交互",
			done: false,
			type: "prepare",
		},
		{
			id: "m2",
			title: "玩家控制 + 武器系统完成（教程第 110 集）",
			date: "2026-11-30",
			detail: "角色移动/动画/武器/IK 全链路（客户端 3C 核心）",
			done: false,
			type: "prepare",
		},
		{
			id: "m3",
			title: "AI 与战斗系统完成（教程第 160 集）",
			date: "2027-01-15",
			detail: "敌人 AI、受击反馈、伤害系统",
			done: false,
			type: "prepare",
		},
		{
			id: "m4",
			title: "教程毕业项目完成（200 集 Boss 战）",
			date: "2027-02-15",
			detail: "完整 UE 动作 Demo，简历核心弹药",
			done: false,
			type: "prepare",
		},
		{
			id: "m5",
			title: "开始投递库洛 UE5 岗",
			date: "2027-02-16",
			detail: "库洛（鸣潮 UE5）+ 腾讯/网易/莉莉丝等 UE 厂商",
			done: false,
			type: "apply",
		},
		{
			id: "m6",
			title: "目标：拿到库洛客户端实习 Offer",
			date: "2027-04-30",
			detail: "求职主线目标达成",
			done: false,
			type: "offer",
		},
	],
};
