/**
 * @qscrape L2 / react / news
 * @component NewsApp
 */
import { useEffect, useState } from 'react';
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
import styles from './NewsApp.module.css';

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

interface NewsAppProps {
	initialPage?: Page;
	initialArticleId?: string;
	initialCategory?: string;
}

function CategoryBadge({ category }: { category: string }) {
	return (
		<span
			className={`${styles.badge} ${styles[`badge_${category.toLowerCase()}`]}`}
		>
			{category}
		</span>
	);
}

function ArticleCard({
	article,
	onNavigate,
}: {
	article: ArticleMeta;
	onNavigate: (id: string) => void;
}) {
	return (
		<article
			className={styles.articleCard}
			data-article-id={article.id}
			data-category={article.category}
		>
			<button
				type="button"
				className={styles.articleCardImg}
				onClick={() => onNavigate(article.id)}
			>
				<img
					src={article.image}
					alt={article.imageCaption}
					loading="lazy"
					width="580"
					height="320"
				/>
				{article.breaking && (
					<span className={styles.breakingTag}>BREAKING</span>
				)}
			</button>
			<div className={styles.articleCardBody}>
				<CategoryBadge category={article.category} />
				<h2 className={styles.articleCardHeadline}>
					<button type="button" onClick={() => onNavigate(article.id)}>
						{article.headline}
					</button>
				</h2>
				<p className={styles.articleCardExcerpt}>{article.excerpt}</p>
				<div className={styles.articleCardMeta}>
					<span className={styles.author}>{article.author}</span>
					<span className={styles.date}>{formatDate(article.published)}</span>
				</div>
			</div>
		</article>
	);
}

function HeraldShell({
	children,
	activePage,
	onNavigate,
}: {
	children: React.ReactNode;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const breaking = getBreaking();
	return (
		<div className={styles.shell}>
			{/* Masthead */}
			<header className={styles.masthead}>
				<div className={styles.mastheadInner}>
					<div className={styles.mastheadDate}>
						{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</div>
					<button
						type="button"
						className={styles.mastheadTitle}
						onClick={() => onNavigate('home')}
					>
						<span className={styles.mastheadTitleMain}>
							The Mountainhome Herald
						</span>
						<span className={styles.mastheadTagline}>
							Est. Year 89 · Mountainhome, Granite Flats
						</span>
					</button>
					<div className={styles.mastheadRight}>
						&ldquo;All the news from Z-Level 1 to 120&rdquo;
					</div>
				</div>
				{breaking.length > 0 && (
					<div className={styles.breakingBar}>
						<span className={styles.breakingLabel}>BREAKING</span>
						<div className={styles.breakingTicker}>
							{breaking.map((a, i) => (
								<span key={a.id}>
									{i > 0 && ' · '}
									<button
										type="button"
										onClick={() => onNavigate('article', a.id)}
									>
										{a.headline}
									</button>
								</span>
							))}
						</div>
					</div>
				)}
			</header>

			{/* Nav */}
			<nav className={styles.siteNav}>
				<div className={styles.siteNavInner}>
					{(['home', 'articles', 'about', 'staff', 'contact'] as Page[]).map(
						(p) => (
							<button
								type="button"
								key={p}
								className={`${styles.navItem} ${activePage === p ? styles.navItemActive : ''}`}
								onClick={() => onNavigate(p)}
							>
								{p === 'home' ? 'Home' : p.charAt(0).toUpperCase() + p.slice(1)}
							</button>
						),
					)}
				</div>
			</nav>

			{/* Content */}
			<main className={styles.main}>{children}</main>

			{/* Footer */}
			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<p>&copy; Year 312 The Mountainhome Herald. All rights reserved.</p>
					<p className={styles.footerLinks}>
						<button type="button" onClick={() => onNavigate('about')}>
							About
						</button>
						{' · '}
						<button type="button" onClick={() => onNavigate('contact')}>
							Contact
						</button>
						{' · '}
						<button type="button" onClick={() => onNavigate('staff')}>
							Staff
						</button>
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage({
	onNavigate,
}: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const latest = getLatest(20);
	const featured = latest[0];
	const grid = latest.slice(1, 7);
	const sidebar = latest.slice(7, 13);

	return (
		<div className={styles.homePage}>
			{/* Hero */}
			{featured && (
				<section className={styles.hero}>
					<button
						type="button"
						className={styles.heroImg}
						onClick={() => onNavigate('article', featured.id)}
					>
						<img
							src={featured.image}
							alt={featured.imageCaption}
							width="900"
							height="500"
							loading="eager"
						/>
						{featured.breaking && (
							<span className={styles.breakingTag}>BREAKING</span>
						)}
					</button>
					<div className={styles.heroBody}>
						<CategoryBadge category={featured.category} />
						<h1 className={styles.heroHeadline}>
							<button
								type="button"
								onClick={() => onNavigate('article', featured.id)}
							>
								{featured.headline}
							</button>
						</h1>
						<p className={styles.heroExcerpt}>{featured.excerpt}</p>
						<div className={styles.heroMeta}>
							<span>{featured.author}</span>
							<span>{formatDateTime(featured.published)}</span>
						</div>
					</div>
				</section>
			)}

			<div className={styles.homeLayout}>
				{/* Grid */}
				<section className={styles.articleGrid}>
					<h2 className={styles.sectionHead}>Latest News</h2>
					<div className={styles.grid3}>
						{grid.map((a) => (
							<ArticleCard
								key={a.id}
								article={a}
								onNavigate={(id) => onNavigate('article', id)}
							/>
						))}
					</div>
					<button
						type="button"
						className={styles.moreBtn}
						onClick={() => onNavigate('articles')}
					>
						More Stories →
					</button>
				</section>

				{/* Sidebar */}
				<aside className={styles.sidebar}>
					<div className={styles.sideWidget}>
						<h3 className={styles.sideWidgetTitle}>Top Stories</h3>
						{sidebar.map((a) => (
							<div key={a.id} className={styles.sideItem}>
								<CategoryBadge category={a.category} />
								<button
									type="button"
									className={styles.sideItemHead}
									onClick={() => onNavigate('article', a.id)}
								>
									{a.headline}
								</button>
								<div className={styles.sideItemMeta}>
									{formatDate(a.published)}
								</div>
							</div>
						))}
					</div>
					<div className={styles.sideWidget}>
						<h3 className={styles.sideWidgetTitle}>Sections</h3>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat}
								className={styles.sideCategory}
								onClick={() => onNavigate('articles')}
							>
								{cat}
							</button>
						))}
					</div>
				</aside>
			</div>
		</div>
	);
}

function ArticlesPage({
	onNavigate,
	initialCategory,
}: {
	onNavigate: (page: Page, extra?: string) => void;
	initialCategory?: string;
}) {
	const [activeCategory, setActiveCategory] = useState<string>(
		initialCategory || 'All',
	);
	const [page, setPage] = useState(1);
	const PER_PAGE = 6;

	const filtered =
		activeCategory === 'All' ? articles : getByCategory(activeCategory);
	const totalPages = Math.ceil(filtered.length / PER_PAGE);
	const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const handleCategory = (cat: string) => {
		setActiveCategory(cat);
		setPage(1);
	};

	return (
		<div className={styles.articlesPage}>
			<h1 className={styles.pageTitle}>Articles</h1>

			{/* Filter tabs */}
			<div className={styles.filterTabs} role="tablist">
				{['All', ...categories].map((cat) => (
					<button
						type="button"
						key={cat}
						role="tab"
						aria-selected={activeCategory === cat}
						className={`${styles.filterTab} ${activeCategory === cat ? styles.filterTabActive : ''}`}
						onClick={() => handleCategory(cat)}
						data-category={cat}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Grid */}
			<div className={styles.grid3}>
				{pageItems.map((a) => (
					<ArticleCard
						key={a.id}
						article={a}
						onNavigate={(id) => onNavigate('article', id)}
					/>
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className={styles.pagination}>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
						<button
							type="button"
							key={p}
							className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
							onClick={() => setPage(p)}
							aria-current={p === page ? 'page' : undefined}
						>
							{p}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function ArticlePage({
	articleId,
	onNavigate,
}: {
	articleId: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const article = articles.find((a) => a.id === articleId);

	if (!article) {
		return (
			<div className={styles.notFound}>
				<h1>Article not found</h1>
				<button type="button" onClick={() => onNavigate('home')}>
					← Home
				</button>
			</div>
		);
	}

	const related = articles
		.filter((a) => a.category === article.category && a.id !== article.id)
		.slice(0, 3);

	return (
		<div className={styles.articlePage}>
			<div className={styles.articleReading}>
				<nav className={styles.breadcrumb}>
					<button type="button" onClick={() => onNavigate('home')}>
						Home
					</button>
					{' / '}
					<button type="button" onClick={() => onNavigate('articles')}>
						{article.category}
					</button>
				</nav>

				<CategoryBadge category={article.category} />
				{article.breaking && (
					<span className={`${styles.breakingTag} ${styles.breakingTagInline}`}>
						BREAKING
					</span>
				)}

				<h1 className={styles.articleHeadline}>{article.headline}</h1>

				<div className={styles.articleByline}>
					<span className={styles.author}>{article.author}</span>
					<span className={styles.bylineTitle}>{article.byline}</span>
					<time dateTime={article.published} className={styles.date}>
						{formatDateTime(article.published)}
					</time>
					{article.updated && (
						<span className={styles.updated}>
							Updated: {formatDateTime(article.updated)}
						</span>
					)}
				</div>

				<figure className={styles.articleFigure}>
					<img
						src={article.image}
						alt={article.imageCaption}
						width="680"
						height="380"
					/>
					<figcaption>
						<span>{article.imageCaption}</span>
						<span className={styles.credit}> {article.imageCredit}</span>
					</figcaption>
				</figure>

				<div className={styles.articleBody}>
					<p className={styles.articleLead}>{article.excerpt}</p>
					<p>
						The Mountainhome Herald continues to follow developments related to
						this story. This report will be updated as additional information
						becomes available from official sources and correspondents in the
						field.
					</p>
					<p>
						Residents and stakeholders with relevant information are encouraged
						to contact the Herald editorial desk at <em>editor@herald.mh</em>.
						The Herald is committed to accurate, thorough coverage of all
						matters affecting the citizens of Mountainhome and the broader
						Granite Flats sector.
					</p>
				</div>

				{article.tags.length > 0 && (
					<div className={styles.articleTags}>
						{article.tags.map((tag) => (
							<span key={tag} className={styles.tag}>
								{tag}
							</span>
						))}
					</div>
				)}

				{related.length > 0 && (
					<aside className={styles.relatedArticles}>
						<h2 className={styles.relatedTitle}>Related Articles</h2>
						<div className={styles.relatedGrid}>
							{related.map((r) => (
								<ArticleCard
									key={r.id}
									article={r}
									onNavigate={(id) => onNavigate('article', id)}
								/>
							))}
						</div>
					</aside>
				)}
			</div>
		</div>
	);
}

function AboutPage() {
	return (
		<div className={styles.staticPage}>
			<h1 className={styles.pageTitle}>About the Herald</h1>
			<div className={styles.staticBody}>
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
		<div className={styles.staticPage}>
			<h1 className={styles.pageTitle}>Editorial Staff</h1>
			<div className={styles.staffGrid}>
				{reporters.map((r) => (
					<div key={r.email} className={styles.staffCard}>
						<div className={styles.staffName}>{r.name}</div>
						<div className={styles.staffTitle}>{r.title}</div>
						<div className={styles.staffBeat}>{r.beat}</div>
						<a href={`mailto:${r.email}`} className={styles.staffEmail}>
							{r.email}
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

function ContactPage() {
	return (
		<div className={styles.staticPage}>
			<h1 className={styles.pageTitle}>Contact the Herald</h1>
			<div className={styles.staticBody}>
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

export default function NewsApp({
	initialPage = 'home',
	initialArticleId,
	initialCategory,
}: NewsAppProps) {
	const [ready, setReady] = useState(false);
	const [page, setPage] = useState<Page>(initialPage);
	const [articleId, setArticleId] = useState<string | undefined>(
		initialArticleId,
	);

	useEffect(() => {
		// Read URL for deep-link state
		const { page: urlPage, articleId: urlId } = pathToState();
		setPage(urlPage);
		if (urlId) {
			setArticleId(urlId);
		}

		// Async data load — scrapers must wait for this before content appears
		fakeGet(null).then(() => setReady(true));

		// Back/forward navigation
		const onPop = () => {
			const s = pathToState();
			setPage(s.page);
			if (s.articleId) {
				setArticleId(s.articleId);
			}
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);

	const navigate = (p: Page, extra?: string) => {
		setPage(p);
		if (p === 'article' && extra) {
			setArticleId(extra);
		}
		history.pushState(null, '', pageToPath(p, extra));
		window.scrollTo(0, 0);
	};

	if (!ready) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					fontFamily: 'Georgia,serif',
					color: '#666',
				}}
			>
				Loading…
			</div>
		);
	}

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <HomePage onNavigate={navigate} />;
			case 'articles':
				return (
					<ArticlesPage
						onNavigate={navigate}
						initialCategory={initialCategory}
					/>
				);
			case 'article':
				return (
					<ArticlePage articleId={articleId || ''} onNavigate={navigate} />
				);
			case 'about':
				return <AboutPage />;
			case 'staff':
				return <StaffPage />;
			case 'contact':
				return <ContactPage />;
			default:
				return <HomePage onNavigate={navigate} />;
		}
	};

	return (
		<HeraldShell activePage={page} onNavigate={navigate}>
			{renderPage()}
		</HeraldShell>
	);
}
