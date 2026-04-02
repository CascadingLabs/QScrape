<!--
  @qscrape L2 / svelte / news / island
  @component NewsArticleGrid
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { articles, formatDate, getByCategory } from '../../../../data/news/articles';
  import '../../../../styles/l2/news.css';

  const PER_PAGE = 8;
  let ready = false;
  let cat: string | null = null;
  let visibleCount = PER_PAGE;

  $: all = cat ? getByCategory(cat) : articles;
  $: items = all.slice(0, visibleCount);

  function getUrlState() {
    return { cat: new URLSearchParams(window.location.search).get('cat') };
  }

  function onCat(e: Event) {
    cat = (e as CustomEvent<string | null>).detail;
    visibleCount = PER_PAGE;
  }
  function onPop() {
    cat = getUrlState().cat;
    visibleCount = PER_PAGE;
  }

  onMount(() => {
    cat = getUrlState().cat;
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
  <div style="padding:40px 24px;color:#888;font-family:system-ui">Loading…</div>
{:else}
  <div data-component="news-article-grid" data-framework="svelte">
    <div
      style="margin-bottom:12px;font-size:13px;color:var(--hn-muted);font-family:var(--hn-font-ui)"
    >
      {all.length} article{all.length !== 1 ? 's' : ''}{cat ? ` in ${cat}` : ''}
    </div>
    <div
      style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px"
    >
      {#each items as a (a.id)}
        <article
          data-article-id={a.id}
          data-category={a.category}
          style="border:1px solid var(--hn-border);border-radius:var(--hn-radius);overflow:hidden;background:var(--hn-surface);cursor:pointer"
          on:click={() => {
            window.location.href = `/l2/news/?id=${a.id}`;
          }}
          on:keydown={(e) => e.key === 'Enter' && (window.location.href = `/l2/news/?id=${a.id}`)}
          role="button"
          tabindex="0"
        >
          <img
            src={a.image}
            alt={a.imageCaption}
            width="280"
            height="160"
            loading="lazy"
            style="width:100%;height:140px;object-fit:cover;display:block"
          />
          <div style="padding:12px">
            <div
              style="font-size:10px;font-weight:700;color:var(--hn-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px"
              data-category={a.category}
            >
              {a.category}
            </div>
            <h3
              style="font-family:var(--hn-font-display);font-size:15px;font-weight:600;color:var(--hn-text);line-height:1.3;margin-bottom:6px"
            >
              {a.headline}
            </h3>
            <div
              style="font-size:12px;color:var(--hn-muted);font-family:var(--hn-font-ui)"
            >
              {a.author} · {formatDate(a.published)}
            </div>
          </div>
        </article>
      {/each}
    </div>
    {#if visibleCount < all.length}
      <div style="text-align:center;margin-top:24px">
        <button
          type="button"
          on:click={() => (visibleCount += PER_PAGE)}
          style="padding:8px 20px;border:1px solid var(--hn-border);border-radius:var(--hn-radius);background:transparent;color:var(--hn-accent);cursor:pointer;font-family:var(--hn-font-ui);font-size:13px"
        >
          Load more ({all.length - visibleCount} remaining)
        </button>
      </div>
    {/if}
  </div>
{/if}
