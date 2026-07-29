<script lang="ts" setup>
import { storeToRefs } from "pinia";
import AccountManagement from "@/components/AccountManagement.vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "AdminPage" });

const app = useAppStore();
const { currentAdmin } = storeToRefs(app);
</script>

<template>
	<section class="page-shell page-shell--narrow teacher-admin-page">
		<h1 class="page-title">Admin</h1>

		<section class="admin-panel site-surface">
			<AccountManagement v-if="!currentAdmin" />
			<AccountSecurity
				v-else
				:email="currentAdmin.email"
				:entity-id="currentAdmin._id"
			/>
		</section>
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
</style>
