<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesHowTo
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

const guides = [
	{
		type: 'DEED',
		title: 'Recording a Deed',
		desc: "How to transfer title to subterranean real property — warranty deeds, quitclaim deeds, trustee's deeds, required elements, and filing steps.",
	},
	{
		type: 'MTG',
		title: 'Filing and Managing a Mortgage',
		desc: 'How to record a mortgage, required uniform covenants, and how to obtain a satisfaction once the loan is paid in full.',
	},
	{
		type: 'LIEN',
		title: "Filing a Mechanic's Lien",
		desc: 'Who may file, statutory deadlines, Notice to Owner requirements, Schedule A itemization, and how to contest or release a lien.',
	},
	{
		type: 'ESMT',
		title: 'Registering an Easement',
		desc: 'How to create and record utility, access, drainage, and magma-routing easements including coordinate description requirements.',
	},
	{
		type: 'ASGN',
		title: 'Filing an Assignment of Mortgage',
		desc: 'How to transfer a mortgage lien to a new holder, required elements, Mortgagor notification rules, and partial assignments.',
	},
	{
		type: 'REL',
		title: 'Releasing a Lien or Mortgage',
		desc: 'Mortgagee obligations upon payoff, step-by-step release process, penalties for delayed discharge, and judicial release procedures.',
	},
	{
		type: 'NTC',
		title: 'Filing a Notice of Commencement',
		desc: 'When a NOC is required, what to include, job-site posting requirements, and how to amend or terminate a NOC after project completion.',
	},
	{
		type: 'AFF',
		title: 'Filing an Affidavit of Title',
		desc: 'What must be disclosed, legal consequences of false statements, and how to prepare and record a sworn title affidavit.',
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
  <div v-else data-component="taxes-how-to" data-framework="vue" class="er-how-to">
    <p class="er-intro">
      Official filing guides for each document type. Click <strong>View Guide</strong> to read the PDF.
      For the fee schedule see <a href="/l2/taxes/recording-fees/" class="er-link">Recording Fees</a>.
    </p>
    <div class="er-table-wrap">
      <table class="er-table">
        <thead>
          <tr class="er-table-head">
            <th>Index Type</th><th>Guide Title</th><th>Description</th><th>PDF</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(g, i) in guides"
            :key="g.type"
            :data-index-type="g.type"
            :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'"
          >
            <td><span class="er-type-badge">{{ g.type }}</span></td>
            <td data-field="title" class="er-cell-title">{{ g.title }}</td>
            <td data-field="desc" class="er-cell-desc">{{ g.desc }}</td>
            <td class="er-cell-nowrap">
              <a :href="`/how-to/how-to-${g.type.toLowerCase()}.pdf`" target="_blank" rel="noreferrer" class="er-guide-link">View Guide</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.er-loading { padding: 40px 24px; color: var(--er-muted); font-family: var(--er-font); }
.er-how-to { padding: 24px; }
.er-intro { margin-bottom: 16px; font-size: 14px; color: var(--er-muted); font-family: var(--er-font); }
.er-link { color: var(--er-primary); }
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
.er-cell-title { font-weight: 600; white-space: nowrap; }
.er-cell-desc { color: var(--er-muted) !important; font-size: 12px !important; }
.er-cell-nowrap { white-space: nowrap; }
.er-guide-link { color: var(--er-primary); font-size: 12px; font-weight: 600; text-decoration: none; }
</style>
