import type { APIRoute } from 'astro';
import { categoryFeed } from '../_data/rss';

export const GET: APIRoute = (context) => {
	const site = context.url.origin;
	return new Response(categoryFeed(site, 'Weather'), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
