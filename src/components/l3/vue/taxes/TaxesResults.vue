<script setup lang="ts">
// @qscrape L3 / vue island / taxes — search results table
// Anti-bot: status badge via CSS ::before pseudo-element — content: attr(data-status)
// element.textContent on .er3-status returns empty string; requires getComputedStyle(el,'::before').content
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { type DeedRecord, deeds } from '../../../../data/taxes/deeds';

const results = ref<DeedRecord[] | null>(null);

onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	const q = (params.get('q') || '').trim().toUpperCase();
	const filtered = q
		? deeds.filter(
				(d) =>
					d.fileNum.toUpperCase().includes(q) ||
					d.lastFirm.toUpperCase().includes(q),
			)
		: deeds;
	fakeGetMs(filtered, 600, 250).then((data) => {
		results.value = data;
	});
});
</script>

<template>
  <div data-island="vue-results">
    <div v-if="!results" class="er3-results-loading">Loading…</div>
    <div v-else class="er3-results">
      <div class="er3-results-header">
        <span class="er3-results-count">{{ results.length }} record{{ results.length !== 1 ? 's' : '' }} found</span>
      </div>
      <div class="er3-table-wrap">
        <table class="er3-table">
          <thead>
            <tr>
              <th class="er3-th">File #</th>
              <th class="er3-th">Type</th>
              <th class="er3-th">Date</th>
              <th class="er3-th">Party</th>
              <th class="er3-th">Amount</th>
              <th class="er3-th">Status</th>
              <th class="er3-th er3-th-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deed in results"
              :key="deed.fileNum"
              class="er3-tr"
              :data-file-num="deed.fileNum"
            >
              <td class="er3-td er3-td-mono">{{ deed.fileNum }}</td>
              <td class="er3-td er3-td-mono">{{ deed.index }}</td>
              <td class="er3-td er3-td-mono">{{ deed.recordDate }}</td>
              <td class="er3-td">
                {{ deed.lastFirm }}{{ deed.first ? ', ' + deed.first : '' }}
              </td>
              <td class="er3-td er3-td-mono">{{ deed.amount }}</td>
              <td class="er3-td">
                <!-- Anti-bot: status text lives in CSS ::before, textContent is empty -->
                <span
                  class="er3-status"
                  :data-status="deed.status"
                  :data-status-type="deed.status.toLowerCase()"
                ></span>
              </td>
              <td class="er3-td er3-td-action">
                <a :href="`/l3/taxes/viewer/${deed.fileNum}/`" class="er3-view-link">View →</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/taxes.css';

.er3-results-loading {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--er3-muted);
	font-family: var(--er3-font);
	font-size: 14px;
}

.er3-results {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.er3-results-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.er3-results-count {
	font-family: var(--er3-font);
	font-size: 13px;
	color: var(--er3-muted);
}

.er3-table-wrap {
	overflow-x: auto;
	border: 1px solid var(--er3-border);
	border-radius: var(--er3-radius);
}

.er3-table {
	width: 100%;
	border-collapse: collapse;
	font-family: var(--er3-font);
	font-size: 13px;
}

.er3-th {
	padding: 10px 14px;
	text-align: left;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--er3-muted);
	background: var(--er3-surface2);
	border-bottom: 1px solid var(--er3-border);
	white-space: nowrap;
}
.er3-th-action {
	width: 60px;
}

.er3-tr {
	border-bottom: 1px solid var(--er3-border);
}
.er3-tr:last-child {
	border-bottom: none;
}
.er3-tr:hover {
	background: var(--er3-primary-dim);
}

.er3-td {
	padding: 11px 14px;
	color: var(--er3-text);
	vertical-align: middle;
}
.er3-td-mono {
	font-family: var(--er3-font-mono);
	font-size: 12px;
}
.er3-td-action {
	text-align: right;
}

/* Anti-bot: status text via pseudo-element, not textContent */
.er3-status {
	display: inline-block;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	padding: 2px 8px;
	border-radius: 2px;
}
.er3-status::before {
	content: attr(data-status);
}
.er3-status[data-status-type="recorded"] {
	color: var(--er3-recorded);
	background: var(--er3-recorded-bg);
}
.er3-status[data-status-type="satisfied"] {
	color: var(--er3-satisfied);
	background: var(--er3-satisfied-bg);
}
.er3-status[data-status-type="delinquent"] {
	color: var(--er3-delinquent);
	background: var(--er3-delinquent-bg);
}

.er3-view-link {
	font-family: var(--er3-font);
	font-size: 12px;
	font-weight: 600;
	color: var(--er3-primary);
	text-decoration: none;
	white-space: nowrap;
}
.er3-view-link:hover {
	color: var(--er3-primary-hover);
	text-decoration: underline;
}
</style>
