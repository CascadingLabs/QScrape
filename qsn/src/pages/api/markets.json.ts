import type { APIRoute } from 'astro';

export const prerender = true;

import { marketSnapshot } from '../../data/market';

export const GET: APIRoute = () =>
	new Response(JSON.stringify(marketSnapshot), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
