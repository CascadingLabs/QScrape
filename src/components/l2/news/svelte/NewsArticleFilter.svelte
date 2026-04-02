<!--
  @qscrape L2 / svelte / news / island
  @component NewsArticleFilter
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { articles, categories } from '../../../../data/news/articles';
  import '../../../../styles/l2/news.css';

  let ready = false;
  let active: string | null = null;

  function getUrlCat() {
    return new URLSearchParams(window.location.search).get('cat');
  }

  function pickCat(cat: string | null) {
    const url = new URL(window.location.href);
    if (cat) { url.searchParams.set('cat', cat); }
    else { url.searchParams.delete('cat'); }
    url.searchParams.delete('page');
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('news:cat', { detail: cat }));
  }

  function onCat(e: Event) {
    active = (e as CustomEvent<string | null>).detail;
  }
  function onPop() {
    active = getUrlCat();
  }

  const allCats: (string | null)[] = [null, ...categories];
  function countFor(cat: string | null) {
    return cat ? articles.filter((a) => a.category === cat).length : articles.length;
  }

  onMount(() => {
    active = getUrlCat();
    fakeGet(null).then(() => {
      ready = true;
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
  <div style="padding:12px 24px;color:#888;font-family:system-ui">Loading…</div>
{:else}
  <div
    data-component="news-article-filter"
    data-framework="svelte"
    style="padding:12px 0;border-bottom:2px solid var(--hn-border);margin-bottom:4px"
  >
    <div
      style="display:flex;gap:4px;flex-wrap:wrap;max-width:1200px;margin:0 auto;padding:0 24px"
    >
      {#each allCats as cat (cat ?? 'all')}
        {@const count = countFor(cat)}
        {@const isActive = active === cat}
        <button
          type="button"
          data-category={cat ?? 'all'}
          data-count={count}
          on:click={() => pickCat(cat)}
          style="padding:5px 12px;border:1px solid {isActive
            ? 'var(--hn-accent)'
            : 'var(--hn-border)'};border-radius:var(--hn-radius);background:{isActive
            ? 'var(--hn-accent)'
            : 'transparent'};color:{isActive
            ? '#fff'
            : 'var(--hn-text)'};cursor:pointer;font-family:var(--hn-font-ui);font-size:13px;font-weight:{isActive
            ? '600'
            : '400'}"
        >
          {cat ?? 'All'} <span style="opacity:0.65;font-size:11px">({count})</span>
        </button>
      {/each}
    </div>
  </div>
{/if}
