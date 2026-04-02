/**
 * @qscrape L2 / solid / eshop
 * @component EshopApp
 */

import type { JSX } from 'solid-js';
import {
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from 'solid-js';
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
import styles from '../../react/eshop/EshopApp.module.css';

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

interface CartItem {
	sku: string;
	qty: number;
}

function StarRating(props: { rating: number; reviewCount: number }) {
	const full = () => Math.floor(props.rating);
	const half = () => props.rating - full() >= 0.5;
	const empty = () => 5 - full() - (half() ? 1 : 0);
	return (
		<span class={styles.stars}>
			{'★'.repeat(full())}
			{half() ? '½' : ''}
			{'☆'.repeat(empty())}
			<span class={styles.reviewCount}>({props.reviewCount})</span>
		</span>
	);
}

function PriceDisplay(props: { product: ProductMeta }) {
	return (
		<Show
			when={props.product.salePrice}
			fallback={
				<span class={styles.price}>
					{props.product.basePrice.toFixed(2)} GS
				</span>
			}
		>
			<span class={styles.priceWrap}>
				<span class={styles.salePrice}>
					{props.product.salePrice!.toFixed(2)} GS
				</span>
				<span class={styles.origPrice}>
					{props.product.basePrice.toFixed(2)} GS
				</span>
			</span>
		</Show>
	);
}

function CategoryBadge(props: { category: string }) {
	const slug = () => props.category.toLowerCase().replace(/[^a-z]/g, '_');
	return (
		<span class={`${styles.catBadge} ${styles[`cat_${slug()}`]}`}>
			{props.category}
		</span>
	);
}

function ProductCard(props: {
	product: ProductMeta;
	onNavigate: (page: Page, sku?: string) => void;
}) {
	return (
		<article
			class={styles.productCard}
			data-sku={props.product.sku}
			data-category={props.product.category}
		>
			<a
				class={styles.productCardImg}
				onClick={() => props.onNavigate('product', props.product.sku)}
			>
				<img
					src={props.product.image}
					alt={props.product.name}
					loading="lazy"
					width="280"
					height="200"
				/>
				<div class={styles.productBadges}>
					<Show when={props.product.isNew}>
						<span class={styles.badgeNew}>NEW</span>
					</Show>
					<Show when={!props.product.inStock}>
						<span class={styles.badgeOos}>OUT OF STOCK</span>
					</Show>
					<Show when={props.product.salePrice}>
						<span class={styles.badgeSale}>SALE</span>
					</Show>
				</div>
			</a>
			<div class={styles.productCardBody}>
				<CategoryBadge category={props.product.category} />
				<h3 class={styles.productName}>
					<a onClick={() => props.onNavigate('product', props.product.sku)}>
						{props.product.name}
					</a>
				</h3>
				<StarRating
					rating={props.product.rating}
					reviewCount={props.product.reviewCount}
				/>
				<div class={styles.productCardFooter}>
					<PriceDisplay product={props.product} />
					<Show
						when={props.product.inStock}
						fallback={<span class={styles.oosLabel}>Out of Stock</span>}
					>
						<button
							type="button"
							class={styles.addBtn}
							onClick={() => props.onNavigate('cart')}
						>
							Add to Cart
						</button>
					</Show>
				</div>
			</div>
		</article>
	);
}

function EshopShell(props: {
	children: JSX.Element;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
	cartCount: number;
}) {
	const [searchQ, setSearchQ] = createSignal('');

	return (
		<div class={styles.shell}>
			<header class={styles.header}>
				<div class={styles.headerInner}>
					<button
						type="button"
						class={styles.logo}
						onClick={() => props.onNavigate('home')}
					>
						VaultMart
					</button>
					<form
						class={styles.searchBar}
						onSubmit={(e) => {
							e.preventDefault();
							props.onNavigate('search', searchQ());
						}}
					>
						<input
							type="search"
							class={styles.searchInput}
							placeholder="Search products…"
							value={searchQ()}
							onInput={(e) => setSearchQ(e.currentTarget.value)}
						/>
						<button type="submit" class={styles.searchBtn}>
							Search
						</button>
					</form>
					<button
						type="button"
						class={styles.cartBtn}
						onClick={() => props.onNavigate('cart')}
					>
						Cart{' '}
						<Show when={props.cartCount > 0}>
							<span class={styles.cartBadge}>{props.cartCount}</span>
						</Show>
					</button>
				</div>
				<nav class={styles.catNav}>
					<div class={styles.catNavInner}>
						<button
							type="button"
							class={`${styles.catNavItem} ${props.activePage === 'home' ? styles.catNavActive : ''}`}
							onClick={() => props.onNavigate('home')}
						>
							Home
						</button>
						<For each={categories}>
							{(cat) => (
								<button
									type="button"
									class={styles.catNavItem}
									onClick={() => props.onNavigate('catalog')}
								>
									{cat}
								</button>
							)}
						</For>
						<button
							type="button"
							class={`${styles.catNavItem} ${props.activePage === 'catalog' ? styles.catNavActive : ''}`}
							onClick={() => props.onNavigate('catalog')}
						>
							All Products
						</button>
					</div>
				</nav>
			</header>
			<main class={styles.main}>{props.children}</main>
			<footer class={styles.footer}>
				<div class={styles.footerInner}>
					<p>&copy; Year 312 VaultMart. A division of Armok Holdings LLC.</p>
					<p class={styles.footerMuted}>
						All prices in Gold Sovereigns (GS). Copper Coins (CC) accepted at
						1:100 rate.
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage(props: { onNavigate: (page: Page, extra?: string) => void }) {
	const featured = getFeatured();
	const newArrivals = getNew();

	return (
		<div class={styles.homePage}>
			<section class={styles.heroBanner}>
				<div class={styles.heroBannerText}>
					<p class={styles.heroBannerSub}>Welcome to</p>
					<h1 class={styles.heroBannerTitle}>VaultMart</h1>
					<p class={styles.heroBannerDesc}>
						Your trusted supplier for mining equipment, forge materials, and
						surface imports. Serving Mountainhome since Year 89.
					</p>
					<button
						type="button"
						class={styles.heroCta}
						onClick={() => props.onNavigate('catalog')}
					>
						Shop All Products →
					</button>
				</div>
			</section>
			<section class={styles.section}>
				<h2 class={styles.sectionTitle}>Browse by Category</h2>
				<div class={styles.catTiles}>
					<For each={categories}>
						{(cat) => (
							<button
								type="button"
								class={styles.catTile}
								onClick={() => props.onNavigate('catalog')}
								data-category={cat}
							>
								<span class={styles.catTileName}>{cat}</span>
								<span class={styles.catTileCount}>
									{getByCategory(cat).length} items
								</span>
							</button>
						)}
					</For>
				</div>
			</section>
			<section class={styles.section}>
				<h2 class={styles.sectionTitle}>Featured Products</h2>
				<div class={styles.grid3}>
					<For each={featured}>
						{(p) => <ProductCard product={p} onNavigate={props.onNavigate} />}
					</For>
				</div>
			</section>
			<section class={styles.section}>
				<h2 class={styles.sectionTitle}>New Arrivals</h2>
				<div class={styles.grid3}>
					<For each={newArrivals.slice(0, 6)}>
						{(p) => <ProductCard product={p} onNavigate={props.onNavigate} />}
					</For>
				</div>
				<button
					type="button"
					class={styles.viewAllBtn}
					onClick={() => props.onNavigate('catalog')}
				>
					View All Products →
				</button>
			</section>
		</div>
	);
}

function CatalogPage(props: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const [activeCategory, setActiveCategory] = createSignal('All');
	const [page, setPage] = createSignal(1);
	const PER_PAGE = 9;

	const filtered = () =>
		activeCategory() === 'All' ? products : getByCategory(activeCategory());
	const totalPages = () => Math.ceil(filtered().length / PER_PAGE);
	const pageItems = () =>
		filtered().slice((page() - 1) * PER_PAGE, page() * PER_PAGE);

	return (
		<div class={styles.catalogPage}>
			<h1 class={styles.pageTitle}>All Products</h1>
			<div class={styles.catalogLayout}>
				<aside class={styles.filterRail}>
					<h3 class={styles.filterTitle}>Category</h3>
					<button
						type="button"
						class={`${styles.filterItem} ${activeCategory() === 'All' ? styles.filterItemActive : ''}`}
						onClick={() => {
							setActiveCategory('All');
							setPage(1);
						}}
					>
						All ({products.length})
					</button>
					<For each={categories}>
						{(cat) => (
							<button
								type="button"
								class={`${styles.filterItem} ${activeCategory() === cat ? styles.filterItemActive : ''}`}
								onClick={() => {
									setActiveCategory(cat);
									setPage(1);
								}}
								data-category={cat}
							>
								{cat} ({getByCategory(cat).length})
							</button>
						)}
					</For>
				</aside>
				<div class={styles.catalogMain}>
					<div class={styles.catalogMeta}>
						<span>{filtered().length} products</span>
					</div>
					<div class={styles.grid3}>
						<For each={pageItems()}>
							{(p) => <ProductCard product={p} onNavigate={props.onNavigate} />}
						</For>
					</div>
					<Show when={totalPages() > 1}>
						<div class={styles.pagination}>
							<For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
								{(p) => (
									<button
										type="button"
										class={`${styles.pageBtn} ${p === page() ? styles.pageBtnActive : ''}`}
										onClick={() => setPage(p)}
									>
										{p}
									</button>
								)}
							</For>
						</div>
					</Show>
				</div>
			</div>
		</div>
	);
}

function ProductPage(props: {
	sku: string;
	onNavigate: (page: Page, extra?: string) => void;
	onAddToCart: (sku: string) => void;
}) {
	const product = () => getProductBySku(props.sku);
	const [qty, setQty] = createSignal(1);

	const related = () =>
		product()
			? getByCategory(product()!.category)
					.filter((p) => p.sku !== props.sku)
					.slice(0, 3)
			: [];

	return (
		<Show
			when={product()}
			fallback={
				<div class={styles.notFound}>
					<h1>Product not found</h1>
					<button type="button" onClick={() => props.onNavigate('catalog')}>
						← Back to Catalog
					</button>
				</div>
			}
		>
			{(prod) => (
				<div class={styles.productPage}>
					<nav class={styles.breadcrumb}>
						<button type="button" onClick={() => props.onNavigate('home')}>
							Home
						</button>
						{' / '}
						<button type="button" onClick={() => props.onNavigate('catalog')}>
							{prod().category}
						</button>
						{' / '}
						<span>{prod().name}</span>
					</nav>
					<div class={styles.productDetail}>
						<div class={styles.productDetailImg}>
							<img
								src={prod().image}
								alt={prod().name}
								width="560"
								height="400"
							/>
							<div class={styles.productBadges}>
								<Show when={prod().isNew}>
									<span class={styles.badgeNew}>NEW</span>
								</Show>
								<Show when={!prod().inStock}>
									<span class={styles.badgeOos}>OUT OF STOCK</span>
								</Show>
								<Show when={prod().salePrice}>
									<span class={styles.badgeSale}>SALE</span>
								</Show>
							</div>
						</div>
						<div class={styles.productDetailInfo}>
							<CategoryBadge category={prod().category} />
							<h1 class={styles.productDetailName}>{prod().name}</h1>
							<div class={styles.productDetailMeta}>
								<StarRating
									rating={prod().rating}
									reviewCount={prod().reviewCount}
								/>
								<span class={styles.skuLabel}>SKU: {prod().sku}</span>
							</div>
							<div class={styles.productDetailPrice}>
								<PriceDisplay product={prod()} />
							</div>
							<p class={styles.productDetailExcerpt}>{prod().excerpt}</p>
							<Show
								when={
									prod().stock && prod().inStock && (prod().stock ?? 0) <= 5
								}
							>
								<p class={styles.lowStock}>
									Only {prod().stock} left in stock!
								</p>
							</Show>
							<Show
								when={prod().inStock}
								fallback={<p class={styles.outOfStock}>Out of Stock</p>}
							>
								<div class={styles.addToCartRow}>
									<div class={styles.qtyControl}>
										<button
											type="button"
											onClick={() => setQty(Math.max(1, qty() - 1))}
										>
											−
										</button>
										<span data-qty={qty()}>{qty()}</span>
										<button type="button" onClick={() => setQty(qty() + 1)}>
											+
										</button>
									</div>
									<button
										type="button"
										class={styles.addToCartBtn}
										onClick={() => {
											props.onAddToCart(prod().sku);
											props.onNavigate('cart');
										}}
									>
										Add to Cart
									</button>
								</div>
							</Show>
							<div class={styles.variantSelects}>
								<div class={styles.variantGroup}>
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
								<div class={styles.variantGroup}>
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
					<Show when={related().length > 0}>
						<section class={styles.relatedSection}>
							<h2 class={styles.sectionTitle}>Related Products</h2>
							<div class={styles.grid3}>
								<For each={related()}>
									{(p) => (
										<ProductCard product={p} onNavigate={props.onNavigate} />
									)}
								</For>
							</div>
						</section>
					</Show>
				</div>
			)}
		</Show>
	);
}

function CartPage(props: {
	cart: CartItem[];
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const items = () =>
		props.cart
			.map((ci) => ({ ...ci, product: getProductBySku(ci.sku) }))
			.filter((ci) => ci.product);

	const displayItems = () => {
		const it = items();
		if (it.length > 0) {
			return it;
		}
		return [
			{ sku: 'VM-MIN-001', qty: 2, product: getProductBySku('VM-MIN-001') },
			{ sku: 'VM-FDB-002', qty: 1, product: getProductBySku('VM-FDB-002') },
			{ sku: 'VM-SRF-001', qty: 1, product: getProductBySku('VM-SRF-001') },
		].filter((ci) => ci.product);
	};

	const displaySubtotal = () =>
		displayItems().reduce((sum, ci) => {
			const p = ci.product!;
			return sum + (p.salePrice || p.basePrice) * ci.qty;
		}, 0);
	const displayTotal = () => displaySubtotal() + 3.5;

	const ldJson = () =>
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Order',
			orderStatus: 'OrderProcessing',
			priceCurrency: 'GS',
			price: displayTotal().toFixed(2),
			orderedItem: displayItems().map((ci) => ({
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
		});

	return (
		<div class={styles.cartPage}>
			<h1 class={styles.pageTitle}>Your Cart</h1>
			<script type="application/ld+json" innerHTML={ldJson()} />
			<div class={styles.cartLayout}>
				<div class={styles.cartItems}>
					<For each={displayItems()}>
						{(ci) => (
							<div class={styles.cartItem}>
								<img
									src={ci.product!.image}
									alt={ci.product!.name}
									width="80"
									height="60"
								/>
								<div class={styles.cartItemInfo}>
									<a
										class={styles.cartItemName}
										onClick={() => props.onNavigate('product', ci.sku)}
									>
										{ci.product!.name}
									</a>
									<div class={styles.cartItemMeta}>
										SKU: {ci.sku} · Qty: {ci.qty}
									</div>
								</div>
								<div class={styles.cartItemPrice}>
									{(
										(ci.product!.salePrice || ci.product!.basePrice) * ci.qty
									).toFixed(2)}{' '}
									GS
								</div>
							</div>
						)}
					</For>
				</div>
				<div class={styles.cartSummary}>
					<h2 class={styles.summaryTitle}>Order Summary</h2>
					<div class={styles.summaryRow}>
						<span>Subtotal</span>
						<span>{displaySubtotal().toFixed(2)} GS</span>
					</div>
					<div class={styles.summaryRow}>
						<span>Shipping</span>
						<span>3.50 GS</span>
					</div>
					<div class={`${styles.summaryRow} ${styles.summaryTotal}`}>
						<span>Total</span>
						<span>{displayTotal().toFixed(2)} GS</span>
					</div>
					<button type="button" class={styles.checkoutBtn}>
						Proceed to Checkout
					</button>
					<button
						type="button"
						class={styles.continueBtn}
						onClick={() => props.onNavigate('catalog')}
					>
						Continue Shopping
					</button>
				</div>
			</div>
		</div>
	);
}

function SearchPage(props: {
	query: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const q = () => props.query.toLowerCase();
	const results = () =>
		q()
			? products.filter(
					(p) =>
						p.name.toLowerCase().includes(q()) ||
						p.excerpt.toLowerCase().includes(q()),
				)
			: [];

	function highlight(text: string): JSX.Element {
		if (!q()) {
			return <>{text}</>;
		}
		const parts = text.split(new RegExp(`(${q()})`, 'gi'));
		return (
			<>
				{parts.map((part) =>
					// biome-ignore lint/correctness/useJsxKeyInIterable: Solid does not use React key prop
					part.toLowerCase() === q() ? <mark>{part}</mark> : part,
				)}
			</>
		);
	}

	return (
		<div class={styles.searchPage}>
			<h1 class={styles.pageTitle}>
				Search Results{' '}
				<Show when={props.query}>
					<span class={styles.searchQuery}>
						for &ldquo;{props.query}&rdquo;
					</span>
				</Show>
			</h1>
			<Show
				when={results().length === 0}
				fallback={
					<div class={styles.searchResults}>
						<p class={styles.searchCount}>
							{results().length} product{results().length !== 1 ? 's' : ''}{' '}
							found
						</p>
						<For each={results()}>
							{(p) => (
								<div class={styles.searchResultItem} data-sku={p.sku}>
									<img src={p.image} alt={p.name} width="100" height="75" />
									<div class={styles.searchResultInfo}>
										<a
											class={styles.searchResultName}
											onClick={() => props.onNavigate('product', p.sku)}
										>
											{highlight(p.name)}
										</a>
										<p class={styles.searchResultExcerpt}>
											{highlight(p.excerpt)}
										</p>
									</div>
									<span class={styles.searchResultPrice}>
										{(p.salePrice || p.basePrice).toFixed(2)} GS
									</span>
								</div>
							)}
						</For>
					</div>
				}
			>
				<p class={styles.noResults}>
					{props.query ? 'No products found.' : 'Enter a search term above.'}
				</p>
			</Show>
		</div>
	);
}

export default function EshopApp(props: {
	initialPage?: Page;
	initialSku?: string;
}) {
	const [ready, setReady] = createSignal(false);
	const [page, setPage] = createSignal<Page>(props.initialPage || 'home');
	const [sku, setSku] = createSignal<string | undefined>(props.initialSku);
	const [searchQuery, setSearchQuery] = createSignal('');
	const [cart, setCart] = createSignal<CartItem[]>([]);

	onMount(() => {
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
		onCleanup(() => window.removeEventListener('popstate', onPop));
	});

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

	const cartCount = () => cart().reduce((sum, i) => sum + i.qty, 0);

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						display: 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'min-height': '100vh',
						'font-family': 'system-ui',
						color: '#888',
					}}
				>
					Loading…
				</div>
			}
		>
			<EshopShell
				activePage={page()}
				onNavigate={navigate}
				cartCount={cartCount()}
			>
				<Switch>
					<Match when={page() === 'home'}>
						<HomePage onNavigate={navigate} />
					</Match>
					<Match when={page() === 'catalog'}>
						<CatalogPage onNavigate={navigate} />
					</Match>
					<Match when={page() === 'product'}>
						<ProductPage
							sku={sku() || ''}
							onNavigate={navigate}
							onAddToCart={addToCart}
						/>
					</Match>
					<Match when={page() === 'cart'}>
						<CartPage cart={cart()} onNavigate={navigate} />
					</Match>
					<Match when={page() === 'search'}>
						<SearchPage query={searchQuery()} onNavigate={navigate} />
					</Match>
					<Match when={true}>
						<HomePage onNavigate={navigate} />
					</Match>
				</Switch>
			</EshopShell>
		</Show>
	);
}
