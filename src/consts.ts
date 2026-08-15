// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Will Willems' Blog";
export const SITE_DESCRIPTION =
	'Passionate developer and web development consultant, currently obsessed with creating blazing fast modern web apps.';

export interface NavItem {
	label: string;
	href: string;
}

/** Primary navigation, shared by the desktop header and the mobile menu. */
export const NAV_ITEMS: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Posts', href: '/posts' },
	{ label: 'About', href: '/about' },
];
