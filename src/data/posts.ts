export interface Post {
	slug: string;
	title: string;
	publishedAt: Date;
	content: string;
	categories: string[];
}

export const posts: Post[] = [
	{
		slug: 'why-i-stopped-using-component-libraries',
		title: 'Why I stopped using component libraries',
		publishedAt: new Date('2025-08-12'),
		categories: ['Posts'],
		content: `Every project starts the same way: pick a component library, spend a week fighting its defaults, then spend the rest of the project working around it. I've done this with Material UI, Ant Design, Chakra, and a handful of others. Each time I told myself this one would be different.

It never is. The problem isn't the libraries — they're well-built and solve real problems. The problem is that a component library is a design system in a box, and your product has a different box. The seams show up eventually, and by then you've got a codebase full of override hacks and wrapper components that exist purely to undo the library's opinions.

I now reach for a CSS framework with unstyled primitives and build components once, exactly the way the product needs them.`,
	},
	{
		slug: 'building-a-midi-controller-from-scratch',
		title: 'Building a MIDI controller from scratch',
		publishedAt: new Date('2025-08-29'),
		categories: ['Posts'],
		content: `I've been playing around with hardware for a few years but always stopped short of building something I'd actually use. This changed when I decided to build a MIDI controller tailored to my specific live setup — four encoder knobs, eight velocity-sensitive pads, and a small OLED display showing the current patch name.

The microcontroller is an RP2040 running TinyUSB. MIDI over USB is surprisingly straightforward once you understand the descriptor setup. The harder part was the pad velocity sensing — the FSR curves are non-linear and each sensor has slightly different characteristics, so I ended up doing per-pad calibration stored in flash.

Enclosure is laser-cut acrylic stacked in layers. Not as refined as aluminium but I can iterate quickly.`,
	},
	{
		slug: 'obsidian-as-a-publishing-pipeline',
		title: 'Obsidian as a publishing pipeline',
		publishedAt: new Date('2025-09-14'),
		categories: ['Reports'],
		content: `My writing workflow has always been fragmented. Ideas in one place, drafts in another, published posts somewhere else entirely. I've tried to consolidate this a dozen times with varying success.

The current setup is Obsidian as the single source of truth. Every note is a potential post. A small Node script watches for notes tagged \`#publish\` and syncs them to the blog's content directory, transforming Obsidian-flavoured markdown (callouts, wikilinks) into standard MDX as it goes.

The sync is one-way: Obsidian → blog. I don't edit posts after they're live, I publish a follow-up note instead. This constraint simplifies the pipeline enormously.`,
	},
	{
		slug: 'the-problem-with-ai-code-assistants',
		title: 'The problem with AI code assistants',
		publishedAt: new Date('2025-09-14'),
		categories: ['Reports'],
		content: `After a year of daily use, I have a clearer picture of where AI coding assistants help and where they quietly make things worse.

They're excellent at boilerplate — the kind of code you know exactly what it should look like but don't want to type. They're good at explaining unfamiliar APIs and translating between languages. They dramatically reduce the cost of switching contexts.

Where they fall short is architecture. The assistant has no memory of the decisions you made three months ago, no understanding of why the codebase is shaped the way it is, and no skin in the game when the suggestion it makes introduces a subtle coupling that'll cost you later. The output looks correct. It often is. But the cases where it isn't are hard to spot precisely because the code looks so confident.`,
	},
	{
		slug: 'tailwind-v4-in-practice',
		title: 'Tailwind v4 in practice',
		publishedAt: new Date('2025-10-21'),
		categories: ['Resources'],
		content: `I migrated this site to Tailwind v4 shortly after it hit stable. The headline change — CSS-first configuration via \`@theme\` — is genuinely better than a JS config file. Collocating design tokens with the stylesheet feels right.

A few rough edges: the VS Code IntelliSense extension lagged behind the release for a couple of weeks, and a handful of utility names changed in ways that weren't obvious from the migration guide. The \`border-border\` idiom is gone, which is fine, but finding that out from a cryptic class warning rather than documentation was annoying.

Overall the upgrade was worth the afternoon it took. The output CSS is leaner and the DX is better once the tooling caught up.`,
	},
	{
		slug: 'shipping-a-small-saas-in-four-weeks',
		title: 'Shipping a small SaaS in four weeks',
		publishedAt: new Date('2025-11-03'),
		categories: ['Reports'],
		content: `Last month I shipped a small B2B tool for tracking invoice status across multiple clients. Four weeks from idea to first paying customer. Here's what made the difference.

The scope was ruthless. The MVP does exactly one thing: you paste in a client email, it extracts invoice data and tracks whether they've been paid. No integrations, no dashboards, no team features. Those come later if the thing gets traction.

Tech choices were boring by design. Astro for the marketing page, Next.js for the app (I know, I know), Supabase for the database and auth. Nothing I had to learn. The only new thing I touched was Resend for transactional email, and that took twenty minutes.`,
	},
	{
		slug: 'reading-the-spec-css-grid',
		title: 'Reading the spec: CSS Grid',
		publishedAt: new Date('2025-11-19'),
		categories: ['Resources'],
		content: `Most CSS Grid tutorials teach you the happy path: \`grid-template-columns\`, \`gap\`, \`grid-column: span 2\`. That covers 90% of use cases and most developers stop there.

The 10% where Grid gets interesting is implicit vs explicit grid behaviour, the \`auto\` track algorithm, and how \`fr\` units interact with \`min-content\` and \`max-content\` constraints. These aren't obscure edge cases — they come up regularly in any layout that's slightly more complex than a card grid.

I spent an afternoon reading the actual spec (Level 1 is readable, unlike some CSS specs) and filled in several gaps I didn't know I had.`,
	},
	{
		slug: 'notes-on-running-a-solo-business',
		title: 'Notes on running a solo business',
		publishedAt: new Date('2025-12-08'),
		categories: ['Posts'],
		content: `Three years in, running a one-person consultancy. Some things I've learned that I wish someone had told me at the start.

The hardest part isn't finding clients or doing the work — it's the irregular rhythm. Feast and famine is real and the psychological cost of uncertainty compounds over time. The practical answer is a larger cash buffer than feels necessary and a hard rule about not touching it for lifestyle expenses.

Proposals are the highest-leverage thing I write. A well-structured proposal does more selling than any amount of networking. I keep a library of proposal sections I can reassemble quickly; the framing stays consistent, the specifics are always custom.`,
	},
	{
		slug: 'typescript-satisfies-an-underused-keyword',
		title: 'TypeScript satisfies: an underused keyword',
		publishedAt: new Date('2026-01-04'),
		categories: ['Resources'],
		content: `Introduced in TypeScript 4.9, \`satisfies\` solves a specific problem that previously required an awkward dance between \`as const\` and explicit type annotations.

The problem: you want an object to conform to a type (so TypeScript validates the shape) but you also want to preserve the literal types of its values (so you get autocomplete and narrowing downstream).

\`const x = { ... } satisfies SomeType\` does both. The object is validated against \`SomeType\` at the definition site, but the inferred type of \`x\` is still the narrow literal type, not the wide \`SomeType\`. This is exactly what you want for config objects and lookup tables.`,
	},
	{
		slug: 'using-sqlite-for-everything',
		title: 'Using SQLite for everything',
		publishedAt: new Date('2026-01-22'),
		categories: ['Reports'],
		content: `For a recent project I deliberately chose SQLite where I would previously have reached for Postgres. The results changed how I think about database selection.

The workload was a read-heavy analytics tool with one writer and ~50 concurrent readers. SQLite handled it without breaking a sweat. WAL mode, a connection pool of one writer and many readers, and careful index design got me to sub-10ms query times on a $6 VPS.

The operational simplicity is the real win. No connection string to manage, no service to keep running, backups are a file copy. For projects that don't need multi-writer or network access to the database, SQLite is underrated.`,
	},
	{
		slug: 'designing-with-constraints',
		title: 'Designing with constraints',
		publishedAt: new Date('2026-02-10'),
		categories: ['Posts'],
		content: `The best design work I've done came out of tight constraints. This sounds like a cliché but there's a real mechanism behind it.

Constraints force prioritisation. When you can do anything, you default to doing everything. When you can only do three things, you have to decide which three matter. That decision is where design actually happens.

The constraint I've found most useful is time. Give yourself one hour to design a component. Not a deadline — an active constraint. You can't refine forever when the hour is up. The rough edges you leave behind are often not the ones that mattered anyway.`,
	},
	{
		slug: 'ab-testing-is-not-a-strategy',
		title: 'A/B testing is not a strategy',
		publishedAt: new Date('2026-03-02'),
		categories: ['Reports'],
		content: `A/B testing is a useful tool for confirming that a specific change improves a specific metric. It's not a method for discovering what to build, and treating it as one produces locally-optimal, globally-mediocre products.

The pattern I see repeatedly: a team runs tests, improves their conversion metric by a few percent over several months, and ships nothing of significance. The metric goes up, the product goes sideways.

Tests can only measure options you've already thought of. The valuable work is figuring out which options to test — and that requires talking to users, reading qualitative signal, and making bets on things you can't yet measure.`,
	},
	{
		slug: 'font-loading-in-2025',
		title: 'Font loading in 2025',
		publishedAt: new Date('2026-03-25'),
		categories: ['Resources'],
		content: `Self-hosting fonts is the right call for most projects now. The privacy argument (no third-party requests) and the performance argument (no DNS lookup, no cross-origin handshake) both point the same direction, and the tooling has caught up.

\`fonttools\` and \`glyphhanger\` make subsetting straightforward. For a typical blog you can get a variable font subset down to 20–30kb covering the characters you actually use. Serve it with \`font-display: swap\` and a \`<link rel="preload">\` and you're done.

The one thing I still reach for Google Fonts for: quick prototypes where I don't care about the loading details yet. The CSS \`@import\` is fast to write. I just make sure to replace it before anything goes to production.`,
	},
	{
		slug: 'what-makes-documentation-good',
		title: 'What makes documentation good',
		publishedAt: new Date('2026-04-15'),
		categories: ['Posts'],
		content: `Good documentation is rare. Most docs are written by people who already understand the system, for people who don't, and that gap in understanding is rarely bridged well.

The most useful docs I've read share a structure: what this is (one sentence), why you'd use it (one sentence), the minimal working example (the whole thing, not a fragment), and then the complete reference. The minimal example is the thing most docs skip or bury.

A doc that makes me feel stupid is a failed doc, regardless of how technically accurate it is. The goal is to transfer understanding, not to demonstrate that the writer has it.`,
	},
	{
		slug: 'astro-content-collections-are-underrated',
		title: 'Astro content collections are underrated',
		publishedAt: new Date('2026-05-11'),
		categories: ['Resources'],
		content: `I've been using Astro's content collections since they left beta and they've quietly become one of my favourite features in any framework.

The pitch is simple: type-safe frontmatter with Zod validation, co-located content, and first-class querying APIs. What makes it good in practice is that it doesn't get in the way. You define a schema, write markdown files, and Astro handles the rest.

The loader API in v4 goes further — you can pull content from any source (a CMS, a database, an API) and it shows up in your components the same way local files do. I'm using it to sync notes from Obsidian and it Just Works.`,
	},
	{
		slug: 'rethinking-the-portfolio-site',
		title: 'Rethinking the portfolio site',
		publishedAt: new Date('2026-05-22'),
		categories: ['Posts'],
		content: `Portfolio sites have a format problem. The expected structure — hero, about, work, contact — is so standard that it communicates nothing about the person. Everyone's portfolio looks like everyone else's portfolio.

The alternative I'm experimenting with is a site that's more like a public workspace. Less "here are my credentials" and more "here's how I think". The blog is the portfolio. The process notes are the portfolio. The things I'm building and thinking about are the portfolio.

This is harder to maintain than a static showcase, but it's also more honest. And honesty, it turns out, is differentiating.`,
	},
];
