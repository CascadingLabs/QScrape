/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesRecentRecords
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { deeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const recent = deeds.slice(0, 8);

function goToRecord(fileNum: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('file', fileNum);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
	window.scrollTo(0, 0);
}

export default function TaxesRecentRecords() {
	const [ready, setReady] = createSignal(false);

	onMount(() => {
		fakeGet(null).then(() => setReady(true));
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
					data-component="taxes-recent-records"
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
						Recent Filings
					</div>
					<div style={{ padding: '8px' }}>
						<For each={recent}>
							{(d) => (
								<button
									type="button"
									data-file-num={d.fileNum}
									onClick={() => goToRecord(d.fileNum)}
									style={{
										width: '100%',
										'text-align': 'left',
										padding: '8px 10px',
										'border-radius': '3px',
										border: 'none',
										background: 'transparent',
										cursor: 'pointer',
										'font-family': 'var(--er-font)',
										'margin-bottom': '2px',
										display: 'block',
									}}
								>
									<div
										style={{
											'font-size': '12px',
											'font-family': 'monospace',
											'font-weight': '600',
											color: 'var(--er-primary)',
											'margin-bottom': '2px',
										}}
									>
										{d.fileNum}
									</div>
									<div
										style={{
											'font-size': '12px',
											color: 'var(--er-text)',
											overflow: 'hidden',
											'text-overflow': 'ellipsis',
											'white-space': 'nowrap',
										}}
									>
										<span
											style={{
												background: 'var(--er-bg)',
												border: '1px solid var(--er-border)',
												'border-radius': '2px',
												padding: '0 4px',
												'font-size': '10px',
												'font-weight': '700',
												'margin-right': '5px',
											}}
										>
											{d.index}
										</span>
										{d.lastFirm}
									</div>
									<div
										style={{
											'font-size': '11px',
											color: 'var(--er-muted)',
											'margin-top': '2px',
										}}
									>
										{d.recordDate}
									</div>
								</button>
							)}
						</For>
					</div>
				</div>
			</Show>
		</>
	);
}
