<script lang="ts">
import { onMount } from "svelte";

import type {
	InterviewConfig,
	MasteryState,
	QuestionCategory,
	QuestionDifficulty,
} from "@/types/interview";

let { config }: { config: InterviewConfig } = $props();

// 本地存储 key
const STORAGE_KEY = "firefly-interview-mastery";

// 掌握状态记录: questionId -> mastery
let masteryMap = $state<Record<string, MasteryState>>({});
// 展开的题目
let expandedQuestions = $state<Set<string>>(new Set());
// 当前筛选分类
let activeCategoryId = $state("all");
// 当前难度筛选
let activeDifficulty = $state<QuestionDifficulty | "all">("all");
// 当前掌握状态筛选
let activeMastery = $state<MasteryState | "all">("all");
// 搜索关键字
let searchQuery = $state("");

// 统计数据
let masteredCount = $derived(
	Object.values(masteryMap).filter((s) => s === "mastered").length,
);
const totalQuestions = $derived(
	config.categories.reduce((sum, c) => sum + c.questions.length, 0),
);

const difficultyLabel: Record<QuestionDifficulty, string> = {
	easy: "简单",
	medium: "中等",
	hard: "困难",
};

const difficultyColor: Record<QuestionDifficulty, string> = {
	easy: "bg-[oklch(0.88_0.12_145)] text-[oklch(0.3_0.12_145)]",
	medium: "bg-[oklch(0.88_0.12_80)] text-[oklch(0.35_0.12_80)]",
	hard: "bg-[oklch(0.88_0.12_20)] text-[oklch(0.4_0.12_20)]",
};

function loadMastery() {
	if (typeof localStorage === "undefined") return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) masteryMap = JSON.parse(raw) as Record<string, MasteryState>;
	} catch {
		masteryMap = {};
	}
}

function saveMastery() {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryMap));
}

function setMastery(questionId: string, state: MasteryState) {
	masteryMap = { ...masteryMap, [questionId]: state };
	saveMastery();
}

function cycleMastery(questionId: string) {
	const order: MasteryState[] = ["unseen", "learning", "mastered"];
	const current = masteryMap[questionId] ?? "unseen";
	const next = order[(order.indexOf(current) + 1) % order.length];
	setMastery(questionId, next);
}

function toggleQuestion(questionId: string) {
	if (expandedQuestions.has(questionId)) {
		expandedQuestions.delete(questionId);
	} else {
		expandedQuestions.add(questionId);
	}
	expandedQuestions = new Set(expandedQuestions);
}

function getMastery(id: string): MasteryState {
	return masteryMap[id] ?? "unseen";
}

// 状态按钮：文字 + 明显的背景/文字颜色组合（深色模式同样清晰）
const masteryButtonClass: Record<MasteryState, string> = {
	unseen: "bg-(--btn-plain-bg) text-50",
	learning: "bg-[oklch(0.82_0.13_75)] text-[oklch(0.25_0.08_75)]",
	mastered: "bg-(--primary) text-white",
};

const masteryBadgeClass: Record<MasteryState, string> = {
	unseen: "bg-(--btn-plain-bg) text-50",
	learning: "bg-[oklch(0.85_0.1_75)] text-[oklch(0.3_0.09_75)]",
	mastered: "bg-(--primary)/15 text-(--primary)",
};

const masteryBadgeLabel: Record<MasteryState, string> = {
	unseen: "未开始",
	learning: "学习中",
	mastered: "已掌握",
};

// 过滤后的分类（$derived：任何筛选状态变化时自动重算）
const filteredCategories = $derived(
	config.categories
		.map((cat) => {
			if (activeCategoryId !== "all" && cat.id !== activeCategoryId) {
				return null;
			}
			const questions = cat.questions.filter((q) => {
				if (activeDifficulty !== "all" && q.difficulty !== activeDifficulty)
					return false;
				const m = masteryMap[q.id] ?? "unseen";
				if (activeMastery !== "all" && m !== activeMastery) return false;
				if (searchQuery.trim()) {
					const kw = searchQuery.trim().toLowerCase();
					const haystack = `${q.question} ${q.hint} ${(q.tags ?? []).join(" ")}`.toLowerCase();
					if (!haystack.includes(kw)) return false;
				}
				return true;
			});
			return { ...cat, questions };
		})
		.filter((cat): cat is QuestionCategory => cat !== null && cat.questions.length > 0),
);

const masteryLabel: Record<MasteryState, string> = {
	unseen: "未开始",
	learning: "学习中",
	mastered: "已掌握",
};

onMount(() => {
	loadMastery();
});
</script>

<div class="interview-bank">
	<!-- 概览 -->
	<div class="card-base px-6 py-5 mb-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-bold text-90">{config.title}</h2>
				<p class="text-sm text-50 mt-1">{config.description}</p>
			</div>
			<div class="flex items-center gap-6">
				<div class="text-center">
					<div class="text-3xl font-bold text-(--primary)">{masteredCount}</div>
					<div class="text-xs text-50 mt-1">已掌握</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-90">{totalQuestions}</div>
					<div class="text-xs text-50 mt-1">总题数</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 筛选栏 -->
	<div class="card-base px-6 py-4 mb-4">
		<div class="flex flex-wrap items-center gap-2 mb-3">
			<button
				class={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
					activeCategoryId === "all"
						? "bg-(--primary) text-white"
						: "bg-(--btn-plain-bg) text-50"
				}`}
				on:click={() => (activeCategoryId = "all")}
			>
				全部
			</button>
			{#each config.categories as cat}
				<button
					class={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
						activeCategoryId === cat.id
							? "bg-(--primary) text-white"
							: "bg-(--btn-plain-bg) text-50"
					}`}
					on:click={() => (activeCategoryId = cat.id)}
				>
					{cat.name}
				</button>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<select
				class="text-sm px-3 py-1.5 rounded-lg bg-(--btn-plain-bg) text-50 border-none outline-none"
				bind:value={activeDifficulty}
			>
				<option value="all">全部难度</option>
				<option value="easy">简单</option>
				<option value="medium">中等</option>
				<option value="hard">困难</option>
			</select>
			<select
				class="text-sm px-3 py-1.5 rounded-lg bg-(--btn-plain-bg) text-50 border-none outline-none"
				bind:value={activeMastery}
			>
				<option value="all">全部状态</option>
				<option value="unseen">未开始</option>
				<option value="learning">学习中</option>
				<option value="mastered">已掌握</option>
			</select>
			<input
				type="text"
				placeholder="搜索题目…"
				class="flex-1 min-w-40 text-sm px-3 py-1.5 rounded-lg bg-(--btn-plain-bg) text-90 placeholder:text-30 border-none outline-none focus:ring-2 focus:ring-(--primary)/30"
				bind:value={searchQuery}
			/>
		</div>
	</div>

	<!-- 题目列表 -->
	{#each filteredCategories as cat}
		<div class="card-base px-6 py-5 mb-4">
			<div class="flex items-center gap-2 mb-1">
				<h3 class="text-lg font-bold text-90">{cat.name}</h3>
				<span class="text-xs text-50">({cat.questions.length} 题)</span>
			</div>
			<p class="text-xs text-50 mb-4">{cat.description}</p>

			<div class="space-y-2">
				{#each cat.questions as q (q.id)}
					<div
						class={`rounded-lg border transition-colors ${
							expandedQuestions.has(q.id)
								? "border-(--primary)/40"
								: "border-(--line-divider)"
						}`}
					>
						<div class="flex items-start gap-3 px-4 py-3 cursor-pointer" on:click={() => toggleQuestion(q.id)}>
							<button
								class={`shrink-0 mt-0.5 h-7 px-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all border-none cursor-pointer ${masteryButtonClass[masteryMap[q.id] ?? "unseen"]}`}
								title="点击切换掌握状态：未开始 → 学习中 → 已掌握"
								on:click={(e) => {
									e.stopPropagation();
									cycleMastery(q.id);
								}}
							>
								{masteryLabel[masteryMap[q.id] ?? "unseen"]}
							</button>
							<div class="flex-1 min-w-0">
								<div class="text-sm font-medium text-90 leading-snug">{q.question}</div>
								<div class="mt-1 flex flex-wrap items-center gap-2">
									<span class={`text-[0.65rem] px-1.5 py-0.5 rounded ${difficultyColor[q.difficulty]}`}>
										{difficultyLabel[q.difficulty]}
									</span>
									{#if q.tags && q.tags.length > 0}
										{#each q.tags as tag}
											<span class="text-[0.65rem] px-1.5 py-0.5 rounded bg-(--btn-plain-bg) text-50">{tag}</span>
										{/each}
									{/if}
								</div>
							</div>
							<div class="shrink-0 text-30 transition-transform duration-200 mt-1" class:rotate-180={expandedQuestions.has(q.id)}>
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						</div>

						{#if expandedQuestions.has(q.id)}
							<div class="px-4 pb-4 pt-1 border-t border-(--line-divider) mt-0">
								<div class="flex flex-wrap items-center gap-2 mb-2">
									<span class="text-xs text-50">当前状态：</span>
									<span class={`text-xs px-2 py-0.5 rounded-full font-bold ${masteryBadgeClass[masteryMap[q.id] ?? "unseen"]}`}>
										{masteryBadgeLabel[masteryMap[q.id] ?? "unseen"]}
									</span>
									<button
										class="text-xs text-(--primary) hover:underline cursor-pointer"
										on:click={(e) => {
											e.stopPropagation();
											cycleMastery(q.id);
										}}
									>
										点击切换
									</button>
								</div>
								<div class="text-xs text-50 mb-2">💡 {q.hint}</div>
								<div class="space-y-1.5">
									{#each q.answer as point}
										<div class="text-sm text-90 leading-relaxed flex gap-2">
											<span class="text-(--primary) shrink-0">▸</span>
											<span>{point}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if filteredCategories.length === 0}
		<div class="card-base px-8 py-12 text-center">
			<p class="text-30">没有符合条件的题目，试试调整筛选条件</p>
		</div>
	{/if}

	<p class="text-center text-xs text-30 mb-2">
		掌握状态自动保存在浏览器本地（localStorage）。
	</p>
</div>

<style>
	.interview-bank {
		width: 100%;
	}
</style>
