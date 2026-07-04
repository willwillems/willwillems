import { getCollection } from 'astro:content';

import { excerpt } from '../components/outbox/outbox';

export interface Post {
	slug: string;
	title: string;
	/** Publish date; undefined for notes without a `created` frontmatter date. */
	publishedAt?: Date;
	excerpt: string;
	categories: string[];
	href: string;
}

/**
 * All outbox items: notes from the Obsidian API (Posts, Projects, Research,
 * Resources) merged with the git-based blog under the "Blog" category. Source
 * order is fixed so derived tab order and heatmap colours are stable across
 * builds.
 */
export async function getOutboxPosts(): Promise<Post[]> {
	const [notes, blog] = await Promise.all([
		getCollection('notes'),
		getCollection('blog'),
	]);

	const fromNotes: Post[] = notes.map((note) => ({
		slug: note.id,
		title: note.data.title,
		publishedAt: note.data.created,
		excerpt: note.data.excerpt,
		categories: [note.data.category],
		href: `/posts/${note.id}.html`,
	}));

	const fromBlog: Post[] = blog.map((post) => ({
		slug: post.id,
		title: post.data.title,
		publishedAt: post.data.pubDate,
		excerpt: post.data.description ?? excerpt(post.body ?? ''),
		categories: ['Blog'],
		href: `/posts/${post.id}.html`,
	}));

	return [...fromNotes, ...fromBlog];
}
