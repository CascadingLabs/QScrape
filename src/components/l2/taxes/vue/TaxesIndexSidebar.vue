<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesIndexSidebar
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { deeds, indexLabels, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const allIndexTypes = ['ALL', ...indexTypes];
const _indexLabels = indexLabels;
const ready = ref(false);
const active = ref('ALL');

const counts = Object.fromEntries(
	indexTypes.map((t) => [t, deeds.filter((d) => d.index === t).length]),
);

function getActiveIndex() {
	return new URLSearchParams(window.location.search).get('index') ?? 'ALL';
}

function dispatchSearch(ix: string) {
	const url = new URL(window.location.href);
	if (ix !== 'ALL') {
		url.searchParams.set('index', ix);
	} else {
		url.searchParams.delete('index');
	}
	url.searchParams.delete('lastFirm');
	url.searchParams.delete('first');
	url.searchParams.delete('file');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(
		new CustomEvent('taxes:search', {
			detail: { lastFirm: '', first: '', index: ix },
		}),
	);
}

function select(ix: string) {
	active.value = ix;
	dispatchSearch(ix);
}

function onPop() {
	active.value = getActiveIndex();
}
function onSearch(e: Event) {
	active.value = (e as CustomEvent<{ index: string }>).detail.index;
}

onMounted(() => {
	active.value = getActiveIndex();
	fakeGet(null).then(() => {
		ready.value = true;
	});
	window.addEventListener('popstate', onPop);
	window.addEventListener('taxes:search', onSearch);
});

onUnmounted(() => {
	window.removeEventListener('popstate', onPop);
	window.removeEventListener('taxes:search', onSearch);
});
</script>

<template>
  <div v-if="!ready" class="er-loading">Loading…</div>
  <div
    v-else
    data-component="taxes-index-sidebar"
    data-framework="vue"
    class="er-index-sidebar"
  >
    <div class="er-sidebar-header">Index Type</div>
    <div class="er-sidebar-body">
      <button
        v-for="t in allIndexTypes"
        :key="t"
        type="button"
        :data-index="t"
        :class="['er-index-btn', active === t && 'er-index-btn-active']"
        @click="select(t)"
      >
        <span>{{ t === 'ALL' ? 'All Types' : `${t} — ${indexLabels[t as keyof typeof indexLabels]}` }}</span>
        <span class="er-index-count">{{ t === 'ALL' ? deeds.length : counts[t] }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.er-loading { padding: 12px; color: var(--er-muted); font-family: var(--er-font); }
.er-index-sidebar {
  background: var(--er-surface); border: 1px solid var(--er-border);
  border-radius: var(--er-radius); overflow: hidden;
}
.er-sidebar-header {
  background: var(--er-bg); border-bottom: 1px solid var(--er-border);
  padding: 10px 14px; font-size: 12px; font-weight: 700;
  color: var(--er-muted); letter-spacing: 0.04em; text-transform: uppercase;
  font-family: var(--er-font);
}
.er-sidebar-body { padding: 8px; }
.er-index-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 7px 10px; border-radius: 3px; border: none; cursor: pointer;
  font-family: var(--er-font); font-size: 13px;
  background: transparent; color: var(--er-text);
  margin-bottom: 2px; text-align: left;
}
.er-index-btn:hover { background: var(--er-bg); }
.er-index-btn-active { background: var(--er-primary) !important; color: #fff; }
.er-index-count { font-size: 11px; opacity: 0.75; flex-shrink: 0; }
</style>
