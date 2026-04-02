<script lang="ts">
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

<div data-island="svelte-pdf-link">
  {#if notFound}
    <div class="b">PDF not available.</div>
  {:else if !pdfData}
    <div class="a">Loading…</div>
  {:else}
    <div class="c">
      <h3 class="d">Official Document</h3>
      <div class="e">{pdfData.deed.index} — {indexLabels[pdfData.deed.index]}</div>

      <div class="f">
        <span class="g">Download PDF</span>
        <div class="h">
          <a href={pdfData.realUrl} class="i" download>
            {pdfData.realUrl}
          </a>
          <span class="j" aria-hidden="true">{pdfData.fakeUrl}</span>
        </div>
      </div>

      <a href={pdfData.realUrl} class="k" download>
        ↓ Download {pdfData.deed.index} ({pdfData.deed.fileNum})
      </a>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/taxes.css';

  .a,
  .b {
    min-height: 80px;
    display: flex;
    align-items: center;
    color: var(--er3-muted);
    font-family: var(--er3-font);
    font-size: 13px;
  }

  .c {
    background: var(--er3-surface);
    border: 1px solid var(--er3-border);
    border-radius: var(--er3-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .d {
    font-family: var(--er3-font);
    font-size: 14px;
    font-weight: 700;
    color: var(--er3-text);
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--er3-primary);
  }

  .e {
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

  .f {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .g {
    font-family: var(--er3-font);
    font-size: 11px;
    font-weight: 600;
    color: var(--er3-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .h {
    position: relative;
    display: block;
  }
  .i {
    font-family: var(--er3-font-mono);
    font-size: 12px;
    color: var(--er3-primary);
    text-decoration: none;
    position: relative;
    z-index: 1;
    word-break: break-all;
  }
  .i:hover {
    text-decoration: underline;
  }
  .j {
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

  .k {
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
  .k:hover {
    background: var(--er3-primary-hover);
  }
</style>
