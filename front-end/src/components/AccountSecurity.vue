<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const props = defineProps<{ entityId: string; email: string }>();

const app = useAppStore();
const email = ref(props.email);
const emailStatus = ref("");
const emailError = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordStatus = ref("");
const passwordError = ref("");
const idPrefix = computed(
	() => `account-security-admin-${props.entityId.replace(/[^\w-]/g, "-")}`
);

watch(
	() => props.email,
	value => {
		email.value = value;
	}
);

async function updateEmail() {
	emailStatus.value = "";
	emailError.value = "";
	if (!email.value) {
		emailError.value = "Email is required.";
		return;
	}

	try {
		await api.post(`/accounts/changeEmail/${props.entityId}`, {
			email: email.value
		});
		emailStatus.value = "Email updated successfully.";
		app.refreshCurrentAdmin();
	} catch (err: any) {
		emailError.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to update email.";
	}
}

async function updatePassword() {
	passwordStatus.value = "";
	passwordError.value = "";
	if (!newPassword.value) {
		passwordError.value = "New password is required.";
		return;
	}
	if (newPassword.value !== confirmPassword.value) {
		passwordError.value = "New passwords do not match.";
		return;
	}

	try {
		await api.post(`/accounts/changePassword/${props.entityId}`, {
			currentPassword: currentPassword.value,
			newPassword: newPassword.value
		});
		passwordStatus.value = "Password updated successfully.";
		currentPassword.value = newPassword.value = confirmPassword.value = "";
	} catch (err: any) {
		passwordError.value =
			err.response?.data?.message ??
			err.message ??
			"Unable to update password.";
	}
}
</script>

<template>
	<section class="security-card" :aria-labelledby="`${idPrefix}-title`">
		<h2 :id="`${idPrefix}-title`">Account settings</h2>

		<div class="security-section">
			<h3>Email</h3>
			<div class="field">
				<label :for="`${idPrefix}-email`">Email</label>
				<input
					:id="`${idPrefix}-email`"
					v-model="email"
					name="account-email"
					type="email"
				/>
			</div>
			<button
				class="btn-secondary btn"
				type="button"
				@click="updateEmail"
			>
				Update email
			</button>
			<p
				v-if="emailStatus"
				class="status"
				role="status"
				aria-live="polite"
			>
				{{ emailStatus }}
			</p>
			<p v-if="emailError" class="error" role="alert">
				{{ emailError }}
			</p>
		</div>

		<div class="security-section">
			<h3>Password</h3>
			<div class="field">
				<label :for="`${idPrefix}-current-password`"
					>Current password</label
				>
				<input
					:id="`${idPrefix}-current-password`"
					v-model="currentPassword"
					autocomplete="current-password"
					name="current-password"
					type="password"
				/>
			</div>
			<div class="field">
				<label :for="`${idPrefix}-new-password`">New password</label>
				<input
					:id="`${idPrefix}-new-password`"
					v-model="newPassword"
					autocomplete="new-password"
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
					v-model="confirmPassword"
					autocomplete="new-password"
					name="confirm-password"
					type="password"
				/>
			</div>
			<button
				class="btn-primary btn"
				type="button"
				@click="updatePassword"
			>
				Update password
			</button>
			<p
				v-if="passwordStatus"
				class="status"
				role="status"
				aria-live="polite"
			>
				{{ passwordStatus }}
			</p>
			<p v-if="passwordError" class="error" role="alert">
				{{ passwordError }}
			</p>
		</div>
	</section>
</template>

<style scoped>
.security-card {
	display: grid;
	gap: 1.5rem;
	text-align: left;
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
