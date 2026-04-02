<!-- @qscrape L2 / vue / news -->
<!-- @component NewsApp -->
<template>
  <div v-if="!ready" style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Georgia,serif;color:#666">Loading…</div>
  <div v-else class="hn-shell">
    <!-- Masthead -->
    <header class="hn-masthead">
      <div class="hn-masthead-inner">
        <div class="hn-masthead-date">{{ currentDate }}</div>
        <button class="hn-masthead-title" @click="navigate('home')">
          <span class="hn-masthead-main">The Mountainhome Herald</span>
          <span class="hn-masthead-tag">Est. Year 89 · Mountainhome, Granite Flats</span>
        </button>
        <div class="hn-masthead-right">&ldquo;All the news from Z-Level 1 to 120&rdquo;</div>
      </div>
      <div v-if="breaking.length" class="hn-breaking-bar">
        <span class="hn-breaking-label">BREAKING</span>
        <div class="hn-breaking-ticker">
          <template v-for="(a, i) in breaking" :key="a.id">
            <span v-if="i > 0"> · </span>
            <a @click="navigate('article', a.id)">{{ a.headline }}</a>
          </template>
        </div>
      </div>
    </header>

    <!-- Nav -->
    <nav class="hn-nav">
      <div class="hn-nav-inner">
        <button v-for="p in navPages" :key="p.id"
          :class="['hn-nav-item', { 'hn-nav-item--active': page === p.id }]"
          @click="navigate(p.id)">{{ p.label }}</button>
      </div>
    </nav>

    <!-- Home -->
    <main class="hn-main" v-if="page === 'home'">
      <section class="hn-hero" v-if="featured">
        <a class="hn-hero-img" @click="navigate('article', featured.id)">
          <img :src="featured.image" width="900" height="500" loading="eager" />
          <span v-if="featured.breaking" class="hn-breaking-tag">BREAKING</span>
        </a>
        <div class="hn-hero-body">
          <span :class="['hn-badge', 'hn-badge--' + featured.category.toLowerCase()]">{{ featured.category }}</span>
          <h1 class="hn-hero-hl">
            <a @click="navigate('article', featured.id)">{{ featured.headline }}</a>
          </h1>
          <p class="hn-hero-exc">{{ featured.excerpt }}</p>
          <div class="hn-hero-meta">
            <span>{{ featured.author }}</span>
            <span>{{ formatDateTime(featured.published) }}</span>
          </div>
        </div>
      </section>

      <div class="hn-home-layout">
        <section class="hn-article-grid">
          <h2 class="hn-section-head">Latest News</h2>
          <div class="hn-grid3">
            <article v-for="a in gridArticles" :key="a.id" class="hn-article-card" :data-article-id="a.id" :data-category="a.category">
              <a class="hn-card-img" @click="navigate('article', a.id)">
                <img :src="a.image" loading="lazy" width="580" height="320" />
                <span v-if="a.breaking" class="hn-breaking-tag">BREAKING</span>
              </a>
              <div class="hn-card-body">
                <span :class="['hn-badge', 'hn-badge--' + a.category.toLowerCase()]">{{ a.category }}</span>
                <h2 class="hn-card-hl">
                  <a @click="navigate('article', a.id)">{{ a.headline }}</a>
                </h2>
                <p class="hn-card-exc">{{ a.excerpt }}</p>
                <div class="hn-card-meta">
                  <span>{{ a.author }}</span>
                  <span>{{ formatDate(a.published) }}</span>
                </div>
              </div>
            </article>
          </div>
          <button class="hn-more-btn" @click="navigate('articles')">More Stories →</button>
        </section>

        <aside class="hn-sidebar">
          <div class="hn-side-widget">
            <h3 class="hn-side-title">Top Stories</h3>
            <div v-for="a in sidebarArticles" :key="a.id" class="hn-side-item">
              <span :class="['hn-badge', 'hn-badge--' + a.category.toLowerCase()]">{{ a.category }}</span>
              <a class="hn-side-hl" @click="navigate('article', a.id)">{{ a.headline }}</a>
              <div class="hn-side-date">{{ formatDate(a.published) }}</div>
            </div>
          </div>
          <div class="hn-side-widget">
            <h3 class="hn-side-title">Sections</h3>
            <button v-for="cat in categories" :key="cat" class="hn-side-cat" @click="navigate('articles')">{{ cat }}</button>
          </div>
        </aside>
      </div>
    </main>

    <!-- Articles -->
    <main class="hn-main" v-else-if="page === 'articles'">
      <h1 class="hn-page-title">Articles</h1>
      <div class="hn-filter-tabs">
        <button v-for="cat in ['All', ...categories]" :key="cat"
          :class="['hn-filter-tab', { 'hn-filter-tab--active': activeCategory === cat }]"
          :data-category="cat"
          @click="setCategory(cat)">{{ cat }}</button>
      </div>
      <div class="hn-grid3">
        <article v-for="a in pagedArticles" :key="a.id" class="hn-article-card" :data-article-id="a.id" :data-category="a.category">
          <a class="hn-card-img" @click="navigate('article', a.id)">
            <img :src="a.image" loading="lazy" width="580" height="320" />
            <span v-if="a.breaking" class="hn-breaking-tag">BREAKING</span>
          </a>
          <div class="hn-card-body">
            <span :class="['hn-badge', 'hn-badge--' + a.category.toLowerCase()]">{{ a.category }}</span>
            <h2 class="hn-card-hl">
              <a @click="navigate('article', a.id)">{{ a.headline }}</a>
            </h2>
            <p class="hn-card-exc">{{ a.excerpt }}</p>
            <div class="hn-card-meta">
              <span>{{ a.author }}</span>
              <span>{{ formatDate(a.published) }}</span>
            </div>
          </div>
        </article>
      </div>
      <div v-if="totalArticlePages > 1" class="hn-pagination">
        <button v-for="p in totalArticlePages" :key="p"
          :class="['hn-page-btn', { 'hn-page-btn--active': articlePage === p }]"
          @click="articlePage = p">{{ p }}</button>
      </div>
    </main>

    <!-- Article detail -->
    <main class="hn-main" v-else-if="page === 'article'">
      <div v-if="currentArticle" class="hn-reading">
        <nav class="hn-breadcrumb">
          <button @click="navigate('home')">Home</button>
          /
          <button @click="navigate('articles')">{{ currentArticle.category }}</button>
        </nav>
        <span :class="['hn-badge', 'hn-badge--' + currentArticle.category.toLowerCase()]">{{ currentArticle.category }}</span>
        <span v-if="currentArticle.breaking" class="hn-breaking-tag hn-breaking-tag--inline">BREAKING</span>
        <h1 class="hn-article-hl">{{ currentArticle.headline }}</h1>
        <div class="hn-article-byline">
          <span class="hn-author">{{ currentArticle.author }}</span>
          <span class="hn-byline-title">{{ currentArticle.byline }}</span>
          <time :datetime="currentArticle.published">{{ formatDateTime(currentArticle.published) }}</time>
          <span v-if="currentArticle.updated" class="hn-updated">Updated: {{ formatDateTime(currentArticle.updated) }}</span>
        </div>
        <figure class="hn-article-fig">
          <img :src="currentArticle.image" width="680" height="380" />
          <figcaption>{{ currentArticle.imageCaption }} <em>{{ currentArticle.imageCredit }}</em></figcaption>
        </figure>
        <div class="hn-article-body">
          <p class="hn-article-lead">{{ currentArticle.excerpt }}</p>
          <p>The Mountainhome Herald continues to follow developments related to this story. This report will be updated as additional information becomes available from official sources and correspondents in the field.</p>
          <p>Residents and stakeholders with relevant information are encouraged to contact the Herald editorial desk at <em>editor@herald.mh</em>.</p>
        </div>
        <div class="hn-article-tags">
          <span v-for="tag in currentArticle.tags" :key="tag" class="hn-tag">{{ tag }}</span>
        </div>
        <aside v-if="relatedArticles.length" class="hn-related">
          <h2 class="hn-related-title">Related Articles</h2>
          <div class="hn-grid3">
            <article v-for="a in relatedArticles" :key="a.id" class="hn-article-card" :data-article-id="a.id">
              <a class="hn-card-img" @click="navigate('article', a.id)">
                <img :src="a.image" loading="lazy" width="580" height="320" />
              </a>
              <div class="hn-card-body">
                <span :class="['hn-badge', 'hn-badge--' + a.category.toLowerCase()]">{{ a.category }}</span>
                <h2 class="hn-card-hl"><a @click="navigate('article', a.id)">{{ a.headline }}</a></h2>
                <div class="hn-card-meta"><span>{{ a.author }}</span><span>{{ formatDate(a.published) }}</span></div>
              </div>
            </article>
          </div>
        </aside>
      </div>
      <div v-else class="hn-not-found">
        <h1>Article not found</h1>
        <button @click="navigate('home')">← Home</button>
      </div>
    </main>

    <!-- About -->
    <main class="hn-main hn-static-page" v-else-if="page === 'about'">
      <h1 class="hn-page-title">About the Herald</h1>
      <div class="hn-static-body">
        <p>The Mountainhome Herald was founded in Year 89 by Master Scribe Urist Bookbinder as a single-page broadsheet. Over more than two centuries it has grown into the fortress's newspaper of record.</p>
        <h2>Editorial Policy</h2>
        <p>The Herald is committed to factual, impartial reporting on all matters affecting the citizens of Mountainhome. Our editorial staff independently verifies all claims before publication.</p>
        <h2>Coverage Areas</h2>
        <p>The Herald covers Politics, Crime, Economy, Culture, Sports, and Weather across all z-levels from the surface to Z-Level 114.</p>
      </div>
    </main>

    <!-- Staff -->
    <main class="hn-main" v-else-if="page === 'staff'">
      <h1 class="hn-page-title">Editorial Staff</h1>
      <div class="hn-staff-grid">
        <div v-for="r in reporters" :key="r.email" class="hn-staff-card">
          <div class="hn-staff-name">{{ r.name }}</div>
          <div class="hn-staff-title">{{ r.title }}</div>
          <div class="hn-staff-beat">{{ r.beat }}</div>
          <a :href="'mailto:' + r.email" class="hn-staff-email">{{ r.email }}</a>
        </div>
      </div>
    </main>

    <!-- Contact -->
    <main class="hn-main hn-static-page" v-else-if="page === 'contact'">
      <h1 class="hn-page-title">Contact the Herald</h1>
      <div class="hn-static-body">
        <h2>Editorial</h2>
        <p>General inquiries: <a href="mailto:editor@herald.mh">editor@herald.mh</a></p>
        <p>Tips and story leads: <a href="mailto:tips@herald.mh">tips@herald.mh</a></p>
        <h2>Advertising</h2>
        <p>Display and classified advertising: <a href="mailto:advertising@herald.mh">advertising@herald.mh</a></p>
        <h2>Subscriptions</h2>
        <p>Circulation desk: <a href="mailto:circulation@herald.mh">circulation@herald.mh</a></p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="hn-footer">
      <div class="hn-footer-inner">
        <p>&copy; Year 312 The Mountainhome Herald.</p>
        <p class="hn-footer-links">
          <a @click="navigate('about')">About</a> ·
          <a @click="navigate('contact')">Contact</a> ·
          <a @click="navigate('staff')">Staff</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import {
	articles,
	getBreaking,
	getByCategory,
	getLatest,
} from '../../../../data/news/articles';

type Page = 'home' | 'articles' | 'article' | 'about' | 'contact' | 'staff';

// ── URL routing helpers ────────────────────────────────────────────────────
function getBase() {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function pathToState() {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'article') {
		return { page: 'article' as Page, id: p.get('id') ?? '' };
	}
	if (seg === 'articles') {
		return { page: 'articles' as Page, id: '' };
	}
	if (seg === 'about') {
		return { page: 'about' as Page, id: '' };
	}
	if (seg === 'staff') {
		return { page: 'staff' as Page, id: '' };
	}
	if (seg === 'contact') {
		return { page: 'contact' as Page, id: '' };
	}
	return { page: 'home' as Page, id: '' };
}
function pageToPath(p: Page, id?: string) {
	const base = getBase();
	if (p === 'article') {
		return `${base}article${id ? `?id=${id}` : ''}`;
	}
	if (p === 'articles') {
		return `${base}articles`;
	}
	if (p === 'about') {
		return `${base}about`;
	}
	if (p === 'staff') {
		return `${base}staff`;
	}
	if (p === 'contact') {
		return `${base}contact`;
	}
	return base;
}

const ready = ref(false);
const page = ref<Page>('home');
const currentId = ref('');
const activeCategory = ref('All');
const articlePage = ref(1);
const PER_PAGE = 6;

const _currentDate = new Date().toLocaleDateString('en-US', {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});
const _breaking = getBreaking();
const _navPages = [
	{ id: 'home' as Page, label: 'Home' },
	{ id: 'articles' as Page, label: 'Articles' },
	{ id: 'about' as Page, label: 'About' },
	{ id: 'staff' as Page, label: 'Staff' },
	{ id: 'contact' as Page, label: 'Contact' },
];

const latest = getLatest(20);
const _featured = computed(() => latest[0]);
const _gridArticles = computed(() => latest.slice(1, 7));
const _sidebarArticles = computed(() => latest.slice(7, 13));

const filteredArticles = computed(() =>
	activeCategory.value === 'All'
		? articles
		: getByCategory(activeCategory.value),
);
const _totalArticlePages = computed(() =>
	Math.ceil(filteredArticles.value.length / PER_PAGE),
);
const _pagedArticles = computed(() =>
	filteredArticles.value.slice(
		(articlePage.value - 1) * PER_PAGE,
		articlePage.value * PER_PAGE,
	),
);

const currentArticle = computed(() =>
	articles.find((a) => a.id === currentId.value),
);
const _relatedArticles = computed(() =>
	currentArticle.value
		? articles
				.filter(
					(a) =>
						a.category === currentArticle.value?.category &&
						a.id !== currentId.value,
				)
				.slice(0, 3)
		: [],
);

function _navigate(p: Page, id?: string) {
	page.value = p;
	if (id) {
		currentId.value = id;
	}
	history.pushState(null, '', pageToPath(p, id));
	window.scrollTo(0, 0);
}

function _setCategory(cat: string) {
	activeCategory.value = cat;
	articlePage.value = 1;
}

function onPop() {
	const s = pathToState();
	page.value = s.page;
	currentId.value = s.id;
	window.scrollTo(0, 0);
}

onMounted(() => {
	const s = pathToState();
	page.value = s.page;
	currentId.value = s.id;
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
onUnmounted(() => window.removeEventListener('popstate', onPop));
</script>

<style scoped>
.hn-shell { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: 'Lora', Georgia, serif; }

/* Masthead */
.hn-masthead { background: #1a1a1a; color: #fff; }
.hn-masthead-inner { max-width: 1100px; margin: 0 auto; padding: 16px 24px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; }
.hn-masthead-date { font-family: system-ui, sans-serif; font-size: 12px; color: #aaa; }
.hn-masthead-title { background: none; border: none; cursor: pointer; text-align: center; color: #fff; padding: 0; }
.hn-masthead-main { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 4vw, 42px); font-weight: 700; line-height: 1.1; }
.hn-masthead-tag { display: block; font-size: 11px; color: #aaa; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
.hn-masthead-right { font-size: 12px; color: #aaa; text-align: right; font-style: italic; font-family: system-ui, sans-serif; }
.hn-breaking-bar { background: #c0392b; display: flex; align-items: center; gap: 12px; padding: 6px 24px; font-family: system-ui, sans-serif; font-size: 13px; }
.hn-breaking-label { font-weight: 700; color: #fff; white-space: nowrap; letter-spacing: 0.08em; }
.hn-breaking-ticker { color: #fff; }
.hn-breaking-ticker a { color: #fff; cursor: pointer; }
.hn-breaking-ticker a:hover { text-decoration: underline; }

/* Nav */
.hn-nav { border-bottom: 2px solid #c0392b; background: #fff; }
.hn-nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; }
.hn-nav-item { background: none; border: none; cursor: pointer; padding: 12px 16px; font-family: system-ui, sans-serif; font-size: 14px; font-weight: 500; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 3px solid transparent; margin-bottom: -2px; }
.hn-nav-item:hover { border-bottom-color: #c0392b; color: #c0392b; }
.hn-nav-item--active { border-bottom-color: #c0392b; color: #c0392b; }

/* Main */
.hn-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

/* Badges */
.hn-badge { display: inline-block; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 2px; margin-bottom: 8px; }
.hn-badge--politics { background: #dbeafe; color: #1e3a5f; }
.hn-badge--crime { background: #fee2e2; color: #7f1d1d; }
.hn-badge--economy { background: #dcfce7; color: #14532d; }
.hn-badge--culture { background: #ede9fe; color: #4c1d95; }
.hn-badge--sports { background: #ecfdf5; color: #065f46; }
.hn-badge--weather { background: #fef9c3; color: #713f12; }
.hn-breaking-tag { position: absolute; top: 10px; left: 10px; background: #c0392b; color: #fff; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; padding: 3px 8px; }
.hn-breaking-tag--inline { position: static; display: inline-block; margin-left: 8px; vertical-align: middle; }

/* Hero */
.hn-hero { margin-bottom: 32px; }
.hn-hero-img { display: block; position: relative; cursor: pointer; }
.hn-hero-img img { width: 100%; aspect-ratio: 16/9; object-fit: cover; max-height: 500px; }
.hn-hero-body { padding: 20px 0; border-bottom: 1px solid #e5e5e5; }
.hn-hero-hl { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 3vw, 36px); font-weight: 700; line-height: 1.2; margin-bottom: 12px; }
.hn-hero-hl a { color: #1a1a1a; cursor: pointer; }
.hn-hero-hl a:hover { color: #c0392b; text-decoration: none; }
.hn-hero-exc { font-size: 16px; color: #666; margin-bottom: 12px; }
.hn-hero-meta { display: flex; gap: 16px; font-family: system-ui, sans-serif; font-size: 13px; color: #666; }

/* Layout */
.hn-home-layout { display: grid; grid-template-columns: 1fr 280px; gap: 32px; }
.hn-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px; }
@media (max-width: 900px) { .hn-grid3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .hn-grid3 { grid-template-columns: 1fr; } }
.hn-section-head { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #c0392b; padding-bottom: 8px; }
.hn-more-btn { display: block; margin: 0 auto; background: none; border: 2px solid #c0392b; color: #c0392b; font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 24px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; }
.hn-more-btn:hover { background: #c0392b; color: #fff; }

/* Article card */
.hn-article-card { background: #fff; border: 1px solid #e5e5e5; overflow: hidden; }
.hn-card-img { display: block; position: relative; cursor: pointer; }
.hn-card-img img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.hn-card-body { padding: 16px; }
.hn-card-hl { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; line-height: 1.3; margin-bottom: 8px; }
.hn-card-hl a { color: #1a1a1a; cursor: pointer; }
.hn-card-hl a:hover { color: #c0392b; text-decoration: none; }
.hn-card-exc { font-size: 14px; color: #666; margin-bottom: 12px; line-height: 1.5; }
.hn-card-meta { display: flex; justify-content: space-between; font-family: system-ui, sans-serif; font-size: 12px; color: #666; }

/* Sidebar */
.hn-sidebar { display: flex; flex-direction: column; gap: 24px; }
.hn-side-widget { background: #fff; border: 1px solid #e5e5e5; padding: 16px; }
.hn-side-title { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; border-bottom: 2px solid #c0392b; padding-bottom: 8px; margin-bottom: 12px; }
.hn-side-item { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #e5e5e5; }
.hn-side-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.hn-side-hl { display: block; font-size: 14px; font-family: 'Playfair Display', Georgia, serif; font-weight: 600; line-height: 1.4; cursor: pointer; color: #1a1a1a; }
.hn-side-hl:hover { color: #c0392b; }
.hn-side-date { font-family: system-ui, sans-serif; font-size: 11px; color: #666; margin-top: 4px; }
.hn-side-cat { display: block; width: 100%; background: none; border: none; text-align: left; cursor: pointer; padding: 6px 0; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #e5e5e5; font-family: 'Lora', Georgia, serif; }
.hn-side-cat:hover { color: #c0392b; }

/* Articles page */
.hn-page-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; margin-bottom: 24px; }
.hn-filter-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.hn-filter-tab { background: none; border: 1px solid #e5e5e5; cursor: pointer; padding: 6px 14px; font-family: system-ui, sans-serif; font-size: 13px; color: #1a1a1a; }
.hn-filter-tab:hover { border-color: #c0392b; color: #c0392b; }
.hn-filter-tab--active { background: #c0392b; border-color: #c0392b; color: #fff; }
.hn-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
.hn-page-btn { background: none; border: 1px solid #e5e5e5; padding: 8px 14px; cursor: pointer; font-size: 14px; font-family: system-ui, sans-serif; color: #1a1a1a; }
.hn-page-btn:hover { border-color: #c0392b; color: #c0392b; }
.hn-page-btn--active { background: #c0392b; border-color: #c0392b; color: #fff; }

/* Article detail */
.hn-reading { max-width: 680px; margin: 0 auto; }
.hn-breadcrumb { font-family: system-ui, sans-serif; font-size: 13px; color: #666; margin-bottom: 20px; }
.hn-breadcrumb button { background: none; border: none; cursor: pointer; color: #666; font-size: 13px; }
.hn-breadcrumb button:hover { color: #c0392b; }
.hn-article-hl { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 3vw, 36px); font-weight: 700; line-height: 1.2; margin: 12px 0; }
.hn-article-byline { display: flex; flex-wrap: wrap; gap: 8px 16px; font-family: system-ui, sans-serif; font-size: 13px; color: #666; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e5e5; align-items: center; }
.hn-author { font-weight: 600; color: #1a1a1a; }
.hn-updated { color: #c0392b; }
.hn-article-fig { margin-bottom: 24px; }
.hn-article-fig img { width: 100%; }
.hn-article-fig figcaption { font-family: system-ui, sans-serif; font-size: 12px; color: #666; margin-top: 6px; }
.hn-article-body { font-size: 16px; line-height: 1.75; }
.hn-article-body p { margin-bottom: 20px; }
.hn-article-lead { font-weight: 600; font-size: 17px; }
.hn-article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
.hn-tag { background: #e5e5e5; padding: 4px 10px; font-family: system-ui, sans-serif; font-size: 12px; border-radius: 2px; }
.hn-related { margin-top: 40px; padding-top: 24px; border-top: 2px solid #c0392b; }
.hn-related-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 20px; }

/* Static */
.hn-static-page { max-width: 720px; }
.hn-static-body h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin: 28px 0 12px; }
.hn-static-body p { margin-bottom: 16px; line-height: 1.7; }

/* Staff */
.hn-staff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px; }
@media (max-width: 700px) { .hn-staff-grid { grid-template-columns: repeat(2, 1fr); } }
.hn-staff-card { background: #fff; border: 1px solid #e5e5e5; padding: 20px; }
.hn-staff-name { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.hn-staff-title { font-size: 14px; font-style: italic; color: #666; margin-bottom: 4px; }
.hn-staff-beat { font-size: 13px; color: #c0392b; font-family: system-ui, sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
.hn-staff-email { font-family: system-ui, sans-serif; font-size: 13px; color: #c0392b; }

/* Not found */
.hn-not-found { text-align: center; padding: 60px 24px; }
.hn-not-found button { margin-top: 16px; background: none; border: 2px solid #c0392b; color: #c0392b; padding: 10px 20px; cursor: pointer; font-size: 14px; }

/* Footer */
.hn-footer { background: #1a1a1a; color: #aaa; margin-top: 48px; }
.hn-footer-inner { max-width: 1100px; margin: 0 auto; padding: 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-family: system-ui, sans-serif; font-size: 13px; }
.hn-footer-links a { color: #aaa; cursor: pointer; }
.hn-footer-links a:hover { color: #fff; }
</style>
