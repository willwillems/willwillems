import { downloadAsset, fetchBase, fetchNote, frontmatterString } from './api';

export type ProjectStatus = 'active' | 'archived' | 'experiment';

export interface Project {
	name: string;
	description: string;
	status: ProjectStatus;
	link?: string;
	/** Public URL path of the project's icon, downloaded at build time. */
	icon?: string;
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
 * Resolve an `icon: "[[name.png]]"` frontmatter wikilink to a local public
 * URL path. The list endpoint carries only frontmatter, so the note detail
 * is fetched for its `assets` map.
 */
async function resolveIcon(
	id: string,
	icon: string | undefined,
): Promise<string | undefined> {
	const target = icon?.match(/^\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]$/)?.[1].trim();
	if (!target) return undefined;
	const note = await fetchNote('products', id);
	const apiPath = note.assets[target];
	if (!apiPath) return undefined;
	return downloadAsset(target, apiPath);
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
			icon: await resolveIcon(
				item.id,
				frontmatterString(item.frontmatter, 'icon'),
			),
		});
	}
	return projects;
}
