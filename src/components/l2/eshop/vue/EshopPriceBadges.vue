<!--
  @qscrape L2 / vue / eshop / island
  @component EshopPriceBadges
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { products } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

const ready = ref(false);

function goToProduct(sku: string) {
	const url = new URL(window.location.href);
	url.searchParams.set('sku', sku);
	url.searchParams.delete('cat');
	history.pushState(null, '', url.toString());
	window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
	window.scrollTo(0, 0);
}

const saleItems = products
	.filter((p) => p.salePrice)
	.slice(0, 6)
	.map((p) => ({
		...p,
		discount: Math.round(((p.basePrice - p.salePrice!) / p.basePrice) * 100),
	}));

onMounted(() => {
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
</script>

<template>
  <div v-if="!ready" class="vm-loading">Loading…</div>
  <div
    v-else
    data-component="eshop-price-badges"
    data-framework="vue"
    class="vm-pbadge"
  >
    <h3 class="vm-pbadge-title">Sale Prices</h3>
    <ul class="vm-pbadge-list">
      <li
        v-for="p in saleItems"
        :key="p.sku"
        :data-sku="p.sku"
        class="vm-pbadge-item"
        @click="goToProduct(p.sku)"
      >
        <span class="vm-pbadge-name">{{ p.name }}</span>
        <span class="vm-pbadge-prices">
          <span :data-sale-price="p.salePrice!.toFixed(2)" class="vm-pbadge-sale">
            {{ p.salePrice!.toFixed(2) }} GS
          </span>
          <span :data-base-price="p.basePrice.toFixed(2)" class="vm-pbadge-orig">
            {{ p.basePrice.toFixed(2) }} GS
          </span>
          <span :data-discount="p.discount" class="vm-pbadge-disc">
            −{{ p.discount }}%
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.vm-loading { padding: 12px; color: #888; font-family: system-ui; }
.vm-pbadge {
  border: 1px solid var(--vm-border);
  border-radius: var(--vm-radius);
  padding: 16px;
  background: var(--vm-surface);
}
.vm-pbadge-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--vm-text);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.vm-pbadge-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vm-pbadge-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vm-border);
  cursor: pointer;
}
.vm-pbadge-item:last-child { border-bottom: none; padding-bottom: 0; }
.vm-pbadge-item:hover .vm-pbadge-name { text-decoration: underline; }
.vm-pbadge-name { font-size: 13px; color: var(--vm-text); flex: 1; line-height: 1.3; }
.vm-pbadge-prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}
.vm-pbadge-sale { font-size: 14px; font-weight: 700; color: var(--vm-sale); }
.vm-pbadge-orig { font-size: 11px; color: var(--vm-muted); text-decoration: line-through; }
.vm-pbadge-disc { font-size: 10px; font-weight: 700; color: var(--vm-cta); }
</style>
