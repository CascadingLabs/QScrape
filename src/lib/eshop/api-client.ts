import { categories, type Product } from '../../data/eshop/catalog';

function isProduct(value: unknown): value is Product {
	if (!value || typeof value !== 'object') return false;
	const p = value as Record<string, unknown>;
	return (
		['id', 'name', 'color', 'description', 'material', 'image'].every(
			(key) => typeof p[key] === 'string',
		) &&
		typeof p.category === 'string' &&
		p.category !== 'All' &&
		categories.some((category) => category === p.category) &&
		typeof p.price === 'number' &&
		Number.isSafeInteger(p.price) &&
		p.price >= 0 &&
		typeof p.stock === 'number' &&
		Number.isSafeInteger(p.stock) &&
		p.stock >= 0
	);
}
export function parseCatalogue(value: unknown): readonly Product[] {
	if (!value || typeof value !== 'object')
		throw new Error('Invalid catalogue response');
	const payload = value as Record<string, unknown>;
	if (
		payload.currency !== 'USD' ||
		payload.priceUnit !== 'cents' ||
		!Array.isArray(payload.data) ||
		payload.count !== payload.data.length ||
		!payload.data.every(isProduct)
	)
		throw new Error('Invalid catalogue response');
	const data: Product[] = payload.data;
	if (new Set(data.map((p) => p.id)).size !== data.length)
		throw new Error('Duplicate product IDs');
	return data;
}
export async function loadCatalogue(
	signal: AbortSignal,
): Promise<readonly Product[]> {
	const response = await fetch('/api/eshop/products/', {
		signal,
		headers: { Accept: 'application/json' },
	});
	if (!response.ok) throw new Error('Catalogue request failed');
	return parseCatalogue(await response.json());
}
