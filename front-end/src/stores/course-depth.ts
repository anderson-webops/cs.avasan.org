import type { CourseResourceInventoryEntry } from "./course-resource-inventory";
import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "./courses/types";
import { courseResourceInventory } from "./course-resource-inventory";

const MIN_MODULE_COUNT = 17;
const MIN_CURRICULUM_ITEMS_PER_MODULE = 4;
const MIN_SUPPLEMENTAL_ITEMS_PER_MODULE = 3;

const PYTHON_BASELINE_IDS = new Set([
	"python-level-1",
	"python-level-2",
	"python-level-3"
]);

const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const CHECK_IN_PREFIX_RE = /^check-?in\s*#?\d*:?\s*/i;

function slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

function buildGeneratedItemId(
	moduleId: string,
	kind: "curriculum" | "supplemental",
	title: string
) {
	return slugify(`${moduleId}-${kind}-${title}`);
}

function courseFocusLabel(course: CourseDefinition) {
	const value = `${course.id} ${course.name}`.toLowerCase();

	if (value.includes("physics")) return "physics lab";
	if (value.includes("chem")) return "chemistry lab";
	if (value.includes("security")) return "security lab";
	if (value.includes("network")) return "network lab";
	if (value.includes("linux")) return "systems lab";
	if (value.includes("swift")) return "SwiftUI app";
	if (value.includes("web") || value.includes("javascript")) return "web app";
	if (value.includes("scratch")) return "Scratch studio";
	if (value.includes("design-pattern")) return "pattern studio";
	if (value.includes("machine-learning")) return "modeling lab";
	if (value.includes("data-science")) return "analysis lab";
	if (value.includes("ai")) return "AI lab";
	if (value.includes("usaco")) return "contest problem set";
	if (value.includes("assembly")) return "systems project";
	if (value.includes("rust")) return "Rust systems lab";
	if (value.includes("c-systems")) return "systems build";
	if (value.includes("c-level") || value.includes("cpp"))
		return "C++ project";
	if (value.includes("java")) return "Java project";
	if (value.includes("python")) return "Python project";

	return "applied studio";
}

function humanizeModuleFocus(moduleTitle: string) {
	return moduleTitle.replace(CHECK_IN_PREFIX_RE, "").trim();
}

function collectUsedUrls(course: CourseDefinition) {
	const used = new Set<string>();

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (item.projectLink) used.add(item.projectLink);
			if (item.solutionLink) used.add(item.solutionLink);
		}
	}

	return used;
}

function getAvailableResources(course: CourseDefinition) {
	const usedUrls = collectUsedUrls(course);
	return (courseResourceInventory[course.id] ?? []).filter(resource => {
		if (resource.projectLink && usedUrls.has(resource.projectLink)) {
			return false;
		}

		if (resource.solutionLink && usedUrls.has(resource.solutionLink)) {
			return false;
		}

		return true;
	});
}

function nextResource(queue: CourseResourceInventoryEntry[]) {
	return queue.shift() ?? null;
}

function buildGeneratedCurriculumItem(
	course: CourseDefinition,
	module: CourseModule,
	index: number
): CourseModuleItem {
	const moduleFocus =
		humanizeModuleFocus(module.title) || courseFocusLabel(course);
	const variants = [
		{
			title: `${moduleFocus}: Guided Example Review`,
			content: `Review the core ideas in ${module.title}, walk through one concrete example from start to finish, and identify the checkpoints students should verify before they begin the next project.`
		},
		{
			title: `${moduleFocus}: Common Mistakes and Debugging`,
			content: `Focus on the failure modes students are most likely to hit while working through ${module.title}. Have them diagnose one broken attempt, repair it, and explain why the fix works.`
		},
		{
			title: `${moduleFocus}: Applied Build Walkthrough`,
			content: `Translate ${module.title} into a more practical build plan. Students should outline the implementation, name the moving pieces, and justify the order in which they would construct them.`
		},
		{
			title: `${moduleFocus}: Verification and Reflection`,
			content: `Close the module by checking results, comparing alternate approaches, and writing a short note about what should be reused, refactored, or tested more aggressively next time.`
		}
	];
	const variant = variants[(index - 1) % variants.length];

	return {
		id: buildGeneratedItemId(module.id, "curriculum", variant.title),
		title: variant.title,
		content: variant.content
	};
}

function buildGeneratedSupplementalItem(
	course: CourseDefinition,
	module: CourseModule,
	index: number,
	resource: CourseResourceInventoryEntry | null
): CourseModuleItem {
	const moduleFocus =
		humanizeModuleFocus(module.title) || courseFocusLabel(course);

	if (resource) {
		const title = `${moduleFocus}: ${resource.label}`;
		return {
			id: buildGeneratedItemId(module.id, "supplemental", title),
			title,
			content: `Use the linked project material to apply ${module.title} in a more open-ended setting. Start from the provided starter if one exists, finish the missing implementation, test at least two custom cases, and compare the final result against the reference solution when available.`,
			projectLink: resource.projectLink,
			solutionLink: resource.solutionLink
		};
	}

	const genericTitle = `${moduleFocus}: Challenge Project ${index}`;
	return {
		id: buildGeneratedItemId(module.id, "supplemental", genericTitle),
		title: genericTitle,
		content: `Build a compact project around ${module.title}. Students should write or revise the implementation, test edge cases, and document one improvement they would make after the first working version.`
	};
}

function expandModule(
	course: CourseDefinition,
	module: CourseModule,
	resourceQueue: CourseResourceInventoryEntry[]
) {
	const curriculum = [...module.curriculum];
	const supplementalProjects = [...module.supplementalProjects];

	while (curriculum.length < MIN_CURRICULUM_ITEMS_PER_MODULE) {
		curriculum.push(
			buildGeneratedCurriculumItem(course, module, curriculum.length + 1)
		);
	}

	while (supplementalProjects.length < MIN_SUPPLEMENTAL_ITEMS_PER_MODULE) {
		supplementalProjects.push(
			buildGeneratedSupplementalItem(
				course,
				module,
				supplementalProjects.length + 1,
				nextResource(resourceQueue)
			)
		);
	}

	return {
		...module,
		curriculum,
		supplementalProjects
	};
}

function buildGeneratedModule(
	course: CourseDefinition,
	index: number,
	resourceQueue: CourseResourceInventoryEntry[]
): CourseModule {
	const primaryResource = nextResource(resourceQueue);
	const secondaryResource = nextResource(resourceQueue);
	const tertiaryResource = nextResource(resourceQueue);
	const focus =
		primaryResource?.label ?? `${courseFocusLabel(course)} ${index}`;
	const title = `Applied Studio ${index}: ${focus}`;
	const id = slugify(`${course.id}-${title}`);
	const module: CourseModule = {
		id,
		title,
		curriculum: [
			{
				id: buildGeneratedItemId(id, "curriculum", `${title}-briefing`),
				title: `${focus}: Project Briefing`,
				content: `Introduce the goal of ${title}, define the technical and conceptual requirements, and identify what students must understand before they start building.`
			},
			{
				id: buildGeneratedItemId(id, "curriculum", `${title}-planning`),
				title: `${focus}: Architecture and Planning`,
				content: `Break the work into smaller steps, identify reusable patterns from earlier modules, and have students sketch the structure of a clean first implementation before writing code or carrying out the lab.`
			},
			{
				id: buildGeneratedItemId(
					id,
					"curriculum",
					`${title}-implementation`
				),
				title: `${focus}: Implementation Sprint`,
				content: `Execute the core build, keeping the work observable and testable. Students should capture one important decision and one debugging step while they work through the main implementation.`
			},
			{
				id: buildGeneratedItemId(id, "curriculum", `${title}-review`),
				title: `${focus}: Review and Hardening`,
				content: `Review the final result, test the boundary cases that matter most, and identify the cleanups or extensions that would make the work more robust in a second pass.`
			}
		],
		supplementalProjects: []
	};

	module.supplementalProjects.push(
		buildGeneratedSupplementalItem(course, module, 1, primaryResource)
	);
	module.supplementalProjects.push(
		buildGeneratedSupplementalItem(course, module, 2, secondaryResource)
	);
	module.supplementalProjects.push(
		buildGeneratedSupplementalItem(course, module, 3, tertiaryResource)
	);

	return module;
}

export function applyCourseDepthBaseline(course: CourseDefinition) {
	if (PYTHON_BASELINE_IDS.has(course.id)) {
		return course;
	}

	const resourceQueue = getAvailableResources(course);
	const modules = course.modules.map(module =>
		expandModule(course, module, resourceQueue)
	);

	while (modules.length < MIN_MODULE_COUNT) {
		modules.push(
			buildGeneratedModule(
				course,
				modules.length - course.modules.length + 1,
				resourceQueue
			)
		);
	}

	return {
		...course,
		modules
	};
}
