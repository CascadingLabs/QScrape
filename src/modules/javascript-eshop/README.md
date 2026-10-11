# JavaScript eShop

Astro hosts one client-only React island. Product content renders in the browser, so extraction requires JavaScript. The initial document provides a loading fallback. There are no simulated loading delays, framework shuffling, or protection wrappers.

## Implementation

[ShopClient.tsx](ShopClient.tsx) owns the catalogue, product detail, and cart views. React handles search, category filtering, cart updates, and status messages. Navigation uses ordinary links between separate Astro pages.

## Shared pieces

- [Catalogue](../../data/eshop/catalog.ts): the same six synthetic products as the HTML version.
- [Cart storage](../../lib/eshop/cart-store.ts): validated quantities, stock limits, and version-scoped persistence.
- [Shop layout](../../layouts/ShopLayout.astro) and [styles](../../styles/shop.css): independent from the QScrape index.

Entry point: `/eshop/javascript/`. Expected values: `/eshop/fixtures.json`. No real payments or orders.
