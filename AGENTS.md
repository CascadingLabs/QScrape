# QScrape

QScrape is Cascading Labs’ web scraper playground. It provides realistic, self-contained example sites with known data so people and agents can compare extraction and interaction behavior. The current scope is one eShop, Objects, with HTML and JavaScript versions backed by the same catalogue. Protection scenarios and additional site types are future work.

## Style and experience

The QScrape index and version picker are developer-facing navigation pages. Keep them compact and simple, using the existing QScrape typography, colors, theme controls, and the restrained layout of CascadingLabsFE. Use a short description and concrete technical details rather than promotional copy. Each version links to one documented implementation module on GitHub.

The eShop is its own app. It has its own layout, styling, branding, and shopping navigation. It must feel like a normal storefront: no QScrape breadcrumbs, rendering-version badges, synthetic/demo labels, test explanations, or tooling controls in the shopping UI. Keep evaluation details on the index, version picker, module READMEs, and fixtures. Ordinary shop breadcrumbs, availability messages, and helpful interaction errors are appropriate.

## Structure

- `src/pages/index.astro`: QScrape homepage.
- `src/pages/eshop/index.astro`: version picker and technical descriptions.
- `src/pages/eshop/[version]/`: thin Astro route wrappers.
- `src/modules/html-eshop/`: static HTML implementation and README.
- `src/modules/javascript-eshop/`: one React island and README.
- `src/data/eshop/catalog.ts`: shared products, prices, categories, and version definitions.
- `src/lib/eshop/`: shared cart validation and persistence.
- `src/layouts/PlaygroundLayout.astro` and `src/styles/playground.css`: project navigation shell.
- `src/layouts/ShopLayout.astro` and `src/styles/shop.css`: independent storefront shell.

## Making changes and adding things

- Organize by site type and implementation module. Do not reintroduce numbered levels or duplicate hidden framework implementations.
- Keep route files thin. Put implementation behavior and a concise README together in the module; share data and genuinely common helpers.
- Preserve HTML extraction without JavaScript. The JavaScript version uses one client-only React island. Describe actual rendering and navigation behavior accurately.
- Keep shared product IDs and expected values consistent. Prices are integer USD cents. Validate stored cart data and bound quantities by stock; unavailable products cannot be added.
- Keep project and shop styles independent. Do not import the index stylesheet or theme controls into the storefront.
- Reuse existing components and tokens before introducing new patterns. Prefer clear, accessible links, labelled controls, visible status messages, and responsive layouts.
- Link GitHub modules to the build commit when available, with `main` as the local fallback. Do not expose source-path lists or build-publication explanations in the UI.
- Preserve the `cl-theme` light/dark/auto preference and query-param handoff on project navigation pages. Do not add cross-domain storage infrastructure for theme synchronization.
- Add new site types, frameworks, protection mechanisms, dependencies, or infrastructure only when they serve the requested scope. Do not publish unfinished options as available.
- Preserve unrelated local work. Use WTF for isolated JJ workspaces and JJ for revisions and delivery. Push or deploy only within the user’s authorized scope.

## Tooling and verification

Use the Vite+ CLI as the tooling entry point; it delegates package management to the project's pinned Bun version and existing lockfile. The stack is Astro, React, Vite+, Oxfmt/Oxlint, and Astro's type checker. Formatting and linting must use `vp fmt` (Oxfmt) and `vp lint` (Oxlint) exclusively. Do not add or run Prettier, Biome, or another supplemental formatter. If Oxfmt does not support a file type, keep its formatting consistent manually and validate it with the appropriate Astro checks.

```sh
vp install --frozen-lockfile
vp run dev
vp run check
vp run build
```

Use `vp run` for the repository's Astro scripts. Bare `vp dev` and `vp build` invoke Vite's built-in commands; `vp run check` includes the configured Astro type checks as well as formatting and linting.

Use focused checks for small changes. Run one expensive validation command at a time and one worker when supported. Do not repeat passing checks without a relevant change. No Playwright or browser test setup should be introduced. Verify generated HTML, routes, links, fixtures, types, and data logic as appropriate. Report local checks, hosted CI, and deployed behavior separately; do not present a build as proof of browser interactions.
