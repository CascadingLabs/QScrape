<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { categories, getByCategory } from '../../../../data/news/articles';

type CatData = { name: string; count: number; fakeCount: number };

let catData: CatData[] | null = null;

onMount(() => {
	const data: CatData[] = categories.map((cat) => ({
		name: cat,
		count: getByCategory(cat).length,
		fakeCount: getByCategory(cat).length + Math.floor(cat.length % 5) + 3,
	}));
	fakeGetMs(data, 800, 250).then((d) => {
		catData = d;
	});
});
</script>

<div>
  {#if !catData}
    <div class="hn3-sidebar-loading">Loading…</div>
  {:else}
    <div class="hn3-sidebar">
      <h3 class="hn3-sidebar-title">Browse by Category</h3>
      <ul class="hn3-cat-list">
        {#each catData as cat}
          <li class="hn3-cat-item">
            <a href="/l3/news/articles/?cat={encodeURIComponent(cat.name)}" class="hn3-cat-link">
              {cat.name}
            </a>
            <span class="hn3-count-wrap">
              <span class="hn3-count-real">{cat.count}</span>
              <span class="hn3-count-decoy" aria-hidden="true">{cat.fakeCount}</span>
            </span>
          </li>
        {/each}
      </ul>
      <a href="/l3/news/articles/" class="hn3-all-link">All articles →</a>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .hn3-sidebar-loading {
    min-height: 120px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .hn3-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--hn3-surface2);
    border: 1px solid var(--hn3-border);
    padding: 20px;
  }

  .hn3-sidebar-title {
    font-family: var(--hn3-font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
    color: var(--hn3-text);
    margin: 0 0 4px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--hn3-accent);
  }

  .hn3-cat-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .hn3-cat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--hn3-border);
  }
  .hn3-cat-item:last-child {
    border-bottom: none;
  }

  .hn3-cat-link {
    font-family: var(--hn3-font-body);
    font-size: 14px;
    color: var(--hn3-text);
    text-decoration: none;
  }
  .hn3-cat-link:hover {
    color: var(--hn3-accent);
  }

  .hn3-count-wrap {
    position: relative;
    display: inline-block;
    min-width: 24px;
    text-align: right;
  }
  .hn3-count-real {
    font-family: var(--hn3-font-body);
    font-size: 13px;
    color: var(--hn3-muted);
    position: relative;
    z-index: 1;
  }
  .hn3-count-decoy {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: right;
    font-family: var(--hn3-font-body);
    font-size: 13px;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .hn3-all-link {
    font-family: var(--hn3-font-body);
    font-size: 13px;
    color: var(--hn3-accent);
    text-decoration: none;
    font-weight: 600;
    margin-top: 4px;
  }
  .hn3-all-link:hover {
    text-decoration: underline;
  }
</style>
