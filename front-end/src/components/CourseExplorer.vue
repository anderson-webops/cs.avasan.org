<script lang="ts" setup>
import { storeToRefs } from "pinia";
import type { CourseModule } from "@/stores/courses";
import { computed, ref, watch, watchEffect } from "vue";
import { useCoursesStore } from "@/stores/courses";

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const courseList = computed(() => courses.value ?? []);

const selectedCourseId = ref("");
const activeModuleId = ref<string | null>(null);
const openItems = ref<Record<string, string | null>>({});

watchEffect(() => {
        const availableCourses = courseList.value;

        if (!selectedCourseId.value && availableCourses.length > 0) {
                selectCourse(availableCourses[0].id);
        }
});

watch(selectedCourseId, () => {
	activeModuleId.value = null;
	openItems.value = {};
});

const selectedCourse = computed(
        () =>
                courseList.value.find(course => course.id === selectedCourseId.value) ??
                null
);

function selectCourse(id: string) {
	selectedCourseId.value = id;
}

function toggleModule(moduleId: string) {
	activeModuleId.value = activeModuleId.value === moduleId ? null : moduleId;
}

function itemKey(
	moduleId: string,
	type: "curriculum" | "supplemental",
	itemId: string
) {
	return `${moduleId}:${type}:${itemId}`;
}

function toggleItem(moduleId: string, key: string) {
	const current = openItems.value[moduleId] ?? null;
	openItems.value = {
		...openItems.value,
		[moduleId]: current === key ? null : key
	};
}

function isItemOpen(moduleId: string, key: string) {
	return openItems.value[moduleId] === key;
}

function hasSupplemental(module: CourseModule) {
	return module.supplementalProjects.length > 0;
}
</script>

<template>
	<section class="course-explorer">
		<div class="course-selector">
			<label class="selector-label" for="course-select"
				>Choose a course</label
			>
			<div class="selector-control">
				<select
					id="course-select"
					v-model="selectedCourseId"
					class="course-select"
				>
                                        <option
                                                v-for="course in courseList"
                                                :key="course.id"
                                                :value="course.id"
                                        >
						{{ course.name }}
					</option>
				</select>
			</div>
		</div>

		<div v-if="selectedCourse" class="course-modules">
			<div
				v-for="(module, index) in selectedCourse.modules"
				:key="module.id"
				class="module-card"
			>
				<button
					class="module-toggle"
					type="button"
					@click="toggleModule(module.id)"
				>
					<span class="module-index">{{ index + 1 }}</span>
					<span class="module-title">{{ module.title }}</span>
					<span aria-hidden="true" class="module-icon">
						{{ activeModuleId === module.id ? "−" : "+" }}
					</span>
				</button>

				<transition name="accordion">
					<div
						v-if="activeModuleId === module.id"
						class="module-body"
					>
						<div class="module-section">
							<h3>Curriculum</h3>
							<ol class="item-list">
								<li
									v-for="item in module.curriculum"
									:key="item.id"
									class="item"
								>
									<button
										class="item-toggle"
										type="button"
										@click="
											toggleItem(
												module.id,
												itemKey(
													module.id,
													'curriculum',
													item.id
												)
											)
										"
									>
										<span>{{ item.title }}</span>
										<span
											class="item-icon"
											aria-hidden="true"
										>
											{{
												isItemOpen(
													module.id,
													itemKey(
														module.id,
														"curriculum",
														item.id
													)
												)
													? "Hide"
													: "View"
											}}
										</span>
									</button>
									<transition name="accordion">
										<div
											v-if="
												isItemOpen(
													module.id,
													itemKey(
														module.id,
														'curriculum',
														item.id
													)
												)
											"
											class="item-content"
										>
											<pre>{{ item.content }}</pre>
										</div>
									</transition>
								</li>
							</ol>
						</div>

						<div
							v-if="hasSupplemental(module)"
							class="module-section"
						>
							<h3>Supplemental projects</h3>
							<ol class="item-list">
								<li
									v-for="item in module.supplementalProjects"
									:key="item.id"
									class="item"
								>
									<button
										class="item-toggle"
										type="button"
										@click="
											toggleItem(
												module.id,
												itemKey(
													module.id,
													'supplemental',
													item.id
												)
											)
										"
									>
										<span>{{ item.title }}</span>
										<span
											class="item-icon"
											aria-hidden="true"
										>
											{{
												isItemOpen(
													module.id,
													itemKey(
														module.id,
														"supplemental",
														item.id
													)
												)
													? "Hide"
													: "View"
											}}
										</span>
									</button>
									<transition name="accordion">
										<div
											v-if="
												isItemOpen(
													module.id,
													itemKey(
														module.id,
														'supplemental',
														item.id
													)
												)
											"
											class="item-content"
										>
											<pre>{{ item.content }}</pre>
										</div>
									</transition>
								</li>
							</ol>
						</div>
					</div>
				</transition>
			</div>
		</div>

		<p v-else class="empty-copy">Course information is on the way.</p>
	</section>
</template>

<style scoped>
.course-explorer {
	display: flex;
	flex-direction: column;
	gap: clamp(1.5rem, 3vw, 2.5rem);
}

.course-selector {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.selector-label {
	font-weight: 600;
	font-size: 1rem;
	color: #0f172a;
}

.selector-control {
	position: relative;
	display: flex;
	align-items: center;
}

.course-select {
	width: 100%;
	padding: 0.75rem 1rem;
	border-radius: 12px;
	border: 1px solid rgba(15, 23, 42, 0.12);
	font-size: 1rem;
	appearance: none;
	background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
	color: #0f172a;
	font-weight: 500;
	box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.45);
}

.course-modules {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.module-card {
	border: 1px solid rgba(15, 23, 42, 0.08);
	border-radius: 18px;
	background: rgba(248, 250, 252, 0.85);
	box-shadow: 0 18px 40px -30px rgba(15, 23, 42, 0.55);
	overflow: hidden;
}

.module-toggle {
	width: 100%;
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: 0.75rem;
	padding: 1.1rem 1.4rem;
	border: none;
	background: transparent;
	color: #0f172a;
	font-size: 1.05rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease;
}

.module-toggle:hover,
.module-toggle:focus-visible {
	background: rgba(15, 23, 42, 0.06);
}

.module-toggle:focus-visible {
	outline: 2px solid #1d4ed8;
	outline-offset: -2px;
}

.module-index {
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: rgba(59, 130, 246, 0.12);
	color: #1d4ed8;
	font-weight: 700;
}

.module-title {
	text-align: left;
}

.module-icon {
	font-size: 1.5rem;
	line-height: 1;
}

.module-body {
	padding: 0 1.4rem 1.6rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.module-section h3 {
	margin: 0 0 0.75rem;
	font-size: 1rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #334155;
}

.item-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.item {
	border: 1px solid rgba(15, 23, 42, 0.08);
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 12px 20px -20px rgba(15, 23, 42, 0.35);
	overflow: hidden;
}

.item-toggle {
	width: 100%;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 1.1rem;
	font-size: 0.95rem;
	font-weight: 600;
	color: #0f172a;
	cursor: pointer;
}

.item-toggle:hover,
.item-toggle:focus-visible {
	background: rgba(59, 130, 246, 0.08);
}

.item-toggle:focus-visible {
	outline: 2px solid #2563eb;
	outline-offset: -2px;
}

.item-icon {
	font-size: 0.85rem;
	font-weight: 600;
	color: #2563eb;
}

.item-content {
	padding: 0 1.1rem 1rem;
	border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.item-content pre {
	margin: 0;
	white-space: pre-wrap;
	font-family:
		"Inter",
		"SF Pro Text",
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		sans-serif;
	font-size: 0.9rem;
	line-height: 1.6;
	color: #1e293b;
}

.empty-copy {
	margin: 0;
	text-align: center;
	color: #475569;
}

@media (max-width: 640px) {
	.module-toggle {
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
	}

	.module-index {
		display: none;
	}

	.module-title {
		grid-column: 1 / span 1;
	}
}

.accordion-enter-active,
.accordion-leave-active {
	transition: all 0.18s ease;
}

.accordion-enter-from,
.accordion-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>
