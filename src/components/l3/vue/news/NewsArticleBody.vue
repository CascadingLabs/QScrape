<script setup lang="ts">
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

function bodyParagraphs(a: ArticleMeta): string[] {
	return [
		a.excerpt,
		`The ${a.category.toLowerCase()} desk at the Mountainhome Herald has been following this story closely. Sources close to the situation confirmed the details on ${a.published.slice(0, 10)}.`,
		`Reporting by ${a.author} (${a.byline}). Tags: ${a.tags.join(', ')}.`,
	];
}
</script>

<template>
  <div data-island="vue-article-body">
    <div v-if="!article" class="a">Loading…</div>
    <div v-else class="b" :data-0="article.id">
      <p class="c">
        Published <span class="d" :data-1="article.published.slice(0,10)"></span>
        <template v-if="article.updated">
          · Updated <span class="d" :data-1="article.updated!.slice(0,10)"></span>
        </template>
      </p>
      <div class="e">
        <p v-for="(para, i) in bodyParagraphs(article)" :key="i" :class="{ 'f': i === 0 }">
          {{ para }}
        </p>
      </div>
      <div class="g">
        <span v-for="tag in article.tags" :key="tag" class="h">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/news.css';

.a {
	min-height: 160px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.b {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.c {
	font-family: var(--hn3-font-body);
	font-size: 12px;
	color: var(--hn3-muted);
	margin: 0;
}

.d {
	font-weight: 600;
	color: var(--hn3-text);
}
.d::before {
	content: attr(data-1);
}

.e {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: var(--hn3-max-reading);
}

.e p {
	font-family: var(--hn3-font-body);
	font-size: 16px;
	line-height: 1.75;
	color: var(--hn3-text);
	margin: 0;
}

.f {
	font-weight: 600;
	font-size: 17px !important;
}

.g {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	padding-top: 16px;
	border-top: 1px solid var(--hn3-border);
}

.h {
	background: var(--hn3-border);
	padding: 4px 10px;
	font-family: var(--hn3-font-body);
	font-size: 12px;
	border-radius: 2px;
	color: var(--hn3-text);
}
</style>
