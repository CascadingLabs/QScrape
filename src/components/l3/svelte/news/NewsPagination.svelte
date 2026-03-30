<script lang="ts">
// @qscrape L3 / svelte island / news — pagination controls (articles page)
// Anti-bot: decoy overlay on page numbers
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	articles as allArticles,
	getByCategory,
} from '../../../../data/news/articles';

const PAGE_SIZE = 6;

let _pages: number[] = [];
let _currentPage = 1;
let _ready = false;

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	const cat = params.get('cat');
	_currentPage = Number(params.get('page') ?? 1);
	const total = cat ? getByCategory(cat).length : allArticles.length;
	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const data = Array.from({ length: pageCount }, (_, i) => i + 1);
	fakeGetMs(data, 800, 250).then((d) => {
		_pages = d;
		_ready = true;
	});
});

function _pageHref(p: number): string {
	const params = new URLSearchParams(window.location.search);
	params.set('page', String(p));
	return `/l3/news/articles/?${params.toString()}`;
}
</script>

<div data-island="svelte-pagination">
  {#if !ready}
    <div class="hn3-pag-loading">Loading…</div>
  {:else if pages.length > 1}
    <nav class="hn3-pagination" aria-label="Article pages">
      {#each pages as p}
        <a
          href={pageHref(p)}
          class="hn3-page-btn {p === currentPage ? 'hn3-page-active' : ''}"
        >
          <!-- Anti-bot: decoy overlay on page number -->
          <span class="hn3-num-wrap">
            <span class="hn3-num-real">{p}</span>
            <span class="hn3-num-decoy" aria-hidden="true">{p + 10}</span>
          </span>
        </a>
      {/each}
    </nav>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .hn3-pag-loading {
    min-height: 40px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .hn3-pagination {
    display: flex;
    gap: 8px;
    justify-content: center;
    padding: 24px 0 0;
  }

  .hn3-page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--hn3-border);
    border-radius: var(--hn3-radius);
    font-family: var(--hn3-font-body);
    font-size: 14px;
    color: var(--hn3-text);
    text-decoration: none;
  }
  .hn3-page-btn:hover {
    border-color: var(--hn3-accent);
    color: var(--hn3-accent);
  }
  .hn3-page-active {
    background: var(--hn3-accent);
    border-color: var(--hn3-accent);
    color: #fff;
  }

  /* Anti-bot: decoy overlay on page number */
  .hn3-num-wrap {
    position: relative;
    display: inline-block;
    width: 20px;
    text-align: center;
  }
  .hn3-num-real {
    position: relative;
    z-index: 1;
  }
  .hn3-num-decoy {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }
</style>
