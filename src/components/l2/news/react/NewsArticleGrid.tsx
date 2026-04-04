/**
 * @qscrape L2 / react / news / island
 * @component NewsArticleGrid
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import {
	articles,
	formatDate,
	getByCategory,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const PER_PAGE = 8;

function getUrlState() {
	const p = new URLSearchParams(window.location.search);
	return { cat: p.get('cat') };
}

export default function NewsArticleGrid() {
	const [ready, setReady] = useState(false);
	const [cat, setCat] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(PER_PAGE);

	useEffect(() => {
		const { cat: urlCat } = getUrlState();
		setCat(urlCat);
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) => {
			setCat((e as CustomEvent<string | null>).detail);
			setVisibleCount(PER_PAGE);
		};
		const onPop = () => {
			const { cat: c } = getUrlState();
			setCat(c);
			setVisibleCount(PER_PAGE);
		};
		window.addEventListener('news:cat', onCat);
		window.addEventListener('popstate', onPop);
		return () => {
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('popstate', onPop);
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

	const all = cat ? getByCategory(cat) : articles;
	const items = all.slice(0, visibleCount);

	return (
		<div data-component="news-article-grid" data-framework="react">
			<div
				style={{
					marginBottom: '12px',
					fontSize: '13px',
					color: 'var(--hn-muted)',
					fontFamily: 'var(--hn-font-ui)',
				}}
			>
				{all.length} article{all.length !== 1 ? 's' : ''}
				{cat ? ` in ${cat}` : ''}
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
					gap: '20px',
				}}
			>
				{items.map((a) => (
					<article
						key={a.id}
						data-article-id={a.id}
						data-category={a.category}
						style={{
							border: '1px solid var(--hn-border)',
							borderRadius: 'var(--hn-radius)',
							overflow: 'hidden',
							background: 'var(--hn-surface)',
							cursor: 'pointer',
						}}
						onClick={() => {
							window.location.href = `/l2/news/?id=${a.id}`;
						}}
					>
						<img
							src={a.image}
							alt={a.imageCaption}
							width="280"
							height="160"
							loading="lazy"
							style={{
								width: '100%',
								height: '140px',
								objectFit: 'cover',
								display: 'block',
							}}
						/>
						<div style={{ padding: '12px' }}>
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
									fontSize: '15px',
									fontWeight: '600',
									color: 'var(--hn-text)',
									lineHeight: '1.3',
									marginBottom: '6px',
								}}
							>
								{a.headline}
							</h3>
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
			{visibleCount < all.length && (
				<div style={{ textAlign: 'center', marginTop: '24px' }}>
					<button
						type="button"
						onClick={() => setVisibleCount((c) => c + PER_PAGE)}
						style={{
							padding: '8px 20px',
							border: '1px solid var(--hn-border)',
							borderRadius: 'var(--hn-radius)',
							background: 'transparent',
							color: 'var(--hn-accent)',
							cursor: 'pointer',
							fontFamily: 'var(--hn-font-ui)',
							fontSize: '13px',
						}}
					>
						Load more ({all.length - visibleCount} remaining)
					</button>
				</div>
			)}
		</div>
	);
}
