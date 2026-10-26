import { authorById, orderedArticles } from '../../components/news-index';
import { articles } from '../../data/news';

export const prerender = true;

const apiPageById = new Map(
	articles.map((article, index) => [article.id, Math.floor(index / 100) + 1]),
);
const archive = orderedArticles.map(
	({
		id,
		slug,
		title,
		summary,
		section,
		authorId,
		publishedAt,
		topic,
		seriesId,
	}) => ({
		id,
		apiPage: apiPageById.get(id),
		slug,
		title,
		summary,
		section,
		authorId,
		authorName: authorById.get(authorId)?.name ?? '',
		publishedAt,
		topic,
		seriesId,
	}),
);

export function GET() {
	return new Response(
		JSON.stringify({ articles: archive, total: archive.length }),
		{
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		},
	);
}
