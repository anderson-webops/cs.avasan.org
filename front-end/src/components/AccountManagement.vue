<script lang="ts" setup>
import type { AxiosError } from "axios";
import type { Admin } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref, watch } from "vue";
import { api } from "@/api";
import { fetchStudentSession } from "@/modules/studentAccounts";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentAdmin, currentUser, sessionBootstrapStatus } = storeToRefs(app);

const email = ref("");
const password = ref("");
const passwordInput = ref<HTMLInputElement | null>(null);
const error = ref("");
const isSubmitting = ref(false);
const adminAuthRequestTimeoutMs = 30_000;

function clearTeacherPassword() {
	password.value = "";
	if (passwordInput.value) passwordInput.value.value = "";
}

function submitTeacherLogin() {
	const submittedEmail = email.value;
	const submittedPassword = password.value;
	clearTeacherPassword();
	return api.post(
		"/accounts/login",
		{
			email: submittedEmail,
			password: submittedPassword
		},
		{
			timeout: adminAuthRequestTimeoutMs,
			withCredentials: true
		}
	);
}

async function loginTeacher() {
	error.value = "";
	if (
		sessionBootstrapStatus.value !== "ready" ||
		!email.value ||
		!password.value ||
		isSubmitting.value
	) {
		return;
	}

	isSubmitting.value = true;
	const previousStudentID = app.currentUser?._id ?? null;
	let preparedStudentID: string | null = null;
	let loginResponseReceived = false;
	try {
		preparedStudentID = await app.prepareStudentSessionExit();
		const { data } = await submitTeacherLogin();
		loginResponseReceived = true;

		if (!data.currentAdmin) {
			throw new Error("This sign-in is available only to Julio.");
		}

		app.setCurrentAdmin(data.currentAdmin);
		await app.finishStudentSessionExit(preparedStudentID);
		password.value = "";
	} catch (caught: unknown) {
		const axiosError = caught as AxiosError<{ message?: string }>;
		const responseStatus = axiosError.response?.status;
		const requestDefinitelyFailed =
			loginResponseReceived ||
			(typeof responseStatus === "number" &&
				responseStatus >= 400 &&
				responseStatus < 500);

		if (requestDefinitelyFailed) {
			if (
				preparedStudentID &&
				app.currentUser?._id === preparedStudentID
			) {
				await app.cancelStudentSessionExit(preparedStudentID);
			}
			error.value =
				axiosError.response?.data?.message ??
				(caught instanceof Error
					? caught.message
					: "Unable to log in.");
			return;
		}

		let recoveredAdmin: Admin | null = null;
		try {
			const { data: marker } = await api.get<{
				adminID: string | null;
			}>("/accounts/me");
			if (marker.adminID) {
				const { data } = await api.get<{ currentAdmin: Admin }>(
					"/admins/loggedin"
				);
				if (data.currentAdmin?._id === marker.adminID) {
					recoveredAdmin = data.currentAdmin;
				}
			}
		} catch {
			// A student-session probe below is still authoritative if the
			// teacher marker or validation request was interrupted.
		}

		if (recoveredAdmin) {
			app.setCurrentAdmin(recoveredAdmin);
			await app.finishStudentSessionExit(preparedStudentID);
			password.value = "";
			return;
		}

		try {
			const recoveredStudent = await fetchStudentSession();
			const canResumePreparedStudent =
				!preparedStudentID || !recoveredStudent.requiresPasswordSetup;
			if (
				previousStudentID &&
				recoveredStudent.student?._id === previousStudentID &&
				canResumePreparedStudent
			) {
				app.setStudentSession(recoveredStudent);
				if (preparedStudentID) {
					await app.cancelStudentSessionExit(preparedStudentID);
				}
				error.value =
					caught instanceof Error
						? caught.message
						: "Unable to log in.";
				return;
			}

			await app.failClosedStudentSessionExit(
				preparedStudentID ?? previousStudentID
			);
			error.value = previousStudentID
				? "The signed-in account changed. Reload before continuing."
				: caught instanceof Error
					? caught.message
					: "Unable to log in.";
		} catch {
			await app.failClosedStudentSessionExit(
				preparedStudentID ?? previousStudentID
			);
			error.value =
				"Couldn’t confirm which account is signed in. Reload before continuing.";
		}
	} finally {
		clearTeacherPassword();
		isSubmitting.value = false;
	}
}

watch(
	[
		() => currentAdmin.value?._id ?? null,
		() => currentUser.value?._id ?? null,
		sessionBootstrapStatus
	],
	(
		[adminID, studentID, bootstrapStatus],
		[previousAdminID, previousStudentID]
	) => {
		if (
			adminID !== previousAdminID ||
			studentID !== previousStudentID ||
			bootstrapStatus !== "ready"
		) {
			clearTeacherPassword();
		}
	}
);

onBeforeUnmount(clearTeacherPassword);
</script>

<template>
	<p
		v-if="sessionBootstrapStatus === 'pending'"
		aria-live="polite"
		class="session-status"
	>
		Checking the signed-in account…
	</p>
	<p
		v-else-if="sessionBootstrapStatus === 'failed'"
		class="error"
		role="alert"
	>
		Couldn’t confirm which account is signed in. Reload before logging in.
	</p>
	<form v-else class="auth-form" @submit.prevent="loginTeacher">
		<label for="admin-email">Email</label>
		<input
			id="admin-email"
			v-model="email"
			autocomplete="username"
			required
			type="email"
		/>

		<label for="admin-password">Password</label>
		<input
			id="admin-password"
			ref="passwordInput"
			v-model="password"
			autocomplete="current-password"
			required
			type="password"
		/>

		<p v-if="error" class="error" role="alert">{{ error }}</p>

		<button class="button" :disabled="isSubmitting" type="submit">
			{{ isSubmitting ? "Logging in…" : "Log in" }}
		</button>
	</form>
</template>

<style scoped>
.auth-form {
	display: grid;
	gap: 0.8rem;
}

.auth-form label {
	font-weight: 800;
	color: var(--color-ink);
}

.auth-form input:not([type="checkbox"]) {
	width: 100%;
	border: 1px solid var(--color-border-strong);
	border-radius: 14px;
	padding: 0.8rem 0.9rem;
	background: var(--color-surface-strong);
}

.button {
	width: fit-content;
	min-height: 2.9rem;
	padding: 0.7rem 1rem;
	border: 1px solid transparent;
	border-radius: 13px;
	background: var(--color-button-primary-bg);
	color: var(--color-button-primary-text);
	font-weight: 800;
}

.button:disabled {
	cursor: wait;
	opacity: 0.7;
}

.error {
	padding: 0.75rem 0.9rem;
	border: 1px solid var(--color-error-border);
	border-radius: 12px;
	background: var(--color-error-surface);
	color: var(--color-error-text);
}

.session-status {
	margin: 0;
}
</style>
