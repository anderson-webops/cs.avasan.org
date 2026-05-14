<script lang="ts" setup>
import { computed, ref } from "vue";
import { api } from "@/api";

type ScheduledSessionStatus =
	| "scheduled"
	| "cancelled"
	| "completed"
	| "rescheduled";

interface ScheduledSessionRecord {
	_id: string;
	title: string;
	courseId: string | null;
	startAt: string;
	endAt: string;
	timezone: string;
	status: ScheduledSessionStatus;
	notes: string | null;
}

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

const props = defineProps<{
	userId: string;
	userName: string;
	userEmail: string;
}>();

const statusChoices: ScheduledSessionStatus[] = [
	"scheduled",
	"rescheduled",
	"completed",
	"cancelled"
];

const timezone =
	Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
const opened = ref(false);
const loaded = ref(false);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");
const scheduledSessions = ref<ScheduledSessionRecord[]>([]);
const recentSessionNotes = ref<SessionNoteRecord[]>([]);
const scheduleForm = ref({
	title: "Class session",
	startAtLocal: defaultStartAtLocal(),
	durationMinutes: 60,
	timezone,
	notes: ""
});
const noteForm = ref({
	sessionDate: new Date().toISOString().slice(0, 10),
	subject: "",
	markdown: ""
});

const upcomingSessionCount = computed(
	() =>
		scheduledSessions.value.filter(
			session =>
				session.status === "scheduled" ||
				session.status === "rescheduled"
		).length
);

function defaultStartAtLocal() {
	const nextHour = new Date();
	nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
	return toDatetimeLocalValue(nextHour);
}

function toDatetimeLocalValue(date: Date) {
	const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
	return local.toISOString().slice(0, 16);
}

function formatDateTime(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	}).format(date);
}

function notePreview(markdown: string) {
	return markdown.replace(/\s+/g, " ").trim().slice(0, 180);
}

function statusSelectLabel(session: ScheduledSessionRecord) {
	return `Update status for ${session.title} on ${formatDateTime(session.startAt)}`;
}

async function loadSessionTools() {
	if (!props.userId) return;

	loading.value = true;
	error.value = "";

	try {
		const [scheduleResponse, notesResponse] = await Promise.all([
			api.get<{ scheduledSessions: ScheduledSessionRecord[] }>(
				`/users/${props.userId}/schedule`
			),
			api.get<{ sessionNotes: SessionNoteRecord[] }>(
				`/users/${props.userId}/session-notes/recent`
			)
		]);
		scheduledSessions.value = scheduleResponse.data.scheduledSessions ?? [];
		recentSessionNotes.value = notesResponse.data.sessionNotes ?? [];
		loaded.value = true;
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to load session tools.";
	} finally {
		loading.value = false;
	}
}

async function onToggle(event: Event) {
	opened.value = (event.target as HTMLDetailsElement).open;
	if (opened.value && !loaded.value && !loading.value) {
		await loadSessionTools();
	}
}

async function createScheduledSession() {
	const start = new Date(scheduleForm.value.startAtLocal);
	if (Number.isNaN(start.getTime())) {
		error.value = "Choose a valid start time.";
		return;
	}

	const durationMinutes = Number(scheduleForm.value.durationMinutes);
	if (!Number.isFinite(durationMinutes) || durationMinutes < 15) {
		error.value = "Duration must be at least 15 minutes.";
		return;
	}

	saving.value = true;
	error.value = "";
	success.value = "";

	try {
		const end = new Date(start.getTime() + durationMinutes * 60_000);
		const { data } = await api.post<{
			scheduledSession: ScheduledSessionRecord;
		}>(`/users/${props.userId}/schedule`, {
			title: scheduleForm.value.title,
			startAt: start.toISOString(),
			endAt: end.toISOString(),
			timezone: scheduleForm.value.timezone,
			notes: scheduleForm.value.notes
		});
		scheduledSessions.value = [
			...scheduledSessions.value,
			data.scheduledSession
		].sort(
			(a, b) =>
				new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
		);
		scheduleForm.value = {
			title: "Class session",
			startAtLocal: defaultStartAtLocal(),
			durationMinutes: 60,
			timezone,
			notes: ""
		};
		success.value = "Scheduled session added.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to add scheduled session.";
	} finally {
		saving.value = false;
	}
}

async function updateSessionStatus(
	session: ScheduledSessionRecord,
	status: ScheduledSessionStatus
) {
	saving.value = true;
	error.value = "";
	success.value = "";

	try {
		const { data } = await api.put<{
			scheduledSession: ScheduledSessionRecord;
		}>(`/users/${props.userId}/schedule/${session._id}`, { status });
		scheduledSessions.value = scheduledSessions.value.map(existing =>
			existing._id === session._id ? data.scheduledSession : existing
		);
		success.value = "Session status updated.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to update session status.";
	} finally {
		saving.value = false;
	}
}

async function createSessionNote() {
	if (!noteForm.value.markdown.trim()) {
		error.value = "Session notes are required.";
		return;
	}

	saving.value = true;
	error.value = "";
	success.value = "";

	try {
		const { data } = await api.post<{
			recentSessionNotes: SessionNoteRecord[];
		}>(`/users/${props.userId}/session-notes`, {
			sessionDate: noteForm.value.sessionDate,
			subject: noteForm.value.subject,
			markdown: noteForm.value.markdown
		});
		recentSessionNotes.value = data.recentSessionNotes ?? [];
		noteForm.value = {
			sessionDate: new Date().toISOString().slice(0, 10),
			subject: "",
			markdown: ""
		};
		success.value = "Session note saved without sending email.";
	} catch (err: any) {
		error.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to save session note.";
	} finally {
		saving.value = false;
	}
}
</script>

<template>
	<details class="session-tools" @toggle="onToggle">
		<summary class="tools-summary">
			<span>
				<strong>Schedule and notes</strong>
				<small>{{ userName }} - {{ userEmail }}</small>
			</span>
			<span v-if="loaded" class="summary-count">
				{{ upcomingSessionCount }} upcoming
			</span>
		</summary>

		<div class="tools-body">
			<p v-if="loading" class="muted-copy">
				Loading schedule and notes...
			</p>
			<p v-if="error" class="error-copy" role="alert">{{ error }}</p>
			<p
				v-if="success"
				class="success-copy"
				role="status"
				aria-live="polite"
			>
				{{ success }}
			</p>

			<div class="tools-grid">
				<section class="tool-panel">
					<div class="tool-heading">
						<p class="tool-eyebrow">Visible schedule</p>
						<h5>Add a class session</h5>
					</div>
					<form
						class="tool-form"
						@submit.prevent="createScheduledSession"
					>
						<label>
							Title
							<input v-model="scheduleForm.title" type="text" />
						</label>
						<label>
							Start
							<input
								v-model="scheduleForm.startAtLocal"
								type="datetime-local"
							/>
						</label>
						<label>
							Duration minutes
							<input
								v-model.number="scheduleForm.durationMinutes"
								min="15"
								step="15"
								type="number"
							/>
						</label>
						<label>
							Timezone
							<input
								v-model="scheduleForm.timezone"
								type="text"
							/>
						</label>
						<label class="is-wide">
							Internal schedule note
							<textarea v-model="scheduleForm.notes" rows="3" />
						</label>
						<button
							class="btn-primary btn"
							:disabled="saving"
							type="submit"
						>
							Add schedule item
						</button>
					</form>
				</section>

				<section class="tool-panel">
					<div class="tool-heading">
						<p class="tool-eyebrow">Note-only log</p>
						<h5>Save without email</h5>
					</div>
					<form class="tool-form" @submit.prevent="createSessionNote">
						<label>
							Session date
							<input v-model="noteForm.sessionDate" type="date" />
						</label>
						<label>
							Subject
							<input
								v-model="noteForm.subject"
								placeholder="Optional"
								type="text"
							/>
						</label>
						<label class="is-wide">
							Notes
							<textarea v-model="noteForm.markdown" rows="6" />
						</label>
						<button
							class="btn-primary btn"
							:disabled="saving"
							type="submit"
						>
							Save note only
						</button>
					</form>
				</section>
			</div>

			<div class="tools-grid">
				<section class="tool-panel">
					<div class="tool-heading">
						<p class="tool-eyebrow">Schedule</p>
						<h5>Current items</h5>
					</div>
					<p v-if="!scheduledSessions.length" class="muted-copy">
						No schedule items are attached yet.
					</p>
					<ul v-else class="record-list">
						<li
							v-for="session in scheduledSessions"
							:key="session._id"
							class="record-item"
						>
							<div>
								<strong>{{ session.title }}</strong>
								<span
									>{{ formatDateTime(session.startAt) }} -
									{{ session.timezone }}</span
								>
								<small v-if="session.notes">{{
									session.notes
								}}</small>
							</div>
							<select
								:value="session.status"
								:aria-label="statusSelectLabel(session)"
								:disabled="saving"
								@change="
									updateSessionStatus(
										session,
										($event.target as HTMLSelectElement)
											.value as ScheduledSessionStatus
									)
								"
							>
								<option
									v-for="status in statusChoices"
									:key="status"
									:value="status"
								>
									{{ status }}
								</option>
							</select>
						</li>
					</ul>
				</section>

				<section class="tool-panel">
					<div class="tool-heading">
						<p class="tool-eyebrow">Recent notes</p>
						<h5>Latest three shown</h5>
					</div>
					<p v-if="!recentSessionNotes.length" class="muted-copy">
						No session notes are attached yet.
					</p>
					<ul v-else class="record-list">
						<li
							v-for="note in recentSessionNotes"
							:key="note._id"
							class="record-item is-note"
						>
							<div>
								<strong>{{ note.subject }}</strong>
								<span>{{ formatDate(note.sessionDate) }}</span>
								<small>{{ notePreview(note.markdown) }}</small>
							</div>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</details>
</template>

<style scoped>
.session-tools {
	margin-top: 1rem;
	border-radius: 22px;
	background: rgba(248, 250, 252, 0.9);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.75);
}

.tools-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.05rem;
	cursor: pointer;
	color: #10263a;
}

.tools-summary span:first-child {
	display: grid;
	gap: 0.2rem;
}

.tools-summary strong {
	font-size: 1rem;
}

.tools-summary small,
.record-item small,
.record-item span,
.muted-copy {
	color: #5f7a8e;
	line-height: 1.5;
}

.summary-count {
	flex: 0 0 auto;
	padding: 0.35rem 0.65rem;
	border-radius: 999px;
	background: rgba(37, 99, 235, 0.08);
	color: #245f96;
	font-size: 0.8rem;
	font-weight: 700;
}

.tools-body {
	display: grid;
	gap: 1rem;
	padding: 0 1.05rem 1.05rem;
}

.tools-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.tool-panel {
	display: grid;
	gap: 0.9rem;
	padding: 1rem;
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.tool-heading {
	display: grid;
	gap: 0.2rem;
}

.tool-eyebrow {
	margin: 0;
	font-size: 0.72rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.tool-heading h5 {
	margin: 0;
	font-size: 1rem;
	color: #10263a;
}

.tool-form {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.75rem;
}

.tool-form label {
	display: grid;
	gap: 0.35rem;
	font-size: 0.83rem;
	font-weight: 700;
	color: #334155;
}

.tool-form .is-wide,
.tool-form button {
	grid-column: 1 / -1;
}

.tool-form input,
.tool-form textarea,
.record-item select {
	width: 100%;
	box-sizing: border-box;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 14px;
	background: #fff;
	color: #10263a;
	font: inherit;
}

.tool-form input,
.record-item select {
	min-height: 2.65rem;
	padding: 0.65rem 0.75rem;
}

.tool-form textarea {
	resize: vertical;
	padding: 0.75rem;
}

.record-list {
	display: grid;
	gap: 0.7rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.record-item {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(9rem, 12rem);
	gap: 0.75rem;
	align-items: center;
	padding: 0.85rem;
	border-radius: 16px;
	background: rgba(248, 250, 252, 0.9);
}

.record-item.is-note {
	grid-template-columns: 1fr;
}

.record-item div {
	display: grid;
	gap: 0.18rem;
	min-width: 0;
}

.record-item strong {
	color: #10263a;
}

.error-copy,
.success-copy,
.muted-copy {
	margin: 0;
}

.error-copy {
	color: #b91c1c;
}

.success-copy {
	color: #15803d;
}

@media (max-width: 900px) {
	.tools-grid,
	.tool-form,
	.record-item {
		grid-template-columns: 1fr;
	}
}
</style>
