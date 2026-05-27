<script lang="ts" setup>
import type { CodePreviewResource } from "@/modules/codePreview";
import type { CourseProgress, User } from "@/stores/app";
import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "@/stores/courses";
import { storeToRefs } from "pinia";
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	watch
} from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import CodePreview from "./CodePreview.vue";
import LazyMarkdownContent from "./LazyMarkdownContent.vue";

const props = withDefaults(
	defineProps<{
		publicCatalog?: boolean;
	}>(),
	{
		publicCatalog: false
	}
);

interface VisibleModule extends CourseModule {
	position: number;
	totalItemCount: number;
	visibleItemCount: number;
	isFiltered: boolean;
}

interface ResourceLink {
	host: string;
	kind: "project" | "solution" | "dataset" | "media";
	label: string;
	url: string;
}

const IMAGE_FILE_RE = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?|$)/i;
const VIDEO_FILE_RE = /\.(?:mp4|webm|ogg)(?:\?|$)/i;
const WHITESPACE_RE = /\s+/g;
const WWW_PREFIX_RE = /^www\./;
const REFERENCE_TITLE_RE = /reference/i;
const STARTER_RE = /starter/i;
const CAPSTONE_TITLE_RE = /capstone|master project/i;
const PROJECT_PREFIX_RE = /^Project:\s*/i;
const COURSE_SELECTION_STORAGE_KEY = "classes:course-explorer:selected-course";
const MODULE_SELECTION_STORAGE_KEY_PREFIX =
	"classes:course-explorer:active-module:";

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const appStore = useAppStore();
const { currentTutor, currentAdmin, currentUser, users } =
	storeToRefs(appStore);

const searchQuery = ref("");
const selectedCourseId = ref("");
const selectedLearnerId = ref("");
const activeModuleId = ref("");
const selectedCourse = shallowRef<CourseDefinition | null>(null);
const courseLoadError = ref("");
const isCourseLoading = ref(false);
const managedLearnersLoading = ref(false);
const managedLearnersError = ref("");
const progressSaveStatus = ref<
	"idle" | "unsaved" | "saving" | "saved" | "error"
>("idle");
const progressSaveError = ref("");
const progressDrafts = ref<Record<string, CourseProgress>>({});
const isStorageReady = ref(false);
const hasRestoredStoredCourse = ref(false);
const prefersReducedMotion = ref(false);
let reducedMotionQuery: MediaQueryList | null = null;
let progressSaveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingProgressSave: {
	courseId: string;
	progress: CourseProgress;
	userID: string;
} | null = null;

const allCourses = computed(() => courses.value ?? []);

const canViewSolutions = computed(
	() => !!currentTutor.value || !!currentAdmin.value
);

const isStaffContext = computed(
	() => !props.publicCatalog && (!!currentTutor.value || !!currentAdmin.value)
);

const managedLearners = computed(() =>
	isStaffContext.value ? users.value : []
);

const selectedLearner = computed(
	() =>
		managedLearners.value.find(
			user => user._id === selectedLearnerId.value
		) ?? null
);

const progressOwner = computed<User | null>(() => {
	if (isStaffContext.value) return selectedLearner.value;
	return currentUser.value;
});

const permittedCourseIds = computed(() => {
	if (isStaffContext.value) {
		return selectedLearner.value?.courseAccess ?? [];
	}
	if (currentTutor.value) return currentTutor.value.coursePermissions ?? [];
	if (currentUser.value) return currentUser.value.courseAccess ?? [];
	return [];
});

const courseList = computed(() => {
	if (props.publicCatalog) return allCourses.value;
	const allowed = new Set(permittedCourseIds.value);
	return allCourses.value.filter(course => allowed.has(course.id));
});

const hasCourseAccess = computed(() => {
	if (props.publicCatalog) return courseList.value.length > 0;
	return isStaffContext.value || courseList.value.length > 0;
});

const courseEyebrow = computed(() =>
	props.publicCatalog ? "Course preview" : "Current course"
);

const courseDescription = computed(() =>
	props.publicCatalog
		? "Open modules, projects, and supplemental resources from this course."
		: isStaffContext.value
			? "Choose a learner, open one of their assigned courses, and mark progress directly inside the syllabus."
			: "Use the controls below to switch courses or search inside this syllabus."
);

const emptyTitle = computed(() =>
	props.publicCatalog
		? "No courses are available right now."
		: isStaffContext.value
			? "Choose a learner to open their courses."
			: "You don't have any courses assigned yet."
);

const emptyHint = computed(() =>
	props.publicCatalog
		? "Check back soon for updates to the course library."
		: isStaffContext.value
			? "If a learner has no courses, update their access from Admin > People and access."
			: "Email if access should already be enabled."
);

const canEditProgress = computed(
	() =>
		isStaffContext.value &&
		!!selectedLearner.value &&
		!!selectedCourseId.value
);

const progressSaveStatusText = computed(() => {
	switch (progressSaveStatus.value) {
		case "unsaved":
			return "Unsaved changes";
		case "saving":
			return "Saving...";
		case "saved":
			return "Saved";
		case "error":
			return progressSaveError.value || "Couldn't save progress";
		default:
			return selectedLearner.value
				? "Progress ready"
				: "Select a learner";
	}
});

const normalizedQuery = computed(() => normalizeSearch(searchQuery.value));

watch(
	[
		isStaffContext,
		() => currentAdmin.value?._id,
		() => currentTutor.value?._id
	],
	async ([staffContext]) => {
		if (!staffContext) {
			selectedLearnerId.value = "";
			managedLearnersError.value = "";
			return;
		}

		await loadManagedLearners();
	},
	{ immediate: true }
);

watch(
	managedLearners,
	value => {
		if (!isStaffContext.value) return;

		if (value.length === 0) {
			selectedLearnerId.value = "";
			return;
		}

		if (!value.some(user => user._id === selectedLearnerId.value)) {
			selectedLearnerId.value = value[0]._id;
		}
	},
	{ immediate: true }
);

watch([selectedLearnerId, selectedCourseId], () => {
	void flushPendingProgressSave();
});

watch(
	[courseList, isStorageReady],
	([availableCourses, storageReady]) => {
		if (availableCourses.length === 0) {
			selectedCourseId.value = "";
			return;
		}

		if (storageReady && !hasRestoredStoredCourse.value) {
			const storedCourseId = readStoredValue(
				COURSE_SELECTION_STORAGE_KEY
			);

			if (
				storedCourseId &&
				availableCourses.some(course => course.id === storedCourseId)
			) {
				selectedCourseId.value = storedCourseId;
				hasRestoredStoredCourse.value = true;
				return;
			}

			hasRestoredStoredCourse.value = true;
		}

		if (
			!selectedCourseId.value ||
			!availableCourses.some(
				course => course.id === selectedCourseId.value
			)
		) {
			selectedCourseId.value = availableCourses[0].id;
		}
	},
	{ immediate: true }
);

watch(
	[selectedCourseId, canViewSolutions],
	async ([courseId], _previousValue, onCleanup) => {
		if (!courseId) {
			selectedCourse.value = null;
			courseLoadError.value = "";
			isCourseLoading.value = false;
			return;
		}

		let cancelled = false;
		onCleanup(() => {
			cancelled = true;
		});

		isCourseLoading.value = true;
		courseLoadError.value = "";

		const course = await coursesStore.loadCourseById(courseId);

		if (cancelled) {
			return;
		}

		selectedCourse.value = course;
		courseLoadError.value = course
			? ""
			: "Unable to load this course right now.";
		isCourseLoading.value = false;
	},
	{ immediate: true }
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
	const completedModuleCount = course.modules.filter(module =>
		isModuleComplete(module)
	).length;
	const completedItemCount = course.modules.reduce(
		(total, module) =>
			total +
			[...module.curriculum, ...module.supplementalProjects].filter(
				item => isItemComplete(item)
			).length,
		0
	);

	return {
		moduleCount: course.modules.length,
		lessonCount,
		supplementalCount,
		completedModuleCount,
		completedItemCount,
		totalItemCount: lessonCount + supplementalCount
	};
});

const selectedCourseProgress = computed(() => {
	const courseId = selectedCourseId.value;
	const owner = progressOwner.value;
	if (!courseId || !owner) return null;
	return progressFor(owner, courseId);
});

const hasProgressTracking = computed(
	() => !props.publicCatalog && !!progressOwner.value
);

const completedModuleIdSet = computed(
	() => new Set(selectedCourseProgress.value?.completedModuleIds ?? [])
);

const completedItemIdSet = computed(
	() => new Set(selectedCourseProgress.value?.completedItemIds ?? [])
);

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
	[visibleModules, selectedCourseId, isStorageReady],
	([modules, courseId, storageReady]) => {
		if (modules.length === 0 || !courseId) {
			activeModuleId.value = "";
			return;
		}

		if (modules.some(module => module.id === activeModuleId.value)) {
			return;
		}

		if (storageReady) {
			const storedModuleId = readStoredValue(
				moduleSelectionStorageKey(courseId)
			);

			if (
				storedModuleId &&
				modules.some(module => module.id === storedModuleId)
			) {
				activeModuleId.value = storedModuleId;
				return;
			}
		}

		activeModuleId.value = modules[0].id;
	},
	{ immediate: true }
);

const activeModule = computed(
	() =>
		visibleModules.value.find(
			module => module.id === activeModuleId.value
		) ?? null
);

const courseReaderStatus = computed(() => {
	if (!selectedCourse.value || !activeModule.value) return "";
	const searchContext = normalizedQuery.value
		? `${visibleModules.value.length} matching module${
				visibleModules.value.length === 1 ? "" : "s"
			}. `
		: "";
	return `${searchContext}Showing module ${activeModule.value.position}: ${activeModule.value.title}.`;
});

const activeModuleProjectLinks = computed(() => {
	const module = activeModule.value;
	if (!module) return [];

	return module.curriculum.map((item, index) => ({
		id: itemAnchorId(module.id, item.id),
		label: `${index + 1}. ${item.title}`
	}));
});

const activeModuleSupplementalLinks = computed(() => {
	const module = activeModule.value;
	if (!module) return [];

	return module.supplementalProjects.map((item, index) => ({
		id: itemAnchorId(module.id, item.id),
		label: `${index + 1}. ${item.title.replace(PROJECT_PREFIX_RE, "")}`
	}));
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

function progressIds(entity: { aliases?: string[]; id: string }) {
	return [entity.id, ...(entity.aliases ?? [])];
}

function isModuleComplete(module: CourseModule) {
	return progressIds(module).some(id => completedModuleIdSet.value.has(id));
}

function isItemComplete(item: CourseModuleItem) {
	return progressIds(item).some(id => completedItemIdSet.value.has(id));
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

async function loadManagedLearners() {
	if (!isStaffContext.value) return;

	managedLearnersLoading.value = true;
	managedLearnersError.value = "";

	try {
		if (currentAdmin.value) {
			await appStore.fetchUsers();
			return;
		}

		if (currentTutor.value) {
			const { data } = await api.get<User[]>(
				`/users/oftutor/${currentTutor.value._id}`
			);
			appStore.setUsers(data);
		}
	} catch (error: any) {
		managedLearnersError.value =
			error.response?.data?.message ??
			error.message ??
			"Unable to load learners.";
	} finally {
		managedLearnersLoading.value = false;
	}
}

function progressKey(userID: string, courseId: string) {
	return `${userID}:${courseId}`;
}

function cleanProgress(progress: CourseProgress): CourseProgress {
	return {
		courseId: progress.courseId,
		completedModuleIds: unique(progress.completedModuleIds ?? []),
		completedItemIds: unique(progress.completedItemIds ?? []),
		...(progress.updatedAt ? { updatedAt: progress.updatedAt } : {}),
		...(progress.updatedBy ? { updatedBy: progress.updatedBy } : {}),
		...(progress.updatedByRole
			? { updatedByRole: progress.updatedByRole }
			: {})
	};
}

function progressFor(owner: User, courseId: string): CourseProgress {
	const key = progressKey(owner._id, courseId);
	const draft = progressDrafts.value[key];
	if (draft) return draft;

	const saved = owner.courseProgress?.find(
		progress => progress.courseId === courseId
	);

	return cleanProgress(
		saved ?? {
			courseId,
			completedModuleIds: [],
			completedItemIds: []
		}
	);
}

function updateProgressDraft(
	userID: string,
	courseId: string,
	updater: (progress: CourseProgress) => CourseProgress
) {
	const owner = progressOwner.value;
	if (!owner || owner._id !== userID) return;

	const next = cleanProgress(updater(progressFor(owner, courseId)));
	progressDrafts.value = {
		...progressDrafts.value,
		[progressKey(userID, courseId)]: next
	};
	queueProgressSave(userID, courseId, next);
}

function toggleModuleProgress(module: CourseModule, checked: boolean) {
	const learner = selectedLearner.value;
	const courseId = selectedCourseId.value;
	if (!canEditProgress.value || !learner || !courseId) return;

	updateProgressDraft(learner._id, courseId, progress => ({
		...progress,
		completedModuleIds: checked
			? unique([...progress.completedModuleIds, module.id])
			: progress.completedModuleIds.filter(
					id => !progressIds(module).includes(id)
				)
	}));
}

function toggleItemProgress(item: CourseModuleItem, checked: boolean) {
	const learner = selectedLearner.value;
	const courseId = selectedCourseId.value;
	if (!canEditProgress.value || !learner || !courseId) return;

	updateProgressDraft(learner._id, courseId, progress => ({
		...progress,
		completedItemIds: checked
			? unique([...progress.completedItemIds, item.id])
			: progress.completedItemIds.filter(
					id => !progressIds(item).includes(id)
				)
	}));
}

function unique(values: string[]) {
	return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

function queueProgressSave(
	userID: string,
	courseId: string,
	progress: CourseProgress
) {
	if (progressSaveTimer) clearTimeout(progressSaveTimer);

	pendingProgressSave = {
		userID,
		courseId,
		progress: cleanProgress(progress)
	};
	progressSaveStatus.value = "unsaved";
	progressSaveError.value = "";

	progressSaveTimer = setTimeout(() => {
		void flushPendingProgressSave();
	}, 700);
}

async function flushPendingProgressSave() {
	if (!pendingProgressSave) return;
	if (progressSaveTimer) {
		clearTimeout(progressSaveTimer);
		progressSaveTimer = null;
	}

	const pending = pendingProgressSave;
	progressSaveStatus.value = "saving";
	progressSaveError.value = "";

	try {
		await api.put(`/users/${pending.userID}/course-progress`, {
			courseId: pending.courseId,
			completedModuleIds: pending.progress.completedModuleIds,
			completedItemIds: pending.progress.completedItemIds
		});

		updateStoredUserProgress(
			pending.userID,
			cleanProgress(pending.progress)
		);
		pendingProgressSave = null;
		progressSaveStatus.value = "saved";
	} catch (error: any) {
		progressSaveStatus.value = "error";
		progressSaveError.value =
			error.response?.data?.message ??
			error.message ??
			"Couldn't save progress.";
	}
}

function retryProgressSave() {
	void flushPendingProgressSave();
}

function updateStoredUserProgress(userID: string, progress: CourseProgress) {
	const updateUser = (user: User): User => {
		if (user._id !== userID) return user;

		const existing = user.courseProgress ?? [];
		const nextProgress = [
			...existing.filter(item => item.courseId !== progress.courseId),
			progress
		];

		return {
			...user,
			courseProgress: nextProgress
		};
	};

	appStore.setUsers(users.value.map(updateUser));
	if (currentUser.value?._id === userID) {
		appStore.setCurrentUser(updateUser(currentUser.value));
	}
}

function itemAnchorId(moduleId: string, itemId: string) {
	return `${moduleId}-${itemId}`;
}

function isVideo(link: string) {
	return VIDEO_FILE_RE.test(link);
}

function isImage(link: string) {
	return IMAGE_FILE_RE.test(link);
}

function isEmbeddedMedia(link: string) {
	return isVideo(link) || isImage(link);
}

function linkHost(url: string) {
	if (url.startsWith("/course-assets/")) {
		return "Course asset";
	}

	try {
		return new URL(url).hostname.replace(WWW_PREFIX_RE, "");
	} catch {
		return url;
	}
}

function projectLabel(item: CourseModuleItem, url: string) {
	const normalizedTitle = item.title.toLowerCase();
	const normalizedUrl = url.toLowerCase();

	if (REFERENCE_TITLE_RE.test(normalizedTitle)) {
		return "Reference";
	}

	if (STARTER_RE.test(normalizedTitle) || STARTER_RE.test(normalizedUrl)) {
		return "Starter project";
	}

	if (CAPSTONE_TITLE_RE.test(normalizedTitle)) {
		return "Capstone repo";
	}

	if (normalizedUrl.includes("scratch.mit.edu")) {
		return "Scratch project";
	}

	if (normalizedUrl.includes("github.com")) {
		return "Project repo";
	}

	return "Project link";
}

function solutionLabel(url: string) {
	const normalizedUrl = url.toLowerCase();

	if (
		normalizedUrl.includes("answer-key") ||
		normalizedUrl.includes("rubric")
	) {
		return "Rubric / answer key";
	}

	if (normalizedUrl.includes("scratch.mit.edu")) {
		return "Scratch solution";
	}

	if (normalizedUrl.includes("github.com")) {
		return "Solution repo";
	}

	return "Solution link";
}

function datasetLabel(url: string) {
	const normalizedUrl = url.toLowerCase();

	if (normalizedUrl.includes("chemistry-materials-pack")) {
		if (normalizedUrl.includes("measurement")) {
			return "Measurement tables";
		}
		if (normalizedUrl.includes("matter-and-classification")) {
			return "Matter cards";
		}
		if (normalizedUrl.includes("physical-and-chemical-change")) {
			return "Change cards";
		}
		if (normalizedUrl.includes("isotope")) {
			return "Isotope table";
		}
		if (normalizedUrl.includes("ion-and-formula")) {
			return "Ion cards";
		}
		if (normalizedUrl.includes("periodic-trend")) {
			return "Trend table";
		}
		if (normalizedUrl.includes("bonding-and-formula")) {
			return "Bonding cards";
		}
		if (normalizedUrl.includes("heating-curve")) {
			return "Heating curve data";
		}
		if (normalizedUrl.includes("intermolecular")) {
			return "Property cards";
		}
		if (normalizedUrl.includes("reaction-type")) {
			return "Reaction cards";
		}
		if (normalizedUrl.includes("concentration-and-ph")) {
			return "Solution tables";
		}
		if (normalizedUrl.includes("molar-mass")) {
			return "Mole practice set";
		}
		if (normalizedUrl.includes("stoichiometry-error")) {
			return "Error cases";
		}
		if (normalizedUrl.includes("capstone-evidence")) {
			return "Evidence seeds";
		}

		return "Chemistry materials";
	}

	if (normalizedUrl.includes("periodictable")) {
		return "ACS periodic table";
	}

	if (normalizedUrl.includes("middle-and-high-school-chemistry")) {
		return "ACS chemistry guidelines";
	}

	if (normalizedUrl.includes("acs.org")) {
		return "ACS chemistry reference";
	}

	if (normalizedUrl.includes("nist.gov")) {
		return "NIST SI units";
	}

	if (normalizedUrl.includes("nextgenscience.org")) {
		return "NGSS appendices";
	}

	if (normalizedUrl.includes("pubchem.ncbi.nlm.nih.gov")) {
		return "Chemistry database";
	}

	if (
		normalizedUrl.includes("nasa.gov") ||
		normalizedUrl.includes("noaa.gov") ||
		normalizedUrl.includes("usgs.gov") ||
		normalizedUrl.includes("biointeractive.org")
	) {
		return "Science resource";
	}

	return "Dataset";
}

function mediaLabel(url: string) {
	const normalizedUrl = url.toLowerCase();

	if (normalizedUrl.includes("phet.colorado.edu/en/simulations/filter")) {
		return "Simulation collection";
	}

	if (normalizedUrl.includes("phet.colorado.edu")) {
		return "PhET simulation";
	}

	return "Media resource";
}

function resourceLinks(item: CourseModuleItem): ResourceLink[] {
	const links: ResourceLink[] = [];
	const projectUrl = item.projectLink?.trim();
	const solutionUrl = item.solutionLink?.trim();
	const datasetUrl = item.datasetLink?.trim();
	const mediaUrl = item.mediaLink?.trim();

	if (projectUrl) {
		links.push({
			kind: "project",
			label: projectLabel(item, projectUrl),
			url: projectUrl,
			host: linkHost(projectUrl)
		});
	}

	if (canViewSolutions.value && solutionUrl && solutionUrl !== projectUrl) {
		links.push({
			kind: "solution",
			label: solutionLabel(solutionUrl),
			url: solutionUrl,
			host: linkHost(solutionUrl)
		});
	}

	if (datasetUrl) {
		links.push({
			kind: "dataset",
			label: datasetLabel(datasetUrl),
			url: datasetUrl,
			host: linkHost(datasetUrl)
		});
	}

	if (mediaUrl && !isEmbeddedMedia(mediaUrl)) {
		links.push({
			kind: "media",
			label: mediaLabel(mediaUrl),
			url: mediaUrl,
			host: linkHost(mediaUrl)
		});
	}

	return links;
}

function codePreviewResources(item: CourseModuleItem): CodePreviewResource[] {
	return resourceLinks(item)
		.filter(
			(
				resource
			): resource is ResourceLink & {
				kind: "project" | "solution";
			} =>
				(resource.kind === "project" || resource.kind === "solution") &&
				resource.host === "github.com"
		)
		.map(resource => ({
			kind: resource.kind,
			label: resource.label,
			url: resource.url,
			host: resource.host
		}));
}

watch(selectedCourseId, value => {
	if (!isStorageReady.value) return;
	writeStoredValue(COURSE_SELECTION_STORAGE_KEY, value);
});

watch([activeModuleId, selectedCourseId], ([moduleId, courseId]) => {
	if (!isStorageReady.value || !courseId) return;
	writeStoredValue(moduleSelectionStorageKey(courseId), moduleId);
});

function syncReducedMotionPreference(event?: MediaQueryListEvent) {
	prefersReducedMotion.value =
		event?.matches ?? reducedMotionQuery?.matches ?? false;
}

onMounted(() => {
	isStorageReady.value = true;
	if (
		typeof window !== "undefined" &&
		typeof window.matchMedia === "function"
	) {
		reducedMotionQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		syncReducedMotionPreference();
		reducedMotionQuery.addEventListener(
			"change",
			syncReducedMotionPreference
		);
	}

	if (typeof document !== "undefined") {
		document.addEventListener("visibilitychange", handleVisibilityChange);
	}
});

onBeforeUnmount(() => {
	if (progressSaveTimer) {
		clearTimeout(progressSaveTimer);
		progressSaveTimer = null;
	}
	void flushPendingProgressSave();
	reducedMotionQuery?.removeEventListener(
		"change",
		syncReducedMotionPreference
	);
	reducedMotionQuery = null;
	if (typeof document !== "undefined") {
		document.removeEventListener(
			"visibilitychange",
			handleVisibilityChange
		);
	}
});

function handleVisibilityChange() {
	if (document.visibilityState === "hidden") {
		void flushPendingProgressSave();
	}
}

function moduleSelectionStorageKey(courseId: string) {
	return `${MODULE_SELECTION_STORAGE_KEY_PREFIX}${courseId}`;
}

function readStoredValue(key: string) {
	if (typeof window === "undefined") return null;

	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStoredValue(key: string, value: string) {
	if (typeof window === "undefined") return;

	try {
		if (value) {
			window.localStorage.setItem(key, value);
			return;
		}

		window.localStorage.removeItem(key);
	} catch {}
}
</script>

<template>
	<section class="course-explorer">
		<p class="sr-only" aria-live="polite">{{ courseReaderStatus }}</p>
		<div v-if="hasCourseAccess" class="course-shell">
			<header v-if="selectedCourse && courseStats" class="course-hero">
				<div class="course-hero-copy">
					<p class="course-eyebrow">{{ courseEyebrow }}</p>
					<h2>{{ selectedCourse.name }}</h2>
					<p class="course-description">
						{{ courseDescription }}
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
					<div v-if="hasProgressTracking" class="stat is-progress">
						<dt>Done</dt>
						<dd>
							<span>
								{{ courseStats.completedModuleCount }}/{{
									courseStats.moduleCount
								}}
							</span>
							<small>
								{{ courseStats.completedItemCount }}/{{
									courseStats.totalItemCount
								}}
								items
							</small>
						</dd>
					</div>
				</dl>
			</header>

			<div v-if="isStaffContext" class="staff-context-bar">
				<label class="control-block" for="learner-select">
					<span class="control-label">Learner context</span>
					<select
						id="learner-select"
						v-model="selectedLearnerId"
						class="course-select"
						:disabled="
							managedLearnersLoading ||
							managedLearners.length === 0
						"
					>
						<option disabled value="">
							{{
								managedLearnersLoading
									? "Loading learners..."
									: "Select a learner"
							}}
						</option>
						<option
							v-for="learner in managedLearners"
							:key="learner._id"
							:value="learner._id"
						>
							{{ learner.name }} · {{ learner.email }}
						</option>
					</select>
				</label>

				<div class="staff-context-status">
					<p
						class="progress-save-status"
						:class="`is-${progressSaveStatus}`"
						:role="
							progressSaveStatus === 'error' ? 'alert' : 'status'
						"
						aria-live="polite"
					>
						{{ progressSaveStatusText }}
					</p>
					<p
						v-if="managedLearnersError"
						class="progress-save-status is-error"
						role="alert"
					>
						{{ managedLearnersError }}
					</p>
					<button
						v-if="progressSaveStatus === 'error'"
						class="retry-save"
						type="button"
						@click="retryProgressSave"
					>
						Retry save
					</button>
				</div>
			</div>

			<div class="course-toolbar">
				<label class="control-block" for="course-select">
					<span class="control-label">Course</span>
					<select
						id="course-select"
						v-model="selectedCourseId"
						class="course-select"
						:disabled="courseList.length === 0"
						@change="selectCourse(selectedCourseId)"
					>
						<option
							v-if="courseList.length === 0"
							disabled
							value=""
						>
							No assigned courses
						</option>
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
			</div>

			<div v-if="selectedCourse" class="course-workspace">
				<aside class="course-outline">
					<div class="outline-header">
						<p class="outline-eyebrow">Syllabus</p>
						<h3>Choose a module</h3>
						<!--
						<p>
							The right side shows the full reading view for the
							selected module.
						</p>
						-->
					</div>

					<div v-if="visibleModules.length > 0" class="outline-list">
						<button
							v-for="module in visibleModules"
							:key="module.id"
							aria-controls="course-reader-panel"
							:aria-current="
								activeModule?.id === module.id
									? 'true'
									: undefined
							"
							:aria-label="`Show module ${module.position}: ${module.title}`"
							class="outline-button"
							:class="{
								'is-complete':
									hasProgressTracking &&
									isModuleComplete(module)
							}"
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
									<span
										v-if="
											hasProgressTracking &&
											isModuleComplete(module)
										"
										class="complete-pill"
									>
										Complete
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

				<div
					v-if="activeModule"
					id="course-reader-panel"
					class="course-reader"
				>
					<header class="reader-header">
						<div class="reader-copy">
							<p class="reader-eyebrow">
								Module {{ activeModule.position }}
							</p>
							<h3>{{ activeModule.title }}</h3>
							<label
								v-if="canEditProgress"
								class="progress-toggle is-module"
							>
								<input
									:checked="isModuleComplete(activeModule)"
									type="checkbox"
									@change="
										toggleModuleProgress(
											activeModule,
											($event.target as HTMLInputElement)
												.checked
										)
									"
								/>
								<span>Mark module complete</span>
							</label>
							<p
								v-if="
									hasProgressTracking &&
									isModuleComplete(activeModule)
								"
								class="module-complete-note"
							>
								Completed
							</p>
						</div>

						<div
							v-if="
								activeModuleProjectLinks.length > 0 ||
								activeModuleSupplementalLinks.length > 0
							"
							class="reader-link-groups"
						>
							<div
								v-if="activeModuleProjectLinks.length > 0"
								class="reader-link-group"
							>
								<h4 class="reader-link-heading">Lessons:</h4>
								<nav
									aria-label="Jump to module lesson"
									class="reader-jump-links"
								>
									<a
										v-for="link in activeModuleProjectLinks"
										:key="link.id"
										class="jump-link"
										:href="`#${link.id}`"
									>
										{{ link.label }}
									</a>
								</nav>
							</div>

							<div
								v-if="activeModuleSupplementalLinks.length > 0"
								class="reader-link-group"
							>
								<h4 class="reader-link-heading is-supplemental">
									Supplemental:
								</h4>
								<nav
									aria-label="Jump to supplemental project"
									class="reader-jump-links"
								>
									<a
										v-for="link in activeModuleSupplementalLinks"
										:key="link.id"
										class="jump-link is-supplemental"
										:href="`#${link.id}`"
									>
										{{ link.label }}
									</a>
								</nav>
							</div>
						</div>
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
										<span
											v-if="
												hasProgressTracking &&
												isItemComplete(item)
											"
											class="item-complete-badge"
										>
											Done
										</span>
										<label
											v-if="canEditProgress"
											class="progress-toggle is-item"
										>
											<input
												:checked="isItemComplete(item)"
												type="checkbox"
												@change="
													toggleItemProgress(
														item,
														(
															$event.target as HTMLInputElement
														).checked
													)
												"
											/>
											<span>Done</span>
										</label>
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
											<span class="resource-link-label">
												{{ resource.label }}
												<span class="sr-only">
													(opens in a new tab)
												</span>
											</span>
											<small class="resource-link-host">
												{{ resource.host }}
											</small>
										</a>
									</div>

									<CodePreview
										v-if="
											codePreviewResources(item).length >
											0
										"
										:resources="codePreviewResources(item)"
									/>

									<LazyMarkdownContent
										v-if="item.content"
										:content="item.content"
									/>

									<div
										v-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink)
										"
										class="item-media"
									>
										<video
											v-if="isVideo(item.mediaLink)"
											class="item-media-video"
											:autoplay="!prefersReducedMotion"
											:controls="prefersReducedMotion"
											:loop="!prefersReducedMotion"
											muted
											playsinline
											:preload="
												prefersReducedMotion
													? 'metadata'
													: 'auto'
											"
											:aria-label="`Demo video for ${item.title}`"
										>
											<source :src="item.mediaLink" />
										</video>
										<img
											v-else-if="isImage(item.mediaLink)"
											:src="item.mediaLink"
											:alt="`Project demo media for ${item.title}`"
											class="item-media-image"
											loading="lazy"
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
										<span
											v-if="
												hasProgressTracking &&
												isItemComplete(item)
											"
											class="item-complete-badge"
										>
											Done
										</span>
										<label
											v-if="canEditProgress"
											class="progress-toggle is-item"
										>
											<input
												:checked="isItemComplete(item)"
												type="checkbox"
												@change="
													toggleItemProgress(
														item,
														(
															$event.target as HTMLInputElement
														).checked
													)
												"
											/>
											<span>Done</span>
										</label>
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
											<span class="resource-link-label">
												{{ resource.label }}
												<span class="sr-only">
													(opens in a new tab)
												</span>
											</span>
											<small class="resource-link-host">
												{{ resource.host }}
											</small>
										</a>
									</div>

									<CodePreview
										v-if="
											codePreviewResources(item).length >
											0
										"
										:resources="codePreviewResources(item)"
									/>

									<LazyMarkdownContent
										v-if="item.content"
										:content="item.content"
									/>

									<div
										v-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink)
										"
										class="item-media"
									>
										<video
											v-if="isVideo(item.mediaLink)"
											class="item-media-video"
											:autoplay="!prefersReducedMotion"
											:controls="prefersReducedMotion"
											:loop="!prefersReducedMotion"
											muted
											playsinline
											:preload="
												prefersReducedMotion
													? 'metadata'
													: 'auto'
											"
											:aria-label="`Demo video for ${item.title}`"
										>
											<source :src="item.mediaLink" />
										</video>
										<img
											v-else-if="isImage(item.mediaLink)"
											:src="item.mediaLink"
											:alt="`Project demo media for ${item.title}`"
											class="item-media-image"
											loading="lazy"
										/>
									</div>
								</article>
							</li>
						</ol>
					</section>
				</div>

				<div v-else class="reader-empty">
					<h3>No module selected</h3>
					<p>Choose a module to open its lesson summaries.</p>
				</div>
			</div>

			<div v-else-if="isCourseLoading" class="reader-empty">
				<h3>Loading course</h3>
				<p>Opening the selected course.</p>
			</div>

			<div v-else-if="courseLoadError" class="reader-empty">
				<h3>Unable to open this course</h3>
				<p>{{ courseLoadError }}</p>
			</div>

			<div v-else class="reader-empty">
				<h3>{{ emptyTitle }}</h3>
				<p>{{ emptyHint }}</p>
			</div>
		</div>

		<div v-else class="course-empty">
			<p>{{ emptyTitle }}</p>
			<p class="hint">{{ emptyHint }}</p>
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
	--course-shadow: 0 20px 42px -32px rgba(15, 23, 42, 0.24);
	width: 100%;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: clamp(1.1rem, 2.5vw, 1.75rem);
	color: var(--course-text);
}

.course-explorer section {
	margin: 0;
}

.course-explorer p,
.course-explorer label,
.course-explorer select,
.course-explorer input,
.course-explorer button {
	font-family: inherit;
	text-align: left;
}

.course-shell {
	width: 100%;
	max-width: none;
	align-self: stretch;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: clamp(1rem, 2.2vw, 1.5rem);
	padding: 0;
	overflow: hidden;
}

.course-hero {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(24rem, 31rem);
	align-items: center;
	gap: 1rem 1.5rem;
	padding: 0.2rem 0.15rem 0.05rem;
}

.course-hero-copy {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
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
	font-size: clamp(1.7rem, 3vw, 2.55rem);
	line-height: 1.08;
}

.course-description,
.outline-header p,
.reader-copy p,
.reader-empty p {
	margin: 0;
	line-height: 1.7;
	color: var(--course-text-soft);
}

.course-description {
	max-width: 46rem;
	font-size: 0.98rem;
}

.course-stats {
	width: 100%;
	max-width: 31rem;
	min-width: 0;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(6.8rem, 1fr));
	gap: 0;
	margin: 0;
	border-radius: 16px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid rgba(148, 163, 184, 0.22);
	box-shadow: 0 18px 32px -28px rgba(15, 23, 42, 0.18);
}

.stat {
	padding: 1rem 1.15rem 1.15rem;
	background: transparent;
	border-right: 1px solid rgba(148, 163, 184, 0.18);
	min-height: 100%;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.stat:last-child {
	border-right: none;
}

.stat.is-progress {
	background: rgba(236, 253, 245, 0.72);
}

.stat dt {
	margin: 0;
	font-size: clamp(0.68rem, 0.78vw, 0.8rem);
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

.stat small {
	display: block;
	margin-top: 0.35rem;
	line-height: 1.35;
	color: var(--course-text-soft);
}

.course-toolbar {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(14rem, 17rem) minmax(0, 1fr);
	gap: 1rem 1.25rem;
	align-items: end;
	padding: 1.1rem 1.15rem;
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid rgba(148, 163, 184, 0.18);
}

.staff-context-bar {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(16rem, 25rem) minmax(0, 1fr);
	gap: 1rem 1.25rem;
	align-items: end;
	padding: 1.1rem 1.15rem;
	border-radius: 20px;
	background: rgba(236, 253, 245, 0.72);
	border: 1px solid rgba(15, 118, 110, 0.18);
}

.staff-context-status {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: center;
	gap: 0.65rem;
	min-width: 0;
}

.progress-save-status {
	margin: 0;
	padding: 0.65rem 0.85rem;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.76);
	color: #134e4a;
	font-weight: 800;
	line-height: 1.2;
}

.progress-save-status.is-error {
	background: rgba(254, 226, 226, 0.9);
	color: #991b1b;
}

.progress-save-status.is-saving,
.progress-save-status.is-unsaved {
	background: rgba(254, 243, 199, 0.9);
	color: #78350f;
}

.retry-save {
	border: 1px solid rgba(153, 27, 27, 0.22);
	border-radius: 999px;
	padding: 0.65rem 0.9rem;
	background: rgba(255, 255, 255, 0.84);
	color: #991b1b;
	font-weight: 800;
}

.control-block {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	min-width: 0;
	align-self: stretch;
	justify-self: stretch;
}

.search-block {
	align-self: stretch;
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
	min-height: 3.8rem;
	border-radius: 14px;
	border: 1px solid var(--course-border-strong);
	background: var(--course-panel);
	color: var(--course-text);
	font-size: 1rem;
	line-height: 1.35;
	padding: 0.9rem 1rem;
	box-shadow: 0 12px 24px -22px rgba(15, 23, 42, 0.16);
}

.course-select {
	appearance: none;
	padding-right: 3rem;
	background-image:
		linear-gradient(45deg, transparent 50%, #64748b 50%),
		linear-gradient(135deg, #64748b 50%, transparent 50%);
	background-position:
		calc(100% - 1.4rem) calc(50% - 0.15rem),
		calc(100% - 1rem) calc(50% - 0.15rem);
	background-size: 0.45rem 0.45rem;
	background-repeat: no-repeat;
}

.search-shell {
	display: flex;
	align-items: stretch;
	gap: 0.65rem;
}

.course-search {
	min-width: 0;
}

.clear-search,
.outline-reset {
	border: none;
	border-radius: 14px;
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
.jump-link:focus-visible,
.retry-save:focus-visible,
.progress-toggle:focus-within {
	outline: 2px solid var(--focus-ring-color);
	outline-offset: 3px;
}

.course-workspace {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
	gap: 0;
	align-items: stretch;
	min-height: min(72vh, 68rem);
	min-width: 0;
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 28px 56px -44px rgba(15, 23, 42, 0.28);
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
	align-self: stretch;
	min-height: 0;
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
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	max-height: none;
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
	border-radius: 14px;
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
	box-shadow: 0 16px 28px -24px rgba(15, 118, 110, 0.22);
}

.outline-button.is-complete {
	border-color: rgba(22, 163, 74, 0.2);
	background: rgba(240, 253, 244, 0.78);
}

.outline-position,
.lesson-index {
	width: 2.5rem;
	height: 2.5rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
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
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem 0.5rem;
	align-items: center;
	color: var(--course-text-soft);
	line-height: 1.5;
}

.complete-pill,
.module-complete-note,
.item-complete-badge {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	border-radius: 999px;
	background: rgba(22, 163, 74, 0.12);
	color: #166534;
	font-weight: 700;
}

.complete-pill {
	padding: 0.1rem 0.45rem;
	font-size: 0.72rem;
}

.module-complete-note {
	padding: 0.35rem 0.65rem;
	font-size: 0.82rem;
	line-height: 1.2;
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

.reader-link-groups {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.reader-link-group {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
}

.reader-link-heading {
	margin: 0;
	font-size: 1rem;
	line-height: 1.35;
	color: var(--course-text);
}

.reader-link-heading.is-supplemental {
	color: #b45309;
}

.reader-jump-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.jump-link,
.resource-link {
	display: inline-flex;
	align-items: center;
	padding: 0.6rem 0.85rem;
	border: 1px solid rgba(15, 23, 42, 0.08);
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
}

.jump-link {
	flex-direction: row;
	gap: 0.5rem;
	border-radius: 14px;
	background: rgba(248, 250, 252, 0.9);
	font-size: 0.85rem;
	line-height: 1.45;
}

.jump-link:hover {
	background: rgba(240, 253, 250, 0.95);
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
	border-radius: 14px;
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

.item-complete-badge {
	margin-left: auto;
	padding: 0.4rem 0.65rem;
	font-size: 0.78rem;
	line-height: 1.2;
	flex: 0 0 auto;
}

.progress-toggle {
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
	width: fit-content;
	border: 1px solid rgba(15, 118, 110, 0.16);
	border-radius: 999px;
	background: rgba(236, 253, 245, 0.75);
	color: #134e4a;
	font-weight: 800;
	line-height: 1.2;
}

.progress-toggle.is-module {
	padding: 0.45rem 0.7rem;
	font-size: 0.86rem;
}

.progress-toggle.is-item {
	margin-left: auto;
	padding: 0.4rem 0.65rem;
	font-size: 0.78rem;
	flex: 0 0 auto;
}

.progress-toggle input {
	width: 1rem;
	height: 1rem;
	margin: 0;
	accent-color: var(--course-accent);
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
	flex-direction: column;
	align-items: flex-start;
	gap: 0.15rem;
	padding: 0.8rem 0.95rem;
	border-radius: 14px;
	background: var(--course-resource-bg, rgba(255, 255, 255, 0.94));
	color: var(--course-resource-text, var(--course-text));
	box-shadow: 0 12px 22px -22px rgba(15, 23, 42, 0.18);
}

.resource-link:hover {
	background: var(--course-resource-bg-hover, rgba(240, 253, 250, 0.96));
}

.resource-link-label {
	font-size: 0.92rem;
	font-weight: 700;
	line-height: 1.35;
}

.resource-link-host {
	font-size: 0.78rem;
	color: var(--course-resource-host, var(--course-text-soft));
	line-height: 1.35;
	word-break: break-word;
}

.resource-link.is-project {
	--course-resource-bg: var(
		--course-project-resource-bg,
		rgba(236, 253, 245, 0.92)
	);
	--course-resource-bg-hover: var(
		--course-project-resource-bg-hover,
		rgba(220, 252, 231, 0.96)
	);
	--course-resource-text: var(--course-project-resource-text, #134e4a);
	--course-resource-host: var(--course-project-resource-host, #47736d);
}

.resource-link.is-solution {
	--course-resource-bg: var(
		--course-solution-resource-bg,
		rgba(239, 246, 255, 0.94)
	);
	--course-resource-bg-hover: var(
		--course-solution-resource-bg-hover,
		rgba(219, 234, 254, 0.96)
	);
	--course-resource-text: var(--course-solution-resource-text, #1e3a8a);
	--course-resource-host: var(--course-solution-resource-host, #486a9c);
}

.resource-link.is-dataset {
	--course-resource-bg: var(
		--course-dataset-resource-bg,
		rgba(255, 247, 237, 0.94)
	);
	--course-resource-bg-hover: var(
		--course-dataset-resource-bg-hover,
		rgba(254, 235, 200, 0.96)
	);
	--course-resource-text: var(--course-dataset-resource-text, #7c2d12);
	--course-resource-host: var(--course-dataset-resource-host, #925f35);
}

.item-content-markdown {
	max-width: 82ch;
	font-size: 1.02rem;
	line-height: 1.8;
	color: var(--course-text-soft);
}

.item-content-markdown :deep(h1),
.item-content-markdown :deep(h2),
.item-content-markdown :deep(h3),
.item-content-markdown :deep(h4) {
	margin: 0 0 0.85rem;
	line-height: 1.3;
	color: var(--course-text);
}

.item-content-markdown :deep(p),
.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol),
.item-content-markdown :deep(blockquote) {
	margin: 0 0 0.95rem;
}

.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol) {
	display: grid;
	gap: 0.55rem;
	padding-left: 1.65rem;
}

.item-content-markdown :deep(li) {
	padding-left: 0.25rem;
}

.item-content-markdown :deep(li::marker) {
	color: var(--course-accent);
	font-weight: 800;
}

.item-content-markdown :deep(li > p) {
	margin-bottom: 0.35rem;
}

.item-content-markdown :deep(a) {
	color: var(--course-accent);
	font-weight: 600;
}

.item-content-markdown :deep(code) {
	font-family:
		"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono",
		monospace;
	font-size: 0.88rem;
	background: var(--course-code-bg, rgba(15, 23, 42, 0.08));
	color: var(--course-code-text, var(--course-accent));
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
	border-radius: 14px;
	background: #e2e8f0;
}

.course-empty {
	padding: 2rem;
	border-radius: 20px;
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
		min-height: 0;
		max-height: min(48vh, 30rem);
		border-right: none;
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
	}

	.outline-list {
		max-height: none;
	}
}

@media (max-width: 1500px) {
	.course-hero,
	.course-toolbar,
	.staff-context-bar {
		display: grid;
		grid-template-columns: 1fr;
	}

	.course-toolbar,
	.staff-context-bar {
		gap: 0.9rem;
	}

	.course-stats {
		width: 100%;
		max-width: none;
	}
}

@media (max-width: 640px) {
	.course-shell {
		overflow: visible;
	}

	.course-stats {
		grid-template-columns: 1fr;
	}

	.search-shell,
	.lesson-header,
	.section-header,
	.staff-context-status {
		flex-direction: column;
		align-items: stretch;
	}

	.resource-link,
	.jump-link {
		width: 100%;
		justify-content: space-between;
	}

	.item-complete-badge {
		margin-left: 0;
	}

	.progress-toggle.is-item {
		margin-left: 0;
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
