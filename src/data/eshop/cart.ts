// @qscrape L2 / eshop / cart state
// Shared cart utility — localStorage-backed, cross-island via CustomEvent.

export interface CartItem {
	sku: string;
	qty: number;
}

export const CART_KEY = 'vm-l2-cart';
export const CART_EVENT = 'eshop:cart';

export function getCart(): CartItem[] {
	try {
		return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[];
	} catch {
		return [];
	}
}

function broadcast(cart: CartItem[]): void {
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: [...cart] }));
}

export function addToCart(sku: string, qty = 1): void {
	const cart = getCart();
	const item = cart.find((i) => i.sku === sku);
	if (item) {
		item.qty += qty;
	} else {
		cart.push({ sku, qty });
	}
	broadcast(cart);
}

export function removeFromCart(sku: string): void {
	broadcast(getCart().filter((i) => i.sku !== sku));
}

export function updateQty(sku: string, qty: number): void {
	if (qty <= 0) {
		removeFromCart(sku);
		return;
	}
	const cart = getCart();
	const item = cart.find((i) => i.sku === sku);
	if (item) {
		item.qty = qty;
		broadcast(cart);
	}
}

export function clearCart(): void {
	broadcast([]);
}

export function cartCount(cart: CartItem[]): number {
	return cart.reduce((sum, i) => sum + i.qty, 0);
}
