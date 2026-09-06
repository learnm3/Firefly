/**
 * B站字幕直通车 —— 浏览器控制台脚本（方案 B）
 *
 * 用途：在【已登录 B 站】的任意页面按 F12 → Console 运行一次，
 *       自动抓取指定分P的字幕（含错配自动重试），下载为一个文件。
 *       之后把文件路径告诉 agent 即可，无需再复制粘贴字幕文本。
 *
 * 使用：修改下方 CONFIG 后整段粘贴运行（若提示先输入 允许粘贴）。
 *   - bvid     : 视频 BV 号
 *   - pages    : 要抓的分P编号数组
 *   - fileName : 下载文件名
 *   - maxAttempts: 每集最多尝试次数（应对部分分P中文AI字幕错配）
 *   - hints    : 可选。某些课程错配严重时，按分P给内容特征词辅助识别，
 *                例如 { 50: ["三角函数", "正弦"], 51: ["sine"] }
 */
(async () => {
	const CONFIG = {
		bvid: "BV1Wk9EYvEoy",
		pages: [50], // ← 每次请求按需改成目标分P，如 [35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]
		fileName: "bili-sub-master.txt",
		maxAttempts: 12,
		hints: {
			// 例：50: ["欢迎回来", "正弦", "sin"],
		},
	};
	const { bvid, pages, fileName, maxAttempts, hints } = CONFIG;
	const v = await (
		await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { credentials: "include" })
	).json();
	const byPage = new Map((v.data?.pages || []).map((p) => [p.page, p]));
	const out = [];
	const summary = [];
	for (const p of pages) {
		const meta = byPage.get(p);
		out.push(`===P${p} ${meta?.part || "?"}===`);
		if (!meta) {
			summary.push(`P${p}: 无此分P`);
			continue;
		}
		let best = null;
		let found = false;
		const kw = (hints && hints[p]) || [];
		for (let k = 1; k <= maxAttempts; k++) {
			try {
				let pl = null;
				for (const ep of ["x/player/v2", "x/player/wbi/v2"]) {
					const r = await (
						await fetch(`https://api.bilibili.com/${ep}?bvid=${bvid}&cid=${meta.cid}`, { credentials: "include" })
					).json();
					if (r.data?.subtitle?.subtitles?.length) {
						pl = r;
						break;
					}
				}
				const subs = pl?.data?.subtitle?.subtitles || [];
				const pick =
					subs.find((s) => /^en/i.test(s.lan)) ||
					subs.find((s) => /zh/i.test(s.lan)) ||
					subs[0];
				if (!pick) continue;
				const url = pick.subtitle_url.startsWith("//") ? "https:" + pick.subtitle_url : pick.subtitle_url;
				const sj = await (await fetch(url)).json();
				const body = sj.body || [];
				if (!body.length) continue;
				const text = body.map((b) => b.content).join("\n");
				const head = text.slice(0, 300);
				let score = 0;
				if (head.includes("欢迎回来") || /^welcome/i.test(head)) score += 4;
				if (kw.length ? kw.some((w) => text.slice(0, 1200).includes(w)) : true) score += 1;
				if (body.length > 40) score += 2;
				if (/♪/.test(head)) score -= 5; // 明显是歌曲/错配
				if (!best || score > best.score) {
					best = { k, lan: pick.lan, lines: body.length, text, head, score };
				}
				if (score >= 6) {
					found = true;
					break;
				}
			} catch (e) {
				/* 重试下一次 */
			}
		}
		if (best) {
			out.push(`---${best.lan} (第${best.k}次尝试, ${best.lines}行)---`);
			out.push(best.text);
			summary.push(
				`P${p}: ${best.lan} ${best.lines}行 ${found ? "命中" : "最佳候选"} | 开头: ${best.head
					.replace(/\n/g, " ")
					.slice(0, 60)}`
			);
		} else {
			out.push("(未取到字幕)");
			summary.push(`P${p}: 未取到`);
		}
	}
	const all = out.join("\n\n");
	const blob = new Blob(["\uFEFF" + all], { type: "text/plain;charset=utf-8" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		URL.revokeObjectURL(a.href);
		a.remove();
	}, 2000);
	console.log("====字幕直通车摘要====\n" + summary.join("\n") + "\n文件: " + fileName + " 字符数: " + all.length);
})();
