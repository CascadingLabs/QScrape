// @qscrape L3 / solid island / taxes — related documents + recording fees
// Anti-bot: amount values drawn to <canvas> — not present in DOM text at all
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGetMs } from '../../../../data/api';
import { type DeedRecord, deeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l3/taxes.css';

const RECORDING_FEES = [
	{ type: 'Deed', fee: '$30' },
	{ type: 'Mortgage', fee: '$30' },
	{ type: 'Lien', fee: '$25' },
];

function AmountCanvas(props: { amount: string }) {
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
		ctx.fillStyle = 'var(--er3-text)';
		ctx.fillText(props.amount, 0, 14);
	});
	return (
		<canvas
			ref={canvas}
			width={140}
			height={18}
			style={{ display: 'inline-block', 'vertical-align': 'middle' }}
		/>
	);
}

interface Props {
	fileNum: string;
}

export default function TaxesRelatedDocs(props: Props) {
	const [related, setRelated] = createSignal<DeedRecord[] | null>(null);

	onMount(() => {
		const target = deeds.find((d) => d.fileNum === props.fileNum);
		if (!target) {
			setRelated([]);
			return;
		}
		const docs = deeds.filter(
			(d) => d.lastFirm === target.lastFirm && d.fileNum !== props.fileNum,
		);
		fakeGetMs(docs, 300, 200).then(setRelated);
	});

	return (
		<div data-file-num={props.fileNum}>
			<Show when={!related()}>
				<div class="er3-rel-loading">Loading…</div>
			</Show>
			<Show when={related()}>
				<div class="er3-rel-panel">
					<h3 class="er3-rel-title">Related Documents</h3>
					<Show when={related()?.length === 0}>
						<p class="er3-rel-empty">No related documents found.</p>
					</Show>
					<Show when={related()?.length > 0}>
						<ul class="er3-rel-list">
							<For each={related() ?? []}>
								{(deed) => (
									<li class="er3-rel-item" data-file-num={deed.fileNum}>
										<a
											href={`/l3/taxes/viewer/${deed.fileNum}/`}
											class="er3-rel-link"
										>
											<span class="er3-rel-filenum">{deed.fileNum}</span>
											<span class="er3-rel-index">{deed.index}</span>
										</a>
										<span class="er3-rel-amount">
											<AmountCanvas amount={deed.amount} />
										</span>
									</li>
								)}
							</For>
						</ul>
					</Show>

					<div class="er3-fees-section">
						<h4 class="er3-fees-title">Recording Fees</h4>
						<table class="er3-fees-table">
							<thead>
								<tr>
									<th class="er3-fees-th">Document Type</th>
									<th class="er3-fees-th">Fee</th>
								</tr>
							</thead>
							<tbody>
								<For each={RECORDING_FEES}>
									{(row) => (
										<tr class="er3-fees-tr">
											<td class="er3-fees-td">{row.type}</td>
											<td class="er3-fees-td er3-fees-td-fee">{row.fee}</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
				</div>
			</Show>
			<style>{`
				.er3-rel-loading {
					min-height: 80px;
					display: flex;
					align-items: center;
					color: var(--er3-muted);
					font-family: var(--er3-font);
					font-size: 13px;
				}
				.er3-rel-panel {
					background: var(--er3-surface);
					border: 1px solid var(--er3-border);
					border-radius: var(--er3-radius);
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				.er3-rel-title {
					font-family: var(--er3-font);
					font-size: 14px;
					font-weight: 700;
					color: var(--er3-text);
					margin: 0;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--er3-primary);
					letter-spacing: -0.1px;
				}
				.er3-rel-empty {
					font-family: var(--er3-font);
					font-size: 13px;
					color: var(--er3-muted);
					margin: 0;
					font-style: italic;
				}
				.er3-rel-list {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.er3-rel-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					padding: 8px 0;
					border-bottom: 1px solid var(--er3-border);
				}
				.er3-rel-item:last-child { border-bottom: none; }
				.er3-rel-link {
					display: flex;
					align-items: center;
					gap: 8px;
					text-decoration: none;
				}
				.er3-rel-link:hover .er3-rel-filenum {
					color: var(--er3-primary);
				}
				.er3-rel-filenum {
					font-family: var(--er3-font-mono);
					font-size: 12px;
					color: var(--er3-text);
				}
				.er3-rel-index {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					color: var(--er3-muted);
					background: var(--er3-surface2);
					border: 1px solid var(--er3-border);
					border-radius: 2px;
					padding: 1px 5px;
				}
				.er3-rel-amount {
					display: inline-block;
					line-height: 1;
				}
				.er3-fees-section {
					border-top: 1px solid var(--er3-border);
					padding-top: 14px;
				}
				.er3-fees-title {
					font-family: var(--er3-font);
					font-size: 12px;
					font-weight: 700;
					color: var(--er3-muted);
					text-transform: uppercase;
					letter-spacing: 0.06em;
					margin: 0 0 10px;
				}
				.er3-fees-table {
					width: 100%;
					border-collapse: collapse;
					font-family: var(--er3-font);
					font-size: 12px;
				}
				.er3-fees-th {
					text-align: left;
					padding: 6px 8px;
					font-size: 11px;
					font-weight: 600;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					color: var(--er3-muted);
					background: var(--er3-surface2);
					border-bottom: 1px solid var(--er3-border);
				}
				.er3-fees-tr {
					border-bottom: 1px solid var(--er3-border);
				}
				.er3-fees-tr:last-child { border-bottom: none; }
				.er3-fees-td {
					padding: 7px 8px;
					color: var(--er3-text);
				}
				.er3-fees-td-fee {
					font-family: var(--er3-font-mono);
					font-weight: 600;
					color: var(--er3-primary);
				}
			`}</style>
		</div>
	);
}
