/**
 * @qscrape L2 / react / taxes
 * @component TaxesApp
 */
import { useEffect, useState } from 'react';
import { fakeGet } from '../../../../data/api';
import type {
	DeedRecord,
	IndexType,
	StatusType,
} from '../../../../data/taxes/deeds';
import {
	deeds,
	indexLabels,
	indexTypes,
	searchDeeds,
} from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';
import styles from './TaxesApp.module.css';

// ── URL routing helpers ──────────────────────────────────────────────────────

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}

function pathToState(): { page: Page; fileNum?: string } {
	const seg = window.location.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const p = new URLSearchParams(window.location.search);
	if (seg === 'search') {
		return { page: 'search' };
	}
	if (seg === 'viewer') {
		return { page: 'viewer', fileNum: p.get('file') ?? undefined };
	}
	if (seg === 'how-to') {
		return { page: 'howto' };
	}
	if (seg === 'recording-fees') {
		return { page: 'fees' };
	}
	return { page: 'home' };
}

function pageToPath(p: Page, extra?: string): string {
	const base = getBase();
	if (p === 'search') {
		return `${base}search`;
	}
	if (p === 'viewer') {
		return `${base}viewer${extra ? `?file=${encodeURIComponent(extra)}` : ''}`;
	}
	if (p === 'howto') {
		return `${base}how-to`;
	}
	if (p === 'fees') {
		return `${base}recording-fees`;
	}
	return base;
}

type Page = 'home' | 'search' | 'viewer' | 'howto' | 'fees';

interface TaxesAppProps {
	initialPage?: Page;
	initialFileNum?: string;
}

function StatusBadge({ status }: { status: StatusType }) {
	return (
		<span
			className={`${styles.statusBadge} ${styles[`status_${status.toLowerCase()}`]}`}
		>
			{status}
		</span>
	);
}

function TaxesShell({
	children,
	activePage,
	onNavigate,
}: {
	children: React.ReactNode;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	return (
		<div className={styles.shell}>
			<header className={styles.header}>
				<div className={styles.headerTop}>
					<div className={styles.headerInner}>
						<div className={styles.headerBrand}>
							<div className={styles.headerCrest}>⚒</div>
							<div>
								<div className={styles.headerTitle}>
									Eldoria Registry of Deeds
								</div>
								<div className={styles.headerSub}>
									Granite Flats County · Official Records System
								</div>
							</div>
						</div>
						<div className={styles.headerMeta}>
							<div>Year 312 Record System</div>
							<div className={styles.headerVersion}>Version 4.2.1</div>
						</div>
					</div>
				</div>
				<nav className={styles.headerNav}>
					<div className={styles.headerNavInner}>
						{(
							[
								['home', 'Home'],
								['search', 'Search Records'],
								['howto', 'How-To Guides'],
								['fees', 'Recording Fees'],
							] as [Page, string][]
						).map(([p, label]) => (
							<button
								type="button"
								key={p}
								className={`${styles.navItem} ${activePage === p ? styles.navItemActive : ''}`}
								onClick={() => onNavigate(p)}
							>
								{label}
							</button>
						))}
					</div>
				</nav>
			</header>

			<main className={styles.main}>{children}</main>

			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<p>Eldoria Registry of Deeds · Granite Flats County · Year 312</p>
					<p className={styles.footerMuted}>
						Official records system. For research and informational purposes
						only.
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage({
	onNavigate,
}: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	return (
		<div className={styles.homePage}>
			<div className={styles.homeHero}>
				<h1 className={styles.homeTitle}>Eldoria Registry of Deeds</h1>
				<p className={styles.homeSubtitle}>
					Official real property records for Granite Flats County. Search deeds,
					mortgages, liens, and other recorded instruments.
				</p>
				<button
					type="button"
					className={styles.homeSearchBtn}
					onClick={() => onNavigate('search')}
				>
					Search Records →
				</button>
			</div>

			<div className={styles.homeGrid}>
				<div className={styles.homeCard}>
					<div className={styles.homeCardIcon}>🔍</div>
					<h2 className={styles.homeCardTitle}>Search Records</h2>
					<p className={styles.homeCardDesc}>
						Search by party name, date range, or instrument type. Full text
						search across all {deeds.length} recorded instruments.
					</p>
					<button
						type="button"
						className={styles.homeCardBtn}
						onClick={() => onNavigate('search')}
					>
						Go to Search
					</button>
				</div>
				<div className={styles.homeCard}>
					<div className={styles.homeCardIcon}>📄</div>
					<h2 className={styles.homeCardTitle}>How-To Guides</h2>
					<p className={styles.homeCardDesc}>
						Step-by-step guides for interpreting each instrument type — deeds,
						mortgages, liens, easements, and more.
					</p>
					<button
						type="button"
						className={styles.homeCardBtn}
						onClick={() => onNavigate('howto')}
					>
						View Guides
					</button>
				</div>
				<div className={styles.homeCard}>
					<div className={styles.homeCardIcon}>💰</div>
					<h2 className={styles.homeCardTitle}>Recording Fees</h2>
					<p className={styles.homeCardDesc}>
						Current fee schedule for recording new instruments. Updated Year
						312.
					</p>
					<button
						type="button"
						className={styles.homeCardBtn}
						onClick={() => onNavigate('fees')}
					>
						View Fees
					</button>
				</div>
			</div>

			<div className={styles.officeHours}>
				<h2 className={styles.officeHoursTitle}>Office Hours</h2>
				<table className={styles.officeTable}>
					<tbody>
						<tr>
							<td>Monday – Friday</td>
							<td>08:00 – 17:00</td>
						</tr>
						<tr>
							<td>Saturday</td>
							<td>09:00 – 13:00</td>
						</tr>
						<tr>
							<td>Sunday</td>
							<td>Closed</td>
						</tr>
					</tbody>
				</table>
				<p className={styles.officeNote}>
					Counter services: Registry Tower, Z-Level 2, Room 204. Emergency
					filings: contact duty officer at <em>duty@registry.eldoria.gov</em>
				</p>
			</div>
		</div>
	);
}

function SearchPage({
	onNavigate,
}: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const [lastFirm, setLastFirm] = useState('');
	const [first, setFirst] = useState('');
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
	const [index, setIndex] = useState('ALL');
	const [results, setResults] = useState<DeedRecord[]>(deeds);
	const [_searched, setSearched] = useState(false);
	const [page, setPage] = useState(1);
	const PER_PAGE = 10;

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const r = searchDeeds({
			lastFirm,
			first,
			index: index === 'ALL' ? undefined : index,
		});
		setResults(r);
		setSearched(true);
		setPage(1);
	};

	const totalPages = Math.ceil(results.length / PER_PAGE);
	const pageResults = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	return (
		<div className={styles.searchPage}>
			<h1 className={styles.pageTitle}>Search Records</h1>

			{/* Search form */}
			<form
				className={styles.searchForm}
				onSubmit={handleSearch}
				id="ctl00_MainContent_searchForm"
			>
				<div className={styles.formGrid}>
					<div className={styles.formGroup}>
						<label
							className={styles.formLabel}
							htmlFor="ctl00_MainContent_txtLastName"
						>
							Last Name / Firm Name
						</label>
						<input
							id="ctl00_MainContent_txtLastName"
							name="ctl00$MainContent$txtLastName"
							type="text"
							className={styles.formInput}
							value={lastFirm}
							onChange={(e) => setLastFirm(e.target.value)}
							placeholder="e.g. ARMOK HOLDINGS"
						/>
					</div>
					<div className={styles.formGroup}>
						<label
							className={styles.formLabel}
							htmlFor="ctl00_MainContent_txtFirstName"
						>
							First Name
						</label>
						<input
							id="ctl00_MainContent_txtFirstName"
							name="ctl00$MainContent$txtFirstName"
							type="text"
							className={styles.formInput}
							value={first}
							onChange={(e) => setFirst(e.target.value)}
						/>
					</div>
					<div className={styles.formGroup}>
						<label
							className={styles.formLabel}
							htmlFor="ctl00_MainContent_txtDateFrom"
						>
							Record Date From
						</label>
						<input
							id="ctl00_MainContent_txtDateFrom"
							name="ctl00$MainContent$txtDateFrom"
							type="text"
							className={styles.formInput}
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							placeholder="MM/DD/YYYY"
						/>
					</div>
					<div className={styles.formGroup}>
						<label
							className={styles.formLabel}
							htmlFor="ctl00_MainContent_txtDateTo"
						>
							Record Date To
						</label>
						<input
							id="ctl00_MainContent_txtDateTo"
							name="ctl00$MainContent$txtDateTo"
							type="text"
							className={styles.formInput}
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							placeholder="MM/DD/YYYY"
						/>
					</div>
					<div className={styles.formGroup}>
						<label
							className={styles.formLabel}
							htmlFor="ctl00_MainContent_ddlIndex"
						>
							Index Type
						</label>
						<select
							id="ctl00_MainContent_ddlIndex"
							name="ctl00$MainContent$ddlIndex"
							className={styles.formSelect}
							value={index}
							onChange={(e) => setIndex(e.target.value)}
						>
							<option value="ALL">All Types</option>
							{indexTypes.map((t) => (
								<option key={t} value={t}>
									{t} — {indexLabels[t]}
								</option>
							))}
						</select>
					</div>
				</div>

				<input
					type="hidden"
					name="__VIEWSTATE"
					value="dGhpc0lzTm90UmVhbFZpZXdTdGF0ZQ=="
				/>
				<input type="hidden" name="__EVENTVALIDATION" value="QScrapeL2Test" />

				<div className={styles.formActions}>
					<button
						type="submit"
						className={styles.searchBtn}
						id="ctl00_MainContent_btnSearch"
						name="ctl00$MainContent$btnSearch"
					>
						Search
					</button>
					<button
						type="button"
						className={styles.clearBtn}
						onClick={() => {
							setLastFirm('');
							setFirst('');
							setDateFrom('');
							setDateTo('');
							setIndex('ALL');
							setResults(deeds);
							setSearched(false);
						}}
					>
						Clear
					</button>
				</div>
			</form>

			{/* Results */}
			<div
				className={styles.resultsSection}
				id="ctl00_MainContent_resultsPanel"
			>
				<div className={styles.resultsHeader}>
					<span className={styles.resultsCount}>
						{results.length} record{results.length !== 1 ? 's' : ''} found
					</span>
					{totalPages > 1 && (
						<span className={styles.resultsPaging}>
							Page {page} of {totalPages}
						</span>
					)}
				</div>

				<div className={styles.resultsTableWrap}>
					<table
						className={styles.resultsTable}
						id="ctl00_MainContent_gvResults"
					>
						<thead>
							<tr className={styles.tableHead}>
								<th>File #</th>
								<th>Index</th>
								<th>Record Date</th>
								<th>SAT</th>
								<th>Last / Firm</th>
								<th>First</th>
								<th>Amount</th>
								<th>Status</th>
								<th>View</th>
							</tr>
						</thead>
						<tbody>
							{pageResults.map((d, i) => (
								<tr
									key={d.fileNum}
									className={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
									data-file-num={d.fileNum}
								>
									<td className={styles.fileNum}>{d.fileNum}</td>
									<td>
										<span className={styles.indexBadge}>{d.index}</span>
									</td>
									<td className={styles.recordDate}>{d.recordDate}</td>
									<td>{d.sat ? 'SAT' : ''}</td>
									<td>{d.lastFirm}</td>
									<td>{d.first}</td>
									<td className={styles.amount}>{d.amount}</td>
									<td>
										<StatusBadge status={d.status} />
									</td>
									<td>
										<button
											type="button"
											className={styles.viewBtn}
											onClick={() => onNavigate('viewer', d.fileNum)}
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
					<div className={styles.pagination}>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<button
								type="button"
								key={p}
								className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
								onClick={() => setPage(p)}
							>
								{p}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function ViewerPage({
	fileNum,
	onNavigate,
}: {
	fileNum: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const record = deeds.find((d) => d.fileNum === fileNum);

	if (!record) {
		return (
			<div className={styles.notFound}>
				<h1>Record not found</h1>
				<button type="button" onClick={() => onNavigate('search')}>
					← Back to Search
				</button>
			</div>
		);
	}

	return (
		<div className={styles.viewerPage}>
			<nav className={styles.breadcrumb}>
				<button type="button" onClick={() => onNavigate('home')}>
					Home
				</button>
				{' / '}
				<button type="button" onClick={() => onNavigate('search')}>
					Search
				</button>
				{' / '}
				<span>File {record.fileNum}</span>
			</nav>

			<div className={styles.viewerHeader}>
				<h1 className={styles.viewerTitle}>Document Viewer</h1>
				<div className={styles.viewerMeta}>
					<span>
						File No: <strong>{record.fileNum}</strong>
					</span>
					<span>
						Index: <strong>{record.index}</strong> —{' '}
						{indexLabels[record.index as IndexType]}
					</span>
					<span>
						Filed: <strong>{record.recordDate}</strong>
					</span>
					<span>
						Recorded: <strong className={styles.recordedStamp}>RECORDED</strong>
					</span>
				</div>
			</div>

			<div className={styles.viewerDetail}>
				<table className={styles.detailTable}>
					<tbody>
						<tr>
							<th>File Number</th>
							<td data-field="file-num">{record.fileNum}</td>
						</tr>
						<tr>
							<th>Index Type</th>
							<td data-field="index">
								{record.index} — {indexLabels[record.index as IndexType]}
							</td>
						</tr>
						<tr>
							<th>Record Date</th>
							<td data-field="record-date">{record.recordDate}</td>
						</tr>
						<tr>
							<th>Satisfied</th>
							<td data-field="sat">{record.sat ? 'Yes' : 'No'}</td>
						</tr>
						<tr>
							<th>Last Name / Firm</th>
							<td data-field="last-firm">{record.lastFirm}</td>
						</tr>
						<tr>
							<th>First Name</th>
							<td data-field="first">{record.first || '—'}</td>
						</tr>
						<tr>
							<th>Amount</th>
							<td data-field="amount">{record.amount}</td>
						</tr>
						<tr>
							<th>Status</th>
							<td>
								<StatusBadge status={record.status} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className={styles.pdfViewer}>
				<div className={styles.pdfViewerHeader}>
					Document: {record.fileNum}.pdf
				</div>
				<iframe
					src={`/${record.fileNum}.pdf`}
					className={styles.pdfFrame}
					title={`Deed document ${record.fileNum}`}
				/>
			</div>
		</div>
	);
}

function HowToPage() {
	const guides = [
		{
			type: 'DEED',
			file: 'how-to-deed',
			title: 'How to Read a Deed',
			steps: [
				'Locate the grantor and grantee names in the heading.',
				'Identify the property description in the body text.',
				'Check for any reservations or exceptions listed.',
				'Verify the notarization and recording stamp.',
			],
		},
		{
			type: 'MTG',
			file: 'how-to-mtg',
			title: 'How to Read a Mortgage',
			steps: [
				'Identify the mortgagor (borrower) and mortgagee (lender).',
				'Locate the principal amount and interest rate.',
				'Check the maturity date and payment schedule.',
				'Review any satisfaction or release filings.',
			],
		},
		{
			type: 'LIEN',
			file: 'how-to-lien',
			title: 'How to Read a Lien',
			steps: [
				'Identify the lienor and lienee parties.',
				'Determine the lien amount and accrual date.',
				'Check whether any satisfaction has been recorded.',
				'Review related deed filings for context.',
			],
		},
		{
			type: 'ESMT',
			file: 'how-to-esmt',
			title: 'How to Read an Easement',
			steps: [
				'Identify the dominant and servient estates.',
				'Locate the easement purpose and scope description.',
				'Check for any conditions or expiration terms.',
				'Review plat map references if cited.',
			],
		},
		{
			type: 'AFF',
			file: 'how-to-aff',
			title: 'How to Read an Affidavit',
			steps: [
				'Identify the affiant and notary.',
				'Locate the statement of facts.',
				'Check the notarization date and seal.',
				'Review any exhibits or attachments cited.',
			],
		},
		{
			type: 'ASGN',
			file: 'how-to-asgn',
			title: 'How to Read an Assignment',
			steps: [
				'Identify the assignor and assignee.',
				'Locate the original instrument being assigned.',
				'Check the effective date of assignment.',
				'Verify recording stamps.',
			],
		},
		{
			type: 'NTC',
			file: 'how-to-ntc',
			title: 'How to Read a Notice',
			steps: [
				'Identify the parties giving and receiving notice.',
				'Locate the subject matter description.',
				'Check the notice date and service method.',
				'Review related filings referenced.',
			],
		},
		{
			type: 'REL',
			file: 'how-to-rel',
			title: 'How to Read a Release',
			steps: [
				'Identify the releasing and released parties.',
				'Locate the original instrument being released.',
				'Check the effective release date.',
				'Confirm satisfaction recording.',
			],
		},
	];

	return (
		<div className={styles.howToPage}>
			<h1 className={styles.pageTitle}>How-To Guides</h1>
			<p className={styles.howToIntro}>
				Step-by-step guides for each instrument type recorded in the Eldoria
				Registry of Deeds.
			</p>

			<div className={styles.guidesGrid}>
				{guides.map((g, i) => (
					<div
						key={g.type}
						className={styles.guideCard}
						data-guide-type={g.type}
					>
						<div className={styles.guideNum}>Step {i + 1}</div>
						<div className={styles.guideType}>{g.type}</div>
						<h2 className={styles.guideTitle}>{g.title}</h2>
						<ol className={styles.guideSteps}>
							{g.steps.map((step, j) => (
								<li key={j}>{step}</li>
							))}
						</ol>
						<a
							href={`/how-to/${g.file}.pdf`}
							className={styles.guidePdfLink}
							target="_blank"
							rel="noopener"
						>
							Download PDF Guide ↗
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

function FeesPage() {
	const fees = [
		{
			type: 'DEED',
			label: 'Deed',
			firstPage: '15.00 GS',
			addlPage: '3.00 GS',
			notes: 'Includes transfer tax',
		},
		{
			type: 'MTG',
			label: 'Mortgage',
			firstPage: '20.00 GS',
			addlPage: '3.00 GS',
			notes: 'Plus 0.5% of principal',
		},
		{
			type: 'LIEN',
			label: 'Lien',
			firstPage: '9.00 GS',
			addlPage: '3.00 GS',
			notes: '',
		},
		{
			type: 'ESMT',
			label: 'Easement',
			firstPage: '12.00 GS',
			addlPage: '3.00 GS',
			notes: '',
		},
		{
			type: 'AFF',
			label: 'Affidavit',
			firstPage: '10.00 GS',
			addlPage: '2.00 GS',
			notes: '',
		},
		{
			type: 'ASGN',
			label: 'Assignment',
			firstPage: '12.00 GS',
			addlPage: '2.00 GS',
			notes: '',
		},
		{
			type: 'NTC',
			label: 'Notice',
			firstPage: '8.00 GS',
			addlPage: '2.00 GS',
			notes: '',
		},
		{
			type: 'REL',
			label: 'Release',
			firstPage: '0.00 GS',
			addlPage: '0.00 GS',
			notes: 'No fee for release recording',
		},
	];

	return (
		<div className={styles.feesPage}>
			<h1 className={styles.pageTitle}>Recording Fee Schedule</h1>
			<p className={styles.feesIntro}>
				Current fees effective Year 312. All amounts in Gold Sovereigns (GS).
			</p>

			<div className={styles.feesTableWrap}>
				<table className={styles.feesTable}>
					<thead>
						<tr>
							<th>Instrument Type</th>
							<th>First Page</th>
							<th>Each Additional Page</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						{fees.map((f, i) => (
							<tr
								key={f.type}
								className={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
								data-fee-type={f.type}
							>
								<td>
									<strong>{f.type}</strong> — {f.label}
								</td>
								<td>{f.firstPage}</td>
								<td>{f.addlPage}</td>
								<td className={styles.feeNote}>{f.notes || '—'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className={styles.feesNote}>
				<h2>Payment Methods</h2>
				<p>
					Gold Sovereigns (GS) accepted at counter. Copper Coins (CC) accepted
					at 1:100 exchange rate. Checks payable to Eldoria County Registry. No
					credit runes accepted.
				</p>
				<h2>Expedited Recording</h2>
				<p>
					Same-session recording: additional 25.00 GS surcharge. Contact duty
					officer.
				</p>
			</div>
		</div>
	);
}

export default function TaxesApp({
	initialPage = 'home',
	initialFileNum,
}: TaxesAppProps) {
	const [ready, setReady] = useState(false);
	const [page, setPage] = useState<Page>(initialPage);
	const [fileNum, setFileNum] = useState<string | undefined>(initialFileNum);

	useEffect(() => {
		const s = pathToState();
		setPage(s.page);
		if (s.fileNum) {
			setFileNum(s.fileNum);
		}

		fakeGet(null).then(() => setReady(true));

		const onPop = () => {
			const st = pathToState();
			setPage(st.page);
			if (st.fileNum) {
				setFileNum(st.fileNum);
			}
			window.scrollTo(0, 0);
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);

	const navigate = (p: Page, extra?: string) => {
		setPage(p);
		if (p === 'viewer' && extra) {
			setFileNum(extra);
		}
		history.pushState(null, '', pageToPath(p, extra));
		window.scrollTo(0, 0);
	};

	if (!ready) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					fontFamily: 'IBM Plex Sans,system-ui',
					color: '#6c757d',
					background: '#f8f9fa',
				}}
			>
				Loading…
			</div>
		);
	}

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <HomePage onNavigate={navigate} />;
			case 'search':
				return <SearchPage onNavigate={navigate} />;
			case 'viewer':
				return <ViewerPage fileNum={fileNum || ''} onNavigate={navigate} />;
			case 'howto':
				return <HowToPage />;
			case 'fees':
				return <FeesPage />;
			default:
				return <HomePage onNavigate={navigate} />;
		}
	};

	return (
		<TaxesShell activePage={page} onNavigate={navigate}>
			{renderPage()}
		</TaxesShell>
	);
}
