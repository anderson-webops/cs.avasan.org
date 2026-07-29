<script lang="ts" setup>
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch
} from "vue";
import {
	fetchStudentSession,
	refreshStudentSessionActivity,
	signInStudent
} from "@/modules/studentAccounts";
import {
	broadcastStudentSessionChanged,
	broadcastTrustedStudentActivity,
	subscribeToStudentActivity,
	subscribeToStudentSessionChanged
} from "@/modules/studentSessionBroadcast";
import {
	isStudentSessionHandoffError,
	studentSessionHandoffErrorMessage
} from "@/modules/studentSessionHandoff";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const {
	currentAdmin,
	currentUser,
	studentProjectOwnerID,
	studentRequiresPasswordSetup
} = storeToRefs(app);
const { studentSessionRevalidating } = storeToRefs(app);

const studentInactivityMs = 30 * 60 * 1000;
const studentSetupTimeoutMs = 30 * 60 * 1000;
const studentHeartbeatThrottleMs = 5 * 60 * 1000;
const studentHeartbeatRetryMs = 60 * 1000;
const localActivityThrottleMs = 5_000;
const passwordSetupRequestStoragePrefix =
	"cs-avasan-student-password-setup-request";
const passwordSetupRequestIDPattern = /^[\w-]{32,128}$/;

const isOpen = ref(false);
const isSubmitting = ref(false);
const username = ref("");
const secret = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const status = ref("");
const passwordSetupRequestID = ref("");
const passwordSetupRequestStudentID = ref("");
const usernameInput = ref<HTMLInputElement | null>(null);
const newPasswordInput = ref<HTMLInputElement | null>(null);
let inactivityTimer: ReturnType<typeof window.setTimeout> | null = null;
let setupTimeout: ReturnType<typeof window.setTimeout> | null = null;
let lastActivityAt = Date.now();
let lastHeartbeatAt = 0;
let lastLocalActivityHandledAt = 0;
let unsubscribeFromStudentActivity: (() => void) | null = null;
let unsubscribeFromStudentSessionChanged: (() => void) | null = null;
let sessionChangeQueue = Promise.resolve();
let suspendedSetupStudentID: string | null = null;
let suspendedActivityStudentID: string | null = null;

const panelIsOpen = computed(
	() => isOpen.value || studentRequiresPasswordSetup.value
);
const isPasswordForm = computed(
	() => !!currentUser.value && studentRequiresPasswordSetup.value
);

function clearSecrets() {
	secret.value = "";
	newPassword.value = "";
	confirmPassword.value = "";
}

function passwordSetupRequestStorageKey(studentID: string) {
	return `${passwordSetupRequestStoragePrefix}:${studentID}`;
}

function loadPasswordSetupRequestID(studentID: string) {
	if (passwordSetupRequestStudentID.value === studentID) {
		return passwordSetupRequestID.value;
	}

	passwordSetupRequestStudentID.value = studentID;
	try {
		const storedRequestID =
			window.sessionStorage.getItem(
				passwordSetupRequestStorageKey(studentID)
			) ?? "";
		passwordSetupRequestID.value = passwordSetupRequestIDPattern.test(
			storedRequestID
		)
			? storedRequestID
			: "";
	} catch {
		passwordSetupRequestID.value = "";
	}
	return passwordSetupRequestID.value;
}

function createPasswordSetupRequestID(studentID: string) {
	const requestID = crypto.randomUUID();
	passwordSetupRequestStudentID.value = studentID;
	passwordSetupRequestID.value = requestID;
	try {
		window.sessionStorage.setItem(
			passwordSetupRequestStorageKey(studentID),
			requestID
		);
	} catch {
		// The in-memory request marker still protects retries in this tab.
	}
	return requestID;
}

function clearPasswordSetupRequestID(studentID?: string | null) {
	const targetStudentID =
		studentID ?? passwordSetupRequestStudentID.value ?? "";
	if (targetStudentID) {
		try {
			window.sessionStorage.removeItem(
				passwordSetupRequestStorageKey(targetStudentID)
			);
		} catch {
			// Clearing the in-memory marker is sufficient for this page.
		}
	}
	if (!studentID || passwordSetupRequestStudentID.value === studentID) {
		passwordSetupRequestID.value = "";
		passwordSetupRequestStudentID.value = "";
	}
}

async function finishPasswordSetup(
	session: Awaited<ReturnType<typeof fetchStudentSession>>,
	studentID: string,
	requestID: string
) {
	if (
		currentAdmin.value ||
		currentUser.value?._id !== studentID ||
		studentRequiresPasswordSetup.value ||
		session.student?._id !== studentID ||
		session.requiresPasswordSetup ||
		session.passwordSetupRequestID !== requestID
	) {
		return false;
	}
	broadcastStudentSessionChanged(studentID, "full");
	clearPasswordSetupRequestID(studentID);
	clearSecrets();
	isOpen.value = false;
	status.value = "Password saved.";
	return true;
}

async function openSignIn() {
	error.value = "";
	status.value = "";
	isOpen.value = true;
	await nextTick();
	usernameInput.value?.focus();
}

function closePanel() {
	if (studentRequiresPasswordSetup.value || isSubmitting.value) return;
	error.value = "";
	clearSecrets();
	isOpen.value = false;
}

function closeOnEscape() {
	closePanel();
}

async function acceptStudentSignIn(
	session: Awaited<ReturnType<typeof fetchStudentSession>>
) {
	if (!session.student) return false;
	app.setStudentSession(session);
	broadcastStudentSessionChanged(
		session.student._id,
		session.requiresPasswordSetup ? "setup" : "full"
	);
	username.value = "";
	secret.value = "";
	isOpen.value = session.requiresPasswordSetup;
	if (session.requiresPasswordSetup) {
		await nextTick();
		newPasswordInput.value?.focus();
	} else {
		status.value = `Signed in as ${session.student.username}.`;
	}
	return true;
}

async function login() {
	if (isSubmitting.value) return;
	const cleanUsername = username.value.trim();
	if (!cleanUsername || !secret.value) return;

	error.value = "";
	status.value = "";
	isSubmitting.value = true;
	try {
		const session = await signInStudent(cleanUsername, secret.value);
		await acceptStudentSignIn(session);
	} catch (caught: unknown) {
		const axiosError = caught as AxiosError;
		const responseStatus = axiosError.response?.status;
		if (
			!axiosError.response ||
			(typeof responseStatus === "number" && responseStatus >= 500)
		) {
			try {
				const recoveredSession = await fetchStudentSession();
				if (
					recoveredSession.student?.username.toLowerCase() ===
					cleanUsername.toLowerCase()
				) {
					await acceptStudentSignIn(recoveredSession);
					return;
				}
			} catch {
				// A failed probe leaves the anonymous sign-in surface closed to
				// any unconfirmed identity.
			}
		}
		error.value =
			"Couldn’t sign in. Check your username and password or access code.";
		secret.value = "";
	} finally {
		isSubmitting.value = false;
	}
}

async function savePassword() {
	if (isSubmitting.value || !newPassword.value) return;
	const setupStudentID = currentUser.value?._id;
	if (!setupStudentID) return;
	error.value = "";
	status.value = "";

	if (newPassword.value.length < 10) {
		error.value = "Password must be at least 10 characters.";
		return;
	}

	if (newPassword.value !== confirmPassword.value) {
		error.value = "The passwords do not match.";
		return;
	}

	isSubmitting.value = true;
	let requestID = loadPasswordSetupRequestID(setupStudentID);
	try {
		if (!requestID) {
			requestID = createPasswordSetupRequestID(setupStudentID);
		}

		const session = await app.completeStudentPassword(
			newPassword.value,
			requestID
		);
		if (!(await finishPasswordSetup(session, setupStudentID, requestID))) {
			throw new Error(
				"Password change could not be confirmed for this request."
			);
		}
	} catch (caught: unknown) {
		let axiosError = caught as AxiosError<{ message?: string }>;
		const responseStatus = axiosError.response?.status;
		const requestMayHaveSucceeded =
			!axiosError.response ||
			(typeof responseStatus === "number" && responseStatus >= 500);
		if (requestMayHaveSucceeded) {
			if (
				currentAdmin.value ||
				currentUser.value?._id !== setupStudentID ||
				!studentRequiresPasswordSetup.value
			) {
				return;
			}
			try {
				// Retry the exact request while the password is still available.
				// An idempotent replay succeeds only when both the request marker
				// and password match the committed attempt.
				const recoveredSession = await app.completeStudentPassword(
					newPassword.value,
					requestID
				);
				if (
					await finishPasswordSetup(
						recoveredSession,
						setupStudentID,
						requestID
					)
				) {
					return;
				}
			} catch (retryCaught: unknown) {
				axiosError = retryCaught as AxiosError<{ message?: string }>;
			}
		}
		error.value =
			axiosError.response?.data?.message ??
			"Couldn’t confirm that password. Try again before relying on it.";
	} finally {
		isSubmitting.value = false;
	}
}

function stopInactivityTimer() {
	if (!inactivityTimer) return;
	window.clearTimeout(inactivityTimer);
	inactivityTimer = null;
}

function stopSetupTimeout() {
	if (!setupTimeout) return;
	window.clearTimeout(setupTimeout);
	setupTimeout = null;
}

function scheduleInactivityLogout() {
	stopInactivityTimer();
	if (!studentProjectOwnerID.value) return;
	const remaining = Math.max(
		0,
		lastActivityAt + studentInactivityMs - Date.now()
	);
	inactivityTimer = window.setTimeout(() => {
		inactivityTimer = null;
		void logoutStudent("idle");
	}, remaining);
}

async function heartbeatStudentSession(at: number) {
	const ownerID = studentProjectOwnerID.value;
	if (!ownerID || at - lastHeartbeatAt < studentHeartbeatThrottleMs) return;
	lastHeartbeatAt = at;
	try {
		const session = await refreshStudentSessionActivity();
		if (session.student?._id !== ownerID || session.requiresPasswordSetup) {
			await app.acceptStudentSessionEndedFromAnotherTab();
			if (document.visibilityState !== "visible") {
				app.clearSession();
				return;
			}
			if (session.student) {
				app.setStudentSession(session);
				broadcastStudentSessionChanged(
					session.student._id,
					session.requiresPasswordSetup ? "setup" : "full"
				);
				status.value = "";
			} else {
				await app.bootstrapSession();
				broadcastStudentSessionChanged(
					null,
					app.currentAdmin ? "admin" : "none"
				);
				status.value = app.currentAdmin ? "" : "Signed out.";
			}
		}
	} catch {
		// A transport or server failure is not proof that the cookie session
		// ended. Keep the local identity and retry on later trusted activity.
		lastHeartbeatAt =
			at - studentHeartbeatThrottleMs + studentHeartbeatRetryMs;
	}
}

function recordStudentActivity(at: number, shareWithOtherTabs: boolean) {
	if (!studentProjectOwnerID.value || at < lastActivityAt) return;
	lastActivityAt = at;
	scheduleInactivityLogout();
	if (shareWithOtherTabs) {
		broadcastTrustedStudentActivity(at);
		void heartbeatStudentSession(at);
	}
}

function handleTrustedStudentActivity(event: Event) {
	if (!event.isTrusted) return;
	const at = Date.now();
	if (at - lastLocalActivityHandledAt < localActivityThrottleMs) return;
	lastLocalActivityHandledAt = at;
	recordStudentActivity(at, true);
}

async function logoutStudent(automatic: "idle" | "setup" | false = false) {
	if (isSubmitting.value) return;
	const signingOutStudentID = currentUser.value?._id ?? null;
	error.value = "";
	status.value = "";
	isSubmitting.value = true;
	try {
		await app.logoutStudent();
		clearPasswordSetupRequestID(signingOutStudentID);
		clearSecrets();
		isOpen.value = false;
		status.value =
			automatic === "idle"
				? "Signed out after 30 minutes without activity."
				: automatic === "setup"
					? "Access-code setup expired. Signed out."
					: "Signed out.";
	} catch (caught: unknown) {
		if (!app.currentUser) {
			clearSecrets();
			isOpen.value = true;
			error.value =
				"Couldn’t confirm sign-out. Your workspace is hidden. Reload before continuing.";
			return;
		}
		if (automatic === "setup") {
			// A failed DELETE is not proof that the server-side setup session
			// ended. Keep the matching local identity so the student can retry
			// instead of colliding with a live setup cookie on the next sign-in.
			error.value =
				"Access-code setup expired, but sign-out could not finish. Try again.";
			return;
		}
		error.value = isStudentSessionHandoffError(caught)
			? studentSessionHandoffErrorMessage
			: "Couldn’t sign out. Try again.";
		lastActivityAt = Date.now();
		scheduleInactivityLogout();
	} finally {
		isSubmitting.value = false;
	}
}

watch(
	[
		studentProjectOwnerID,
		studentSessionRevalidating,
		() => currentAdmin.value?._id ?? null
	],
	(
		[ownerID, isRevalidating, adminID],
		[previousOwnerID] = [null, false, null]
	) => {
		if (!ownerID) {
			stopInactivityTimer();
			if (isRevalidating && !adminID && previousOwnerID) {
				suspendedActivityStudentID = previousOwnerID;
				return;
			}
			if (!isRevalidating || adminID) {
				suspendedActivityStudentID = null;
				lastHeartbeatAt = 0;
			}
			return;
		}

		if (
			!isRevalidating &&
			!adminID &&
			suspendedActivityStudentID === ownerID
		) {
			suspendedActivityStudentID = null;
			scheduleInactivityLogout();
			return;
		}

		suspendedActivityStudentID = null;
		lastActivityAt = Date.now();
		lastHeartbeatAt = lastActivityAt;
		scheduleInactivityLogout();
	},
	{ immediate: true }
);

watch(
	[
		() => currentUser.value?._id ?? null,
		studentRequiresPasswordSetup,
		() => currentAdmin.value?._id ?? null,
		studentSessionRevalidating
	],
	(
		[studentID, requiresPasswordSetup, adminID, isRevalidating],
		[previousStudentID, previousRequiresPasswordSetup] = [
			null,
			false,
			null,
			false
		]
	) => {
		stopSetupTimeout();
		const priorSetupStudentID =
			(previousStudentID && previousRequiresPasswordSetup
				? previousStudentID
				: null) ?? suspendedSetupStudentID;
		const isRoutineSuspension =
			!!priorSetupStudentID && !studentID && !adminID && isRevalidating;
		if (isRoutineSuspension) {
			suspendedSetupStudentID = priorSetupStudentID;
			return;
		}
		if (
			priorSetupStudentID &&
			(studentID !== priorSetupStudentID ||
				!requiresPasswordSetup ||
				!!adminID)
		) {
			clearPasswordSetupRequestID(priorSetupStudentID);
			clearSecrets();
		}
		if (
			studentID === suspendedSetupStudentID &&
			requiresPasswordSetup &&
			!adminID
		) {
			suspendedSetupStudentID = null;
		} else if (!isRevalidating) {
			suspendedSetupStudentID = null;
		}
		if (!studentID) return;
		if (!requiresPasswordSetup) {
			clearPasswordSetupRequestID(studentID);
			return;
		}
		loadPasswordSetupRequestID(studentID);
		setupTimeout = window.setTimeout(() => {
			setupTimeout = null;
			void logoutStudent("setup");
		}, studentSetupTimeoutMs);
	},
	{ immediate: true }
);

onMounted(() => {
	unsubscribeFromStudentActivity = subscribeToStudentActivity(() => {
		recordStudentActivity(Date.now(), false);
	});
	unsubscribeFromStudentSessionChanged = subscribeToStudentSessionChanged(
		message => {
			sessionChangeQueue = sessionChangeQueue
				.catch(() => undefined)
				.then(async () => {
					const previousStudentID = currentUser.value?._id ?? null;
					const currentAuthLevel = currentUser.value
						? studentRequiresPasswordSetup.value
							? "setup"
							: "full"
						: app.currentAdmin
							? "admin"
							: "none";
					if (
						previousStudentID === message.studentID &&
						currentAuthLevel === message.authLevel
					) {
						return;
					}

					if (previousStudentID) {
						await app
							.acceptStudentSessionEndedFromAnotherTab()
							.catch(() => undefined);
					}

					if (message.authLevel === "none") {
						clearPasswordSetupRequestID(previousStudentID);
						app.clearSession();
					} else if (document.visibilityState !== "visible") {
						// A background tab stays identity-free until its normal
						// visible-page lifecycle performs a fresh exact check.
						app.clearSession();
					} else {
						await app.bootstrapSession();
					}
					clearSecrets();
					isOpen.value = false;
					status.value =
						message.authLevel === "none" ? "Signed out." : "";
				});
		}
	);
	window.addEventListener("pointerdown", handleTrustedStudentActivity, {
		passive: true
	});
	window.addEventListener("pointermove", handleTrustedStudentActivity, {
		passive: true
	});
	window.addEventListener("keydown", handleTrustedStudentActivity);
	window.addEventListener("touchstart", handleTrustedStudentActivity, {
		passive: true
	});
});

onBeforeUnmount(() => {
	stopInactivityTimer();
	stopSetupTimeout();
	unsubscribeFromStudentActivity?.();
	unsubscribeFromStudentSessionChanged?.();
	window.removeEventListener("pointerdown", handleTrustedStudentActivity);
	window.removeEventListener("pointermove", handleTrustedStudentActivity);
	window.removeEventListener("keydown", handleTrustedStudentActivity);
	window.removeEventListener("touchstart", handleTrustedStudentActivity);
});
</script>

<template>
	<div class="student-access">
		<div
			v-if="studentSessionRevalidating"
			class="student-access__closed"
			aria-live="polite"
		>
			<span class="site-chip">Checking student access…</span>
		</div>
		<div v-else-if="!currentUser" class="student-access__closed">
			<button
				class="site-button site-button--secondary student-access__trigger"
				:aria-expanded="panelIsOpen"
				aria-controls="student-access-panel"
				type="button"
				@click="panelIsOpen ? closePanel() : openSignIn()"
			>
				Student sign in
			</button>
		</div>

		<div v-else-if="!isPasswordForm" class="student-access__session">
			<span class="site-chip">{{ currentUser.username }}</span>
			<button
				class="site-button site-button--secondary student-access__action student-access__signout"
				:disabled="isSubmitting"
				type="button"
				@click="logoutStudent()"
			>
				Sign out
			</button>
		</div>

		<div
			v-if="panelIsOpen"
			id="student-access-panel"
			class="student-access__panel site-surface site-surface--strong"
			role="dialog"
			:aria-label="
				isPasswordForm ? 'Student password' : 'Student sign in'
			"
			@keydown.esc="closeOnEscape"
		>
			<form
				v-if="!isPasswordForm"
				autocomplete="off"
				class="student-access__form"
				@submit.prevent="login"
			>
				<div class="student-access__heading">
					<strong>Student sign in</strong>
					<button
						aria-label="Close student sign in"
						class="student-access__close"
						type="button"
						@click="closePanel"
					>
						Close
					</button>
				</div>

				<label for="student-username">Username</label>
				<input
					id="student-username"
					ref="usernameInput"
					v-model="username"
					autocomplete="off"
					autocapitalize="none"
					maxlength="24"
					required
					spellcheck="false"
					type="text"
				/>

				<label for="student-secret">Password or access code</label>
				<input
					id="student-secret"
					v-model="secret"
					autocomplete="off"
					maxlength="128"
					required
					type="password"
				/>

				<a class="student-access__privacy" href="/student-privacy">
					How student information is used
				</a>

				<p v-if="error" class="student-access__error" role="alert">
					{{ error }}
				</p>

				<button
					class="site-button site-button--primary student-access__submit"
					:disabled="isSubmitting"
					type="submit"
				>
					{{ isSubmitting ? "Signing in…" : "Sign in" }}
				</button>
			</form>

			<form
				v-else
				autocomplete="off"
				class="student-access__form"
				@submit.prevent="savePassword"
			>
				<div class="student-access__heading">
					<strong>Create your password</strong>
				</div>

				<label for="student-new-password">New password</label>
				<input
					id="student-new-password"
					ref="newPasswordInput"
					v-model="newPassword"
					autocomplete="off"
					maxlength="128"
					minlength="10"
					required
					type="password"
				/>
				<small class="student-access__help">
					Use at least 10 characters.
				</small>

				<label for="student-confirm-password">Confirm password</label>
				<input
					id="student-confirm-password"
					v-model="confirmPassword"
					autocomplete="off"
					maxlength="128"
					required
					type="password"
				/>

				<p v-if="error" class="student-access__error" role="alert">
					{{ error }}
				</p>

				<div class="student-access__form-actions">
					<button
						class="site-button site-button--primary student-access__submit"
						:disabled="isSubmitting"
						type="submit"
					>
						{{ isSubmitting ? "Saving…" : "Save password" }}
					</button>
					<button
						class="site-button site-button--secondary student-access__submit student-access__signout"
						:disabled="isSubmitting"
						type="button"
						@click="logoutStudent()"
					>
						Sign out
					</button>
				</div>
			</form>
		</div>

		<p
			v-if="error && currentUser && !isPasswordForm"
			class="student-access__error"
			role="alert"
		>
			{{ error }}
		</p>

		<p
			v-if="status"
			class="student-access__status sr-only"
			role="status"
			aria-live="polite"
		>
			{{ status }}
		</p>
	</div>
</template>

<style scoped>
.student-access {
	position: relative;
	display: flex;
	flex: 0 0 auto;
	justify-content: flex-end;
}

.student-access__closed,
.student-access__session,
.student-access__form-actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.55rem;
}

.student-access__trigger,
.student-access__action {
	min-height: 2.75rem;
	padding-inline: 0.9rem;
}

.student-access__signout {
	color: #9f1239;
}

.student-access__panel {
	position: absolute;
	top: calc(100% + 0.75rem);
	right: 0;
	z-index: 30;
	width: min(22rem, calc(100vw - 2rem));
	padding: 1rem;
}

.student-access__form {
	display: grid;
	gap: 0.65rem;
}

.student-access__heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.student-access__heading strong {
	color: var(--color-ink);
	font-size: 1rem;
}

.student-access__close {
	padding: 0.3rem;
	color: var(--color-ink-soft);
	font-size: 0.82rem;
	font-weight: 700;
	text-decoration: underline;
}

.student-access__form label {
	color: var(--color-ink);
	font-size: 0.85rem;
	font-weight: 800;
}

.student-access__help {
	color: var(--color-ink-soft);
	font-size: 0.8rem;
}

.student-access__privacy {
	width: fit-content;
	color: var(--color-link);
	font-size: 0.82rem;
	font-weight: 700;
}

.student-access__form input {
	width: 100%;
	min-height: 2.75rem;
	border: 1px solid var(--color-border-strong);
	border-radius: 12px;
	padding: 0.65rem 0.75rem;
	background: var(--color-surface-strong);
}

.student-access__submit {
	min-height: 2.75rem;
	margin-top: 0.2rem;
	padding: 0.65rem 0.85rem;
}

.student-access__error {
	padding: 0.65rem 0.75rem;
	border: 1px solid var(--color-error-border);
	border-radius: 10px;
	background: var(--color-error-surface);
	color: var(--color-error-text);
	font-size: 0.85rem;
	line-height: 1.4;
}

@media (max-width: 991px) {
	.student-access,
	.student-access__closed,
	.student-access__session {
		width: 100%;
		flex-direction: column;
		align-items: stretch;
	}

	.student-access__panel {
		position: static;
		width: 100%;
		margin-top: 0.3rem;
	}

	.student-access__trigger,
	.student-access__action {
		width: 100%;
	}
}
</style>
