<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesRecentRecords
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { deeds } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const ready = ref(false);
const recent = deeds.slice(0, 8);

function goToRecord(fileNum: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('file', fileNum);
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('taxes:view', { detail: fileNum }));
	window.scrollTo(0, 0);
}

onMounted(() => {
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
</script>

<template>
  <div v-if="!ready" class="er-loading">Loading…</div>
  <div
    v-else
    data-component="taxes-recent-records"
    data-framework="vue"
    class="er-recent"
  >
    <div class="er-recent-header">Recent Filings</div>
    <div class="er-recent-body">
      <button
        v-for="d in recent"
        :key="d.fileNum"
        type="button"
        :data-file-num="d.fileNum"
        class="er-recent-btn"
        @click="goToRecord(d.fileNum)"
      >
        <div class="er-recent-filenum">{{ d.fileNum }}</div>
        <div class="er-recent-name">
          <span class="er-recent-index">{{ d.index }}</span>
          {{ d.lastFirm }}
        </div>
        <div class="er-recent-date">{{ d.recordDate }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.er-loading { padding: 12px; color: var(--er-muted); font-family: var(--er-font); }
.er-recent {
  background: var(--er-surface); border: 1px solid var(--er-border);
  border-radius: var(--er-radius); overflow: hidden;
}
.er-recent-header {
  background: var(--er-bg); border-bottom: 1px solid var(--er-border);
  padding: 10px 14px; font-size: 12px; font-weight: 700;
  color: var(--er-muted); letter-spacing: 0.04em; text-transform: uppercase;
  font-family: var(--er-font);
}
.er-recent-body { padding: 8px; }
.er-recent-btn {
  width: 100%; text-align: left; padding: 8px 10px; border-radius: 3px;
  border: none; background: transparent; cursor: pointer;
  font-family: var(--er-font); margin-bottom: 2px; display: block;
}
.er-recent-btn:hover { background: var(--er-bg); }
.er-recent-filenum { font-size: 12px; font-family: monospace; font-weight: 600; color: var(--er-primary); margin-bottom: 2px; }
.er-recent-name { font-size: 12px; color: var(--er-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.er-recent-index {
  background: var(--er-bg); border: 1px solid var(--er-border);
  border-radius: 2px; padding: 0 4px; font-size: 10px; font-weight: 700; margin-right: 5px;
}
.er-recent-date { font-size: 11px; color: var(--er-muted); margin-top: 2px; }
</style>
