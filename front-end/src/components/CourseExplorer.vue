<script lang="ts" setup>
import type { CourseModule, CourseModuleItem } from "@/stores/courses";
import MarkdownIt from "markdown-it";
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

interface VisibleModule extends CourseModule {
	position: number;
	totalItemCount: number;
	visibleItemCount: number;
	isFiltered: boolean;
}

interface ResourceLink {
	host: string;
	kind: "project" | "solution" | "dataset";
	label: string;
	url: string;
}

const markdown = new MarkdownIt({
	breaks: true,
	linkify: true
});

const VIDEO_FILE_RE = /\.(?:mp4|webm|ogg)(?:\?|$)/i;
const WHITESPACE_RE = /\s+/g;
const WWW_PREFIX_RE = /^www\./;

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const appStore = useAppStore();
const { currentTutor, currentAdmin, currentUser } = storeToRefs(appStore);

const searchQuery = ref("");
const selectedCourseId = ref("");
const activeModuleId = ref("");

const allCourses = computed(() => courses.value ?? []);

const canViewSolutions = computed(
	() => !!currentTutor.value || !!currentAdmin.value
);

const permittedCourseIds = computed(() => {
	if (currentAdmin.value) return allCourses.value.map(course => course.id);
	if (currentTutor.value) return currentTutor.value.coursePermissions ?? [];
	if (currentUser.value) return currentUser.value.courseAccess ?? [];
	return [];
});

const courseList = computed(() => {
	if (currentAdmin.value) return allCourses.value;
	const allowed = new Set(permittedCourseIds.value);
	return allCourses.value.filter(course => allowed.has(course.id));
});

const hasCourseAccess = computed(() => courseList.value.length > 0);

const normalizedQuery = computed(() => normalizeSearch(searchQuery.value));

watchEffect(() => {
	const availableCourses = courseList.value;
	if (availableCourses.length === 0) {
		selectedCourseId.value = "";
		return;
	}

	if (
		!selectedCourseId.value ||
		!availableCourses.some(course => course.id === selectedCourseId.value)
	) {
		selectedCourseId.value = availableCourses[0].id;
	}
});

const selectedCourse = computed(
	() =>
		courseList.value.find(course => course.id === selectedCourseId.value) ??
		null
);

const courseStats = computed(() => {
	const course = selectedCourse.value;
	if (!course) return null;

	const lessonCount = course.modules.reduce(
		(total, module) => total + module.curriculum.length,
		0
	);
	const supplementalCount = course.modules.reduce(
		(total, module) => total + module.supplementalProjects.length,
		0
	);

	return {
		moduleCount: course.modules.length,
		lessonCount,
		supplementalCount
	};
});

const visibleModules = computed<VisibleModule[]>(() => {
	const course = selectedCourse.value;
	if (!course) return [];

	const query = normalizedQuery.value;

	return course.modules
		.map((module, index) => {
			const totalItemCount =
				module.curriculum.length + module.supplementalProjects.length;

			if (!query) {
				return {
					...module,
					position: index + 1,
					totalItemCount,
					visibleItemCount: totalItemCount,
					isFiltered: false
				};
			}

			const moduleMatches = matchesSearch(module.title, query);
			const curriculum = moduleMatches
				? module.curriculum
				: module.curriculum.filter(item => itemMatches(item, query));
			const supplementalProjects = moduleMatches
				? module.supplementalProjects
				: module.supplementalProjects.filter(item =>
						itemMatches(item, query)
					);

			const visibleItemCount =
				curriculum.length + supplementalProjects.length;

			if (!moduleMatches && visibleItemCount === 0) return null;

			return {
				...module,
				position: index + 1,
				curriculum,
				supplementalProjects,
				totalItemCount,
				visibleItemCount,
				isFiltered: visibleItemCount < totalItemCount
			};
		})
		.filter((module): module is VisibleModule => module !== null);
});

watch(
	visibleModules,
	modules => {
		if (modules.length === 0) {
			activeModuleId.value = "";
			return;
		}

		if (!modules.some(module => module.id === activeModuleId.value)) {
			activeModuleId.value = modules[0].id;
		}
	},
	{ immediate: true }
);

const activeModule = computed(
	() =>
		visibleModules.value.find(
			module => module.id === activeModuleId.value
		) ?? null
);

const activeModuleJumpLinks = computed(() => {
	const module = activeModule.value;
	if (!module) return [];

	return [
		...module.curriculum.map((item, index) => ({
			id: itemAnchorId(module.id, item.id),
			label: `${index + 1}. ${item.title}`,
			type: "lesson" as const
		})),
		...module.supplementalProjects.map((item, index) => ({
			id: itemAnchorId(module.id, item.id),
			label: `Project ${index + 1}: ${item.title}`,
			type: "supplemental" as const
		}))
	];
});

const resultsCopy = computed(() => {
	const moduleCount = visibleModules.value.length;
	const itemCount = visibleModules.value.reduce(
		(total, module) => total + module.visibleItemCount,
		0
	);

	if (!normalizedQuery.value) {
		return `${moduleCount} modules and ${itemCount} lesson blocks ready to read.`;
	}

	return `${moduleCount} matching modules and ${itemCount} visible lesson blocks for "${searchQuery.value.trim()}".`;
});

function normalizeSearch(value: string) {
	return value.toLowerCase().replace(WHITESPACE_RE, " ").trim();
}

function matchesSearch(value: string, query: string) {
	return normalizeSearch(value).includes(query);
}

function itemMatches(item: CourseModuleItem, query: string) {
	return (
		matchesSearch(item.title, query) || matchesSearch(item.content, query)
	);
}

function renderMarkdown(content: string) {
	return markdown.render(content);
}

function selectCourse(id: string) {
	selectedCourseId.value = id;
}

function selectModule(id: string) {
	activeModuleId.value = id;
}

function clearSearch() {
	searchQuery.value = "";
}

function itemAnchorId(moduleId: string, itemId: string) {
	return `${moduleId}-${itemId}`;
}

function isVideo(link: string) {
	return VIDEO_FILE_RE.test(link);
}

function linkHost(url: string) {
	try {
		return new URL(url).hostname.replace(WWW_PREFIX_RE, "");
	} catch {
		return url;
	}
}

function resourceLinks(item: CourseModuleItem): ResourceLink[] {
	const links: ResourceLink[] = [];

	if (item.projectLink) {
		links.push({
			kind: "project",
			label: "Open project",
			url: item.projectLink,
			host: linkHost(item.projectLink)
		});
	}

	if (canViewSolutions.value && item.solutionLink) {
		links.push({
			kind: "solution",
			label: "Open solution",
			url: item.solutionLink,
			host: linkHost(item.solutionLink)
		});
	}

	if (item.datasetLink) {
		links.push({
			kind: "dataset",
			label: "Open dataset",
			url: item.datasetLink,
			host: linkHost(item.datasetLink)
		});
	}

	return links;
}
</script>

<template>
	<section class="course-explorer">
		<div v-if="hasCourseAccess" class="course-shell">
			<header v-if="selectedCourse && courseStats" class="course-hero">
				<div class="course-hero-copy">
					<p class="course-eyebrow">Course material</p>
					<h2>{{ selectedCourse.name }}</h2>
					<p class="course-description">
						Move through the syllabus from one calm reading space,
						search the material quickly, and open project resources
						without digging through nested accordions.
					</p>
				</div>

				<dl class="course-stats">
					<div class="stat">
						<dt>Modules</dt>
						<dd>{{ courseStats.moduleCount }}</dd>
					</div>
					<div class="stat">
						<dt>Core lessons</dt>
						<dd>{{ courseStats.lessonCount }}</dd>
					</div>
					<div class="stat">
						<dt>Projects</dt>
						<dd>{{ courseStats.supplementalCount }}</dd>
					</div>
				</dl>
			</header>

			<div class="course-toolbar">
				<label class="control-block" for="course-select">
					<span class="control-label">Course</span>
					<select
						id="course-select"
						v-model="selectedCourseId"
						class="course-select"
						@change="selectCourse(selectedCourseId)"
					>
						<option
							v-for="course in courseList"
							:key="course.id"
							:value="course.id"
						>
							{{ course.name }}
						</option>
					</select>
				</label>

				<label class="control-block search-block" for="course-search">
					<span class="control-label">Search lessons</span>
					<div class="search-shell">
						<input
							id="course-search"
							v-model="searchQuery"
							class="course-search"
							name="course-search"
							placeholder="Search module titles, lessons, or keywords"
							type="search"
						/>
						<button
							v-if="searchQuery"
							class="clear-search"
							type="button"
							@click="clearSearch"
						>
							Clear
						</button>
					</div>
				</label>

				<p class="results-copy">{{ resultsCopy }}</p>
			</div>

			<div v-if="selectedCourse" class="course-workspace">
				<aside class="course-outline">
					<div class="outline-header">
						<p class="outline-eyebrow">Syllabus</p>
						<h3>Choose a module</h3>
						<p>
							The right side shows the full reading view for the
							selected module.
						</p>
					</div>

					<div v-if="visibleModules.length > 0" class="outline-list">
						<button
							v-for="module in visibleModules"
							:key="module.id"
							:aria-current="
								activeModule?.id === module.id
									? 'true'
									: undefined
							"
							class="outline-button"
							type="button"
							@click="selectModule(module.id)"
						>
							<span class="outline-position">
								{{ module.position }}
							</span>
							<span class="outline-copy">
								<strong>{{ module.title }}</strong>
								<small>
									{{ module.visibleItemCount }}
									{{
										module.visibleItemCount === 1
											? "item"
											: "items"
									}}
									<span v-if="module.isFiltered">
										visible out of
										{{ module.totalItemCount }}
									</span>
								</small>
							</span>
						</button>
					</div>

					<div v-else class="outline-empty">
						<h4>No matches yet</h4>
						<p>
							Try a broader keyword or clear the search to return
							to the full syllabus.
						</p>
						<button
							type="button"
							class="outline-reset"
							@click="clearSearch"
						>
							Show all modules
						</button>
					</div>
				</aside>

				<div v-if="activeModule" class="course-reader">
					<header class="reader-header">
						<div class="reader-copy">
							<p class="reader-eyebrow">
								Module {{ activeModule.position }}
							</p>
							<h3>{{ activeModule.title }}</h3>
							<p>
								{{ activeModule.curriculum.length }}
								core lessons and
								{{ activeModule.supplementalProjects.length }}
								supplemental projects in one reading view.
							</p>
						</div>

						<nav
							v-if="activeModuleJumpLinks.length > 0"
							aria-label="Jump to lesson"
							class="reader-jump-links"
						>
							<a
								v-for="link in activeModuleJumpLinks"
								:key="link.id"
								class="jump-link"
								:class="[
									link.type === 'supplemental'
										? 'is-supplemental'
										: ''
								]"
								:href="`#${link.id}`"
							>
								{{ link.label }}
							</a>
						</nav>
					</header>

					<section class="reader-section">
						<div class="section-header">
							<div>
								<p class="section-eyebrow">Core path</p>
								<h4>Curriculum</h4>
							</div>
							<span class="section-count">
								{{ activeModule.curriculum.length }}
							</span>
						</div>

						<ol class="lesson-list">
							<li
								v-for="(item, index) in activeModule.curriculum"
								:id="itemAnchorId(activeModule.id, item.id)"
								:key="item.id"
								class="lesson-item"
							>
								<article class="lesson-card">
									<header class="lesson-header">
										<span class="lesson-index">
											{{ index + 1 }}
										</span>
										<div class="lesson-title-group">
											<p class="lesson-kicker">Lesson</p>
											<h5>{{ item.title }}</h5>
										</div>
									</header>

									<div
										v-if="resourceLinks(item).length > 0"
										class="resource-list"
									>
										<a
											v-for="resource in resourceLinks(
												item
											)"
											:key="`${item.id}-${resource.kind}`"
											class="resource-link"
											:class="[`is-${resource.kind}`]"
											:href="resource.url"
											rel="noreferrer"
											target="_blank"
										>
											<span>{{ resource.label }}</span>
											<small>{{ resource.host }}</small>
										</a>
									</div>

									<div
										v-if="item.content"
										class="item-content-markdown"
										v-html="renderMarkdown(item.content)"
									/>

									<div
										v-if="item.mediaLink"
										class="item-media"
									>
										<video
											v-if="isVideo(item.mediaLink)"
											class="item-media-video"
											controls
											muted
											playsinline
											preload="metadata"
										>
											<source :src="item.mediaLink" />
										</video>
										<img
											v-else
											:src="item.mediaLink"
											alt="Project demo media"
											class="item-media-image"
										/>
									</div>
								</article>
							</li>
						</ol>
					</section>

					<section
						v-if="activeModule.supplementalProjects.length > 0"
						class="reader-section"
					>
						<div class="section-header">
							<div>
								<p class="section-eyebrow">Extra practice</p>
								<h4>Supplemental Projects</h4>
							</div>
							<span class="section-count">
								{{ activeModule.supplementalProjects.length }}
							</span>
						</div>

						<ol class="lesson-list">
							<li
								v-for="(
									item, index
								) in activeModule.supplementalProjects"
								:id="itemAnchorId(activeModule.id, item.id)"
								:key="item.id"
								class="lesson-item"
							>
								<article class="lesson-card is-supplemental">
									<header class="lesson-header">
										<span
											class="lesson-index is-supplemental"
										>
											{{ index + 1 }}
										</span>
										<div class="lesson-title-group">
											<p class="lesson-kicker">
												Supplemental project
											</p>
											<h5>{{ item.title }}</h5>
										</div>
									</header>

									<div
										v-if="resourceLinks(item).length > 0"
										class="resource-list"
									>
										<a
											v-for="resource in resourceLinks(
												item
											)"
											:key="`${item.id}-${resource.kind}`"
											class="resource-link"
											:class="[`is-${resource.kind}`]"
											:href="resource.url"
											rel="noreferrer"
											target="_blank"
										>
											<span>{{ resource.label }}</span>
											<small>{{ resource.host }}</small>
										</a>
									</div>

									<div
										v-if="item.content"
										class="item-content-markdown"
										v-html="renderMarkdown(item.content)"
									/>

									<div
										v-if="item.mediaLink"
										class="item-media"
									>
										<video
											v-if="isVideo(item.mediaLink)"
											class="item-media-video"
											controls
											muted
											playsinline
											preload="metadata"
										>
											<source :src="item.mediaLink" />
										</video>
										<img
											v-else
											:src="item.mediaLink"
											alt="Project demo media"
											class="item-media-image"
										/>
									</div>
								</article>
							</li>
						</ol>
					</section>
				</div>

				<div v-else class="reader-empty">
					<h3>No module selected</h3>
					<p>
						Choose a module from the syllabus to open the lesson
						reader.
					</p>
				</div>
			</div>
		</div>

		<div v-else class="course-empty">
			<p>You don't have any courses assigned yet.</p>
			<p class="hint">Reach out to your tutor or admin to gain access.</p>
		</div>
	</section>
</template>

<style scoped>
.course-explorer {
	--course-border: rgba(15, 23, 42, 0.08);
	--course-border-strong: rgba(30, 41, 59, 0.12);
	--course-text: #0f172a;
	--course-text-soft: #475569;
	--course-panel: #ffffff;
	--course-panel-soft: #f8fafc;
	--course-accent: #0f766e;
	--course-accent-soft: rgba(15, 118, 110, 0.12);
	--course-shadow: 0 24px 50px -34px rgba(15, 23, 42, 0.3);
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: clamp(1.1rem, 2.5vw, 1.75rem);
	color: var(--course-text);
}

.course-shell {
	width: min(100%, 74rem);
	align-self: center;
	display: flex;
	flex-direction: column;
	gap: clamp(1rem, 2.2vw, 1.5rem);
	padding: clamp(1rem, 2vw, 1.65rem);
	border-radius: 30px;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.9),
		rgba(255, 255, 255, 0.78)
	);
	border: 1px solid rgba(255, 255, 255, 0.45);
	box-shadow: 0 40px 80px -54px rgba(15, 23, 42, 0.75);
	backdrop-filter: blur(18px);
}

.course-hero {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem 1.5rem;
	padding: 0 0 1.5rem;
	border-bottom: 1px solid rgba(148, 163, 184, 0.26);
}

.course-hero-copy {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	flex: 1 1 34rem;
	min-width: 0;
}

.course-eyebrow,
.outline-eyebrow,
.reader-eyebrow,
.section-eyebrow,
.lesson-kicker {
	margin: 0;
	font-size: 0.76rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--course-accent);
}

.course-hero h2,
.reader-header h3,
.section-header h4,
.outline-header h3,
.reader-empty h3 {
	margin: 0;
}

.course-hero h2 {
	font-size: clamp(2rem, 3.8vw, 3.1rem);
	line-height: 1.08;
}

.course-description,
.outline-header p,
.reader-copy p,
.reader-empty p,
.results-copy {
	margin: 0;
	line-height: 1.7;
	color: var(--course-text-soft);
}

.course-description {
	max-width: 42rem;
	font-size: 1.04rem;
}

.course-stats {
	width: min(100%, 22rem);
	flex: 0 1 22rem;
	display: grid;
	grid-template-columns: repeat(3, minmax(7rem, 1fr));
	gap: 0;
	margin: 0;
	border-radius: 22px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.66);
	border: 1px solid rgba(148, 163, 184, 0.22);
	box-shadow: 0 24px 45px -38px rgba(15, 23, 42, 0.55);
}

.stat {
	padding: 1rem 1.15rem 1.15rem;
	background: transparent;
	border-right: 1px solid rgba(148, 163, 184, 0.18);
	min-height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.stat:last-child {
	border-right: none;
}

.stat dt {
	margin: 0;
	font-size: 0.82rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #0f766e;
}

.stat dd {
	margin: 0.45rem 0 0;
	font-size: clamp(1.3rem, 3vw, 1.8rem);
	font-weight: 700;
	color: var(--course-text);
}

.course-toolbar {
	display: grid;
	grid-template-columns: minmax(14rem, 17rem) minmax(0, 1fr);
	gap: 1rem 1.25rem;
	align-items: end;
	padding: 1.1rem 1.15rem;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(148, 163, 184, 0.18);
}

.control-block {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
}

.control-label {
	font-size: 0.82rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--course-text-soft);
}

.course-select,
.course-search {
	width: 100%;
	border-radius: 16px;
	border: 1px solid var(--course-border-strong);
	background: var(--course-panel);
	color: var(--course-text);
	font-size: 1rem;
	padding: 0.9rem 1rem;
	box-shadow: 0 16px 32px -28px rgba(15, 23, 42, 0.45);
}

.search-block {
	min-width: 0;
}

.search-shell {
	display: flex;
	align-items: center;
	gap: 0.65rem;
}

.course-search {
	min-width: 0;
}

.clear-search,
.outline-reset {
	border: none;
	border-radius: 999px;
	padding: 0.75rem 1rem;
	font-size: 0.9rem;
	font-weight: 700;
	background: rgba(15, 23, 42, 0.08);
	color: var(--course-text);
	white-space: nowrap;
	transition:
		background 0.2s ease,
		transform 0.2s ease;
}

.clear-search:hover,
.outline-reset:hover {
	background: rgba(15, 23, 42, 0.12);
	transform: translateY(-1px);
}

.course-select:focus-visible,
.course-search:focus-visible,
.clear-search:focus-visible,
.outline-reset:focus-visible,
.outline-button:focus-visible,
.resource-link:focus-visible,
.jump-link:focus-visible {
	outline: 2px solid #0f766e;
	outline-offset: 3px;
}

.results-copy {
	grid-column: 1 / -1;
	max-width: none;
	font-size: 0.92rem;
	text-align: left;
}

.course-workspace {
	display: grid;
	grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
	gap: 0;
	align-items: stretch;
	min-height: min(72vh, 68rem);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 30px;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 34px 70px -50px rgba(15, 23, 42, 0.58);
	overflow: hidden;
}

.course-outline,
.course-reader,
.reader-empty {
	border: none;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
}

.course-outline {
	position: sticky;
	top: 1rem;
	padding: 1.5rem 1.15rem 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background:
		radial-gradient(
			circle at top left,
			rgba(125, 211, 252, 0.2),
			transparent 42%
		),
		linear-gradient(180deg, rgba(241, 245, 249, 0.96), #ffffff);
	border-right: 1px solid rgba(148, 163, 184, 0.18);
}

.outline-header {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	padding: 0.35rem 0.25rem 0.1rem;
}

.outline-list {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	max-height: calc(100vh - 19rem);
	overflow: auto;
	padding-right: 0.2rem;
}

.outline-button {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 0.9rem;
	align-items: start;
	padding: 0.9rem 0.95rem;
	border: 1px solid transparent;
	border-radius: 18px;
	background: transparent;
	color: var(--course-text);
	text-align: left;
	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

.outline-button:hover {
	transform: translateY(-1px);
	background: rgba(15, 118, 110, 0.06);
}

.outline-button[aria-current="true"] {
	border-color: rgba(15, 118, 110, 0.12);
	background: linear-gradient(
		135deg,
		rgba(15, 118, 110, 0.09),
		rgba(14, 165, 233, 0.06)
	);
	box-shadow: 0 18px 34px -30px rgba(15, 118, 110, 0.32);
}

.outline-position,
.lesson-index {
	width: 2.5rem;
	height: 2.5rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	font-weight: 700;
	font-size: 0.92rem;
	background: rgba(15, 23, 42, 0.06);
	color: var(--course-text);
	flex-shrink: 0;
}

.outline-button[aria-current="true"] .outline-position,
.lesson-index {
	background: var(--course-accent-soft);
	color: var(--course-accent);
}

.outline-copy {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	min-width: 0;
}

.outline-copy strong {
	font-size: 0.98rem;
	line-height: 1.35;
}

.outline-copy small {
	color: var(--course-text-soft);
	line-height: 1.5;
}

.outline-empty,
.reader-empty {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.85rem;
}

.outline-empty {
	padding: 0.45rem 0.25rem 0.25rem;
}

.outline-empty h4 {
	margin: 0;
	font-size: 1rem;
}

.outline-empty p {
	margin: 0;
	line-height: 1.6;
	color: var(--course-text-soft);
}

.course-reader,
.reader-empty {
	padding: clamp(1.4rem, 2.8vw, 2.4rem);
}

.course-reader {
	display: flex;
	flex-direction: column;
	gap: 1.85rem;
	background: linear-gradient(
		180deg,
		rgba(255, 255, 255, 0.96),
		rgba(248, 250, 252, 0.94)
	);
}

.reader-header {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-bottom: 1.35rem;
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.reader-copy {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
}

.reader-jump-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.jump-link,
.resource-link {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	gap: 0.5rem;
	padding: 0.6rem 0.85rem;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	background: rgba(248, 250, 252, 0.9);
	text-decoration: none;
	color: var(--course-text);
	transition:
		transform 0.2s ease,
		border-color 0.2s ease,
		background 0.2s ease;
}

.jump-link:hover,
.resource-link:hover {
	transform: translateY(-1px);
	border-color: rgba(15, 118, 110, 0.22);
	background: rgba(240, 253, 250, 0.95);
}

.jump-link {
	font-size: 0.85rem;
	line-height: 1.45;
}

.jump-link.is-supplemental {
	background: rgba(255, 247, 237, 0.85);
}

.reader-section {
	display: flex;
	flex-direction: column;
	gap: 0.9rem;
}

.section-header {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 1rem;
}

.section-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 2.4rem;
	height: 2.4rem;
	padding: 0 0.8rem;
	border-radius: 999px;
	background: rgba(15, 23, 42, 0.06);
	font-weight: 700;
	color: var(--course-text);
}

.lesson-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0;
	border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.lesson-item + .lesson-item {
	border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.lesson-card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: clamp(1.2rem, 2.6vw, 1.5rem) 0;
	border: none;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
}

.lesson-card.is-supplemental {
	padding-left: clamp(1rem, 2.2vw, 1.35rem);
	border-left: 3px solid rgba(245, 158, 11, 0.22);
}

.lesson-header {
	display: flex;
	align-items: flex-start;
	gap: 0.9rem;
}

.lesson-index.is-supplemental {
	background: rgba(245, 158, 11, 0.14);
	color: #b45309;
}

.lesson-title-group {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	min-width: 0;
}

.lesson-title-group h5 {
	margin: 0;
	font-size: clamp(1.02rem, 2vw, 1.2rem);
	line-height: 1.35;
}

.resource-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.resource-link {
	min-width: 0;
}

.resource-link small {
	font-size: 0.78rem;
	color: var(--course-text-soft);
	white-space: nowrap;
}

.resource-link.is-project {
	background: rgba(236, 253, 245, 0.92);
}

.resource-link.is-solution {
	background: rgba(239, 246, 255, 0.94);
}

.resource-link.is-dataset {
	background: rgba(255, 247, 237, 0.94);
}

.item-content-markdown {
	max-width: 82ch;
	font-size: 1.02rem;
	line-height: 1.8;
	color: #1e293b;
}

.item-content-markdown :deep(h1),
.item-content-markdown :deep(h2),
.item-content-markdown :deep(h3),
.item-content-markdown :deep(h4) {
	margin: 0 0 0.85rem;
	line-height: 1.3;
	color: #0f172a;
}

.item-content-markdown :deep(p),
.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol),
.item-content-markdown :deep(blockquote) {
	margin: 0 0 0.95rem;
}

.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol) {
	padding-left: 1.35rem;
}

.item-content-markdown :deep(a) {
	color: #0f766e;
	font-weight: 600;
}

.item-content-markdown :deep(code) {
	font-family:
		"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono",
		monospace;
	font-size: 0.88rem;
	background: rgba(15, 23, 42, 0.08);
	padding: 0.15rem 0.4rem;
	border-radius: 0.35rem;
}

.item-content-markdown :deep(pre) {
	padding: 0.95rem 1rem;
	border-radius: 16px;
	background: #0f172a;
	color: #e2e8f0;
	overflow-x: auto;
}

.item-content-markdown :deep(pre code) {
	padding: 0;
	background: transparent;
	color: inherit;
}

.item-media {
	width: 100%;
	max-width: 100%;
}

.item-media-video,
.item-media-image {
	display: block;
	width: 100%;
	max-width: 100%;
	height: auto;
	border-radius: 18px;
	background: #e2e8f0;
}

.course-empty {
	padding: 2rem;
	border-radius: 24px;
	background: linear-gradient(180deg, #f8fafc, #ffffff);
	border: 1px solid var(--course-border);
	text-align: center;
	box-shadow: var(--course-shadow);
}

.course-empty p {
	margin: 0;
}

.course-empty .hint {
	margin-top: 0.55rem;
	color: var(--course-text-soft);
}

@media (max-width: 1080px) {
	.course-workspace {
		grid-template-columns: 1fr;
	}

	.course-outline {
		position: static;
		border-right: none;
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
	}

	.outline-list {
		max-height: none;
	}
}

@media (max-width: 820px) {
	.course-hero,
	.course-toolbar {
		grid-template-columns: 1fr;
	}

	.course-stats {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		width: 100%;
	}
}

@media (max-width: 640px) {
	.course-shell {
		padding: 0.85rem;
		border-radius: 24px;
	}

	.course-stats {
		grid-template-columns: 1fr;
	}

	.search-shell,
	.lesson-header,
	.section-header {
		flex-direction: column;
		align-items: stretch;
	}

	.resource-link,
	.jump-link {
		width: 100%;
		justify-content: space-between;
	}

	.outline-button {
		grid-template-columns: auto minmax(0, 1fr);
	}

	.course-outline,
	.course-reader,
	.reader-empty {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.lesson-card.is-supplemental {
		padding-left: 0.85rem;
	}
}
</style>
