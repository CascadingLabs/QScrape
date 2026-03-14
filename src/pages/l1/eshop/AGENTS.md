# VaultMart — Site Documentation

## Overview
Mock e-commerce catalogue simulating a 2008-era Newegg/early-Amazon online store.
Set in the Dwarf Fortress universe; sells mining gear, forge supplies, food/brewing, furniture, and surface imports.
Located at `/l1/eshop/`. Alias `/eshop/` redirects via middleware.

## Pages

| File | Route | Description |
|------|-------|-------------|
| `index.astro` | `/l1/eshop/` | Homepage: hero banner, 3 featured product cards, 5 category tiles, new arrivals row |
| `catalog.astro` | `/l1/eshop/catalog` | Full product listing: category filter tabs (JS), disabled sort dropdown (L2), 12/page JS pagination |
| `product.astro` | `/l1/eshop/product` | Product detail — receives SKU via `?item=` sentinel URL param; JS builds page from inline data |
| `cart.astro` | `/l1/eshop/cart` | Pre-seeded 3-item cart with JSON-LD `Order` schema in `<head>`; totals in HTML table cells |
| `search.astro` | `/l1/eshop/search` | `?q=` client-side keyword filter; matched text wrapped in `<mark>` tags |
| `about.astro` | `/l1/eshop/about` | Static: company info, vendor partners, shipping/returns policy |

## Components (`_components/`)

| File | Description |
|------|-------------|
| `EshopShell.astro` | Layout: header, nav, breadcrumbs, footer; contains `navigateToProduct()` script (XXXEEEXXX sentinel); global e-commerce CSS via `<style is:global>` |
| `ProductCard.astro` | Card: image, name (onclick sentinel), category badge, star rating, price, NEW/OOS badges |
| `StarRating.astro` | ★★★★☆ via Unicode &#9733;/&#9734;; takes `rating` (rounded to int) and `reviewCount` |
| `CategoryBadge.astro` | Colour-coded inline badge for each of the 5 categories |
| `PriceDisplay.astro` | "14.50 Gold Sovereigns" span; accepts optional `id` for JS mutation |

## Data (`_data/`)

| File | Description |
|------|-------------|
| `products.ts` | `ProductMeta[]` — 28 products across 5 categories. Exports `getByCategory()`, `getFeatured()`, `getNew()`, `getPromoted()`, `getProductBySku()`, `formatPrice()`. `ProductDetail` objects (variants, reviews, specs) live inline in `product.astro`. |

## Product Catalogue

28 products across 5 categories. SKUs follow pattern `VM-{CAT}-{NNN}`.

| Category | SKUs | Count |
|----------|------|-------|
| Mining & Excavation | VM-MIN-001 → VM-MIN-006 | 6 |
| Forge & Smithing    | VM-FRG-001 → VM-FRG-006 | 6 |
| Food & Brewing      | VM-FDB-001 → VM-FDB-005 | 5 |
| Furniture & Housing | VM-FUR-001 → VM-FUR-005 | 5 |
| Surface Imports     | VM-SRF-001 → VM-SRF-006 | 6 |

Featured (isFeatured=true): VM-MIN-002, VM-FRG-005, VM-FDB-002
New arrivals (isNew=true): VM-MIN-006, VM-FRG-001, VM-FDB-005, VM-FUR-004, VM-SRF-004, VM-SRF-005
Out of stock (inStock=false): VM-MIN-002, VM-FRG-005
Promoted/sponsored (isPromoted=true): VM-MIN-001, VM-FDB-002, VM-FRG-005, VM-SRF-002

## Scraping Challenges

### 1. Sentinel Product URL (`XXXEEEXXX`)
`navigateToProduct(sku)` in `EshopShell.astro` encodes the SKU inside a sentinel-delimited payload:
```
VM_v1_Dg4kRp9mXsXXXEEEXXXSKU={sku}&HASH={random}XXXEEEXXXbN8wZt3hF6vQXXXEEEXXX
```
URL: `/l1/eshop/product?item={encodeURIComponent(payload)}`

**Decode:** split on `XXXEEEXXX`, find segment containing `SKU=`, extract value with `decodeURIComponent`.
Distinct from `XXXNNNXXX` (news) and `XXXBBBXXX` (taxes).

### 2. Disabled Variant Selects
`product.astro` renders variant `<select disabled style="opacity:0.5;">` elements with options that carry:
- `data-price-mod="{priceModifier}"` — price delta from base price
- `data-in-stock="{true|false}"` — stock status per option

Full price matrix is readable from the DOM without JS interaction. The disabled appearance is a visual indicator
that interactive variant selection is reserved for L2.

### 3. Filter + Pagination Interaction (`catalog.astro`)
All 28 product cards are rendered in the DOM at all times. JS manages `display:none`:
- Category filter hides non-matching cards
- Pagination shows 12 of the *filtered* set per page; others get `display:none`

Since this is a static Astro page, every fetch of `/l1/eshop/catalog` (regardless of any URL params) returns
the same HTML with all 28 cards. A scraper that iterates URL-based "pages" (e.g. `?page=1`, `?page=2`)
receives identical HTML responses and must **deduplicate by `data-sku`** to avoid counting products multiple times.

Each card has `data-sku="{SKU}"` and `data-category="{category}"` for filtering.

### 4. Cart JSON-LD (`cart.astro`)
`<head>` contains `<script type="application/ld+json">` with a full `Order` schema:
- 3 line items: VM-MIN-001 ×2, VM-FDB-002 ×1, VM-SRF-001 ×1
- Subtotal: 89.00 GS, Shipping: 3.50 GS, Total: 92.50 GS
- Two valid extraction paths: parse HTML table **or** parse JSON-LD

### 6. Promoted Products / Duplicate SKUs (`catalog.astro`)
The catalog page renders promoted products **twice**: once in a static `#sponsoredStrip` above the filter tabs,
and once in the main `#catalogGrid` with all 28 products. This creates **32 `.product-card[data-sku]` elements**
for 28 unique SKUs.

Key points:
- Promoted cards in `#sponsoredStrip` are always visible; main-grid promoted cards obey normal filter + pagination logic
- All promoted cards carry `data-promoted="true"`; non-promoted cards omit the attribute
- **VM-FRG-005** is promoted but out of stock (`inStock=false`) — a naive scraper cannot assume `isPromoted` implies `inStock`
- **VM-FDB-002** is both featured and promoted — appears on homepage featured strip AND catalog sponsored strip AND catalog main grid (3 locations across 2 pages)
- Scrapers must deduplicate by `data-sku` to enumerate the true 28-product catalogue

### 7. Sale Prices — Two-Price Extraction
5 products carry both `basePrice` and `salePrice`. The DOM renders both: a grey strikethrough `<span class="originalPrice">` and the active `<span class="priceDisplay">`. A scraper extracting all `.priceDisplay` text gets correct current prices, but one selecting the first price-like number per product will grab the wrong (original) value.

Sale products: VM-MIN-003, VM-FDB-004, VM-FUR-005, VM-SRF-003, VM-SRF-006

### 8. Stock Level Attribute
7 in-stock products carry a `data-stock` attribute. Items with stock ≤ 5 render visible "Only N left!" text; items with stock > 5 render "In Stock" — the count is in `data-stock` only. A scraper reading text nodes misses the count for the higher-stock items. OOS and untracked items have no `data-stock`.

Low-stock items (text visible): VM-FDB-002 (4), VM-SRF-002 (3), VM-FDB-005 (2), VM-SRF-001 (5)
Higher-stock items (attribute only): VM-MIN-001 (12), VM-FRG-003 (8), VM-MIN-006 (6)

### 5. Search `<mark>` Tags (`search.astro`)
`?q=` triggers client-side JS that shows matching products and wraps matched substrings in `<mark>`:
- Product name innerHTML becomes e.g. `"Standard <mark>Iron</mark> Pickaxe"`
- Scraper must strip `<mark>` tags (or use `.textContent`) to obtain clean product names
- Without JS execution, all items have `display:none` and no marks

## CSS Architecture

`EshopShell.astro` extends `public/global.css` via `<style is:global>`.

Key classes added:
| Class | Purpose |
|-------|---------|
| `.product-card` | Float-grid card: `float:left; width:24%; margin:0.5%` |
| `.priceDisplay` | Red price: `color:#cc0000; font-size:13px; font-weight:bold` |
| `.originalPrice` | Strikethrough original price (grey, small) shown alongside `.priceDisplay` for sale items |
| `.newBadge` / `.oosBadge` | Absolute-positioned corner badges (top-left / top-right) |
| `.saleBadge` | Absolute-positioned orange "SALE" badge (top-left; shown when no NEW badge) |
| `.promoBadge` | Absolute-positioned amber "SPONSORED" badge (bottom-right) |
| `.lowStock` | Yellow "Only N left!" stock badge; rendered when `stock <= 5` |
| `.sponsoredStrip` / `.sponsoredLabel` | Amber-bordered container + label for promoted products row |
| `.statusOos` | Out-of-stock badge (grey, extends `global.css` status pattern) |
| `.cat-mining` … `.cat-surface` | 5 category badge colour classes |
| `.filterTab` / `.filterTab.active` | Category filter tab bar |
| `.productDetailWrap` | 2-column detail layout: 560 px main + 200 px side |
| `.cartTotal` | Cart price cells |
| `mark` | `background:#fffb00` highlight for search results |

## Cross-References (Herald/Taxes)

- `about.astro` mentions **Headshoots LLC** (civil suit: `MHH-008`) and **Dwarven Iron Guild** (record output: `MHH-003`)
- `about.astro` links **Fungiwood Trust** to ROD Records `CLM-999-FUNGI`
- `about.astro` links **Koganusan Estates LLC** to ROD Records `CLM-304-KOGAN`
- `index.astro` links to Herald article `MHH-011` (surface trade route closure)
- Navigation bar in `EshopShell` links to `/l1/news/`, `/l1/taxes/`, `/l1/scoretap/`
