<!--
  @qscrape L2 / vue / scoretap / island
  @component ScoretapRankings
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { cs2Rankings, events, gameColors, gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';

const ready = ref(false);
const activeGame = ref<GameOrAll>('all');
const _cs2Rankings = cs2Rankings;
const _gameColors = gameColors;
const _gameLabels = gameLabels;

function getActiveGame(): GameOrAll {
  return (new URLSearchParams(window.location.search).get('game') as Game | null) ?? 'all';
}
function goToTeam(id: string) {
  const url = new URL(window.location.href);
  for (const k of ['match', 'article', 'team', 'event']) { url.searchParams.delete(k); }
  url.searchParams.set('team', id);
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('scoretap:team', { detail: id }));
  window.scrollTo(0, 0);
}
function goToEvent(id: string) {
  const url = new URL(window.location.href);
  for (const k of ['match', 'article', 'team', 'event']) { url.searchParams.delete(k); }
  url.searchParams.set('event', id);
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('scoretap:event', { detail: id }));
  window.scrollTo(0, 0);
}

const showRankings = computed(() => activeGame.value === 'all' || activeGame.value === 'cs2');
const topEvents = computed(() =>
  (activeGame.value === 'all' ? events : events.filter((e) => e.game === activeGame.value))
    .filter((e) => e.status !== 'completed')
    .slice(0, 5),
);

function onPop() { activeGame.value = getActiveGame(); }
function onGame(e: Event) { activeGame.value = (e as CustomEvent<GameOrAll>).detail; }

onMounted(() => {
  activeGame.value = getActiveGame();
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('scoretap:game', onGame);
});
onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('scoretap:game', onGame);
});
</script>

<template>
  <div v-if="!ready" class="st-loading">Loading…</div>
  <div v-else data-component="scoretap-rankings" data-framework="vue">

    <!-- CS2 Rankings -->
    <div v-if="showRankings" class="st-widget st-widget-mb">
      <div class="st-widget-head">CS2 World Rankings</div>
      <div
        v-for="r in cs2Rankings"
        :key="r.rank"
        :data-rank="r.rank"
        :class="['st-rank-row', r.teamId && 'st-clickable']"
        @click="r.teamId && goToTeam(r.teamId)"
      >
        <span class="st-rank-num">#{{ r.rank }}</span>
        <span :class="['st-rank-team', r.teamId && 'st-rank-link']" :data-team-id="r.teamId">{{ r.team }}</span>
        <span class="st-rank-pts" :data-points="r.points">{{ r.points.toLocaleString() }}</span>
        <span :class="['st-rank-change', `st-change-${r.change}`]">
          {{ r.change === 'up' ? `▲${r.delta}` : r.change === 'down' ? `▼${r.delta}` : '—' }}
        </span>
      </div>
    </div>

    <!-- Top Events -->
    <div class="st-widget">
      <div class="st-widget-head">Top Events</div>
      <div v-if="topEvents.length === 0" class="st-empty">No events.</div>
      <div
        v-for="ev in topEvents"
        :key="ev.id"
        :data-event-id="ev.id"
        :data-game="ev.game"
        class="st-event-row st-clickable"
        @click="goToEvent(ev.id)"
      >
        <div class="st-event-name">{{ ev.name }}</div>
        <div class="st-event-meta">
          <span class="st-game-tag" :style="{ background: gameColors[ev.game] }">{{ gameLabels[ev.game] }}</span>
          <span class="st-event-dates">{{ ev.dates }}</span>
          <span :class="['st-status-badge', ev.status === 'live' && 'st-status-live']">
            {{ ev.status === 'live' ? 'LIVE' : 'UPCOMING' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.st-loading { padding: 12px; color: var(--st-muted); font-family: var(--st-font-ui); }
.st-widget {
  background: var(--st-surface);
  border: 1px solid var(--st-border);
  border-radius: var(--st-radius);
  overflow: hidden;
}
.st-widget-mb { margin-bottom: 16px; }
.st-widget-head {
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--st-muted);
}
.st-empty { padding: 16px; font-size: 13px; color: var(--st-muted); }
.st-rank-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--st-border);
  font-size: 13px;
}
.st-clickable { cursor: pointer; }
.st-clickable:hover { background: var(--st-surface2); }
.st-rank-num { width: 24px; color: var(--st-muted); font-size: 12px; flex-shrink: 0; }
.st-rank-team { flex: 1; color: var(--st-text); font-weight: 500; }
.st-rank-link { text-decoration: underline dotted var(--st-muted); }
.st-rank-pts { font-size: 12px; color: var(--st-muted); font-family: var(--st-font-score); }
.st-rank-change { font-size: 11px; font-weight: 600; width: 28px; text-align: right; flex-shrink: 0; }
.st-change-up { color: var(--st-live); }
.st-change-down { color: #ef4444; }
.st-change-same { color: var(--st-muted); }
.st-game-tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  font-family: var(--st-font-ui);
}
.st-event-row {
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.st-event-name { font-size: 13px; font-weight: 500; color: var(--st-text); text-decoration: underline dotted var(--st-muted); }
.st-event-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.st-event-dates { font-size: 11px; color: var(--st-muted); }
.st-status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--st-surface2);
  color: var(--st-muted);
}
.st-status-live { background: var(--st-live); color: #fff; }
</style>
