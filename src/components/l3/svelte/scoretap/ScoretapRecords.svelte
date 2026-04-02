<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	type Game,
	liveMatches,
	recentResults,
	teams,
} from '../../../../data/scoretap/data';

type RecordRow = {
	teamId: string;
	name: string;
	abbr: string;
	game: Game;
	wins: number;
	losses: number;
	fakeWins: number;
	fakeLosses: number;
};

let _records: RecordRow[] | null = null;

onMount(() => {
	const allMatches = [...liveMatches, ...recentResults];

	const wins: Record<string, number> = {};
	const losses: Record<string, number> = {};

	for (const m of allMatches) {
		if (m.status === 'final') {
			const winner = m.scoreA > m.scoreB ? m.teamA : m.teamB;
			const loser = m.scoreA > m.scoreB ? m.teamB : m.teamA;
			wins[winner] = (wins[winner] ?? 0) + 1;
			losses[loser] = (losses[loser] ?? 0) + 1;
		}
	}

	const data: RecordRow[] = teams.map((t) => {
		const w = wins[t.abbr] ?? wins[t.name] ?? 0;
		const l = losses[t.abbr] ?? losses[t.name] ?? 0;
		return {
			teamId: t.id,
			name: t.name,
			abbr: t.abbr,
			game: t.game,
			wins: w,
			losses: l,
			fakeWins: w + Math.floor((t.id.length % 3) + 1),
			fakeLosses: l + Math.floor((t.name.length % 2) + 1),
		};
	});

	fakeGetMs(data, 800, 250).then((d) => {
		_records = d;
	});
});
</script>

<div data-island="svelte-records">
  {#if !records}
    <div class="a">Loading…</div>
  {:else}
    <div class="b">
      <h3 class="c">Team Records</h3>
      <ul class="d">
        {#each records as row}
          <li class="e" data-0={row.teamId} data-1={row.game}>
            <span class="f">{row.abbr}</span>
            <span class="g">{row.name}</span>
            <span class="h">
              <span class="i">{row.wins}–{row.losses}</span>
              <span class="j" aria-hidden="true">{row.fakeWins}–{row.fakeLosses}</span>
            </span>
          </li>
        {/each}
      </ul>
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
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .c {
    font-family: var(--st3-font-ui);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--st3-muted);
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--st3-border);
  }

  .d {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .e {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--st3-border);
  }
  .e:last-child {
    border-bottom: none;
  }

  .f {
    font-family: var(--st3-font-score);
    font-size: 12px;
    font-weight: 700;
    color: var(--st3-muted);
  }
  .e[data-1="cs2"] .f { color: var(--st3-cs2); }
  .e[data-1="valorant"] .f { color: var(--st3-valorant); }
  .e[data-1="lol"] .f { color: var(--st3-lol); }
  .e[data-1="dota2"] .f { color: var(--st3-dota2); }
  .e[data-1="rl"] .f { color: var(--st3-rl); }

  .g {
    font-family: var(--st3-font-ui);
    font-size: 13px;
    color: var(--st3-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .h {
    position: relative;
    display: inline-block;
    min-width: 36px;
    text-align: right;
  }
  .i {
    font-family: var(--st3-font-score);
    font-size: 13px;
    font-weight: 600;
    color: var(--st3-text);
    position: relative;
    z-index: 1;
  }
  .j {
    position: absolute;
    top: 0;
    right: 0;
    font-family: var(--st3-font-score);
    font-size: 13px;
    font-weight: 600;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
</style>
