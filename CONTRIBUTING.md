# Contributing to QScrape

Thanks for your interest in contributing to QScrape! This guide covers how to get set up and what we expect from pull requests.

## Objectives

QScrape is a web scraper evaluation suite that hosts fictional test sites across three difficulty levels (L1, L2, L3) to benchmark scraper capabilities. Contributions that add new test scenarios, improve existing sites, fix bugs, or improve scraper-facing documentation are welcome.

## Clone & Setup

```bash
git clone https://github.com/CascadingLabs/QScrape.git
cd QScrape
bun install
```

**Prerequisites:**

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 24 (LTS) | [nodejs.org](https://nodejs.org) |
| Bun | >= 1.3.11 | [bun.sh](https://bun.sh) |

> **Why Node.js?** Astro's build toolchain requires Node.js internally even when Bun is the package manager and script runner. The system Node must meet Astro's minimum version requirement.

### Install pre-commit hooks

```bash
uvx prek install
```

[Prek](https://github.com/thesuperzapper/prek) is a Rust-based pre-commit runner that executes git hooks automatically on every `git commit`, catching issues before they reach CI. It reads the same `.pre-commit-config.yaml` format. In this repo the hooks run Biome (lint + format), check for secrets via gitleaks, and enforce conventional commit messages via commitizen. To run all hooks manually:

```bash
uvx prek run --all-files
```

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_L3_GUARD` | (unset = enabled) | Set to `false` to disable L3Guard anti-bot defenses (DevTools detection, honeypot buttons, right-click blocking) at build time. Useful during local development so you can use browser DevTools on L3 pages without triggering the 404 takeover. |

To disable L3Guard locally, create a `.env` file in the project root:

```
PUBLIC_L3_GUARD=false
```

This is a build-time Astro public env var — changes require restarting the dev server.

### Run the dev server

```bash
bun run dev
```

### Build

```bash
bun run build
```

## Linting & Formatting

We use [Biome](https://biomejs.dev) for linting and formatting. The config lives in `biome.json`.

**Key rules:**

- Tab indentation, 80-char line width
- Single quotes, trailing commas, semicolons
- No unused imports (error), no unused variables (warn)
- Sorted Tailwind classes enforced via `useSortedClasses`
- Some rules relaxed for `.astro` files and L2 components (see `biome.json` overrides)

### Commands

```bash
# Lint
bun run lint

# Format
bun run format

# Lint + format (auto-fix)
bun run check
```

CI runs `biome check` on every push to `main` and on all PRs. Your PR must pass this check.

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
3. **Pass CI** -Biome check must succeed.
4. **Use the PR template** -every PR auto-fills a template. Fill in all sections:
   - **Intent** -what the PR does and why.
   - **Changes** -a summary of what was changed.
   - **GenAI usage** -check the box and describe how AI was used, if applicable. All AI-generated code must be reviewed line-by-line.
   - **Risks** -any risks or side effects this PR might introduce.
5. **Link an issue** -reference the issue your PR addresses with `Closes #<number>`.
6. **Cross-framework consistency** -if you modify an L2 or L3 site, ensure changes apply uniformly across all framework variants (React, Vue, Svelte, and Solid for L3). All implementations should share the same data layer in `src/data/`.

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(l2): add pagination to Vue eshop catalog
fix(l3): correct Solid canvas aria-label for ScoreTap
docs: update L1 news AGENTS.md with new routes
```

## License

Contributions are licensed under Apache-2.0, matching the project.
