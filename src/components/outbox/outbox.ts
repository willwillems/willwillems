import type { Post } from '../../data/posts';

/** Background for heatmap cells without posts (and cells the snake ate). */
export const EMPTY_CELL_COLOR = '#1c1c1c';

/**
 * Every outbox category and its colour, in tab order. Tuned to sit on top of
 * the dark theme background.
 */
export const CATEGORY_COLORS = {
	Research: '#f5c518', // amber
	Posts: '#4d9de0', // sky
	Products: '#e74c3c', // red
	Resources: '#9b59b6', // violet
	Projects: '#2ecc71', // green
	Blog: '#e67e22', // orange
} as const;

export type Category = keyof typeof CATEGORY_COLORS;

/** Count how many posts are filed under each category. */
export function countByCategory(
	posts: Post[],
): Partial<Record<Category, number>> {
	const counts: Partial<Record<Category, number>> = {};
	for (const post of posts) {
		counts[post.category] = (counts[post.category] ?? 0) + 1;
	}
	return counts;
}

/**
 * Strip a minimal set of markdown tokens from a string and return a plain
 * excerpt, truncated on a word boundary at `length` chars with an ellipsis.
 */
export function excerpt(content: string, length = 160): string {
	const stripped = content
		.replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
		.replace(/`([^`]+)`/g, '$1') // inline code
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
		.replace(/^#{1,6}\s+/gm, '') // headings
		.replace(/^>\s?/gm, '') // blockquotes
		.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
		.replace(/\s+/g, ' ') // collapse whitespace
		.trim();

	if (stripped.length <= length) return stripped;

	const cut = stripped.slice(0, length);
	const lastSpace = cut.lastIndexOf(' ');
	const boundary = lastSpace > length * 0.6 ? lastSpace : length;
	return cut.slice(0, boundary).replace(/[,.;:!?-]+$/, '') + '…';
}

export interface HeatmapBucket {
	date: Date;
	postCount: number;
	/** Category and link of the day's post (first in source order when several). */
	category: Category | null;
	href: string | null;
}

/**
 * Default heatmap window: ~2 years of history. The grid only ever displays as
 * many columns as fit its container, so generating a generous window means the
 * heatmap always fills the available width (older empty weeks render blank,
 * GitHub-style) without coupling the data layer to the layout's exact width.
 */
export const HEATMAP_WINDOW_DAYS = 2 * 52 * 7; // 104 weeks

/**
 * Build a rolling window of heatmap buckets ending on `asOf` (default ~2 years).
 * For each day, records the number of posts published that day and the
 * category and link of the first one.
 */
export function buildHeatmapBuckets(
	posts: Post[],
	asOf: Date = new Date(),
	windowDays: number = HEATMAP_WINDOW_DAYS,
): HeatmapBucket[] {
	const dayMs = 24 * 60 * 60 * 1000;

	// Anchor to UTC start-of-day to avoid timezone-based bucket drift.
	const endDay = new Date(
		Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()),
	);

	const isoDayKey = (d: Date): string => {
		const y = String(d.getUTCFullYear());
		const m = String(d.getUTCMonth() + 1).padStart(2, '0');
		const day = String(d.getUTCDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	};

	// Group posts by ISO date key. Undated posts don't appear in the heatmap.
	const byDate = new Map<string, Post[]>();
	for (const post of posts) {
		if (!post.publishedAt) continue;
		const key = isoDayKey(post.publishedAt);
		const list = byDate.get(key);
		if (list) list.push(post);
		else byDate.set(key, [post]);
	}

	const buckets: HeatmapBucket[] = [];
	for (let i = windowDays - 1; i >= 0; i--) {
		const date = new Date(endDay.getTime() - i * dayMs);
		const key = isoDayKey(date);
		const dayPosts = byDate.get(key) ?? [];

		buckets.push({
			date,
			postCount: dayPosts.length,
			category: dayPosts[0]?.category ?? null,
			href: dayPosts[0]?.href ?? null,
		});
	}

	return buckets;
}

/**
 * Format a date as "MMM D, YYYY" matching `FormattedDate` output. Used in
 * server-rendered post rows.
 */
export function formatDisplayDate(date: Date): string {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
