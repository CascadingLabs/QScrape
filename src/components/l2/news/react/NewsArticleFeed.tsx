/**
 * @qscrape L2 / react / news / island
 * @component NewsArticleFeed
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import {
	articles,
	formatDate,
	formatDateTime,
	getByCategory,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const PER_PAGE = 6;

function getUrlState() {
	const p = new URLSearchParams(window.location.search);
	return { id: p.get('id'), cat: p.get('cat') };
}

function goToArticle(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('id', id);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
	window.scrollTo(0, 0);
}

function ArticleDetail({ id }: { id: string }) {
	const a = articles.find((x) => x.id === id);
	if (!a) {
		return (
			<div style={{ padding: '24px', color: 'var(--hn-muted)' }}>
				Article not found.
			</div>
		);
	}
	return (
		<div
			data-component="news-article-detail"
			data-article-id={a.id}
			style={{ padding: '0 0 32px' }}
		>
			<button
				type="button"
				onClick={() => history.back()}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--hn-accent)',
					cursor: 'pointer',
					fontFamily: 'var(--hn-font-ui)',
					fontSize: '13px',
					padding: '0',
					marginBottom: '20px',
				}}
			>
				← Back to articles
			</button>
			<div
				style={{
					fontSize: '11px',
					fontWeight: '700',
					color: 'var(--hn-accent)',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					marginBottom: '8px',
				}}
				data-category={a.category}
			>
				{a.category}
			</div>
			{a.breaking && (
				<span
					style={{
						fontSize: '10px',
						fontWeight: '700',
						background: 'var(--hn-accent)',
						color: '#fff',
						padding: '2px 6px',
						borderRadius: 'var(--hn-radius)',
						marginBottom: '8px',
						display: 'inline-block',
					}}
				>
					BREAKING
				</span>
			)}
			<h1
				style={{
					fontFamily: 'var(--hn-font-display)',
					fontSize: '28px',
					fontWeight: '700',
					color: 'var(--hn-text)',
					lineHeight: '1.2',
					marginBottom: '12px',
				}}
			>
				{a.headline}
			</h1>
			<div
				style={{
					display: 'flex',
					gap: '12px',
					flexWrap: 'wrap',
					fontSize: '13px',
					color: 'var(--hn-muted)',
					marginBottom: '20px',
					fontFamily: 'var(--hn-font-ui)',
					borderBottom: '1px solid var(--hn-border)',
					paddingBottom: '16px',
				}}
			>
				<span data-author={a.author}>{a.author}</span>
				<span>{a.byline}</span>
				<time dateTime={a.published}>{formatDateTime(a.published)}</time>
			</div>
			<figure style={{ marginBottom: '24px' }}>
				<img
					src={a.image}
					alt={a.imageCaption}
					width="680"
					height="380"
					style={{ width: '100%', borderRadius: 'var(--hn-radius)' }}
				/>
				<figcaption
					style={{
						fontSize: '12px',
						color: 'var(--hn-muted)',
						marginTop: '8px',
						fontFamily: 'var(--hn-font-ui)',
					}}
				>
					{a.imageCaption} <em>{a.imageCredit}</em>
				</figcaption>
			</figure>
			<p
				style={{
					fontFamily: 'var(--hn-font-body)',
					fontSize: '17px',
					lineHeight: '1.7',
					color: 'var(--hn-text)',
					marginBottom: '16px',
				}}
			>
				{a.excerpt}
			</p>
			<p
				style={{
					fontFamily: 'var(--hn-font-body)',
					fontSize: '16px',
					lineHeight: '1.7',
					color: 'var(--hn-text)',
					marginBottom: '16px',
				}}
			>
				The Mountainhome Herald continues to follow developments related to this
				story. This report will be updated as additional information becomes
				available from official sources and correspondents in the field.
			</p>
			{a.tags.length > 0 && (
				<div
					style={{
						display: 'flex',
						gap: '6px',
						flexWrap: 'wrap',
						marginTop: '24px',
						paddingTop: '16px',
						borderTop: '1px solid var(--hn-border)',
					}}
				>
					{a.tags.map((tag) => (
						<span
							key={tag}
							style={{
								fontSize: '11px',
								padding: '3px 8px',
								border: '1px solid var(--hn-border)',
								borderRadius: 'var(--hn-radius)',
								color: 'var(--hn-muted)',
								fontFamily: 'var(--hn-font-ui)',
							}}
						>
							{tag}
						</span>
					))}
				</div>
			)}
		</div>
	);
}

export default function NewsArticleFeed() {
	const [ready, setReady] = useState(false);
	const [view, setView] = useState<'list' | 'detail'>('list');
	const [currentId, setCurrentId] = useState<string | null>(null);
	const [cat, setCat] = useState<string | null>(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const { id, cat: urlCat } = getUrlState();
		if (id) {
			setView('detail');
			setCurrentId(id);
		}
		setCat(urlCat);
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const { id: i, cat: c } = getUrlState();
			if (i) {
				setView('detail');
				setCurrentId(i);
			} else {
				setView('list');
				setCat(c);
				setPage(1);
			}
		};
		const onCat = (e: Event) => {
			setCat((e as CustomEvent<string | null>).detail);
			setView('list');
			setPage(1);
		};
		const onArticle = (e: Event) => {
			setCurrentId((e as CustomEvent<string>).detail);
			setView('detail');
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('news:cat', onCat);
		window.addEventListener('news:article', onArticle);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('news:article', onArticle);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{ padding: '40px 24px', color: '#888', fontFamily: 'system-ui' }}
			>
				Loading…
			</div>
		);
	}

	if (view === 'detail' && currentId) {
		return <ArticleDetail id={currentId} />;
	}

	const all = cat ? getByCategory(cat) : articles;
	const totalPages = Math.ceil(all.length / PER_PAGE);
	const items = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	return (
		<div data-component="news-article-feed" data-framework="react">
			<div
				style={{
					marginBottom: '16px',
					fontSize: '13px',
					color: 'var(--hn-muted)',
					fontFamily: 'var(--hn-font-ui)',
				}}
			>
				{all.length} article{all.length !== 1 ? 's' : ''}
				{cat ? ` in ${cat}` : ''}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
				{items.map((a) => (
					<article
						key={a.id}
						data-article-id={a.id}
						data-category={a.category}
						style={{
							display: 'flex',
							gap: '16px',
							cursor: 'pointer',
							paddingBottom: '20px',
							borderBottom: '1px solid var(--hn-border)',
						}}
						onClick={() => goToArticle(a.id)}
					>
						<img
							src={a.image}
							alt={a.imageCaption}
							width="160"
							height="100"
							loading="lazy"
							style={{
								width: '140px',
								height: '90px',
								objectFit: 'cover',
								borderRadius: 'var(--hn-radius)',
								flexShrink: 0,
							}}
						/>
						<div>
							<div
								style={{
									fontSize: '10px',
									fontWeight: '700',
									color: 'var(--hn-accent)',
									textTransform: 'uppercase',
									letterSpacing: '0.08em',
									marginBottom: '4px',
								}}
								data-category={a.category}
							>
								{a.category}
							</div>
							<h3
								style={{
									fontFamily: 'var(--hn-font-display)',
									fontSize: '16px',
									fontWeight: '600',
									color: 'var(--hn-text)',
									lineHeight: '1.3',
									marginBottom: '6px',
								}}
							>
								{a.headline}
							</h3>
							<p
								style={{
									fontSize: '13px',
									color: 'var(--hn-muted)',
									lineHeight: '1.5',
									fontFamily: 'var(--hn-font-body)',
									marginBottom: '6px',
								}}
							>
								{a.excerpt}
							</p>
							<div
								style={{
									fontSize: '12px',
									color: 'var(--hn-muted)',
									fontFamily: 'var(--hn-font-ui)',
								}}
							>
								{a.author} · {formatDate(a.published)}
							</div>
						</div>
					</article>
				))}
			</div>
			{totalPages > 1 && (
				<div
					style={{
						display: 'flex',
						gap: '6px',
						marginTop: '24px',
						justifyContent: 'center',
					}}
				>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
						<button
							key={n}
							type="button"
							onClick={() => setPage(n)}
							style={{
								padding: '5px 10px',
								border: `1px solid ${n === page ? 'var(--hn-accent)' : 'var(--hn-border)'}`,
								borderRadius: 'var(--hn-radius)',
								background: n === page ? 'var(--hn-accent)' : 'transparent',
								color: n === page ? '#fff' : 'var(--hn-text)',
								cursor: 'pointer',
								fontFamily: 'var(--hn-font-ui)',
								fontSize: '13px',
							}}
						>
							{n}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
