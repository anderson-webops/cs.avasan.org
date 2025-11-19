<script lang="ts" setup>
import DOMPurify from "dompurify";
import { marked } from "marked";
import { ref } from "vue";
import { api } from "@/api";

const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);

// resultText is only used for error JSON or non-ok responses
const resultText = ref("");

// success preview state
const sentOk = ref(false);
const previewTo = ref("");
const previewSubject = ref("");
const previewHtml = ref("");

// helper to render + sanitize MD -> HTML
function renderPreview(markdown: string): string {
	const raw = marked.parse(markdown);
	if (typeof raw !== "string") return "";
	return DOMPurify.sanitize(raw);
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
			previewHtml.value = renderPreview(curMd);

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

		<label>
			To
			<input
				v-model="to"
				type="email"
				placeholder="recipient@example.com"
			/>
		</label>

		<label>
			Subject
			<input v-model="subject" type="text" placeholder="Subject" />
		</label>

		<label>Markdown</label>
		<textarea v-model="md" placeholder="**Hello** _world_"></textarea>

		<button :disabled="sending" @click="sendMail">
			{{ sending ? "Sending…" : "Send" }}
		</button>

		<!-- SUCCESS PREVIEW -->
		<div v-if="sentOk" class="preview">
			<div class="preview-meta">
				<div><strong>To:</strong> {{ previewTo }}</div>
				<div><strong>Subject:</strong> {{ previewSubject }}</div>
			</div>
			<div class="preview-body" v-html="previewHtml"></div>
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
