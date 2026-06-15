<script lang="ts" setup>
import type { CourseAssetResource } from "@/modules/courseAssetPreview";
import { computed, ref, watch } from "vue";
import {
	courseAssetPreviewActionLabel,
	courseAssetViewerUrl,
	loadCourseAssetSection,
	previewableCourseAssetResources
} from "@/modules/courseAssetPreview";
import LazyMarkdownContent from "./LazyMarkdownContent.vue";

const props = defineProps<{
	resources: CourseAssetResource[];
}>();

const resourcesForPreview = computed(() =>
	previewableCourseAssetResources(props.resources)
);
const selectedResourceUrl = ref("");
const content = ref("");
const error = ref("");
const title = ref("");
const isOpen = ref(false);
const isLoading = ref(false);
let requestSequence = 0;

const selectedResource = computed(
	() =>
		resourcesForPreview.value.find(
			resource => resource.url === selectedResourceUrl.value
		) ??
		resourcesForPreview.value[0] ??
		null
);

const toggleLabel = computed(() => {
	if (resourcesForPreview.value.length !== 1) return "View course resources";
	const resource = resourcesForPreview.value[0];
	return resource
		? courseAssetPreviewActionLabel(resource)
		: "View course resource";
});

const previewContent = computed(() => {
	const lines = content.value.split(/\r?\n/);
	if (lines[0]?.trim().startsWith("#")) {
		return lines.slice(1).join("\n").trim();
	}

	return content.value;
});
const selectedResourceViewerUrl = computed(() =>
	selectedResource.value
		? courseAssetViewerUrl(
				selectedResource.value.url,
				selectedResource.value.label
			)
		: ""
);

watch(
	resourcesForPreview,
	resources => {
		selectedResourceUrl.value = resources[0]?.url ?? "";
		content.value = "";
		error.value = "";
		title.value = "";
		isOpen.value = false;
	},
	{ immediate: true }
);

async function togglePreview() {
	isOpen.value = !isOpen.value;
	if (!isOpen.value || content.value) return;

	await loadSelectedResource();
}

async function loadSelectedResource() {
	const resource = selectedResource.value;
	if (!resource) return;

	const requestId = ++requestSequence;
	isLoading.value = true;
	error.value = "";
	content.value = "";
	title.value = "";

	try {
		const section = await loadCourseAssetSection(
			resource.url,
			resource.label
		);
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
}

async function handleResourceChange() {
	await loadSelectedResource();
}
</script>

<template>
	<section v-if="resourcesForPreview.length > 0" class="course-asset-preview">
		<button
			class="course-asset-preview-toggle"
			type="button"
			:aria-expanded="isOpen"
			@click="togglePreview"
		>
			{{ isOpen ? "Hide course resource" : toggleLabel }}
		</button>

		<div v-if="isOpen" class="course-asset-preview-panel">
			<div class="course-asset-preview-toolbar">
				<label
					v-if="resourcesForPreview.length > 1"
					class="course-asset-preview-control"
				>
					<span>Resource</span>
					<select
						v-model="selectedResourceUrl"
						@change="handleResourceChange"
					>
						<option
							v-for="resource in resourcesForPreview"
							:key="resource.url"
							:value="resource.url"
						>
							{{ resource.label }}
						</option>
					</select>
				</label>

				<a
					v-if="selectedResource"
					class="course-asset-preview-open-link"
					:href="selectedResourceViewerUrl"
					rel="noreferrer"
					target="_blank"
				>
					Open full resource
					<span class="sr-only">(opens in a new tab)</span>
				</a>
			</div>

			<p v-if="isLoading" class="course-asset-preview-status">
				Loading course resource...
			</p>
			<p
				v-else-if="error"
				class="course-asset-preview-error"
				role="alert"
			>
				{{ error }}
			</p>
			<div v-else-if="content" class="course-asset-preview-content">
				<p class="course-asset-preview-eyebrow">
					Course resource section
				</p>
				<p class="course-asset-preview-title">{{ title }}</p>
				<LazyMarkdownContent :content="previewContent" />
			</div>
		</div>
	</section>
</template>

<style scoped>
.course-asset-preview {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	max-width: min(100%, 58rem);
}

.course-asset-preview-toggle,
.course-asset-preview-open-link {
	width: fit-content;
	border: 1px solid
		var(--course-asset-preview-border, rgba(13, 148, 136, 0.24));
	border-radius: 999px;
	background: var(
		--course-asset-preview-button-bg,
		rgba(240, 253, 250, 0.94)
	);
	color: var(--course-asset-preview-button-text, #115e59);
	font-weight: 800;
	line-height: 1.2;
	text-decoration: none;
}

.course-asset-preview-toggle {
	padding: 0.62rem 0.9rem;
	cursor: pointer;
}

.course-asset-preview-open-link {
	display: inline-flex;
	align-items: center;
	padding: 0.58rem 0.85rem;
}

.course-asset-preview-toggle:hover,
.course-asset-preview-open-link:hover {
	border-color: var(
		--course-asset-preview-border-hover,
		rgba(15, 118, 110, 0.38)
	);
	background: var(
		--course-asset-preview-button-bg-hover,
		rgba(204, 251, 241, 0.98)
	);
}

.course-asset-preview-toggle:focus-visible,
.course-asset-preview-open-link:focus-visible,
.course-asset-preview-control select:focus-visible {
	outline: 3px solid var(--course-focus-ring, rgba(14, 165, 233, 0.35));
	outline-offset: 3px;
}

.course-asset-preview-panel {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	border: 1px solid
		var(--course-asset-preview-border, rgba(13, 148, 136, 0.18));
	border-radius: 18px;
	background: var(--course-asset-preview-bg, rgba(240, 253, 250, 0.72));
	padding: clamp(0.95rem, 2vw, 1.15rem);
}

.course-asset-preview-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	gap: 0.7rem;
}

.course-asset-preview-control {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	min-width: min(100%, 14rem);
	color: var(--course-text);
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.course-asset-preview-control select {
	max-width: min(100%, 28rem);
	border: 1px solid var(--course-asset-preview-border, rgba(15, 23, 42, 0.14));
	border-radius: 12px;
	background: var(
		--course-asset-preview-control-bg,
		rgba(255, 255, 255, 0.94)
	);
	color: var(--course-text);
	font: inherit;
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: normal;
	line-height: 1.3;
	text-transform: none;
	padding: 0.58rem 0.7rem;
}

.course-asset-preview-status,
.course-asset-preview-error {
	margin: 0;
	color: var(--course-text-soft);
	line-height: 1.55;
}

.course-asset-preview-error {
	color: var(--course-error-text, #b45309);
	font-weight: 800;
}

.course-asset-preview-content {
	display: grid;
	gap: 0.55rem;
}

.course-asset-preview-eyebrow {
	margin: 0;
	color: var(--course-accent);
	font-size: 0.74rem;
	font-weight: 900;
	letter-spacing: 0.14em;
	text-transform: uppercase;
}

.course-asset-preview-title {
	margin: 0;
	color: var(--course-text);
	font-size: clamp(1.05rem, 2vw, 1.2rem);
	font-weight: 900;
	line-height: 1.35;
}

.course-asset-preview-content :deep(.item-content-markdown) {
	max-width: 100%;
}
</style>
