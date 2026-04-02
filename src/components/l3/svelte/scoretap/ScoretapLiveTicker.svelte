<script lang="ts">
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
    <div class="a">Loading…</div>
  {:else}
    <div class="b">
      <div class="c">
        <span class="d" aria-hidden="true"></span>
        <span class="e">Live Now</span>
      </div>
      {#each rows as row}
        <div class="f" data-0={row.id} data-1={row.game}>
          <div class="g">{row.event}</div>
          <div class="h">
            <span class="i">{row.teamA}</span>
            <span class="j">
              <span class="k">{row.scoreA}</span>
              <span class="l" aria-hidden="true">{row.fakeScoreA}</span>
            </span>
            <span class="m">:</span>
            <span class="j">
              <span class="k">{row.scoreB}</span>
              <span class="l" aria-hidden="true">{row.fakeScoreB}</span>
            </span>
            <span class="i n">{row.teamB}</span>
          </div>
          <div class="o">{row.mapOrGame}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/scoretap.css';

  .a {
    min-height: 100px;
    display: flex;
    align-items: center;
    color: var(--st3-muted);
    font-family: var(--st3-font-ui);
    font-size: 14px;
  }

  .b {
    background: var(--st3-surface);
    border: 1px solid var(--st3-border);
    border-radius: var(--st3-radius);
    overflow: hidden;
  }

  .c {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--st3-live-dim);
    border-bottom: 1px solid var(--st3-border);
  }

  .d {
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

  .e {
    font-family: var(--st3-font-ui);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--st3-live);
  }

  .f {
    padding: 12px 14px;
    border-bottom: 1px solid var(--st3-border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .f:last-child {
    border-bottom: none;
  }

  .g {
    font-family: var(--st3-font-ui);
    font-size: 10px;
    color: var(--st3-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .h {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .i {
    font-family: var(--st3-font-ui);
    font-size: 13px;
    font-weight: 600;
    color: var(--st3-text);
    flex: 1;
  }
  .n {
    text-align: right;
  }

  .m {
    font-family: var(--st3-font-score);
    font-size: 14px;
    font-weight: 700;
    color: var(--st3-muted);
  }

  .o {
    font-family: var(--st3-font-ui);
    font-size: 11px;
    color: var(--st3-muted);
  }

  .j {
    position: relative;
    display: inline-block;
    min-width: 20px;
    text-align: center;
  }
  .k {
    font-family: var(--st3-font-score);
    font-size: 15px;
    font-weight: 700;
    color: var(--st3-text);
    position: relative;
    z-index: 1;
  }
  .l {
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
