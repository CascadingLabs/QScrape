<!-- @qscrape L2 / vue / taxes -->
<!-- @component TaxesApp -->
<template>
  <div v-if="!ready" style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'IBM Plex Sans',system-ui;color:#6c757d;background:#f8f9fa">Loading…</div>
  <div v-else class="er-shell">
    <header class="er-header">
      <div class="er-header-top">
        <div class="er-header-inner">
          <div class="er-brand">
            <div class="er-crest">⚒</div>
            <div>
              <div class="er-title">Eldoria Registry of Deeds</div>
              <div class="er-sub">Granite Flats County · Official Records System</div>
            </div>
          </div>
          <div class="er-meta">
            <div>Year 312 Record System</div>
            <div class="er-version">Version 4.2.1</div>
          </div>
        </div>
      </div>
      <nav class="er-nav">
        <div class="er-nav-inner">
          <button v-for="p in navPages" :key="p.id"
            :class="['er-nav-item', { 'er-nav-item--active': page === p.id }]"
            @click="navigate(p.id)">{{ p.label }}</button>
        </div>
      </nav>
    </header>

    <!-- Home -->
    <main class="er-main" v-if="page === 'home'">
      <div class="er-hero">
        <h1 class="er-hero-title">Eldoria Registry of Deeds</h1>
        <p class="er-hero-sub">Official real property records for Granite Flats County.</p>
        <button class="er-hero-btn" @click="navigate('search')">Search Records →</button>
      </div>
      <div class="er-home-grid">
        <div class="er-home-card">
          <div class="er-home-icon">🔍</div>
          <h2 class="er-home-card-title">Search Records</h2>
          <p class="er-home-card-desc">Search by party name, date range, or instrument type. Full text search across all {{ deeds.length }} recorded instruments.</p>
          <button class="er-home-card-btn" @click="navigate('search')">Go to Search</button>
        </div>
        <div class="er-home-card">
          <div class="er-home-icon">📄</div>
          <h2 class="er-home-card-title">How-To Guides</h2>
          <p class="er-home-card-desc">Step-by-step guides for interpreting each instrument type.</p>
          <button class="er-home-card-btn" @click="navigate('howto')">View Guides</button>
        </div>
        <div class="er-home-card">
          <div class="er-home-icon">💰</div>
          <h2 class="er-home-card-title">Recording Fees</h2>
          <p class="er-home-card-desc">Current fee schedule for recording new instruments. Updated Year 312.</p>
          <button class="er-home-card-btn" @click="navigate('fees')">View Fees</button>
        </div>
      </div>
      <div class="er-office-hours">
        <h2 class="er-oh-title">Office Hours</h2>
        <table class="er-oh-table">
          <tbody>
            <tr><td>Monday – Friday</td><td>08:00 – 17:00</td></tr>
            <tr><td>Saturday</td><td>09:00 – 13:00</td></tr>
            <tr><td>Sunday</td><td>Closed</td></tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Search -->
    <main class="er-main" v-else-if="page === 'search'">
      <h1 class="er-page-title">Search Records</h1>
      <form class="er-search-form" @submit.prevent="doSearch" id="ctl00_MainContent_searchForm">
        <div class="er-form-grid">
          <div class="er-form-group">
            <label class="er-form-label" for="ctl00_MainContent_txtLastName">Last Name / Firm Name</label>
            <input id="ctl00_MainContent_txtLastName" name="ctl00$MainContent$txtLastName" type="text" class="er-form-input" v-model="searchLastFirm" placeholder="e.g. ARMOK HOLDINGS" />
          </div>
          <div class="er-form-group">
            <label class="er-form-label" for="ctl00_MainContent_txtFirstName">First Name</label>
            <input id="ctl00_MainContent_txtFirstName" name="ctl00$MainContent$txtFirstName" type="text" class="er-form-input" v-model="searchFirst" />
          </div>
          <div class="er-form-group">
            <label class="er-form-label" for="ctl00_MainContent_txtDateFrom">Record Date From</label>
            <input id="ctl00_MainContent_txtDateFrom" name="ctl00$MainContent$txtDateFrom" type="text" class="er-form-input" v-model="searchDateFrom" placeholder="MM/DD/YYYY" />
          </div>
          <div class="er-form-group">
            <label class="er-form-label" for="ctl00_MainContent_txtDateTo">Record Date To</label>
            <input id="ctl00_MainContent_txtDateTo" name="ctl00$MainContent$txtDateTo" type="text" class="er-form-input" v-model="searchDateTo" placeholder="MM/DD/YYYY" />
          </div>
          <div class="er-form-group">
            <label class="er-form-label" for="ctl00_MainContent_ddlIndex">Index Type</label>
            <select id="ctl00_MainContent_ddlIndex" name="ctl00$MainContent$ddlIndex" class="er-form-select" v-model="searchIndex">
              <option value="ALL">All Types</option>
              <option v-for="t in indexTypes" :key="t" :value="t">{{ t }} — {{ indexLabels[t] }}</option>
            </select>
          </div>
        </div>
        <input type="hidden" name="__VIEWSTATE" value="dGhpc0lzTm90UmVhbFZpZXdTdGF0ZQ==" />
        <input type="hidden" name="__EVENTVALIDATION" value="QScrapeL2Test" />
        <div class="er-form-actions">
          <button type="submit" class="er-search-btn" id="ctl00_MainContent_btnSearch" name="ctl00$MainContent$btnSearch">Search</button>
          <button type="button" class="er-clear-btn" @click="clearSearch">Clear</button>
        </div>
      </form>

      <div class="er-results" id="ctl00_MainContent_resultsPanel">
        <div class="er-results-header">
          <span class="er-results-count">{{ searchResults.length }} record{{ searchResults.length !== 1 ? 's' : '' }} found</span>
          <span v-if="totalSearchPages > 1" class="er-results-paging">Page {{ searchPage }} of {{ totalSearchPages }}</span>
        </div>
        <div class="er-table-wrap">
          <table class="er-results-table" id="ctl00_MainContent_gvResults">
            <thead>
              <tr class="er-table-head">
                <th>File #</th><th>Index</th><th>Record Date</th><th>SAT</th><th>Last / Firm</th><th>First</th><th>Amount</th><th>Status</th><th>View</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, i) in pagedResults" :key="d.fileNum"
                :class="i % 2 === 0 ? 'er-table-row' : 'er-table-row-alt'"
                :data-file-num="d.fileNum">
                <td class="er-file-num">{{ d.fileNum }}</td>
                <td><span class="er-index-badge">{{ d.index }}</span></td>
                <td class="er-record-date">{{ d.recordDate }}</td>
                <td>{{ d.sat ? 'SAT' : '' }}</td>
                <td>{{ d.lastFirm }}</td>
                <td>{{ d.first }}</td>
                <td class="er-amount">{{ d.amount }}</td>
                <td><span :class="['er-status', 'er-status-' + d.status.toLowerCase()]">{{ d.status }}</span></td>
                <td><button class="er-view-btn" @click="navigate('viewer', d.fileNum)">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalSearchPages > 1" class="er-pagination">
          <button v-for="p in totalSearchPages" :key="p"
            :class="['er-page-btn', { 'er-page-btn--active': searchPage === p }]"
            @click="searchPage = p">{{ p }}</button>
        </div>
      </div>
    </main>

    <!-- Viewer -->
    <main class="er-main" v-else-if="page === 'viewer'">
      <div v-if="currentRecord">
        <nav class="er-breadcrumb">
          <button @click="navigate('home')">Home</button> /
          <button @click="navigate('search')">Search</button> /
          <span>File {{ currentRecord.fileNum }}</span>
        </nav>
        <div class="er-viewer-header">
          <h1 class="er-viewer-title">Document Viewer</h1>
          <div class="er-viewer-meta">
            <span>File No: <strong>{{ currentRecord.fileNum }}</strong></span>
            <span>Index: <strong>{{ currentRecord.index }}</strong> — {{ indexLabels[currentRecord.index] }}</span>
            <span>Filed: <strong>{{ currentRecord.recordDate }}</strong></span>
            <span>Recorded: <strong class="er-recorded-stamp">RECORDED</strong></span>
          </div>
        </div>
        <div class="er-viewer-detail">
          <table class="er-detail-table">
            <tbody>
              <tr><th>File Number</th><td data-field="file-num">{{ currentRecord.fileNum }}</td></tr>
              <tr><th>Index Type</th><td data-field="index">{{ currentRecord.index }} — {{ indexLabels[currentRecord.index] }}</td></tr>
              <tr><th>Record Date</th><td data-field="record-date">{{ currentRecord.recordDate }}</td></tr>
              <tr><th>Satisfied</th><td data-field="sat">{{ currentRecord.sat ? 'Yes' : 'No' }}</td></tr>
              <tr><th>Last Name / Firm</th><td data-field="last-firm">{{ currentRecord.lastFirm }}</td></tr>
              <tr><th>First Name</th><td data-field="first">{{ currentRecord.first || '—' }}</td></tr>
              <tr><th>Amount</th><td data-field="amount">{{ currentRecord.amount }}</td></tr>
              <tr><th>Status</th><td><span :class="['er-status', 'er-status-' + currentRecord.status.toLowerCase()]">{{ currentRecord.status }}</span></td></tr>
            </tbody>
          </table>
        </div>
        <div class="er-pdf-viewer">
          <div class="er-pdf-header">Document: {{ currentRecord.fileNum }}.pdf</div>
          <iframe :src="'/' + currentRecord.fileNum + '.pdf'" class="er-pdf-frame" :title="'Deed document ' + currentRecord.fileNum" />
        </div>
      </div>
      <div v-else class="er-not-found">
        <h1>Record not found</h1>
        <button @click="navigate('search')">← Back to Search</button>
      </div>
    </main>

    <!-- How-to -->
    <main class="er-main" v-else-if="page === 'howto'">
      <h1 class="er-page-title">How-To Guides</h1>
      <div class="er-guides-grid">
        <div v-for="(g, i) in guides" :key="g.type" class="er-guide-card" :data-guide-type="g.type">
          <div class="er-guide-num">Step {{ i + 1 }}</div>
          <div class="er-guide-type">{{ g.type }}</div>
          <h2 class="er-guide-title">{{ g.title }}</h2>
          <ol class="er-guide-steps">
            <li v-for="step in g.steps" :key="step">{{ step }}</li>
          </ol>
          <a :href="'/how-to/' + g.file + '.pdf'" class="er-guide-pdf" target="_blank" rel="noopener">Download PDF Guide ↗</a>
        </div>
      </div>
    </main>

    <!-- Fees -->
    <main class="er-main" v-else-if="page === 'fees'">
      <h1 class="er-page-title">Recording Fee Schedule</h1>
      <p class="er-fees-intro">Current fees effective Year 312. All amounts in Gold Sovereigns (GS).</p>
      <div class="er-table-wrap">
        <table class="er-fees-table">
          <thead>
            <tr><th>Instrument Type</th><th>First Page</th><th>Each Additional Page</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr v-for="(f, i) in fees" :key="f.type" :class="i % 2 === 0 ? 'er-table-row' : 'er-table-row-alt'" :data-fee-type="f.type">
              <td><strong>{{ f.type }}</strong> — {{ f.label }}</td>
              <td>{{ f.firstPage }}</td>
              <td>{{ f.addlPage }}</td>
              <td class="er-fee-note">{{ f.notes || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="er-fees-note">
        <h2>Payment Methods</h2>
        <p>Gold Sovereigns (GS) accepted at counter. Copper Coins (CC) accepted at 1:100 exchange rate.</p>
      </div>
    </main>

    <footer class="er-footer">
      <div class="er-footer-inner">
        <p>Eldoria Registry of Deeds · Granite Flats County · Year 312</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { deeds, searchDeeds } from '../../../../data/taxes/deeds';

type Page = 'home' | 'search' | 'viewer' | 'howto' | 'fees';

// ── URL routing helpers ────────────────────────────────────────────────────
function getBase() {
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
function pageToPath(p: Page, extra?: string) {
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

const ready = ref(false);
const page = ref<Page>('home');
const currentFileNum = ref('');
const searchLastFirm = ref('');
const searchFirst = ref('');
const searchDateFrom = ref('');
const searchDateTo = ref('');
const searchIndex = ref('ALL');
const searchPage = ref(1);
const PER_PAGE = 10;

const _navPages = [
	{ id: 'home' as Page, label: 'Home' },
	{ id: 'search' as Page, label: 'Search Records' },
	{ id: 'howto' as Page, label: 'How-To Guides' },
	{ id: 'fees' as Page, label: 'Recording Fees' },
];

const searchResults = ref(deeds);
const _totalSearchPages = computed(() =>
	Math.ceil(searchResults.value.length / PER_PAGE),
);
const _pagedResults = computed(() =>
	searchResults.value.slice(
		(searchPage.value - 1) * PER_PAGE,
		searchPage.value * PER_PAGE,
	),
);
const _currentRecord = computed(() =>
	deeds.find((d) => d.fileNum === currentFileNum.value),
);

function _navigate(p: Page, extra?: string) {
	page.value = p;
	if (p === 'viewer' && extra) {
		currentFileNum.value = extra;
	}
	history.pushState(null, '', pageToPath(p, extra));
	window.scrollTo(0, 0);
}

function onPop() {
	const s = pathToState();
	page.value = s.page;
	if (s.fileNum) {
		currentFileNum.value = s.fileNum;
	}
	window.scrollTo(0, 0);
}
onMounted(() => {
	const s = pathToState();
	page.value = s.page;
	if (s.fileNum) {
		currentFileNum.value = s.fileNum;
	}
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
onUnmounted(() => window.removeEventListener('popstate', onPop));

function _doSearch() {
	searchResults.value = searchDeeds({
		lastFirm: searchLastFirm.value,
		first: searchFirst.value,
		index: searchIndex.value === 'ALL' ? undefined : searchIndex.value,
	});
	searchPage.value = 1;
}

function _clearSearch() {
	searchLastFirm.value = '';
	searchFirst.value = '';
	searchDateFrom.value = '';
	searchDateTo.value = '';
	searchIndex.value = 'ALL';
	searchResults.value = deeds;
	searchPage.value = 1;
}

const _guides = [
	{
		type: 'DEED',
		file: 'how-to-deed',
		title: 'How to Read a Deed',
		steps: [
			'Locate the grantor and grantee names.',
			'Identify the property description.',
			'Check for any reservations or exceptions.',
			'Verify the notarization and recording stamp.',
		],
	},
	{
		type: 'MTG',
		file: 'how-to-mtg',
		title: 'How to Read a Mortgage',
		steps: [
			'Identify the mortgagor and mortgagee.',
			'Locate the principal amount and interest rate.',
			'Check the maturity date.',
			'Review any satisfaction filings.',
		],
	},
	{
		type: 'LIEN',
		file: 'how-to-lien',
		title: 'How to Read a Lien',
		steps: [
			'Identify the lienor and lienee.',
			'Determine the lien amount.',
			'Check whether a satisfaction has been recorded.',
			'Review related deed filings.',
		],
	},
	{
		type: 'ESMT',
		file: 'how-to-esmt',
		title: 'How to Read an Easement',
		steps: [
			'Identify the dominant and servient estates.',
			'Locate the easement purpose.',
			'Check for conditions or expiration terms.',
			'Review plat map references.',
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
			'Review any exhibits cited.',
		],
	},
	{
		type: 'ASGN',
		file: 'how-to-asgn',
		title: 'How to Read an Assignment',
		steps: [
			'Identify the assignor and assignee.',
			'Locate the original instrument being assigned.',
			'Check the effective date.',
			'Verify recording stamps.',
		],
	},
	{
		type: 'NTC',
		file: 'how-to-ntc',
		title: 'How to Read a Notice',
		steps: [
			'Identify the parties giving and receiving notice.',
			'Locate the subject matter.',
			'Check the notice date.',
			'Review related filings.',
		],
	},
	{
		type: 'REL',
		file: 'how-to-rel',
		title: 'How to Read a Release',
		steps: [
			'Identify the releasing and released parties.',
			'Locate the original instrument.',
			'Check the effective release date.',
			'Confirm satisfaction recording.',
		],
	},
];

const _fees = [
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
</script>

<style scoped>
.er-shell { min-height: 100vh; background: #f8f9fa; color: #212529; font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.er-header { background: #fff; border-bottom: 3px solid #1d4ed8; }
.er-header-top { background: #1d4ed8; }
.er-header-inner { max-width: 1100px; margin: 0 auto; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.er-brand { display: flex; align-items: center; gap: 14px; }
.er-crest { font-size: 32px; }
.er-title { font-size: 20px; font-weight: 700; color: #fff; }
.er-sub { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 2px; }
.er-meta { text-align: right; font-size: 12px; color: rgba(255,255,255,0.75); }
.er-version { font-family: monospace; font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
.er-nav { background: #fff; border-bottom: 1px solid #ced4da; }
.er-nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; }
.er-nav-item { background: none; border: none; cursor: pointer; padding: 12px 16px; font-size: 14px; color: #212529; border-bottom: 3px solid transparent; margin-bottom: -1px; font-weight: 500; }
.er-nav-item:hover { color: #1d4ed8; }
.er-nav-item--active { color: #1d4ed8; border-bottom-color: #1d4ed8; }
.er-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
.er-status { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
.er-status-recorded { background: #dcfce7; color: #166534; }
.er-status-satisfied { background: #dbeafe; color: #1e3a5f; }
.er-status-delinquent { background: #fee2e2; color: #7c2d12; }
.er-hero { background: #1d4ed8; color: #fff; padding: 48px 40px; border-radius: 4px; margin-bottom: 32px; }
.er-hero-title { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
.er-hero-sub { font-size: 16px; opacity: 0.9; margin-bottom: 24px; }
.er-hero-btn { background: #fff; color: #1d4ed8; border: none; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 4px; }
.er-hero-btn:hover { background: #f0f9ff; }
.er-home-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
@media (max-width: 700px) { .er-home-grid { grid-template-columns: 1fr; } }
.er-home-card { background: #fff; border: 1px solid #ced4da; padding: 24px; border-radius: 4px; }
.er-home-icon { font-size: 28px; margin-bottom: 12px; }
.er-home-card-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.er-home-card-desc { font-size: 14px; color: #6c757d; line-height: 1.6; margin-bottom: 16px; }
.er-home-card-btn { background: none; border: 1px solid #1d4ed8; color: #1d4ed8; padding: 8px 16px; font-size: 14px; cursor: pointer; border-radius: 4px; font-weight: 500; }
.er-home-card-btn:hover { background: #1d4ed8; color: #fff; }
.er-office-hours { background: #fff; border: 1px solid #ced4da; padding: 24px; border-radius: 4px; }
.er-oh-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.er-oh-table { border-collapse: collapse; }
.er-oh-table td { padding: 6px 24px 6px 0; font-size: 14px; }
.er-oh-table td:first-child { font-weight: 600; }
.er-page-title { font-size: 28px; font-weight: 700; margin-bottom: 24px; }
.er-search-form { background: #fff; border: 1px solid #ced4da; padding: 24px; border-radius: 4px; margin-bottom: 24px; }
.er-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
@media (max-width: 600px) { .er-form-grid { grid-template-columns: 1fr; } }
.er-form-group { display: flex; flex-direction: column; gap: 6px; }
.er-form-label { font-size: 13px; font-weight: 600; }
.er-form-input { padding: 8px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; outline: none; }
.er-form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.er-form-select { padding: 8px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; background: #fff; outline: none; }
.er-form-actions { display: flex; gap: 12px; }
.er-search-btn { background: #1d4ed8; color: #fff; border: none; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 4px; }
.er-search-btn:hover { background: #1e40af; }
.er-clear-btn { background: none; border: 1px solid #ced4da; padding: 10px 24px; font-size: 14px; cursor: pointer; border-radius: 4px; }
.er-clear-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
.er-results { }
.er-results-header { display: flex; justify-content: space-between; font-size: 13px; color: #6c757d; margin-bottom: 12px; }
.er-table-wrap { overflow-x: auto; border: 1px solid #ced4da; border-radius: 4px; }
.er-results-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.er-fees-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.er-results-table th, .er-fees-table th { background: #1d4ed8; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; white-space: nowrap; }
.er-table-head th { background: #1d4ed8; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; white-space: nowrap; }
.er-table-row { background: #fff; }
.er-table-row-alt { background: #f8f9fa; }
.er-table-row td, .er-table-row-alt td, .er-fees-table td { padding: 10px 12px; border-bottom: 1px solid #ced4da; vertical-align: middle; }
.er-file-num { font-family: monospace; font-weight: 600; }
.er-index-badge { background: #f8f9fa; border: 1px solid #ced4da; padding: 2px 6px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; }
.er-record-date { white-space: nowrap; }
.er-amount { font-family: monospace; white-space: nowrap; }
.er-view-btn { background: #1d4ed8; color: #fff; border: none; padding: 4px 12px; font-size: 12px; cursor: pointer; border-radius: 2px; font-weight: 500; }
.er-view-btn:hover { background: #1e40af; }
.er-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
.er-page-btn { background: none; border: 1px solid #ced4da; padding: 6px 12px; cursor: pointer; border-radius: 2px; font-size: 13px; }
.er-page-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
.er-page-btn--active { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
.er-breadcrumb { font-size: 13px; color: #6c757d; margin-bottom: 24px; }
.er-breadcrumb button { background: none; border: none; cursor: pointer; color: #1d4ed8; font-size: 13px; }
.er-breadcrumb button:hover { text-decoration: underline; }
.er-viewer-header { background: #fff; border: 1px solid #ced4da; padding: 20px 24px; border-radius: 4px; margin-bottom: 20px; }
.er-viewer-title { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.er-viewer-meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: #6c757d; }
.er-viewer-meta strong { color: #212529; }
.er-recorded-stamp { color: #166534; background: #dcfce7; padding: 2px 8px; border-radius: 2px; }
.er-viewer-detail { background: #fff; border: 1px solid #ced4da; border-radius: 4px; overflow: hidden; margin-bottom: 20px; }
.er-detail-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.er-detail-table th { background: #f8f9fa; padding: 10px 16px; text-align: left; font-weight: 600; border-bottom: 1px solid #ced4da; width: 200px; }
.er-detail-table td { padding: 10px 16px; border-bottom: 1px solid #ced4da; }
.er-detail-table tr:last-child th, .er-detail-table tr:last-child td { border-bottom: none; }
.er-pdf-viewer { background: #fff; border: 1px solid #ced4da; border-radius: 4px; overflow: hidden; }
.er-pdf-header { background: #f8f9fa; padding: 10px 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #ced4da; }
.er-pdf-frame { width: 100%; height: 600px; border: none; display: block; }
.er-not-found { text-align: center; padding: 60px 24px; }
.er-not-found button { margin-top: 16px; background: #1d4ed8; color: #fff; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; font-size: 14px; }
.er-guides-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 700px) { .er-guides-grid { grid-template-columns: 1fr; } }
.er-guide-card { background: #fff; border: 1px solid #ced4da; padding: 24px; border-radius: 4px; }
.er-guide-num { font-size: 11px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.er-guide-type { display: inline-block; background: #1d4ed8; color: #fff; padding: 2px 8px; font-size: 12px; font-weight: 700; border-radius: 2px; margin-bottom: 10px; }
.er-guide-title { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
.er-guide-steps { padding-left: 20px; margin-bottom: 16px; }
.er-guide-steps li { font-size: 14px; line-height: 1.6; margin-bottom: 6px; }
.er-guide-pdf { font-size: 13px; color: #1d4ed8; font-weight: 500; }
.er-guide-pdf:hover { text-decoration: underline; }
.er-fees-intro { color: #6c757d; margin-bottom: 24px; }
.er-fee-note { color: #6c757d; font-style: italic; }
.er-fees-note { background: #fff; border: 1px solid #ced4da; padding: 24px; border-radius: 4px; margin-top: 24px; }
.er-fees-note h2 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.er-fees-note p { font-size: 14px; line-height: 1.6; margin-bottom: 16px; }
.er-footer { border-top: 1px solid #ced4da; margin-top: 48px; background: #fff; }
.er-footer-inner { max-width: 1100px; margin: 0 auto; padding: 16px 24px; font-size: 13px; color: #6c757d; }
</style>
