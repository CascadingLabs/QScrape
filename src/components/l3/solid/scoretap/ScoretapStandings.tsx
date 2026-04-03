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
		<div data-island="solid-standings">
			<Show when={!rows()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={rows()}>
				<div class="b">
					<h3 class="c">CS2 World Rankings</h3>
					<table class="d">
						<thead>
							<tr>
								<th class="e f">#</th>
								<th class="e g">Team</th>
								<th class="e h">±</th>
								<th class="e i">Points</th>
							</tr>
						</thead>
						<tbody>
							<For each={rows() ?? []}>
								{(row) => (
									<tr class="j" data-0={row.team}>
										<td class="k l">
											<RankCanvas value={row.rank} width={24} />
										</td>
										<td class="k m">{row.team}</td>
										<td class="k n">
											{row.change === 'up' && (
												<span class="o">▲{row.delta}</span>
											)}
											{row.change === 'down' && (
												<span class="p">▼{row.delta}</span>
											)}
											{row.change === 'same' && <span class="q">–</span>}
										</td>
										<td class="k r">
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
				[data-island="solid-standings"] .a {
					min-height: 100px;
					display: flex;
					align-items: center;
					color: var(--st3-muted);
					font-family: var(--st3-font-ui);
					font-size: 14px;
				}
				[data-island="solid-standings"] .b {
					background: var(--st3-surface);
					border: 1px solid var(--st3-border);
					border-radius: var(--st3-radius);
					padding: 16px;
					overflow-x: auto;
				}
				[data-island="solid-standings"] .c {
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
				[data-island="solid-standings"] .d {
					width: 100%;
					border-collapse: collapse;
				}
				[data-island="solid-standings"] .e {
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
				[data-island="solid-standings"] .f { width: 28px; }
				[data-island="solid-standings"] .i, [data-island="solid-standings"] .h { text-align: right; }
				[data-island="solid-standings"] .i { width: 60px; }
				[data-island="solid-standings"] .h { width: 36px; }
				[data-island="solid-standings"] .j:last-child .k { border-bottom: none; }
				[data-island="solid-standings"] .k {
					font-family: var(--st3-font-ui);
					font-size: 13px;
					color: var(--st3-text);
					padding: 7px 0;
					border-bottom: 1px solid var(--st3-border);
					vertical-align: middle;
				}
				[data-island="solid-standings"] .r { text-align: right; }
				[data-island="solid-standings"] .n { text-align: right; }
				[data-island="solid-standings"] .l canvas { display: block; }
				[data-island="solid-standings"] .r canvas { display: block; margin-left: auto; }
				[data-island="solid-standings"] .o { color: var(--st3-live); font-size: 11px; }
				[data-island="solid-standings"] .p { color: #ef4444; font-size: 11px; }
				[data-island="solid-standings"] .q { color: var(--st3-muted); font-size: 11px; }
			`}</style>
		</div>
	);
}
