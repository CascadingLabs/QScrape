# QScrape — Project Documentation

## Overview
QScrape is a web scraper evaluation suite. It hosts fictional test sites across three difficulty levels to benchmark scraper capabilities. Built with [Astro](https://astro.build/). Made by [Cascading Labs](https://cascadinglabs.com), used for [Yosoi](https://github.com/CascadingLabs/Yosoi).

## Levels

| Level | Status | Description |
|-------|--------|-------------|
| L1 | Live | Standard HTML/CSS/JS. Static Astro build. No frameworks, no anti-bot measures. |
| L2 | Live | Modern web frameworks (React, Vue, Svelte). All content client-side only (`client:only`). Scrapers must execute JS. |
| L3 | Planned | Anti-bot sites. No recaptchas or unsolvable challenge puzzles. |

## Index Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Root index: project overview, levels list, all sites, resources |
| `/l1/` | `src/pages/l1/index.astro` | L1 index: level explanation, list of L1 sites with descriptions |
| `/l2/` | `src/pages/l2/index.astro` | L2 index: full 12-site matrix table (React × Vue × Svelte × 4 sites) |
| `/l2/react/` | `src/pages/l2/react/index.astro` | React framework index: lists all 4 React L2 sites |
| `/l2/vue/` | `src/pages/l2/vue/index.astro` | Vue framework index: lists all 4 Vue L2 sites |
| `/l2/svelte/` | `src/pages/l2/svelte/index.astro` | Svelte framework index: lists all 4 Svelte L2 sites |

### Shared CSS
Both index pages use `public/qscrape.css` — the dark-theme stylesheet for QScrape meta/navigation pages. This is separate from `public/global.css`, which is the legacy ASP.NET stylesheet used by L1 site pages.

## L1 Sites

| Route | Site Name | AGENTS.md |
|-------|-----------|-----------|
| `/l1/news/` | Mountainhome Herald (news portal) | `src/pages/l1/news/AGENTS.md` |
| `/l1/scoretap/` | ScoreTap (esports scores) | `src/pages/l1/scoretap/AGENTS.md` |
| `/l1/taxes/` | Eldoria Registry of Deeds (tax records) | `src/pages/l1/taxes/AGENTS.md` |
| `/l1/eshop/` | VaultMart (e-commerce catalogue) | `src/pages/l1/eshop/AGENTS.md` |

See each site's `AGENTS.md` for full page structure, data schemas, URL encoding schemes, and CSS architecture.

## L2 Sites

All L2 sites are SPAs mounted with `client:only`. HTML source is empty — scrapers must execute JavaScript.

### L2 runtime behaviour (important for scraper authors)

**Async loading gate** — every L2 component calls `fakeGet(null)` on mount, which resolves after a simulated 300–550 ms network delay. Until it resolves the component renders a plain "Loading…" div. Scrapers must wait for the real content to appear before extracting data. The fake API is at `src/data/api.ts`.

**Client-side URL routing** — navigation inside each SPA uses `history.pushState` rather than full page loads. Each sub-URL maps to a different SPA "page":

| Site | Sub-URLs |
|------|----------|
| news | `articles?cat=…`, `article?id=…`, `about`, `staff`, `contact` |
| eshop | `catalog?cat=…`, `product?sku=…`, `cart`, `search?q=…` |
| scoretap | `events`, `teams` |
| taxes | `search`, `viewer?file=…`, `how-to`, `recording-fees` |

The Astro shells at each sub-URL also mount the same SPA component (`client:only`), so deep-linking a specific URL loads the correct page directly. `popstate` listeners keep the back/forward buttons functional.

**Game filter (scoretap)** — a single `activeGame` state controls filtering across all pages (Home, Events, Teams). The header tabs and per-page filter tabs all update the same state, matching the behaviour across all three frameworks.

### Shared data layer

| File | Used by |
|------|---------|
| `src/data/news/articles.ts` | All 3 news implementations + L1 |
| `src/data/eshop/products.ts` | All 3 eshop implementations + L1 |
| `src/data/scoretap/data.ts` | All 3 scoretap implementations |
| `src/data/taxes/deeds.ts` | All 3 taxes implementations |

### CSS design tokens

| File | Site |
|------|------|
| `src/styles/l2/news.css` | Mountainhome Herald (all frameworks) |
| `src/styles/l2/eshop.css` | VaultMart (all frameworks) |
| `src/styles/l2/scoretap.css` | ScoreTap (all frameworks) |
| `src/styles/l2/taxes.css` | Eldoria Registry (all frameworks) |

### Component locations

| Framework | News | Eshop | ScoreTap | Taxes |
|-----------|------|-------|----------|-------|
| React | `src/components/l2/react/news/NewsApp.tsx` | `…/eshop/EshopApp.tsx` | `…/scoretap/ScoretapApp.tsx` | `…/taxes/TaxesApp.tsx` |
| Vue | `src/components/l2/vue/news/NewsApp.vue` | `…/eshop/EshopApp.vue` | `…/scoretap/ScoretapApp.vue` | `…/taxes/TaxesApp.vue` |
| Svelte | `src/components/l2/svelte/news/NewsApp.svelte` | `…/eshop/EshopApp.svelte` | `…/scoretap/ScoretapApp.svelte` | `…/taxes/TaxesApp.svelte` |

## CSS Architecture

| File | Used By |
|------|---------|
| `public/qscrape.css` | Root and level index pages (`/`, `/l1/`, `/l2/`) |
| `public/global.css` | L1 site pages (taxes, news) — legacy ASP.NET Web Forms style |
| `src/styles/l2/*.css` | L2 components — design tokens per site, shared across all 3 frameworks |

## Project Structure

```
src/pages/
  index.astro              — Root index (QScrape home)
  l1/
    index.astro            — L1 level index
    news/                  — Mountainhome Herald
    scoretap/              — ScoreTap
    taxes/                 — Eldoria Registry of Deeds
    eshop/                 — VaultMart
  l2/
    index.astro            — L2 level index
    react/news/            — Mountainhome Herald (React) — 6 shells
    react/eshop/           — VaultMart (React) — 5 shells
    react/scoretap/        — ScoreTap (React) — 3 shells
    react/taxes/           — Eldoria Registry (React) — 5 shells
    vue/news/              — Mountainhome Herald (Vue) — 6 shells
    vue/eshop/             — VaultMart (Vue) — 5 shells
    vue/scoretap/          — ScoreTap (Vue) — 3 shells
    vue/taxes/             — Eldoria Registry (Vue) — 5 shells
    svelte/news/           — Mountainhome Herald (Svelte) — 6 shells
    svelte/eshop/          — VaultMart (Svelte) — 5 shells
    svelte/scoretap/       — ScoreTap (Svelte) — 3 shells
    svelte/taxes/          — Eldoria Registry (Svelte) — 5 shells
src/components/l2/
  react/{news,eshop,scoretap,taxes}/   — React SPAs
  vue/{news,eshop,scoretap,taxes}/     — Vue SPAs
  svelte/{news,eshop,scoretap,taxes}/  — Svelte SPAs
src/data/
  news/articles.ts         — Shared news data (L1 re-exports from here)
  eshop/products.ts        — Shared eshop data (L1 re-exports from here)
  scoretap/data.ts         — Shared scoretap data
  taxes/deeds.ts           — Shared taxes data
src/styles/l2/
  news.css / eshop.css / scoretap.css / taxes.css  — Design tokens
public/
  qscrape.css              — Shared dark theme for index pages
  global.css               — Legacy ASP.NET style for L1 site pages
  *.pdf                    — Tax record PDFs (15 deed/mortgage/lien files)
  how-to/                  — How-to guide PDFs (8 files, one per index type)
src/
  middleware.ts            — Alias/resolver middleware for URL routes
```
