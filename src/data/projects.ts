import { assetUrl, fetchNote, frontmatterString } from './api';
import type { ApiListItem } from './api';

/**
 * Project lifecycle. These are the names the UI speaks — `ProjectCard` renders
 * a lab badge for `experiment` — so vault frontmatter is normalised onto them
 * rather than the other way around.
 */
export type ProjectStatus = 'active' | 'archived' | 'experiment';

/** Vault `status` values, mapped onto the statuses the UI knows about. */
const STATUSES = new Map<string, ProjectStatus>([
	['active', 'active'],
	['archived', 'archived'],
	['experiment', 'experiment'],
	['experimental', 'experiment'],
]);

export interface Product {
	id: string;
	name: string;
	description: string;
	status: ProjectStatus;
	link?: string;
	/** Absolute vault URL, optimised into the build by `astro:assets`. */
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
 * Resolve an `icon: "[[name.png]]"` frontmatter wikilink to the asset's
 * absolute vault URL. The list endpoint carries only frontmatter, so the note
 * detail is fetched for its `assets` map.
 */
async function resolveIcon(
	id: string,
	icon: string | undefined,
): Promise<string | undefined> {
	const target = icon?.match(/^\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]$/)?.[1].trim();
	if (!target) return undefined;
	const note = await fetchNote('products', id);
	const apiPath = note.assets[target];
	return apiPath ? assetUrl(apiPath) : undefined;
}

/**
 * Map an API list item onto a project. Returns undefined for notes without a
 * recognised `status` (e.g. templates), which the caller reports.
 */
export async function toProduct(
	item: ApiListItem,
): Promise<Product | undefined> {
	const status = STATUSES.get(
		frontmatterString(item.frontmatter, 'status') ?? '',
	);
	if (!status) return undefined;
	return {
		id: item.id,
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
	};
}
