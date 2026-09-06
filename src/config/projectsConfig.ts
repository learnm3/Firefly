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
			id: "ue5-action-demo",
			name: "UE5 动作游戏教程项目（200 集）",
			description:
				"跟随《虚幻5 C++ 游戏开发从入门到秃头》200 集教程完成的动作游戏项目，求职核心 Demo。",
			details: [
				"角色控制：Character + Enhanced Input + 移动系统（客户端 3C 核心）",
				"武器战斗：武器类、Socket 挂载、IK 重定向、动画蒙太奇",
				"敌人 AI：行为树、受击反馈、伤害系统、Boss 战",
				"动画进阶：Root Motion 攻击、蒙太奇重构",
				"当前进度：教程第 49 集（Actor 变换与数学基础），持续跟进",
			],
			techStack: ["UE5", "C++", "Animation Blueprint", "Behavior Tree"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: [
				"完整 UE 动作游戏项目（教程 200 集 + Boss 战）",
				"客户端 3C + 战斗系统全链路",
			],
			category: "UE5 项目",
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
			techStack: ["OpenGL", "GLSL", "渲染管线"],
			status: "completed",
			statusText: "已完成",
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
			description:
				"针对游戏客户端面试的 C++ 与计算机基础系统复习笔记（UE5 C++ 开发基础）。",
			details: [
				"《C++ 内存管理完全指南》：栈堆、智能指针/RAII、内存对齐、对象池",
				"《C++ 多态与虚函数完全解析》：vtable/vptr、纯虚函数、RTTI、CRTP",
				"《C++ 关键字与移动语义专题》：const/static、左值右值、完美转发",
				"《操作系统与多线程专题》：锁/死锁/缓存/伪共享/对象池（游戏视角）",
				"C++ 是 UE5 开发与客户端笔试的核心语言",
			],
			techStack: ["C++", "面试"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: ["UE5/C++ 客户端面试的基础弹药"],
			category: "学习笔记",
			postSlug: "cpp-memory-management",
		},
		{
			id: "job-hunting-diary",
			name: "求职日记系列",
			description: "公开的求职过程记录：投递进度、笔试面试复盘、心态变化。",
			details: [
				"#0 方向确定：专注 UE5/C++ 客户端（经过探索后确认方向）",
				"每周一篇，记录投递、笔试、面试与复盘",
				"用公开输出倒逼执行，也是面试时展示复盘能力与稳定性的材料",
			],
			techStack: ["求职", "复盘"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: ["求职过程透明化，展示长期主义与复盘习惯"],
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
				"打卡热力图记录每日刷题，目标刷完热题 100",
				"13 篇题解已发布，含复杂度分析与多种解法",
			],
			techStack: ["算法", "数据结构"],
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
