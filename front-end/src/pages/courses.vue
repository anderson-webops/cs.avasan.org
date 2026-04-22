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
		return "Students, tutors, and admins only see the course sets attached to their account.";
	}

	if (hasAssignedCourseAccess.value) {
		return "Search your assigned courses, review module summaries, and open the linked project materials.";
	}

	return "Course access is granted by a tutor or administrator.";
});

function openLogin() {
	app.setLoginBlock(true);
}

function openSignup() {
	app.setSignupBlock(true);
}
</script>

<template>
	<section class="courses-page">
		<header class="courses-hero">
			<div class="courses-copy">
				<p class="courses-eyebrow">{{ heroEyebrow }}</p>
				<h1>{{ heroTitle }}</h1>
				<p>
					{{ heroCopy }}
				</p>
			</div>

			<div class="courses-actions">
				<button
					v-if="!isLoggedIn"
					class="courses-action courses-action--secondary"
					type="button"
					@click="openLogin"
				>
					Log in
				</button>
				<button
					v-if="!isLoggedIn"
					class="courses-action courses-action--primary"
					type="button"
					@click="openSignup"
				>
					Sign up
				</button>
				<RouterLink
					v-else-if="!hasAssignedCourseAccess"
					class="courses-action courses-action--secondary"
					to="/profile"
				>
					Go to Profile
				</RouterLink>
				<RouterLink
					class="courses-action courses-action--secondary"
					:class="{
						'courses-action--primary':
							isLoggedIn && !hasAssignedCourseAccess
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

		<section v-if="!isLoggedIn" class="courses-gate" role="status">
			<h2>Sign in to open your course library.</h2>
			<p>
				If you are new here, create an account first. Assigned courses
				will appear after enrollment.
			</p>
		</section>

		<section
			v-else-if="!hasAssignedCourseAccess"
			class="courses-gate"
			role="status"
		>
			<h2>No courses are assigned to this account yet.</h2>
			<p>
				Email
				<a href="mailto:classes@jacobdanderson.net">
					classes@jacobdanderson.net
				</a>
				if you think this account should already have course access.
			</p>
		</section>

		<CourseExplorer v-else />
	</section>
</template>

<style scoped>
.courses-page {
	width: min(1200px, calc(100% - 2rem));
	margin: 0 auto;
	padding: clamp(2rem, 4vw, 3.25rem) 0 4rem;
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
	border-radius: 28px;
	background:
		radial-gradient(
			circle at top left,
			rgba(59, 130, 246, 0.14),
			transparent 32%
		),
		linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.96),
			rgba(248, 250, 252, 0.92)
		);
	border: 1px solid rgba(148, 163, 184, 0.18);
	box-shadow: 0 24px 48px -40px rgba(15, 23, 42, 0.38);
}

.courses-copy {
	flex: 1 1 40rem;
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.courses-eyebrow {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.courses-copy h1 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.05;
	color: #0f172a;
}

.courses-copy p {
	margin: 0;
	max-width: 50rem;
	font-size: 1.02rem;
	line-height: 1.7;
	color: #475569;
}

.courses-actions {
	flex: 0 0 auto;
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.courses-gate {
	padding: clamp(1.5rem, 2.8vw, 2.2rem);
	border-radius: 28px;
	border: 1px solid rgba(148, 163, 184, 0.18);
	background:
		radial-gradient(
			circle at top right,
			rgba(37, 99, 235, 0.09),
			transparent 28%
		),
		linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.98),
			rgba(248, 250, 252, 0.93)
		);
	box-shadow: 0 24px 48px -40px rgba(15, 23, 42, 0.3);
}

.courses-gate h2 {
	margin: 0 0 0.75rem;
	font-size: clamp(1.35rem, 2vw, 1.75rem);
	color: #0f172a;
}

.courses-gate p {
	margin: 0;
	max-width: 52rem;
	line-height: 1.7;
	color: #475569;
}

.courses-gate a {
	color: #1d4ed8;
	font-weight: 700;
	text-decoration: none;
}

.courses-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.9rem 1.25rem;
	border-radius: 999px;
	font-weight: 700;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease;
}

.courses-action:hover {
	transform: translateY(-1px);
}

.courses-action--primary {
	color: #eff6ff;
	background: linear-gradient(140deg, #2563eb, #1d4ed8);
	box-shadow: 0 16px 28px rgba(37, 99, 235, 0.22);
}

.courses-action--secondary {
	color: #16324d;
	background: #ffffff;
	border: 1px solid #cbd5e1;
	box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

@media (max-width: 700px) {
	.courses-page {
		width: min(100%, calc(100% - 1.1rem));
		padding-top: 1.2rem;
	}

	.courses-actions,
	.courses-action {
		width: 100%;
	}
}
</style>
