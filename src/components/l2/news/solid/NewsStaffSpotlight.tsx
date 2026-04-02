/**
 * @qscrape L2 / solid / news / island
 * @component NewsStaffSpotlight
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { reporters } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

export default function NewsStaffSpotlight() {
	const [ready, setReady] = createSignal(false);

	onMount(() => {
		fakeGet(null).then(() => setReady(true));
	});

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{ padding: '12px', color: '#888', 'font-family': 'system-ui' }}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="news-staff-spotlight"
				data-framework="solid"
				style={{
					border: '1px solid var(--hn-border)',
					'border-radius': 'var(--hn-radius)',
					overflow: 'hidden',
					background: 'var(--hn-surface)',
				}}
			>
				<div
					style={{ background: 'var(--hn-masthead-bg)', padding: '10px 14px' }}
				>
					<h3
						style={{
							'font-family': 'var(--hn-font-display)',
							'font-size': '12px',
							'font-weight': '700',
							color: 'var(--hn-masthead-text)',
							'text-transform': 'uppercase',
							'letter-spacing': '0.08em',
						}}
					>
						Our Staff
					</h3>
				</div>
				<ul style={{ 'list-style': 'none' }}>
					<For each={reporters}>
						{(r) => (
							<li
								data-reporter={r.name}
								data-beat={r.beat}
								style={{
									padding: '10px 14px',
									'border-bottom': '1px solid var(--hn-border)',
								}}
							>
								<div
									style={{
										'font-family': 'var(--hn-font-display)',
										'font-size': '13px',
										'font-weight': '600',
										color: 'var(--hn-text)',
									}}
								>
									{r.name}
								</div>
								<div
									style={{
										'font-size': '11px',
										color: 'var(--hn-muted)',
										'font-family': 'var(--hn-font-ui)',
										'margin-top': '2px',
									}}
								>
									{r.title}
								</div>
								<div
									style={{
										'font-size': '11px',
										color: 'var(--hn-accent)',
										'font-family': 'var(--hn-font-ui)',
										'margin-top': '1px',
									}}
								>
									{r.beat}
								</div>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
}
