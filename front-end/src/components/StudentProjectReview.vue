<script lang="ts" setup>
import type {
	ManagedPythonIdeProject,
	PythonIdeFile,
	PythonIdeProject,
	PythonIdeProjectReview
} from "@/modules/pythonIde";
import { computed, ref, watch } from "vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import {
	createPythonIdeProjectReview,
	fetchManagedPythonIdeProject,
	fetchManagedPythonIdeProjects,
	isPythonIdeBinaryAssetFile,
	updatePythonIdeProjectReview
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
	studentId: string;
	username: string;
}>();

const app = useAppStore();
const loaded = ref(false);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const status = ref("");
const records = ref<ManagedPythonIdeProject[]>([]);
const selectedProjectID = ref("");
const selectedFileName = ref("");
const editFileContent = ref("");
const noteDraft = ref("");
const visibleDraft = ref(false);
const recordMetadata = new Map<string, ManagedPythonIdeProject>();
let projectListLoadID = 0;
let detailLoadID = 0;
let saveOperationID = 0;
let activeDetailLoad: {
	projectID: string;
	studentID: string;
	promise: Promise<void>;
} | null = null;

const selectedRecord = computed(
	() =>
		records.value.find(
			record => record.project._id === selectedProjectID.value
		) ??
		records.value[0] ??
		null
);
const selectedProject = computed(() => selectedRecord.value?.project ?? null);
const selectedReview = computed(() => selectedRecord.value?.review ?? null);
const selectedRecordLoaded = computed(
	() => selectedProject.value?.remoteContentLoaded === true
);
const selectedStudentFile = computed(() =>
	selectedProject.value?.files.find(
		file => file.name === selectedFileName.value
	)
);
const selectedReviewFile = computed(() =>
	selectedReview.value?.files.find(
		file => file.name === selectedFileName.value
	)
);
const fileNames = computed(() => {
	const names = new Set<string>();
	for (const file of selectedProject.value?.files ?? []) names.add(file.name);
	for (const file of selectedReview.value?.files ?? []) names.add(file.name);
	return [...names];
});
const canEditSelectedFile = computed(() => {
	if (!selectedReview.value || !selectedFileName.value) return false;
	const file = selectedReviewFile.value ?? selectedStudentFile.value;
	return !!file && !isPythonIdeBinaryAssetFile(file);
});
const sourceIsNewer = computed(() => {
	const teacherCopySourceUpdated = selectedReview.value?.sourceUpdatedAt;
	const projectUpdated = selectedProject.value?.updatedAt;
	if (!teacherCopySourceUpdated || !projectUpdated) return false;
	return (
		new Date(projectUpdated).getTime() >
		new Date(teacherCopySourceUpdated).getTime()
	);
});

function errorMessage(caught: unknown, fallback: string) {
	if (
		caught &&
		typeof caught === "object" &&
		"response" in caught &&
		caught.response &&
		typeof caught.response === "object" &&
		"data" in caught.response &&
		caught.response.data &&
		typeof caught.response.data === "object" &&
		"message" in caught.response.data &&
		typeof caught.response.data.message === "string"
	) {
		return caught.response.data.message;
	}
	return caught instanceof Error ? caught.message : fallback;
}

function clearSensitiveProjectState() {
	projectListLoadID += 1;
	detailLoadID += 1;
	saveOperationID += 1;
	activeDetailLoad = null;
	recordMetadata.clear();
	records.value = [];
	selectedProjectID.value = "";
	selectedFileName.value = "";
	editFileContent.value = "";
	noteDraft.value = "";
	visibleDraft.value = false;
	loaded.value = false;
}

function handleProjectManagementError(caught: unknown, fallback: string) {
	if (clearAdminSessionOnAuthorizationError(caught, app)) {
		clearSensitiveProjectState();
		error.value = "";
		status.value = "";
		return;
	}
	error.value = errorMessage(caught, fallback);
}

function formatDate(value: string | undefined) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}

function projectLabel(project: PythonIdeProject) {
	return project.courseProjectTitle || project.title;
}

function filePreview(file: PythonIdeFile | undefined) {
	if (!file) return "";
	if (isPythonIdeBinaryAssetFile(file)) return `[Asset: ${file.name}]`;
	return file.content;
}

function replaceRecord(
	project: PythonIdeProject,
	review: PythonIdeProjectReview
) {
	const loadedRecord = {
		project: {
			...project,
			remoteContentLoaded: true
		},
		review: {
			...review,
			remoteContentLoaded: true
		}
	};
	records.value = records.value.map(record =>
		record.project._id === project._id ? loadedRecord : record
	);
	recordMetadata.set(project._id, metadataRecord(loadedRecord));
	trimProjectDetailCache(project._id);
}

function metadataRecord(
	record: ManagedPythonIdeProject
): ManagedPythonIdeProject {
	const {
		files: _projectFiles,
		remoteContentLoaded: _projectContentLoaded,
		...projectMetadata
	} = record.project;
	const reviewMetadata = record.review
		? (() => {
				const {
					files: _reviewFiles,
					note: _reviewNote,
					remoteContentLoaded: _reviewContentLoaded,
					...metadata
				} = record.review;
				return {
					...metadata,
					files: [],
					remoteContentLoaded: false
				};
			})()
		: null;
	return {
		project: {
			...projectMetadata,
			files: [],
			remoteContentLoaded: false
		},
		review: reviewMetadata
	};
}

function trimProjectDetailCache(keepProjectID: string) {
	records.value = records.value.map(record => {
		if (
			record.project._id === keepProjectID ||
			record.project.remoteContentLoaded !== true
		) {
			return record;
		}
		return recordMetadata.get(record.project._id) ?? metadataRecord(record);
	});
}

async function loadProjectDetails(projectID: string) {
	if (!props.studentId || !projectID) return;
	if (
		activeDetailLoad?.projectID === projectID &&
		activeDetailLoad.studentID === props.studentId
	) {
		return activeDetailLoad.promise;
	}
	const existing = records.value.find(
		record => record.project._id === projectID
	);
	if (existing?.project.remoteContentLoaded === true) {
		trimProjectDetailCache(projectID);
		return;
	}

	const requestID = ++detailLoadID;
	const studentID = props.studentId;
	const detailPromise = (async () => {
		try {
			const record = await fetchManagedPythonIdeProject(
				studentID,
				projectID
			);
			if (
				requestID !== detailLoadID ||
				props.studentId !== studentID ||
				selectedProjectID.value !== projectID
			) {
				return;
			}
			records.value = records.value.map(candidate =>
				candidate.project._id === projectID ? record : candidate
			);
			recordMetadata.set(projectID, metadataRecord(record));
			trimProjectDetailCache(projectID);
			selectDefaultFile(record);
			syncDrafts();
		} catch (caught: unknown) {
			if (requestID !== detailLoadID) return;
			handleProjectManagementError(caught, "Couldn’t load this project.");
		}
	})();
	activeDetailLoad = {
		projectID,
		studentID,
		promise: detailPromise
	};
	try {
		await detailPromise;
	} finally {
		if (activeDetailLoad?.promise === detailPromise) {
			activeDetailLoad = null;
		}
	}
}

function selectDefaultFile(record: ManagedPythonIdeProject | null) {
	selectedFileName.value =
		record?.review?.activeFileName ||
		record?.project.activeFileName ||
		record?.project.files[0]?.name ||
		"";
}

function syncDrafts() {
	const review = selectedReview.value;
	noteDraft.value = review?.note ?? "";
	visibleDraft.value = !!review?.visibleToStudent;
	editFileContent.value = filePreview(
		selectedReviewFile.value ?? selectedStudentFile.value
	);
}

async function loadProjects() {
	if (!props.studentId || loading.value) return;

	const requestID = ++projectListLoadID;
	const studentID = props.studentId;
	loading.value = true;
	error.value = "";
	status.value = "";
	try {
		const projectRecords = await fetchManagedPythonIdeProjects(studentID);
		if (requestID !== projectListLoadID || props.studentId !== studentID) {
			return;
		}
		records.value = projectRecords;
		recordMetadata.clear();
		for (const record of records.value) {
			recordMetadata.set(record.project._id, metadataRecord(record));
		}
		if (
			!selectedProjectID.value ||
			!records.value.some(
				record => record.project._id === selectedProjectID.value
			)
		) {
			selectedProjectID.value = records.value[0]?.project._id ?? "";
		}
		await loadProjectDetails(selectedProjectID.value);
		if (requestID === projectListLoadID && props.studentId === studentID) {
			loaded.value = true;
		}
	} catch (caught: unknown) {
		if (requestID !== projectListLoadID || props.studentId !== studentID) {
			return;
		}
		handleProjectManagementError(
			caught,
			"Couldn’t load this student’s Python projects."
		);
		records.value = [];
	} finally {
		if (requestID === projectListLoadID) {
			loading.value = false;
		}
	}
}

async function onToggle(event: Event) {
	if (!(event.target as HTMLDetailsElement).open) return;
	if (!loaded.value) await loadProjects();
}

async function createTeacherCopy() {
	const project = selectedProject.value;
	if (!project || !selectedRecordLoaded.value || saving.value) return;

	const operationID = ++saveOperationID;
	const studentID = props.studentId;
	saving.value = true;
	error.value = "";
	status.value = "";
	try {
		const { project: savedProject, review } =
			await createPythonIdeProjectReview(studentID, project._id);
		if (operationID !== saveOperationID || props.studentId !== studentID) {
			return;
		}
		replaceRecord(savedProject, review);
		selectedProjectID.value = savedProject._id;
		selectedFileName.value = review.activeFileName;
		status.value = "Teacher copy created.";
	} catch (caught: unknown) {
		if (operationID !== saveOperationID || props.studentId !== studentID) {
			return;
		}
		handleProjectManagementError(
			caught,
			"Couldn’t create the teacher copy."
		);
	} finally {
		if (operationID === saveOperationID) {
			saving.value = false;
		}
	}
}

function reviewFilesForSave() {
	const review = selectedReview.value;
	if (!review) return [];

	const files = review.files.map(file => ({ ...file }));
	if (!canEditSelectedFile.value || !selectedFileName.value) return files;

	const existingIndex = files.findIndex(
		file => file.name === selectedFileName.value
	);
	const baseFile = selectedReviewFile.value ?? selectedStudentFile.value;
	if (!baseFile) return files;

	const nextFile = {
		...baseFile,
		content: editFileContent.value,
		encoding: baseFile.encoding ?? "text",
		name: selectedFileName.value
	} satisfies PythonIdeFile;

	if (existingIndex >= 0) files.splice(existingIndex, 1, nextFile);
	else files.push(nextFile);
	return files;
}

async function saveTeacherCopy() {
	const project = selectedProject.value;
	const review = selectedReview.value;
	if (!project || !review || saving.value) return;

	const operationID = ++saveOperationID;
	const studentID = props.studentId;
	saving.value = true;
	error.value = "";
	status.value = "";
	try {
		const { project: savedProject, review: savedReview } =
			await updatePythonIdeProjectReview(
				studentID,
				project._id,
				review._id,
				{
					activeFileName:
						selectedFileName.value || review.activeFileName,
					files: reviewFilesForSave(),
					note: noteDraft.value,
					visibleToStudent: visibleDraft.value
				}
			);
		if (operationID !== saveOperationID || props.studentId !== studentID) {
			return;
		}
		replaceRecord(savedProject, savedReview);
		status.value = savedReview.visibleToStudent
			? "Teacher copy saved and shared with the student."
			: "Teacher copy saved.";
	} catch (caught: unknown) {
		if (operationID !== saveOperationID || props.studentId !== studentID) {
			return;
		}
		handleProjectManagementError(caught, "Couldn’t save the teacher copy.");
	} finally {
		if (operationID === saveOperationID) {
			saving.value = false;
		}
	}
}

function resetFileFromStudent() {
	editFileContent.value = filePreview(selectedStudentFile.value);
}

watch(selectedProjectID, projectID => {
	selectDefaultFile(selectedRecord.value);
	void loadProjectDetails(projectID);
});

watch(
	() => props.studentId,
	() => {
		clearSensitiveProjectState();
		loading.value = false;
		saving.value = false;
		error.value = "";
		status.value = "";
	},
	{ flush: "sync" }
);

watch([selectedReview, selectedFileName], syncDrafts, { immediate: true });
</script>

<template>
	<details class="project-review" @toggle="onToggle">
		<summary class="project-review__summary">
			<span>
				<strong>Projects</strong>
				<small>{{ username }}</small>
			</span>
			<span v-if="loaded" class="project-review__count">
				{{ records.length }}
			</span>
		</summary>

		<div class="project-review__body">
			<p v-if="loading" class="project-review__muted">
				Loading projects…
			</p>
			<p v-if="error" class="project-review__error" role="alert">
				{{ error }}
			</p>
			<p
				v-if="status"
				class="project-review__status"
				role="status"
				aria-live="polite"
			>
				{{ status }}
			</p>

			<p
				v-if="loaded && records.length === 0"
				class="project-review__muted"
			>
				No synced Python projects yet.
			</p>
			<div
				v-else-if="selectedProject && !selectedRecordLoaded"
				class="project-review__muted"
			>
				<label>
					Project
					<select v-model="selectedProjectID">
						<option
							v-for="record in records"
							:key="record.project._id"
							:value="record.project._id"
						>
							{{ projectLabel(record.project) }}
						</option>
					</select>
				</label>
				<p>
					{{
						error
							? "Selected project details are unavailable."
							: "Loading selected project…"
					}}
				</p>
				<button
					v-if="error"
					class="site-button project-review__button"
					type="button"
					@click="loadProjectDetails(selectedProjectID)"
				>
					Try again
				</button>
			</div>

			<div
				v-else-if="selectedProject && selectedRecordLoaded"
				class="project-review__workspace"
			>
				<div class="project-review__controls">
					<label>
						Project
						<select v-model="selectedProjectID">
							<option
								v-for="record in records"
								:key="record.project._id"
								:value="record.project._id"
							>
								{{ projectLabel(record.project) }}
							</option>
						</select>
					</label>
					<button
						v-if="!selectedReview"
						class="site-button site-button--primary project-review__button"
						:disabled="saving"
						type="button"
						@click="createTeacherCopy"
					>
						Create teacher copy
					</button>
				</div>

				<div class="project-review__meta">
					<span>{{ selectedProject.mode }}</span>
					<span
						>Student saved
						{{ formatDate(selectedProject.updatedAt) }}</span
					>
					<span v-if="sourceIsNewer" class="is-warning">
						Student code changed after this copy was created
					</span>
				</div>

				<div v-if="selectedReview" class="project-review__options">
					<label class="project-review__visibility">
						<input v-model="visibleDraft" type="checkbox" />
						Share this copy with the student
					</label>
					<label>
						Teacher note
						<textarea
							v-model="noteDraft"
							rows="3"
							placeholder="Optional note"
						/>
					</label>
				</div>

				<label class="project-review__file-select">
					File
					<select v-model="selectedFileName">
						<option
							v-for="fileName in fileNames"
							:key="fileName"
							:value="fileName"
						>
							{{ fileName }}
						</option>
					</select>
				</label>

				<div class="project-review__grid">
					<section class="project-review__pane">
						<header>
							<strong>Student original</strong>
							<small>{{
								selectedStudentFile?.name || "No file"
							}}</small>
						</header>
						<pre
							v-if="selectedStudentFile"
						><code>{{ filePreview(selectedStudentFile) }}</code></pre>
						<p v-else class="project-review__muted">
							This file is not in the student’s current project.
						</p>
					</section>

					<section class="project-review__pane">
						<header>
							<strong>Teacher copy</strong>
							<small>{{
								selectedReviewFile?.name ||
								(selectedReview
									? selectedFileName
									: "No copy yet")
							}}</small>
						</header>
						<textarea
							v-if="canEditSelectedFile"
							v-model="editFileContent"
							aria-label="Edit teacher copy"
							spellcheck="false"
						/>
						<pre
							v-else-if="selectedReviewFile"
						><code>{{ filePreview(selectedReviewFile) }}</code></pre>
						<p v-else class="project-review__muted">
							Create a teacher copy before editing code.
						</p>
					</section>
				</div>

				<div v-if="selectedReview" class="project-review__actions">
					<button
						class="site-button site-button--secondary project-review__button"
						:disabled="
							saving ||
							!selectedStudentFile ||
							!canEditSelectedFile
						"
						type="button"
						@click="resetFileFromStudent"
					>
						Reset file from student
					</button>
					<button
						class="site-button site-button--primary project-review__button"
						:disabled="saving"
						type="button"
						@click="saveTeacherCopy"
					>
						{{ saving ? "Saving…" : "Save teacher copy" }}
					</button>
				</div>
			</div>
		</div>
	</details>
</template>

<style scoped>
.project-review {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.project-review__summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 1rem;
	cursor: pointer;
	list-style: none;
}

.project-review__summary::-webkit-details-marker {
	display: none;
}

.project-review__summary > span:first-child {
	display: grid;
	gap: 0.1rem;
}

.project-review__summary small,
.project-review__count,
.project-review__muted,
.project-review__meta,
.project-review__pane small {
	color: var(--color-ink-soft);
}

.project-review__count {
	min-width: 1.8rem;
	padding: 0.2rem 0.45rem;
	border-radius: var(--radius-pill);
	background: var(--color-accent-soft);
	text-align: center;
	font-size: 0.8rem;
	font-weight: 800;
}

.project-review__body,
.project-review__workspace,
.project-review__options {
	display: grid;
	gap: 1rem;
}

.project-review__body {
	padding: 0 1rem 1rem;
}

.project-review__controls,
.project-review__actions {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 0.75rem;
}

.project-review__controls label,
.project-review__options label,
.project-review__file-select {
	display: grid;
	flex: 1 1 16rem;
	gap: 0.35rem;
	color: var(--color-ink);
	font-size: 0.82rem;
	font-weight: 800;
}

.project-review select,
.project-review textarea {
	width: 100%;
	border: 1px solid var(--color-border-strong);
	border-radius: 12px;
	background: var(--color-surface-strong);
	color: var(--color-ink);
	font: inherit;
}

.project-review select {
	min-height: 2.65rem;
	padding: 0.55rem 0.65rem;
}

.project-review__options textarea {
	min-height: 5rem;
	padding: 0.7rem;
	resize: vertical;
}

.project-review__visibility {
	display: flex !important;
	flex: 0 0 auto !important;
	flex-direction: row;
	align-items: center;
}

.project-review__meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	font-size: 0.8rem;
}

.project-review__meta span {
	padding: 0.2rem 0.45rem;
	border-radius: var(--radius-pill);
	background: var(--color-surface-inset);
}

.project-review__meta .is-warning {
	background: #fef3c7;
	color: #92400e;
}

.project-review__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.9rem;
}

.project-review__pane {
	display: grid;
	min-width: 0;
	gap: 0.55rem;
}

.project-review__pane header {
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
}

.project-review__pane pre,
.project-review__pane > textarea {
	min-height: 16rem;
	max-height: 30rem;
	margin: 0;
	padding: 0.8rem;
	overflow: auto;
	border-radius: 12px;
	background: #0f172a;
	color: #e2e8f0;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
	font-size: 0.8rem;
	line-height: 1.5;
	white-space: pre;
	tab-size: 4;
}

.project-review__pane > textarea {
	border: 1px solid #334155;
	resize: vertical;
}

.project-review__button {
	min-height: 2.65rem;
	padding: 0.65rem 0.8rem;
}

.project-review__error,
.project-review__status {
	padding: 0.65rem 0.75rem;
	border: 1px solid;
	border-radius: 10px;
	font-size: 0.86rem;
}

.project-review__error {
	border-color: var(--color-error-border);
	background: var(--color-error-surface);
	color: var(--color-error-text);
}

.project-review__status {
	border-color: var(--color-success-border);
	background: var(--color-success-surface);
	color: var(--color-success-text);
}

@media (max-width: 860px) {
	.project-review__grid {
		grid-template-columns: 1fr;
	}
}
</style>
