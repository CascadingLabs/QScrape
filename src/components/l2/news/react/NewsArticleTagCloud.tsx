/**
 * @qscrape L2 / react / news / island
 * @component NewsArticleTagCloud
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { articles } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

// Build tag -> count map
const tagCounts: Record<string, number> = {};
for (const a of articles) {
	for (const t of a.tags) {
		tagCounts[t] = (tagCounts[t] ?? 0) + 1;
	}
}
const allTags = Object.entries(tagCounts)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 30);

export default function NewsArticleTagCloud() {
	const [ready, setReady] = useState(false);
	const [activeCat, setActiveCat] = useState<string | null>(null);

	useEffect(() => {
		setActiveCat(getUrlCat());
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) =>
			setActiveCat((e as CustomEvent<string | null>).detail);
		const onPop = () => setActiveCat(getUrlCat());
		window.addEventListener('news:cat', onCat);
		window.addEventListener('popstate', onPop);
		return () => {
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('popstate', onPop);
		};
	}, []);

	if (!ready) {
		return (
			<div style={{ padding: '24px', color: '#888', fontFamily: 'system-ui' }}>
				Loading…
			</div>
		);
	}

	const maxCount = allTags[0]?.[1] ?? 1;

	return (
		<div
			data-component="news-article-tagcloud"
			data-framework="react"
			style={{
				background: 'var(--hn-surface)',
				border: '1px solid var(--hn-border)',
				borderRadius: 'var(--hn-radius)',
				padding: '16px',
			}}
		>
			<h3
				style={{
					fontFamily: 'var(--hn-font-display)',
					fontSize: '14px',
					fontWeight: '700',
					marginBottom: '12px',
					color: 'var(--hn-text)',
					textTransform: 'uppercase',
					letterSpacing: '0.06em',
				}}
			>
				Topics
			</h3>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
				{allTags.map(([tag, count]) => {
					const size = 11 + Math.round((count / maxCount) * 6);
					return (
						<span
							key={tag}
							data-tag={tag}
							data-count={count}
							style={{
								fontSize: `${size}px`,
								color: 'var(--hn-accent)',
								cursor: 'default',
								fontFamily: 'var(--hn-font-ui)',
							}}
						>
							{tag}{' '}
							<span style={{ fontSize: '10px', color: 'var(--hn-muted)' }}>
								({count})
							</span>
						</span>
					);
				})}
			</div>
			{activeCat && (
				<div
					style={{
						marginTop: '16px',
						paddingTop: '12px',
						borderTop: '1px solid var(--hn-border)',
						fontSize: '12px',
						color: 'var(--hn-muted)',
						fontFamily: 'var(--hn-font-ui)',
					}}
				>
					Filtered: <strong>{activeCat}</strong>
				</div>
			)}
		</div>
	);
}
