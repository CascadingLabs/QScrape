# QScrape

Web scraper evaluation suite. Fictional test sites across three difficulty levels for benchmarking scraper capabilities.

Made by [Cascading Labs](https://cascadinglabs.com), used for [Yosoi](https://github.com/CascadingLabs/Yosoi).

## Sites

| Level | Route | Site | Status |
|-------|-------|------|--------|
| L1 | `/l1/news/` | Mountainhome Herald — news portal | live |
| L1 | `/l1/scoretap/` | ScoreTap — esports scores | live |
| L1 | `/l1/taxes/` | Eldoria Registry of Deeds — tax records | live |
| L2 | `/l2/` | Modern web frameworks (Lit, Svelte, React, Vue) | planned |
| L3 | `/l3/` | Anti-bot sites | planned |

## Dev

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build
pnpm preview
```

## Lint

```bash
pnpm check     # biome check + autofix
pnpm lint      # biome lint only
pnpm format    # biome format
```
