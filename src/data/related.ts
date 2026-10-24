/**
 * Build-time "related posts": every post becomes a TF-IDF vector over its
 * title and body, and posts are ranked by cosine similarity. Words that show up
 * everywhere (or in only one post) carry little weight, so matches come from
 * shared, distinctive vocabulary — "svelte", "vuepress", "midi" — rather than
 * filler. Matches below `MIN_SIMILARITY`, or far weaker than a post's best
 * match, are dropped so unrelated posts never pad the list.
 */

export interface RelatedSource {
	id: string;
	title: string;
	body: string;
	category: string;
}

/** Below this cosine similarity two posts aren't meaningfully related. */
const MIN_SIMILARITY = 0.12;
/** Drop matches weaker than this fraction of the post's best match. */
const MIN_RELATIVE_SIMILARITY = 0.5;
/** Title words describe the topic better than body words. */
const TITLE_WEIGHT = 3;
/** Small nudge for posts filed under the same category. */
const CATEGORY_BONUS = 0.03;

const STOPWORDS = new Set(
	`a about above after again against all also am an and any are as at be
	because been before being below between both but by can could did do does
	doing down during each even few for from further get got had has have having
	he her here hers him his how i if in into is it its itself just let like make
	me more most much my myself no nor not now of off on once one only or other
	our ours out over own really same she should so some such than that the their
	them then there these they this those through to too under until up us use
	used using very was way we well were what when where which while who whom why
	will with would you your yours yourself thing things want need going see know
	new first two time something way back still`.split(/\s+/),
);

/** Strip markdown noise (code, URLs, link targets, embeds) before tokenising. */
function plainText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/https?:\/\/\S+/g, ' ')
		.replace(/<[^>]+>/g, ' ');
}

function tokenize(text: string): string[] {
	return (text.toLowerCase().match(/[a-z][a-z0-9]+/g) ?? [])
		.filter((word) => word.length > 2 && !STOPWORDS.has(word))
		.map((word) => (word.length > 4 ? word.replace(/s$/, '') : word));
}

function termCounts(source: RelatedSource): Map<string, number> {
	const counts = new Map<string, number>();
	const add = (words: string[], weight: number) => {
		for (const word of words) {
			counts.set(word, (counts.get(word) ?? 0) + weight);
		}
	};
	add(tokenize(source.title), TITLE_WEIGHT);
	add(tokenize(plainText(source.body)), 1);
	return counts;
}

/** Unit-length TF-IDF vector, so cosine similarity is a plain dot product. */
function vectorize(
	counts: Map<string, number>,
	idf: Map<string, number>,
): Map<string, number> {
	const vector = new Map<string, number>();
	let norm = 0;
	for (const [word, count] of counts) {
		const weight = Math.log(1 + count) * (idf.get(word) ?? 0);
		if (weight <= 0) continue;
		vector.set(word, weight);
		norm += weight * weight;
	}
	norm = Math.sqrt(norm);
	for (const [word, weight] of vector) vector.set(word, weight / norm);
	return vector;
}

function dot(a: Map<string, number>, b: Map<string, number>): number {
	const [small, large] = a.size < b.size ? [a, b] : [b, a];
	let sum = 0;
	for (const [word, weight] of small) sum += weight * (large.get(word) ?? 0);
	return sum;
}

/**
 * Map each post id to the ids of its most related posts, best match first.
 * Posts with nothing above the similarity threshold map to an empty list.
 */
export function buildRelatedIndex(
	sources: RelatedSource[],
	limit = 5,
): Map<string, string[]> {
	const counts = sources.map(termCounts);

	const docFrequency = new Map<string, number>();
	for (const terms of counts) {
		for (const word of terms.keys()) {
			docFrequency.set(word, (docFrequency.get(word) ?? 0) + 1);
		}
	}
	// Words unique to one post can't link it to anything, so they get no weight.
	const idf = new Map<string, number>();
	for (const [word, df] of docFrequency) {
		if (df > 1) idf.set(word, Math.log(sources.length / df));
	}

	const posts = sources.map((source, i) => ({
		...source,
		vector: vectorize(counts[i] ?? new Map(), idf),
	}));

	const index = new Map<string, string[]>();
	for (const post of posts) {
		const related = posts
			.filter((other) => other.id !== post.id)
			.map((other) => ({
				id: other.id,
				similarity: dot(post.vector, other.vector),
				bonus: other.category === post.category ? CATEGORY_BONUS : 0,
			}))
			.filter(({ similarity }) => similarity >= MIN_SIMILARITY);
		const best = Math.max(
			0,
			...related.map(({ similarity }) => similarity),
		);
		const ranked = related
			.filter(
				({ similarity }) =>
					similarity >= best * MIN_RELATIVE_SIMILARITY,
			)
			.sort((a, b) => b.similarity + b.bonus - (a.similarity + a.bonus))
			.slice(0, limit);
		index.set(
			post.id,
			ranked.map(({ id }) => id),
		);
	}
	return index;
}
