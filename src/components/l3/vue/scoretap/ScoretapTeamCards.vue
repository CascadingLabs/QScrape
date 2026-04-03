<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type Game,
	gameLabels,
	type Team,
	teams,
} from '../../../../data/scoretap/data';

const allTeams = ref<Team[] | null>(null);

onMounted(() => {
	fakeGetMs(teams, 600, 250).then((data) => {
		allTeams.value = data;
	});
});

function _gameLabel(game: Game): string {
	return gameLabels[game];
}
</script>

<template>
  <div data-island="vue-team-cards">
    <div v-if="!allTeams" class="a">Loading…</div>
    <div v-else class="b">
      <div
        v-for="team in allTeams"
        :key="team.id"
        class="c"
        :data-0="team.id"
        :data-1="team.game"
      >
        <div class="d">
          <span class="e">{{ team.abbr }}</span>
          <span class="f" :data-2="gameLabel(team.game as Game)"></span>
        </div>
        <div class="g">{{ team.name }}</div>
        <div v-if="team.rank" class="h">
          <span class="i">Rank</span>
          <span class="j">#{{ team.rank }}</span>
          <span v-if="team.rankPoints" class="k">{{ team.rankPoints }} pts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/scoretap.css';
</style>

<style scoped>
.a {
	min-height: 120px;
	display: flex;
	align-items: center;
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
}

.b {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 12px;
}

.c {
	background: var(--st3-surface);
	border: 1px solid var(--st3-border);
	border-radius: var(--st3-radius);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	transition: border-color 0.15s;
}
.c:hover {
	border-color: var(--st3-muted);
}

.d {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.e {
	font-family: var(--st3-font-score);
	font-size: 16px;
	font-weight: 700;
	color: var(--st3-text);
}
.c[data-1="cs2"] .e { color: var(--st3-cs2); }
.c[data-1="valorant"] .e { color: var(--st3-valorant); }
.c[data-1="lol"] .e { color: var(--st3-lol); }
.c[data-1="dota2"] .e { color: var(--st3-dota2); }
.c[data-1="rl"] .e { color: var(--st3-rl); }

.f {
	display: inline-block;
	font-family: var(--st3-font-ui);
	font-size: 9px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.07em;
	padding: 2px 6px;
	border-radius: 4px;
	background: var(--st3-surface2);
	color: var(--st3-muted);
}
.f::before {
	content: attr(data-2);
}
.c[data-1="cs2"] .f { color: var(--st3-cs2); }
.c[data-1="valorant"] .f { color: var(--st3-valorant); }
.c[data-1="lol"] .f { color: var(--st3-lol); }
.c[data-1="dota2"] .f { color: var(--st3-dota2); }
.c[data-1="rl"] .f { color: var(--st3-rl); }

.g {
	font-family: var(--st3-font-ui);
	font-size: 13px;
	font-weight: 500;
	color: var(--st3-text);
	line-height: 1.3;
}

.h {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: auto;
}

.i {
	font-family: var(--st3-font-ui);
	font-size: 10px;
	color: var(--st3-muted);
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.j {
	font-family: var(--st3-font-score);
	font-size: 13px;
	font-weight: 700;
	color: var(--st3-text);
}

.k {
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
	margin-left: auto;
}
</style>
