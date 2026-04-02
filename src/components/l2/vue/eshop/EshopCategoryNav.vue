<!--
  @qscrape L2 / vue / eshop / island
  @component EshopCategoryNav
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { categories } from '../../../../data/eshop/products';
import '../../../../styles/l2/eshop.css';

const allCats = ['All', ...categories];
const ready = ref(false);
const active = ref('All');

function getActiveCat() {
  return new URLSearchParams(window.location.search).get('cat') ?? 'All';
}

function navigate(cat: string) {
  const url = new URL(window.location.href);
  if (cat === 'All') { url.searchParams.delete('cat'); }
  else { url.searchParams.set('cat', cat); }
  history.pushState(null, '', url.toString());
  active.value = cat;
  window.dispatchEvent(
    new CustomEvent('eshop:cat', { detail: cat === 'All' ? null : cat }),
  );
}

function onPop() { active.value = getActiveCat(); }
function onCat(e: Event) { active.value = (e as CustomEvent<string | null>).detail ?? 'All'; }

onMounted(() => {
  active.value = getActiveCat();
  fakeGet(null).then(() => { ready.value = true; });
  window.addEventListener('popstate', onPop);
  window.addEventListener('eshop:cat', onCat);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPop);
  window.removeEventListener('eshop:cat', onCat);
});
</script>

<template>
  <div v-if="!ready" class="vm-loading">Loading…</div>
  <nav
    v-else
    data-component="eshop-category-nav"
    data-framework="vue"
    class="vm-catnav"
  >
    <button
      v-for="cat in allCats"
      :key="cat"
      type="button"
      :data-category="cat"
      :data-active="active === cat ? 'true' : undefined"
      :class="['vm-catnav-btn', active === cat && 'vm-catnav-active']"
      @click="navigate(cat)"
    >
      {{ cat }}
    </button>
  </nav>
</template>

<style scoped>
.vm-loading {
  padding: 12px;
  color: #888;
  font-family: system-ui;
}
.vm-catnav {
  padding: 14px 24px;
  border-bottom: 1px solid var(--vm-border);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.vm-catnav-btn {
  padding: 6px 14px;
  border: 1px solid var(--vm-border);
  border-radius: var(--vm-radius);
  background: transparent;
  color: var(--vm-text);
  cursor: pointer;
  font-family: var(--vm-font);
  font-size: 13px;
  font-weight: 400;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.vm-catnav-btn:hover {
  border-color: var(--vm-primary);
  color: var(--vm-primary);
}
.vm-catnav-active {
  border-color: var(--vm-primary) !important;
  background: var(--vm-primary) !important;
  color: #fff !important;
  font-weight: 600;
}
</style>
