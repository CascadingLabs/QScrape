import {
	categories,
	formatPrice,
	type ShopCategory,
	products,
	type Product,
	type ShopVersion,
} from '../../data/eshop/catalog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	cartStorageKey,
	readCart,
	writeCart,
	type CartLine,
} from '../../lib/eshop/cart-store';

type ShopPage = 'catalog' | 'product' | 'cart';

export interface ShopProps {
	page: ShopPage;
	version: ShopVersion;
	productId?: string;
}

function ShopHeader({
	version,
	cartCount,
	page,
}: {
	version: ShopVersion;
	cartCount: number;
	page: ShopPage;
}) {
	return (
		<header className="shop-topline" data-shop-part="shop-header">
			<a className="shop-wordmark" href={`/eshop/${version}/`}>
				Objects
			</a>
			<nav className="shop-nav" aria-label="Objects shop">
				<a
					href={`/eshop/${version}/`}
					aria-current={page === 'catalog' ? 'page' : undefined}
				>
					Shop
				</a>
				<a
					href={`/eshop/${version}/cart/`}
					aria-current={page === 'cart' ? 'page' : undefined}
					data-shop-part="cart-nav"
				>
					Cart{' '}
					<span className="shop-bag-count" data-shop-part="cart-count">
						{cartCount}
					</span>
				</a>
			</nav>
		</header>
	);
}

function ShopFooter() {
	return (
		<footer className="shop-footer">
			<span>Objects · Thoughtful things for everyday living</span>
		</footer>
	);
}

function ProductCard({
	product,
	version,
	add,
	quantityInCart,
}: {
	product: Product;
	version: ShopVersion;
	add: (product: Product) => void;
	quantityInCart: number;
}) {
	return (
		<article
			className="shop-product-card"
			data-shop-part="product-card"
			data-product-id={product.id}
		>
			<a
				className="shop-product-art"
				href={`/eshop/${version}/product/${product.id}/`}
				aria-label={`View ${product.name}`}
			>
				<img
					src={product.image}
					alt={`${product.name}, ${product.color}`}
					width="600"
					height="480"
				/>
				<span className="shop-stock-note">
					{product.stock > 0
						? `${product.stock} available`
						: 'Currently unavailable'}
				</span>
			</a>
			<div className="shop-product-info">
				<div>
					<h2 className="shop-product-name">
						<a href={`/eshop/${version}/product/${product.id}/`}>
							{product.name}
						</a>
					</h2>
					<p className="shop-product-meta">
						{product.category} · {product.color}
					</p>
				</div>
				<span className="shop-price">{formatPrice(product.price)}</span>
			</div>
			<div className="shop-card-actions">
				<a href={`/eshop/${version}/product/${product.id}/`}>Details</a>
				<button
					type="button"
					onClick={() => add(product)}
					disabled={product.stock <= quantityInCart}
				>
					{product.stock <= 0
						? 'Sold out'
						: product.stock <= quantityInCart
							? 'All in bag'
							: 'Add to cart'}
				</button>
			</div>
		</article>
	);
}

function ShopContent({
	page,
	version,
	productId,
	products,
	cart,
	add,
	changeQuantity,
	remove,
	status,
}: {
	page: ShopPage;
	version: ShopVersion;
	productId?: string;
	products: readonly Product[];
	cart: readonly CartLine[];
	add: (product: Product) => void;
	changeQuantity: (product: Product, delta: number) => void;
	remove: (product: Product) => void;
	status: string;
}) {
	const [query, setQuery] = useState('');
	const [category] = useState<ShopCategory>(() => {
		const requested = new URLSearchParams(window.location.search).get(
			'category',
		);
		return categories.find((entry) => entry === requested) ?? 'All';
	});
	const count = cart.reduce((sum, line) => sum + line.quantity, 0);
	const cartProducts = cart.flatMap((line) => {
		const product = products.find((entry) => entry.id === line.productId);
		return product ? [{ product, quantity: line.quantity }] : [];
	});

	const visibleProducts = useMemo(
		() =>
			products.filter((product) => {
				const matchesCategory =
					category === 'All' || product.category === category;
				const matchesQuery =
					`${product.name} ${product.category} ${product.color} ${product.material}`
						.toLowerCase()
						.includes(query.trim().toLowerCase());
				return matchesCategory && matchesQuery;
			}),
		[category, products, query],
	);
	const subtotal = cartProducts.reduce(
		(sum, line) => sum + line.product.price * line.quantity,
		0,
	);

	const catalog = (
		<>
			<section className="shop-heading" aria-labelledby="collection-title">
				<h1 id="collection-title">Catalogue</h1>
				<p>
					Useful things, made to feel at home. Meet the everyday pieces we keep
					close, wherever the day takes us.
				</p>
			</section>
			<div className="shop-controls">
				<nav className="shop-categories" aria-label="Shop by category">
					{categories.map((entry) => (
						<a
							key={entry}
							href={
								entry === 'All'
									? `/eshop/${version}/`
									: `/eshop/${version}/?category=${entry}`
							}
							aria-label={`Show ${entry === 'All' ? 'all' : entry} objects`}
							aria-current={category === entry ? 'page' : undefined}
						>
							{entry === 'All' ? 'All objects' : `${entry} objects`}
						</a>
					))}
				</nav>
				<div className="shop-search">
					<label htmlFor="objects-search">Search</label>
					<input
						id="objects-search"
						type="search"
						value={query}
						onChange={(event) => setQuery(event.currentTarget.value)}
						placeholder="Find an object"
					/>
				</div>
			</div>
			<div className="shop-product-grid" data-shop-part="product-grid">
				{visibleProducts.length > 0 ? (
					visibleProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							version={version}
							add={add}
							quantityInCart={
								cart.find((line) => line.productId === product.id)?.quantity ??
								0
							}
						/>
					))
				) : (
					<output className="shop-empty-results">
						No objects match that search.
					</output>
				)}
			</div>
		</>
	);

	const selectedProduct = products.find((product) => product.id === productId);
	const productDetail = selectedProduct ? (
		<div
			className="shop-product-layout"
			data-shop-part="product-detail"
			data-product-id={selectedProduct.id}
		>
			<div className="shop-product-photo">
				<img
					src={selectedProduct.image}
					alt={`${selectedProduct.name}, ${selectedProduct.color}`}
					width="600"
					height="480"
				/>
			</div>
			<section className="shop-product-copy" aria-labelledby="product-title">
				<nav className="shop-breadcrumb" aria-label="Breadcrumb">
					<a href={`/eshop/${version}/`}>All objects</a>
					<span aria-hidden="true">/</span>
					<a href={`/eshop/${version}/?category=${selectedProduct.category}`}>
						{selectedProduct.category}
					</a>
					<span aria-hidden="true">/</span>
					<span aria-current="page">{selectedProduct.name}</span>
				</nav>
				<p className="eyebrow">
					{selectedProduct.category} · {selectedProduct.color}
				</p>
				<h1 id="product-title">{selectedProduct.name}</h1>
				<p className="shop-detail-price">
					{formatPrice(selectedProduct.price)}
				</p>
				<p className="shop-product-lede">{selectedProduct.description}</p>
				<div className="shop-product-facts">
					<div>
						<span className="shop-fact-label">Material</span>
						<span className="shop-fact-value">{selectedProduct.material}</span>
					</div>
					<div>
						<span className="shop-fact-label">Color</span>
						<span className="shop-fact-value">{selectedProduct.color}</span>
					</div>
				</div>
				<p
					className="shop-availability"
					data-available={selectedProduct.stock > 0 ? 'true' : 'false'}
				>
					{selectedProduct.stock > 0
						? `${selectedProduct.stock} in stock and ready to find a home.`
						: 'Currently unavailable.'}
				</p>
				<button
					className="shop-add-button"
					type="button"
					onClick={() => add(selectedProduct)}
					disabled={
						selectedProduct.stock <=
						(cart.find((line) => line.productId === selectedProduct.id)
							?.quantity ?? 0)
					}
				>
					{selectedProduct.stock <= 0
						? 'Sold out'
						: selectedProduct.stock <=
							  (cart.find((line) => line.productId === selectedProduct.id)
									?.quantity ?? 0)
							? 'All in bag'
							: 'Add to cart'}
				</button>
			</section>
		</div>
	) : (
		<div className="shop-error" data-shop-part="product-not-found">
			<output>We couldn’t find that object.</output>
			<a href={`/eshop/${version}/`}>Back to the collection</a>
		</div>
	);

	const cartView = (
		<>
			<section className="shop-cart-heading" aria-labelledby="cart-title">
				<p className="eyebrow">Your Objects</p>
				<h1 id="cart-title">Cart</h1>
				<p>Review the products in your cart.</p>
			</section>
			{cartProducts.length === 0 ? (
				<div className="shop-empty-cart" data-shop-part="cart-empty">
					<p>Your bag is empty for now.</p>
					<a href={`/eshop/${version}/`}>Find something useful</a>
				</div>
			) : (
				<div className="shop-cart-layout" data-shop-part="cart-content">
					<ul className="shop-cart-list" aria-label="Items in your bag">
						{cartProducts.map(({ product, quantity }) => (
							<li
								className="shop-cart-line"
								key={product.id}
								data-shop-part="cart-line"
								data-product-id={product.id}
							>
								<img
									className="shop-cart-thumb"
									src={product.image}
									alt={`${product.name}, ${product.color}`}
									width="600"
									height="480"
								/>
								<div>
									<a
										className="shop-cart-item-name"
										href={`/eshop/${version}/product/${product.id}/`}
									>
										{product.name}
									</a>
									<p className="shop-cart-item-meta">
										{product.category} · {product.color} ·{' '}
										{formatPrice(product.price)} each
									</p>
									<div
										className="shop-quantity"
										aria-label={`${product.name} quantity controls`}
									>
										<button
											type="button"
											aria-label={`Decrease ${product.name} quantity`}
											onClick={() => changeQuantity(product, -1)}
											disabled={quantity <= 1}
										>
											−
										</button>
										<span aria-label={`${quantity} ${product.name} in cart`}>
											{quantity}
										</span>
										<button
											type="button"
											aria-label={`Increase ${product.name} quantity`}
											onClick={() => changeQuantity(product, 1)}
											disabled={quantity >= product.stock}
										>
											+
										</button>
										<button
											className="shop-remove-button"
											type="button"
											onClick={() => remove(product)}
											aria-label={`Remove ${product.name}`}
										>
											Remove
										</button>
									</div>
								</div>
								<span className="shop-line-total">
									{formatPrice(product.price * quantity)}
								</span>
							</li>
						))}
					</ul>
					<aside className="shop-cart-summary" aria-label="Order summary">
						<h2>Order summary</h2>
						<p className="shop-summary-row">
							<span>Items</span>
							<span>{formatPrice(subtotal)}</span>
						</p>
						<p className="shop-summary-row">
							<span>Shipping</span>
							<span>On us</span>
						</p>
						<p className="shop-summary-row shop-summary-total">
							<strong>Total</strong>
							<strong>{formatPrice(subtotal)}</strong>
						</p>
					</aside>
				</div>
			)}
		</>
	);

	return (
		<div
			className="shop-root shop-frame"
			data-shop-part="javascript-shop-content"
			data-shop-version={version}
		>
			<ShopHeader version={version} cartCount={count} page={page} />
			{page === 'catalog'
				? catalog
				: page === 'product'
					? productDetail
					: cartView}
			<ShopFooter />

			<output
				className="shop-added-message"
				aria-live="polite"
				data-shop-part="cart-confirmation"
			>
				{status}
			</output>
		</div>
	);
}

export default function ShopClient({ page, version, productId }: ShopProps) {
	const [cart, setCart] = useState<CartLine[]>(() =>
		readCart(version, products),
	);
	const [status, setStatus] = useState('');

	useEffect(() => {
		const onStorage = (event: StorageEvent) => {
			if (event.key === cartStorageKey(version) || event.key === null) {
				setCart(readCart(version, products));
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, [version]);

	const commitCart = useCallback(
		(next: readonly CartLine[]) => {
			const result = writeCart(version, next, products);
			setCart(result.cart);
			return result.persisted;
		},
		[version],
	);

	const add = useCallback(
		(product: Product) => {
			if (product.stock <= 0) return;
			const line = cart.find((entry) => entry.productId === product.id);
			const current = line?.quantity ?? 0;
			if (current >= product.stock) {
				setStatus(
					`You have all ${product.stock} available ${product.name.toLowerCase()} in your cart.`,
				);
				return;
			}
			const next = line
				? cart.map((entry) =>
						entry.productId === product.id
							? { ...entry, quantity: current + 1 }
							: entry,
					)
				: [...cart, { productId: product.id, quantity: 1 }];
			const persisted = commitCart(next);
			setStatus(
				persisted
					? `Added ${product.name} to cart.`
					: `Added ${product.name} for this visit; browser storage is unavailable.`,
			);
		},
		[cart, commitCart],
	);

	const changeQuantity = useCallback(
		(product: Product, delta: number) => {
			const line = cart.find((entry) => entry.productId === product.id);
			if (!line) return;
			const quantity = Math.min(product.stock, line.quantity + delta);
			if (quantity < 1) {
				const persisted = commitCart(
					cart.filter((entry) => entry.productId !== product.id),
				);
				setStatus(
					persisted
						? `Removed ${product.name} from cart.`
						: `Removed ${product.name} for this visit; browser storage is unavailable.`,
				);
				return;
			}
			const persisted = commitCart(
				cart.map((entry) =>
					entry.productId === product.id ? { ...entry, quantity } : entry,
				),
			);
			setStatus(
				persisted
					? `Updated ${product.name} quantity to ${quantity}.`
					: `Updated ${product.name} for this visit; browser storage is unavailable.`,
			);
		},
		[cart, commitCart],
	);

	const remove = useCallback(
		(product: Product) => {
			const persisted = commitCart(
				cart.filter((entry) => entry.productId !== product.id),
			);
			setStatus(
				persisted
					? `Removed ${product.name} from cart.`
					: `Removed ${product.name} for this visit; browser storage is unavailable.`,
			);
		},
		[cart, commitCart],
	);

	return (
		<ShopContent
			page={page}
			version={version}
			productId={productId}
			products={products}
			cart={cart}
			add={add}
			changeQuantity={changeQuantity}
			remove={remove}
			status={status}
		/>
	);
}
