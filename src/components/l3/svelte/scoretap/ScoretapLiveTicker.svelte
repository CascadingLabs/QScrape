<script lang="ts">
// @qscrape L3 / svelte island / scoretap — live match scores ticker
// Anti-bot: decoy overlay — real score at z-index 1, fake score at z-index 2
// (color: transparent, pointer-events: none). DOM has both; scraper must resolve z-index.
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { liveMatches, type Match } from '../../../../data/scoretap/data';

type TickerRow = Match & { fakeScoreA: number; fakeScoreB: number };

let _rows: TickerRow[] | null = null;

onMount(() => {
	const data: TickerRow[] = liveMatches.map((m) => ({
		...m,
		fakeScoreA: m.scoreA + Math.floor((m.id.length % 4) + 1),
		fakeScoreB: m.scoreB + Math.floor((m.id.length % 3) + 1),
	}));
	fakeGetMs(data, 800, 250).then((d) => {
		_rows = d;
	});
});
</script>

<div data-island="svelte-live-ticker">
  {#if !rows}
    <div class="st3-ticker-loading">Loading…</div>
  {:else}
    <div class="st3-ticker">
      <div class="st3-ticker-header">
        <span class="st3-pulse-dot" aria-hidden="true"></span>
        <span class="st3-ticker-title">Live Now</span>
      </div>
      {#each rows as row}
        <div class="st3-ticker-row" data-match-id={row.id} data-game={row.game}>
          <div class="st3-ticker-event">{row.event}</div>
          <div class="st3-ticker-matchup">
            <span class="st3-ticker-team">{row.teamA}</span>
            <!-- Anti-bot decoy: real score below, fake score overlaid -->
            <span class="st3-score-wrap">
              <span class="st3-score-real">{row.scoreA}</span>
              <span class="st3-score-decoy" aria-hidden="true">{row.fakeScoreA}</span>
            </span>
            <span class="st3-ticker-sep">:</span>
            <span class="st3-score-wrap">
              <span class="st3-score-real">{row.scoreB}</span>
              <span class="st3-score-decoy" aria-hidden="true">{row.fakeScoreB}</span>
            </span>
            <span class="st3-ticker-team st3-ticker-team-b">{row.teamB}</span>
          </div>
          <div class="st3-ticker-meta">{row.mapOrGame}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/scoretap.css';

  .st3-ticker-loading {
    min-height: 100px;
    display: flex;
    align-items: center;
    color: var(--st3-muted);
    font-family: var(--st3-font-ui);
    font-size: 14px;
  }

  .st3-ticker {
    background: var(--st3-surface);
    border: 1px solid var(--st3-border);
    border-radius: var(--st3-radius);
    overflow: hidden;
  }

  .st3-ticker-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--st3-live-dim);
    border-bottom: 1px solid var(--st3-border);
  }

  .st3-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--st3-live);
    display: inline-block;
    box-shadow: 0 0 0 0 var(--st3-live-glow);
    animation: pulse-ring 1.4s ease-out infinite;
    flex-shrink: 0;
  }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 var(--st3-live-glow); }
    70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
  }

  .st3-ticker-title {
    font-family: var(--st3-font-ui);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--st3-live);
  }

  .st3-ticker-row {
    padding: 12px 14px;
    border-bottom: 1px solid var(--st3-border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .st3-ticker-row:last-child {
    border-bottom: none;
  }

  .st3-ticker-event {
    font-family: var(--st3-font-ui);
    font-size: 10px;
    color: var(--st3-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .st3-ticker-matchup {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .st3-ticker-team {
    font-family: var(--st3-font-ui);
    font-size: 13px;
    font-weight: 600;
    color: var(--st3-text);
    flex: 1;
  }
  .st3-ticker-team-b {
    text-align: right;
  }

  .st3-ticker-sep {
    font-family: var(--st3-font-score);
    font-size: 14px;
    font-weight: 700;
    color: var(--st3-muted);
  }

  .st3-ticker-meta {
    font-family: var(--st3-font-ui);
    font-size: 11px;
    color: var(--st3-muted);
  }

  /* Anti-bot: decoy overlay on scores */
  .st3-score-wrap {
    position: relative;
    display: inline-block;
    min-width: 20px;
    text-align: center;
  }
  .st3-score-real {
    font-family: var(--st3-font-score);
    font-size: 15px;
    font-weight: 700;
    color: var(--st3-text);
    position: relative;
    z-index: 1;
  }
  .st3-score-decoy {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: var(--st3-font-score);
    font-size: 15px;
    font-weight: 700;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }
</style>
