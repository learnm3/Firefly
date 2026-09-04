<script lang="ts">
import { onMount } from "svelte";
import type { KbMapPayload, KbTreeNode, KbView } from "@/types/kb";

let { payload }: { payload: KbMapPayload } = $props();

// ============================== 状态 ==============================
let view = $state<KbView>("branch");
let collapsed = $state<Set<string>>(new Set());
let query = $state("");
let scale = $state(1);
let panX = $state(0);
let panY = $state(0);
let viewW = $state(800);
let viewH = $state(560);
let svgEl: SVGSVGElement | undefined;

const tree = $derived(
	view === "branch" ? payload.branchTree : payload.typeTree,
);

// 类型/领域文案小工具
function typeColor(type: string): string {
	return payload.typeMeta.find((t) => t.id === type)?.color ?? "#888";
}
function branchName(branch: string): string {
	return payload.branchMeta.find((b) => b.id === branch)?.name ?? branch;
}

// ============================== 布局 ==============================
type PlacedNode = {
	node: KbTreeNode;
	x: number;
	y: number;
	angle: number;
	isCollapsed: boolean;
};
type Edge = { x1: number; y1: number; x2: number; y2: number };

const RING = 160;
const NODE_R: Record<string, number> = {
	root: 44,
	branch: 25,
	type: 25,
	topic: 15,
	entry: 7.5,
};

function charWidth(ch: string, fontSize: number): number {
	const code = ch.codePointAt(0) ?? 0;
	if ((code >= 0x2e80 && code <= 0x9fff) || code >= 0xff00) return fontSize;
	return fontSize * 0.58;
}
function textWidth(text: string, fontSize: number): number {
	let w = 0;
	for (const ch of text) w += charWidth(ch, fontSize);
	return w;
}
function radiusOf(kind: string): number {
	return NODE_R[kind] ?? 10;
}

/** 超长标题截断，避免导图文字互相遮挡 */
function truncateLabel(label: string): string {
	const max = 16;
	return label.length > max ? `${label.slice(0, max)}…` : label;
}

function computeLayout(root: KbTreeNode): {
	nodes: PlacedNode[];
	edges: Edge[];
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
} {
	const nodes: PlacedNode[] = [];
	const edges: Edge[] = [];

	const place = (
		node: KbTreeNode,
		angleStart: number,
		angleEnd: number,
		depth: number,
		parentX?: number,
		parentY?: number,
	) => {
		const mid = (angleStart + angleEnd) / 2;
		const r = depth * RING;
		const x = r * Math.sin(mid);
		const y = -r * Math.cos(mid);
		const isCollapsed = collapsed.has(node.id);
		nodes.push({ node, x, y, angle: mid, isCollapsed });
		if (parentX !== undefined && parentY !== undefined) {
			edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
		}
		if (isCollapsed) return;
		const kids = node.children ?? [];
		if (kids.length === 0) return;
		// 权重始终按子树叶子数计，保证折叠/展开时扇区稳定
		const weights = kids.map((k) => Math.max(1, k.leafCount));
		const total = weights.reduce((a, b) => a + b, 0) || kids.length;
		let cursor = angleStart;
		kids.forEach((kid, i) => {
			const span = ((angleEnd - angleStart) * weights[i]) / total;
			place(kid, cursor, cursor + span, depth + 1, x, y);
			cursor += span;
		});
	};

	place(root, 0, Math.PI * 2, 0);

	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	const labelFont = 12.5;
	for (const p of nodes) {
		const rr = radiusOf(p.node.kind);
		let left = p.x - rr;
		let right = p.x + rr;
		let top = p.y - rr;
		let bottom = p.y + rr;
		if (p.node.kind !== "entry" && p.node.kind !== "root") {
			const w = textWidth(p.node.label, labelFont);
			const offset = rr + 7;
			if (p.x >= 0) right = Math.max(right, p.x + offset + w + 4);
			else left = Math.min(left, p.x - offset - w - 4);
			top = Math.min(top, p.y - labelFont);
			bottom = Math.max(bottom, p.y + labelFont);
		} else if (p.node.kind === "entry") {
			const w = textWidth(truncateLabel(p.node.label), labelFont);
			const offset = rr + 6;
			if (p.x >= 0) right = Math.max(right, p.x + offset + w + 4);
			else left = Math.min(left, p.x - offset - w - 4);
			top = Math.min(top, p.y - labelFont);
			bottom = Math.max(bottom, p.y + labelFont);
		} else {
			const w = textWidth("知识库", labelFont) + 10;
			left = Math.min(left, p.x - w);
			right = Math.max(right, p.x + w);
			top = Math.min(top, p.y - labelFont * 2.1);
			bottom = Math.max(bottom, p.y + labelFont * 2.1);
		}
		minX = Math.min(minX, left);
		minY = Math.min(minY, top);
		maxX = Math.max(maxX, right);
		maxY = Math.max(maxY, bottom);
	}
	if (!Number.isFinite(minX)) {
		minX = minY = -60;
		maxX = maxY = 60;
	}
	return { nodes, edges, minX, minY, maxX, maxY };
}

const layout = $derived(computeLayout(tree));

// ============================== 视口 ==============================
// 用户是否手动缩放过（手动缩放后不再自动适配，避免打断阅读）
let zoomedManually = false;

function fitView() {
	const el = svgEl;
	if (!el) return;
	const rect = el.getBoundingClientRect();
	if (rect.width > 0) viewW = rect.width;
	if (rect.height > 0) viewH = rect.height;
	const { minX, minY, maxX, maxY } = layout;
	const contentW = Math.max(1, maxX - minX);
	const contentH = Math.max(1, maxY - minY);
	const pad = 40;
	const k = Math.min(
		(viewW - pad * 2) / contentW,
		(viewH - pad * 2) / contentH,
		2.2,
	);
	scale = Math.max(0.05, k);
	panX = viewW / 2 - ((minX + maxX) / 2) * scale;
	panY = viewH / 2 - ((minY + maxY) / 2) * scale;
	zoomedManually = false;
}

function zoomAt(px: number, py: number, factor: number) {
	const k = Math.min(6, Math.max(0.05, scale * factor));
	panX = px - ((px - panX) * k) / scale;
	panY = py - ((py - panY) * k) / scale;
	scale = k;
	zoomedManually = true;
}

/** 结构变化后若用户未手动缩放，则自动适配视口 */
function refitIfAuto() {
	if (!zoomedManually) requestAnimationFrame(() => fitView());
}

// ============================== 交互 ==============================
function toggleCollapse(id: string) {
	const next = new Set(collapsed);
	if (next.has(id)) next.delete(id);
	else next.add(id);
	collapsed = next;
}

/** 收起指定深度的可折叠节点 */
function collapseDepth(root: KbTreeNode, depth: number) {
	const next = new Set(collapsed);
	const walk = (n: KbTreeNode, d: number) => {
		if (d === depth && n.children?.length) next.add(n.id);
		n.children?.forEach((c) => {
			walk(c, d + 1);
		});
	};
	walk(root, 0);
	collapsed = next;
}

/** 默认视图：只隐藏最深一层条目，保留两层骨架 */
function applyDefaultView(root: KbTreeNode) {
	if (payload.stats.total > 24) collapseDepth(root, 2);
	else collapsed = new Set();
}

function expandAll() {
	collapsed = new Set();
	refitIfAuto();
}

function collapseAll() {
	// 只保留根节点：第一圈折叠成"仅自己可见"的节点
	const next = new Set<string>();
	tree.children?.forEach((c) => {
		if (c.children?.length) next.add(c.id);
	});
	collapsed = next;
	refitIfAuto();
}

function switchView(v: KbView) {
	if (view === v) return;
	view = v;
	applyDefaultView(tree);
	query = "";
	requestAnimationFrame(() => fitView());
}

// 过滤：命中条目 + 其所有祖先都应高亮，其余节点变暗
const highlightIds = $derived.by(() => {
	const q = query.trim().toLowerCase();
	if (!q) return new Set<string>();
	const entryMeta = new Map(payload.entries.map((e) => [e.url, e]));
	const matchedEntryIds = new Set<string>();
	const walk = (n: KbTreeNode) => {
		if (n.kind === "entry") {
			const meta = n.url ? entryMeta.get(n.url) : undefined;
			const hay = `${n.label} ${meta?.description ?? ""} ${meta?.tags?.join(" ") ?? ""}`;
			if (hay.toLowerCase().includes(q)) matchedEntryIds.add(n.id);
		}
		n.children?.forEach(walk);
	};
	walk(tree);

	// 标记所有含命中子节点的祖先
	const highlighted = new Set<string>();
	const mark = (n: KbTreeNode): boolean => {
		const self = matchedEntryIds.has(n.id);
		const anyChild = (n.children ?? []).some(mark);
		if (self || anyChild) highlighted.add(n.id);
		return self || anyChild;
	};
	mark(tree);
	return highlighted;
});

let dragging = false;
let downX = 0;
let downY = 0;
let movedEnough = false;
function onPointerDown(e: PointerEvent) {
	dragging = true;
	movedEnough = false;
	downX = e.clientX;
	downY = e.clientY;
}
function onPointerMove(e: PointerEvent) {
	if (!dragging) return;
	const dx = e.clientX - downX;
	const dy = e.clientY - downY;
	if (Math.abs(dx) + Math.abs(dy) > 6) movedEnough = true;
	if (!movedEnough) return;
	panX += dx;
	panY += dy;
	downX = e.clientX;
	downY = e.clientY;
}
function stopDrag() {
	dragging = false;
}
/** 拖拽后吞掉紧跟的 click（防误触展开/跳转） */
function isDragClick(): boolean {
	if (movedEnough) {
		movedEnough = false;
		return true;
	}
	return false;
}
function onWheel(e: WheelEvent) {
	e.preventDefault();
	const el = svgEl;
	if (!el) return;
	const rect = el.getBoundingClientRect();
	const px = e.clientX - rect.left;
	const py = e.clientY - rect.top;
	const factor = Math.exp(-e.deltaY * 0.0015);
	zoomAt(px, py, factor);
}

function isDim(id: string): boolean {
	if (!query.trim()) return false;
	return !highlightIds.has(id);
}

$effect(() => {
	// 输入过滤时自动全展开，便于定位命中项
	if (query.trim() && collapsed.size > 0) {
		collapsed = new Set();
	}
});

onMount(() => {
	applyDefaultView(tree);
	requestAnimationFrame(() => fitView());
	const onResize = () => fitView();
	window.addEventListener("resize", onResize);
	return () => window.removeEventListener("resize", onResize);
});
</script>

<div class="kb-root">
	<!-- 工具栏 -->
	<div class="kb-toolbar">
		<div class="kb-view-switch">
			<button
				class="kb-chip"
				class:active={view === "branch"}
				on:click={() => switchView("branch")}
			>🗂 按领域</button
			>
			<button
				class="kb-chip"
				class:active={view === "type"}
				on:click={() => switchView("type")}
			>📑 按类型</button
			>
		</div>

		<input
			class="kb-search"
			type="text"
			placeholder="🔍 过滤当前视图条目…"
			bind:value={query}
		/>

		<div class="kb-tools">
			<button class="kb-btn" title="放大" on:click={() => zoomAt(viewW / 2, viewH / 2, 1.35)}>＋</button>
			<button class="kb-btn" title="缩小" on:click={() => zoomAt(viewW / 2, viewH / 2, 1 / 1.35)}>－</button>
			<button class="kb-btn" title="适配视图" on:click={() => fitView()}>⤢</button>
			<button class="kb-btn" title="全部展开" on:click={expandAll}>展开</button>
			<button class="kb-btn" title="收起深层" on:click={collapseAll}>收起</button>
		</div>
	</div>

	<!-- 图例 -->
	<div class="kb-legend">
		{#if view === "branch"}
			{#each payload.branchMeta as m (m.id)}
				<span class="kb-legend-item">
					<i class="kb-dot" style="background: {m.color}"></i>
					{m.name}
					<em>{payload.stats.byBranch[m.id] ?? 0}</em>
				</span>
			{/each}
		{:else}
			{#each payload.typeMeta as m (m.id)}
				<span class="kb-legend-item">
					<i class="kb-dot" style="background: {m.color}"></i>
					{m.name}
					<em>{payload.stats.byType[m.id] ?? 0}</em>
				</span>
			{/each}
		{/if}
		<span class="kb-tip">滚轮缩放 · 拖拽平移 · 点分组展开/收起 · 点条目看详情</span>
	</div>

	<!-- 画布 -->
	<div class="kb-canvas-wrap">
		<svg
			bind:this={svgEl}
			class="kb-canvas text-90"
			on:pointerdown={onPointerDown}
			on:pointermove={onPointerMove}
			on:pointerup={stopDrag}
			on:pointerleave={stopDrag}
			on:wheel={onWheel}
		>
			<g transform="translate({panX} {panY}) scale({scale})">
				{#each layout.edges as e}
					<path
						d="M {e.x1} {e.y1} Q {(e.x1 + e.x2) / 2} {(e.y1 + e.y2) / 2} {e.x2} {e.y2}"
						fill="none"
						class="kb-edge"
					/>
				{/each}

				{#each layout.nodes as p (p.node.id)}
					{#if p.node.kind === "entry"}
						<a
							class:kb-dim={isDim(p.node.id)}
							class="kb-entry"
							href={p.node.url}
							on:click={(e) => {
								if (isDragClick()) e.preventDefault();
							}}
						>
							<title>{p.node.label}</title>
							<circle
								cx={p.x}
								cy={p.y}
								r={radiusOf("entry")}
								fill={p.node.color}
							/>
							<text
								x={p.x >= 0 ? p.x + radiusOf("entry") + 6 : p.x - radiusOf("entry") - 6}
								y={p.y}
								class="kb-label"
								text-anchor={p.x >= 0 ? "start" : "end"}
								dominant-baseline="central"
							>{truncateLabel(p.node.label)}</text
							>
						</a>
					{:else}
						<g
							class:kb-dim={isDim(p.node.id)}
							class="kb-group"
							role="button"
							tabindex={p.node.kind === "root" ? -1 : 0}
							on:click={(e) => {
								e.stopPropagation();
								if (isDragClick()) return;
								if (p.node.kind !== "root" && p.node.children?.length) {
									toggleCollapse(p.node.id);
									refitIfAuto();
								}
							}}
							on:keydown={(e) => {
								if (
									p.node.kind !== "root" &&
									p.node.children?.length &&
									(e.key === "Enter" || e.key === " ")
								) {
									e.preventDefault();
									toggleCollapse(p.node.id);
									refitIfAuto();
								}
							}}
						>
							<title>
								{p.node.label}{p.node.children ? `（${p.node.leafCount} 条，点击展开/收起）` : ""}
							</title>
							{#if p.node.kind === "root"}
								<circle
									cx={p.x}
									cy={p.y}
									r={radiusOf("root")}
									fill="var(--primary)"
								/>
								<text x={p.x} y={p.y - 8} class="kb-root-label" text-anchor="middle">Unity</text>
								<text x={p.x} y={p.y + 10} class="kb-root-label" text-anchor="middle">知识库</text>
							{:else}
								<circle
									cx={p.x}
									cy={p.y}
									r={radiusOf(p.node.kind)}
									fill={p.node.color}
								/>
								{#if p.isCollapsed}
									<circle
										cx={p.x}
										cy={p.y}
										r={radiusOf(p.node.kind) + 5}
										fill="none"
										class="kb-ring-hint"
									/>
									<text
										x={p.x}
										y={p.y}
										class="kb-count-inline"
										text-anchor="middle"
										dominant-baseline="central"
									>{p.node.leafCount}</text
									>
								{/if}
								<text
									x={p.x >= 0 ? p.x + radiusOf(p.node.kind) + 6 : p.x - radiusOf(p.node.kind) - 6}
									y={p.y}
									class="kb-label kb-label-strong"
									text-anchor={p.x >= 0 ? "start" : "end"}
									dominant-baseline="central"
								>{truncateLabel(p.node.label)}</text
								>
							{/if}
						</g>
					{/if}
				{/each}
			</g>
		</svg>

		{#if query.trim() && highlightIds.size === 0}
			<div class="kb-empty">没有匹配「{query}」的条目</div>
		{/if}
	</div>

	<!-- 扁平条目清单（便于直达，也作为移动端兜底） -->
	<div class="kb-list">
		<div class="kb-list-title">全部条目（{payload.stats.total}）</div>
		<div class="kb-list-grid">
			{#each payload.entries as e (e.id)}
				<a class="kb-list-item" href={e.url}>
					<i class="kb-dot" style="background: {typeColor(e.type)}"></i>
					<span class="kb-list-name">{e.title}</span>
					<span class="kb-list-meta">{branchName(e.branch)}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.kb-root {
		width: 100%;
	}

	.kb-toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.75rem;
	}

	.kb-view-switch {
		display: flex;
		gap: 0.4rem;
	}

	.kb-chip {
		font-size: 0.85rem;
		padding: 0.3rem 0.8rem;
		border-radius: 9999px;
		background: var(--btn-plain-bg);
		color: var(--kb-chip-fg, currentColor);
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}
	.kb-chip:hover {
		background: var(--btn-plain-bg-hover);
	}
	.kb-chip.active {
		background: var(--primary);
		color: #fff;
	}

	.kb-search {
		flex: 1;
		min-width: 12rem;
		font-size: 0.85rem;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		background: var(--btn-plain-bg);
		color: inherit;
		border: 1px solid transparent;
		outline: none;
	}
	.kb-search:focus {
		border-color: color-mix(in srgb, var(--primary) 55%, transparent);
	}

	.kb-tools {
		display: flex;
		gap: 0.35rem;
	}

	.kb-btn {
		min-width: 2rem;
		font-size: 0.85rem;
		padding: 0.25rem 0.55rem;
		border-radius: 0.5rem;
		background: var(--btn-plain-bg);
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}
	.kb-btn:hover {
		background: var(--btn-plain-bg-hover);
	}

	.kb-legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 0.6rem;
		font-size: 0.78rem;
	}
	.kb-legend-item {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.kb-legend-item em {
		font-style: normal;
		font-size: 0.7rem;
		opacity: 0.65;
	}
	.kb-dot {
		display: inline-block;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 9999px;
	}
	.kb-tip {
		margin-left: auto;
		font-size: 0.72rem;
		opacity: 0.55;
	}

	.kb-canvas-wrap {
		position: relative;
		width: 100%;
		height: 34rem;
		max-height: 74vh;
		border-radius: var(--radius-large, 1rem);
		border: 1px solid var(--line-divider);
		background: var(--card-bg);
		overflow: hidden;
	}
	.kb-canvas {
		width: 100%;
		height: 100%;
		display: block;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}
	.kb-canvas:active {
		cursor: grabbing;
	}

	.kb-edge {
		stroke: currentColor;
		stroke-width: 1.3;
		opacity: 0.35;
		pointer-events: none;
	}

	.kb-label {
		font-size: 0.78rem;
		fill: currentColor;
		opacity: 0.92;
		pointer-events: none;
	}
	.kb-label-strong {
		font-weight: 600;
		opacity: 0.98;
	}

	.kb-root-label {
		font-size: 0.95rem;
		fill: #fff;
		font-weight: 700;
		pointer-events: none;
		user-select: none;
	}

	.kb-count-inline {
		font-size: 0.68rem;
		fill: #fff;
		font-weight: 700;
		pointer-events: none;
		user-select: none;
	}

	.kb-group {
		cursor: pointer;
		outline: none;
	}
	.kb-group:hover .kb-label-strong {
		fill: var(--primary);
	}

	.kb-ring-hint {
		stroke-width: 1.5;
		stroke: currentColor;
		opacity: 0.55;
		pointer-events: none;
	}

	.kb-entry {
		cursor: pointer;
	}
	.kb-entry:hover .kb-label {
		fill: var(--primary);
		opacity: 1;
	}

	.kb-dim {
		opacity: 0.1;
		pointer-events: none;
	}

	.kb-empty {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		opacity: 0.6;
		pointer-events: none;
	}

	.kb-list {
		margin-top: 1rem;
	}
	.kb-list-title {
		font-size: 0.9rem;
		font-weight: 700;
		margin-bottom: 0.6rem;
	}
	.kb-list-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 0.5rem;
	}
	.kb-list-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.7rem;
		border-radius: 0.6rem;
		border: 1px solid var(--line-divider);
		background: var(--btn-plain-bg);
		font-size: 0.82rem;
		transition: all 0.15s;
		text-decoration: none;
		min-width: 0;
	}
	.kb-list-item:hover {
		border-color: color-mix(in srgb, var(--primary) 45%, transparent);
	}
	.kb-list-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	.kb-list-meta {
		flex-shrink: 0;
		font-size: 0.7rem;
		opacity: 0.6;
	}
</style>
