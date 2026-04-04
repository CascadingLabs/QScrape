<!--
  @qscrape L2 / vue / scoretap / island
  @component ScoretapTeamsList
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameColors, gameLabels, teams } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

// biome lint fix: template-only vars
const _gameColors = gameColors;
const _gameLabels = gameLabels;

type GameOrAll = Game | 'all';
type View = 'list' | 'team';

const ready = ref(false);
const activeGame = ref<GameOrAll>('all');
const view = ref<View>('list');
const selectedId = ref<string | null>(null);

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const t = new URLSearchParams(window.location.search).get('team');
	if (t) {
		return { view: 'team', id: t };
	}
	return { view: 'list', id: null };
}
function _goToTeam(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('team', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:team', { detail: id }));
	window.scrollTo(0, 0);
}

const _filtered = computed(() =>
	activeGame.value === 'all'
		? teams
		: teams.filter((t) => t.game === activeGame.value),
);
const _selectedTeam = computed(() =>
	view.value === 'team' && selectedId.value
		? (teams.find((t) => t.id === selectedId.value) ?? null)
		: null,
);

function onPop() {
	activeGame.value = getActiveGame();
	const vs = getViewState();
	view.value = vs.view;
	selectedId.value = vs.id;
}
function onGame(e: Event) {
	activeGame.value = (e as CustomEvent<GameOrAll>).detail;
}
function onTeam(e: Event) {
	const id = (e as CustomEvent<string>).detail;
	view.value = 'team';
	selectedId.value = id;
}

onMounted(() => {
	activeGame.value = getActiveGame();
	const vs = getViewState();
	view.value = vs.view;
	selectedId.value = vs.id;
	fakeGet(null).then(() => {
		ready.value = true;
	});
	window.addEventListener('popstate', onPop);
	window.addEventListener('scoretap:game', onGame);
	window.addEventListener('scoretap:team', onTeam);
});
onUnmounted(() => {
	window.removeEventListener('popstate', onPop);
	window.removeEventListener('scoretap:game', onGame);
	window.removeEventListener('scoretap:team', onTeam);
});
</script>

<template>
  <div v-if="!ready" class="st-loading">Loading…</div>

  <!-- Team detail view -->
  <div
    v-else-if="selectedTeam"
    data-component="scoretap-teams-list"
    data-framework="vue"
    class="st-widget"
  >
    <div class="st-head st-head-row">
      <button type="button" class="st-back-btn" @click="history.back()">← Back</button>
      <span class="st-head-label">Team Detail</span>
    </div>
    <div class="st-detail-body">
      <div class="st-detail-name" :data-team-id="selectedTeam.id">{{ selectedTeam.name }}</div>
      <div class="st-detail-abbr">{{ selectedTeam.abbr }}</div>
      <div class="st-detail-meta">
        <span
          class="st-game-tag"
          :style="{ background: _gameColors[selectedTeam.game] }"
          :data-game="selectedTeam.game"
        >{{ _gameLabels[selectedTeam.game] }}</span>
        <span v-if="selectedTeam.rank != null" class="st-rank-info">
          Rank #{{ selectedTeam.rank }} · {{ selectedTeam.rankPoints?.toLocaleString() }} pts
        </span>
        <span
          v-if="selectedTeam.rankChange && selectedTeam.rankChange !== 'same'"
          class="st-rank-change"
          :class="{
            'st-change-up': selectedTeam.rankChange === 'up',
            'st-change-down': selectedTeam.rankChange === 'down',
          }"
        >
          {{ selectedTeam.rankChange === 'up' ? `▲${selectedTeam.rankDelta}` : `▼${selectedTeam.rankDelta}` }}
        </span>
      </div>
    </div>
  </div>

  <!-- List view -->
  <div
    v-else
    data-component="scoretap-teams-list"
    data-framework="vue"
    class="st-widget"
  >
    <div class="st-head">Teams</div>
    <div v-if="filtered.length === 0" class="st-empty">No teams.</div>
    <div class="st-teams-grid">
      <div
        v-for="t in filtered"
        :key="t.id"
        :data-team-id="t.id"
        :data-game="t.game"
        class="st-team-card st-clickable"
        @click="goToTeam(t.id)"
      >
        <div class="st-team-name">{{ t.name }}</div>
        <div class="st-team-abbr">{{ t.abbr }}</div>
        <span class="st-game-tag" :style="{ background: _gameColors[t.game] }">{{ _gameLabels[t.game] }}</span>
        <div v-if="t.rank != null" class="st-team-rank">#{{ t.rank }} · {{ t.rankPoints?.toLocaleString() }} pts</div>
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
.st-head {
  padding: 10px 16px;
  border-bottom: 1px solid var(--st-border);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--st-muted);
}
.st-head-row { display: flex; align-items: center; gap: 8px; text-transform: none; }
.st-head-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--st-muted); }
.st-back-btn {
  background: none; border: none; color: var(--st-muted); cursor: pointer;
  font-size: 12px; padding: 0; font-family: var(--st-font-ui);
}
.st-back-btn:hover { color: var(--st-text); }
.st-empty { padding: 16px; font-size: 13px; color: var(--st-muted); }
.st-teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1px;
  background: var(--st-border);
}
.st-team-card {
  padding: 14px 16px;
  background: var(--st-surface);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.st-clickable { cursor: pointer; }
.st-clickable:hover { background: var(--st-surface2); }
.st-team-name { font-size: 14px; font-weight: 700; color: var(--st-text); }
.st-team-abbr { font-size: 11px; color: var(--st-muted); font-family: var(--st-font-score); }
.st-game-tag {
  display: inline-block; padding: 2px 7px; border-radius: 3px;
  font-size: 11px; font-weight: 600; color: #fff; font-family: var(--st-font-ui);
  align-self: flex-start;
}
.st-team-rank { font-size: 11px; color: var(--st-muted); }
.st-detail-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.st-detail-name { font-size: 16px; font-weight: 700; color: var(--st-text); }
.st-detail-abbr { font-size: 13px; color: var(--st-muted); }
.st-detail-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.st-rank-info { font-size: 12px; color: var(--st-muted); }
.st-rank-change { font-size: 11px; font-weight: 600; color: var(--st-muted); }
.st-change-up { color: var(--st-live); }
.st-change-down { color: #ef4444; }
</style>
