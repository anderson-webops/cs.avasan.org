<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "ProfilePage" });

const app = useAppStore();
const { currentAdmin } = storeToRefs(app);

function openLogin() {
	app.setLoginBlock(true);
}
</script>

<template>
	<section class="page-shell page-shell--narrow teacher-account-page">
		<header class="teacher-account-header">
			<p class="page-eyebrow">Private teacher area</p>
			<h1 class="page-title">
				{{
					currentAdmin
						? `${currentAdmin.name}'s account`
						: "Teacher account"
				}}
			</h1>
			<p class="page-copy">
				This account belongs to Julio and is used only to maintain the
				course library. Student learning remains public and
				account-free.
			</p>
		</header>

		<AdminProfile v-if="currentAdmin" />

		<section v-else class="account-empty site-surface">
			<h2>Julio is not logged in.</h2>
			<p>
				If you are a student, you are already in the right place—open
				the public course library or Python IDE. No account is needed.
			</p>
			<div class="site-action-row">
				<button
					class="site-button site-button--primary"
					type="button"
					@click="openLogin"
				>
					Teacher log in
				</button>
				<RouterLink
					class="site-button site-button--secondary"
					to="/courses"
				>
					Open courses
				</RouterLink>
			</div>
		</section>
	</section>
</template>

<style scoped>
.teacher-account-page,
.teacher-account-header,
.account-empty {
	display: grid;
	gap: 1.1rem;
}

.teacher-account-header {
	padding-top: 1rem;
}

.account-empty {
	padding: clamp(1.5rem, 4vw, 2.4rem);
}

.account-empty h2 {
	font-size: clamp(1.5rem, 3vw, 2rem);
}

.account-empty p {
	color: var(--color-ink-soft);
	line-height: 1.7;
}
</style>
