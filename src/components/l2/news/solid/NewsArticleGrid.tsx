/**
 * @qscrape L2 / solid / news / island
 * @component NewsArticleGrid
 */
import {
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from 'solid-js';
import { fakeGet } from '../../../../data/api';
import {
	articles,
	formatDate,
	getByCategory,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const PER_PAGE = 8;

function getUrlState() {
	return { cat: new URLSearchParams(window.location.search).get('cat') };
}

export default function NewsArticleGrid() {
	const [ready, setReady] = createSignal(false);
	const [cat, setCat] = createSignal<string | null>(null);
	const [visibleCount, setVisibleCount] = createSignal(PER_PAGE);
	const all = createMemo(() => (cat() ? getByCategory(cat()!) : articles));
	const items = createMemo(() => all().slice(0, visibleCount()));

	onMount(() => {
		setCat(getUrlState().cat);
		fakeGet(null).then(() => setReady(true));
		const onCat = (e: Event) => {
			setCat((e as CustomEvent<string | null>).detail);
			setVisibleCount(PER_PAGE);
		};
		const onPop = () => {
			setCat(getUrlState().cat);
			setVisibleCount(PER_PAGE);
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
					style={{
						padding: '40px 24px',
						color: '#888',
						'font-family': 'system-ui',
					}}
				>
					Loading…
				</div>
			}
		>
			<div data-component="news-article-grid" data-framework="solid">
				<div
					style={{
						'margin-bottom': '12px',
						'font-size': '13px',
						color: 'var(--hn-muted)',
						'font-family': 'var(--hn-font-ui)',
					}}
				>
					{all().length} article{all().length !== 1 ? 's' : ''}
					{cat() ? ` in ${cat()}` : ''}
				</div>
				<div
					style={{
						display: 'grid',
						'grid-template-columns': 'repeat(auto-fill,minmax(280px,1fr))',
						gap: '20px',
					}}
				>
					<For each={items()}>
						{(a) => (
							<article
								data-article-id={a.id}
								data-category={a.category}
								style={{
									border: '1px solid var(--hn-border)',
									'border-radius': 'var(--hn-radius)',
									overflow: 'hidden',
									background: 'var(--hn-surface)',
									cursor: 'pointer',
								}}
								onClick={() => {
									window.location.href = `/l2/news/?id=${a.id}`;
								}}
							>
								<img
									src={a.image}
									alt={a.imageCaption}
									width="280"
									height="160"
									loading="lazy"
									style={{
										width: '100%',
										height: '140px',
										'object-fit': 'cover',
										display: 'block',
									}}
								/>
								<div style={{ padding: '12px' }}>
									<div
										style={{
											'font-size': '10px',
											'font-weight': '700',
											color: 'var(--hn-accent)',
											'text-transform': 'uppercase',
											'letter-spacing': '0.08em',
											'margin-bottom': '4px',
										}}
										data-category={a.category}
									>
										{a.category}
									</div>
									<h3
										style={{
											'font-family': 'var(--hn-font-display)',
											'font-size': '15px',
											'font-weight': '600',
											color: 'var(--hn-text)',
											'line-height': '1.3',
											'margin-bottom': '6px',
										}}
									>
										{a.headline}
									</h3>
									<div
										style={{
											'font-size': '12px',
											color: 'var(--hn-muted)',
											'font-family': 'var(--hn-font-ui)',
										}}
									>
										{a.author} · {formatDate(a.published)}
									</div>
								</div>
							</article>
						)}
					</For>
				</div>
				<Show when={visibleCount() < all().length}>
					<div style={{ 'text-align': 'center', 'margin-top': '24px' }}>
						<button
							type="button"
							onClick={() => setVisibleCount((c) => c + PER_PAGE)}
							style={{
								padding: '8px 20px',
								border: '1px solid var(--hn-border)',
								'border-radius': 'var(--hn-radius)',
								background: 'transparent',
								color: 'var(--hn-accent)',
								cursor: 'pointer',
								'font-family': 'var(--hn-font-ui)',
								'font-size': '13px',
							}}
						>
							Load more ({all().length - visibleCount()} remaining)
						</button>
					</div>
				</Show>
			</div>
		</Show>
	);
}
