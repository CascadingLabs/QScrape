<script lang="ts">
// @qscrape L2 / svelte / news — Mountainhome Herald
import { onDestroy, onMount } from 'svelte';
import '../../../../styles/l2/news.css';
import { fakeGet } from '../../../../data/api';
import {
	type ArticleMeta,
	articles,
	getBreaking,
	getByCategory,
	getLatest,
} from '../../../../data/news/articles';

type Page =
	| { name: 'home' }
	| { name: 'articles'; category?: string; page: number }
	| { name: 'article'; id: string }
	| { name: 'about' }
	| { name: 'staff' }
	| { name: 'contact' };

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function urlToPage(): Page {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'article') {
		return { name: 'article', id: p.get('id') ?? '' };
	}
	if (seg === 'articles') {
		return {
			name: 'articles',
			category: p.get('cat') ?? undefined,
			page: Number(p.get('page') ?? 1),
		};
	}
	if (seg === 'about') {
		return { name: 'about' };
	}
	if (seg === 'staff') {
		return { name: 'staff' };
	}
	if (seg === 'contact') {
		return { name: 'contact' };
	}
	return { name: 'home' };
}
function pageToUrl(p: Page): string {
	const base = getBase();
	if (p.name === 'article') {
		return `${base}article?id=${encodeURIComponent(p.id)}`;
	}
	if (p.name === 'articles') {
		const params = new URLSearchParams();
		if (p.category) {
			params.set('cat', p.category);
		}
		if (p.page > 1) {
			params.set('page', String(p.page));
		}
		const qs = params.toString();
		return `${base}articles${qs ? `?${qs}` : ''}`;
	}
	if (p.name === 'about') {
		return `${base}about`;
	}
	if (p.name === 'staff') {
		return `${base}staff`;
	}
	if (p.name === 'contact') {
		return `${base}contact`;
	}
	return base;
}

let _ready = false;
let current: Page = { name: 'home' };

const breaking = getBreaking();
let tickerIdx = 0;
let _tickerText = breaking.length ? breaking[tickerIdx].headline : '';
if (breaking.length > 1) {
	setInterval(() => {
		tickerIdx = (tickerIdx + 1) % breaking.length;
		_tickerText = breaking[tickerIdx].headline;
	}, 5000);
}

const PER_PAGE = 6;

function _nav(p: Page) {
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

function articlesForPage(): {
	list: ArticleMeta[];
	total: number;
	pages: number;
} {
	if (current.name !== 'articles') {
		return { list: [], total: 0, pages: 0 };
	}
	const base = current.category
		? getByCategory(current.category)
		: getLatest(20);
	const total = base.length;
	const pages = Math.ceil(total / PER_PAGE);
	const list = base.slice(
		(current.page - 1) * PER_PAGE,
		current.page * PER_PAGE,
	);
	return { list, total, pages };
}

function articleById(id: string): ArticleMeta | undefined {
	return articles.find((a) => a.id === id);
}

$: pageData = current.name === 'articles' ? articlesForPage() : null;
$: currentArticle = current.name === 'article' ? articleById(current.id) : null;
</script>

{#if !ready}
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Georgia,serif;color:#666">Loading…</div>
{:else}
<div class="herald-shell">
  <!-- Masthead -->
  <header class="masthead">
    {#if breaking.length}
      <div class="breaking-bar">
        <span class="breaking-label">BREAKING</span>
        <span class="breaking-text">{tickerText}</span>
      </div>
    {/if}
    <div class="masthead-inner">
      <button class="logo-btn" on:click={() => nav({ name: 'home' })}>
        The Mountainhome Herald
      </button>
      <nav class="main-nav">
        <button on:click={() => nav({ name: 'articles', page: 1 })}>All Articles</button>
        {#each categories as cat}
          <button on:click={() => nav({ name: 'articles', category: cat, page: 1 })}>{cat}</button>
        {/each}
        <button on:click={() => nav({ name: 'about' })}>About</button>
        <button on:click={() => nav({ name: 'staff' })}>Staff</button>
        <button on:click={() => nav({ name: 'contact' })}>Contact</button>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <!-- HOME PAGE -->
    {#if current.name === 'home'}
      <section class="home-section">
        <h2 class="section-title">Latest News</h2>
        <div class="article-grid">
          {#each getLatest(6) as art}
            <article class="article-card" data-id={art.id} data-category={art.category}>
              <img src={art.image} alt={art.imageCaption} />
              <div class="card-body">
                <span class="cat-badge cat-{art.category.toLowerCase().replace(/\s+/g, '-')}">{art.category}</span>
                <h3>
                  <button class="link-btn" on:click={() => nav({ name: 'article', id: art.id })}>
                    {art.headline}
                  </button>
                </h3>
                <p class="card-excerpt">{art.excerpt}</p>
                <div class="card-meta">
                  <span>{art.author}</span>
                  <span>{formatDate(art.published)}</span>
                </div>
              </div>
            </article>
          {/each}
        </div>
        <div class="view-all">
          <button class="btn-primary" on:click={() => nav({ name: 'articles', page: 1 })}>
            View All Articles
          </button>
        </div>
      </section>

    <!-- ARTICLES PAGE -->
    {:else if current.name === 'articles' && pageData}
      <section class="articles-section">
        <div class="articles-header">
          <h2 class="section-title">
            {current.category ? `${current.category} — Articles` : 'All Articles'}
          </h2>
          <div class="cat-tabs">
            <button
              class="cat-tab{!current.category ? ' active' : ''}"
              on:click={() => nav({ name: 'articles', page: 1 })}
            >All</button>
            {#each categories as cat}
              <button
                class="cat-tab{current.category === cat ? ' active' : ''}"
                on:click={() => nav({ name: 'articles', category: cat, page: 1 })}
              >{cat}</button>
            {/each}
          </div>
        </div>
        <div class="article-grid">
          {#each pageData.list as art}
            <article class="article-card" data-id={art.id} data-category={art.category}>
              <img src={art.image} alt={art.imageCaption} />
              <div class="card-body">
                <span class="cat-badge cat-{art.category.toLowerCase().replace(/\s+/g, '-')}">{art.category}</span>
                <h3>
                  <button class="link-btn" on:click={() => nav({ name: 'article', id: art.id })}>
                    {art.headline}
                  </button>
                </h3>
                <p class="card-excerpt">{art.excerpt}</p>
                <div class="card-meta">
                  <span>{art.author}</span>
                  <span>{formatDate(art.published)}</span>
                </div>
              </div>
            </article>
          {/each}
        </div>
        {#if pageData.pages > 1}
          <div class="pagination">
            {#each Array(pageData.pages) as _, i}
              <button
                class="page-btn{current.page === i + 1 ? ' active' : ''}"
                on:click={() => nav({ name: 'articles', category: current.name === 'articles' ? current.category : undefined, page: i + 1 })}
              >{i + 1}</button>
            {/each}
          </div>
        {/if}
      </section>

    <!-- ARTICLE DETAIL PAGE -->
    {:else if current.name === 'article' && currentArticle}
      {@const art = currentArticle}
      <article class="article-detail" data-id={art.id} data-category={art.category}>
        <div class="article-header">
          <span class="cat-badge cat-{art.category.toLowerCase().replace(/\s+/g, '-')}">{art.category}</span>
          {#if art.breaking}
            <span class="breaking-pill">Breaking</span>
          {/if}
          <h1 class="article-headline">{art.headline}</h1>
          <div class="article-meta">
            <span class="byline">{art.byline}</span>
            <time datetime={art.published}>{formatDateTime(art.published)}</time>
            {#if art.updated}
              <span class="updated">Updated: {formatDateTime(art.updated)}</span>
            {/if}
          </div>
          <div class="article-tags">
            {#each art.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
        <figure class="article-figure">
          <img src={art.image} alt={art.imageCaption} />
          <figcaption>
            <span class="caption-text">{art.imageCaption}</span>
            <span class="caption-credit">{art.imageCredit}</span>
          </figcaption>
        </figure>
        <div class="article-body">
          <p class="article-excerpt">{art.excerpt}</p>
        </div>
        <div class="article-nav">
          <button class="btn-secondary" on:click={() => nav({ name: 'articles', page: 1 })}>
            ← Back to Articles
          </button>
        </div>
      </article>

    <!-- ABOUT PAGE -->
    {:else if current.name === 'about'}
      <section class="static-page">
        <h1>About the Mountainhome Herald</h1>
        <p>Founded in Year 210, the Mountainhome Herald is the fortress's oldest and most widely read publication. We serve the entire dwelling population with independent coverage of politics, crime, economy, culture, sports, and geomantic conditions.</p>
        <p>The Herald operates under editorial independence from the Arcane Council. Our reporting adheres to the Dwarven Press Charter of Year 280.</p>
        <h2>Our Mission</h2>
        <p>To inform every dwarf in the fortress — from the deepest miners of Z-Level 115 to the gatekeepers of the Upper Surface — with accurate, fair, and timely news.</p>
        <h2>Contact</h2>
        <p>General inquiries: <a href="mailto:editor@herald.mh">editor@herald.mh</a></p>
      </section>

    <!-- STAFF PAGE -->
    {:else if current.name === 'staff'}
      <section class="static-page">
        <h1>Editorial Staff</h1>
        <div class="staff-grid">
          {#each reporters as r}
            <div class="staff-card" data-email={r.email}>
              <h3 class="staff-name">{r.name}</h3>
              <p class="staff-title">{r.title}</p>
              <p class="staff-beat">Beat: {r.beat}</p>
              <a class="staff-email" href="mailto:{r.email}">{r.email}</a>
            </div>
          {/each}
        </div>
      </section>

    <!-- CONTACT PAGE -->
    {:else if current.name === 'contact'}
      <section class="static-page">
        <h1>Contact Us</h1>
        <p>The Mountainhome Herald welcomes tips, corrections, and story pitches.</p>
        <form class="contact-form">
          <label for="contact-name">Name</label>
          <input id="contact-name" type="text" name="name" placeholder="Your name" />
          <label for="contact-email">Email</label>
          <input id="contact-email" type="email" name="email" placeholder="your@email.mh" />
          <label for="contact-dept">Department</label>
          <select id="contact-dept" name="department">
            <option value="">— Select department —</option>
            <option value="news">News Desk</option>
            <option value="corrections">Corrections</option>
            <option value="tips">Tips</option>
            <option value="letters">Letters to the Editor</option>
            <option value="advertising">Advertising</option>
          </select>
          <label for="contact-msg">Message</label>
          <textarea id="contact-msg" name="message" rows="6" placeholder="Your message…"></textarea>
          <button type="submit" class="btn-primary">Send Message</button>
        </form>
      </section>
    {/if}
  </main>

  <footer class="site-footer">
    <p>© Year 312 The Mountainhome Herald · Established Year 210 · <a href="mailto:editor@herald.mh">editor@herald.mh</a></p>
  </footer>
</div>
{/if}

<style>
  .herald-shell { min-height: 100vh; display: flex; flex-direction: column; }

  /* Masthead */
  .masthead { background: var(--hn-masthead-bg); color: var(--hn-masthead-text); }
  .breaking-bar { background: var(--hn-accent); color: #fff; display: flex; align-items: center; gap: 12px; padding: 6px 24px; font-family: var(--hn-font-ui); font-size: 13px; }
  .breaking-label { font-weight: 700; letter-spacing: 0.08em; white-space: nowrap; }
  .masthead-inner { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .logo-btn { background: none; border: none; color: var(--hn-masthead-text); font-family: var(--hn-font-display); font-size: 2.4rem; font-weight: 700; cursor: pointer; letter-spacing: -0.01em; }
  .main-nav { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
  .main-nav button { background: none; border: none; color: rgba(255,255,255,0.75); font-family: var(--hn-font-ui); font-size: 13px; padding: 4px 10px; cursor: pointer; border-radius: var(--hn-radius); transition: color 0.15s; }
  .main-nav button:hover { color: #fff; }

  /* Content */
  .main-content { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 32px 24px; }
  .section-title { font-family: var(--hn-font-display); font-size: 1.8rem; margin-bottom: 24px; border-bottom: 2px solid var(--hn-border); padding-bottom: 8px; }

  /* Article grid */
  .article-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px; }
  .article-card { background: var(--hn-surface); border: 1px solid var(--hn-border); border-radius: var(--hn-radius); overflow: hidden; }
  .card-body { padding: 16px; }
  .cat-badge { font-family: var(--hn-font-ui); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 6px; border-radius: 2px; background: var(--hn-accent); color: #fff; display: inline-block; margin-bottom: 8px; }
  .card-body h3 { font-family: var(--hn-font-display); font-size: 1.05rem; margin-bottom: 8px; line-height: 1.3; }
  .link-btn { background: none; border: none; color: var(--hn-text); font-family: inherit; font-size: inherit; font-weight: inherit; line-height: inherit; cursor: pointer; text-align: left; padding: 0; }
  .link-btn:hover { color: var(--hn-accent); }
  .card-excerpt { font-size: 14px; color: var(--hn-muted); margin-bottom: 12px; }
  .card-meta { font-family: var(--hn-font-ui); font-size: 12px; color: var(--hn-muted); display: flex; gap: 12px; }

  /* Articles page header */
  .articles-header { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .cat-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
  .cat-tab { background: none; border: 1px solid var(--hn-border); border-radius: 20px; padding: 4px 14px; font-family: var(--hn-font-ui); font-size: 13px; cursor: pointer; color: var(--hn-muted); }
  .cat-tab:hover, .cat-tab.active { background: var(--hn-accent); border-color: var(--hn-accent); color: #fff; }

  /* Pagination */
  .pagination { display: flex; gap: 8px; justify-content: center; margin-top: 24px; }
  .page-btn { background: var(--hn-surface); border: 1px solid var(--hn-border); padding: 6px 14px; font-family: var(--hn-font-ui); font-size: 14px; cursor: pointer; border-radius: var(--hn-radius); }
  .page-btn.active { background: var(--hn-accent); border-color: var(--hn-accent); color: #fff; }

  /* Article detail */
  .article-detail { max-width: var(--hn-max-reading); margin: 0 auto; }
  .article-header { margin-bottom: 24px; }
  .article-headline { font-family: var(--hn-font-display); font-size: 2rem; line-height: 1.2; margin: 12px 0; }
  .article-meta { font-family: var(--hn-font-ui); font-size: 13px; color: var(--hn-muted); display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
  .article-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { font-family: var(--hn-font-ui); font-size: 12px; background: var(--hn-border); padding: 2px 8px; border-radius: 2px; color: var(--hn-muted); }
  .breaking-pill { font-family: var(--hn-font-ui); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; background: var(--hn-accent); color: #fff; padding: 2px 8px; border-radius: 2px; display: inline-block; margin-left: 8px; }
  .article-figure { margin: 24px 0; }
  .article-figure img { width: 100%; border-radius: var(--hn-radius); }
  figcaption { font-family: var(--hn-font-ui); font-size: 12px; color: var(--hn-muted); margin-top: 6px; display: flex; justify-content: space-between; }
  .article-excerpt { font-size: 17px; line-height: 1.7; margin-bottom: 24px; }
  .article-nav { margin-top: 32px; }

  /* Static pages */
  .static-page { max-width: var(--hn-max-reading); margin: 0 auto; }
  .static-page h1 { font-family: var(--hn-font-display); font-size: 2rem; margin-bottom: 20px; }
  .static-page h2 { font-family: var(--hn-font-display); font-size: 1.4rem; margin: 24px 0 12px; }
  .static-page p { margin-bottom: 16px; line-height: 1.7; }

  /* Staff */
  .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-top: 24px; }
  .staff-card { background: var(--hn-surface); border: 1px solid var(--hn-border); padding: 16px; border-radius: var(--hn-radius); }
  .staff-name { font-family: var(--hn-font-display); font-size: 1.1rem; margin-bottom: 4px; }
  .staff-title { font-size: 13px; color: var(--hn-muted); margin-bottom: 4px; }
  .staff-beat { font-size: 13px; color: var(--hn-muted); margin-bottom: 8px; }
  .staff-email { font-family: var(--hn-font-ui); font-size: 13px; }

  /* Contact form */
  .contact-form { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; max-width: 520px; }
  .contact-form label { font-family: var(--hn-font-ui); font-size: 13px; font-weight: 600; }
  .contact-form input, .contact-form select, .contact-form textarea { border: 1px solid var(--hn-border); border-radius: var(--hn-radius); padding: 8px 12px; font-family: var(--hn-font-body); font-size: 15px; background: var(--hn-surface); color: var(--hn-text); }
  .contact-form textarea { resize: vertical; }

  /* Buttons */
  .btn-primary { background: var(--hn-accent); color: #fff; border: none; padding: 10px 22px; border-radius: var(--hn-radius); font-family: var(--hn-font-ui); font-size: 14px; font-weight: 600; cursor: pointer; }
  .btn-primary:hover { background: var(--hn-accent-hover); }
  .btn-secondary { background: none; border: 1px solid var(--hn-border); color: var(--hn-text); padding: 8px 18px; border-radius: var(--hn-radius); font-family: var(--hn-font-ui); font-size: 14px; cursor: pointer; }
  .btn-secondary:hover { background: var(--hn-border); }
  .view-all { text-align: center; }

  /* Footer */
  .site-footer { background: var(--hn-masthead-bg); color: rgba(255,255,255,0.6); text-align: center; padding: 20px 24px; font-family: var(--hn-font-ui); font-size: 13px; }
  .site-footer a { color: rgba(255,255,255,0.8); }
</style>
