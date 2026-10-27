# QScrape

QScrape is Cascading Labs’ web scraper playground. It provides realistic, self-contained example sites with known data so people and agents can compare extraction and interaction behavior. The original site is the Objects eShop, with HTML, JavaScript, and Turnstile JavaScript versions backed by the same catalogue. The fictional QScrape News network has a six-paper hub under `news-index/` and a shared publication app under `qsn/`.

## Style and experience

The QScrape index and version picker are developer-facing navigation pages. Keep them compact and simple, using the existing QScrape typography, colors, theme controls, and the restrained layout of CascadingLabsFE. Use a short description and concrete technical details rather than promotional copy. Each version links to one documented implementation module on GitHub.

The eShop is its own app. It has its own layout, styling, branding, and shopping navigation. It must feel like a normal storefront: no QScrape breadcrumbs, rendering-version badges, synthetic/demo labels, test explanations, or tooling controls in the shopping UI. Keep evaluation details on the index, version picker, module READMEs, and fixtures. Ordinary shop breadcrumbs, availability messages, and helpful interaction errors are appropriate.

QScrape News is a fictional six-publication network. The hub at `news.qscrape.dev` links to the dwarf, human, elven, goblin, kobold, and vampire publications on their own configured origins. The shared registry lists 100,000 synthetic article records across six publications: 10,000 for QSN and 18,000 for each sister paper. These are benchmark fixtures, not real reporting or live editorial services. Keep host-boundary discovery, fixture validation, browser QA, deployment, and hosting evidence as separate claims.

The dwarven QSN publication is one of the six sites built from the shared `qsn/` Astro app. It uses the `qsn.qscrape.dev` origin; the newsstand hub is at `news.qscrape.dev`. Keep all publication data and mock APIs separate from real reporting and live editorial services.

## Structure

- `src/pages/index.astro`: QScrape homepage.
- `qsn/`: independent Astro root for QSN (QScrape News); keep its config, pages, layouts, styles, components, content, and mock API here.
- `news-index/`: independent Astro root for the news network hub at `https://news.qscrape.dev/`; it reads the shared publication registry and links to each publication origin.
- `qsn/src/data/publications.ts`: authoritative publication IDs, keys, names, origins, and article counts for the hub and shared publication app.
- `src/pages/eshop/index.astro`: version picker and technical descriptions.
- `src/pages/eshop/[version]/`: thin Astro route wrappers.
- `src/modules/html-eshop/`: static HTML implementation and README.
- `src/modules/javascript-eshop/`: one React island and README.
- `src/modules/turnstile-eshop/`: Turnstile access gate around the shared React shop and README.
- `functions/api/eshop/`: Cloudflare Pages REST handlers; local development uses the same handlers through Vite middleware.
- `src/data/eshop/catalog.ts`: shared products, prices, categories, and version definitions.
- `src/lib/eshop/`: shared cart validation and persistence.
- `src/layouts/PlaygroundLayout.astro` and `src/styles/playground.css`: project navigation shell.
- `src/layouts/ShopLayout.astro` and `src/styles/shop.css`: independent storefront shell.

## Making changes and adding things

- Organize by site type and implementation module. Do not reintroduce numbered levels or duplicate hidden framework implementations.
- Keep route files thin. Put implementation behavior and a concise README together in the module; share data and genuinely common helpers.
- Preserve HTML extraction without JavaScript. The JavaScript version uses one client-only React island. Describe actual rendering and navigation behavior accurately.
- Keep Turnstile scoped to its own shop. Validate tokens on the server, including action and hostname, and fail closed when configuration is missing. Keep secrets out of client code and source control.
- Keep shared product IDs and expected values consistent. Prices are integer USD cents. Validate stored cart data and bound quantities by stock; unavailable products cannot be added.
- Keep project and shop styles independent. Do not import the index stylesheet or theme controls into the storefront.
- Reuse existing components and tokens before introducing new patterns. Prefer clear, accessible links, labelled controls, visible status messages, and responsive layouts.
- Link GitHub modules to the build commit when available, with `main` as the local fallback. Do not expose source-path lists or build-publication explanations in the UI.
- Preserve the `cl-theme` light/dark/auto preference and query-param handoff on project navigation pages. Do not add cross-domain storage infrastructure for theme synchronization.
- Keep the QSN link on the main index pointed at `https://news.qscrape.dev/`. QSN has a separate site identity and host; do not fold it into the main site's `/news/` route or synchronize preferences across domains.
- Treat `qsn/src/data/publications.ts` as the source of truth for the six hosts and 100,000-record total. The shared `qsn/` app selects a publication with `QSN_PUBLICATION`, which accepts an ID or key. Build outputs go to `qsn/dist/{key}/`; the hub goes to `qsn/dist/news/`.
- Keep 70 individually authored stories distinct from the reusable templates that generate the rest of the catalogue. The network includes 49 generated author portraits, 12 editorial source images, and approximately 5,025 illustrated article records. Portraits and navigation artwork are not article illustrations. Add final generated-file counts and asset totals after the output audit, not from source counts.
- `qsn/src/assets/editorial/` is the optimized source for article and city imagery. Matching originals under `qsn/public/images/qsn/` are stable public API aliases and must remain byte-identical. Author portraits stay in `qsn/src/assets/authors/` and are optimized by Astro into WebP output.
- Use `news-index/` for the network hub, `network-manifest.json`, robots file, and sitemap. The manifest records publication origins and counts plus hub and sister edges; it does not duplicate article records.
- The network preview uses one portable Node server at `http://localhost:4329/` for the hub and `http://{key}.localhost:4329/` for each publication. Preview output and the downloadable CI archive are local artifacts, not a hosted preview.
- The existing `qscrape.dev` Cloudflare Pages site retains its native Git integration. The seven news sites use separate Direct Upload Pages projects managed by the GitHub Actions workflow because Pages limits a repository to five Git-connected projects. See `deployment/README.md` and `deployment/cloudflare-pages.json`.
- A push to protected `main` automatically deploys the seven news sites only after the `check` job passes. The deploy job runs in the main-only `news-production` environment, downloads the artifact from that same workflow run, verifies the source SHA, and uploads each static root sequentially with locked Wrangler 4.153.0. The account-scoped `CLOUDFLARE_API_TOKEN` secret is never logged or written to the repository.
- `cloudflare:validate` is a local registry check. `cloudflare:check` reads Cloudflare state. `cloudflare:apply` can create or update projects, domains, and DNS records; `cloudflare:bootstrap-secret` can create the protected GitHub environment and deployment secret. These commands are owner-managed operations. Do not run them unless explicitly authorized.
- Do not claim production readiness or hosted success until the owner verifies current deployment receipts and hosted HTTP evidence. Avoid manual upload procedures. Use `CF-Pages-Skip` only on review-branch commits when a native root preview is unwanted. Production merge and main commit messages must omit that prefix so the existing root site also deploys.
- Add new site types, frameworks, protection mechanisms, dependencies, or infrastructure only when they serve the requested scope. Do not publish unfinished options as available.
- Preserve unrelated local work. Use WTF for isolated JJ workspaces and JJ for revisions and delivery. Push or deploy only within the user’s authorized scope.

## Tooling and verification

Use the Vite+ CLI as the tooling entry point; it delegates package management to the project's pinned Bun version and existing lockfile. The stack is Astro, React, Vite+, Oxfmt/Oxlint, and Astro's type checker. Formatting and code linting must use `vp fmt` (Oxfmt) and `vp lint` (Oxlint) exclusively. Do not add or run Prettier, Biome, or another supplemental formatter. If Oxfmt does not support a file type, keep its formatting consistent manually and validate it with the appropriate Astro checks.

```sh
vp install --frozen-lockfile
vp run dev
vp run check
vp run build
vp run news:dev
QSN_PUBLICATION=humans vp run news:dev
QSN_PUBLICATION=qsn vp run publication:build
vp run news:index:build
vp run news:check
vp run news:verify
vp run news:build
vp run news:audit-output
vp run news:preview
vp run news:verify-hosted
vp run cloudflare:validate
vp run cloudflare:check
vp run cloudflare:apply
vp run cloudflare:bootstrap-secret
```

Run these commands from the repository root. `vp run dev`, `vp run check`, and `vp run build` cover the original QScrape app. `news:dev` starts the shared publication app, defaulting to dwarves; set `QSN_PUBLICATION` to an ID or key to select another publication. `publication:build` builds only that selected publication. `news:index:build` builds only the hub. `news:check` typechecks the shared app and hub. `news:verify` verifies all six fixtures. `news:build` builds six publications and the hub sequentially with one worker each, then creates preview routing metadata. `news:audit-output` audits each generated publication, per-site file budgets, hub links and the host graph. Run `news:build` before the output audit or preview. Bare `vp dev` and `vp build` invoke Vite's built-in commands.

`news:preview` serves the generated network over HTTP at `http://localhost:4329/` and routes publication hosts through `http://qsn.localhost:4329/`, `http://hsn.localhost:4329/`, `http://esn.localhost:4329/`, `http://gsn.localhost:4329/`, `http://ksn.localhost:4329/`, and `http://vsn.localhost:4329/`. CI packages `news-network-preview.tar.gz` with the static sites and portable preview server. Pull requests upload it as a review artifact; the main-branch deployment job consumes the artifact from the same run after checks pass. It is not a hosted preview. Do not claim hosted readiness or success until the owner records production evidence.

`news:verify-hosted` is run by the main-only production workflow after all seven uploads. It uses native fetch against configured production origins, writes `.astro/hosted-news-report.json`, and fails the release if assertions fail. Do not run it locally until the owner confirms the production domains are ready. The production workflow saves deployment receipts and the hosted report as `news-production-evidence`.

The CI workflow checks both Astro roots, verifies all six fixtures, builds all seven sites, and audits the generated network. A passing check, fixture verification, or build proves only the contract each command checks; it does not prove browser behavior, a crawler benchmark result, or a deployed host. The custom copy linter rejects literal and encoded em dashes in authored repository text. `vp run lint` and `vp run check` include this linter, and CI runs the same gate. Keep new authored copy free of literal and encoded em dashes.

Use focused checks for small changes. Run one expensive validation command at a time and one worker when supported. Do not repeat passing checks without a relevant change. No Playwright or browser test setup should be introduced. Verify generated HTML, routes, links, fixtures, types, and data logic as appropriate. Report local checks, hosted CI, and deployed behavior separately; do not present a build as proof of browser interactions.
