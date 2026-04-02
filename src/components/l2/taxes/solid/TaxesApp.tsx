/**
 * @qscrape L2 / solid / taxes
 * @component TaxesApp
 */

import type { JSX } from 'solid-js';
import {
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from 'solid-js';
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
import styles from '../../react/taxes/TaxesApp.module.css';

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

function StatusBadge(props: { status: StatusType }) {
	return (
		<span
			class={`${styles.statusBadge} ${styles[`status_${props.status.toLowerCase()}`]}`}
		>
			{props.status}
		</span>
	);
}

function TaxesShell(props: {
	children: JSX.Element;
	activePage: Page;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	return (
		<div class={styles.shell}>
			<header class={styles.header}>
				<div class={styles.headerTop}>
					<div class={styles.headerInner}>
						<div class={styles.headerBrand}>
							<div class={styles.headerCrest}>⚒</div>
							<div>
								<div class={styles.headerTitle}>Eldoria Registry of Deeds</div>
								<div class={styles.headerSub}>
									Granite Flats County · Official Records System
								</div>
							</div>
						</div>
						<div class={styles.headerMeta}>
							<div>Year 312 Record System</div>
							<div class={styles.headerVersion}>Version 4.2.1</div>
						</div>
					</div>
				</div>
				<nav class={styles.headerNav}>
					<div class={styles.headerNavInner}>
						<For
							each={
								[
									['home', 'Home'],
									['search', 'Search Records'],
									['howto', 'How-To Guides'],
									['fees', 'Recording Fees'],
								] as [Page, string][]
							}
						>
							{([p, label]) => (
								<button
									type="button"
									class={`${styles.navItem} ${props.activePage === p ? styles.navItemActive : ''}`}
									onClick={() => props.onNavigate(p)}
								>
									{label}
								</button>
							)}
						</For>
					</div>
				</nav>
			</header>
			<main class={styles.main}>{props.children}</main>
			<footer class={styles.footer}>
				<div class={styles.footerInner}>
					<p>Eldoria Registry of Deeds · Granite Flats County · Year 312</p>
					<p class={styles.footerMuted}>
						Official records system. For research and informational purposes
						only.
					</p>
				</div>
			</footer>
		</div>
	);
}

function HomePage(props: { onNavigate: (page: Page, extra?: string) => void }) {
	return (
		<div class={styles.homePage}>
			<div class={styles.homeHero}>
				<h1 class={styles.homeTitle}>Eldoria Registry of Deeds</h1>
				<p class={styles.homeSubtitle}>
					Official real property records for Granite Flats County. Search deeds,
					mortgages, liens, and other recorded instruments.
				</p>
				<button
					type="button"
					class={styles.homeSearchBtn}
					onClick={() => props.onNavigate('search')}
				>
					Search Records →
				</button>
			</div>
			<div class={styles.homeGrid}>
				<div class={styles.homeCard}>
					<div class={styles.homeCardIcon}>🔍</div>
					<h2 class={styles.homeCardTitle}>Search Records</h2>
					<p class={styles.homeCardDesc}>
						Search by party name, date range, or instrument type. Full text
						search across all {deeds.length} recorded instruments.
					</p>
					<button
						type="button"
						class={styles.homeCardBtn}
						onClick={() => props.onNavigate('search')}
					>
						Go to Search
					</button>
				</div>
				<div class={styles.homeCard}>
					<div class={styles.homeCardIcon}>📄</div>
					<h2 class={styles.homeCardTitle}>How-To Guides</h2>
					<p class={styles.homeCardDesc}>
						Step-by-step guides for interpreting each instrument type — deeds,
						mortgages, liens, easements, and more.
					</p>
					<button
						type="button"
						class={styles.homeCardBtn}
						onClick={() => props.onNavigate('howto')}
					>
						View Guides
					</button>
				</div>
				<div class={styles.homeCard}>
					<div class={styles.homeCardIcon}>💰</div>
					<h2 class={styles.homeCardTitle}>Recording Fees</h2>
					<p class={styles.homeCardDesc}>
						Current fee schedule for recording new instruments. Updated Year
						312.
					</p>
					<button
						type="button"
						class={styles.homeCardBtn}
						onClick={() => props.onNavigate('fees')}
					>
						View Fees
					</button>
				</div>
			</div>
			<div class={styles.officeHours}>
				<h2 class={styles.officeHoursTitle}>Office Hours</h2>
				<table class={styles.officeTable}>
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
				<p class={styles.officeNote}>
					Counter services: Registry Tower, Z-Level 2, Room 204. Emergency
					filings: contact duty officer at <em>duty@registry.eldoria.gov</em>
				</p>
			</div>
		</div>
	);
}

function SearchPage(props: {
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const [lastFirm, setLastFirm] = createSignal('');
	const [first, setFirst] = createSignal('');
	const [dateFrom, setDateFrom] = createSignal('');
	const [dateTo, setDateTo] = createSignal('');
	const [index, setIndex] = createSignal('ALL');
	const [results, setResults] = createSignal<DeedRecord[]>(deeds);
	const [page, setPage] = createSignal(1);
	const PER_PAGE = 10;

	const totalPages = () => Math.ceil(results().length / PER_PAGE);
	const pageResults = () =>
		results().slice((page() - 1) * PER_PAGE, page() * PER_PAGE);

	const handleSearch = (e: Event) => {
		e.preventDefault();
		const r = searchDeeds({
			lastFirm: lastFirm(),
			first: first(),
			index: index() === 'ALL' ? undefined : index(),
		});
		setResults(r);
		setPage(1);
	};

	return (
		<div class={styles.searchPage}>
			<h1 class={styles.pageTitle}>Search Records</h1>
			<form
				class={styles.searchForm}
				onSubmit={handleSearch}
				id="ctl00_MainContent_searchForm"
			>
				<div class={styles.formGrid}>
					<div class={styles.formGroup}>
						<label class={styles.formLabel} for="ctl00_MainContent_txtLastName">
							Last Name / Firm Name
						</label>
						<input
							id="ctl00_MainContent_txtLastName"
							name="ctl00$MainContent$txtLastName"
							type="text"
							class={styles.formInput}
							value={lastFirm()}
							onInput={(e) => setLastFirm(e.currentTarget.value)}
							placeholder="e.g. ARMOK HOLDINGS"
						/>
					</div>
					<div class={styles.formGroup}>
						<label
							class={styles.formLabel}
							for="ctl00_MainContent_txtFirstName"
						>
							First Name
						</label>
						<input
							id="ctl00_MainContent_txtFirstName"
							name="ctl00$MainContent$txtFirstName"
							type="text"
							class={styles.formInput}
							value={first()}
							onInput={(e) => setFirst(e.currentTarget.value)}
						/>
					</div>
					<div class={styles.formGroup}>
						<label class={styles.formLabel} for="ctl00_MainContent_txtDateFrom">
							Record Date From
						</label>
						<input
							id="ctl00_MainContent_txtDateFrom"
							name="ctl00$MainContent$txtDateFrom"
							type="text"
							class={styles.formInput}
							value={dateFrom()}
							onInput={(e) => setDateFrom(e.currentTarget.value)}
							placeholder="MM/DD/YYYY"
						/>
					</div>
					<div class={styles.formGroup}>
						<label class={styles.formLabel} for="ctl00_MainContent_txtDateTo">
							Record Date To
						</label>
						<input
							id="ctl00_MainContent_txtDateTo"
							name="ctl00$MainContent$txtDateTo"
							type="text"
							class={styles.formInput}
							value={dateTo()}
							onInput={(e) => setDateTo(e.currentTarget.value)}
							placeholder="MM/DD/YYYY"
						/>
					</div>
					<div class={styles.formGroup}>
						<label class={styles.formLabel} for="ctl00_MainContent_ddlIndex">
							Index Type
						</label>
						<select
							id="ctl00_MainContent_ddlIndex"
							name="ctl00$MainContent$ddlIndex"
							class={styles.formSelect}
							value={index()}
							onChange={(e) => setIndex(e.currentTarget.value)}
						>
							<option value="ALL">All Types</option>
							<For each={indexTypes}>
								{(t) => (
									<option value={t}>
										{t} — {indexLabels[t]}
									</option>
								)}
							</For>
						</select>
					</div>
				</div>
				<input
					type="hidden"
					name="__VIEWSTATE"
					value="dGhpc0lzTm90UmVhbFZpZXdTdGF0ZQ=="
				/>
				<input type="hidden" name="__EVENTVALIDATION" value="QScrapeL2Test" />
				<div class={styles.formActions}>
					<button
						type="submit"
						class={styles.searchBtn}
						id="ctl00_MainContent_btnSearch"
						name="ctl00$MainContent$btnSearch"
					>
						Search
					</button>
					<button
						type="button"
						class={styles.clearBtn}
						onClick={() => {
							setLastFirm('');
							setFirst('');
							setDateFrom('');
							setDateTo('');
							setIndex('ALL');
							setResults(deeds);
							setPage(1);
						}}
					>
						Clear
					</button>
				</div>
			</form>
			<div class={styles.resultsSection} id="ctl00_MainContent_resultsPanel">
				<div class={styles.resultsHeader}>
					<span class={styles.resultsCount}>
						{results().length} record{results().length !== 1 ? 's' : ''} found
					</span>
					<Show when={totalPages() > 1}>
						<span class={styles.resultsPaging}>
							Page {page()} of {totalPages()}
						</span>
					</Show>
				</div>
				<div class={styles.resultsTableWrap}>
					<table class={styles.resultsTable} id="ctl00_MainContent_gvResults">
						<thead>
							<tr class={styles.tableHead}>
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
							<For each={pageResults()}>
								{(d, i) => (
									<tr
										class={i() % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
										data-file-num={d.fileNum}
									>
										<td class={styles.fileNum}>{d.fileNum}</td>
										<td>
											<span class={styles.indexBadge}>{d.index}</span>
										</td>
										<td class={styles.recordDate}>{d.recordDate}</td>
										<td>{d.sat ? 'SAT' : ''}</td>
										<td>{d.lastFirm}</td>
										<td>{d.first}</td>
										<td class={styles.amount}>{d.amount}</td>
										<td>
											<StatusBadge status={d.status} />
										</td>
										<td>
											<button
												type="button"
												class={styles.viewBtn}
												onClick={() => props.onNavigate('viewer', d.fileNum)}
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
					<div class={styles.pagination}>
						<For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
							{(p) => (
								<button
									type="button"
									class={`${styles.pageBtn} ${p === page() ? styles.pageBtnActive : ''}`}
									onClick={() => setPage(p)}
								>
									{p}
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	);
}

function ViewerPage(props: {
	fileNum: string;
	onNavigate: (page: Page, extra?: string) => void;
}) {
	const record = () => deeds.find((d) => d.fileNum === props.fileNum);

	return (
		<Show
			when={record()}
			fallback={
				<div class={styles.notFound}>
					<h1>Record not found</h1>
					<button type="button" onClick={() => props.onNavigate('search')}>
						← Back to Search
					</button>
				</div>
			}
		>
			{(rec) => (
				<div class={styles.viewerPage}>
					<nav class={styles.breadcrumb}>
						<button type="button" onClick={() => props.onNavigate('home')}>
							Home
						</button>
						{' / '}
						<button type="button" onClick={() => props.onNavigate('search')}>
							Search
						</button>
						{' / '}
						<span>File {rec().fileNum}</span>
					</nav>
					<div class={styles.viewerHeader}>
						<h1 class={styles.viewerTitle}>Document Viewer</h1>
						<div class={styles.viewerMeta}>
							<span>
								File No: <strong>{rec().fileNum}</strong>
							</span>
							<span>
								Index: <strong>{rec().index}</strong> —{' '}
								{indexLabels[rec().index as IndexType]}
							</span>
							<span>
								Filed: <strong>{rec().recordDate}</strong>
							</span>
							<span>
								Recorded: <strong class={styles.recordedStamp}>RECORDED</strong>
							</span>
						</div>
					</div>
					<div class={styles.viewerDetail}>
						<table class={styles.detailTable}>
							<tbody>
								<tr>
									<th>File Number</th>
									<td data-field="file-num">{rec().fileNum}</td>
								</tr>
								<tr>
									<th>Index Type</th>
									<td data-field="index">
										{rec().index} — {indexLabels[rec().index as IndexType]}
									</td>
								</tr>
								<tr>
									<th>Record Date</th>
									<td data-field="record-date">{rec().recordDate}</td>
								</tr>
								<tr>
									<th>Satisfied</th>
									<td data-field="sat">{rec().sat ? 'Yes' : 'No'}</td>
								</tr>
								<tr>
									<th>Last Name / Firm</th>
									<td data-field="last-firm">{rec().lastFirm}</td>
								</tr>
								<tr>
									<th>First Name</th>
									<td data-field="first">{rec().first || '—'}</td>
								</tr>
								<tr>
									<th>Amount</th>
									<td data-field="amount">{rec().amount}</td>
								</tr>
								<tr>
									<th>Status</th>
									<td>
										<StatusBadge status={rec().status} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class={styles.pdfViewer}>
						<div class={styles.pdfViewerHeader}>
							Document: {rec().fileNum}.pdf
						</div>
						<iframe
							src={`/${rec().fileNum}.pdf`}
							class={styles.pdfFrame}
							title={`Deed document ${rec().fileNum}`}
						/>
					</div>
				</div>
			)}
		</Show>
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
		<div class={styles.howToPage}>
			<h1 class={styles.pageTitle}>How-To Guides</h1>
			<p class={styles.howToIntro}>
				Step-by-step guides for each instrument type recorded in the Eldoria
				Registry of Deeds.
			</p>
			<div class={styles.guidesGrid}>
				<For each={guides}>
					{(g, i) => (
						<div class={styles.guideCard} data-guide-type={g.type}>
							<div class={styles.guideNum}>Step {i() + 1}</div>
							<div class={styles.guideType}>{g.type}</div>
							<h2 class={styles.guideTitle}>{g.title}</h2>
							<ol class={styles.guideSteps}>
								<For each={g.steps}>{(step) => <li>{step}</li>}</For>
							</ol>
							<a
								href={`/how-to/${g.file}.pdf`}
								class={styles.guidePdfLink}
								target="_blank"
								rel="noopener"
							>
								Download PDF Guide ↗
							</a>
						</div>
					)}
				</For>
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
		<div class={styles.feesPage}>
			<h1 class={styles.pageTitle}>Recording Fee Schedule</h1>
			<p class={styles.feesIntro}>
				Current fees effective Year 312. All amounts in Gold Sovereigns (GS).
			</p>
			<div class={styles.feesTableWrap}>
				<table class={styles.feesTable}>
					<thead>
						<tr>
							<th>Instrument Type</th>
							<th>First Page</th>
							<th>Each Additional Page</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<For each={fees}>
							{(f, i) => (
								<tr
									class={i() % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
									data-fee-type={f.type}
								>
									<td>
										<strong>{f.type}</strong> — {f.label}
									</td>
									<td>{f.firstPage}</td>
									<td>{f.addlPage}</td>
									<td class={styles.feeNote}>{f.notes || '—'}</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</div>
			<div class={styles.feesNote}>
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

export default function TaxesApp(props: {
	initialPage?: Page;
	initialFileNum?: string;
}) {
	const [ready, setReady] = createSignal(false);
	const [page, setPage] = createSignal<Page>(props.initialPage || 'home');
	const [fileNum, setFileNum] = createSignal<string | undefined>(
		props.initialFileNum,
	);

	onMount(() => {
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
		onCleanup(() => window.removeEventListener('popstate', onPop));
	});

	const navigate = (p: Page, extra?: string) => {
		setPage(p);
		if (p === 'viewer' && extra) {
			setFileNum(extra);
		}
		history.pushState(null, '', pageToPath(p, extra));
		window.scrollTo(0, 0);
	};

	return (
		<Show
			when={ready()}
			fallback={
				<div
					style={{
						display: 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'min-height': '100vh',
						'font-family': 'IBM Plex Sans,system-ui',
						color: '#6c757d',
						background: '#f8f9fa',
					}}
				>
					Loading…
				</div>
			}
		>
			<TaxesShell activePage={page()} onNavigate={navigate}>
				<Switch>
					<Match when={page() === 'home'}>
						<HomePage onNavigate={navigate} />
					</Match>
					<Match when={page() === 'search'}>
						<SearchPage onNavigate={navigate} />
					</Match>
					<Match when={page() === 'viewer'}>
						<ViewerPage fileNum={fileNum() || ''} onNavigate={navigate} />
					</Match>
					<Match when={page() === 'howto'}>
						<HowToPage />
					</Match>
					<Match when={page() === 'fees'}>
						<FeesPage />
					</Match>
					<Match when={true}>
						<HomePage onNavigate={navigate} />
					</Match>
				</Switch>
			</TaxesShell>
		</Show>
	);
}
