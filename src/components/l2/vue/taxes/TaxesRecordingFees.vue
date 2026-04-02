<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesRecordingFees
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const stdFees = [
  { index: 'DEED', docs: "Warranty Deed, Quitclaim Deed, Trustee's Deed, Sheriff's Deed", base: '15.00 GP', addl: '2.00 GP', max: '75.00 GP' },
  { index: 'MTG', docs: 'Mortgage, Purchase Money Mortgage, Construction Mortgage', base: '25.00 GP', addl: '2.00 GP', max: '125.00 GP' },
  { index: 'LIEN', docs: "Claim of Mechanic's Lien, Construction Lien, Judgment Lien", base: '10.00 GP', addl: '2.00 GP', max: '50.00 GP' },
  { index: 'ESMT', docs: 'Grant of Easement, Easement Agreement, Utility Easement', base: '15.00 GP', addl: '2.00 GP', max: '75.00 GP' },
  { index: 'ASGN', docs: 'Assignment of Mortgage, Assignment of Lien, Partial Assignment', base: '20.00 GP', addl: '2.00 GP', max: '60.00 GP' },
  { index: 'REL', docs: 'Release of Lien, Satisfaction of Mortgage, Discharge of Judgment', base: '10.00 GP', addl: '2.00 GP', max: '30.00 GP' },
  { index: 'NTC', docs: 'Notice of Commencement, Amended NOC, Notice of Termination', base: '10.00 GP', addl: '2.00 GP', max: '30.00 GP' },
  { index: 'AFF', docs: 'Affidavit of Title, Affidavit of Heirship, Correction Affidavit', base: '10.00 GP', addl: '2.00 GP', max: '30.00 GP' },
];

const suppFees = [
  { service: 'Certified copy of recorded instrument (per copy)', fee: '5.00 GP' },
  { service: 'Uncertified / plain copy (per page)', fee: '1.00 GP' },
  { service: 'Expedited same-day recording surcharge', fee: '50.00 GP' },
  { service: 'ROD Cover Sheet (form ELD-CVR), if not self-prepared', fee: '2.00 GP' },
  { service: 'Notice to Owner (form ELD-NTO-01) filing', fee: '5.00 GP' },
  { service: 'Index search (per name, per 10-year period)', fee: '3.00 GP' },
  { service: 'Parcel history report (all instruments on a single parcel)', fee: '15.00 GP' },
  { service: 'Rejection / re-submission handling fee (per returned instrument)', fee: '5.00 GP' },
  { service: 'Judicial release recording (court order in lieu of satisfaction)', fee: '15.00 GP' },
  { service: 'Late satisfaction penalty (Eldoria Code §44-B, per month of delay)', fee: '100.00 GP' },
];

const transferTax = [
  { range: '0 – 500.00 GP', rate: '0.5 GP per 100 GP', example: '2.50 GP on 500 GP' },
  { range: '500.01 – 5,000.00 GP', rate: '0.5 GP per 100 GP', example: '25.00 GP on 5,000 GP' },
  { range: '5,000.01 – 50,000.00 GP', rate: '0.5 GP per 100 GP', example: '250.00 GP on 50,000 GP' },
  { range: '50,000.01 GP and above', rate: '0.75 GP per 100 GP', example: '750.00 GP on 100,000 GP' },
];

const ready = ref(false);
onMounted(() => { fakeGet(null).then(() => { ready.value = true; }); });
</script>

<template>
  <div v-if="!ready" class="er-loading">Loading…</div>
  <div v-else data-component="taxes-recording-fees" data-framework="vue" class="er-fees">

    <div class="er-section">
      <div class="er-section-title">Standard Document Recording Fees</div>
      <div class="er-table-wrap">
        <table class="er-table">
          <thead>
            <tr class="er-table-head">
              <th>Index Type</th><th>Document Type</th><th>Base Fee (1st page)</th><th>Each Add'l Page</th><th>Max Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(f, i) in stdFees"
              :key="f.index"
              :data-index-type="f.index"
              :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'"
            >
              <td><span class="er-type-badge">{{ f.index }}</span></td>
              <td data-field="doc-type" class="er-cell-desc">{{ f.docs }}</td>
              <td data-field="base-fee" class="er-cell-nowrap">{{ f.base }}</td>
              <td data-field="addl-fee" class="er-cell-nowrap">{{ f.addl }}</td>
              <td data-field="max-fee" class="er-cell-nowrap">{{ f.max }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="er-section">
      <div class="er-section-title">Supplemental &amp; Miscellaneous Fees</div>
      <div class="er-table-wrap">
        <table class="er-table">
          <thead>
            <tr class="er-table-head">
              <th>Service</th><th>Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(f, i) in suppFees"
              :key="f.service"
              :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'"
            >
              <td data-field="service" class="er-cell-desc">{{ f.service }}</td>
              <td data-field="fee" class="er-cell-nowrap">{{ f.fee }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="er-section">
      <div class="er-section-title">Transfer Tax</div>
      <p class="er-note">
        Assessed on DEED instruments at <strong>0.5 GP per 100 GP</strong> of consideration.
        Nominal consideration instruments must attach form ELD-TC-01 or the full rate of <strong>2.0 GP per 100 GP</strong> applies.
      </p>
      <div class="er-table-wrap">
        <table class="er-table">
          <thead>
            <tr class="er-table-head">
              <th>Consideration Range</th><th>Transfer Tax Rate</th><th>Example Tax</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(f, i) in transferTax"
              :key="f.range"
              :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'"
            >
              <td data-field="range">{{ f.range }}</td>
              <td data-field="rate" class="er-cell-nowrap">{{ f.rate }}</td>
              <td data-field="example" class="er-cell-nowrap">{{ f.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.er-loading { padding: 40px 24px; color: var(--er-muted); font-family: var(--er-font); }
.er-fees { padding: 24px; }
.er-section { margin-bottom: 28px; }
.er-section-title { font-size: 14px; font-weight: 700; color: var(--er-text); font-family: var(--er-font); margin-bottom: 10px; }
.er-note { font-size: 13px; color: var(--er-muted); font-family: var(--er-font); margin-bottom: 10px; line-height: 1.6; }
.er-table-wrap { overflow-x: auto; }
.er-table {
  width: 100%; border-collapse: collapse;
  font-family: var(--er-font); font-size: 13px;
  background: var(--er-surface);
  border: 1px solid var(--er-border); border-radius: var(--er-radius);
}
.er-table-head { background: var(--er-bg); border-bottom: 2px solid var(--er-border); }
.er-table-head th { padding: 9px 12px; text-align: left; font-weight: 600; color: var(--er-muted); white-space: nowrap; }
.er-row { border-bottom: 1px solid var(--er-border); background: var(--er-surface); }
.er-row-alt { background: var(--er-bg); }
.er-row td { padding: 8px 12px; color: var(--er-text); }
.er-type-badge { background: var(--er-primary); color: #fff; font-family: monospace; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; }
.er-cell-desc { color: var(--er-muted) !important; font-size: 12px !important; }
.er-cell-nowrap { white-space: nowrap; }
</style>
