# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `pages/` (routes, e.g., `index.astro`), `components/` (UI, PascalCase), `layouts/`, `lib/` (utilities), and `styles/`.
- Content: `content/` (localized folders like `content/ja`) and config in `src/content/config.ts`.
- Static assets: `public/` (e.g., images, `robots.txt`).
- Tooling: `astro.config.mjs`, `tsconfig.json` (path aliases: `@components/*`, `@layouts/*`, `@lib/*`).
- CI/CD: `.github/workflows/pages.yml` (GitHub Pages deployment). No cloud provider scripts are required.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start Astro dev server.
- `npm run build`: production build to `dist/`.
- `npm run preview`: serve the built site locally.
- `npm run check`: type/content checks via Astro.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types in `src/lib/`.
- Indentation: 2 spaces; max line length ~100 where practical.
- Components: PascalCase files in `src/components/` (e.g., `PostCard.astro`).
- Pages/routes: kebab-case or `index.astro` inside folders in `src/pages/`.
- Imports: use path aliases from `tsconfig.json` (e.g., `import X from '@components/X'`).
- Styles: global rules in `src/styles/global.css`; keep component-specific styles colocated when possible.

## Testing Guidelines
- No formal test framework is configured yet. If adding tests, prefer Vitest for unit tests and Playwright for e2e.
- Suggested pattern: `src/**/__tests__/*.(test|spec).ts` or `*.test.ts` beside the source.
- Aim for meaningful coverage on `src/lib/` utilities and route endpoints (e.g., `feed.xml.ts`).

## Commit & Pull Request Guidelines
- Commit messages: imperative mood; prefer Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Example: `feat: add tag list component`.
- Branches: short, descriptive (`feat/blog-rss`, `fix/build-sitemap`).
- PRs: include purpose, linked issues, and screenshots for UI changes. Note any content or SEO impacts.
- CI: ensure `npm run check` and `npm run build` pass locally. Merges to `main` trigger the GitHub Pages deploy workflow.

## Security & Configuration Tips
- Site URL/base are set via env in CI (`SITE_URL`, `BASE_PATH`) and default locally; update `astro.config.mjs` if you change domains.
- GitHub Pages requires no secrets by default. For custom domains, configure Pages and a `CNAME` in `public/`.
