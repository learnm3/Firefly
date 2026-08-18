// ============================================================================
// Firefly 博客 Worker（Cloudflare Workers）
// 职责：
//   1. /api/*  → LeetCode 打卡 API（KV 持久化）
//   2. 其余    → 转发到静态 assets（env.ASSETS）
// 部署要求：wrangler.jsonc 中配置 kv_namespaces（LEETCODE_KV）
// ============================================================================

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Content-Type": "application/json",
};

function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: CORS_HEADERS,
	});
}

// ============ LeetCode 打卡 API ============

async function handleApi(request, env) {
	const url = new URL(request.url);

	if (request.method === "OPTIONS") {
		return new Response(null, { headers: CORS_HEADERS });
	}

	if (url.pathname !== "/api/leetcode") {
		return json({ error: "not found" }, 404);
	}

	const kv = env.LEETCODE_KV;

	if (request.method === "GET") {
		try {
			const raw = await kv.get("records", "json");
			return json({ ok: true, records: raw ?? {} });
		} catch (e) {
			return json({ ok: false, error: String(e) }, 500);
		}
	}

	if (request.method === "POST") {
		// 写入校验：要求 X-Checkin-Key 与环境变量 CHECKIN_KEY 一致
		// （防止公开博客上访客误点污染打卡数据；读取 GET 无需密钥）
		const key = request.headers.get("X-Checkin-Key") ?? "";
		if (env.CHECKIN_KEY && key !== env.CHECKIN_KEY) {
			return json({ ok: false, error: "invalid key" }, 403);
		}
		try {
			const body = await request.json();
			const incoming = body?.records ?? {};
			if (typeof incoming !== "object" || Array.isArray(incoming)) {
				return json({ ok: false, error: "records must be an object" }, 400);
			}

			const existing = (await kv.get("records", "json")) ?? {};
			const merged = { ...existing, ...incoming };

			// 过滤非法值：只保留 YYYY-MM-DD → 正整数
			const cleaned = {};
			for (const [k, v] of Object.entries(merged)) {
				const n = Number(v);
				if (
					typeof k === "string" &&
					/^\d{4}-\d{2}-\d{2}$/.test(k) &&
					n > 0
				) {
					cleaned[k] = Math.floor(n);
				}
			}

			await kv.put("records", JSON.stringify(cleaned));
			return json({ ok: true, records: cleaned });
		} catch (e) {
			return json({ ok: false, error: String(e) }, 500);
		}
	}

	return json({ error: "method not allowed" }, 405);
}

// ============ 主入口 ============

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// API 路由
		if (url.pathname.startsWith("/api/")) {
			return handleApi(request, env);
		}

		// 静态资源转发（博客页面、图片、CSS 等）
		if (env.ASSETS) {
			return env.ASSETS.fetch(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
