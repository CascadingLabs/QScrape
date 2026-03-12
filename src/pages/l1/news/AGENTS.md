# Mountainhome Herald — Site Documentation

## Overview
Mock news website simulating a 2004-era online news portal (styled like early CNN/BBC News).
Used as a web crawler testing target within the ScrapingGauntlet project.
Dwarf Fortress-themed content. Located at `/news/` (or `/l1/news/` if nested under l1).

## Pages

| File | Route | Description |
|------|-------|-------------|
| `index.astro` | `/news/` | Homepage: featured story, top stories, latest news list, sidebar |
| `articles.astro` | `/news/articles` | Article listing with keyword/category/date filter + pagination |
| `article.astro` | `/news/article` | Article detail — receives article ID via sentinel URL param |
| `about.astro` | `/news/about` | Static about page: editorial staff, history, contact |

## Article Data
All 20 articles are hard-coded in `article.astro` in the `var ARTICLES = {...}` JS object.
IDs: MHH-001 through MHH-020. Date range: Jan–Mar 2026.

Categories: Politics (4), Crime (4), Economy (5), Culture (3), Sports (2), Weather (3).

Reporters:
- Urist McReporter — Politics
- Bomrek Hammerfall — Crime & Sports
- Rigoth Gemcutter — Economy
- Fikod Silentstone — Culture
- Zulban Tunnelworks — Weather

## URL Encoding Scheme (Sentinel: XXXNNNXXX)

```javascript
// Encode (used in index.astro and articles.astro):
function navigateToArticle(id) {
    var hash = Math.random().toString(36).substring(2,15);
    var payload = 'MHH_v1_Kp9rXm2bQs' +
                  'XXXNNNXXX' +
                  'ID=' + encodeURIComponent(id) + '&HASH=' + hash +
                  'XXXNNNXXX' +
                  'tR7vYw1hF3dG' +
                  'XXXNNNXXX';
    window.location.href = '/news/article?postData=' + encodeURIComponent(payload);
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

Analogous to the `XXXBBBXXX` sentinel used in `/l1/taxes/tax-search.astro` → `viewer.astro`.

## CSS Architecture
No separate CSS files. All pages use `/global.css` as base with per-page `<style>` blocks for overrides.
Category badge classes use inline CSS (`cat-Politics`, `cat-Crime`, etc.) defined per-page.
Global status classes (`statusApproved`, `statusReview`, `statusPending`) used on article detail badge.

## Cross-links
All nav bars include "ROD Records" → `/l1/taxes/` (the taxes site).

## Design Pattern
Matches the no-component, self-contained page pattern of `/l1/taxes/`.
Homepage uses float-based two-column layout (580px main + 190px sidebar) for period-accurate 2004 aesthetic.
