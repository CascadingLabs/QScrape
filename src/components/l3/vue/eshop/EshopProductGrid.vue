<script setup lang="ts">
// @qscrape L3 / vue island / eshop — product card grid (catalog page)
// Anti-bot: category badge rendered via CSS ::before pseudo-element content
// element.textContent on .vm3-cat returns empty string; requires getComputedStyle(el,'::before').content
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	getByCategory,
	type ProductMeta,
	products,
} from '../../../../data/eshop/products';

const items = ref<ProductMeta[] | null>(null);

onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	const cat = params.get('cat');
	const filtered = cat ? getByCategory(cat) : products;
	fakeGetMs(filtered, 600, 250).then((data) => {
		items.value = data;
	});
});
</script>

<template>
  <div data-island="vue-product-grid">
    <div v-if="!items" class="vm3-grid-loading">Loading…</div>
    <div v-else class="vm3-grid">
      <a
        v-for="p in items"
        :key="p.sku"
        :href="`/l3/eshop/product/${p.sku}/`"
        class="vm3-card"
        :data-sku="p.sku"
      >
        <div class="vm3-card-img-wrap">
          <img :src="p.image" :alt="p.name" class="vm3-card-img" loading="lazy" />
          <div class="vm3-card-badges">
            <span v-if="p.isNew" class="vm3-badge vm3-badge-new">New</span>
            <span v-if="p.salePrice !== undefined" class="vm3-badge vm3-badge-sale">Sale</span>
            <span v-if="!p.inStock" class="vm3-badge vm3-badge-oos">OOS</span>
          </div>
        </div>
        <div class="vm3-card-body">
          <!-- Anti-bot: category text lives in CSS ::before, textContent is empty -->
          <span class="vm3-cat" :data-cat="p.category"></span>
          <span class="vm3-card-name">{{ p.name }}</span>
          <span class="vm3-card-stock" :data-instock="p.inStock">
            {{ p.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/eshop.css';

.vm3-grid-loading {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--vm3-muted);
	font-family: var(--vm3-font);
	font-size: 14px;
}

.vm3-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
}
@media (max-width: 900px) {
	.vm3-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 500px) {
	.vm3-grid { grid-template-columns: 1fr; }
}

.vm3-card {
	display: flex;
	flex-direction: column;
	background: var(--vm3-surface);
	border: 1px solid var(--vm3-border);
	border-radius: var(--vm3-radius);
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	transition: border-color 0.15s;
}
.vm3-card:hover {
	border-color: var(--vm3-border-hover);
}

.vm3-card-img-wrap {
	position: relative;
	overflow: hidden;
}
.vm3-card-img {
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: cover;
	display: block;
}

.vm3-card-badges {
	position: absolute;
	top: 8px;
	left: 8px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.vm3-badge {
	display: inline-block;
	padding: 2px 6px;
	border-radius: 4px;
	font-family: var(--vm3-font);
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}
.vm3-badge-new { background: var(--vm3-primary); color: #fff; }
.vm3-badge-sale { background: var(--vm3-sale); color: #fff; }
.vm3-badge-oos { background: #333; color: var(--vm3-muted); }

.vm3-card-body {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 12px;
}

/* Anti-bot: category text via pseudo-element, not textContent */
.vm3-cat {
	display: inline-block;
	font-family: var(--vm3-font);
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.07em;
	color: var(--vm3-primary);
}
.vm3-cat::before {
	content: attr(data-cat);
}

.vm3-card-name {
	font-family: var(--vm3-font);
	font-size: 14px;
	font-weight: 600;
	color: var(--vm3-text);
	line-height: 1.35;
}

.vm3-card-stock {
	font-family: var(--vm3-font);
	font-size: 11px;
	color: var(--vm3-muted);
}
.vm3-card-stock[data-instock="false"] {
	color: var(--vm3-sale);
}
</style>
