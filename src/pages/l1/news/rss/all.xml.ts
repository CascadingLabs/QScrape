import type { APIRoute } from 'astro';
import { allFeed } from '../_data/rss';

export const GET: APIRoute = (context) => {
	const site = context.url.origin;
	return new Response(allFeed(site), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
