<script lang="ts" setup>
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { api } from "@/api";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { loginBlock } = storeToRefs(app);

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const error = ref("");
const isSubmitting = ref(false);

function close() {
	app.setLoginBlock(false);
	error.value = "";
}

async function loginTeacher() {
	error.value = "";
	if (!email.value || !password.value || isSubmitting.value) return;

	isSubmitting.value = true;
	try {
		const { data } = await api.post(
			"/accounts/login",
			{
				email: email.value,
				password: password.value,
				remember: rememberMe.value
			},
			{ withCredentials: true }
		);

		if (!data.currentAdmin) {
			throw new Error("This sign-in is available only to Julio.");
		}

		app.setCurrentAdmin(data.currentAdmin);
		password.value = "";
		rememberMe.value = false;
		close();
	} catch (caught: unknown) {
		const axiosError = caught as AxiosError<{ message?: string }>;
		error.value =
			axiosError.response?.data?.message ??
			(caught instanceof Error ? caught.message : "Unable to log in.");
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<AccessibleDialog
		close-label="Close teacher login dialog"
		description="This private sign-in is only for Julio, the teacher who maintains the course library."
		dialog-id="teacher-login-dialog"
		:open="loginBlock"
		title="Teacher log in"
		@close="close"
	>
		<form class="auth-form" @submit.prevent="loginTeacher">
			<label for="teacher-email">Email</label>
			<input
				id="teacher-email"
				v-model="email"
				autocomplete="email"
				placeholder="Teacher email"
				required
				type="email"
			/>

			<label for="teacher-password">Password</label>
			<input
				id="teacher-password"
				v-model="password"
				autocomplete="current-password"
				placeholder="Password"
				required
				type="password"
			/>

			<label class="remember">
				<input v-model="rememberMe" name="remember" type="checkbox" />
				Remember me on this device
			</label>

			<p v-if="error" class="error" role="alert">{{ error }}</p>

			<div class="auth-actions">
				<button class="button" :disabled="isSubmitting" type="submit">
					{{ isSubmitting ? "Logging in…" : "Log in" }}
				</button>
				<button class="button secondary" type="button" @click="close">
					Cancel
				</button>
			</div>

			<p class="auth-note">
				Students do not need an account. Open Courses or the Python IDE
				directly from the main menu.
			</p>
		</form>
	</AccessibleDialog>
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

.remember {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	font-size: 0.92rem;
	font-weight: 600 !important;
	color: var(--color-ink-soft) !important;
}

.auth-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
	margin-top: 0.35rem;
}

.button {
	min-height: 2.9rem;
	padding: 0.7rem 1rem;
	border: 1px solid transparent;
	border-radius: 13px;
	background: var(--color-button-primary-bg);
	color: var(--color-button-primary-text);
	font-weight: 800;
}

.button.secondary {
	border-color: var(--color-border-strong);
	background: var(--color-button-secondary-bg);
	color: var(--color-ink);
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

.auth-note {
	padding-top: 0.85rem;
	border-top: 1px solid var(--color-border);
	color: var(--color-ink-soft);
	font-size: 0.9rem;
	line-height: 1.6;
}
</style>
