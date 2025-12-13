<script lang="ts" setup>
import DOMPurify from "dompurify";
import { marked } from "marked";
import { computed, ref } from "vue";
import { api } from "@/api";

const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);
const activeTab = ref<"compose" | "preview">("compose");

// resultText is only used for error JSON or non-ok responses
const resultText = ref("");

// success preview state
const sentOk = ref(false);
const previewTo = ref("");
const previewSubject = ref("");
const sentPreviewHtml = ref("");

// helper to render + sanitize MD -> HTML
function renderPreview(markdown: string): string {
	const raw = marked.parse(markdown);
	if (typeof raw !== "string") return "";
	return DOMPurify.sanitize(raw);
}

const livePreviewHtml = computed(() => renderPreview(md.value));

function switchTab(tab: "compose" | "preview") {
	activeTab.value = tab;
}

async function sendMail() {
	resultText.value = "";
	sentOk.value = false;
	sending.value = true;

	const curTo = to.value.trim();
	const curSubject = subject.value.trim();
	const curMd = md.value;

	try {
		const { data } = await api.post(
			"/admin-mail/send",
			{ to: curTo, subject: curSubject, md: curMd },
			{ withCredentials: true }
		);

		if (data?.ok === true) {
			// build preview from what we just sent
			previewTo.value = curTo;
			previewSubject.value = curSubject;
			sentPreviewHtml.value = renderPreview(curMd);

			// clear inputs
			to.value = "";
			subject.value = "";
			md.value = "";

			// show the pretty preview section, hide JSON
			sentOk.value = true;
			resultText.value = "";
		} else {
			// non-ok (but not thrown)
			sentOk.value = false;
			resultText.value = JSON.stringify(data, null, 2);
		}
	} catch (e: any) {
		sentOk.value = false;
		resultText.value = e?.response?.data
			? JSON.stringify(e.response.data, null, 2)
			: String(e);
	} finally {
		sending.value = false;
	}
}
</script>

<template>
	<section class="wrap">
		<h2>Send Markdown Email (Admin)</h2>

		<div class="tabs" role="tablist" aria-label="Email or preview">
			<button
				id="tab-compose"
				role="tab"
				:aria-selected="activeTab === 'compose'"
				class="tab-btn"
				:class="[{ active: activeTab === 'compose' }]"
				type="button"
				data-testid="tab-compose"
				@click="switchTab('compose')"
			>
				Compose
			</button>
			<button
				id="tab-preview"
				role="tab"
				:aria-selected="activeTab === 'preview'"
				class="tab-btn"
				:class="[{ active: activeTab === 'preview' }]"
				type="button"
				data-testid="tab-preview"
				@click="switchTab('preview')"
			>
				Preview
			</button>
		</div>

		<label>
			To
			<input
				v-model="to"
				type="text"
				placeholder="primary@example.com, cc1@example.com"
			/>
		</label>

		<label>
			Subject
			<input v-model="subject" type="text" placeholder="Subject" />
		</label>

		<div v-if="activeTab === 'compose'" class="tab-panel">
			<label>Markdown</label>
			<textarea
				v-model="md"
				placeholder="**Hello** _world_"
				data-testid="md-input"
			></textarea>
		</div>

		<div
			v-else
			class="tab-panel preview-pane"
			role="tabpanel"
			aria-labelledby="tab-preview"
			data-testid="live-preview"
		>
			<div class="preview-meta">
				<div><strong>To:</strong> {{ to || "—" }}</div>
				<div><strong>Subject:</strong> {{ subject || "—" }}</div>
			</div>
			<div
				class="preview-body"
				data-testid="live-preview-body"
				v-html="livePreviewHtml"
			/>
		</div>

		<button :disabled="sending" @click="sendMail">
			{{ sending ? "Sending…" : "Send" }}
		</button>

		<!-- SUCCESS PREVIEW -->
		<div v-if="sentOk" class="preview">
			<div class="preview-meta">
				<div><strong>To:</strong> {{ previewTo }}</div>
				<div><strong>Subject:</strong> {{ previewSubject }}</div>
			</div>
			<div class="preview-body" v-html="sentPreviewHtml"></div>
		</div>

		<!-- ERROR / RAW RESULT -->
		<pre v-else-if="resultText" class="result">{{ resultText }}</pre>
	</section>
</template>

<style scoped>
.wrap {
	max-width: 900px;
	margin: 24px auto;
	padding: 16px;
}

.tabs {
	display: inline-flex;
	gap: 8px;
	margin: 8px 0 16px;
}

.tab-btn {
	border: 1px solid #d6d6d6;
	background: #f8fafc;
	color: #0f172a;
	padding: 8px 12px;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 600;
}

.tab-btn.active {
	background: #2563eb;
	color: white;
	border-color: #2563eb;
}

.tab-panel {
	margin-top: 8px;
}

.preview-pane {
	border: 1px solid #e6e6e6;
	border-radius: 8px;
	padding: 12px;
	background: #fff;
}

label {
	display: block;
	margin: 12px 0 6px;
	font-weight: 600;
}
input,
textarea {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
}
textarea {
	height: 320px;
	font-family: ui-monospace, Menlo, Consolas, monospace;
}
button {
	margin-top: 16px;
	padding: 10px 16px;
}
.result {
	white-space: pre-wrap;
	background: #f7f7f7;
	border: 1px solid #ddd;
	padding: 12px;
	margin-top: 16px;
}
.preview {
	background: #fff;
	border: 1px solid #e6e6e6;
	border-radius: 8px;
	padding: 16px;
	margin-top: 16px;
}
.preview-meta {
	font-size: 0.95rem;
	color: #444;
	margin-bottom: 12px;
}
.preview-body :deep(p) {
	margin: 0.6em 0;
}
.preview-body :deep(code) {
	background: #f5f5f5;
	padding: 0.1em 0.3em;
	border-radius: 4px;
}
</style>

<route lang="json">
{
	"meta": {
		"layout": false,
		"requiresAdmin": true
	}
}
</route>
