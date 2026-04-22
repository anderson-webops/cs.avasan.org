import type {
	CourseDefinition,
	CourseModuleItem,
	CourseSummary,
	RawCourse
} from "./courses/types";
import { defineStore } from "pinia";

import { computed } from "vue";
import { courseCatalog, loadRawCourse } from "./courses/index";

const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const PARAGRAPH_BREAK_RE = /\n{2,}/;
const NEWLINE_RE = /\n+/g;
const WHITESPACE_RE = /\s+/g;
const INSTRUCTOR_NOTE_RE = /instructor note/i;
const EXCESS_BLANK_LINES_RE = /\n{3,}/g;
const PROJECT_TITLE_RE =
	/\bproject\b|\bcapstone\b|^problem:|^practice:|^extension:|^optional project:/i;
const MERGE_INTO_PREVIOUS_TITLE_RE = /^course recap$/i;
const PRESENTATION_TITLE_RE = /presentation$/i;
const SENTENCE_END_RE = /[.!?]$/;
const SENTENCE_SPLIT_RE = /(?<=[.!?])\s+/;
const TRAILING_SLASH_RE = /\/$/;
const TRAILING_URL_PUNCTUATION_RE = /[),.;:]+$/;
const GITHUB_BLOB_SEGMENT_RE = /\/blob\//i;
const DEDICATED_SOLUTION_SEGMENT_RE =
	/(?:^|\/)solution(?:\/|$)|(?:^|[-_])solution(?:[-_]|$)/i;
const REFERENCE_LEAD_LABEL_RE = /reference|repo|starter/i;
const FIRST_WHITESPACE_RE = /\s/;
const MAX_SUMMARY_SENTENCES = 2;
const MAX_SUMMARY_LENGTH = 240;
const BOILERPLATE_SENTENCE_FILTERS = [
	/^Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on\.?$/i,
	/^Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version\.?$/i,
	/^Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft\.?$/i,
	/^Use this module build as the main implementation checkpoint\.?$/i,
	/^Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward\.?$/i,
	/^Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done\.?$/i,
	/^Keep the scope small, but require one meaningful design or reasoning choice\.?$/i,
	/^Keep the scope tight, but require one meaningful design or reasoning decision\.?$/i,
	/^The habit should be evidence first, assumptions second\.?$/i,
	/^Have them diagnose a broken attempt, repair it, and explain why the fix works\.?$/i,
	/^End with one quick environment check so students can tell the toolchain is working before the next lesson builds on it\.?$/i,
	/^Close with one concrete example and one quick debugging check so the idea stays attached to code or data rather than isolated vocabulary\.?$/i,
	/^Anchor the lesson in one concrete example and one quick check for understanding before moving on\.?$/i
];
const BOILERPLATE_SENTENCE_REWRITES: Array<{
	pattern: RegExp;
	replace: (...matches: string[]) => string;
}> = [
	{
		pattern:
			/^Use the linked starter and solution for a supplemental project tied to (.+?)\.?$/i,
		replace: (_whole, topic) =>
			`Supplemental practice for ${topic} using the linked starter.`
	},
	{
		pattern:
			/^Extend the work from (.+?) with a tighter constraint, one extra feature, or a slightly more realistic input case\.?$/i,
		replace: (_whole, topic) =>
			`Extend ${topic} with one tighter constraint or extra feature.`
	},
	{
		pattern:
			/^Repeat the core ideas from (.+?) on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning\.?$/i,
		replace: (_whole, topic) =>
			`Practice ${topic} again on a smaller problem.`
	},
	{
		pattern:
			/^Close (.+?) by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass\.?$/i,
		replace: (_whole, topic) =>
			`Review ${topic}, compare approaches, and record one improvement for the next pass.`
	}
];

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

function ensureSentence(text: string) {
	return SENTENCE_END_RE.test(text) ? text : `${text}.`;
}

function rewriteBoilerplateSentence(sentence: string) {
	const normalizedSentence = sentence.replace(WHITESPACE_RE, " ").trim();

	if (!normalizedSentence) {
		return "";
	}

	if (
		BOILERPLATE_SENTENCE_FILTERS.some(pattern =>
			pattern.test(normalizedSentence)
		)
	) {
		return "";
	}

	for (const { pattern, replace } of BOILERPLATE_SENTENCE_REWRITES) {
		const match = normalizedSentence.match(pattern);

		if (match) {
			return ensureSentence(replace(...match));
		}
	}

	return ensureSentence(normalizedSentence);
}

function compactContent(content: string): string {
	const normalized = normalizeContent(content);

	if (!normalized) {
		return "";
	}

	const sentences = normalized
		.replace(NEWLINE_RE, " ")
		.split(SENTENCE_SPLIT_RE)
		.map(sentence => sentence.trim())
		.filter(Boolean);
	const summary: string[] = [];

	for (const sentence of sentences) {
		const rewritten = rewriteBoilerplateSentence(sentence);

		if (!rewritten) {
			continue;
		}

		if (summary.at(-1)?.toLowerCase() === rewritten.toLowerCase()) {
			continue;
		}

		const candidate = [...summary, rewritten].join(" ");

		if (
			summary.length > 0 &&
			(summary.length >= MAX_SUMMARY_SENTENCES ||
				candidate.length > MAX_SUMMARY_LENGTH)
		) {
			break;
		}

		summary.push(rewritten);
	}

	if (summary.length > 0) {
		return summary.join(" ");
	}

	const fallback =
		sentences.find(sentence => sentence.trim()) ??
		normalized.replace(NEWLINE_RE, " ");

	return ensureSentence(fallback.replace(WHITESPACE_RE, " ").trim());
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
				previousItem.content = compactContent(
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
								return compactContent(normalizedContent);
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

		const normalizedCourse = normalizeCourse(rawCourse, id);

		normalizedCourseCache.set(id, normalizedCourse);

		return normalizedCourse;
	}

	return {
		courses,
		getCourseById,
		loadCourseById
	};
});
