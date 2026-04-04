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
		<div>
			<Show when={!data()}>
				<div class="a">Loading…</div>
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
								<div class="b">
									<h3 class="c">{reporter.name}</h3>
									<p class="d">
										{reporter.title} · {reporter.beat}
									</p>
									<span class="e">
										<EmailCanvas email={reporter.email} />
									</span>
								</div>
							)}
							{related.length > 0 && (
								<div class="f">
									<h3 class="g">More from {article.category}</h3>
									<ul class="h">
										<For each={related}>
											{(a) => (
												<li class="i" data-0={a.id}>
													<a href={`/l3/news/article/${a.id}/`} class="j">
														{a.headline}
													</a>
													<span class="k">{a.published.slice(0, 10)}</span>
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
				.a {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--hn3-muted);
					font-family: var(--hn3-font-body);
					font-size: 14px;
				}
				.b {
					background: var(--hn3-surface2);
					border: 1px solid var(--hn3-border);
					padding: 16px;
					margin-bottom: 20px;
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.c {
					font-family: var(--hn3-font-display);
					font-size: 15px;
					font-weight: 700;
					color: var(--hn3-text);
					margin: 0;
					letter-spacing: -0.2px;
				}
				.d {
					font-family: var(--hn3-font-body);
					font-size: 12px;
					color: var(--hn3-muted);
					margin: 0;
					font-style: italic;
				}
				.e { display: block; }
				.f {}
				.g {
					font-family: var(--hn3-font-display);
					font-size: 15px;
					font-weight: 700;
					color: var(--hn3-text);
					margin: 0 0 12px;
					padding-bottom: 8px;
					border-bottom: 2px solid var(--hn3-accent);
					letter-spacing: -0.2px;
				}
				.h {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.i {
					display: flex;
					flex-direction: column;
					gap: 2px;
					padding: 10px 0;
					border-bottom: 1px solid var(--hn3-border);
				}
				.i:last-child { border-bottom: none; }
				.j {
					font-family: var(--hn3-font-display);
					font-size: 14px;
					font-weight: 600;
					color: var(--hn3-text);
					text-decoration: none;
					line-height: 1.35;
				}
				.j:hover { color: var(--hn3-accent); }
				.k {
					font-family: var(--hn3-font-body);
					font-size: 11px;
					color: var(--hn3-muted);
				}
			`}</style>
		</div>
	);
}
