/**
 * @qscrape L2 / react / news / island
 * @component NewsBreakingTicker
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import {
	formatDate,
	getBreaking,
	getLatest,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const breaking = getBreaking();
const topHeadlines = getLatest(3);

function goToArticle(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('id', id);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
	window.scrollTo(0, 0);
}

export default function NewsBreakingTicker() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);

	if (!ready) {
		return (
			<div style={{ padding: '12px', color: '#888', fontFamily: 'system-ui' }}>
				Loading…
			</div>
		);
	}

	return (
		<div data-component="news-breaking-ticker" data-framework="react">
			{breaking.length > 0 && (
				<div
					style={{
						background: 'var(--hn-accent)',
						padding: '8px 20px',
						display: 'flex',
						gap: '12px',
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<span
						style={{
							fontSize: '11px',
							fontWeight: '700',
							color: '#fff',
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							flexShrink: 0,
						}}
					>
						Breaking
					</span>
					{breaking.map((a, i) => (
						<span key={a.id}>
							{i > 0 && (
								<span
									style={{ color: 'rgba(255,255,255,0.5)', margin: '0 4px' }}
								>
									·
								</span>
							)}
							<button
								type="button"
								onClick={() => goToArticle(a.id)}
								style={{
									background: 'none',
									border: 'none',
									color: '#fff',
									cursor: 'pointer',
									fontFamily: 'var(--hn-font-ui)',
									fontSize: '13px',
									padding: 0,
								}}
							>
								{a.headline}
							</button>
						</span>
					))}
				</div>
			)}
			<div style={{ padding: '16px 20px' }}>
				<h3
					style={{
						fontFamily: 'var(--hn-font-display)',
						fontSize: '12px',
						fontWeight: '700',
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
						color: 'var(--hn-muted)',
						marginBottom: '12px',
						borderBottom: '1px solid var(--hn-border)',
						paddingBottom: '8px',
					}}
				>
					Top Headlines
				</h3>
				<ul
					style={{
						listStyle: 'none',
						display: 'flex',
						flexDirection: 'column',
						gap: '12px',
					}}
				>
					{topHeadlines.map((a) => (
						<li key={a.id} data-article-id={a.id}>
							<button
								type="button"
								onClick={() => goToArticle(a.id)}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									textAlign: 'left',
									fontFamily: 'var(--hn-font-display)',
									fontSize: '14px',
									fontWeight: '600',
									color: 'var(--hn-text)',
									lineHeight: '1.35',
									padding: 0,
									width: '100%',
								}}
							>
								{a.headline}
							</button>
							<div
								style={{
									fontSize: '12px',
									color: 'var(--hn-muted)',
									marginTop: '4px',
									fontFamily: 'var(--hn-font-ui)',
								}}
							>
								<span data-category={a.category}>{a.category}</span>
								{' · '}
								<span>{formatDate(a.published)}</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
