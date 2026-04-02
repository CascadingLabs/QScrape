/**
 * @qscrape L2 / react / eshop / island
 * @component EshopCategoryNav
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { categories } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

function getActiveCat(): string {
	return new URLSearchParams(window.location.search).get('cat') ?? 'All';
}

export default function EshopCategoryNav() {
	const [ready, setReady] = useState(false);
	const [active, setActive] = useState('All');

	useEffect(() => {
		setActive(getActiveCat());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => setActive(getActiveCat());
		const onCat = (e: Event) =>
			setActive((e as CustomEvent<string | null>).detail ?? 'All');
		window.addEventListener('popstate', onPop);
		window.addEventListener('eshop:cat', onCat);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('eshop:cat', onCat);
		};
	}, []);

	const navigate = (cat: string) => {
		const url = new URL(window.location.href);
		if (cat === 'All') {
			url.searchParams.delete('cat');
		} else {
			url.searchParams.set('cat', cat);
		}
		history.pushState(null, '', url.toString());
		setActive(cat);
		window.dispatchEvent(
			new CustomEvent('eshop:cat', { detail: cat === 'All' ? null : cat }),
		);
	};

	if (!ready) {
		return (
			<div style={{ padding: '12px', color: '#888', fontFamily: 'system-ui' }}>
				Loading…
			</div>
		);
	}

	return (
		<nav
			data-component="eshop-category-nav"
			data-framework="react"
			style={{
				padding: '14px 24px',
				borderBottom: '1px solid var(--vm-border)',
				display: 'flex',
				gap: '8px',
				flexWrap: 'wrap',
			}}
		>
			{(['All', ...categories] as string[]).map((cat) => (
				<button
					key={cat}
					type="button"
					data-category={cat}
					data-active={active === cat ? 'true' : undefined}
					onClick={() => navigate(cat)}
					style={{
						padding: '6px 14px',
						border:
							'1px solid ' +
							(active === cat ? 'var(--vm-primary)' : 'var(--vm-border)'),
						borderRadius: 'var(--vm-radius)',
						background: active === cat ? 'var(--vm-primary)' : 'transparent',
						color: active === cat ? '#fff' : 'var(--vm-text)',
						cursor: 'pointer',
						fontFamily: 'var(--vm-font)',
						fontSize: '13px',
						fontWeight: active === cat ? '600' : '400',
					}}
				>
					{cat}
				</button>
			))}
		</nav>
	);
}
