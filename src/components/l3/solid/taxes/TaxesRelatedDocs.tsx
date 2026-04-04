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
			aria-label="amount"
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
		<div data-island="solid-related-docs" data-0={props.fileNum}>
			<Show when={!related()}>
				<div class="a">Loading…</div>
			</Show>
			<Show when={related()}>
				<div class="b">
					<h3 class="c">Related Documents</h3>
					<Show when={related()?.length === 0}>
						<p class="d">No related documents found.</p>
					</Show>
					<Show when={related()?.length > 0}>
						<ul class="e">
							<For each={related() ?? []}>
								{(deed) => (
									<li class="f" data-0={deed.fileNum}>
										<a href={`/l3/taxes/viewer/${deed.fileNum}/`} class="g">
											<span class="h">{deed.fileNum}</span>
											<span class="i">{deed.index}</span>
										</a>
										<span class="j">
											<AmountCanvas amount={deed.amount} />
										</span>
									</li>
								)}
							</For>
						</ul>
					</Show>

					<div class="k">
						<h4 class="l">Recording Fees</h4>
						<table class="m">
							<thead>
								<tr>
									<th class="n">Document Type</th>
									<th class="n">Fee</th>
								</tr>
							</thead>
							<tbody>
								<For each={RECORDING_FEES}>
									{(row) => (
										<tr class="o">
											<td class="p">{row.type}</td>
											<td class="p q">{row.fee}</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
				</div>
			</Show>
			<style>{`
				.a {
					min-height: 80px;
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
					gap: 16px;
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
					font-family: var(--er3-font);
					font-size: 13px;
					color: var(--er3-muted);
					margin: 0;
					font-style: italic;
				}
				.e {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0;
				}
				.f {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					padding: 8px 0;
					border-bottom: 1px solid var(--er3-border);
				}
				.f:last-child { border-bottom: none; }
				.g {
					display: flex;
					align-items: center;
					gap: 8px;
					text-decoration: none;
				}
				.g:hover .h {
					color: var(--er3-primary);
				}
				.h {
					font-family: var(--er3-font-mono);
					font-size: 12px;
					color: var(--er3-text);
				}
				.i {
					font-family: var(--er3-font-mono);
					font-size: 11px;
					color: var(--er3-muted);
					background: var(--er3-surface2);
					border: 1px solid var(--er3-border);
					border-radius: 2px;
					padding: 1px 5px;
				}
				.j {
					display: inline-block;
					line-height: 1;
				}
				.k {
					border-top: 1px solid var(--er3-border);
					padding-top: 14px;
				}
				.l {
					font-family: var(--er3-font);
					font-size: 12px;
					font-weight: 700;
					color: var(--er3-muted);
					text-transform: uppercase;
					letter-spacing: 0.06em;
					margin: 0 0 10px;
				}
				.m {
					width: 100%;
					border-collapse: collapse;
					font-family: var(--er3-font);
					font-size: 12px;
				}
				.n {
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
				.o {
					border-bottom: 1px solid var(--er3-border);
				}
				.o:last-child { border-bottom: none; }
				.p {
					padding: 7px 8px;
					color: var(--er3-text);
				}
				.q {
					font-family: var(--er3-font-mono);
					font-weight: 600;
					color: var(--er3-primary);
				}
			`}</style>
		</div>
	);
}
