<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	articles as allArticles,
	getByCategory,
} from '../../../../data/news/articles';

const items = ref<ArticleMeta[] | null>(null);
const activeCat = ref<string | null>(null);

function formatDate(d: string) {
	return new Date(d).toLocaleDateString('en-CA');
}

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
    <div v-if="!items" class="a">Loading…</div>
    <template v-else>
      <p class="b">{{ items.length }} article{{ items.length !== 1 ? 's' : '' }}</p>
      <div class="c">
        <article
          v-for="a in items"
          :key="a.id"
          class="d"
          :data-0="a.id"
        >
          <a :href="`/l3/news/article/${a.id}/`" class="e">
            <img :src="a.image" :alt="a.headline" class="f" loading="lazy" />
          </a>
          <div class="g">
            <span class="h" :data-1="a.category"></span>
            <h3 class="i">
              <a :href="`/l3/news/article/${a.id}/`">{{ a.headline }}</a>
            </h3>
            <p class="j">{{ a.excerpt }}</p>
            <div class="k">
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
</style>

<style scoped>
.a {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.b {
	font-family: var(--hn3-font-body);
	font-size: 13px;
	color: var(--hn3-muted);
	margin: 0 0 16px;
}

.c {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
}
@media (max-width: 900px) {
	.c { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
	.c { grid-template-columns: 1fr; }
}

.d {
	background: var(--hn3-surface2);
	border: 1px solid var(--hn3-border);
	overflow: hidden;
}

.e { display: block; }
.f {
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	display: block;
}

.g {
	padding: 14px;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.h {
	display: inline-block;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--hn3-accent);
}
.h::before {
	content: attr(data-1);
}

.i {
	font-family: var(--hn3-font-display);
	font-size: 15px;
	font-weight: 700;
	line-height: 1.35;
	margin: 0;
}
.i a {
	color: var(--hn3-text);
	text-decoration: none;
}
.i a:hover {
	color: var(--hn3-accent);
}

.j {
	font-family: var(--hn3-font-body);
	font-size: 12px;
	color: var(--hn3-muted);
	line-height: 1.5;
	margin: 0;
}

.k {
	display: flex;
	justify-content: space-between;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	color: var(--hn3-muted);
	margin-top: auto;
}
</style>
