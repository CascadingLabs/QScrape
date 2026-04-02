/**
 * @qscrape L2 / solid / taxes / island
 * @component TaxesResultsGrid
 */
import {
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from 'solid-js';
import { fakeGet } from '../../../../data/api';
import type {
	DeedRecord,
	IndexType,
	StatusType,
} from '../../../../data/taxes/deeds';
import { deeds, indexLabels, searchDeeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const PER_PAGE = 10;

function getUrlState() {
	const p = new URLSearchParams(window.location.search);
	return {
		file: p.get('file'),
		lastFirm: p.get('lastFirm') ?? '',
		first: p.get('first') ?? '',
		index: p.get('index') ?? 'ALL',
	};
}

const statusColors: Record<StatusType, [string, string]> = {
	RECORDED: ['var(--er-recorded-bg)', 'var(--er-recorded)'],
	SATISFIED: ['var(--er-satisfied-bg)', 'var(--er-satisfied)'],
	DELINQUENT: ['var(--er-delinquent-bg)', 'var(--er-delinquent)'],
};

function StatusBadge(props: { status: StatusType }) {
	const [bg, color] = statusColors[props.status];
	return (
		<span
			data-status={props.status}
			style={{
				background: bg,
				color,
				'font-size': '11px',
				'font-weight': '700',
				padding: '2px 7px',
				'border-radius': '3px',
				'letter-spacing': '0.03em',
			}}
		>
			{props.status}
		</span>
	);
}

function RecordViewer(props: { record: DeedRecord; onBack: () => void }) {
	const r = props.record;
	return (
		<div
			data-component="taxes-viewer"
			data-file-num={r.fileNum}
			style={{ padding: '24px' }}
		>
			<button
				type="button"
				onClick={props.onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--er-primary)',
					cursor: 'pointer',
					'font-family': 'var(--er-font)',
					'font-size': '13px',
					padding: '0',
					'margin-bottom': '16px',
				}}
			>
				← Back to Results
			</button>
			<div
				style={{
					background: 'var(--er-surface)',
					border: '1px solid var(--er-border)',
					'border-radius': 'var(--er-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						background: 'var(--er-primary)',
						color: '#fff',
						padding: '14px 20px',
						display: 'flex',
						'justify-content': 'space-between',
						'align-items': 'center',
					}}
				>
					<h2
						style={{
							'font-size': '16px',
							'font-weight': '600',
							'font-family': 'var(--er-font)',
						}}
					>
						Document Viewer — File {r.fileNum}
					</h2>
					<StatusBadge status={r.status} />
				</div>
				<table
					style={{
						width: '100%',
						'border-collapse': 'collapse',
						'font-family': 'var(--er-font)',
						'font-size': '14px',
					}}
				>
					<tbody>
						{(
							[
								['File Number', r.fileNum, 'file-num'],
								[
									'Index Type',
									`${r.index} — ${indexLabels[r.index as IndexType]}`,
									'index',
								],
								['Record Date', r.recordDate, 'record-date'],
								['Satisfied', r.sat ? 'Yes' : 'No', 'sat'],
								['Last / Firm', r.lastFirm, 'last-firm'],
								['First Name', r.first || '—', 'first'],
								['Amount', r.amount, 'amount'],
							] as [string, string, string][]
						).map(([label, value, field]) => (
							<tr
								key={field}
								style={{ 'border-bottom': '1px solid var(--er-border)' }}
							>
								<th
									style={{
										padding: '10px 16px',
										'text-align': 'left',
										'font-weight': '600',
										color: 'var(--er-muted)',
										width: '160px',
										background: 'var(--er-bg)',
										'white-space': 'nowrap',
									}}
								>
									{label}
								</th>
								<td
									data-field={field}
									style={{ padding: '10px 16px', color: 'var(--er-text)' }}
								>
									{value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div
				style={{
					'margin-top': '20px',
					border: '1px solid var(--er-border)',
					'border-radius': 'var(--er-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						background: 'var(--er-surface)',
						'border-bottom': '1px solid var(--er-border)',
						padding: '10px 16px',
						'font-size': '13px',
						color: 'var(--er-muted)',
						'font-family': 'var(--er-font)',
						display: 'flex',
						'justify-content': 'space-between',
						'align-items': 'center',
					}}
				>
					<span>Document: {r.fileNum}.pdf</span>
					<a
						href={`/${r.fileNum}.pdf`}
						download
						style={{
							color: 'var(--er-primary)',
							'font-size': '12px',
							'font-weight': '600',
							'text-decoration': 'none',
						}}
					>
						Download PDF
					</a>
				</div>
				<iframe
					src={`/${r.fileNum}.pdf`}
					style={{
						width: '100%',
						height: '400px',
						border: 'none',
						display: 'block',
					}}
					title={`Deed ${r.fileNum}`}
				/>
			</div>
		</div>
	);
}

export default function TaxesResultsGrid() {
	const [ready, setReady] = createSignal(false);
	const [view, setView] = createSignal<'list' | 'detail'>('list');
	const [currentFile, setCurrentFile] = createSignal<string | null>(null);
	const [results, setResults] = createSignal<DeedRecord[]>(deeds);
	const [page, setPage] = createSignal(1);

	const currentRecord = createMemo(() =>
		currentFile()
			? (deeds.find((d) => d.fileNum === currentFile()) ?? null)
			: null,
	);
	const totalPages = createMemo(() => Math.ceil(results().length / PER_PAGE));
	const pageItems = createMemo(() =>
		results().slice((page() - 1) * PER_PAGE, page() * PER_PAGE),
	);

	const viewRecord = (fileNum: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set('file', fileNum);
		history.pushState(null, '', url.toString());
		window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
		window.scrollTo(0, 0);
	};

	const onPop = () => {
		const s = getUrlState();
		if (s.file) {
			setView('detail');
			setCurrentFile(s.file);
		} else {
			setView('list');
			setResults(
				searchDeeds({
					lastFirm: s.lastFirm,
					first: s.first,
					index: s.index !== 'ALL' ? s.index : undefined,
				}),
			);
			setPage(1);
		}
	};
	const onSearch = (e: Event) => {
		const d = (
			e as CustomEvent<{ lastFirm: string; first: string; index: string }>
		).detail;
		setResults(
			searchDeeds({
				lastFirm: d.lastFirm,
				first: d.first,
				index: d.index !== 'ALL' ? d.index : undefined,
			}),
		);
		setView('list');
		setPage(1);
	};
	const onView = (e: Event) => {
		setCurrentFile((e as CustomEvent<string>).detail);
		setView('detail');
	};

	onMount(() => {
		const s = getUrlState();
		if (s.file) {
			setView('detail');
			setCurrentFile(s.file);
		} else {
			setResults(
				searchDeeds({
					lastFirm: s.lastFirm,
					first: s.first,
					index: s.index !== 'ALL' ? s.index : undefined,
				}),
			);
		}
		fakeGet(null).then(() => setReady(true));
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
		window.addEventListener('taxes:view', onView);
	});
	onCleanup(() => {
		window.removeEventListener('popstate', onPop);
		window.removeEventListener('taxes:search', onSearch);
		window.removeEventListener('taxes:view', onView);
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
			<Show when={ready() && view() === 'detail' && currentRecord()}>
				<RecordViewer
					record={currentRecord()!}
					onBack={() => {
						history.back();
					}}
				/>
			</Show>
			<Show when={ready() && view() === 'list'}>
				<div data-component="taxes-results-grid" data-framework="solid">
					<div
						style={{
							padding: '10px 0',
							'margin-bottom': '8px',
							color: 'var(--er-muted)',
							'font-size': '13px',
							'font-family': 'var(--er-font)',
						}}
					>
						{results().length} record{results().length !== 1 ? 's' : ''} found
					</div>
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
										each={[
											'File #',
											'Index',
											'Date',
											'SAT',
											'Last / Firm',
											'First',
											'Amount',
											'Status',
											'',
										]}
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
								<For each={pageItems()}>
									{(d, i) => (
										<tr
											data-file-num={d.fileNum}
											style={{
												'border-bottom': '1px solid var(--er-border)',
												background:
													i() % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
											}}
										>
											<td
												style={{
													padding: '8px 12px',
													'font-family': 'monospace',
													'font-weight': '600',
													color: 'var(--er-text)',
													'white-space': 'nowrap',
												}}
											>
												{d.fileNum}
											</td>
											<td style={{ padding: '8px 12px' }}>
												<span
													style={{
														background: 'var(--er-bg)',
														border: '1px solid var(--er-border)',
														'border-radius': '3px',
														padding: '1px 6px',
														'font-size': '11px',
														'font-weight': '700',
														color: 'var(--er-text)',
													}}
												>
													{d.index}
												</span>
											</td>
											<td
												style={{
													padding: '8px 12px',
													'white-space': 'nowrap',
													color: 'var(--er-muted)',
												}}
											>
												{d.recordDate}
											</td>
											<td
												style={{
													padding: '8px 12px',
													color: d.sat
														? 'var(--er-recorded)'
														: 'var(--er-muted)',
													'font-weight': d.sat ? '600' : '400',
												}}
											>
												{d.sat ? 'SAT' : ''}
											</td>
											<td style={{ padding: '8px 12px' }}>{d.lastFirm}</td>
											<td style={{ padding: '8px 12px' }}>{d.first}</td>
											<td
												style={{ padding: '8px 12px', 'white-space': 'nowrap' }}
											>
												{d.amount}
											</td>
											<td style={{ padding: '8px 12px' }}>
												<StatusBadge status={d.status} />
											</td>
											<td style={{ padding: '8px 12px' }}>
												<button
													type="button"
													onClick={() => viewRecord(d.fileNum)}
													style={{
														background: 'var(--er-primary)',
														color: '#fff',
														border: 'none',
														'border-radius': 'var(--er-radius)',
														padding: '4px 10px',
														'font-size': '12px',
														cursor: 'pointer',
														'font-family': 'var(--er-font)',
													}}
												>
													View
												</button>
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
					<Show when={totalPages() > 1}>
						<div
							style={{
								display: 'flex',
								gap: '6px',
								'margin-top': '16px',
								'justify-content': 'center',
								'flex-wrap': 'wrap',
							}}
						>
							<For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
								{(n) => (
									<button
										type="button"
										onClick={() => setPage(n)}
										style={{
											padding: '5px 10px',
											border: `1px solid ${n === page() ? 'var(--er-primary)' : 'var(--er-border)'}`,
											'border-radius': 'var(--er-radius)',
											background:
												n === page() ? 'var(--er-primary)' : 'transparent',
											color: n === page() ? '#fff' : 'var(--er-text)',
											cursor: 'pointer',
											'font-family': 'var(--er-font)',
											'font-size': '13px',
										}}
									>
										{n}
									</button>
								)}
							</For>
						</div>
					</Show>
				</div>
			</Show>
		</>
	);
}
