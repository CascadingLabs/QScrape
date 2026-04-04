<script setup lang="ts">
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

function filtered() {
	if (!rows.value) {
		return [];
	}
	if (activeGame.value === 'all') {
		return rows.value;
	}
	return rows.value.filter((r) => r.game === activeGame.value);
}

function gameLabel(game: Game): string {
	return gameLabels[game];
}
</script>

<template>
  <div data-island="vue-events">
    <div v-if="!rows" class="a">Loading…</div>
    <div v-else class="b">
      <div v-if="filtered().length === 0" class="c">No matches found.</div>
      <div
        v-for="row in filtered()"
        :key="row.id"
        class="d"
        :data-0="row.id"
        :data-1="row.game"
        :data-2="row.status"
      >
        <div class="e">
          <span class="f" :data-3="gameLabel(row.game as Game)"></span>
          <span class="g" :data-2="row.status"></span>
          <span v-if="row.time" class="h">{{ row.time }}</span>
        </div>
        <div class="i">
          <div class="j">
            <span class="k">{{ row.teamA }}</span>
            <span class="l">{{ row.status !== 'upcoming' ? row.scoreA : '—' }}</span>
          </div>
          <div class="j">
            <span class="k">{{ row.teamB }}</span>
            <span class="l">{{ row.status !== 'upcoming' ? row.scoreB : '—' }}</span>
          </div>
        </div>
        <div class="m">{{ row.event }}</div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/scoretap.css';
</style>

<style scoped>
.a {
	min-height: 160px;
	display: flex;
	align-items: center;
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
}

.b {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.c {
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
	padding: 20px 0;
}

.d {
	background: var(--st3-surface);
	border: 1px solid var(--st3-border);
	border-radius: var(--st3-radius);
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.e {
	display: flex;
	align-items: center;
	gap: 8px;
}

.f {
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
.f::before {
	content: attr(data-3);
}
.d[data-1="cs2"] .f { color: var(--st3-cs2); }
.d[data-1="valorant"] .f { color: var(--st3-valorant); }
.d[data-1="lol"] .f { color: var(--st3-lol); }
.d[data-1="dota2"] .f { color: var(--st3-dota2); }
.d[data-1="rl"] .f { color: var(--st3-rl); }

.g {
	display: inline-block;
	font-family: var(--st3-font-ui);
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	padding: 2px 7px;
	border-radius: 4px;
}
.g[data-2="live"] {
	background: var(--st3-live-dim);
	color: var(--st3-live);
}
.g[data-2="upcoming"] {
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.g[data-2="final"] {
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.g[data-2="live"]::before { content: "LIVE"; }
.g[data-2="upcoming"]::before { content: "UPCOMING"; }
.g[data-2="final"]::before { content: "FINAL"; }

.h {
	margin-left: auto;
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
}

.i {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.j {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.k {
	font-family: var(--st3-font-ui);
	font-size: 14px;
	font-weight: 600;
	color: var(--st3-text);
}

.l {
	font-family: var(--st3-font-score);
	font-size: 15px;
	font-weight: 700;
	color: var(--st3-text);
}

.m {
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
	border-top: 1px solid var(--st3-border);
	padding-top: 8px;
}
</style>
