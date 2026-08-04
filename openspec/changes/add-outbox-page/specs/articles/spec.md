# articles Specification

## Purpose

Render the long-form blog listing at `/articles` and individual article detail pages at `/articles/[slug]`. Articles are sourced from the Astro Content Collection at `src/content/blog/`. This capability is the migrated successor to what previously lived at `/posts` and `/posts/[slug]`.

## Requirements

### Requirement: Articles listing page exists at /articles

The system SHALL render a listing page at `/articles` that displays every entry from the `blog` content collection.

#### Scenario: Default render

- GIVEN the `blog` collection contains one or more entries
- WHEN a user visits `/articles`
- THEN the page renders all entries
- AND entries are sorted newest-first by `pubDate`

#### Scenario: Layout — featured first

- GIVEN the `blog` collection contains two or more entries
- WHEN the page renders
- THEN the first (newest) entry renders full-width and visually featured (larger title)
- AND remaining entries render in a two-column grid

#### Scenario: Empty collection

- GIVEN the `blog` collection contains zero entries
- WHEN a user visits `/articles`
- THEN the page renders an empty state ("No articles yet")

### Requirement: Article detail pages exist at /articles/[slug]

The system SHALL render a detail page for every entry in the `blog` collection at `/articles/[slug]`, where `[slug]` is the entry's `id`.

#### Scenario: Detail render

- GIVEN a blog entry with id `tailwind-with-svelte-webpack` and frontmatter `{ title: "...", pubDate: 2018-09-12 }`
- WHEN a user visits `/articles/tailwind-with-svelte-webpack.html`
- THEN the page renders the title, formatted `pubDate`, optional `updatedDate`, and the rendered Markdown body
- AND the page uses the existing `BlogPost.astro` layout

#### Scenario: Unknown slug

- GIVEN no blog entry has id `does-not-exist`
- WHEN a user visits `/articles/does-not-exist.html`
- THEN Astro returns a 404 (via `getStaticPaths` not producing the slug)

### Requirement: Header navigation reflects the route change

The global site `Header` SHALL link to `/articles` for long-form content and `/posts` for Outbox content. The previous `Posts` nav link SHALL be renamed.

#### Scenario: Nav labels

- WHEN the header renders
- THEN it contains a nav link with text `Articles` pointing to `/articles`
- AND it contains a nav link with text `Outbox` (or `Posts`) pointing to `/posts`
- AND no nav link points to a deprecated `/posts` (where `/posts` formerly meant articles)

### Requirement: RSS feed continues to cover articles

The site's RSS feed at `/rss.xml` SHALL continue to surface entries from the `blog` content collection. Entry links SHALL point to the new `/articles/[slug]` URLs, not the deprecated `/posts/[slug]` URLs.

#### Scenario: Feed item link

- GIVEN a blog entry with id `tailwind-with-svelte-webpack`
- WHEN the RSS feed renders
- THEN the corresponding item's `<link>` resolves to `/articles/tailwind-with-svelte-webpack.html`

### Requirement: Internal cross-references updated

Any internal hyperlinks across the codebase that previously pointed at `/posts/...` (meaning articles) SHALL be updated to point at `/articles/...`.

#### Scenario: Audit before merge

- WHEN the implementation is complete
- THEN a grep for `/posts/` across `src/` returns matches only where `/posts/` legitimately refers to the new Outbox capability
- AND no `/posts/` link in the codebase targets an article slug
