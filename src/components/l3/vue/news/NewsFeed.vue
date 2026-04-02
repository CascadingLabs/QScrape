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
  <div>
    <div v-if="!articles" class="hn3-feed-loading">Loading…</div>
    <div v-else class="hn3-feed">
      <article
        v-for="a in articles"
        :key="a.id"
        class="hn3-feed-item"
        :data-article-id="a.id"
      >
        <a :href="`/l3/news/article/${a.id}/`" class="hn3-feed-img-link">
          <img :src="a.image" :alt="a.headline" class="hn3-feed-img" loading="lazy" />
        </a>
        <div class="hn3-feed-body">
          <span class="hn3-cat" :data-cat="a.category"></span>
          <h2 class="hn3-feed-headline">
            <a :href="`/l3/news/article/${a.id}/`">{{ a.headline }}</a>
          </h2>
          <p class="hn3-feed-excerpt">{{ a.excerpt }}</p>
          <div class="hn3-feed-meta">
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

.hn3-feed-loading {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.hn3-feed {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.hn3-feed-item {
	display: grid;
	grid-template-columns: 140px 1fr;
	gap: 16px;
	padding: 20px 0;
	border-bottom: 1px solid var(--hn3-border);
}
.hn3-feed-item:last-child {
	border-bottom: none;
}

.hn3-feed-img-link {
	display: block;
	flex-shrink: 0;
}
.hn3-feed-img {
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: cover;
}

.hn3-feed-body {
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

.hn3-feed-headline {
	font-family: var(--hn3-font-display);
	font-size: 16px;
	font-weight: 700;
	line-height: 1.35;
	letter-spacing: -0.2px;
	margin: 0;
}
.hn3-feed-headline a {
	color: var(--hn3-text);
	text-decoration: none;
}
.hn3-feed-headline a:hover {
	color: var(--hn3-accent);
}

.hn3-feed-excerpt {
	font-family: var(--hn3-font-body);
	font-size: 13px;
	color: var(--hn3-muted);
	line-height: 1.5;
	margin: 0;
}

.hn3-feed-meta {
	display: flex;
	gap: 12px;
	font-family: var(--hn3-font-body);
	font-size: 11px;
	color: var(--hn3-muted);
	margin-top: auto;
}
</style>
