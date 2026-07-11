import type { FooterConfig } from "../types/footerConfig";
import { commentConfig } from "./commentConfig";

export const footerConfig: FooterConfig = {
	// 是否启用Footer HTML注入功能
	enable: false,

	// 站点访问统计配置（基于 Waline Counter API）
	visitorStats: {
		// 是否启用访问统计
		enable: true,
		// Waline 服务地址（默认使用 commentConfig 中的 Waline 配置）
		serverURL: commentConfig.waline?.serverURL || "",
	},
};

// 直接编辑 config/FooterConfig.html 文件来添加备案号等自定义内容
