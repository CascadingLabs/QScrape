/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesTransferTax
 */
import { useEffect, useState } from 'react';
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

export default function TaxesTransferTax() {
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
			data-component="taxes-transfer-tax"
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
				Transfer Tax
			</div>
			<p
				style={{
					fontSize: '13px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
					marginBottom: '10px',
					lineHeight: '1.6',
				}}
			>
				Assessed on DEED instruments at <strong>0.5 GP per 100 GP</strong> of
				consideration. Instruments reciting nominal consideration must attach
				form ELD-TC-01 or the full rate of <strong>2.0 GP per 100 GP</strong> of
				assessed value applies.
			</p>
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
							{(
								[
									'Consideration Range',
									'Transfer Tax Rate',
									'Example Tax',
								] as const
							).map((h) => (
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
						{transferTax.map((f, i) => (
							<tr
								key={f.range}
								style={{
									borderBottom: '1px solid var(--er-border)',
									background:
										i % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
								}}
							>
								<td
									data-field="range"
									style={{ padding: '8px 12px', color: 'var(--er-text)' }}
								>
									{f.range}
								</td>
								<td
									data-field="rate"
									style={{
										padding: '8px 12px',
										color: 'var(--er-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{f.rate}
								</td>
								<td
									data-field="example"
									style={{
										padding: '8px 12px',
										color: 'var(--er-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{f.example}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
