<script lang="ts">
// @qscrape L3 / svelte island / eshop — price badge list (catalog page)
// Anti-bot: decoy overlay — real price at z-index 1, fake price at z-index 2
// (color: transparent, pointer-events: none). DOM has both; scraper must resolve z-index.
// Join with Vue product grid by data-sku attribute.
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

let _items: PriceItem[] | null = null;

onMount(() => {
	// Read ?cat= param to match Vue product grid
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
		_items = d;
	});
});
</script>

<div>
  {#if !items}
    <div class="vm3-pb-loading">Loading…</div>
  {:else}
    <div class="vm3-pb-list">
      <h3 class="vm3-pb-title">Prices</h3>
      {#each items as item}
        <div class="vm3-pb-row" data-sku={item.sku}>
          <span class="vm3-pb-name">{item.name}</span>
          <!-- Anti-bot decoy: real price below, fake price overlaid -->
          <span class="vm3-price-wrap">
            <span class="vm3-price-real" class:vm3-price-sale={item.onSale}>{item.realPrice}</span>
            <span class="vm3-price-decoy" aria-hidden="true">{item.fakePrice}</span>
          </span>
          <span class="vm3-pb-stock" class:vm3-pb-oos={!item.inStock}>
            {item.inStock ? 'In Stock' : 'OOS'}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/eshop.css';

  .vm3-pb-loading {
    min-height: 100px;
    display: flex;
    align-items: center;
    color: var(--vm3-muted);
    font-family: var(--vm3-font);
    font-size: 14px;
  }

  .vm3-pb-list {
    background: var(--vm3-surface2);
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .vm3-pb-title {
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

  .vm3-pb-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid var(--vm3-border);
    font-family: var(--vm3-font);
    font-size: 12px;
  }
  .vm3-pb-row:last-child {
    border-bottom: none;
  }

  .vm3-pb-name {
    flex: 1;
    color: var(--vm3-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Anti-bot: decoy overlay on price */
  .vm3-price-wrap {
    position: relative;
    display: inline-block;
    min-width: 120px;
    text-align: right;
  }
  .vm3-price-real {
    font-weight: 600;
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
    text-align: right;
    font-weight: 600;
    color: transparent;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .vm3-pb-stock {
    font-size: 11px;
    color: var(--vm3-cta);
    font-weight: 500;
    min-width: 48px;
    text-align: right;
  }
  .vm3-pb-oos {
    color: var(--vm3-sale);
  }
</style>
