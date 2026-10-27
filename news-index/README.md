# QScrape News Network

The newsstand hub is a standalone Astro site at the configured origin `https://news.qscrape.dev/`. It introduces six fictional newspapers that cover the same invented world from distinct cultural and editorial perspectives. The index links to the production origin and fixture manifest for each publication.

The shared registry in `qsn/src/data/publications.ts` is authoritative. It declares 100,000 synthetic article records: 10,000 for dwarven QSN and 18,000 for each of the five sister papers. These are fixture records for discovery research, not live reporting. Most article text comes from reusable templates; 70 selected stories are individually authored.

| Publication          | Species  | Key   | Configured origin          | Records |
| -------------------- | -------- | ----- | -------------------------- | ------: |
| QScrape News         | Dwarves  | `qsn` | `https://qsn.qscrape.dev/` |  10,000 |
| The Common Chronicle | Humans   | `hsn` | `https://hsn.qscrape.dev/` |  18,000 |
| The Verdant Dispatch | Elves    | `esn` | `https://esn.qscrape.dev/` |  18,000 |
| The Cinder Ledger    | Goblins  | `gsn` | `https://gsn.qscrape.dev/` |  18,000 |
| The Burrow Bulletin  | Kobolds  | `ksn` | `https://ksn.qscrape.dev/` |  18,000 |
| The Nocturne Review  | Vampires | `vsn` | `https://vsn.qscrape.dev/` |  18,000 |

The configured origins do not confirm that a site is deployed or reachable. Deployment, domain bindings, and DNS are separate work.

## Network map

`/network-manifest.json` is generated from the shared registry at build time. It records the hub origin, publication names and origins, per-site article counts, six hub links, hub return links, and directed sister-publication edges. It contains no per-article records. Each publication card links to that site's `/benchmark-manifest.json`.

The index is a stable crawler starting point. Its publication links cross six host boundaries, and each card exposes the other editions as related destinations. This is intended for controlled host-discovery and relationship-following experiments. A generated link graph is not a crawl result.

## Images and presentation

The six cards use responsive Astro `Image` components with descriptive alt text. Their optimized sources are imported from `qsn/src/assets/editorial/`; they are not duplicated in this app's public folder. The network's shared art direction and per-publication logo and city-image details are documented in `qsn/ART-DIRECTION.md`.

The hub uses a neutral newsstand design with cobalt and charcoal accents. Each paper keeps a separate palette and masthead. The cards use only the publication registry for names, species, taglines, descriptions, host origins, and article counts.

## Build and preview

The hub shares the repository's root dependencies and lockfile. It does not have its own package manifest.

```bash
vp run news:index:build
vp run news:build
vp run news:preview
```

`news:index:build` builds only this site into `qsn/dist/news/` with one prerender worker. `news:build` builds all six publication sites sequentially, then this hub, and writes the portable preview routing map and server into `qsn/dist/`. `news:preview` serves that output over HTTP at `http://localhost:4329/` for the hub and `http://{key}.localhost:4329/` for each publication. It is a local preview, not a hosted site.

The Astro sitemap integration generates a sitemap index for the hub. The hub's `robots.txt` points to that sitemap. Publication origins have their own sitemaps and robots responses.

## Validation and delivery boundary

`news:check` runs Astro diagnostics for this site and the shared publication app. `news:verify` checks the six fixture contracts and global IDs. `news:audit-output` audits the built publications and hub, file budgets, links and network graph. `news:smoke` requests all seven hosts through the portable preview server. These checks do not measure crawler performance, prove browser layout, or confirm that a production host is live.

CI uploads `news-network-preview.tar.gz` with the static network and portable preview server. This is a downloadable artifact, not a hosted preview. Build file counts and output sizes are recorded after the final output audit; source counts alone are not a build metric.

The existing `qscrape.dev` Pages project remains on its native Git integration. The seven news sites use separate Direct Upload Pages projects because Cloudflare limits a repository to five Git-connected Pages projects. See [deployment/README.md](../deployment/README.md) for the release topology.

On a push to protected `main`, the GitHub Actions deploy job runs after the check job. It downloads the artifact from that same run, verifies `network-preview.json` against the source commit, and uploads the seven sites sequentially with Wrangler 4.153.0. The workflow checks Cloudflare's canonical production deployment for the exact commit SHA, then runs hosted HTTP verification. The configured workflow is not proof that domains are ready or that CI has passed. The owner records current production status from deployment receipts and the hosted report.

The owner manages Cloudflare project and DNS mutations. The `cloudflare:apply` and `cloudflare:bootstrap-secret` commands are setup operations, not ordinary build steps. The deployment workflow uses the protected `news-production` environment and account-scoped `CLOUDFLARE_API_TOKEN`; secret values are not logged or stored in the repository. There is no manual upload procedure.

For a separate localhost port per paper, use `vp run news:preview --ports`. The hub stays on 4329 and publication ports run from 4330 through 4335 in registry order. The portable server rewrites the hub and sister links to those ports. Both this mode and the subdomain mode are covered by `news:smoke`.
