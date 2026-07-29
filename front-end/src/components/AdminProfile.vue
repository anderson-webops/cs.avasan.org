<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentAdmin } = storeToRefs(app);
const name = ref("");
const editingName = ref(false);
const status = ref("");
const error = ref("");

watch(
	currentAdmin,
	value => {
		name.value = value?.name ?? "Julio";
	},
	{ immediate: true }
);

async function saveName() {
	if (!currentAdmin.value || !name.value.trim()) return;
	status.value = "";
	error.value = "";

	try {
		await api.put(`/admins/${currentAdmin.value._id}`, {
			name: name.value.trim()
		});
		await app.refreshCurrentAdmin();
		editingName.value = false;
		status.value = "Name updated.";
	} catch (caught: any) {
		error.value =
			caught?.response?.data?.message ??
			caught?.message ??
			"Unable to update the name.";
	}
}
</script>

<template>
	<section v-if="currentAdmin" class="teacher-profile site-surface">
		<div class="teacher-profile__heading">
			<div>
				<p class="page-eyebrow">Teacher profile</p>
				<h2>Julio's private settings</h2>
			</div>
			<span class="teacher-profile__badge">Sole account</span>
		</div>

		<div class="teacher-profile__identity">
			<div class="identity-mark" aria-hidden="true">J</div>
			<div class="identity-fields">
				<label v-if="editingName" for="teacher-name"
					>Display name</label
				>
				<input
					v-if="editingName"
					id="teacher-name"
					v-model="name"
					autocomplete="name"
					type="text"
				/>
				<template v-else>
					<span>Display name</span>
					<strong>{{ currentAdmin.name }}</strong>
				</template>
				<p>{{ currentAdmin.email }}</p>
			</div>
		</div>

		<div class="teacher-profile__actions">
			<button
				v-if="!editingName"
				class="site-button site-button--secondary"
				type="button"
				@click="editingName = true"
			>
				Edit display name
			</button>
			<template v-else>
				<button
					class="site-button site-button--primary"
					type="button"
					@click="saveName"
				>
					Save name
				</button>
				<button
					class="site-button site-button--secondary"
					type="button"
					@click="editingName = false"
				>
					Cancel
				</button>
			</template>
		</div>

		<p v-if="status" class="status" role="status">{{ status }}</p>
		<p v-if="error" class="error" role="alert">{{ error }}</p>

		<AccountSecurity
			:email="currentAdmin.email"
			:entity-id="currentAdmin._id"
			role="admin"
		/>
	</section>
</template>

<style scoped>
.teacher-profile {
	display: grid;
	gap: 1.4rem;
	padding: clamp(1.5rem, 4vw, 2.4rem);
}

.teacher-profile__heading {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 1.2rem;
	border-bottom: 1px solid var(--color-border);
}

.teacher-profile__heading > div {
	display: grid;
	gap: 0.45rem;
}

.teacher-profile__heading h2 {
	font-size: clamp(1.45rem, 3vw, 2rem);
}

.teacher-profile__badge {
	padding: 0.45rem 0.7rem;
	border-radius: var(--radius-pill);
	background: rgba(15, 118, 110, 0.1);
	color: #0f766e;
	font-size: 0.76rem;
	font-weight: 900;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

html.dark .teacher-profile__badge {
	background: rgba(45, 212, 191, 0.18) !important;
	color: #ccfbf1 !important;
}

.teacher-profile__identity {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.1rem;
	border: 1px solid var(--color-border);
	border-radius: 18px;
	background: var(--color-surface-soft);
}

.identity-mark {
	display: grid;
	place-items: center;
	flex: 0 0 3.4rem;
	width: 3.4rem;
	height: 3.4rem;
	border-radius: 17px;
	background: linear-gradient(145deg, #0f766e, #2563eb);
	color: white;
	font-family: var(--font-display);
	font-size: 1.7rem;
	font-weight: 800;
}

.identity-fields {
	display: grid;
	gap: 0.3rem;
	flex: 1 1 auto;
	min-width: 0;
}

.identity-fields > span,
.identity-fields label {
	color: var(--color-accent);
	font-size: 0.76rem;
	font-weight: 900;
	letter-spacing: 0.09em;
	text-transform: uppercase;
}

.identity-fields strong {
	font-size: 1.15rem;
}

.identity-fields p {
	color: var(--color-ink-soft);
	overflow-wrap: anywhere;
}

.identity-fields input {
	width: 100%;
	border: 1px solid var(--color-border-strong);
	border-radius: 12px;
	padding: 0.7rem 0.8rem;
	background: var(--color-surface-strong);
}

.teacher-profile__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
}

.status,
.error {
	padding: 0.75rem 0.9rem;
	border: 1px solid;
	border-radius: 12px;
}

.status {
	border-color: var(--color-success-border);
	background: var(--color-success-surface);
	color: var(--color-success-text);
}

.error {
	border-color: var(--color-error-border);
	background: var(--color-error-surface);
	color: var(--color-error-text);
}
</style>
