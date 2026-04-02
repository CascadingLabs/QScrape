/**
 * @qscrape L2 / solid / news / island
 * @component NewsCategorySidebar
 */
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import { categories } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const allCats = ['All', ...categories];

function navigate(cat: string) {
	const url = new URL(window.location.href);
	url.searchParams.delete('id');
	if (cat === 'All') {
		url.searchParams.delete('cat');
	} else {
		url.searchParams.set('cat', cat);
	}
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('news:cat', { detail: cat === 'All' ? null : cat }),
	);
	window.scrollTo(0, 0);
}

export default function NewsCategorySidebar() {
	const [ready, setReady] = createSignal(false);
	const [activeCat, setActiveCat] = createSignal('All');

	onMount(() => {
		const cat = new URLSearchParams(window.location.search).get('cat');
		if (cat) {
			setActiveCat(cat);
		}
		fakeGet(null).then(() => setReady(true));

		const onCat = (e: Event) => {
			setActiveCat((e as CustomEvent<string | null>).detail ?? 'All');
		};
		const onPop = () => {
			const c = new URLSearchParams(window.location.search).get('cat');
			setActiveCat(c ?? 'All');
		};
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
					style={{ padding: '12px', color: '#888', 'font-family': 'system-ui' }}
				>
					Loading…
				</div>
			}
		>
			<div
				data-component="news-category-sidebar"
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
						Sections
					</h3>
				</div>
				<ul style={{ 'list-style': 'none' }}>
					<For each={allCats}>
						{(cat) => (
							<li>
								<button
									type="button"
									data-category={cat}
									onClick={() => {
										setActiveCat(cat);
										navigate(cat);
									}}
									style={{
										width: '100%',
										'text-align': 'left',
										background:
											activeCat() === cat ? 'var(--hn-accent)' : 'none',
										border: 'none',
										'border-bottom': '1px solid var(--hn-border)',
										padding: '9px 14px',
										cursor: 'pointer',
										'font-family': 'var(--hn-font-ui)',
										'font-size': '13px',
										color: activeCat() === cat ? '#fff' : 'var(--hn-text)',
									}}
								>
									{cat}
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
}
