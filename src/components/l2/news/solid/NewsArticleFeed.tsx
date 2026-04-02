/**
 * @qscrape L2 / solid / news / island
 * @component NewsArticleFeed
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
	formatDateTime,
	getByCategory,
} from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const PER_PAGE = 6;

function getUrlState() {
	const p = new URLSearchParams(window.location.search);
	return { id: p.get('id'), cat: p.get('cat') };
}

function goToArticle(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('id', id);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
	window.scrollTo(0, 0);
}

function ArticleDetail(props: { id: string }) {
	const a = articles.find((x) => x.id === props.id);
	if (!a) {
		return (
			<div style={{ padding: '24px', color: 'var(--hn-muted)' }}>
				Article not found.
			</div>
		);
	}
	return (
		<div
			data-component="news-article-detail"
			data-article-id={a.id}
			style={{ padding: '0 0 32px' }}
		>
			<button
				type="button"
				onClick={() => history.back()}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--hn-accent)',
					cursor: 'pointer',
					'font-family': 'var(--hn-font-ui)',
					'font-size': '13px',
					padding: '0',
					'margin-bottom': '20px',
					display: 'block',
				}}
			>
				← Back to articles
			</button>
			<div
				style={{
					'font-size': '11px',
					'font-weight': '700',
					color: 'var(--hn-accent)',
					'text-transform': 'uppercase',
					'letter-spacing': '0.08em',
					'margin-bottom': '8px',
				}}
				data-category={a.category}
			>
				{a.category}
			</div>
			<Show when={a.breaking}>
				<span
					style={{
						'font-size': '10px',
						'font-weight': '700',
						background: 'var(--hn-accent)',
						color: '#fff',
						padding: '2px 6px',
						'border-radius': 'var(--hn-radius)',
						'margin-bottom': '8px',
						display: 'inline-block',
					}}
				>
					BREAKING
				</span>
			</Show>
			<h1
				style={{
					'font-family': 'var(--hn-font-display)',
					'font-size': '28px',
					'font-weight': '700',
					color: 'var(--hn-text)',
					'line-height': '1.2',
					'margin-bottom': '12px',
				}}
			>
				{a.headline}
			</h1>
			<div
				style={{
					display: 'flex',
					gap: '12px',
					'flex-wrap': 'wrap',
					'font-size': '13px',
					color: 'var(--hn-muted)',
					'margin-bottom': '20px',
					'font-family': 'var(--hn-font-ui)',
					'border-bottom': '1px solid var(--hn-border)',
					'padding-bottom': '16px',
				}}
			>
				<span data-author={a.author}>{a.author}</span>
				<span>{a.byline}</span>
				<time datetime={a.published}>{formatDateTime(a.published)}</time>
			</div>
			<figure style={{ 'margin-bottom': '24px' }}>
				<img
					src={a.image}
					alt={a.imageCaption}
					width="680"
					height="380"
					style={{ width: '100%', 'border-radius': 'var(--hn-radius)' }}
				/>
				<figcaption
					style={{
						'font-size': '12px',
						color: 'var(--hn-muted)',
						'margin-top': '8px',
						'font-family': 'var(--hn-font-ui)',
					}}
				>
					{a.imageCaption} <em>{a.imageCredit}</em>
				</figcaption>
			</figure>
			<p
				style={{
					'font-family': 'var(--hn-font-body)',
					'font-size': '17px',
					'line-height': '1.7',
					color: 'var(--hn-text)',
					'margin-bottom': '16px',
				}}
			>
				{a.excerpt}
			</p>
			<p
				style={{
					'font-family': 'var(--hn-font-body)',
					'font-size': '16px',
					'line-height': '1.7',
					color: 'var(--hn-text)',
					'margin-bottom': '16px',
				}}
			>
				The Mountainhome Herald continues to follow developments related to this
				story. This report will be updated as additional information becomes
				available from official sources and correspondents in the field.
			</p>
			<Show when={a.tags.length > 0}>
				<div
					style={{
						display: 'flex',
						gap: '6px',
						'flex-wrap': 'wrap',
						'margin-top': '24px',
						'padding-top': '16px',
						'border-top': '1px solid var(--hn-border)',
					}}
				>
					<For each={a.tags}>
						{(tag) => (
							<span
								style={{
									'font-size': '11px',
									padding: '3px 8px',
									border: '1px solid var(--hn-border)',
									'border-radius': 'var(--hn-radius)',
									color: 'var(--hn-muted)',
									'font-family': 'var(--hn-font-ui)',
								}}
							>
								{tag}
							</span>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}

export default function NewsArticleFeed() {
	const [ready, setReady] = createSignal(false);
	const [view, setView] = createSignal<'list' | 'detail'>('list');
	const [currentId, setCurrentId] = createSignal<string | null>(null);
	const [cat, setCat] = createSignal<string | null>(null);
	const [visibleCount, setVisibleCount] = createSignal(PER_PAGE);

	const allFiltered = createMemo(() =>
		cat() ? getByCategory(cat()!) : articles,
	);
	const items = createMemo(() => allFiltered().slice(0, visibleCount()));

	onMount(() => {
		const { id, cat: urlCat } = getUrlState();
		if (id) {
			setView('detail');
			setCurrentId(id);
		}
		setCat(urlCat);
		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const { id: i, cat: c } = getUrlState();
			if (i) {
				setView('detail');
				setCurrentId(i);
			} else {
				setView('list');
				setCat(c);
				setVisibleCount(PER_PAGE);
			}
		};
		const onCat = (e: Event) => {
			setCat((e as CustomEvent<string | null>).detail);
			setView('list');
			setVisibleCount(PER_PAGE);
		};
		const onArticle = (e: Event) => {
			setCurrentId((e as CustomEvent<string>).detail);
			setView('detail');
		};
		window.addEventListener('popstate', onPop);
		window.addEventListener('news:cat', onCat);
		window.addEventListener('news:article', onArticle);
		onCleanup(() => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('news:cat', onCat);
			window.removeEventListener('news:article', onArticle);
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
			<Show
				when={view() === 'detail' && currentId()}
				fallback={
					<div data-component="news-article-feed" data-framework="solid">
						<div
							style={{
								'margin-bottom': '16px',
								'font-size': '13px',
								color: 'var(--hn-muted)',
								'font-family': 'var(--hn-font-ui)',
							}}
						>
							{allFiltered().length} article
							{allFiltered().length !== 1 ? 's' : ''}
							{cat() ? ` in ${cat()}` : ''}
						</div>
						<div
							style={{
								display: 'flex',
								'flex-direction': 'column',
								gap: '20px',
							}}
						>
							<For each={items()}>
								{(a) => (
									<article
										data-article-id={a.id}
										data-category={a.category}
										style={{
											display: 'flex',
											gap: '16px',
											cursor: 'pointer',
											'padding-bottom': '20px',
											'border-bottom': '1px solid var(--hn-border)',
										}}
										onClick={() => goToArticle(a.id)}
									>
										<img
											src={a.image}
											alt={a.imageCaption}
											width="160"
											height="100"
											loading="lazy"
											style={{
												width: '140px',
												height: '90px',
												'object-fit': 'cover',
												'border-radius': 'var(--hn-radius)',
												'flex-shrink': '0',
											}}
										/>
										<div>
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
													'font-size': '16px',
													'font-weight': '600',
													color: 'var(--hn-text)',
													'line-height': '1.3',
													'margin-bottom': '6px',
												}}
											>
												{a.headline}
											</h3>
											<p
												style={{
													'font-size': '13px',
													color: 'var(--hn-muted)',
													'line-height': '1.5',
													'font-family': 'var(--hn-font-body)',
													'margin-bottom': '6px',
												}}
											>
												{a.excerpt}
											</p>
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
						<Show when={visibleCount() < allFiltered().length}>
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
									Load more ({allFiltered().length - visibleCount()} remaining)
								</button>
							</div>
						</Show>
					</div>
				}
			>
				<ArticleDetail id={currentId()!} />
			</Show>
		</Show>
	);
}
