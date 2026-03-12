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
/l1/scoretap/           — Main hub (live scores, results, news feed, rankings, events)
/l1/scoretap/news       — News index (breaking + all articles, game filter tabs)
/l1/scoretap/teams      — Teams directory (featured cards + full table with stats)
/l1/scoretap/events     — Events listing (live, upcoming, completed events with game filter)
/l1/scoretap/match      — Match detail page (query param: ?id=<match-id>)
/l1/scoretap/article    — Article page (query param: ?id=<article-slug>)
/l1/scoretap/event      — Event detail page (query param: ?id=<event-slug>)
/l1/scoretap/team       — Team detail page (query param: ?id=<team-slug>)
/l1/scoretap/player     — Player detail page (query param: ?id=<player-slug>)
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
- **Related News:** Each match links to real articles on `/l1/scoretap/article?id=<slug>`. News item `href` attributes are now populated (not `#`).
- **Team Links:** Team name and logo elements in the match header link to `/l1/scoretap/teams`.

### 4. CS2 World Rankings Extraction

- **Data Location:** Sidebar widget `.widget` containing `.rank-row` elements.
- **Fields per row:** Rank (`#1`–`#10`), team name, points, rank delta (`▲`/`▼`/`—`).
- **Top teams:** Vitality (#1, 1842 pts), NAVI (#2, 1710 pts), G2 (#3, 1655 pts), FaZe (#4), MOUZ (#5).

### 5. News Feed Extraction

- **Data Location (index):** `.news-card` elements inside `.news-grid` on `/l1/scoretap/`. 8 cards, each linking to `/l1/scoretap/article?id=<slug>`.
- **Data Location (news page):** `/l1/scoretap/news` has a "Breaking News" section (3 featured cards) and an "All News" grid (22 cards across all 5 games).
- **Fields per card:** Headline (`.news-headline` or `.news-headline-featured`), game tag (`.game-tag`), timestamp (`.news-meta span`), link href.

### 6. Article Extraction (`/l1/scoretap/article?id=<slug>`)

- **Mechanism:** Same shell-injection pattern as match pages. JS reads `?id=` param, looks up `ARTICLES[id]`, and renders into `#article-content`.
- **Expected Agent Behavior:** Navigate with a valid slug, wait for JS, then extract from populated DOM.
- **Content structure (rendered):** `<div class="article-card">` containing `.article-header` (title, game tag, byline) and `.article-body` (h2 sections, p, blockquote.pull-quote, div.stats-box).
- **Related Articles:** Rendered as `.related-grid` with `.related-card` elements, each containing a `.related-headline` anchor linking to another article.
- **Sidebar:** `#sidebar-news-list` contains up to 10 `.sidebar-news-list li` items linking to other articles.
- **Valid Article Slugs (25 total):**
  - CS2: `zywoo-katowice-record`, `navi-blamef-signing`, `cs2-major-copenhagen`, `g2-niko-interview`, `mouz-heroic-semifinal`, `vitality-faze-results`, `blast-premier-schedule`, `cs2-patch-notes`
  - Valorant: `sentinels-group-stage`, `paper-rex-flippzjder`, `vct-pacific-standings`, `nrg-americas-playoffs`, `loud-vct-preview`, `valorant-episode-9`
  - LoL: `faker-contract-2028`, `geng-ruler-contract`, `lec-g2-standings`, `lck-spring-preview`, `msi-2026-location`
  - Dota 2: `spirit-dreamleague`, `og-rebuild-roster`, `ti12-format-changes`
  - Rocket League: `rlcs-prize-pool`, `bds-karmine-win`, `liquid-rl-roster`

### 7. Event Detail Extraction (`/l1/scoretap/event?id=<event-slug>`)

- **Mechanism:** Same shell-injection pattern as match and article pages. JS reads `?id=` param, looks up `EVENTS[id]`, and renders into `#event-content`.
- **Expected Agent Behavior:** Navigate with a valid slug, wait for JS, then extract from populated DOM.
- **Content structure (rendered):** Event header card (game tag, status badge, name, dates/location/prize), format & structure table, notable matches table, participating teams table, prize distribution table, related news list.
- **Valid Event Slugs (12):**
  - CS2: `iem-katowice-2026`, `blast-premier-spring-2026`, `cs2-major-2026`, `iem-dallas-2026`
  - Valorant: `vct-americas-2026`, `vct-pacific-2026`
  - LoL: `lck-spring-2026`, `lec-spring-2026`, `msi-2026`
  - Dota 2: `esl-one-stockholm-2026`, `dreamleague-season-25`
  - Rocket League: `rlcs-spring-2026`
- **Match Links:** Only `match-001` (NAVI vs G2 at IEM Katowice) links to a match detail page. Other match rows are non-clickable.
- **News Links:** Each event's related news items link to real articles on `/l1/scoretap/article?id=<slug>`.
- **Events Listing Navigation:** Event cards on `/l1/scoretap/events` have `data-event-id` attributes and click handlers that navigate to `/l1/scoretap/event?id=<slug>`.

### 8. Teams Page (`/l1/scoretap/teams`)

- **Featured Teams:** `.featured-teams-grid` with 3 `.featured-team-card` `<a>` elements (Vitality/CS2, Sentinels/Valorant, T1/LoL). Each links to `/l1/scoretap/team?id=<slug>` and shows team abbr, name, game tag, region, win/loss record.
- **All Teams Table:** `.teams-table` with 15 rows covering all 5 games. Columns: Rank, Team, Game, Region, W, L, Win%. Each row has `data-team-id` and JS click handler linking to team detail.
- **Game Filter:** Same `[data-game]` tab system — filtering hides featured cards and table rows.
- **CS2 Rankings Sidebar:** Rank rows #1 (Vitality), #2 (NAVI), #3 (G2), #5 (MOUZ) link to team detail pages. Others (FaZe, Heroic, Virtus.pro, Cloud9, Team Liquid, Spirit) remain unlinked.
- **Events Sidebar:** All 5 event rows link to `/l1/scoretap/event?id=<slug>`.

### 9. Team Detail Extraction (`/l1/scoretap/team?id=<team-slug>`)

- **Mechanism:** Same shell-injection pattern as match, article, and event pages. JS reads `?id=` param, looks up `TEAMS[id]`, and renders into `#team-content`.
- **Expected Agent Behavior:** Navigate with a valid slug, wait for JS, then extract from populated DOM.
- **Content structure (rendered):** Team header card (logo, name, game tag, region, rank, record), roster table, recent results table (with event links), prize winnings total, related news list.
- **Valid Team Slugs (15):**
  - CS2: `vitality`, `navi`, `g2`, `mouz`
  - Valorant: `sentinels`, `paper-rex`, `nrg`
  - LoL: `t1`, `gen-g`, `g2-lol`
  - Dota 2: `spirit`, `og`
  - Rocket League: `bds`, `liquid`, `cloud9`
- **Cross-Page Links:** Featured team cards, table rows, rank rows (#1–3, #5), and match detail team names all link to team detail pages.
- **Player Links:** Roster table player names link to `/l1/scoretap/player?id=<slug>` for all players with detail pages.

### 10. Player Detail Extraction (`/l1/scoretap/player?id=<player-slug>`)

- **Mechanism:** Same shell-injection pattern. JS reads `?id=` param, looks up `PLAYERS[id]`, and renders into `#player-content`.
- **Expected Agent Behavior:** Navigate with a valid slug, wait for JS, then extract from populated DOM.
- **Content structure (rendered):** Player header card (name, real name, team, game tag, role, nationality, age), stat grid (4 stat boxes), career history table, achievements table, related news list.
- **Valid Player Slugs (69):**
  - CS2 / Vitality: `zywoo`, `apex`, `magisk`, `flamez`, `spinx`
  - CS2 / NAVI: `s1mple`, `electronic`, `b1t`, `perfecto`, `blamef`
  - CS2 / G2: `niko`, `hooxi`, `hunter`, `m0nesy`, `nexa`
  - CS2 / MOUZ: `torzsi`, `jimpphat`, `xertion`, `siuhy`, `brollan`
  - Valorant / Sentinels: `tenz`, `zekken`, `bang`, `johnqt`, `sacy`
  - Valorant / Paper Rex: `f0rsaken`, `something`, `d4v41`, `mindfreak`, `cgrs`
  - Valorant / NRG: `s0m`, `crashies`, `victor`, `fns`, `ardis`
  - LoL / T1: `faker`, `zeus`, `oner`, `gumayusi`, `keria`
  - LoL / Gen.G: `chovy`, `peyz`, `lehends`, `canyon`, `ruler`
  - LoL / G2 (LoL): `caps`, `yike`, `broken-blade`, `hans-sama`, `mikyx`
  - Dota 2 / Team Spirit: `yatoro`, `larl`, `collapse`, `mira`, `miposhka`
  - Dota 2 / OG: `bzm`, `taiga`, `ceb`, `n0tail`, `topson`
  - Rocket League / Team BDS: `extra`, `monkey-moon`, `seikoo`
  - Rocket League / Team Liquid: `fairy-peak`, `jstn`, `squishy`
  - Rocket League / Cloud9: `torment`, `gimmick`, `rizzo`
- **Cross-Page Links:** Player names in match detail player stats, team detail rosters, and event detail pages link to player detail pages where a slug mapping exists.

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

### Event Detail (injected into #event-content)
```
.event-header-card      — event header with game tag, status badge, name, info row
.event-name-display     — large event name
.event-info-row         — dates, location, prize pool, organizer
.event-progress-bar     — progress bar showing event completion
table (1st)             — Format & Structure: Stage | Format | Teams | Status
table (2nd)             — Notable Matches: Team 1 | Score | Team 2 | Stage | Status
table (3rd)             — Participating Teams: Seed | Team | Region | Status
table (4th)             — Prize Distribution: Place | Prize | Team
.news-list li a         — related news headlines
```

### Team Detail (injected into #team-content)
```
.team-header-card       — team header with logo, name, game tag, region, rank, record
.team-header-name       — large team name
.team-record-bar        — wins, losses, win percentage
table (1st)             — Roster: Player | Role | Nationality
table (2nd)             — Recent Results: Event | Placement | Prize
.prize-total            — total prize winnings display
.news-list li a         — related news headlines
```

### Player Detail (injected into #player-content)
```
.player-header-card     — player header with name, team, game tag, role info
.player-name-display    — large player name
.player-real-name       — real name display
.player-info-row        — team, game, role, nationality, age
.stat-grid              — 4 stat boxes (game-specific stats)
table (1st)             — Career History: Year | Team | Role | Notable
table (2nd)             — Achievements: Year | Event | Placement | Team
.news-list li a         — related news headlines
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
