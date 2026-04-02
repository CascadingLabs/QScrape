<!--
  @qscrape L2 / vue / news / island
  @component NewsBreakingTicker
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { formatDate, getBreaking, getLatest } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const ready = ref(false);
const breaking = getBreaking();
const topHeadlines = getLatest(3).map((a) => ({ ...a, dateStr: formatDate(a.published) }));

function goToArticle(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('id', id);
  url.searchParams.delete('cat');
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
  window.scrollTo(0, 0);
}

onMounted(() => {
  fakeGet(null).then(() => { ready.value = true; });
});
</script>

<template>
  <div v-if="!ready" class="hn-loading">Loading…</div>
  <div v-else data-component="news-breaking-ticker" data-framework="vue">
    <div v-if="breaking.length > 0" class="hn-ticker-bar">
      <span class="hn-ticker-label">Breaking</span>
      <span v-for="(a, i) in breaking" :key="a.id">
        <span v-if="i > 0" class="hn-ticker-sep">·</span>
        <button type="button" class="hn-ticker-btn" @click="goToArticle(a.id)">{{ a.headline }}</button>
      </span>
    </div>
    <div class="hn-top-headlines">
      <h3 class="hn-top-title">Top Headlines</h3>
      <ul class="hn-top-list">
        <li v-for="a in topHeadlines" :key="a.id" :data-article-id="a.id" class="hn-top-item">
          <button type="button" class="hn-top-btn" @click="goToArticle(a.id)">{{ a.headline }}</button>
          <div class="hn-top-meta">
            <span :data-category="a.category">{{ a.category }}</span> · <span>{{ a.dateStr }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.hn-loading { padding: 12px; color: #888; font-family: system-ui; }
.hn-ticker-bar {
  background: var(--hn-accent);
  padding: 8px 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.hn-ticker-label {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}
.hn-ticker-sep { color: rgba(255,255,255,0.5); margin: 0 4px; }
.hn-ticker-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: var(--hn-font-ui);
  font-size: 13px;
  padding: 0;
}
.hn-top-headlines { padding: 16px 20px; }
.hn-top-title {
  font-family: var(--hn-font-display);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--hn-muted);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--hn-border);
  padding-bottom: 8px;
}
.hn-top-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.hn-top-btn {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--hn-font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--hn-text);
  line-height: 1.35;
  padding: 0;
  width: 100%;
}
.hn-top-btn:hover { color: var(--hn-accent); }
.hn-top-meta { font-size: 12px; color: var(--hn-muted); margin-top: 4px; font-family: var(--hn-font-ui); }
</style>
