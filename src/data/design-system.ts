/**
 * Design-system metadata, derived from `src/styles/global.css` at build time.
 *
 * The /system page documents that stylesheet, so reading it is the only way to
 * guarantee the two never drift apart. Parsing is deliberately strict: a shape
 * we don't recognise throws and fails the build rather than quietly rendering
 * an incomplete reference.
 */
import globalCss from '../styles/global.css?raw';

/** Tailwind v4's stock font-size scale, in px at a 16px root. Not overridden. */
const TEXT_SIZE_PX: Record<string, number | undefined> = {
	'--text-xs': 12,
	'--text-sm': 14,
	'--text-base': 16,
	'--text-lg': 18,
	'--text-xl': 20,
	'--text-2xl': 24,
	'--text-3xl': 30,
	'--text-4xl': 36,
};

const source = globalCss.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Grab the body of the first rule matching `pattern`. None of the rules we read
 * contain nested braces, so a non-greedy `[^}]*` capture is sufficient.
 */
function ruleBody(pattern: RegExp, label: string): string {
	const match = pattern.exec(source);
	if (!match) {
		throw new Error(`design-system: no ${label} found in global.css`);
	}
	return match[1];
}

function parseDeclarations(body: string): Map<string, string> {
	const declarations = new Map<string, string>();
	for (const line of body.split(';')) {
		const colon = line.indexOf(':');
		if (colon === -1) continue;
		const property = line.slice(0, colon).trim();
		if (property) declarations.set(property, line.slice(colon + 1).trim());
	}
	return declarations;
}

const themeVars = parseDeclarations(ruleBody(/@theme\s*\{([^}]*)\}/, '@theme'));
const rootVars = parseDeclarations(ruleBody(/:root\s*\{([^}]*)\}/, ':root'));
const cssVars = new Map([...rootVars, ...themeVars]);

/** Substitute `var(--name)` / `var(--name, fallback)` with the authored value. */
function resolveVars(value: string): string {
	let resolved = value;
	for (const match of value.matchAll(
		/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g,
	)) {
		const name = match[1];
		// `.at()` rather than `[2]`: the fallback group is optional.
		const fallback = match.at(2)?.trim();
		resolved = resolved.replace(
			match[0],
			cssVars.get(name) ?? fallback ?? name,
		);
	}
	return resolved;
}

export interface ColorToken {
	/** Custom property as authored, e.g. `--color-text-third`. */
	variable: string;
	/** Authored value, e.g. `#a2a2a2`. */
	value: string;
	/** Suffix Tailwind builds utilities from: `text-third` → `bg-text-third`. */
	token: string;
}

export interface ColorGroup {
	name: string;
	description: string;
	colors: ColorToken[];
}

const colorTokens: ColorToken[] = [...themeVars]
	.filter(([variable]) => variable.startsWith('--color-'))
	.map(([variable, value]) => ({
		variable,
		value,
		token: variable.slice('--color-'.length),
	}));

const GROUPS: {
	name: string;
	description: string;
	owns: (token: string) => boolean;
}[] = [
	{
		name: 'Surfaces',
		description: 'Page and panel backgrounds.',
		owns: (token) => token === 'bg' || token.startsWith('surface'),
	},
	{
		name: 'Text',
		description: 'Foreground hierarchy, brightest to dimmest.',
		owns: (token) => token.startsWith('text-'),
	},
	{
		name: 'Borders',
		description: 'Hairlines and separators.',
		owns: (token) => token.startsWith('border'),
	},
];

/** Colour tokens bucketed for display. Unmatched tokens fall into `Other`. */
export const colorGroups: ColorGroup[] = (() => {
	const ungrouped = new Set(colorTokens);
	const groups: ColorGroup[] = [];

	for (const { name, description, owns } of GROUPS) {
		const colors = colorTokens.filter((color) => owns(color.token));
		for (const color of colors) ungrouped.delete(color);
		if (colors.length > 0) groups.push({ name, description, colors });
	}

	if (ungrouped.size > 0) {
		groups.push({
			name: 'Other',
			description: 'Tokens that predate the groups above.',
			colors: [...ungrouped],
		});
	}

	return groups;
})();

export interface FontToken {
	variable: string;
	value: string;
	/** The utility Tailwind derives, or `null` when the var sits outside `@theme`. */
	utility: string | null;
}

export const fontTokens: FontToken[] = [
	...[...themeVars]
		.filter(([variable]) => variable.startsWith('--font-'))
		.map(([variable, value]) => ({
			variable,
			value,
			utility: `font-${variable.slice('--font-'.length)}`,
		})),
	...[...rootVars]
		.filter(([variable]) => variable.endsWith('font-family'))
		.map(([variable, value]) => ({ variable, value, utility: null })),
];

export interface TypeUtility {
	/** Class name, e.g. `type-heading-1`. */
	name: string;
	/** Resolved font-size, e.g. `24px`, or the literal value when relative. */
	size: string;
	/** Resolved font-weight, or `inherit` when the utility doesn't set one. */
	weight: string;
	lineHeight: string;
	/** Primary font-family, when the utility sets one. */
	family: string | null;
}

function formatSize(value: string): string {
	const match = /^var\(\s*(--text-[\w-]+)\s*\)$/.exec(value);
	const px = match ? TEXT_SIZE_PX[match[1]] : undefined;
	return px === undefined ? value : `${String(px)}px`;
}

function formatFamily(value: string): string {
	const [primary] = resolveVars(value).split(',');
	return primary.trim().replace(/^['"]|['"]$/g, '');
}

export const typeUtilities: TypeUtility[] = [
	...source.matchAll(/@utility\s+(type-[\w-]+)\s*\{([^}]*)\}/g),
].map(([, name, body]) => {
	const declarations = parseDeclarations(body);
	const family = declarations.get('font-family');

	return {
		name,
		size: formatSize(declarations.get('font-size') ?? 'inherit'),
		weight: declarations.get('font-weight') ?? 'inherit',
		lineHeight: declarations.get('line-height') ?? 'inherit',
		family: family === undefined ? null : formatFamily(family),
	};
});

if (typeUtilities.length === 0) {
	throw new Error('design-system: no `@utility type-*` rules found');
}

/** The literal `body` background, so the page can render the real thing. */
export const bodyBackground =
	parseDeclarations(ruleBody(/\bbody\s*\{([^}]*)\}/, 'body rule')).get(
		'background',
	) ?? '';
