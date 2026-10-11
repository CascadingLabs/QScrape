import { products, categories, type Product } from '../../data/eshop/catalog';

export const CATALOGUE_API = '/api/eshop/products/';
export interface CatalogueResponse {
	data: readonly Product[];
	count: number;
	currency: 'USD';
	priceUnit: 'cents';
}
export function catalogueResponse(
	data: readonly Product[] = products,
): CatalogueResponse {
	return { data, count: data.length, currency: 'USD', priceUnit: 'cents' };
}
export function apiJSON(value: unknown, status = 200): Response {
	return Response.json(value, {
		status,
		headers: { 'Cache-Control': 'no-store' },
	});
}
export function handleProducts(request: Request, id?: string): Response {
	if (request.method !== 'GET')
		return apiJSON({ error: 'method_not_allowed' }, 405);
	if (id) {
		const product = products.find((entry) => entry.id === id);
		return product
			? apiJSON({ data: product, currency: 'USD', priceUnit: 'cents' })
			: apiJSON({ error: 'product_not_found' }, 404);
	}
	const url = new URL(request.url);
	const category = url.searchParams.get('category');
	const search = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	if (category && !categories.some((entry) => entry === category))
		return apiJSON({ error: 'invalid_category' }, 400);
	const data = products.filter(
		(entry) =>
			(!category || category === 'All' || entry.category === category) &&
			`${entry.name} ${entry.description} ${entry.category}`
				.toLowerCase()
				.includes(search),
	);
	return apiJSON(catalogueResponse(data));
}
