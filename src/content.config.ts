import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { kbBranches, kbEntryTypes } from "./types/kb";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		comment: z.boolean().optional().default(true),
		password: z.string().optional().default(""),
		passwordHint: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

/**
 * 知识库：Unity 学习成长与踩坑参考（独立于 posts 的第二内容体系）
 * - type   内容形态：note 学习笔记 / pitfall 踩坑手册 / practice 项目实践 / journey 成长历程
 * - branch 所属领域：与导图"按领域"分支对应
 * - topic  领域内子主题（导图第二层）
 */
const kbCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/kb" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		type: z.enum([...kbEntryTypes]),
		branch: z.enum([...kbBranches]),
		topic: z.string().default("综合"),
		description: z.string().default(""),
		tags: z.array(z.string()).optional().default([]),
		relatedPosts: z.array(z.string()).optional().default([]),
		relatedKb: z.array(z.string()).optional().default([]),
		draft: z.boolean().optional().default(false),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	kb: kbCollection,
};
