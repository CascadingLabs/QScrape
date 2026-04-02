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
  <div>
    <div v-if="notFound" class="er3-owner-error">Record not found.</div>
    <div v-else-if="!deed" class="er3-owner-loading">Loading…</div>
    <div v-else class="er3-owner-panel">
      <h2 class="er3-owner-title">Owner / Party Information</h2>
      <dl class="er3-owner-dl">
        <div class="er3-owner-row">
          <dt class="er3-owner-dt">Last Name / Firm</dt>
          <dd class="er3-owner-dd">
            <span class="er3-owner-name" :data-owner="deed.lastFirm"></span>
          </dd>
        </div>
        <div class="er3-owner-row" v-if="deed.first">
          <dt class="er3-owner-dt">First Name</dt>
          <dd class="er3-owner-dd">
            <span class="er3-owner-name" :data-owner="deed.first"></span>
          </dd>
        </div>
        <div class="er3-owner-row">
          <dt class="er3-owner-dt">File Number</dt>
          <dd class="er3-owner-dd er3-dd-mono">{{ deed.fileNum }}</dd>
        </div>
        <div class="er3-owner-row">
          <dt class="er3-owner-dt">Document Index</dt>
          <dd class="er3-owner-dd er3-dd-mono">{{ deed.index }}</dd>
        </div>
        <div class="er3-owner-row">
          <dt class="er3-owner-dt">Satisfaction Status</dt>
          <dd class="er3-owner-dd">{{ deed.sat ? 'Satisfied' : 'Unsatisfied' }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style>
@import '../../../../styles/l3/taxes.css';

.er3-owner-loading,
.er3-owner-error {
	min-height: 100px;
	display: flex;
	align-items: center;
	color: var(--er3-muted);
	font-family: var(--er3-font);
	font-size: 14px;
}

.er3-owner-panel {
	background: var(--er3-surface);
	border: 1px solid var(--er3-border);
	border-radius: var(--er3-radius);
	padding: 24px;
}

.er3-owner-title {
	font-family: var(--er3-font);
	font-size: 15px;
	font-weight: 700;
	color: var(--er3-text);
	margin: 0 0 16px;
	padding-bottom: 10px;
	border-bottom: 2px solid var(--er3-primary);
	letter-spacing: -0.2px;
}

.er3-owner-dl {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.er3-owner-row {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 16px;
	padding: 9px 0;
	border-bottom: 1px solid var(--er3-border);
}
.er3-owner-row:last-child {
	border-bottom: none;
}

.er3-owner-dt {
	font-family: var(--er3-font);
	font-size: 12px;
	font-weight: 600;
	color: var(--er3-muted);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	white-space: nowrap;
	flex-shrink: 0;
}

.er3-owner-dd {
	font-family: var(--er3-font);
	font-size: 14px;
	color: var(--er3-text);
	text-align: right;
}
.er3-dd-mono {
	font-family: var(--er3-font-mono);
	font-size: 13px;
}

.er3-owner-name {
	display: inline;
	font-family: var(--er3-font);
	font-size: 14px;
	color: var(--er3-text);
}
.er3-owner-name::before {
	content: attr(data-owner);
}
</style>
