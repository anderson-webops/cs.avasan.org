<script lang="ts" setup>
import { defineAsyncComponent } from "vue";
import { warmSchedulerConnections } from "@/modules/scheduler";

defineOptions({ name: "CoursesPage" });

const CourseExplorer = defineAsyncComponent(
	() => import("@/components/CourseExplorer.vue")
);
</script>

<template>
	<section class="courses-page">
		<header class="courses-hero">
			<div class="courses-copy">
				<p class="courses-eyebrow">Course library</p>
				<h1>Browse the full course catalog.</h1>
				<p>
					Explore the syllabus for each track, review the lesson arc,
					and open the linked project repositories before signing up.
					Once you're enrolled, your assigned courses will also appear
					in your profile workspace.
				</p>
			</div>

			<div class="courses-actions">
				<RouterLink
					class="courses-action courses-action--primary"
					to="/signup"
					@focus="warmSchedulerConnections"
					@mouseenter="warmSchedulerConnections"
					@touchstart.passive="warmSchedulerConnections"
				>
					Book a Class
				</RouterLink>
				<RouterLink
					class="courses-action courses-action--secondary"
					to="/payment"
				>
					View Tuition
				</RouterLink>
			</div>
		</header>

		<CourseExplorer public-catalog />
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
