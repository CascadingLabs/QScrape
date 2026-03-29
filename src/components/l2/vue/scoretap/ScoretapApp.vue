<!-- @qscrape L2 / vue / scoretap -->
<!-- @component ScoretapApp -->
<template>
  <div v-if="!ready" style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,system-ui;color:#6b7280;background:#0f1117">Loading…</div>
  <div v-else class="st-shell">
    <header class="st-header">
      <div class="st-header-inner">
        <button class="st-logo" @click="navigate('home')">ScoreTap</button>
        <nav class="st-header-nav">
          <button v-for="p in navPages" :key="p.id"
            :class="['st-nav-btn', { 'st-nav-btn--active': page === p.id }]"
            @click="navigate(p.id)">{{ p.label }}</button>
        </nav>
      </div>
    </header>

    <div class="st-game-filter" id="game-filter">
      <button v-for="g in gameFilters" :key="g.id"
        :class="['st-game-tab', { 'st-game-tab--active': activeGame === g.id }]"
        :data-filter="g.id"
        @click="activeGame = g.id">{{ g.label }}</button>
    </div>

    <!-- Home -->
    <main class="st-main" v-if="page === 'home'">
      <div class="st-page-layout">
        <div class="st-main-col">
          <!-- Live scores -->
          <section class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">Live Scores</h2></div>
            <div v-for="m in homeLiveMatches" :key="m.id"
              :class="['st-match-card', 'st-match-card--live']"
              :data-game="m.game"
              :data-match-id="m.id">
              <div class="st-match-team">
                <span class="st-team-name">{{ m.teamA }}</span>
                <span class="st-team-abbr">{{ m.teamAFull }}</span>
              </div>
              <div class="st-match-center">
                <div class="st-score-nums" :id="'score-' + m.id"
                  :data-score-a="liveScores[m.id]?.a ?? m.scoreA"
                  :data-score-b="liveScores[m.id]?.b ?? m.scoreB">
                  {{ liveScores[m.id]?.a ?? m.scoreA }}&nbsp;:&nbsp;{{ liveScores[m.id]?.b ?? m.scoreB }}
                </div>
                <div class="st-match-meta">{{ m.mapOrGame }} · <span class="st-badge-live"><span class="st-live-dot" />LIVE</span></div>
                <div class="st-match-event">{{ m.event }}</div>
                <div class="st-match-game"><span class="st-game-tag" :style="{ '--gc': gameColors[m.game] }">{{ gameLabels[m.game] }}</span></div>
              </div>
              <div class="st-match-team st-match-team--right">
                <span class="st-team-name">{{ m.teamB }}</span>
                <span class="st-team-abbr">{{ m.teamBFull }}</span>
              </div>
            </div>
          </section>

          <!-- Recent results -->
          <section class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">Recent Results</h2></div>
            <div v-for="m in homeRecentResults" :key="m.id" class="st-match-card" :data-game="m.game" :data-match-id="m.id">
              <div class="st-match-team">
                <span class="st-team-name">{{ m.teamA }}</span>
                <span class="st-team-abbr">{{ m.teamAFull }}</span>
              </div>
              <div class="st-match-center">
                <div class="st-score-nums">{{ m.scoreA }}&nbsp;:&nbsp;{{ m.scoreB }}</div>
                <div class="st-match-meta"><span class="st-badge-final">FINAL</span></div>
                <div class="st-match-event">{{ m.event }}</div>
                <div class="st-match-game"><span class="st-game-tag" :style="{ '--gc': gameColors[m.game] }">{{ gameLabels[m.game] }}</span></div>
              </div>
              <div class="st-match-team st-match-team--right">
                <span class="st-team-name">{{ m.teamB }}</span>
                <span class="st-team-abbr">{{ m.teamBFull }}</span>
              </div>
            </div>
          </section>

          <!-- News -->
          <section class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">Latest News</h2></div>
            <div class="st-news-grid">
              <div v-for="item in homeNewsItems" :key="item.id" class="st-news-card" :data-game="item.game">
                <a class="st-news-headline" href="#">{{ item.headline }}</a>
                <div class="st-news-meta">
                  <span class="st-game-tag" :style="{ '--gc': gameColors[item.game] }">{{ gameLabels[item.game] }}</span>
                  <span>{{ item.hoursAgo }}h ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="st-sidebar">
          <!-- Upcoming -->
          <section class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">Upcoming</h2></div>
            <div v-for="m in homeUpcoming" :key="m.id" class="st-upcoming-card" :data-game="m.game">
              <div>
                <div class="st-upcoming-teams">{{ m.teamA }} vs {{ m.teamB }}</div>
                <div style="margin-top:4px;"><span class="st-game-tag" :style="{ '--gc': gameColors[m.game] }">{{ gameLabels[m.game] }}</span></div>
              </div>
              <div class="st-upcoming-time">
                <span class="st-badge-upcoming">UPCOMING</span>
                <div style="margin-top:4px;font-size:12px;">{{ m.time }}</div>
              </div>
            </div>
          </section>

          <!-- CS2 Rankings -->
          <section v-if="showCs2Rankings" class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">CS2 World Rankings</h2></div>
            <div v-for="r in cs2Rankings" :key="r.rank" class="st-rank-row">
              <span class="st-rank-num">#{{ r.rank }}</span>
              <span class="st-rank-team">{{ r.team }}</span>
              <span class="st-rank-pts">{{ r.points.toLocaleString() }} pts</span>
              <span :class="['st-rank-change', 'st-change-' + r.change]">
                {{ r.change === 'up' ? '▲' + r.delta : r.change === 'down' ? '▼' + r.delta : '—' }}
              </span>
            </div>
          </section>

          <!-- Events -->
          <section class="st-widget">
            <div class="st-widget-header"><h2 class="st-widget-title">Top Events</h2></div>
            <div v-for="ev in topEvents" :key="ev.id" class="st-event-row" :data-game="ev.game">
              <div class="st-event-name">{{ ev.name }}</div>
              <div class="st-event-right">
                <span class="st-game-tag" :style="{ '--gc': gameColors[ev.game] }">{{ gameLabels[ev.game] }}</span>
                <div class="st-event-dates">{{ ev.dates }}</div>
              </div>
              <span :class="ev.status === 'live' ? 'st-badge-live-sm' : 'st-badge-upcoming-sm'">{{ ev.status.toUpperCase() }}</span>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Events -->
    <main class="st-main" v-else-if="page === 'events'">
      <div class="st-full-col">
        <h1 class="st-page-title">Events</h1>
        <div class="st-filter-tabs">
          <button v-for="g in gameFilters" :key="g.id"
            :class="['st-filter-tab', { 'st-filter-tab--active': activeGame === g.id }]"
            @click="activeGame = g.id">{{ g.label }}</button>
        </div>
        <div class="st-events-table">
          <div v-for="ev in filteredEvents" :key="ev.id" class="st-event-table-row" :data-game="ev.game" :data-event-id="ev.id">
            <div class="st-event-table-name">{{ ev.name }}</div>
            <span class="st-game-tag" :style="{ '--gc': gameColors[ev.game] }">{{ gameLabels[ev.game] }}</span>
            <div class="st-event-table-dates">{{ ev.dates }}</div>
            <span :class="'st-badge-' + ev.status">{{ ev.status.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Teams -->
    <main class="st-main" v-else-if="page === 'teams'">
      <div class="st-full-col">
        <h1 class="st-page-title">Teams</h1>
        <div class="st-filter-tabs">
          <button v-for="g in gameFilters" :key="g.id"
            :class="['st-filter-tab', { 'st-filter-tab--active': activeGame === g.id }]"
            @click="activeGame = g.id">{{ g.label }}</button>
        </div>
        <div class="st-teams-grid">
          <div v-for="t in filteredTeams" :key="t.id" class="st-team-card" :data-team-id="t.id" :data-game="t.game">
            <div class="st-team-card-name">{{ t.name }}</div>
            <div class="st-team-card-abbr">{{ t.abbr }}</div>
            <span class="st-game-tag" :style="{ '--gc': gameColors[t.game] }">{{ gameLabels[t.game] }}</span>
            <div v-if="t.rank" class="st-team-card-rank">Rank #{{ t.rank }} · {{ t.rankPoints?.toLocaleString() }} pts</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="st-footer">
      <div class="st-footer-inner">&copy; 2026 ScoreTap. QScrape L2 Test Site.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import {
	events,
	liveMatches,
	newsItems,
	recentResults,
	teams,
	upcomingMatches,
} from '../../../../data/scoretap/data';

type Page = 'home' | 'events' | 'teams';

// ── URL routing helpers ────────────────────────────────────────────────────
function getBase() {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function pathToPage(): Page {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	if (seg === 'events') {
		return 'events';
	}
	if (seg === 'teams') {
		return 'teams';
	}
	return 'home';
}
function pageToPath(p: Page) {
	const base = getBase();
	if (p === 'events') {
		return `${base}events`;
	}
	if (p === 'teams') {
		return `${base}teams`;
	}
	return base;
}

const ready = ref(false);
const page = ref<Page>('home');
const activeGame = ref<Game | 'all'>('all');

const _navPages = [
	{ id: 'home' as Page, label: 'Home' },
	{ id: 'events' as Page, label: 'Events' },
	{ id: 'teams' as Page, label: 'Teams' },
];
const _gameFilters = [
	{ id: 'all' as Game | 'all', label: 'All Games' },
	{ id: 'cs2' as Game, label: 'CS2' },
	{ id: 'valorant' as Game, label: 'Valorant' },
	{ id: 'lol' as Game, label: 'LoL' },
	{ id: 'dota2' as Game, label: 'Dota 2' },
	{ id: 'rl' as Game, label: 'Rocket League' },
];

// Live scores
const liveScores = ref<Record<string, { a: number; b: number }>>(
	Object.fromEntries(
		liveMatches.map((m) => [m.id, { a: m.scoreA, b: m.scoreB }]),
	),
);
const caps: Record<string, number> = {
	'match-001': 30,
	'match-002': 30,
	'match-003': 5,
};
const interval = setInterval(() => {
	const keys = Object.keys(liveScores.value);
	const key = keys[Math.floor(Math.random() * keys.length)];
	const side = Math.random() < 0.5 ? 'a' : 'b';
	const cap = caps[key] || 30;
	const cur = liveScores.value[key][side];
	if (cur < cap) {
		liveScores.value[key] = { ...liveScores.value[key], [side]: cur + 1 };
	}
}, 8000);
onUnmounted(() => clearInterval(interval));

const gf = (arr: { game: Game }[]) =>
	activeGame.value === 'all'
		? arr
		: arr.filter((x) => x.game === activeGame.value);
const _homeLiveMatches = computed(() => gf(liveMatches));
const _homeRecentResults = computed(() => gf(recentResults));
const _homeNewsItems = computed(() => gf(newsItems).slice(0, 8));
const _homeUpcoming = computed(() => gf(upcomingMatches));
const _topEvents = computed(() =>
	gf(events.filter((e) => e.status !== 'completed')).slice(0, 5),
);
const _showCs2Rankings = computed(
	() => activeGame.value === 'all' || activeGame.value === 'cs2',
);
const _filteredEvents = computed(() =>
	activeGame.value === 'all'
		? events
		: events.filter((e) => e.game === activeGame.value),
);
const _filteredTeams = computed(() =>
	activeGame.value === 'all'
		? teams
		: teams.filter((t) => t.game === activeGame.value),
);

function _navigate(p: Page) {
	page.value = p;
	history.pushState(null, '', pageToPath(p));
	window.scrollTo(0, 0);
}

function onPop() {
	page.value = pathToPage();
	window.scrollTo(0, 0);
}
onMounted(() => {
	page.value = pathToPage();
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
onUnmounted(() => window.removeEventListener('popstate', onPop));
</script>

<style scoped>
.st-shell { min-height: 100vh; background: #0f1117; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; }
.st-header { background: #1a1d27; border-bottom: 1px solid #2d3148; }
.st-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 32px; }
.st-logo { background: none; border: none; cursor: pointer; font-size: 22px; font-weight: 700; color: #22c55e; padding: 14px 0; font-family: 'Roboto Mono', monospace; letter-spacing: -0.5px; }
.st-header-nav { display: flex; }
.st-nav-btn { background: none; border: none; cursor: pointer; padding: 16px 14px; font-size: 14px; color: #6b7280; border-bottom: 2px solid transparent; font-weight: 500; }
.st-nav-btn:hover { color: #e8e8f0; }
.st-nav-btn--active { color: #e8e8f0; border-bottom-color: #22c55e; }
.st-game-filter { background: #21253a; border-bottom: 1px solid #2d3148; display: flex; overflow-x: auto; }
.st-game-tab { background: none; border: none; cursor: pointer; padding: 10px 16px; font-size: 13px; color: #6b7280; white-space: nowrap; border-bottom: 2px solid transparent; font-weight: 500; }
.st-game-tab:hover { color: #e8e8f0; }
.st-game-tab--active { color: #e8e8f0; border-bottom-color: #22c55e; }
.st-main { max-width: 1200px; margin: 0 auto; padding: 24px; }
.st-page-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
@media (max-width: 900px) { .st-page-layout { grid-template-columns: 1fr; } }
.st-main-col { display: flex; flex-direction: column; gap: 20px; }
.st-sidebar { display: flex; flex-direction: column; gap: 20px; }
.st-full-col { }
.st-widget { background: #1a1d27; border: 1px solid #2d3148; border-radius: 6px; overflow: hidden; }
.st-widget-header { padding: 12px 16px; border-bottom: 1px solid #2d3148; }
.st-widget-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; }
.st-game-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; color: var(--gc, #fff); border: 1px solid var(--gc, #fff); opacity: 0.85; text-transform: uppercase; letter-spacing: 0.04em; }
.st-badge-live { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 2px 6px; background: rgba(34,197,94,0.15); color: #22c55e; border-radius: 3px; text-transform: uppercase; }
.st-live-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; display: inline-block; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.st-badge-final { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; background: rgba(107,114,128,0.2); color: #6b7280; border-radius: 3px; text-transform: uppercase; }
.st-badge-upcoming { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; background: rgba(91,156,246,0.15); color: #5b9cf6; border-radius: 3px; text-transform: uppercase; }
.st-badge-live-sm, .st-badge-upcoming-sm, .st-badge-completed { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
.st-badge-live-sm { background: rgba(34,197,94,0.15); color: #22c55e; }
.st-badge-upcoming-sm { background: rgba(91,156,246,0.15); color: #5b9cf6; }
.st-badge-completed { background: rgba(107,114,128,0.15); color: #6b7280; }
.st-match-card { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; padding: 14px 16px; border-bottom: 1px solid #2d3148; align-items: center; }
.st-match-card:last-child { border-bottom: none; }
.st-match-card--live { background: rgba(34,197,94,0.04); }
.st-match-team { display: flex; flex-direction: column; gap: 2px; }
.st-match-team--right { text-align: right; align-items: flex-end; }
.st-team-name { font-size: 15px; font-weight: 700; font-family: 'Roboto Mono', monospace; }
.st-team-abbr { font-size: 11px; color: #6b7280; }
.st-match-center { text-align: center; min-width: 100px; }
.st-score-nums { font-family: 'Roboto Mono', monospace; font-size: 22px; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; }
.st-match-meta { font-size: 11px; color: #6b7280; margin-bottom: 3px; }
.st-match-event { font-size: 11px; color: #6b7280; margin-bottom: 3px; }
.st-news-grid { display: grid; grid-template-columns: 1fr 1fr; }
@media (max-width: 600px) { .st-news-grid { grid-template-columns: 1fr; } }
.st-news-card { padding: 12px 16px; border-bottom: 1px solid #2d3148; border-right: 1px solid #2d3148; }
.st-news-card:nth-child(even) { border-right: none; }
.st-news-headline { display: block; font-size: 13px; color: #e8e8f0; line-height: 1.4; margin-bottom: 6px; }
.st-news-headline:hover { color: #fff; }
.st-news-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #6b7280; }
.st-upcoming-card { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #2d3148; }
.st-upcoming-card:last-child { border-bottom: none; }
.st-upcoming-teams { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.st-upcoming-time { text-align: right; }
.st-rank-row { display: grid; grid-template-columns: 30px 1fr auto 40px; gap: 8px; padding: 8px 16px; border-bottom: 1px solid #2d3148; align-items: center; font-size: 13px; }
.st-rank-row:last-child { border-bottom: none; }
.st-rank-num { color: #6b7280; font-weight: 700; }
.st-rank-team { font-weight: 600; }
.st-rank-pts { color: #6b7280; font-family: 'Roboto Mono', monospace; font-size: 12px; }
.st-rank-change { font-size: 11px; font-weight: 700; text-align: right; }
.st-change-up { color: #22c55e; }
.st-change-down { color: #ef4444; }
.st-change-same { color: #6b7280; }
.st-event-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #2d3148; align-items: center; }
.st-event-row:last-child { border-bottom: none; }
.st-event-name { font-size: 13px; font-weight: 600; }
.st-event-right { text-align: right; }
.st-event-dates { font-size: 11px; color: #6b7280; margin-top: 3px; }
.st-page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.st-filter-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.st-filter-tab { background: #1a1d27; border: 1px solid #2d3148; cursor: pointer; padding: 6px 14px; font-size: 13px; color: #6b7280; border-radius: 6px; }
.st-filter-tab:hover { color: #e8e8f0; border-color: #e8e8f0; }
.st-filter-tab--active { background: #22c55e; border-color: #22c55e; color: #000; font-weight: 600; }
.st-events-table { display: flex; flex-direction: column; border: 1px solid #2d3148; border-radius: 6px; overflow: hidden; }
.st-event-table-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; padding: 14px 16px; border-bottom: 1px solid #2d3148; align-items: center; }
.st-event-table-row:last-child { border-bottom: none; }
.st-event-table-name { font-size: 14px; font-weight: 600; }
.st-event-table-dates { font-size: 13px; color: #6b7280; }
.st-teams-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 900px) { .st-teams-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .st-teams-grid { grid-template-columns: repeat(2, 1fr); } }
.st-team-card { background: #1a1d27; border: 1px solid #2d3148; border-radius: 6px; padding: 16px; }
.st-team-card-name { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
.st-team-card-abbr { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
.st-team-card-rank { font-size: 12px; color: #6b7280; margin-top: 8px; font-family: 'Roboto Mono', monospace; }
.st-footer { border-top: 1px solid #2d3148; margin-top: 48px; }
.st-footer-inner { max-width: 1200px; margin: 0 auto; padding: 16px 24px; font-size: 12px; color: #6b7280; }
</style>
