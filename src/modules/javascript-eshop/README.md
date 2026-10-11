# JavaScript eShop

Astro hosts one client-only React island. The island requests `GET /api/eshop/products/`, then renders the returned catalogue. Extraction requires JavaScript. Loading, failure, and retry states reflect the HTTP request rather than a simulated delay.

[ShopClient.tsx](ShopClient.tsx) owns the API loading boundary. Its shared `ShopApp` renders catalogue, product, and cart views. React handles search, category filtering, cart updates, and status messages. Navigation uses ordinary links between separate Astro pages.

## Fixture-backed REST API

- `GET /api/eshop/products/`: all products.
- `GET /api/eshop/products/?category=Desk`: category filtering.
- `GET /api/eshop/products/?q=lamp`: text search.
- `GET /api/eshop/products/obj-001`: product detail, or HTTP 404 for an unknown ID.

These read-only endpoints use the same [catalogue](../../data/eshop/catalog.ts) as the HTML shop and fixtures. Collection responses contain `data`, `count`, `currency: "USD"`, and `priceUnit: "cents"`. Cart persistence remains [browser-local](../../lib/eshop/cart-store.ts); the API does not place orders or mutate inventory.

Cloudflare Pages Functions serve the API in deployment. The Astro/Vite dev server uses the same handler functions locally, so `vp run dev` does not require Wrangler or another server process.

[Shop layout](../../layouts/ShopLayout.astro) and [styles](../../styles/shop.css) remain independent from the QScrape index.
