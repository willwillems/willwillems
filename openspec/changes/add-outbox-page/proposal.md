# Add Outbox page

## Why

The site currently has a single content stream — long-form Markdown articles — listed at `/posts`. We want to introduce a second, distinct stream: **Outbox posts**, short notes synced from an Obsidian vault. They differ from articles in three ways:

1. **Format** — short notes, not long-form essays.
2. **Source** — an Obsidian vault (via a future loader), not Markdown files committed to the repo.
3. **Presentation** — a denser listing with a daily activity heatmap, category tabs, and a sort toggle, modelled on research-org "outbox" / "research index" pages.

Mixing both streams under `/posts` would muddle the routes and the data shape. Splitting them now — before more long-form posts accumulate and before the Obsidian sync ships — keeps each capability cohesive.

## What changes

### Route migration

- **Move** the existing `/posts` listing (Astro Content Collection at `src/content/blog/`) to `/articles`.
- **Move** the existing `/posts/[...slug].html` detail page to `/articles/[...slug].html`.
- **Reserve** `/posts` for the new Outbox UI.

### New: Outbox

- **New page** at `/posts` rendering the Outbox layout:
    - Section header: `Outbox` label, category filter tabs (`All` + one per category found in the data), `Sort` toggle on the right.
    - Activity heatmap: GitHub-contributions-style daily grid for the last 12 months, cells colored by the dominant category for that day.
    - Post list: one row per post showing `[Category] · [Date]` on the left, `[Title] + [Description]` on the right.
- **Data source**: `src/data/posts.ts` (demo data, with a `slug` field added). A future change will replace this with an Obsidian-backed content loader.

### Interaction

- **Category filtering**: client-side JS toggles row visibility via `data-category` attributes. No page reload.
- **Sort**: client-side JS toggles row order between newest-first and oldest-first.
- **Filter button**: omitted (tabs already filter).

### Responsive

- Header wraps on narrow screens.
- Post-row metadata stacks above the title on narrow screens.
- Heatmap remains daily-resolution and scrolls horizontally on narrow screens.

## Impact

### Affected specs (new)

- `articles` — the migrated long-form blog
- `outbox` — the new short-form post listing

### Affected code

- New: `src/pages/posts/index.astro` (Outbox listing, replaces current)
- New: `src/pages/articles/index.astro` (migrated from old `/posts/index.astro`)
- New: `src/pages/articles/[...slug].astro` (migrated from old `/posts/[...slug].astro`)
- Removed: `src/pages/posts/[...slug].astro` (no Outbox detail route in v1)
- New components under `src/components/outbox/`
- Updated: `src/data/posts.ts` — added `slug` field (already done)
- Updated: `src/components/Header.astro` — nav link `Posts` → `Articles` + new `Outbox` entry
- Updated: `src/pages/rss.xml.ts` — RSS feed continues to cover the content collection (now exposed as `/articles`), possibly extended later to include Outbox.

### Affected URLs (breaking)

- `/posts` — changes meaning (was articles, now Outbox).
- `/posts/[slug]` — changes meaning (was article slugs, now Outbox slugs).
- `/articles`, `/articles/[slug]` — new.
- Internal links in posts/components must be updated to point at `/articles/...` where they previously referenced `/posts/...`.
- No redirects are configured for this change. The site is small and the old URLs are not heavily linked externally yet. If that changes before launch, add a follow-up change to introduce redirects.

## Out of scope

- Obsidian content loader (separate future change).
- Homepage embedding of the Outbox section (separate future change — components will be built to support this).
- Outbox post detail pages at `/posts/[slug]` — deferred until the Obsidian Markdown rendering pipeline lands. Titles render as plain text in v1.
- Mobile redesigns of the heatmap beyond "scrolls horizontally".
- Filter button beyond the tabs (out per earlier scoping call).
- RSS feed for Outbox posts.
