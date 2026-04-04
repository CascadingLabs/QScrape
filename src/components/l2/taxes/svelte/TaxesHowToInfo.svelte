<!--
  @qscrape L2 / svelte / taxes / island
  @component TaxesHowToInfo
-->
<script lang="ts">
import { onMount } from 'svelte';
import { fakeGet } from '../../../../data/api';
import '../../../../styles/l2/taxes.css';

let ready = false;
onMount(() => {
	fakeGet(null).then(() => {
		ready = true;
	});
});
</script>

{#if !ready}
  <div class="er-loading">Loading…</div>
{:else}
  <div data-component="taxes-how-to-info" data-framework="svelte" class="er-info-wrap">
    <div class="er-info-card">
      <div class="er-card-header">About These Guides</div>
      <p class="er-card-body">
        Official guides for property owners, attorneys, contractors, and clan representatives.
        Each guide covers purpose, required elements, filing process, and common pitfalls.
      </p>
      <p class="er-card-note">
        For the fee schedule see <a href="/l2/taxes/recording-fees/" class="er-link">Recording Fees</a>.
      </p>
    </div>
    <div class="er-info-card">
      <div class="er-card-header">Public Counter</div>
      <div class="er-contact-body">
        <div data-field="address">Hall of Records, Level Z-1, Room 14</div>
        <div>Mountainhome Civic Quarter</div>
        <div data-field="phone">Rune-Wire: (555) 234-5678</div>
        <div data-field="hours">Hours: M–F 8:30AM–5:00PM</div>
        <div data-field="email"><a href="mailto:rod@eldoria.gov" class="er-link">rod@eldoria.gov</a></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .er-loading { padding: 16px; color: var(--er-muted); font-family: var(--er-font); }
  .er-info-wrap { display: flex; flex-direction: column; gap: 16px; }
  .er-info-card { background: var(--er-surface); border: 1px solid var(--er-border); border-radius: var(--er-radius); overflow: hidden; font-family: var(--er-font); }
  .er-card-header { background: var(--er-bg); border-bottom: 1px solid var(--er-border); padding: 10px 14px; font-size: 11px; font-weight: 700; color: var(--er-muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .er-card-body { font-size: 13px; color: var(--er-text); line-height: 1.6; padding: 14px 14px 6px; }
  .er-card-note { font-size: 13px; color: var(--er-muted); padding: 0 14px 14px; }
  .er-contact-body { padding: 14px; font-size: 13px; color: var(--er-text); line-height: 1.8; }
  .er-link { color: var(--er-primary); }
</style>
