<!--
  @qscrape L2 / svelte / news / island
  @component NewsWeatherWidget
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { getBreaking } from '../../../../data/news/articles';
  import { advisories, metrics, statusColor, updated, zones } from '../../../../data/news/geomantic';
  import '../../../../styles/l2/news.css';

  let ready = false;
  const breaking = getBreaking();
  const _zones = zones;
  const _metrics = metrics;
  const _advisories = advisories;
  const _updated = updated;
  const _statusColor = statusColor;

  function goToArticle(id: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    url.searchParams.delete('cat');
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('news:article', { detail: id }));
    window.scrollTo(0, 0);
  }

  onMount(() => {
    fakeGet(null).then(() => { ready = true; });
  });
</script>

{#if !ready}
  <div class="hn-loading">Loading…</div>
{:else}
  <div data-component="news-weather-widget" data-framework="svelte">

    {#if breaking.length > 0}
      <div class="hn-wx-box hn-wx-breaking-box">
        <div class="hn-wx-header">
          <h4 class="hn-wx-title">Breaking</h4>
        </div>
        <div>
          {#each breaking as a (a.id)}
            <button
              type="button"
              data-article-id={a.id}
              class="hn-wx-breaking-btn"
              on:click={() => goToArticle(a.id)}
            >{a.headline}</button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="hn-wx-box">
      <div class="hn-wx-header">
        <h4 class="hn-wx-title">Geomantic Conditions</h4>
      </div>
      <table class="hn-wx-table">
        <thead>
          <tr class="hn-wx-thead-row">
            <th class="hn-wx-th">Zone</th>
            <th class="hn-wx-th">Status</th>
            <th class="hn-wx-th hn-wx-th-r">Temp</th>
          </tr>
        </thead>
        <tbody>
          {#each _zones as z (z.zone)}
            <tr class="hn-wx-row">
              <td class="hn-wx-td">{z.zone}</td>
              <td class="hn-wx-td">
                <span data-status={z.statusClass} class="hn-wx-status" style="color: {_statusColor[z.statusClass]}">{z.status}</span>
              </td>
              <td class="hn-wx-td hn-wx-td-r">{z.temp}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="hn-wx-metrics">
        <div class="hn-wx-metric-row">
          <span class="hn-wx-metric-label">Seismic:</span> {_metrics.seismic}<br />
          <span class="hn-wx-metric-label">Magma:</span> {_metrics.magma}<br />
          <span class="hn-wx-metric-label">Aquifer:</span> {_metrics.aquifer}<br />
          <span class="hn-wx-metric-label">Wind:</span> {_metrics.wind}
        </div>
        {#each _advisories as a (a)}
          <div class="hn-wx-advisory">⚠ {a}</div>
        {/each}
        <div class="hn-wx-updated">Updated: {_updated}<br />Source: Geomancer's Office</div>
      </div>
    </div>

  </div>
{/if}

<style>
  .hn-loading { padding: 12px; color: #888; font-family: system-ui; }
  .hn-wx-box { border: 1px solid var(--hn-border); border-radius: var(--hn-radius); overflow: hidden; background: var(--hn-surface); }
  .hn-wx-breaking-box { margin-bottom: 16px; }
  .hn-wx-header { background: var(--hn-masthead-bg); padding: 8px 12px; }
  .hn-wx-title { font-family: var(--hn-font-ui); font-size: 11px; font-weight: 700; color: var(--hn-masthead-text); text-transform: uppercase; letter-spacing: 0.08em; }
  .hn-wx-breaking-btn { display: block; width: 100%; background: none; border: none; border-bottom: 1px solid var(--hn-border); padding: 9px 12px; text-align: left; cursor: pointer; font-family: var(--hn-font-display); font-size: 13px; font-weight: 600; color: var(--hn-text); line-height: 1.3; }
  .hn-wx-breaking-btn:hover { color: var(--hn-accent); }
  .hn-wx-table { width: 100%; border-collapse: collapse; font-family: var(--hn-font-ui); font-size: 11px; }
  .hn-wx-thead-row { background: var(--hn-bg); }
  .hn-wx-th { padding: 5px 8px; text-align: left; color: var(--hn-muted); font-weight: 600; border-bottom: 1px solid var(--hn-border); }
  .hn-wx-th-r { text-align: right; }
  .hn-wx-row { border-top: 1px solid var(--hn-border); }
  .hn-wx-td { padding: 4px 8px; color: var(--hn-text); white-space: nowrap; }
  .hn-wx-td-r { text-align: right; color: var(--hn-muted); }
  .hn-wx-status { font-weight: 700; font-size: 10px; }
  .hn-wx-metrics { padding: 8px 12px; border-top: 1px solid var(--hn-border); font-family: var(--hn-font-ui); font-size: 11px; }
  .hn-wx-metric-row { color: var(--hn-muted); margin-bottom: 6px; line-height: 1.6; }
  .hn-wx-metric-label { color: var(--hn-text); font-weight: 600; }
  .hn-wx-advisory { color: #dc2626; font-size: 10px; margin-bottom: 2px; }
  .hn-wx-updated { color: var(--hn-muted); font-size: 10px; margin-top: 6px; line-height: 1.5; }
</style>
