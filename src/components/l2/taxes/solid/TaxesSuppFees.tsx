/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesSuppFees
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const suppFees = [
	{
		service: 'Certified copy of recorded instrument (per copy)',
		fee: '5.00 GP',
	},
	{ service: 'Uncertified / plain copy (per page)', fee: '1.00 GP' },
	{ service: 'Expedited same-day recording surcharge', fee: '50.00 GP' },
	{
		service: 'ROD Cover Sheet (form ELD-CVR), if not self-prepared',
		fee: '2.00 GP',
	},
	{ service: 'Notice to Owner (form ELD-NTO-01) filing', fee: '5.00 GP' },
	{ service: 'Index search (per name, per 10-year period)', fee: '3.00 GP' },
	{
		service: 'Parcel history report (all instruments on a single parcel)',
		fee: '15.00 GP',
	},
	{
		service: 'Rejection / re-submission handling fee (per returned instrument)',
		fee: '5.00 GP',
	},
	{
		service: 'Judicial release recording (court order in lieu of satisfaction)',
		fee: '15.00 GP',
	},
	{
		service:
			'Late satisfaction penalty (Eldoria Code §44-B, per month of delay)',
		fee: '100.00 GP',
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

export default function TaxesSuppFees() {
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
					data-component="taxes-supp-fees"
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
						Supplemental &amp; Miscellaneous Fees
					</div>
					<div style={{ 'overflow-x': 'auto' }}>
						<table style={tableStyle}>
							<thead>
								<tr style={headStyle}>
									<For each={['Service', 'Fee']}>
										{(h) => <th style={thStyle}>{h}</th>}
									</For>
								</tr>
							</thead>
							<tbody>
								<For each={suppFees}>
									{(f, i) => (
										<tr
											style={{
												'border-bottom': '1px solid var(--er-border)',
												background:
													i() % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
											}}
										>
											<td
												data-field="service"
												style={{
													padding: '8px 12px',
													color: 'var(--er-muted)',
													'font-size': '12px',
												}}
											>
												{f.service}
											</td>
											<td
												data-field="fee"
												style={{
													padding: '8px 12px',
													color: 'var(--er-text)',
													'white-space': 'nowrap',
												}}
											>
												{f.fee}
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
