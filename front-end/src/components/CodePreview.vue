<script lang="ts" setup>
import type { CodePreviewResource, PreviewFile } from "@/modules/codePreview";
import { computed, ref, watch } from "vue";
import {
	listPreviewFiles,
	loadPreviewFile,
	previewableResources,
	previewActionLabel
} from "@/modules/codePreview";

const props = defineProps<{
	resources: CodePreviewResource[];
}>();

const resourcesForPreview = computed(() =>
	previewableResources(props.resources)
);
const selectedResourceUrl = ref("");
const selectedFilePath = ref("");
const files = ref<PreviewFile[]>([]);
const content = ref("");
const error = ref("");
const isOpen = ref(false);
const isLoadingFiles = ref(false);
const isLoadingContent = ref(false);
const isTruncated = ref(false);
let fileRequestSequence = 0;
let resourceRequestSequence = 0;

const selectedResource = computed(
	() =>
		resourcesForPreview.value.find(
			resource => resource.url === selectedResourceUrl.value
		) ??
		resourcesForPreview.value[0] ??
		null
);

const selectedFile = computed(
	() =>
		files.value.find(file => file.path === selectedFilePath.value) ??
		files.value[0] ??
		null
);

const toggleLabel = computed(() => {
	if (resourcesForPreview.value.length !== 1) return "Preview code";
	const resource = resourcesForPreview.value[0];
	return resource ? previewActionLabel(resource) : "Preview code";
});

const isLoading = computed(
	() => isLoadingFiles.value || isLoadingContent.value
);

watch(
	resourcesForPreview,
	resources => {
		selectedResourceUrl.value = resources[0]?.url ?? "";
		files.value = [];
		selectedFilePath.value = "";
		content.value = "";
		error.value = "";
	},
	{ immediate: true }
);

async function openPreview() {
	isOpen.value = !isOpen.value;
	if (!isOpen.value || files.value.length > 0) return;

	await loadResourceFiles();
}

async function loadResourceFiles() {
	const resource = selectedResource.value;
	if (!resource) return;

	const requestId = ++resourceRequestSequence;
	fileRequestSequence++;
	isLoadingFiles.value = true;
	isLoadingContent.value = false;
	isTruncated.value = false;
	error.value = "";
	content.value = "";
	files.value = [];
	selectedFilePath.value = "";

	try {
		const previewFiles = await listPreviewFiles(resource.url);
		if (requestId !== resourceRequestSequence) return;

		files.value = previewFiles;
		selectedFilePath.value = previewFiles[0]?.path ?? "";

		if (previewFiles.length === 0) {
			error.value =
				"No previewable starter code files were found in this GitHub resource.";
			return;
		}

		isLoadingFiles.value = false;
		await loadSelectedFile();
	} catch (caughtError) {
		if (requestId !== resourceRequestSequence) return;
		error.value =
			caughtError instanceof Error
				? caughtError.message
				: "Unable to load this code preview.";
	} finally {
		if (requestId === resourceRequestSequence) {
			isLoadingFiles.value = false;
		}
	}
}

async function loadSelectedFile() {
	const file = selectedFile.value;
	if (!file) return;

	const requestId = ++fileRequestSequence;
	isLoadingContent.value = true;
	error.value = "";
	content.value = "";
	isTruncated.value = false;

	try {
		const preview = await loadPreviewFile(file);
		if (requestId !== fileRequestSequence) return;

		content.value = preview.content;
		isTruncated.value = preview.truncated;
	} catch (caughtError) {
		if (requestId !== fileRequestSequence) return;
		error.value =
			caughtError instanceof Error
				? caughtError.message
				: "Unable to load this code preview.";
	} finally {
		if (requestId === fileRequestSequence) {
			isLoadingContent.value = false;
		}
	}
}

async function handleResourceChange() {
	await loadResourceFiles();
}

async function handleFileChange() {
	await loadSelectedFile();
}
</script>

<template>
	<section v-if="resourcesForPreview.length > 0" class="code-preview">
		<button
			class="code-preview-toggle"
			type="button"
			:aria-expanded="isOpen"
			@click="openPreview"
		>
			<span>{{ isOpen ? "Hide code preview" : toggleLabel }}</span>
		</button>

		<div v-if="isOpen" class="code-preview-panel">
			<div class="code-preview-toolbar">
				<label
					v-if="resourcesForPreview.length > 1"
					class="code-preview-control"
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
							{{ previewActionLabel(resource) }}
						</option>
					</select>
				</label>

				<label v-if="files.length > 1" class="code-preview-control">
					<span>File</span>
					<select
						v-model="selectedFilePath"
						@change="handleFileChange"
					>
						<option
							v-for="file in files"
							:key="file.path"
							:value="file.path"
						>
							{{ file.label }}
						</option>
					</select>
				</label>

				<a
					v-if="selectedResource"
					class="code-preview-open-link"
					:href="selectedResource.url"
					rel="noreferrer"
					target="_blank"
				>
					Open on GitHub
					<span class="sr-only">(opens in a new tab)</span>
				</a>
			</div>

			<p v-if="isLoading" class="code-preview-status">
				Loading code preview...
			</p>
			<p v-else-if="error" class="code-preview-error" role="alert">
				{{ error }}
			</p>
			<div v-else-if="content" class="code-preview-code-wrap">
				<p v-if="isTruncated" class="code-preview-status">
					Preview truncated. Open on GitHub to inspect the full file.
				</p>
				<pre class="code-preview-code"><code>{{ content }}</code></pre>
			</div>
		</div>
	</section>
</template>

<style scoped>
.code-preview {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	max-width: min(100%, 58rem);
}

.code-preview-toggle,
.code-preview-open-link {
	width: fit-content;
	border: 1px solid var(--course-code-preview-border, rgba(59, 130, 246, 0.2));
	border-radius: 999px;
	background: var(--course-code-preview-button-bg, rgba(239, 246, 255, 0.92));
	color: var(--course-code-preview-button-text, #1e3a8a);
	font-weight: 800;
	line-height: 1.2;
	text-decoration: none;
}

.code-preview-toggle {
	padding: 0.62rem 0.9rem;
	cursor: pointer;
}

.code-preview-open-link {
	display: inline-flex;
	align-items: center;
	padding: 0.58rem 0.85rem;
}

.code-preview-toggle:hover,
.code-preview-open-link:hover {
	border-color: var(
		--course-code-preview-border-hover,
		rgba(37, 99, 235, 0.36)
	);
	background: var(
		--course-code-preview-button-bg-hover,
		rgba(219, 234, 254, 0.96)
	);
}

.code-preview-toggle:focus-visible,
.code-preview-open-link:focus-visible,
.code-preview-control select:focus-visible {
	outline: 3px solid var(--course-focus-ring, rgba(14, 165, 233, 0.35));
	outline-offset: 3px;
}

.code-preview-panel {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	border: 1px solid
		var(--course-code-preview-border, rgba(59, 130, 246, 0.16));
	border-radius: 18px;
	background: var(--course-code-preview-bg, rgba(248, 250, 252, 0.9));
	padding: clamp(0.9rem, 2vw, 1.1rem);
}

.code-preview-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	gap: 0.7rem;
}

.code-preview-control {
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

.code-preview-control select {
	max-width: min(100%, 28rem);
	border: 1px solid var(--course-code-preview-border, rgba(15, 23, 42, 0.14));
	border-radius: 12px;
	background: var(
		--course-code-preview-control-bg,
		rgba(255, 255, 255, 0.92)
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

.code-preview-status,
.code-preview-error {
	margin: 0;
	color: var(--course-text-soft);
	line-height: 1.55;
}

.code-preview-error {
	color: var(--course-error-text, #b45309);
	font-weight: 800;
}

.code-preview-code-wrap {
	min-width: 0;
}

.code-preview-code {
	max-height: min(56vh, 34rem);
	overflow: auto;
	margin: 0;
	border: 1px solid var(--course-code-preview-border, rgba(15, 23, 42, 0.12));
	border-radius: 14px;
	background: var(--course-code-preview-code-bg, #0f172a);
	color: var(--course-code-preview-code-text, #e2e8f0);
	font-size: 0.9rem;
	line-height: 1.55;
	tab-size: 4;
	padding: 1rem;
	white-space: pre;
}
</style>
