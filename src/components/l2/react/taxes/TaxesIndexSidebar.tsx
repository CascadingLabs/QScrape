/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesIndexSidebar
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { deeds, indexLabels, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

function getActiveIndex() {
	return new URLSearchParams(window.location.search).get('index') ?? 'ALL';
}

function dispatchSearch(index: string) {
	const url = new URL(window.location.href);
	if (index !== 'ALL') {
		url.searchParams.set('index', index);
	} else {
		url.searchParams.delete('index');
	}
	url.searchParams.delete('lastFirm');
	url.searchParams.delete('first');
	url.searchParams.delete('file');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('taxes:search', {
			detail: { lastFirm: '', first: '', index },
		}),
	);
}

const counts = Object.fromEntries(
	indexTypes.map((t) => [t, deeds.filter((d) => d.index === t).length]),
);

export default function TaxesIndexSidebar() {
	const [ready, setReady] = useState(false);
	const [active, setActive] = useState('ALL');

	useEffect(() => {
		setActive(getActiveIndex());
		fakeGet(null).then(() => setReady(true));

		const onPop = () => setActive(getActiveIndex());
		const onSearch = (e: Event) => {
			setActive((e as CustomEvent<{ index: string }>).detail.index);
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('taxes:search', onSearch);
		};
	}, []);

	if (!ready) {
		return (
			<div
				style={{
					padding: '12px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
				}}
			>
				Loading…
			</div>
		);
	}

	const btnStyle = (isActive: boolean): React.CSSProperties => ({
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '7px 10px',
		borderRadius: '3px',
		border: 'none',
		cursor: 'pointer',
		fontFamily: 'var(--er-font)',
		fontSize: '13px',
		background: isActive ? 'var(--er-primary)' : 'transparent',
		color: isActive ? '#fff' : 'var(--er-text)',
		marginBottom: '2px',
		textAlign: 'left',
	});

	return (
		<div
			data-component="taxes-index-sidebar"
			data-framework="react"
			style={{
				background: 'var(--er-surface)',
				border: '1px solid var(--er-border)',
				borderRadius: 'var(--er-radius)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					background: 'var(--er-bg)',
					borderBottom: '1px solid var(--er-border)',
					padding: '10px 14px',
					fontSize: '12px',
					fontWeight: '700',
					color: 'var(--er-muted)',
					letterSpacing: '0.04em',
					textTransform: 'uppercase',
					fontFamily: 'var(--er-font)',
				}}
			>
				Index Type
			</div>
			<div style={{ padding: '8px' }}>
				<button
					type="button"
					data-index="ALL"
					onClick={() => {
						setActive('ALL');
						dispatchSearch('ALL');
					}}
					style={btnStyle(active === 'ALL')}
				>
					<span>All Types</span>
					<span style={{ fontSize: '11px', opacity: 0.75 }}>
						{deeds.length}
					</span>
				</button>
				{indexTypes.map((t) => (
					<button
						key={t}
						type="button"
						data-index={t}
						onClick={() => {
							setActive(t);
							dispatchSearch(t);
						}}
						style={btnStyle(active === t)}
					>
						<span>
							<strong>{t}</strong> — {indexLabels[t]}
						</span>
						<span style={{ fontSize: '11px', opacity: 0.75 }}>{counts[t]}</span>
					</button>
				))}
			</div>
		</div>
	);
}
