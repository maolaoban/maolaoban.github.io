# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site (maolaoban.github.io) built with Astro, deployed to GitHub Pages via GitHub Actions. Based on the bento-portfolio template, heavily customized for Chinese content.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build
```

No lint, test, or formatter tooling is configured.

## Architecture

### Multi-framework setup

Astro is the primary framework. Components use three formats:
- `.astro` — static UI components (most cards, layouts)
- `.tsx` — SolidJS components (Globe map, Tooltip, Rive animations). Use `client:load` or `client:visible` for hydration.
- `.svelte` — Svelte components (playground scroll animations)

JSX is configured for SolidJS (not React) in tsconfig.json.

### Layout chain

`BasicLayout.astro` (HTML root, SEO, fonts, AdSense) → `Layout.astro` (loading animation) → page components. Blog posts use `LayoutBlogPost.astro` instead.

### Bento Grid homepage

`src/pages/index.astro` renders a CSS Grid bento layout (`lg:grid-rows-8 lg:grid-cols-4`). Each card uses the `Card` component with `colSpan`/`rowSpan` props.

### Blog system

Uses Astro Content Collections. Markdown files live in `src/data/blog/`. Schema defined in `src/content.config.ts` using `rssSchema`. Dynamic route at `src/pages/blog/[id].astro`.

To add a new blog post: create a `.md` file in `src/data/blog/` with frontmatter: `title`, `description`, `pubDate`.

Helper script `src/data/draftBlog/moveToBlog.cjs` moves draft posts to blog and auto-adds frontmatter.

### Styling

UnoCSS (atomic CSS, Tailwind-like). Theme config in `uno.config.ts` with custom colors (`darkslate`, `primary`) and fonts (`CabinetGrotesk`, `Satoshi`).

### Animations

- Page load: Motion library (`timeline` + `stagger` + `spring`) for card entrance
- Globe: D3.js rendering China GeoJSON map
- Playground: GSAP + ScrollTrigger + Lenis for scroll animations
- Rive: `.riv` interactive animations

### Key config files

- `astro.config.mjs` — Astro integrations (sitemap, robots-txt, solid-js, UnoCSS, astro-icon, svelte)
- `uno.config.ts` — UnoCSS theme and presets
- `tsconfig.json` — TypeScript strict mode, SolidJS JSX
- `.github/workflows/deploy.yml` — CI/CD: push to main triggers build + deploy to GitHub Pages

### Constants and helpers

- `src/lib/constants.ts` — social links, animation config
- `src/lib/helpers.ts` — date/time formatting utilities
- `src/lib/remark-reading-time.mjs` — custom Remark plugin for blog reading time
