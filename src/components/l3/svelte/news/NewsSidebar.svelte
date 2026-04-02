<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { categories, getByCategory } from '../../../../data/news/articles';

type CatData = { name: string; count: number; fakeCount: number };

let _catData: CatData[] | null = null;

onMount(() => {
	const data: CatData[] = categories.map((cat) => ({
		name: cat,
		count: getByCategory(cat).length,
		fakeCount: getByCategory(cat).length + Math.floor(cat.length % 5) + 3,
	}));
	fakeGetMs(data, 800, 250).then((d) => {
		_catData = d;
	});
});
</script>

<div data-island="svelte-sidebar">
  {#if !catData}
    <div class="a">Loading…</div>
  {:else}
    <div class="b">
      <h3 class="c">Browse by Category</h3>
      <ul class="d">
        {#each catData as cat}
          <li class="e">
            <a href="/l3/news/articles/?cat={encodeURIComponent(cat.name)}" class="f">
              {cat.name}
            </a>
            <span class="g">
              <span class="h">{cat.count}</span>
              <span class="i" aria-hidden="true">{cat.fakeCount}</span>
            </span>
          </li>
        {/each}
      </ul>
      <a href="/l3/news/articles/" class="j">All articles →</a>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .a {
    min-height: 120px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .b {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--hn3-surface2);
    border: 1px solid var(--hn3-border);
    padding: 20px;
  }

  .c {
    font-family: var(--hn3-font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
    color: var(--hn3-text);
    margin: 0 0 4px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--hn3-accent);
  }

  .d {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .e {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--hn3-border);
  }
  .e:last-child {
    border-bottom: none;
  }

  .f {
    font-family: var(--hn3-font-body);
    font-size: 14px;
    color: var(--hn3-text);
    text-decoration: none;
  }
  .f:hover {
    color: var(--hn3-accent);
  }

  .g {
    position: relative;
    display: inline-block;
    min-width: 24px;
    text-align: right;
  }
  .h {
    font-family: var(--hn3-font-body);
    font-size: 13px;
    color: var(--hn3-muted);
    position: relative;
    z-index: 1;
  }
  .i {
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

  .j {
    font-family: var(--hn3-font-body);
    font-size: 13px;
    color: var(--hn3-accent);
    text-decoration: none;
    font-weight: 600;
    margin-top: 4px;
  }
  .j:hover {
    text-decoration: underline;
  }
</style>
