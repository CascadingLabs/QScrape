/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesHowTo
 */
import { createSignal, For, onMount, Show } from 'solid-js';
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
					data-component="taxes-how-to"
					data-framework="solid"
					style={{ padding: '24px' }}
				>
					<p
						style={{
							'margin-bottom': '16px',
							'font-size': '14px',
							color: 'var(--er-muted)',
							'font-family': 'var(--er-font)',
						}}
					>
						Official filing guides for each document type. Click{' '}
						<strong>View Guide</strong> to read the PDF. For the fee schedule
						see{' '}
						<a
							href="/l2/taxes/recording-fees/"
							style={{ color: 'var(--er-primary)' }}
						>
							Recording Fees
						</a>
						.
					</p>
					<div style={{ 'overflow-x': 'auto' }}>
						<table
							style={{
								width: '100%',
								'border-collapse': 'collapse',
								'font-family': 'var(--er-font)',
								'font-size': '13px',
								background: 'var(--er-surface)',
								border: '1px solid var(--er-border)',
								'border-radius': 'var(--er-radius)',
							}}
						>
							<thead>
								<tr
									style={{
										background: 'var(--er-bg)',
										'border-bottom': '2px solid var(--er-border)',
									}}
								>
									<For
										each={['Index Type', 'Guide Title', 'Description', 'PDF']}
									>
										{(h) => (
											<th
												style={{
													padding: '9px 12px',
													'text-align': 'left',
													'font-weight': '600',
													color: 'var(--er-muted)',
													'white-space': 'nowrap',
												}}
											>
												{h}
											</th>
										)}
									</For>
								</tr>
							</thead>
							<tbody>
								<For each={guides}>
									{(g, i) => (
										<tr
											data-index-type={g.type}
											style={{
												'border-bottom': '1px solid var(--er-border)',
												background:
													i() % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
											}}
										>
											<td style={{ padding: '8px 12px' }}>
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
													{g.type}
												</span>
											</td>
											<td
												data-field="title"
												style={{
													padding: '8px 12px',
													'font-weight': '600',
													color: 'var(--er-text)',
													'white-space': 'nowrap',
												}}
											>
												{g.title}
											</td>
											<td
												data-field="desc"
												style={{
													padding: '8px 12px',
													color: 'var(--er-muted)',
													'font-size': '12px',
												}}
											>
												{g.desc}
											</td>
											<td
												style={{ padding: '8px 12px', 'white-space': 'nowrap' }}
											>
												<a
													href={`/how-to/how-to-${g.type.toLowerCase()}.pdf`}
													target="_blank"
													rel="noreferrer"
													style={{
														color: 'var(--er-primary)',
														'font-size': '12px',
														'font-weight': '600',
														'text-decoration': 'none',
													}}
												>
													View Guide
												</a>
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
