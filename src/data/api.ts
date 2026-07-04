/**
 * Build-time client for the Obsidian notes API (`OBSIDIAN_API_URL`).
 * The API exposes vault "bases" as list endpoints (`/<base>`) returning
 * frontmatter + excerpt per note, and detail endpoints (`/<base>/<id>`)
 * returning the full markdown body plus an `assets` map of vault
 * attachments referenced by the note.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface ApiListItem {
	id: string;
	title: string;
	frontmatter: Record<string, unknown>;
	excerpt: string;
}

interface ApiListResponse {
	base: string;
	total: number;
	limit: number;
	offset: number;
	items: ApiListItem[];
}

export interface ApiNote {
	id: string;
	title: string;
	frontmatter: Record<string, unknown>;
	body: string;
	assets: Record<string, string>;
}

function apiUrl(): string {
	const url: unknown =
		import.meta.env.OBSIDIAN_API_URL ?? process.env.OBSIDIAN_API_URL;
	if (typeof url !== 'string' || url.length === 0) {
		throw new Error(
			'OBSIDIAN_API_URL is not set — copy .env.example to .env and fill it in.',
		);
	}
	return url.replace(/\/+$/, '');
}

async function getJson<T>(path: string): Promise<T> {
	const url = `${apiUrl()}${path}`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(
			`Notes API request failed: GET ${url} → ${String(res.status)} ${res.statusText}`,
		);
	}
	return res.json() as Promise<T>;
}

/** Fetch every list item in a base, following pagination. */
export async function fetchBase(base: string): Promise<ApiListItem[]> {
	const items: ApiListItem[] = [];
	let total = Infinity;
	while (items.length < total) {
		const page = await getJson<ApiListResponse>(
			`/${base}?limit=100&offset=${String(items.length)}`,
		);
		total = page.total;
		if (page.items.length === 0) break;
		items.push(...page.items);
	}
	return items;
}

/** Fetch a single note including its full markdown body. */
export function fetchNote(base: string, id: string): Promise<ApiNote> {
	return getJson<ApiNote>(`/${base}/${id}`);
}

/** Read a string frontmatter field, ignoring nulls and template junk. */
export function frontmatterString(
	frontmatter: Record<string, unknown>,
	key: string,
): string | undefined {
	const value = frontmatter[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Read a date frontmatter field; returns undefined when absent or invalid. */
export function frontmatterDate(
	frontmatter: Record<string, unknown>,
	key: string,
): Date | undefined {
	const value = frontmatterString(frontmatter, key);
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.valueOf()) ? undefined : date;
}

/** Vault attachments are copied here at build time so the site is
 * self-contained and never hits the API at runtime. */
const ASSET_DIR = 'public/vault-assets';
const ASSET_ROUTE = '/vault-assets';

/** Obsidian embed: `![[target]]` or `![[target|alt]]`. */
const EMBED_RE = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

const downloaded = new Map<string, Promise<string>>();

/** Download a vault asset once per process; returns its public URL path. */
export function downloadAsset(name: string, apiPath: string): Promise<string> {
	const existing = downloaded.get(name);
	if (existing) return existing;
	const promise = (async () => {
		// Asset paths are server-absolute (`/api/assets/…`), so resolve
		// against the API origin rather than appending to the base URL.
		const url = new URL(apiPath, apiUrl()).href;
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(
				`Notes API request failed: GET ${url} → ${String(res.status)} ${res.statusText}`,
			);
		}
		const localName = name.replaceAll(path.sep, '-').replaceAll('/', '-');
		await mkdir(ASSET_DIR, { recursive: true });
		await writeFile(
			path.join(ASSET_DIR, localName),
			Buffer.from(await res.arrayBuffer()),
		);
		return `${ASSET_ROUTE}/${encodeURIComponent(localName)}`;
	})();
	// Drop failed downloads so a transient error can be retried on the
	// next content sync instead of sticking for the dev server's lifetime.
	promise.catch(() => downloaded.delete(name));
	downloaded.set(name, promise);
	return promise;
}

/**
 * Replace Obsidian `![[name]]` embeds with standard markdown images,
 * downloading each referenced asset into `public/vault-assets/`. Embeds
 * whose target isn't in the note's asset map are left untouched.
 */
export async function resolveEmbeds(note: ApiNote): Promise<string> {
	const embeds = [...note.body.matchAll(EMBED_RE)];
	let body = note.body;
	for (const [match, target, alt = ''] of embeds) {
		const apiPath = note.assets[target.trim()];
		if (!apiPath) continue;
		const publicPath = await downloadAsset(target.trim(), apiPath);
		const altText = alt.trim() || path.parse(target.trim()).name;
		body = body.replace(match, `![${altText}](${publicPath})`);
	}
	return body;
}
