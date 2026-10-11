import { products } from '../../data/eshop/catalog';

export function GET(): Response {
	return Response.json({
		currency: 'USD',
		priceUnit: 'cents',
		synthetic: true,
		products,
	});
}
