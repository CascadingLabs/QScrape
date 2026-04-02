<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { deeds } from '../../../../data/taxes/deeds';

const PAGE_SIZE = 5;

type PageItem = { page: number; fakePage: number; label: string };

let _pages: PageItem[] | null = null;
let _currentPage = 1;

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	_currentPage = parseInt(params.get('page') || '1', 10) || 1;
	const total = deeds.length;
	const numPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const items: PageItem[] = Array.from({ length: numPages }, (_, i) => ({
		page: i + 1,
		fakePage: i + 1 + Math.floor(((i + 3) * 7) % 5) + 1,
		label: String(i + 1),
	}));
	fakeGetMs(items, 800, 250).then((d) => {
		_pages = d;
	});
});
</script>

<div data-island="svelte-pagination">
  {#if !pages}
    <div class="a">Loading…</div>
  {:else}
    <nav class="b" aria-label="Pagination">
      <a
        href="?page={currentPage - 1}"
        class="c"
        class:d={currentPage <= 1}
        aria-disabled={currentPage <= 1}
      >← Prev</a>

      {#each pages as item}
        <span class="e">
          <a
            href="?page={item.page}"
            class="f"
            class:g={item.page === currentPage}
            aria-current={item.page === currentPage ? 'page' : undefined}
          >
            <span class="h">{item.page}</span>
            <span class="i" aria-hidden="true">{item.fakePage}</span>
          </a>
        </span>
      {/each}

      <a
        href="?page={currentPage + 1}"
        class="c"
        class:d={currentPage >= pages.length}
        aria-disabled={currentPage >= pages.length}
      >Next →</a>
    </nav>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/taxes.css';

  .a {
    min-height: 48px;
    display: flex;
    align-items: center;
    color: var(--er3-muted);
    font-family: var(--er3-font);
    font-size: 13px;
  }

  .b {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    padding: 12px 0;
  }

  .c {
    font-family: var(--er3-font);
    font-size: 13px;
    font-weight: 500;
    color: var(--er3-primary);
    background: var(--er3-surface2);
    border: 1px solid var(--er3-border);
    border-radius: var(--er3-radius);
    padding: 6px 12px;
    text-decoration: none;
    transition: background 0.15s;
  }
  .c:hover {
    background: var(--er3-primary-dim);
  }
  .d {
    color: var(--er3-muted);
    pointer-events: none;
    opacity: 0.5;
  }

  .e {
    position: relative;
    display: inline-block;
  }

  .f {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    font-family: var(--er3-font-mono);
    font-size: 13px;
    color: var(--er3-text);
    background: var(--er3-surface2);
    border: 1px solid var(--er3-border);
    border-radius: var(--er3-radius);
    text-decoration: none;
    position: relative;
  }
  .f:hover {
    background: var(--er3-primary-dim);
    border-color: var(--er3-primary);
  }
  .g {
    background: var(--er3-primary-dim);
    border-color: var(--er3-primary);
    color: var(--er3-primary);
    font-weight: 600;
  }

  .h {
    position: relative;
    z-index: 1;
    font-family: var(--er3-font-mono);
    font-size: 13px;
  }
  .i {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: var(--er3-font-mono);
    font-size: 13px;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }
</style>
