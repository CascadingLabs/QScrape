<!--
  @qscrape L2 / vue / news / island
  @component NewsArticleFeed
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import {
  articles,
  formatDate,
  formatDateTime,
  getByCategory,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const PER_PAGE = 6;

const ready = ref(false);
const view = ref<'list' | 'detail'>('list');
const currentId = ref<string | null>(null);
const cat = ref<string | null>(null);
const visibleCount = ref(PER_PAGE);

const currentArticle = computed(() => articles.find((a) => a.id === currentId.value) ?? null);
const articleDateStr = computed(() => currentArticle.value ? formatDateTime(currentArticle.value.published) : '');
const allFiltered = computed(() => cat.value ? getByCategory(cat.value) : articles);
const items = computed(() =>
  allFiltered.value
    .slice(0, visibleCount.value)
    .map((a) => ({ ...a, dateStr: formatDate(a.published) })),
);

function goToArticle(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('id', id);
  url.searchParams.delete('cat');
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
  window.scrollTo(0, 0);
}

function getUrlState() {
  const p = new URLSearchParams(window.location.search);
  return { id: p.get('id'), cat: p.get('cat') };
}

function onPop() {
  const { id: i, cat: c } = getUrlState();
  if (i) {
    view.value = 'detail';
    currentId.value = i;
  } else {
    view.value = 'list';
    cat.value = c;
    visibleCount.value = PER_PAGE;
  }
}

function onCat(e: Event) {
  cat.value = (e as CustomEvent<string | null>).detail;
  view.value = 'list';
  visibleCount.value = PER_PAGE;
}

function onArticle(e: Event) {
  currentId.value = (e as CustomEvent<string>).detail;
  view.value = 'detail';
}

onMounted(() => {
  const { id, cat: urlCat } = getUrlState();
  if (id) {
    view.value = 'detail';
    currentId.value = id;
  }
  cat.value = urlCat;
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('news:cat', onCat);
  window.addEventListener('news:article', onArticle);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('news:cat', onCat);
  window.removeEventListener('news:article', onArticle);
});
</script>

<template>
  <div v-if="!ready" class="hn-loading">Loading…</div>

  <!-- Article detail view -->
  <div v-else-if="view === 'detail' && currentArticle" :data-component="'news-article-detail'" :data-article-id="currentArticle.id" class="hn-detail">
    <button type="button" class="hn-back-btn" @click="$router ? $router.back() : history.back()">← Back to articles</button>
    <div :data-category="currentArticle.category" class="hn-detail-cat">{{ currentArticle.category }}</div>
    <span v-if="currentArticle.breaking" class="hn-breaking-tag">BREAKING</span>
    <h1 class="hn-detail-headline">{{ currentArticle.headline }}</h1>
    <div class="hn-detail-byline">
      <span :data-author="currentArticle.author">{{ currentArticle.author }}</span>
      <span>{{ currentArticle.byline }}</span>
      <time :datetime="currentArticle.published">{{ articleDateStr }}</time>
    </div>
    <figure class="hn-detail-figure">
      <img :src="currentArticle.image" :alt="currentArticle.imageCaption" width="680" height="380" class="hn-detail-img" />
      <figcaption class="hn-detail-caption">{{ currentArticle.imageCaption }} <em>{{ currentArticle.imageCredit }}</em></figcaption>
    </figure>
    <p class="hn-detail-lead">{{ currentArticle.excerpt }}</p>
    <p class="hn-detail-body">The Mountainhome Herald continues to follow developments related to this story. This report will be updated as additional information becomes available from official sources and correspondents in the field.</p>
    <div v-if="currentArticle.tags.length" class="hn-detail-tags">
      <span v-for="tag in currentArticle.tags" :key="tag" class="hn-tag">{{ tag }}</span>
    </div>
  </div>

  <!-- List view -->
  <div v-else data-component="news-article-feed" data-framework="vue">
    <div class="hn-feed-count">{{ allFiltered.length }} article{{ allFiltered.length !== 1 ? 's' : '' }}{{ cat ? ` in ${cat}` : '' }}</div>
    <div class="hn-feed-list">
      <article
        v-for="a in items"
        :key="a.id"
        :data-article-id="a.id"
        :data-category="a.category"
        class="hn-feed-item"
        @click="goToArticle(a.id)"
      >
        <img :src="a.image" :alt="a.imageCaption" width="160" height="100" loading="lazy" class="hn-feed-img" />
        <div class="hn-feed-body">
          <div :data-category="a.category" class="hn-feed-cat">{{ a.category }}</div>
          <h3 class="hn-feed-headline">{{ a.headline }}</h3>
          <p class="hn-feed-excerpt">{{ a.excerpt }}</p>
          <div class="hn-feed-meta">{{ a.author }} · {{ a.dateStr }}</div>
        </div>
      </article>
    </div>
    <div v-if="visibleCount < allFiltered.length" style="text-align: center; margin-top: 24px;">
      <button
        type="button"
        class="hn-load-more-btn"
        @click="visibleCount += PER_PAGE"
      >Load more ({{ allFiltered.length - visibleCount }} remaining)</button>
    </div>
  </div>
</template>

<style scoped>
.hn-loading { padding: 40px 24px; color: #888; font-family: system-ui; }
.hn-detail { padding: 0 0 32px; }
.hn-back-btn { background: none; border: none; color: var(--hn-accent); cursor: pointer; font-family: var(--hn-font-ui); font-size: 13px; padding: 0; margin-bottom: 20px; display: block; }
.hn-detail-cat { font-size: 11px; font-weight: 700; color: var(--hn-accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.hn-breaking-tag { font-size: 10px; font-weight: 700; background: var(--hn-accent); color: #fff; padding: 2px 6px; border-radius: var(--hn-radius); margin-bottom: 8px; display: inline-block; }
.hn-detail-headline { font-family: var(--hn-font-display); font-size: 28px; font-weight: 700; color: var(--hn-text); line-height: 1.2; margin-bottom: 12px; }
.hn-detail-byline { display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px; color: var(--hn-muted); margin-bottom: 20px; font-family: var(--hn-font-ui); border-bottom: 1px solid var(--hn-border); padding-bottom: 16px; }
.hn-detail-figure { margin-bottom: 24px; }
.hn-detail-img { width: 100%; border-radius: var(--hn-radius); }
.hn-detail-caption { font-size: 12px; color: var(--hn-muted); margin-top: 8px; font-family: var(--hn-font-ui); }
.hn-detail-lead { font-family: var(--hn-font-body); font-size: 17px; line-height: 1.7; color: var(--hn-text); margin-bottom: 16px; }
.hn-detail-body { font-family: var(--hn-font-body); font-size: 16px; line-height: 1.7; color: var(--hn-text); margin-bottom: 16px; }
.hn-detail-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--hn-border); }
.hn-tag { font-size: 11px; padding: 3px 8px; border: 1px solid var(--hn-border); border-radius: var(--hn-radius); color: var(--hn-muted); font-family: var(--hn-font-ui); }
.hn-feed-count { margin-bottom: 16px; font-size: 13px; color: var(--hn-muted); font-family: var(--hn-font-ui); }
.hn-feed-list { display: flex; flex-direction: column; gap: 20px; }
.hn-feed-item { display: flex; gap: 16px; cursor: pointer; padding-bottom: 20px; border-bottom: 1px solid var(--hn-border); }
.hn-feed-item:hover .hn-feed-headline { color: var(--hn-accent); }
.hn-feed-img { width: 140px; height: 90px; object-fit: cover; border-radius: var(--hn-radius); flex-shrink: 0; }
.hn-feed-cat { font-size: 10px; font-weight: 700; color: var(--hn-accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
.hn-feed-headline { font-family: var(--hn-font-display); font-size: 16px; font-weight: 600; color: var(--hn-text); line-height: 1.3; margin-bottom: 6px; }
.hn-feed-excerpt { font-size: 13px; color: var(--hn-muted); line-height: 1.5; font-family: var(--hn-font-body); margin-bottom: 6px; }
.hn-feed-meta { font-size: 12px; color: var(--hn-muted); font-family: var(--hn-font-ui); }
.hn-load-more-btn { padding: 8px 20px; border: 1px solid var(--hn-border); border-radius: var(--hn-radius); background: transparent; color: var(--hn-accent); cursor: pointer; font-family: var(--hn-font-ui); font-size: 13px; }
</style>
