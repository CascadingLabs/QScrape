<!--
  @qscrape L2 / vue / scoretap / island
  @component ScoretapGameFilter
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
const allGames: GameOrAll[] = ['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'];

const ready = ref(false);
const active = ref<GameOrAll>('all');

function getActiveGame(): GameOrAll {
  return (new URLSearchParams(window.location.search).get('game') as Game | null) ?? 'all';
}

function navigate(game: GameOrAll) {
  const url = new URL(window.location.href);
  if (game === 'all') { url.searchParams.delete('game'); }
  else { url.searchParams.set('game', game); }
  history.pushState(null, '', url.toString());
  active.value = game;
  window.dispatchEvent(new CustomEvent('scoretap:game', { detail: game }));
}

function onPop() { active.value = getActiveGame(); }
function onGame(e: Event) { active.value = (e as CustomEvent<GameOrAll>).detail; }

onMounted(() => {
  active.value = getActiveGame();
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('scoretap:game', onGame);
});
onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('scoretap:game', onGame);
});

function label(g: GameOrAll): string {
  return g === 'all' ? 'All Games' : gameLabels[g as Game];
}
</script>

<template>
  <div v-if="!ready" class="st-loading">Loading…</div>
  <div
    v-else
    data-component="scoretap-game-filter"
    data-framework="vue"
    class="st-gamefilter"
  >
    <button
      v-for="g in allGames"
      :key="g"
      type="button"
      :data-filter="g"
      :data-active="active === g ? 'true' : undefined"
      :class="['st-gf-btn', active === g && 'st-gf-btn-active']"
      @click="navigate(g)"
    >
      {{ label(g) }}
    </button>
  </div>
</template>

<style scoped>
.st-loading { padding: 12px 24px; color: var(--st-muted); font-family: var(--st-font-ui); }
.st-gamefilter {
  background: var(--st-surface);
  border-bottom: 1px solid var(--st-border);
  padding: 0 24px;
  display: flex;
  gap: 2px;
  overflow-x: auto;
}
.st-gf-btn {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 400;
  color: var(--st-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: var(--st-font-ui);
  white-space: nowrap;
  transition: color 0.12s;
}
.st-gf-btn:hover { color: var(--st-text); }
.st-gf-btn-active { color: #fff; font-weight: 600; border-bottom-color: var(--st-live); }
</style>
