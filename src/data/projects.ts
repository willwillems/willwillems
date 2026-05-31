export type ProjectStatus = 'active' | 'experimental' | 'dead';

export interface Project {
	name: string;
	description: string;
	categories: ProjectStatus[];
	link?: string;
}

export const projects: Project[] = [
	{
		name: 'Deducta',
		description:
			'Automated bookkeeping for freelancers and small businesses.',
		categories: ['active'],
		link: 'https://deducta.ai',
	},
	{
		name: 'Devsync',
		description: 'Keep your local dev environment in sync with your team.',
		categories: ['experimental'],
		link: 'https://github.com/willwillems/devsync',
	},
	{
		name: 'Obsidian → Blog pipeline',
		description:
			'One-way sync script from Obsidian vault to Astro content collections.',
		categories: ['active'],
		link: 'https://github.com/willwillems/obsidian-astro-sync',
	},
	{
		name: 'Generic MIDI controller',
		description:
			'RP2040-based MIDI controller with encoders, velocity pads, and OLED display.',
		categories: ['active'],
	},
	{
		name: 'Invoice tracker',
		description:
			'Paste a client email, track whether it got paid. Small B2B SaaS.',
		categories: ['experimental'],
	},
	{
		name: 'CSS Specificity visualiser',
		description:
			'Paste a stylesheet and see specificity conflicts highlighted inline.',
		categories: ['dead'],
		link: 'https://github.com/willwillems/specificity-vis',
	},
	{
		name: 'VuePress custom theme',
		description:
			'A minimal dark theme for VuePress 1.x documentation sites.',
		categories: ['dead'],
		link: 'https://github.com/willwillems/vuepress-theme-minimal',
	},
	{
		name: 'Dishes by city',
		description: 'Crowdsourced map of must-eat dishes indexed by city.',
		categories: ['dead'],
	},
];
