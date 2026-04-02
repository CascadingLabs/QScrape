// @qscrape L3 / solid island / scoretap — ranked standings table
// Anti-bot: rank numbers and point totals drawn via ctx.fillText() to canvas — not in DOM text
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { cs2Rankings } from '../../../../data/scoretap/data';
import '../../../../styles/l3/scoretap.css';

type RankRow = (typeof cs2Rankings)[number];

function RankCanvas(props: { value: number | string; width?: number }) {
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
		ctx.font = '600 13px "Roboto Mono", monospace';
		ctx.fillStyle = '#eaeef5';
		ctx.fillText(String(props.value), 2, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={props.width ?? 52}
			height={18}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

export default function ScoretapStandings() {
	const [rows, setRows] = createSignal<RankRow[] | null>(null);

	onMount(() => {
		fakeGetMs(cs2Rankings, 300, 200).then(setRows);
	});

	return (
		<div>
			<Show when={!rows()}>
				<div class="st3-stand-loading">Loading…</div>
			</Show>
			<Show when={rows()}>
				<div class="st3-stand-panel">
					<h3 class="st3-stand-title">CS2 World Rankings</h3>
					<table class="st3-stand-table">
						<thead>
							<tr>
								<th class="st3-stand-th st3-th-rank">#</th>
								<th class="st3-stand-th st3-th-team">Team</th>
								<th class="st3-stand-th st3-th-chg">±</th>
								<th class="st3-stand-th st3-th-pts">Points</th>
							</tr>
						</thead>
						<tbody>
							<For each={rows() ?? []}>
								{(row) => (
									<tr class="st3-stand-row" data-team={row.team}>
										<td class="st3-stand-td st3-td-rank">
											<RankCanvas value={row.rank} width={24} />
										</td>
										<td class="st3-stand-td st3-td-team">{row.team}</td>
										<td class="st3-stand-td st3-td-chg">
											{row.change === 'up' && (
												<span class="st3-chg-up">▲{row.delta}</span>
											)}
											{row.change === 'down' && (
												<span class="st3-chg-down">▼{row.delta}</span>
											)}
											{row.change === 'same' && (
												<span class="st3-chg-same">–</span>
											)}
										</td>
										<td class="st3-stand-td st3-td-pts">
											<RankCanvas value={row.points} width={52} />
										</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
				</div>
			</Show>
			<style>{`
				.st3-stand-loading {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--st3-muted);
					font-family: var(--st3-font-ui);
					font-size: 14px;
				}
				.st3-stand-panel {
					background: var(--st3-surface);
					border: 1px solid var(--st3-border);
					border-radius: var(--st3-radius);
					padding: 16px;
					overflow-x: auto;
				}
				.st3-stand-title {
					font-family: var(--st3-font-ui);
					font-size: 13px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.07em;
					color: var(--st3-muted);
					margin: 0 0 12px;
					padding-bottom: 10px;
					border-bottom: 1px solid var(--st3-border);
				}
				.st3-stand-table {
					width: 100%;
					border-collapse: collapse;
				}
				.st3-stand-th {
					font-family: var(--st3-font-ui);
					font-size: 10px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.08em;
					color: var(--st3-muted);
					text-align: left;
					padding: 0 0 8px;
					border-bottom: 1px solid var(--st3-border);
				}
				.st3-th-rank { width: 28px; }
				.st3-th-pts, .st3-th-chg { text-align: right; }
				.st3-th-pts { width: 60px; }
				.st3-th-chg { width: 36px; }
				.st3-stand-row:last-child .st3-stand-td { border-bottom: none; }
				.st3-stand-td {
					font-family: var(--st3-font-ui);
					font-size: 13px;
					color: var(--st3-text);
					padding: 7px 0;
					border-bottom: 1px solid var(--st3-border);
					vertical-align: middle;
				}
				.st3-td-pts { text-align: right; }
				.st3-td-chg { text-align: right; }
				.st3-td-rank canvas { display: block; }
				.st3-td-pts canvas { display: block; margin-left: auto; }
				.st3-chg-up { color: var(--st3-live); font-size: 11px; }
				.st3-chg-down { color: #ef4444; font-size: 11px; }
				.st3-chg-same { color: var(--st3-muted); font-size: 11px; }
			`}</style>
		</div>
	);
}
