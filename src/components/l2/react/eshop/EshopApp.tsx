/**
 * @qscrape L2 / react / eshop
 * @component EshopApp
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type { ProductMeta } from '../../../../data/eshop/products';
import {
	categories,
	getByCategory,
	getFeatured,
	getNew,
	getProductBySku,
	products,
} from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';
import styles from './EshopApp.module.css';

// ── URL routing helpers ──────────────────────────────────────────────────────

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}

function pathToState(): {
	page: Page;
	sku?: string;
	query?: string;
	category?: string;
} {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'product') {
		return { page: 'product', sku: p.get('sku') ?? undefined };
	}
	if (seg === 'catalog') {
		return { page: 'catalog', category: p.get('cat') ?? undefined };
	}
	if (seg === 'cart') {
		return { page: 'cart' };
	}
	if (seg === 'search') {
		return { page: 'search', query: p.get('q') ?? '' };
	}
	return { page: 'home' };
}

function pageToPath(p: Page, extra?: string): string {
	const base = getBase();
	if (p === 'product') {
		return `${base}product${extra ? `?sku=${extra}` : ''}`;
	}
	if (p === 'catalog') {
		return `${base}catalog${extra ? `?cat=${encodeURIComponent(extra)}` : ''}`;
	}
	if (p === 'cart') {
		return `${base}cart`;
	}
	if (p === 'search') {
		return `${base}search${extra ? `?q=${encodeURIComponent(extra)}` : ''}`;
	}
	return base;
}

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'search';

interface EshopAppProps {
	initialPage?: Page;
	initialSku?: string;
}

interface CartItem {
	sku: string;
	qty: number;
}

function StarRating({
	rating,
	reviewCount,
}: {
	rating: number;
	reviewCount: number;
}) {
	const full = Math.floor(rating);
	const half = rating - full >= 0.5;
	const empty = 5 - full - (half ? 1 : 0);
	return (
		<span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
			{'★'.repeat(full)}
			{half ? '½' : ''}
			{'☆'.repeat(empty)}
			<span className={styles.reviewCount}>({reviewCount})</span>
		</span>
	);
}

function PriceDisplay({ product }: { product: ProductMeta }) {
	if (product.salePrice) {
		return (
			<span className={styles.priceWrap}>
				<span className={styles.salePrice}>
					{product.salePrice.toFixed(2)} GS
				</span>
				<span className={styles.origPrice}>
					{product.basePrice.toFixed(2)} GS
				</span>
			</span>
		);
	}
	return (
		<span className={styles.price}>{product.basePrice.toFixed(2)} GS</span>
	);
}

function CategoryBadge({ category }: { category: string }) {
	const slug = category.toLowerCase().replace(/[^a-z]/g, '_');
	return (
		<span className={`${styles.catBadge} ${styles[`cat_${slug}`]}`}>
			{category}
		</span>
	);
}

function ProductCard({
	product,
	onNavigate,
}: {
	product: ProductMeta;
	onNavigate: (page: Page, sku?: string) => void;
}) {
	return (
		<article
			className={styles.productCard}
			data-sku={product.sku}
			data-category={product.category}
		>
			<a
				className={styles.productCardImg}
				onClick={() => onNavigate('product', product.sku)}
				role="button"
				tabIndex={0}
			>
				<img
					src={product.image}
					alt={product.name}
					loading="lazy"
					width="280"
					height="200"
				/>
				<div className={styles.productBadges}>
					{product.isNew && <span className={styles.badgeNew}>NEW</span>}
					{!product.inStock && (
						<span className={styles.badgeOos}>OUT OF STOCK</span>
					)}
					{product.salePrice && <span className={styles.badgeSale}>SALE</span>}
				</div>
			</a>
			<div className={styles.productCardBody}>
				<CategoryBadge category={product.category} />
				<h3 className={styles.productName}>
					<a
						onClick={() => onNavigate('product', product.sku)}
						role="button"
						tabIndex={0}
					>
						{product.name}
					</a>
				</h3>
				<StarRating rating={product.rating} reviewCount={product.reviewCount} />
				<div className={styles.productCardFooter}>
					<PriceDisplay product={product} />
					{product.inStock ? (
						<button
							type="button"
							className={styles.addBtn}
							onClick={() => onNavigate('cart')}
						>
							Add to Cart
						</button>
					) : (
						<span className={styles.oosLabel}>Out of Stock</span>
					)}
				</div>
			</div>
		</article>
	);
}

function EshopShell({
	children,
	activePage,
	onNavigate,
	cartCount,
}: {
	children: React.ReactNode;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
	cartCount: number;
}) {
	const [searchQ, setSearchQ] = useState('');

	return (
		<div className={styles.shell}>
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<button
						type="button"
						className={styles.logo}
						onClick={() => onNavigate('home')}
					>
						VaultMart
					</button>
					<form
						className={styles.searchBar}
						onSubmit={(e) => {
							e.preventDefault();
							onNavigate('search', searchQ);
						}}
					>
						<input
							type="search"
							className={styles.searchInput}
							placeholder="Search products…"
							value={searchQ}
							onChange={(e) => setSearchQ(e.target.value)}
						/>
						<button type="submit" className={styles.searchBtn}>
							Search
						</button>
					</form>
					<button
						type="button"
						className={styles.cartBtn}
						onClick={() => onNavigate('cart')}
					>
						Cart{' '}
						{cartCount > 0 && (
							<span className={styles.cartBadge}>{cartCount}</span>
						)}
					</button>
				</div>
				<nav className={styles.catNav}>
					<div className={styles.catNavInner}>
						<button
							type="button"
							className={`${styles.catNavItem} ${activePage === 'home' ? styles.catNavActive : ''}`}
							onClick={() => onNavigate('home')}
						>
							Home
						</button>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat}
								className={styles.catNavItem}
								onClick={() => onNavigate('catalog')}
							>
								{cat}
							</button>
						))}
						<button
							type="button"
							className={`${styles.catNavItem} ${activePage === 'catalog' ? styles.catNavActive : ''}`}
							onClick={() => onNavigate('catalog')}
						>
							All Products
						</button>
					</div>
				</nav>
			</header>

			<main className={styles.main}>{children}</main>

			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<p>&copy; Year 312 VaultMart. A division of Armok Holdings LLC.</p>
					<p className={styles.footerMuted}>
						All prices in Gold Sovereigns (GS). Copper Coins (CC) accepted at
						1:100 rate.
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage({
	onNavigate,
}: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const featured = getFeatured();
	const newArrivals = getNew();

	return (
		<div className={styles.homePage}>
			{/* Hero */}
			<section className={styles.heroBanner}>
				<div className={styles.heroBannerText}>
					<p className={styles.heroBannerSub}>Welcome to</p>
					<h1 className={styles.heroBannerTitle}>VaultMart</h1>
					<p className={styles.heroBannerDesc}>
						Your trusted supplier for mining equipment, forge materials, and
						surface imports. Serving Mountainhome since Year 89.
					</p>
					<button
						type="button"
						className={styles.heroCta}
						onClick={() => onNavigate('catalog')}
					>
						Shop All Products →
					</button>
				</div>
			</section>

			{/* Category tiles */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Browse by Category</h2>
				<div className={styles.catTiles}>
					{categories.map((cat) => (
						<button
							type="button"
							key={cat}
							className={styles.catTile}
							onClick={() => onNavigate('catalog')}
							data-category={cat}
						>
							<span className={styles.catTileName}>{cat}</span>
							<span className={styles.catTileCount}>
								{getByCategory(cat).length} items
							</span>
						</button>
					))}
				</div>
			</section>

			{/* Featured */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Featured Products</h2>
				<div className={styles.grid3}>
					{featured.map((p) => (
						<ProductCard key={p.sku} product={p} onNavigate={onNavigate} />
					))}
				</div>
			</section>

			{/* New arrivals */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>New Arrivals</h2>
				<div className={styles.grid3}>
					{newArrivals.slice(0, 6).map((p) => (
						<ProductCard key={p.sku} product={p} onNavigate={onNavigate} />
					))}
				</div>
				<button
					type="button"
					className={styles.viewAllBtn}
					onClick={() => onNavigate('catalog')}
				>
					View All Products →
				</button>
			</section>
		</div>
	);
}

function CatalogPage({
	onNavigate,
	onAddToCart,
}: {
	onNavigate: (page: Page, extra?: string) => void;
	onAddToCart: (sku: string) => void;
}) {
	const [activeCategory, setActiveCategory] = useState<string>('All');
	const [page, setPage] = useState(1);
	const PER_PAGE = 9;

	const filtered =
		activeCategory === 'All' ? products : getByCategory(activeCategory);
	const totalPages = Math.ceil(filtered.length / PER_PAGE);
	const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	return (
		<div className={styles.catalogPage}>
			<h1 className={styles.pageTitle}>All Products</h1>
			<div className={styles.catalogLayout}>
				{/* Filter rail */}
				<aside className={styles.filterRail}>
					<h3 className={styles.filterTitle}>Category</h3>
					<button
						type="button"
						className={`${styles.filterItem} ${activeCategory === 'All' ? styles.filterItemActive : ''}`}
						onClick={() => {
							setActiveCategory('All');
							setPage(1);
						}}
					>
						All ({products.length})
					</button>
					{categories.map((cat) => (
						<button
							type="button"
							key={cat}
							className={`${styles.filterItem} ${activeCategory === cat ? styles.filterItemActive : ''}`}
							onClick={() => {
								setActiveCategory(cat);
								setPage(1);
							}}
							data-category={cat}
						>
							{cat} ({getByCategory(cat).length})
						</button>
					))}
				</aside>

				{/* Product grid */}
				<div className={styles.catalogMain}>
					<div className={styles.catalogMeta}>
						<span>{filtered.length} products</span>
					</div>
					<div className={styles.grid3}>
						{pageItems.map((p) => (
							<ProductCard key={p.sku} product={p} onNavigate={onNavigate} />
						))}
					</div>
					{totalPages > 1 && (
						<div className={styles.pagination}>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
								<button
									type="button"
									key={p}
									className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
									onClick={() => setPage(p)}
								>
									{p}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ProductPage({
	sku,
	onNavigate,
	onAddToCart,
}: {
	sku: string;
	onNavigate: (page: Page, extra?: string) => void;
	onAddToCart: (sku: string) => void;
}) {
	const product = getProductBySku(sku);
	const [qty, setQty] = useState(1);

	if (!product) {
		return (
			<div className={styles.notFound}>
				<h1>Product not found</h1>
				<button type="button" onClick={() => onNavigate('catalog')}>
					← Back to Catalog
				</button>
			</div>
		);
	}

	const related = getByCategory(product.category)
		.filter((p) => p.sku !== sku)
		.slice(0, 3);

	return (
		<div className={styles.productPage}>
			<nav className={styles.breadcrumb}>
				<button type="button" onClick={() => onNavigate('home')}>
					Home
				</button>
				{' / '}
				<button type="button" onClick={() => onNavigate('catalog')}>
					{product.category}
				</button>
				{' / '}
				<span>{product.name}</span>
			</nav>

			<div className={styles.productDetail}>
				<div className={styles.productDetailImg}>
					<img
						src={product.image}
						alt={product.name}
						width="560"
						height="400"
					/>
					<div className={styles.productBadges}>
						{product.isNew && <span className={styles.badgeNew}>NEW</span>}
						{!product.inStock && (
							<span className={styles.badgeOos}>OUT OF STOCK</span>
						)}
						{product.salePrice && (
							<span className={styles.badgeSale}>SALE</span>
						)}
					</div>
				</div>
				<div className={styles.productDetailInfo}>
					<CategoryBadge category={product.category} />
					<h1 className={styles.productDetailName}>{product.name}</h1>
					<div className={styles.productDetailMeta}>
						<StarRating
							rating={product.rating}
							reviewCount={product.reviewCount}
						/>
						<span className={styles.skuLabel}>SKU: {product.sku}</span>
					</div>
					<div className={styles.productDetailPrice}>
						<PriceDisplay product={product} />
					</div>
					<p className={styles.productDetailExcerpt}>{product.excerpt}</p>

					{product.stock && product.inStock && product.stock <= 5 && (
						<p className={styles.lowStock}>
							Only {product.stock} left in stock!
						</p>
					)}

					{product.inStock ? (
						<div className={styles.addToCartRow}>
							<div className={styles.qtyControl}>
								<button
									type="button"
									onClick={() => setQty(Math.max(1, qty - 1))}
								>
									−
								</button>
								<span data-qty={qty}>{qty}</span>
								<button type="button" onClick={() => setQty(qty + 1)}>
									+
								</button>
							</div>
							<button
								type="button"
								className={styles.addToCartBtn}
								onClick={() => {
									onAddToCart(product.sku);
									onNavigate('cart');
								}}
							>
								Add to Cart
							</button>
						</div>
					) : (
						<p className={styles.outOfStock}>Out of Stock</p>
					)}

					{/* Variant selects (disabled — for scraper challenge) */}
					<div className={styles.variantSelects}>
						<div className={styles.variantGroup}>
							<label>Material</label>
							<select disabled>
								<option data-price-mod="0" data-in-stock="true">
									Standard
								</option>
								<option data-price-mod="10" data-in-stock="true">
									Masterwork (+10 GS)
								</option>
								<option data-price-mod="25" data-in-stock="false">
									Legendary (+25 GS, Out of Stock)
								</option>
							</select>
						</div>
						<div className={styles.variantGroup}>
							<label>Size</label>
							<select disabled>
								<option data-price-mod="0" data-in-stock="true">
									Standard
								</option>
								<option data-price-mod="5" data-in-stock="true">
									Large (+5 GS)
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{related.length > 0 && (
				<section className={styles.relatedSection}>
					<h2 className={styles.sectionTitle}>Related Products</h2>
					<div className={styles.grid3}>
						{related.map((p) => (
							<ProductCard key={p.sku} product={p} onNavigate={onNavigate} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}

function CartPage({
	cart,
	onNavigate,
	onRemove,
}: {
	cart: CartItem[];
	onNavigate: (page: Page, extra?: string) => void;
	onRemove: (sku: string) => void;
}) {
	const items = cart
		.map((ci) => ({ ...ci, product: getProductBySku(ci.sku) }))
		.filter((ci) => ci.product);
	const subtotal = items.reduce((sum, ci) => {
		const p = ci.product!;
		return sum + (p.salePrice || p.basePrice) * ci.qty;
	}, 0);
	const shipping = subtotal > 0 ? 3.5 : 0;
	const _total = subtotal + shipping;

	// Pre-seeded default cart if empty
	const displayItems =
		items.length > 0
			? items
			: [
					{ sku: 'VM-MIN-001', qty: 2, product: getProductBySku('VM-MIN-001') },
					{ sku: 'VM-FDB-002', qty: 1, product: getProductBySku('VM-FDB-002') },
					{ sku: 'VM-SRF-001', qty: 1, product: getProductBySku('VM-SRF-001') },
				].filter((ci) => ci.product);

	const displaySubtotal = displayItems.reduce((sum, ci) => {
		const p = ci.product!;
		return sum + (p.salePrice || p.basePrice) * ci.qty;
	}, 0);
	const displayTotal = displaySubtotal + 3.5;

	return (
		<div className={styles.cartPage}>
			<h1 className={styles.pageTitle}>Your Cart</h1>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Order',
						orderStatus: 'OrderProcessing',
						priceCurrency: 'GS',
						price: displayTotal.toFixed(2),
						orderedItem: displayItems.map((ci) => ({
							'@type': 'OrderItem',
							orderQuantity: ci.qty,
							orderedItem: {
								'@type': 'Product',
								name: ci.product!.name,
								sku: ci.sku,
							},
							orderItemPrice: {
								'@type': 'PriceSpecification',
								price: (
									(ci.product!.salePrice || ci.product!.basePrice) * ci.qty
								).toFixed(2),
							},
						})),
					}),
				}}
			/>

			<div className={styles.cartLayout}>
				<div className={styles.cartItems}>
					{displayItems.map((ci) => (
						<div key={ci.sku} className={styles.cartItem}>
							<img
								src={ci.product!.image}
								alt={ci.product!.name}
								width="80"
								height="60"
							/>
							<div className={styles.cartItemInfo}>
								<a
									className={styles.cartItemName}
									onClick={() => onNavigate('product', ci.sku)}
									role="button"
									tabIndex={0}
								>
									{ci.product!.name}
								</a>
								<div className={styles.cartItemMeta}>
									SKU: {ci.sku} · Qty: {ci.qty}
								</div>
							</div>
							<div className={styles.cartItemPrice}>
								{(
									(ci.product!.salePrice || ci.product!.basePrice) * ci.qty
								).toFixed(2)}{' '}
								GS
							</div>
						</div>
					))}
				</div>

				<div className={styles.cartSummary}>
					<h2 className={styles.summaryTitle}>Order Summary</h2>
					<div className={styles.summaryRow}>
						<span>Subtotal</span>
						<span>{displaySubtotal.toFixed(2)} GS</span>
					</div>
					<div className={styles.summaryRow}>
						<span>Shipping</span>
						<span>3.50 GS</span>
					</div>
					<div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
						<span>Total</span>
						<span>{displayTotal.toFixed(2)} GS</span>
					</div>
					<button type="button" className={styles.checkoutBtn}>
						Proceed to Checkout
					</button>
					<button
						type="button"
						className={styles.continueBtn}
						onClick={() => onNavigate('catalog')}
					>
						Continue Shopping
					</button>
				</div>
			</div>
		</div>
	);
}

function SearchPage({
	query,
	onNavigate,
}: {
	query: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const q = query.toLowerCase();
	const results = q
		? products.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.excerpt.toLowerCase().includes(q),
			)
		: [];

	function highlight(text: string) {
		if (!q) {
			return text;
		}
		const parts = text.split(new RegExp(`(${q})`, 'gi'));
		return parts.map((part, i) =>
			part.toLowerCase() === q ? <mark key={i}>{part}</mark> : part,
		);
	}

	return (
		<div className={styles.searchPage}>
			<h1 className={styles.pageTitle}>
				Search Results{' '}
				{query && (
					<span className={styles.searchQuery}>for &ldquo;{query}&rdquo;</span>
				)}
			</h1>
			{results.length === 0 ? (
				<p className={styles.noResults}>
					{query ? 'No products found.' : 'Enter a search term above.'}
				</p>
			) : (
				<div className={styles.searchResults}>
					<p className={styles.searchCount}>
						{results.length} product{results.length !== 1 ? 's' : ''} found
					</p>
					{results.map((p) => (
						<div
							key={p.sku}
							className={styles.searchResultItem}
							data-sku={p.sku}
						>
							<img src={p.image} alt={p.name} width="100" height="75" />
							<div className={styles.searchResultInfo}>
								<a
									className={styles.searchResultName}
									onClick={() => onNavigate('product', p.sku)}
									role="button"
									tabIndex={0}
								>
									{highlight(p.name)}
								</a>
								<p className={styles.searchResultExcerpt}>
									{highlight(p.excerpt)}
								</p>
							</div>
							<span className={styles.searchResultPrice}>
								{(p.salePrice || p.basePrice).toFixed(2)} GS
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default function EshopApp({
	initialPage = 'home',
	initialSku,
}: EshopAppProps) {
	const [ready, setReady] = useState(false);
	const [page, setPage] = useState<Page>(initialPage);
	const [sku, setSku] = useState<string | undefined>(initialSku);
	const [searchQuery, setSearchQuery] = useState('');
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const s = pathToState();
		setPage(s.page);
		if (s.sku) {
			setSku(s.sku);
		}
		if (s.query) {
			setSearchQuery(s.query);
		}

		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const st = pathToState();
			setPage(st.page);
			if (st.sku) {
				setSku(st.sku);
			}
			if (st.query != null) {
				setSearchQuery(st.query);
			}
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);

	const navigate = (p: Page, extra?: string) => {
		setPage(p);
		if (p === 'product' && extra) {
			setSku(extra);
		}
		if (p === 'search' && extra) {
			setSearchQuery(extra);
		}
		history.pushState(null, '', pageToPath(p, extra));
		window.scrollTo(0, 0);
	};

	if (!ready) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					fontFamily: 'system-ui',
					color: '#888',
				}}
			>
				Loading…
			</div>
		);
	}

	const addToCart = (itemSku: string) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.sku === itemSku);
			if (existing) {
				return prev.map((i) =>
					i.sku === itemSku ? { ...i, qty: i.qty + 1 } : i,
				);
			}
			return [...prev, { sku: itemSku, qty: 1 }];
		});
	};

	const removeFromCart = (itemSku: string) => {
		setCart((prev) => prev.filter((i) => i.sku !== itemSku));
	};

	const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <HomePage onNavigate={navigate} />;
			case 'catalog':
				return <CatalogPage onNavigate={navigate} onAddToCart={addToCart} />;
			case 'product':
				return (
					<ProductPage
						sku={sku || ''}
						onNavigate={navigate}
						onAddToCart={addToCart}
					/>
				);
			case 'cart':
				return (
					<CartPage
						cart={cart}
						onNavigate={navigate}
						onRemove={removeFromCart}
					/>
				);
			case 'search':
				return <SearchPage query={searchQuery} onNavigate={navigate} />;
			default:
				return <HomePage onNavigate={navigate} />;
		}
	};

	return (
		<EshopShell activePage={page} onNavigate={navigate} cartCount={cartCount}>
			{renderPage()}
		</EshopShell>
	);
}
