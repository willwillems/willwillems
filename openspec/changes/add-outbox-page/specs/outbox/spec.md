# outbox Specification

## Purpose

Render the short-form Outbox post listing at `/posts` and the individual Outbox post detail pages at `/posts/[slug]`. The listing surfaces posts via three coordinated controls: category filter tabs, a sort toggle, and a daily activity heatmap. Data is read from `src/data/posts.ts` until an Obsidian-backed loader replaces it.

## Requirements

### Requirement: Outbox listing page exists at /posts

The system SHALL render an Outbox listing page at `/posts` that displays every post from the data source.

#### Scenario: Default listing render

- GIVEN the data source contains one or more posts
- WHEN a user visits `/posts`
- THEN the page renders the Outbox section header, the activity heatmap, and the post list
- AND all posts are visible (no filter applied)
- AND posts are ordered newest-first by `publishedAt`

#### Scenario: Empty data source

- GIVEN the data source contains zero posts
- WHEN a user visits `/posts`
- THEN the page renders the section header
- AND the activity heatmap renders with all cells in the empty state
- AND the post list renders an empty state placeholder ("No posts yet")

### Requirement: Section header displays label, category tabs, and sort control

The Outbox section header SHALL display, on a single horizontal line at wide viewports:

- a section label reading `Outbox` (left),
- a row of category tabs (centre-left), starting with `All`, followed by one tab per unique category found in the data,
- a `Sort` toggle button (right).

#### Scenario: Categories derived from data

- GIVEN the data contains posts with categories `["Reports", "Resources", "Posts"]`
- WHEN the page renders
- THEN the tabs read, in order, `All`, `Reports`, `Resources`, `Posts`
- AND `All` is the active tab on initial render

#### Scenario: Active tab styling

- GIVEN the tabs are rendered
- WHEN no user interaction has occurred
- THEN the `All` tab has the active text colour (`text-text`)
- AND every other tab has the inactive text colour (`text-text-inactive`)

#### Scenario: Filter button is absent

- GIVEN the section header renders
- WHEN inspecting the rendered controls
- THEN no separate "Filter" button is present (tabs are the only filter affordance)

### Requirement: Category tabs filter the post list client-side

Clicking a category tab SHALL filter the visible post rows to only those whose `categories` array contains the selected category. Clicking `All` SHALL show every post. Filtering SHALL happen client-side with no page reload.

#### Scenario: Filter by single category

- GIVEN posts P1 (categories: `["Reports"]`) and P2 (categories: `["Posts"]`) are visible
- WHEN the user clicks the `Reports` tab
- THEN P1 remains visible
- AND P2 is hidden
- AND the URL does not change (or changes only via `history.replaceState` if implemented)
- AND the `Reports` tab takes the active styling, all other tabs take inactive styling

#### Scenario: Post with multiple categories matches any of its categories

- GIVEN a post has categories `["Reports", "Resources"]`
- WHEN the user clicks the `Resources` tab
- THEN the post is visible
- WHEN the user then clicks the `Reports` tab
- THEN the post is still visible

#### Scenario: Reset to all

- GIVEN a category filter is active and at least one row is hidden
- WHEN the user clicks the `All` tab
- THEN every post row is visible
- AND `All` takes the active styling

### Requirement: Sort toggle reverses post order client-side

The `Sort` button SHALL toggle the displayed order of post rows between newest-first (default) and oldest-first. The toggle SHALL happen client-side with no page reload.

#### Scenario: Toggle to oldest-first

- GIVEN the post list is in default newest-first order
- WHEN the user clicks `Sort`
- THEN the post rows reorder to oldest-first
- AND the button indicates the active direction (e.g. icon flips or label updates)

#### Scenario: Toggle back to newest-first

- GIVEN the post list is in oldest-first order
- WHEN the user clicks `Sort`
- THEN the post rows reorder to newest-first

#### Scenario: Sort interacts with filter

- GIVEN a category filter is active
- WHEN the user toggles sort
- THEN only the visible (filtered) rows reorder
- AND hidden rows remain hidden

### Requirement: Activity heatmap shows a 12-month rolling daily grid

The activity heatmap SHALL render a GitHub-contributions-style grid covering the most recent 365 days ending today.

#### Scenario: Grid dimensions

- WHEN the heatmap renders
- THEN it contains exactly one cell per day in the rolling 365-day window
- AND cells are laid out in columns of 7 days (one column per week)
- AND days without posts render in the empty cell colour (matching `--color-border` or similar dim tone)
- AND days with at least one post render in the colour assigned to the dominant category for that day

#### Scenario: Month labels

- WHEN the heatmap renders
- THEN month labels appear along the bottom of the grid
- AND each label aligns with the first column whose first day falls in that month
- AND labels render in the secondary text colour

### Requirement: Activity heatmap colours cells by dominant category

For days with one or more posts, the cell SHALL take the colour assigned to the **dominant** category — defined as the category appearing on the most posts that day. Ties SHALL be broken by category order as derived from the data (the order in which categories first appear in the posts array).

#### Scenario: Single post on a day

- GIVEN a day has one post with categories `["Reports"]`
- WHEN the heatmap renders
- THEN the cell for that day is coloured with the `Reports` category colour

#### Scenario: Multiple posts, single dominant category

- GIVEN a day has two posts with categories `["Reports"]` and `["Reports", "Resources"]`
- WHEN the heatmap renders
- THEN the cell is coloured with the `Reports` colour (Reports appears twice, Resources once)

#### Scenario: Tie-breaking by data order

- GIVEN a day has two posts, one categorised `["Resources"]` and one categorised `["Posts"]`
- AND `Resources` appears before `Posts` in the derived category order
- WHEN the heatmap renders
- THEN the cell is coloured with the `Resources` colour

### Requirement: Category colours are deterministic and visually distinct

Each category SHALL receive a colour drawn from a fixed warm palette that fits the site's dark theme. Assignment SHALL be deterministic: the same category name always yields the same colour across renders.

#### Scenario: Consistent colour across components

- GIVEN the category `Reports` is assigned the third colour in the palette
- WHEN the heatmap renders a Reports-dominant day
- AND the section header renders the `Reports` tab
- THEN both surfaces use (or visually reference) the same Reports colour
- (Note: tabs MAY remain monochrome white/grey per the design; only the heatmap is required to colour by category. Consistency only applies where colour is shown.)

### Requirement: Heatmap is non-interactive in v1

The heatmap SHALL be visual-only in v1. Cells SHALL NOT be clickable, hoverable tooltips are not required.

#### Scenario: No interaction handlers

- WHEN a user clicks any heatmap cell
- THEN no navigation, filtering, or selection occurs

### Requirement: Post list row displays category, date, title, and description

Each post row SHALL display, in two columns:

- **Left column** (~25% width on wide viewports): the post's first category as a label, followed by the formatted `publishedAt` date below it.
- **Right column** (~75% width): the post title (linked) followed by a description below it.

The description SHALL be derived from the first ~160 characters of the post's `content` field, with markdown syntax stripped, and truncated at a word boundary with an ellipsis if the content is longer.

#### Scenario: Standard row

- GIVEN a post with title "Notes on running a solo business", publishedAt 2025-04-05, categories `["Posts"]`, and content starting with "Three years in, running a one-person consultancy. Some things..."
- WHEN the row renders
- THEN the left column shows `Posts` and `Apr 5, 2025`
- AND the right column shows the title (plain text — not a link in v1; linking to a detail page is deferred) and the description starting `Three years in, running a one-person consultancy.…`

#### Scenario: Multiple categories on a post

- GIVEN a post has categories `["Reports", "Resources"]`
- WHEN the row renders
- THEN the left column shows only the first category (`Reports`)

#### Scenario: Date formatting

- GIVEN a post has `publishedAt` of `2025-12-18`
- WHEN the row renders
- THEN the left column displays the date as `Dec 18, 2025` (existing `FormattedDate` component, `en-us` locale)

#### Scenario: Horizontal divider between rows

- WHEN multiple post rows render
- THEN a thin horizontal divider in the border colour separates consecutive rows
- AND no divider appears above the first row or below the last row

### Requirement: Responsive behaviour on narrow viewports

On viewports narrower than the `md` breakpoint:

- The section header SHALL wrap onto multiple lines as needed.
- The activity heatmap SHALL retain its daily resolution and SHALL allow horizontal scrolling within its container.
- Each post row SHALL stack the left (category + date) column above the right (title + description) column.

#### Scenario: Mobile post row

- GIVEN viewport width < md breakpoint
- WHEN a post row renders
- THEN the category and date appear above the title and description, not beside

#### Scenario: Mobile heatmap

- GIVEN viewport width < md breakpoint
- WHEN the heatmap renders
- THEN cells retain their wide-viewport size (no scaling down)
- AND the heatmap container shows a horizontal scrollbar if the grid is wider than the viewport

### Requirement: Outbox section is embeddable

All Outbox listing UI SHALL be encapsulated in a single Astro component (e.g. `OutboxSection.astro`) so that a future change can drop it into the homepage without duplicating logic.

#### Scenario: Composition

- WHEN the `/posts` page renders
- THEN it imports a single `OutboxSection` component and renders it inside the main page chrome
- AND `OutboxSection` requires no props other than (optionally) the posts array
- AND `OutboxSection` makes no assumptions about being the only section on the page (no document-level side effects, no `<html>` / `<body>` markup)
