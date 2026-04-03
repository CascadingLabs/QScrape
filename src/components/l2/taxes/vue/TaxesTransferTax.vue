<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesTransferTax
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const transferTax = [
	{
		range: '0 – 500.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '2.50 GP on 500 GP',
	},
	{
		range: '500.01 – 5,000.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '25.00 GP on 5,000 GP',
	},
	{
		range: '5,000.01 – 50,000.00 GP',
		rate: '0.5 GP per 100 GP',
		example: '250.00 GP on 50,000 GP',
	},
	{
		range: '50,000.01 GP and above',
		rate: '0.75 GP per 100 GP',
		example: '750.00 GP on 100,000 GP',
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
  <div v-else data-component="taxes-transfer-tax" data-framework="vue" class="er-section">
    <div class="er-section-title">Transfer Tax</div>
    <p class="er-note">
      Assessed on DEED instruments at <strong>0.5 GP per 100 GP</strong> of consideration.
      Instruments reciting nominal consideration must attach form ELD-TC-01 or the full rate of <strong>2.0 GP per 100 GP</strong> of assessed value applies.
    </p>
    <div class="er-table-wrap">
      <table class="er-table">
        <thead>
          <tr class="er-table-head">
            <th>Consideration Range</th><th>Transfer Tax Rate</th><th>Example Tax</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(f, i) in transferTax" :key="f.range" :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'">
            <td data-field="range">{{ f.range }}</td>
            <td data-field="rate" class="er-cell-nowrap">{{ f.rate }}</td>
            <td data-field="example" class="er-cell-nowrap">{{ f.example }}</td>
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
.er-note { font-size: 13px; color: var(--er-muted); font-family: var(--er-font); margin-bottom: 10px; line-height: 1.6; }
.er-table-wrap { overflow-x: auto; }
.er-table { width: 100%; border-collapse: collapse; font-family: var(--er-font); font-size: 13px; background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); }
.er-table-head { background: var(--er-bg); border-bottom: 2px solid var(--er-border); }
.er-table-head th { padding: 9px 12px; text-align: left; font-weight: 600; color: var(--er-muted); white-space: nowrap; }
.er-row { border-bottom: 1px solid var(--er-border); background: var(--er-surface); }
.er-row-alt { background: var(--er-bg); }
.er-row td { padding: 8px 12px; color: var(--er-text); }
.er-cell-nowrap { white-space: nowrap; }
</style>
