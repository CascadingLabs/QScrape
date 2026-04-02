<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fakeGetMs } from '../../../../data/api';
import { formatPrice, getProductBySku } from '../../../../data/eshop/products';
import {
	CART_EVENT,
	VIEW_EVENT,
	ORDER_EVENT,
	type ViewState,
	cartCount,
	clearCart,
	getCart,
	getView,
	setView,
} from '../../../../data/eshop/l3cart';

type SummaryData = {
	itemCount: number;
	subtotal: string;
	fakeSubtotal: string;
	total: string;
	fakeTotal: string;
};

let data: SummaryData | null = null;
let ready = false;
let view: ViewState = getView();
let orderTotal = '';
let fakeOrderTotal = '';

function loadCart() {
	const cart = getCart();
	let subtotalVal = 0;
	for (const ci of cart) {
		const p = getProductBySku(ci.sku);
		if (p) {
			subtotalVal += (p.salePrice ?? p.basePrice) * ci.qty;
		}
	}
	const count = cartCount(cart);
	const fakeAdd = (count % 5) * 3.75 + 12.5;
	data = {
		itemCount: count,
		subtotal: formatPrice(subtotalVal),
		fakeSubtotal: formatPrice(subtotalVal + fakeAdd),
		total: formatPrice(subtotalVal),
		fakeTotal: formatPrice(subtotalVal + fakeAdd + 2.25),
	};
}

function handleCartEvent() {
	loadCart();
}

function handleViewEvent(e: Event) {
	view = (e as CustomEvent<ViewState>).detail;
}

function handleOrderEvent(e: Event) {
	const detail = (e as CustomEvent<{ orderId: string; total: number }>).detail;
	orderTotal = formatPrice(detail.total);
	fakeOrderTotal = formatPrice(detail.total + 14.75);
}

function handlePopstate() {
	view = getView();
}

function goCheckout() {
	setView('checkout');
}

function handleClear() {
	clearCart();
}

onMount(() => {
	fakeGetMs(null, 800, 250).then(() => {
		loadCart();
		ready = true;
	});
	window.addEventListener(CART_EVENT, handleCartEvent);
	window.addEventListener(VIEW_EVENT, handleViewEvent);
	window.addEventListener(ORDER_EVENT, handleOrderEvent);
	window.addEventListener('popstate', handlePopstate);
});

onDestroy(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener(CART_EVENT, handleCartEvent);
		window.removeEventListener(VIEW_EVENT, handleViewEvent);
		window.removeEventListener(ORDER_EVENT, handleOrderEvent);
		window.removeEventListener('popstate', handlePopstate);
	}
});
</script>

<div>
  {#if !ready}
    <div class="a">Loading…</div>

  {:else if view === 'confirm'}
    <div class="b">
      <h3 class="c">Payment Complete</h3>
      <div class="d k">
        <span class="e l">Amount Charged</span>
        <span class="g n">
          <span class="h m">{orderTotal}</span>
          <span class="i" aria-hidden="true">{fakeOrderTotal}</span>
        </span>
      </div>
      <div class="d">
        <span class="e">Shipping</span>
        <span class="f">Free</span>
      </div>
    </div>

  {:else if data && data.itemCount > 0}
    <div class="b">
      <h3 class="c">{view === 'checkout' ? 'Order Total' : 'Order Summary'}</h3>
      <div class="d">
        <span class="e">Items</span>
        <span class="f">{data.itemCount}</span>
      </div>
      <div class="d">
        <span class="e">Subtotal</span>
        <span class="g">
          <span class="h">{data.subtotal}</span>
          <span class="i" aria-hidden="true">{data.fakeSubtotal}</span>
        </span>
      </div>
      <div class="d">
        <span class="e">Shipping</span>
        <span class="f">Free</span>
      </div>
      <div class="j"></div>
      <div class="d k">
        <span class="e l">Total</span>
        <span class="g n">
          <span class="h m">{data.total}</span>
          <span class="i" aria-hidden="true">{data.fakeTotal}</span>
        </span>
      </div>
      {#if view === 'cart'}
        <button type="button" class="o" on:click={goCheckout}>Proceed to Checkout</button>
        <button type="button" class="p" on:click={handleClear}>Clear Cart</button>
      {/if}
    </div>

  {:else if ready}
    <div class="q">
      <span class="r">Nothing to summarize</span>
    </div>
  {/if}
</div>

<style>
  @import '../../../../styles/l3/eshop.css';

  .a { min-height: 150px; display: flex; align-items: center; color: var(--vm3-muted); font-family: var(--vm3-font); font-size: 14px; }

  .b {
    background: var(--vm3-surface2);
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .c { font-family: var(--vm3-font); font-size: 14px; font-weight: 700; color: var(--vm3-text); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 4px; padding-bottom: 8px; border-bottom: 2px solid var(--vm3-primary); }
  .d { display: flex; justify-content: space-between; align-items: center; font-family: var(--vm3-font); font-size: 14px; }
  .e { color: var(--vm3-muted); }
  .f { font-weight: 600; color: var(--vm3-text); }

  .g { position: relative; display: inline-block; min-width: 140px; text-align: right; }
  .h { font-weight: 600; color: var(--vm3-text); position: relative; z-index: 1; }
  .i { position: absolute; top: 0; left: 0; width: 100%; text-align: right; font-weight: 600; color: transparent; z-index: 2; pointer-events: none; user-select: none; }

  .j { height: 1px; background: var(--vm3-border); }
  .k { font-size: 16px; }
  .l { font-weight: 700; color: var(--vm3-text); }
  .m { font-size: 18px; font-weight: 700; color: var(--vm3-cta); }
  .n { min-width: 160px; }

  .o {
    margin-top: 4px;
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
  .o:hover { background: var(--vm3-cta-hover); }

  .p {
    padding: 10px 16px;
    background: none;
    border: 1px solid var(--vm3-border);
    border-radius: var(--vm3-radius);
    color: var(--vm3-muted);
    font-family: var(--vm3-font);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .p:hover { border-color: var(--vm3-sale); color: var(--vm3-sale); }

  .q { min-height: 100px; display: flex; align-items: center; justify-content: center; }
  .r { font-family: var(--vm3-font); font-size: 14px; color: var(--vm3-muted); }
</style>
