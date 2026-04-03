<script lang="ts" setup>
import DOMPurify from "dompurify";
import { marked } from "marked";
import { computed, ref, watch } from "vue";
import { api } from "@/api";
import { ADMIN_RECIPIENTS } from "@/modules/adminRecipients";

// allow single newlines to render as <br> and keep GitHub-flavored markdown
marked.setOptions({ breaks: true, gfm: true });

interface MatchedUserAccount {
	_id: string;
	name: string;
	email: string;
}

interface SendAssociations {
	sessionNoteSavedFor: MatchedUserAccount | null;
	internalEmailsSavedFor: MatchedUserAccount[];
}

type DateInputEl = HTMLInputElement & { showPicker?: () => void };

const CUSTOM_OPTION = "Custom";

const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);
const activeTab = ref<"compose" | "preview">("compose");
const selectedRecipientName = ref("");

const subjectDate = ref("");
const dateInput = ref<DateInputEl | null>(null);

// resultText is only used for error JSON or non-ok responses
const resultText = ref("");
const saveSummary = ref<SendAssociations | null>(null);
const lastSendWasSessionNote = ref(false);

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
const selectedRecipient = computed(() =>
	ADMIN_RECIPIENTS.find(
		recipient => recipient.name === selectedRecipientName.value
	)
);
const isCustomRecipient = computed(
	() => selectedRecipientName.value === CUSTOM_OPTION
);
const primaryEmail = computed(() => selectedRecipient.value?.emails[0] ?? "");
const ccEmails = computed(() =>
	(selectedRecipient.value?.emails.slice(1) ?? []).filter(Boolean)
);
const liveRecipients = computed(() => parseRecipients(to.value));
const sentRecipients = computed(() => parseRecipients(previewTo.value));

watch(
	() => selectedRecipientName.value,
	name => {
		if (name === CUSTOM_OPTION) {
			to.value = "";
			return;
		}
		const recip = ADMIN_RECIPIENTS.find(r => r.name === name);
		if (!recip) {
			to.value = "";
			return;
		}
		const [primary, ...cc] = recip.emails;
		to.value = [primary, ...cc].filter(Boolean).join(", ");
	},
	{ immediate: true }
);

watch(subjectDate, value => {
	if (!value) {
		subject.value = "";
		return;
	}
	subject.value = formatSessionSubject(value);
});

function switchTab(tab: "compose" | "preview") {
	activeTab.value = tab;
}

function clearRecipient() {
	selectedRecipientName.value = "";
}

function openDatePicker() {
	// prefer native date picker when available
	if (!dateInput.value) return;
	dateInput.value.focus({ preventScroll: true });
	if (dateInput.value.showPicker) {
		dateInput.value.showPicker();
	} else {
		dateInput.value.click();
	}
}

function handleDateChange(event: Event) {
	const target = event.target as HTMLInputElement | null;
	if (target) {
		subjectDate.value = target.value;
		requestAnimationFrame(() => target.blur()); // hide native picker after selection
		setTimeout(() => target.blur(), 50); // fallback for browsers that keep it open
	}
}

function parseRecipients(raw: string) {
	const parts = raw
		.split(",")
		.map(part => part.trim())
		.filter(Boolean);
	return {
		to: parts[0] ?? "",
		cc: parts.slice(1)
	};
}

function formatSessionSubject(value: string) {
	const parts = parseDateParts(value);
	if (!parts) return "";
	const month = String(parts.month).padStart(2, "0");
	const day = String(parts.day).padStart(2, "0");
	return `Session Notes (${month}/${day})`;
}

async function sendMail() {
	resultText.value = "";
	sentOk.value = false;
	sending.value = true;
	saveSummary.value = null;

	const curTo = to.value.trim();
	const curSubject = subject.value.trim();
	const curMd = md.value;
	const sessionDateIso = parseDateIso(subjectDate.value);
	const wasSessionNoteSend = !!sessionDateIso;
	const payload = {
		to: curTo,
		subject: curSubject,
		md: curMd,
		sessionDate: sessionDateIso ?? undefined,
		recipientName: selectedRecipientName.value || undefined
	};

	try {
		const { data } = await api.post("/admin-mail/send", payload, {
			withCredentials: true
		});

		if (data?.ok === true) {
			saveSummary.value = data?.associations ?? null;
			lastSendWasSessionNote.value = wasSessionNoteSend;
			// build preview from what we just sent
			previewTo.value = curTo;
			previewSubject.value = curSubject;
			sentPreviewHtml.value = renderPreview(curMd);

			// clear inputs
			selectedRecipientName.value = "";
			to.value = "";
			subjectDate.value = "";
			subject.value = "";
			md.value = "";
			if (dateInput.value) dateInput.value.value = "";

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
		lastSendWasSessionNote.value = wasSessionNoteSend;
		resultText.value = e?.response?.data
			? JSON.stringify(e.response.data, null, 2)
			: String(e);
	} finally {
		sending.value = false;
	}
}

function parseDateParts(value: string) {
	const [yearStr, monthStr, dayStr] = value.split("-");
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (!year || !month || !day) return null;
	return { year, month, day };
}

function parseDateIso(value: string): string | null {
	const parts = parseDateParts(value);
	if (!parts) return null;
	// store at UTC noon to avoid timezone shifts presenting as previous day
	return new Date(
		Date.UTC(parts.year, parts.month - 1, parts.day, 12)
	).toISOString();
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

		<div class="field">
			<label class="field-label" for="recipient-select">Recipient</label>
			<div class="recipient-row">
				<select id="recipient-select" v-model="selectedRecipientName">
					<option disabled value="">Select a person</option>
					<option
						v-for="recipient in ADMIN_RECIPIENTS"
						:key="recipient.name"
						:value="recipient.name"
					>
						{{ recipient.name }}
					</option>
					<option :value="CUSTOM_OPTION">Custom</option>
				</select>
				<button
					v-if="selectedRecipientName"
					type="button"
					class="ghost-btn"
					@click="clearRecipient"
				>
					Clear
				</button>
			</div>
			<div v-if="!isCustomRecipient" class="recipient-preview">
				<div><strong>To:</strong> {{ primaryEmail || "—" }}</div>
				<div v-if="ccEmails.length">
					<strong>CC:</strong> {{ ccEmails.join(", ") }}
				</div>
			</div>
			<div v-else class="manual-recipient">
				<label class="sub-label" for="custom-to"
					>Enter recipient email(s)</label
				>
				<input
					id="custom-to"
					v-model="to"
					type="text"
					placeholder="primary@example.com, cc1@example.com"
				/>
				<p class="hint">
					First email is the main recipient; any others become CC.
				</p>
			</div>
		</div>

		<div class="field subject-group">
			<label class="field-label" for="subject-date-input">Subject</label>
			<div class="subject-row">
				<button
					type="button"
					class="picker-btn"
					@click="openDatePicker"
				>
					{{ subjectDate ? "Change date" : "Pick session date" }}
				</button>
				<input
					id="subject-date-input"
					ref="dateInput"
					v-model="subjectDate"
					type="date"
					class="sr-only"
					aria-label="Pick session date"
					@change="handleDateChange"
				/>
				<input
					id="subject-input"
					v-model="subject"
					class="subject-preview"
					placeholder="Session Notes (MM/DD)"
					aria-label="Email subject"
				/>
			</div>
			<!--			<p class="hint">Select a date to auto-fill the subject.</p> -->
		</div>

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
				<div><strong>To:</strong> {{ liveRecipients.to || "—" }}</div>
				<div v-if="liveRecipients.cc.length">
					<strong>CC:</strong> {{ liveRecipients.cc.join(", ") }}
				</div>
				<div><strong>Subject:</strong> {{ subject || "—" }}</div>
			</div>
			<div
				class="preview-body"
				data-testid="live-preview-body"
				v-html="livePreviewHtml"
			/>
		</div>

		<button
			class="send-btn"
			:disabled="sending || !to || !subject || !md"
			@click="sendMail"
		>
			{{ sending ? "Sending…" : "Send" }}
		</button>

		<!-- SUCCESS PREVIEW -->
		<div v-if="sentOk" class="preview">
			<div class="preview-meta">
				<div><strong>To:</strong> {{ sentRecipients.to }}</div>
				<div v-if="sentRecipients.cc.length">
					<strong>CC:</strong> {{ sentRecipients.cc.join(", ") }}
				</div>
				<div><strong>Subject:</strong> {{ previewSubject }}</div>
			</div>
			<div class="preview-body" v-html="sentPreviewHtml"></div>
			<div v-if="saveSummary" class="association-summary">
				<p class="association-title">Account storage</p>
				<p
					v-if="saveSummary.sessionNoteSavedFor"
					class="association-copy"
				>
					Session note saved to
					<strong>
						{{ saveSummary.sessionNoteSavedFor.name }}
					</strong>
					({{ saveSummary.sessionNoteSavedFor.email }}).
				</p>
				<p v-else-if="lastSendWasSessionNote" class="association-copy">
					No matching user account was found for the primary
					recipient, so this session note was sent without being saved
					to the learner history pane.
				</p>
				<p
					v-if="saveSummary.internalEmailsSavedFor.length"
					class="association-copy"
				>
					Internal email saved for
					<strong>
						{{
							saveSummary.internalEmailsSavedFor
								.map(user => user.name)
								.join(", ")
						}}
					</strong>
					.
				</p>
				<p v-else-if="!lastSendWasSessionNote" class="association-copy">
					No matching user accounts were found in the recipient list,
					so this email was sent without user-profile storage.
				</p>
			</div>
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

/*noinspection CssUnusedSymbol*/
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
textarea,
select {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
}
textarea {
	height: 320px;
	font-family: ui-monospace, Menlo, Consolas, monospace;
}
.recipient-row {
	display: flex;
	align-items: center;
	gap: 8px;
}
.recipient-row select {
	flex: 1;
}
.recipient-preview {
	background: #f8fafc;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 8px 10px;
	margin-top: 8px;
	color: #374151;
}
.recipient-preview strong {
	color: #111827;
}
.manual-recipient {
	margin-top: 8px;
}
.sub-label {
	display: block;
	margin-bottom: 4px;
	font-weight: 600;
	color: #0f172a;
}
.subject-group {
	margin-top: 10px;
}
.subject-row {
	display: flex;
	align-items: center;
	gap: 12px;
}
.subject-preview {
	flex: 1;
	min-width: 240px;
	background: #f8fafc;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 10px 12px;
	color: #0f172a;
}
.picker-btn,
.ghost-btn {
	padding: 10px 14px;
	margin-top: 0;
	border-radius: 8px;
	cursor: pointer;
}
.picker-btn {
	background: #2563eb;
	border: 1px solid #2563eb;
	color: #fff;
	font-weight: 700;
}
.ghost-btn {
	background: transparent;
	border: 1px solid #d1d5db;
	color: #111827;
}
.ghost-btn:hover {
	background: #f3f4f6;
}
.send-btn {
	margin-top: 16px;
	padding: 10px 16px;
	background: #2563eb;
	border: 1px solid #2563eb;
	color: #fff;
	border-radius: 8px;
	font-weight: 700;
	cursor: pointer;
}
.send-btn:disabled {
	background: #9ca3af;
	border-color: #9ca3af;
	cursor: not-allowed;
}
.result {
	white-space: pre-wrap;
	background: #f7f7f7;
	border: 1px solid #ddd;
	padding: 12px;
	margin-top: 16px;
}
.hint {
	margin: 4px 0 0;
	font-weight: 400;
	color: #6b7280;
}
.field {
	margin: 12px 0 6px;
}
.field-label {
	display: block;
	margin-bottom: 6px;
	font-weight: 700;
	color: #0f172a;
}
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
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
.preview-body :deep(p),
.preview-body :deep(ul),
.preview-body :deep(ol) {
	margin: 0.6em 0;
}
.preview-body :deep(ul),
.preview-body :deep(ol) {
	padding-left: 1.4rem;
}
.preview-body :deep(li + li) {
	margin-top: 0.35em;
}
.preview-body :deep(code) {
	background: #f3f4f6;
	color: #111827;
	font-weight: 700;
	padding: 0.1em 0.35em;
	border-radius: 4px;
}
.preview-body :deep(pre) {
	background: #e5e7eb;
	color: #0f172a;
	font-weight: 700;
	border-radius: 10px;
	padding: 12px;
	overflow-x: auto;
	margin: 0.8em 0;
}
.preview-body :deep(pre code) {
	background: transparent;
	color: inherit;
	padding: 0;
	font-family:
		ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono",
		monospace;
}
.association-summary {
	margin-top: 16px;
	padding-top: 14px;
	border-top: 1px solid #e5e7eb;
	display: grid;
	gap: 6px;
}
.association-title {
	margin: 0;
	font-weight: 700;
	color: #0f172a;
}
.association-copy {
	margin: 0;
	color: #374151;
	line-height: 1.55;
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
