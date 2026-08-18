<script lang="ts">
import { onMount } from "svelte";

import type { InterviewConfig, MasteryState } from "@/types/interview";

let { config }: { config: InterviewConfig } = $props();

// 本地存储 key
const STORAGE_KEY = "firefly-interview-mastery";

// 会话状态
let allQuestions = flattenQuestions();
let sessionQuestions = $state<number[]>([]); // 本次抽题在 allQuestions 中的索引
let currentIndex = $state(0);
let phase = $state<"config" | "answering" | "revealed" | "done">("config");
let showAnswer = $state(false);
let remaining = $state(0);
let timer: ReturnType<typeof setInterval> | null = null;
let selectedCount = $state(5);
let sessionStats = $state({ answered: 0, mastered: 0, learning: 0, unseen: 0 });

// 自评记录
let masteryMap = $state<Record<string, MasteryState>>({});

function flattenQuestions() {
	const result: (typeof config.categories)[number]["questions"][number][] = [];
	for (const cat of config.categories) {
		result.push(...cat.questions);
	}
	return result;
}

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

function startSession() {
	// Fisher-Yates 洗牌
	const indices = allQuestions.map((_, i) => i);
	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}
	sessionQuestions = indices.slice(0, selectedCount);
	currentIndex = 0;
	phase = "answering";
	showAnswer = false;
	sessionStats = { answered: 0, mastered: 0, learning: 0, unseen: 0 };
	startTimer();
}

function startTimer() {
	stopTimer();
	remaining = 120; // 每题 2 分钟
	timer = setInterval(() => {
		remaining--;
		if (remaining <= 0) {
			remaining = 0;
			reveal();
		}
	}, 1000);
}

function stopTimer() {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}

function formatTime(sec: number) {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

function getCurrent() {
	if (sessionQuestions.length === 0) return null;
	return allQuestions[sessionQuestions[currentIndex]];
}

// 当前题目（$derived：currentIndex/sessionQuestions 变化时自动重算）
const currentQuestion = $derived(
	sessionQuestions.length === 0
		? null
		: (allQuestions[sessionQuestions[currentIndex]] ?? null),
);

function reveal() {
	stopTimer();
	phase = "revealed";
}

function next() {
	if (currentIndex >= sessionQuestions.length - 1) {
		phase = "done";
		stopTimer();
		return;
	}
	currentIndex++;
	phase = "answering";
	showAnswer = false;
	startTimer();
}

function selfRate(state: MasteryState) {
	const q = getCurrent();
	if (!q) return;
	masteryMap = { ...masteryMap, [q.id]: state };
	saveMastery();
	if (state === "mastered") sessionStats.mastered++;
	else if (state === "learning") sessionStats.learning++;
	else sessionStats.unseen++;
	sessionStats.answered++;
	next();
}

function restart() {
	stopTimer();
	phase = "config";
	sessionQuestions = [];
	currentIndex = 0;
}

function difficultyLabel(d: string) {
	return d === "easy" ? "简单" : d === "medium" ? "中等" : "困难";
}

function difficultyColor(d: string) {
	if (d === "easy")
		return "bg-[oklch(0.88_0.12_145)] text-[oklch(0.3_0.12_145)]";
	if (d === "medium")
		return "bg-[oklch(0.88_0.12_80)] text-[oklch(0.35_0.12_80)]";
	return "bg-[oklch(0.88_0.12_20)] text-[oklch(0.4_0.12_20)]";
}

onMount(() => {
	loadMastery();
});
</script>

<div class="mock-interview">
	<!-- 配置阶段 -->
	{#if phase === "config"}
		<div class="card-base px-8 py-10 text-center">
			<div class="text-5xl mb-4">🎤</div>
			<h2 class="text-2xl font-bold text-90 mb-2">模拟面试</h2>
			<p class="text-sm text-50 mb-6 max-w-md mx-auto leading-relaxed">
				从题库（共 {allQuestions.length} 题）随机抽题，每题限时 2 分钟口述回答，
				然后翻看参考答案并自评掌握度。模拟真实面试节奏。
			</p>
			<div class="flex items-center justify-center gap-3 mb-8">
				<span class="text-sm text-50">题目数量</span>
				<select
					class="text-sm px-3 py-1.5 rounded-lg bg-(--btn-plain-bg) text-90 border-none outline-none"
					bind:value={selectedCount}
				>
					<option value={3}>3 题（快速热场）</option>
					<option value={5}>5 题（标准模拟）</option>
					<option value={8}>8 题（全真压力）</option>
				</select>
			</div>
			<button
				class="px-8 py-3 rounded-xl bg-(--primary) text-white font-bold text-base transition-transform hover:scale-105 active:scale-95"
				on:click={startSession}
			>
				开始模拟面试
			</button>
		</div>
	{/if}

	<!-- 答题阶段 -->
	{#if phase === "answering" || phase === "revealed"}
		{#if currentQuestion}
			<div class="card-base px-6 py-5 mb-4">
				<!-- 顶部信息 -->
				<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
					<div class="flex items-center gap-3">
						<span class="text-sm font-bold text-(--primary)">
							第 {currentIndex + 1} / {sessionQuestions.length} 题
						</span>
						<span class={`text-xs px-2 py-0.5 rounded ${difficultyColor(currentQuestion.difficulty)}`}>
							{difficultyLabel(currentQuestion.difficulty)}
						</span>
					</div>
					<div class="flex items-center gap-4">
						<span class="text-sm tabular-nums font-mono">
							⏱ {formatTime(remaining)}
						</span>
						<button
							class="text-xs text-50 hover:text-(--primary) transition-colors"
							on:click={restart}
						>
							退出
						</button>
					</div>
				</div>

				<!-- 进度条 -->
				<div class="h-1.5 rounded-full bg-(--btn-plain-bg) overflow-hidden mb-5">
					<div
						class="h-full bg-(--primary) transition-all duration-300"
						style="width: {((currentIndex) / sessionQuestions.length) * 100}%"
					></div>
				</div>

				<!-- 题目 -->
				<h3 class="text-xl font-bold text-90 leading-relaxed mb-3">
					{currentQuestion.question}
				</h3>

				<!-- 提示（答题时默认隐藏，翻看后显示） -->
				{#if phase === "revealed"}
					<div class="rounded-lg bg-(--btn-plain-bg) px-4 py-3 mb-4">
						<div class="text-xs text-50 mb-2">💡 考察点</div>
						<div class="text-sm text-90">{currentQuestion.hint}</div>
					</div>

					<div class="rounded-lg border border-(--primary)/30 px-4 py-3 mb-5">
						<div class="text-xs text-(--primary) mb-2 font-bold">📋 参考答案要点</div>
						<ul class="space-y-1.5">
							{#each currentQuestion.answer as point}
								<li class="text-sm text-90 leading-relaxed flex gap-2">
									<span class="text-(--primary) shrink-0">▸</span>
									<span>{point}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- 操作区 -->
				{#if phase === "answering"}
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="text-xs text-30">口述你的答案，时间到自动翻看参考答案</p>
						<button
							class="px-5 py-2 rounded-lg bg-(--primary)/15 text-(--primary) text-sm font-bold transition-colors hover:bg-(--primary)/25"
							on:click={reveal}
						>
							提前翻看答案
						</button>
					</div>
				{:else}
					<div class="flex flex-wrap items-center justify-center gap-3">
						<span class="text-sm text-50 mr-2">自评掌握度：</span>
						<button
							class="px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-(--btn-plain-bg) text-50 hover:bg-[oklch(0.82_0.13_75)] hover:text-[oklch(0.25_0.08_75)]"
							on:click={() => selfRate("unseen")}
						>
							不会
						</button>
						<button
							class="px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-(--btn-plain-bg) text-50 hover:bg-[oklch(0.82_0.13_75)] hover:text-[oklch(0.25_0.08_75)]"
							on:click={() => selfRate("learning")}
						>
							部分会
						</button>
						<button
							class="px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-(--btn-plain-bg) text-50 hover:bg-(--primary) hover:text-white"
							on:click={() => selfRate("mastered")}
						>
							已掌握
						</button>
					</div>
				{/if}
			</div>
		{/if}
	{/if}

	<!-- 完成阶段 -->
	{#if phase === "done"}
		<div class="card-base px-8 py-10 text-center">
			<div class="text-5xl mb-4">🎉</div>
			<h2 class="text-2xl font-bold text-90 mb-2">本轮模拟完成！</h2>
			<p class="text-sm text-50 mb-6">共 {sessionQuestions.length} 题，你的自评结果：</p>
			<div class="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
				<div class="rounded-xl bg-(--primary)/10 py-4">
					<div class="text-3xl font-bold text-(--primary)">{sessionStats.mastered}</div>
					<div class="text-xs text-50 mt-1">已掌握</div>
				</div>
				<div class="rounded-xl bg-[oklch(0.88_0.12_80)/30] py-4">
					<div class="text-3xl font-bold text-[oklch(0.35_0.12_80)]">{sessionStats.learning}</div>
					<div class="text-xs text-50 mt-1">部分会</div>
				</div>
				<div class="rounded-xl bg-(--btn-plain-bg) py-4">
					<div class="text-3xl font-bold text-50">{sessionStats.unseen}</div>
					<div class="text-xs text-50 mt-1">不会</div>
				</div>
			</div>
			<p class="text-xs text-30 mb-6">
				自评结果已同步到<a href="/interview/" class="text-(--primary) hover:underline">面试题库</a>的掌握状态。
				针对「不会」的题，建议去对应的深度笔记复习后再来一轮。
			</p>
			<div class="flex items-center justify-center gap-3">
				<button
					class="px-6 py-3 rounded-xl bg-(--primary) text-white font-bold text-sm transition-transform hover:scale-105"
					on:click={restart}
				>
					再来一轮
				</button>
				<a
					href="/interview/"
					class="px-6 py-3 rounded-xl bg-(--btn-plain-bg) text-75 font-bold text-sm transition-colors hover:bg-(--btn-plain-bg-hover)"
				>
					返回题库复习
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.mock-interview {
		width: 100%;
	}
</style>
