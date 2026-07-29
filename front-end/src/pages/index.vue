<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

defineOptions({ name: "HomePage" });

const siteUrl = import.meta.env.VITE_SITE_URL || "https://cs.avasan.org";
const CourseExplorer = defineAsyncComponent(
	() => import("@/components/CourseExplorer.vue")
);

useHead({
	link: [{ href: `${siteUrl}/`, rel: "canonical" }],
	script: [
		{
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				itemListElement: [
					"Scratch Level 1",
					"Scratch Level 2",
					"Python Level 1",
					"Python Level 2",
					"PyGames"
				].map((name, index) => ({
					"@type": "Course",
					name,
					position: index + 1,
					provider: {
						"@type": "Person",
						name: "Julio",
						jobTitle: "Grade-school teacher"
					}
				}))
			}),
			key: "classes-with-julio-courses",
			type: "application/ld+json"
		}
	]
});
</script>

<template>
	<section class="page-shell page-shell--wide courses-page">
		<header class="courses-header">
			<h1 class="page-title">Courses</h1>
		</header>

		<CourseExplorer public-catalog />
	</section>
</template>

<style scoped>
.courses-page,
.courses-header {
	display: grid;
	gap: 1rem;
}
</style>
