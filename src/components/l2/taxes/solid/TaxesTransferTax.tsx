/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesTransferTax
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const transferTax = [
	{
		range: '0 – 500.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '2.50 GP on 500 GP',
	},
	{
		range: '500.01 – 5,000.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '25.00 GP on 5,000 GP',
	},
	{
		range: '5,000.01 – 50,000.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '250.00 GP on 50,000 GP',
	},
	{
		range: '50,000.01 GP and above',
		rate: '0.75 GP per 100 GP',
		example: '750.00 GP on 100,000 GP',
	},
];

const tableStyle = {
	width: '100%',
	'border-collapse': 'collapse',
	'font-family': 'var(--er-font)',
	'font-size': '13px',
	background: 'var(--er-surface)',
	border: '1px solid var(--er-border)',
	'border-radius': 'var(--er-radius)',
};
const headStyle = {
	background: 'var(--er-bg)',
	'border-bottom': '2px solid var(--er-border)',
};
const thStyle = {
	padding: '9px 12px',
	'text-align': 'left',
	'font-weight': '600',
	color: 'var(--er-muted)',
	'white-space': 'nowrap',
};
const tdStyle = { padding: '8px 12px', color: 'var(--er-text)' };

export default function TaxesTransferTax() {
	const [ready, setReady] = createSignal(false);
	onMount(() => {
		fakeGet(null).then(() => setReady(true));
	});
	return (
		<>
			<Show when={!ready()}>
				<div
					style={{
						padding: '40px 24px',
						color: 'var(--er-muted)',
						'font-family': 'var(--er-font)',
					}}
				>
					Loading…
				</div>
			</Show>
			<Show when={ready()}>
				<div
					data-component="taxes-transfer-tax"
					data-framework="solid"
					style={{ padding: '24px' }}
				>
					<div
						style={{
							'font-size': '14px',
							'font-weight': '700',
							color: 'var(--er-text)',
							'font-family': 'var(--er-font)',
							'margin-bottom': '10px',
						}}
					>
						Transfer Tax
					</div>
					<p
						style={{
							'font-size': '13px',
							color: 'var(--er-muted)',
							'font-family': 'var(--er-font)',
							'margin-bottom': '10px',
							'line-height': '1.6',
						}}
					>
						Assessed on DEED instruments at <strong>0.5 GP per 100 GP</strong>{' '}
						of consideration. Instruments reciting nominal consideration must
						attach form ELD-TC-01 or the full rate of{' '}
						<strong>2.0 GP per 100 GP</strong> of assessed value applies.
					</p>
					<div style={{ 'overflow-x': 'auto' }}>
						<table style={tableStyle}>
							<thead>
								<tr style={headStyle}>
									<For
										each={[
											'Consideration Range',
											'Transfer Tax Rate',
											'Example Tax',
										]}
									>
										{(h) => <th style={thStyle}>{h}</th>}
									</For>
								</tr>
							</thead>
							<tbody>
								<For each={transferTax}>
									{(f, i) => (
										<tr
											style={{
												'border-bottom': '1px solid var(--er-border)',
												background:
													i() % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
											}}
										>
											<td data-field="range" style={tdStyle}>
												{f.range}
											</td>
											<td
												data-field="rate"
												style={{ ...tdStyle, 'white-space': 'nowrap' }}
											>
												{f.rate}
											</td>
											<td
												data-field="example"
												style={{ ...tdStyle, 'white-space': 'nowrap' }}
											>
												{f.example}
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
				</div>
			</Show>
		</>
	);
}
