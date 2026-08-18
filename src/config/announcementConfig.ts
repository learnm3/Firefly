import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "求职中",

	// 公告内容
	content:
		"🎯 目标：库洛游戏客户端开发实习（UE5 / C++）· 秋招冲刺中，学习进度实时更新。",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "开始模拟面试",
		// 链接 URL
		url: "/mock-interview/",
		// 内部链接
		external: false,
	},
};
