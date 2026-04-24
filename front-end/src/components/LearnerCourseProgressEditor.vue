<script lang="ts" setup>
import type { LearnerCourseProgressController } from "@/composables/useLearnerCourseProgress";
import type { CourseModuleItem } from "@/stores/courses";
import { computed } from "vue";

const props = defineProps<{
	courseLabel: (courseId: string) => string;
	progress: LearnerCourseProgressController;
	userId: string;
}>();

const emit = defineEmits<{
	saveProgress: [];
}>();

const assignedCourseIds = computed(() =>
	props.progress.assignedCourseIds(props.userId)
);
const selectedCourseId = computed(() =>
	props.progress.selectedProgressCourseId(props.userId)
);
const selectedCourse = computed(() =>
	props.progress.progressCourseForUser(props.userId)
);
const isLoading = computed(() =>
	props.progress.isProgressCourseLoading(props.userId)
);

async function selectCourse(event: Event) {
	const target = event.target as HTMLSelectElement;
	await props.progress.selectProgressCourse(props.userId, target.value);
}

function loadCourse() {
	void props.progress.loadSelectedProgressCourse(props.userId);
}

function isModuleComplete(moduleId: string) {
	return props.progress.isModuleComplete(
		props.userId,
		selectedCourseId.value,
		moduleId
	);
}

function isItemComplete(item: CourseModuleItem) {
	return props.progress.isItemComplete(
		props.userId,
		selectedCourseId.value,
		item
	);
}

function toggleModule(moduleId: string, event: Event) {
	const target = event.target as HTMLInputElement;
	props.progress.toggleModule(
		props.userId,
		selectedCourseId.value,
		moduleId,
		target.checked
	);
}

function toggleItem(item: CourseModuleItem, event: Event) {
	const target = event.target as HTMLInputElement;
	props.progress.toggleItem(
		props.userId,
		selectedCourseId.value,
		item,
		target.checked
	);
}
</script>

<template>
	<section class="learner-progress-editor">
		<p class="progress-title">Course progress</p>
		<p class="progress-helper">
			Track completed modules, lessons, and project items for a course
			already assigned to this learner.
		</p>

		<p v-if="assignedCourseIds.length === 0" class="progress-helper">
			Assign and save a course before marking progress.
		</p>

		<template v-else>
			<label class="progress-label" :for="`progress-course-${userId}`">
				Progress course
			</label>
			<select
				:id="`progress-course-${userId}`"
				class="progress-select"
				:value="selectedCourseId"
				@change="selectCourse"
				@focus="loadCourse"
			>
				<option
					v-for="courseID in assignedCourseIds"
					:key="`${userId}-${courseID}`"
					:value="courseID"
				>
					{{ courseLabel(courseID) }}
				</option>
			</select>

			<p v-if="isLoading" class="progress-helper">
				Loading course outline.
			</p>

			<div v-else-if="selectedCourse" class="progress-outline">
				<details
					v-for="module in selectedCourse.modules"
					:key="module.id"
					class="progress-module"
				>
					<summary>
						<label class="progress-check" @click.stop>
							<input
								:checked="isModuleComplete(module.id)"
								type="checkbox"
								@change="toggleModule(module.id, $event)"
							/>
							<span>{{ module.title }}</span>
						</label>
					</summary>

					<div class="progress-item-list">
						<label
							v-for="item in [
								...module.curriculum,
								...module.supplementalProjects
							]"
							:key="item.id"
							class="progress-check is-item"
						>
							<input
								:checked="isItemComplete(item)"
								type="checkbox"
								@change="toggleItem(item, $event)"
							/>
							<span>{{ item.title }}</span>
						</label>
					</div>
				</details>
			</div>

			<div class="progress-actions">
				<button
					class="btn-secondary btn"
					type="button"
					@click="loadCourse"
				>
					Load progress
				</button>
				<button
					class="btn-primary btn"
					type="button"
					@click="emit('saveProgress')"
				>
					Save progress
				</button>
			</div>
		</template>
	</section>
</template>

<style scoped>
.learner-progress-editor {
	display: grid;
	gap: 0.85rem;
	padding: 1rem;
	border-radius: 18px;
	background: rgba(248, 250, 252, 0.72);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.progress-title,
.progress-label {
	margin: 0;
	color: #10263a;
	font-size: 0.84rem;
	font-weight: 800;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.progress-label {
	margin-top: 0.35rem;
}

.progress-helper {
	margin: 0;
	color: #5b6f82;
	line-height: 1.45;
}

.progress-select {
	width: 100%;
	min-height: 2.75rem;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 14px;
	padding: 0.7rem 0.8rem;
	background: white;
	color: #10263a;
}

.progress-outline {
	display: grid;
	gap: 0.55rem;
	max-height: 24rem;
	overflow: auto;
	padding-right: 0.25rem;
}

.progress-module {
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.progress-module summary {
	cursor: pointer;
	list-style: none;
	padding: 0.75rem 0.85rem;
}

.progress-module summary::-webkit-details-marker {
	display: none;
}

.progress-check {
	display: flex;
	align-items: flex-start;
	gap: 0.55rem;
	color: #10263a;
	line-height: 1.45;
}

.progress-check input {
	margin-top: 0.2rem;
	flex: 0 0 auto;
}

.progress-check span {
	min-width: 0;
}

.progress-check.is-item {
	padding: 0.55rem 0;
	color: #41566a;
	font-size: 0.92rem;
}

.progress-item-list {
	display: grid;
	gap: 0;
	padding: 0 0.95rem 0.75rem 2rem;
}

.progress-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	align-items: center;
}
</style>
