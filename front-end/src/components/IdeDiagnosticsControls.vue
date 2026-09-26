<script setup lang="ts">
import type { IdeDiagnostics } from "@/modules/ideDiagnostics";
import { computed, nextTick, ref } from "vue";
import { api } from "@/api";
import { ideCategoryLabels } from "@/modules/ideDiagnostics";

const props = defineProps<{ capture: () => IdeDiagnostics }>();
const dialog = ref<HTMLDialogElement | null>(null);
const dialogOpen = ref(false);
const snapshot = ref<IdeDiagnostics | null>(null);
const description = ref("");
const reviewed = ref(false);
const sending = ref(false);
const attempted = ref(false);
const submitted = ref(false);
const message = ref("");
const includeStack = ref(true);
const payload = computed(() => ({
	diagnostics: snapshot.value
		? {
				...snapshot.value,
				stack: includeStack.value ? snapshot.value.stack : []
			}
		: null,
	description: description.value.trim(),
	previewConfirmed: true
}));
const preview = computed(() => JSON.stringify(payload.value, null, 2));

async function openReport() {
	snapshot.value = props.capture();
	description.value = "";
	reviewed.value = false;
	submitted.value = false;
	attempted.value = false;
	includeStack.value = true;
	message.value = "";
	await nextTick();
	dialog.value?.showModal();
	dialogOpen.value = true;
}

async function copyDiagnostics() {
	try {
		const diagnostics =
			dialog.value?.open && snapshot.value
				? payload.value.diagnostics
				: props.capture();
		await navigator.clipboard.writeText(
			JSON.stringify(diagnostics, null, 2)
		);
		message.value = "Diagnostics copied. Copying does not send a report.";
	} catch {
		if (!dialog.value?.open) await openReport();
		message.value =
			"Clipboard is unavailable. Select and copy the preview below.";
	}
}

async function submit() {
	if (!reviewed.value || sending.value || submitted.value) return;
	sending.value = true;
	attempted.value = true;
	try {
		const { data } = await api.post("/ide-reports", payload.value, {
			timeout: 15000
		});
		submitted.value = true;
		message.value = `Report saved. Reference: ${data.referenceID}`;
	} catch {
		message.value =
			"Could not confirm submission. Copy diagnostics or retry this same report later.";
	} finally {
		sending.value = false;
	}
}
</script>

<template>
	<div class="ide-diagnostics-controls">
		<button type="button" @click="copyDiagnostics">Copy diagnostics</button>
		<button type="button" @click="openReport">Report a problem</button>
		<p v-if="message && !dialogOpen" role="status">{{ message }}</p>
		<dialog
			ref="dialog"
			aria-labelledby="ide-report-title"
			@close="dialogOpen = false"
			@click="
				event => {
					if (event.target === dialog) dialog?.close();
				}
			"
		>
			<div class="ide-report-body">
				<h2 id="ide-report-title">Report an IDE problem</h2>
				<p>
					Only the preview below will be sent to the private
					administrator inbox. Reports expire after 90 days. No code,
					input, console output, or raw traceback is collected
					automatically.
				</p>
				<p v-if="snapshot">
					<strong>{{ ideCategoryLabels[snapshot.category] }}</strong
					>. This is an initial classification, not a confirmed
					defect. Programming errors do not generate outage alerts.
				</p>
				<p v-if="snapshot?.mode === 'bluej'">
					This covers the website’s BlueJ integration. Desktop BlueJ’s
					version and errors cannot be read by this page.
				</p>
				<fieldset :disabled="attempted">
					<label for="ide-report-description"
						>What happened? (optional)</label
					>
					<p>
						Describe what you expected and the steps to reproduce
						it. Leave out student names, code, passwords, and
						private values.
					</p>
					<textarea
						id="ide-report-description"
						v-model="description"
						maxlength="1200"
						rows="3"
						@input="reviewed = false"
					/>
					<label class="ide-report-check"
						><input
							v-model="includeStack"
							type="checkbox"
							@change="reviewed = false"
						/>
						Include sanitized stack locations (no source text or
						file names)</label
					>
					<details open>
						<summary>Exact submission preview</summary>
						<pre tabindex="0">{{ preview }}</pre>
					</details>
					<label class="ide-report-check"
						><input v-model="reviewed" type="checkbox" /> I reviewed
						this preview and want to send it.</label
					>
				</fieldset>
				<p role="status">{{ message }}</p>
				<div class="ide-report-actions">
					<button type="button" @click="dialog?.close()">
						Close
					</button>
					<button type="button" @click="copyDiagnostics">
						Copy diagnostics
					</button>
					<button
						type="button"
						:disabled="!reviewed || sending || submitted"
						@click="submit"
					>
						{{
							sending
								? "Sending…"
								: submitted
									? "Submitted"
									: "Submit report"
						}}
					</button>
				</div>
			</div>
		</dialog>
	</div>
</template>

<style scoped>
.ide-diagnostics-controls {
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem;
	align-items: center;
	margin-block: 1rem;
}
.ide-diagnostics-controls button {
	border: 1px solid #64748b;
	border-radius: 0.6rem;
	padding: 0.5rem 0.85rem;
	background: var(--ide-panel-bg, #111c2c);
	color: #f1f5f9;
	font: inherit;
	cursor: pointer;
}
.ide-diagnostics-controls button:disabled {
	opacity: 0.5;
	cursor: default;
}
dialog {
	width: min(42rem, calc(100vw - 2rem));
	max-height: calc(100dvh - 2rem);
	padding: 0;
	border: 1px solid #64748b;
	border-radius: 1rem;
	background: #111c2c;
	color: #f1f5f9;
}
dialog::backdrop {
	background: #0009;
}
.ide-report-body {
	padding: 1.25rem;
	display: grid;
	gap: 1rem;
	text-align: left;
}
.ide-report-body :is(p, h2) {
	margin: 0;
	color: inherit;
	line-height: 1.5;
}
.ide-report-body :is(label, summary) {
	color: inherit;
	font-size: 1rem;
	font-weight: 400;
	text-transform: none;
	letter-spacing: normal;
}
.ide-report-body fieldset {
	border: 0;
	padding: 0;
	display: grid;
	gap: 0.8rem;
	min-width: 0;
}
.ide-report-body textarea {
	box-sizing: border-box;
	width: 100%;
	background: #1e293b;
	color: #f1f5f9;
	border: 1px solid #64748b;
	border-radius: 0.5rem;
	padding: 0.6rem;
	font: inherit;
}
.ide-report-check {
	display: flex;
	gap: 0.6rem;
	align-items: start;
}
.ide-report-check input {
	flex: none;
	margin-top: 0.3rem;
}
.ide-report-body pre {
	max-height: 16rem;
	overflow: auto;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	background: #1e293b;
	color: #f1f5f9;
	padding: 0.7rem;
	font-size: 0.8rem;
}
.ide-report-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
}
</style>
