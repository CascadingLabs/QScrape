/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesRecordingFees
 */
import { createSignal, For, onMount, Show } from 'solid-js';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const stdFees = [
	{
		index: 'DEED',
		docs: "Warranty Deed, Quitclaim Deed, Trustee's Deed, Sheriff's Deed",
		base: '15.00 GP',
		addl: '2.00 GP',
		max: '75.00 GP',
	},
	{
		index: 'MTG',
		docs: 'Mortgage, Purchase Money Mortgage, Construction Mortgage',
		base: '25.00 GP',
		addl: '2.00 GP',
		max: '125.00 GP',
	},
	{
		index: 'LIEN',
		docs: "Claim of Mechanic's Lien, Construction Lien, Judgment Lien",
		base: '10.00 GP',
		addl: '2.00 GP',
		max: '50.00 GP',
	},
	{
		index: 'ESMT',
		docs: 'Grant of Easement, Easement Agreement, Utility Easement',
		base: '15.00 GP',
		addl: '2.00 GP',
		max: '75.00 GP',
	},
	{
		index: 'ASGN',
		docs: 'Assignment of Mortgage, Assignment of Lien, Partial Assignment',
		base: '20.00 GP',
		addl: '2.00 GP',
		max: '60.00 GP',
	},
	{
		index: 'REL',
		docs: 'Release of Lien, Satisfaction of Mortgage, Discharge of Judgment',
		base: '10.00 GP',
		addl: '2.00 GP',
		max: '30.00 GP',
	},
	{
		index: 'NTC',
		docs: 'Notice of Commencement, Amended NOC, Notice of Termination',
		base: '10.00 GP',
		addl: '2.00 GP',
		max: '30.00 GP',
	},
	{
		index: 'AFF',
		docs: 'Affidavit of Title, Affidavit of Heirship, Correction Affidavit',
		base: '10.00 GP',
		addl: '2.00 GP',
		max: '30.00 GP',
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

export default function TaxesRecordingFees() {
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
					data-component="taxes-std-fees"
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
						Standard Document Recording Fees
					</div>
					<div style={{ 'overflow-x': 'auto' }}>
						<table style={tableStyle}>
							<thead>
								<tr style={headStyle}>
									<For
										each={[
											'Index Type',
											'Document Type',
											'Base Fee (1st page)',
											"Each Add'l Page",
											'Max Fee',
										]}
									>
										{(h) => <th style={thStyle}>{h}</th>}
									</For>
								</tr>
							</thead>
							<tbody>
								<For each={stdFees}>
									{(f, i) => (
										<tr
											data-index-type={f.index}
											style={{
												'border-bottom': '1px solid var(--er-border)',
												background:
													i() % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
											}}
										>
											<td style={tdStyle}>
												<span
													style={{
														background: 'var(--er-primary)',
														color: '#fff',
														'font-family': 'monospace',
														'font-size': '11px',
														'font-weight': '700',
														padding: '2px 7px',
														'border-radius': '3px',
													}}
												>
													{f.index}
												</span>
											</td>
											<td
												data-field="doc-type"
												style={{
													...tdStyle,
													color: 'var(--er-muted)',
													'font-size': '12px',
												}}
											>
												{f.docs}
											</td>
											<td
												data-field="base-fee"
												style={{ ...tdStyle, 'white-space': 'nowrap' }}
											>
												{f.base}
											</td>
											<td
												data-field="addl-fee"
												style={{ ...tdStyle, 'white-space': 'nowrap' }}
											>
												{f.addl}
											</td>
											<td
												data-field="max-fee"
												style={{ ...tdStyle, 'white-space': 'nowrap' }}
											>
												{f.max}
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
