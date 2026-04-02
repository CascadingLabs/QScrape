/**
 * @qscrape L2 / solid / news / island
 * @component NewsArticleTagCloud
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { articles } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

const tagCounts: Record<string, number> = {};
for (const a of articles) {
	for (const t of a.tags) {
		tagCounts[t] = (tagCounts[t] ?? 0) + 1;
	}
}
const allTags = Object.entries(tagCounts)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 30);
const maxCount = allTags[0]?.[1] ?? 1;
function tagSize(count: number) {
	return 11 + Math.round((count / maxCount) * 6);
}

export default function NewsArticleTagCloud() {
	const [ready, setReady] = createSignal(false);
	const [activeCat, setActiveCat] = createSignal<string | null>(null);

	onMount(() => {
		setActiveCat(getUrlCat());
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) =>
			setActiveCat((e as CustomEvent<string | null>).detail);
		const onPop = () => setActiveCat(getUrlCat());
		window.addEventListener('news:cat', onCat);
		window.addEventListener('popstate', onPop);
		onCleanup(() => {
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('popstate', onPop);
		});
	});

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{ padding: '24px', color: '#888', 'font-family': 'system-ui' }}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="news-article-tagcloud"
				data-framework="solid"
				style={{
					background: 'var(--hn-surface)',
					border: '1px solid var(--hn-border)',
					'border-radius': 'var(--hn-radius)',
					padding: '16px',
				}}
			>
				<h3
					style={{
						'font-family': 'var(--hn-font-display)',
						'font-size': '14px',
						'font-weight': '700',
						'margin-bottom': '12px',
						color: 'var(--hn-text)',
						'text-transform': 'uppercase',
						'letter-spacing': '0.06em',
					}}
				>
					Topics
				</h3>
				<div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: '6px' }}>
					<For each={allTags}>
						{([tag, count]) => (
							<span
								data-tag={tag}
								data-count={count}
								style={{
									'font-size': `${tagSize(count)}px`,
									color: 'var(--hn-accent)',
									cursor: 'default',
									'font-family': 'var(--hn-font-ui)',
								}}
							>
								{tag}{' '}
								<span style={{ 'font-size': '10px', color: 'var(--hn-muted)' }}>
									({count})
								</span>
							</span>
						)}
					</For>
				</div>
				<Show when={activeCat()}>
					<div
						style={{
							'margin-top': '16px',
							'padding-top': '12px',
							'border-top': '1px solid var(--hn-border)',
							'font-size': '12px',
							color: 'var(--hn-muted)',
							'font-family': 'var(--hn-font-ui)',
						}}
					>
						Filtered: <strong>{activeCat()}</strong>
					</div>
				</Show>
			</div>
		</Show>
	);
}
