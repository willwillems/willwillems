// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://willwillems.com',
	integrations: [mdx(), sitemap()],
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
