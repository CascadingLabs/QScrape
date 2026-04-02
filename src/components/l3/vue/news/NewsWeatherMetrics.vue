<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { getLiveGeomantic, type LiveGeomantic } from '../../../../data/news/geomantic';

const geo = ref<LiveGeomantic | null>(null);

onMounted(() => {
	fakeGetMs(getLiveGeomantic(), 600, 250).then((d) => {
		geo.value = d;
	});
});
</script>

<template>
  <div>
    <div v-if="!geo" class="hn3-wx-metrics-loading">Loading…</div>
    <div v-else class="hn3-wx-metrics">
      <dl class="hn3-wx-dl">
        <div class="hn3-wx-row">
          <dt class="hn3-wx-label">Seismic</dt>
          <dd class="hn3-wx-val" :data-x="geo.metrics.seismic"></dd>
        </div>
        <div class="hn3-wx-row">
          <dt class="hn3-wx-label">Magma</dt>
          <dd class="hn3-wx-val" :data-x="geo.metrics.magma"></dd>
        </div>
        <div class="hn3-wx-row">
          <dt class="hn3-wx-label">Aquifer</dt>
          <dd class="hn3-wx-val" :data-x="geo.metrics.aquifer"></dd>
        </div>
        <div class="hn3-wx-row">
          <dt class="hn3-wx-label">Wind</dt>
          <dd class="hn3-wx-val" :data-x="geo.metrics.wind"></dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/news.css';

.hn3-wx-metrics-loading {
	min-height: 60px;
	display: flex;
	align-items: center;
	color: var(--hn3-muted);
	font-family: var(--hn3-font-body);
	font-size: 14px;
}

.hn3-wx-metrics {
	padding: 12px 14px;
	border-top: 1px solid var(--hn3-border);
}

.hn3-wx-dl {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin: 0;
}

.hn3-wx-row {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	font-family: var(--hn3-font-body);
	font-size: 12px;
	line-height: 1.6;
}

.hn3-wx-label {
	color: var(--hn3-text);
	font-weight: 600;
}

.hn3-wx-val {
	color: var(--hn3-muted);
	margin: 0;
}
.hn3-wx-val::before {
	content: attr(data-x);
}
</style>
