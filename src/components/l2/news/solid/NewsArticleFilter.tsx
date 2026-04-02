/**
 * @qscrape L2 / solid / news / island
 * @component NewsArticleFilter
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { articles, categories } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

function getUrlCat() {
	return new URLSearchParams(window.location.search).get('cat');
}

export default function NewsArticleFilter() {
	const [ready, setReady] = createSignal(false);
	const [active, setActive] = createSignal<string | null>(null);
	const allCats = [null, ...categories] as (string | null)[];

	function pickCat(cat: string | null) {
		const url = new URL(window.location.href);
		if (cat) {
			url.searchParams.set('cat', cat);
		} else {
			url.searchParams.delete('cat');
		}
		url.searchParams.delete('page');
		history.pushState(null, '', url.toString());
		window.dispatchEvent(new CustomEvent('news:cat', { detail: cat }));
	}

	onMount(() => {
		setActive(getUrlCat());
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) =>
			setActive((e as CustomEvent<string | null>).detail);
		const onPop = () => setActive(getUrlCat());
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
					style={{
						padding: '12px 24px',
						color: '#888',
						'font-family': 'system-ui',
					}}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="news-article-filter"
				data-framework="solid"
				style={{
					padding: '12px 0',
					'border-bottom': '2px solid var(--hn-border)',
					'margin-bottom': '4px',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '4px',
						'flex-wrap': 'wrap',
						'max-width': '1200px',
						margin: '0 auto',
						padding: '0 24px',
					}}
				>
					<For each={allCats}>
						{(cat) => {
							const count = cat
								? articles.filter((a) => a.category === cat).length
								: articles.length;
							return (
								<button
									type="button"
									data-category={cat ?? 'all'}
									data-count={count}
									onClick={() => pickCat(cat)}
									style={{
										padding: '5px 12px',
										border: `1px solid ${active() === cat ? 'var(--hn-accent)' : 'var(--hn-border)'}`,
										'border-radius': 'var(--hn-radius)',
										background:
											active() === cat ? 'var(--hn-accent)' : 'transparent',
										color: active() === cat ? '#fff' : 'var(--hn-text)',
										cursor: 'pointer',
										'font-family': 'var(--hn-font-ui)',
										'font-size': '13px',
										'font-weight': active() === cat ? '600' : '400',
									}}
								>
									{cat ?? 'All'}{' '}
									<span style={{ opacity: '0.65', 'font-size': '11px' }}>
										({count})
									</span>
								</button>
							);
						}}
					</For>
				</div>
			</div>
		</Show>
	);
}
