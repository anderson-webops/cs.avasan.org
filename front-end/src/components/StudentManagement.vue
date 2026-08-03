<script lang="ts" setup>
import type {
	StudentAccessCode,
	StudentAccount,
	StudentDeletionReceipt
} from "@/modules/studentAccounts";
import { computed, onMounted, ref } from "vue";
import StudentProjectReview from "@/components/StudentProjectReview.vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import {
	correctAdminStudentUsername,
	createAdminStudent,
	deleteAdminStudentRecords,
	exportAdminStudentRecords,
	fetchAdminStudentDeletionReceipts,
	fetchAdminStudents,
	resetAdminStudentAccess,
	setAdminStudentActive,
	setAdminStudentRecordPreservation
} from "@/modules/studentAccounts";
import { useAppStore } from "@/stores/app";

const props = withDefaults(
	defineProps<{
		maintenanceOnly?: boolean;
	}>(),
	{
		maintenanceOnly: false
	}
);

const app = useAppStore();
const students = ref<StudentAccount[]>([]);
const deletionReceipts = ref<StudentDeletionReceipt[]>([]);
const deletionReceiptRetentionDays = ref(90);
const loading = ref(true);
const busyStudentID = ref("");
const creating = ref(false);
const username = ref("");
const createTeacherPassword = ref("");
const resetCandidateID = ref("");
const resetTeacherPassword = ref("");
const correctionCandidateID = ref("");
const correctedUsername = ref("");
const correctionTeacherPassword = ref("");
const recordCandidateID = ref("");
const recordAction = ref<"delete" | "export" | "">("");
const recordTeacherPassword = ref("");
const deleteConfirmation = ref("");
const preservationCandidateID = ref("");
const preservationTeacherPassword = ref("");
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

function formatPreservationTimestamp(value: string | null | undefined) {
	if (!value) return "Not recorded";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Not recorded";
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}

function rosterProjectCount(student: StudentAccount) {
	const count = student.projectCount;
	if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
		return 0;
	}
	return Math.floor(count);
}

function retentionIsExpired(student: StudentAccount) {
	if (!student.retentionExpiresAt) return false;
	const expiresAt = new Date(student.retentionExpiresAt).getTime();
	return Number.isFinite(expiresAt) && expiresAt <= Date.now();
}

function studentSecurityControlsAreAvailable(student: StudentAccount) {
	return (
		!props.maintenanceOnly &&
		!student.deletionPending &&
		!retentionIsExpired(student)
	);
}

function credentialStatus(student: StudentAccount) {
	if (retentionIsExpired(student)) {
		return "Retention expired — delete records";
	}
	switch (student.credentialState) {
		case "social":
			return student.socialProviders?.[0] === "apple"
				? "Apple connected"
				: student.socialProviders?.[0] === "google"
					? "Google connected"
					: "Provider connected";
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
	deletionReceipts.value = [];
	dismissAccessCode();
	createTeacherPassword.value = "";
	resetTeacherPassword.value = "";
	resetCandidateID.value = "";
	correctionCandidateID.value = "";
	correctedUsername.value = "";
	correctionTeacherPassword.value = "";
	recordCandidateID.value = "";
	recordAction.value = "";
	recordTeacherPassword.value = "";
	deleteConfirmation.value = "";
	preservationCandidateID.value = "";
	preservationTeacherPassword.value = "";
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
		const [loadedStudents, loadedReceipts] = await Promise.all([
			fetchAdminStudents(),
			fetchAdminStudentDeletionReceipts()
		]);
		students.value = loadedStudents;
		deletionReceipts.value = loadedReceipts.receipts;
		deletionReceiptRetentionDays.value = loadedReceipts.retentionDays;
	} catch (caught: unknown) {
		handleManagementError(caught, "Couldn’t load the student roster.");
	} finally {
		loading.value = false;
	}
}

async function createStudent() {
	if (props.maintenanceOnly) return;
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
	if (props.maintenanceOnly) return;
	error.value = "";
	status.value = "";
	dismissAccessCode();
	cancelCorrection();
	cancelRecordAction();
	cancelPreservationAction();
	resetTeacherPassword.value = "";
	resetCandidateID.value = studentID;
}

function cancelReset() {
	resetTeacherPassword.value = "";
	resetCandidateID.value = "";
}

function startCorrection(student: StudentAccount) {
	if (student.recordPreservation?.active) return;
	error.value = "";
	status.value = "";
	dismissAccessCode();
	cancelReset();
	cancelRecordAction();
	cancelPreservationAction();
	correctionCandidateID.value = student._id;
	correctedUsername.value = student.username;
	correctionTeacherPassword.value = "";
}

function cancelCorrection() {
	correctionCandidateID.value = "";
	correctedUsername.value = "";
	correctionTeacherPassword.value = "";
}

function startRecordAction(studentID: string, action: "delete" | "export") {
	error.value = "";
	status.value = "";
	dismissAccessCode();
	cancelReset();
	cancelCorrection();
	cancelPreservationAction();
	recordCandidateID.value = studentID;
	recordAction.value = action;
	recordTeacherPassword.value = "";
	deleteConfirmation.value = "";
}

function startPreservationAction(studentID: string) {
	error.value = "";
	status.value = "";
	dismissAccessCode();
	cancelReset();
	cancelCorrection();
	cancelRecordAction();
	preservationCandidateID.value = studentID;
	preservationTeacherPassword.value = "";
}

function cancelPreservationAction() {
	preservationCandidateID.value = "";
	preservationTeacherPassword.value = "";
}

function cancelRecordAction() {
	recordCandidateID.value = "";
	recordAction.value = "";
	recordTeacherPassword.value = "";
	deleteConfirmation.value = "";
}

function downloadJsonFile(filename: string, value: unknown) {
	const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], {
		type: "application/json"
	});
	downloadBlobFile(filename, blob);
}

function downloadBlobFile(filename: string, blob: Blob) {
	const href = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = href;
	anchor.download = filename;
	anchor.rel = "noopener";
	anchor.click();
	URL.revokeObjectURL(href);
}

function downloadStudentExport(
	student: StudentAccount,
	exportDownload: Awaited<ReturnType<typeof exportAdminStudentRecords>>
) {
	downloadBlobFile(
		`${student.username}-classroom-records.json`,
		exportDownload.blob
	);
}

function downloadDeletionReceipt(receipt: StudentDeletionReceipt) {
	downloadJsonFile(
		`${receipt.subject.username}-deletion-receipt-${receipt.operationID}.json`,
		receipt
	);
}

async function correctUsername(student: StudentAccount) {
	const cleanUsername = correctedUsername.value.trim().toLowerCase();
	if (
		busyStudentID.value ||
		correctionCandidateID.value !== student._id ||
		!cleanUsername ||
		!correctionTeacherPassword.value
	) {
		return;
	}

	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	try {
		const saved = await correctAdminStudentUsername(
			student._id,
			cleanUsername,
			correctionTeacherPassword.value
		);
		replaceStudent(saved);
		status.value = `Corrected ${student.username} to ${saved.username}. The student was signed out.`;
		cancelCorrection();
	} catch (caught: unknown) {
		handleManagementError(
			caught,
			"Couldn’t correct this student’s username."
		);
	} finally {
		correctionTeacherPassword.value = "";
		busyStudentID.value = "";
	}
}

async function exportRecords(student: StudentAccount) {
	if (
		busyStudentID.value ||
		recordCandidateID.value !== student._id ||
		recordAction.value !== "export" ||
		!recordTeacherPassword.value
	) {
		return;
	}

	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	try {
		const exportDownload = await exportAdminStudentRecords(
			student._id,
			recordTeacherPassword.value
		);
		downloadStudentExport(student, exportDownload);
		status.value = `Exported ${student.username}.`;
		cancelRecordAction();
	} catch (caught: unknown) {
		handleManagementError(
			caught,
			"Couldn’t export this student’s records."
		);
	} finally {
		recordTeacherPassword.value = "";
		busyStudentID.value = "";
	}
}

async function deleteRecords(student: StudentAccount) {
	if (
		busyStudentID.value ||
		recordCandidateID.value !== student._id ||
		recordAction.value !== "delete" ||
		!recordTeacherPassword.value ||
		deleteConfirmation.value.trim().toLowerCase() !==
			student.username.toLowerCase() ||
		student.recordPreservation?.active
	) {
		return;
	}

	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	try {
		const result = await deleteAdminStudentRecords(
			student._id,
			deleteConfirmation.value,
			recordTeacherPassword.value
		);
		students.value = students.value.filter(
			candidate => candidate._id !== student._id
		);
		deletionReceipts.value = [
			result.receipt,
			...deletionReceipts.value.filter(
				receipt => receipt.operationID !== result.receipt.operationID
			)
		];
		downloadDeletionReceipt(result.receipt);
		status.value = `Deleted ${student.username} and ${result.deletedRecords.projects} project records. The short-lived deletion receipt was downloaded. Operation ${result.operation.id}. Complete the documented backup follow-up.`;
		cancelRecordAction();
	} catch (caught: unknown) {
		handleManagementError(
			caught,
			"Couldn’t delete this student’s records."
		);
	} finally {
		recordTeacherPassword.value = "";
		busyStudentID.value = "";
	}
}

async function updateRecordPreservation(student: StudentAccount) {
	if (
		busyStudentID.value ||
		preservationCandidateID.value !== student._id ||
		!preservationTeacherPassword.value
	) {
		return;
	}

	const active = !student.recordPreservation?.active;
	busyStudentID.value = student._id;
	error.value = "";
	status.value = "";
	try {
		const recordPreservation = await setAdminStudentRecordPreservation(
			student._id,
			active,
			preservationTeacherPassword.value
		);
		replaceStudent({ ...student, recordPreservation });
		status.value = active
			? student.deletionPending
				? `Placed a record-preservation hold for ${student.username}. Any records that remain after the earlier deletion attempt are preserved, but already-removed records cannot be restored.`
				: `Placed a record-preservation hold for ${student.username}. Project and review content, alias correction, and deletion are paused.`
			: student.deletionPending
				? `Released the record-preservation hold for ${student.username}. The pending deletion may resume on the next retry or retention sweep, and records already removed cannot be recovered.`
				: `Released the record-preservation hold for ${student.username}. Normal retention and deletion rules apply again.`;
		cancelPreservationAction();
	} catch (caught: unknown) {
		handleManagementError(
			caught,
			"Couldn’t update this student’s record-preservation hold."
		);
	} finally {
		preservationTeacherPassword.value = "";
		busyStudentID.value = "";
	}
}

async function resetAccess(student: StudentAccount) {
	if (props.maintenanceOnly) return;
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
	if (props.maintenanceOnly) return;
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
				<h2 id="student-management-title">
					{{ maintenanceOnly ? "Student records" : "Students" }}
				</h2>
				<p v-if="maintenanceOnly">
					Preserve, review, correct, export, or delete records under
					the school’s configured retention period.
				</p>
				<p v-else>Create access and review saved Python projects.</p>
			</div>
			<span class="site-chip">{{ students.length }}</span>
		</div>

		<form
			v-if="!maintenanceOnly"
			class="student-management__create"
			@submit.prevent="createStudent"
		>
			<div class="student-management__field">
				<label for="new-student-username">Username</label>
				<input
					id="new-student-username"
					v-model="username"
					aria-describedby="new-student-username-hint"
					autocomplete="off"
					autocapitalize="none"
					maxlength="24"
					pattern="[A-Za-z][A-Za-z0-9-]{2,23}"
					required
					spellcheck="false"
					type="text"
				/>
				<small id="new-student-username-hint">
					Use a school-approved alias such as river-7. Do not use a
					full name, email, birthdate, student number, or other direct
					identifier. Keep the alias-to-roster mapping only in the
					school’s approved system. See
					<a href="/student-privacy">
						student privacy and record requests </a
					>.
				</small>
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
			v-if="!maintenanceOnly && revealedAccess"
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
			{{
				maintenanceOnly
					? "No retained student records."
					: "No students yet."
			}}
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
								'is-disabled':
									student.active === false ||
									student.deletionPending ||
									retentionIsExpired(student)
							}"
						>
							{{
								student.deletionPending
									? "Deletion needs retry"
									: retentionIsExpired(student)
										? "Retention expired"
										: maintenanceOnly
											? "Retained record"
											: student.active === false
												? "Disabled"
												: "Active"
							}}
						</span>
						<span
							v-if="!maintenanceOnly"
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
						<span
							v-if="student.recordPreservation?.active"
							class="student-management__preservation-state"
						>
							Records preserved for inspection or review
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
							<div>
								<dt>Scheduled record deletion</dt>
								<dd data-testid="student-retention-expiry">
									{{
										formatRosterDate(
											student.retentionExpiresAt
										)
									}}
								</dd>
							</div>
						</dl>
					</div>
					<div class="student-management__student-actions">
						<button
							class="site-button site-button--secondary student-management__button"
							:class="{
								'student-management__preservation-button':
									student.recordPreservation?.active
							}"
							:disabled="!!busyStudentID"
							type="button"
							@click="startPreservationAction(student._id)"
						>
							{{
								student.recordPreservation?.active
									? "Review preservation hold"
									: "Preserve records"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="
								!!busyStudentID ||
								student.deletionPending ||
								student.recordPreservation?.active
							"
							type="button"
							@click="startCorrection(student)"
						>
							Correct username
						</button>
						<button
							v-if="!maintenanceOnly"
							class="site-button site-button--secondary student-management__button"
							:disabled="
								!!busyStudentID ||
								student.deletionPending ||
								retentionIsExpired(student)
							"
							type="button"
							@click="startReset(student._id)"
						>
							Reset access
						</button>
						<button
							v-if="!maintenanceOnly"
							class="site-button site-button--secondary student-management__button"
							:class="{
								'student-management__disable':
									student.active !== false
							}"
							:disabled="
								!!busyStudentID ||
								student.deletionPending ||
								(student.active === false &&
									retentionIsExpired(student))
							"
							type="button"
							@click="toggleActive(student)"
						>
							{{
								student.active === false ? "Enable" : "Disable"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="
								!!busyStudentID ||
								(student.deletionPending &&
									!student.recordPreservation?.active)
							"
							type="button"
							@click="startRecordAction(student._id, 'export')"
						>
							Export records
						</button>
						<button
							class="site-button site-button--secondary student-management__button student-management__disable"
							:disabled="
								!!busyStudentID ||
								student.recordPreservation?.active
							"
							type="button"
							@click="startRecordAction(student._id, 'delete')"
						>
							Delete records
						</button>
					</div>
				</div>

				<form
					v-if="correctionCandidateID === student._id"
					class="student-management__reset"
					@submit.prevent="correctUsername(student)"
				>
					<div>
						<h4>Correct the school-approved alias</h4>
						<p>
							This keeps the account and saved projects, changes
							only the classroom username, and signs the student
							out. Update the separate alias-to-roster mapping in
							the school’s approved system too.
						</p>
					</div>
					<div class="student-management__field">
						<label :for="`correct-username-${student._id}`">
							Corrected username
						</label>
						<input
							:id="`correct-username-${student._id}`"
							v-model="correctedUsername"
							:aria-describedby="`correct-username-hint-${student._id}`"
							autocomplete="off"
							autocapitalize="none"
							maxlength="24"
							pattern="[A-Za-z][A-Za-z0-9-]{2,23}"
							required
							spellcheck="false"
							type="text"
						/>
						<small :id="`correct-username-hint-${student._id}`">
							Use only a school-approved alias. See
							<a href="/student-privacy">
								student privacy and record requests </a
							>.
						</small>
					</div>
					<div class="student-management__field">
						<label :for="`correct-teacher-password-${student._id}`">
							Julio’s password
						</label>
						<input
							:id="`correct-teacher-password-${student._id}`"
							v-model="correctionTeacherPassword"
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
									? "Correcting…"
									: "Save correction"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="busyStudentID === student._id"
							type="button"
							@click="cancelCorrection"
						>
							Cancel
						</button>
					</div>
				</form>

				<form
					v-if="preservationCandidateID === student._id"
					class="student-management__record-action student-management__record-preservation"
					@submit.prevent="updateRecordPreservation(student)"
				>
					<div>
						<h4>
							{{
								student.recordPreservation?.active
									? "Release record-preservation hold"
									: "Preserve records for inspection or review"
							}}
						</h4>
						<p>
							This fixed-purpose hold is only for an open FERPA
							inspection or review request. While active, project
							and review changes, alias correction, and manual or
							automatic deletion are blocked. Release the hold
							only after the request is closed.
							<template
								v-if="
									studentSecurityControlsAreAvailable(student)
								"
							>
								Password, provider, access-code, active-state,
								login, and logout security controls remain
								available.
							</template>
							<template v-else-if="student.deletionPending">
								Because deletion already began, this hold does
								not reactivate the account or restore sign-in,
								password, provider, access-code, or active-state
								controls.
							</template>
							<template
								v-else-if="student.recordPreservation?.active"
							>
								Student sign-in, password or provider setup,
								access-code reset, and active-state controls are
								unavailable because this is a retained
								maintenance record or its retention deadline has
								passed. Preservation review and export remain
								available. Alias correction and approved
								deletion remain blocked until the request closes
								and the hold is released.
							</template>
							<template v-else>
								Student sign-in, password or provider setup,
								access-code reset, and active-state controls are
								unavailable because this is a retained
								maintenance record or its retention deadline has
								passed. Preservation, alias correction, export,
								and approved deletion are available now; placing
								the hold will pause correction and deletion
								until the request closes.
							</template>
						</p>
						<p v-if="student.recordPreservation?.active">
							Placed
							{{
								formatPreservationTimestamp(
									student.recordPreservation.placedAt
								)
							}}.
						</p>
						<p v-if="student.deletionPending">
							A deletion attempt already began. A hold preserves
							only the records that still remain; it cannot
							restore records that were already removed.
							<template v-if="student.recordPreservation?.active">
								Releasing this hold allows the pending deletion
								retry to resume; already-removed records cannot
								be recovered.
							</template>
							<template v-else>
								Placing the hold stops the next deletion retry
								while the request remains open.
							</template>
						</p>
					</div>
					<details
						v-if="student.recordPreservation?.events.length"
						class="student-management__preservation-events"
					>
						<summary>Preservation audit history</summary>
						<ol>
							<li
								v-for="(event, eventIndex) in student
									.recordPreservation.events"
								:key="`${event.action}-${event.at}-${eventIndex}`"
							>
								{{
									event.action === "placed"
										? "Placed"
										: "Released"
								}}
								{{ formatPreservationTimestamp(event.at) }}
							</li>
						</ol>
					</details>
					<div class="student-management__field">
						<label
							:for="`preservation-teacher-password-${student._id}`"
						>
							Julio’s password
						</label>
						<input
							:id="`preservation-teacher-password-${student._id}`"
							v-model="preservationTeacherPassword"
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
									? "Saving…"
									: student.recordPreservation?.active
										? "Release hold"
										: "Place hold"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="busyStudentID === student._id"
							type="button"
							@click="cancelPreservationAction"
						>
							Cancel
						</button>
					</div>
				</form>

				<form
					v-if="resetCandidateID === student._id"
					class="student-management__reset"
					@submit.prevent="resetAccess(student)"
				>
					<p>
						This signs {{ student.username }} out, invalidates any
						current password, disconnects any connected Google or
						Apple sign-in, and creates a new one-time access code.
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

				<form
					v-if="
						recordCandidateID === student._id &&
						recordAction === 'export'
					"
					class="student-management__record-action"
					@submit.prevent="exportRecords(student)"
				>
					<div>
						<h4>
							Export remaining account and educational records
						</h4>
						<p>
							Downloads the safe account metadata, projects, and
							Julio’s review copies that are still present as
							JSON. The inventory counts temporary provider
							attempts, but their credential and proof values are
							excluded.
						</p>
						<p v-if="student.deletionPending">
							Deletion already began, so this export contains only
							the account, project, and review records that
							remain. Download the matching deletion receipt
							separately from Recent deletion receipts.
						</p>
					</div>
					<div class="student-management__field">
						<label :for="`export-teacher-password-${student._id}`">
							Julio’s password
						</label>
						<input
							:id="`export-teacher-password-${student._id}`"
							v-model="recordTeacherPassword"
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
									? "Preparing…"
									: "Download JSON"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="busyStudentID === student._id"
							type="button"
							@click="cancelRecordAction"
						>
							Cancel
						</button>
					</div>
				</form>

				<form
					v-if="
						recordCandidateID === student._id &&
						recordAction === 'delete'
					"
					class="student-management__record-action student-management__record-action--delete"
					@submit.prevent="deleteRecords(student)"
				>
					<div>
						<h4>Permanently delete student records</h4>
						<p>
							This revokes every signed session and permanently
							removes the account, password or provider
							connection, pending provider attempts, Python
							projects, and Julio’s review copies. Download an
							export first if the school needs one. Afterward, a
							short-lived subject-linked deletion receipt is
							downloaded and remains available below so Julio can
							complete the school’s approved deletion process for
							any retained backup copy.
						</p>
						<p v-if="student.recordPreservation?.active">
							Deletion is unavailable while the
							record-preservation hold is active.
						</p>
					</div>
					<div class="student-management__field">
						<label :for="`delete-confirmation-${student._id}`">
							Type {{ student.username }} to confirm
						</label>
						<input
							:id="`delete-confirmation-${student._id}`"
							v-model="deleteConfirmation"
							autocomplete="off"
							:pattern="student.username"
							required
							spellcheck="false"
							type="text"
						/>
					</div>
					<div class="student-management__field">
						<label :for="`delete-teacher-password-${student._id}`">
							Julio’s password
						</label>
						<input
							:id="`delete-teacher-password-${student._id}`"
							v-model="recordTeacherPassword"
							autocomplete="current-password"
							required
							type="password"
						/>
					</div>
					<div class="student-management__reset-actions">
						<button
							class="site-button site-button--primary student-management__button student-management__delete-button"
							:disabled="
								busyStudentID === student._id ||
								student.recordPreservation?.active ||
								deleteConfirmation.trim().toLowerCase() !==
									student.username.toLowerCase()
							"
							type="submit"
						>
							{{
								busyStudentID === student._id
									? "Deleting…"
									: "Permanently delete"
							}}
						</button>
						<button
							class="site-button site-button--secondary student-management__button"
							:disabled="busyStudentID === student._id"
							type="button"
							@click="cancelRecordAction"
						>
							Cancel
						</button>
					</div>
				</form>

				<StudentProjectReview
					v-if="
						!maintenanceOnly &&
						!student.deletionPending &&
						!student.recordPreservation?.active
					"
					:student-id="student._id"
					:username="student.username"
				/>
			</article>
		</div>

		<section
			v-if="deletionReceipts.length"
			class="student-management__receipts"
			aria-labelledby="student-deletion-receipts-title"
		>
			<div>
				<h3 id="student-deletion-receipts-title">
					Recent deletion receipts
				</h3>
				<p>
					Unfinished receipts remain only until deletion is resolved.
					Completed receipts remain for
					{{ deletionReceiptRetentionDays }} days so Julio can finish
					the school’s approved backup-deletion follow-up. Download
					only into that approved system.
				</p>
			</div>
			<ul>
				<li
					v-for="receipt in deletionReceipts"
					:key="receipt.operationID"
				>
					<div>
						<strong>{{ receipt.subject.username }}</strong>
						<span
							class="student-management__receipt-state"
							:class="{
								'is-warning': receipt.status !== 'completed'
							}"
						>
							{{ receipt.status }}
						</span>
						<small>
							{{
								receipt.reason === "retention-expiry"
									? "Automatic retention deletion"
									: "Deleted by Julio"
							}}
						</small>
						<code>{{ receipt.operationID }}</code>
						<small>
							Requested
							{{ formatRosterDate(receipt.requestedAt) }};
							<template v-if="receipt.expiresAt">
								available through
								{{ formatRosterDate(receipt.expiresAt) }}
							</template>
							<template v-else>
								kept until deletion is resolved
							</template>
						</small>
					</div>
					<button
						class="site-button site-button--secondary student-management__button"
						type="button"
						@click="downloadDeletionReceipt(receipt)"
					>
						Download receipt
					</button>
				</li>
			</ul>
		</section>
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
.student-management__record-action p,
.student-management__access-code p,
.student-management__receipts p {
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

.student-management__preservation-state {
	width: fit-content;
	padding: 0.2rem 0.5rem;
	border-radius: var(--radius-pill);
	background: #fffbeb;
	color: #92400e;
	font-size: 0.78rem;
	font-weight: 800;
}

.student-management__preservation-button {
	border-color: #d97706;
	color: #92400e;
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

.student-management__record-action {
	display: grid;
	gap: 0.75rem;
	padding: 0.9rem;
	border: 1px solid var(--color-border-strong);
	border-radius: 14px;
	background: var(--color-surface-strong);
}

.student-management__record-action--delete {
	border-color: var(--color-error-border);
	background: var(--color-error-surface);
}

.student-management__record-preservation {
	border-color: #f59e0b;
	background: #fffbeb;
}

.student-management__preservation-events {
	color: var(--color-ink-soft);
	font-size: 0.85rem;
}

.student-management__preservation-events summary {
	cursor: pointer;
	font-weight: 800;
}

.student-management__preservation-events ol {
	margin: 0.5rem 0 0;
	padding-left: 1.25rem;
}

.student-management__record-action h4 {
	margin: 0 0 0.25rem;
	font-size: 1rem;
	font-weight: 900;
}

.student-management__receipts {
	display: grid;
	gap: 0.75rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.student-management__receipts > div {
	display: grid;
	gap: 0.25rem;
}

.student-management__receipts h3 {
	font-size: 1.05rem;
}

.student-management__receipts ul {
	display: grid;
	gap: 0.6rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.student-management__receipts li {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: var(--color-surface-strong);
}

.student-management__receipts li > div {
	display: grid;
	gap: 0.25rem;
	min-width: 0;
}

.student-management__receipts code {
	overflow-wrap: anywhere;
	color: var(--color-ink-soft);
	font-size: 0.78rem;
}

.student-management__receipts small {
	color: var(--color-ink-soft);
}

.student-management__receipt-state {
	width: fit-content;
	color: var(--color-success-text);
	font-size: 0.75rem;
	font-weight: 800;
	text-transform: capitalize;
}

.student-management__receipt-state.is-warning {
	color: var(--color-error-text);
}

.student-management__delete-button {
	border-color: #9f1239;
	background: #9f1239;
	color: white;
}

.student-management__reset .student-management__field,
.student-management__record-action .student-management__field {
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

	.student-management__receipts li {
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
