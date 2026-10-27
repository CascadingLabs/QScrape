import type { APIRoute } from 'astro';
import { articles, authors, sections, series } from '../data/news';
import { publication, publications } from '../data/publications';

// Benchmark metadata is intentionally separate from the publication UI.
export const prerender = true;
export const GET: APIRoute = () => {
	const manifest = {
		version: 'qscrape-news-network-2',
		publicationId: publication.id,
		origin: publication.origin,
		sisterOrigins: publications
			.filter((item) => item.id !== publication.id)
			.map((item) => item.origin),
		description: 'Expected article inventory and explicit related-story edges.',
		articleCount: articles.length,
		illustratedArticleCount: articles.filter((article) => article.image).length,
		sections,
		authors: authors.map(({ id }) => id),
		series: series.map(({ id }) => id),
		articles: articles.map((article, index) => ({
			id: article.id,
			url: `/article/${article.id}/`,
			apiPage: Math.floor(index / 100) + 1,
			authorId: article.authorId,
			section: article.section,
			format: article.format,
			seriesId: article.seriesId ?? null,
			image: article.image?.src ?? null,
			relatedUrls: article.relatedIds.map((id) => `/article/${id}/`),
		})),
	};
	return new Response(JSON.stringify(manifest), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
