<!-- @qscrape L2 / vue / eshop -->
<!-- @component EshopApp -->
<template>
  <div v-if="!ready" style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;color:#888">Loading…</div>
  <div v-else class="vm-shell">
    <!-- Header -->
    <header class="vm-header">
      <div class="vm-header-inner">
        <button class="vm-logo" @click="navigate('home')">VaultMart</button>
        <form class="vm-search-bar" @submit.prevent="doSearch">
          <input type="search" class="vm-search-input" placeholder="Search products…" v-model="searchQ" />
          <button type="submit" class="vm-search-btn">Search</button>
        </form>
        <button class="vm-cart-btn" @click="navigate('cart')">
          Cart <span v-if="cartCount > 0" class="vm-cart-badge">{{ cartCount }}</span>
        </button>
      </div>
      <nav class="vm-cat-nav">
        <div class="vm-cat-nav-inner">
          <button :class="['vm-cat-nav-item', { 'vm-cat-nav-item--active': page === 'home' }]" @click="navigate('home')">Home</button>
          <button v-for="cat in categories" :key="cat" class="vm-cat-nav-item" @click="navigate('catalog')">{{ cat }}</button>
          <button :class="['vm-cat-nav-item', { 'vm-cat-nav-item--active': page === 'catalog' }]" @click="navigate('catalog')">All Products</button>
        </div>
      </nav>
    </header>

    <!-- Home -->
    <main class="vm-main" v-if="page === 'home'">
      <section class="vm-hero-banner">
        <div class="vm-hero-text">
          <p class="vm-hero-sub">Welcome to</p>
          <h1 class="vm-hero-title">VaultMart</h1>
          <p class="vm-hero-desc">Your trusted supplier for mining equipment, forge materials, and surface imports.</p>
          <button class="vm-hero-cta" @click="navigate('catalog')">Shop All Products →</button>
        </div>
      </section>

      <section class="vm-section">
        <h2 class="vm-section-title">Browse by Category</h2>
        <div class="vm-cat-tiles">
          <button v-for="cat in categories" :key="cat" class="vm-cat-tile" :data-category="cat" @click="navigate('catalog')">
            <span class="vm-cat-tile-name">{{ cat }}</span>
            <span class="vm-cat-tile-count">{{ getByCategory(cat).length }} items</span>
          </button>
        </div>
      </section>

      <section class="vm-section">
        <h2 class="vm-section-title">Featured Products</h2>
        <div class="vm-grid3">
          <article v-for="p in featuredProducts" :key="p.sku" class="vm-product-card" :data-sku="p.sku" :data-category="p.category">
            <a class="vm-card-img" @click="navigate('product', p.sku)">
              <img :src="p.image" loading="lazy" width="280" height="200" />
              <div class="vm-badges">
                <span v-if="p.isNew" class="vm-badge-new">NEW</span>
                <span v-if="!p.inStock" class="vm-badge-oos">OUT OF STOCK</span>
                <span v-if="p.salePrice" class="vm-badge-sale">SALE</span>
              </div>
            </a>
            <div class="vm-card-body">
              <span :class="['vm-cat-badge', 'vm-cat-' + catSlug(p.category)]">{{ p.category }}</span>
              <h3 class="vm-product-name"><a @click="navigate('product', p.sku)">{{ p.name }}</a></h3>
              <div class="vm-stars">{{ starStr(p.rating) }} <span class="vm-review-count">({{ p.reviewCount }})</span></div>
              <div class="vm-card-footer">
                <span class="vm-sale-price" v-if="p.salePrice">{{ p.salePrice.toFixed(2) }} GS <span class="vm-orig-price">{{ p.basePrice.toFixed(2) }} GS</span></span>
                <span class="vm-price" v-else>{{ p.basePrice.toFixed(2) }} GS</span>
                <button v-if="p.inStock" class="vm-add-btn" @click="addToCart(p.sku)">Add to Cart</button>
                <span v-else class="vm-oos-label">Out of Stock</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="vm-section">
        <h2 class="vm-section-title">New Arrivals</h2>
        <div class="vm-grid3">
          <article v-for="p in newProducts.slice(0, 6)" :key="p.sku" class="vm-product-card" :data-sku="p.sku" :data-category="p.category">
            <a class="vm-card-img" @click="navigate('product', p.sku)">
              <img :src="p.image" loading="lazy" width="280" height="200" />
              <div class="vm-badges"><span class="vm-badge-new">NEW</span></div>
            </a>
            <div class="vm-card-body">
              <span :class="['vm-cat-badge', 'vm-cat-' + catSlug(p.category)]">{{ p.category }}</span>
              <h3 class="vm-product-name"><a @click="navigate('product', p.sku)">{{ p.name }}</a></h3>
              <div class="vm-stars">{{ starStr(p.rating) }} <span class="vm-review-count">({{ p.reviewCount }})</span></div>
              <div class="vm-card-footer">
                <span class="vm-price">{{ p.basePrice.toFixed(2) }} GS</span>
                <button class="vm-add-btn" @click="addToCart(p.sku)">Add to Cart</button>
              </div>
            </div>
          </article>
        </div>
        <button class="vm-view-all-btn" @click="navigate('catalog')">View All Products →</button>
      </section>
    </main>

    <!-- Catalog -->
    <main class="vm-main" v-else-if="page === 'catalog'">
      <h1 class="vm-page-title">All Products</h1>
      <div class="vm-catalog-layout">
        <aside class="vm-filter-rail">
          <h3 class="vm-filter-title">Category</h3>
          <button :class="['vm-filter-item', { 'vm-filter-item--active': catalogCat === 'All' }]" @click="setCatalogCat('All')">All ({{ products.length }})</button>
          <button v-for="cat in categories" :key="cat"
            :class="['vm-filter-item', { 'vm-filter-item--active': catalogCat === cat }]"
            :data-category="cat"
            @click="setCatalogCat(cat)">{{ cat }} ({{ getByCategory(cat).length }})</button>
        </aside>
        <div class="vm-catalog-main">
          <div class="vm-catalog-meta">{{ filteredProducts.length }} products</div>
          <div class="vm-grid3">
            <article v-for="p in pagedProducts" :key="p.sku" class="vm-product-card" :data-sku="p.sku" :data-category="p.category">
              <a class="vm-card-img" @click="navigate('product', p.sku)">
                <img :src="p.image" loading="lazy" width="280" height="200" />
                <div class="vm-badges">
                  <span v-if="p.isNew" class="vm-badge-new">NEW</span>
                  <span v-if="!p.inStock" class="vm-badge-oos">OUT OF STOCK</span>
                  <span v-if="p.salePrice" class="vm-badge-sale">SALE</span>
                </div>
              </a>
              <div class="vm-card-body">
                <span :class="['vm-cat-badge', 'vm-cat-' + catSlug(p.category)]">{{ p.category }}</span>
                <h3 class="vm-product-name"><a @click="navigate('product', p.sku)">{{ p.name }}</a></h3>
                <div class="vm-stars">{{ starStr(p.rating) }} <span class="vm-review-count">({{ p.reviewCount }})</span></div>
                <div class="vm-card-footer">
                  <span class="vm-sale-price" v-if="p.salePrice">{{ p.salePrice.toFixed(2) }} GS <span class="vm-orig-price">{{ p.basePrice.toFixed(2) }} GS</span></span>
                  <span class="vm-price" v-else>{{ p.basePrice.toFixed(2) }} GS</span>
                  <button v-if="p.inStock" class="vm-add-btn" @click="addToCart(p.sku)">Add to Cart</button>
                  <span v-else class="vm-oos-label">Out of Stock</span>
                </div>
              </div>
            </article>
          </div>
          <div v-if="totalCatalogPages > 1" class="vm-pagination">
            <button v-for="p in totalCatalogPages" :key="p"
              :class="['vm-page-btn', { 'vm-page-btn--active': catalogPage === p }]"
              @click="catalogPage = p">{{ p }}</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Product detail -->
    <main class="vm-main" v-else-if="page === 'product'">
      <div v-if="currentProduct">
        <nav class="vm-breadcrumb">
          <button @click="navigate('home')">Home</button> /
          <button @click="navigate('catalog')">{{ currentProduct.category }}</button> /
          <span>{{ currentProduct.name }}</span>
        </nav>
        <div class="vm-product-detail">
          <div class="vm-detail-img">
            <img :src="currentProduct.image" width="560" height="400" />
            <div class="vm-badges">
              <span v-if="currentProduct.isNew" class="vm-badge-new">NEW</span>
              <span v-if="!currentProduct.inStock" class="vm-badge-oos">OUT OF STOCK</span>
              <span v-if="currentProduct.salePrice" class="vm-badge-sale">SALE</span>
            </div>
          </div>
          <div class="vm-detail-info">
            <span :class="['vm-cat-badge', 'vm-cat-' + catSlug(currentProduct.category)]">{{ currentProduct.category }}</span>
            <h1 class="vm-detail-name">{{ currentProduct.name }}</h1>
            <div class="vm-detail-meta">
              <span class="vm-stars">{{ starStr(currentProduct.rating) }} <span class="vm-review-count">({{ currentProduct.reviewCount }})</span></span>
              <span class="vm-sku-label">SKU: {{ currentProduct.sku }}</span>
            </div>
            <div class="vm-detail-price">
              <span class="vm-sale-price" v-if="currentProduct.salePrice">{{ currentProduct.salePrice.toFixed(2) }} GS <span class="vm-orig-price">{{ currentProduct.basePrice.toFixed(2) }} GS</span></span>
              <span class="vm-price" v-else>{{ currentProduct.basePrice.toFixed(2) }} GS</span>
            </div>
            <p class="vm-detail-exc">{{ currentProduct.excerpt }}</p>
            <p v-if="currentProduct.stock && currentProduct.inStock && currentProduct.stock <= 5" class="vm-low-stock">Only {{ currentProduct.stock }} left in stock!</p>
            <div v-if="currentProduct.inStock" class="vm-atc-row">
              <div class="vm-qty-ctrl">
                <button @click="detailQty = Math.max(1, detailQty - 1)">−</button>
                <span :data-qty="detailQty">{{ detailQty }}</span>
                <button @click="detailQty++">+</button>
              </div>
              <button class="vm-atc-btn" @click="addToCart(currentProduct.sku); navigate('cart')">Add to Cart</button>
            </div>
            <p v-else class="vm-out-of-stock">Out of Stock</p>
            <div class="vm-variant-selects">
              <div class="vm-variant-group">
                <label>Material</label>
                <select disabled>
                  <option data-price-mod="0" data-in-stock="true">Standard</option>
                  <option data-price-mod="10" data-in-stock="true">Masterwork (+10 GS)</option>
                  <option data-price-mod="25" data-in-stock="false">Legendary (+25 GS, Out of Stock)</option>
                </select>
              </div>
              <div class="vm-variant-group">
                <label>Size</label>
                <select disabled>
                  <option data-price-mod="0" data-in-stock="true">Standard</option>
                  <option data-price-mod="5" data-in-stock="true">Large (+5 GS)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <section class="vm-section" v-if="relatedProducts.length">
          <h2 class="vm-section-title">Related Products</h2>
          <div class="vm-grid3">
            <article v-for="p in relatedProducts" :key="p.sku" class="vm-product-card" :data-sku="p.sku">
              <a class="vm-card-img" @click="navigate('product', p.sku)">
                <img :src="p.image" loading="lazy" width="280" height="200" />
              </a>
              <div class="vm-card-body">
                <h3 class="vm-product-name"><a @click="navigate('product', p.sku)">{{ p.name }}</a></h3>
                <div class="vm-card-footer">
                  <span class="vm-price">{{ (p.salePrice || p.basePrice).toFixed(2) }} GS</span>
                  <button v-if="p.inStock" class="vm-add-btn" @click="addToCart(p.sku)">Add</button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
      <div v-else class="vm-not-found">
        <h1>Product not found</h1>
        <button @click="navigate('catalog')">← Catalog</button>
      </div>
    </main>

    <!-- Cart -->
    <main class="vm-main" v-else-if="page === 'cart'">
      <h1 class="vm-page-title">Your Cart</h1>
      <div class="vm-cart-layout">
        <div class="vm-cart-items">
          <div v-for="ci in displayCartItems" :key="ci.sku" class="vm-cart-item">
            <img :src="ci.product.image" width="80" height="60" />
            <div class="vm-cart-item-info">
              <a class="vm-cart-item-name" @click="navigate('product', ci.sku)">{{ ci.product.name }}</a>
              <div class="vm-cart-item-meta">SKU: {{ ci.sku }} · Qty: {{ ci.qty }}</div>
            </div>
            <div class="vm-cart-item-price">{{ ((ci.product.salePrice || ci.product.basePrice) * ci.qty).toFixed(2) }} GS</div>
          </div>
        </div>
        <div class="vm-cart-summary">
          <h2 class="vm-summary-title">Order Summary</h2>
          <div class="vm-summary-row"><span>Subtotal</span><span>{{ displaySubtotal.toFixed(2) }} GS</span></div>
          <div class="vm-summary-row"><span>Shipping</span><span>3.50 GS</span></div>
          <div class="vm-summary-row vm-summary-total"><span>Total</span><span>{{ (displaySubtotal + 3.5).toFixed(2) }} GS</span></div>
          <button class="vm-checkout-btn">Proceed to Checkout</button>
          <button class="vm-continue-btn" @click="navigate('catalog')">Continue Shopping</button>
        </div>
      </div>
    </main>

    <!-- Search -->
    <main class="vm-main" v-else-if="page === 'search'">
      <h1 class="vm-page-title">Search Results <span v-if="searchQuery" class="vm-search-query">for &ldquo;{{ searchQuery }}&rdquo;</span></h1>
      <p v-if="!searchResults.length" class="vm-no-results">{{ searchQuery ? 'No products found.' : 'Enter a search term above.' }}</p>
      <div v-else>
        <p class="vm-search-count">{{ searchResults.length }} product{{ searchResults.length !== 1 ? 's' : '' }} found</p>
        <div class="vm-search-results">
          <div v-for="p in searchResults" :key="p.sku" class="vm-search-result-item" :data-sku="p.sku">
            <img :src="p.image" width="100" height="75" />
            <div class="vm-search-result-info">
              <a class="vm-search-result-name" @click="navigate('product', p.sku)" v-html="highlight(p.name)" />
              <p class="vm-search-result-exc" v-html="highlight(p.excerpt)" />
            </div>
            <span class="vm-search-result-price">{{ (p.salePrice || p.basePrice).toFixed(2) }} GS</span>
          </div>
        </div>
      </div>
    </main>

    <footer class="vm-footer">
      <div class="vm-footer-inner">
        <p>&copy; Year 312 VaultMart. A division of Armok Holdings LLC.</p>
        <p class="vm-footer-muted">All prices in Gold Sovereigns (GS).</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import {
	getByCategory,
	getFeatured,
	getNew,
	getProductBySku,
	products,
} from '../../../../data/eshop/products';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'search';

// ── URL routing helpers ────────────────────────────────────────────────────
function getBase() {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function pathToState() {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'product') {
		return { page: 'product' as Page, sku: p.get('sku') ?? '', q: '' };
	}
	if (seg === 'catalog') {
		return { page: 'catalog' as Page, sku: '', q: '' };
	}
	if (seg === 'cart') {
		return { page: 'cart' as Page, sku: '', q: '' };
	}
	if (seg === 'search') {
		return { page: 'search' as Page, sku: '', q: p.get('q') ?? '' };
	}
	return { page: 'home' as Page, sku: '', q: '' };
}
function pageToPath(p: Page, extra?: string) {
	const base = getBase();
	if (p === 'product') {
		return `${base}product${extra ? `?sku=${extra}` : ''}`;
	}
	if (p === 'catalog') {
		return `${base}catalog`;
	}
	if (p === 'cart') {
		return `${base}cart`;
	}
	if (p === 'search') {
		return `${base}search${extra ? `?q=${encodeURIComponent(extra)}` : ''}`;
	}
	return base;
}

const ready = ref(false);
const page = ref<Page>('home');
const currentSku = ref('');
const searchQ = ref('');
const searchQuery = ref('');
const catalogCat = ref('All');
const catalogPage = ref(1);
const _detailQty = ref(1);
const cart = ref<{ sku: string; qty: number }[]>([]);
const PER_PAGE = 9;

const _featuredProducts = getFeatured();
const _newProducts = getNew();

const filteredProducts = computed(() =>
	catalogCat.value === 'All' ? products : getByCategory(catalogCat.value),
);
const _totalCatalogPages = computed(() =>
	Math.ceil(filteredProducts.value.length / PER_PAGE),
);
const _pagedProducts = computed(() =>
	filteredProducts.value.slice(
		(catalogPage.value - 1) * PER_PAGE,
		catalogPage.value * PER_PAGE,
	),
);
const currentProduct = computed(() => getProductBySku(currentSku.value));
const _relatedProducts = computed(() =>
	currentProduct.value
		? getByCategory(currentProduct.value.category)
				.filter((p) => p.sku !== currentSku.value)
				.slice(0, 3)
		: [],
);

const _cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0));

// Default cart items (pre-seeded)
const defaultCartItems = [
	{ sku: 'VM-MIN-001', qty: 2 },
	{ sku: 'VM-FDB-002', qty: 1 },
	{ sku: 'VM-SRF-001', qty: 1 },
];

const displayCartItems = computed(() => {
	const items = cart.value.length > 0 ? cart.value : defaultCartItems;
	return items
		.map((ci) => ({ ...ci, product: getProductBySku(ci.sku)! }))
		.filter((ci) => ci.product);
});

const _displaySubtotal = computed(() =>
	displayCartItems.value.reduce(
		(s, ci) => s + (ci.product.salePrice || ci.product.basePrice) * ci.qty,
		0,
	),
);

const _searchResults = computed(() => {
	if (!searchQuery.value) {
		return [];
	}
	const q = searchQuery.value.toLowerCase();
	return products.filter(
		(p) =>
			p.name.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
	);
});

function navigate(p: Page, extra?: string) {
	page.value = p;
	if (p === 'product' && extra) {
		currentSku.value = extra;
	}
	if (p === 'search' && extra) {
		searchQuery.value = extra;
		searchQ.value = extra;
	}
	history.pushState(null, '', pageToPath(p, extra));
	window.scrollTo(0, 0);
}

function _doSearch() {
	searchQuery.value = searchQ.value;
	navigate('search', searchQ.value);
}

function onPop() {
	const s = pathToState();
	page.value = s.page;
	if (s.sku) {
		currentSku.value = s.sku;
	}
	if (s.q) {
		searchQuery.value = s.q;
		searchQ.value = s.q;
	}
	window.scrollTo(0, 0);
}

onMounted(() => {
	const s = pathToState();
	page.value = s.page;
	if (s.sku) {
		currentSku.value = s.sku;
	}
	if (s.q) {
		searchQuery.value = s.q;
		searchQ.value = s.q;
	}
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
onUnmounted(() => window.removeEventListener('popstate', onPop));

function _addToCart(sku: string) {
	const existing = cart.value.find((i) => i.sku === sku);
	if (existing) {
		existing.qty++;
	} else {
		cart.value.push({ sku, qty: 1 });
	}
}

function _setCatalogCat(cat: string) {
	catalogCat.value = cat;
	catalogPage.value = 1;
}

function _catSlug(cat: string) {
	return cat.toLowerCase().replace(/[^a-z]/g, '_');
}

function _starStr(rating: number) {
	const full = Math.floor(rating);
	const empty = 5 - full;
	return '★'.repeat(full) + '☆'.repeat(empty);
}

function _highlight(text: string) {
	if (!searchQuery.value) {
		return text;
	}
	const q = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
}
</script>

<style scoped>
.vm-shell { min-height: 100vh; background: #fff; color: #111; font-family: 'DM Sans', system-ui, sans-serif; }
.vm-header { background: #fff; border-bottom: 1px solid #e4e4e7; position: sticky; top: 0; z-index: 100; }
.vm-header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; }
.vm-logo { background: none; border: none; cursor: pointer; font-size: 22px; font-weight: 700; color: #2563eb; letter-spacing: -0.5px; }
.vm-search-bar { display: flex; flex: 1; }
.vm-search-input { flex: 1; padding: 8px 14px; border: 1px solid #e4e4e7; border-right: none; font-size: 14px; outline: none; }
.vm-search-input:focus { border-color: #2563eb; }
.vm-search-btn { padding: 8px 18px; background: #2563eb; color: #fff; border: 1px solid #2563eb; cursor: pointer; font-size: 14px; font-weight: 500; }
.vm-search-btn:hover { background: #1d4ed8; }
.vm-cart-btn { background: none; border: 1px solid #e4e4e7; cursor: pointer; padding: 8px 16px; font-size: 14px; }
.vm-cart-btn:hover { border-color: #2563eb; color: #2563eb; }
.vm-cart-badge { background: #16a34a; color: #fff; border-radius: 50%; width: 18px; height: 18px; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; }
.vm-cat-nav { background: #f9fafb; border-top: 1px solid #e4e4e7; }
.vm-cat-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; overflow-x: auto; }
.vm-cat-nav-item { background: none; border: none; cursor: pointer; padding: 10px 14px; font-size: 13px; color: #111; white-space: nowrap; border-bottom: 2px solid transparent; }
.vm-cat-nav-item:hover { color: #2563eb; }
.vm-cat-nav-item--active { border-bottom-color: #2563eb; color: #2563eb; }
.vm-main { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
.vm-section { margin-bottom: 48px; }
.vm-section-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
.vm-hero-banner { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #fff; padding: 60px 40px; border-radius: 6px; margin-bottom: 40px; }
.vm-hero-text { max-width: 540px; }
.vm-hero-sub { font-size: 14px; opacity: 0.8; margin-bottom: 4px; }
.vm-hero-title { font-size: 48px; font-weight: 700; letter-spacing: -1px; margin-bottom: 12px; }
.vm-hero-desc { font-size: 16px; opacity: 0.9; margin-bottom: 24px; line-height: 1.5; }
.vm-hero-cta { background: #fff; color: #2563eb; border: none; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 6px; }
.vm-hero-cta:hover { background: #f0f9ff; }
.vm-cat-tiles { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
@media (max-width: 900px) { .vm-cat-tiles { grid-template-columns: repeat(3, 1fr); } }
.vm-cat-tile { background: #f9fafb; border: 1px solid #e4e4e7; padding: 20px 12px; text-align: center; cursor: pointer; border-radius: 6px; }
.vm-cat-tile:hover { border-color: #2563eb; }
.vm-cat-tile-name { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.vm-cat-tile-count { display: block; font-size: 12px; color: #6b7280; }
.vm-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 900px) { .vm-grid3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .vm-grid3 { grid-template-columns: 1fr; } }
.vm-product-card { background: #fff; border: 1px solid #e4e4e7; border-radius: 6px; overflow: hidden; transition: box-shadow 0.2s; }
.vm-product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.vm-card-img { display: block; position: relative; cursor: pointer; }
.vm-card-img img { width: 100%; aspect-ratio: 7/5; object-fit: cover; }
.vm-badges { position: absolute; top: 8px; left: 8px; display: flex; flex-direction: column; gap: 4px; }
.vm-badge-new { background: #16a34a; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 2px; }
.vm-badge-oos { background: #6b7280; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 2px; }
.vm-badge-sale { background: #dc2626; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 2px; }
.vm-card-body { padding: 14px; }
.vm-product-name { font-size: 14px; font-weight: 600; margin: 6px 0; line-height: 1.4; }
.vm-product-name a { color: #111; cursor: pointer; }
.vm-product-name a:hover { color: #2563eb; }
.vm-cat-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
.vm-cat-mining___excavation { background: #fef9c3; color: #713f12; }
.vm-cat-forge___smithing { background: #fee2e2; color: #7f1d1d; }
.vm-cat-food___brewing { background: #dcfce7; color: #14532d; }
.vm-cat-furniture___housing { background: #ede9fe; color: #4c1d95; }
.vm-cat-surface_imports { background: #dbeafe; color: #1e3a5f; }
.vm-stars { font-size: 14px; color: #f59e0b; }
.vm-review-count { font-size: 12px; color: #6b7280; margin-left: 4px; }
.vm-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.vm-price { font-size: 16px; font-weight: 600; }
.vm-sale-price { font-size: 16px; font-weight: 700; color: #dc2626; }
.vm-orig-price { font-size: 13px; color: #6b7280; text-decoration: line-through; margin-left: 6px; }
.vm-add-btn { background: #16a34a; color: #fff; border: none; padding: 7px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; }
.vm-add-btn:hover { background: #15803d; }
.vm-oos-label { font-size: 12px; color: #6b7280; }
.vm-view-all-btn { display: block; margin: 24px auto 0; background: none; border: 2px solid #2563eb; color: #2563eb; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; }
.vm-view-all-btn:hover { background: #2563eb; color: #fff; }
/* Catalog */
.vm-page-title { font-size: 28px; font-weight: 700; margin-bottom: 24px; }
.vm-catalog-layout { display: grid; grid-template-columns: 200px 1fr; gap: 32px; }
.vm-filter-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 12px; }
.vm-filter-item { display: block; width: 100%; background: none; border: none; text-align: left; padding: 8px 12px; font-size: 14px; cursor: pointer; border-radius: 6px; color: #111; }
.vm-filter-item:hover { background: #f9fafb; }
.vm-filter-item--active { background: #2563eb; color: #fff; font-weight: 600; }
.vm-catalog-meta { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
.vm-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
.vm-page-btn { background: none; border: 1px solid #e4e4e7; padding: 8px 14px; cursor: pointer; border-radius: 6px; font-size: 14px; color: #111; }
.vm-page-btn:hover { border-color: #2563eb; color: #2563eb; }
.vm-page-btn--active { background: #2563eb; border-color: #2563eb; color: #fff; }
/* Product detail */
.vm-breadcrumb { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
.vm-breadcrumb button { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 13px; }
.vm-breadcrumb button:hover { color: #2563eb; }
.vm-product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 48px; }
@media (max-width: 700px) { .vm-product-detail { grid-template-columns: 1fr; } }
.vm-detail-img { position: relative; }
.vm-detail-img img { width: 100%; border-radius: 6px; border: 1px solid #e4e4e7; }
.vm-detail-name { font-size: 26px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
.vm-detail-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.vm-sku-label { font-size: 12px; color: #6b7280; }
.vm-detail-price { margin-bottom: 16px; font-size: 20px; }
.vm-detail-exc { font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 16px; }
.vm-low-stock { color: #dc2626; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
.vm-atc-row { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
.vm-qty-ctrl { display: flex; align-items: center; border: 1px solid #e4e4e7; border-radius: 6px; overflow: hidden; }
.vm-qty-ctrl button { background: none; border: none; padding: 8px 12px; cursor: pointer; font-size: 16px; }
.vm-qty-ctrl span { padding: 8px 16px; font-weight: 600; min-width: 40px; text-align: center; }
.vm-atc-btn { flex: 1; background: #16a34a; color: #fff; border: none; padding: 10px 20px; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 6px; }
.vm-atc-btn:hover { background: #15803d; }
.vm-out-of-stock { color: #6b7280; font-size: 15px; }
.vm-variant-selects { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e4e4e7; }
.vm-variant-group { display: flex; flex-direction: column; gap: 4px; }
.vm-variant-group label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #6b7280; }
.vm-variant-group select { padding: 6px 10px; border: 1px solid #e4e4e7; border-radius: 6px; font-size: 14px; background: #f9f9f9; cursor: not-allowed; }
/* Cart */
.vm-cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
@media (max-width: 700px) { .vm-cart-layout { grid-template-columns: 1fr; } }
.vm-cart-items { border: 1px solid #e4e4e7; border-radius: 6px; overflow: hidden; }
.vm-cart-item { display: grid; grid-template-columns: 80px 1fr auto; gap: 16px; padding: 16px; align-items: center; border-bottom: 1px solid #e4e4e7; }
.vm-cart-item:last-child { border-bottom: none; }
.vm-cart-item img { border-radius: 4px; object-fit: cover; width: 80px; height: 60px; }
.vm-cart-item-name { font-size: 14px; font-weight: 600; cursor: pointer; color: #111; display: block; margin-bottom: 4px; }
.vm-cart-item-name:hover { color: #2563eb; }
.vm-cart-item-meta { font-size: 12px; color: #6b7280; }
.vm-cart-item-price { font-size: 15px; font-weight: 600; white-space: nowrap; }
.vm-cart-summary { background: #f9fafb; border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; height: fit-content; }
.vm-summary-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.vm-summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #e4e4e7; }
.vm-summary-total { font-weight: 700; font-size: 16px; border-bottom: none; margin-top: 4px; }
.vm-checkout-btn { display: block; width: 100%; background: #16a34a; color: #fff; border: none; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 6px; margin-top: 16px; }
.vm-checkout-btn:hover { background: #15803d; }
.vm-continue-btn { display: block; width: 100%; background: none; border: 1px solid #e4e4e7; padding: 10px; font-size: 14px; cursor: pointer; border-radius: 6px; margin-top: 8px; }
.vm-continue-btn:hover { border-color: #2563eb; color: #2563eb; }
/* Search */
.vm-search-query { font-size: 20px; font-weight: 400; }
.vm-no-results { color: #6b7280; margin-top: 24px; }
.vm-search-count { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
.vm-search-results { border: 1px solid #e4e4e7; border-radius: 6px; overflow: hidden; }
.vm-search-result-item { display: grid; grid-template-columns: 100px 1fr auto; gap: 16px; padding: 16px; align-items: start; border-bottom: 1px solid #e4e4e7; }
.vm-search-result-item:last-child { border-bottom: none; }
.vm-search-result-item img { border-radius: 4px; object-fit: cover; width: 100px; height: 75px; }
.vm-search-result-name { font-size: 15px; font-weight: 600; cursor: pointer; color: #111; display: block; margin-bottom: 4px; }
.vm-search-result-name:hover { color: #2563eb; }
.vm-search-result-exc { font-size: 13px; color: #6b7280; line-height: 1.5; }
.vm-search-result-price { font-size: 15px; font-weight: 600; white-space: nowrap; }
.vm-not-found { text-align: center; padding: 60px 24px; }
.vm-not-found button { margin-top: 16px; background: #2563eb; color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 6px; font-size: 14px; }
.vm-footer { background: #111; color: #aaa; margin-top: 64px; }
.vm-footer-inner { max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 13px; }
.vm-footer-muted { color: #666; font-size: 12px; }
</style>
