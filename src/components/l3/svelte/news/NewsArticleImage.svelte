<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	getArticleById,
} from '../../../../data/news/articles';

export let articleId: string;

let article: ArticleMeta | null = null;

onMount(() => {
	const found = getArticleById(articleId);
	if (found) {
		fakeGetMs(found, 800, 250).then((d) => {
			article = d;
		});
	}
});
</script>

<div>
  {#if !article}
    <div class="hn3-img-loading">Loading…</div>
  {:else}
    <figure class="hn3-figure" data-article-id={article.id}>
      <img
        src={article.image}
        alt={article.headline}
        class="hn3-fig-img"
      />
      <figcaption class="hn3-figcaption">
        <span class="hn3-caption-text">{article.imageCaption}</span>
        <span class="hn3-credit-wrap">
          <span class="hn3-credit-real">{article.imageCredit}</span>
          <span class="hn3-credit-decoy" aria-hidden="true">Image courtesy of unknown archive</span>
        </span>
      </figcaption>
    </figure>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .hn3-img-loading {
    min-height: 200px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .hn3-figure {
    margin: 0;
  }

  .hn3-fig-img {
    width: 100%;
    display: block;
    max-height: 420px;
    object-fit: cover;
  }

  .hn3-figcaption {
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

  .hn3-caption-text {
    flex: 1;
    font-style: italic;
  }

  .hn3-credit-wrap {
    position: relative;
    display: inline-block;
    white-space: nowrap;
  }
  .hn3-credit-real {
    position: relative;
    z-index: 1;
  }
  .hn3-credit-decoy {
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
