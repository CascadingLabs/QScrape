<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	getProductBySku,
	type ProductMeta,
} from '../../../../data/eshop/products';

const props = defineProps<{ sku: string }>();

const product = ref<ProductMeta | null>(null);

onMounted(() => {
	const p = getProductBySku(props.sku);
	fakeGetMs(p ?? null, 600, 250).then((data) => {
		product.value = data;
	});
});
</script>

<template>
  <div>
    <div v-if="!product" class="vm3-pname-loading">Loading…</div>
    <div v-else class="vm3-pname-root" :data-sku="product.sku">
      <span class="vm3-prod-cat" :data-cat="product.category"></span>
      <h2 class="vm3-prod-name">{{ product.name }}</h2>
      <p class="vm3-prod-excerpt">{{ product.excerpt }}</p>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/eshop.css';

.vm3-pname-loading {
	min-height: 80px;
	display: flex;
	align-items: center;
	color: var(--vm3-muted);
	font-family: var(--vm3-font);
	font-size: 14px;
}

.vm3-pname-root {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.vm3-prod-cat {
	display: inline-block;
	font-family: var(--vm3-font);
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--vm3-primary);
}
.vm3-prod-cat::before {
	content: attr(data-cat);
}

.vm3-prod-name {
	font-family: var(--vm3-font);
	font-size: 26px;
	font-weight: 700;
	color: var(--vm3-text);
	line-height: 1.25;
	letter-spacing: -0.3px;
	margin: 0;
}

.vm3-prod-excerpt {
	font-family: var(--vm3-font);
	font-size: 14px;
	color: var(--vm3-muted);
	line-height: 1.6;
	margin: 0;
}
</style>
