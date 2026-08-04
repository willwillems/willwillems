# willwillems.com

Personal blog & portfolio at **[willwillems.com](https://willwillems.com)**.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), TypeScript, and MDX. Blog content lives in `src/content/blog/` as Markdown via Astro Content Collections.

## Commands

All commands are run from the root of the project:

| Command            | Action                                         |
| :----------------- | :--------------------------------------------- |
| `npm install`      | Install dependencies                           |
| `npm run dev`      | Start the local dev server at `localhost:4321` |
| `npm run build`    | Build the production site to `./dist/`         |
| `npm run preview`  | Preview the production build locally           |
| `npm run check`    | Type-check the project                         |
| `npm run lint`     | Lint with ESLint                               |
| `npm run format`   | Format with Prettier                           |
| `npm run validate` | Run check + lint + format:check                |

Run `npm run validate` before considering work complete.

## Structure

```text
src/
  components/   Astro components (.astro)
  content/      Markdown blog posts (Content Collections)
  layouts/      Page layouts
  pages/        File-based routing
  styles/       Global CSS (Tailwind)
public/         Static assets (fonts, images, favicons)
```

See [`AGENTS.md`](./AGENTS.md) for conventions and contributor guidance.

## Credit

Originally scaffolded from the Astro Blog starter, based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
