<script lang="ts" setup>
import type { CodePreviewResource } from "@/modules/codePreview";
import type { CourseAssetResource } from "@/modules/courseAssetPreview";
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
import { reportClassroomUsage } from "@/modules/classroomUsage";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	getPythonIdeModeLabel,
	pythonIdeModeForCourseId
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import {
	hasPendingStaticMediaNotice,
	isKnownPendingStaticMediaUrl,
	isStaticMediaUrl,
	staticMediaFilename
} from "@/stores/courses/staticMedia";
import CodePreview from "./CodePreview.vue";
import CourseAssetPreview from "./CourseAssetPreview.vue";
import LazyMarkdownContent from "./LazyMarkdownContent.vue";

interface VisibleModule extends CourseModule {
	position: number;
	totalItemCount: number;
	visibleItemCount: number;
	isFiltered: boolean;
}

interface ResourceLink {
	host: string;
	kind: "project" | "solution" | "dataset" | "asset" | "media" | "reference";
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
const SOURCE_REPOSITORY_ROOT_RE =
	/^https:\/\/github\.com\/instruction-material\/[^/]+\/tree\/main$/i;
const REPOSITORY_ARCHIVE_RE =
	/\b(?:reference archive|full repo|repo bank|problem bank|workspace archive|source archive)\b/i;
const COURSE_SELECTION_STORAGE_KEY = "classes:course-explorer:selected-course";
const MODULE_SELECTION_STORAGE_KEY_PREFIX =
	"classes:course-explorer:active-module:";

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const appStore = useAppStore();
const { currentAdmin } = storeToRefs(appStore);

const searchQuery = ref("");
const selectedCourseId = ref("");
const activeModuleId = ref("");
const selectedCourse = shallowRef<CourseDefinition | null>(null);
const courseLoadError = ref("");
const isCourseLoading = ref(false);
const unavailableStaticMediaUrls = ref<string[]>([]);
const isStorageReady = ref(false);
const currentHashAnchor = ref(readCurrentHashAnchor());
const prefersReducedMotion = ref(false);
let reducedMotionQuery: MediaQueryList | null = null;

const allCourses = computed(() => courses.value ?? []);

const canViewSolutions = computed(() => !!currentAdmin.value);
const courseList = computed(() => allCourses.value);
const courseGroups = computed(() =>
	[
		{
			key: "current" as const,
			label: "Current courses",
			courses: allCourses.value
		}
	].filter(group => group.courses.length > 0)
);

const pythonIdeCourseMode = computed(() =>
	pythonIdeModeForCourseId(selectedCourse.value?.id)
);
const pythonIdeCourseHref = computed(() => {
	if (!selectedCourse.value || !pythonIdeCourseMode.value) return "";
	const params = new URLSearchParams({
		course: selectedCourse.value.id,
		mode: pythonIdeCourseMode.value
	});
	if (
		selectedCourse.value.id === "pygames" ||
		selectedCourse.value.id === "pygames-classroom" ||
		selectedCourse.value.id === "pygames-archive"
	) {
		params.set("starter", "course");
		params.set("projectKey", `${selectedCourse.value.id}:course`);
		params.set("starterTitle", `${selectedCourse.value.name} Starter`);
		params.set("starterLabel", "Course starter");
	}
	return `/python-ide?${params.toString()}`;
});
const pythonIdeCourseLabel = computed(() =>
	pythonIdeCourseMode.value
		? `Open ${getPythonIdeModeLabel(pythonIdeCourseMode.value)} IDE`
		: ""
);

const normalizedQuery = computed(() => normalizeSearch(searchQuery.value));

watch(
	[courseList, isStorageReady, currentHashAnchor],
	([availableCourses, storageReady]) => {
		if (availableCourses.length === 0) {
			selectedCourseId.value = "";
			return;
		}

		const availableCourseIds = availableCourses.map(course => course.id);
		if (!storageReady) {
			// Select a real course during SSG so no-JavaScript readers and
			// crawlers receive course content instead of an empty shell.
			if (!availableCourseIds.includes(selectedCourseId.value)) {
				selectedCourseId.value = availableCourses[0].id;
			}
			return;
		}

		const hashCourseId = courseIdFromHash(availableCourseIds);
		const storedCourseId = readStoredValue(COURSE_SELECTION_STORAGE_KEY);

		if (hashCourseId) {
			selectedCourseId.value = hashCourseId;
			return;
		}

		if (storedCourseId && availableCourseIds.includes(storedCourseId)) {
			selectedCourseId.value = storedCourseId;
			return;
		}

		if (availableCourseIds.includes(selectedCourseId.value)) {
			return;
		}

		selectedCourseId.value = availableCourses[0].id;
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

watch([selectedCourse, isStorageReady], ([course, storageReady]) => {
	if (!storageReady || !course) return;
	void reportClassroomUsage("course-open", course.id);
});

const courseModules = computed(() => selectedCourse.value?.modules ?? []);
const coreCourseModules = computed(() =>
	courseModules.value.filter(isCoreModule)
);
const appendixCourseModules = computed(() =>
	courseModules.value.filter(isAppendixModule)
);

const visibleCoreModules = computed<VisibleModule[]>(() =>
	visibleModuleList(coreCourseModules.value, normalizedQuery.value)
);

const visibleAppendixModules = computed<VisibleModule[]>(() =>
	visibleModuleList(appendixCourseModules.value, normalizedQuery.value)
);

const visibleModules = computed<VisibleModule[]>(() => [
	...visibleCoreModules.value,
	...visibleAppendixModules.value
]);

const visibleOutlineGroups = computed(() =>
	[
		{
			key: "modules",
			label: "Modules",
			modules: visibleCoreModules.value
		},
		{
			key: "references",
			label: "References",
			modules: visibleAppendixModules.value
		}
	].filter(group => group.modules.length > 0)
);

function visibleModuleList(modules: CourseModule[], query: string) {
	const course = selectedCourse.value;
	if (!course) return [];

	return modules
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
}

watch(
	[visibleModules, selectedCourseId, isStorageReady, currentHashAnchor],
	([modules, courseId, storageReady]) => {
		if (modules.length === 0 || !courseId) {
			activeModuleId.value = "";
			return;
		}

		if (!storageReady) return;

		const hashModuleId = moduleIdFromHash(modules);

		if (hashModuleId) {
			activeModuleId.value = hashModuleId;
			return;
		}

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

		if (modules.some(module => module.id === activeModuleId.value)) {
			return;
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

const activeCurriculumSectionLabel = computed(() =>
	activeModule.value?.kind === "appendix" ? "Reference" : "Core path"
);

const activeCurriculumHeading = computed(() =>
	activeModule.value?.kind === "appendix"
		? "Reference Materials"
		: "Curriculum"
);

const activeSupplementalSectionLabel = computed(() =>
	activeModule.value?.kind === "appendix"
		? "Reference practice"
		: "Extra practice"
);

const activeSupplementalHeading = computed(() =>
	activeModule.value?.kind === "appendix"
		? "Reference Activities"
		: "Supplemental Projects"
);

const activeCurriculumJumpHeading = computed(() =>
	activeModule.value?.kind === "appendix" ? "References:" : "Lessons:"
);

const activeSupplementalJumpHeading = computed(() =>
	activeModule.value?.kind === "appendix" ? "Activities:" : "Supplemental:"
);

const courseReaderStatus = computed(() => {
	if (!selectedCourse.value || !activeModule.value) return "";
	const searchContext = normalizedQuery.value
		? `${visibleModules.value.length} matching section${
				visibleModules.value.length === 1 ? "" : "s"
			}. `
		: "";
	const activeKind = moduleKindLabel(activeModule.value).toLowerCase();
	return `${searchContext}Showing ${activeKind} ${activeModule.value.position}: ${activeModule.value.title}.`;
});

function moduleKindLabel(module: Pick<CourseModule, "kind">) {
	return module.kind === "appendix" ? "Appendix" : "Module";
}

function isAppendixModule(module: Pick<CourseModule, "kind">) {
	return module.kind === "appendix";
}

function isCoreModule(module: Pick<CourseModule, "kind">) {
	return !isAppendixModule(module);
}

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

function readCurrentHashAnchor() {
	if (typeof window === "undefined") return "";

	const rawHash = window.location.hash.replace(/^#/, "").trim();
	if (!rawHash) return "";

	try {
		return decodeURIComponent(rawHash);
	} catch {
		return rawHash;
	}
}

function syncHashAnchor() {
	currentHashAnchor.value = readCurrentHashAnchor();
}

function courseIdFromHash(courseIds: string[]) {
	const anchor = currentHashAnchor.value;
	if (!anchor) return "";

	return (
		[...courseIds]
			.sort((left, right) => right.length - left.length)
			.find(
				courseId =>
					anchor === courseId || anchor.startsWith(`${courseId}-`)
			) ?? ""
	);
}

function moduleIdFromHash(modules: VisibleModule[]) {
	const anchor = currentHashAnchor.value;
	if (!anchor) return "";

	for (const module of modules) {
		const allItems = [...module.curriculum, ...module.supplementalProjects];
		if (
			allItems.some(item => itemAnchorId(module.id, item.id) === anchor)
		) {
			return module.id;
		}
	}

	const matchingModule = [...modules]
		.sort((left, right) => right.id.length - left.id.length)
		.find(
			module => anchor === module.id || anchor.startsWith(`${module.id}-`)
		);

	return matchingModule?.id ?? "";
}

function matchesSearch(value: string, query: string) {
	return normalizeSearch(value).includes(query);
}

function itemMatches(item: CourseModuleItem, query: string) {
	return (
		matchesSearch(item.title, query) || matchesSearch(item.content, query)
	);
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

function isImage(link: string) {
	return IMAGE_FILE_RE.test(link);
}

function isEmbeddedMedia(link: string) {
	return isVideo(link) || isImage(link);
}

function staticAssetName(url: string) {
	return staticMediaFilename(url);
}

function isStaticMediaUnavailable(url: string) {
	return (
		isStaticMediaUrl(url) &&
		(isKnownPendingStaticMediaUrl(url) ||
			unavailableStaticMediaUrls.value.includes(
				canonicalResourceTarget(url)
			))
	);
}

function isItemStaticMediaUnavailable(item: CourseModuleItem) {
	const url = item.mediaLink?.trim();
	if (!url || !isStaticMediaUrl(url)) return false;

	return (
		isStaticMediaUnavailable(url) ||
		hasPendingStaticMediaNotice(item.content, staticMediaFilename(url))
	);
}

function markStaticMediaUnavailable(url: string) {
	if (!isStaticMediaUrl(url)) return;

	const target = canonicalResourceTarget(url);
	if (unavailableStaticMediaUrls.value.includes(target)) return;

	unavailableStaticMediaUrls.value = [
		...unavailableStaticMediaUrls.value,
		target
	];
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

function canonicalResourceTarget(url: string) {
	const [base, fragment] = url.trim().split("#", 2);
	const canonicalBase = base.replace(/\/+$/, "");
	return fragment ? `${canonicalBase}#${fragment}` : canonicalBase;
}

function sameResourceTarget(left: string, right: string) {
	return canonicalResourceTarget(left) === canonicalResourceTarget(right);
}

function isSourceRepositoryRootLink(url: string) {
	const base = canonicalResourceTarget(url)
		.split("#", 1)[0]
		.replace(/\/+$/, "");
	return SOURCE_REPOSITORY_ROOT_RE.test(base);
}

function isRepositoryArchiveReference(item: CourseModuleItem) {
	return REPOSITORY_ARCHIVE_RE.test(`${item.title} ${item.content ?? ""}`);
}

function repositoryArchiveLabel(item: CourseModuleItem) {
	const combinedText = `${item.title} ${item.content ?? ""}`;

	if (/\b(?:repo bank|problem bank)\b/i.test(combinedText)) {
		return "Problem bank";
	}

	return "Source archive";
}

function projectLabel(item: CourseModuleItem, url: string) {
	const normalizedTitle = item.title.toLowerCase();
	const normalizedUrl = url.toLowerCase();

	if (normalizedUrl.startsWith("/course-assets/")) {
		return datasetLabel(url);
	}

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

	if (normalizedUrl.includes("/course-assets/apcs/apcs-pacing-tracks.md")) {
		return "Track guide";
	}

	if (
		normalizedUrl.includes(
			"/course-assets/python/turtle-project-reference.md"
		)
	) {
		if (normalizedUrl.includes("game-template")) {
			return "Turtle game template";
		}
		if (normalizedUrl.includes("boundaries")) {
			return "Turtle boundary guide";
		}
		if (normalizedUrl.includes("score-turtle")) {
			return "Score turtle guide";
		}

		return "Turtle reference";
	}

	if (
		normalizedUrl.startsWith("/course-assets/") &&
		(normalizedUrl.includes("answer-key") ||
			normalizedUrl.includes("rubric"))
	) {
		return "Rubric / answer key";
	}

	if (normalizedUrl.includes("chemistry-materials-pack")) {
		if (normalizedUrl.includes("measurement")) {
			return "Measurement tables";
		}
		if (normalizedUrl.includes("model-comparison")) {
			return "Model cards";
		}
		if (
			normalizedUrl.includes("phenomena-case") ||
			normalizedUrl.includes("original-phenomena")
		) {
			return "Phenomena cases";
		}
		if (
			normalizedUrl.includes("project-reference") ||
			normalizedUrl.includes("original-project-source")
		) {
			return "Project reference map";
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
		if (normalizedUrl.includes("atomic-structure-checkpoint")) {
			return "Atomic checkpoint";
		}
		if (normalizedUrl.includes("ion-and-formula")) {
			return "Ion cards";
		}
		if (normalizedUrl.includes("nomenclature")) {
			return "Naming cards";
		}
		if (normalizedUrl.includes("periodic-trend")) {
			return "Trend table";
		}
		if (normalizedUrl.includes("bonding-and-formula")) {
			return "Bonding cards";
		}
		if (normalizedUrl.includes("lewis-structure")) {
			return "Lewis practice";
		}
		if (normalizedUrl.includes("heating-curve")) {
			return "Heating curve data";
		}
		if (normalizedUrl.includes("phase-diagram")) {
			return "Phase diagram data";
		}
		if (normalizedUrl.includes("gas-law")) {
			return "Gas law scenarios";
		}
		if (normalizedUrl.includes("energy-phase-and-gas")) {
			return "Energy checkpoint";
		}
		if (normalizedUrl.includes("intermolecular")) {
			return "Property cards";
		}
		if (normalizedUrl.includes("reaction-type")) {
			return "Reaction cards";
		}
		if (normalizedUrl.includes("reaction-energy-and-rate")) {
			return "Energy and rate cases";
		}
		if (normalizedUrl.includes("equilibrium")) {
			return "Equilibrium cases";
		}
		if (normalizedUrl.includes("redox")) {
			return "Redox cases";
		}
		if (normalizedUrl.includes("concentration-and-ph")) {
			return "Solution tables";
		}
		if (normalizedUrl.includes("molar-mass")) {
			return "Mole practice set";
		}
		if (normalizedUrl.includes("water-formation-stoichiometry")) {
			return "Water stoichiometry case";
		}
		if (normalizedUrl.includes("quantitative-chemistry")) {
			return "Quantitative checkpoint";
		}
		if (normalizedUrl.includes("stoichiometry-error")) {
			return "Error cases";
		}
		if (normalizedUrl.includes("remote-investigation")) {
			return "Investigation checklist";
		}
		if (normalizedUrl.includes("capstone-evidence")) {
			return "Evidence seeds";
		}
		if (normalizedUrl.includes("capstone-defense")) {
			return "Capstone defense";
		}

		return "Chemistry materials";
	}

	if (normalizedUrl.startsWith("/course-assets/")) {
		return "Course asset";
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

	if (normalizedUrl.includes("openstax.org")) {
		return "OpenStax reference";
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

	if (
		normalizedUrl.includes("youtube.com") ||
		normalizedUrl.includes("youtu.be")
	) {
		return "Demo video";
	}

	if (normalizedUrl.includes("javalab.org")) {
		return "Interactive simulation";
	}

	return "Media resource";
}

function resourceLinks(item: CourseModuleItem): ResourceLink[] {
	const links: ResourceLink[] = [];
	const projectUrl = item.projectLink?.trim();
	const solutionUrl = item.solutionLink?.trim();
	const datasetUrl = item.datasetLink?.trim();
	const mediaUrl = item.mediaLink?.trim();

	if (projectUrl && isSourceRepositoryRootLink(projectUrl)) {
		if (isRepositoryArchiveReference(item)) {
			links.push({
				kind: "reference",
				label: repositoryArchiveLabel(item),
				url: projectUrl,
				host: linkHost(projectUrl)
			});
		}
	} else if (projectUrl) {
		links.push({
			kind: projectUrl.startsWith("/course-assets/")
				? "asset"
				: "project",
			label: projectLabel(item, projectUrl),
			url: projectUrl,
			host: linkHost(projectUrl)
		});
	}

	if (
		canViewSolutions.value &&
		solutionUrl &&
		!isSourceRepositoryRootLink(solutionUrl) &&
		(!projectUrl || !sameResourceTarget(solutionUrl, projectUrl))
	) {
		links.push({
			kind: "solution",
			label: solutionLabel(solutionUrl),
			url: solutionUrl,
			host: linkHost(solutionUrl)
		});
	}

	if (datasetUrl) {
		links.push({
			kind: datasetUrl.startsWith("/course-assets/")
				? "asset"
				: "dataset",
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

function pythonIdeStarterHref(item: CourseModuleItem, resource: ResourceLink) {
	if (
		!selectedCourse.value ||
		!pythonIdeCourseMode.value ||
		resource.kind !== "project" ||
		resource.host !== "github.com" ||
		!STARTER_RE.test(`${resource.label} ${resource.url}`)
	) {
		return "";
	}

	const params = new URLSearchParams({
		course: selectedCourse.value.id,
		mode: pythonIdeCourseMode.value,
		projectKey: `${selectedCourse.value.id}:${item.id}:starter`,
		starterUrl: resource.url,
		starterTitle: item.title,
		starterLabel: resource.label
	});
	return `/python-ide?${params.toString()}`;
}

function courseAssetPreviewResources(
	item: CourseModuleItem
): CourseAssetResource[] {
	return resourceLinks(item).filter(resource =>
		resource.url.startsWith("/course-assets/")
	);
}

function resourceOpenUrl(resource: ResourceLink) {
	return courseAssetViewerUrl(resource.url, resource.label);
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
	syncHashAnchor();
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

	if (typeof window !== "undefined") {
		window.addEventListener("hashchange", syncHashAnchor);
	}
});

onBeforeUnmount(() => {
	reducedMotionQuery?.removeEventListener(
		"change",
		syncReducedMotionPreference
	);
	reducedMotionQuery = null;
	if (typeof window !== "undefined") {
		window.removeEventListener("hashchange", syncHashAnchor);
	}
});

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
		<div class="course-shell">
			<header v-if="selectedCourse" class="course-hero">
				<div class="course-hero-copy">
					<h2>{{ selectedCourse.name }}</h2>
					<div v-if="pythonIdeCourseHref" class="course-ide-action">
						<a
							class="site-button site-button--secondary course-ide-link"
							:href="pythonIdeCourseHref"
						>
							{{ pythonIdeCourseLabel }}
						</a>
					</div>
				</div>
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
						<optgroup
							v-for="group in courseGroups"
							:key="group.key"
							:label="group.label"
						>
							<option
								v-for="course in group.courses"
								:key="course.id"
								:value="course.id"
							>
								{{ course.name }}
							</option>
						</optgroup>
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
						<h3>Sections</h3>
					</div>

					<div v-if="visibleModules.length > 0" class="outline-list">
						<section
							v-for="group in visibleOutlineGroups"
							:key="group.key"
							class="outline-section"
						>
							<p class="outline-section-label">
								{{ group.label }}
							</p>
							<button
								v-for="module in group.modules"
								:key="module.id"
								aria-controls="course-reader-panel"
								:aria-current="
									activeModule?.id === module.id
										? 'true'
										: undefined
								"
								:aria-label="`Show ${moduleKindLabel(module).toLowerCase()} ${module.position}: ${module.title}`"
								class="outline-button"
								:class="{
									'is-reference': isAppendixModule(module)
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
									</small>
								</span>
							</button>
						</section>
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
							Show all sections
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
								{{ moduleKindLabel(activeModule) }}
								{{ activeModule.position }}
							</p>
							<h3>{{ activeModule.title }}</h3>
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
								<h4 class="reader-link-heading">
									{{ activeCurriculumJumpHeading }}
								</h4>
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
									{{ activeSupplementalJumpHeading }}
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
								<p class="section-eyebrow">
									{{ activeCurriculumSectionLabel }}
								</p>
								<h4>{{ activeCurriculumHeading }}</h4>
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

									<LazyMarkdownContent
										v-if="item.content"
										:content="item.content"
									/>

									<div
										v-if="resourceLinks(item).length > 0"
										class="resource-list"
									>
										<template
											v-for="resource in resourceLinks(
												item
											)"
											:key="`${item.id}-${resource.kind}`"
										>
											<a
												class="resource-link"
												:class="[`is-${resource.kind}`]"
												:href="
													resourceOpenUrl(resource)
												"
												rel="noopener noreferrer"
												target="_blank"
											>
												<span
													class="resource-link-label"
												>
													{{ resource.label }}
													<span class="sr-only">
														(opens in a new tab)
													</span>
												</span>
												<small
													class="resource-link-host"
												>
													{{ resource.host }}
												</small>
											</a>
											<a
												v-if="
													pythonIdeStarterHref(
														item,
														resource
													)
												"
												class="resource-link is-ide-starter"
												:href="
													pythonIdeStarterHref(
														item,
														resource
													)
												"
											>
												<span
													class="resource-link-label"
												>
													Start in IDE
												</span>
												<small
													class="resource-link-host"
												>
													Browser workspace
												</small>
											</a>
										</template>
									</div>

									<CourseAssetPreview
										v-if="
											courseAssetPreviewResources(item)
												.length > 0
										"
										:resources="
											courseAssetPreviewResources(item)
										"
									/>

									<CodePreview
										v-if="
											codePreviewResources(item).length >
											0
										"
										:resources="codePreviewResources(item)"
									/>

									<div
										v-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink) &&
											!isItemStaticMediaUnavailable(item)
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
											@error="
												markStaticMediaUnavailable(
													item.mediaLink
												)
											"
										>
											<source
												:src="item.mediaLink"
												@error="
													markStaticMediaUnavailable(
														item.mediaLink
													)
												"
											/>
										</video>
										<img
											v-else-if="isImage(item.mediaLink)"
											:src="item.mediaLink"
											:alt="`Project demo media for ${item.title}`"
											class="item-media-image"
											loading="lazy"
											@error="
												markStaticMediaUnavailable(
													item.mediaLink
												)
											"
										/>
									</div>
									<div
										v-else-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink) &&
											isItemStaticMediaUnavailable(item)
										"
										class="item-media item-media-placeholder"
										role="note"
									>
										<p class="item-media-placeholder-label">
											Static asset pending
										</p>
										<p>
											Pending static asset:
											<strong>
												{{
													staticAssetName(
														item.mediaLink
													)
												}}</strong
											>.
										</p>
										<p>
											This classroom preview will appear
											once the media file is available.
										</p>
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
								<p class="section-eyebrow">
									{{ activeSupplementalSectionLabel }}
								</p>
								<h4>{{ activeSupplementalHeading }}</h4>
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

									<LazyMarkdownContent
										v-if="item.content"
										:content="item.content"
									/>

									<div
										v-if="resourceLinks(item).length > 0"
										class="resource-list"
									>
										<template
											v-for="resource in resourceLinks(
												item
											)"
											:key="`${item.id}-${resource.kind}`"
										>
											<a
												class="resource-link"
												:class="[`is-${resource.kind}`]"
												:href="
													resourceOpenUrl(resource)
												"
												rel="noopener noreferrer"
												target="_blank"
											>
												<span
													class="resource-link-label"
												>
													{{ resource.label }}
													<span class="sr-only">
														(opens in a new tab)
													</span>
												</span>
												<small
													class="resource-link-host"
												>
													{{ resource.host }}
												</small>
											</a>
											<a
												v-if="
													pythonIdeStarterHref(
														item,
														resource
													)
												"
												class="resource-link is-ide-starter"
												:href="
													pythonIdeStarterHref(
														item,
														resource
													)
												"
											>
												<span
													class="resource-link-label"
												>
													Start in IDE
												</span>
												<small
													class="resource-link-host"
												>
													Browser workspace
												</small>
											</a>
										</template>
									</div>

									<CourseAssetPreview
										v-if="
											courseAssetPreviewResources(item)
												.length > 0
										"
										:resources="
											courseAssetPreviewResources(item)
										"
									/>

									<CodePreview
										v-if="
											codePreviewResources(item).length >
											0
										"
										:resources="codePreviewResources(item)"
									/>

									<div
										v-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink) &&
											!isItemStaticMediaUnavailable(item)
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
											@error="
												markStaticMediaUnavailable(
													item.mediaLink
												)
											"
										>
											<source
												:src="item.mediaLink"
												@error="
													markStaticMediaUnavailable(
														item.mediaLink
													)
												"
											/>
										</video>
										<img
											v-else-if="isImage(item.mediaLink)"
											:src="item.mediaLink"
											:alt="`Project demo media for ${item.title}`"
											class="item-media-image"
											loading="lazy"
											@error="
												markStaticMediaUnavailable(
													item.mediaLink
												)
											"
										/>
									</div>
									<div
										v-else-if="
											item.mediaLink &&
											isEmbeddedMedia(item.mediaLink) &&
											isItemStaticMediaUnavailable(item)
										"
										class="item-media item-media-placeholder"
										role="note"
									>
										<p class="item-media-placeholder-label">
											Static asset pending
										</p>
										<p>
											Pending static asset:
											<strong>
												{{
													staticAssetName(
														item.mediaLink
													)
												}}</strong
											>.
										</p>
										<p>
											This classroom preview will appear
											once the media file is available.
										</p>
									</div>
								</article>
							</li>
						</ol>
					</section>
				</div>

				<div v-else class="reader-empty">
					<h3>No section selected</h3>
					<p>Choose a module or reference to open its summaries.</p>
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
		</div>
	</section>
</template>

<style scoped>
.course-explorer {
	--course-border-strong: rgba(30, 41, 59, 0.12);
	--course-text: #0f172a;
	--course-text-soft: #475569;
	--course-panel: #ffffff;
	--course-panel-soft: #f8fafc;
	--course-accent: #0f766e;
	--course-accent-soft: rgba(15, 118, 110, 0.12);
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
	grid-template-columns: minmax(0, 1fr);
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

.outline-header p,
.reader-copy p,
.reader-empty p {
	margin: 0;
	line-height: 1.7;
	color: var(--course-text-soft);
}

.course-ide-action {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.6rem 0.85rem;
	margin-top: 0.15rem;
	color: var(--course-text-soft);
	font-size: 0.9rem;
	line-height: 1.5;
}

.course-ide-link {
	flex: 0 0 auto;
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
.jump-link:focus-visible {
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
	overflow-inline: hidden;
}

.course-workspace > * {
	min-width: 0;
	min-inline-size: 0;
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
	gap: 0.85rem;
	max-height: none;
	overflow: auto;
	padding-right: 0.2rem;
}

.outline-section {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.outline-section-label {
	margin: 0;
	padding: 0 0.25rem;
	color: var(--course-muted);
	font-size: 0.72rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
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

.outline-button.is-reference {
	border-color: rgba(100, 116, 139, 0.12);
	background: rgba(248, 250, 252, 0.62);
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

.outline-button.is-reference .outline-position {
	background: rgba(100, 116, 139, 0.12);
	color: var(--course-muted);
}

.outline-button.is-reference[aria-current="true"] .outline-position {
	background: rgba(59, 130, 246, 0.14);
	color: #1d4ed8;
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
	width: 100%;
	inline-size: 100%;
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-inline: hidden;
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
	min-width: 0;
	max-width: 100%;
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
	width: 100%;
	inline-size: 100%;
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
	box-sizing: border-box;
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
	width: 100%;
	inline-size: 100%;
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
	box-sizing: border-box;
	border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.lesson-item {
	width: 100%;
	inline-size: 100%;
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-inline: hidden;
}

.lesson-item + .lesson-item {
	border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.lesson-card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	inline-size: 100%;
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
	box-sizing: border-box;
	padding: clamp(1.2rem, 2.6vw, 1.5rem) 0;
	border: none;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
}

.lesson-card > * {
	min-width: 0;
	min-inline-size: 0;
	max-width: 100%;
	max-inline-size: 100%;
}

.lesson-card.is-supplemental {
	padding-left: clamp(1rem, 2.2vw, 1.35rem);
	border-left: 3px solid rgba(245, 158, 11, 0.22);
}

.lesson-header {
	display: flex;
	align-items: flex-start;
	gap: 0.9rem;
	min-width: 0;
	max-width: 100%;
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
	min-width: 0;
	max-width: 100%;
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

.resource-link.is-ide-starter {
	--course-resource-bg: rgba(220, 252, 231, 0.96);
	--course-resource-bg-hover: rgba(187, 247, 208, 0.98);
	--course-resource-text: #14532d;
	--course-resource-host: #3f6f50;
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

.resource-link.is-asset {
	--course-resource-bg: var(
		--course-asset-resource-bg,
		rgba(240, 253, 250, 0.94)
	);
	--course-resource-bg-hover: var(
		--course-asset-resource-bg-hover,
		rgba(204, 251, 241, 0.96)
	);
	--course-resource-text: var(--course-asset-resource-text, #115e59);
	--course-resource-host: var(--course-asset-resource-host, #47736d);
}

.resource-link.is-reference {
	--course-resource-bg: var(
		--course-reference-resource-bg,
		rgba(248, 250, 252, 0.94)
	);
	--course-resource-bg-hover: var(
		--course-reference-resource-bg-hover,
		rgba(241, 245, 249, 0.96)
	);
	--course-resource-text: var(--course-reference-resource-text, #334155);
	--course-resource-host: var(--course-reference-resource-host, #64748b);
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

.item-media-placeholder {
	display: grid;
	gap: 0.75rem;
	min-height: 14rem;
	align-content: center;
	padding: 1.25rem;
	border: 1px dashed var(--course-border-strong, rgba(71, 85, 105, 0.42));
	border-radius: 14px;
	background: linear-gradient(
		135deg,
		var(--course-card-bg-soft, rgba(248, 250, 252, 0.88)),
		var(--course-card-bg, rgba(255, 255, 255, 0.94))
	);
	color: var(--course-text, #0f172a);
}

.item-media-placeholder p {
	margin: 0;
	max-width: 68ch;
}

.item-media-placeholder-label {
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--course-accent, #2563eb);
}

.item-media-placeholder a {
	overflow-wrap: anywhere;
	color: var(--course-link, #1d4ed8);
	font-weight: 800;
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
	.course-toolbar {
		display: grid;
		grid-template-columns: 1fr;
	}

	.course-toolbar {
		gap: 0.9rem;
	}
}

@media (max-width: 640px) {
	.course-shell {
		overflow: visible;
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
