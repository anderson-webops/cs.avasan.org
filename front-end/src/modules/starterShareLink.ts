import type {
	CourseDefinition,
	CourseModuleItem
} from "@/stores/courses/types";
import scratchProjects from "../../scripts/scratch/projects.json";

const courseModes: Record<string, string> = {
	"scratch-level-1": "scratch",
	"scratch-level-2": "scratch",
	"python-level-1": "turtle",
	"python-level-2": "python",
	pygames: "pgzero"
};
const scratchStarterIDs = new Set([
	"blank",
	...scratchProjects.map(project => project.id)
]);
const publicTemplateIDs = new Set([
	"blank",
	"circle-art",
	"classroom-project",
	"course",
	"demo",
	"firework-festival",
	"flower-garden",
	"maze-explorer",
	"neon-trail",
	"outline",
	"picasso",
	"spiral-galaxy",
	"turtle-race",
	"triangle-motion"
]);
const allowedParameters = new Set([
	"mode",
	"starter",
	"template",
	"course",
	"classroom",
	"projectKey",
	"starterUrl",
	"classroomSource",
	"starterTitle",
	"starterLabel"
]);

function publicGitHubStarter(url: string) {
	try {
		const parsed = new URL(url);
		return (
			parsed.origin === "https://github.com" &&
			!parsed.username &&
			!parsed.password &&
			!parsed.search &&
			!parsed.hash &&
			parsed.pathname.startsWith("/instruction-material/")
		);
	} catch {
		return false;
	}
}

/**
 * Share only a starter already declared in the current public course catalog.
 * Do not pass route queries, selected IDE projects, student records or solutions.
 */
export function publicCatalogStarterSharePath(
	course: CourseDefinition | null,
	item: CourseModuleItem
): string {
	if (!course || !Object.hasOwn(courseModes, course.id)) return "";
	if (
		!course.modules.some(module =>
			[...module.curriculum, ...module.supplementalProjects].includes(
				item
			)
		)
	) {
		return "";
	}
	const href = item.projectLink;
	if (!href?.startsWith("/ide?")) return "";
	const parsed = new URL(href, "https://catalog.invalid");
	if (parsed.pathname !== "/ide" || parsed.hash) return "";
	const params = parsed.searchParams;
	for (const key of params.keys()) {
		if (!allowedParameters.has(key) || params.getAll(key).length !== 1)
			return "";
	}
	const mode = params.get("mode");
	if (mode !== courseModes[course.id]) return "";
	if (mode === "scratch") {
		const starter = params.get("starter");
		if (!starter || !scratchStarterIDs.has(starter)) return "";
		if ([...params.keys()].some(key => key !== "mode" && key !== "starter"))
			return "";
		return `/ide?${new URLSearchParams({ mode, starter }).toString()}`;
	}
	if (params.get("course") !== course.id) return "";
	const template = params.get("template");
	if (template && !publicTemplateIDs.has(template)) return "";
	if (params.has("classroom") && params.get("classroom") !== "1") return "";
	if (params.has("starter") && params.get("starter") !== "course") return "";
	const publicKey = params.get("projectKey");
	if (
		publicKey &&
		![course.id, `${course.id}-classroom`].some(
			prefix =>
				publicKey.startsWith(`${prefix}:`) &&
				publicKey.endsWith(":starter") &&
				/^[\w:-]+$/.test(publicKey)
		)
	) {
		return "";
	}
	const starterUrl = params.get("starterUrl");
	const classroomSource = params.get("classroomSource");
	if (starterUrl && (!publicKey || !publicGitHubStarter(starterUrl)))
		return "";
	if (
		classroomSource &&
		(!publicKey ||
			!/^[\w./-]+$/.test(classroomSource) ||
			classroomSource.includes(".."))
	) {
		return "";
	}
	if (starterUrl && classroomSource) return "";
	// These descriptive fields are unnecessary to reopen the original starter.
	// The public catalog key is retained because source-backed starters need it.
	params.delete("starterTitle");
	params.delete("starterLabel");
	return `/ide?${params.toString()}`;
}
