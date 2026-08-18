<script lang="ts">
import { onMount } from "svelte";

import type { LeetCodeConfig } from "@/types/leetcode";

let { config }: { config: LeetCodeConfig } = $props();

// 本地存储 key（用于临时打卡，最终仍需更新配置文件持久化）
const STORAGE_KEY = "firefly-leetcode-records";

// 状态
let records = $state<Record<string, number>>({});
let weeks = $state<{ date: string; count: number }[][]>([]); // 周 × 天
let totalSolved = $state(0);
let hot100Solved = $state(0); // 热题 100 进度（hot100StartDate 之后的题数）
let currentStreak = $state(0);
let longestStreak = $state(0);
let activeDays = $state(0);
let todayStr = $state("");
let todayCount = $state(0);
let hovered = $state<{ date: string; count: number } | null>(null);

// 颜色等级（从浅到深，深色/浅色模式都可见）
const levelClass = [
	"bg-(--btn-plain-bg)",
	"bg-[oklch(0.85_0.09_150)]",
	"bg-[oklch(0.7_0.14_150)]",
	"bg-[oklch(0.5_0.17_150)]",
	"bg-[oklch(0.32_0.16_150)]",
];

function getLevel(count: number): number {
	if (count <= 0) return 0;
	if (count === 1) return 1;
	if (count === 2) return 2;
	if (count === 3) return 3;
	return 4;
}

function formatDate(d: Date): string {
	const y = d.getFullYear();
	const m = (d.getMonth() + 1).toString().padStart(2, "0");
	const day = d.getDate().toString().padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date {
	const [y, m, d] = s.split("-").map(Number);
	return new Date(y, m - 1, d);
}

// API 端点（Cloudflare KV 持久化，公开可读）
const API_URL = "/api/leetcode";

// 数据加载顺序：云端 API（最新）→ localStorage（本地缓存）→ 配置文件（兜底）
function loadLocal() {
	records = { ...config.records };
	if (typeof localStorage === "undefined") return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const local = JSON.parse(raw) as Record<string, number>;
			for (const [k, v] of Object.entries(local)) {
				if (!(k in config.records) && k >= config.startDate) {
					records[k] = v;
				}
			}
		}
	} catch {
		// ignore
	}
}

async function loadFromApi() {
	try {
		const res = await fetch(API_URL, { method: "GET" });
		if (!res.ok) return;
		const data = (await res.json()) as {
			ok: boolean;
			records?: Record<string, number>;
		};
		if (data.ok && data.records && Object.keys(data.records).length > 0) {
			// 云端数据覆盖（云端是权威）
			records = { ...data.records };
			buildWeeks();
			computeStats();
			todayStr = formatDate(new Date());
			todayCount = records[todayStr] ?? 0;
		}
	} catch {
		// 云端不可用时静默使用本地数据
	}
}

async function saveToApi(key = "") {
	try {
		await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Checkin-Key": key,
			},
			body: JSON.stringify({ records }),
		});
	} catch {
		// 云端不可用时仅保存在本地（降级）
	}
}

function saveLocal() {
	if (typeof localStorage === "undefined") return;
	try {
		// 只存与配置不同的部分（本地缓存 + 离线降级）
		const diff: Record<string, number> = {};
		for (const [k, v] of Object.entries(records)) {
			if (config.records[k] !== v) diff[k] = v;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(diff));
	} catch {
		// ignore
	}
}

function buildWeeks() {
	// 以今天为终点，往前 52 周
	const end = new Date();
	end.setHours(0, 0, 0, 0);
	// 定位到本周周日
	const dayOfWeek = end.getDay();
	const thisSunday = new Date(end);
	thisSunday.setDate(end.getDate() - dayOfWeek);

	// 生成 53 周的占位（GitHub 风格，周为列）
	const colCount = 53;
	const result: { date: string; count: number }[][] = [];
	const cursor = new Date(thisSunday);
	cursor.setDate(cursor.getDate() - (colCount - 1) * 7);

	for (let w = 0; w < colCount; w++) {
		const col: { date: string; count: number }[] = [];
		for (let d = 0; d < 7; d++) {
			const dt = new Date(cursor);
			dt.setDate(cursor.getDate() + d);
			const key = formatDate(dt);
			const future = dt.getTime() > end.getTime();
			col.push({ date: key, count: future ? 0 : (records[key] ?? 0) });
		}
		result.push(col);
		cursor.setDate(cursor.getDate() + 7);
	}
	weeks = result;
}

function computeStats() {
	const values = Object.values(records).filter((v) => v > 0);
	totalSolved = values.reduce((a, b) => a + b, 0);
	activeDays = values.length;

	// 热题 100 进度：只统计 hot100StartDate（含）之后的题数
	const hotStart = config.hot100StartDate ?? config.startDate;
	hot100Solved = Object.entries(records)
		.filter(([k, v]) => k >= hotStart && v > 0)
		.reduce((sum, [, v]) => sum + v, 0);

	// 计算连续打卡（从今天往回数）
	const end = new Date();
	end.setHours(0, 0, 0, 0);
	currentStreak = 0;
	let cursor = new Date(end);
	if ((records[formatDate(cursor)] ?? 0) === 0) {
		// 今天还没打卡，从昨天开始算
		cursor.setDate(cursor.getDate() - 1);
	}
	while ((records[formatDate(cursor)] ?? 0) > 0) {
		currentStreak++;
		cursor.setDate(cursor.getDate() - 1);
	}

	// 最长连续
	let best = 0;
	let run = 0;
	const allDates = Object.keys(records)
		.filter((k) => records[k] > 0)
		.sort();
	for (let i = 0; i < allDates.length; i++) {
		if (i === 0) {
			run = 1;
		} else {
			const prev = parseDate(allDates[i - 1]);
			const cur = parseDate(allDates[i]);
			const diffDays = Math.round(
				(cur.getTime() - prev.getTime()) / 86_400_000,
			);
			run = diffDays === 1 ? run + 1 : 1;
		}
		best = Math.max(best, run);
	}
	longestStreak = best;
}

// 打卡需要密钥（防访客污染公开数据）；读取公开，写入需验证
// 密钥通过环境变量 CHECKIN_KEY 配置，前端每次打卡时提示输入
let checkinKey = "";

function promptForKey(): boolean {
	if (typeof window === "undefined") return false;
	if (!checkinKey) {
		const input = window.prompt("请输入打卡密钥（未设置时为空即可）");
		if (input === null) return false;
		checkinKey = input.trim();
	}
	return true;
}

async function checkInToday() {
	// 写入云端需要密钥验证（防访客误点污染公开数据）
	if (!promptForKey()) return;
	if (typeof window !== "undefined" && !window.confirm("确认今天完成 1 道题？")) {
		return;
	}
	const now = new Date();
	const key = formatDate(now);
	records = { ...records, [key]: (records[key] ?? 0) + 1 };
	todayCount = records[key];
	saveLocal();
	await saveToApi(checkinKey);
	buildWeeks();
	computeStats();
}

async function undoToday() {
	if (!promptForKey()) return;
	if (
		typeof window !== "undefined" &&
		!window.confirm("确认撤销今天的 1 道题？")
	) {
		return;
	}
	const key = formatDate(new Date());
	if ((records[key] ?? 0) > 0) {
		records = { ...records, [key]: (records[key] ?? 0) - 1 };
		if (records[key] <= 0) delete records[key];
		records = { ...records };
		todayCount = records[key] ?? 0;
		saveLocal();
		await saveToApi(checkinKey);
		buildWeeks();
		computeStats();
	}
}

// 月份标签（$derived：weeks 变化时自动重算）
const monthLabels = $derived(
	(() => {
		const labels: { label: string; col: number }[] = [];
		let last = "";
		weeks.forEach((week, wi) => {
			const mid = week[3] ?? week[0];
			const m = mid.date.slice(0, 7);
			if (m !== last) {
				labels.push({ label: mid.date.slice(5, 7) + "月", col: wi });
				last = m;
			}
		});
		return labels;
	})(),
);

onMount(() => {
	loadLocal();
	buildWeeks();
	computeStats();
	todayStr = formatDate(new Date());
	todayCount = records[todayStr] ?? 0;
	// 从云端加载最新打卡（面试官/访客看到的是这份数据）
	loadFromApi();
});
</script>

<div class="leetcode-heatmap">
	<!-- 统计概览 -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-(--primary)">{hot100Solved}</div>
			<div class="text-xs text-50 mt-0.5">热题 100 进度</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-90">{totalSolved}</div>
			<div class="text-xs text-50 mt-0.5">累计题数</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-90">{activeDays}</div>
			<div class="text-xs text-50 mt-0.5">打卡天数</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-90">{currentStreak}</div>
			<div class="text-xs text-50 mt-0.5">当前连续</div>
		</div>
	</div>

	<!-- 目标进度 -->
	<div class="card-base px-5 py-4 mb-4">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-bold text-90">热题 100 目标</span>
			<span class="text-xs text-50">
				{hot100Solved} / {config.targetTotal} 题
				（{Math.min(100, Math.round((hot100Solved / config.targetTotal) * 100))}%）
			</span>
		</div>
		<div class="h-2.5 rounded-full bg-(--btn-plain-bg) overflow-hidden">
			<div
				class="h-full rounded-full bg-(--primary) transition-all duration-500"
				style="width: {Math.min(100, (hot100Solved / config.targetTotal) * 100)}%"
			></div>
		</div>
		<p class="text-xs text-30 mt-2">
			热题 100 从 {config.hot100StartDate ?? config.startDate} 重新开始计数；
			热力图保留全部历史做题痕迹。
		</p>
		<a
			href="https://leetcode.cn/studyplan/top-100-liked/"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block mt-2 text-xs text-(--primary) hover:underline"
		>
			📋 打开 LeetCode 热题 100 题单
		</a>
	</div>

	<!-- 今日打卡 -->
	<div class="card-base px-5 py-4 mb-4 flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<div class="text-sm text-90">
				今日（{todayStr}）
				<span class="font-bold text-(--primary)">{todayCount}</span> 题
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				class="px-4 py-2 rounded-lg bg-(--primary) text-white text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
				on:click={checkInToday}
			>
				+1 打卡
			</button>
			{#if todayCount > 0}
				<button
					class="px-3 py-2 rounded-lg bg-(--btn-plain-bg) text-50 text-sm transition-colors hover:bg-(--btn-plain-bg-hover) cursor-pointer"
					on:click={undoToday}
				>
					撤销
				</button>
			{/if}
		</div>
	</div>

	<!-- 热力图 -->
	<div class="card-base px-5 py-5 mb-4 overflow-x-auto">
		<div class="text-sm font-bold text-90 mb-3">打卡热力图（近一年）</div>
		<div class="min-w-[720px]">
			<!-- 月份标签 -->
			<div class="relative h-4 mb-1 ml-8 text-[0.6rem] text-30">
				{#each monthLabels as m (m.col)}
					<span
						class="absolute"
						style="left: {(m.col / weeks.length) * 92 + 4}%;"
					>
						{m.label}
					</span>
				{/each}
			</div>
			<div class="flex">
				<!-- 星期标签 -->
				<div class="w-8 flex flex-col gap-[3px] mr-1 text-[0.6rem] text-30">
					<div class="h-[10px] leading-[10px]">一</div>
					<div class="h-[10px] leading-[10px]"></div>
					<div class="h-[10px] leading-[10px]">三</div>
					<div class="h-[10px] leading-[10px]"></div>
					<div class="h-[10px] leading-[10px]">五</div>
					<div class="h-[10px] leading-[10px]"></div>
					<div class="h-[10px] leading-[10px]">日</div>
				</div>
				<!-- 网格 -->
				<div class="flex gap-[3px]">
					{#each weeks as week (week[0].date)}
						<div class="flex flex-col gap-[3px]">
							{#each week as day (day.date)}
								{#if day.date === todayStr && day.count === 0}
									<div
										class="w-[10px] h-[10px] rounded-[2px] outline outline-1 outline-(--primary)/50 cursor-pointer"
										title="今天"
									></div>
								{:else}
									<div
										class={`w-[10px] h-[10px] rounded-[2px] ${levelClass[getLevel(day.count)]} cursor-pointer transition-transform hover:scale-150`}
										title="{day.date}：{day.count} 题"
										on:mouseenter={() => (hovered = day)}
										on:mouseleave={() => (hovered = null)}
									></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
			<!-- 图例 -->
			<div class="flex items-center justify-end gap-1.5 mt-3 text-[0.65rem] text-30">
				<span>少</span>
				{#each levelClass as cls}
					<div class={`w-[10px] h-[10px] rounded-[2px] ${cls}`}></div>
				{/each}
				<span>多</span>
			</div>
		</div>
		{#if hovered}
			<div class="mt-2 text-xs text-50">
				📌 {hovered.date}：{hovered.count} 题
			</div>
		{/if}
	</div>

	<!-- 已发布题解 -->
	<div class="card-base px-5 py-5 mb-4">
		<div class="text-sm font-bold text-90 mb-3">📝 已发布题解（游戏客户端视角）</div>
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(config.solutions) as [slug, title]}
				<a
					href={`/posts/${slug}/`}
					class="text-xs px-3 py-1.5 rounded-lg bg-(--btn-plain-bg) text-75 hover:text-(--primary) hover:bg-(--primary)/10 transition-colors"
				>
					{title}
				</a>
			{/each}
		</div>
	</div>

	{#if config.localSceneHighlights && Object.keys(config.localSceneHighlights).length > 0}
		<!-- 本机题解库的情境注释 -->
		<div class="card-base px-5 py-5 mb-4">
			<div class="text-sm font-bold text-90 mb-1">🎮 游戏情境题解库</div>
			<p class="text-xs text-50 mb-3">
				本机 E:\LeetCode-Solutions 题解库中带游戏情境注释的题目（共 64 题）——每道题都用游戏视角设计过场景。
			</p>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				{#each Object.entries(config.localSceneHighlights) as [num, scene]}
					<div class="flex items-center gap-2 text-xs">
						<span class="shrink-0 w-8 px-1.5 py-0.5 rounded bg-(--primary)/10 text-(--primary) text-center font-bold">
							{num}
						</span>
						<span class="text-75">{scene}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<p class="text-center text-xs text-30 mb-2">
		🛡️ 打卡数据已接入 Cloudflare KV 云端存储——<b>所有访客（含面试官）看到的都是最新进度</b>；写入需要密钥，访客无法污染。打卡前会提示输入密钥。部署说明见 <code>docs/deploy-cloudflare-kv.md</code>。
	</p>
</div>

<style>
	.leetcode-heatmap {
		width: 100%;
	}
</style>
