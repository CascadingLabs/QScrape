<script setup lang="ts">
// @qscrape L3 / vue island / scoretap — team card grid
// Anti-bot: game badge rendered via CSS ::before pseudo-element content
// element.textContent on .st3-card-game returns empty string;
// requires getComputedStyle(el,'::before').content to read the game label.
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
  <div>
    <div v-if="!allTeams" class="st3-cards-loading">Loading…</div>
    <div v-else class="st3-cards-grid">
      <div
        v-for="team in allTeams"
        :key="team.id"
        class="st3-team-card"
        :data-team-id="team.id"
        :data-game="team.game"
      >
        <div class="st3-card-top">
          <span class="st3-card-abbr">{{ team.abbr }}</span>
          <!-- Anti-bot: game label via pseudo-element, textContent empty -->
          <span class="st3-card-game" :data-game-label="gameLabel(team.game as Game)"></span>
        </div>
        <div class="st3-card-name">{{ team.name }}</div>
        <div v-if="team.rank" class="st3-card-rank">
          <span class="st3-rank-label">Rank</span>
          <span class="st3-rank-value">#{{ team.rank }}</span>
          <span v-if="team.rankPoints" class="st3-rank-pts">{{ team.rankPoints }} pts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/scoretap.css';

.st3-cards-loading {
	min-height: 120px;
	display: flex;
	align-items: center;
	color: var(--st3-muted);
	font-family: var(--st3-font-ui);
	font-size: 14px;
}

.st3-cards-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 12px;
}

.st3-team-card {
	background: var(--st3-surface);
	border: 1px solid var(--st3-border);
	border-radius: var(--st3-radius);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	transition: border-color 0.15s;
}
.st3-team-card:hover {
	border-color: var(--st3-muted);
}

.st3-card-top {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.st3-card-abbr {
	font-family: var(--st3-font-score);
	font-size: 16px;
	font-weight: 700;
	color: var(--st3-text);
}
.st3-team-card[data-game="cs2"] .st3-card-abbr { color: var(--st3-cs2); }
.st3-team-card[data-game="valorant"] .st3-card-abbr { color: var(--st3-valorant); }
.st3-team-card[data-game="lol"] .st3-card-abbr { color: var(--st3-lol); }
.st3-team-card[data-game="dota2"] .st3-card-abbr { color: var(--st3-dota2); }
.st3-team-card[data-game="rl"] .st3-card-abbr { color: var(--st3-rl); }

/* Anti-bot: game label text via ::before pseudo-element */
.st3-card-game {
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
.st3-card-game::before {
	content: attr(data-game-label);
}
.st3-team-card[data-game="cs2"] .st3-card-game { color: var(--st3-cs2); }
.st3-team-card[data-game="valorant"] .st3-card-game { color: var(--st3-valorant); }
.st3-team-card[data-game="lol"] .st3-card-game { color: var(--st3-lol); }
.st3-team-card[data-game="dota2"] .st3-card-game { color: var(--st3-dota2); }
.st3-team-card[data-game="rl"] .st3-card-game { color: var(--st3-rl); }

.st3-card-name {
	font-family: var(--st3-font-ui);
	font-size: 13px;
	font-weight: 500;
	color: var(--st3-text);
	line-height: 1.3;
}

.st3-card-rank {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: auto;
}

.st3-rank-label {
	font-family: var(--st3-font-ui);
	font-size: 10px;
	color: var(--st3-muted);
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.st3-rank-value {
	font-family: var(--st3-font-score);
	font-size: 13px;
	font-weight: 700;
	color: var(--st3-text);
}

.st3-rank-pts {
	font-family: var(--st3-font-ui);
	font-size: 11px;
	color: var(--st3-muted);
	margin-left: auto;
}
</style>
