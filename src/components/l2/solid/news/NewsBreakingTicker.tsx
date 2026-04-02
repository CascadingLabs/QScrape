/**
 * @qscrape L2 / solid / news / island
 * @component NewsBreakingTicker
 */
import { createSignal, For, onMount, Show } from 'solid-js';
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
			<div data-component="news-breaking-ticker" data-framework="solid">
				<Show when={breaking.length > 0}>
					<div
						style={{
							background: 'var(--hn-accent)',
							padding: '8px 20px',
							display: 'flex',
							gap: '12px',
							'align-items': 'center',
							'flex-wrap': 'wrap',
						}}
					>
						<span
							style={{
								'font-size': '11px',
								'font-weight': '700',
								color: '#fff',
								'text-transform': 'uppercase',
								'letter-spacing': '0.08em',
								'flex-shrink': '0',
							}}
						>
							Breaking
						</span>
						<For each={breaking}>
							{(a, i) => (
								<span>
									<Show when={i() > 0}>
										<span
											style={{
												color: 'rgba(255,255,255,0.5)',
												margin: '0 4px',
											}}
										>
											·
										</span>
									</Show>
									<button
										type="button"
										onClick={() => goToArticle(a.id)}
										style={{
											background: 'none',
											border: 'none',
											color: '#fff',
											cursor: 'pointer',
											'font-family': 'var(--hn-font-ui)',
											'font-size': '13px',
											padding: '0',
										}}
									>
										{a.headline}
									</button>
								</span>
							)}
						</For>
					</div>
				</Show>
				<div style={{ padding: '16px 20px' }}>
					<h3
						style={{
							'font-family': 'var(--hn-font-display)',
							'font-size': '12px',
							'font-weight': '700',
							'text-transform': 'uppercase',
							'letter-spacing': '0.06em',
							color: 'var(--hn-muted)',
							'margin-bottom': '12px',
							'border-bottom': '1px solid var(--hn-border)',
							'padding-bottom': '8px',
						}}
					>
						Top Headlines
					</h3>
					<ul
						style={{
							'list-style': 'none',
							display: 'flex',
							'flex-direction': 'column',
							gap: '12px',
						}}
					>
						<For each={topHeadlines}>
							{(a) => (
								<li data-article-id={a.id}>
									<button
										type="button"
										onClick={() => goToArticle(a.id)}
										style={{
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											'text-align': 'left',
											'font-family': 'var(--hn-font-display)',
											'font-size': '14px',
											'font-weight': '600',
											color: 'var(--hn-text)',
											'line-height': '1.35',
											padding: '0',
											width: '100%',
										}}
									>
										{a.headline}
									</button>
									<div
										style={{
											'font-size': '12px',
											color: 'var(--hn-muted)',
											'margin-top': '4px',
											'font-family': 'var(--hn-font-ui)',
										}}
									>
										<span data-category={a.category}>{a.category}</span>
										{' · '}
										<span>{formatDate(a.published)}</span>
									</div>
								</li>
							)}
						</For>
					</ul>
				</div>
			</div>
		</Show>
	);
}
