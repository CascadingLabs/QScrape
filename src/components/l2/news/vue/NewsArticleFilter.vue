<!--
  @qscrape L2 / vue / news / island
  @component NewsArticleFilter
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { articles, categories } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const ready = ref(false);
const active = ref<string | null>(null);

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

function _pickCat(cat: string | null) {
	const url = new URL(window.location.href);
	if (cat) {
		url.searchParams.set('cat', cat);
	} else {
		url.searchParams.delete('cat');
	}
	url.searchParams.delete('page');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('news:cat', { detail: cat }));
}

const onCat = (e: Event) => {
	active.value = (e as CustomEvent<string | null>).detail;
};
const onPop = () => {
	active.value = getUrlCat();
};

onMounted(() => {
	active.value = getUrlCat();
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

const _allCats = [null, ...categories] as (string | null)[];
function _countFor(cat: string | null) {
	return cat
		? articles.filter((a) => a.category === cat).length
		: articles.length;
}
</script>
<template>
  <div
    v-if="!ready"
    style="padding: 12px 24px; color: #888; font-family: system-ui"
  >
    Loading…
  </div>
  <div
    v-else
    data-component="news-article-filter"
    data-framework="vue"
    style="
      padding: 12px 0;
      border-bottom: 2px solid var(--hn-border);
      margin-bottom: 4px;
    "
  >
    <div
      style="
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
      "
    >
      <button
        v-for="cat in allCats"
        :key="cat ?? 'all'"
        type="button"
        :data-category="cat ?? 'all'"
        :data-count="countFor(cat)"
        @click="pickCat(cat)"
        :style="{
          padding: '5px 12px',
          border: `1px solid ${active === cat ? 'var(--hn-accent)' : 'var(--hn-border)'}`,
          borderRadius: 'var(--hn-radius)',
          background: active === cat ? 'var(--hn-accent)' : 'transparent',
          color: active === cat ? '#fff' : 'var(--hn-text)',
          cursor: 'pointer',
          fontFamily: 'var(--hn-font-ui)',
          fontSize: '13px',
          fontWeight: active === cat ? '600' : '400',
        }"
      >
        {{ cat ?? 'All' }}
        <span style="opacity: 0.65; font-size: 11px">({{ countFor(cat) }})</span>
      </button>
    </div>
  </div>
</template>
