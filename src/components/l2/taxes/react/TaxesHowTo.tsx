/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesHowTo
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const guides = [
	{
		type: 'DEED',
		title: 'Recording a Deed',
		desc: "How to transfer title to subterranean real property — warranty deeds, quitclaim deeds, trustee's deeds, required elements, and filing steps.",
	},
	{
		type: 'MTG',
		title: 'Filing and Managing a Mortgage',
		desc: 'How to record a mortgage, required uniform covenants, and how to obtain a satisfaction once the loan is paid in full.',
	},
	{
		type: 'LIEN',
		title: "Filing a Mechanic's Lien",
		desc: 'Who may file, statutory deadlines, Notice to Owner requirements, Schedule A itemization, and how to contest or release a lien.',
	},
	{
		type: 'ESMT',
		title: 'Registering an Easement',
		desc: 'How to create and record utility, access, drainage, and magma-routing easements including coordinate description requirements.',
	},
	{
		type: 'ASGN',
		title: 'Filing an Assignment of Mortgage',
		desc: 'How to transfer a mortgage lien to a new holder, required elements, Mortgagor notification rules, and partial assignments.',
	},
	{
		type: 'REL',
		title: 'Releasing a Lien or Mortgage',
		desc: 'Mortgagee obligations upon payoff, step-by-step release process, penalties for delayed discharge, and judicial release procedures.',
	},
	{
		type: 'NTC',
		title: 'Filing a Notice of Commencement',
		desc: 'When a NOC is required, what to include, job-site posting requirements, and how to amend or terminate a NOC after project completion.',
	},
	{
		type: 'AFF',
		title: 'Filing an Affidavit of Title',
		desc: 'What must be disclosed, legal consequences of false statements, and how to prepare and record a sworn title affidavit.',
	},
];

export default function TaxesHowTo() {
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
			data-component="taxes-how-to"
			data-framework="react"
			style={{ padding: '24px' }}
		>
			<p
				style={{
					marginBottom: '16px',
					fontSize: '14px',
					color: 'var(--er-muted)',
					fontFamily: 'var(--er-font)',
				}}
			>
				Official filing guides for each document type. Click{' '}
				<strong>View Guide</strong> to read the PDF. For the fee schedule see{' '}
				<a
					href="/l2/taxes/recording-fees/"
					style={{ color: 'var(--er-primary)' }}
				>
					Recording Fees
				</a>
				.
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
								['Index Type', 'Guide Title', 'Description', 'PDF'] as const
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
						{guides.map((g, i) => (
							<tr
								key={g.type}
								data-index-type={g.type}
								style={{
									borderBottom: '1px solid var(--er-border)',
									background:
										i % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
								}}
							>
								<td style={{ padding: '8px 12px' }}>
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
										{g.type}
									</span>
								</td>
								<td
									data-field="title"
									style={{
										padding: '8px 12px',
										fontWeight: '600',
										color: 'var(--er-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{g.title}
								</td>
								<td
									data-field="desc"
									style={{
										padding: '8px 12px',
										color: 'var(--er-muted)',
										fontSize: '12px',
									}}
								>
									{g.desc}
								</td>
								<td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
									<a
										href={`/how-to/how-to-${g.type.toLowerCase()}.pdf`}
										target="_blank"
										rel="noreferrer"
										style={{
											color: 'var(--er-primary)',
											fontSize: '12px',
											fontWeight: '600',
											textDecoration: 'none',
										}}
									>
										View Guide
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
