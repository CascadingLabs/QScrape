---
name: verification-plan
description: Use when deciding how to validate a QScrape change across build, lint, and scraper-visible behavior.
---

# QScrape Verification Plan

Consider:

- `bun run check`
- `bun run build`
- generated HTML, route, asset, and fixture verification
- version-specific behavior checks, especially hydration/async/anti-bot expectations
- consistency across HTML, JavaScript, and Protected versions

Report behavior to prove, exact commands, manual checks, and remaining gaps.
