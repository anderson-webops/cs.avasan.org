<script lang="ts" setup>
import DOMPurify from "dompurify";
import { marked } from "marked";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

marked.setOptions({ breaks: true, gfm: true });

interface SessionNoteRecord {
	_id: string;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: string;
	markdown: string;
	createdAt: string;
}

interface InternalEmailRecord {
	_id: string;
	matchedRecipientEmail: string;
	primaryEmail: string;
	ccEmails: string[];
	fromAddress: string;
	subject: string;
	markdown: string;
	transportUsed: "primary-local" | "fallback-gmail";
	sentAt: string;
}

interface UserCommunicationsResponse {
	sessionNotes: SessionNoteRecord[];
	internalEmails: InternalEmailRecord[];
}

const app = useAppStore();
const { currentUser } = storeToRefs(app);

const loading = ref(false);
const error = ref("");
const sessionNotes = ref<SessionNoteRecord[]>([]);
const internalEmails = ref<InternalEmailRecord[]>([]);

const hasHistory = computed(
	() => sessionNotes.value.length > 0 || internalEmails.value.length > 0
);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
});

const timestampFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit"
});

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return dateFormatter.format(date);
}

function formatTimestamp(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return timestampFormatter.format(date);
}

function renderMarkdown(markdown: string) {
	const rendered = marked.parse(markdown);
	if (typeof rendered !== "string") {
		return "";
	}
	return DOMPurify.sanitize(rendered);
}

function describeEmailDelivery(email: InternalEmailRecord) {
	if (email.matchedRecipientEmail === email.primaryEmail) {
		return `Delivered directly to ${email.primaryEmail}`;
	}

	return `Delivered to ${email.matchedRecipientEmail} via CC on ${email.primaryEmail}`;
}

async function loadCommunications() {
	if (!currentUser.value?._id) {
		sessionNotes.value = [];
		internalEmails.value = [];
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		const { data } = await api.get<UserCommunicationsResponse>(
			"/users/loggedin/communications"
		);
		sessionNotes.value = data.sessionNotes ?? [];
		internalEmails.value = data.internalEmails ?? [];
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to load communication history.";
		sessionNotes.value = [];
		internalEmails.value = [];
	} finally {
		loading.value = false;
	}
}

watch(
	() => currentUser.value?._id ?? "",
	async userID => {
		if (!userID) {
			sessionNotes.value = [];
			internalEmails.value = [];
			error.value = "";
			return;
		}

		await loadCommunications();
	},
	{ immediate: true }
);
</script>

<template>
	<section class="history-section">
		<div class="section-heading">
			<div>
				<p class="section-eyebrow">Communication history</p>
				<h3>Notes and emails</h3>
			</div>
			<p class="section-copy">
				Review your most recent session notes and any saved internal
				emails sent to the email on this account. Session notes keep the
				three newest entries.
			</p>
		</div>

		<div class="history-grid">
			<section class="history-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-eyebrow">Session notes</p>
						<h4>Recent notes</h4>
					</div>
					<span class="count-pill">{{ sessionNotes.length }}</span>
				</div>

				<p v-if="loading" class="empty-copy">Loading recent notes…</p>
				<p v-else-if="error" class="error-copy">{{ error }}</p>
				<p v-else-if="sessionNotes.length === 0" class="empty-copy">
					No session notes are attached to this account yet.
				</p>
				<div v-else class="record-list">
					<details
						v-for="note in sessionNotes"
						:key="note._id"
						class="record-card"
					>
						<summary class="record-summary">
							<div>
								<p class="record-kicker">
									Session date
									{{ formatDate(note.sessionDate) }}
								</p>
								<h5>{{ note.subject }}</h5>
								<p class="record-subcopy">
									For {{ note.studentName }}
								</p>
							</div>
							<span class="record-action">Open</span>
						</summary>
						<div class="record-meta">
							Saved {{ formatTimestamp(note.createdAt) }}
						</div>
						<div
							class="record-body"
							v-html="renderMarkdown(note.markdown)"
						/>
					</details>
				</div>
			</section>

			<section class="history-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-eyebrow">Internal emails</p>
						<h4>Saved messages</h4>
					</div>
					<span class="count-pill">{{ internalEmails.length }}</span>
				</div>

				<p v-if="loading" class="empty-copy">
					Loading saved internal emails…
				</p>
				<p v-else-if="error" class="error-copy">{{ error }}</p>
				<p v-else-if="internalEmails.length === 0" class="empty-copy">
					No saved internal emails are attached to this account yet.
				</p>
				<div v-else class="record-list">
					<details
						v-for="email in internalEmails"
						:key="email._id"
						class="record-card"
					>
						<summary class="record-summary">
							<div>
								<p class="record-kicker">
									Sent {{ formatTimestamp(email.sentAt) }}
								</p>
								<h5>{{ email.subject }}</h5>
								<p class="record-subcopy">
									{{ describeEmailDelivery(email) }}
								</p>
							</div>
							<span class="record-action">Open</span>
						</summary>
						<div class="record-meta">
							From {{ email.fromAddress }}
						</div>
						<div
							class="record-body"
							v-html="renderMarkdown(email.markdown)"
						/>
					</details>
				</div>
			</section>
		</div>

		<p v-if="!loading && !error && !hasHistory" class="helper-copy">
			Messages appear here only when they were sent to the email address
			on this account.
		</p>
	</section>
</template>

<style scoped>
.history-section {
	display: grid;
	gap: 1rem;
	width: 100%;
	margin: 0;
}

.history-section p,
.history-section label,
.history-section button,
.history-section input,
.history-section select {
	font-family: inherit;
	text-align: left;
}

.section-heading {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1rem 1.5rem;
	align-items: start;
	padding: clamp(1.25rem, 2vw, 1.6rem);
	border-radius: 28px;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.9),
		rgba(255, 255, 255, 0.84)
	);
	border: 1px solid rgba(255, 255, 255, 0.48);
	box-shadow: 0 28px 60px -44px rgba(15, 23, 42, 0.44);
}

.section-eyebrow,
.panel-eyebrow,
.record-kicker {
	margin: 0;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #5a7893;
}

.section-heading h3,
.panel-heading h4,
.record-summary h5 {
	margin: 0;
	color: #1c2d3e;
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.025em;
}

.section-heading h3 {
	font-size: clamp(1.8rem, 3vw, 2.35rem);
}

.section-copy {
	margin: 0;
	align-self: end;
	line-height: 1.7;
	color: #42586d;
}

.history-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.history-panel {
	display: grid;
	gap: 1rem;
	padding: clamp(1.25rem, 2vw, 1.55rem);
	border-radius: 28px;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: inset 0 0 0 1px rgba(215, 224, 235, 0.82);
}

.panel-heading {
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 1rem;
}

.count-pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 2.4rem;
	padding: 0.45rem 0.8rem;
	border-radius: 999px;
	background: #edf4fb;
	color: #274866;
	font-weight: 700;
}

.record-list {
	display: grid;
	gap: 0.85rem;
}

.record-card {
	border-radius: 22px;
	background: #f8fbff;
	box-shadow: inset 0 0 0 1px rgba(210, 223, 237, 0.95);
	overflow: hidden;
}

.record-summary {
	list-style: none;
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.1rem;
	cursor: pointer;
}

.record-summary::-webkit-details-marker {
	display: none;
}

.record-action {
	font-size: 0.92rem;
	font-weight: 700;
	color: #3a6ea5;
}

.record-subcopy,
.record-meta,
.empty-copy,
.helper-copy,
.error-copy {
	margin: 0;
	line-height: 1.65;
	color: #55697c;
}

.record-subcopy {
	margin-top: 0.35rem;
}

.record-meta {
	padding: 0 1.1rem 0.8rem;
	font-size: 0.92rem;
}

.record-body {
	padding: 0 1.1rem 1.15rem;
	color: #24384c;
}

.record-body :deep(p),
.record-body :deep(ul),
.record-body :deep(ol) {
	margin: 0.65em 0;
}

.record-body :deep(ul),
.record-body :deep(ol) {
	padding-left: 1.3rem;
}

.record-body :deep(a) {
	color: #2f6699;
	font-weight: 600;
}

.record-body :deep(code) {
	background: #eef4fa;
	padding: 0.08em 0.35em;
	border-radius: 0.35rem;
}

.helper-copy {
	text-align: center;
}

.error-copy {
	color: #a13f3f;
}

@media (max-width: 900px) {
	.section-heading,
	.history-grid {
		grid-template-columns: 1fr;
	}
}
</style>
