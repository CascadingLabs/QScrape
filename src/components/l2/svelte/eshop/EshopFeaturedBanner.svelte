<!--
  @qscrape L2 / svelte / eshop / island
  @component EshopFeaturedBanner
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { getFeatured } from '../../../../data/eshop/products';
  import '../../../../styles/l2/eshop.css';

  let ready = false;
  const featured = getFeatured().slice(0, 4);

  function goToProduct(sku: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('sku', sku);
    url.searchParams.delete('cat');
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
    window.scrollTo(0, 0);
  }

  onMount(() => {
    fakeGet(null).then(() => { ready = true; });
  });
</script>

{#if !ready}
  <div class="vm-loading">Loading…</div>
{:else}
  <div data-component="eshop-featured-banner" data-framework="svelte" class="vm-fbanner">
    <div class="vm-fbanner-header">
      <h3 class="vm-fbanner-title">Featured Products</h3>
    </div>
    <div class="vm-fbanner-list">
      {#each featured as p (p.sku)}
        <div data-sku={p.sku} data-featured="true" class="vm-fbanner-item" on:click={() => goToProduct(p.sku)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && goToProduct(p.sku)}>
          <img
            src={p.image}
            alt={p.name}
            width="60"
            height="45"
            loading="lazy"
            class="vm-fbanner-img"
          />
          <div class="vm-fbanner-info">
            <div class="vm-fbanner-name">{p.name}</div>
            <div
              data-price={(p.salePrice ?? p.basePrice).toFixed(2)}
              class="vm-fbanner-price"
              class:vm-fbanner-price-sale={!!p.salePrice}
            >
              {(p.salePrice ?? p.basePrice).toFixed(2)} GS
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .vm-loading { padding: 12px; color: #888; font-family: system-ui; }
  .vm-fbanner {
    border: 1px solid var(--vm-border);
    border-radius: var(--vm-radius);
    overflow: hidden;
    background: var(--vm-surface);
  }
  .vm-fbanner-header {
    background: var(--vm-primary);
    padding: 12px 16px;
  }
  .vm-fbanner-title {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .vm-fbanner-list {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .vm-fbanner-item {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
  }
  .vm-fbanner-item:hover .vm-fbanner-name { text-decoration: underline; }
  .vm-fbanner-img {
    width: 60px;
    height: 45px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .vm-fbanner-info { flex: 1; min-width: 0; }
  .vm-fbanner-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--vm-text);
    line-height: 1.3;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .vm-fbanner-price {
    font-size: 13px;
    color: var(--vm-primary);
    font-weight: 600;
  }
  .vm-fbanner-price-sale { color: var(--vm-sale); }
</style>
