import { fetchBase, frontmatterString } from './api';

export type ProjectStatus = 'active' | 'archived' | 'experiment';

export interface Project {
	name: string;
	description: string;
	status: ProjectStatus;
	link?: string;
}

/**
 * Trim an API excerpt down to its first sentence so project cards keep their
 * one-liner descriptions.
 */
function firstSentence(text: string): string {
	const match = text.match(/^.*?[.!?](?=\s|$)/);
	return match ? match[0] : text;
}

/**
 * Products from the Obsidian API. Notes without a recognised `status`
 * (e.g. templates) are skipped.
 */
export async function getProjects(): Promise<Project[]> {
	const items = await fetchBase('products');
	const projects: Project[] = [];
	for (const item of items) {
		const status = frontmatterString(item.frontmatter, 'status');
		if (
			status !== 'active' &&
			status !== 'archived' &&
			status !== 'experiment'
		)
			continue;
		projects.push({
			name: item.title,
			description:
				frontmatterString(item.frontmatter, 'description') ??
				firstSentence(item.excerpt),
			status,
			link: frontmatterString(item.frontmatter, 'url'),
		});
	}
	return projects;
}
