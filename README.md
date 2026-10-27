<p align="center"><a href="https://qscrape.dev"><img src="media/logo-light.svg" alt="QScrape" width="200"></a></p>

# QScrape

A scraper playground by [Cascading Labs](https://cascadinglabs.com). QScrape hosts the Objects eShop and a six-publication fictional news network with its own newsstand hub.

**Objects** is an eShop of everyday essentials. There are no real purchases, accounts, or payments. QScrape News is a serious fictional network about a shared world, backed by mock content and API data rather than live editorial services.

The shared registry declares 100,000 synthetic article records: 10,000 dwarven QSN articles and 18,000 articles for each of five sister papers. The network has 70 individually authored stories and reusable templates for the rest. It has 49 generated author portraits, 22 editorial source images, and about 5,025 illustrated article records. Portraits and navigation artwork are not included in that illustration count. See the QSN README and art direction for details.

> [!WARNING]
> QScrape is research tooling for API design and web reverse engineering. Respect the policies of any site you test. Read [DISCLAIMER.md](DISCLAIMER.md).

## Explore

| Page                                       | Route                  | What to expect                                                   |
| ------------------------------------------ | ---------------------- | ---------------------------------------------------------------- |
| Playground                                 | `/`                    | QScrape index linking to its eShop and QSN                       |
| [Newsstand hub](https://news.qscrape.dev/) | `news.qscrape.dev/`    | Six-publication index with a machine-readable network manifest   |
| eShop versions                             | `/eshop/`              | Choose HTML, JavaScript, or Turnstile JavaScript                 |
| HTML eShop                                 | `/eshop/html/`         | Astro generates product content as static HTML at build time     |
| JavaScript eShop                           | `/eshop/javascript/`   | One client-only React island; JavaScript required for extraction |
| Turnstile eShop                            | `/eshop/turnstile/`    | React shop with server-verified Turnstile access                 |
| Catalogue fixtures                         | `/eshop/fixtures.json` | Expected IDs, prices in cents, stock, and product fields         |

Every version has product pages and a local sample cart. HTML catalogue extraction and navigation work with JavaScript disabled; cart interactions require JavaScript. Cart state stays in your browser and is separate for each version.

The main QScrape index links to the newsstand hub at `https://news.qscrape.dev/`. The hub links to six publication origins and their `/benchmark-manifest.json` files. The shared publication app is in `qsn/`; the hub is in `news-index/`. Their configured origins are:

| Publication          | Origin                     |
| -------------------- | -------------------------- |
| QScrape News         | `https://qsn.qscrape.dev/` |
| The Common Chronicle | `https://hsn.qscrape.dev/` |
| The Verdant Dispatch | `https://esn.qscrape.dev/` |
| The Cinder Ledger    | `https://gsn.qscrape.dev/` |
| The Burrow Bulletin  | `https://ksn.qscrape.dev/` |
| The Nocturne Review  | `https://vsn.qscrape.dev/` |

These are configured production origins, not confirmation that DNS or hosting is live. A successful build does not prove benchmark coverage or deployed behavior.

Each version links to its implementation module on GitHub. Build metadata (`PUBLIC_SOURCE_REVISION`, `CF_PAGES_COMMIT_SHA`, or `GITHUB_SHA`) pins that link to a commit; otherwise it uses `main`. Module READMEs describe behavior and link to the implementation.

## Styling

The homepage and version picker use `PlaygroundLayout` and the original QScrape stylesheet, with a compact layout based on CascadingLabsFE. The shop versions use `ShopLayout` and their own `shop.css` theme, typography, navigation, and page width. Shop pages do not load the QScrape index stylesheet or its header/footer.

## Development

Use Bun 1.4.3 and Node.js 24.11 or newer in the 24.x line.

```bash
vp install --frozen-lockfile
vp run dev
vp run check
vp run build
vp run preview
vp run news:dev
QSN_PUBLICATION=humans vp run news:dev
QSN_PUBLICATION=qsn vp run publication:build
vp run news:index:build
vp run news:check
vp run news:verify
vp run news:build
vp run news:audit-output
vp run news:preview
```

Run news commands from the repository root. `news:dev` starts the shared publication app, defaulting to dwarves. Set `QSN_PUBLICATION` to an ID or key to select another paper. `publication:build` builds only the selected paper, and `news:index:build` builds only the newsstand hub. `news:check` typechecks the shared app and hub. `news:verify` verifies all six fixtures. `news:build` builds six publications and the hub sequentially with one worker, writing `qsn/dist/{key}/` and `qsn/dist/news/`. `news:audit-output` audits all six outputs, host links, and per-site file budgets. Run `news:build` before the output audit or preview.

`news:preview` runs the portable Node server at `http://localhost:4329/` for the hub and `http://qsn.localhost:4329/`, `http://hsn.localhost:4329/`, `http://esn.localhost:4329/`, `http://gsn.localhost:4329/`, `http://ksn.localhost:4329/`, and `http://vsn.localhost:4329/` for the six publication sites. It uses the generated `network-preview.json` routing map. This is a local HTTP preview, not a hosted preview.

Astro 7 builds with Vite+ core, Rolldown, and Oxc. The only client framework is React. Update `vite-plus` and the `vite` alias/override together. Formatting and lint configuration live in `vite.config.ts`.

The JavaScript shop fetches `/api/eshop/products/` from the shared fixture-backed REST API. Cloudflare Pages Functions serve the API in deployment; `vp run dev` provides the same handlers locally. Static `vp run preview` does not run Pages Functions.

For Turnstile development, copy `.env.example` to the ignored `.env` and configure `TURNSTILE_SECRET`. Production Pages bindings need that secret and `TURNSTILE_HOSTNAMES=qscrape.dev`; use `localhost,127.0.0.1` only for local development. The public site key is included in the Turnstile module. See its [README](src/modules/turnstile-eshop/README.md) for the verification contract.

```bash
vp run format       # Oxfmt, one thread
vp run lint         # Oxlint with React and accessibility rules; warnings fail
vp run check:types  # Astro and TypeScript diagnostics
vp run check        # Read-only formatting, lint, and type checks, sequentially
```

Oxfmt is the only formatter and Oxlint is the code linter, both provided by Vite+. Oxfmt currently skips Astro templates; keep those consistent manually. Oxlint checks their scripts, and `astro check` validates templates and TypeScript. CI runs these checks before the production build.

The repository CI runs root checks, checks both news apps, verifies six fixtures, builds the network, and audits generated output. The audit checks per-publication article reachability, API identifiers, the hub graph, and site file budgets. These checks are not crawler performance measurements, browser QA, or deployed-host verification. On pull requests, CI uploads `news-network-preview.tar.gz` with the generated static network and portable preview server. This is a downloadable artifact, not a hosted preview. Do not claim a hosted result until the owner records it.

The copy linter rejects literal and encoded em dashes in authored repository text. `vp run lint` and `vp run check` include this linter, and CI runs it. Keep new source and documentation copy free of em dashes. For authorized follow-up pushes, start the commit message with the required `CF-Pages-Skip` prefix.

## Hosting boundary

Each publication origin and the newsstand hub are intended for separate Cloudflare Pages hosting. `vp run news:build` creates seven static site folders under `qsn/dist/`. The Pages projects, domain bindings, DNS changes, and deployments have not been authorized or performed. Do not report a configured origin as live without owner verification.

## Content and contracts

The canonical dataset is `src/data/eshop/catalog.ts`. Prices are integer USD cents. Product IDs, content, and inventory are identical across versions. One item is out of stock so extraction and cart availability can be checked independently.

| Product ID | Name               | Price  | Stock |
| ---------- | ------------------ | ------ | ----- |
| obj-001    | Arc desk lamp      | $68.00 | 12    |
| obj-002    | Loop ceramic mug   | $24.00 | 8     |
| obj-003    | Grid notebook      | $18.00 | 24    |
| obj-004    | Daybreak tote      | $32.00 | 5     |
| obj-005    | Pebble catchall    | $28.00 | 0     |
| obj-006    | Still glass bottle | $36.00 | 9     |

## Restart and migration

The old VaultMart implementation and numbered-level routes have been retired. Their product IDs and special URL encodings do not map to this new collection. External examples that relied on the retired shop must choose a new route and update their expected product IDs and values. No legacy compatibility layer is included.

## Contact and license

[contact@cascadinglabs.com](mailto:contact@cascadinglabs.com) · [GitHub](https://github.com/CascadingLabs/QScrape) · [Apache-2.0](LICENSE)
