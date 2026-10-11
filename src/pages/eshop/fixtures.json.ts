import type { APIRoute } from 'astro';
import { products } from '../../data/eshop/catalog';

export const GET: APIRoute = () => {
	return Response.json({
		currency: 'USD',
		priceUnit: 'cents',
		synthetic: true,
		products,
	});
};
