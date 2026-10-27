import { latestArticles } from '../../components/news-index';

export const prerender = true;

const responseArticles = latestArticles.map(
	({ id, title, summary, section, publishedAt }) => ({
		id,
		title,
		summary,
		section,
		publishedAt,
	}),
);

export function GET() {
	return new Response(JSON.stringify({ articles: responseArticles }), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
