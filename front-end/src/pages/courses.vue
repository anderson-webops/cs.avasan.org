<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent } from "vue";
import { warmSchedulerConnections } from "@/modules/scheduler";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "CoursesPage" });

const CourseExplorer = defineAsyncComponent(
	() => import("@/components/CourseExplorer.vue")
);

const app = useAppStore();
const { currentAdmin, currentTutor, currentUser, isLoggedIn } =
	storeToRefs(app);

const hasAssignedCourseAccess = computed(() => {
	if (currentAdmin.value) return true;
	if (currentTutor.value) {
		return (currentTutor.value.coursePermissions?.length ?? 0) > 0;
	}
	if (currentUser.value) {
		return (currentUser.value.courseAccess?.length ?? 0) > 0;
	}
	return false;
});

const heroEyebrow = computed(() => "Course library");

const heroTitle = computed(() => {
	if (!isLoggedIn.value) return "Log in to open your assigned courses.";
	if (hasAssignedCourseAccess.value)
		return "Open the courses assigned to you.";
	return "No courses are assigned to this account yet.";
});

const heroCopy = computed(() => {
	if (!isLoggedIn.value) {
		return "Only the courses assigned to your account appear here.";
	}

	if (hasAssignedCourseAccess.value) {
		return "Search your assigned courses and open module summaries and project links.";
	}

	return "Course access is usually added after enrollment or account setup.";
});

function openLogin() {
	app.setLoginBlock(true);
}

function openSignup() {
	app.setSignupBlock(true);
}
</script>

<template>
	<section class="page-shell page-shell--wide courses-page">
		<header class="courses-hero site-surface">
			<div class="courses-copy">
				<p class="page-eyebrow">{{ heroEyebrow }}</p>
				<h1 class="page-title courses-title">{{ heroTitle }}</h1>
				<p class="page-copy">
					{{ heroCopy }}
				</p>
			</div>

			<div class="site-action-row courses-actions">
				<button
					v-if="!isLoggedIn"
					class="site-button site-button--secondary"
					type="button"
					@click="openLogin"
				>
					Log in
				</button>
				<button
					v-if="!isLoggedIn"
					class="site-button site-button--primary"
					type="button"
					@click="openSignup"
				>
					Sign up
				</button>
				<RouterLink
					v-else-if="!hasAssignedCourseAccess"
					class="site-button site-button--secondary"
					to="/profile"
				>
					Go to Profile
				</RouterLink>
				<RouterLink
					class="site-button"
					:class="{
						'site-button--primary':
							isLoggedIn && !hasAssignedCourseAccess,
						'site-button--secondary':
							!isLoggedIn || hasAssignedCourseAccess
					}"
					to="/signup"
					@focus="warmSchedulerConnections"
					@mouseenter="warmSchedulerConnections"
					@touchstart.passive="warmSchedulerConnections"
				>
					Book a Class
				</RouterLink>
			</div>
		</header>

		<section
			v-if="!isLoggedIn"
			class="courses-gate site-surface site-surface--soft"
			role="status"
		>
			<h2>New here?</h2>
			<p>
				Create an account first, then assigned courses can be added
				after enrollment.
			</p>
		</section>

		<section
			v-else-if="!hasAssignedCourseAccess"
			class="courses-gate site-surface site-surface--soft"
			role="status"
		>
			<h2>No courses are assigned to this account yet.</h2>
			<p>
				Email
				<a class="text-link" href="mailto:classes@jacobdanderson.net">
					classes@jacobdanderson.net
				</a>
				if access should already be enabled.
			</p>
		</section>

		<CourseExplorer v-else />
	</section>
</template>

<style scoped>
.courses-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.courses-hero {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 1.5rem 2rem;
	padding: clamp(1.5rem, 2.7vw, 2.1rem);
}

.courses-copy {
	flex: 1 1 40rem;
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.courses-title {
	font-size: clamp(2.2rem, 4.4vw, 3.4rem);
}

.courses-actions {
	flex: 0 0 auto;
	justify-content: flex-start;
}

.courses-gate {
	padding: clamp(1.5rem, 2.8vw, 2.2rem);
	display: grid;
	gap: 0.85rem;
}

.courses-gate h2 {
	margin: 0 0 0.75rem;
	font-size: clamp(1.35rem, 2vw, 1.75rem);
}

.courses-gate p {
	margin: 0;
	max-width: 52rem;
	line-height: 1.7;
	color: var(--color-ink-soft);
}

@media (max-width: 1500px) {
	.courses-hero {
		align-items: stretch;
	}

	.courses-actions {
		width: 100%;
	}

	.courses-actions > * {
		flex: 1 1 12rem;
	}
}

@media (max-width: 700px) {
	.courses-page {
		padding-top: 0.5rem;
	}

	.courses-actions {
		width: 100%;
	}
}
</style>
