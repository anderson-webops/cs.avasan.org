<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AccountManagement from "@/components/AccountManagement.vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ClassroomAnalytics from "@/components/ClassroomAnalytics.vue";
import PondPaddlersAdmin from "@/components/PondPaddlersAdmin.vue";
import StudentManagement from "@/components/StudentManagement.vue";
import {
	studentAccountsAreEnabled,
	studentRecordMaintenanceIsEnabled
} from "@/modules/classroomFeatures";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "AdminPage" });

const app = useAppStore();
const route = useRoute();
const { adminSessionRevalidating, currentAdmin } = storeToRefs(app);
const analyticsPanel = ref<HTMLElement | null>(null);
const studentAccountsEnabled = studentAccountsAreEnabled();
const studentRecordManagementEnabled =
	studentAccountsEnabled || studentRecordMaintenanceIsEnabled();

async function focusRequestedSection() {
	if (
		route.query.section !== "analytics" ||
		!currentAdmin.value ||
		typeof window === "undefined"
	) {
		return;
	}
	await nextTick();
	analyticsPanel.value?.querySelector<HTMLElement>("h2")?.focus();
	analyticsPanel.value?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
}

onMounted(focusRequestedSection);
watch([() => route.query.section, currentAdmin], focusRequestedSection);
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

		<div v-else class="admin-sections">
			<section id="pond-paddlers" class="admin-panel site-surface">
				<PondPaddlersAdmin />
			</section>
			<section ref="analyticsPanel" class="admin-panel site-surface">
				<ClassroomAnalytics />
			</section>
			<div class="admin-workspace">
				<section class="admin-panel site-surface">
					<AccountSecurity :entity-id="currentAdmin._id" />
				</section>
				<section
					v-if="studentRecordManagementEnabled"
					class="admin-panel site-surface"
				>
					<StudentManagement
						:maintenance-only="!studentAccountsEnabled"
					/>
				</section>
			</div>
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

.admin-sections,
.admin-workspace {
	display: grid;
	gap: 1rem;
}

.admin-workspace {
	grid-template-columns: minmax(16rem, 22rem) minmax(0, 1fr);
	align-items: start;
}

@media (max-width: 1050px) {
	.admin-workspace {
		grid-template-columns: 1fr;
	}
}
</style>
