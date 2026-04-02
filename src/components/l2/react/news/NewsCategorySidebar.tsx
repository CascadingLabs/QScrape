/**
 * @qscrape L2 / react / news / island
 * @component NewsCategorySidebar
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { categories } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const allCats = ['All', ...categories];

function navigate(cat: string) {
	const url = new URL(window.location.href);
	url.searchParams.delete('id');
	if (cat === 'All') {
		url.searchParams.delete('cat');
	} else {
		url.searchParams.set('cat', cat);
	}
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('news:cat', { detail: cat === 'All' ? null : cat }),
	);
	window.scrollTo(0, 0);
}

export default function NewsCategorySidebar() {
	const [ready, setReady] = useState(false);
	const [activeCat, setActiveCat] = useState('All');

	useEffect(() => {
		const cat = new URLSearchParams(window.location.search).get('cat');
		if (cat) {
			setActiveCat(cat);
		}
		fakeGet(null).then(() => setReady(true));

		const onCat = (e: Event) => {
			setActiveCat((e as CustomEvent<string | null>).detail ?? 'All');
		};
		const onPop = () => {
			const c = new URLSearchParams(window.location.search).get('cat');
			setActiveCat(c ?? 'All');
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
			<div style={{ padding: '12px', color: '#888', fontFamily: 'system-ui' }}>
				Loading…
			</div>
		);
	}

	return (
		<div
			data-component="news-category-sidebar"
			data-framework="react"
			style={{
				border: '1px solid var(--hn-border)',
				borderRadius: 'var(--hn-radius)',
				overflow: 'hidden',
				background: 'var(--hn-surface)',
			}}
		>
			<div
				style={{ background: 'var(--hn-masthead-bg)', padding: '10px 14px' }}
			>
				<h3
					style={{
						fontFamily: 'var(--hn-font-display)',
						fontSize: '12px',
						fontWeight: '700',
						color: 'var(--hn-masthead-text)',
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
					}}
				>
					Sections
				</h3>
			</div>
			<ul style={{ listStyle: 'none' }}>
				{allCats.map((cat) => (
					<li key={cat}>
						<button
							type="button"
							data-category={cat}
							onClick={() => {
								setActiveCat(cat);
								navigate(cat);
							}}
							style={{
								width: '100%',
								textAlign: 'left',
								background: activeCat === cat ? 'var(--hn-accent)' : 'none',
								border: 'none',
								borderBottom: '1px solid var(--hn-border)',
								padding: '9px 14px',
								cursor: 'pointer',
								fontFamily: 'var(--hn-font-ui)',
								fontSize: '13px',
								color: activeCat === cat ? '#fff' : 'var(--hn-text)',
							}}
						>
							{cat}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
