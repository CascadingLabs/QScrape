/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesHowToInfo
 */
import { createSignal, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

export default function TaxesHowToInfo() {
	const [ready, setReady] = createSignal(false);
	onMount(() => {
		fakeGet(null).then(() => setReady(true));
	});
	return (
		<>
			<Show when={!ready()}>
				<div
					style={{
						padding: '16px',
						color: 'var(--er-muted)',
						'font-family': 'var(--er-font)',
					}}
				>
					Loading…
				</div>
			</Show>
			<Show when={ready()}>
				<div
					data-component="taxes-how-to-info"
					data-framework="solid"
					style={{ display: 'flex', 'flex-direction': 'column', gap: '16px' }}
				>
					<div
						style={{
							background: 'var(--er-surface)',
							border: '1px solid var(--er-border)',
							'border-radius': 'var(--er-radius)',
							overflow: 'hidden',
							'font-family': 'var(--er-font)',
						}}
					>
						<div
							style={{
								background: 'var(--er-bg)',
								'border-bottom': '1px solid var(--er-border)',
								padding: '10px 14px',
								'font-size': '11px',
								'font-weight': '700',
								color: 'var(--er-muted)',
								'text-transform': 'uppercase',
								'letter-spacing': '0.04em',
							}}
						>
							About These Guides
						</div>
						<p
							style={{
								'font-size': '13px',
								color: 'var(--er-text)',
								'line-height': '1.6',
								padding: '14px 14px 6px',
							}}
						>
							Official guides for property owners, attorneys, contractors, and
							clan representatives. Each guide covers purpose, required
							elements, filing process, and common pitfalls.
						</p>
						<p
							style={{
								'font-size': '13px',
								color: 'var(--er-muted)',
								padding: '0 14px 14px',
							}}
						>
							For the fee schedule see{' '}
							<a
								href="/l2/taxes/recording-fees/"
								style={{ color: 'var(--er-primary)' }}
							>
								Recording Fees
							</a>
							.
						</p>
					</div>
					<div
						style={{
							background: 'var(--er-surface)',
							border: '1px solid var(--er-border)',
							'border-radius': 'var(--er-radius)',
							overflow: 'hidden',
							'font-family': 'var(--er-font)',
						}}
					>
						<div
							style={{
								background: 'var(--er-bg)',
								'border-bottom': '1px solid var(--er-border)',
								padding: '10px 14px',
								'font-size': '11px',
								'font-weight': '700',
								color: 'var(--er-muted)',
								'text-transform': 'uppercase',
								'letter-spacing': '0.04em',
							}}
						>
							Public Counter
						</div>
						<div
							style={{
								padding: '14px',
								'font-size': '13px',
								color: 'var(--er-text)',
								'line-height': '1.8',
							}}
						>
							<div data-field="address">
								Hall of Records, Level Z-1, Room 14
							</div>
							<div>Mountainhome Civic Quarter</div>
							<div data-field="phone">Rune-Wire: (555) 234-5678</div>
							<div data-field="hours">Hours: M–F 8:30AM–5:00PM</div>
							<div data-field="email">
								<a
									href="mailto:rod@eldoria.gov"
									style={{ color: 'var(--er-primary)' }}
								>
									rod@eldoria.gov
								</a>
							</div>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
}
