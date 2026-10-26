# QSN (QScrape News)

QSN is the dwarven publication in a six-paper fictional news network. It is a serious, mock-backed newspaper about civic life, work, trade, culture, and the deep roads. Its invented articles are not real reporting, and no live editorial or account service is implied.

## The six-publication network

The authoritative registry is `src/data/publications.ts`. It defines six publications with separate host origins and a combined 100,000-record synthetic corpus.

| Publication          | Species  | Key   | Configured origin          | Records |
| -------------------- | -------- | ----- | -------------------------- | ------: |
| QScrape News         | Dwarves  | `qsn` | `https://qsn.qscrape.dev/` |  10,000 |
| The Common Chronicle | Humans   | `hsn` | `https://hsn.qscrape.dev/` |  18,000 |
| The Verdant Dispatch | Elves    | `esn` | `https://esn.qscrape.dev/` |  18,000 |
| The Cinder Ledger    | Goblins  | `gsn` | `https://gsn.qscrape.dev/` |  18,000 |
| The Burrow Bulletin  | Kobolds  | `ksn` | `https://ksn.qscrape.dev/` |  18,000 |
| The Nocturne Review  | Vampires | `vsn` | `https://vsn.qscrape.dev/` |  18,000 |

The newsstand hub is configured at `https://news.qscrape.dev/` and lives in `news-index/`. Its network manifest links to each publication and summarizes origins, counts, hub links, and sister edges without copying the article inventory. Configured origins do not confirm that DNS or hosting is live.

## Editorial scope and artwork

The network contains 70 individually authored stories. The other records use reusable story facts and format-specific templates. Repetition in the generated articles remains an editorial limit. The total is a count of fixture records, not a count of separately reported stories.

The shared illustration target is about 5,025 article records across the 100,000-record network. This excludes author portraits and navigation images. Twenty-two source illustrations live in `src/assets/editorial/`: seven dwarven scenes, five city scenes, and ten context-specific sister-paper scenes. Matching originals in `public/images/qsn/` are public API aliases and must remain byte-identical to their source files.

There are 49 generated author portraits in `src/assets/authors/`. Portraits are imported through Astro's image pipeline and emitted as optimized WebP variants. They are not duplicated in `public/` and are not counted as article illustrations. See [ART-DIRECTION.md](ART-DIRECTION.md) for publication palettes, logos, prompt style, and image variations.

Final generated file counts and output sizes are pending the owner's network output audit. Do not substitute source counts or figures from an earlier single-publication build.

## Shared app and publication selection

The app reads `QSN_PUBLICATION` during configuration. It accepts a publication ID or key, and defaults to `dwarves`. For example, `QSN_PUBLICATION=humans` selects the human paper and `QSN_PUBLICATION=qsn` selects the dwarven paper by key. The Astro config uses the selected publication origin and writes to `qsn/dist/{key}/`.

Every publication uses the same routes and mock-backed data contracts, but generates its own static records. The publication build writes to `qsn/dist/{key}/`. The hub is a separate Astro build written to `qsn/dist/news/`.

## Local workflow

Run commands from the repository root. Dependencies and the Bun lockfile are shared.

```bash
vp install --frozen-lockfile
vp run news:dev
QSN_PUBLICATION=humans vp run news:dev
QSN_PUBLICATION=qsn vp run publication:build
vp run news:index:build
vp run news:check
vp run news:verify
vp run news:build
vp run news:audit-output
vp run news:smoke
vp run news:preview
```

`news:dev` starts the shared publication app locally, defaulting to QSN. Set `QSN_PUBLICATION` to an ID or key to select a sister edition. `publication:build` builds only the selected publication. `news:index:build` builds only the hub. `news:build` runs all six publication builds and the hub sequentially with one worker each, then writes `network-preview.json` and the portable preview server.

`news:check` runs Astro diagnostics for both app roots. `news:verify` validates all six fixture contracts and global ID uniqueness. `news:audit-output` audits publication and hub outputs, file/asset budgets, navigation, feeds and the host graph. `news:smoke` runs the packaged Node preview on a separate loopback port and requests all seven hosts, article/feed/image URLs, missing paths and unsupported methods. These checks do not measure crawler performance or browser layout.

`news:preview` serves the built network over HTTP at `http://localhost:4329/` for the hub and `http://qsn.localhost:4329/`, `http://hsn.localhost:4329/`, `http://esn.localhost:4329/`, `http://gsn.localhost:4329/`, `http://ksn.localhost:4329/`, and `http://vsn.localhost:4329/` for the publications. Run `news:build` before preview.

## Static mock APIs

The APIs are generated from the selected publication dataset. They do not call a live editorial service.

- `/api/latest.json` returns a compact latest-story list.
- `/api/archive.json` returns search and archive fields for that publication.
- `/api/articles/{page}.json` returns paginated full article records.
- `/api/markets.json` supplies the market widget from the same snapshot as its initial HTML.
- `/benchmark-manifest.json` lists the selected publication's article IDs, HTML URLs, API page numbers, author and series references, illustration paths, and related-story URLs.

The hub's `/network-manifest.json` describes the six-host network. It does not duplicate the article inventory.

## Validation, preview artifact, and delivery

CI checks the main QScrape app, checks both news apps, verifies all six fixture contracts, builds all seven static sites, and audits generated output. A successful build or audit is not a crawler benchmark, browser QA, or proof that a production host is live.

On pull requests, CI uploads a `news-network-preview` artifact containing `news-network-preview.tar.gz`. Extract both archive layers, then run `node preview.mjs` from the extracted directory. It contains all seven static sites and a dependency-free Node server. This is a downloadable artifact, not a hosted deployment.

The local integration audit found 106,718 linked publication HTML pages, including all 100,000 article pages. Generated file counts were QSN 11,078; HSN 19,543; ESN 19,542; GSN 19,546; KSN 19,542; VSN 19,544; newsstand 43. All were below the planned 20,000-file per-site limit and 25 MiB asset limit. The raw seven-site output occupies approximately 4.0 GiB locally. Builds run serially on one CPU; these are local measurements, not hosting or crawl-performance evidence.

The production image audit checks optimized WebP/SVG URLs, dimensions, loading attributes and alternative-text markup. Astro's component marker exists only in development, so it is not used as a production assertion. Browser-toolbar interactions and viewport layout remain separate from these checks.

The custom copy linter rejects literal and encoded em dashes in authored repository text. `vp run lint` and `vp run check` include the linter, and CI runs it. Keep new authored copy free of em dashes.

QSN and the sister publications are intended for separate Cloudflare Pages projects. No project, domain binding, DNS change, or deployment is authorized by this documentation. For authorized follow-up pushes, start the commit message with the required `CF-Pages-Skip` prefix.

### One localhost port per paper

For browser testing without subdomain resolution, run:

```bash
vp run news:preview --ports --port 4329
```

The newsstand uses `localhost:4329`, followed by QSN at 4330, HSN at 4331, ESN at 4332, GSN at 4333, KSN at 4334 and VSN at 4335. Sister links are rewritten to the matching port. The original `*.localhost:4329` routing also remains available through the main listener. Add `--host 0.0.0.0` only when network access is wanted; the default is loopback. Both modes use one Node process, and `news:smoke` tests both modes.

Privacy cookies have publication-specific names because cookies share a hostname across ports. Local storage is already separated by origin, including the port. Production hostnames keep their independent storage as well.
