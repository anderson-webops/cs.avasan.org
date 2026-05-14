<!-- src/components/AccountManagement.vue -->
<script lang="ts" setup>
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { api } from "@/api";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();

// ─── LOGIN STATE & METHODS ──────────────────────────────────────────
const { loginBlock, signupBlock } = storeToRefs(app);

const loginEmail = ref("");
const loginPassword = ref("");
const rememberMe = ref(false);
const errorLogin = ref("");

function changeLoginView(show: boolean) {
	app.setLoginBlock(show);
}

function openSignupFromLogin() {
	changeLoginView(false);
	changeSignupView(true);
}

async function loginTutor() {
	errorLogin.value = "";
	if (!loginEmail.value || !loginPassword.value) return;
	try {
		const { data } = await api.post(
			"/accounts/login",
			{
				email: loginEmail.value,
				password: loginPassword.value,
				remember: rememberMe.value
			},
			{ withCredentials: true }
		);
		if (data.currentTutor) app.setCurrentTutor(data.currentTutor);
		if (data.currentUser) app.setCurrentUser(data.currentUser);
		if (data.currentAdmin) app.setCurrentAdmin(data.currentAdmin);
		changeLoginView(false);
		rememberMe.value = false;
	} catch (err: unknown) {
		const e = err as AxiosError<{ message?: string }>;
		errorLogin.value = `Login failed: ${e.response?.data?.message ?? e.message ?? "Unknown error"}`;
	}
}

// form state (new signups default to users)
const name = ref("");
const age = ref("");
const state = ref("");
const email = ref("");
const password = ref("");
const passwordRepeat = ref("");
const error = ref("");

// simple password‐match guard
const passwordMatch = computed(() => password.value === passwordRepeat.value);

// close / open (comes from your store)
function changeSignupView(show: boolean) {
	app.setSignupBlock(show);
}

// reset inputs after submission
function resetData() {
	name.value =
		age.value =
		state.value =
		email.value =
		password.value =
		passwordRepeat.value =
			"";
	error.value = "";
}

// on submit, dispatch to the right endpoint
async function addSignup() {
	error.value = "";
	if (!passwordMatch.value) return;

	try {
		// every self-serve signup creates a user account
		const res = await api.post(
			"/users",
			{
				name: name.value,
				age: age.value,
				state: state.value,
				email: email.value,
				password: password.value
			},
			{ withCredentials: true }
		);

		// immediately stash the newly-created user/tutor into Pinia
		if (res.data.currentTutor) {
			app.setCurrentTutor(res.data.currentTutor);
		} else if (res.data.currentUser) {
			app.setCurrentUser(res.data.currentUser);
		}

		resetData();
		changeSignupView(false);
	} catch (err: unknown) {
		const e = err as AxiosError<{ message?: string }>;
		error.value = `Error: ${e.response?.data?.message ?? e.message ?? "Unknown error"}`;
	}
}
</script>

<template>
	<div>
		<AccessibleDialog
			close-label="Close login dialog"
			description="Log in with the email and password connected to your classes account."
			dialog-id="login-dialog"
			:open="loginBlock"
			title="Log in"
			@close="changeLoginView(false)"
		>
			<form class="auth-form loginForm" @submit.prevent="loginTutor">
				<label for="uname">Email</label>
				<input
					id="uname"
					v-model="loginEmail"
					autocomplete="email"
					placeholder="Enter Email"
					required
					type="email"
				/>

				<label for="psw1">Password</label>
				<input
					id="psw1"
					v-model="loginPassword"
					autocomplete="current-password"
					placeholder="Enter Password"
					required
					type="password"
				/>

				<label class="remember">
					<input
						v-model="rememberMe"
						name="remember"
						type="checkbox"
					/>
					Remember me
				</label>

				<p
					v-if="errorLogin"
					id="login-error"
					class="error"
					role="alert"
				>
					{{ errorLogin }}
				</p>

				<div class="auth-actions">
					<button class="button" type="submit">Login</button>
					<button
						class="button secondary"
						type="button"
						@click="changeLoginView(false)"
					>
						Cancel
					</button>
				</div>

				<p class="auth-switch">
					Don't have an account?
					<button
						class="text-button"
						type="button"
						@click="openSignupFromLogin"
					>
						Sign up
					</button>
				</p>
				<p class="auth-help">
					Forgot your password? Email
					<a href="mailto:classes@jacobdanderson.net">
						classes@jacobdanderson.net </a
					>.
				</p>
			</form>
		</AccessibleDialog>

		<AccessibleDialog
			close-label="Close sign up dialog"
			description="Create a learner account to access assigned courses and class information."
			dialog-id="signup-dialog"
			:open="signupBlock"
			title="Sign up"
			@close="changeSignupView(false)"
		>
			<form class="auth-form signupForm" @submit.prevent="addSignup">
				<label for="name">Name</label>
				<input
					id="name"
					v-model="name"
					autocomplete="name"
					placeholder="Enter Name"
					required
					type="text"
				/>

				<label for="age">Age</label>
				<input
					id="age"
					v-model="age"
					inputmode="numeric"
					placeholder="Enter Age"
					required
					type="text"
				/>

				<label for="state">State</label>
				<input
					id="state"
					v-model="state"
					autocomplete="address-level1"
					placeholder="Enter State"
					required
					type="text"
				/>

				<label for="email">Email</label>
				<input
					id="email"
					v-model="email"
					autocomplete="email"
					placeholder="Enter Email"
					required
					type="email"
				/>

				<label for="psw2">Password</label>
				<input
					id="psw2"
					v-model="password"
					autocomplete="new-password"
					placeholder="Enter Password"
					required
					type="password"
				/>

				<label for="psw-repeat">Repeat Password</label>
				<input
					id="psw-repeat"
					v-model="passwordRepeat"
					autocomplete="new-password"
					placeholder="Repeat Password"
					required
					type="password"
				/>

				<p
					v-if="!passwordMatch"
					class="passwordMatchError"
					role="alert"
				>
					Passwords do not match.
				</p>
				<p v-if="error" class="error" role="alert">
					{{ error }}
				</p>

				<div class="auth-actions">
					<button class="button" type="submit">Create Account</button>
					<button
						class="button secondary"
						type="button"
						@click="changeSignupView(false)"
					>
						Cancel
					</button>
				</div>
			</form>
		</AccessibleDialog>
	</div>
</template>

<style scoped>
.auth-form {
	display: grid;
	gap: 0.8rem;
}

.auth-form label {
	display: grid;
	gap: 0.35rem;
	margin: 0;
	color: var(--color-ink, #10263a);
	font-weight: 800;
}

.auth-form input[type="email"],
.auth-form input[type="password"],
.auth-form input[type="text"] {
	width: 100%;
	box-sizing: border-box;
	padding: 0.85rem 0.95rem;
	border: 1px solid var(--color-border, rgba(148, 163, 184, 0.45));
	border-radius: 14px;
	background: var(--color-surface-strong, #fff);
	color: var(--color-ink, #10263a);
	font: inherit;
}

.remember {
	display: flex !important;
	grid-template-columns: none !important;
	flex-direction: row;
	align-items: center;
	gap: 0.55rem !important;
	font-weight: 600 !important;
}

.remember input {
	width: auto;
}

.auth-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 0.35rem;
}

.button {
	flex: 1 1 12rem;
	border: 1px solid #2563eb;
	border-radius: 999px;
	background: linear-gradient(135deg, #2563eb, #1d4ed8);
	color: #fff;
	padding: 0.85rem 1.1rem;
	cursor: pointer;
	font-weight: 800;
}

.button.secondary {
	border-color: var(--color-border, rgba(148, 163, 184, 0.45));
	background: var(--color-surface-soft, #f8fafc);
	color: var(--color-ink, #10263a);
}

.text-button {
	border: none;
	background: transparent;
	color: #1d4ed8;
	padding: 0;
	font: inherit;
	font-weight: 800;
	text-decoration: underline;
	cursor: pointer;
}

.auth-switch,
.auth-help,
.error,
.passwordMatchError {
	margin: 0;
	line-height: 1.55;
}

.auth-switch,
.auth-help {
	color: var(--color-ink-soft, #526779);
}

.auth-help a {
	color: #1d4ed8;
	font-weight: bold;
}

.error,
.passwordMatchError {
	color: #b91c1c;
	font-weight: 800;
}

.button:hover,
.text-button:hover {
	filter: brightness(0.96);
}

:global(html.dark) .text-button {
	color: #bfdbfe;
}

:global(html.dark) .text-button:hover {
	color: #dbeafe;
	filter: none;
}

@media (max-width: 520px) {
	.auth-actions {
		flex-direction: column;
	}

	.button {
		width: 100%;
	}
}
</style>
