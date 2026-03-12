# QScrape — Project Documentation

## Overview
QScrape is a web scraper evaluation suite. It hosts fictional test sites across three difficulty levels to benchmark scraper capabilities. Built with [Astro](https://astro.build/). Made by [Cascading Labs](https://cascadinglabs.com), used for [Yosoi](https://github.com/CascadingLabs/Yosoi).

## Levels

| Level | Status | Description |
|-------|--------|-------------|
| L1 | Live | Standard HTML/CSS/JS. Static Astro build. No frameworks, no anti-bot measures. |
| L2 | Planned | Modern web frameworks (Lit, Svelte, React, Vue). |
| L3 | Planned | Anti-bot sites. No recaptchas or unsolvable challenge puzzles. |

## Index Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Root index: project overview, levels list, all sites, resources |
| `/l1/` | `src/pages/l1/index.astro` | L1 index: level explanation, list of L1 sites with descriptions |

### Shared CSS
Both index pages use `public/qscrape.css` — the dark-theme stylesheet for QScrape meta/navigation pages. This is separate from `public/global.css`, which is the legacy ASP.NET stylesheet used by L1 site pages.

## L1 Sites

| Route | Site Name | AGENTS.md |
|-------|-----------|-----------|
| `/l1/news/` | Mountainhome Herald (news portal) | `src/pages/l1/news/AGENTS.md` |
| `/l1/scoretap/` | ScoreTap (esports scores) | `src/pages/l1/scoretap/AGENTS.md` |
| `/l1/taxes/` | Eldoria Registry of Deeds (tax records) | `src/pages/l1/taxes/AGENTS.md` |

See each site's `AGENTS.md` for full page structure, data schemas, URL encoding schemes, and CSS architecture.

## CSS Architecture

| File | Used By |
|------|---------|
| `public/qscrape.css` | Root and level index pages (`/`, `/l1/`) |
| `public/global.css` | L1 site pages (taxes, news) — legacy ASP.NET Web Forms style |

## Project Structure

```
src/pages/
  index.astro              — Root index (QScrape home)
  l1/
    index.astro            — L1 level index
    news/                  — Mountainhome Herald
    scoretap/              — ScoreTap
    taxes/                 — Eldoria Registry of Deeds
public/
  qscrape.css              — Shared dark theme for index pages
  global.css               — Legacy ASP.NET style for L1 site pages
  *.pdf                    — Tax record PDFs (15 deed/mortgage/lien files)
  how-to/                  — How-to guide PDFs (8 files, one per index type)
src/
  middleware.ts            — Alias/resolver middleware for URL routes
```
