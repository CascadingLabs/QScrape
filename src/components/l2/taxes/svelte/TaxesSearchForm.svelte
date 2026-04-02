<!--
  @qscrape L2 / svelte / taxes / island
  @component TaxesSearchForm
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { indexLabels, indexTypes } from '../../../../data/taxes/deeds';
  import '../../../../styles/l2/taxes.css';

  const allIndexTypes = ['ALL', ...indexTypes];
  const _indexLabels = indexLabels;

  let ready = false;
  let lastFirm = '';
  let first = '';
  let index = 'ALL';

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
    dispatchSearch(lastFirm, first, index);
  }

  function handleClear() {
    lastFirm = '';
    first = '';
    index = 'ALL';
    dispatchSearch('', '', 'ALL');
  }

  function onPop() {
    const s = getUrlSearch();
    lastFirm = s.lastFirm;
    first = s.first;
    index = s.index;
  }

  function onSearch(e: Event) {
    const d = (e as CustomEvent<{ lastFirm: string; first: string; index: string }>).detail;
    lastFirm = d.lastFirm;
    first = d.first;
    index = d.index;
  }

  onMount(() => {
    const s = getUrlSearch();
    lastFirm = s.lastFirm;
    first = s.first;
    index = s.index;
    fakeGet(null).then(() => { ready = true; });
    window.addEventListener('popstate', onPop);
    window.addEventListener('taxes:search', onSearch);
  });

  onDestroy(() => {
    window.removeEventListener('popstate', onPop);
    window.removeEventListener('taxes:search', onSearch);
  });
</script>

{#if !ready}
  <div class="er-loading">Loading…</div>
{:else}
  <form
    data-component="taxes-search-form"
    data-framework="svelte"
    class="er-search-form"
    on:submit={handleSubmit}
  >
    <div class="er-form-grid">
      <div class="er-form-group">
        <label class="er-label">Last Name / Firm</label>
        <input type="text" bind:value={lastFirm} placeholder="e.g. ARMOK HOLDINGS" class="er-input" />
      </div>
      <div class="er-form-group">
        <label class="er-label">First Name</label>
        <input type="text" bind:value={first} class="er-input" />
      </div>
      <div class="er-form-group">
        <label class="er-label">Index Type</label>
        <select bind:value={index} class="er-input">
          {#each allIndexTypes as t (t)}
            <option value={t}>
              {t === 'ALL' ? 'All Types' : `${t} — ${indexLabels[t as keyof typeof indexLabels]}`}
            </option>
          {/each}
        </select>
      </div>
    </div>
    <div class="er-form-actions">
      <button type="submit" class="er-btn-primary">Search</button>
      <button type="button" class="er-btn-secondary" on:click={handleClear}>Clear</button>
    </div>
  </form>
{/if}

<style>
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
    background: var(--er-primary); color: #fff; border: none;
    border-radius: var(--er-radius); padding: 8px 20px;
    font-family: var(--er-font); font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .er-btn-secondary {
    background: transparent; color: var(--er-muted);
    border: 1px solid var(--er-border); border-radius: var(--er-radius);
    padding: 8px 16px; font-family: var(--er-font); font-size: 14px; cursor: pointer;
  }
</style>
