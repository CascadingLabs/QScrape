import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { type DeedRecord, deeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l3/taxes.css';

function FileNumCanvas(props: { fileNum: string }) {
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
		ctx.font = '12px "IBM Plex Mono", monospace';
		ctx.fillStyle = 'var(--er3-primary)';
		ctx.fillText(props.fileNum, 0, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={120}
			height={18}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
			aria-label="file number"
		/>
	);
}

export default function TaxesSidebar() {
	const [recent, setRecent] = createSignal<DeedRecord[] | null>(null);

	onMount(() => {
		const sorted = [...deeds]
			.sort((a, b) => b.fileNum.localeCompare(a.fileNum))
			.slice(0, 5);
		fakeGetMs(sorted, 300, 200).then(setRecent);
	});

	return (
		<div data-island="solid-sidebar">
			<Show when={!recent()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={recent()}>
				<div class="b">
					<h3 class="c">Recent Filings</h3>
					<ul class="d">
						<For each={recent() ?? []}>
							{(deed) => (
								<li class="e" data-0={deed.fileNum}>
									<a href={`/l3/taxes/viewer/${deed.fileNum}/`} class="f">
										<span class="h">
											<FileNumCanvas fileNum={deed.fileNum} />
										</span>
										<span class="i">
											<span class="g">{deed.index}</span>
											<span class="j">{deed.recordDate}</span>
										</span>
									</a>
								</li>
							)}
						</For>
					</ul>
					<a href="/l3/taxes/" class="k">
						All records →
					</a>
				</div>
			</Show>
			<style>{`
				.a {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--er3-muted);
					font-family: var(--er3-font);
					font-size: 13px;
				}
				.b {
					background: var(--er3-surface);
					border: 1px solid var(--er3-border);
					border-radius: var(--er3-radius);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 12px;
				}
				.c {
					font-family: var(--er3-font);
					font-size: 14px;
					font-weight: 700;
					color: var(--er3-text);
					margin: 0;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--er3-primary);
					letter-spacing: -0.1px;
				}
				.d {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.e {
					border-bottom: 1px solid var(--er3-border);
				}
				.e:last-child {
					border-bottom: none;
				}
				.f {
					display: flex;
					flex-direction: column;
					gap: 3px;
					padding: 9px 0;
					text-decoration: none;
				}
				.f:hover .g {
					color: var(--er3-primary);
				}
				.h {
					display: block;
					line-height: 1;
				}
				.i {
					display: flex;
					gap: 8px;
					align-items: center;
				}
				.g {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					font-weight: 600;
					color: var(--er3-muted);
					text-transform: uppercase;
					letter-spacing: 0.04em;
				}
				.j {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					color: var(--er3-muted);
				}
				.k {
					font-family: var(--er3-font);
					font-size: 12px;
					font-weight: 600;
					color: var(--er3-primary);
					text-decoration: none;
					margin-top: 4px;
				}
				.k:hover {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
}
