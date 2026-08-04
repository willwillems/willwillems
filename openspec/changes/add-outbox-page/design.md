# Design

## Component tree

```
src/pages/posts/index.astro
  └── OutboxSection.astro                (the entire Outbox UI, embeddable elsewhere)
        ├── OutboxHeader.astro           (label + tabs + sort button)
        │     └── CategoryTabs.astro     (derives tabs from posts; client-side filter dispatch)
        ├── ActivityHeatmap.astro        (12-month rolling daily grid, colored per dominant category)
        └── PostList.astro
              └── PostRow.astro          (one per post; carries data-category & data-date attrs)

src/pages/articles/index.astro           (migrated from current /posts/index.astro)
src/pages/articles/[...slug].astro       (migrated from current /posts/[...slug].astro)
```

Outbox post detail pages at `/posts/[slug]` are intentionally absent in v1. The `slug` field exists on the data for forward-compatibility; a follow-up change will introduce the detail route once the Obsidian Markdown rendering pipeline is in place.

## Data model

### Outbox post (`src/data/posts.ts`)

```ts
interface Post {
	slug: string; // URL slug, e.g. "obsidian-as-a-publishing-pipeline"
	title: string;
	publishedAt: Date;
	content: string; // markdown body
	categories: string[]; // usually length 1
}
```

The `description` shown in each row is derived at render time from `content`:

- strip basic markdown syntax (`#`, `*`, `` ` ``, `[`, `]`, `(`, `)`)
- truncate to ~160 chars on a word boundary
- append `…` if truncated

A small `excerpt(content, length)` utility colocated with the components handles this.

### Derived: category list

The category list driving the tabs is computed at build time from `posts.flatMap(p => p.categories)`, deduplicated, in first-seen order. `All` is prepended.

### Derived: category → colour map

A fixed palette of 6–8 colours (within the site's warm/amber-on-dark theme) is assigned to categories in first-seen order. The palette is defined as a `const` array in `src/data/posts.ts` or a sibling util. The mapping is recomputed at render and is stable across renders because input order is stable.

Palette anchor (subject to refinement during implementation):

```
1. #f5c518   (amber — matches design)
2. #4d9de0   (sky blue)
3. #9b59b6   (violet)
4. #2ecc71   (green)
5. #e67e22   (orange)
6. #e74c3c   (red)
7. #1abc9c   (teal)
8. #f1c40f   (yellow)
```

### Derived: daily buckets for heatmap

At build time, posts are bucketed by their `publishedAt` date (UTC day). For each of the 365 days ending today:

```
{
  date: Date,
  postCount: number,
  dominantCategory: string | null   // null when postCount === 0
}
```

`dominantCategory` is the category with the most occurrences across all posts on that day, with ties broken by category order (see derived category list above).

## Heatmap rendering

The heatmap is built as a **CSS grid of 53 columns × 7 rows** (one column per week, one row per day-of-week). Days outside the 365-day window in the first/last columns are rendered as empty placeholders to keep the grid rectangular.

Cells are `<div>` elements with:

- `aria-hidden="true"` (purely decorative in v1)
- `background-color` from inline style or a Tailwind utility derived from the dominant category colour
- A subtle border-radius and gap between cells

Month labels are a separate row below the grid, positioned via `grid-column` to align with the first column whose first day falls in that month.

**Why CSS grid over SVG**: easier to make individual cells styleable later (hover, click) without re-architecting, and no need to manually calculate coordinates. Trade-off: slightly more DOM nodes (~371 cells), but at the document scale this is fine.

## Filtering and sorting (client-side)

A single `<script>` tag at the bottom of `OutboxSection.astro` wires up both behaviours. It is plain ES module JavaScript, scoped via `is:inline` (no hydration needed since there's no client framework).

### Filter implementation

Each `PostRow` carries `data-categories="Reports,Resources"` (comma-separated) as an attribute. The category tabs carry `data-category="Reports"` (or `data-category=""` for `All`).

```js
tabsContainer.addEventListener('click', (e) => {
	const tab = e.target.closest('[data-category]');
	if (!tab) return;
	const wanted = tab.dataset.category;
	rows.forEach((row) => {
		const cats = row.dataset.categories.split(',');
		row.hidden = wanted !== '' && !cats.includes(wanted);
	});
	// update active-tab styling
});
```

### Sort implementation

Each `PostRow` carries `data-date="2025-04-05"` (ISO date). The script reorders rows by detaching and re-inserting in the new order:

```js
let ascending = false;
sortButton.addEventListener('click', () => {
	ascending = !ascending;
	const sorted = [...rows].sort((a, b) =>
		ascending
			? a.dataset.date.localeCompare(b.dataset.date)
			: b.dataset.date.localeCompare(a.dataset.date),
	);
	sorted.forEach((row) => listContainer.appendChild(row));
});
```

## Per-category colour application

The `ActivityHeatmap` component receives the buckets + the category→colour map and renders inline `style="background-color: ..."` for non-empty cells. The colour is computed at build time, so the runtime is purely declarative.

Tabs themselves remain monochrome (white active / grey inactive) — matching the design — even though tabs are conceptually tied to categories. Colour is reserved for the heatmap, where it carries information.

## Article migration

The migration of `/posts` → `/articles` is a near-1:1 file move plus a couple of edits:

1. `src/pages/posts/index.astro` → `src/pages/articles/index.astro` (content unchanged).
2. `src/pages/posts/[...slug].astro` → `src/pages/articles/[...slug].astro`, with the `href` template updated from `/posts/${id}.html` to `/articles/${id}.html`.
3. `src/pages/rss.xml.ts` — update item link template to `/articles/...`.
4. `src/components/Header.astro` — rename `Posts` → `Articles`, update href; add new `Outbox` nav link pointing at `/posts`.
5. Grep audit for any remaining `/posts/...` references.

After the move, the new Outbox files fill in at `/posts`.

## URL slug strategy

The existing articles page uses `${post.id}.html` (e.g. `/posts/tailwind-with-svelte-webpack.html`). We preserve the `.html` suffix for articles to keep their URL shape unchanged (just under a new prefix).

The new Outbox detail pages use plain extensionless slugs (`/posts/obsidian-as-a-publishing-pipeline`) since they're a fresh capability with no legacy URLs.

## Open questions for implementation

- **Description fallback**: when the Obsidian source eventually replaces `src/data/posts.ts`, the loader will need to expose `content` (or a pre-computed `description`). The `excerpt()` util is written to be reusable for both sources.
- **Heatmap empty-state colour**: subject to visual tuning during build. Likely `--color-border` or one shade darker.
- **Tie-breaking determinism**: spec says "data order"; implementation must derive the category list once and pass it consistently into both the tabs and the heatmap colour map.

## What this design intentionally avoids

- **No client framework** — vanilla JS, ~30 lines, scoped to one component.
- **No URL state for filter/sort** — fully ephemeral in v1; can be added later via `URLSearchParams` + `history.replaceState` without changing the component contracts.
- **No SVG heatmap** — CSS grid keeps it inspectable, themable, and accessible-by-default.
- **No accessibility roles on heatmap cells** — they're `aria-hidden` in v1 since they carry no actionable information. The post list is the canonical post index for assistive tech.
