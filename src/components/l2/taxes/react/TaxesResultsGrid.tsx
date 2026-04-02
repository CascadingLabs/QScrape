/**
 * @qscrape L2 / react / taxes / island
 * @component TaxesResultsGrid
 */
import { useEffect, useState } from 'react';
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

function StatusBadge({ status }: { status: StatusType }) {
	const map: Record<StatusType, [string, string]> = {
		RECORDED: ['var(--er-recorded-bg)', 'var(--er-recorded)'],
		SATISFIED: ['var(--er-satisfied-bg)', 'var(--er-satisfied)'],
		DELINQUENT: ['var(--er-delinquent-bg)', 'var(--er-delinquent)'],
	};
	const [bg, color] = map[status];
	return (
		<span
			data-status={status}
			style={{
				background: bg,
				color,
				fontSize: '11px',
				fontWeight: '700',
				padding: '2px 7px',
				borderRadius: '3px',
				letterSpacing: '0.03em',
			}}
		>
			{status}
		</span>
	);
}

function RecordViewer({
	record,
	onBack,
}: {
	record: DeedRecord;
	onBack: () => void;
}) {
	return (
		<div
			data-component="taxes-viewer"
			data-file-num={record.fileNum}
			style={{ padding: '24px' }}
		>
			<button
				type="button"
				onClick={onBack}
				style={{
					background: 'none',
					border: 'none',
					color: 'var(--er-primary)',
					cursor: 'pointer',
					fontFamily: 'var(--er-font)',
					fontSize: '13px',
					padding: '0',
					marginBottom: '16px',
				}}
			>
				← Back to Results
			</button>
			<div
				style={{
					background: 'var(--er-surface)',
					border: '1px solid var(--er-border)',
					borderRadius: 'var(--er-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						background: 'var(--er-primary)',
						color: '#fff',
						padding: '14px 20px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<h2
						style={{
							fontSize: '16px',
							fontWeight: '600',
							fontFamily: 'var(--er-font)',
						}}
					>
						Document Viewer — File {record.fileNum}
					</h2>
					<StatusBadge status={record.status} />
				</div>
				<table
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						fontFamily: 'var(--er-font)',
						fontSize: '14px',
					}}
				>
					<tbody>
						{(
							[
								['File Number', record.fileNum, 'file-num'],
								[
									'Index Type',
									`${record.index} — ${indexLabels[record.index as IndexType]}`,
									'index',
								],
								['Record Date', record.recordDate, 'record-date'],
								['Satisfied', record.sat ? 'Yes' : 'No', 'sat'],
								['Last / Firm', record.lastFirm, 'last-firm'],
								['First Name', record.first || '—', 'first'],
								['Amount', record.amount, 'amount'],
							] as [string, string, string][]
						).map(([label, value, field]) => (
							<tr
								key={field}
								style={{ borderBottom: '1px solid var(--er-border)' }}
							>
								<th
									style={{
										padding: '10px 16px',
										textAlign: 'left',
										fontWeight: '600',
										color: 'var(--er-muted)',
										width: '160px',
										background: 'var(--er-bg)',
										whiteSpace: 'nowrap',
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
					marginTop: '20px',
					border: '1px solid var(--er-border)',
					borderRadius: 'var(--er-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						background: 'var(--er-surface)',
						borderBottom: '1px solid var(--er-border)',
						padding: '10px 16px',
						fontSize: '13px',
						color: 'var(--er-muted)',
						fontFamily: 'var(--er-font)',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<span>Document: {record.fileNum}.pdf</span>
					<a
						href={`/${record.fileNum}.pdf`}
						download
						style={{
							color: 'var(--er-primary)',
							fontSize: '12px',
							fontWeight: '600',
							textDecoration: 'none',
						}}
					>
						Download PDF
					</a>
				</div>
				<iframe
					src={`/${record.fileNum}.pdf`}
					style={{
						width: '100%',
						height: '400px',
						border: 'none',
						display: 'block',
					}}
					title={`Deed ${record.fileNum}`}
				/>
			</div>
		</div>
	);
}

export default function TaxesResultsGrid() {
	const [ready, setReady] = useState(false);
	const [view, setView] = useState<'list' | 'detail'>('list');
	const [currentFile, setCurrentFile] = useState<string | null>(null);
	const [results, setResults] = useState(deeds);
	const [page, setPage] = useState(1);

	useEffect(() => {
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

		const onPop = () => {
			const st = getUrlState();
			if (st.file) {
				setView('detail');
				setCurrentFile(st.file);
			} else {
				setView('list');
				setResults(
					searchDeeds({
						lastFirm: st.lastFirm,
						first: st.first,
						index: st.index !== 'ALL' ? st.index : undefined,
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
		window.addEventListener('popstate', onPop);
		window.addEventListener('taxes:search', onSearch);
		window.addEventListener('taxes:view', onView);
		return () => {
			window.removeEventListener('popstate', onPop);
			window.removeEventListener('taxes:search', onSearch);
			window.removeEventListener('taxes:view', onView);
		};
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

	if (view === 'detail' && currentFile) {
		const record = deeds.find((d) => d.fileNum === currentFile);
		if (record) {
			return (
				<RecordViewer
					record={record}
					onBack={() => {
						history.back();
					}}
				/>
			);
		}
	}

	const totalPages = Math.ceil(results.length / PER_PAGE);
	const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const viewRecord = (fileNum: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set('file', fileNum);
		history.pushState(null, '', url.toString());
		window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
		window.scrollTo(0, 0);
	};

	return (
		<div data-component="taxes-results-grid" data-framework="react">
			<div
				style={{
					padding: '10px 0',
					marginBottom: '8px',
					color: 'var(--er-muted)',
					fontSize: '13px',
					fontFamily: 'var(--er-font)',
				}}
			>
				{results.length} record{results.length !== 1 ? 's' : ''} found
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
							{[
								'File #',
								'Index',
								'Date',
								'SAT',
								'Last / Firm',
								'First',
								'Amount',
								'Status',
								'',
							].map((h) => (
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
						{pageItems.map((d, i) => (
							<tr
								key={d.fileNum}
								data-file-num={d.fileNum}
								style={{
									borderBottom: '1px solid var(--er-border)',
									background:
										i % 2 === 0 ? 'var(--er-surface)' : 'var(--er-bg)',
								}}
							>
								<td
									style={{
										padding: '8px 12px',
										fontFamily: 'monospace',
										fontWeight: '600',
										color: 'var(--er-text)',
										whiteSpace: 'nowrap',
									}}
								>
									{d.fileNum}
								</td>
								<td style={{ padding: '8px 12px' }}>
									<span
										style={{
											background: 'var(--er-bg)',
											border: '1px solid var(--er-border)',
											borderRadius: '3px',
											padding: '1px 6px',
											fontSize: '11px',
											fontWeight: '700',
											color: 'var(--er-text)',
										}}
									>
										{d.index}
									</span>
								</td>
								<td
									style={{
										padding: '8px 12px',
										whiteSpace: 'nowrap',
										color: 'var(--er-muted)',
									}}
								>
									{d.recordDate}
								</td>
								<td
									style={{
										padding: '8px 12px',
										color: d.sat ? 'var(--er-recorded)' : 'var(--er-muted)',
										fontWeight: d.sat ? '600' : '400',
									}}
								>
									{d.sat ? 'SAT' : ''}
								</td>
								<td style={{ padding: '8px 12px' }}>{d.lastFirm}</td>
								<td style={{ padding: '8px 12px' }}>{d.first}</td>
								<td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
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
											borderRadius: 'var(--er-radius)',
											padding: '4px 10px',
											fontSize: '12px',
											cursor: 'pointer',
											fontFamily: 'var(--er-font)',
										}}
									>
										View
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{totalPages > 1 && (
				<div
					style={{
						display: 'flex',
						gap: '6px',
						marginTop: '16px',
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
						<button
							key={n}
							type="button"
							onClick={() => setPage(n)}
							style={{
								padding: '5px 10px',
								border: `1px solid ${n === page ? 'var(--er-primary)' : 'var(--er-border)'}`,
								borderRadius: 'var(--er-radius)',
								background: n === page ? 'var(--er-primary)' : 'transparent',
								color: n === page ? '#fff' : 'var(--er-text)',
								cursor: 'pointer',
								fontFamily: 'var(--er-font)',
								fontSize: '13px',
							}}
						>
							{n}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
