import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { removeFileExtension, url } from "@utils/url-utils";
import { kbBranchMetaList, kbTypeMetaList } from "@/config/kbConfig";
import type {
	KbBranch,
	KbEntrySummary,
	KbEntryType,
	KbMapPayload,
	KbTreeNode,
} from "@/types/kb";

type KbEntry = CollectionEntry<"kb">;

/** 获取全部知识库条目（排除草稿），按发布时间倒序 */
export async function getSortedKbEntries(): Promise<KbEntry[]> {
	const all = await getCollection("kb", ({ data }) => !data.draft);
	return all.sort(
		(a, b) =>
			new Date(b.data.published).getTime() -
			new Date(a.data.published).getTime(),
	);
}

/** 将 CollectionEntry 转成可序列化摘要（去掉 body / Date） */
export function toKbEntrySummary(entry: KbEntry): KbEntrySummary {
	const slug = removeFileExtension(entry.id);
	return {
		id: entry.id,
		title: entry.data.title,
		description: entry.data.description,
		type: entry.data.type,
		branch: entry.data.branch,
		topic: entry.data.topic || "综合",
		published: entry.data.published.toISOString(),
		updated: entry.data.updated?.toISOString(),
		tags: entry.data.tags || [],
		relatedPosts: entry.data.relatedPosts || [],
		url: url(`/kb/${slug}/`),
	};
}

export function getKbEntryUrl(id: string): string {
	const slug = removeFileExtension(id);
	return url(`/kb/${slug}/`);
}

/** 计算子树叶子数（entry 即叶子，权重用于径向布局） */
function leafWeight(node: KbTreeNode): number {
	if (!node.children || node.children.length === 0) return 1;
	return node.children.reduce((sum, c) => sum + leafWeight(c), 0);
}

function topicSort(a: [string, unknown], b: [string, unknown]): number {
	return a[0].localeCompare(b[0], "zh-CN");
}

/** 领域视图树：root → branch → topic → entry */
export function buildBranchViewTree(entries: KbEntry[]): KbTreeNode {
	const children: KbTreeNode[] = [];
	for (const meta of kbBranchMetaList) {
		const branchEntries = entries.filter((e) => e.data.branch === meta.id);
		if (branchEntries.length === 0) continue;

		const topicMap = new Map<string, KbEntry[]>();
		for (const e of branchEntries) {
			const key = e.data.topic || "综合";
			const list = topicMap.get(key) ?? [];
			list.push(e);
			topicMap.set(key, list);
		}

		const topicNodes: KbTreeNode[] = [...topicMap.entries()]
			.sort(topicSort)
			.map(([topic, es]) => ({
				id: `branch-${meta.id}-topic-${topic}`,
				label: topic,
				kind: "topic",
				metaId: meta.id,
				color: meta.color,
				leafCount: es.length,
				children: es.map(entryNode),
			}));

		children.push({
			id: `branch-${meta.id}`,
			label: meta.name,
			kind: "branch",
			metaId: meta.id,
			color: meta.color,
			leafCount: branchEntries.length,
			children: topicNodes,
		});
	}

	return {
		id: "root-branch",
		label: "Unity 知识库",
		kind: "root",
		leafCount: children.reduce((sum, c) => sum + leafWeight(c), 0),
		children,
	};
}

/** 类型视图树：root → type → branch → entry */
export function buildTypeViewTree(entries: KbEntry[]): KbTreeNode {
	const children: KbTreeNode[] = [];
	for (const meta of kbTypeMetaList) {
		const typeEntries = entries.filter((e) => e.data.type === meta.id);
		if (typeEntries.length === 0) continue;

		const branchMap = new Map<KbBranch, KbEntry[]>();
		for (const e of typeEntries) {
			const list = branchMap.get(e.data.branch) ?? [];
			list.push(e);
			branchMap.set(e.data.branch, list);
		}

		const branchNodes: KbTreeNode[] = [...branchMap.entries()]
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([branch, es]) => {
				const bMeta = kbBranchMetaList.find((m) => m.id === branch);
				return {
					id: `type-${meta.id}-branch-${branch}`,
					label: bMeta?.name ?? branch,
					kind: "branch",
					metaId: branch,
					color: bMeta?.color ?? "#888",
					leafCount: es.length,
					children: es.map(entryNode),
				};
			});

		children.push({
			id: `type-${meta.id}`,
			label: meta.name,
			kind: "type",
			metaId: meta.id,
			color: meta.color,
			leafCount: typeEntries.length,
			children: branchNodes,
		});
	}

	return {
		id: "root-type",
		label: "Unity 知识库",
		kind: "root",
		leafCount: children.reduce((sum, c) => sum + leafWeight(c), 0),
		children,
	};
}

function entryNode(entry: KbEntry): KbTreeNode {
	const typeMeta = kbTypeMetaList.find((t) => t.id === entry.data.type);
	const summary = toKbEntrySummary(entry);
	return {
		id: `entry-${entry.id}`,
		label: entry.data.title,
		kind: "entry",
		metaId: entry.data.type,
		color: typeMeta?.color ?? "#888",
		leafCount: 1,
		url: summary.url,
	};
}

/** 组装传给导图组件的完整数据 */
export async function buildKbPayload(): Promise<KbMapPayload> {
	const entries = await getSortedKbEntries();
	const summaries = entries.map(toKbEntrySummary);

	const byBranch: Record<string, number> = {};
	const byType: Record<KbEntryType, number> = {
		note: 0,
		pitfall: 0,
		practice: 0,
		journey: 0,
	};
	for (const s of summaries) {
		byBranch[s.branch] = (byBranch[s.branch] ?? 0) + 1;
		byType[s.type] += 1;
	}

	return {
		branchTree: buildBranchViewTree(entries),
		typeTree: buildTypeViewTree(entries),
		entries: summaries,
		branchMeta: kbBranchMetaList,
		typeMeta: kbTypeMetaList,
		stats: {
			total: summaries.length,
			byBranch,
			byType,
		},
	};
}

export type { KbEntry };
