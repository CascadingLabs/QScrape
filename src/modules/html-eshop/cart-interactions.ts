import { products } from '../../data/eshop/catalog';
import {
	cartStorageKey,
	readCart,
	writeCart,
} from '../../lib/eshop/cart-store';

/** Enhance the static catalogue and product pages without replacing their HTML. */
export function initializeCartInteractions(root: HTMLElement): void {
	const version = root.dataset.shopVersion ?? 'html';
	const syncCount = () => {
		const count = readCart(version, products).reduce(
			(sum, line) => sum + line.quantity,
			0,
		);
		root
			.querySelectorAll<HTMLElement>('[data-html-cart-count]')
			.forEach((node) => {
				node.textContent = String(count);
			});
	};

	syncCount();
	window.addEventListener('storage', (event) => {
		if (event.key === cartStorageKey(version) || event.key === null)
			syncCount();
	});

	root.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const button =
			event.target.closest<HTMLButtonElement>('[data-add-to-cart]');
		if (!button || button.disabled) return;
		const product = products.find(
			(item) => item.id === button.dataset.addToCart,
		);
		if (!product || product.stock <= 0) return;
		const cart = readCart(version, products);
		const line = cart.find((item) => item.productId === product.id);
		const next = line
			? cart.map((item) =>
					item.productId === product.id
						? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
						: item,
				)
			: [...cart, { productId: product.id, quantity: 1 }];
		const result = writeCart(version, next, products);
		const message = root.querySelector<HTMLElement>(
			`[data-cart-message-for="${product.id}"]`,
		);
		if (message) {
			message.textContent = result.persisted
				? `Added ${product.name} to cart.`
				: `Browser storage is unavailable, so ${product.name} could not be added.`;
		}
		syncCount();
	});
}
