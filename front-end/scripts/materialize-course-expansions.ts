import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";

import { courseCatalog, loadRawCourse } from "../src/stores/courses/index.ts";
import type {
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "../src/stores/courses/types.ts";

type ProjectKind =
	| "assembly"
	| "c"
	| "cpp"
	| "cpp-pattern"
	| "java"
	| "java-pattern"
	| "linux"
	| "python"
	| "python-ai"
	| "python-data"
	| "python-pattern"
	| "python-security"
	| "rust"
	| "swift"
	| "web";

interface CourseConfig {
	codeBacked: boolean;
	hostRepos: string[];
	moduleFocus: string;
	prefix: string;
	projectKind?: ProjectKind;
}

interface ResourceEntry {
	label: string;
	projectLink?: string;
	solutionLink?: string;
	sourcePath: string;
	repoName: string;
}

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(FRONTEND_DIR, "..");
const COURSES_DIR = path.join(FRONTEND_DIR, "src/stores/courses");
const INSTRUCTION_MATERIAL_ROOT =
	"/Users/jacobanderson/Documents/Work/Instruction-Material";
const TARGET_MODULE_COUNT = 17;
const TARGET_CURRICULUM_ITEMS = 4;
const TARGET_SUPPLEMENTAL_ITEMS = 3;

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);
const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const PARAGRAPH_BREAK_RE = /\n{2,}/;
const INSTRUCTOR_NOTE_RE = /instructor note/i;
const EXCESS_BLANK_LINES_RE = /\n{3,}/g;
const PROJECT_TITLE_RE =
	/\bproject\b|\bcapstone\b|^problem:|^practice:|^extension:|^optional project:/i;
const DEDICATED_SOLUTION_SEGMENT_RE =
	/(?:^|\/)solution(?:\/|$)|(?:^|[-_])solution(?:[-_]|$)/i;
const SENTENCE_END_RE = /[.!?]$/;
const TRAILING_SLASH_RE = /\/$/;
const TRAILING_URL_PUNCTUATION_RE = /[,.;:]+$/;
const GITHUB_BLOB_SEGMENT_RE = /\/blob\//i;
const FIRST_WHITESPACE_RE = /\s/;
const CHECK_IN_PREFIX_RE = /^check-?in\s*#?\d*:?\s*/i;
const DUPLICATE_COLON_TITLE_RE = /^(.+): \1$/;
const PROJECT_ADDITION_SENTENCE =
	"Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.";
const GENERAL_ADDITION_SENTENCE =
	"Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.";

const COURSE_CONFIG: Record<string, CourseConfig> = {
	"scratch-level-1": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "Scratch studio",
		prefix: "SCR1X"
	},
	"scratch-level-2": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "Scratch systems studio",
		prefix: "SCR2X"
	},
	pygames: {
		codeBacked: true,
		hostRepos: ["PyGames"],
		moduleFocus: "PyGame build",
		prefix: "PGX",
		projectKind: "python"
	},
	"python-level-1": {
		codeBacked: true,
		hostRepos: ["Python-Level-1"],
		moduleFocus: "Python project",
		prefix: "PY1X",
		projectKind: "python"
	},
	"python-level-2": {
		codeBacked: true,
		hostRepos: ["Python-Level-2"],
		moduleFocus: "Python project",
		prefix: "PY2X",
		projectKind: "python"
	},
	"python-level-3": {
		codeBacked: true,
		hostRepos: ["Python-Level-3"],
		moduleFocus: "Python project",
		prefix: "PY3X",
		projectKind: "python"
	},
	"data-science-in-python": {
		codeBacked: true,
		hostRepos: ["Data-Science"],
		moduleFocus: "data analysis lab",
		prefix: "DSPX",
		projectKind: "python-data"
	},
	"ai-level-1": {
		codeBacked: true,
		hostRepos: ["AI-Level-1"],
		moduleFocus: "AI search lab",
		prefix: "AIX",
		projectKind: "python-ai"
	},
	"python-to-java-and-cpp-bridge": {
		codeBacked: true,
		hostRepos: ["Java-Level-1", "CPP-Level-1"],
		moduleFocus: "language bridge lab",
		prefix: "BRGX",
		projectKind: "java"
	},
	"c-level-1": {
		codeBacked: true,
		hostRepos: ["CPP-Level-1"],
		moduleFocus: "C++ foundations build",
		prefix: "CPPX",
		projectKind: "cpp"
	},
	"data-structures-and-algorithms-in-cpp": {
		codeBacked: true,
		hostRepos: ["Data-Structures-and-Algorithms-in-CPP"],
		moduleFocus: "C++ algorithm lab",
		prefix: "DSAX",
		projectKind: "cpp"
	},
	"c-systems-engineering": {
		codeBacked: true,
		hostRepos: ["C-Systems-Engineering"],
		moduleFocus: "systems build",
		prefix: "CSEX",
		projectKind: "c"
	},
	assembly: {
		codeBacked: true,
		hostRepos: ["Assembly"],
		moduleFocus: "assembly lab",
		prefix: "ASMX",
		projectKind: "assembly"
	},
	"java-level-1": {
		codeBacked: true,
		hostRepos: ["Java-Level-1"],
		moduleFocus: "Java foundations build",
		prefix: "J1X",
		projectKind: "java"
	},
	"java-level-2": {
		codeBacked: true,
		hostRepos: ["Java-Level-2"],
		moduleFocus: "Java project",
		prefix: "J2X",
		projectKind: "java"
	},
	"java-level-3": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "advanced Java project",
		prefix: "J3X",
		projectKind: "java"
	},
	"ap-computer-science-a": {
		codeBacked: true,
		hostRepos: ["APCS"],
		moduleFocus: "APCS practice build",
		prefix: "APCSX",
		projectKind: "java"
	},
	"usaco-bronze": {
		codeBacked: true,
		hostRepos: ["USACO-Bronze"],
		moduleFocus: "contest problem set",
		prefix: "UBX",
		projectKind: "cpp"
	},
	"usaco-silver": {
		codeBacked: true,
		hostRepos: ["USACO-Silver"],
		moduleFocus: "contest problem set",
		prefix: "USX",
		projectKind: "cpp"
	},
	"usaco-gold": {
		codeBacked: true,
		hostRepos: ["USACO-Gold"],
		moduleFocus: "contest problem set",
		prefix: "UGX",
		projectKind: "cpp"
	},
	"design-patterns-in-java": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "pattern implementation lab",
		prefix: "DPJX",
		projectKind: "java-pattern"
	},
	"design-patterns-in-java-part-2": {
		codeBacked: true,
		hostRepos: ["Java-Level-3"],
		moduleFocus: "refactoring clinic",
		prefix: "DPRX",
		projectKind: "java-pattern"
	},
	"design-patterns-in-cpp": {
		codeBacked: true,
		hostRepos: ["Design-Patterns-in-CPP"],
		moduleFocus: "pattern implementation lab",
		prefix: "DPCX",
		projectKind: "cpp-pattern"
	},
	"pythonic-design-patterns": {
		codeBacked: true,
		hostRepos: ["Python-Courses"],
		moduleFocus: "pattern implementation lab",
		prefix: "PDPX",
		projectKind: "python-pattern"
	},
	"intro-to-chemistry": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "chemistry lab",
		prefix: "CHEMX"
	},
	"intro-to-physics": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "physics lab",
		prefix: "PHYX"
	},
	"physics-level-2": {
		codeBacked: false,
		hostRepos: [],
		moduleFocus: "physics problem lab",
		prefix: "PHY2X"
	},
	"intro-to-swift-app-development": {
		codeBacked: true,
		hostRepos: ["Swift"],
		moduleFocus: "Swift app build",
		prefix: "SADX",
		projectKind: "swift"
	},
	"linux-systems": {
		codeBacked: true,
		hostRepos: ["Linux-Systems"],
		moduleFocus: "Linux systems lab",
		prefix: "LSX",
		projectKind: "linux"
	},
	"network-systems": {
		codeBacked: true,
		hostRepos: ["Network-Systems"],
		moduleFocus: "network systems lab",
		prefix: "NSX",
		projectKind: "python-security"
	},
	"network-security": {
		codeBacked: true,
		hostRepos: ["Network-Security"],
		moduleFocus: "network security lab",
		prefix: "NSECX",
		projectKind: "python-security"
	},
	"rust-systems-security": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "Rust systems lab",
		prefix: "RUSTX",
		projectKind: "rust"
	},
	"javascript-level-1": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "web app build",
		prefix: "JSSX",
		projectKind: "web"
	},
	"javascript-level-1-javascript-superstar": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "web app build",
		prefix: "JSSX",
		projectKind: "web"
	},
	"javascript-level-2": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "interactive web build",
		prefix: "JSMX",
		projectKind: "web"
	},
	"javascript-level-2-javascript-master": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "interactive web build",
		prefix: "JSMX",
		projectKind: "web"
	},
	"web-development-foundations": {
		codeBacked: true,
		hostRepos: ["Web-Development-Foundations"],
		moduleFocus: "full-stack web lab",
		prefix: "WDFX",
		projectKind: "web"
	},
	"machine-learning": {
		codeBacked: true,
		hostRepos: ["AI-Level-2"],
		moduleFocus: "machine learning lab",
		prefix: "MLX",
		projectKind: "python-data"
	},
	"low-level-security": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "low-level security lab",
		prefix: "LLSX",
		projectKind: "c"
	},
	"low-level-security-part-2": {
		codeBacked: true,
		hostRepos: ["Low-Level-Security"],
		moduleFocus: "offensive security lab",
		prefix: "LLS2X",
		projectKind: "c"
	}
};

const PYTHON_BASELINE_IDS = new Set([
	"python-level-1",
	"python-level-2",
	"python-level-3"
]);

function slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
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

	if (!isInstructionMaterialLink && !PROJECT_TITLE_RE.test(title)) {
		return null;
	}

	return {
		content: remainder.trim(),
		url: normalizedUrl
	};
}

function normalizeContent(content: string) {
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

function dedupeRepeatedTitle(title: string) {
	const duplicateMatch = title.match(DUPLICATE_COLON_TITLE_RE);
	return duplicateMatch?.[1] ?? title;
}

function expandSlightly(title: string, content: string) {
	let normalizedContent = content
		.replace(` ${PROJECT_ADDITION_SENTENCE}`, "")
		.replace(` ${GENERAL_ADDITION_SENTENCE}`, "");

	if (
		!normalizedContent ||
		normalizedContent.length >= 185 ||
		normalizedContent.includes("\n\n")
	) {
		return normalizedContent;
	}

	const addition = PROJECT_TITLE_RE.test(title)
		? PROJECT_ADDITION_SENTENCE
		: GENERAL_ADDITION_SENTENCE;

	return SENTENCE_END_RE.test(normalizedContent)
		? `${normalizedContent} ${addition}`
		: `${normalizedContent}. ${addition}`;
}

function normalizeItem(item: RawCourseModuleItem): RawCourseModuleItem {
	const extractedLink = extractLeadingResourceLink(item.title, item.content);
	const normalizedSolutionLink = canonicalizeResourceUrl(item.solutionLink);

	return {
		title: dedupeRepeatedTitle(item.title.trim()),
		content: expandSlightly(
			item.title,
			normalizeContent(extractedLink?.content ?? item.content)
		),
		projectLink:
			canonicalizeResourceUrl(item.projectLink) ??
			extractedLink?.url ??
			(shouldExposeLegacySolutionAsProject(
				item.title,
				normalizedSolutionLink
			)
				? normalizedSolutionLink
				: undefined),
		solutionLink: normalizedSolutionLink,
		datasetLink: item.datasetLink,
		mediaLink: item.mediaLink
	};
}

function normalizeCourse(rawCourse: RawCourse): RawCourse {
	return {
		name: rawCourse.name,
		modules: rawCourse.modules.map(module => ({
			title: module.title.trim(),
			curriculum: module.curriculum
				.filter(item => !shouldHideItem(item.title))
				.map(normalizeItem),
			supplementalProjects: module.supplementalProjects
				.filter(item => !shouldHideItem(item.title))
				.map(normalizeItem)
		}))
	};
}

function buildCurriculumSupportItem(
	moduleTitle: string,
	focus: string,
	index: number
): RawCourseModuleItem {
	const variants = [
		{
			title: `${focus}: Guided Example Review`,
			content: `Walk through one representative example from ${moduleTitle}, identify the checkpoints that matter most, and compare one correct approach to one flawed attempt.`
		},
		{
			title: `${focus}: Debugging and Failure Modes`,
			content: `Focus on the mistakes students are most likely to make in ${moduleTitle}. Have them diagnose a broken attempt, repair it, and explain why the fix works.`
		},
		{
			title: `${focus}: Planning and Architecture`,
			content: `Break ${moduleTitle} into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built.`
		},
		{
			title: `${focus}: Verification and Reflection`,
			content: `Close ${moduleTitle} by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass.`
		}
	];
	return variants[(index - 1) % variants.length];
}

function buildSupplementalSupportItem(
	moduleTitle: string,
	focus: string,
	index: number
): RawCourseModuleItem {
	const variants = [
		{
			title: `${focus}: Extension Challenge`,
			content: `Extend the work from ${moduleTitle} with a tighter constraint, one extra feature, or a slightly more realistic input case.`
		},
		{
			title: `${focus}: Fluency Drill`,
			content: `Repeat the core ideas from ${moduleTitle} on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning.`
		},
		{
			title: `${focus}: Open-Ended Variant`,
			content: `Create an original variation inspired by ${moduleTitle}. Keep the scope small, but require one meaningful design or reasoning choice.`
		}
	];
	return variants[(index - 1) % variants.length];
}

function buildLinkedSupplementalProjectItem(
	moduleTitle: string,
	focus: string,
	index: number,
	resource: ResourceEntry
): RawCourseModuleItem {
	const resourceLabel = humanizeResourceLabel(resource.label);
	const title =
		resourceLabel && slugify(resourceLabel) !== slugify(focus)
			? `${focus}: ${resourceLabel}`
			: `${focus}: Supplemental Project ${index}`;

	return {
		title,
		content: `Use the linked starter and solution for a supplemental project tied to ${moduleTitle}. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.`,
		projectLink: resource.projectLink,
		solutionLink: resource.solutionLink
	};
}

function humanizeResourceLabel(label: string) {
	return label
		.replace(/[-_]/g, " ")
		.replace(/^[A-Za-z]{2,}\d+[A-Za-z0-9]*\s+/u, "")
		.replace(/\b(starter|solution|updated|template)\b/gi, "")
		.replace(/\s+/g, " ")
		.trim();
}

function nextFocusLabel(
	moduleTitle: string,
	resource: ResourceEntry | null,
	courseConfig: CourseConfig
) {
	if (resource) {
		return humanizeResourceLabel(resource.label);
	}

	return (
		moduleTitle.replace(CHECK_IN_PREFIX_RE, "").trim() ||
		courseConfig.moduleFocus
	);
}

function firstLinkedItem(module: RawCourseModule) {
	return [...module.curriculum, ...module.supplementalProjects].find(
		item => item.projectLink || item.solutionLink
	);
}

async function parseCourseFileMap() {
	const indexFile = await fs.readFile(
		path.join(COURSES_DIR, "index.ts"),
		"utf8"
	);
	const fileMap = new Map<string, string>();
	const regex = /id:\s*"([^"]+)"[\s\S]*?import\("\.\/([^"]+)"\)/g;

	for (const match of indexFile.matchAll(regex)) {
		fileMap.set(match[1], `${match[2]}.ts`);
	}

	return fileMap;
}

async function scanRepoResources(repoName: string) {
	const repoPath = path.join(INSTRUCTION_MATERIAL_ROOT, repoName);
	const dirEntries = await fs.readdir(repoPath, { withFileTypes: true });
	const resources: ResourceEntry[] = [];

	for (const dirEntry of dirEntries) {
		if (!dirEntry.isDirectory() || dirEntry.name.startsWith(".")) {
			continue;
		}

		const sourcePath = dirEntry.name;
		const topLevelPath = path.join(repoPath, sourcePath);
		const starterPath = path.join(topLevelPath, "starter");
		const solutionPath = path.join(topLevelPath, "solution");
		const hasStarter = await fs
			.stat(starterPath)
			.then(stat => stat.isDirectory())
			.catch(() => false);
		const hasSolution = await fs
			.stat(solutionPath)
			.then(stat => stat.isDirectory())
			.catch(() => false);

		resources.push({
			label: sourcePath,
			projectLink: hasStarter
				? `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}/starter`
				: `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}`,
			solutionLink: hasSolution
				? `https://github.com/instruction-material/${repoName}/tree/main/${sourcePath}/solution`
				: undefined,
			sourcePath,
			repoName
		});
	}

	return resources.sort((left, right) =>
		left.sourcePath.localeCompare(right.sourcePath)
	);
}

function buildReadme(
	projectTitle: string,
	courseName: string,
	moduleTitle: string,
	projectKind: ProjectKind
) {
	const runLine = {
		assembly: "`cc main.c routine.S -o app && ./app`",
		c: "`cc main.c -o app && ./app`",
		cpp: "`c++ -std=c++17 main.cpp -o app && ./app`",
		"cpp-pattern": "`c++ -std=c++17 main.cpp -o app && ./app`",
		java: "`javac Main.java && java Main`",
		"java-pattern": "`javac Main.java && java Main`",
		linux: "`bash task.sh`",
		python: "`python3 main.py`",
		"python-ai": "`python3 main.py`",
		"python-data": "`python3 main.py`",
		"python-pattern": "`python3 main.py`",
		"python-security": "`python3 main.py`",
		rust: "`cargo run`",
		swift: "`swift App.swift`",
		web: "open `index.html` in a browser"
	}[projectKind];

	return `# ${projectTitle}

Course: ${courseName}
Module: ${moduleTitle}

Use the starter folder first. The starter is intentionally incomplete, and the solution shows one clean way to finish the same build after the student has worked through it.

Suggested flow:
- Read the module brief and identify the core requirement.
- Complete the TODO markers in the starter implementation.
- Test at least one custom case beyond the default example.
- Compare against the solution only after the student has a working draft.

Quick run hint: ${runLine}
`;
}

function buildProjectFiles(
	projectKind: ProjectKind,
	projectTitle: string,
	courseName: string,
	moduleTitle: string
) {
	const readme = buildReadme(
		projectTitle,
		courseName,
		moduleTitle,
		projectKind
	);

	const sharedByKind: Record<ProjectKind, Record<string, string>> = {
		assembly: {
			"starter/main.c": `#include <stdio.h>

extern int transform_value(int value);

int main(void) {
\tint values[] = {3, 7, 11, 19};
\tint total = 0;
\tfor (int i = 0; i < 4; i++) {
\t\ttotal += transform_value(values[i]);
\t}
\tprintf("total=%d\\n", total);
\treturn 0;
}
`,
			"starter/routine.S": `.global transform_value
transform_value:
\t# TODO: load the input value, apply a simple transform, and return it in eax
\tmovl %edi, %eax
\tret
`,
			"solution/main.c": `#include <stdio.h>

extern int transform_value(int value);

int main(void) {
\tint values[] = {3, 7, 11, 19};
\tint total = 0;
\tfor (int i = 0; i < 4; i++) {
\t\ttotal += transform_value(values[i]);
\t}
\tprintf("total=%d\\n", total);
\treturn 0;
}
`,
			"solution/routine.S": `.global transform_value
transform_value:
\tleal 5(%rdi,%rdi), %eax
\tret
`
		},
		c: {
			"starter/main.c": `#include <stdio.h>
#include <string.h>

typedef struct {
\tchar label[32];
\tint value;
} Record;

int summarize_records(const Record *records, int count) {
\tint total = 0;
\tfor (int i = 0; i < count; i++) {
\t\t// TODO: fold the current record into the total in a safer, clearer way.
\t\t(void)records;
\t}
\treturn total;
}

int main(void) {
\tRecord records[] = {
\t\t{"alpha", 4},
\t\t{"beta", 9},
\t\t{"gamma", 15},
\t};
\tprintf("summary=%d\\n", summarize_records(records, 3));
\treturn 0;
}
`,
			"solution/main.c": `#include <stdio.h>
#include <string.h>

typedef struct {
\tchar label[32];
\tint value;
} Record;

int summarize_records(const Record *records, int count) {
\tint total = 0;
\tfor (int i = 0; i < count; i++) {
\t\tif (strncmp(records[i].label, "beta", sizeof(records[i].label)) == 0) {
\t\t\ttotal += records[i].value * 2;
\t\t} else {
\t\t\ttotal += records[i].value;
\t\t}
\t}
\treturn total;
}

int main(void) {
\tRecord records[] = {
\t\t{"alpha", 4},
\t\t{"beta", 9},
\t\t{"gamma", 15},
\t};
\tprintf("summary=%d\\n", summarize_records(records, 3));
\treturn 0;
}
`
		},
		cpp: {
			"starter/main.cpp": `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

std::vector<int> transformValues(const std::vector<int>& values) {
\tstd::vector<int> result;
\tfor (int value : values) {
\t\t// TODO: transform each value and push it into result.
\t\t(void)value;
\t}
\treturn result;
}

int main() {
\tconst std::vector<int> values {3, 8, 13, 21};
\tfor (int value : transformValues(values)) {
\t\tstd::cout << value << "\\n";
\t}
}
`,
			"solution/main.cpp": `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

std::vector<int> transformValues(const std::vector<int>& values) {
\tstd::vector<int> result;
\tresult.reserve(values.size());
\tfor (int value : values) {
\t\tresult.push_back(value * 2 + 1);
\t}
\treturn result;
}

int main() {
\tconst std::vector<int> values {3, 8, 13, 21};
\tfor (int value : transformValues(values)) {
\t\tstd::cout << value << "\\n";
\t}
}
`
		},
		"cpp-pattern": {
			"starter/main.cpp": `#include <iostream>
#include <memory>
#include <string>

class Formatter {
public:
\tvirtual ~Formatter() = default;
\tvirtual std::string format(const std::string& input) const = 0;
};

class TitleFormatter : public Formatter {
public:
\tstd::string format(const std::string& input) const override {
\t\t// TODO: return a transformed representation.
\t\treturn input;
\t}
};

int main() {
\tstd::unique_ptr<Formatter> formatter = std::make_unique<TitleFormatter>();
\tstd::cout << formatter->format("design patterns") << "\\n";
}
`,
			"solution/main.cpp": `#include <cctype>
#include <iostream>
#include <memory>
#include <string>

class Formatter {
public:
\tvirtual ~Formatter() = default;
\tvirtual std::string format(const std::string& input) const = 0;
};

class TitleFormatter : public Formatter {
public:
\tstd::string format(const std::string& input) const override {
\t\tstd::string output = input;
\t\tbool makeUpper = true;
\t\tfor (char& ch : output) {
\t\t\tif (std::isspace(static_cast<unsigned char>(ch))) {
\t\t\t\tmakeUpper = true;
\t\t\t\tcontinue;
\t\t\t}
\t\t\tif (makeUpper) {
\t\t\t\tch = static_cast<char>(std::toupper(static_cast<unsigned char>(ch)));
\t\t\t\tmakeUpper = false;
\t\t\t}
\t\t}
\t\treturn output;
\t}
};

int main() {
\tstd::unique_ptr<Formatter> formatter = std::make_unique<TitleFormatter>();
\tstd::cout << formatter->format("design patterns") << "\\n";
}
`
		},
		java: {
			"starter/Main.java": `import java.util.List;

public class Main {
\tprivate static int computeScore(List<Integer> values) {
\t\tint total = 0;
\t\tfor (int value : values) {
\t\t\t// TODO: update the scoring rule.
\t\t}
\t\treturn total;
\t}

\tpublic static void main(String[] args) {
\t\tSystem.out.println(computeScore(List.of(2, 5, 8, 13)));
\t}
}
`,
			"solution/Main.java": `import java.util.List;

public class Main {
\tprivate static int computeScore(List<Integer> values) {
\t\tint total = 0;
\t\tfor (int value : values) {
\t\t\ttotal += value % 2 == 0 ? value / 2 : value * 2;
\t\t}
\t\treturn total;
\t}

\tpublic static void main(String[] args) {
\t\tSystem.out.println(computeScore(List.of(2, 5, 8, 13)));
\t}
}
`
		},
		"java-pattern": {
			"starter/Main.java": `interface PricingStrategy {
\tdouble priceFor(int units);
}

final class BulkPricingStrategy implements PricingStrategy {
\t@Override
\tpublic double priceFor(int units) {
\t\t// TODO: apply a smarter pricing strategy.
\t\treturn units;
\t}
}

public class Main {
\tpublic static void main(String[] args) {
\t\tPricingStrategy strategy = new BulkPricingStrategy();
\t\tSystem.out.println(strategy.priceFor(6));
\t}
}
`,
			"solution/Main.java": `interface PricingStrategy {
\tdouble priceFor(int units);
}

final class BulkPricingStrategy implements PricingStrategy {
\t@Override
\tpublic double priceFor(int units) {
\t\tif (units >= 10) {
\t\t\treturn units * 2.5;
\t\t}
\t\tif (units >= 5) {
\t\t\treturn units * 3.0;
\t\t}
\t\treturn units * 3.5;
\t}
}

public class Main {
\tpublic static void main(String[] args) {
\t\tPricingStrategy strategy = new BulkPricingStrategy();
\t\tSystem.out.println(strategy.priceFor(6));
\t}
}
`
		},
		linux: {
			"starter/task.sh": `#!/usr/bin/env bash
set -euo pipefail

# TODO: summarize the log file more carefully.
grep -c "ERROR" sample.log
`,
			"starter/sample.log": `INFO booting
WARNING low-disk
ERROR failed-auth
INFO retry
ERROR timeout
`,
			"solution/task.sh": `#!/usr/bin/env bash
set -euo pipefail

error_count=$(grep -c "ERROR" sample.log || true)
warning_count=$(grep -c "WARNING" sample.log || true)
printf 'errors=%s warnings=%s\\n' "$error_count" "$warning_count"
`,
			"solution/sample.log": `INFO booting
WARNING low-disk
ERROR failed-auth
INFO retry
ERROR timeout
`
		},
		python: {
			"starter/main.py": `def transform(values: list[int]) -> list[int]:
\tresult: list[int] = []
\tfor value in values:
\t\t# TODO: transform the current value and append it to result.
\t\tpass
\treturn result


def main() -> None:
\tprint(transform([3, 7, 11, 19]))


if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `def transform(values: list[int]) -> list[int]:
\tresult: list[int] = []
\tfor value in values:
\t\tresult.append(value * 2 + 1)
\treturn result


def main() -> None:
\tprint(transform([3, 7, 11, 19]))


if __name__ == "__main__":
\tmain()
`
		},
		"python-ai": {
			"starter/main.py": `GRAPH = {
\t"A": ["B", "C"],
\t"B": ["D"],
\t"C": ["E", "F"],
\t"D": [],
\t"E": [],
\t"F": [],
}


def breadth_first_path(start: str, goal: str) -> list[str]:
\t# TODO: return one path from start to goal.
\treturn []


def main() -> None:
\tprint(breadth_first_path("A", "F"))


if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `from collections import deque

GRAPH = {
\t"A": ["B", "C"],
\t"B": ["D"],
\t"C": ["E", "F"],
\t"D": [],
\t"E": [],
\t"F": [],
}


def breadth_first_path(start: str, goal: str) -> list[str]:
\tqueue: deque[list[str]] = deque([[start]])
\tvisited = {start}
\twhile queue:
\t\tpath = queue.popleft()
\t\tnode = path[-1]
\t\tif node == goal:
\t\t\treturn path
\t\tfor neighbor in GRAPH[node]:
\t\t\tif neighbor not in visited:
\t\t\t\tvisited.add(neighbor)
\t\t\t\tqueue.append([*path, neighbor])
\treturn []


def main() -> None:
\tprint(breadth_first_path("A", "F"))


if __name__ == "__main__":
\tmain()
`
		},
		"python-data": {
			"starter/data/sample.csv": `label,value
alpha,4
beta,8
gamma,11
delta,17
`,
			"starter/main.py": `import csv
from pathlib import Path


def load_values() -> list[int]:
\twith Path("data/sample.csv").open() as handle:
\t\treader = csv.DictReader(handle)
\t\treturn [int(row["value"]) for row in reader]


def summarize(values: list[int]) -> dict[str, float]:
\t# TODO: compute count, total, and average.
\treturn {"count": 0, "total": 0, "average": 0.0}


def main() -> None:
\tprint(summarize(load_values()))


if __name__ == "__main__":
\tmain()
`,
			"solution/data/sample.csv": `label,value
alpha,4
beta,8
gamma,11
delta,17
`,
			"solution/main.py": `import csv
from pathlib import Path


def load_values() -> list[int]:
\twith Path("data/sample.csv").open() as handle:
\t\treader = csv.DictReader(handle)
\t\treturn [int(row["value"]) for row in reader]


def summarize(values: list[int]) -> dict[str, float]:
\ttotal = sum(values)
\tcount = len(values)
\taverage = total / count if count else 0.0
\treturn {"count": count, "total": total, "average": average}


def main() -> None:
\tprint(summarize(load_values()))


if __name__ == "__main__":
\tmain()
`
		},
		"python-pattern": {
			"starter/main.py": `class Formatter:
\tdef format(self, text: str) -> str:
\t\traise NotImplementedError


class TitleFormatter(Formatter):
\tdef format(self, text: str) -> str:
\t\t# TODO: return a transformed string.
\t\treturn text


def main() -> None:
\tprint(TitleFormatter().format("design patterns"))


if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `class Formatter:
\tdef format(self, text: str) -> str:
\t\traise NotImplementedError


class TitleFormatter(Formatter):
\tdef format(self, text: str) -> str:
\t\treturn text.title()


def main() -> None:
\tprint(TitleFormatter().format("design patterns"))


if __name__ == "__main__":
\tmain()
`
		},
		"python-security": {
			"starter/main.py": `def normalize_ports(raw_values: list[str]) -> list[int]:
\tnormalized: list[int] = []
\tfor raw_value in raw_values:
\t\t# TODO: parse the current entry, reject invalid ports, and append safe values.
\t\tpass
\treturn normalized


def main() -> None:
\tprint(normalize_ports(["22", "443", "8080", "bad"]))


if __name__ == "__main__":
\tmain()
`,
			"solution/main.py": `def normalize_ports(raw_values: list[str]) -> list[int]:
\tnormalized: list[int] = []
\tfor raw_value in raw_values:
\t\tif not raw_value.isdigit():
\t\t\tcontinue
\t\tport = int(raw_value)
\t\tif 1 <= port <= 65535:
\t\t\tnormalized.append(port)
\treturn normalized


def main() -> None:
\tprint(normalize_ports(["22", "443", "8080", "bad"]))


if __name__ == "__main__":
\tmain()
`
		},
		rust: {
			"starter/Cargo.toml": `[package]
name = "rust_systems_security_lab"
version = "0.1.0"
edition = "2021"
`,
			"starter/src/main.rs": `fn sanitize(input: &str) -> String {
\t// TODO: keep only ASCII alphanumeric characters and dashes.
\tinput.to_string()
}

fn main() {
\tprintln!("{}", sanitize("packet-42!"));
}
`,
			"solution/Cargo.toml": `[package]
name = "rust_systems_security_lab"
version = "0.1.0"
edition = "2021"
`,
			"solution/src/main.rs": `fn sanitize(input: &str) -> String {
\tinput
\t\t.chars()
\t\t.filter(|ch| ch.is_ascii_alphanumeric() || *ch == '-')
\t\t.collect()
}

fn main() {
\tprintln!("{}", sanitize("packet-42!"));
}
`
		},
		swift: {
			"starter/App.swift": `import SwiftUI

@main
struct StarterApp: App {
\tvar body: some Scene {
\t\tWindowGroup {
\t\t\tContentView()
\t\t}
\t}
}
`,
			"starter/ContentView.swift": `import SwiftUI

struct ContentView: View {
\tvar body: some View {
\t\tVStack(spacing: 16) {
\t\t\tText("${projectTitle}")
\t\t\tText("TODO: replace this with the module UI.")
\t\t}
\t\t.padding()
\t}
}
`,
			"solution/App.swift": `import SwiftUI

@main
struct SolutionApp: App {
\tvar body: some Scene {
\t\tWindowGroup {
\t\t\tContentView()
\t\t}
\t}
}
`,
			"solution/ContentView.swift": `import SwiftUI

struct ContentView: View {
\t@State private var isComplete = false

\tvar body: some View {
\t\tVStack(spacing: 16) {
\t\t\tText("${projectTitle}")
\t\t\tText(isComplete ? "Ready for extension work." : "Work through the core requirements first.")
\t\t\tButton("Toggle Status") {
\t\t\t\tisComplete.toggle()
\t\t\t}
\t\t}
\t\t.padding()
\t}
}
`
		},
		web: {
			"starter/index.html": `<!doctype html>
<html lang="en">
\t<head>
\t\t<meta charset="UTF-8">
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t\t<title>${projectTitle}</title>
\t\t<link rel="stylesheet" href="./styles.css">
\t</head>
\t<body>
\t\t<main class="app">
\t\t\t<h1>${projectTitle}</h1>
\t\t\t<p>Complete the TODOs in <code>script.js</code>.</p>
\t\t\t<button id="action">Add Entry</button>
\t\t\t<ul id="entries"></ul>
\t\t</main>
\t\t<script src="./script.js"></script>
\t</body>
</html>
`,
			"starter/styles.css": `body {
\tfont-family: "Helvetica Neue", Arial, sans-serif;
\tbackground: #f7f4ed;
\tcolor: #1f2937;
\tmargin: 0;
}

.app {
\tmax-width: 720px;
\tmargin: 48px auto;
\tpadding: 24px;
\tbackground: white;
\tborder-radius: 18px;
\tbox-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
}
`,
			"starter/script.js": `const button = document.querySelector("#action");
const entries = document.querySelector("#entries");

button.addEventListener("click", () => {
\t// TODO: append a new list item that reflects the module work.
});
`,
			"solution/index.html": `<!doctype html>
<html lang="en">
\t<head>
\t\t<meta charset="UTF-8">
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t\t<title>${projectTitle}</title>
\t\t<link rel="stylesheet" href="./styles.css">
\t</head>
\t<body>
\t\t<main class="app">
\t\t\t<h1>${projectTitle}</h1>
\t\t\t<p>Each click appends another verified entry.</p>
\t\t\t<button id="action">Add Entry</button>
\t\t\t<ul id="entries"></ul>
\t\t</main>
\t\t<script src="./script.js"></script>
\t</body>
</html>
`,
			"solution/styles.css": `body {
\tfont-family: "Helvetica Neue", Arial, sans-serif;
\tbackground: #f7f4ed;
\tcolor: #1f2937;
\tmargin: 0;
}

.app {
\tmax-width: 720px;
\tmargin: 48px auto;
\tpadding: 24px;
\tbackground: white;
\tborder-radius: 18px;
\tbox-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
}

li + li {
\tmargin-top: 10px;
}
`,
			"solution/script.js": `const button = document.querySelector("#action");
const entries = document.querySelector("#entries");

let count = 0;

button.addEventListener("click", () => {
\tcount += 1;
\tconst item = document.createElement("li");
\titem.textContent = \`Entry \${count}: module checkpoint recorded.\`;
\tentries.append(item);
});
`
		}
	};

	return {
		"README.md": readme,
		...sharedByKind[projectKind]
	};
}

function firstHostRepo(config: CourseConfig, indexHint = 0) {
	return config.hostRepos[indexHint % config.hostRepos.length];
}

async function main() {
	const courseFileMap = await parseCourseFileMap();
	const allRepoNames = Array.from(
		new Set(
			Object.values(COURSE_CONFIG).flatMap(config => config.hostRepos)
		)
	);
	const repoResources = new Map<string, ResourceEntry[]>();
	const repoExistingPaths = new Map<string, Set<string>>();

	for (const repoName of allRepoNames) {
		const resources = await scanRepoResources(repoName);
		repoResources.set(repoName, resources);
		repoExistingPaths.set(
			repoName,
			new Set(resources.map(resource => resource.sourcePath))
		);
	}

	const globalUsedLinks = new Set<string>();

	for (const entry of courseCatalog) {
		const rawCourse = normalizeCourse(await loadRawCourse(entry.id));
		for (const module of rawCourse.modules) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				if (item.projectLink) {
					globalUsedLinks.add(item.projectLink);
				}
				if (item.solutionLink) {
					globalUsedLinks.add(item.solutionLink);
				}
			}
		}
	}

	for (const [repoName, resources] of repoResources) {
		repoResources.set(
			repoName,
			resources.filter(resource => {
				if (
					resource.projectLink &&
					globalUsedLinks.has(resource.projectLink)
				) {
					return false;
				}

				if (
					resource.solutionLink &&
					globalUsedLinks.has(resource.solutionLink)
				) {
					return false;
				}

				return true;
			})
		);
	}

	const createdCountByPrefix = new Map<string, number>();

	async function allocateResource(
		courseId: string,
		moduleTitle: string,
		indexHint = 0
	): Promise<ResourceEntry | null> {
		const config = COURSE_CONFIG[courseId];
		if (!config?.codeBacked || !config.projectKind) {
			return null;
		}

		for (let offset = 0; offset < config.hostRepos.length; offset++) {
			const repoName =
				config.hostRepos[
					(indexHint + offset) % config.hostRepos.length
				];
			const pool = repoResources.get(repoName) ?? [];
			const nextResource = pool.shift();
			if (nextResource) {
				if (nextResource.projectLink)
					globalUsedLinks.add(nextResource.projectLink);
				if (nextResource.solutionLink)
					globalUsedLinks.add(nextResource.solutionLink);
				return nextResource;
			}
		}

		const repoName = firstHostRepo(config, indexHint);
		const prefixCount = (createdCountByPrefix.get(config.prefix) ?? 0) + 1;
		createdCountByPrefix.set(config.prefix, prefixCount);
		const folderSlug = slugify(moduleTitle).slice(0, 48);
		const sourcePath = `${config.prefix}${String(prefixCount).padStart(2, "0")}-${folderSlug || "applied-studio"}`;
		const existingPaths = repoExistingPaths.get(repoName);
		let uniquePath = sourcePath;
		let suffix = 2;
		while (existingPaths?.has(uniquePath)) {
			uniquePath = `${sourcePath}-${suffix}`;
			suffix += 1;
		}
		existingPaths?.add(uniquePath);

		const repoPath = path.join(INSTRUCTION_MATERIAL_ROOT, repoName);
		const projectRoot = path.join(repoPath, uniquePath);
		const files = buildProjectFiles(
			config.projectKind,
			moduleTitle,
			(await loadRawCourse(courseId)).name,
			moduleTitle
		);

		for (const [relativeFilePath, content] of Object.entries(files)) {
			const absoluteFilePath = path.join(projectRoot, relativeFilePath);
			await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
			await fs.writeFile(absoluteFilePath, content, "utf8");
		}

		const createdResource = {
			label: moduleTitle,
			projectLink: `https://github.com/instruction-material/${repoName}/tree/main/${uniquePath}/starter`,
			solutionLink: `https://github.com/instruction-material/${repoName}/tree/main/${uniquePath}/solution`,
			sourcePath: uniquePath,
			repoName
		} satisfies ResourceEntry;

		if (createdResource.projectLink) {
			globalUsedLinks.add(createdResource.projectLink);
		}
		if (createdResource.solutionLink) {
			globalUsedLinks.add(createdResource.solutionLink);
		}

		return createdResource;
	}

	for (const entry of courseCatalog) {
		if (PYTHON_BASELINE_IDS.has(entry.id)) {
			continue;
		}

		const config = COURSE_CONFIG[entry.id];
		const fileName = courseFileMap.get(entry.id);
		if (!config || !fileName) {
			continue;
		}

		const filePath = path.join(COURSES_DIR, fileName);
		const originalFile = await fs.readFile(filePath, "utf8");
		const exportMatch = originalFile.match(
			/export const (\w+): RawCourse =/
		);
		if (!exportMatch) {
			throw new Error(`Unable to find course export in ${fileName}`);
		}
		const exportName = exportMatch[1];
		const normalizedCourse = normalizeCourse(await loadRawCourse(entry.id));
		const modules = [...normalizedCourse.modules];

		while (modules.length < TARGET_MODULE_COUNT) {
			const studioIndex = modules.length + 1;
			const resource = await allocateResource(
				entry.id,
				`${config.moduleFocus} ${studioIndex}`,
				studioIndex
			);
			const focus = nextFocusLabel(config.moduleFocus, resource, config);
			const moduleTitle = `Applied Studio ${studioIndex}: ${focus}`;
			const newModule: RawCourseModule = {
				title: moduleTitle,
				curriculum: [
					{
						title: `${focus}: Core Concepts`,
						content: `Introduce the main goal of ${moduleTitle}, define the success criteria, and review the concepts students must understand before they begin the main build or problem.`
					},
					{
						title: `${focus}: Guided Example`,
						content: `Walk through one representative example for ${moduleTitle}, naming the key inputs, the expected outputs, and the checkpoints worth verifying early.`
					},
					{
						title: `${focus}: Core Project`,
						content: `Build the central artifact for ${moduleTitle}. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.`,
						projectLink: resource?.projectLink,
						solutionLink: resource?.solutionLink
					},
					{
						title: `${focus}: Review and Reflection`,
						content: `Close ${moduleTitle} by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer.`
					}
				],
				supplementalProjects: [
					{
						title: `${focus}: Extension Challenge`,
						content: `Extend the core build from ${moduleTitle} with one extra requirement, stricter input handling, or a more realistic variation of the same task.`,
						projectLink: resource?.projectLink,
						solutionLink: resource?.solutionLink
					},
					{
						title: `${focus}: Open Practice`,
						content: `Create a compact variant inspired by ${moduleTitle}. Keep the scope tight, but require one meaningful design or reasoning decision.`
					},
					{
						title: `${focus}: Integration Drill`,
						content: `Rebuild one part of ${moduleTitle} under a slightly different constraint so students practice transfer instead of repeating the exact same steps.`
					}
				]
			};
			modules.push(newModule);
		}

		for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
			const module = modules[moduleIndex];
			const linkedItem = firstLinkedItem(module);
			let resource: ResourceEntry | null = linkedItem
				? {
						label: module.title,
						projectLink: linkedItem.projectLink,
						solutionLink: linkedItem.solutionLink,
						sourcePath: "",
						repoName: ""
					}
				: null;

			while (module.curriculum.length < TARGET_CURRICULUM_ITEMS) {
				const focus = nextFocusLabel(module.title, resource, config);
				module.curriculum.push(
					buildCurriculumSupportItem(
						module.title,
						focus,
						module.curriculum.length + 1
					)
				);
			}

			if (config.codeBacked) {
				for (
					let supplementalIndex = 0;
					supplementalIndex < module.supplementalProjects.length;
					supplementalIndex++
				) {
					const supplementalProject =
						module.supplementalProjects[supplementalIndex];

					if (
						supplementalProject.projectLink ||
						supplementalProject.solutionLink
					) {
						continue;
					}

					const supplementalResource = await allocateResource(
						entry.id,
						`${module.title} supplemental ${supplementalIndex + 1}`,
						moduleIndex + supplementalIndex + 1
					);

					if (!supplementalResource) {
						continue;
					}

					const focus = nextFocusLabel(
						module.title,
						supplementalResource,
						config
					);
					module.supplementalProjects[supplementalIndex] =
						buildLinkedSupplementalProjectItem(
							module.title,
							focus,
							supplementalIndex + 1,
							supplementalResource
						);
				}
			}

			while (
				module.supplementalProjects.length < TARGET_SUPPLEMENTAL_ITEMS
			) {
				const focus = nextFocusLabel(module.title, resource, config);
				const supplementalIndex =
					module.supplementalProjects.length + 1;
				if (config.codeBacked) {
					const supplementalResource = await allocateResource(
						entry.id,
						`${module.title} supplemental ${supplementalIndex}`,
						moduleIndex + supplementalIndex
					);

					if (supplementalResource) {
						module.supplementalProjects.push(
							buildLinkedSupplementalProjectItem(
								module.title,
								nextFocusLabel(
									module.title,
									supplementalResource,
									config
								),
								supplementalIndex,
								supplementalResource
							)
						);
						continue;
					}
				}

				module.supplementalProjects.push(
					buildSupplementalSupportItem(
						module.title,
						focus,
						supplementalIndex
					)
				);
			}

			if (!resource && config.codeBacked) {
				resource = await allocateResource(
					entry.id,
					module.title,
					moduleIndex
				);
			}

			if (
				resource &&
				!module.curriculum.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				module.curriculum.push({
					title: `${module.title}: Core Project`,
					content: `Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.`,
					projectLink: resource.projectLink,
					solutionLink: resource.solutionLink
				});
			}

			if (
				resource &&
				!module.supplementalProjects.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				module.supplementalProjects[0] = {
					...module.supplementalProjects[0],
					projectLink: resource.projectLink,
					solutionLink: resource.solutionLink
				};
			}

			if (
				resource &&
				module.curriculum.length > 0 &&
				!module.curriculum.some(
					item => item.projectLink || item.solutionLink
				)
			) {
				const projectItem =
					module.curriculum.find(item =>
						/\bproject\b|\bcapstone\b/i.test(item.title)
					) ?? module.curriculum[module.curriculum.length - 1];
				projectItem.projectLink = resource.projectLink;
				projectItem.solutionLink = resource.solutionLink;
			}

			module.curriculum = module.curriculum.map(item => ({
				...item,
				content: expandSlightly(
					item.title,
					normalizeContent(item.content)
				)
			}));
			module.supplementalProjects = module.supplementalProjects.map(
				item => ({
					...item,
					content: expandSlightly(
						item.title,
						normalizeContent(item.content)
					)
				})
			);
		}

		const nextCourse: RawCourse = {
			name: normalizedCourse.name,
			modules
		};
		const nextFile = `import type { RawCourse } from "./types";

export const ${exportName}: RawCourse = ${JSON.stringify(nextCourse, null, "\t")};
`;

		const formattedFile = await prettier.format(nextFile, {
			filepath: filePath
		});

		await fs.writeFile(filePath, formattedFile, "utf8");
	}
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
