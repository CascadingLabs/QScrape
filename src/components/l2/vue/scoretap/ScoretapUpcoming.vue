<!--
  @qscrape L2 / vue / scoretap / island
  @component ScoretapUpcoming
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameColors, gameLabels, teams, upcomingMatches } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';

const ready = ref(false);
const activeGame = ref<GameOrAll>('all');
const _gameColors = gameColors;
const _gameLabels = gameLabels;

const teamNameToId: Record<string, string> = Object.fromEntries(
  teams.map((t) => [t.name.toLowerCase(), t.id]).concat(teams.map((t) => [t.abbr.toLowerCase(), t.id])),
);

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
function getTeamId(name: string): string | undefined {
  return teamNameToId[name.toLowerCase()];
}
function clickTeam(e: MouseEvent, name: string) {
  const id = getTeamId(name);
  if (!id) { return; }
  e.stopPropagation();
  goToTeam(id);
}

const filtered = computed(() =>
  activeGame.value === 'all' ? upcomingMatches : upcomingMatches.filter((m) => m.game === activeGame.value),
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
  <div
    v-else
    data-component="scoretap-upcoming"
    data-framework="vue"
    class="st-widget"
  >
    <div class="st-widget-head">Upcoming</div>
    <div v-if="filtered.length === 0" class="st-empty">No upcoming matches.</div>
    <div
      v-for="m in filtered"
      :key="m.id"
      :data-match-id="m.id"
      :data-game="m.game"
      class="st-upcoming-row"
    >
      <div class="st-upcoming-info">
        <div class="st-upcoming-teams">
          <button v-if="getTeamId(m.teamA)" type="button" class="st-team-btn" :data-team-id="getTeamId(m.teamA)" @click.stop="clickTeam($event, m.teamA)">{{ m.teamA }}</button>
          <span v-else>{{ m.teamA }}</span>
          <span class="st-vs">vs</span>
          <button v-if="getTeamId(m.teamB)" type="button" class="st-team-btn" :data-team-id="getTeamId(m.teamB)" @click.stop="clickTeam($event, m.teamB)">{{ m.teamB }}</button>
          <span v-else>{{ m.teamB }}</span>
        </div>
        <span class="st-game-tag" :style="{ background: gameColors[m.game] }">{{ gameLabels[m.game] }}</span>
        <div class="st-upcoming-event">{{ m.event }}</div>
      </div>
      <div class="st-upcoming-time">
        <div class="st-time-label">{{ m.time }}</div>
        <div class="st-upcoming-badge">UPCOMING</div>
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
.st-upcoming-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
}
.st-upcoming-info { display: flex; flex-direction: column; gap: 4px; }
.st-upcoming-teams { font-size: 13px; font-weight: 600; color: var(--st-text); display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.st-vs { color: var(--st-muted); font-weight: 400; }
.st-team-btn {
  background: none;
  border: none;
  color: var(--st-text);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: var(--st-font-ui);
  padding: 0;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--st-muted);
}
.st-game-tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  font-family: var(--st-font-ui);
  align-self: flex-start;
}
.st-upcoming-event { font-size: 11px; color: var(--st-muted); }
.st-upcoming-time { text-align: right; flex-shrink: 0; }
.st-time-label { font-size: 11px; font-weight: 600; color: var(--st-text); }
.st-upcoming-badge { font-size: 10px; color: var(--st-muted); margin-top: 2px; }
</style>
