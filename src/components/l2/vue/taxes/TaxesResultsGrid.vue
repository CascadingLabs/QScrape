<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesResultsGrid
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import type { DeedRecord, IndexType, StatusType } from '../../../../data/taxes/deeds';
import { deeds, indexLabels, searchDeeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const PER_PAGE = 10;

const ready = ref(false);
const view = ref<'list' | 'detail'>('list');
const currentFile = ref<string | null>(null);
const results = ref<DeedRecord[]>(deeds);
const page = ref(1);

const currentRecord = computed(() =>
  currentFile.value ? deeds.find((d) => d.fileNum === currentFile.value) ?? null : null
);

const totalPages = computed(() => Math.ceil(results.value.length / PER_PAGE));
const pageItems = computed(() =>
  results.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE)
);

const statusColors: Record<StatusType, [string, string]> = {
  RECORDED: ['var(--er-recorded-bg)', 'var(--er-recorded)'],
  SATISFIED: ['var(--er-satisfied-bg)', 'var(--er-satisfied)'],
  DELINQUENT: ['var(--er-delinquent-bg)', 'var(--er-delinquent)'],
};

function getUrlState() {
  const p = new URLSearchParams(window.location.search);
  return {
    file: p.get('file'),
    lastFirm: p.get('lastFirm') ?? '',
    first: p.get('first') ?? '',
    index: p.get('index') ?? 'ALL',
  };
}

function applySearch(lf: string, fi: string, ix: string) {
  results.value = searchDeeds({ lastFirm: lf, first: fi, index: ix !== 'ALL' ? ix : undefined });
  view.value = 'list';
  page.value = 1;
}

function viewRecord(fileNum: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('file', fileNum);
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
  window.scrollTo(0, 0);
}

function onBack() {
  history.back();
}

function onPop() {
  const s = getUrlState();
  if (s.file) {
    view.value = 'detail';
    currentFile.value = s.file;
  } else {
    view.value = 'list';
    results.value = searchDeeds({ lastFirm: s.lastFirm, first: s.first, index: s.index !== 'ALL' ? s.index : undefined });
    page.value = 1;
  }
}

function onSearch(e: Event) {
  const d = (e as CustomEvent<{ lastFirm: string; first: string; index: string }>).detail;
  applySearch(d.lastFirm, d.first, d.index);
}

function onView(e: Event) {
  currentFile.value = (e as CustomEvent<string>).detail;
  view.value = 'detail';
}

function indexLabel(t: string) {
  return `${t} — ${indexLabels[t as IndexType]}`;
}

onMounted(() => {
  const s = getUrlState();
  if (s.file) {
    view.value = 'detail';
    currentFile.value = s.file;
  } else {
    results.value = searchDeeds({ lastFirm: s.lastFirm, first: s.first, index: s.index !== 'ALL' ? s.index : undefined });
  }
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('taxes:search', onSearch);
  window.addEventListener('taxes:view', onView);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('taxes:search', onSearch);
  window.removeEventListener('taxes:view', onView);
});
</script>

<template>
  <div v-if="!ready" class="er-loading">Loading…</div>

  <!-- Inline viewer -->
  <div
    v-else-if="view === 'detail' && currentRecord"
    :data-component="'taxes-viewer'"
    :data-file-num="currentRecord.fileNum"
    class="er-viewer"
  >
    <button type="button" class="er-back-btn" @click="onBack">← Back to Results</button>
    <div class="er-viewer-card">
      <div class="er-viewer-header">
        <h2 class="er-viewer-title">Document Viewer — File {{ currentRecord.fileNum }}</h2>
        <span
          class="er-status-badge"
          :data-status="currentRecord.status"
          :style="{ background: statusColors[currentRecord.status][0], color: statusColors[currentRecord.status][1] }"
        >{{ currentRecord.status }}</span>
      </div>
      <table class="er-detail-table">
        <tbody>
          <tr><th>File Number</th><td data-field="file-num">{{ currentRecord.fileNum }}</td></tr>
          <tr><th>Index Type</th><td data-field="index">{{ indexLabel(currentRecord.index) }}</td></tr>
          <tr><th>Record Date</th><td data-field="record-date">{{ currentRecord.recordDate }}</td></tr>
          <tr><th>Satisfied</th><td data-field="sat">{{ currentRecord.sat ? 'Yes' : 'No' }}</td></tr>
          <tr><th>Last / Firm</th><td data-field="last-firm">{{ currentRecord.lastFirm }}</td></tr>
          <tr><th>First Name</th><td data-field="first">{{ currentRecord.first || '—' }}</td></tr>
          <tr><th>Amount</th><td data-field="amount">{{ currentRecord.amount }}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="er-pdf-wrap">
      <div class="er-pdf-header">
        <span>Document: {{ currentRecord.fileNum }}.pdf</span>
        <a :href="`/${currentRecord.fileNum}.pdf`" download class="er-pdf-dl">Download PDF</a>
      </div>
      <iframe :src="`/${currentRecord.fileNum}.pdf`" class="er-pdf-frame" :title="`Deed ${currentRecord.fileNum}`" />
    </div>
  </div>

  <!-- Results list -->
  <div v-else data-component="taxes-results-grid" data-framework="vue">
    <div class="er-results-count">{{ results.length }} record{{ results.length !== 1 ? 's' : '' }} found</div>
    <div class="er-table-wrap">
      <table class="er-table">
        <thead>
          <tr class="er-table-head">
            <th>File #</th><th>Index</th><th>Date</th><th>SAT</th>
            <th>Last / Firm</th><th>First</th><th>Amount</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(d, i) in pageItems"
            :key="d.fileNum"
            :data-file-num="d.fileNum"
            :class="i % 2 === 0 ? 'er-row' : 'er-row er-row-alt'"
          >
            <td class="er-cell-mono">{{ d.fileNum }}</td>
            <td><span class="er-index-badge">{{ d.index }}</span></td>
            <td class="er-cell-muted">{{ d.recordDate }}</td>
            <td :class="d.sat ? 'er-cell-sat' : ''">{{ d.sat ? 'SAT' : '' }}</td>
            <td>{{ d.lastFirm }}</td>
            <td>{{ d.first }}</td>
            <td class="er-cell-nowrap">{{ d.amount }}</td>
            <td>
              <span
                class="er-status-badge"
                :data-status="d.status"
                :style="{ background: statusColors[d.status][0], color: statusColors[d.status][1] }"
              >{{ d.status }}</span>
            </td>
            <td>
              <button type="button" class="er-view-btn" @click="viewRecord(d.fileNum)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="er-pagination">
      <button
        v-for="n in totalPages"
        :key="n"
        type="button"
        :class="['er-page-btn', n === page && 'er-page-btn-active']"
        @click="page = n"
      >{{ n }}</button>
    </div>
  </div>
</template>

<style scoped>
.er-loading { padding: 40px 24px; color: var(--er-muted); font-family: var(--er-font); }
.er-results-count { padding: 10px 0; margin-bottom: 8px; color: var(--er-muted); font-size: 13px; font-family: var(--er-font); }
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
.er-cell-mono { font-family: monospace; font-weight: 600; white-space: nowrap; }
.er-cell-muted { color: var(--er-muted) !important; white-space: nowrap; }
.er-cell-sat { color: var(--er-recorded) !important; font-weight: 600; }
.er-cell-nowrap { white-space: nowrap; }
.er-index-badge {
  background: var(--er-bg); border: 1px solid var(--er-border);
  border-radius: 3px; padding: 1px 6px; font-size: 11px; font-weight: 700; color: var(--er-text);
}
.er-status-badge { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 3px; letter-spacing: 0.03em; }
.er-view-btn {
  background: var(--er-primary); color: #fff; border: none;
  border-radius: var(--er-radius); padding: 4px 10px;
  font-size: 12px; cursor: pointer; font-family: var(--er-font);
}
.er-pagination { display: flex; gap: 6px; margin-top: 16px; justify-content: center; flex-wrap: wrap; }
.er-page-btn {
  padding: 5px 10px; border: 1px solid var(--er-border);
  border-radius: var(--er-radius); background: transparent;
  color: var(--er-text); cursor: pointer; font-family: var(--er-font); font-size: 13px;
}
.er-page-btn-active { background: var(--er-primary); color: #fff; border-color: var(--er-primary); }

/* Viewer */
.er-viewer { padding: 24px; }
.er-back-btn {
  background: none; border: none; color: var(--er-primary);
  cursor: pointer; font-family: var(--er-font); font-size: 13px;
  padding: 0; margin-bottom: 16px;
}
.er-viewer-card {
  background: var(--er-surface); border: 1px solid var(--er-border);
  border-radius: var(--er-radius); overflow: hidden;
}
.er-viewer-header {
  background: var(--er-primary); color: #fff; padding: 14px 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.er-viewer-title { font-size: 16px; font-weight: 600; font-family: var(--er-font); }
.er-detail-table { width: 100%; border-collapse: collapse; font-family: var(--er-font); font-size: 14px; }
.er-detail-table tr { border-bottom: 1px solid var(--er-border); }
.er-detail-table th {
  padding: 10px 16px; text-align: left; font-weight: 600; color: var(--er-muted);
  width: 160px; background: var(--er-bg); white-space: nowrap;
}
.er-detail-table td { padding: 10px 16px; color: var(--er-text); }
.er-pdf-wrap { margin-top: 20px; border: 1px solid var(--er-border); border-radius: var(--er-radius); overflow: hidden; }
.er-pdf-header { background: var(--er-surface); border-bottom: 1px solid var(--er-border); padding: 10px 16px; font-size: 13px; color: var(--er-muted); font-family: var(--er-font); display: flex; justify-content: space-between; align-items: center; }
.er-pdf-dl { color: var(--er-primary); font-size: 12px; font-weight: 600; text-decoration: none; }
.er-pdf-frame { width: 100%; height: 400px; border: none; display: block; }
</style>
