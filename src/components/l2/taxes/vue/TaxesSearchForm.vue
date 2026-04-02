<!--
  @qscrape L2 / vue / taxes / island
  @component TaxesSearchForm
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { indexLabels, indexTypes } from '../../../../data/taxes/deeds';
import '../../../../styles/l2/taxes.css';

const allIndexTypes = ['ALL', ...indexTypes];
const _indexLabels = indexLabels;

const ready = ref(false);
const lastFirm = ref('');
const first = ref('');
const index = ref('ALL');

function getUrlSearch() {
  const p = new URLSearchParams(window.location.search);
  return {
    lastFirm: p.get('lastFirm') ?? '',
    first: p.get('first') ?? '',
    index: p.get('index') ?? 'ALL',
  };
}

function dispatchSearch(lf: string, fi: string, ix: string) {
  const url = new URL(window.location.href);
  if (lf) { url.searchParams.set('lastFirm', lf); } else { url.searchParams.delete('lastFirm'); }
  if (fi) { url.searchParams.set('first', fi); } else { url.searchParams.delete('first'); }
  if (ix !== 'ALL') { url.searchParams.set('index', ix); } else { url.searchParams.delete('index'); }
  url.searchParams.delete('file');
  history.pushState(null, '', url.toString());
  window.dispatchEvent(new CustomEvent('taxes:search', { detail: { lastFirm: lf, first: fi, index: ix } }));
}

function handleSubmit(e: Event) {
  e.preventDefault();
  dispatchSearch(lastFirm.value, first.value, index.value);
}

function handleClear() {
  lastFirm.value = '';
  first.value = '';
  index.value = 'ALL';
  dispatchSearch('', '', 'ALL');
}

function onPop() {
  const s = getUrlSearch();
  lastFirm.value = s.lastFirm;
  first.value = s.first;
  index.value = s.index;
}

function onSearch(e: Event) {
  const d = (e as CustomEvent<{ lastFirm: string; first: string; index: string }>).detail;
  lastFirm.value = d.lastFirm;
  first.value = d.first;
  index.value = d.index;
}

onMounted(() => {
  const s = getUrlSearch();
  lastFirm.value = s.lastFirm;
  first.value = s.first;
  index.value = s.index;
  fakeGet(null).then(() => { ready.value = true; });
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
  <form
    v-else
    data-component="taxes-search-form"
    data-framework="vue"
    class="er-search-form"
    @submit="handleSubmit"
  >
    <div class="er-form-grid">
      <div class="er-form-group">
        <label class="er-label">Last Name / Firm</label>
        <input
          v-model="lastFirm"
          type="text"
          placeholder="e.g. ARMOK HOLDINGS"
          class="er-input"
        />
      </div>
      <div class="er-form-group">
        <label class="er-label">First Name</label>
        <input v-model="first" type="text" class="er-input" />
      </div>
      <div class="er-form-group">
        <label class="er-label">Index Type</label>
        <select v-model="index" class="er-input">
          <option v-for="t in allIndexTypes" :key="t" :value="t">
            {{ t === 'ALL' ? 'All Types' : `${t} — ${indexLabels[t as keyof typeof indexLabels]}` }}
          </option>
        </select>
      </div>
    </div>
    <div class="er-form-actions">
      <button type="submit" class="er-btn-primary">Search</button>
      <button type="button" class="er-btn-secondary" @click="handleClear">Clear</button>
    </div>
  </form>
</template>

<style scoped>
.er-loading { padding: 16px; color: var(--er-muted); font-family: var(--er-font); }
.er-search-form {
  background: var(--er-surface);
  border: 1px solid var(--er-border);
  border-radius: var(--er-radius);
  padding: 20px;
}
.er-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.er-form-group { display: flex; flex-direction: column; gap: 4px; }
.er-label { font-size: 12px; font-weight: 600; color: var(--er-muted); }
.er-input {
  padding: 7px 10px;
  border: 1px solid var(--er-border);
  border-radius: var(--er-radius);
  font-family: var(--er-font);
  font-size: 14px;
  background: var(--er-bg);
  color: var(--er-text);
}
.er-form-actions { display: flex; gap: 8px; }
.er-btn-primary {
  background: var(--er-primary);
  color: #fff;
  border: none;
  border-radius: var(--er-radius);
  padding: 8px 20px;
  font-family: var(--er-font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.er-btn-secondary {
  background: transparent;
  color: var(--er-muted);
  border: 1px solid var(--er-border);
  border-radius: var(--er-radius);
  padding: 8px 16px;
  font-family: var(--er-font);
  font-size: 14px;
  cursor: pointer;
}
</style>
