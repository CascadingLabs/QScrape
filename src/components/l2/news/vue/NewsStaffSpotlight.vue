<!--
  @qscrape L2 / vue / news / island
  @component NewsStaffSpotlight
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGet } from '../../../../data/api';
import { reporters } from '../../../../data/news/articles';
import '../../../../styles/l2/news.css';

const ready = ref(false);
const staff = reporters;

onMounted(() => {
	fakeGet(null).then(() => {
		ready.value = true;
	});
});
</script>

<template>
  <div v-if="!ready" class="hn-loading">Loading…</div>
  <div v-else data-component="news-staff-spotlight" data-framework="vue" class="hn-staff">
    <div class="hn-staff-header">
      <h3 class="hn-staff-title">Our Staff</h3>
    </div>
    <ul class="hn-staff-list">
      <li
        v-for="r in staff"
        :key="r.email"
        :data-reporter="r.name"
        :data-beat="r.beat"
        class="hn-staff-item"
      >
        <div class="hn-staff-name">{{ r.name }}</div>
        <div class="hn-staff-role">{{ r.title }}</div>
        <div class="hn-staff-beat">{{ r.beat }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hn-loading { padding: 12px; color: #888; font-family: system-ui; }
.hn-staff { border: 1px solid var(--hn-border); border-radius: var(--hn-radius); overflow: hidden; background: var(--hn-surface); }
.hn-staff-header { background: var(--hn-masthead-bg); padding: 10px 14px; }
.hn-staff-title { font-family: var(--hn-font-display); font-size: 12px; font-weight: 700; color: var(--hn-masthead-text); text-transform: uppercase; letter-spacing: 0.08em; }
.hn-staff-list { list-style: none; }
.hn-staff-item { padding: 10px 14px; border-bottom: 1px solid var(--hn-border); }
.hn-staff-item:last-child { border-bottom: none; }
.hn-staff-name { font-family: var(--hn-font-display); font-size: 13px; font-weight: 600; color: var(--hn-text); }
.hn-staff-role { font-size: 11px; color: var(--hn-muted); font-family: var(--hn-font-ui); margin-top: 2px; }
.hn-staff-beat { font-size: 11px; color: var(--hn-accent); font-family: var(--hn-font-ui); margin-top: 1px; }
</style>
