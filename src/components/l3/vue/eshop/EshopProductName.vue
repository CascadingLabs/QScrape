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
    <div v-if="!product" class="a">Loading…</div>
    <div v-else class="b" :data-0="product.sku">
      <span class="c" :data-1="product.category"></span>
      <h2 class="d e" :data-2="product.name"></h2>
      <p class="f e" :data-2="product.excerpt"></p>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/eshop.css';
</style>

<style scoped>
.a {
	min-height: 80px;
	display: flex;
	align-items: center;
	color: var(--vm3-muted);
	font-family: var(--vm3-font);
	font-size: 14px;
}

.b {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.c {
	display: inline-block;
	font-family: var(--vm3-font);
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--vm3-primary);
}
.c::before {
	content: attr(data-1);
}
.e::before {
	content: attr(data-2);
}

.d {
	font-family: var(--vm3-font);
	font-size: 26px;
	font-weight: 700;
	color: var(--vm3-text);
	line-height: 1.25;
	letter-spacing: -0.3px;
	margin: 0;
}

.f {
	font-family: var(--vm3-font);
	font-size: 14px;
	color: var(--vm3-muted);
	line-height: 1.6;
	margin: 0;
}
</style>
