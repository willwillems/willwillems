/**
 * Product notes carry structured frontmatter (tagline, url, icon, status…) and
 * a conventional body: a description followed by `## Features`, `## Tech`,
 * `## Links`, `## Notes` sections. The product layout shows Links in its
 * sidebar, so that section is lifted out of the body here rather than rendered
 * twice.
 */

import { type ApiNote, downloadAsset, frontmatterString } from './api';

export interface ProductLink {
	label: string;
	href: string;
}

export interface ProductInfo {
	tagline?: string;
	url?: string;
	/** Public path of the downloaded icon. */
	icon?: string;
	type?: string;
	status?: string;
	links: ProductLink[];
}

/** Body sections the product layout renders as metadata instead of prose. */
const LIFTED_SECTIONS = ['links'];

/** Split markdown into a lead (before the first `##`) and its `##` sections. */
function splitSections(body: string): {
	lead: string;
	sections: { heading: string; content: string }[];
} {
	const [lead = '', ...rest] = body.split(/^## /m);
	return {
		lead,
		sections: rest.map((chunk) => {
			const newline = chunk.indexOf('\n');
			return newline === -1
				? { heading: chunk.trim(), content: '' }
				: {
						heading: chunk.slice(0, newline).trim(),
						content: chunk.slice(newline + 1),
					};
		}),
	};
}

function parseLinks(content: string): ProductLink[] {
	return [...content.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map(
		([, label = '', href = '']) => ({ label, href }),
	);
}

/** Resolve an `[[file]]` frontmatter reference to a downloaded asset path. */
async function resolveIcon(note: ApiNote): Promise<string | undefined> {
	const name = frontmatterString(note.frontmatter, 'icon')
		?.replace(/^\[\[|\]\]$/g, '')
		.split('|')[0]
		?.trim();
	const apiPath = name ? note.assets[name] : undefined;
	return name && apiPath ? downloadAsset(name, apiPath) : undefined;
}

/**
 * Extract product metadata from a note and return the body with the lifted
 * sections removed.
 */
export async function parseProduct(
	note: ApiNote,
	body: string,
): Promise<{ product: ProductInfo; body: string }> {
	const { lead, sections } = splitSections(body);
	const section = (name: string) =>
		sections.find((s) => s.heading.toLowerCase() === name)?.content ?? '';

	const product: ProductInfo = {
		tagline: frontmatterString(note.frontmatter, 'description'),
		url: frontmatterString(note.frontmatter, 'url'),
		icon: await resolveIcon(note),
		type: frontmatterString(note.frontmatter, 'type'),
		status: frontmatterString(note.frontmatter, 'status'),
		links: parseLinks(section('links')),
	};

	const kept = sections
		.filter((s) => !LIFTED_SECTIONS.includes(s.heading.toLowerCase()))
		.map((s) => `## ${s.heading}\n${s.content}`);
	return { product, body: [lead, ...kept].join('') };
}
