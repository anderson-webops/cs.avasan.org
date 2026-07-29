<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

defineOptions({ name: "CoursesPage" });

const CourseExplorer = defineAsyncComponent(
	() => import("@/components/CourseExplorer.vue")
);
</script>

<template>
	<section class="page-shell page-shell--wide courses-page">
		<header class="courses-hero site-surface">
			<div class="courses-copy">
				<p class="page-eyebrow">Course library</p>
				<h1 class="page-title courses-title">
					Computer Science Courses
				</h1>
				<p class="page-copy">
					Explore Scratch Levels 1 and 2, Python Levels 1 and 2, and
					PyGames. Every course is available without a student
					account.
				</p>
			</div>
		</header>

		<CourseExplorer public-catalog />
	</section>
</template>

<style scoped>
.courses-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.courses-hero {
	padding: clamp(1.5rem, 2.7vw, 2.1rem);
}

.courses-copy {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	max-width: 48rem;
}

.courses-title {
	font-size: clamp(2.2rem, 4.4vw, 3.4rem);
}

@media (max-width: 700px) {
	.courses-page {
		padding-top: 0.5rem;
	}
}
</style>
