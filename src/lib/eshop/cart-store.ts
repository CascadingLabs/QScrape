import type { Product } from '../../data/eshop/catalog';

export interface CartLine {
	productId: string;
	quantity: number;
}

export interface CartWriteResult {
	cart: CartLine[];
	persisted: boolean;
}

const CART_PREFIX = 'objects:cart:';
export const MAX_CART_QUANTITY = 99;

export function cartStorageKey(version: string): string {
	return `${CART_PREFIX}${version}`;
}

export function normalizeCart(
	value: unknown,
	products: readonly Product[],
): CartLine[] {
	if (!Array.isArray(value)) return [];

	const byId = new Map(products.map((product) => [product.id, product]));
	const quantities = new Map<string, number>();

	for (const entry of value) {
		if (!entry || typeof entry !== 'object') continue;
		const candidate = entry as { productId?: unknown; quantity?: unknown };
		if (typeof candidate.productId !== 'string') continue;
		const product = byId.get(candidate.productId);
		if (!product || product.stock <= 0) continue;
		if (
			typeof candidate.quantity !== 'number' ||
			!Number.isFinite(candidate.quantity)
		)
			continue;
		const quantity = Math.floor(candidate.quantity);
		if (quantity < 1) continue;
		const bounded = Math.min(quantity, product.stock, MAX_CART_QUANTITY);
		quantities.set(
			product.id,
			Math.min(
				(quantities.get(product.id) ?? 0) + bounded,
				product.stock,
				MAX_CART_QUANTITY,
			),
		);
	}

	return [...quantities].map(([productId, quantity]) => ({
		productId,
		quantity,
	}));
}

export function readCart(
	version: string,
	products: readonly Product[],
): CartLine[] {
	try {
		const stored = window.localStorage.getItem(cartStorageKey(version));
		return normalizeCart(stored ? JSON.parse(stored) : [], products);
	} catch {
		return [];
	}
}

export function writeCart(
	version: string,
	cart: readonly CartLine[],
	products: readonly Product[],
): CartWriteResult {
	const normalized = normalizeCart(cart, products);
	try {
		window.localStorage.setItem(
			cartStorageKey(version),
			JSON.stringify(normalized),
		);
		window.dispatchEvent(
			new CustomEvent('objects:cart', {
				detail: { version, cart: normalized },
			}),
		);
		return { cart: normalized, persisted: true };
	} catch {
		// The in-memory cart remains usable when browser storage is unavailable.
		return { cart: normalized, persisted: false };
	}
}
