// @ts-check

import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

/**
 * Vault attachments are downloaded into `public/vault-assets/` on demand, but
 * some of those downloads happen while pages render (project icons resolve in
 * the `/projects` frontmatter), which is *after* Astro has already copied
 * `public/` into the output directory. On a warm local build the files are
 * still there from last time so everything looks fine; on a cold CI clone the
 * directory is gitignored and empty, so those assets never reach `dist/` and
 * 404 in production. Re-copy them once every page has rendered.
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
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://willwillems.com',
	integrations: [mdx(), sitemap(), vaultAssets],
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
