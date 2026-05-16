---
name: verification-plan
description: Use when deciding how to validate a QScrape change across build, lint, and scraper-visible behavior.
---
# QScrape Verification Plan
Consider:
- `bun run check`
- `bun run build`
- manual browser review for changed routes
- level-specific behavior checks, especially hydration/async/anti-bot expectations
- cross-framework parity when a shared behavior changes

Report behavior to prove, exact commands, manual checks, and remaining gaps.
