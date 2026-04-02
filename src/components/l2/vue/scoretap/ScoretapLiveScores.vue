<!--
  @qscrape L2 / vue / scoretap / island
  @component ScoretapLiveScores
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import {
  events,
  gameColors,
  gameLabels,
  liveMatches,
  newsItems,
  recentResults,
  teams,
  upcomingMatches,
} from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
type View = 'home' | 'match' | 'article' | 'team' | 'event';

const allMatches = [...liveMatches, ...recentResults, ...upcomingMatches];

const ready = ref(false);
const activeGame = ref<GameOrAll>('all');
const view = ref<View>('home');
const selectedId = ref<string | null>(null);
const scores = ref(Object.fromEntries(liveMatches.map((m) => [m.id, { a: m.scoreA, b: m.scoreB }])));
const _gameColors = gameColors;
const _gameLabels = gameLabels;

function getActiveGame(): GameOrAll {
  return (new URLSearchParams(window.location.search).get('game') as Game | null) ?? 'all';
}
function getViewState(): { view: View; id: string | null } {
  const p = new URLSearchParams(window.location.search);
  const match = p.get('match');
  const article = p.get('article');
  const team = p.get('team');
  const event = p.get('event');
  if (match) { return { view: 'match', id: match }; }
  if (article) { return { view: 'article', id: article }; }
  if (team) { return { view: 'team', id: team }; }
  if (event) { return { view: 'event', id: event }; }
  return { view: 'home', id: null };
}
function goTo(v: Exclude<View, 'home'>, id: string) {
  const url = new URL(window.location.href);
  for (const k of ['match', 'article', 'team', 'event']) { url.searchParams.delete(k); }
  url.searchParams.set(v, id);
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent(`scoretap:${v}`, { detail: id }));
  window.scrollTo(0, 0);
}

const filter = <T extends { game: Game }>(arr: T[]) =>
  activeGame.value === 'all' ? arr : arr.filter((x) => x.game === activeGame.value);

const filteredLive = computed(() => filter(liveMatches));
const filteredResults = computed(() => filter(recentResults));
const filteredNews = computed(() => filter(newsItems).slice(0, 6));

const matchData = computed(() => selectedId.value ? (allMatches.find((x) => x.id === selectedId.value) ?? null) : null);
const articleData = computed(() => selectedId.value ? (newsItems.find((x) => x.id === selectedId.value) ?? null) : null);
const teamData = computed(() => selectedId.value ? (teams.find((x) => x.id === selectedId.value) ?? null) : null);
const eventData = computed(() => selectedId.value ? (events.find((x) => x.id === selectedId.value) ?? null) : null);

function onPop() {
  const s = getViewState();
  view.value = s.view;
  selectedId.value = s.id;
  activeGame.value = getActiveGame();
}
function onGame(e: Event) { activeGame.value = (e as CustomEvent<GameOrAll>).detail; }
function onMatch(e: Event) { view.value = 'match'; selectedId.value = (e as CustomEvent<string>).detail; }
function onArticle(e: Event) { view.value = 'article'; selectedId.value = (e as CustomEvent<string>).detail; }
function onTeam(e: Event) { view.value = 'team'; selectedId.value = (e as CustomEvent<string>).detail; }
function onEvent(e: Event) { view.value = 'event'; selectedId.value = (e as CustomEvent<string>).detail; }

let ticker: ReturnType<typeof setInterval>;

onMounted(() => {
  const s = getViewState();
  view.value = s.view;
  selectedId.value = s.id;
  activeGame.value = getActiveGame();
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('scoretap:game', onGame);
  window.addEventListener('scoretap:match', onMatch);
  window.addEventListener('scoretap:article', onArticle);
  window.addEventListener('scoretap:team', onTeam);
  window.addEventListener('scoretap:event', onEvent);

  const caps: Record<string, number> = { 'match-001': 30, 'match-002': 30, 'match-003': 5 };
  ticker = setInterval(() => {
    const keys = Object.keys(scores.value);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const side = Math.random() < 0.5 ? 'a' : 'b';
    const cap = caps[key] ?? 30;
    const cur = scores.value[key][side as 'a' | 'b'];
    if (cur < cap) {
      scores.value = { ...scores.value, [key]: { ...scores.value[key], [side]: cur + 1 } };
    }
  }, 8000);
});
onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('scoretap:game', onGame);
  window.removeEventListener('scoretap:match', onMatch);
  window.removeEventListener('scoretap:article', onArticle);
  window.removeEventListener('scoretap:team', onTeam);
  window.removeEventListener('scoretap:event', onEvent);
  clearInterval(ticker);
});
</script>

<template>
  <div v-if="!ready" class="st-loading">Loading…</div>
  <div v-else data-component="scoretap-live-scores" data-framework="vue">

    <!-- Match detail -->
    <div v-if="view === 'match' && selectedId && matchData" data-component="scoretap-match-detail" :data-match-id="matchData.id" class="st-detail-wrap">
      <button type="button" class="st-back-btn" @click="history.back()">← Back to scores</button>
      <div class="st-widget">
        <div class="st-detail-header">
          <span class="st-game-tag" :style="{ background: gameColors[matchData.game] }">{{ gameLabels[matchData.game] }}</span>
          <span :class="['st-status-badge', matchData.status === 'live' && 'st-status-live']">
            {{ matchData.status === 'live' ? '● LIVE' : matchData.status === 'final' ? 'FINAL' : 'UPCOMING' }}
          </span>
          <span class="st-detail-event">{{ matchData.event }}</span>
        </div>
        <div class="st-match-vs">
          <div class="st-vs-team st-vs-right">
            <div class="st-vs-name">{{ matchData.teamA }}</div>
            <div class="st-vs-sub">{{ matchData.teamAFull }}</div>
          </div>
          <div class="st-vs-score">
            <div :data-score-a="matchData.scoreA" :data-score-b="matchData.scoreB" class="st-score-big">
              {{ matchData.scoreA }} : {{ matchData.scoreB }}
            </div>
            <div v-if="matchData.mapOrGame" class="st-vs-map">{{ matchData.mapOrGame }}</div>
          </div>
          <div class="st-vs-team">
            <div class="st-vs-name">{{ matchData.teamB }}</div>
            <div class="st-vs-sub">{{ matchData.teamBFull }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article detail -->
    <div v-else-if="view === 'article' && selectedId && articleData" data-component="scoretap-article-detail" :data-article-id="articleData.id" class="st-detail-wrap">
      <button type="button" class="st-back-btn" @click="history.back()">← Back to news</button>
      <div class="st-widget st-detail-body">
        <div class="st-detail-meta">
          <span class="st-game-tag" :style="{ background: gameColors[articleData.game] }">{{ gameLabels[articleData.game] }}</span>
          <span class="st-meta-age">{{ articleData.hoursAgo }}h ago</span>
        </div>
        <h1 class="st-article-title">{{ articleData.headline }}</h1>
        <div class="st-article-body">
          <p>ScoreTap is continuing to follow this story. Our reporters on the ground are gathering additional details and this article will be updated as new information becomes available.</p>
          <p>Check back for live updates, player quotes, and post-match analysis from our editorial team.</p>
        </div>
      </div>
    </div>

    <!-- Team detail -->
    <div v-else-if="view === 'team' && selectedId && teamData" data-component="scoretap-team-detail" :data-team-id="teamData.id" class="st-detail-wrap">
      <button type="button" class="st-back-btn" @click="history.back()">← Back to scores</button>
      <div class="st-widget st-detail-body">
        <h1 class="st-team-title">{{ teamData.name }}</h1>
        <div class="st-team-meta">
          <span class="st-game-tag" :style="{ background: gameColors[teamData.game] }">{{ gameLabels[teamData.game] }}</span>
          <span class="st-team-abbr-label">{{ teamData.abbr }}</span>
        </div>
        <div v-if="teamData.rank" class="st-rank-stats">
          <div class="st-stat-box">
            <div class="st-stat-val" :data-rank="teamData.rank">#{{ teamData.rank }}</div>
            <div class="st-stat-lbl">World Rank</div>
          </div>
          <div v-if="teamData.rankPoints" class="st-stat-box">
            <div class="st-stat-val" :data-points="teamData.rankPoints">{{ teamData.rankPoints.toLocaleString() }}</div>
            <div class="st-stat-lbl">Points</div>
          </div>
          <div v-if="teamData.rankChange" class="st-stat-box">
            <div :class="['st-stat-val', teamData.rankChange === 'up' ? 'st-up' : teamData.rankChange === 'down' ? 'st-down' : '']">
              {{ teamData.rankChange === 'up' ? `▲${teamData.rankDelta ?? ''}` : teamData.rankChange === 'down' ? `▼${teamData.rankDelta ?? ''}` : '—' }}
            </div>
            <div class="st-stat-lbl">Trend</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event detail -->
    <div v-else-if="view === 'event' && selectedId && eventData" data-component="scoretap-event-detail" :data-event-id="eventData.id" class="st-detail-wrap">
      <button type="button" class="st-back-btn" @click="history.back()">← Back to events</button>
      <div class="st-widget st-detail-body">
        <div class="st-detail-meta">
          <span class="st-game-tag" :style="{ background: gameColors[eventData.game] }">{{ gameLabels[eventData.game] }}</span>
          <span :class="['st-status-badge', eventData.status === 'live' && 'st-status-live']">
            {{ eventData.status === 'live' ? '● LIVE' : eventData.status === 'completed' ? 'ENDED' : 'UPCOMING' }}
          </span>
        </div>
        <h1 class="st-article-title">{{ eventData.name }}</h1>
        <div class="st-event-dates">
          <span :data-dates="eventData.dates">📅 {{ eventData.dates }}</span>
          <span :data-game="eventData.game">🎮 {{ gameLabels[eventData.game] }}</span>
        </div>
      </div>
    </div>

    <!-- Home view -->
    <template v-else>

      <!-- Live scores -->
      <div class="st-widget">
        <div class="st-widget-head">Live Scores</div>
        <div
          v-for="m in filteredLive"
          :key="m.id"
          :data-match-id="m.id"
          :data-game="m.game"
          class="st-match-row st-match-live st-clickable"
          @click="goTo('match', m.id)"
        >
          <div class="st-team st-team-right">
            <span class="st-team-name">{{ m.teamA }}</span>
            <span class="st-team-abbr">{{ m.teamAFull }}</span>
          </div>
          <div class="st-match-center">
            <div :id="`score-${m.id}`" :data-score-a="scores[m.id]?.a" :data-score-b="scores[m.id]?.b" class="st-score">
              {{ scores[m.id]?.a ?? m.scoreA }}&nbsp;:&nbsp;{{ scores[m.id]?.b ?? m.scoreB }}
            </div>
            <div class="st-live-badge">● LIVE · {{ m.mapOrGame }}</div>
            <div class="st-match-event">{{ m.event }}</div>
            <span class="st-game-tag" :style="{ background: gameColors[m.game] }">{{ gameLabels[m.game] }}</span>
          </div>
          <div class="st-team">
            <span class="st-team-name">{{ m.teamB }}</span>
            <span class="st-team-abbr">{{ m.teamBFull }}</span>
          </div>
        </div>
      </div>

      <!-- Recent results -->
      <div class="st-widget">
        <div class="st-widget-head">Recent Results</div>
        <div
          v-for="m in filteredResults"
          :key="m.id"
          :data-match-id="m.id"
          :data-game="m.game"
          class="st-match-row st-clickable"
          @click="goTo('match', m.id)"
        >
          <div class="st-team st-team-right">
            <span :class="['st-team-name', m.scoreA > m.scoreB && 'st-winner']">{{ m.teamA }}</span>
          </div>
          <div class="st-match-center">
            <div :data-score-a="m.scoreA" :data-score-b="m.scoreB" class="st-score st-score-sm">
              {{ m.scoreA }} : {{ m.scoreB }}
            </div>
            <div class="st-final-badge">FINAL</div>
            <span class="st-game-tag" :style="{ background: gameColors[m.game] }">{{ gameLabels[m.game] }}</span>
          </div>
          <div class="st-team">
            <span :class="['st-team-name', m.scoreB > m.scoreA && 'st-winner']">{{ m.teamB }}</span>
          </div>
        </div>
      </div>

      <!-- News -->
      <div class="st-widget">
        <div class="st-widget-head">Latest News</div>
        <div class="st-news-list">
          <div
            v-for="item in filteredNews"
            :key="item.id"
            :data-game="item.game"
            class="st-news-item st-clickable"
            @click="goTo('article', item.id)"
          >
            <div class="st-news-headline">{{ item.headline }}</div>
            <div class="st-news-meta">
              <span class="st-game-tag" :style="{ background: gameColors[item.game] }">{{ gameLabels[item.game] }}</span>
              <span class="st-news-age">{{ item.hoursAgo }}h ago</span>
            </div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
.st-loading { padding: 24px; color: var(--st-muted); font-family: var(--st-font-ui); }
.st-widget {
  background: var(--st-surface);
  border: 1px solid var(--st-border);
  border-radius: var(--st-radius);
  overflow: hidden;
  margin-bottom: 16px;
}
.st-widget-head {
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--st-muted);
}
.st-match-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
}
.st-clickable { cursor: pointer; }
.st-clickable:hover { opacity: 0.85; }
.st-match-live { background: var(--st-live-dim); }
.st-team { display: flex; flex-direction: column; gap: 2px; }
.st-team-right { text-align: right; align-items: flex-end; }
.st-team-name { font-size: 13px; font-weight: 600; color: var(--st-text); }
.st-winner { font-weight: 700; }
.st-team-abbr { font-size: 11px; color: var(--st-muted); }
.st-match-center { text-align: center; min-width: 80px; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.st-score { font-size: 20px; font-weight: 700; font-family: var(--st-font-score); color: var(--st-text); }
.st-score-sm { font-size: 16px; }
.st-live-badge { font-size: 11px; color: var(--st-live); font-weight: 600; }
.st-final-badge { font-size: 10px; color: var(--st-muted); }
.st-match-event { font-size: 11px; color: var(--st-muted); }
.st-game-tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  font-family: var(--st-font-ui);
}
.st-news-list { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.st-news-item { padding: 10px; border-radius: 4px; background: var(--st-surface2); }
.st-news-headline { font-size: 13px; color: var(--st-text); line-height: 1.4; margin-bottom: 6px; font-weight: 500; }
.st-news-meta { display: flex; align-items: center; gap: 8px; }
.st-news-age { font-size: 11px; color: var(--st-muted); }
/* Detail styles */
.st-detail-wrap { padding: 24px; }
.st-back-btn {
  background: none;
  border: none;
  color: var(--st-live);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--st-font-ui);
  padding: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.st-detail-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--st-border);
  display: flex;
  gap: 8px;
  align-items: center;
}
.st-detail-event { font-size: 12px; color: var(--st-muted); margin-left: auto; }
.st-match-vs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
}
.st-vs-team { display: flex; flex-direction: column; gap: 4px; }
.st-vs-right { text-align: right; align-items: flex-end; }
.st-vs-name { font-size: 22px; font-weight: 700; color: var(--st-text); }
.st-vs-sub { font-size: 13px; color: var(--st-muted); }
.st-vs-score { text-align: center; }
.st-score-big { font-size: 36px; font-weight: 700; font-family: var(--st-font-score); color: var(--st-text); }
.st-vs-map { font-size: 12px; color: var(--st-muted); margin-top: 4px; }
.st-detail-body { padding: 24px; }
.st-detail-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.st-meta-age { font-size: 12px; color: var(--st-muted); }
.st-article-title { font-size: 22px; font-weight: 700; color: var(--st-text); line-height: 1.3; margin-bottom: 16px; }
.st-article-body { font-size: 14px; color: var(--st-muted); line-height: 1.7; }
.st-article-body p + p { margin-top: 12px; }
.st-team-title { font-size: 24px; font-weight: 700; color: var(--st-text); margin-bottom: 6px; }
.st-team-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; }
.st-team-abbr-label { font-size: 13px; color: var(--st-muted); font-family: var(--st-font-score); }
.st-rank-stats { display: flex; gap: 16px; padding: 12px; background: var(--st-surface2); border-radius: var(--st-radius); }
.st-stat-box { text-align: center; }
.st-stat-val { font-size: 20px; font-weight: 700; color: var(--st-text); font-family: var(--st-font-score); }
.st-stat-lbl { font-size: 11px; color: var(--st-muted); margin-top: 2px; }
.st-up { color: var(--st-live); }
.st-down { color: #ef4444; }
.st-event-dates { display: flex; gap: 16px; font-size: 14px; color: var(--st-muted); }
.st-status-badge { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; background: var(--st-surface2); color: var(--st-muted); }
.st-status-live { background: var(--st-live); color: #fff; }
</style>
