<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	getArticleById,
} from '../../../../data/news/articles';

export let articleId: string;

let _article: ArticleMeta | null = null;

onMount(() => {
	const found = getArticleById(articleId);
	if (found) {
		fakeGetMs(found, 800, 250).then((d) => {
			_article = d;
		});
	}
});
</script>

<div data-island="svelte-article-image">
  {#if !article}
    <div class="a">Loading…</div>
  {:else}
    <figure class="b" data-0={article.id}>
      <img
        src={article.image}
        alt={article.headline}
        class="c"
      />
      <figcaption class="d">
        <span class="e">{article.imageCaption}</span>
        <span class="f">
          <span class="g">{article.imageCredit}</span>
          <span class="h" aria-hidden="true">Image courtesy of unknown archive</span>
        </span>
      </figcaption>
    </figure>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .a {
    min-height: 200px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .b {
    margin: 0;
  }

  .c {
    width: 100%;
    display: block;
    max-height: 420px;
    object-fit: cover;
  }

  .d {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding: 8px 0;
    font-family: var(--hn3-font-body);
    font-size: 12px;
    color: var(--hn3-muted);
    border-bottom: 1px solid var(--hn3-border);
  }

  .e {
    flex: 1;
    font-style: italic;
  }

  .f {
    position: relative;
    display: inline-block;
    white-space: nowrap;
  }
  .g {
    position: relative;
    z-index: 1;
  }
  .h {
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
</style>
