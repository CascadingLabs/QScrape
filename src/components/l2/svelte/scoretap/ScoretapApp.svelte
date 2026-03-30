<script lang="ts">
// @qscrape L2 / svelte / scoretap — ScoreTap
import { onDestroy, onMount } from 'svelte';
import '../../../../styles/l2/scoretap.css';
import { fakeGet } from '../../../../data/api';
import {
	events,
	type Game,
	gameLabels,
	liveMatches,
	newsItems,
	teams,
} from '../../../../data/scoretap/data';

type Page = 'home' | 'events' | 'teams';

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function urlToPage(): Page {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	if (seg === 'events') {
		return 'events';
	}
	if (seg === 'teams') {
		return 'teams';
	}
	return 'home';
}
function pageToUrl(p: Page): string {
	const base = getBase();
	if (p === 'events') {
		return `${base}events`;
	}
	if (p === 'teams') {
		return `${base}teams`;
	}
	return base;
}

let _ready = false;
let _current: Page = 'home';

const _games = Object.keys(gameLabels) as Game[];
let gameFilter: Game | 'all' = 'all';

// Live score ticker
let liveTicker = liveMatches.map((m) => ({ ...m }));
const ticker = setInterval(() => {
	liveTicker = liveTicker.map((m) => ({
		...m,
		scoreA: m.scoreA + (Math.random() < 0.15 ? 1 : 0),
		scoreB: m.scoreB + (Math.random() < 0.12 ? 1 : 0),
	}));
}, 8000);
onDestroy(() => clearInterval(ticker));

function _nav(p: Page) {
	_current = p;
	history.pushState(null, '', pageToUrl(p));
	window.scrollTo(0, 0);
}

function onPop() {
	_current = urlToPage();
	window.scrollTo(0, 0);
}
onMount(() => {
	_current = urlToPage();
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		_ready = true;
	});
});
onDestroy(() => window.removeEventListener('popstate', onPop));

$: filteredTeams =
	gameFilter === 'all' ? teams : teams.filter((t) => t.game === gameFilter);
$: filteredEvents =
	gameFilter === 'all' ? events : events.filter((e) => e.game === gameFilter);
$: filteredNews =
	gameFilter === 'all'
		? newsItems
		: newsItems.filter((n) => n.game === gameFilter);

function _gcVar(game: Game) {
	return `var(--st-${game})`;
}
</script>

{#if !ready}
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,system-ui;color:#6b7280;background:#0f1117">Loading…</div>
{:else}
<div class="st-shell">
  <!-- Header -->
  <header class="st-header">
    <div class="st-header-inner">
      <button class="st-logo" on:click={() => nav('home')}>⚡ ScoreTap</button>
      <nav class="st-main-nav">
        <button class="st-nav-btn{current === 'home' ? ' active' : ''}" on:click={() => nav('home')}>Home</button>
        <button class="st-nav-btn{current === 'events' ? ' active' : ''}" on:click={() => nav('events')}>Events</button>
        <button class="st-nav-btn{current === 'teams' ? ' active' : ''}" on:click={() => nav('teams')}>Teams</button>
      </nav>
    </div>
    <!-- Game filter tabs -->
    <div class="st-game-tabs">
      <button class="st-game-tab{gameFilter === 'all' ? ' active' : ''}" on:click={() => (gameFilter = 'all')}>All Games</button>
      {#each games as g}
        <button
          class="st-game-tab{gameFilter === g ? ' active' : ''}"
          style="--gc: {gameColors[g]}"
          on:click={() => (gameFilter = g === gameFilter ? 'all' : g)}
        >{gameLabels[g]}</button>
      {/each}
    </div>
  </header>

  <main class="st-main">
    <!-- HOME PAGE -->
    {#if current === 'home'}
      <!-- Live matches -->
      <section class="st-section">
        <h2 class="st-section-title"><span class="st-live-dot"></span> Live Now</h2>
        <div class="st-match-list">
          {#each liveTicker.filter((m) => gameFilter === 'all' || m.game === gameFilter) as m (m.id)}
            <div class="st-match-card st-live" data-id={m.id} data-game={m.game}>
              <div class="st-game-tag" style="color: {gameColors[m.game]}">{gameLabels[m.game]}</div>
              <div class="st-match-body">
                <div class="st-team-row">
                  <span class="st-team-name">{m.teamAFull}</span>
                  <span class="st-score" data-score-a>{m.scoreA}</span>
                </div>
                <div class="st-vs-row">
                  <span class="st-map-label">{m.mapOrGame}</span>
                  <span class="st-status-live">LIVE</span>
                </div>
                <div class="st-team-row">
                  <span class="st-team-name">{m.teamBFull}</span>
                  <span class="st-score" data-score-b>{m.scoreB}</span>
                </div>
              </div>
              <div class="st-event-label">{m.event}</div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Recent Results -->
      <section class="st-section">
        <h2 class="st-section-title">Recent Results</h2>
        <div class="st-results-list">
          {#each recentResults.filter((m) => gameFilter === 'all' || m.game === gameFilter) as m}
            <div class="st-result-row" data-id={m.id} data-game={m.game}>
              <span class="st-game-tag-sm" style="color: {gameColors[m.game]}">{gameLabels[m.game]}</span>
              <span class="st-team-a">{m.teamAFull}</span>
              <span class="st-result-score" data-score>{m.scoreA} – {m.scoreB}</span>
              <span class="st-team-b">{m.teamBFull}</span>
              <span class="st-event-sm">{m.event}</span>
              <span class="st-status-final">FINAL</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Upcoming -->
      <section class="st-section">
        <h2 class="st-section-title">Upcoming Matches</h2>
        <div class="st-results-list">
          {#each upcomingMatches.filter((m) => gameFilter === 'all' || m.game === gameFilter) as m}
            <div class="st-result-row" data-id={m.id} data-game={m.game}>
              <span class="st-game-tag-sm" style="color: {gameColors[m.game]}">{gameLabels[m.game]}</span>
              <span class="st-team-a">{m.teamAFull}</span>
              <span class="st-result-score">vs</span>
              <span class="st-team-b">{m.teamBFull}</span>
              <span class="st-event-sm">{m.event}</span>
              <span class="st-time">{m.time}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- News feed -->
      <section class="st-section">
        <h2 class="st-section-title">Latest News</h2>
        <ul class="st-news-list">
          {#each filteredNews as n}
            <li class="st-news-item" data-id={n.id} data-game={n.game}>
              <span class="st-game-tag-sm" style="color: {gameColors[n.game]}">{gameLabels[n.game]}</span>
              <span class="st-news-headline">{n.headline}</span>
              <span class="st-news-time">{n.hoursAgo}h ago</span>
            </li>
          {/each}
        </ul>
      </section>

      <!-- CS2 Rankings -->
      {#if gameFilter === 'all' || gameFilter === 'cs2'}
        <section class="st-section">
          <h2 class="st-section-title" style="color: var(--st-cs2)">CS2 World Rankings</h2>
          <table class="st-rankings-table">
            <thead>
              <tr><th>#</th><th>Team</th><th>Points</th><th>Change</th></tr>
            </thead>
            <tbody>
              {#each cs2Rankings as r}
                <tr data-rank={r.rank} data-team={r.team}>
                  <td class="st-rank-num">{r.rank}</td>
                  <td class="st-rank-team">{r.team}</td>
                  <td class="st-rank-pts">{r.points.toLocaleString()}</td>
                  <td class="st-rank-change">
                    {#if r.change === 'up'}
                      <span class="st-up">▲ {r.delta}</span>
                    {:else if r.change === 'down'}
                      <span class="st-down">▼ {r.delta}</span>
                    {:else}
                      <span class="st-same">—</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </section>
      {/if}

    <!-- EVENTS PAGE -->
    {:else if current === 'events'}
      <section class="st-section">
        <h2 class="st-section-title">Events</h2>
        <div class="st-events-grid">
          {#each filteredEvents as ev}
            <div class="st-event-card" data-id={ev.id} data-game={ev.game}>
              <div class="st-game-tag" style="color: {gameColors[ev.game]}">{gameLabels[ev.game]}</div>
              <h3 class="st-event-name">{ev.name}</h3>
              <p class="st-event-dates">{ev.dates}</p>
              {#if ev.status === 'live'}
                <span class="st-status-live">LIVE</span>
              {:else if ev.status === 'upcoming'}
                <span class="st-status-upcoming">Upcoming</span>
              {:else}
                <span class="st-status-final">Completed</span>
              {/if}
            </div>
          {/each}
        </div>
      </section>

    <!-- TEAMS PAGE -->
    {:else if current === 'teams'}
      <section class="st-section">
        <h2 class="st-section-title">Teams</h2>
        <div class="st-teams-grid">
          {#each filteredTeams as t}
            <div class="st-team-card" data-id={t.id} data-game={t.game}>
              <div class="st-game-tag" style="color: {gameColors[t.game]}">{gameLabels[t.game]}</div>
              <h3 class="st-team-name-full">{t.name}</h3>
              <p class="st-team-abbr">{t.abbr}</p>
              {#if t.rank}
                <p class="st-team-rank">Rank #{t.rank} · {t.rankPoints?.toLocaleString()} pts</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </main>

  <footer class="st-footer">
    <p>© 2026 ScoreTap · Esports Scores & Coverage · Data updates every 8s</p>
  </footer>
</div>
{/if}

<style>
  .st-shell { min-height: 100vh; display: flex; flex-direction: column; }

  /* Header */
  .st-header { background: var(--st-surface); border-bottom: 1px solid var(--st-border); position: sticky; top: 0; z-index: 100; }
  .st-header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 24px; }
  .st-logo { background: none; border: none; color: var(--st-text); font-family: var(--st-font-score); font-size: 1.3rem; font-weight: 700; cursor: pointer; letter-spacing: -0.01em; }
  .st-main-nav { display: flex; gap: 4px; }
  .st-nav-btn { background: none; border: none; color: var(--st-muted); font-family: var(--st-font-ui); font-size: 13px; padding: 5px 14px; border-radius: var(--st-radius); cursor: pointer; }
  .st-nav-btn:hover, .st-nav-btn.active { background: var(--st-surface2); color: var(--st-text); }
  .st-game-tabs { max-width: 1200px; margin: 0 auto; padding: 6px 24px; display: flex; flex-wrap: wrap; gap: 4px; }
  .st-game-tab { background: none; border: 1px solid var(--st-border); color: var(--st-muted); font-family: var(--st-font-ui); font-size: 12px; padding: 3px 12px; border-radius: 20px; cursor: pointer; }
  .st-game-tab:hover { border-color: var(--gc, var(--st-live)); color: var(--gc, var(--st-live)); }
  .st-game-tab.active { background: var(--gc, var(--st-live)); border-color: var(--gc, var(--st-live)); color: #000; font-weight: 600; }

  /* Main */
  .st-main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 24px; }
  .st-section { margin-bottom: 36px; }
  .st-section-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--st-muted); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  /* Live dot */
  .st-live-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--st-live); box-shadow: 0 0 0 3px var(--st-live-dim); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* Match cards */
  .st-match-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .st-match-card { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); padding: 16px; }
  .st-match-card.st-live { border-left: 3px solid var(--st-live); }
  .st-game-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .st-match-body { display: flex; flex-direction: column; gap: 4px; }
  .st-team-row { display: flex; justify-content: space-between; align-items: center; }
  .st-team-name { font-size: 14px; font-weight: 600; }
  .st-score { font-family: var(--st-font-score); font-size: 1.4rem; font-weight: 700; color: var(--st-text); }
  .st-vs-row { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
  .st-map-label { font-size: 11px; color: var(--st-muted); }
  .st-status-live { font-size: 11px; font-weight: 700; color: var(--st-live); letter-spacing: 0.08em; }
  .st-event-label { font-size: 11px; color: var(--st-muted); margin-top: 12px; }

  /* Results list */
  .st-results-list { display: flex; flex-direction: column; gap: 2px; }
  .st-result-row { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); padding: 10px 16px; display: grid; grid-template-columns: 80px 1fr auto 1fr 1fr auto; align-items: center; gap: 8px; font-size: 13px; }
  .st-game-tag-sm { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
  .st-result-score { font-family: var(--st-font-score); font-weight: 700; text-align: center; color: var(--st-text); }
  .st-team-a { text-align: right; }
  .st-event-sm { font-size: 11px; color: var(--st-muted); }
  .st-status-final { font-size: 10px; font-weight: 600; color: var(--st-muted); letter-spacing: 0.06em; }
  .st-status-upcoming { font-size: 10px; font-weight: 600; color: #60a5fa; letter-spacing: 0.06em; }
  .st-time { font-size: 11px; color: #60a5fa; }

  /* News */
  .st-news-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
  .st-news-item { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
  .st-news-headline { flex: 1; font-size: 13px; }
  .st-news-time { font-size: 11px; color: var(--st-muted); white-space: nowrap; }

  /* Rankings */
  .st-rankings-table { width: 100%; border-collapse: collapse; }
  .st-rankings-table th { text-align: left; font-size: 11px; color: var(--st-muted); letter-spacing: 0.06em; text-transform: uppercase; padding: 8px 12px; border-bottom: 1px solid var(--st-border); }
  .st-rankings-table tr:hover td { background: var(--st-surface2); }
  .st-rankings-table td { padding: 10px 12px; border-bottom: 1px solid var(--st-border); font-size: 13px; }
  .st-rank-num { font-family: var(--st-font-score); font-weight: 700; color: var(--st-muted); width: 40px; }
  .st-rank-team { font-weight: 600; }
  .st-rank-pts { font-family: var(--st-font-score); }
  .st-up { color: var(--st-live); font-size: 12px; }
  .st-down { color: #ef4444; font-size: 12px; }
  .st-same { color: var(--st-muted); font-size: 12px; }

  /* Events */
  .st-events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .st-event-card { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); padding: 16px; }
  .st-event-name { font-size: 1rem; font-weight: 600; margin: 8px 0 4px; }
  .st-event-dates { font-size: 12px; color: var(--st-muted); margin-bottom: 8px; }

  /* Teams */
  .st-teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .st-team-card { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); padding: 14px; }
  .st-team-name-full { font-size: 1rem; font-weight: 600; margin: 8px 0 2px; }
  .st-team-abbr { font-family: var(--st-font-score); font-size: 11px; color: var(--st-muted); margin-bottom: 4px; }
  .st-team-rank { font-size: 12px; color: var(--st-muted); }

  /* Footer */
  .st-footer { background: var(--st-surface); border-top: 1px solid var(--st-border); text-align: center; padding: 16px 24px; font-size: 12px; color: var(--st-muted); }
</style>
