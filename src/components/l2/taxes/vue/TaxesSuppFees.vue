<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesSuppFees
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

const ready = ref(false);
onMounted(() => {
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
</script>

<template>
  <div v-if="!ready" class="er-loading">Loading…</div>
  <div v-else data-component="taxes-supp-fees" data-framework="vue" class="er-section">
    <div class="er-section-title">Supplemental &amp; Miscellaneous Fees</div>
    <div class="er-table-wrap">
      <table class="er-table">
        <thead>
          <tr class="er-table-head"><th>Service</th><th>Fee</th></tr>
        </thead>
        <tbody>
          <tr v-for="(f, i) in suppFees" :key="f.service" :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'">
            <td data-field="service" class="er-cell-desc">{{ f.service }}</td>
            <td data-field="fee" class="er-cell-nowrap">{{ f.fee }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.er-loading { padding: 40px 24px; color: var(--er-muted); font-family: var(--er-font); }
.er-section { padding: 24px; }
.er-section-title { font-size: 14px; font-weight: 700; color: var(--er-text); font-family: var(--er-font); margin-bottom: 10px; }
.er-table-wrap { overflow-x: auto; }
.er-table { width: 100%; border-collapse: collapse; font-family: var(--er-font); font-size: 13px; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); }
.er-table-head { background: var(--er-bg); border-bottom: 2px solid var(--er-border); }
.er-table-head th { padding: 9px 12px; text-align: left; font-weight: 600; color: var(--er-muted); white-space: nowrap; }
.er-row { border-bottom: 1px solid var(--er-border); background: var(--er-surface); }
.er-row-alt { background: var(--er-bg); }
.er-row td { padding: 8px 12px; color: var(--er-text); }
.er-cell-desc { color: var(--er-muted) !important; font-size: 12px !important; }
.er-cell-nowrap { white-space: nowrap; }
</style>
