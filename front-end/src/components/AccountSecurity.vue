<script lang="ts" setup>
import type { AxiosError } from "axios";
import type { Admin } from "@/stores/app";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { api } from "@/api";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import { broadcastStudentSessionEnded } from "@/modules/studentSessionBroadcast";
import { useAppStore } from "@/stores/app";

const props = defineProps<{ entityId: string }>();
const editing = defineModel<boolean>("editing", { default: false });

const app = useAppStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const currentPasswordInput = ref<HTMLInputElement | null>(null);
const newPasswordInput = ref<HTMLInputElement | null>(null);
const confirmPasswordInput = ref<HTMLInputElement | null>(null);
const passwordStatus = ref("");
const passwordError = ref("");
const isSubmitting = ref(false);
const adminAuthRequestTimeoutMs = 30_000;
const idPrefix = computed(
	() => `account-security-admin-${props.entityId.replace(/[^\w-]/g, "-")}`
);

function clearPasswordInputs() {
	currentPassword.value = "";
	newPassword.value = "";
	confirmPassword.value = "";
	if (currentPasswordInput.value) currentPasswordInput.value.value = "";
	if (newPasswordInput.value) newPasswordInput.value.value = "";
	if (confirmPasswordInput.value) confirmPasswordInput.value.value = "";
}

watch(editing, () => {
	clearPasswordInputs();
	passwordError.value = "";
});

function submitPasswordChange() {
	const submittedCurrentPassword = currentPassword.value;
	const submittedNewPassword = newPassword.value;
	clearPasswordInputs();
	return api.post<{
		currentAdmin: Admin;
		message: string;
	}>(
		`/accounts/changePassword/${props.entityId}`,
		{
			currentPassword: submittedCurrentPassword,
			newPassword: submittedNewPassword
		},
		{ timeout: adminAuthRequestTimeoutMs }
	);
}

function passwordChangeConfirmed(
	previousTimestamp: string | null | undefined,
	currentTimestamp: string | null | undefined
) {
	const currentTime = Date.parse(currentTimestamp ?? "");
	if (!Number.isFinite(currentTime)) return false;
	if (!previousTimestamp) return true;
	const previousTime = Date.parse(previousTimestamp);
	return Number.isFinite(previousTime) && currentTime > previousTime;
}

async function updatePassword() {
	if (isSubmitting.value) return;
	passwordStatus.value = "";
	passwordError.value = "";
	if (!newPassword.value) {
		passwordError.value = "New password is required.";
		clearPasswordInputs();
		return;
	}
	if (newPassword.value !== confirmPassword.value) {
		passwordError.value = "New passwords do not match.";
		clearPasswordInputs();
		return;
	}

	const previousPasswordChangedAt =
		app.currentAdmin?.passwordChangedAt ?? null;
	isSubmitting.value = true;
	try {
		const { data } = await submitPasswordChange();
		if (data.currentAdmin?._id !== props.entityId) {
			clearPasswordInputs();
			app.clearSession();
			broadcastStudentSessionEnded();
			return;
		}
		app.setCurrentAdmin(data.currentAdmin);
		passwordStatus.value = "Password updated successfully.";
		editing.value = false;
		clearPasswordInputs();
		broadcastStudentSessionEnded();
	} catch (caught: unknown) {
		const axiosError = caught as AxiosError<{ message?: string }>;
		const responseStatus = axiosError.response?.status;
		if (
			typeof responseStatus === "number" &&
			responseStatus >= 400 &&
			responseStatus < 500
		) {
			if (clearAdminSessionOnAuthorizationError(caught, app)) {
				clearPasswordInputs();
				broadcastStudentSessionEnded();
				return;
			}
			passwordError.value =
				axiosError.response?.data?.message ??
				(caught instanceof Error
					? caught.message
					: "Unable to update password.");
			return;
		}

		try {
			const { data } = await api.get<{ currentAdmin: Admin }>(
				"/admins/loggedin"
			);
			if (data.currentAdmin?._id !== props.entityId) {
				throw new Error("Teacher session changed.");
			}
			app.setCurrentAdmin(data.currentAdmin);
			clearPasswordInputs();
			if (
				passwordChangeConfirmed(
					previousPasswordChangedAt,
					data.currentAdmin.passwordChangedAt
				)
			) {
				passwordStatus.value = "Password updated successfully.";
				editing.value = false;
				broadcastStudentSessionEnded();
			} else {
				passwordError.value =
					"Password change could not be confirmed. Try again before relying on the new password.";
			}
		} catch {
			clearPasswordInputs();
			app.clearSession();
			broadcastStudentSessionEnded();
		}
	} finally {
		isSubmitting.value = false;
		clearPasswordInputs();
	}
}

watch(
	[() => props.entityId, () => app.currentAdmin?._id ?? null],
	([entityID, adminID], [previousEntityID, previousAdminID]) => {
		if (entityID !== previousEntityID || adminID !== previousAdminID) {
			clearPasswordInputs();
			editing.value = false;
		}
	}
);

onBeforeUnmount(clearPasswordInputs);
</script>

<template>
	<section class="security-card" :aria-labelledby="`${idPrefix}-title`">
		<header class="security-heading">
			<h2 :id="`${idPrefix}-title`">Profile</h2>
			<button
				type="button"
				class="site-button site-button--secondary"
				:disabled="isSubmitting"
				@click="editing = !editing"
			>
				{{ editing ? "Cancel" : "Edit" }}
			</button>
		</header>
		<dl v-if="!editing" class="security-values">
			<template v-if="app.currentAdmin?._id === entityId">
				<div>
					<dt>Name</dt>
					<dd>{{ app.currentAdmin.name }}</dd>
				</div>
				<div>
					<dt>Email</dt>
					<dd>{{ app.currentAdmin.email }}</dd>
				</div>
			</template>
			<div>
				<dt>Password</dt>
				<dd aria-label="Password is set">••••••••</dd>
			</div>
		</dl>

		<form
			v-if="editing"
			:aria-busy="isSubmitting ? 'true' : 'false'"
			class="security-section"
			@submit.prevent="updatePassword"
		>
			<div class="field">
				<label :for="`${idPrefix}-current-password`"
					>Current password</label
				>
				<input
					:id="`${idPrefix}-current-password`"
					ref="currentPasswordInput"
					v-model="currentPassword"
					autocomplete="current-password"
					:disabled="isSubmitting"
					name="current-password"
					type="password"
				/>
			</div>
			<div class="field">
				<label :for="`${idPrefix}-new-password`">New password</label>
				<input
					:id="`${idPrefix}-new-password`"
					ref="newPasswordInput"
					v-model="newPassword"
					autocomplete="new-password"
					:disabled="isSubmitting"
					name="new-password"
					type="password"
				/>
			</div>
			<div class="field">
				<label :for="`${idPrefix}-confirm-password`"
					>Confirm password</label
				>
				<input
					:id="`${idPrefix}-confirm-password`"
					ref="confirmPasswordInput"
					v-model="confirmPassword"
					autocomplete="new-password"
					:disabled="isSubmitting"
					name="confirm-password"
					type="password"
				/>
			</div>
			<button
				class="btn-primary btn"
				:disabled="isSubmitting"
				type="submit"
			>
				{{ isSubmitting ? "Updating…" : "Update password" }}
			</button>
			<p v-if="passwordError" class="error" role="alert">
				{{ passwordError }}
			</p>
		</form>
		<p
			v-if="passwordStatus"
			class="status"
			role="status"
			aria-live="polite"
		>
			{{ passwordStatus }}
		</p>
	</section>
</template>

<style scoped>
.security-card {
	display: grid;
	gap: 1.5rem;
	text-align: left;
}

.security-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}
.security-heading h2 {
	margin: 0;
}
.security-values {
	margin: 0;
}
.security-values > div {
	display: grid;
	grid-template-columns: 6rem minmax(0, 1fr);
	gap: 0.75rem;
	padding-block: 0.4rem;
}
.security-values dd {
	margin: 0;
	overflow-wrap: anywhere;
}

.security-section {
	display: grid;
	gap: 0.75rem;
}

.security-section + .security-section {
	border-top: 1px solid rgba(15, 23, 42, 0.08);
	padding-top: 1.25rem;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	margin-bottom: 0.75rem;
}

.field input {
	border: 1px solid rgba(15, 23, 42, 0.18);
	border-radius: 8px;
	padding: 0.5rem 0.75rem;
}

.status {
	color: #15803d;
	margin-top: 0.35rem;
}

.error {
	color: #b91c1c;
	margin-top: 0.35rem;
}
</style>
