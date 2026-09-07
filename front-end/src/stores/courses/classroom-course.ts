import type { RawCourseModule, RawCourseModuleItem } from "./types";

const CLASSROOM_SLUG_COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const CLASSROOM_SLUG_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const CLASSROOM_SLUG_LEADING_HYPHENS_RE = /^-+/;
const CLASSROOM_SLUG_TRAILING_HYPHENS_RE = /-+$/;

interface ClassroomLaunchModuleOptions {
	coreItems: RawCourseModuleItem[];
	courseFlow: string;
	courseId: string;
	estimatedTime?: string;
	keyBlocks?: string[];
	supplementalItems: RawCourseModuleItem[];
	title?: string;
}

function classroomSlugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(CLASSROOM_SLUG_COMBINING_MARKS_RE, "")
		.replace(CLASSROOM_SLUG_NON_ALPHANUMERIC_RE, "-")
		.replace(CLASSROOM_SLUG_LEADING_HYPHENS_RE, "")
		.replace(CLASSROOM_SLUG_TRAILING_HYPHENS_RE, "");
}

function copyItem(item: RawCourseModuleItem): RawCourseModuleItem {
	return {
		...item,
		aliases: item.aliases ? [...item.aliases] : undefined
	};
}

function copyModule(module: RawCourseModule): RawCourseModule {
	return {
		...module,
		aliases: module.aliases ? [...module.aliases] : undefined,
		curriculum: module.curriculum.map(copyItem),
		supplementalProjects: module.supplementalProjects.map(copyItem)
	};
}

function configureLaunchItems(
	items: RawCourseModuleItem[],
	moduleId: string,
	section: "curriculum" | "supplemental"
) {
	return items.map(item => ({
		...copyItem(item),
		id: item.id ?? classroomSlugify(`${moduleId}-${section}-${item.title}`)
	}));
}

export function copyClassroomCourseModules(modules: RawCourseModule[]) {
	return modules.map(copyModule);
}

export function createClassroomLaunchModule({
	coreItems,
	courseFlow,
	courseId,
	estimatedTime = "3–4 sessions · 45–60 minutes each",
	keyBlocks = [
		"run before editing",
		"Normal section",
		"Hard section",
		"save a working checkpoint",
		"predict, test, repair, explain"
	],
	supplementalItems,
	title = "Classroom Launch: Build, Extend, Explain"
}: ClassroomLaunchModuleOptions): RawCourseModule {
	const moduleId = classroomSlugify(`${courseId}-${title}`);
	const curriculum = configureLaunchItems(
		coreItems.map(item => ({ ...item, learningPath: "core" })),
		moduleId,
		"curriculum"
	);
	const supplementalProjects = configureLaunchItems(
		supplementalItems,
		moduleId,
		"supplemental"
	);
	const workflow = curriculum[0];

	if (workflow) {
		workflow.content = [
			workflow.content,
			`**Course flow:** ${courseFlow}`
		].join("\n\n");
	}

	return {
		id: moduleId,
		title,
		estimatedTime,
		keyBlocks,
		curriculum,
		supplementalProjects
	};
}
