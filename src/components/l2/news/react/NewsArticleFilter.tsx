/**
 * @qscrape L2 / react / news / island
 * @component NewsArticleFilter
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { articles, categories } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

export default function NewsArticleFilter() {
	const [ready, setReady] = useState(false);
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		setActive(getUrlCat());
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) =>
			setActive((e as CustomEvent<string | null>).detail);
		const onPop = () => setActive(getUrlCat());
		window.addEventListener('news:cat', onCat);
		window.addEventListener('popstate', onPop);
		return () => {
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('popstate', onPop);
		};
	}, []);

	function pickCat(cat: string | null) {
		const url = new URL(window.location.href);
		if (cat) {
			url.searchParams.set('cat', cat);
		} else {
			url.searchParams.delete('cat');
		}
		url.searchParams.delete('page');
		history.pushState(null, '', url.toString());
		window.dispatchEvent(new CustomEvent('news:cat', { detail: cat }));
	}

	if (!ready) {
		return (
			<div
				style={{ padding: '12px 24px', color: '#888', fontFamily: 'system-ui' }}
			>
				Loading…
			</div>
		);
	}

	const allCats: (string | null)[] = [null, ...categories];
	return (
		<div
			data-component="news-article-filter"
			data-framework="react"
			style={{
				padding: '12px 0',
				borderBottom: '2px solid var(--hn-border)',
				marginBottom: '4px',
			}}
		>
			<div
				style={{
					display: 'flex',
					gap: '4px',
					flexWrap: 'wrap',
					maxWidth: '1200px',
					margin: '0 auto',
					padding: '0 24px',
				}}
			>
				{allCats.map((cat) => {
					const count = cat
						? articles.filter((a) => a.category === cat).length
						: articles.length;
					const isActive = active === cat;
					return (
						<button
							key={cat ?? 'all'}
							type="button"
							data-category={cat ?? 'all'}
							data-count={count}
							onClick={() => pickCat(cat)}
							style={{
								padding: '5px 12px',
								border: `1px solid ${isActive ? 'var(--hn-accent)' : 'var(--hn-border)'}`,
								borderRadius: 'var(--hn-radius)',
								background: isActive ? 'var(--hn-accent)' : 'transparent',
								color: isActive ? '#fff' : 'var(--hn-text)',
								cursor: 'pointer',
								fontFamily: 'var(--hn-font-ui)',
								fontSize: '13px',
								fontWeight: isActive ? '600' : '400',
							}}
						>
							{cat ?? 'All'}{' '}
							<span style={{ opacity: 0.65, fontSize: '11px' }}>({count})</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
