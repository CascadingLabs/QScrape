<script setup lang="ts">
// @qscrape L3 / vue island / scoretap — events list filtered by ?game= URL param
// Anti-bot: game badge and status badge rendered via CSS ::before pseudo-element content
// element.textContent on .st3-game-badge / .st3-status-badge returns empty string;
// requires getComputedStyle(el,'::before').content to read the real value.
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type Game,
	gameLabels,
	liveMatches,
	recentResults,
	upcomingMatches,
} from '../../../../data/scoretap/data';

type MatchRow = {
	id: string;
	game: Game;
	teamA: string;
	teamB: string;
	scoreA: number;
	scoreB: number;
	status: 'live' | 'final' | 'upcoming';
	event: string;
	time?: string;
};

const rows = ref<MatchRow[] | null>(null);
const activeGame = ref<string>('all');

onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	activeGame.value = params.get('game') ?? 'all';

	const all: MatchRow[] = [
		...liveMatches,
		...upcomingMatches,
		...recentResults,
	];

	fakeGetMs(all, 600, 250).then((data) => {
		rows.value = data;
	});
});

function _filtered() {
	if (!rows.value) {
		return [];
	}
	if (activeGame.value === 'all') {
		return rows.value;
	}
	return rows.value.filter((r) => r.game === activeGame.value);
}

function _gameLabel(game: Game): string {
	return gameLabels[game];
}
</script>

<template>
  <div data-island="vue-events">
    <div v-if="!rows" class="st3-events-loading">Loading…</div>
    <div v-else class="st3-events">
      <div v-if="filtered().length === 0" class="st3-events-empty">No matches found.</div>
      <div
        v-for="row in filtered()"
        :key="row.id"
        class="st3-event-row"
        :data-match-id="row.id"
        :data-game="row.game"
        :data-status="row.status"
      >
        <div class="st3-event-header">
          <!-- Anti-bot: game label via pseudo-element, textContent empty -->
          <span class="st3-game-badge" :data-game-label="gameLabel(row.game as Game)"></span>
          <!-- Anti-bot: status via pseudo-element on data-status -->
          <span class="st3-status-badge" :data-status="row.status"></span>
          <span v-if="row.time" class="st3-event-time">{{ row.time }}</span>
        </div>
        <div class="st3-event-body">
          <div class="st3-team-row">
            <span class="st3-team-name">{{ row.teamA }}</span>
            <span class="st3-score">{{ row.status !== 'upcoming' ? row.scoreA : '—' }}</span>
          </div>
          <div class="st3-team-row">
            <span class="st3-team-name">{{ row.teamB }}</span>
            <span class="st3-score">{{ row.status !== 'upcoming' ? row.scoreB : '—' }}</span>
          </div>
        </div>
        <div class="st3-event-footer">{{ row.event }}</div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/scoretap.css';

.st3-events-loading {
	min-height: 160px;
	display: flex;
	align-items: center;
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
}

.st3-events {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.st3-events-empty {
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
	padding: 20px 0;
}

.st3-event-row {
	background: var(--st3-surface);
	border: 1px solid var(--st3-border);
	border-radius: var(--st3-radius);
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.st3-event-header {
	display: flex;
	align-items: center;
	gap: 8px;
}

/* Anti-bot: game badge text via ::before pseudo-element */
.st3-game-badge {
	display: inline-block;
	font-family: var(--st3-font-ui);
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	padding: 2px 7px;
	border-radius: 4px;
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.st3-game-badge::before {
	content: attr(data-game-label);
}
.st3-event-row[data-game="cs2"] .st3-game-badge { color: var(--st3-cs2); }
.st3-event-row[data-game="valorant"] .st3-game-badge { color: var(--st3-valorant); }
.st3-event-row[data-game="lol"] .st3-game-badge { color: var(--st3-lol); }
.st3-event-row[data-game="dota2"] .st3-game-badge { color: var(--st3-dota2); }
.st3-event-row[data-game="rl"] .st3-game-badge { color: var(--st3-rl); }

/* Anti-bot: status badge text via ::before pseudo-element */
.st3-status-badge {
	display: inline-block;
	font-family: var(--st3-font-ui);
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	padding: 2px 7px;
	border-radius: 4px;
}
.st3-status-badge[data-status="live"] {
	background: var(--st3-live-dim);
	color: var(--st3-live);
}
.st3-status-badge[data-status="upcoming"] {
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.st3-status-badge[data-status="final"] {
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.st3-status-badge[data-status="live"]::before { content: "LIVE"; }
.st3-status-badge[data-status="upcoming"]::before { content: "UPCOMING"; }
.st3-status-badge[data-status="final"]::before { content: "FINAL"; }

.st3-event-time {
	margin-left: auto;
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
}

.st3-event-body {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.st3-team-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.st3-team-name {
	font-family: var(--st3-font-ui);
	font-size: 14px;
	font-weight: 600;
	color: var(--st3-text);
}

.st3-score {
	font-family: var(--st3-font-score);
	font-size: 15px;
	font-weight: 700;
	color: var(--st3-text);
}

.st3-event-footer {
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
	border-top: 1px solid var(--st3-border);
	padding-top: 8px;
}
</style>
