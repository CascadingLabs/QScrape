<script lang="ts">
// @qscrape L2 / svelte / taxes — Eldoria Registry of Deeds
import { onDestroy, onMount } from 'svelte';
import '../../../../styles/l2/taxes.css';
import { fakeGet } from '../../../../data/api';
import {
	type DeedRecord,
	getDeedByFileNum,
	searchDeeds,
} from '../../../../data/taxes/deeds';

type Page = 'home' | 'search' | 'viewer' | 'howto' | 'fees';

function getBase(): string {
	return `/${window.location.pathname.split('/').filter(Boolean).slice(0, 3).join('/')}/`;
}
function urlToPage(): { page: Page; fileNum?: string } {
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
function pageToUrl(p: Page, extra?: string): string {
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

let _ready = false;
let _current: Page = 'home';

// Search state
let fLastFirm = '';
let fFirst = '';
let fIndex = 'ALL';
let searchResults: DeedRecord[] = [];
let _hasSearched = false;
let currentPage = 1;
const PER_PAGE = 10;

// Viewer state
let _viewerDoc: DeedRecord | null = null;

function nav(p: Page, extra?: string) {
	_current = p;
	history.pushState(null, '', pageToUrl(p, extra));
	window.scrollTo(0, 0);
}

function onPop() {
	const s = urlToPage();
	_current = s.page;
	if (s.fileNum) {
		_viewerDoc = getDeedByFileNum(s.fileNum) ?? null;
	}
	window.scrollTo(0, 0);
}
onMount(() => {
	const s = urlToPage();
	_current = s.page;
	if (s.fileNum) {
		_viewerDoc = getDeedByFileNum(s.fileNum) ?? null;
	}
	window.addEventListener('popstate', onPop);
	fakeGet(null).then(() => {
		_ready = true;
	});
});
onDestroy(() => window.removeEventListener('popstate', onPop));

function _doSearch() {
	_hasSearched = true;
	currentPage = 1;
	searchResults = searchDeeds({
		lastFirm: fLastFirm,
		first: fFirst,
		index: fIndex,
	});
}

$: pagedResults = searchResults.slice(
	(currentPage - 1) * PER_PAGE,
	currentPage * PER_PAGE,
);
$: totalPages = Math.ceil(searchResults.length / PER_PAGE);

function _openViewer(d: DeedRecord) {
	_viewerDoc = d;
	nav('viewer', d.fileNum);
}

function _statusClass(s: string) {
	if (s === 'RECORDED') {
		return 'er-status-recorded';
	}
	if (s === 'SATISFIED') {
		return 'er-status-satisfied';
	}
	return 'er-status-delinquent';
}

const _feeTable = [
	{ type: 'Deed', first: '10.00 GS', add: '2.00 GS/page' },
	{ type: 'Mortgage', first: '15.00 GS', add: '2.50 GS/page' },
	{ type: 'Lien', first: '12.00 GS', add: '2.00 GS/page' },
	{ type: 'Release', first: '8.00 GS', add: '1.50 GS/page' },
	{ type: 'Assignment', first: '10.00 GS', add: '2.00 GS/page' },
	{ type: 'Easement', first: '10.00 GS', add: '2.00 GS/page' },
	{ type: 'Affidavit', first: '8.00 GS', add: '1.50 GS/page' },
	{ type: 'Notice', first: '6.00 GS', add: '1.00 GS/page' },
];

const _howToGuides = [
	{
		id: 'deed',
		title: 'How to Search Deed Records',
		desc: 'Step-by-step guide to searching the grantor–grantee index.',
	},
	{
		id: 'mtg',
		title: 'How to Search Mortgage Records',
		desc: 'Finding mortgage originations and satisfactions.',
	},
	{
		id: 'lien',
		title: 'How to Search Lien Records',
		desc: 'Identifying active liens and delinquent obligations.',
	},
	{
		id: 'cert',
		title: 'Obtaining Certified Copies',
		desc: 'Requesting certified copies of recorded instruments.',
	},
	{
		id: 'efiling',
		title: 'e-Filing Instructions',
		desc: 'Submitting documents electronically via the Rune-Wire system.',
	},
	{
		id: 'fees',
		title: 'Recording Fee Schedule',
		desc: 'Current fees for all document types.',
	},
	{
		id: 'tract',
		title: 'Tract Index Guide',
		desc: 'Using parcel-based search to find all encumbrances.',
	},
	{
		id: 'hist',
		title: 'Historical Research Guide',
		desc: 'Searching records prior to Year 200.',
	},
];
</script>

{#if !ready}
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'IBM Plex Sans',system-ui;color:#6c757d;background:#f8f9fa">Loading…</div>
{:else}
<div class="er-shell">
  <!-- Header -->
  <header class="er-header">
    <div class="er-header-inner">
      <div class="er-header-title">
        <span class="er-crest">⚖</span>
        <div>
          <h1 class="er-site-title">Eldoria Registry of Deeds</h1>
          <p class="er-site-subtitle">Grand Duchy of Mountainhome · Bureau of Land Records</p>
        </div>
      </div>
    </div>
    <nav class="er-nav">
      <button class="er-nav-btn{current === 'home' ? ' active' : ''}" on:click={() => nav('home')}>Home</button>
      <button class="er-nav-btn{current === 'search' ? ' active' : ''}" on:click={() => nav('search')}>Search Records</button>
      <button class="er-nav-btn{current === 'viewer' ? ' active' : ''}" on:click={() => nav('viewer')}>Document Viewer</button>
      <button class="er-nav-btn{current === 'howto' ? ' active' : ''}" on:click={() => nav('howto')}>How-To Guides</button>
      <button class="er-nav-btn{current === 'fees' ? ' active' : ''}" on:click={() => nav('fees')}>Recording Fees</button>
    </nav>
  </header>

  <main class="er-main">
    <!-- HOME PAGE -->
    {#if current === 'home'}
      <div class="er-notice">
        <strong>Notice:</strong> The Registry is open Monday–Friday, 8:00 AM – 4:30 PM. Documents recorded by 3:00 PM receive same-day indexing.
      </div>
      <div class="er-home-grid">
        <section class="er-panel">
          <h2>Search Records</h2>
          <p>Search deed, mortgage, lien, and other recorded documents by name or document type.</p>
          <button class="er-btn-primary" on:click={() => nav('search')}>Search the Index</button>
        </section>
        <section class="er-panel">
          <h2>Document Viewer</h2>
          <p>View and download images of recorded instruments. PDF format available for all post-Year 280 filings.</p>
          <button class="er-btn-primary" on:click={() => nav('viewer')}>Open Viewer</button>
        </section>
        <section class="er-panel">
          <h2>How-To Guides</h2>
          <p>Step-by-step instructions for searching records, obtaining certified copies, and e-filing documents.</p>
          <button class="er-btn-secondary" on:click={() => nav('howto')}>View Guides</button>
        </section>
        <section class="er-panel">
          <h2>Recording Fees</h2>
          <p>Current fee schedule for recording deeds, mortgages, liens, and all other instruments.</p>
          <button class="er-btn-secondary" on:click={() => nav('fees')}>Fee Schedule</button>
        </section>
      </div>
      <section class="er-recent-section">
        <h2 class="er-section-title">Recently Recorded Instruments</h2>
        <table class="er-table">
          <thead>
            <tr>
              <th>File No.</th>
              <th>Type</th>
              <th>Date Recorded</th>
              <th>Last Name / Firm</th>
              <th>First Name</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each [...deeds].reverse().slice(0, 5) as d}
              <tr data-file={d.fileNum}>
                <td><button class="er-link-btn" on:click={() => openViewer(d)}>{d.fileNum}</button></td>
                <td>{indexLabels[d.index]}</td>
                <td>{d.recordDate}</td>
                <td>{d.lastFirm}</td>
                <td>{d.first}</td>
                <td>{d.amount}</td>
                <td><span class={statusClass(d.status)}>{d.status}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

    <!-- SEARCH PAGE -->
    {:else if current === 'search'}
      <h2 class="er-page-title">Search Records</h2>
      <form class="er-search-form" on:submit|preventDefault={doSearch}>
        <input type="hidden" name="__VIEWSTATE" value="dGhpcyBpcyBhIGZha2Ugdmlld3N0YXRl" />
        <input type="hidden" name="__EVENTVALIDATION" value="ZXZlbnR2YWxpZGF0aW9u" />
        <div class="er-form-grid">
          <div class="er-form-group">
            <label for="ctl00_MainContent_txtLastFirm">Last Name / Firm Name</label>
            <input
              id="ctl00_MainContent_txtLastFirm"
              name="ctl00$MainContent$txtLastFirm"
              type="text"
              bind:value={fLastFirm}
              placeholder="e.g. ARMOK or MCMINER"
            />
          </div>
          <div class="er-form-group">
            <label for="ctl00_MainContent_txtFirst">First Name</label>
            <input
              id="ctl00_MainContent_txtFirst"
              name="ctl00$MainContent$txtFirst"
              type="text"
              bind:value={fFirst}
              placeholder="e.g. URIST"
            />
          </div>
          <div class="er-form-group">
            <label for="ctl00_MainContent_ddlIndex">Document Type</label>
            <select
              id="ctl00_MainContent_ddlIndex"
              name="ctl00$MainContent$ddlIndex"
              bind:value={fIndex}
            >
              <option value="ALL">All Types</option>
              {#each indexTypes as t}
                <option value={t}>{indexLabels[t]} ({t})</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="er-form-actions">
          <button
            class="er-btn-primary"
            type="submit"
            id="ctl00_MainContent_btnSearch"
            name="ctl00$MainContent$btnSearch"
          >Search</button>
          <button
            class="er-btn-secondary"
            type="button"
            on:click={() => { fLastFirm = ''; fFirst = ''; fIndex = 'ALL'; hasSearched = false; searchResults = []; }}
          >Clear</button>
        </div>
      </form>

      {#if hasSearched}
        <div class="er-results-header">
          <p class="er-result-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
        </div>
        {#if searchResults.length > 0}
          <table class="er-table">
            <thead>
              <tr>
                <th>File No.</th>
                <th>Type</th>
                <th>Date Recorded</th>
                <th>Last Name / Firm</th>
                <th>First Name</th>
                <th>SAT</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {#each pagedResults as d}
                <tr data-file={d.fileNum}>
                  <td><button class="er-link-btn" on:click={() => openViewer(d)}>{d.fileNum}</button></td>
                  <td>{indexLabels[d.index]}</td>
                  <td>{d.recordDate}</td>
                  <td>{d.lastFirm}</td>
                  <td>{d.first}</td>
                  <td>{d.sat ? 'Y' : 'N'}</td>
                  <td>{d.amount}</td>
                  <td><span class={statusClass(d.status)}>{d.status}</span></td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if totalPages > 1}
            <div class="er-pagination">
              {#each Array(totalPages) as _, i}
                <button
                  class="er-page-btn{currentPage === i + 1 ? ' active' : ''}"
                  on:click={() => (currentPage = i + 1)}
                >{i + 1}</button>
              {/each}
            </div>
          {/if}
        {:else}
          <p class="er-no-results">No records matched your search criteria.</p>
        {/if}
      {/if}

    <!-- DOCUMENT VIEWER -->
    {:else if current === 'viewer'}
      <h2 class="er-page-title">Document Viewer</h2>
      {#if viewerDoc}
        {@const d = viewerDoc}
        <div class="er-viewer-meta">
          <dl class="er-meta-list">
            <dt>File Number</dt><dd>{d.fileNum}</dd>
            <dt>Document Type</dt><dd>{indexLabels[d.index]} ({d.index})</dd>
            <dt>Date Recorded</dt><dd>{d.recordDate}</dd>
            <dt>Last Name / Firm</dt><dd>{d.lastFirm}</dd>
            <dt>First Name</dt><dd>{d.first || '—'}</dd>
            <dt>Amount</dt><dd>{d.amount}</dd>
            <dt>Satisfied</dt><dd>{d.sat ? 'Yes' : 'No'}</dd>
            <dt>Status</dt><dd><span class={statusClass(d.status)}>{d.status}</span></dd>
          </dl>
        </div>
        <div class="er-pdf-viewer">
          <iframe
            src="/{d.fileNum}.pdf"
            width="100%"
            height="600"
          ></iframe>
        </div>
        <div class="er-viewer-actions">
          <button class="er-btn-secondary" on:click={() => nav('search')}>← Back to Search</button>
          <a class="er-btn-primary" href="/{d.fileNum}.pdf" download>Download PDF</a>
        </div>
      {:else}
        <p class="er-viewer-empty">No document selected. Use <button class="er-link-btn" on:click={() => nav('search')}>Search Records</button> to find a document.</p>
      {/if}

    <!-- HOW-TO GUIDES -->
    {:else if current === 'howto'}
      <h2 class="er-page-title">How-To Guides</h2>
      <p class="er-intro">These guides provide step-by-step instructions for common Registry tasks.</p>
      <div class="er-guide-grid">
        {#each howToGuides as g}
          <div class="er-guide-card" data-guide={g.id}>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <a class="er-guide-link" href="/how-to/{g.id}.pdf" download>Download PDF Guide</a>
          </div>
        {/each}
      </div>

    <!-- RECORDING FEES -->
    {:else if current === 'fees'}
      <h2 class="er-page-title">Recording Fee Schedule</h2>
      <p class="er-intro">Effective Year 312. All amounts in Gold Sovereigns (GS). Payment accepted in GS, Silver Coins (SC), and certified Rune-Wire transfer.</p>
      <table class="er-table er-fee-table">
        <thead>
          <tr>
            <th>Document Type</th>
            <th>First Page</th>
            <th>Each Additional Page</th>
          </tr>
        </thead>
        <tbody>
          {#each feeTable as row}
            <tr>
              <td>{row.type}</td>
              <td>{row.first}</td>
              <td>{row.add}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="er-fee-notes">
        <h3>Additional Fees</h3>
        <ul>
          <li>Certified copy: 5.00 GS per document</li>
          <li>e-Filing surcharge: 2.00 GS per transaction</li>
          <li>Expedited same-day recording (after 3:00 PM): 10.00 GS surcharge</li>
          <li>Returned payment fee: 25.00 GS</li>
        </ul>
      </div>
    {/if}
  </main>

  <footer class="er-footer">
    <p>Eldoria Registry of Deeds · Grand Duchy of Mountainhome · Z-Level 3 Administrative Complex · Open Mon–Fri 8:00 AM–4:30 PM</p>
  </footer>
</div>
{/if}

<style>
  .er-shell { min-height: 100vh; display: flex; flex-direction: column; }

  /* Header */
  .er-header { background: var(--er-primary); color: #fff; }
  .er-header-inner { max-width: 1100px; margin: 0 auto; padding: 16px 24px; }
  .er-header-title { display: flex; align-items: center; gap: 16px; }
  .er-crest { font-size: 2rem; }
  .er-site-title { font-size: 1.4rem; font-weight: 700; }
  .er-site-subtitle { font-size: 12px; opacity: 0.8; }
  .er-nav { background: rgba(0,0,0,0.2); }
  .er-nav { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; gap: 0; flex-wrap: wrap; }
  .er-nav-btn { background: none; border: none; color: rgba(255,255,255,0.8); font-family: var(--er-font); font-size: 13px; padding: 10px 16px; cursor: pointer; border-bottom: 3px solid transparent; }
  .er-nav-btn:hover, .er-nav-btn.active { color: #fff; border-bottom-color: #fff; background: rgba(255,255,255,0.1); }

  /* Main */
  .er-main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 28px 24px; }
  .er-notice { background: #fff3cd; border: 1px solid #ffc107; border-radius: var(--er-radius); padding: 12px 16px; font-size: 13px; margin-bottom: 24px; }
  .er-page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; border-bottom: 2px solid var(--er-border); padding-bottom: 8px; }

  /* Home grid */
  .er-home-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 36px; }
  .er-panel { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); padding: 20px; }
  .er-panel h2 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; color: var(--er-primary); }
  .er-panel p { font-size: 13px; color: var(--er-muted); margin-bottom: 16px; }

  /* Section */
  .er-section-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; }
  .er-recent-section { margin-top: 8px; }

  /* Table */
  .er-table { width: 100%; border-collapse: collapse; font-size: 13px; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); overflow: hidden; }
  .er-table th { background: var(--er-primary); color: #fff; text-align: left; padding: 10px 12px; font-size: 12px; letter-spacing: 0.04em; }
  .er-table td { padding: 10px 12px; border-bottom: 1px solid var(--er-border); }
  .er-table tr:last-child td { border-bottom: none; }
  .er-table tr:hover td { background: #f1f5ff; }
  .er-link-btn { background: none; border: none; color: var(--er-primary); font-family: var(--er-font); font-size: inherit; cursor: pointer; padding: 0; text-decoration: underline; }

  /* Status badges */
  :global(.er-status-recorded) { background: var(--er-recorded-bg); color: var(--er-recorded); font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; letter-spacing: 0.04em; }
  :global(.er-status-satisfied) { background: var(--er-satisfied-bg); color: var(--er-satisfied); font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; letter-spacing: 0.04em; }
  :global(.er-status-delinquent) { background: var(--er-delinquent-bg); color: var(--er-delinquent); font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; letter-spacing: 0.04em; }

  /* Search form */
  .er-search-form { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); padding: 24px; margin-bottom: 24px; }
  .er-form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px; }
  .er-form-group { display: flex; flex-direction: column; gap: 4px; }
  .er-form-group label { font-size: 13px; font-weight: 600; color: var(--er-text); }
  .er-form-group input, .er-form-group select { padding: 8px 10px; border: 1px solid var(--er-border); border-radius: var(--er-radius); font-family: var(--er-font); font-size: 14px; background: var(--er-surface); color: var(--er-text); }
  .er-form-group input:focus, .er-form-group select:focus { outline: 2px solid var(--er-focus); border-color: var(--er-focus); }
  .er-form-actions { display: flex; gap: 10px; }
  .er-results-header { margin-bottom: 12px; }
  .er-result-count { font-size: 13px; color: var(--er-muted); }
  .er-no-results { font-size: 14px; color: var(--er-muted); padding: 24px; text-align: center; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); }

  /* Pagination */
  .er-pagination { display: flex; gap: 6px; margin-top: 16px; }
  .er-page-btn { background: var(--er-surface); border: 1px solid var(--er-border); padding: 5px 12px; font-family: var(--er-font); font-size: 13px; cursor: pointer; border-radius: var(--er-radius); }
  .er-page-btn.active { background: var(--er-primary); border-color: var(--er-primary); color: #fff; }

  /* Viewer */
  .er-viewer-meta { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); padding: 20px; margin-bottom: 20px; }
  .er-meta-list { display: grid; grid-template-columns: max-content 1fr; gap: 6px 24px; font-size: 14px; }
  .er-meta-list dt { font-weight: 600; color: var(--er-muted); }
  .er-pdf-viewer { margin-bottom: 20px; border: 1px solid var(--er-border); border-radius: var(--er-radius); overflow: hidden; }
  .er-viewer-actions { display: flex; gap: 12px; align-items: center; }
  .er-viewer-empty { font-size: 14px; color: var(--er-muted); padding: 32px; text-align: center; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); }

  /* How-to guides */
  .er-intro { font-size: 14px; color: var(--er-muted); margin-bottom: 20px; }
  .er-guide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .er-guide-card { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); padding: 18px; }
  .er-guide-card h3 { font-size: 14px; font-weight: 700; margin-bottom: 6px; color: var(--er-primary); }
  .er-guide-card p { font-size: 13px; color: var(--er-muted); margin-bottom: 12px; }
  .er-guide-link { font-size: 13px; color: var(--er-primary); text-decoration: underline; }

  /* Fee table */
  .er-fee-table { max-width: 600px; margin-bottom: 24px; }
  .er-fee-notes { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); padding: 20px; max-width: 600px; }
  .er-fee-notes h3 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
  .er-fee-notes ul { padding-left: 20px; font-size: 13px; color: var(--er-muted); display: flex; flex-direction: column; gap: 4px; }

  /* Buttons */
  .er-btn-primary { background: var(--er-primary); color: #fff; border: none; padding: 9px 20px; border-radius: var(--er-radius); font-family: var(--er-font); font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
  .er-btn-primary:hover { background: var(--er-primary-hover); }
  .er-btn-secondary { background: var(--er-surface); color: var(--er-text); border: 1px solid var(--er-border); padding: 9px 20px; border-radius: var(--er-radius); font-family: var(--er-font); font-size: 14px; cursor: pointer; text-decoration: none; display: inline-block; }
  .er-btn-secondary:hover { background: var(--er-bg); }

  /* Footer */
  .er-footer { background: var(--er-primary); color: rgba(255,255,255,0.8); text-align: center; padding: 16px 24px; font-size: 12px; }
</style>
