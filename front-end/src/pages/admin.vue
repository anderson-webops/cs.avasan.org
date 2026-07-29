<script lang="ts" setup>
import { storeToRefs } from "pinia";
import AccountManagement from "@/components/AccountManagement.vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import StudentManagement from "@/components/StudentManagement.vue";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "AdminPage" });

const app = useAppStore();
const { adminSessionRevalidating, currentAdmin } = storeToRefs(app);
</script>

<template>
	<section class="page-shell page-shell--wide teacher-admin-page">
		<h1 class="page-title">Admin</h1>

		<section
			v-if="adminSessionRevalidating"
			class="admin-panel admin-panel--login site-surface"
			aria-live="polite"
		>
			<p>Checking Admin access…</p>
		</section>

		<section
			v-else-if="!currentAdmin"
			class="admin-panel admin-panel--login site-surface"
		>
			<AccountManagement />
		</section>

		<div v-else class="admin-workspace">
			<section class="admin-panel site-surface">
				<AccountSecurity :entity-id="currentAdmin._id" />
			</section>
			<section class="admin-panel site-surface">
				<StudentManagement />
			</section>
		</div>
	</section>
</template>

<style scoped>
.teacher-admin-page {
	display: grid;
	gap: 1.1rem;
}

.teacher-admin-page > .page-title {
	padding-top: 1rem;
}

.admin-panel {
	padding: clamp(1.5rem, 4vw, 2.4rem);
}

.admin-panel--login {
	width: min(100%, var(--container-narrow));
}

.admin-workspace {
	display: grid;
	grid-template-columns: minmax(16rem, 22rem) minmax(0, 1fr);
	gap: 1rem;
	align-items: start;
}

@media (max-width: 1050px) {
	.admin-workspace {
		grid-template-columns: 1fr;
	}
}
</style>
