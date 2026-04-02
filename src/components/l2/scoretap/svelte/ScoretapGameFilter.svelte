<!--
  @qscrape L2 / svelte / scoretap / island
  @component ScoretapGameFilter
-->
<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

type GameOrAll = Game | 'all';
const _allGames: GameOrAll[] = ['all', 'cs2', 'valorant', 'lol', 'dota2', 'rl'];

let _ready = false;
let _active: GameOrAll = 'all';

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}

function _navigate(game: GameOrAll) {
	const url = new URL(window.location.href);
	if (game === 'all') {
		url.searchParams.delete('game');
	} else {
		url.searchParams.set('game', game);
	}
	history.pushState(null, '', url.toString());
	_active = game;
	window.dispatchEvent(new CustomEvent('scoretap:game', { detail: game }));
}

function onPop() {
	_active = getActiveGame();
}
function onGame(e: Event) {
	_active = (e as CustomEvent<GameOrAll>).detail;
}

onMount(() => {
	_active = getActiveGame();
	fakeGet(null).then(() => {
		_ready = true;
	});
	window.addEventListener('popstate', onPop);
	window.addEventListener('scoretap:game', onGame);
});
onDestroy(() => {
	window.removeEventListener('popstate', onPop);
	window.removeEventListener('scoretap:game', onGame);
});

function _label(g: GameOrAll): string {
	return g === 'all' ? 'All Games' : gameLabels[g as Game];
}
</script>

{#if !ready}
  <div class="st-loading">Loading…</div>
{:else}
  <div data-component="scoretap-game-filter" data-framework="svelte" class="st-gamefilter">
    {#each allGames as g (g)}
      <button
        type="button"
        data-filter={g}
        data-active={active === g ? 'true' : undefined}
        class={['st-gf-btn', active === g && 'st-gf-btn-active'].filter(Boolean).join(' ')}
        on:click={() => navigate(g)}
      >
        {label(g)}
      </button>
    {/each}
  </div>
{/if}

<style>
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
