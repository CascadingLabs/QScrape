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
| Bun | >= 1.3.11 | [bun.sh](https://bun.sh) |

### Install pre-commit hooks

```bash
uvx prek install
```

[Prek](https://github.com/thesuperzapper/prek) is a Rust-based pre-commit runner that executes git hooks automatically on every `git commit`, catching issues before they reach CI. It reads the same `.pre-commit-config.yaml` format. In this repo the hooks run Biome (lint + format), check for secrets via gitleaks, and enforce conventional commit messages via commitizen. To run all hooks manually:

```bash
uvx prek run --all-files
```

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

## Pull Request Rules

1. **Branch from `main`** — create a feature branch (`feat/...`, `fix/...`, `docs/...`).
2. **Keep PRs focused** — one logical change per PR.
3. **Pass CI** — Biome check must succeed.
4. **Describe your changes** — every PR should include:
   - **Intent** — what the PR does and why.
   - **Changes** — a summary of what was changed.
   - **GenAI usage** — if you used AI to write any of the code, include the prompts you used.
   - **Risks** — any risks or side effects this PR might introduce.
5. **Cross-framework consistency** — if you modify an L2 or L3 site, ensure changes apply uniformly across all framework variants (React, Vue, Svelte, and Solid for L3). All implementations should share the same data layer in `src/data/`.

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(l2): add pagination to Vue eshop catalog
fix(l3): correct Solid canvas aria-label for ScoreTap
docs: update L1 news AGENTS.md with new routes
```

## License

Contributions are licensed under Apache-2.0, matching the project.
