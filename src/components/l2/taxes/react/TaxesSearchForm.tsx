/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesSearchForm
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import { indexLabels, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

function getUrlSearch() {
	const p = new URLSearchParams(window.location.search);
	return {
		lastFirm: p.get('lastFirm') ?? '',
		first: p.get('first') ?? '',
		index: p.get('index') ?? 'ALL',
	};
}

function dispatchSearch(lastFirm: string, first: string, index: string) {
	const url = new URL(window.location.href);
	if (lastFirm) {
		url.searchParams.set('lastFirm', lastFirm);
	} else {
		url.searchParams.delete('lastFirm');
	}
	if (first) {
		url.searchParams.set('first', first);
	} else {
		url.searchParams.delete('first');
	}
	if (index !== 'ALL') {
		url.searchParams.set('index', index);
	} else {
		url.searchParams.delete('index');
	}
	url.searchParams.delete('file');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('taxes:search', { detail: { lastFirm, first, index } }),
	);
}

const inp: React.CSSProperties = {
	width: '100%',
	padding: '7px 10px',
	border: '1px solid var(--er-border)',
	borderRadius: 'var(--er-radius)',
	fontFamily: 'var(--er-font)',
	fontSize: '14px',
	background: 'var(--er-bg)',
	color: 'var(--er-text)',
};

const lbl: React.CSSProperties = {
	display: 'block',
	fontSize: '12px',
	fontWeight: '600',
	color: 'var(--er-muted)',
	marginBottom: '4px',
};

export default function TaxesSearchForm() {
	const [ready, setReady] = useState(false);
	const [lastFirm, setLastFirm] = useState('');
	const [first, setFirst] = useState('');
	const [index, setIndex] = useState('ALL');

	useEffect(() => {
		const s = getUrlSearch();
		setLastFirm(s.lastFirm);
		setFirst(s.first);
		setIndex(s.index);
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const s2 = getUrlSearch();
			setLastFirm(s2.lastFirm);
			setFirst(s2.first);
			setIndex(s2.index);
		};
		const onSearch = (e: Event) => {
			const d = (
				e as CustomEvent<{ lastFirm: string; first: string; index: string }>
			).detail;
			setLastFirm(d.lastFirm);
			setFirst(d.first);
			setIndex(d.index);
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('taxes:search', onSearch);
		};
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatchSearch(lastFirm, first, index);
	};

	const handleClear = () => {
		setLastFirm('');
		setFirst('');
		setIndex('ALL');
		dispatchSearch('', '', 'ALL');
	};

	if (!ready) {
		return (
			<div
				style={{
					padding: '16px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
				}}
			>
				Loading…
			</div>
		);
	}

	return (
		<form
			data-component="taxes-search-form"
			data-framework="react"
			onSubmit={handleSubmit}
			style={{
				background: 'var(--er-surface)',
				border: '1px solid var(--er-border)',
				borderRadius: 'var(--er-radius)',
				padding: '20px',
			}}
		>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
					gap: '12px',
					marginBottom: '14px',
				}}
			>
				<div>
					<label style={lbl}>Last Name / Firm</label>
					<input
						type="text"
						value={lastFirm}
						onChange={(e) => setLastFirm(e.target.value)}
						placeholder="e.g. ARMOK HOLDINGS"
						style={inp}
					/>
				</div>
				<div>
					<label style={lbl}>First Name</label>
					<input
						type="text"
						value={first}
						onChange={(e) => setFirst(e.target.value)}
						style={inp}
					/>
				</div>
				<div>
					<label style={lbl}>Index Type</label>
					<select
						value={index}
						onChange={(e) => setIndex(e.target.value)}
						style={inp}
					>
						<option value="ALL">All Types</option>
						{indexTypes.map((t) => (
							<option key={t} value={t}>
								{t} — {indexLabels[t]}
							</option>
						))}
					</select>
				</div>
			</div>
			<div style={{ display: 'flex', gap: '8px' }}>
				<button
					type="submit"
					style={{
						background: 'var(--er-primary)',
						color: '#fff',
						border: 'none',
						borderRadius: 'var(--er-radius)',
						padding: '8px 20px',
						fontFamily: 'var(--er-font)',
						fontSize: '14px',
						fontWeight: '600',
						cursor: 'pointer',
					}}
				>
					Search
				</button>
				<button
					type="button"
					onClick={handleClear}
					style={{
						background: 'transparent',
						color: 'var(--er-muted)',
						border: '1px solid var(--er-border)',
						borderRadius: 'var(--er-radius)',
						padding: '8px 16px',
						fontFamily: 'var(--er-font)',
						fontSize: '14px',
						cursor: 'pointer',
					}}
				>
					Clear
				</button>
			</div>
		</form>
	);
}
