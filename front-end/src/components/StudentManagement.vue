<script lang="ts" setup>
import type {
	StudentAccessCode,
	StudentAccount
} from "@/modules/studentAccounts";
import { computed, onMounted, ref } from "vue";
import StudentProjectReview from "@/components/StudentProjectReview.vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import {
	createAdminStudent,
	fetchAdminStudents,
	resetAdminStudentAccess,
	setAdminStudentActive
} from "@/modules/studentAccounts";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const students = ref<StudentAccount[]>([]);
const loading = ref(true);
const busyStudentID = ref("");
const creating = ref(false);
const username = ref("");
const createTeacherPassword = ref("");
const resetCandidateID = ref("");
const resetTeacherPassword = ref("");
const error = ref("");
const status = ref("");
const revealedAccess = ref<StudentAccessCode | null>(null);

const sortedStudents = computed(() =>
	[...students.value].sort((a, b) =>
		a.username.localeCompare(b.username, undefined, {
			sensitivity: "base"
		})
	)
);

function formatAccessCodeExpiry(value: string | null | undefined) {
	if (!value) return "";
	const expiresAt = new Date(value);
	if (Number.isNaN(expiresAt.getTime())) return "";
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(expiresAt);
}

function formatRosterDate(value: string | null | undefined) {
	if (!value) return "Never";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Never";
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium"
	}).format(date);
}

function rosterProjectCount(student: StudentAccount) {
	const count = student.projectCount;
	if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
		return 0;
	}
	return Math.floor(count);
}

function credentialStatus(student: StudentAccount) {
	switch (student.credentialState) {
		case "password":
			return "Password set";
		case "access-code": {
			const expiry = formatAccessCodeExpiry(student.accessCodeExpiresAt);
			return expiry
				? `Access code expires ${expiry}`
				: "Access code ready";
		}
		case "setup": {
			const expiry = formatAccessCodeExpiry(student.accessCodeExpiresAt);
			return expiry
				? `Password setup in progress — expires ${expiry}`
				: "Password setup in progress";
		}
		case "expired-code":
			return "Access code expired — reset access";
		case "none":
			return "Needs access reset";
		default:
			return student.passwordSetAt ? "Password set" : "Access not set";
	}
}

function errorMessage(caught: unknown, fallback: string) {
	if (
		caught &&
		typeof caught === "object" &&
		"response" in caught &&
		caught.response &&
		typeof caught.response === "object" &&
		"data" in caught.response &&
		caught.response.data &&
		typeof caught.response.data === "object" &&
		"message" in caught.response.data &&
		typeof caught.response.data.message === "string"
	) {
		return caught.response.data.message;
	}
	return caught instanceof Error ? caught.message : fallback;
}

function replaceStudent(student: StudentAccount) {
	const index = students.value.findIndex(
		candidate => candidate._id === student._id
	);
	if (index >= 0) {
		students.value.splice(index, 1, student);
		return;
	}
	students.value.push(student);
}

function dismissAccessCode() {
	revealedAccess.value = null;
}

function clearSensitiveManagementState() {
	students.value = [];
	dismissAccessCode();
	createTeacherPassword.value = "";
	resetTeacherPassword.value = "";
	resetCandidateID.value = "";
	busyStudentID.value = "";
}

function handleManagementError(caught: unknown, fallback: string) {
	if (clearAdminSessionOnAuthorizationError(caught, app)) {
		clearSensitiveManagementState();
		error.value = "";
		status.value = "";
		return;
	}
	error.value = errorMessage(caught, fallback);
}

async function loadStudents() {
	loading.value = true;
	error.value = "";
	try {
		students.value = await fetchAdminStudents();
	} catch (caught: unknown) {
		handleManagementError(caught, "Couldn’t load the student roster.");
	} finally {
		loading.value = false;
	}
}

async function createStudent() {
	const cleanUsername = username.value.trim().toLowerCase();
	if (creating.value || !cleanUsername || !createTeacherPassword.value) {
		return;
	}

	creating.value = true;
	error.value = "";
	status.value = "";
	dismissAccessCode();
	try {
		const result = await createAdminStudent(
			cleanUsername,
			createTeacherPassword.value
		);
		replaceStudent(result.student);
		revealedAccess.value = result;
		username.value = "";
		status.value = `Created ${result.student.username}.`;
	} catch (caught: unknown) {
		handleManagementError(caught, "Couldn’t create that student.");
	} finally {
		createTeacherPassword.value = "";
		creating.value = false;
	}
}

function startReset(studentID: string) {
	error.value = "";
	status.value = "";
	dismissAccessCode();
	resetTeacherPassword.value = "";
	resetCandidateID.value = studentID;
}

function cancelReset() {
	resetTeacherPassword.value = "";
	resetCandidateID.value = "";
}

async function resetAccess(student: StudentAccount) {
	if (
		busyStudentID.value ||
		resetCandidateID.value !== student._id ||
		!resetTeacherPassword.value
	) {
		return;
	}

	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	dismissAccessCode();
	try {
		const result = await resetAdminStudentAccess(
			student._id,
			resetTeacherPassword.value
		);
		replaceStudent(result.student);
		revealedAccess.value = result;
		status.value = `Reset access for ${result.student.username}.`;
		resetCandidateID.value = "";
	} catch (caught: unknown) {
		handleManagementError(caught, "Couldn’t reset this student’s access.");
	} finally {
		resetTeacherPassword.value = "";
		busyStudentID.value = "";
	}
}

async function toggleActive(student: StudentAccount) {
	if (busyStudentID.value) return;
	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	try {
		const saved = await setAdminStudentActive(
			student._id,
			student.active === false
		);
		replaceStudent(saved);
		status.value =
			saved.active === false
				? `Disabled ${saved.username}.`
				: `Enabled ${saved.username}.`;
	} catch (caught: unknown) {
		handleManagementError(caught, "Couldn’t update this student.");
	} finally {
		busyStudentID.value = "";
	}
}

async function copyAccessCode() {
	const accessCode = revealedAccess.value?.accessCode;
	if (!accessCode) return;

	try {
		await navigator.clipboard.writeText(accessCode);
		status.value = "Access code copied.";
	} catch {
		error.value = "Couldn’t copy the access code. Select and copy it.";
	}
}

onMounted(loadStudents);
</script>

<template>
	<section
		class="student-management"
		aria-labelledby="student-management-title"
	>
		<div class="student-management__heading">
			<div>
				<h2 id="student-management-title">Students</h2>
				<p>Create access and review saved Python projects.</p>
			</div>
			<span class="site-chip">{{ students.length }}</span>
		</div>

		<form
			class="student-management__create"
			@submit.prevent="createStudent"
		>
			<div class="student-management__field">
				<label for="new-student-username">Username</label>
				<input
					id="new-student-username"
					v-model="username"
					autocomplete="off"
					autocapitalize="none"
					maxlength="24"
					pattern="[A-Za-z][A-Za-z0-9-]{2,23}"
					required
					spellcheck="false"
					type="text"
				/>
			</div>
			<div class="student-management__field">
				<label for="create-student-teacher-password">
					Julio’s password
				</label>
				<input
					id="create-student-teacher-password"
					v-model="createTeacherPassword"
					autocomplete="current-password"
					required
					type="password"
				/>
			</div>
			<button
				class="site-button site-button--primary student-management__button"
				:disabled="creating"
				type="submit"
			>
				{{ creating ? "Creating…" : "Create student" }}
			</button>
			<p class="student-management__verification">
				Julio’s password verifies him before a new student credential is
				shown.
			</p>
		</form>

		<section
			v-if="revealedAccess"
			class="student-management__access-code"
			aria-labelledby="student-access-code-title"
		>
			<div>
				<h3 id="student-access-code-title">
					Access code for {{ revealedAccess.student.username }}
				</h3>
				<p>
					This code is shown only here. Give it to the student.
					<template
						v-if="
							formatAccessCodeExpiry(
								revealedAccess.student.accessCodeExpiresAt
							)
						"
					>
						It expires
						{{
							formatAccessCodeExpiry(
								revealedAccess.student.accessCodeExpiresAt
							)
						}}.
					</template>
				</p>
			</div>
			<code>{{ revealedAccess.accessCode }}</code>
			<div class="student-management__access-actions">
				<button
					class="site-button site-button--primary student-management__button"
					type="button"
					@click="copyAccessCode"
				>
					Copy code
				</button>
				<button
					class="site-button site-button--secondary student-management__button"
					type="button"
					@click="dismissAccessCode"
				>
					Dismiss
				</button>
			</div>
		</section>

		<p
			v-if="status"
			class="student-management__status"
			role="status"
			aria-live="polite"
		>
			{{ status }}
		</p>
		<p v-if="error" class="student-management__error" role="alert">
			{{ error }}
		</p>

		<p v-if="loading" class="student-management__empty">
			Loading students…
		</p>
		<p v-else-if="students.length === 0" class="student-management__empty">
			No students yet.
		</p>

		<div v-else class="student-management__list">
			<article
				v-for="student in sortedStudents"
				:key="student._id"
				class="student-management__student"
			>
				<div class="student-management__student-heading">
					<div>
						<h3>{{ student.username }}</h3>
						<span
							class="student-management__state"
							:class="{
								'is-disabled': student.active === false
							}"
						>
							{{
								student.active === false ? "Disabled" : "Active"
							}}
						</span>
						<span
							class="student-management__credential"
							:class="{
								'is-warning':
									student.credentialState === 'setup' ||
									student.credentialState ===
										'expired-code' ||
									student.credentialState === 'none'
							}"
						>
							{{ credentialStatus(student) }}
						</span>
						<dl class="student-management__activity">
							<div>
								<dt>Projects</dt>
								<dd data-testid="student-project-count">
									{{ rosterProjectCount(student) }}
								</dd>
							</div>
							<div>
								<dt>Last sign-in</dt>
								<dd data-testid="student-last-sign-in">
									{{ formatRosterDate(student.lastLoginAt) }}
								</dd>
							</div>
							<div>
								<dt>Last project save</dt>
								<dd data-testid="student-last-project-save">
									{{
										formatRosterDate(
											student.lastProjectSavedAt
										)
									}}
								</dd>
							</div>
						</dl>
					</div>
					<div class="student-management__student-actions">
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="!!busyStudentID"
							type="button"
							@click="startReset(student._id)"
						>
							Reset access
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:class="{
								'student-management__disable':
									student.active !== false
							}"
							:disabled="!!busyStudentID"
							type="button"
							@click="toggleActive(student)"
						>
							{{
								student.active === false ? "Enable" : "Disable"
							}}
						</button>
					</div>
				</div>

				<form
					v-if="resetCandidateID === student._id"
					class="student-management__reset"
					@submit.prevent="resetAccess(student)"
				>
					<p>
						This signs {{ student.username }} out, invalidates the
						current password, and creates a new one-time access
						code.
					</p>
					<div class="student-management__field">
						<label :for="`reset-teacher-password-${student._id}`">
							Julio’s password
						</label>
						<input
							:id="`reset-teacher-password-${student._id}`"
							v-model="resetTeacherPassword"
							autocomplete="current-password"
							required
							type="password"
						/>
					</div>
					<div class="student-management__reset-actions">
						<button
							class="site-button site-button--primary student-management__button"
							:disabled="busyStudentID === student._id"
							type="submit"
						>
							{{
								busyStudentID === student._id
									? "Creating…"
									: "Create new code"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="busyStudentID === student._id"
							type="button"
							@click="cancelReset"
						>
							Cancel
						</button>
					</div>
				</form>

				<StudentProjectReview
					:student-id="student._id"
					:username="student.username"
				/>
			</article>
		</div>
	</section>
</template>

<style scoped>
.student-management {
	display: grid;
	gap: 1rem;
}

.student-management__heading,
.student-management__student-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.student-management__heading > div,
.student-management__student-heading > div:first-child {
	display: grid;
	gap: 0.3rem;
}

.student-management__heading h2 {
	font-size: clamp(1.7rem, 3vw, 2.2rem);
}

.student-management__heading p,
.student-management__verification,
.student-management__empty,
.student-management__reset p,
.student-management__access-code p {
	color: var(--color-ink-soft);
	line-height: 1.55;
}

.student-management__create {
	display: grid;
	grid-template-columns: minmax(10rem, 1fr) minmax(12rem, 1fr) auto;
	align-items: end;
	gap: 0.75rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.student-management__field {
	display: grid;
	gap: 0.35rem;
}

.student-management__field label {
	color: var(--color-ink);
	font-size: 0.85rem;
	font-weight: 800;
}

.student-management__field input {
	width: 100%;
	min-height: 2.75rem;
	border: 1px solid var(--color-border-strong);
	border-radius: 12px;
	padding: 0.65rem 0.75rem;
	background: var(--color-surface-strong);
}

.student-management__verification {
	grid-column: 1 / -1;
	font-size: 0.83rem;
}

.student-management__button {
	min-height: 2.75rem;
	padding: 0.65rem 0.85rem;
}

.student-management__access-code {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	align-items: center;
	gap: 0.85rem 1rem;
	padding: 1rem;
	border: 1px solid var(--color-success-border);
	border-radius: var(--radius-md);
	background: var(--color-success-surface);
}

.student-management__access-code > div:first-child {
	display: grid;
	gap: 0.25rem;
}

.student-management__access-code h3,
.student-management__student h3 {
	font-family: var(--font-sans);
	font-size: 1.05rem;
	font-weight: 800;
}

.student-management__access-code code {
	padding: 0.55rem 0.7rem;
	border-radius: 10px;
	background: var(--color-surface-strong);
	color: var(--color-ink-strong);
	font-size: 1rem;
	font-weight: 800;
	letter-spacing: 0.06em;
	user-select: all;
}

.student-management__access-actions,
.student-management__student-actions,
.student-management__reset-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.student-management__status,
.student-management__error {
	padding: 0.7rem 0.8rem;
	border: 1px solid;
	border-radius: 11px;
}

.student-management__status {
	border-color: var(--color-success-border);
	background: var(--color-success-surface);
	color: var(--color-success-text);
}

.student-management__error {
	border-color: var(--color-error-border);
	background: var(--color-error-surface);
	color: var(--color-error-text);
}

.student-management__list {
	display: grid;
	gap: 0.85rem;
}

.student-management__student {
	display: grid;
	gap: 0.85rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.student-management__state {
	width: fit-content;
	padding: 0.2rem 0.5rem;
	border-radius: var(--radius-pill);
	background: var(--color-success-surface);
	color: var(--color-success-text);
	font-size: 0.75rem;
	font-weight: 800;
}

.student-management__credential {
	width: fit-content;
	color: var(--color-ink-soft);
	font-size: 0.78rem;
	font-weight: 700;
}

.student-management__credential.is-warning {
	color: var(--color-error-text);
}

.student-management__activity {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem 1rem;
	margin-top: 0.2rem;
}

.student-management__activity > div {
	display: grid;
	grid-template-columns: auto auto;
	gap: 0.3rem;
	color: var(--color-ink-soft);
	font-size: 0.78rem;
}

.student-management__activity dt {
	font-weight: 700;
}

.student-management__activity dd {
	color: var(--color-ink);
	font-weight: 800;
}

.student-management__state.is-disabled {
	background: var(--color-error-surface);
	color: var(--color-error-text);
}

.student-management__disable {
	color: #9f1239;
}

.student-management__reset {
	display: grid;
	gap: 0.75rem;
	padding: 0.9rem;
	border: 1px solid var(--color-error-border);
	border-radius: 14px;
	background: var(--color-error-surface);
}

.student-management__reset .student-management__field {
	max-width: 24rem;
}

@media (max-width: 860px) {
	.student-management__create,
	.student-management__access-code {
		grid-template-columns: 1fr;
	}

	.student-management__student-heading {
		align-items: flex-start;
		flex-direction: column;
	}
}

@media (max-width: 540px) {
	.student-management__access-actions,
	.student-management__student-actions,
	.student-management__reset-actions,
	.student-management__button {
		width: 100%;
	}
}
</style>
