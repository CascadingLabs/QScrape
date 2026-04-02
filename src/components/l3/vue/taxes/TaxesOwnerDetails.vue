<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fakeGetMs } from '../../../../data/api';
import {
	type DeedRecord,
	getDeedByFileNum,
} from '../../../../data/taxes/deeds';

const props = defineProps<{ fileNum: string }>();

const deed = ref<DeedRecord | null>(null);
const notFound = ref(false);

onMounted(() => {
	const found = getDeedByFileNum(props.fileNum);
	if (!found) {
		notFound.value = true;
		return;
	}
	fakeGetMs(found, 600, 250).then((data) => {
		deed.value = data;
	});
});
</script>

<template>
  <div data-island="vue-owner-details">
    <div v-if="notFound" class="b">Record not found.</div>
    <div v-else-if="!deed" class="a">Loading…</div>
    <div v-else class="c">
      <h2 class="d">Owner / Party Information</h2>
      <dl class="e">
        <div class="f">
          <dt class="g">Last Name / Firm</dt>
          <dd class="h">
            <span class="j" :data-0="deed.lastFirm"></span>
          </dd>
        </div>
        <div class="f" v-if="deed.first">
          <dt class="g">First Name</dt>
          <dd class="h">
            <span class="j" :data-0="deed.first"></span>
          </dd>
        </div>
        <div class="f">
          <dt class="g">File Number</dt>
          <dd class="h i">{{ deed.fileNum }}</dd>
        </div>
        <div class="f">
          <dt class="g">Document Index</dt>
          <dd class="h i">{{ deed.index }}</dd>
        </div>
        <div class="f">
          <dt class="g">Satisfaction Status</dt>
          <dd class="h">{{ deed.sat ? 'Satisfied' : 'Unsatisfied' }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/taxes.css';

.a,
.b {
	min-height: 100px;
	display: flex;
	align-items: center;
	color: var(--er3-muted);
	font-family: var(--er3-font);
	font-size: 14px;
}

.c {
	background: var(--er3-surface);
	border: 1px solid var(--er3-border);
	border-radius: var(--er3-radius);
	padding: 24px;
}

.d {
	font-family: var(--er3-font);
	font-size: 15px;
	font-weight: 700;
	color: var(--er3-text);
	margin: 0 0 16px;
	padding-bottom: 10px;
	border-bottom: 2px solid var(--er3-primary);
	letter-spacing: -0.2px;
}

.e {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.f {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 16px;
	padding: 9px 0;
	border-bottom: 1px solid var(--er3-border);
}
.f:last-child {
	border-bottom: none;
}

.g {
	font-family: var(--er3-font);
	font-size: 12px;
	font-weight: 600;
	color: var(--er3-muted);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	white-space: nowrap;
	flex-shrink: 0;
}

.h {
	font-family: var(--er3-font);
	font-size: 14px;
	color: var(--er3-text);
	text-align: right;
}
.i {
	font-family: var(--er3-font-mono);
	font-size: 13px;
}

.j {
	display: inline;
	font-family: var(--er3-font);
	font-size: 14px;
	color: var(--er3-text);
}
.j::before {
	content: attr(data-0);
}
</style>
