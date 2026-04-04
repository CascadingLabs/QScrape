<!--
  @qscrape L2 / svelte / taxes / island
  @component TaxesSuppFees
-->
<script lang="ts">
import { onMount } from 'svelte';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const suppFees = [
	{
		service: 'Certified copy of recorded instrument (per copy)',
		fee: '5.00 GP',
	},
	{ service: 'Uncertified / plain copy (per page)', fee: '1.00 GP' },
	{ service: 'Expedited same-day recording surcharge', fee: '50.00 GP' },
	{
		service: 'ROD Cover Sheet (form ELD-CVR), if not self-prepared',
		fee: '2.00 GP',
	},
	{ service: 'Notice to Owner (form ELD-NTO-01) filing', fee: '5.00 GP' },
	{ service: 'Index search (per name, per 10-year period)', fee: '3.00 GP' },
	{
		service: 'Parcel history report (all instruments on a single parcel)',
		fee: '15.00 GP',
	},
	{
		service: 'Rejection / re-submission handling fee (per returned instrument)',
		fee: '5.00 GP',
	},
	{
		service: 'Judicial release recording (court order in lieu of satisfaction)',
		fee: '15.00 GP',
	},
	{
		service:
			'Late satisfaction penalty (Eldoria Code §44-B, per month of delay)',
		fee: '100.00 GP',
	},
];

let ready = false;
onMount(() => {
	fakeGet(null).then(() => {
		ready = true;
	});
});
</script>

{#if !ready}
  <div class="er-loading">Loading…</div>
{:else}
  <div data-component="taxes-supp-fees" data-framework="svelte" class="er-section">
    <div class="er-section-title">Supplemental &amp; Miscellaneous Fees</div>
    <div class="er-table-wrap">
      <table class="er-table">
        <thead>
          <tr class="er-table-head"><th>Service</th><th>Fee</th></tr>
        </thead>
        <tbody>
          {#each suppFees as f, i (f.service)}
            <tr class={i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'}>
              <td data-field="service" class="er-cell-desc">{f.service}</td>
              <td data-field="fee" class="er-cell-nowrap">{f.fee}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  .er-loading { padding: 40px 24px; color: var(--er-muted); font-family: var(--er-font); }
  .er-section { padding: 24px; }
  .er-section-title { font-size: 14px; font-weight: 700; color: var(--er-text); font-family: var(--er-font); margin-bottom: 10px; }
  .er-table-wrap { overflow-x: auto; }
  .er-table { width: 100%; border-collapse: collapse; font-family: var(--er-font); font-size: 13px; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); }
  .er-table-head { background: var(--er-bg); border-bottom: 2px solid var(--er-border); }
  .er-table-head th { padding: 9px 12px; text-align: left; font-weight: 600; color: var(--er-muted); white-space: nowrap; }
  .er-row { border-bottom: 1px solid var(--er-border); background: var(--er-surface); }
  .er-row-alt { background: var(--er-bg); }
  .er-row :global(td) { padding: 8px 12px; color: var(--er-text); }
  .er-cell-desc { color: var(--er-muted) !important; font-size: 12px !important; }
  .er-cell-nowrap { white-space: nowrap; }
</style>
