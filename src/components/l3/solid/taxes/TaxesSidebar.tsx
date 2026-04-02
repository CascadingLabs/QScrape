// @qscrape L3 / solid island / taxes — recent deeds sidebar
// Anti-bot: file numbers drawn to <canvas> — not present in DOM text at all
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
		<div>
			<Show when={!recent()}>
				<div class="er3-sidebar-loading">Loading…</div>
			</Show>
			<Show when={recent()}>
				<div class="er3-sidebar-panel">
					<h3 class="er3-sidebar-title">Recent Filings</h3>
					<ul class="er3-sidebar-list">
						<For each={recent() ?? []}>
							{(deed) => (
								<li class="er3-sidebar-item" data-file-num={deed.fileNum}>
									<a
										href={`/l3/taxes/viewer/${deed.fileNum}/`}
										class="er3-sidebar-link"
									>
										<span class="er3-sidebar-filenum">
											<FileNumCanvas fileNum={deed.fileNum} />
										</span>
										<span class="er3-sidebar-meta">
											<span class="er3-sidebar-index">{deed.index}</span>
											<span class="er3-sidebar-date">{deed.recordDate}</span>
										</span>
									</a>
								</li>
							)}
						</For>
					</ul>
					<a href="/l3/taxes/" class="er3-sidebar-all">
						All records →
					</a>
				</div>
			</Show>
			<style>{`
				.er3-sidebar-loading {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--er3-muted);
					font-family: var(--er3-font);
					font-size: 13px;
				}
				.er3-sidebar-panel {
					background: var(--er3-surface);
					border: 1px solid var(--er3-border);
					border-radius: var(--er3-radius);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 12px;
				}
				.er3-sidebar-title {
					font-family: var(--er3-font);
					font-size: 14px;
					font-weight: 700;
					color: var(--er3-text);
					margin: 0;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--er3-primary);
					letter-spacing: -0.1px;
				}
				.er3-sidebar-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.er3-sidebar-item {
					border-bottom: 1px solid var(--er3-border);
				}
				.er3-sidebar-item:last-child {
					border-bottom: none;
				}
				.er3-sidebar-link {
					display: flex;
					flex-direction: column;
					gap: 3px;
					padding: 9px 0;
					text-decoration: none;
				}
				.er3-sidebar-link:hover .er3-sidebar-index {
					color: var(--er3-primary);
				}
				.er3-sidebar-filenum {
					display: block;
					line-height: 1;
				}
				.er3-sidebar-meta {
					display: flex;
					gap: 8px;
					align-items: center;
				}
				.er3-sidebar-index {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					font-weight: 600;
					color: var(--er3-muted);
					text-transform: uppercase;
					letter-spacing: 0.04em;
				}
				.er3-sidebar-date {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					color: var(--er3-muted);
				}
				.er3-sidebar-all {
					font-family: var(--er3-font);
					font-size: 12px;
					font-weight: 600;
					color: var(--er3-primary);
					text-decoration: none;
					margin-top: 4px;
				}
				.er3-sidebar-all:hover {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
}
