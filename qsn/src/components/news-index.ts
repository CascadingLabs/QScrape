import type { Article } from '../data/news';
import { articles, authors, series } from '../data/news';

export const orderedArticles = [...articles].sort(
	(a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);
export const latestArticles = orderedArticles.slice(0, 20);
export const articleById = new Map(
	articles.map((article) => [article.id, article]),
);
export const authorById = new Map(authors.map((author) => [author.id, author]));
export const seriesById = new Map(series.map((item) => [item.id, item]));

const storiesByAuthor = new Map<string, Article[]>();
const storiesBySeries = new Map<string, Article[]>();

for (const article of orderedArticles) {
	const authorStories = storiesByAuthor.get(article.authorId) ?? [];
	authorStories.push(article);
	storiesByAuthor.set(article.authorId, authorStories);

	if (article.seriesId) {
		const seriesStories = storiesBySeries.get(article.seriesId) ?? [];
		seriesStories.push(article);
		storiesBySeries.set(article.seriesId, seriesStories);
	}
}

export const articlesByAuthorId = storiesByAuthor;
const chronologicalStoriesBySeries = new Map<string, Article[]>();
for (const [id, stories] of storiesBySeries) {
	chronologicalStoriesBySeries.set(id, [...stories].reverse());
}
export const articlesBySeriesId = chronologicalStoriesBySeries;
