<!--
  @qscrape L2 / svelte / news / island
  @component NewsArticleTagCloud
-->
<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fakeGet } from '../../../../data/api';
import { articles } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

let _ready = false;
let _activeCat: string | null = null;

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}
function onCat(e: Event) {
	_activeCat = (e as CustomEvent<string | null>).detail;
}
function onPop() {
	_activeCat = getUrlCat();
}

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

onMount(() => {
	_activeCat = getUrlCat();
	fakeGet(null).then(() => {
		_ready = true;
	});
	window.addEventListener('news:cat', onCat);
	window.addEventListener('popstate', onPop);
});
onDestroy(() => {
	window.removeEventListener('news:cat', onCat);
	window.removeEventListener('popstate', onPop);
});
</script>

{#if !ready}
  <div style="padding:24px;color:#888;font-family:system-ui">Loading…</div>
{:else}
  <div
    data-component="news-article-tagcloud"
    data-framework="svelte"
    style="background:var(--hn-surface);border:1px solid var(--hn-border);border-radius:var(--hn-radius);padding:16px"
  >
    <h3
      style="font-family:var(--hn-font-display);font-size:14px;font-weight:700;margin-bottom:12px;color:var(--hn-text);text-transform:uppercase;letter-spacing:0.06em"
    >
      Topics
    </h3>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      {#each allTags as [tag, count] (tag)}
        <span
          data-tag={tag}
          data-count={count}
          style="font-size:{tagSize(count)}px;color:var(--hn-accent);cursor:default;font-family:var(--hn-font-ui)"
        >
          {tag} <span style="font-size:10px;color:var(--hn-muted)">({count})</span>
        </span>
      {/each}
    </div>
    {#if activeCat}
      <div
        style="margin-top:16px;padding-top:12px;border-top:1px solid var(--hn-border);font-size:12px;color:var(--hn-muted);font-family:var(--hn-font-ui)"
      >
        Filtered: <strong>{activeCat}</strong>
      </div>
    {/if}
  </div>
{/if}
