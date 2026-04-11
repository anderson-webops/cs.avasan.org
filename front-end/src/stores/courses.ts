import type {
	CourseDefinition,
	CourseModuleItem,
	CourseSummary,
	RawCourse
} from "./courses/types";
import { defineStore } from "pinia";

import { computed } from "vue";
import { applyCourseDepthBaseline } from "./course-depth";
import { courseCatalog, loadRawCourse } from "./courses/index";

const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const PARAGRAPH_BREAK_RE = /\n{2,}/;
const INSTRUCTOR_NOTE_RE = /instructor note/i;
const EXCESS_BLANK_LINES_RE = /\n{3,}/g;
const PROJECT_TITLE_RE =
	/\bproject\b|\bcapstone\b|^problem:|^practice:|^extension:|^optional project:/i;
const MERGE_INTO_PREVIOUS_TITLE_RE = /^course recap$/i;
const PRESENTATION_TITLE_RE = /presentation$/i;
const SENTENCE_END_RE = /[.!?]$/;
const TRAILING_SLASH_RE = /\/$/;
const TRAILING_URL_PUNCTUATION_RE = /[),.;:]+$/;
const GITHUB_BLOB_SEGMENT_RE = /\/blob\//i;
const DEDICATED_SOLUTION_SEGMENT_RE =
	/(?:^|\/)solution(?:\/|$)|(?:^|[-_])solution(?:[-_]|$)/i;
const LESSON_SETUP_RE =
	/\b(?:setup|toolchain|environment|ide|scanner|input|output|compilation|project anatomy|tooling|xcode|cargo|git|npm)\b/i;
const LESSON_FOUNDATION_RE =
	/\b(?:variables?|strings?|comments?|conditionals?|loops?|functions?|methods?|arrays?|arraylists?|lists?|dictionaries|sets?|classes?|objects?|inheritance|polymorphism|pointers?|search|sort|recursion|graph|stack|queue|physics|chemistry|security|ownership|borrowing)\b/i;
const REFERENCE_LEAD_LABEL_RE = /reference|repo|starter/i;
const FIRST_WHITESPACE_RE = /\s/;

export type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "./courses/types";

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
}

function normalizeContent(content: string): string {
	const paragraphs = content
		.split(PARAGRAPH_BREAK_RE)
		.map(part => part.trim())
		.filter(Boolean)
		.filter(part => !INSTRUCTOR_NOTE_RE.test(part));
	return paragraphs
		.join("\n\n")
		.replace(EXCESS_BLANK_LINES_RE, "\n\n")
		.trim();
}

function trimUrl(url: string) {
	return url.trim().replace(TRAILING_URL_PUNCTUATION_RE, "");
}

function canonicalizeResourceUrl(url?: string) {
	if (!url) return undefined;

	const trimmedUrl = trimUrl(url);

	try {
		const parsed = new URL(trimmedUrl);

		if (parsed.hostname !== "github.com") {
			return trimmedUrl;
		}

		if (!GITHUB_BLOB_SEGMENT_RE.test(parsed.pathname)) {
			return trimmedUrl.replace(TRAILING_SLASH_RE, "");
		}

		const pathSegments = parsed.pathname.split("/").filter(Boolean);

		if (pathSegments.length < 5 || pathSegments[2] !== "blob") {
			return trimmedUrl;
		}

		const [owner, repo, _blob, ref, ...fileSegments] = pathSegments;

		if (fileSegments.length === 0) {
			return trimmedUrl.replace(TRAILING_SLASH_RE, "");
		}

		const directorySegments = fileSegments.slice(0, -1);
		parsed.pathname =
			directorySegments.length > 0
				? `/${owner}/${repo}/tree/${ref}/${directorySegments.join("/")}`
				: `/${owner}/${repo}/tree/${ref}`;
		parsed.search = "";
		parsed.hash = "";

		return parsed.toString().replace(TRAILING_SLASH_RE, "");
	} catch {
		return trimmedUrl;
	}
}

function shouldExposeLegacySolutionAsProject(title: string, url?: string) {
	if (!url || !PROJECT_TITLE_RE.test(title)) {
		return false;
	}

	return !DEDICATED_SOLUTION_SEGMENT_RE.test(url);
}

function extractLeadingResourceLink(title: string, content: string) {
	const separatorIndex = content.indexOf(": ");

	if (separatorIndex < 1 || separatorIndex > 60) {
		return null;
	}

	const label = content.slice(0, separatorIndex).trim();
	const afterLabel = content.slice(separatorIndex + 2).trimStart();

	if (!afterLabel.startsWith("http")) {
		return null;
	}

	const firstWhitespaceIndex = afterLabel.search(FIRST_WHITESPACE_RE);
	const rawUrl =
		firstWhitespaceIndex === -1
			? afterLabel
			: afterLabel.slice(0, firstWhitespaceIndex);
	const remainder =
		firstWhitespaceIndex === -1
			? ""
			: afterLabel.slice(firstWhitespaceIndex).trim();
	const normalizedUrl = canonicalizeResourceUrl(rawUrl);

	if (!normalizedUrl) {
		return null;
	}

	const isInstructionMaterialLink =
		normalizedUrl.includes("github.com/instruction-material/") ||
		normalizedUrl.includes("scratch.mit.edu/projects/") ||
		normalizedUrl.includes("static.junilearning.com/") ||
		normalizedUrl.includes("static.classes.jacobdanderson.net/");
	const isReferenceLead = REFERENCE_LEAD_LABEL_RE.test(label);

	if (
		!isInstructionMaterialLink &&
		!isReferenceLead &&
		!PROJECT_TITLE_RE.test(title)
	) {
		return null;
	}

	return {
		content: remainder.trim(),
		url: normalizedUrl
	};
}

function expandSlightly(title: string, content: string) {
	if (!content || content.length >= 185 || content.includes("\n\n")) {
		return content;
	}

	let addition = "";

	if (PROJECT_TITLE_RE.test(title)) {
		addition =
			"Have students run at least one custom case, explain the main design choice, and note one revision they made after the first working draft.";
	} else if (LESSON_SETUP_RE.test(title)) {
		addition =
			"End with one quick environment check so students can tell the toolchain is working before the next lesson builds on it.";
	} else if (LESSON_FOUNDATION_RE.test(title)) {
		addition =
			"Close with one concrete example and one quick debugging check so the idea stays attached to code or data rather than isolated vocabulary.";
	} else {
		addition =
			"Anchor the lesson in one concrete example and one quick check for understanding before moving on.";
	}

	return SENTENCE_END_RE.test(content)
		? `${content} ${addition}`
		: `${content}. ${addition}`;
}

function mergeAdjacentSupportItems(items: Array<Omit<CourseModuleItem, "id">>) {
	return items.reduce<Array<Omit<CourseModuleItem, "id">>>(
		(mergedItems, item) => {
			const previousItem = mergedItems.at(-1);

			if (
				previousItem &&
				(MERGE_INTO_PREVIOUS_TITLE_RE.test(item.title) ||
					(PRESENTATION_TITLE_RE.test(item.title) &&
						PROJECT_TITLE_RE.test(previousItem.title)))
			) {
				previousItem.content = normalizeContent(
					`${previousItem.content}\n\n${item.content}`
				);
				return mergedItems;
			}

			mergedItems.push(item);
			return mergedItems;
		},
		[]
	);
}

function normalizeCourse(course: RawCourse, courseId = slugify(course.name)) {
	return {
		id: courseId,
		name: course.name,
		modules: course.modules.map(module => {
			const moduleId = slugify(`${courseId}-${module.title}`);

			const mapItems = (
				items: typeof module.curriculum,
				prefix: string
			): CourseModuleItem[] =>
				mergeAdjacentSupportItems(
					items
						.filter(item => !shouldHideItem(item.title))
						.map(item => ({
							title: item.title,
							content: (() => {
								const extractedLink =
									extractLeadingResourceLink(
										item.title,
										item.content
									);
								const normalizedContent = normalizeContent(
									extractedLink?.content ?? item.content
								);
								return expandSlightly(
									item.title,
									normalizedContent
								);
							})(),
							projectLink: (() => {
								const explicitProjectLink =
									canonicalizeResourceUrl(item.projectLink);

								if (explicitProjectLink) {
									return explicitProjectLink;
								}

								const extractedLink =
									extractLeadingResourceLink(
										item.title,
										item.content
									);

								if (extractedLink?.url) {
									return extractedLink.url;
								}

								const normalizedSolutionLink =
									canonicalizeResourceUrl(item.solutionLink);

								return shouldExposeLegacySolutionAsProject(
									item.title,
									normalizedSolutionLink
								)
									? normalizedSolutionLink
									: undefined;
							})(),
							solutionLink: canonicalizeResourceUrl(
								item.solutionLink
							),
							datasetLink: item.datasetLink,
							mediaLink: item.mediaLink
						}))
				).map(item => ({
					id: slugify(`${moduleId}-${prefix}-${item.title}`),
					...item
				}));

			return {
				id: moduleId,
				title: module.title,
				curriculum: mapItems(module.curriculum, "curriculum"),
				supplementalProjects: mapItems(
					module.supplementalProjects,
					"supplemental"
				)
			};
		})
	} satisfies CourseDefinition;
}

const courseSummaries: CourseSummary[] = courseCatalog.map(({ id, name }) => ({
	id,
	name
}));

const normalizedCourseCache = new Map<string, CourseDefinition>();

export const useCoursesStore = defineStore("courses", () => {
	const courses = computed(() => courseSummaries);

	function getCourseById(id: string) {
		return normalizedCourseCache.get(id) ?? null;
	}

	async function loadCourseById(id: string) {
		const cachedCourse = normalizedCourseCache.get(id);

		if (cachedCourse) {
			return cachedCourse;
		}

		const rawCourse = await loadRawCourse(id);

		if (!rawCourse) {
			return null;
		}

		const normalizedCourse = applyCourseDepthBaseline(
			normalizeCourse(rawCourse, id)
		);

		normalizedCourseCache.set(id, normalizedCourse);

		return normalizedCourse;
	}

	return {
		courses,
		getCourseById,
		loadCourseById
	};
});
