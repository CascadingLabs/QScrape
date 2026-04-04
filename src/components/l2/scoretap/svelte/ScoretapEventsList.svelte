<!--
  @qscrape L2 / svelte / scoretap / island
  @component ScoretapEventsList
-->
<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fakeGet } from '../../../../data/api';
import type { Game } from '../../../../data/scoretap/data';
import { events, gameColors, gameLabels } from '../../../../data/scoretap/data';
import '../../../../styles/l2/scoretap.css';

// biome lint fix: template-only vars
const _gameColors = gameColors;
const _gameLabels = gameLabels;

type GameOrAll = Game | 'all';
type View = 'list' | 'event';

let _ready = false;
let activeGame: GameOrAll = 'all';
let view: View = 'list';
let selectedId: string | null = null;

function getActiveGame(): GameOrAll {
	return (
		(new URLSearchParams(window.location.search).get('game') as Game | null) ??
		'all'
	);
}
function getViewState(): { view: View; id: string | null } {
	const ev = new URLSearchParams(window.location.search).get('event');
	if (ev) {
		return { view: 'event', id: ev };
	}
	return { view: 'list', id: null };
}
function _goToEvent(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('event', id);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('scoretap:event', { detail: id }));
	window.scrollTo(0, 0);
}

$: filtered =
	activeGame === 'all' ? events : events.filter((e) => e.game === activeGame);
$: selectedEvent =
	view === 'event' && selectedId
		? (events.find((e) => e.id === selectedId) ?? null)
		: null;

function onPop() {
	activeGame = getActiveGame();
	const vs = getViewState();
	view = vs.view;
	selectedId = vs.id;
}
function onGame(e: Event) {
	activeGame = (e as CustomEvent<GameOrAll>).detail;
}
function onEvent(e: Event) {
	const id = (e as CustomEvent<string>).detail;
	view = 'event';
	selectedId = id;
}

onMount(() => {
	activeGame = getActiveGame();
	const vs = getViewState();
	view = vs.view;
	selectedId = vs.id;
	fakeGet(null).then(() => {
		_ready = true;
	});
	window.addEventListener('popstate', onPop);
	window.addEventListener('scoretap:game', onGame);
	window.addEventListener('scoretap:event', onEvent);
});
onDestroy(() => {
	window.removeEventListener('popstate', onPop);
	window.removeEventListener('scoretap:game', onGame);
	window.removeEventListener('scoretap:event', onEvent);
});
</script>

{#if !ready}
  <div class="st-loading">Loading…</div>
{:else if selectedEvent}
  <div data-component="scoretap-events-list" data-framework="svelte" class="st-widget">
    <div class="st-head st-head-row">
      <button type="button" class="st-back-btn" on:click={() => history.back()}>← Back</button>
      <span class="st-head-label">Event Detail</span>
    </div>
    <div class="st-detail-body">
      <div class="st-detail-title" data-event-id={selectedEvent.id}>{selectedEvent.name}</div>
      <div class="st-detail-meta">
        <span class="st-game-tag" style="background:{_gameColors[selectedEvent.game]}" data-game={selectedEvent.game}>{_gameLabels[selectedEvent.game]}</span>
        <span class="st-status-badge" class:st-status-live={selectedEvent.status === 'live'}>
          {selectedEvent.status === 'live' ? 'LIVE' : selectedEvent.status === 'completed' ? 'ENDED' : 'UPCOMING'}
        </span>
      </div>
      <div class="st-detail-dates">{selectedEvent.dates}</div>
    </div>
  </div>
{:else}
  <div data-component="scoretap-events-list" data-framework="svelte" class="st-widget">
    <div class="st-head">Events</div>
    {#if filtered.length === 0}
      <div class="st-empty">No events.</div>
    {/if}
    {#each filtered as ev (ev.id)}
      <div
        data-event-id={ev.id}
        data-game={ev.game}
        class="st-event-row st-clickable"
        on:click={() => goToEvent(ev.id)}
      >
        <div class="st-event-name">{ev.name}</div>
        <div class="st-event-meta">
          <span class="st-game-tag" style="background:{_gameColors[ev.game]}">{_gameLabels[ev.game]}</span>
          <span class="st-event-dates">{ev.dates}</span>
          <span class="st-status-badge" class:st-status-live={ev.status === 'live'}>
            {ev.status === 'live' ? 'LIVE' : ev.status === 'completed' ? 'ENDED' : 'UPCOMING'}
          </span>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
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
  .st-event-row {
    padding: 10px 16px;
    border-bottom: 1px solid var(--st-border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .st-clickable { cursor: pointer; }
  .st-clickable:hover { background: var(--st-surface2); }
  .st-event-name { font-size: 13px; font-weight: 500; color: var(--st-text); text-decoration: underline dotted var(--st-muted); }
  .st-event-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .st-game-tag {
    display: inline-block; padding: 2px 7px; border-radius: 3px;
    font-size: 11px; font-weight: 600; color: #fff; font-family: var(--st-font-ui);
  }
  .st-event-dates { font-size: 11px; color: var(--st-muted); }
  .st-status-badge {
    font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;
    background: var(--st-surface2); color: var(--st-muted);
  }
  .st-status-live { background: var(--st-live); color: #fff; }
  .st-detail-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
  .st-detail-title { font-size: 16px; font-weight: 700; color: var(--st-text); }
  .st-detail-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .st-detail-dates { font-size: 13px; color: var(--st-muted); }
</style>
