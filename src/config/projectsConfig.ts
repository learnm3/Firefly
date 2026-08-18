// ============================================================================
// 项目展示配置 - 求职作品集
// Projects Showcase Configuration
// 修改此文件即可更新博客上的项目展示页面
// ============================================================================
import type { ProjectsConfig } from "../types/projects";

export const projectsConfig: ProjectsConfig = {
	title: "项目作品集",
	description:
		"面向游戏客户端求职的作品集：每个项目都记录技术难点、踩坑过程与复盘，面试时能讲清「为什么这么做」。",

	projects: [
		{
			id: "ue5-3c-demo",
			name: "UE5 第三人称 3C Demo",
			description: "基于 UE5 的第三人称角色控制 Demo：移动/相机/动画全链路。",
			details: [
				"角色控制：Character + SpringArm + Camera 三件套，Enhanced Input 输入系统",
				"动画系统：Animation Blueprint 状态机 + Montage 技能动画 + 武器 IK",
				"控制手感：移动方向基于 Controller Yaw，支持相机延迟跟随与碰撞检测",
				"配套框架认知：Gameplay 框架（GameMode/GameState/PC/Pawn）分工笔记",
				"战斗系统规划：GAS 技能系统（连招/闪避/伤害 GE），专题笔记已产出",
				"进阶方向：网络同步（Replication/RPC/客户端预测）专题笔记已产出",
				"性能方向：资源加载（软/硬引用、异步加载、关卡流送）专题笔记已产出",
			],
			techStack: ["UE5", "C++", "GAS", "Animation Blueprint", "Enhanced Input"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: [
				"完整 3C 链路：从输入到角色移动到动画播放",
				"博客配套笔记：Character 类完全解析 / Montage / IK",
			],
			category: "UE5 Demo",
			postSlug: "ue5-character-class",
		},
		{
			id: "graphics-opengl",
			name: "现代 OpenGL 渲染练习",
			description: "跟随 LearnOpenGL 的图形学实践：从核心概念到光照渲染。",
			details: [
				"《渲染管线完全图解》：输入装配→顶点着色器→光栅化→片元着色器→测试混合",
				"《光照模型完全解析》：Phong/Blinn-Phong/PBR、BRDF、金属度与粗糙度",
				"《实时阴影与抗锯齿》：Shadow Map/CSM/PCF、MSAA/FXAA/TAA",
				"《现代 OpenGL 入门》：核心模式、状态机、窗口与渲染循环",
				"面向面试的图形学知识梳理：MVP 变换、齐次坐标、前向/延迟渲染",
			],
			techStack: ["OpenGL", "GLSL", "C++", "渲染管线"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-07",
			highlights: [
				"从零理解现代 OpenGL 核心模式",
				"渲染管线专题笔记：客户端面试图形学第一题",
			],
			category: "图形学",
			postSlug: "graphics-rendering-pipeline",
		},
		{
			id: "cpp-notes",
			name: "C++ 面试专题笔记",
			description: "针对游戏客户端面试的 C++ 与计算机基础系统复习笔记。",
			details: [
				"《C++ 内存管理完全指南》：栈堆、智能指针/RAII、内存对齐、对象池",
				"《C++ 多态与虚函数完全解析》：vtable/vptr、纯虚函数、RTTI、CRTP",
				"《C++ 关键字与移动语义专题》：const/static、左值右值、完美转发",
				"《操作系统与多线程专题》：锁/死锁/缓存/伪共享/对象池（游戏视角）",
				"面试导向：每篇含高频考点、标准答案、手画内存图与 Checklist",
				"与面试题库联动，构成完整复习闭环",
			],
			techStack: ["C++", "面试"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: [
				"路线图阶段一核心产出",
				"面向库洛 UE5 客户端面试的 C++ 复习材料",
			],
			category: "学习笔记",
			postSlug: "cpp-memory-management",
		},
		{
			id: "job-hunting-diary",
			name: "求职日记系列",
			description: "公开的求职过程记录：投递进度、笔试面试复盘、心态变化。",
			details: [
				"#0 准备就绪：博客改造完成，冲刺正式开始",
				"每周一篇，记录投递、笔试、面试与复盘",
				"用公开输出倒逼执行，也是面试时展示复盘能力与稳定性的材料",
			],
			techStack: ["求职", "复盘"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: [
				"求职过程透明化，展示长期主义与复盘习惯",
			],
			category: "求职日记",
			postSlug: "job-hunting-diary-00",
		},
		{
			id: "leetcode-journey",
			name: "LeetCode 刷题打卡",
			description: "面向笔试的算法练习：每日打卡热力图 + 游戏客户端视角题解。",
			details: [
				"《算法手撕高频专题》：链表反转/二叉树遍历/快排归并/二分/LRU/TopK/滑动窗口 8 类模板",
				"每道题用游戏客户端情境理解（物品合成、技能组合、战斗边界等场景映射）",
				"打卡热力图记录每日刷题，目标秋招前完成 100 题",
				"7+ 篇题解已发布，含复杂度分析与多种解法",
			],
			techStack: ["C++", "数据结构与算法"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-07",
			highlights: [
				"游戏情境题解：算法与游戏场景结合",
				"每日打卡热力图：坚持可视化",
			],
			category: "算法",
			postSlug: "algorithm-handwriting-templates",
		},
	],
};
