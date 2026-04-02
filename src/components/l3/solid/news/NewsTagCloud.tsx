import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { articles } from '../../../../data/news/articles';
import '../../../../styles/l3/news.css';

function TagCanvas(props: { tag: string }) {
	let canvas: HTMLCanvasElement | undefined;
	const width = Math.max(60, props.tag.length * 8 + 16);
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
		ctx.fillStyle = 'var(--hn3-text)';
		ctx.fillText(props.tag, 4, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={width}
			height={20}
			style={{ display: 'inline-block' }}
		/>
	);
}

export default function NewsTagCloud() {
	const [tags, setTags] = createSignal<string[] | null>(null);

	onMount(() => {
		const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort();
		fakeGetMs(allTags, 300, 200).then(setTags);
	});

	return (
		<div>
			<Show when={!tags()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={tags()}>
				<div class="b">
					<h3 class="c">Tags</h3>
					<div class="d">
						<For each={tags() ?? []}>
							{(tag) => (
								<a
									href={`/l3/news/articles/?cat=${encodeURIComponent(tag)}`}
									class="e"
								>
									<TagCanvas tag={tag} />
								</a>
							)}
						</For>
					</div>
				</div>
			</Show>
			<style>{`
				.a {
					min-height: 60px;
					display: flex;
					align-items: center;
					color: var(--hn3-muted);
					font-family: var(--hn3-font-body);
					font-size: 14px;
				}
				.b {
					display: flex;
					flex-direction: column;
					gap: 12px;
				}
				.c {
					font-family: var(--hn3-font-body);
					font-size: 11px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.1em;
					color: var(--hn3-muted);
					margin: 0;
				}
				.d {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
				}
				.e {
					display: inline-flex;
					align-items: center;
					background: var(--hn3-surface2);
					border: 1px solid var(--hn3-border);
					border-radius: 2px;
					padding: 3px 6px;
					text-decoration: none;
					transition: border-color 0.15s;
				}
				.e:hover {
					border-color: var(--hn3-accent);
				}
			`}</style>
		</div>
	);
}
