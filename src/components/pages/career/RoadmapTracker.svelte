<script lang="ts">
import { onMount } from "svelte";

import type { CareerConfig, RoadmapPhase } from "@/types/career";

let { config }: { config: CareerConfig } = $props();

// 本地存储 key
const STORAGE_KEY = "firefly-career-progress";

// 已勾选任务集合
let completedTasks = $state<Set<string>>(new Set());
// 阶段折叠状态
let collapsedPhases = $state<Set<string>>(new Set());

// 统计数据（$derived：completedTasks 变化时自动重算）
const totalTasks = $derived(
	config.phases.reduce((sum, p) => sum + p.tasks.length, 0),
);
const completedCount = $derived(
	config.phases.reduce(
		(sum, p) => sum + p.tasks.filter((t) => completedTasks.has(t.id)).length,
		0,
	),
);
const progressPercent = $derived(
	totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100),
);
// 剩余天数
let daysLeft = 0;

function loadProgress() {
	if (typeof localStorage === "undefined") return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			completedTasks = new Set(JSON.parse(raw) as string[]);
		}
	} catch {
		completedTasks = new Set();
	}
}

function saveProgress() {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedTasks]));
}

function toggleTask(taskId: string) {
	if (completedTasks.has(taskId)) {
		completedTasks.delete(taskId);
	} else {
		completedTasks.add(taskId);
	}
	// 触发响应式更新
	completedTasks = new Set(completedTasks);
	saveProgress();
}

function togglePhase(phaseId: string) {
	if (collapsedPhases.has(phaseId)) {
		collapsedPhases.delete(phaseId);
	} else {
		collapsedPhases.add(phaseId);
	}
	collapsedPhases = new Set(collapsedPhases);
}

function phaseCompletedTasks(phase: RoadmapPhase): number {
	return phase.tasks.filter((t) => completedTasks.has(t.id)).length;
}

function phasePercent(phase: RoadmapPhase): number {
	if (phase.tasks.length === 0) return 0;
	return Math.round((phaseCompletedTasks(phase) / phase.tasks.length) * 100);
}

function phaseStatusText(phase: RoadmapPhase): string {
	const percent = phasePercent(phase);
	if (percent === 100) return "已完成";
	if (percent > 0) return "进行中";
	return phase.status === "in-progress" ? "待开始" : "未开始";
}

// 每阶段的派生数据（$derived：completedTasks 变化时自动重算整张表）
const phaseStats = $derived(
	new Map(
		config.phases.map((p) => {
			const done = p.tasks.filter((t) => completedTasks.has(t.id)).length;
			const total = p.tasks.length;
			const percent = total === 0 ? 0 : Math.round((done / total) * 100);
			return [
				p.id,
				{
					done,
					total,
					percent,
					statusText:
						percent === 100
							? "已完成"
							: percent > 0
								? "进行中"
								: p.status === "in-progress"
									? "待开始"
									: "未开始",
				},
			];
		}),
	),
);

onMount(() => {
	loadProgress();
	// 计算距离投递截止的剩余天数
	const now = new Date();
	const deadline = new Date(config.deadline);
	daysLeft = Math.max(
		0,
		Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000),
	);
});
</script>

<div class="roadmap-card">
	<!-- 总进度 -->
	<div class="overview card-base px-6 py-5 mb-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-bold text-90">{config.target}</h2>
				<p class="text-sm text-50 mt-1">{config.targetRole} · 每日投入 {config.dailyHours}</p>
			</div>
			<div class="flex items-center gap-6">
				<div class="text-center">
					<div class="text-3xl font-bold text-(--primary)">{progressPercent}%</div>
					<div class="text-xs text-50 mt-1">总体进度</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-90">{completedCount}<span class="text-base text-50">/{totalTasks}</span></div>
					<div class="text-xs text-50 mt-1">已完成任务</div>
				</div>
				{#if daysLeft > 0}
					<div class="text-center">
						<div class="text-3xl font-bold text-(--warning, #eab308)">{daysLeft}</div>
						<div class="text-xs text-50 mt-1">距离投递截止(天)</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="mt-4 h-2.5 rounded-full bg-(--btn-plain-bg) overflow-hidden">
			<div
				class="h-full rounded-full bg-(--primary) transition-all duration-500"
				style="width: {progressPercent}%"
			></div>
		</div>
	</div>

	<!-- 阶段列表 -->
	{#each config.phases as phase, index (phase.id)}
		<div class="card-base px-6 py-5 mb-4 onload-animation" style="animation-delay: calc(var(--content-delay) + {index * 60}ms);">
			<button
				class="flex w-full items-start gap-4 text-left cursor-pointer"
				on:click={() => togglePhase(phase.id)}
				aria-expanded={!collapsedPhases.has(phase.id)}
			>
				<div
					class="shrink-0 mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl text-white"
					style="background: {phase.accent}"
				>
					<span class="text-xl font-bold">{index + 1}</span>
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
						<h3 class="text-lg font-bold text-90">{phase.title}</h3>
						<span class="text-xs px-2 py-0.5 rounded-full bg-(--primary)/10 text-(--primary)">
							{phaseStats.get(phase.id)?.statusText}
						</span>
						<span class="text-xs text-50">{phase.period}</span>
					</div>
					<p class="text-sm text-50 mt-1.5 leading-relaxed">{phase.goal}</p>
					<div class="mt-3 flex items-center gap-3">
						<div class="flex-1 h-1.5 rounded-full bg-(--btn-plain-bg) overflow-hidden">
							<div
								class="h-full rounded-full transition-all duration-500"
								style="width: {phaseStats.get(phase.id)?.percent}%; background: {phase.accent}"
							></div>
						</div>
						<span class="text-xs text-50 shrink-0">{phaseStats.get(phase.id)?.done}/{phaseStats.get(phase.id)?.total}</span>
					</div>
				</div>
				<div
					class="shrink-0 mt-1 text-30 transition-transform duration-200"
					class:rotate-180={!collapsedPhases.has(phase.id)}
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
			</button>

			{#if !collapsedPhases.has(phase.id)}
				<ul class="mt-4 space-y-2">
					{#each phase.tasks as task (task.id)}
						<li>
							<label
								class="group flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-(--btn-plain-bg-hover)"
							>
								<input
									type="checkbox"
									class="mt-0.5 h-4.5 w-4.5 shrink-0 accent-(--primary)"
									checked={completedTasks.has(task.id)}
									on:change={() => toggleTask(task.id)}
								/>
								<div class="min-w-0 flex-1">
									<div
										class="text-sm font-medium text-90 transition-colors"
										class:line-through={completedTasks.has(task.id)}
										class:text-30={completedTasks.has(task.id)}
									>
										{task.title}
										{#if task.estimate}
											<span class="ml-2 text-xs font-normal text-30">({task.estimate})</span>
										{/if}
									</div>
									{#if task.detail}
										<p class="text-xs text-50 mt-0.5 leading-relaxed">{task.detail}</p>
									{/if}
									{#if task.tags && task.tags.length > 0}
										<div class="mt-1.5 flex flex-wrap gap-1.5">
											{#each task.tags as tag}
												<span class="text-[0.65rem] px-1.5 py-0.5 rounded bg-(--btn-plain-bg) text-50">{tag}</span>
											{/each}
										</div>
									{/if}
								</div>
							</label>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/each}

	<!-- 求职里程碑 -->
	<div class="card-base px-6 py-5 mb-4">
		<h3 class="text-lg font-bold text-90 mb-4">求职里程碑</h3>
		<ol class="relative ml-2 border-l-2 border-(--line-divider)">
			{#each config.milestones as milestone (milestone.id)}
				<li class="ml-5 pb-6 last:pb-0 relative">
					<span
						class={`absolute -left-8.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
							milestone.done
								? "border-(--primary) bg-(--primary)"
								: milestone.type === "offer"
									? "border-(--primary) bg-transparent"
									: "border-(--line-divider) bg-transparent"
						}`}
					>
						{#if milestone.done}
							<svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
								<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						{/if}
					</span>
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-sm font-bold text-90">{milestone.title}</span>
						<span class="text-xs text-50">{milestone.date}</span>
						<span
							class={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${
								milestone.type === "offer"
									? "bg-(--primary)/10 text-(--primary)"
									: "bg-(--btn-plain-bg) text-50"
							}`}
						>
							{milestone.type === "prepare" && "准备"}
							{milestone.type === "apply" && "投递"}
							{milestone.type === "interview" && "面试"}
							{milestone.type === "offer" && "目标"}
						</span>
					</div>
					<p class="text-xs text-50 mt-0.5">{milestone.detail}</p>
				</li>
			{/each}
		</ol>
	</div>

	<p class="text-center text-xs text-30 mb-2">
		进度自动保存在浏览器本地（localStorage），换设备不迁移。
	</p>
</div>

<style>
	.roadmap-card {
		width: 100%;
	}
</style>
