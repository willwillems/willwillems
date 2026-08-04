import type { Post } from '../../data/posts';

/** Background for heatmap cells without posts (and cells the snake ate). */
export const EMPTY_CELL_COLOR = '#1c1c1c';

/**
 * Distinct colours for category-driven heatmap cells. Tuned to sit on top of
 * the dark theme background. Amber leads to match the design's headline tone.
 */
export const CATEGORY_PALETTE = [
	'#f5c518', // amber
	'#4d9de0', // sky
	'#9b59b6', // violet
	'#2ecc71', // green
	'#e67e22', // orange
	'#1abc9c', // teal
	'#e74c3c', // red
	'#f1c40f', // yellow
] as const;

/**
 * Derive the ordered list of unique category labels from the data. First-seen
 * order is preserved; this is the canonical ordering used by tabs, the
 * category → colour map, and the heatmap tie-breaking rule.
 */
export function deriveCategories(posts: Post[]): string[] {
	const seen = new Set<string>();
	const ordered: string[] = [];
	for (const post of posts) {
		for (const category of post.categories) {
			if (!seen.has(category)) {
				seen.add(category);
				ordered.push(category);
			}
		}
	}
	return ordered;
}

/**
 * Map each derived category to a palette colour. Categories beyond the palette
 * length wrap around.
 */
export function buildCategoryColorMap(
	categories: string[],
): Record<string, string> {
	const map: Record<string, string> = {};
	for (let i = 0; i < categories.length; i++) {
		map[categories[i]] = CATEGORY_PALETTE[i % CATEGORY_PALETTE.length];
	}
	return map;
}

/**
 * Count how many posts carry each category. Posts with several categories
 * count once per category, matching the tab/dropdown filter semantics.
 */
export function countByCategory(posts: Post[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const post of posts) {
		for (const category of post.categories) {
			counts[category] = (counts[category] ?? 0) + 1;
		}
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
	dominantCategory: string | null;
	/** Link target for the day's post (first in source order when several). */
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
 * For each day, computes the number of posts published that day and the dominant
 * category (most posts of that category that day; ties broken by `categoryOrder`).
 */
export function buildHeatmapBuckets(
	posts: Post[],
	categoryOrder: string[],
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

		let dominantCategory: string | null = null;
		if (dayPosts.length > 0) {
			const counts = new Map<string, number>();
			for (const post of dayPosts) {
				for (const cat of post.categories) {
					counts.set(cat, (counts.get(cat) ?? 0) + 1);
				}
			}
			// Tie-break by category order (lower index wins).
			let bestCount = -1;
			let bestIndex = Infinity;
			for (const [cat, count] of counts) {
				const idx = categoryOrder.indexOf(cat);
				if (
					count > bestCount ||
					(count === bestCount && idx < bestIndex)
				) {
					bestCount = count;
					bestIndex = idx;
					dominantCategory = cat;
				}
			}
		}

		buckets.push({
			date,
			postCount: dayPosts.length,
			dominantCategory,
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
