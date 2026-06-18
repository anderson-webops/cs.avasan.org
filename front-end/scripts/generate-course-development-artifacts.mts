import fs from "node:fs";
import path from "node:path";
import { courseCatalog, loadRawCourse } from "../src/stores/courses/index";
import {
	coursePublicPathwayByCourseId,
	coursePublicPathways
} from "../src/stores/courses/public-pathways";
import {
	courseContentOnlySourcePolicies,
	courseImplementationSourceRepos
} from "../src/stores/courses/course-implementation-artifacts";
import type {
	RawCourse,
	RawCourseModuleItem
} from "../src/stores/courses/types";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const outDir = path.join(repoRoot, "no-include");
const instructionRoot =
	"/Users/jacobanderson/Documents/Work/Instruction-Material";

const structuredSupportPattern =
	/\*\*(?:Goal|Project goal|Project target|Concept path|Learning path|Teaching flow|Diagnostic guidance|Readiness check|Common pitfalls|Remote investigation|Science explanation|Studio focus|Focus|Outcome|Required outcome|Success criteria|Steps|Build steps|Build path|Implementation steps|Evidence target|Evidence targets|Completion checks|Checkpoints|Extension|AP connection):?\*\*/i;
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
const lessonBackbonePattern =
	/\*\*(?:Applied studio|Build path|Concept focus|Concept path|Course path|Evidence of proficiency|Evidence target|Evidence targets|Explanation|Focus|Goal|Investigation|Project selection|Project target|Readiness check|Readiness map|Result|Science explanation|Scope path|Selected checks|Studio focus):\*\*|Core topics in this module:|Representative solutions/i;
const generatedReadinessFiles = new Set([
	"COURSE_SOURCE_MANIFEST.md",
	"SOURCE_BACKLOG.md",
	"verify-course-source.sh"
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
				if (
					![
						"build",
						"cmake-build-debug",
						"node_modules",
						"dist"
					].includes(entry.name)
				) {
					stack.push(fullPath);
				}
				continue;
			}
			const relative = path.relative(root, fullPath);
			if (generatedReadinessFiles.has(relative)) continue;
			if (
				/\.(?:java|py|cpp|c|h|hpp|js|ts|swift|cs|md)$/i.test(entry.name)
			) {
				results.push(relative);
			}
		}
	}

	return results.sort((a, b) => a.localeCompare(b));
}

function allItems(course: RawCourse) {
	return course.modules.flatMap(
		module =>
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

function coreModules(course: RawCourse) {
	return course.modules.filter(module => module.kind !== "appendix");
}

function hasLessonBackbone(module: RawCourse["modules"][number]) {
	return module.curriculum.some(item =>
		lessonBackbonePattern.test(item.content)
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

function comparableFolderName(folder: string) {
	return folder
		.toLowerCase()
		.replace(/(?:^|-)java$/u, "")
		.replace(
			/(?:^|-)(?:starter|solution|updated|template|reference)$/gu,
			""
		)
		.replace(/(?:^|-)all-star$/u, "")
		.replace(/[^a-z0-9]+/gu, "");
}

function ledgeredFolders(root: string) {
	const ledgerPath = path.join(root, "SOURCE_BACKLOG.md");
	if (!fs.existsSync(ledgerPath)) return new Set<string>();
	const ledger = fs.readFileSync(ledgerPath, "utf8");
	const folders = new Set<string>();
	const folderPattern = /\|\s*`([^`]+)`\s*\|/g;
	let match: RegExpExecArray | null;

	while ((match = folderPattern.exec(ledger))) folders.add(match[1]);

	return folders;
}

function isExecutable(file: string) {
	if (!fs.existsSync(file)) return false;
	return (fs.statSync(file).mode & 0o111) !== 0;
}

function unityFullProjectReadiness(root: string) {
	const required = [
		".gitattributes",
		"UGD-full-project-starter/ProjectSettings/ProjectVersion.txt",
		"UGD-full-project-starter/Packages/manifest.json",
		"UGD-full-project-starter/Packages/packages-lock.json",
		"UGD-full-project-starter/Assets/Scripts/GameSession.cs",
		"UGD-full-project-starter/Assets/Tests/EditMode/GameSessionTests.cs",
		"UGD-full-project-starter/THIRD_PARTY_ASSETS.md",
		"UGD-full-project-solution/ProjectSettings/ProjectVersion.txt",
		"UGD-full-project-solution/Packages/manifest.json",
		"UGD-full-project-solution/Packages/packages-lock.json",
		"UGD-full-project-solution/Assets/Scripts/GameSession.cs",
		"UGD-full-project-solution/Assets/Tests/EditMode/GameSessionTests.cs",
		"UGD-full-project-solution/THIRD_PARTY_ASSETS.md"
	];
	const missing = required.filter(
		file => !fs.existsSync(path.join(root, file))
	);

	return {
		ready: missing.length === 0,
		missing
	};
}

function classifyUnlinkedFolder(
	folder: string,
	linkedFolders: string[],
	repoLinkedFolders: string[],
	ledgered: Set<string>
) {
	const comparable = comparableFolderName(folder);
	const coveredByVariant = linkedFolders.some(
		linked => comparableFolderName(linked) === comparable
	);
	const linkedBySiblingCourse = repoLinkedFolders.includes(folder);

	if (coveredByVariant) {
		return {
			folder,
			classification: "covered-by-linked-variant",
			status: "tracked: an alternate starter, solution, language, updated, or template variant is linked in the catalog"
		};
	}

	if (linkedBySiblingCourse) {
		return {
			folder,
			classification: "covered-by-shared-repo-course",
			status: "tracked: active in another catalog course that shares this source repository"
		};
	}

	if (
		/starter|solution|template|updated|reference|recap|check[- ]?in/i.test(
			folder
		)
	) {
		return {
			folder,
			classification: "support-or-variant-source",
			status: "tracked: support material or variant source folder; keep out of active project links unless promoted"
		};
	}

	if (/legacy|archive|old|customized|copy|backup|deprecated/i.test(folder)) {
		return {
			folder,
			classification: "legacy-or-archive",
			status: "tracked: legacy/archive folder; do not link as active course work without explicit promotion"
		};
	}

	if (ledgered.has(folder)) {
		return {
			folder,
			classification: "ledgered-inactive-source",
			status: "tracked: listed in SOURCE_BACKLOG.md as inactive/promotable source; not an unresolved active-placement gap"
		};
	}

	return {
		folder,
		classification: "source-backlog-recorded",
		status: "tracked: source folder is recorded in parity backlog and needs explicit future placement only if promoted"
	};
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

	if (placeholderPattern.test(item.content))
		flags.push("placeholder-language");
	if (!structured && projectLike && words < 95)
		flags.push("short-project-spec");
	if (!structured && !projectLike && words < 65)
		flags.push("short-lesson-text");
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
).filter(
	(
		row
	): row is { entry: (typeof courseCatalog)[number]; course: RawCourse } =>
		Boolean(row.course)
);

fs.mkdirSync(outDir, { recursive: true });

const structuralAudit = courses.map(({ entry, course }) => {
	const links = itemLinks(course);
	const coreModuleList = coreModules(course);
	const modulesMissingLessonBackbone = coreModuleList
		.filter(module => !hasLessonBackbone(module))
		.map(module => module.title);

	return {
		courseId: entry.id,
		name: course.name,
		modules: course.modules.length,
		modulesWithUnderTwoProjects: course.modules.filter(
			module => module.supplementalProjects.length < 2
		).length,
		coreModules: coreModuleList.length,
		modulesMissingLessonBackbone,
		lessonBackboneCoverage:
			coreModuleList.length === 0
				? 1
				: (coreModuleList.length -
						modulesMissingLessonBackbone.length) /
					coreModuleList.length,
		projectLinks: links.projectLinks,
		solutionLinks: links.solutionLinks,
		datasetLinks: links.datasetLinks,
		mediaLinks: links.mediaLinks,
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
				"Core Modules",
				"Missing Lesson Backbone",
				"Lesson Backbone",
				"Project Links",
				"Solution Links",
				"Source Parity"
			],
			structuralAudit.map(row => [
				row.courseId,
				row.modules,
				row.modulesWithUnderTwoProjects,
				row.coreModules,
				row.modulesMissingLessonBackbone.length,
				row.lessonBackboneCoverage === 1
					? "yes"
					: `${Math.round(row.lessonBackboneCoverage * 100)}%`,
				row.projectLinks,
				row.solutionLinks,
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
			highSeverityLedger
				.slice(0, 200)
				.map(row => [
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

const repoLinkedFolders = new Map<string, string[]>();

for (const { entry, course } of courses) {
	const repo = courseImplementationSourceRepos[entry.id];
	if (!repo) continue;
	const folders = new Set(repoLinkedFolders.get(repo) ?? []);
	for (const folder of linkedFoldersForRepo(course, repo))
		folders.add(folder);
	repoLinkedFolders.set(
		repo,
		[...folders].sort((a, b) => a.localeCompare(b))
	);
}

const sourceParityAudit = courses.flatMap(({ entry, course }) => {
	const repo = courseImplementationSourceRepos[entry.id];
	if (!repo) return [];
	const localRoot = path.join(instructionRoot, repo);
	const topDirs = listTopDirs(localRoot);
	const linkedFolders = linkedFoldersForRepo(course, repo);
	const linked = new Set(linkedFolders);
	const unlinkedTopLevelFolders = topDirs.filter(
		folder => !linked.has(folder)
	);
	const ledgered = ledgeredFolders(localRoot);
	const sharedRepoLinkedFolders =
		repoLinkedFolders.get(repo) ?? linkedFolders;
	const classifiedUnlinkedFolders = unlinkedTopLevelFolders.map(folder =>
		classifyUnlinkedFolder(
			folder,
			linkedFolders,
			sharedRepoLinkedFolders,
			ledgered
		)
	);
	const unresolvedUnlinkedFolders = classifiedUnlinkedFolders.filter(
		folder => folder.classification === "unresolved"
	);
	const activeBacklogFolders = classifiedUnlinkedFolders.filter(
		folder => folder.classification === "source-backlog-recorded"
	);
	const sourceManifestPath = path.join(
		localRoot,
		"COURSE_SOURCE_MANIFEST.md"
	);
	const sourceBacklogPath = path.join(localRoot, "SOURCE_BACKLOG.md");
	const verificationScriptPath = path.join(
		localRoot,
		"verify-course-source.sh"
	);
	const unityReadiness =
		repo === "Unity-Game-Development"
			? unityFullProjectReadiness(localRoot)
			: { ready: true, missing: [] as string[] };

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
			unlinkedTopLevelFolders,
			classifiedUnlinkedFolders,
			activeBacklogFolders,
			unresolvedUnlinkedFolders,
			hasSourceManifest: fs.existsSync(sourceManifestPath),
			hasSourceBacklogLedger: fs.existsSync(sourceBacklogPath),
			hasVerificationScript: fs.existsSync(verificationScriptPath),
			verificationScriptExecutable: isExecutable(verificationScriptPath),
			unityFullProjectRequired: repo === "Unity-Game-Development",
			unityFullProjectReady: unityReadiness.ready,
			unityFullProjectMissing: unityReadiness.missing,
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
		"Unlinked source folders are no longer treated as automatically unresolved. The generator classifies each unlinked folder as a linked variant, support/reference material, shared-repo material, legacy/archive material, or ledgered inactive source. A folder is only an active backlog item if it is not linked, not covered by a sibling course, and not recorded in `SOURCE_BACKLOG.md`.",
		"",
		asTable(
			[
				"Course",
				"Repo",
				"Exists",
				"Folders",
				"Linked",
				"Ledgered/Inactive",
				"Active Backlog",
				"Unresolved",
				"Manifest",
				"Verify",
				"Unity Full Project",
				"Project Links",
				"Solution Links"
			],
			sourceParityAudit.map(row => [
				row.courseId,
				row.repo,
				row.exists ? "yes" : "no",
				row.topLevelFolders,
				row.linkedFolders.length,
				row.classifiedUnlinkedFolders.length,
				row.activeBacklogFolders.length,
				row.unresolvedUnlinkedFolders.length,
				row.hasSourceManifest ? "yes" : "no",
				row.hasVerificationScript && row.verificationScriptExecutable
					? "yes"
					: "no",
				row.unityFullProjectRequired
					? row.unityFullProjectReady
						? "yes"
						: "no"
					: "n/a",
				row.projectLinks,
				row.solutionLinks
			])
		)
	].join("\n")
);

const sourcePolicyAudit = courses
	.filter(({ entry }) => !courseImplementationSourceRepos[entry.id])
	.map(({ entry, course }) => ({
		courseId: entry.id,
		courseName: course.name,
		policy:
			courseContentOnlySourcePolicies[entry.id] ??
			"unclassified: decide whether this course needs a source repo, media register, worksheet register, or external-platform policy",
		hasSourceParityModule: course.modules.some(
			module => module.title === "Source and Asset Parity Implementation"
		),
		...itemLinks(course)
	}));

writeJson("course-source-policy-audit.json", sourcePolicyAudit);
writeMd(
	"course-source-policy-audit.md",
	[
		"# Course Source Policy Audit",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		"This report covers courses without a local instruction-material repository mapping.",
		"",
		asTable(
			[
				"Course",
				"Policy Recorded",
				"Source Parity Module",
				"Project Links",
				"Solution Links",
				"Media Links",
				"Dataset Links"
			],
			sourcePolicyAudit.map(row => [
				row.courseId,
				row.policy.startsWith("unclassified") ? "no" : "yes",
				row.hasSourceParityModule ? "yes" : "no",
				row.projectLinks,
				row.solutionLinks,
				row.mediaLinks,
				row.datasetLinks
			])
		)
	].join("\n")
);

const metadataAudit = courses.map(({ entry, course }) => {
	const metadata = course.developmentMetadata;
	return {
		courseId: entry.id,
		courseName: course.name,
		hasMetadata: Boolean(metadata),
		priority: metadata?.priority ?? "missing",
		standards: metadata?.standards.length ?? 0,
		hasSourcePolicy: Boolean(metadata?.sourcePolicy),
		assessmentCadence: metadata?.assessmentCadence.length ?? 0,
		toolchain: metadata?.toolchain.length ?? 0,
		safetyPolicy: metadata?.safetyPolicy.length ?? 0,
		courseBoundaries: metadata?.courseBoundaries.length ?? 0,
		capstoneExpectations: metadata?.capstoneExpectations.length ?? 0,
		recommendedNextWork: metadata?.recommendedNextWork.length ?? 0
	};
});

writeJson("course-standards-metadata-audit.json", metadataAudit);
writeMd(
	"course-standards-metadata-audit.md",
	[
		"# Course Standards Metadata Audit",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		"This report verifies that each visible course exposes the metadata backbone requested by the deep-research planning pass: standards/source map, source policy, assessment cadence, toolchain assumptions, safety boundaries, course boundaries, capstone expectations, and recommended next work.",
		"",
		asTable(
			[
				"Course",
				"Priority",
				"Standards",
				"Source Policy",
				"Assessments",
				"Toolchain",
				"Safety",
				"Boundaries",
				"Capstone",
				"Next Work"
			],
			metadataAudit.map(row => [
				row.courseId,
				row.priority,
				row.standards,
				row.hasSourcePolicy ? "yes" : "no",
				row.assessmentCadence,
				row.toolchain,
				row.safetyPolicy,
				row.courseBoundaries,
				row.capstoneExpectations,
				row.recommendedNextWork
			])
		)
	].join("\n")
);

const pathwayCourseIds = coursePublicPathways.flatMap(pathway =>
	pathway.courseIds.map(courseId => ({ courseId, pathwayId: pathway.id }))
);
const duplicatePathwayCourseIds = pathwayCourseIds
	.map(row => row.courseId)
	.filter(
		(courseId, index, allCourseIds) =>
			allCourseIds.indexOf(courseId) !== index
	)
	.sort((a, b) => a.localeCompare(b));
const publicPathwayAudit = courses.map(({ entry, course }) => {
	const pathway = coursePublicPathwayByCourseId.get(entry.id);
	return {
		courseId: entry.id,
		courseName: course.name,
		pathwayId: pathway?.id ?? "missing",
		pathwayTitle: pathway?.title ?? "missing",
		priority: pathway?.adminPriority ?? "missing",
		outcomes: pathway?.outcomes.length ?? 0,
		sequencingNotes: pathway?.sequencingNotes.length ?? 0,
		projectExpectations: pathway?.projectExpectations.length ?? 0,
		assessmentStyle: pathway?.assessmentStyle.length ?? 0,
		sourceAndTooling: pathway?.sourceAndTooling.length ?? 0,
		safetyAndAccess: pathway?.safetyAndAccess.length ?? 0,
		expansionBacklog: pathway?.adminExpansionBacklog.length ?? 0
	};
});
const unregisteredPathwayIds = [...coursePublicPathwayByCourseId.keys()]
	.filter(courseId => !courseCatalog.some(entry => entry.id === courseId))
	.sort((a, b) => a.localeCompare(b));

writeJson("course-public-pathway-audit.json", {
	pathways: coursePublicPathways.map(pathway => ({
		id: pathway.id,
		title: pathway.title,
		priority: pathway.adminPriority,
		courseIds: pathway.courseIds
	})),
	courses: publicPathwayAudit,
	duplicatePathwayCourseIds,
	unregisteredPathwayIds
});
writeMd(
	"course-public-pathway-audit.md",
	[
		"# Course Public Pathway Audit",
		"",
		`Generated: ${new Date().toISOString()}`,
		"",
		[
			"This report verifies the public course-family pathway layer used by `/pathways`: every visible catalog course should belong to exactly one pathway,",
			"and each pathway should expose outcomes, sequencing notes, project expectations, assessment style, source/tooling notes, safety boundaries, and expansion backlog."
		].join(" "),
		"",
		`Duplicate pathway course ids: ${duplicatePathwayCourseIds.length}`,
		"",
		`Unregistered pathway course ids: ${unregisteredPathwayIds.length}`,
		"",
		asTable(
			[
				"Course",
				"Pathway",
				"Priority",
				"Outcomes",
				"Projects",
				"Assessments",
				"Sources",
				"Safety",
				"Backlog"
			],
			publicPathwayAudit.map(row => [
				row.courseId,
				row.pathwayId,
				row.priority,
				row.outcomes,
				row.projectExpectations,
				row.assessmentStyle,
				row.sourceAndTooling,
				row.safetyAndAccess,
				row.expansionBacklog
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
		"The source repo now includes `UGD-full-project-starter` and `UGD-full-project-solution` full-project baselines with Unity project settings, package manifests/locks, scripts, tests, attribution files, Git LFS rules, and a repository verification script.",
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
