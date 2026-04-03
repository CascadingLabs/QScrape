<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { addToCart } from '../../../../data/eshop/l3cart';
import {
	getByCategory,
	type ProductMeta,
	products,
} from '../../../../data/eshop/products';

const items = ref<ProductMeta[] | null>(null);
const justAdded = ref<string | null>(null);

onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	const cat = params.get('cat');
	const filtered = cat ? getByCategory(cat) : products;
	fakeGetMs(filtered, 600, 250).then((data) => {
		items.value = data;
	});
});

function handleAddToCart(sku: string) {
	addToCart(sku);
	justAdded.value = sku;
	setTimeout(() => {
		if (justAdded.value === sku) {
			justAdded.value = null;
		}
	}, 1500);
}

function handleOrderNow(sku: string) {
	addToCart(sku);
	window.location.href = '/l3/eshop/cart/?view=checkout';
}
</script>

<template>
  <div>
    <div v-if="!items" class="a">Loading…</div>
    <div v-else class="b">
      <a
        v-for="p in items"
        :key="p.sku"
        :href="`/l3/eshop/product/${p.sku}/`"
        class="c"
        :data-0="p.sku"
      >
        <div class="d">
          <img :src="p.image" :alt="p.name" class="e" loading="lazy" />
          <div class="f">
            <span v-if="p.isNew" class="g h">New</span>
            <span v-if="p.salePrice !== undefined" class="g i">Sale</span>
            <span v-if="!p.inStock" class="g j">OOS</span>
          </div>
        </div>
        <div class="k">
          <span class="l" :data-1="p.category"></span>
          <span class="n m" :data-2="p.name"></span>
          <span class="o m" :data-3="p.inStock" :data-2="p.inStock ? 'In Stock' : 'Out of Stock'"></span>
          <div v-if="p.inStock" class="p" @click.stop>
            <button
              type="button"
              class="q r"
              :class="{ 's': justAdded === p.sku }"
              @click.prevent="handleAddToCart(p.sku)"
            >
              {{ justAdded === p.sku ? 'Added ✓' : 'Add to Cart' }}
            </button>
            <button
              type="button"
              class="q t"
              @click.prevent="handleOrderNow(p.sku)"
            >
              Order Now
            </button>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/eshop.css';

.a { min-height: 200px; display: flex; align-items: center; color: var(--vm3-muted); font-family: var(--vm3-font); font-size: 14px; }

.b { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 900px) { .b { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .b { grid-template-columns: 1fr; } }

.c {
	display: flex;
	flex-direction: column;
	background: var(--vm3-surface);
	border: 1px solid var(--vm3-border);
	border-radius: var(--vm3-radius);
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	box-shadow: var(--vm3-shadow);
	transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.c:hover { border-color: var(--vm3-border-hover); box-shadow: var(--vm3-shadow-hover); transform: translateY(-2px); }

.d { position: relative; overflow: hidden; }
.e { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; }

.f { position: absolute; top: 8px; left: 8px; display: flex; flex-direction: column; gap: 4px; }
.g { display: inline-block; padding: 2px 6px; border-radius: 4px; font-family: var(--vm3-font); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.h { background: var(--vm3-primary); color: #fff; }
.i { background: var(--vm3-sale); color: #fff; }
.j { background: #333; color: var(--vm3-muted); }

.k { display: flex; flex-direction: column; gap: 6px; padding: 12px; }
.l { display: inline-block; font-family: var(--vm3-font); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vm3-primary); }
.l::before { content: attr(data-1); }
.m::before { content: attr(data-2); }
.n { font-family: var(--vm3-font); font-size: 14px; font-weight: 600; color: var(--vm3-text); line-height: 1.35; }
.o { font-family: var(--vm3-font); font-size: 11px; color: var(--vm3-muted); }
.o[data-3="false"] { color: var(--vm3-sale); }

.p { display: flex; gap: 6px; margin-top: 4px; }
.q {
	flex: 1;
	padding: 6px 8px;
	border: none;
	border-radius: 6px;
	font-family: var(--vm3-font);
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s;
}
.r { background: var(--vm3-cta); color: #fff; }
.r:hover { background: var(--vm3-cta-hover); }
.s { background: var(--vm3-primary); }
.t { background: var(--vm3-primary); color: #fff; }
.t:hover { background: var(--vm3-primary-hover); }
</style>
