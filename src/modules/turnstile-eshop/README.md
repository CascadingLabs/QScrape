# Turnstile JavaScript eShop

A separate React shop at `/eshop/turnstile/`. The existing HTML and JavaScript shops remain independent. The Turnstile widget is embedded only in this module.

[TurnstileShop.tsx](TurnstileShop.tsx) renders the existing widget with action `eshop_access`. A successful challenge enables **Continue to shop**. That action submits `cf-turnstile-response` to `POST /api/eshop/turnstile/catalogue/`.

The Pages Function requires a configured secret and hostname allowlist, validates the token through Cloudflare Siteverify, and checks `success`, `action`, and `hostname` before returning the catalogue. Every token is redeemed once; the widget is reset after each submission attempt. A page navigation performs a new check.

This is a controlled challenge workflow. The product fixture is intentionally public through the ordinary shop and fixtures endpoint; this variant does not claim to keep that shared dataset confidential.

## Configuration

- Site key: `0x4AAAAAAFT_yDTmIcslqe86` (public; the widget already exists).
- `TURNSTILE_SECRET`: server-only secret in Pages settings and an ignored local `.env`.
- Production `TURNSTILE_HOSTNAMES`: `qscrape.dev`.
- Local `TURNSTILE_HOSTNAMES`: `localhost,127.0.0.1`.
- Optional `PUBLIC_TURNSTILE_SITE_KEY`: override for provider-supported testing keys.

Keep real and testing keys matched, and do not call testing-key success evidence of completing a live challenge. Secrets must never appear in client bundles, source control, or logs.
