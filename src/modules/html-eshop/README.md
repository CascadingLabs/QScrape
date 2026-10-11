# HTML eShop

Astro builds the catalogue and product pages as static HTML. Core product extraction does not require JavaScript. Navigation uses separate pages and ordinary links. Small JavaScript handlers provide category filtering and a browser-local sample cart.

## Implementation

- [StaticCatalog.astro](StaticCatalog.astro): catalogue markup, product cards, and category/cart interactions.
- [StaticProduct.astro](StaticProduct.astro): product details, structured product data, and add-to-cart behavior.
- [StaticCart.astro](StaticCart.astro): local cart contents, quantities, removal, and totals.
- [Cart interactions](cart-interactions.ts): shared add-to-cart handlers and cart counts for the catalogue and product pages.

## Shared pieces

- [Catalogue](../../data/eshop/catalog.ts): six synthetic products with stable IDs, USD prices in cents, and stock.
- [Cart storage](../../lib/eshop/cart-store.ts): validated, stock-bounded cart persistence.
- [Shop layout](../../layouts/ShopLayout.astro) and [styles](../../styles/shop.css): independent from the QScrape index.

Entry point: `/eshop/html/`. Expected values: `/eshop/fixtures.json`. No real payments or orders.
