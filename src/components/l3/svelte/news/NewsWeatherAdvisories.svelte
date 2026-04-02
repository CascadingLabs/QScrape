<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { getLiveGeomantic } from '../../../../data/news/geomantic';

type AdvisoryData = { advisories: string[]; updated: string };

const fakeAdvisories = [
	'Z-Level 12 temperature exceeds seasonal forecast.',
	'Aquifer pressure differential at 110% of nominal.',
	'Surface patrol routes suspended pending weather clearance.',
];

let data: AdvisoryData | null = null;

onMount(() => {
	const geo = getLiveGeomantic();
	fakeGetMs(
		{ advisories: geo.advisories, updated: geo.updated } as AdvisoryData,
		800,
		250,
	).then((d) => {
		data = d;
	});
});
</script>

<div>
  {#if !data}
    <div class="hn3-wx-adv-loading">Loading…</div>
  {:else}
    <div class="hn3-wx-advisories">
      {#if data.advisories.length > 0}
        <ul class="hn3-wx-adv-list">
          {#each data.advisories as adv}
            <li class="hn3-wx-adv-item">
              <span class="hn3-wx-adv-wrap">
                <span class="hn3-wx-adv-real">{adv}</span>
                <span class="hn3-wx-adv-decoy" aria-hidden="true">{fakeAdvisories[data.advisories.indexOf(adv) % fakeAdvisories.length]}</span>
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="hn3-wx-adv-clear">No active advisories.</p>
      {/if}
      <div class="hn3-wx-adv-footer">
        <span class="hn3-wx-adv-updated-wrap">
          <span class="hn3-wx-adv-updated-real">Updated: {data.updated}</span>
          <span class="hn3-wx-adv-updated-decoy" aria-hidden="true">Updated: Mar 11, 312 · 4:00 AM</span>
        </span>
        <span class="hn3-wx-adv-src">Source: Geomancer's Office</span>
      </div>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/news.css';

  .hn3-wx-adv-loading {
    min-height: 40px;
    display: flex;
    align-items: center;
    color: var(--hn3-muted);
    font-family: var(--hn3-font-body);
    font-size: 14px;
  }

  .hn3-wx-advisories {
    padding: 12px 14px;
    border-top: 1px solid var(--hn3-border);
  }

  .hn3-wx-adv-list {
    list-style: none;
    padding: 0;
    margin: 0 0 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .hn3-wx-adv-item {
    font-family: var(--hn3-font-body);
    font-size: 11px;
    color: #dc2626;
    line-height: 1.5;
  }
  .hn3-wx-adv-item::before {
    content: '\26A0\0020';
  }

  .hn3-wx-adv-wrap {
    position: relative;
    display: inline;
  }
  .hn3-wx-adv-real {
    position: relative;
    z-index: 1;
  }
  .hn3-wx-adv-decoy {
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }

  .hn3-wx-adv-clear {
    font-family: var(--hn3-font-body);
    font-size: 11px;
    color: var(--hn3-muted);
    margin: 0 0 8px;
    font-style: italic;
  }

  .hn3-wx-adv-footer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-family: var(--hn3-font-body);
    font-size: 10px;
    color: var(--hn3-muted);
    line-height: 1.5;
    padding-top: 8px;
    border-top: 1px solid var(--hn3-border);
  }

  .hn3-wx-adv-updated-wrap {
    position: relative;
    display: inline-block;
  }
  .hn3-wx-adv-updated-real {
    position: relative;
    z-index: 1;
  }
  .hn3-wx-adv-updated-decoy {
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }

  .hn3-wx-adv-src {
    color: var(--hn3-muted);
  }
</style>
