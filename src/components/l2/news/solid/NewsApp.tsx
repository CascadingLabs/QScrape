/**
 * @qscrape L2 / solid / news
 * @component NewsApp
 */

import type { JSX } from 'solid-js';
import {
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from 'solid-js';
import { fakeGet } from '../../../../data/api';
import type { ArticleMeta } from '../../../../data/news/articles';
import {
	articles,
	categories,
	formatDate,
	formatDateTime,
	getBreaking,
	getByCategory,
	getLatest,
	reporters,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';
import styles from '../../react/news/NewsApp.module.css';

// ── URL routing helpers ──────────────────────────────────────────────────────

function getBase(): string {
	return (
		'/' +
		window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/') +
		'/'
	);
}

function pathToState(): { page: Page; articleId?: string; category?: string } {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'article') {
		return { page: 'article', articleId: p.get('id') ?? undefined };
	}
	if (seg === 'articles') {
		return { page: 'articles', category: p.get('cat') ?? undefined };
	}
	if (seg === 'about') {
		return { page: 'about' };
	}
	if (seg === 'staff') {
		return { page: 'staff' };
	}
	if (seg === 'contact') {
		return { page: 'contact' };
	}
	return { page: 'home' };
}

function pageToPath(p: Page, extra?: string): string {
	const base = getBase();
	if (p === 'article') {
		return `${base}article${extra ? `?id=${extra}` : ''}`;
	}
	if (p === 'articles') {
		return `${base}articles${extra ? `?cat=${encodeURIComponent(extra)}` : ''}`;
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

type Page = 'home' | 'articles' | 'article' | 'about' | 'contact' | 'staff';

function CategoryBadge(props: { category: string }) {
	return (
		<span
			class={`${styles.badge} ${styles[`badge_${props.category.toLowerCase()}`]}`}
		>
			{props.category}
		</span>
	);
}

function ArticleCard(props: {
	article: ArticleMeta;
	onNavigate: (id: string) => void;
}) {
	return (
		<article
			class={styles.articleCard}
			data-article-id={props.article.id}
			data-category={props.article.category}
		>
			<button
				type="button"
				class={styles.articleCardImg}
				onClick={() => props.onNavigate(props.article.id)}
			>
				<img
					src={props.article.image}
					alt={props.article.imageCaption}
					loading="lazy"
					width="580"
					height="320"
				/>
				<Show when={props.article.breaking}>
					<span class={styles.breakingTag}>BREAKING</span>
				</Show>
			</button>
			<div class={styles.articleCardBody}>
				<CategoryBadge category={props.article.category} />
				<h2 class={styles.articleCardHeadline}>
					<button
						type="button"
						onClick={() => props.onNavigate(props.article.id)}
					>
						{props.article.headline}
					</button>
				</h2>
				<p class={styles.articleCardExcerpt}>{props.article.excerpt}</p>
				<div class={styles.articleCardMeta}>
					<span class={styles.author}>{props.article.author}</span>
					<span class={styles.date}>{formatDate(props.article.published)}</span>
				</div>
			</div>
		</article>
	);
}

function HeraldShell(props: {
	children: JSX.Element;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const breaking = getBreaking();
	return (
		<div class={styles.shell}>
			<header class={styles.masthead}>
				<div class={styles.mastheadInner}>
					<div class={styles.mastheadDate}>
						{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</div>
					<button
						type="button"
						class={styles.mastheadTitle}
						onClick={() => props.onNavigate('home')}
					>
						<span class={styles.mastheadTitleMain}>
							The Mountainhome Herald
						</span>
						<span class={styles.mastheadTagline}>
							Est. Year 89 · Mountainhome, Granite Flats
						</span>
					</button>
					<div class={styles.mastheadRight}>
						&ldquo;All the news from Z-Level 1 to 120&rdquo;
					</div>
				</div>
				<Show when={breaking.length > 0}>
					<div class={styles.breakingBar}>
						<span class={styles.breakingLabel}>BREAKING</span>
						<div class={styles.breakingTicker}>
							<For each={breaking}>
								{(a, i) => (
									<span>
										{i() > 0 && ' · '}
										<button
											type="button"
											onClick={() => props.onNavigate('article', a.id)}
										>
											{a.headline}
										</button>
									</span>
								)}
							</For>
						</div>
					</div>
				</Show>
			</header>
			<nav class={styles.siteNav}>
				<div class={styles.siteNavInner}>
					<For
						each={['home', 'articles', 'about', 'staff', 'contact'] as Page[]}
					>
						{(p) => (
							<button
								type="button"
								class={`${styles.navItem} ${props.activePage === p ? styles.navItemActive : ''}`}
								onClick={() => props.onNavigate(p)}
							>
								{p === 'home' ? 'Home' : p.charAt(0).toUpperCase() + p.slice(1)}
							</button>
						)}
					</For>
				</div>
			</nav>
			<main class={styles.main}>{props.children}</main>
			<footer class={styles.footer}>
				<div class={styles.footerInner}>
					<p>&copy; Year 312 The Mountainhome Herald. All rights reserved.</p>
					<p class={styles.footerLinks}>
						<button type="button" onClick={() => props.onNavigate('about')}>
							About
						</button>
						{' · '}
						<button type="button" onClick={() => props.onNavigate('contact')}>
							Contact
						</button>
						{' · '}
						<button type="button" onClick={() => props.onNavigate('staff')}>
							Staff
						</button>
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage(props: { onNavigate: (page: Page, extra?: string) => void }) {
	const latest = getLatest(20);
	const featured = latest[0];
	const grid = latest.slice(1, 7);
	const sidebar = latest.slice(7, 13);

	return (
		<div class={styles.homePage}>
			<Show when={featured}>
				<section class={styles.hero}>
					<button
						type="button"
						class={styles.heroImg}
						onClick={() => props.onNavigate('article', featured!.id)}
					>
						<img
							src={featured!.image}
							alt={featured!.imageCaption}
							width="900"
							height="500"
							loading="eager"
						/>
						<Show when={featured!.breaking}>
							<span class={styles.breakingTag}>BREAKING</span>
						</Show>
					</button>
					<div class={styles.heroBody}>
						<CategoryBadge category={featured!.category} />
						<h1 class={styles.heroHeadline}>
							<button
								type="button"
								onClick={() => props.onNavigate('article', featured!.id)}
							>
								{featured!.headline}
							</button>
						</h1>
						<p class={styles.heroExcerpt}>{featured!.excerpt}</p>
						<div class={styles.heroMeta}>
							<span>{featured!.author}</span>
							<span>{formatDateTime(featured!.published)}</span>
						</div>
					</div>
				</section>
			</Show>
			<div class={styles.homeLayout}>
				<section class={styles.articleGrid}>
					<h2 class={styles.sectionHead}>Latest News</h2>
					<div class={styles.grid3}>
						<For each={grid}>
							{(a) => (
								<ArticleCard
									article={a}
									onNavigate={(id) => props.onNavigate('article', id)}
								/>
							)}
						</For>
					</div>
					<button
						type="button"
						class={styles.moreBtn}
						onClick={() => props.onNavigate('articles')}
					>
						More Stories →
					</button>
				</section>
				<aside class={styles.sidebar}>
					<div class={styles.sideWidget}>
						<h3 class={styles.sideWidgetTitle}>Top Stories</h3>
						<For each={sidebar}>
							{(a) => (
								<div class={styles.sideItem}>
									<CategoryBadge category={a.category} />
									<button
										type="button"
										class={styles.sideItemHead}
										onClick={() => props.onNavigate('article', a.id)}
									>
										{a.headline}
									</button>
									<div class={styles.sideItemMeta}>
										{formatDate(a.published)}
									</div>
								</div>
							)}
						</For>
					</div>
					<div class={styles.sideWidget}>
						<h3 class={styles.sideWidgetTitle}>Sections</h3>
						<For each={categories}>
							{(cat) => (
								<button
									type="button"
									class={styles.sideCategory}
									onClick={() => props.onNavigate('articles')}
								>
									{cat}
								</button>
							)}
						</For>
					</div>
				</aside>
			</div>
		</div>
	);
}

function ArticlesPage(props: {
	onNavigate: (page: Page, extra?: string) => void;
	initialCategory?: string;
}) {
	const [activeCategory, setActiveCategory] = createSignal(
		props.initialCategory || 'All',
	);
	const [page, setPage] = createSignal(1);
	const PER_PAGE = 6;

	const filtered = () =>
		activeCategory() === 'All' ? articles : getByCategory(activeCategory());
	const totalPages = () => Math.ceil(filtered().length / PER_PAGE);
	const pageItems = () =>
		filtered().slice((page() - 1) * PER_PAGE, page() * PER_PAGE);

	return (
		<div class={styles.articlesPage}>
			<h1 class={styles.pageTitle}>Articles</h1>
			<div class={styles.filterTabs}>
				<For each={['All', ...categories]}>
					{(cat) => (
						<button
							type="button"
							class={`${styles.filterTab} ${activeCategory() === cat ? styles.filterTabActive : ''}`}
							onClick={() => {
								setActiveCategory(cat);
								setPage(1);
							}}
							data-category={cat}
						>
							{cat}
						</button>
					)}
				</For>
			</div>
			<div class={styles.grid3}>
				<For each={pageItems()}>
					{(a) => (
						<ArticleCard
							article={a}
							onNavigate={(id) => props.onNavigate('article', id)}
						/>
					)}
				</For>
			</div>
			<Show when={totalPages() > 1}>
				<div class={styles.pagination}>
					<For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
						{(p) => (
							<button
								type="button"
								class={`${styles.pageBtn} ${p === page() ? styles.pageBtnActive : ''}`}
								onClick={() => setPage(p)}
							>
								{p}
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}

function ArticlePage(props: {
	articleId: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const article = () => articles.find((a) => a.id === props.articleId);
	const related = () =>
		articles
			.filter(
				(a) => a.category === article()?.category && a.id !== props.articleId,
			)
			.slice(0, 3);

	return (
		<Show
			when={article()}
			fallback={
				<div class={styles.notFound}>
					<h1>Article not found</h1>
					<button type="button" onClick={() => props.onNavigate('home')}>
						← Home
					</button>
				</div>
			}
		>
			{(art) => (
				<div class={styles.articlePage}>
					<div class={styles.articleReading}>
						<nav class={styles.breadcrumb}>
							<button type="button" onClick={() => props.onNavigate('home')}>
								Home
							</button>
							{' / '}
							<button
								type="button"
								onClick={() => props.onNavigate('articles')}
							>
								{art().category}
							</button>
						</nav>
						<CategoryBadge category={art().category} />
						<Show when={art().breaking}>
							<span class={`${styles.breakingTag} ${styles.breakingTagInline}`}>
								BREAKING
							</span>
						</Show>
						<h1 class={styles.articleHeadline}>{art().headline}</h1>
						<div class={styles.articleByline}>
							<span class={styles.author}>{art().author}</span>
							<span class={styles.bylineTitle}>{art().byline}</span>
							<time dateTime={art().published} class={styles.date}>
								{formatDateTime(art().published)}
							</time>
							<Show when={art().updated}>
								<span class={styles.updated}>
									Updated: {formatDateTime(art().updated!)}
								</span>
							</Show>
						</div>
						<figure class={styles.articleFigure}>
							<img
								src={art().image}
								alt={art().imageCaption}
								width="680"
								height="380"
							/>
							<figcaption>
								<span>{art().imageCaption}</span>
								<span class={styles.credit}> {art().imageCredit}</span>
							</figcaption>
						</figure>
						<div class={styles.articleBody}>
							<p class={styles.articleLead}>{art().excerpt}</p>
							<p>
								The Mountainhome Herald continues to follow developments related
								to this story. This report will be updated as additional
								information becomes available from official sources and
								correspondents in the field.
							</p>
							<p>
								Residents and stakeholders with relevant information are
								encouraged to contact the Herald editorial desk at{' '}
								<em>editor@herald.mh</em>. The Herald is committed to accurate,
								thorough coverage of all matters affecting the citizens of
								Mountainhome and the broader Granite Flats sector.
							</p>
						</div>
						<Show when={art().tags.length > 0}>
							<div class={styles.articleTags}>
								<For each={art().tags}>
									{(tag) => <span class={styles.tag}>{tag}</span>}
								</For>
							</div>
						</Show>
						<Show when={related().length > 0}>
							<aside class={styles.relatedArticles}>
								<h2 class={styles.relatedTitle}>Related Articles</h2>
								<div class={styles.relatedGrid}>
									<For each={related()}>
										{(r) => (
											<ArticleCard
												article={r}
												onNavigate={(id) => props.onNavigate('article', id)}
											/>
										)}
									</For>
								</div>
							</aside>
						</Show>
					</div>
				</div>
			)}
		</Show>
	);
}

function AboutPage() {
	return (
		<div class={styles.staticPage}>
			<h1 class={styles.pageTitle}>About the Herald</h1>
			<div class={styles.staticBody}>
				<p>
					The Mountainhome Herald was founded in Year 89 by Master Scribe Urist
					Bookbinder as a single-page broadsheet distributed weekly to fortress
					residents and guild officials. Over more than two centuries it has
					grown into the fortress's newspaper of record.
				</p>
				<h2>Editorial Policy</h2>
				<p>
					The Herald is committed to factual, impartial reporting on all matters
					affecting the citizens of Mountainhome. Our editorial staff
					independently verifies all claims before publication. Corrections are
					published promptly when errors are identified.
				</p>
				<h2>Coverage Areas</h2>
				<p>
					The Herald covers Politics, Crime, Economy, Culture, Sports, and
					Weather across all z-levels from the surface to the magma sea sector
					at Z-Level 114.
				</p>
				<h2>Subscriptions</h2>
				<p>
					Physical broadsheet delivery is available to all registered fortress
					residences. Contact the circulation desk for rates.
				</p>
			</div>
		</div>
	);
}

function StaffPage() {
	return (
		<div class={styles.staticPage}>
			<h1 class={styles.pageTitle}>Editorial Staff</h1>
			<div class={styles.staffGrid}>
				<For each={reporters}>
					{(r) => (
						<div class={styles.staffCard}>
							<div class={styles.staffName}>{r.name}</div>
							<div class={styles.staffTitle}>{r.title}</div>
							<div class={styles.staffBeat}>{r.beat}</div>
							<a href={`mailto:${r.email}`} class={styles.staffEmail}>
								{r.email}
							</a>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

function ContactPage() {
	return (
		<div class={styles.staticPage}>
			<h1 class={styles.pageTitle}>Contact the Herald</h1>
			<div class={styles.staticBody}>
				<h2>Editorial</h2>
				<p>
					General editorial inquiries:{' '}
					<a href="mailto:editor@herald.mh">editor@herald.mh</a>
				</p>
				<p>
					Tips and story leads:{' '}
					<a href="mailto:tips@herald.mh">tips@herald.mh</a>
				</p>
				<h2>Advertising</h2>
				<p>
					Display and classified advertising:{' '}
					<a href="mailto:advertising@herald.mh">advertising@herald.mh</a>
				</p>
				<p>
					Rate card available upon request. Herald reaches approximately 4,200
					fortress residents weekly.
				</p>
				<h2>Subscriptions</h2>
				<p>
					Circulation desk:{' '}
					<a href="mailto:circulation@herald.mh">circulation@herald.mh</a>
				</p>
				<p>
					Physical address: Herald Tower, Z-Level 3, Mountainhome Civic Quarter
				</p>
			</div>
		</div>
	);
}

export default function NewsApp(props: {
	initialPage?: Page;
	initialArticleId?: string;
	initialCategory?: string;
}) {
	const [ready, setReady] = createSignal(false);
	const [page, setPage] = createSignal<Page>(props.initialPage || 'home');
	const [articleId, setArticleId] = createSignal<string | undefined>(
		props.initialArticleId,
	);

	onMount(() => {
		const { page: urlPage, articleId: urlId } = pathToState();
		setPage(urlPage);
		if (urlId) {
			setArticleId(urlId);
		}

		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const s = pathToState();
			setPage(s.page);
			if (s.articleId) {
				setArticleId(s.articleId);
			}
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		onCleanup(() => window.removeEventListener('popstate', onPop));
	});

	const navigate = (p: Page, extra?: string) => {
		setPage(p);
		if (p === 'article' && extra) {
			setArticleId(extra);
		}
		history.pushState(null, '', pageToPath(p, extra));
		window.scrollTo(0, 0);
	};

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						display: 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'min-height': '100vh',
						'font-family': 'Georgia,serif',
						color: '#666',
					}}
				>
					Loading…
				</div>
			}
		>
			<HeraldShell activePage={page()} onNavigate={navigate}>
				<Switch>
					<Match when={page() === 'home'}>
						<HomePage onNavigate={navigate} />
					</Match>
					<Match when={page() === 'articles'}>
						<ArticlesPage
							onNavigate={navigate}
							initialCategory={props.initialCategory}
						/>
					</Match>
					<Match when={page() === 'article'}>
						<ArticlePage articleId={articleId() || ''} onNavigate={navigate} />
					</Match>
					<Match when={page() === 'about'}>
						<AboutPage />
					</Match>
					<Match when={page() === 'staff'}>
						<StaffPage />
					</Match>
					<Match when={page() === 'contact'}>
						<ContactPage />
					</Match>
					<Match when={true}>
						<HomePage onNavigate={navigate} />
					</Match>
				</Switch>
			</HeraldShell>
		</Show>
	);
}
