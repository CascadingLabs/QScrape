# Mountainhome Herald — Site Documentation

## Overview
Mock news website simulating a 2004-era rolling news portal (styled like early CNN/BBC News).
Used as a web crawler testing target within the QScrape project.
Dwarf Fortress-themed content. Located at `/l1/news/`. Alias `/news/` redirects via middleware.

## Pages

| File | Route | Description |
|------|-------|-------------|
| `index.astro` | `/l1/news/` | Homepage: rolling news feed, featured story, top stories, category filter, sidebar |
| `articles.astro` | `/l1/news/articles` | Article listing with keyword/category/date filter + pagination |
| `article.astro` | `/l1/news/article` | Article detail — receives article ID via sentinel URL param |
| `about.astro` | `/l1/news/about` | Herald history, editorial policy, quick links |
| `staff.astro` | `/l1/news/staff` | Editorial staff bios, photos, contact info |
| `contact.astro` | `/l1/news/contact` | Contact info, subscriptions, news tips, advertising rates |

## Components (`_components/`)

| File | Description |
|------|-------------|
| `HeraldShell.astro` | Layout template: header, breaking ticker, nav, ad slots, footer |
| `AdUnit.astro` | Mock ad component with iframe srcdoc, tracking pixels, click URLs |

## Data (`_data/`)

| File | Description |
|------|-------------|
| `articles.ts` | Article metadata (id, category, published timestamp, headline, author, excerpt, image). Shared by index, articles, and shell. |

## Article Data
20 articles hard-coded in `article.astro` (full body) and `_data/articles.ts` (metadata).
IDs: MHH-001 through MHH-020. Rolling timestamps across Jan–Mar 2026.

Categories: Politics (4), Crime (4), Economy (5), Culture (3), Sports (2), Weather (3).

Reporters:
- Urist McReporter — Politics
- Bomrek Hammerfall — Crime & Sports
- Rigoth Gemcutter — Economy
- Fikod Silentstone — Culture
- Zulban Tunnelworks — Weather
- Morul Chiselmark — Editor-in-Chief

## Rolling News Model
Articles have ISO datetime `published` timestamps (e.g. `2026-03-11T10:30:00`) and optional `updated` timestamps. The homepage sorts by most recent and shows relative time ("2h ago", "yesterday"). Breaking articles appear in a CSS-animated scrolling ticker.

## Ad System
Mock display ads via `AdUnit.astro` using iframe srcdoc with:
- Picsum background images with text overlay
- Mock ad network: `ads.deepstone-network.mh`
- Ad IDs: `DSN-LB-001`, `DSN-REC-001`, `DSN-BAN-001`, etc.
- Tracking pixels and beacon scripts
- Click-through URLs with campaign/placement params
- Placements: header leaderboard, footer leaderboard, sidebar rectangles, inline banners

## URL Encoding Scheme (Sentinel: XXXNNNXXX)

```javascript
// Encode (defined in HeraldShell.astro, available on all pages):
function navigateToArticle(id) {
    var hash = Math.random().toString(36).substring(2,15);
    var payload = 'MHH_v1_Kp9rXm2bQs' +
                  'XXXNNNXXX' +
                  'ID=' + encodeURIComponent(id) + '&HASH=' + hash +
                  'XXXNNNXXX' +
                  'tR7vYw1hF3dG' +
                  'XXXNNNXXX';
    window.location.href = '/l1/news/article?postData=' + encodeURIComponent(payload);
}

// Decode (used in article.astro):
var parts = rawPostData.split('XXXNNNXXX');
for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf('ID=') !== -1) {
        articleId = decodeURIComponent(parts[i].split('ID=')[1].split('&')[0]);
        break;
    }
}
```

## CSS Architecture
- `HeraldShell.astro` contains all shared styles via `<style is:global>` (category badges, article cards, pull quotes, info boxes, sidebar, ads, ticker)
- `/public/global.css` provides base ASP.NET-era styling (header, nav, footer, tables, forms)
- No per-page style duplication

## Cross-links
- Nav: Home, Articles, About, Staff, Contact | ROD Records → `/l1/taxes/`, ScoreTap → `/l1/scoretap/`
- Article bodies link to Registry of Deeds (`/l1/taxes/`) and ScoreTap (`/l1/scoretap/`) where contextually relevant
- Articles cross-reference each other (e.g. seismic advisory ↔ magma expansion, Steelthunder sale ↔ injunction)

## Design Pattern
Uses `HeraldShell.astro` template component (similar to ScoreTap's `SiteShell.astro`).
Homepage uses float-based two-column layout (580px main + 190px sidebar) for period-accurate 2004 aesthetic.
