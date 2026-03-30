// @qscrape L3 / solid island / news — author bio + related articles (article page)
// Anti-bot: author email drawn to <canvas> — not in DOM text
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import {
	type ArticleMeta,
	getArticleById,
	getByCategory,
	reporters,
} from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';

interface Props {
	articleId: string;
}

function EmailCanvas(props: { email: string }) {
	let canvas: HTMLCanvasElement | undefined;
	onMount(() => {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';
		ctx.fillStyle = 'var(--hn3-accent)';
		ctx.fillText(props.email, 0, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={220}
			height={18}
			style={{ display: 'inline-block' }}
			aria-label="email"
		/>
	);
}

export default function NewsAuthorBio(props: Props) {
	const [data, setData] = createSignal<{
		article: ArticleMeta;
		related: ArticleMeta[];
	} | null>(null);

	onMount(() => {
		const article = getArticleById(props.articleId);
		if (!article) {
			return;
		}
		const related = getByCategory(article.category)
			.filter((a) => a.id !== article.id)
			.slice(0, 3);
		fakeGetMs({ article, related }, 300, 200).then(setData);
	});

	return (
		<div data-island="solid-author-bio">
			<Show when={!data()}>
				<div class="hn3-bio-loading">Loading…</div>
			</Show>
			<Show when={data()}>
				{(() => {
					const d = data();
					if (!d) {
						return null;
					}
					const { article, related } = d;
					const reporter = reporters.find((r) => r.name === article.author);
					return (
						<>
							{reporter && (
								<div class="hn3-bio-card">
									<h3 class="hn3-bio-name">{reporter.name}</h3>
									<p class="hn3-bio-role">
										{reporter.title} · {reporter.beat}
									</p>
									<span class="hn3-bio-email">
										<EmailCanvas email={reporter.email} />
									</span>
								</div>
							)}
							{related.length > 0 && (
								<div class="hn3-related">
									<h3 class="hn3-related-title">
										More from {article.category}
									</h3>
									<ul class="hn3-related-list">
										<For each={related}>
											{(a) => (
												<li class="hn3-related-item" data-article-id={a.id}>
													<a
														href={`/l3/news/article/${a.id}/`}
														class="hn3-related-link"
													>
														{a.headline}
													</a>
													<span class="hn3-related-date">
														{a.published.slice(0, 10)}
													</span>
												</li>
											)}
										</For>
									</ul>
								</div>
							)}
						</>
					);
				})()}
			</Show>
			<style>{`
				.hn3-bio-loading {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--hn3-muted);
					font-family: var(--hn3-font-body);
					font-size: 14px;
				}
				.hn3-bio-card {
					background: var(--hn3-surface2);
					border: 1px solid var(--hn3-border);
					padding: 16px;
					margin-bottom: 20px;
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.hn3-bio-name {
					font-family: var(--hn3-font-display);
					font-size: 15px;
					font-weight: 700;
					color: var(--hn3-text);
					margin: 0;
					letter-spacing: -0.2px;
				}
				.hn3-bio-role {
					font-family: var(--hn3-font-body);
					font-size: 12px;
					color: var(--hn3-muted);
					margin: 0;
					font-style: italic;
				}
				.hn3-bio-email { display: block; }
				.hn3-related {}
				.hn3-related-title {
					font-family: var(--hn3-font-display);
					font-size: 15px;
					font-weight: 700;
					color: var(--hn3-text);
					margin: 0 0 12px;
					padding-bottom: 8px;
					border-bottom: 2px solid var(--hn3-accent);
					letter-spacing: -0.2px;
				}
				.hn3-related-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.hn3-related-item {
					display: flex;
					flex-direction: column;
					gap: 2px;
					padding: 10px 0;
					border-bottom: 1px solid var(--hn3-border);
				}
				.hn3-related-item:last-child { border-bottom: none; }
				.hn3-related-link {
					font-family: var(--hn3-font-display);
					font-size: 14px;
					font-weight: 600;
					color: var(--hn3-text);
					text-decoration: none;
					line-height: 1.35;
				}
				.hn3-related-link:hover { color: var(--hn3-accent); }
				.hn3-related-date {
					font-family: var(--hn3-font-body);
					font-size: 11px;
					color: var(--hn3-muted);
				}
			`}</style>
		</div>
	);
}
