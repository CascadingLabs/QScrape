<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { type ArticleMeta, getLatest } from '../../../../data/news/articles';

const articles = ref<ArticleMeta[] | null>(null);

onMounted(() => {
	fakeGetMs(getLatest(6), 600, 250).then((data) => {
		articles.value = data;
	});
});
</script>

<template>
  <div data-island="vue-feed">
    <div v-if="!articles" class="a">Loading…</div>
    <div v-else class="b">
      <article
        v-for="a in articles"
        :key="a.id"
        class="c"
        :data-0="a.id"
      >
        <a :href="`/l3/news/article/${a.id}/`" class="d">
          <img :src="a.image" :alt="a.headline" class="e" loading="lazy" />
        </a>
        <div class="f">
          <span class="g" :data-1="a.category"></span>
          <h2 class="h">
            <a :href="`/l3/news/article/${a.id}/`">{{ a.headline }}</a>
          </h2>
          <p class="i">{{ a.excerpt }}</p>
          <div class="j">
            <span>{{ a.author }}</span>
            <span>{{ formatDate(a.published) }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/news.css';

.a {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.b {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.c {
	display: grid;
	grid-template-columns: 140px 1fr;
	gap: 16px;
	padding: 20px 0;
	border-bottom: 1px solid var(--hn3-border);
}
.c:last-child {
	border-bottom: none;
}

.d {
	display: block;
	flex-shrink: 0;
}
.e {
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: cover;
}

.f {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.g {
	display: inline-block;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--hn3-accent);
}
.g::before {
	content: attr(data-1);
}

.h {
	font-family: var(--hn3-font-display);
	font-size: 16px;
	font-weight: 700;
	line-height: 1.35;
	letter-spacing: -0.2px;
	margin: 0;
}
.h a {
	color: var(--hn3-text);
	text-decoration: none;
}
.h a:hover {
	color: var(--hn3-accent);
}

.i {
	font-family: var(--hn3-font-body);
	font-size: 13px;
	color: var(--hn3-muted);
	line-height: 1.5;
	margin: 0;
}

.j {
	display: flex;
	gap: 12px;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	color: var(--hn3-muted);
	margin-top: auto;
}
</style>
