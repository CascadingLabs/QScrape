# Contributing to QScrape

Thanks for your interest in contributing to QScrape! This guide covers how to get set up and what we expect from pull requests.

## Objectives

QScrape is a web scraper evaluation suite that hosts a fictional e-shop across plain HTML, modern framework, and anti-bot experiences to benchmark scraper capabilities. Contributions that add new test scenarios, improve existing sites, fix bugs, or improve scraper-facing documentation are welcome.

## Clone & Setup

```bash
git clone https://github.com/CascadingLabs/QScrape.git
cd QScrape
vp install
```

**Prerequisites:**

| Tool    | Version             | Install                          |
| ------- | ------------------- | -------------------------------- |
| Node.js | >= 24.11 (24.x LTS) | [nodejs.org](https://nodejs.org) |
| Bun     | >= 1.4.3            | [bun.sh](https://bun.sh)         |

> **Why Node.js?** Astro's build toolchain requires Node.js internally even when Bun is the package manager and script runner. The system Node must meet Astro's minimum version requirement.

### Install pre-commit hooks

```bash
uvx prek install
```

[Prek](https://github.com/thesuperzapper/prek) is a Rust-based pre-commit runner that executes git hooks automatically on every `git commit`, catching issues before they reach CI. It reads the same `.pre-commit-config.yaml` format. In this repo the hooks run Vite+ (Oxfmt format checks + Oxlint), check for secrets via gitleaks, and enforce conventional commit messages via commitizen. To run all hooks manually:

```bash
uvx prek run --all-files
```

### Run the dev server

```bash
vp run dev
```

### Build

```bash
vp run build
```

## Linting & Formatting

We use [Vite+](https://viteplus.dev) with Oxfmt for formatting and Oxlint for linting. Shared configuration lives in `vite.config.ts`. Astro builds through Vite+ core, which uses Rolldown and Oxc; keep the `vite-plus` dependency and `vite` alias/override on matching releases.

### Commands

```bash
vp run lint      # Oxlint; fail on warnings
vp run format    # Oxfmt; write formatting changes
vp run check     # Read-only format and lint checks
vp run build     # Astro production build
```

Checks run sequentially with one thread per formatter/linter. Formatting uses tabs, an 80-character print width, single quotes, and semicolons. Use only Oxfmt and Oxlint from Vite+; do not add supplemental formatters. Oxfmt currently does not format Astro templates; Oxlint checks framework script blocks rather than template markup. The Astro build remains required to validate the templates.

Core HTML product content must be present in the HTML response. Verify expected IDs, values, links, and assets against the shared catalogue and generated output.

CI runs the format check, lint check, and production build on every push to `main` and on all PRs.

## Issues

We use [GitHub issue forms](https://github.com/CascadingLabs/QScrape/issues/new/choose) for all issues. Pick the template that fits:

- **Bug Report** -something is broken or behaving unexpectedly.
- **Feature Request** -suggest a new feature or improvement.
- **Question** -ask a question about usage or internals.
- **Ticket** -internal planning ticket for tracked work.

Blank issues are disabled -please use a template so we have the context we need to help.

## Pull Request Rules

1. **Branch from `main`** -create a feature branch (`feat/...`, `fix/...`, `docs/...`).
2. **Keep PRs focused** -one logical change per PR.
3. **Pass CI** -format, lint, and build checks must succeed.
4. **Use the PR template** -every PR auto-fills a template. Fill in all sections:
   - **Intent** -what the PR does and why.
   - **Changes** -a summary of what was changed.
   - **GenAI usage** -check the box and describe how AI was used, if applicable. All AI-generated code must be reviewed line-by-line.
   - **Risks** -any risks or side effects this PR might introduce.
5. **Link an issue** -reference the issue your PR addresses with `Closes #<number>`.
6. **Shared catalogue** -all versions use the same product data. Verify HTML extraction without JavaScript, browser navigation and cart behavior.

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(l2): add pagination to Vue eshop catalog
fix(eshop): correct Solid canvas product label
docs: update e-shop extraction contracts
```

## License

Contributions are licensed under Apache-2.0, matching the project.
