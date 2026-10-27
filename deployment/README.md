# QScrape News GitOps release

This document describes the production release path for the news network. The checked-in target registry is [`cloudflare-pages.json`](cloudflare-pages.json). It defines seven static sites: the newsstand hub plus six publication hosts.

## Topology

The existing `qscrape.dev` Pages project remains on its current native Git integration. The news network does not replace or modify that project or its branch protection.

The seven news sites use Cloudflare Pages Direct Upload from GitHub Actions. Cloudflare documents a maximum of five Pages projects connected to one repository through Git integration, so seven additional native Git connections are not available for this network. See Cloudflare's [Pages monorepo limits](https://developers.cloudflare.com/pages/configuration/monorepos/).

The configured targets are:

| Key    | Project        | Host               | Build root    | Output       |
| ------ | -------------- | ------------------ | ------------- | ------------ |
| `news` | `qscrape-news` | `news.qscrape.dev` | `news-index/` | `dist/news/` |
| `qsn`  | `qscrape-qsn`  | `qsn.qscrape.dev`  | `qsn/`        | `dist/qsn/`  |
| `hsn`  | `qscrape-hsn`  | `hsn.qscrape.dev`  | `qsn/`        | `dist/hsn/`  |
| `esn`  | `qscrape-esn`  | `esn.qscrape.dev`  | `qsn/`        | `dist/esn/`  |
| `gsn`  | `qscrape-gsn`  | `gsn.qscrape.dev`  | `qsn/`        | `dist/gsn/`  |
| `ksn`  | `qscrape-ksn`  | `ksn.qscrape.dev`  | `qsn/`        | `dist/ksn/`  |
| `vsn`  | `qscrape-vsn`  | `vsn.qscrape.dev`  | `qsn/`        | `dist/vsn/`  |

Each publication build selects its dataset with `QSN_PUBLICATION`. The shared registry in `qsn/src/data/publications.ts` supplies production origins and article counts. `deployment/cloudflare-pages.json` also records each custom domain. The GitOps reconciler points each proxied CNAME to its Pages project subdomain. Static outputs do not contain the eShop Pages Functions.

## Automatic main-branch release

The existing `.github/workflows/lint.yaml` workflow handles checks and production delivery. A push to `main` follows this sequence:

1. The `check` job runs repository checks, GitOps target validation and guardrail tests, the QSN and hub typechecks, six fixture verifications, a seven-site static build, the output audit, and both local network smoke modes.
2. The job creates `news-network-preview.tar.gz` from the generated `qsn/dist/` tree. The same build writes `network-preview.json` with the source `GITHUB_SHA`.
3. The `deploy-news` job runs only for a `main` push after `check` succeeds. It uses the protected `news-production` environment, `contents: read` permission, and serialized production concurrency.
4. The job downloads the artifact created in that workflow run, extracts it, and invokes `news:deploy` with that extracted root. The deploy script rejects a non-main run, an absent protected token, a source SHA that differs from `GITHUB_SHA`, missing site manifests, wrong origins, Pages Functions, or projects configured for Git integration.
5. The deploy script uploads the seven targets sequentially with the lockfile's Wrangler `4.153.0`. It polls the Cloudflare Pages API until each canonical deployment is a successful production deployment for the exact source SHA, with Functions disabled. Per-project receipts are written to `.astro/cloudflare-deployment-receipts.json`.
6. The workflow runs `news:verify-hosted` against the seven configured production origins and uploads `.astro/hosted-news-report.json` with the deployment receipts as `news-production-evidence`.

The same-run artifact and `sourceSha` check prevent an older build artifact from being deployed by a newer main run. The workflow uses the artifact it just verified. There is no manual upload procedure.

The workflow defines a main-only `news-production` environment. Its `CLOUDFLARE_API_TOKEN` secret is an account-scoped Pages Write token used only by the deployment step. Secret values are not written into the repository or printed in logs. The workflow does not change repository branch protection. A main push runs the existing checks and release job; it does not invoke the local Cloudflare setup CLI.

## Owner-managed bootstrap and drift checks

Cloudflare resources and the GitHub deployment credential are managed separately from ordinary release runs. The owner controls all Cloudflare and GitHub environment mutations.

- `vp run cloudflare:validate` validates the checked-in target registry without making Cloudflare calls.
- `vp run cloudflare:check` uses the authenticated `cf` CLI to read the configured zone, Pages project modes, custom domains, and CNAME records, then writes `.astro/cloudflare-gitops-report.json`. It does not mutate Cloudflare.
- `vp run cloudflare:apply` creates or aligns the seven Direct Upload projects, attaches their custom domains, and creates missing proxied CNAME records. It does not overwrite a conflicting DNS record.
- `vp run cloudflare:bootstrap-secret` is the one-time GitHub environment and token bootstrap. It uses `cf` and `gh` to create or confirm the main-only `news-production` environment and stores a narrowly scoped Pages Write token as the environment secret. The token value is never logged or written to disk. Environment setup does not change repository branch protection.

Do not run `cloudflare:apply` or `cloudflare:bootstrap-secret` as part of an ordinary build or release. No Cloudflare mutations are performed by this documentation. The existing QScrape Pages native Git integration is outside the seven-target GitOps registry and remains unchanged.

## Status and evidence boundaries

The checked-in workflow and scripts define the automated release contract. They do not by themselves prove that the production environment, token, Pages projects, custom domains, DNS, or current hosted deployments are ready. Do not claim the hosts are live or that hosted CI passed until the owner verifies current production evidence.

Local fixture verification, generated-output audits, local preview smoke tests, deployment receipts, and hosted HTTP checks answer different questions. They are reported separately. Browser QA and crawler performance benchmarks are not inferred from a deployment or a hosted HTTP verification run.

Use `CF-Pages-Skip` only on review-branch commits when a native root preview is unwanted. Production merge and main commit messages must omit that prefix so the existing root site also deploys.

## Zone routing prerequisites

`zoneRouting` in `cloudflare-pages.json` records two existing zone-wide overrides that must exempt the news hosts:

- The `Subdomain to Root (Qs)` redirect keeps its original action and target, but excludes exactly the seven news hostnames. Other subdomains retain their existing canonical redirect.
- The wildcard `*.qscrape.dev/robots.txt` Worker, `robots-disallow`, remains unchanged. Seven more-specific routes matching `{news-host}/robots.txt` have no Worker script, allowing each Pages origin to serve its own robots policy and sitemap.

These routing prerequisites are operator-managed Cloudflare configuration, separate from routine artifact deployment. The release credential deliberately has no zone-rule or Worker-route permissions. The local target validator checks the declared exception scope; the hosted verifier checks the resulting HTTP behavior on every release. `cloudflare:apply` manages Pages projects, custom domains and DNS, not these legacy routing rules.

The redirect is managed through Cloudflare's zone ruleset rule API. The pass-through routes use `POST /zones/{zone_id}/workers/routes` with `{ "pattern": "{news-host}/robots.txt", "script": null }`. Use an authorized operator context when restoring these prerequisites. Do not disable the wildcard Worker or redirect globally.
