/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesSuppFees
 */
import { useEffect, useState } from 'react';
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

export default function TaxesSuppFees() {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fakeGet(null).then(() => setReady(true));
	}, []);
	if (!ready) {
		return (
			<div
				style={{
					padding: '40px 24px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
				}}
			>
				Loading…
			</div>
		);
	}
	return (
		<div
			data-component="taxes-supp-fees"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<div
				style={{
					fontSize: '14px',
					fontWeight: '700',
					color: 'var(--er-text)',
					fontFamily: 'var(--er-font)',
					marginBottom: '10px',
				}}
			>
				Supplemental &amp; Miscellaneous Fees
			</div>
			<div style={{ overflowX: 'auto' }}>
				<table
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						fontFamily: 'var(--er-font)',
						fontSize: '13px',
						background: 'var(--er-surface)',
						border: '1px solid var(--er-border)',
						borderRadius: 'var(--er-radius)',
					}}
				>
					<thead>
						<tr
							style={{
								background: 'var(--er-bg)',
								borderBottom: '2px solid var(--er-border)',
							}}
						>
							{(['Service', 'Fee'] as const).map((h) => (
								<th
									key={h}
									style={{
										padding: '9px 12px',
										textAlign: 'left',
										fontWeight: '600',
										color: 'var(--er-muted)',
										whiteSpace: 'nowrap',
									}}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{suppFees.map((f, i) => (
							<tr
								key={f.service}
								style={{
									borderBottom: '1px solid var(--er-border)',
									background:
										i % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
								}}
							>
								<td
									data-field="service"
									style={{
										padding: '8px 12px',
										color: 'var(--er-muted)',
										fontSize: '12px',
									}}
								>
									{f.service}
								</td>
								<td
									data-field="fee"
									style={{
										padding: '8px 12px',
										color: 'var(--er-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{f.fee}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
