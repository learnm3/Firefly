export type VisitorStatsConfig = {
	enable: boolean; // 是否启用访问统计
	serverURL: string; // Waline 服务地址
};

export type FooterConfig = {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
	visitorStats?: VisitorStatsConfig; // 站点访问统计配置
};
