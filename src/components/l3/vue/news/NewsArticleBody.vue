<script setup lang="ts">
// @qscrape L3 / vue island / news — article body text (article page)
// Anti-bot: publication date rendered via CSS ::before on a data attribute span
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	getArticleById,
} from '../../../../data/news/articles';

const props = defineProps<{ articleId: string }>();

const article = ref<ArticleMeta | null>(null);

onMounted(() => {
	const found = getArticleById(props.articleId);
	if (found) {
		fakeGetMs(found, 600, 250).then((d) => {
			article.value = d;
		});
	}
});

// Generate deterministic body paragraphs from excerpt + article data
function _bodyParagraphs(a: ArticleMeta): string[] {
	return [
		a.excerpt,
		`The ${a.category.toLowerCase()} desk at the Mountainhome Herald has been following this story closely. Sources close to the situation confirmed the details on ${a.published.slice(0, 10)}.`,
		`Reporting by ${a.author} (${a.byline}). Tags: ${a.tags.join(', ')}.`,
	];
}
</script>

<template>
  <div>
    <div v-if="!article" class="hn3-body-loading">Loading…</div>
    <div v-else class="hn3-article-body" :data-article-id="article.id">
      <!-- Anti-bot: date text rendered via ::before pseudo-element -->
      <p class="hn3-dateline">
        Published <span class="hn3-pub-date" :data-date="article.published.slice(0,10)"></span>
        <template v-if="article.updated">
          · Updated <span class="hn3-pub-date" :data-date="article.updated!.slice(0,10)"></span>
        </template>
      </p>
      <div class="hn3-body-text">
        <p v-for="(para, i) in bodyParagraphs(article)" :key="i" :class="{ 'hn3-lead': i === 0 }">
          {{ para }}
        </p>
      </div>
      <div class="hn3-tags">
        <span v-for="tag in article.tags" :key="tag" class="hn3-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/news.css';

.hn3-body-loading {
	min-height: 160px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.hn3-article-body {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.hn3-dateline {
	font-family: var(--hn3-font-body);
	font-size: 12px;
	color: var(--hn3-muted);
	margin: 0;
}

/* Anti-bot: date text lives in ::before, textContent is empty */
.hn3-pub-date {
	font-weight: 600;
	color: var(--hn3-text);
}
.hn3-pub-date::before {
	content: attr(data-date);
}

.hn3-body-text {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: var(--hn3-max-reading);
}

.hn3-body-text p {
	font-family: var(--hn3-font-body);
	font-size: 16px;
	line-height: 1.75;
	color: var(--hn3-text);
	margin: 0;
}

.hn3-lead {
	font-weight: 600;
	font-size: 17px !important;
}

.hn3-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	padding-top: 16px;
	border-top: 1px solid var(--hn3-border);
}

.hn3-tag {
	background: var(--hn3-border);
	padding: 4px 10px;
	font-family: var(--hn3-font-body);
	font-size: 12px;
	border-radius: 2px;
	color: var(--hn3-text);
}
</style>
