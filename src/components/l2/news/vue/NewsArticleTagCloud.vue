<!--
  @qscrape L2 / vue / news / island
  @component NewsArticleTagCloud
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { articles } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const ready = ref(false);
const activeCat = ref<string | null>(null);

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

const onCat = (e: Event) => {
	activeCat.value = (e as CustomEvent<string | null>).detail;
};
const onPop = () => {
	activeCat.value = getUrlCat();
};

onMounted(() => {
	activeCat.value = getUrlCat();
	fakeGet(null).then(() => {
		ready.value = true;
	});
	window.addEventListener('news:cat', onCat);
	window.addEventListener('popstate', onPop);
});
onUnmounted(() => {
	window.removeEventListener('news:cat', onCat);
	window.removeEventListener('popstate', onPop);
});

const tagCounts: Record<string, number> = {};
for (const a of articles) {
	for (const t of a.tags) {
		tagCounts[t] = (tagCounts[t] ?? 0) + 1;
	}
}
const allTags = Object.entries(tagCounts)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 30);
const maxCount = allTags[0]?.[1] ?? 1;
function _tagSize(count: number) {
	return 11 + Math.round((count / maxCount) * 6);
}
</script>
<template>
  <div v-if="!ready" style="padding: 24px; color: #888; font-family: system-ui">
    Loading…
  </div>
  <div
    v-else
    data-component="news-article-tagcloud"
    data-framework="vue"
    style="
      background: var(--hn-surface);
      border: 1px solid var(--hn-border);
      border-radius: var(--hn-radius);
      padding: 16px;
    "
  >
    <h3
      style="
        font-family: var(--hn-font-display);
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--hn-text);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      "
    >
      Topics
    </h3>
    <div style="display: flex; flex-wrap: wrap; gap: 6px">
      <span
        v-for="[tag, count] in allTags"
        :key="tag"
        :data-tag="tag"
        :data-count="count"
        :style="{
          fontSize: tagSize(count) + 'px',
          color: 'var(--hn-accent)',
          cursor: 'default',
          fontFamily: 'var(--hn-font-ui)',
        }"
      >
        {{ tag }}
        <span style="font-size: 10px; color: var(--hn-muted)">({{ count }})</span>
      </span>
    </div>
    <div
      v-if="activeCat"
      style="
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--hn-border);
        font-size: 12px;
        color: var(--hn-muted);
        font-family: var(--hn-font-ui);
      "
    >
      Filtered: <strong>{{ activeCat }}</strong>
    </div>
  </div>
</template>
