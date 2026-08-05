// @ts-check

import { cp, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

const { OBSIDIAN_API_URL } = loadEnv(
	process.env.NODE_ENV ?? 'production',
	process.cwd(),
	'',
);

if (!OBSIDIAN_API_URL) {
	throw new Error(
		'OBSIDIAN_API_URL is not set — copy .env.example to .env and fill it in.',
	);
}

/** Host serving the vault. Derived so the guard below can never drift from it. */
const API_HOSTNAME = new URL(OBSIDIAN_API_URL).hostname;

/**
 * Vault attachments are downloaded into `public/vault-assets/` on demand, but
 * some of those downloads happen while pages render, which is *after* Astro has
 * already copied `public/` into the output directory. On a warm local build the
 * files are still there from last time so everything looks fine; on a cold CI
 * clone the directory is gitignored and empty, so those assets never reach
 * `dist/` and 404 in production. Re-copy them once every page has rendered.
 */
const vaultAssets = {
	name: 'vault-assets',
	hooks: {
		/** @type {(options: { dir: URL, logger: import('astro').AstroIntegrationLogger }) => Promise<void>} */
		'astro:build:done': async ({ dir, logger }) => {
			try {
				await cp(
					'public/vault-assets',
					fileURLToPath(new URL('vault-assets/', dir)),
					{ recursive: true },
				);
			} catch (error) {
				if (
					/** @type {NodeJS.ErrnoException} */ (error).code !==
					'ENOENT'
				)
					throw error;
				logger.warn('No vault assets were downloaded for this build.');
			}

			// The vault is a private, build-time-only source. Astro silently
			// falls back to emitting the original remote URL when a host isn't
			// listed in `image.remotePatterns`, which turns every visitor into
			// a request against the vault — and the build still succeeds. Fail
			// loudly instead, because this is invisible in a local preview.
			const root = fileURLToPath(dir);
			const entries = await readdir(root, {
				recursive: true,
				withFileTypes: true,
			});
			const leaked = [];
			for (const entry of entries) {
				if (!entry.isFile() || !/\.(html|xml)$/.test(entry.name))
					continue;
				const file = `${entry.parentPath}/${entry.name}`;
				if ((await readFile(file, 'utf8')).includes(API_HOSTNAME))
					leaked.push(file.slice(root.length));
			}
			if (leaked.length > 0) {
				throw new Error(
					`Build output references the vault host (${API_HOSTNAME}) in ${String(leaked.length)} file(s): ${leaked.join(', ')}. ` +
						'Vault assets must be downloaded at build time — check that the host is listed in `image.remotePatterns`.',
				);
			}
			logger.info(`No ${API_HOSTNAME} references in the build output.`);
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://willwillems.com',
	integrations: [mdx(), sitemap(), vaultAssets],
	image: {
		// Lets `astro:assets` download and optimise vault images at build time
		// so nothing is fetched from the vault at runtime.
		remotePatterns: [{ protocol: 'https', hostname: API_HOSTNAME }],
	},
	markdown: {
		shikiConfig: {
			theme: 'min-dark',
		},
	},
	build: {
		format: 'file',
	},
	// Live URLs from the VuePress era whose slugs changed when the blog
	// moved to Astro's content loader (which slugifies filenames).
	redirects: {
		'/posts/learn-to-manage-large-vue js-components':
			'/posts/learn-to-manage-large-vue-js-components',
		'/posts/using-scoped-BEM-with-Tailwind':
			'/posts/using-scoped-bem-with-tailwind',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
