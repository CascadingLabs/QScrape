<p align="center">
  <a href="https://qscrape.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="media/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="media/logo-light.svg">
      <img src="media/logo-dark.svg" alt="QScrape" width="200">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://discord.gg/5WZNzFZtgb"><img src="https://img.shields.io/badge/Discord-Join-c94040?labelColor=1a0808&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-c94040?labelColor=1a0808" alt="License"></a>
</p>

# QScrape

Web scraper evaluation suite. Fictional test sites across three difficulty levels for benchmarking scraper capabilities.

Made by [Cascading Labs](https://cascadinglabs.com), used for [Yosoi](https://github.com/CascadingLabs/Yosoi).

## Sites

| Level | Route | Site | Status |
|-------|-------|------|--------|
| L1 | `/l1/news/` | Mountainhome Herald — news portal | live |
| L1 | `/l1/scoretap/` | ScoreTap — esports scores | live |
| L1 | `/l1/taxes/` | Eldoria Registry of Deeds — tax records | live |
| L1 | `/l1/eshop/` | VaultMart — e-commerce catalogue | live |
| L2 | `/l2/react/news/` | Mountainhome Herald — React | live |
| L2 | `/l2/react/eshop/` | VaultMart — React | live |
| L2 | `/l2/react/scoretap/` | ScoreTap — React | live |
| L2 | `/l2/react/taxes/` | Eldoria Registry of Deeds — React | live |
| L2 | `/l2/vue/news/` | Mountainhome Herald — Vue | live |
| L2 | `/l2/vue/eshop/` | VaultMart — Vue | live |
| L2 | `/l2/vue/scoretap/` | ScoreTap — Vue | live |
| L2 | `/l2/vue/taxes/` | Eldoria Registry of Deeds — Vue | live |
| L2 | `/l2/svelte/news/` | Mountainhome Herald — Svelte | live |
| L2 | `/l2/svelte/eshop/` | VaultMart — Svelte | live |
| L2 | `/l2/svelte/scoretap/` | ScoreTap — Svelte | live |
| L2 | `/l2/svelte/taxes/` | Eldoria Registry of Deeds — Svelte | live |
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
