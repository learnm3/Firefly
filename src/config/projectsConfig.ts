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
			id: "unity-mmo-demo",
			name: "商业级 MMORPG 全栈项目（P2）",
			description:
				"基于 Unity 的商业级 MMORPG 全栈开发：网络架构、UI 系统、实时交互，求职核心项目。",
			details: [
				"网络层：Protobuf 协议、SQLService 数据层、登录/注册/创建角色、移动同步、地图传送",
				"UI 框架：UIManager 面板管理 + 背包/商店/任务等六大系统",
				"实时交互：数据同步、MMO 社交机制、音效混音、NavMesh 动态烘焙",
				"技术栈：Unity + C# + Protobuf + SQLService",
				"计划 2026.10-2027.01 完成，作为简历核心项目",
			],
			techStack: ["Unity", "C#", "Protobuf", "MMO"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-10",
			highlights: [
				"商业级项目：完整 MMO 网络架构与系统集成",
				"求职路线图阶段三/四核心产出",
			],
			category: "Unity 项目",
		},
		{
			id: "unity-hotupdate-demo",
			name: "XLua 热更新 Demo",
			description:
				"基于 XLua 的商业级热更新框架：AssetBundle + Lua 热更，客户端核心竞争力。",
			details: [
				"AssetBundle 打包与资源管理、热更新流程（版本检查→下载→加载）",
				"Lua 与 C# 交互、UI 层级管理、对象池、真机调试",
				"完成单机和网络游戏 Demo",
				"技术栈：Unity + C# + Lua + XLua + AssetBundle",
				"计划 2027.01-2027.02 完成，热更新是国内客户端岗核心考点",
			],
			techStack: ["Unity", "XLua", "Lua", "AssetBundle"],
			status: "planning",
			statusText: "计划中",
			startDate: "2027-01",
			highlights: [
				"热更新全流程：从打包到真机热更",
				"投递时展示的核心作品之一",
			],
			category: "Unity 项目",
		},
		{
			id: "unity-first-game",
			name: "《疯狂小岛大战》实战小游戏",
			description: "Unity 入门后的第一个完整小游戏（2026.10 完成）。",
			details: [
				"一周实战：把 Unity 核心知识串成完整可玩的小游戏",
				"涵盖：场景搭建、角色控制、UI、游戏逻辑",
				"第一个可展示作品，验证 Unity 基础",
			],
			techStack: ["Unity", "C#"],
			status: "planning",
			statusText: "计划中",
			startDate: "2026-10",
			highlights: ["Unity 入门到实战的第一步"],
			category: "Unity 项目",
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
			name: "C++ / C# 面试专题笔记",
			description:
				"针对游戏客户端面试的基础系统复习笔记（C++ 辅助理解，C# 为 Unity 主线）。",
			details: [
				"《C++ 内存管理完全指南》：栈堆、智能指针/RAII、内存对齐、对象池",
				"《C++ 多态与虚函数完全解析》：vtable/vptr、纯虚函数、RTTI、CRTP",
				"《C++ 关键字与移动语义专题》：const/static、左值右值、完美转发",
				"《操作系统与多线程专题》：锁/死锁/缓存/伪共享/对象池（游戏视角）",
				"Unity 阶段将补充 C# 基础专题（值/引用类型、委托事件、GC）",
			],
			techStack: ["C++", "C#", "面试"],
			status: "in-progress",
			statusText: "进行中",
			startDate: "2026-08",
			highlights: ["基础复习材料（C++ 概念可辅助理解 C# 与引擎底层）"],
			category: "学习笔记",
			postSlug: "cpp-memory-management",
		},
		{
			id: "job-hunting-diary",
			name: "求职日记系列",
			description: "公开的求职过程记录：投递进度、笔试面试复盘、心态变化。",
			details: [
				"#0 方向调整：从 UE5 转向 Unity，188 天计划启动",
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
