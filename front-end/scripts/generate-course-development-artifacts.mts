import fs from "node:fs";
import path from "node:path";
import { courseCatalog, loadRawCourse } from "../src/stores/courses/index";
import { courseImplementationSourceRepos } from "../src/stores/courses/course-implementation-artifacts";
import type { RawCourse, RawCourseModuleItem } from "../src/stores/courses/types";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const outDir = path.join(repoRoot, "no-include");
const instructionRoot =
	"/Users/jacobanderson/Documents/Work/Instruction-Material";

const structuredSupportPattern =
	/\*\*(?:Project goal|Teaching flow|Diagnostic guidance|Remote investigation|Science explanation|Studio focus|AP connection|Remote investigation):?\*\*/i;
const placeholderPattern =
	/\b(?:introduce the main goal|build the central artifact|define the success criteria|alternate supplemental snapshot)\b/i;
const projectTitlePattern =
	/\b(?:project|capstone|studio|lab|practice|challenge)\b/i;
const scienceEvidencePattern =
	/\b(?:CER|claim[-, ]+evidence(?:[-, ]+and)?[-, ]+reasoning)\b/i;
const scienceCourseIds = new Set([
	"elementary-science",
	"middle-school-integrated-science",
	"intro-to-chemistry",
	"intro-to-physics",
	"physics-level-2"
]);

function wordCount(text: string) {
	return text.match(/\b[\w'+-]+\b/g)?.length ?? 0;
}

function writeJson(file: string, value: unknown) {
	fs.writeFileSync(
		path.join(outDir, file),
		`${JSON.stringify(value, null, 2)}\n`
	);
}

function writeMd(file: string, content: string) {
	fs.writeFileSync(path.join(outDir, file), `${content.trim()}\n`);
}

function listTopDirs(root: string) {
	if (!fs.existsSync(root)) return [];

	return fs
		.readdirSync(root, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
		.filter(name => !name.startsWith("."))
		.filter(
			name =>
				![
					"build",
					"cmake-build-debug",
					"node_modules",
					"dist",
					"__pycache__"
				].includes(name)
		)
		.sort((a, b) => a.localeCompare(b));
}

function sourceFiles(root: string) {
	if (!fs.existsSync(root)) return [];
	const results: string[] = [];
	const stack = [root];

	while (stack.length > 0) {
		const current = stack.pop()!;
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			if (entry.name.startsWith(".")) continue;
			const fullPath = path.join(current, entry.name);
			if (entry.isDirectory()) {
				if (!["build", "cmake-build-debug", "node_modules", "dist"].includes(entry.name)) {
					stack.push(fullPath);
				}
				continue;
			}
			if (/\.(?:java|py|cpp|c|h|hpp|js|ts|swift|cs|md)$/i.test(entry.name)) {
				results.push(path.relative(root, fullPath));
			}
		}
	}

	return results.sort((a, b) => a.localeCompare(b));
}

function allItems(course: RawCourse) {
	return course.modules.flatMap(module =>
		[
			...module.curriculum.map(item => ({
				module: module.title,
				section: "curriculum",
				item
			})),
			...module.supplementalProjects.map(item => ({
				module: module.title,
				section: "supplementalProjects",
				item
			}))
		] as Array<{
			module: string;
			section: string;
			item: RawCourseModuleItem;
		}>
	);
}

function linkedFoldersForRepo(course: RawCourse, repo: string) {
	const folders = new Set<string>();
	const prefix = `github.com/instruction-material/${repo}/tree/main/`;

	for (const { item } of allItems(course)) {
		for (const url of [item.projectLink, item.solutionLink]) {
			if (!url?.includes(prefix)) continue;
			const after = url.split(prefix)[1] ?? "";
			const folder = after.split("/").filter(Boolean)[0];
			if (folder) folders.add(folder);
		}
	}

	return [...folders].sort((a, b) => a.localeCompare(b));
}

function itemLinks(course: RawCourse) {
	const items = allItems(course);
	return {
		projectLinks: items.filter(({ item }) => item.projectLink).length,
		solutionLinks: items.filter(({ item }) => item.solutionLink).length,
		datasetLinks: items.filter(({ item }) => item.datasetLink).length,
		mediaLinks: items.filter(({ item }) => item.mediaLink).length
	};
}

function severityFlags(courseId: string, item: RawCourseModuleItem) {
	const flags: string[] = [];
	const words = wordCount(item.content);
	const structured = structuredSupportPattern.test(item.content);
	const projectLike = projectTitlePattern.test(item.title);

	if (placeholderPattern.test(item.content)) flags.push("placeholder-language");
	if (!structured && projectLike && words < 95) flags.push("short-project-spec");
	if (!structured && !projectLike && words < 65) flags.push("short-lesson-text");
	if (
		scienceCourseIds.has(courseId) &&
		!scienceEvidencePattern.test(item.content) &&
		!/Remote investigation/i.test(item.content)
	) {
		flags.push("science-without-evidence-structure");
	}

	return flags;
}

function asTable(headers: string[], rows: Array<Array<string | number>>) {
	return [
		`| ${headers.join(" | ")} |`,
		`| ${headers.map(() => "---").join(" | ")} |`,
		...rows.map(row => `| ${row.join(" | ")} |`)
	].join("\n");
}

const courses = (
	await Promise.all(
		courseCatalog.map(async entry => ({
			entry,
			course: await loadRawCourse(entry.id)
		}))
	)
).filter((row): row is { entry: (typeof courseCatalog)[number]; course: RawCourse } =>
	Boolean(row.course)
);

fs.mkdirSync(outDir, { recursive: true });

const structuralAudit = courses.map(({ entry, course }) => {
	const links = itemLinks(course);
	return {
		courseId: entry.id,
		name: course.name,
		modules: course.modules.length,
		modulesWithUnderTwoProjects: course.modules.filter(
			module => module.supplementalProjects.length < 2
		).length,
		projectLinks: links.projectLinks,
		solutionLinks: links.solutionLinks,
		datasetLinks: links.datasetLinks,
		mediaLinks: links.mediaLinks,
		hasFullLessonPack: course.modules.some(module =>
			module.title.endsWith(": Full Lesson Authoring Pack")
		),
		hasSourceParityModule: course.modules.some(
			module => module.title === "Source and Asset Parity Implementation"
		)
	};
});

writeJson("course-second-structural-audit.json", structuralAudit);
writeMd(
	"course-second-structural-audit.md",
	[
		"# Course Second Structural Audit",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		"This audit was generated after applying the research-backed expansion modules and implementation artifact modules.",
		"",
		asTable(
			[
				"Course",
				"Modules",
				"Under 2 Projects",
				"Project Links",
				"Solution Links",
				"Full Lesson Pack",
				"Source Parity"
			],
			structuralAudit.map(row => [
				row.courseId,
				row.modules,
				row.modulesWithUnderTwoProjects,
				row.projectLinks,
				row.solutionLinks,
				row.hasFullLessonPack ? "yes" : "no",
				row.hasSourceParityModule ? "yes" : "no"
			])
		)
	].join("\n")
);

const highSeverityLedger = courses.flatMap(({ entry, course }) =>
	allItems(course).flatMap(({ module, section, item }) => {
		const flags = severityFlags(entry.id, item);
		return flags.length > 0
			? [
					{
						courseId: entry.id,
						courseName: course.name,
						module,
						section,
						title: item.title,
						wordCount: wordCount(item.content),
						flags,
						status: "needs-human-review-or-accepted-short-label"
					}
				]
			: [];
	})
);

writeJson("course-text-high-severity-ledger.json", highSeverityLedger);
writeMd(
	"course-text-high-severity-ledger.md",
	[
		"# Course Text High-Severity Ledger",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		`Remaining flagged items: ${highSeverityLedger.length}`,
		"",
		"Flagged items require human review because automated rules cannot always distinguish intentional short labels from weak lesson text.",
		"",
		asTable(
			["Course", "Module", "Section", "Title", "Words", "Flags"],
			highSeverityLedger.slice(0, 200).map(row => [
				row.courseId,
				row.module.replaceAll("|", "/"),
				row.section,
				row.title.replaceAll("|", "/"),
				row.wordCount,
				row.flags.join(", ")
			])
		)
	].join("\n")
);

const sourceParityAudit = courses.flatMap(({ entry, course }) => {
	const repo = courseImplementationSourceRepos[entry.id];
	if (!repo) return [];
	const localRoot = path.join(instructionRoot, repo);
	const topDirs = listTopDirs(localRoot);
	const linkedFolders = linkedFoldersForRepo(course, repo);
	const linked = new Set(linkedFolders);

	return [
		{
			courseId: entry.id,
			courseName: course.name,
			repo,
			localRoot,
			exists: fs.existsSync(localRoot),
			topLevelFolders: topDirs.length,
			sourceFiles: sourceFiles(localRoot).length,
			linkedFolders,
			unlinkedTopLevelFolders: topDirs.filter(folder => !linked.has(folder)),
			...itemLinks(course)
		}
	];
});

writeJson("course-source-parity-audit.json", sourceParityAudit);
writeMd(
	"course-source-parity-audit.md",
	[
		"# Course Source Parity Audit",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		`Instruction material root: \`${instructionRoot}\``,
		"",
		asTable(
			[
				"Course",
				"Repo",
				"Exists",
				"Folders",
				"Linked",
				"Unlinked",
				"Project Links",
				"Solution Links"
			],
			sourceParityAudit.map(row => [
				row.courseId,
				row.repo,
				row.exists ? "yes" : "no",
				row.topLevelFolders,
				row.linkedFolders.length,
				row.unlinkedTopLevelFolders.length,
				row.projectLinks,
				row.solutionLinks
			])
		)
	].join("\n")
);

const scienceIds = [
	"elementary-science",
	"middle-school-integrated-science",
	"intro-to-chemistry",
	"intro-to-physics",
	"physics-level-2"
];
const scienceResources = courses
	.filter(({ entry }) => scienceIds.includes(entry.id))
	.map(({ entry, course }) => ({
		courseId: entry.id,
		modules: course.modules.map(module => ({
			title: module.title,
			resourceTypes: [
				"standards reference",
				"simulation or shared visual",
				"provided data table or graph",
				"model or diagram",
				"CER prompt"
			],
			recommendedSources:
				entry.id === "intro-to-chemistry"
					? ["ACS", "NGSS", "PhET"]
					: ["NGSS", "PhET", "NASA/NOAA/USGS/HHMI as appropriate"]
		}))
	}));

writeJson("science-resource-shortlists.json", scienceResources);
writeMd(
	"science-resource-shortlists.md",
	[
		"# Science Resource Shortlists",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		"All science investigations must be Zoom-first and require no physical supplies beyond notes/paper unless a fully equivalent provided-data or simulation alternative is available.",
		"",
		...scienceResources.flatMap(course => [
			`## ${course.courseId}`,
			"",
			asTable(
				["Module", "Resource Types", "Recommended Sources"],
				course.modules.map(module => [
					module.title.replaceAll("|", "/"),
					module.resourceTypes.join(", "),
					module.recommendedSources.join(", ")
				])
			),
			""
		])
	].join("\n")
);

writeMd(
	"elementary-science-grade-band-decision.md",
	[
		"# Elementary Science Grade-Band Decision",
		"",
		"Decision: keep one Elementary Science course, but write every future activity with a K-2 path and a grades 3-5 path.",
		"",
		"- K-2 path: observation, drawing, sorting, oral explanation, and sentence frames.",
		"- Grades 3-5 path: data tables, simple graphs, variables, model critique, and fuller CER writing.",
		"- Shared constraint: Zoom-first; no required materials beyond notes/paper."
	].join("\n")
);

writeMd(
	"algebra-project-taxonomy.md",
	[
		"# Algebra Project Taxonomy",
		"",
		"Decision: use `supplementalProjects` for explicit practice sets, application/modeling projects, error-analysis tasks, and enrichment. Keep curriculum entries for concept instruction and worked examples.",
		"",
		"- Practice set: worked example, independent problems, representation task, and explanation prompt.",
		"- Modeling project: contextual scenario, representation choice, solution, and reasonableness check.",
		"- Error analysis: flawed worked solution, diagnosis, corrected reasoning, and misconception note.",
		"- Assessment: standards-aligned quiz, cumulative mixed practice, graph/table interpretation, and written justification."
	].join("\n")
);

writeMd(
	"unity-course-rebuild-plan.md",
	[
		"# Unity Course Rebuild Implementation",
		"",
		"Target version: Unity 6.3 LTS, selected from Unity's current release/support page because support runs through December 2027.",
		"",
		"The catalog now includes UGD0-UGD6 rebuild modules covering setup, components, input/movement, physics/collision, UI/state, prefabs/spawning/polish, and capstone production.",
		"",
		"Source repo target: `/Users/jacobanderson/Documents/Work/Instruction-Material/Unity-Game-Development` and `https://github.com/instruction-material/Unity-Game-Development`."
	].join("\n")
);

writeMd(
	"cpp-levels-cs235-cs236-concept-matrix.md",
	[
		"# C++ Levels 1-3 CS235/CS236 Concept Matrix",
		"",
		"- Level 1 baseline: variables, I/O, loops, functions, classes, vectors, references, 2D vectors, and state-machine project work.",
		"- Level 2 bridge: pointers, addresses, raw arrays, pointer arithmetic, 2D arrays, dynamic memory, custom dynamic arrays, matrix classes, and ownership reflection.",
		"- Level 3: command architecture, file persistence, scanners/parsers, recursion, STL containers, relation-style views, RAII, templates, interfaces, and state-machine architecture.",
		"- DS&A boundary: linked structures, trees, heaps, hashing, graph algorithms, dynamic programming, and complexity-first implementation.",
		"- Exclusion: AI/ML concepts remain outside the C++ sequence."
	].join("\n")
);

writeMd(
	"ap-csa-exam-alignment-map.md",
	[
		"# AP CSA Exam Alignment Map",
		"",
		"- Unit 1 Primitive Types: APCS1/APCS2.",
		"- Unit 2 Using Objects: strings, Scanner, Math, wrappers, object references.",
		"- Unit 3 Boolean Expressions and if Statements: APCS3 and conditionals check-ins.",
		"- Unit 4 Iteration: APCS4, loops, nested loops, FizzBuzz remediation.",
		"- Unit 5 Writing Classes: APCS5/APCS6.",
		"- Unit 6 Array: APCS10.",
		"- Unit 7 ArrayList: APCS11/APCS12.",
		"- Unit 8 2D Array: APCS10 2D array projects.",
		"- Unit 9 Inheritance: APCS7/APCS8.",
		"- Unit 10 Recursion: APCS15.",
		"",
		"Every exam-facing module should include MCQ distractor review, FRQ-style scoring, and an error log."
	].join("\n")
);

writeMd(
	"data-ai-ml-dataset-catalog.md",
	[
		"# Data, AI, and Machine Learning Dataset Catalog",
		"",
		"- Data Science: NOAA weather observations, messy CSV fixtures, and stable public tabular datasets with source/licensing notes.",
		"- AI: grid/graph fixtures, game-tree boards, and responsible-AI scenario cards.",
		"- Machine Learning: scikit-learn built-ins, small public tabular datasets, model-card templates, and reproducible notebook fixtures.",
		"",
		"Every dataset or fixture should document source, license/usage note, target question, known caveat, and evaluation method."
	].join("\n")
);

writeMd(
	"security-systems-lab-safety-policy.md",
	[
		"# Security and Systems Lab Safety Policy",
		"",
		"- Use only owned local fixtures, intentionally vulnerable toy apps, provided captures, or instructor-approved lab VMs.",
		"- Start every lab with scope, authorization, target, tools, and stop conditions.",
		"- Finish every lab with evidence, impact, remediation, detection, or hardening.",
		"- Do not scan, probe, exploit, or collect data from third-party systems.",
		"- Use sanitizers, fuzzers, toy parsers, VMs, and reversible configs for low-level/system exercises."
	].join("\n")
);

console.log(`Wrote course development artifacts to ${outDir}`);
