<script lang="ts">
// @qscrape L3 / svelte island / taxes — PDF download link + doc type badge
// Anti-bot: decoy overlay — real PDF URL at z-index 1, fake URL at z-index 2
// (color: transparent, pointer-events: none). Scraper must resolve z-index.
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	type DeedRecord,
	getDeedByFileNum,
} from '../../../../data/taxes/deeds';

export let fileNum: string;

type PdfData = { deed: DeedRecord; realUrl: string; fakeUrl: string };

let _pdfData: PdfData | null = null;
let _notFound = false;

onMount(() => {
	const found = getDeedByFileNum(fileNum);
	if (!found) {
		_notFound = true;
		return;
	}
	const data: PdfData = {
		deed: found,
		realUrl: `/${found.fileNum}.pdf`,
		fakeUrl: `/documents/ref-${found.index.toLowerCase()}-${found.fileNum.replace('-', '')}.pdf`,
	};
	fakeGetMs(data, 800, 250).then((d) => {
		_pdfData = d;
	});
});
</script>

<div>
  {#if notFound}
    <div class="er3-pdf-error">PDF not available.</div>
  {:else if !pdfData}
    <div class="er3-pdf-loading">Loading…</div>
  {:else}
    <div class="er3-pdf-panel">
      <h3 class="er3-pdf-title">Official Document</h3>
      <div class="er3-pdf-badge">{pdfData.deed.index} — {indexLabels[pdfData.deed.index]}</div>

      <div class="er3-pdf-link-wrap">
        <span class="er3-pdf-label">Download PDF</span>
        <div class="er3-url-container">
          <a href={pdfData.realUrl} class="er3-pdf-anchor er3-url-real" download>
            {pdfData.realUrl}
          </a>
          <!-- Anti-bot decoy: fake URL overlaid, color transparent -->
          <span class="er3-url-decoy" aria-hidden="true">{pdfData.fakeUrl}</span>
        </div>
      </div>

      <a href={pdfData.realUrl} class="er3-pdf-btn" download>
        ↓ Download {pdfData.deed.index} ({pdfData.deed.fileNum})
      </a>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/taxes.css';

  .er3-pdf-loading,
  .er3-pdf-error {
    min-height: 80px;
    display: flex;
    align-items: center;
    color: var(--er3-muted);
    font-family: var(--er3-font);
    font-size: 13px;
  }

  .er3-pdf-panel {
    background: var(--er3-surface);
    border: 1px solid var(--er3-border);
    border-radius: var(--er3-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .er3-pdf-title {
    font-family: var(--er3-font);
    font-size: 14px;
    font-weight: 700;
    color: var(--er3-text);
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--er3-primary);
  }

  .er3-pdf-badge {
    display: inline-block;
    font-family: var(--er3-font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--er3-primary);
    background: var(--er3-primary-dim);
    border: 1px solid var(--er3-primary);
    border-radius: 2px;
    padding: 3px 8px;
    letter-spacing: 0.04em;
    align-self: flex-start;
  }

  .er3-pdf-link-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .er3-pdf-label {
    font-family: var(--er3-font);
    font-size: 11px;
    font-weight: 600;
    color: var(--er3-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Anti-bot: decoy overlay on URL */
  .er3-url-container {
    position: relative;
    display: block;
  }
  .er3-url-real {
    font-family: var(--er3-font-mono);
    font-size: 12px;
    color: var(--er3-primary);
    text-decoration: none;
    position: relative;
    z-index: 1;
    word-break: break-all;
  }
  .er3-url-real:hover {
    text-decoration: underline;
  }
  .er3-url-decoy {
    position: absolute;
    top: 0;
    left: 0;
    font-family: var(--er3-font-mono);
    font-size: 12px;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
    word-break: break-all;
  }

  .er3-pdf-btn {
    font-family: var(--er3-font);
    font-size: 13px;
    font-weight: 600;
    color: var(--er3-bg);
    background: var(--er3-primary);
    border-radius: var(--er3-radius);
    padding: 9px 16px;
    text-decoration: none;
    text-align: center;
    display: block;
    transition: background 0.15s;
  }
  .er3-pdf-btn:hover {
    background: var(--er3-primary-hover);
  }
</style>
