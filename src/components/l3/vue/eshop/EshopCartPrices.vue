<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { formatPrice, getProductBySku } from '../../../../data/eshop/products';
import {
	CART_EVENT,
	VIEW_EVENT,
	ORDER_EVENT,
	type ViewState,
	getCart,
	getView,
	updateQty,
	validateInput,
	type ValidateType,
} from '../../../../data/eshop/l3cart';

type PriceRow = {
	sku: string;
	name: string;
	unitPrice: string;
	lineTotal: string;
	qty: number;
	onSale: boolean;
};

type OrderInfo = {
	orderId: string;
	total: number;
};

const rows = ref<PriceRow[]>([]);
const ready = ref(false);
const view = ref<ViewState>(getView());
const orderInfo = ref<OrderInfo | null>(null);

function loadCart() {
	const cart = getCart();
	const data: PriceRow[] = [];
	for (const ci of cart) {
		const p = getProductBySku(ci.sku);
		if (p) {
			const price = p.salePrice ?? p.basePrice;
			data.push({
				sku: ci.sku,
				name: p.name,
				unitPrice: formatPrice(price),
				lineTotal: formatPrice(price * ci.qty),
				qty: ci.qty,
				onSale: p.salePrice !== undefined,
			});
		}
	}
	rows.value = data;
}

function handleCartEvent() {
	loadCart();
}

function handleViewEvent(e: Event) {
	view.value = (e as CustomEvent<ViewState>).detail;
}

function handleOrderEvent(e: Event) {
	orderInfo.value = (e as CustomEvent<OrderInfo>).detail;
}

function handlePopstate() {
	view.value = getView();
}

function decrement(sku: string, qty: number) {
	updateQty(sku, qty - 1);
}

function increment(sku: string, qty: number) {
	updateQty(sku, qty + 1);
}

function onValidateInput(event: Event) {
	const input = event.target as HTMLInputElement;
	const type = (input.getAttribute('data-10') || 'text') as ValidateType;
	const err = validateInput(input.value, type);
	input.style.borderColor = err
		? 'var(--vm3-sale)'
		: input.value.trim()
			? 'var(--vm3-cta)'
			: '';
}

onMounted(() => {
	fakeGetMs(null, 600, 250).then(() => {
		loadCart();
		ready.value = true;
	});
	window.addEventListener(CART_EVENT, handleCartEvent);
	window.addEventListener(VIEW_EVENT, handleViewEvent);
	window.addEventListener(ORDER_EVENT, handleOrderEvent);
	window.addEventListener('popstate', handlePopstate);
});

onUnmounted(() => {
	window.removeEventListener(CART_EVENT, handleCartEvent);
	window.removeEventListener(VIEW_EVENT, handleViewEvent);
	window.removeEventListener(ORDER_EVENT, handleOrderEvent);
	window.removeEventListener('popstate', handlePopstate);
});
</script>

<template>
  <div>
    <div v-if="!ready" class="a">Loading…</div>

    <div v-else-if="view === 'confirm' && orderInfo" class="ab">
      <div class="ac" :data-0="`Order: ${orderInfo.orderId}`"></div>
      <div class="ac" :data-0="`Total charged: ${formatPrice(orderInfo.total)}`"></div>
      <div class="ac" data-0="Shipping: Free"></div>
    </div>

    <div v-else-if="view === 'checkout'" class="o">
      <h3 class="p" data-1="Payment"></h3>
      <p class="q" data-2="Test card: 4111 1111 1111 1111 · any future date · any CVV"></p>
      <div class="r">
        <div class="t s">
          <label class="u" data-3="Card Number"></label>
          <input type="text" class="v" placeholder="4111 1111 1111 1111"
            data-9 data-10="card" data-3="Card Number"
            @input="onValidateInput" />
        </div>
        <div class="t">
          <label class="u" data-3="Expiry"></label>
          <input type="text" class="v" placeholder="MM / YY"
            data-9 data-10="expiry" data-3="Expiry"
            @input="onValidateInput" />
        </div>
        <div class="t">
          <label class="u" data-3="CVV"></label>
          <input type="text" class="v" placeholder="···"
            data-9 data-10="cvv" data-3="CVV"
            @input="onValidateInput" />
        </div>
      </div>

      <h3 class="p" data-1="Order Items"></h3>
      <div class="w">
        <div v-for="row in rows" :key="row.sku" class="x" :data-4="row.sku">
          <span class="y j" :data-5="row.name"></span>
          <span class="z j" :data-5="`×${row.qty}`"></span>
          <span class="aa" :data-6="row.lineTotal"></span>
        </div>
      </div>
    </div>

    <div v-else-if="rows.length > 0" class="b">
      <h3 class="c">Prices</h3>
      <div class="d">
        <div v-for="row in rows" :key="row.sku" class="e" :data-4="row.sku">
          <div class="f">
            <button type="button" class="g" @click="decrement(row.sku, row.qty)">−</button>
            <span class="h" :data-8="row.qty">{{ row.qty }}</span>
            <button type="button" class="g" @click="increment(row.sku, row.qty)">+</button>
          </div>
          <span class="i" :data-7="row.unitPrice" :class="{ 'k': row.onSale }"></span>
          <span class="l" :data-6="row.lineTotal"></span>
        </div>
      </div>
    </div>

    <div v-else-if="ready" class="m">
      <span class="n">No items to price</span>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/eshop.css';

.a { min-height: 200px; display: flex; align-items: center; color: var(--vm3-muted); font-family: var(--vm3-font); font-size: 14px; }

.b { display: flex; flex-direction: column; gap: 0; }
.c { font-family: var(--vm3-font); font-size: 14px; font-weight: 700; color: var(--vm3-text); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid var(--vm3-primary); }

.d { display: flex; flex-direction: column; }
.e { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--vm3-border); font-family: var(--vm3-font); font-size: 13px; }
.e:last-child { border-bottom: none; }

.f { display: flex; align-items: center; gap: 4px; }
.g { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--vm3-surface2); border: 1px solid var(--vm3-border); border-radius: 6px; color: var(--vm3-text); font-family: var(--vm3-font); font-size: 14px; cursor: pointer; transition: border-color 0.15s; }
.g:hover { border-color: var(--vm3-primary); }
.h { min-width: 24px; text-align: center; font-weight: 600; color: var(--vm3-text); }

.i { flex: 1; color: var(--vm3-muted); font-size: 12px; }
.j::before { content: attr(data-5); }
.i::before { content: attr(data-7); }
.i.k { color: var(--vm3-sale); }
.l { font-weight: 700; color: var(--vm3-text); min-width: 120px; text-align: right; }
.l::before { content: attr(data-6); }

.m { min-height: 100px; display: flex; align-items: center; justify-content: center; }
.n { font-family: var(--vm3-font); font-size: 14px; color: var(--vm3-muted); }

.o { display: flex; flex-direction: column; gap: 12px; }
.p { font-family: var(--vm3-font); font-size: 14px; font-weight: 700; color: var(--vm3-text); text-transform: uppercase; letter-spacing: 0.05em; margin: 8px 0 0; }
.p::before { content: attr(data-1); }
.q { font-family: var(--vm3-font); font-size: 12px; color: var(--vm3-muted); margin: 0; }
.q::before { content: attr(data-2); }

.r { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.s { grid-column: 1 / -1; }
.t { display: flex; flex-direction: column; gap: 4px; }
.u { font-family: var(--vm3-font); font-size: 12px; font-weight: 600; color: var(--vm3-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.u::before { content: attr(data-3); }
.v { width: 100%; padding: 9px 12px; border: 1px solid var(--vm3-border); border-radius: var(--vm3-radius); font-size: 14px; color: var(--vm3-text); background: var(--vm3-surface); font-family: var(--vm3-font); box-sizing: border-box; transition: border-color 0.15s; }
.v:focus { outline: none; border-color: var(--vm3-primary); }

.w { display: flex; flex-direction: column; }
.x { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--vm3-border); font-family: var(--vm3-font); font-size: 13px; }
.x:last-child { border-bottom: none; }
.y { flex: 1; color: var(--vm3-text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.z { color: var(--vm3-muted); font-size: 12px; }
.aa { font-weight: 600; color: var(--vm3-text); min-width: 100px; text-align: right; }
.aa::before { content: attr(data-6); }

.ab { display: flex; flex-direction: column; gap: 8px; padding: 12px 0; }
.ac { font-family: var(--vm3-font); font-size: 14px; color: var(--vm3-muted); }
.ac::before { content: attr(data-0); }
</style>
