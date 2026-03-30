<script lang="ts">
// @qscrape L2 / svelte / eshop — VaultMart
import { onDestroy, onMount } from 'svelte';
import '../../../../styles/l2/eshop.css';

import { fakeGet } from '../../../../data/api';
import {
	getByCategory,
	getProductBySku,
	type ProductMeta,
	products,
} from '../../../../data/eshop/products';

type Page =
	| { name: 'home' }
	| { name: 'catalog'; category?: string }
	| { name: 'product'; sku: string }
	| { name: 'cart' }
	| { name: 'search'; query: string };

interface CartItem {
	sku: string;
	qty: number;
	price: number;
	name: string;
}

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function urlToPage(): Page {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'catalog') {
		return { name: 'catalog', category: p.get('cat') ?? undefined };
	}
	if (seg === 'product') {
		return { name: 'product', sku: p.get('sku') ?? '' };
	}
	if (seg === 'cart') {
		return { name: 'cart' };
	}
	if (seg === 'search') {
		return { name: 'search', query: p.get('q') ?? '' };
	}
	return { name: 'home' };
}
function pageToUrl(p: Page): string {
	const base = getBase();
	if (p.name === 'catalog') {
		return `${base}catalog${p.category ? `?cat=${encodeURIComponent(p.category)}` : ''}`;
	}
	if (p.name === 'product') {
		return `${base}product?sku=${encodeURIComponent(p.sku)}`;
	}
	if (p.name === 'cart') {
		return `${base}cart`;
	}
	if (p.name === 'search') {
		return `${base}search?q=${encodeURIComponent(p.query)}`;
	}
	return base;
}

let _ready = false;
let current: Page = { name: 'home' };
let cart: CartItem[] = [
	{ sku: 'VM-MIN-001', qty: 2, price: 14.5, name: 'Standard Iron Pickaxe' },
	{
		sku: 'VM-FDB-002',
		qty: 1,
		price: 18.0,
		name: 'Dwarven Ale (6-flagon case)',
	},
	{
		sku: 'VM-FRG-001',
		qty: 1,
		price: 12.0,
		name: 'Iron Ingot Bundle (10-bar)',
	},
];
let searchQuery = '';

function nav(p: Page) {
	current = p;
	history.pushState(null, '', pageToUrl(p));
	window.scrollTo(0, 0);
}

function onPop() {
	current = urlToPage();
	window.scrollTo(0, 0);
}
onMount(() => {
	current = urlToPage();
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		_ready = true;
	});
});
onDestroy(() => window.removeEventListener('popstate', onPop));

function _addToCart(product: ProductMeta) {
	const existing = cart.find((c) => c.sku === product.sku);
	if (existing) {
		cart = cart.map((c) =>
			c.sku === product.sku ? { ...c, qty: c.qty + 1 } : c,
		);
	} else {
		cart = [
			...cart,
			{
				sku: product.sku,
				qty: 1,
				price: product.salePrice ?? product.basePrice,
				name: product.name,
			},
		];
	}
}

function _updateQty(sku: string, qty: number) {
	if (qty < 1) {
		cart = cart.filter((c) => c.sku !== sku);
		return;
	}
	cart = cart.map((c) => (c.sku === sku ? { ...c, qty } : c));
}

$: cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
$: cartCount = cart.reduce((s, c) => s + c.qty, 0);

function _highlight(text: string, query: string): string {
	if (!query.trim()) {
		return text;
	}
	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function _doSearch() {
	if (searchQuery.trim()) {
		nav({ name: 'search', query: searchQuery.trim() });
	}
}

$: searchResults =
	current.name === 'search'
		? products.filter(
				(p) =>
					p.name.toLowerCase().includes(current.query.toLowerCase()) ||
					p.excerpt.toLowerCase().includes(current.query.toLowerCase()),
			)
		: [];

$: catalogProducts =
	current.name === 'catalog'
		? current.category
			? getByCategory(current.category as any)
			: products
		: [];

$: currentProduct =
	current.name === 'product' ? getProductBySku(current.sku) : null;
</script>

{#if !ready}
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;color:#5a6e7a;background:#f0f2f4">Loading…</div>
{:else}
<div class="vm-shell">
  <!-- Header -->
  <header class="vm-header">
    <div class="vm-header-inner">
      <button class="vm-logo" on:click={() => nav({ name: 'home' })}>VaultMart</button>
      <form class="vm-search-form" on:submit|preventDefault={doSearch}>
        <input
          class="vm-search-input"
          bind:value={searchQuery}
          type="search"
          placeholder="Search products…"
          aria-label="Search"
        />
        <button class="vm-search-btn" type="submit">Search</button>
      </form>
      <button class="vm-cart-btn" on:click={() => nav({ name: 'cart' })}>
        Cart ({cartCount})
      </button>
    </div>
    <nav class="vm-nav">
      <button on:click={() => nav({ name: 'catalog' })}>All Products</button>
      {#each categories as cat}
        <button on:click={() => nav({ name: 'catalog', category: cat })}>{cat}</button>
      {/each}
    </nav>
  </header>

  <main class="vm-main">
    <!-- HOME -->
    {#if current.name === 'home'}
      <section class="vm-hero">
        <h1>Your fortress supply store</h1>
        <p>Mining tools, forge materials, food & more — delivered to any z-level.</p>
        <button class="vm-btn-cta" on:click={() => nav({ name: 'catalog' })}>Shop All Products</button>
      </section>
      <section class="vm-section">
        <h2 class="vm-section-title">Featured Products</h2>
        <div class="vm-product-grid">
          {#each getFeatured() as p}
            <div class="vm-product-card" data-sku={p.sku} data-category={p.category}>
              <img src={p.image} alt={p.name} />
              <div class="vm-card-body">
                <p class="vm-cat-label">{p.category}</p>
                <h3><button class="link-btn" on:click={() => nav({ name: 'product', sku: p.sku })}>{p.name}</button></h3>
                <p class="vm-excerpt">{p.excerpt}</p>
                <div class="vm-price-row">
                  {#if p.salePrice}
                    <span class="vm-price-sale">{formatPrice(p.salePrice)}</span>
                    <span class="vm-price-was">{formatPrice(p.basePrice)}</span>
                  {:else}
                    <span class="vm-price">{formatPrice(p.basePrice)}</span>
                  {/if}
                </div>
                <div class="vm-card-actions">
                  {#if p.inStock}
                    <button class="vm-btn-add" on:click={() => addToCart(p)}>Add to Cart</button>
                  {:else}
                    <button class="vm-btn-oos" disabled>Out of Stock</button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
      <section class="vm-section">
        <h2 class="vm-section-title">New Arrivals</h2>
        <div class="vm-product-grid">
          {#each getNew() as p}
            <div class="vm-product-card" data-sku={p.sku} data-category={p.category}>
              <img src={p.image} alt={p.name} />
              <div class="vm-card-body">
                <p class="vm-cat-label">{p.category}</p>
                <h3><button class="link-btn" on:click={() => nav({ name: 'product', sku: p.sku })}>{p.name}</button></h3>
                <div class="vm-price-row">
                  <span class="vm-price">{formatPrice(p.basePrice)}</span>
                </div>
                {#if p.inStock}
                  <button class="vm-btn-add" on:click={() => addToCart(p)}>Add to Cart</button>
                {:else}
                  <button class="vm-btn-oos" disabled>Out of Stock</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </section>

    <!-- CATALOG -->
    {:else if current.name === 'catalog'}
      <div class="vm-catalog-header">
        <h2>{current.category ?? 'All Products'}</h2>
        <div class="vm-cat-tabs">
          <button class="vm-cat-tab{!current.category ? ' active' : ''}" on:click={() => nav({ name: 'catalog' })}>All</button>
          {#each categories as cat}
            <button class="vm-cat-tab{current.category === cat ? ' active' : ''}" on:click={() => nav({ name: 'catalog', category: cat })}>{cat}</button>
          {/each}
        </div>
      </div>
      <div class="vm-product-grid">
        {#each catalogProducts as p}
          <div class="vm-product-card" data-sku={p.sku} data-category={p.category}>
            <img src={p.image} alt={p.name} />
            <div class="vm-card-body">
              <p class="vm-cat-label">{p.category}</p>
              {#if p.isNew}<span class="vm-badge-new">New</span>{/if}
              <h3><button class="link-btn" on:click={() => nav({ name: 'product', sku: p.sku })}>{p.name}</button></h3>
              <p class="vm-excerpt">{p.excerpt}</p>
              <div class="vm-rating">
                <span class="vm-stars" aria-label="{p.rating} stars">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
                <span class="vm-review-count">({p.reviewCount})</span>
              </div>
              <div class="vm-price-row">
                {#if p.salePrice}
                  <span class="vm-price-sale">{formatPrice(p.salePrice)}</span>
                  <span class="vm-price-was">{formatPrice(p.basePrice)}</span>
                {:else}
                  <span class="vm-price">{formatPrice(p.basePrice)}</span>
                {/if}
              </div>
              {#if p.inStock}
                <button class="vm-btn-add" on:click={() => addToCart(p)}>Add to Cart</button>
              {:else}
                <button class="vm-btn-oos" disabled>Out of Stock</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>

    <!-- PRODUCT DETAIL -->
    {:else if current.name === 'product' && currentProduct}
      {@const p = currentProduct}
      <div class="vm-product-detail" data-sku={p.sku} data-category={p.category}>
        <div class="vm-detail-grid">
          <div class="vm-detail-image">
            <img src={p.image} alt={p.name} />
          </div>
          <div class="vm-detail-info">
            <p class="vm-cat-label">{p.category}</p>
            <h1 class="vm-detail-title">{p.name}</h1>
            <div class="vm-rating">
              <span class="vm-stars">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
              <span class="vm-review-count">({p.reviewCount} reviews)</span>
            </div>
            <p class="vm-detail-excerpt">{p.excerpt}</p>
            <div class="vm-price-row">
              {#if p.salePrice}
                <span class="vm-price-sale">{formatPrice(p.salePrice)}</span>
                <span class="vm-price-was">{formatPrice(p.basePrice)}</span>
              {:else}
                <span class="vm-price">{formatPrice(p.basePrice)}</span>
              {/if}
            </div>
            <div class="vm-variants">
              <label for="vm-material">Material</label>
              <select id="vm-material" name="material" disabled data-price-mod="0" data-in-stock="true">
                <option value="standard">Standard</option>
                <option value="masterwork">Masterwork (+20 GS)</option>
              </select>
              <label for="vm-qty">Quantity</label>
              <select id="vm-qty" name="quantity" disabled data-price-mod="0" data-in-stock="true">
                {#each [1,2,3,4,5] as n}
                  <option value={n}>{n}</option>
                {/each}
              </select>
            </div>
            {#if p.stock !== undefined}
              <p class="vm-stock-warn">Only {p.stock} left in stock</p>
            {/if}
            {#if p.inStock}
              <button class="vm-btn-add" on:click={() => addToCart(p)}>Add to Cart</button>
            {:else}
              <button class="vm-btn-oos" disabled>Out of Stock</button>
            {/if}
          </div>
        </div>
        <div class="vm-detail-nav">
          <button class="vm-btn-secondary" on:click={() => nav({ name: 'catalog' })}>← Back to Catalog</button>
        </div>
      </div>

    <!-- CART -->
    {:else if current.name === 'cart'}
      <div class="vm-cart" itemscope itemtype="https://schema.org/Order">
        <h2>Your Cart</h2>
        {#if cart.length === 0}
          <p class="vm-empty">Your cart is empty. <button class="link-btn" on:click={() => nav({ name: 'catalog' })}>Continue shopping</button></p>
        {:else}
          <table class="vm-cart-table">
            <thead>
              <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
              {#each cart as item}
                <tr itemprop="orderedItem" itemscope itemtype="https://schema.org/OrderItem">
                  <td itemprop="orderedItem">{item.name}</td>
                  <td itemprop="orderItemPrice">{formatPrice(item.price)}</td>
                  <td>
                    <input
                      class="vm-qty-input"
                      type="number"
                      min="0"
                      value={item.qty}
                      on:change={(e) => updateQty(item.sku, Number((e.target as HTMLInputElement).value))}
                    />
                  </td>
                  <td>{formatPrice(item.price * item.qty)}</td>
                  <td><button class="vm-remove-btn" on:click={() => updateQty(item.sku, 0)}>Remove</button></td>
                </tr>
              {/each}
            </tbody>
          </table>
          <div class="vm-cart-total">
            <span>Total:</span>
            <strong itemprop="price">{formatPrice(cartTotal)}</strong>
          </div>
          <button class="vm-btn-cta">Proceed to Checkout</button>
        {/if}
      </div>

    <!-- SEARCH RESULTS -->
    {:else if current.name === 'search'}
      <div class="vm-search-results">
        <h2>Search results for "{current.query}"</h2>
        <p class="vm-result-count">{searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found</p>
        <div class="vm-product-grid">
          {#each searchResults as p}
            <div class="vm-product-card" data-sku={p.sku} data-category={p.category}>
              <img src={p.image} alt={p.name} />
              <div class="vm-card-body">
                <p class="vm-cat-label">{p.category}</p>
                <h3><button class="link-btn" on:click={() => nav({ name: 'product', sku: p.sku })}>
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  {@html highlight(p.name, current.query)}
                </button></h3>
                <p class="vm-excerpt">{@html highlight(p.excerpt, current.query)}</p>
                <div class="vm-price-row">
                  {#if p.salePrice}
                    <span class="vm-price-sale">{formatPrice(p.salePrice)}</span>
                    <span class="vm-price-was">{formatPrice(p.basePrice)}</span>
                  {:else}
                    <span class="vm-price">{formatPrice(p.basePrice)}</span>
                  {/if}
                </div>
                {#if p.inStock}
                  <button class="vm-btn-add" on:click={() => addToCart(p)}>Add to Cart</button>
                {:else}
                  <button class="vm-btn-oos" disabled>Out of Stock</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </main>

  <footer class="vm-footer">
    <p>© Year 312 VaultMart · All fortress levels served · Trading Post Z-Level 8</p>
  </footer>
</div>
{/if}

<style>
  .vm-shell { min-height: 100vh; display: flex; flex-direction: column; }

  /* Header */
  .vm-header { background: var(--vm-surface); border-bottom: 1px solid var(--vm-border); position: sticky; top: 0; z-index: 100; }
  .vm-header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 16px; }
  .vm-logo { background: none; border: none; color: var(--vm-primary); font-family: var(--vm-font); font-size: 1.5rem; font-weight: 700; cursor: pointer; }
  .vm-search-form { flex: 1; display: flex; gap: 6px; }
  .vm-search-input { flex: 1; padding: 8px 12px; border: 1px solid var(--vm-border); border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 14px; }
  .vm-search-btn { background: var(--vm-primary); color: #fff; border: none; padding: 8px 16px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 14px; cursor: pointer; }
  .vm-cart-btn { background: var(--vm-cta); color: #fff; border: none; padding: 8px 18px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .vm-nav { max-width: 1200px; margin: 0 auto; padding: 6px 24px; display: flex; flex-wrap: wrap; gap: 4px; }
  .vm-nav button { background: none; border: none; color: var(--vm-muted); font-family: var(--vm-font); font-size: 13px; padding: 4px 12px; cursor: pointer; border-radius: 20px; }
  .vm-nav button:hover { background: var(--vm-bg); color: var(--vm-text); }

  /* Main */
  .vm-main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 32px 24px; }

  /* Hero */
  .vm-hero { background: var(--vm-primary); color: #fff; border-radius: var(--vm-radius); padding: 40px 32px; text-align: center; margin-bottom: 40px; }
  .vm-hero h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
  .vm-hero p { font-size: 1.1rem; opacity: 0.85; margin-bottom: 20px; }

  /* Section */
  .vm-section { margin-bottom: 40px; }
  .vm-section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; }

  /* Product grid */
  .vm-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .vm-product-card { background: var(--vm-surface); border: 1px solid var(--vm-border); border-radius: var(--vm-radius); overflow: hidden; }
  .vm-card-body { padding: 14px; }
  .vm-cat-label { font-size: 11px; color: var(--vm-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .vm-card-body h3, .vm-detail-title { font-size: 1rem; font-weight: 600; margin-bottom: 6px; }
  .link-btn { background: none; border: none; color: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; cursor: pointer; text-align: left; padding: 0; }
  .link-btn:hover { color: var(--vm-primary); }
  .vm-excerpt { font-size: 13px; color: var(--vm-muted); margin-bottom: 8px; line-height: 1.5; }
  .vm-badge-new { font-size: 10px; font-weight: 700; background: var(--vm-cta); color: #fff; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.06em; display: inline-block; margin-bottom: 4px; }
  .vm-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
  .vm-stars { color: #f59e0b; font-size: 13px; }
  .vm-review-count { font-size: 12px; color: var(--vm-muted); }
  .vm-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
  .vm-price { font-size: 1.1rem; font-weight: 700; color: var(--vm-text); }
  .vm-price-sale { font-size: 1.1rem; font-weight: 700; color: var(--vm-cta); }
  .vm-price-was { font-size: 13px; text-decoration: line-through; color: var(--vm-muted); }
  .vm-btn-add { background: var(--vm-cta); color: #fff; border: none; padding: 8px 16px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; }
  .vm-btn-add:hover { background: var(--vm-cta-hover); }
  .vm-btn-oos { background: var(--vm-border); color: var(--vm-muted); border: none; padding: 8px 16px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 13px; cursor: not-allowed; width: 100%; }
  .vm-btn-cta { background: var(--vm-cta); color: #fff; border: none; padding: 12px 28px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 15px; font-weight: 700; cursor: pointer; }
  .vm-btn-cta:hover { background: var(--vm-cta-hover); }
  .vm-btn-secondary { background: none; border: 1px solid var(--vm-border); color: var(--vm-text); padding: 8px 18px; border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 14px; cursor: pointer; }

  /* Catalog header */
  .vm-catalog-header { margin-bottom: 24px; }
  .vm-catalog-header h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 12px; }
  .vm-cat-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
  .vm-cat-tab { background: var(--vm-surface); border: 1px solid var(--vm-border); padding: 5px 14px; font-family: var(--vm-font); font-size: 13px; cursor: pointer; border-radius: 20px; color: var(--vm-muted); }
  .vm-cat-tab:hover, .vm-cat-tab.active { background: var(--vm-primary); border-color: var(--vm-primary); color: #fff; }

  /* Product detail */
  .vm-product-detail { max-width: 960px; }
  .vm-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 32px; }
  .vm-detail-image img { width: 100%; border-radius: var(--vm-radius); }
  .vm-detail-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; }
  .vm-detail-excerpt { font-size: 15px; line-height: 1.6; margin-bottom: 16px; }
  .vm-variants { display: flex; flex-direction: column; gap: 6px; margin: 16px 0; }
  .vm-variants label { font-size: 13px; font-weight: 600; color: var(--vm-muted); }
  .vm-variants select { padding: 7px 10px; border: 1px solid var(--vm-border); border-radius: var(--vm-radius); font-family: var(--vm-font); font-size: 14px; background: var(--vm-surface); }
  .vm-stock-warn { font-size: 13px; color: #ef4444; margin-bottom: 8px; }
  .vm-detail-nav { margin-top: 24px; }

  /* Cart */
  .vm-cart h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 20px; }
  .vm-empty { font-size: 15px; color: var(--vm-muted); }
  .vm-cart-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .vm-cart-table th { text-align: left; font-size: 13px; color: var(--vm-muted); padding: 8px 12px; border-bottom: 2px solid var(--vm-border); }
  .vm-cart-table td { padding: 12px; border-bottom: 1px solid var(--vm-border); font-size: 15px; }
  .vm-qty-input { width: 60px; padding: 4px 8px; border: 1px solid var(--vm-border); border-radius: var(--vm-radius); font-size: 14px; }
  .vm-remove-btn { background: none; border: none; color: #ef4444; font-size: 13px; cursor: pointer; }
  .vm-cart-total { text-align: right; font-size: 1.2rem; margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 12px; }

  /* Search */
  .vm-search-results h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 4px; }
  .vm-result-count { font-size: 13px; color: var(--vm-muted); margin-bottom: 20px; }
  :global(mark) { background: #fef08a; color: inherit; border-radius: 2px; padding: 0 1px; }

  /* Footer */
  .vm-footer { background: var(--vm-surface); border-top: 1px solid var(--vm-border); text-align: center; padding: 20px 24px; font-size: 13px; color: var(--vm-muted); }
</style>
