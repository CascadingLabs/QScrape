<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	formatPrice,
	getProductBySku,
	type ProductMeta,
} from '../../../../data/eshop/products';
import { addToCart } from '../../../../data/eshop/l3cart';

export let sku: string;

type PriceData = {
	product: ProductMeta;
	realPrice: string;
	fakePrice: string;
	onSale: boolean;
	originalPrice: string;
};

let data: PriceData | null = null;
let added = false;

function handleAdd() {
	if (!data?.product.inStock) {
		return;
	}
	addToCart(data.product.sku);
	added = true;
	setTimeout(() => { added = false; }, 1500);
}

function handleOrderNow() {
	if (!data?.product.inStock) {
		return;
	}
	addToCart(data.product.sku);
	window.location.href = '/l3/eshop/cart/?view=checkout';
}

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
		data = d;
	});
});
</script>

<div>
  {#if !data}
    <div class="a">Loading…</div>
  {:else}
    <div class="b" data-0={data.product.sku}>
      <div class="d">
        <span class="c">Price</span>
        <span class="e">
          <span class="f" class:g={data.onSale}>{data.realPrice}</span>
          <span class="h" aria-hidden="true">{data.fakePrice}</span>
        </span>
        {#if data.onSale}
          <span class="i">Was: {data.originalPrice}</span>
        {/if}
      </div>

      <div class="j">
        <span class="c">Availability</span>
        <span class="k" class:o={!data.product.inStock}>
          <span class="l">
            <span class="m">{data.product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            <span class="n" aria-hidden="true">{data.product.inStock ? 'Backordered' : 'Available'}</span>
          </span>
        </span>
        {#if data.product.stock !== undefined && data.product.inStock}
          <span class="p">
            <span class="l">
              <span class="m">Only {data.product.stock} left</span>
              <span class="n" aria-hidden="true">Only {data.product.stock + 47} left</span>
            </span>
          </span>
        {/if}
      </div>

      <div class="q">
        <button
          type="button"
          class="r"
          class:s={added}
          disabled={!data.product.inStock}
          on:click={handleAdd}
        >
          {#if !data.product.inStock}
            Unavailable
          {:else if added}
            Added ✓
          {:else}
            Add to Cart
          {/if}
        </button>
        {#if data.product.inStock}
          <button
            type="button"
            class="r t"
            on:click={handleOrderNow}
          >
            Order Now
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/eshop.css';

  .a { min-height: 120px; display: flex; align-items: center; color: var(--vm3-muted); font-family: var(--vm3-font); font-size: 14px; }

  .b {
    background: var(--vm3-surface2);
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .c { display: block; font-family: var(--vm3-font); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vm3-muted); margin-bottom: 4px; }

  .d { display: flex; flex-direction: column; gap: 4px; }
  .e { position: relative; display: inline-block; min-width: 160px; }
  .f { font-family: var(--vm3-font); font-size: 22px; font-weight: 700; color: var(--vm3-text); position: relative; z-index: 1; }
  .f.g { color: var(--vm3-sale); }
  .h { position: absolute; top: 0; left: 0; width: 100%; font-family: var(--vm3-font); font-size: 22px; font-weight: 700; color: transparent; z-index: 2; pointer-events: none; user-select: none; }
  .i { font-family: var(--vm3-font); font-size: 13px; color: var(--vm3-muted); text-decoration: line-through; }

  .j { display: flex; flex-direction: column; gap: 4px; }
  .k { font-family: var(--vm3-font); font-size: 14px; font-weight: 600; color: var(--vm3-cta); }

  .l { position: relative; display: inline; }
  .m { position: relative; z-index: 1; }
  .n { position: absolute; top: 0; left: 0; color: transparent; z-index: 2; pointer-events: none; user-select: none; white-space: nowrap; }
  .o { color: var(--vm3-sale); }
  .p { font-family: var(--vm3-font); font-size: 12px; color: var(--vm3-muted); }

  .q { display: flex; gap: 8px; }

  .r {
    flex: 1;
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
  }
  .r:hover:not(:disabled) { background: var(--vm3-cta-hover); }
  .r:disabled { background: #333; color: var(--vm3-muted); cursor: not-allowed; }
  .s { background: var(--vm3-primary); }
  .s:hover:not(:disabled) { background: var(--vm3-primary-hover); }

  .t {
    background: var(--vm3-primary);
  }
  .t:hover:not(:disabled) { background: var(--vm3-primary-hover); }
</style>
