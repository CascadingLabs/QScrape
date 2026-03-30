<script lang="ts">
// @qscrape L3 / svelte island / scoretap — team win/loss records derived from match data
// Anti-bot: decoy overlay — real W-L record at z-index 1, fake W-L record at z-index 2
// (color: transparent, pointer-events: none). DOM has both; scraper must resolve z-index.
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
    <div class="st3-rec-loading">Loading…</div>
  {:else}
    <div class="st3-rec">
      <h3 class="st3-rec-title">Team Records</h3>
      <ul class="st3-rec-list">
        {#each records as row}
          <li class="st3-rec-item" data-team-id={row.teamId} data-game={row.game}>
            <span class="st3-rec-abbr">{row.abbr}</span>
            <span class="st3-rec-name">{row.name}</span>
            <!-- Anti-bot decoy: real record below, fake record overlaid -->
            <span class="st3-rec-wrap">
              <span class="st3-rec-real">{row.wins}–{row.losses}</span>
              <span class="st3-rec-decoy" aria-hidden="true">{row.fakeWins}–{row.fakeLosses}</span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/scoretap.css';

  .st3-rec-loading {
    min-height: 100px;
    display: flex;
    align-items: center;
    color: var(--st3-muted);
    font-family: var(--st3-font-ui);
    font-size: 14px;
  }

  .st3-rec {
    background: var(--st3-surface);
    border: 1px solid var(--st3-border);
    border-radius: var(--st3-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .st3-rec-title {
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

  .st3-rec-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .st3-rec-item {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--st3-border);
  }
  .st3-rec-item:last-child {
    border-bottom: none;
  }

  .st3-rec-abbr {
    font-family: var(--st3-font-score);
    font-size: 12px;
    font-weight: 700;
    color: var(--st3-muted);
  }
  .st3-rec-item[data-game="cs2"] .st3-rec-abbr { color: var(--st3-cs2); }
  .st3-rec-item[data-game="valorant"] .st3-rec-abbr { color: var(--st3-valorant); }
  .st3-rec-item[data-game="lol"] .st3-rec-abbr { color: var(--st3-lol); }
  .st3-rec-item[data-game="dota2"] .st3-rec-abbr { color: var(--st3-dota2); }
  .st3-rec-item[data-game="rl"] .st3-rec-abbr { color: var(--st3-rl); }

  .st3-rec-name {
    font-family: var(--st3-font-ui);
    font-size: 13px;
    color: var(--st3-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Anti-bot: decoy overlay on W-L record */
  .st3-rec-wrap {
    position: relative;
    display: inline-block;
    min-width: 36px;
    text-align: right;
  }
  .st3-rec-real {
    font-family: var(--st3-font-score);
    font-size: 13px;
    font-weight: 600;
    color: var(--st3-text);
    position: relative;
    z-index: 1;
  }
  .st3-rec-decoy {
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
