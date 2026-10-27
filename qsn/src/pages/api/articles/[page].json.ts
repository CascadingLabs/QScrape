import { articles } from '../../../data/news';

export const prerender = true;
const pageSize = 100;

export function getStaticPaths() {
	return Array.from(
		{ length: Math.ceil(articles.length / pageSize) },
		(_, index) => ({
			params: { page: String(index + 1) },
			props: { page: index + 1 },
		}),
	);
}

export function GET({ props }: { props: { page: number } }) {
	const start = (props.page - 1) * pageSize;
	return new Response(
		JSON.stringify({
			page: props.page,
			pageSize,
			total: articles.length,
			articles: articles.slice(start, start + pageSize),
		}),
		{ headers: { 'Content-Type': 'application/json; charset=utf-8' } },
	);
}
