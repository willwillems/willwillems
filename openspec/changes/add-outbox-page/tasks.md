# Tasks

## 1. Spec amendments

- [ ] 1.1 Trim detail-page requirements from `openspec/changes/add-outbox-page/specs/outbox/spec.md`
- [ ] 1.2 Update `proposal.md`: drop detail page from "What changes" + "Affected code"; add to "Out of scope"
- [ ] 1.3 Update `design.md`: drop `src/pages/posts/[slug].astro` from component tree

## 2. Articles migration

- [ ] 2.1 Move `src/pages/posts/index.astro` → `src/pages/articles/index.astro`
- [ ] 2.2 Move `src/pages/posts/[...slug].astro` → `src/pages/articles/[...slug].astro`
- [ ] 2.3 Update href in `articles/[...slug].astro`: `/posts/${id}.html` → `/articles/${id}.html`
- [ ] 2.4 Update `src/pages/rss.xml.ts`: item links → `/articles/[slug]`
- [ ] 2.5 Update `src/components/Header.astro`: rename `Posts` → `Articles`, add `Outbox` link to `/posts`
- [ ] 2.6 Grep audit: `rg "/posts/" src/` — confirm no stale article references

## 3. Demo data prep

- [ ] 3.1 Re-date the 16 posts in `src/data/posts.ts` to span the trailing ~10 months

## 4. Outbox utilities

- [ ] 4.1 `CATEGORY_PALETTE` constant + `getCategoryColor(category, allCategories)` util
- [ ] 4.2 `excerpt(content, length=160)` util — strip markdown, truncate on word boundary
- [ ] 4.3 `buildHeatmapBuckets(posts, asOf=new Date())` util returning the 365-day rolling window with dominant category per day

## 5. Outbox components

- [ ] 5.1 `src/components/outbox/CategoryTabs.astro` — derives tabs from posts; emits `data-category` attrs
- [ ] 5.2 `src/components/outbox/OutboxHeader.astro` — h2 "Outbox" label + `CategoryTabs` + Sort button
- [ ] 5.3 `src/components/outbox/ActivityHeatmap.astro` — 53×7 CSS grid + month labels, inline bg-color per cell
- [ ] 5.4 `src/components/outbox/PostRow.astro` — two-column row; `data-categories` + `data-date` attrs
- [ ] 5.5 `src/components/outbox/PostList.astro` — list wrapper with dividers + empty state
- [ ] 5.6 `src/components/outbox/OutboxSection.astro` — composes the above + inline filter/sort script

## 6. Page wiring

- [ ] 6.1 Create new `src/pages/posts/index.astro` that renders `<OutboxSection posts={posts} />`
- [ ] 6.2 Confirm `BaseHead` / `Header` / `Footer` chrome still applies
- [ ] 6.3 Set `<title>` per `SITE_TITLE` convention

## 7. Responsive pass

- [ ] 7.1 Header wraps on `< md`
- [ ] 7.2 Post rows: left column stacks above right on `< md`
- [ ] 7.3 Heatmap scrolls horizontally on `< md` while keeping cell size

## 8. Verification

- [ ] 8.1 `npm run validate` passes
- [ ] 8.2 Browser walk-through: `/articles`, `/articles/[slug]`, `/posts`
- [ ] 8.3 Click each category tab → confirm filter
- [ ] 8.4 Click sort → confirm reorder
- [ ] 8.5 Filter + sort interaction
- [ ] 8.6 Resize to mobile → confirm responsive behaviour
- [ ] 8.7 Heatmap visual: cells colored by dominant category, empty days dim, month labels aligned
