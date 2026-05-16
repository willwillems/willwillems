# Will Willems blog

Always use the browser to verify changes.

## Project

Personal blog & portfolio at **willwillems.com**, built with:

- **Astro 6** (beta) -- static site generator
- **Tailwind CSS v4** -- utility-first CSS via `@tailwindcss/vite`
- **TypeScript** -- strict mode
- **MDX** -- blog content via Astro Content Collections

## Commands

| Task            | Command                |
| --------------- | ---------------------- |
| Dev server      | `npm run dev`          |
| Build           | `npm run build`        |
| Type check      | `npm run check`        |
| Lint            | `npm run lint`         |
| Lint + fix      | `npm run lint:fix`     |
| Format          | `npm run format`       |
| Format check    | `npm run format:check` |
| Full validation | `npm run validate`     |

Always run `npm run validate` before considering work complete.

## Structure

```
src/
  components/   Astro components (.astro)
  content/      Markdown blog posts (Content Collections)
  layouts/      Page layouts
  pages/        File-based routing
  styles/       Global CSS (Tailwind)
public/         Static assets (fonts, images)
```

## Conventions

- **Indentation**: tabs (not spaces), enforced by EditorConfig + Prettier.
- **Quotes**: single quotes in JS/TS.
- **Formatting**: Prettier handles all formatting. Do not manually adjust whitespace or line breaks for style.
- **Linting**: ESLint with `strictTypeChecked` for TS/JS files. Fix all lint errors, don't suppress with `eslint-disable` unless there is no viable alternative.
- **Components**: Astro components (`.astro`). No client-side framework (React/Vue/Svelte) unless explicitly requested.
- **Styling**: Tailwind utility classes. Avoid custom CSS unless Tailwind cannot express it.
- **Content**: Blog posts are Markdown files in `src/content/blog/` with frontmatter: `title` (required), `description`, `pubDate` (required), `updatedDate`, `duration`, `category`, `heroImage`.
- **Node**: v24 (see `.node-version`). ESM only (`"type": "module"`).
