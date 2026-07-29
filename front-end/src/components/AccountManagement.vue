<script lang="ts" setup>
import type { AxiosError } from "axios";
import { ref } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const app = useAppStore();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const error = ref("");
const isSubmitting = ref(false);

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
	<form class="auth-form" @submit.prevent="loginTeacher">
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
			v-model="password"
			autocomplete="current-password"
			required
			type="password"
		/>

		<label class="remember">
			<input v-model="rememberMe" name="remember" type="checkbox" />
			Remember me
		</label>

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

.remember {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	font-size: 0.92rem;
	font-weight: 600 !important;
	color: var(--color-ink-soft) !important;
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
</style>
