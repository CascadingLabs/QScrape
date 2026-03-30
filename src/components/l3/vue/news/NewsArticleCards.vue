<script setup lang="ts">
// @qscrape L3 / vue island / news — article card grid (articles page)
// Anti-bot: category badge via CSS ::before pseudo-element
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	articles as allArticles,
	getByCategory,
} from '../../../../data/news/articles';

const items = ref<ArticleMeta[] | null>(null);
const activeCat = ref<string | null>(null);

onMounted(() => {
	const cat = new URLSearchParams(window.location.search).get('cat');
	activeCat.value = cat;
	const data = cat ? getByCategory(cat) : allArticles;
	fakeGetMs(data, 600, 250).then((d) => {
		items.value = d;
	});
});
</script>

<template>
  <div data-island="vue-article-cards">
    <div v-if="!items" class="hn3-cards-loading">Loading…</div>
    <template v-else>
      <p class="hn3-cards-count">{{ items.length }} article{{ items.length !== 1 ? 's' : '' }}</p>
      <div class="hn3-cards-grid">
        <article
          v-for="a in items"
          :key="a.id"
          class="hn3-card"
          :data-article-id="a.id"
        >
          <a :href="`/l3/news/article/${a.id}/`" class="hn3-card-img-link">
            <img :src="a.image" :alt="a.headline" class="hn3-card-img" loading="lazy" />
          </a>
          <div class="hn3-card-body">
            <!-- Anti-bot: category via pseudo-element -->
            <span class="hn3-cat" :data-cat="a.category"></span>
            <h3 class="hn3-card-headline">
              <a :href="`/l3/news/article/${a.id}/`">{{ a.headline }}</a>
            </h3>
            <p class="hn3-card-excerpt">{{ a.excerpt }}</p>
            <div class="hn3-card-meta">
              <span>{{ a.author }}</span>
              <span>{{ formatDate(a.published) }}</span>
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style>
@import '../../../../styles/l3/news.css';

.hn3-cards-loading {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.hn3-cards-count {
	font-family: var(--hn3-font-body);
	font-size: 13px;
	color: var(--hn3-muted);
	margin: 0 0 16px;
}

.hn3-cards-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
}
@media (max-width: 900px) {
	.hn3-cards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
	.hn3-cards-grid { grid-template-columns: 1fr; }
}

.hn3-card {
	background: var(--hn3-surface2);
	border: 1px solid var(--hn3-border);
	overflow: hidden;
}

.hn3-card-img-link { display: block; }
.hn3-card-img {
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	display: block;
}

.hn3-card-body {
	padding: 14px;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.hn3-cat {
	display: inline-block;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--hn3-accent);
}
.hn3-cat::before {
	content: attr(data-cat);
}

.hn3-card-headline {
	font-family: var(--hn3-font-display);
	font-size: 15px;
	font-weight: 700;
	line-height: 1.35;
	margin: 0;
}
.hn3-card-headline a {
	color: var(--hn3-text);
	text-decoration: none;
}
.hn3-card-headline a:hover {
	color: var(--hn3-accent);
}

.hn3-card-excerpt {
	font-family: var(--hn3-font-body);
	font-size: 12px;
	color: var(--hn3-muted);
	line-height: 1.5;
	margin: 0;
}

.hn3-card-meta {
	display: flex;
	justify-content: space-between;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	color: var(--hn3-muted);
	margin-top: auto;
}
</style>
