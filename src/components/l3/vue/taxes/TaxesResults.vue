<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import { type DeedRecord, deeds } from '../../../../data/taxes/deeds';

const results = ref<DeedRecord[] | null>(null);

onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	const q = (params.get('q') || '').trim().toUpperCase();
	const filtered = q
		? deeds.filter(
				(d) =>
					d.fileNum.toUpperCase().includes(q) ||
					d.lastFirm.toUpperCase().includes(q),
			)
		: deeds;
	fakeGetMs(filtered, 600, 250).then((data) => {
		results.value = data;
	});
});
</script>

<template>
  <div data-island="vue-results">
    <div v-if="!results" class="a">Loading…</div>
    <div v-else class="b">
      <div class="c">
        <span class="d">{{ results.length }} record{{ results.length !== 1 ? 's' : '' }} found</span>
      </div>
      <div class="e">
        <table class="f">
          <thead>
            <tr>
              <th class="g">File #</th>
              <th class="g">Type</th>
              <th class="g">Date</th>
              <th class="g">Party</th>
              <th class="g">Amount</th>
              <th class="g">Status</th>
              <th class="g h"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deed in results"
              :key="deed.fileNum"
              class="i"
              :data-0="deed.fileNum"
            >
              <td class="j k">{{ deed.fileNum }}</td>
              <td class="j k">{{ deed.index }}</td>
              <td class="j k">{{ deed.recordDate }}</td>
              <td class="j">
                {{ deed.lastFirm }}{{ deed.first ? ', ' + deed.first : '' }}
              </td>
              <td class="j k">{{ deed.amount }}</td>
              <td class="j">
                <span
                  class="m"
                  :data-1="deed.status"
                  :data-2="deed.status.toLowerCase()"
                ></span>
              </td>
              <td class="j l">
                <a :href="`/l3/taxes/viewer/${deed.fileNum}/`" class="n">View →</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/taxes.css';
</style>

<style scoped>
.a {
	min-height: 200px;
	display: flex;
	align-items: center;
	color: var(--er3-muted);
	font-family: var(--er3-font);
	font-size: 14px;
}

.b {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.c {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.d {
	font-family: var(--er3-font);
	font-size: 13px;
	color: var(--er3-muted);
}

.e {
	overflow-x: auto;
	border: 1px solid var(--er3-border);
	border-radius: var(--er3-radius);
}

.f {
	width: 100%;
	border-collapse: collapse;
	font-family: var(--er3-font);
	font-size: 13px;
}

.g {
	padding: 10px 14px;
	text-align: left;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--er3-muted);
	background: var(--er3-surface2);
	border-bottom: 1px solid var(--er3-border);
	white-space: nowrap;
}
.h {
	width: 60px;
}

.i {
	border-bottom: 1px solid var(--er3-border);
}
.i:last-child {
	border-bottom: none;
}
.i:hover {
	background: var(--er3-primary-dim);
}

.j {
	padding: 11px 14px;
	color: var(--er3-text);
	vertical-align: middle;
}
.k {
	font-family: var(--er3-font-mono);
	font-size: 12px;
}
.l {
	text-align: right;
}

.m {
	display: inline-block;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	padding: 2px 8px;
	border-radius: 2px;
}
.m::before {
	content: attr(data-1);
}
.m[data-2="recorded"] {
	color: var(--er3-recorded);
	background: var(--er3-recorded-bg);
}
.m[data-2="satisfied"] {
	color: var(--er3-satisfied);
	background: var(--er3-satisfied-bg);
}
.m[data-2="delinquent"] {
	color: var(--er3-delinquent);
	background: var(--er3-delinquent-bg);
}

.n {
	font-family: var(--er3-font);
	font-size: 12px;
	font-weight: 600;
	color: var(--er3-primary);
	text-decoration: none;
	white-space: nowrap;
}
.n:hover {
	color: var(--er3-primary-hover);
	text-decoration: underline;
}
</style>
