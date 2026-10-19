<script lang="ts">
import { onMount } from "svelte";

// ============================================================
// 艾宾浩斯遗忘曲线 · 学习追踪系统
// 复习间隔：学习后 1天 → 2天 → 4天 → 7天 → 15天 → 30天
// ============================================================

const STORAGE_KEY = "firefly-study-records";

// 艾宾浩斯复习间隔（天）
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30];
const TOTAL_STAGES = REVIEW_INTERVALS.length;

interface StudyRecord {
	id: string;
	title: string;
	note: string;
	tag: string;
	learnedAt: string; // YYYY-MM-DD
	reviewStage: number; // 已完成的复习次数 0~6
	nextReviewDate: string; // YYYY-MM-DD
	reviewHistory: { date: string; stage: number }[];
}

// ---- 状态 ----
let records = $state<StudyRecord[]>([]);
let currentMonth = $state(new Date());
let todayStr = $state("");

// 表单
let formTitle = $state("");
let formNote = $state("");
let formTag = $state("");

// 标签候选
const TAG_PRESETS = [
	"GAMES101",
	"GAMES202",
	"UE5",
	"C++",
	"Shader",
	"图形学",
	"算法",
	"操作系统",
];

// ---- 工具函数 ----
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

function addDays(dateStr: string, days: number): string {
	const d = parseDate(dateStr);
	d.setDate(d.getDate() + days);
	return formatDate(d);
}

function daysBetween(a: string, b: string): number {
	const da = parseDate(a);
	const db = parseDate(b);
	return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

// ---- 数据持久化 ----
function loadRecords() {
	if (typeof localStorage === "undefined") return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			records = JSON.parse(raw) as StudyRecord[];
		}
	} catch {
		records = [];
	}
}

function saveRecords() {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ---- 添加记录 ----
function addRecord() {
	const title = formTitle.trim();
	if (!title) return;
	const today = todayStr;
	const rec: StudyRecord = {
		id: `rec-${Date.now()}`,
		title,
		note: formNote.trim(),
		tag: formTag.trim() || "未分类",
		learnedAt: today,
		reviewStage: 0,
		nextReviewDate: addDays(today, REVIEW_INTERVALS[0]),
		reviewHistory: [],
	};
	records = [rec, ...records];
	saveRecords();
	formTitle = "";
	formNote = "";
	formTag = "";
}

// ---- 标记已复习 ----
function markReviewed(id: string) {
	records = records.map((r) => {
		if (r.id !== id) return r;
		const newStage = r.reviewStage + 1;
		const history = [...r.reviewHistory, { date: todayStr, stage: newStage }];
		let nextReview = "";
		if (newStage < TOTAL_STAGES) {
			nextReview = addDays(todayStr, REVIEW_INTERVALS[newStage]);
		}
		return {
			...r,
			reviewStage: newStage,
			nextReviewDate: nextReview,
			reviewHistory: history,
		};
	});
	saveRecords();
}

// ---- 删除记录 ----
function deleteRecord(id: string) {
	if (
		typeof window !== "undefined" &&
		!window.confirm("确认删除这条学习记录？")
	)
		return;
	records = records.filter((r) => r.id !== id);
	saveRecords();
}

// ---- 清空全部记录 ----
function clearAllRecords() {
	if (
		typeof window !== "undefined" &&
		!window.confirm("确认清空全部学习记录？此操作不可恢复。")
	)
		return;
	records = [];
	saveRecords();
}

// ---- 今日待复习 ----
const dueToday = $derived(
	records.filter((r) => r.nextReviewDate && r.nextReviewDate <= todayStr),
);

const overdue = $derived(dueToday.filter((r) => r.nextReviewDate < todayStr));

// ---- 已完成（6 次复习全部完成）----
const mastered = $derived(records.filter((r) => r.reviewStage >= TOTAL_STAGES));

// ---- 进行中 ----
const active = $derived(records.filter((r) => r.reviewStage < TOTAL_STAGES));

// ---- 统计 ----
const totalLearned = $derived(records.length);
const totalReviewsDone = $derived(
	records.reduce((sum, r) => sum + r.reviewStage, 0),
);
const todayLearnedCount = $derived(
	records.filter((r) => r.learnedAt === todayStr).length,
);

// ---- 日历生成 ----
const calendarCells = $derived.by(() => {
	const year = currentMonth.getFullYear();
	const month = currentMonth.getMonth();
	const firstDay = new Date(year, month, 1);
	// 周一为一周开始（getDay: 周日=0, 周一=1）
	const startOffset = (firstDay.getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const cells: {
		dateStr: string;
		dayNum: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		learned: boolean;
		reviewed: boolean;
		dueToday: boolean;
		recordCount: number;
	}[] = [];

	// 上月补位
	for (let i = 0; i < startOffset; i++) {
		cells.push({
			dateStr: "",
			dayNum: 0,
			isCurrentMonth: false,
			isToday: false,
			learned: false,
			reviewed: false,
			dueToday: false,
			recordCount: 0,
		});
	}

	for (let d = 1; d <= daysInMonth; d++) {
		const ds = formatDate(new Date(year, month, d));
		const dayRecords = records.filter((r) => r.learnedAt === ds);
		const dayReviews = records.filter((r) =>
			r.reviewHistory.some((h) => h.date === ds),
		);
		cells.push({
			dateStr: ds,
			dayNum: d,
			isCurrentMonth: true,
			isToday: ds === todayStr,
			learned: dayRecords.length > 0,
			reviewed: dayReviews.length > 0,
			dueToday: ds === todayStr && dueToday.length > 0,
			recordCount: dayRecords.length,
		});
	}

	return cells;
});

const monthLabel = $derived(
	`${currentMonth.getFullYear()} 年 ${currentMonth.getMonth() + 1} 月`,
);

function prevMonth() {
	currentMonth = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth() - 1,
		1,
	);
}
function nextMonth() {
	currentMonth = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth() + 1,
		1,
	);
}
function goToday() {
	currentMonth = new Date();
}

// ---- 复习阶段文案 ----
function stageLabel(stage: number): string {
	if (stage >= TOTAL_STAGES) return "已掌握";
	if (stage === 0) return "新学";
	return `第 ${stage}/${TOTAL_STAGES} 次复习`;
}

function stageColor(stage: number): string {
	if (stage >= TOTAL_STAGES)
		return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
	if (stage === 0) return "bg-sky-500/15 text-sky-600 dark:text-sky-400";
	return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
}

onMount(() => {
	todayStr = formatDate(new Date());
	loadRecords();
});
</script>

<div class="study-tracker">
	<!-- 统计概览 -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-(--primary)">{totalLearned}</div>
			<div class="text-xs text-50 mt-0.5">累计学习</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-90">{totalReviewsDone}</div>
			<div class="text-xs text-50 mt-0.5">累计复习次数</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-amber-500">{dueToday.length}</div>
			<div class="text-xs text-50 mt-0.5">今日待复习</div>
		</div>
		<div class="card-base px-4 py-3 text-center">
			<div class="text-2xl font-bold text-emerald-500">{mastered.length}</div>
			<div class="text-xs text-50 mt-0.5">已掌握</div>
		</div>
	</div>

	<!-- 今日待复习 -->
	{#if dueToday.length > 0}
		<div class="card-base px-5 py-4 mb-4 border-l-4 border-amber-400">
			<div class="flex items-center gap-2 mb-3">
				<span class="text-lg">⏰</span>
				<span class="text-sm font-bold text-90">今日待复习（{dueToday.length}）</span>
				{#if overdue.length > 0}
					<span class="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">
						{overdue.length} 条已逾期
					</span>
				{/if}
			</div>
			<div class="space-y-2">
				{#each dueToday as rec (rec.id)}
					<div class="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg bg-(--btn-plain-bg) px-3 py-2.5">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 flex-wrap">
								<span class="text-sm font-medium text-90">{rec.title}</span>
								<span class="text-[0.65rem] px-1.5 py-0.5 rounded {stageColor(rec.reviewStage)}">
									{stageLabel(rec.reviewStage)}
								</span>
								<span class="text-[0.65rem] px-1.5 py-0.5 rounded bg-(--btn-plain-bg-hover) text-50">
									{rec.tag}
								</span>
							</div>
							{#if rec.note}
								<p class="text-xs text-50 mt-1 line-clamp-2">{rec.note}</p>
							{/if}
							{#if rec.nextReviewDate < todayStr}
								<span class="text-[0.65rem] text-red-400 mt-1 inline-block">
									逾期 {daysBetween(rec.nextReviewDate, todayStr)} 天
								</span>
							{/if}
						</div>
						<button
							class="shrink-0 w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-(--primary) text-white text-xs font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
							on:click={() => markReviewed(rec.id)}
						>
							✓ 已复习
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="card-base px-5 py-4 mb-4 border-l-4 border-emerald-400">
			<div class="flex items-center gap-2">
				<span class="text-lg">🎉</span>
				<span class="text-sm text-90">今日没有待复习的内容，继续保持！</span>
			</div>
		</div>
	{/if}

	<!-- 添加学习记录 -->
	<div class="card-base px-5 py-5 mb-4">
		<div class="text-sm font-bold text-90 mb-3">📝 记录新学习内容</div>
		<div class="space-y-3">
			<input
				type="text"
				placeholder="学习内容标题（如：GAMES101 光栅化算法）"
				bind:value={formTitle}
				class="w-full px-3 py-2 rounded-lg bg-(--btn-plain-bg) text-sm text-90 placeholder:text-30 outline-none focus:ring-2 focus:ring-(--primary)/40"
				on:keydown={(e) => e.key === "Enter" && addRecord()}
			/>
			<textarea
				placeholder="学习要点 / 笔记（可选）"
				bind:value={formNote}
				rows="2"
				class="w-full px-3 py-2 rounded-lg bg-(--btn-plain-bg) text-sm text-90 placeholder:text-30 outline-none focus:ring-2 focus:ring-(--primary)/40 resize-none"
			></textarea>
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xs text-50">标签：</span>
				{#each TAG_PRESETS as tag}
					<button
						class="text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer {formTag === tag ? 'bg-(--primary) text-white' : 'bg-(--btn-plain-bg) text-50 hover:bg-(--primary)/20'}"
						on:click={() => (formTag = formTag === tag ? "" : tag)}
					>
						{tag}
					</button>
				{/each}
			</div>
			<button
				class="px-5 py-2 rounded-lg bg-(--primary) text-white text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
				disabled={!formTitle.trim()}
				on:click={addRecord}
			>
				+ 添加记录
			</button>
			<p class="text-[0.65rem] text-30">
				添加后系统将按艾宾浩斯曲线自动安排复习：第 1、2、4、7、15、30 天各复习一次。
			</p>
		</div>
	</div>

	<!-- 月历视图 -->
	<div class="card-base px-5 py-5 mb-4">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<span class="text-sm font-bold text-90">📅 学习日历</span>
				<span class="text-xs text-50">{monthLabel}</span>
			</div>
			<div class="flex items-center gap-1">
				<button
					class="w-8 h-8 rounded-lg bg-(--btn-plain-bg) text-50 hover:text-90 flex items-center justify-center cursor-pointer text-sm"
					on:click={prevMonth}
				>
					‹
				</button>
				<button
					class="px-3 h-8 rounded-lg bg-(--btn-plain-bg) text-50 hover:text-90 cursor-pointer text-xs"
					on:click={goToday}
				>
					今天
				</button>
				<button
					class="w-8 h-8 rounded-lg bg-(--btn-plain-bg) text-50 hover:text-90 flex items-center justify-center cursor-pointer text-sm"
					on:click={nextMonth}
				>
					›
				</button>
			</div>
		</div>

		<!-- 星期表头 -->
		<div class="grid grid-cols-7 gap-1 mb-1">
			{#each ["一", "二", "三", "四", "五", "六", "日"] as day}
				<div class="text-center text-[0.65rem] text-30 py-1">{day}</div>
			{/each}
		</div>

		<!-- 日历格子 -->
		<div class="grid grid-cols-7 gap-1">
			{#each calendarCells as cell, i (i)}
				{#if !cell.isCurrentMonth}
					<div class="aspect-square rounded-lg"></div>
				{:else}
					<div
						class="relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors {cell.isToday ? 'bg-(--primary) text-white' : 'bg-(--btn-plain-bg) text-75'}"
					>
						<span class="font-medium">{cell.dayNum}</span>
						<!-- 标记点 -->
						<div class="flex gap-0.5 mt-0.5">
							{#if cell.learned}
								<span
									class="w-1.5 h-1.5 rounded-full {cell.isToday ? 'bg-white' : 'bg-(--primary)'}"
									title="学习日"
								></span>
							{/if}
							{#if cell.reviewed}
								<span
									class="w-1.5 h-1.5 rounded-full {cell.isToday ? 'bg-white/80' : 'bg-amber-400'}"
									title="复习日"
								></span>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- 图例 -->
		<div class="flex items-center gap-4 mt-3 text-[0.65rem] text-50">
			<span class="flex items-center gap-1">
				<span class="w-2 h-2 rounded-full bg-(--primary)"></span> 学习日
			</span>
			<span class="flex items-center gap-1">
				<span class="w-2 h-2 rounded-full bg-amber-400"></span> 复习日
			</span>
			<span class="flex items-center gap-1">
				<span class="w-2 h-2 rounded bg-(--primary)"></span> 今天
			</span>
		</div>
	</div>

	<!-- 全部学习记录 -->
	{#if records.length > 0}
		<div class="card-base px-5 py-5 mb-4">
			<div class="text-sm font-bold text-90 mb-3">
				📚 全部学习记录（{records.length}）
			</div>
			<div class="space-y-2">
				{#each records as rec (rec.id)}
					<div class="rounded-lg bg-(--btn-plain-bg) px-4 py-3">
						<div class="flex items-center gap-2 flex-wrap">
							<span class="text-sm font-medium text-90">{rec.title}</span>
							<span class="text-[0.65rem] px-1.5 py-0.5 rounded {stageColor(rec.reviewStage)}">
								{stageLabel(rec.reviewStage)}
							</span>
							<span class="text-[0.65rem] px-1.5 py-0.5 rounded bg-(--btn-plain-bg-hover) text-50">
								{rec.tag}
							</span>
							<span class="text-[0.65rem] text-30 ml-auto">
								学于 {rec.learnedAt}
							</span>
						</div>
						{#if rec.note}
							<p class="text-xs text-50 mt-1.5 leading-relaxed">{rec.note}</p>
						{/if}
						<div class="flex items-center gap-3 mt-2 flex-wrap">
							{#if rec.reviewStage < TOTAL_STAGES}
								<span class="text-[0.65rem] text-amber-500">
									下次复习：{rec.nextReviewDate}
								</span>
							{:else}
								<span class="text-[0.65rem] text-emerald-500">✓ 已完成全部复习</span>
							{/if}
							{#if rec.reviewHistory.length > 0}
								<span class="text-[0.65rem] text-30">
									复习记录：{rec.reviewHistory.map((h) => h.date).join("、")}
								</span>
							{/if}
							<button
								class="text-[0.65rem] text-red-400 hover:text-red-500 ml-auto cursor-pointer"
								on:click={() => deleteRecord(rec.id)}
							>
								删除
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<p class="text-center text-xs text-30 mb-2">
		💾 数据保存在浏览器本地（localStorage），换设备不迁移。艾宾浩斯复习间隔：1 → 2 → 4 → 7 → 15 → 30 天。
	</p>

	<!-- 数据管理 -->
	<div class="card-base px-5 py-4 mt-4">
		<div class="text-sm font-bold text-90 mb-2">🗑️ 数据管理</div>
		<p class="text-xs text-50 mb-3">以新手身份从零开始？清空所有本地学习记录。</p>
		<button
			class="px-4 py-2 rounded-lg bg-red-500/15 text-red-500 text-sm font-bold hover:bg-red-500/25 transition-colors cursor-pointer"
			on:click={clearAllRecords}
		>
			清空全部学习记录
		</button>
	</div>
</div>

<style>
	.study-tracker {
		width: 100%;
	}
</style>
