import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import {
	fetchBase,
	fetchNote,
	frontmatterDate,
	frontmatterString,
	resolveEmbeds,
} from './data/api';
import { toProduct } from './data/projects';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			duration: z.string().optional(),
			category: z.string().optional(),
			heroImage: z.string().optional(),
		}),
});

/** Outbox sources: API base route → category label shown in the UI. */
const OUTBOX_BASES = [
	{ base: 'posts', category: 'Posts' },
	{ base: 'projects', category: 'Projects' },
	{ base: 'research', category: 'Research' },
	{ base: 'resources', category: 'Resources' },
] as const;

/**
 * Notes pulled from the Obsidian API at build time. Entry ids are the notes'
 * `public` slugs (all bases share the flat `/posts/<slug>` namespace), and the
 * markdown body is pre-rendered so pages can use `render()` like any other
 * collection.
 */
const notes = defineCollection({
	loader: {
		name: 'obsidian-notes',
		load: async (context) => {
			const { store, logger } = context;
			logger.info('Loading notes from the Obsidian API…');
			store.clear();
			for (const { base, category } of OUTBOX_BASES) {
				const items = await fetchBase(base);
				for (const item of items) {
					const slug =
						frontmatterString(item.frontmatter, 'public') ??
						item.id;
					if (store.has(slug)) {
						logger.warn(
							`Duplicate note slug "${slug}" in base "${base}" — the earlier note is overwritten.`,
						);
					}
					const note = await fetchNote(base, item.id);
					const body = await resolveEmbeds(note);
					const data = await context.parseData({
						id: slug,
						data: {
							title: item.title,
							category,
							excerpt: item.excerpt,
							created: frontmatterDate(
								item.frontmatter,
								'created',
							)?.toISOString(),
						},
					});
					store.set({
						id: slug,
						data,
						body,
						rendered: await context.renderMarkdown(body),
					});
				}
			}
		},
	},
	schema: z.object({
		title: z.string(),
		category: z.enum(['Posts', 'Projects', 'Research', 'Resources']),
		excerpt: z.string(),
		created: z.coerce.date().optional(),
	}),
});

/**
 * Projects pulled from the Obsidian API at build time. Icons are stored as
 * absolute vault URLs and optimised into the build by `astro:assets`, so
 * nothing here touches the filesystem.
 */
const products = defineCollection({
	loader: {
		name: 'obsidian-products',
		load: async (context) => {
			const { store, logger } = context;
			logger.info('Loading products from the Obsidian API…');
			store.clear();
			for (const item of await fetchBase('products')) {
				const product = await toProduct(item);
				if (!product) {
					logger.warn(
						`Skipping product "${item.id}" — unrecognised status ${JSON.stringify(frontmatterString(item.frontmatter, 'status'))}.`,
					);
					continue;
				}
				store.set({
					id: product.id,
					data: await context.parseData({
						id: product.id,
						data: { ...product },
					}),
				});
			}
		},
	},
	schema: z.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		status: z.enum(['active', 'archived', 'experiment']),
		link: z.url().optional(),
		icon: z.url().optional(),
	}),
});

export const collections = { blog, notes, products };
