export interface CartItem {
	sku: string;
	qty: number;
}

const CART_KEY = 'vm-l3-cart';
export const CART_EVENT = 'eshop:l3:cart';
export const VIEW_EVENT = 'eshop:l3:view';
export const ORDER_EVENT = 'eshop:l3:order';

export type ViewState = 'cart' | 'checkout' | 'confirm';

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

export function getView(): ViewState {
	const p = new URLSearchParams(window.location.search);
	return (p.get('view') as ViewState) || 'cart';
}

export function setView(view: ViewState): void {
	const url = new URL(window.location.href);
	if (view === 'cart') {
		url.searchParams.delete('view');
	} else {
		url.searchParams.set('view', view);
	}
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent(VIEW_EVENT, { detail: view }));
	window.scrollTo(0, 0);
}

export type ValidateType =
	| 'name'
	| 'email'
	| 'address'
	| 'postcode'
	| 'card'
	| 'expiry'
	| 'cvv'
	| 'text';

export function validateInput(
	value: string,
	type: ValidateType,
): string | null {
	const v = value.trim();
	if (!v) {
		return 'required';
	}
	if (type === 'name' && v.length < 2) {
		return 'at least 2 characters';
	}
	if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
		return 'invalid email';
	}
	if (type === 'address' && v.length < 3) {
		return 'at least 3 characters';
	}
	if (type === 'postcode' && v.length < 3) {
		return 'too short';
	}
	if (type === 'card' && !/^\d{13,19}$/.test(v.replace(/[\s-]/g, ''))) {
		return 'must be 13\u201319 digits';
	}
	if (type === 'expiry' && !/^(0[1-9]|1[0-2])[\s/]+\d{2}$/.test(v)) {
		return 'use MM / YY';
	}
	if (type === 'cvv' && !/^\d{3,4}$/.test(v)) {
		return '3 or 4 digits';
	}
	return null;
}
