# ScoreTap — Esports News Aggregate (L1 Eval Environment)

## Overview & Simulated Architecture

This L1 test site provides a realistic simulation of a modern esports news aggregate and live scores portal, similar to HLTV.org or Liquipedia. It is designed to evaluate an AI agent's ability to extract structured data from a dynamic, JavaScript-driven sports data site.

The site covers CS2, Valorant, League of Legends, Dota 2, and Rocket League. All data is fictional but realistic.

**Architectural Constraints for Agents:**
- **Layout:** Modern CSS Grid (`1fr 340px`) with a two-column sidebar layout.
- **Dynamic Content:** Live scores update via `setInterval` every 8 seconds — agents must handle changing DOM values.
- **Game Filter:** Tab-based JS filtering using `data-game` attributes. Filtered-out elements are set to `display: none`, not removed from the DOM.
- **Match Detail:** Data is rendered entirely by client-side JavaScript via `URLSearchParams` — the initial HTML shell has no match content; it is injected into `#match-content` after page load.

## Site Structure

```
/l1/scoretap/           — Main hub (live scores, results, news, rankings, events)
/l1/scoretap/match      — Match detail page (query param: ?id=<match-id>)
```

## Test Flows

### 1. Live Scores Extraction (`/l1/scoretap/`)

- **Action:** Scrape current live match scores.
- **Data Location:** Inside `.match-card.live` elements, score is in `.score-numbers.live-score` (e.g., `id="score-match-001"`).
- **Challenge:** Scores update every 8 seconds via JavaScript. Agents must either wait for stabilization or capture a point-in-time snapshot.
- **Live Matches:** NAVI vs G2 (CS2), Sentinels vs LOUD (Valorant), Team Liquid vs Cloud9 (Rocket League).

### 2. Game Filter Navigation

- **Action:** Filter match cards and news by game (CS2, Valorant, LoL, Dota 2, Rocket League).
- **Mechanism:** Clicking `.game-tab[data-filter="cs2"]` sets non-matching `[data-game]` elements to `display: none`.
- **Expected Agent Behavior:** Click a tab, then extract only visible elements — or read `data-game` attribute directly to filter without clicking.

### 3. Match Detail Extraction (`/l1/scoretap/match?id=match-001`)

- **Action:** Extract match header (teams, event, score), map breakdown table, player statistics table, and related news links.
- **Mechanism:** Page starts as an empty shell. All content is injected into `#match-content` by inline JS that reads `?id=` from `URLSearchParams` and looks up a hardcoded data object.
- **Expected Agent Behavior:** Navigate to URL with valid `?id=` param, wait for JS execution, then extract from populated DOM.
- **Valid Match IDs:** `match-001` (NAVI vs G2, CS2), `match-002` (Sentinels vs LOUD, Valorant), `match-003` (Team Liquid vs Cloud9, Rocket League).

### 4. CS2 World Rankings Extraction

- **Data Location:** Sidebar widget `.widget` containing `.rank-row` elements.
- **Fields per row:** Rank (`#1`–`#10`), team name, points, rank delta (`▲`/`▼`/`—`).
- **Top teams:** Vitality (#1, 1842 pts), NAVI (#2, 1710 pts), G2 (#3, 1655 pts), FaZe (#4), MOUZ (#5).

### 5. News Feed Extraction

- **Data Location:** `.news-card` elements inside `.news-grid`.
- **Fields per card:** Headline (`.news-headline`), game tag (`.game-tag`), timestamp (`.news-meta span`).
- **Count:** 8 news items total across all games.

## Data Schema

### Match Card
```
[data-game]         — game identifier: cs2 | valorant | lol | dota2 | rl
.team-name          — short team name
.score-numbers      — "X : Y" format score
.match-event        — event name
.event-badge        — status: LIVE | UPCOMING | FINAL
```

### Match Detail (injected into #match-content)
```
.main-score         — primary score display
.team-full-name     — full team name (both teams)
#detail-score       — score element in detail view
table (1st)         — Map Breakdown: Map | Team1 Score | Team2 Score | Status
table (2nd)         — Player Stats: Player | Team | K | D | A | HS% | Rating
.news-list li a     — related news headlines
```

### Rankings Row
```
.rank-num           — "#N" rank position
.rank-team          — team name
.rank-points        — "N,NNN pts"
.rank-change.up     — "▲N" (green)
.rank-change.down   — "▼N" (red)
.rank-change.same   — "—" (gray)
```
