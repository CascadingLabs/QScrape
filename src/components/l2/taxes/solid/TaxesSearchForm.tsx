/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesSearchForm
 */
import { createSignal, onCleanup, onMount } from 'solid-js';
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

function dispatchSearch(lf: string, fi: string, ix: string) {
	const url = new URL(window.location.href);
	if (lf) {
		url.searchParams.set('lastFirm', lf);
	} else {
		url.searchParams.delete('lastFirm');
	}
	if (fi) {
		url.searchParams.set('first', fi);
	} else {
		url.searchParams.delete('first');
	}
	if (ix !== 'ALL') {
		url.searchParams.set('index', ix);
	} else {
		url.searchParams.delete('index');
	}
	url.searchParams.delete('file');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('taxes:search', {
			detail: { lastFirm: lf, first: fi, index: ix },
		}),
	);
}

const allIndexTypes = ['ALL', ...indexTypes];

export default function TaxesSearchForm() {
	const [ready, setReady] = createSignal(false);
	const [lastFirm, setLastFirm] = createSignal('');
	const [first, setFirst] = createSignal('');
	const [index, setIndex] = createSignal('ALL');

	const onPop = () => {
		const s = getUrlSearch();
		setLastFirm(s.lastFirm);
		setFirst(s.first);
		setIndex(s.index);
	};
	const onSearch = (e: Event) => {
		const d = (
			e as CustomEvent<{ lastFirm: string; first: string; index: string }>
		).detail;
		setLastFirm(d.lastFirm);
		setFirst(d.first);
		setIndex(d.index);
	};

	onMount(() => {
		const s = getUrlSearch();
		setLastFirm(s.lastFirm);
		setFirst(s.first);
		setIndex(s.index);
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('taxes:search', onSearch);
	});

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		dispatchSearch(lastFirm(), first(), index());
	};

	const handleClear = () => {
		setLastFirm('');
		setFirst('');
		setIndex('ALL');
		dispatchSearch('', '', 'ALL');
	};

	const inp = {
		padding: '7px 10px',
		border: '1px solid var(--er-border)',
		'border-radius': 'var(--er-radius)',
		'font-family': 'var(--er-font)',
		'font-size': '14px',
		background: 'var(--er-bg)',
		color: 'var(--er-text)',
		width: '100%',
	};

	return (
		<>
			{!ready() && (
				<div
					style={{
						padding: '16px',
						color: 'var(--er-muted)',
						'font-family': 'var(--er-font)',
					}}
				>
					Loading…
				</div>
			)}
			{ready() && (
				<form
					data-component="taxes-search-form"
					data-framework="solid"
					onSubmit={handleSubmit}
					style={{
						background: 'var(--er-surface)',
						border: '1px solid var(--er-border)',
						'border-radius': 'var(--er-radius)',
						padding: '20px',
					}}
				>
					<div
						style={{
							display: 'grid',
							'grid-template-columns': 'repeat(auto-fill, minmax(180px, 1fr))',
							gap: '12px',
							'margin-bottom': '14px',
						}}
					>
						<div>
							<label
								style={{
									display: 'block',
									'font-size': '12px',
									'font-weight': '600',
									color: 'var(--er-muted)',
									'margin-bottom': '4px',
								}}
							>
								Last Name / Firm
							</label>
							<input
								type="text"
								value={lastFirm()}
								onInput={(e) => setLastFirm(e.currentTarget.value)}
								placeholder="e.g. ARMOK HOLDINGS"
								style={inp}
							/>
						</div>
						<div>
							<label
								style={{
									display: 'block',
									'font-size': '12px',
									'font-weight': '600',
									color: 'var(--er-muted)',
									'margin-bottom': '4px',
								}}
							>
								First Name
							</label>
							<input
								type="text"
								value={first()}
								onInput={(e) => setFirst(e.currentTarget.value)}
								style={inp}
							/>
						</div>
						<div>
							<label
								style={{
									display: 'block',
									'font-size': '12px',
									'font-weight': '600',
									color: 'var(--er-muted)',
									'margin-bottom': '4px',
								}}
							>
								Index Type
							</label>
							<select
								value={index()}
								onChange={(e) => setIndex(e.currentTarget.value)}
								style={inp}
							>
								{allIndexTypes.map((t) => (
									<option key={t} value={t}>
										{t === 'ALL'
											? 'All Types'
											: `${t} — ${indexLabels[t as keyof typeof indexLabels]}`}
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
								'border-radius': 'var(--er-radius)',
								padding: '8px 20px',
								'font-family': 'var(--er-font)',
								'font-size': '14px',
								'font-weight': '600',
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
								'border-radius': 'var(--er-radius)',
								padding: '8px 16px',
								'font-family': 'var(--er-font)',
								'font-size': '14px',
								cursor: 'pointer',
							}}
						>
							Clear
						</button>
					</div>
				</form>
			)}
		</>
	);
}
