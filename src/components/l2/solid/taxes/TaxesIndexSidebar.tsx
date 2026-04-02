/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesIndexSidebar
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { deeds, indexLabels, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const allIndexTypes = ['ALL', ...indexTypes];
const counts = Object.fromEntries(
	indexTypes.map((t) => [t, deeds.filter((d) => d.index === t).length]),
);

function getActiveIndex() {
	return new URLSearchParams(window.location.search).get('index') ?? 'ALL';
}

function dispatchSearch(ix: string) {
	const url = new URL(window.location.href);
	if (ix !== 'ALL') {
		url.searchParams.set('index', ix);
	} else {
		url.searchParams.delete('index');
	}
	url.searchParams.delete('lastFirm');
	url.searchParams.delete('first');
	url.searchParams.delete('file');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('taxes:search', {
			detail: { lastFirm: '', first: '', index: ix },
		}),
	);
}

export default function TaxesIndexSidebar() {
	const [ready, setReady] = createSignal(false);
	const [active, setActive] = createSignal('ALL');

	const onPop = () => setActive(getActiveIndex());
	const onSearch = (e: Event) =>
		setActive((e as CustomEvent<{ index: string }>).detail.index);

	onMount(() => {
		setActive(getActiveIndex());
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('taxes:search', onSearch);
	});

	return (
		<>
			<Show when={!ready()}>
				<div
					style={{
						padding: '12px',
						color: 'var(--er-muted)',
						'font-family': 'var(--er-font)',
					}}
				>
					Loading…
				</div>
			</Show>
			<Show when={ready()}>
				<div
					data-component="taxes-index-sidebar"
					data-framework="solid"
					style={{
						background: 'var(--er-surface)',
						border: '1px solid var(--er-border)',
						'border-radius': 'var(--er-radius)',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							background: 'var(--er-bg)',
							'border-bottom': '1px solid var(--er-border)',
							padding: '10px 14px',
							'font-size': '12px',
							'font-weight': '700',
							color: 'var(--er-muted)',
							'letter-spacing': '0.04em',
							'text-transform': 'uppercase',
							'font-family': 'var(--er-font)',
						}}
					>
						Index Type
					</div>
					<div style={{ padding: '8px' }}>
						<For each={allIndexTypes}>
							{(t) => (
								<button
									type="button"
									data-index={t}
									onClick={() => {
										setActive(t);
										dispatchSearch(t);
									}}
									style={{
										width: '100%',
										display: 'flex',
										'justify-content': 'space-between',
										'align-items': 'center',
										padding: '7px 10px',
										'border-radius': '3px',
										border: 'none',
										cursor: 'pointer',
										'font-family': 'var(--er-font)',
										'font-size': '13px',
										background:
											active() === t ? 'var(--er-primary)' : 'transparent',
										color: active() === t ? '#fff' : 'var(--er-text)',
										'margin-bottom': '2px',
										'text-align': 'left',
									}}
								>
									<span>
										{t === 'ALL'
											? 'All Types'
											: `${t} — ${indexLabels[t as keyof typeof indexLabels]}`}
									</span>
									<span
										style={{
											'font-size': '11px',
											opacity: '0.75',
											'flex-shrink': '0',
										}}
									>
										{t === 'ALL' ? deeds.length : counts[t]}
									</span>
								</button>
							)}
						</For>
					</div>
				</div>
			</Show>
		</>
	);
}
