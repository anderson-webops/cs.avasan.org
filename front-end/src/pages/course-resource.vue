<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import {
	isPreviewableCourseAsset,
	loadCourseAssetSection
} from "@/modules/courseAssetPreview";

defineOptions({ name: "CourseResourcePage" });

const route = useRoute();
const content = ref("");
const error = ref("");
const isLoading = ref(false);
const title = ref("Course Resource");
let requestSequence = 0;

const assetUrl = computed(() => {
	const value = route.query.asset;
	return typeof value === "string" ? value : "";
});
const label = computed(() => {
	const value = route.query.label;
	return typeof value === "string" && value.trim()
		? value.trim()
		: "Course resource";
});
const previewContent = computed(() => {
	const lines = content.value.split(/\r?\n/);
	if (lines[0]?.trim().startsWith("#")) {
		return lines.slice(1).join("\n").trim();
	}

	return content.value;
});

watch(
	[assetUrl, label],
	async ([url, resourceLabel]) => {
		const requestId = ++requestSequence;
		content.value = "";
		error.value = "";
		title.value = resourceLabel || "Course Resource";

		if (!url) {
			error.value = "No course resource was selected.";
			return;
		}

		if (!isPreviewableCourseAsset(url)) {
			error.value = "This course resource cannot be previewed here.";
			return;
		}

		isLoading.value = true;

		try {
			const section = await loadCourseAssetSection(url, resourceLabel);
			if (requestId !== requestSequence) return;

			content.value = section.content;
			title.value = section.title;
		} catch (caughtError) {
			if (requestId !== requestSequence) return;
			error.value =
				caughtError instanceof Error
					? caughtError.message
					: "Unable to load this course resource.";
		} finally {
			if (requestId === requestSequence) {
				isLoading.value = false;
			}
		}
	},
	{ immediate: true }
);
</script>

<template>
	<section class="page-shell page-shell--wide course-resource-page">
		<header class="course-resource-header">
			<h1 class="page-title">{{ title }}</h1>
			<RouterLink class="site-button site-button--secondary" to="/">
				Back to courses
			</RouterLink>
		</header>

		<section class="site-surface course-resource-card" aria-live="polite">
			<p v-if="isLoading" class="course-resource-status">
				Loading course resource...
			</p>
			<p v-else-if="error" class="course-resource-error" role="alert">
				{{ error }}
			</p>
			<LazyMarkdownContent v-else :content="previewContent" />
		</section>
	</section>
</template>

<style scoped>
.course-resource-page {
	gap: clamp(1.5rem, 3vw, 2.25rem);
	grid-template-columns: minmax(0, 1fr);
}

.course-resource-header {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: end;
	gap: 1rem;
	min-width: 0;
}

.course-resource-card {
	padding: clamp(1rem, 3vw, 2rem);
	min-width: 0;
	overflow-x: hidden;
}

.course-resource-card :deep(.item-content-markdown) {
	width: 100%;
	max-width: 100%;
	min-width: 0;
}

.course-resource-status,
.course-resource-error {
	margin: 0;
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.course-resource-error {
	color: var(--color-danger-text, #991b1b);
}

@media (max-width: 720px) {
	.course-resource-header {
		grid-template-columns: 1fr;
		align-items: start;
	}
}
</style>
