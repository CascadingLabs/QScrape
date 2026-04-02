/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesRecordingFees
 */
import { useEffect, useState } from 'react';
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

const tableStyle: React.CSSProperties = {
	width: '100%',
	borderCollapse: 'collapse',
	fontFamily: 'var(--er-font)',
	fontSize: '13px',
	background: 'var(--er-surface)',
	border: '1px solid var(--er-border)',
	borderRadius: 'var(--er-radius)',
};
const headStyle: React.CSSProperties = {
	background: 'var(--er-bg)',
	borderBottom: '2px solid var(--er-border)',
};
const thStyle: React.CSSProperties = {
	padding: '9px 12px',
	textAlign: 'left',
	fontWeight: '600',
	color: 'var(--er-muted)',
	whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = {
	padding: '8px 12px',
	color: 'var(--er-text)',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				fontSize: '14px',
				fontWeight: '700',
				color: 'var(--er-text)',
				fontFamily: 'var(--er-font)',
				marginBottom: '10px',
			}}
		>
			{children}
		</div>
	);
}

export default function TaxesRecordingFees() {
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
			data-component="taxes-recording-fees"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<div style={{ marginBottom: '28px' }}>
				<SectionTitle>Standard Document Recording Fees</SectionTitle>
				<div style={{ overflowX: 'auto' }}>
					<table style={tableStyle}>
						<thead>
							<tr style={headStyle}>
								{(
									[
										'Index Type',
										'Document Type',
										'Base Fee (1st page)',
										"Each Add'l Page",
										'Max Fee',
									] as const
								).map((h) => (
									<th key={h} style={thStyle}>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{stdFees.map((f, i) => (
								<tr
									key={f.index}
									data-index-type={f.index}
									style={{
										borderBottom: '1px solid var(--er-border)',
										background:
											i % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
									}}
								>
									<td style={tdStyle}>
										<span
											style={{
												background: 'var(--er-primary)',
												color: '#fff',
												fontFamily: 'monospace',
												fontSize: '11px',
												fontWeight: '700',
												padding: '2px 7px',
												borderRadius: '3px',
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
											fontSize: '12px',
										}}
									>
										{f.docs}
									</td>
									<td
										data-field="base-fee"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.base}
									</td>
									<td
										data-field="addl-fee"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.addl}
									</td>
									<td
										data-field="max-fee"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.max}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div style={{ marginBottom: '28px' }}>
				<SectionTitle>Supplemental &amp; Miscellaneous Fees</SectionTitle>
				<div style={{ overflowX: 'auto' }}>
					<table style={tableStyle}>
						<thead>
							<tr style={headStyle}>
								{(['Service', 'Fee'] as const).map((h) => (
									<th key={h} style={thStyle}>
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
											...tdStyle,
											color: 'var(--er-muted)',
											fontSize: '12px',
										}}
									>
										{f.service}
									</td>
									<td
										data-field="fee"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.fee}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div style={{ marginBottom: '28px' }}>
				<SectionTitle>Transfer Tax</SectionTitle>
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
					consideration. Nominal consideration instruments must attach form
					ELD-TC-01 or the full rate of <strong>2.0 GP per 100 GP</strong>{' '}
					applies.
				</p>
				<div style={{ overflowX: 'auto' }}>
					<table style={tableStyle}>
						<thead>
							<tr style={headStyle}>
								{(
									[
										'Consideration Range',
										'Transfer Tax Rate',
										'Example Tax',
									] as const
								).map((h) => (
									<th key={h} style={thStyle}>
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
									<td data-field="range" style={tdStyle}>
										{f.range}
									</td>
									<td
										data-field="rate"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.rate}
									</td>
									<td
										data-field="example"
										style={{ ...tdStyle, whiteSpace: 'nowrap' }}
									>
										{f.example}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
