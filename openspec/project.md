# Project context

## Purpose

`willwillems.com` is a personal blog and portfolio. It exists to publish writing, document projects, and serve as a public-facing surface for the author's work.

## Stack

- **Astro 6** (beta) — static site generator, file-based routing
- **Tailwind CSS v4** — utility-first CSS via `@tailwindcss/vite`, configured CSS-first via `@theme {}` in `src/styles/global.css`
- **TypeScript** — strict mode
- **MDX** — long-form content via Astro Content Collections (`src/content/blog/`)
- **No client-side framework** — vanilla Astro components only

## Content sources

The site has two distinct content streams:

| Stream             | Format                           | Storage                                                                                       | Route       |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
| Long-form articles | Markdown/MDX with frontmatter    | Astro Content Collection at `src/content/blog/`                                               | `/articles` |
| Outbox posts       | Short notes synced from Obsidian | Currently `src/data/posts.ts` (demo data); future: content loader pulling from Obsidian vault | `/posts`    |

## Conventions

- **Indentation**: tabs.
- **Quotes**: single quotes in TS/JS.
- **Components**: Astro (`.astro`) only.
- **Styling**: Tailwind utility classes; design tokens defined in `src/styles/global.css` (`--color-bg`, `--color-text`, `--color-text-secondary`, `--color-text-inactive`, `--color-surface`, `--color-border`, `--font-sans`, `--font-accent`).
- **Validation gate**: `npm run validate` (typecheck + lint + format-check) must pass before any change is considered complete.

## Capabilities

| Capability | Status                    | Description                                                                                   |
| ---------- | ------------------------- | --------------------------------------------------------------------------------------------- |
| `articles` | Planned                   | Long-form blog at `/articles`. Migration of the existing `/posts` page.                       |
| `outbox`   | Planned                   | Short-form posts at `/posts` with an activity heatmap, category filtering, and a sort toggle. |
| `projects` | Existing (not yet spec'd) | Project listing at `/projects`.                                                               |
| `home`     | Existing (not yet spec'd) | Homepage at `/` with hero, bio, contact form.                                                 |
