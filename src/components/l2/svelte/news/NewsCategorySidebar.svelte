<!--
  @qscrape L2 / svelte / news / island
  @component NewsCategorySidebar
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { categories } from '../../../../data/news/articles';
  import '../../../../styles/l2/news.css';

  const allCats = ['All', ...categories];
  let ready = false;
  let activeCat = 'All';

  function navigate(cat: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    if (cat === 'All') {
      url.searchParams.delete('cat');
    } else {
      url.searchParams.set('cat', cat);
    }
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('news:cat', { detail: cat === 'All' ? null : cat }));
    window.scrollTo(0, 0);
  }

  function handleClick(cat: string) {
    activeCat = cat;
    navigate(cat);
  }

  function onCat(e: Event) {
    activeCat = (e as CustomEvent<string | null>).detail ?? 'All';
  }

  function onPop() {
    const c = new URLSearchParams(window.location.search).get('cat');
    activeCat = c ?? 'All';
  }

  onMount(() => {
    const cat = new URLSearchParams(window.location.search).get('cat');
    if (cat) {
      activeCat = cat;
    }
    fakeGet(null).then(() => { ready = true; });
    window.addEventListener('news:cat', onCat);
    window.addEventListener('popstate', onPop);
  });

  onDestroy(() => {
    window.removeEventListener('news:cat', onCat);
    window.removeEventListener('popstate', onPop);
  });
</script>

{#if !ready}
  <div class="hn-loading">Loading…</div>
{:else}
  <div data-component="news-category-sidebar" data-framework="svelte" class="hn-catbar">
    <div class="hn-catbar-header">
      <h3 class="hn-catbar-title">Sections</h3>
    </div>
    <ul class="hn-catbar-list">
      {#each allCats as cat (cat)}
        <li>
          <button
            type="button"
            data-category={cat}
            class={`hn-catbar-btn${activeCat === cat ? ' hn-catbar-btn-active' : ''}`}
            on:click={() => handleClick(cat)}
          >{cat}</button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .hn-loading { padding: 12px; color: #888; font-family: system-ui; }
  .hn-catbar { border: 1px solid var(--hn-border); border-radius: var(--hn-radius); overflow: hidden; background: var(--hn-surface); }
  .hn-catbar-header { background: var(--hn-masthead-bg); padding: 10px 14px; }
  .hn-catbar-title { font-family: var(--hn-font-display); font-size: 12px; font-weight: 700; color: var(--hn-masthead-text); text-transform: uppercase; letter-spacing: 0.08em; }
  .hn-catbar-list { list-style: none; }
  .hn-catbar-btn { width: 100%; text-align: left; background: none; border: none; border-bottom: 1px solid var(--hn-border); padding: 9px 14px; cursor: pointer; font-family: var(--hn-font-ui); font-size: 13px; color: var(--hn-text); }
  .hn-catbar-btn:hover { background: var(--hn-border); }
  .hn-catbar-btn-active { background: var(--hn-accent) !important; color: #fff; }
</style>
