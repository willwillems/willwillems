// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Will Willems' Blog";
export const SITE_DESCRIPTION =
	'Passionate developer and web development consultant, currently obsessed with creating blazing fast modern web apps.';

export interface NavItem {
	label: string;
	href: string;
}

/** Outbox slugs pinned above the feed, in display order. */
export const PINNED_SLUGS = [
	'morley-kert',
	'esp-boards',
	'devsync',
	'whoishiringme',
	's1',
];

/** Primary navigation, shared by the desktop header and the mobile menu. */
export const NAV_ITEMS: NavItem[] = [
	{ label: 'Outbox', href: '/posts' },
	{ label: 'Now', href: '/now' },
];
