<script setup lang="ts">
import type { IdeDiagnostics } from "@/modules/ideDiagnostics";
import { onMounted, ref } from "vue";
import { api } from "@/api";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { ideCategoryLabels } from "@/modules/ideDiagnostics";

interface Report {
	referenceID: string;
	diagnostics: IdeDiagnostics;
	description: string;
	status: "new" | "reviewed" | "resolved";
	createdAt: string;
}
const reports = ref<Report[]>([]);
const referenceFilter = ref("");
const cursor = ref<string | null>(null);
const busy = ref(false);
const message = ref("");

async function load(more = false) {
	if (busy.value) return;
	busy.value = true;
	message.value = "";
	if (!more) reports.value = [];
	try {
		const { data } = await api.get("/ide-reports", {
			params: {
				...(more ? { before: cursor.value } : {}),
				...(referenceFilter.value.trim()
					? { referenceID: referenceFilter.value.trim() }
					: {})
			},
			timeout: 15000
		});
		reports.value = more
			? [...reports.value, ...data.reports]
			: data.reports;
		cursor.value = data.nextCursor;
	} catch {
		message.value =
			"Could not load reports. An active administrator session is required.";
	} finally {
		busy.value = false;
	}
}

async function setStatus(report: Report, status: Report["status"]) {
	busy.value = true;
	try {
		await api.patch(
			`/ide-reports/${report.referenceID}`,
			{ status },
			{ timeout: 15000 }
		);
		report.status = status;
		message.value = `Report marked ${status}.`;
	} catch {
		message.value = "Could not update the report.";
	} finally {
		busy.value = false;
	}
}
onMounted(() => load());
</script>

<template>
	<section
		id="ide-reports"
		class="admin-panel site-surface"
		aria-labelledby="ide-reports-title"
	>
		<h2 id="ide-reports-title">IDE problem reports</h2>
		<p>
			Private, explicitly submitted diagnostics. Reports expire after 90
			days. Categories and site/build metadata are client-reported clues,
			not verified outage signals.
		</p>
		<div class="report-inbox">
			<form class="report-actions" @submit.prevent="load()">
				<label for="report-reference-filter"
					>Reference ID (optional)</label
				>
				<input
					id="report-reference-filter"
					v-model="referenceFilter"
					maxlength="36"
					placeholder="Paste a report reference ID"
					:disabled="busy"
					@input="cursor = null"
				/>
				<button type="submit" :disabled="busy">Find reports</button>
			</form>
			<button type="button" :disabled="busy" @click="load()">
				Refresh reports
			</button>
			<p role="status">{{ busy ? "Loading…" : message }}</p>
			<p v-if="!busy && !message && !reports.length">No reports yet.</p>
			<article v-for="report in reports" :key="report.referenceID">
				<h2>
					{{ ideCategoryLabels[report.diagnostics.category] }} ·
					{{ report.diagnostics.mode }}
				</h2>
				<p>Reference: {{ report.referenceID }}</p>
				<p>
					{{ new Date(report.createdAt).toLocaleString() }} ·
					{{ report.status }}
				</p>
				<p>
					{{ report.diagnostics.site }} ·
					{{ report.diagnostics.release }} ·
					{{ report.diagnostics.stage }} ·
					{{ report.diagnostics.errorType }}
				</p>
				<p class="report-description">
					{{ report.description || "No additional description." }}
				</p>
				<WorkspaceDisclosure>
					<template #label>Diagnostics and sanitized stack</template>
					<pre>{{ JSON.stringify(report.diagnostics, null, 2) }}</pre>
				</WorkspaceDisclosure>
				<div class="report-actions">
					<button
						v-for="status in [
							'new',
							'reviewed',
							'resolved'
						] as const"
						:key="status"
						type="button"
						:disabled="busy || report.status === status"
						@click="setStatus(report, status)"
					>
						Mark {{ status }}
					</button>
				</div>
			</article>
			<button
				v-if="cursor"
				type="button"
				:disabled="busy"
				@click="load(true)"
			>
				Load older reports
			</button>
		</div>
	</section>
</template>

<style scoped>
.report-inbox {
	color: var(--color-ink, #14243b);
	display: grid;
	gap: 1rem;
	min-width: 0;
}
.report-inbox article {
	border: 1px solid #64748b;
	border-radius: 1rem;
	padding: 1rem;
	min-width: 0;
	overflow-wrap: anywhere;
}
.report-inbox h2 {
	font-size: 1.2rem;
	color: inherit;
}
.report-inbox p,
.report-inbox :deep(.workspace-disclosure__trigger) {
	color: inherit;
}
.report-description,
.report-inbox pre {
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}
.report-inbox pre {
	max-height: 24rem;
	overflow: auto;
	background: #e2e8f0;
	color: #14243b;
	padding: 0.8rem;
}
.report-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	margin-top: 0.75rem;
}
.report-inbox button {
	font: inherit;
	padding: 0.5rem 0.8rem;
	border-radius: 0.5rem;
	background: #16375b;
	color: white;
	border: 1px solid #64748b;
	cursor: pointer;
}
.report-inbox input {
	min-width: 0;
	max-width: 100%;
	padding: 0.5rem;
	background: #fff;
	color: #14243b;
	border: 1px solid #64748b;
	border-radius: 0.5rem;
}
.report-inbox label {
	color: inherit;
	font: inherit;
	text-transform: none;
	letter-spacing: normal;
}
.report-inbox button:disabled {
	opacity: 0.55;
	cursor: default;
}
</style>
