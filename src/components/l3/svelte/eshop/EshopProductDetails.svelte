<script lang="ts">
// @qscrape L3 / svelte island / eshop — product price, availability, add-to-cart (product detail page)
// Anti-bot: decoy overlay — real price at z-index 1, fake price at z-index 2
// (color: transparent, pointer-events: none). DOM has both; scraper must resolve z-index.
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	formatPrice,
	getProductBySku,
	type ProductMeta,
} from '../../../../data/eshop/products';

export let sku: string;

type PriceData = {
	product: ProductMeta;
	realPrice: string;
	fakePrice: string;
	onSale: boolean;
	originalPrice: string;
};

let _data: PriceData | null = null;

onMount(() => {
	const p = getProductBySku(sku);
	if (!p) {
		return;
	}
	const pd: PriceData = {
		product: p,
		realPrice: formatPrice(p.salePrice ?? p.basePrice),
		fakePrice: formatPrice(p.basePrice + Math.floor(p.sku.length % 7) + 4.5),
		onSale: p.salePrice !== undefined,
		originalPrice: formatPrice(p.basePrice),
	};
	fakeGetMs(pd, 800, 250).then((d) => {
		_data = d;
	});
});
</script>

<div data-island="svelte-product-details">
  {#if !data}
    <div class="vm3-pd-loading">Loading…</div>
  {:else}
    <div class="vm3-pd-root" data-sku={data.product.sku}>
      <div class="vm3-pd-price-section">
        <span class="vm3-pd-label">Price</span>
        <!-- Anti-bot decoy: real price below, fake price overlaid -->
        <span class="vm3-price-wrap">
          <span class="vm3-price-real" class:vm3-price-sale={data.onSale}>{data.realPrice}</span>
          <span class="vm3-price-decoy" aria-hidden="true">{data.fakePrice}</span>
        </span>
        {#if data.onSale}
          <span class="vm3-pd-original">Was: {data.originalPrice}</span>
        {/if}
      </div>

      <div class="vm3-pd-avail">
        <span class="vm3-pd-label">Availability</span>
        <span class="vm3-pd-stock" class:vm3-pd-oos={!data.product.inStock}>
          {data.product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        {#if data.product.stock !== undefined && data.product.inStock}
          <span class="vm3-pd-qty">Only {data.product.stock} left</span>
        {/if}
      </div>

      <button class="vm3-pd-btn" disabled={!data.product.inStock} aria-label="Add to cart">
        {data.product.inStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/eshop.css';

  .vm3-pd-loading {
    min-height: 120px;
    display: flex;
    align-items: center;
    color: var(--vm3-muted);
    font-family: var(--vm3-font);
    font-size: 14px;
  }

  .vm3-pd-root {
    background: var(--vm3-surface2);
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .vm3-pd-label {
    display: block;
    font-family: var(--vm3-font);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--vm3-muted);
    margin-bottom: 4px;
  }

  .vm3-pd-price-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Anti-bot: decoy overlay on price */
  .vm3-price-wrap {
    position: relative;
    display: inline-block;
    min-width: 160px;
  }
  .vm3-price-real {
    font-family: var(--vm3-font);
    font-size: 22px;
    font-weight: 700;
    color: var(--vm3-text);
    position: relative;
    z-index: 1;
  }
  .vm3-price-real.vm3-price-sale {
    color: var(--vm3-sale);
  }
  .vm3-price-decoy {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    font-family: var(--vm3-font);
    font-size: 22px;
    font-weight: 700;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .vm3-pd-original {
    font-family: var(--vm3-font);
    font-size: 13px;
    color: var(--vm3-muted);
    text-decoration: line-through;
  }

  .vm3-pd-avail {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .vm3-pd-stock {
    font-family: var(--vm3-font);
    font-size: 14px;
    font-weight: 600;
    color: var(--vm3-cta);
  }
  .vm3-pd-oos {
    color: var(--vm3-sale);
  }

  .vm3-pd-qty {
    font-family: var(--vm3-font);
    font-size: 12px;
    color: var(--vm3-muted);
  }

  .vm3-pd-btn {
    padding: 12px 20px;
    background: var(--vm3-cta);
    color: #fff;
    border: none;
    border-radius: var(--vm3-radius);
    font-family: var(--vm3-font);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
    width: 100%;
  }
  .vm3-pd-btn:hover:not(:disabled) {
    background: var(--vm3-cta-hover);
  }
  .vm3-pd-btn:disabled {
    background: #333;
    color: var(--vm3-muted);
    cursor: not-allowed;
  }
</style>
