<script lang="ts">
import { onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import {
	formatPrice,
	getByCategory,
	type ProductMeta,
	products,
} from '../../../../data/eshop/products';

type PriceItem = {
	sku: string;
	name: string;
	realPrice: string;
	fakePrice: string;
	inStock: boolean;
	onSale: boolean;
};

let items: PriceItem[] | null = null;

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	const cat = params.get('cat');
	const filtered: ProductMeta[] = cat ? getByCategory(cat) : products;
	const data: PriceItem[] = filtered.map((p) => ({
		sku: p.sku,
		name: p.name,
		realPrice: formatPrice(p.salePrice ?? p.basePrice),
		fakePrice: formatPrice(p.basePrice + Math.floor(p.sku.length % 7) + 4.5),
		inStock: p.inStock,
		onSale: p.salePrice !== undefined,
	}));
	fakeGetMs(data, 800, 250).then((d) => {
		items = d;
	});
});
</script>

<div>
  {#if !items}
    <div class="a">Loading…</div>
  {:else}
    <div class="b">
      <h3 class="c">Prices</h3>
      {#each items as item}
        <div class="d" data-0={item.sku}>
          <span class="e">
            <span class="f">
              <span class="g">{item.name}</span>
              <span class="h" aria-hidden="true">{item.name.split('').reverse().join('')}</span>
            </span>
          </span>
          <span class="i">
            <span class="j" class:k={item.onSale}>{item.realPrice}</span>
            <span class="l" aria-hidden="true">{item.fakePrice}</span>
          </span>
          <span class="m" class:n={!item.inStock}>
            {item.inStock ? 'In Stock' : 'OOS'}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/eshop.css';

  .a {
    min-height: 100px;
    display: flex;
    align-items: center;
    color: var(--vm3-muted);
    font-family: var(--vm3-font);
    font-size: 14px;
  }

  .b {
    background: var(--vm3-surface2);
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .c {
    font-family: var(--vm3-font);
    font-size: 14px;
    font-weight: 700;
    color: var(--vm3-text);
    margin: 0 0 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--vm3-primary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .d {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid var(--vm3-border);
    font-family: var(--vm3-font);
    font-size: 12px;
  }
  .d:last-child {
    border-bottom: none;
  }

  .e {
    flex: 1;
    color: var(--vm3-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .f { position: relative; display: inline; }
  .g { position: relative; z-index: 1; }
  .h { position: absolute; top: 0; left: 0; color: transparent; z-index: 2; pointer-events: none; user-select: none; white-space: nowrap; }

  .i {
    position: relative;
    display: inline-block;
    min-width: 120px;
    text-align: right;
  }
  .j {
    font-weight: 600;
    color: var(--vm3-text);
    position: relative;
    z-index: 1;
  }
  .j.k {
    color: var(--vm3-sale);
  }
  .l {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: right;
    font-weight: 600;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .m {
    font-size: 11px;
    color: var(--vm3-cta);
    font-weight: 500;
    min-width: 48px;
    text-align: right;
  }
  .n {
    color: var(--vm3-sale);
  }
</style>
