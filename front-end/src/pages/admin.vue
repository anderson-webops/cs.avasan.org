<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import AccountManagement from "@/components/AccountManagement.vue";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "AdminPage" });

const app = useAppStore();
const { currentAdmin } = storeToRefs(app);

function openLogin() {
	app.setLoginBlock(true);
}

onMounted(() => {
	if (!currentAdmin.value) openLogin();
});
</script>

<template>
	<section class="page-shell page-shell--narrow teacher-admin-page">
		<header class="teacher-admin-header">
			<p class="page-eyebrow">Private teacher area</p>
			<h1 class="page-title">Teacher administration</h1>
			<p class="page-copy">
				This page is only for Julio, the sole teacher and administrator.
				Students can use every course and the Python IDE without an
				account.
			</p>
		</header>

		<AccountManagement v-if="!currentAdmin" />

		<section v-if="currentAdmin" class="admin-status site-surface">
			<h2>Signed in as {{ currentAdmin.name }}</h2>
			<p>
				Your private teacher account is ready. Public student access
				remains account-free.
			</p>
			<RouterLink class="site-button site-button--primary" to="/profile">
				Open teacher account
			</RouterLink>
		</section>

		<section v-else class="admin-status site-surface">
			<h2>Julio's private sign-in</h2>
			<p>
				The sign-in dialog opens automatically on this page. If it was
				closed, use the button below to reopen it.
			</p>
			<div class="site-action-row">
				<button
					class="site-button site-button--primary"
					type="button"
					@click="openLogin"
				>
					Open teacher sign-in
				</button>
				<RouterLink
					class="site-button site-button--secondary"
					to="/courses"
				>
					Return to courses
				</RouterLink>
			</div>
		</section>
	</section>
</template>

<style scoped>
.teacher-admin-page,
.teacher-admin-header,
.admin-status {
	display: grid;
	gap: 1.1rem;
}

.teacher-admin-header {
	padding-top: 1rem;
}

.admin-status {
	padding: clamp(1.5rem, 4vw, 2.4rem);
}

.admin-status h2 {
	font-size: clamp(1.5rem, 3vw, 2rem);
}

.admin-status p {
	color: var(--color-ink-soft);
	line-height: 1.7;
}
</style>
