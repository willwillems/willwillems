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
		description: 'Automated bookkeeping for freelancers.',
		categories: ['active'],
		link: 'https://deducta.ai',
	},
	{
		name: 'Devsync',
		description: 'Keep your dev environment in sync.',
		categories: ['experimental'],
		link: 'https://github.com/willwillems/devsync',
	},
	{
		name: 'Obsidian Blog',
		description: 'Sync script from Obsidian vault to Astro',
		categories: ['active'],
		link: 'https://github.com/willwillems/obsidian-astro-sync',
	},
	{
		name: 'Generic MIDI controller',
		description: 'RP2040-based MIDI controller',
		categories: ['active'],
	},
	{
		name: 'Invoice tracker',
		description: 'Paste a client email, track whether it.',
		categories: ['experimental'],
	},
	{
		name: 'CSS Specificity visualiser',
		description: 'Paste a stylesheet and see conflicts inline.',
		categories: ['dead'],
		link: 'https://github.com/willwillems/specificity-vis',
	},
	{
		name: 'VuePress custom theme',
		description: 'Minimal dark theme for VuePress 1.x sites.',
		categories: ['dead'],
		link: 'https://github.com/willwillems/vuepress-theme-minimal',
	},
	{
		name: 'Dishes by city',
		description: 'Crowdsourced map of must-eat dishes.',
		categories: ['dead'],
	},
];
