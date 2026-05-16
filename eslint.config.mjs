import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['dist', '.astro', 'node_modules'],
	},
	js.configs.recommended,
	// Strict (non-typed) rules apply to all TS/JS/Astro files.
	...tseslint.configs.strict,
	...astro.configs['flat/recommended'],
	// Type-checked rules only for TS/JS files where projectService works.
	// astro-eslint-parser doesn't support projectService so .astro files
	// get only the non-typed strict ruleset above.
	{
		files: ['**/*.{ts,tsx,mjs,js}'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...tseslint.configs.strictTypeCheckedOnly.map((config) => ({
		...config,
		files: ['**/*.{ts,tsx,mjs,js}'],
	})),
	prettierConfig,
];
