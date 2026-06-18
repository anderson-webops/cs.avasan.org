import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";
import {
	parseCourseAssetUrl,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";

const COURSE_SWEEP_TIMEOUT = 180000;

function allCourseText(course: Awaited<ReturnType<typeof loadRawCourse>>) {
	expect(course).not.toBeNull();
	if (!course) return "";

	return course.modules
		.flatMap(module => [
			module.title,
			...module.curriculum.flatMap(item => [item.title, item.content]),
			...module.supplementalProjects.flatMap(item => [
				item.title,
				item.content
			])
		])
		.join("\n");
}

function allCourseItemTitles(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].map(item => ({
			module: module.title,
			title: item.title
		}))
	);
}

function wordCount(text: string) {
	return text.match(/\b[\w'+-]+\b/g)?.length ?? 0;
}

function isProjectLikeTitle(title: string) {
	return /project|capstone|challenge|lab|practice|drill|notebook|audit|reflection|build|create|implement|exercise/i.test(
		title
	);
}

const lessonBackbonePattern =
	/\*\*(?:Applied studio|Build path|Concept focus|Concept path|Course path|Evidence of proficiency|Evidence target|Evidence targets|Explanation|Focus|Goal|Investigation|Project selection|Project target|Readiness check|Readiness map|Result|Science explanation|Scope path|Selected checks|Studio focus):\*\*|Core topics in this module:|Representative solutions/i;

function findItem(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>,
	titlePattern: RegExp,
	contentPattern?: RegExp
) {
	for (const module of course.modules) {
		const item = [
			...module.curriculum,
			...module.supplementalProjects
		].find(
			item =>
				titlePattern.test(item.title) &&
				(!contentPattern || contentPattern.test(item.content))
		);

		if (item) return item;
	}

	throw new Error(`Could not find course item matching ${titlePattern}`);
}

function markdownHeadingSlugs(path: string) {
	const markdown = fs.readFileSync(path, "utf8");
	return new Set(
		[...markdown.matchAll(/^##+\s+(.+)$/gm)].map(match =>
			slugMarkdownHeading(match[1])
		)
	);
}

function courseItemLinks(
	courseId: string,
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item =>
			[
				item.projectLink,
				item.solutionLink,
				item.datasetLink,
				item.mediaLink
			].flatMap(link =>
				link
					? [
							{
								course: courseId,
								item: item.title,
								link,
								module: module.title
							}
						]
					: []
			)
		)
	);
}

function visibleCourseSourceCorpus() {
	const excludedFiles = new Set([
		"course-implementation-artifacts.ts",
		"normalization.ts",
		"research-expansions.ts"
	]);

	return fs
		.readdirSync("src/stores/courses")
		.filter(
			file =>
				file.endsWith(".ts") &&
				!excludedFiles.has(file) &&
				file !== "index.ts"
		)
		.map(file => fs.readFileSync(`src/stores/courses/${file}`, "utf8"))
		.join("\n");
}

function rawCourseSourceCorpus() {
	const excludedFiles = new Set([
		"course-implementation-artifacts.ts",
		"implementationLabGuidance.ts",
		"normalization.ts",
		"physicsContentContext.ts",
		"projectGuidance.ts",
		"public-pathways.ts",
		"research-expansions.ts",
		"supportSectionGuidance.ts",
		"types.ts"
	]);

	return fs
		.readdirSync("src/stores/courses")
		.filter(
			file =>
				file.endsWith(".ts") &&
				!excludedFiles.has(file) &&
				file !== "index.ts"
		)
		.map(file => fs.readFileSync(`src/stores/courses/${file}`, "utf8"))
		.join("\n");
}

function stripLinksFromSource(source: string) {
	return source.replace(/https?:\/\/[^"',\s)]+/g, "");
}

function literalCourseIdsLoadedByTests() {
	return fs
		.readdirSync("test")
		.filter(file => file.endsWith(".ts"))
		.flatMap(file => {
			const source = fs.readFileSync(`test/${file}`, "utf8");

			return [...source.matchAll(/loadRawCourse\("([^"]+)"\)/g)].map(
				match => ({
					file,
					id: match[1]
				})
			);
		});
}

describe("course text quality normalization", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps literal course IDs in course tests aligned with the catalog", () => {
		const catalogIds = new Set(courseCatalog.map(entry => entry.id));
		const unknownIds = literalCourseIdsLoadedByTests()
			.filter(reference => !catalogIds.has(reference.id))
			.map(reference => `${reference.file}: ${reference.id}`);

		expect(unknownIds).toEqual([]);
	});

	it(
		"removes generated placeholder language from loaded catalog text",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");

			expect(corpus).not.toMatch(/introduce the main goal/i);
			expect(corpus).not.toMatch(/build the central artifact/i);
			expect(corpus).not.toMatch(/alternate supplemental snapshot/i);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated support card titles topic-specific",
		async () => {
			const genericStandaloneTitles = new Set([
				"Applied Challenge",
				"Challenge Lab",
				"Challenge Practice",
				"Core Project",
				"Debugging and Failure Modes",
				"Diagnostic Checkpoint",
				"Extension Challenge",
				"Extension Lab",
				"Extension Practice",
				"Fluency Drill",
				"Focused Practice",
				"Modeling or Error Analysis",
				"Open-Ended Variant",
				"Planning and Architecture",
				"Review and Reflection",
				"Standards Practice Set",
				"Supplemental Project 2",
				"Supplemental Project 3",
				"Transfer Lab",
				"Transfer Practice",
				"Verification and Reflection"
			]);
			const repeatedSuffixPattern =
				/^(Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review|Standards Practice Set|Transfer Practice|Extension Practice|Challenge Practice|Verification Review):\s+.*:\s+(Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review and Reflection|Standards Practice Set|Transfer Practice|Extension Practice|Challenge Practice|Verification and Reflection)$/i;
			const genericSupplementalTitlePattern =
				/^Supplemental(?: Project| Practice)?\s+[2-9]$/i;
			const badArtifactPattern =
				/\bImplementation Lab\b|:\s*(?:Core Project|Review and Reflection|Extension Challenge)\s*$|:\s*$/i;
			const loadedCourses = await Promise.all(
				courseCatalog.map(async entry => ({
					entry,
					course: await loadRawCourse(entry.id)
				}))
			);
			const badTitles = loadedCourses.flatMap(({ entry, course }) =>
				course
					? allCourseItemTitles(course).flatMap(item =>
							genericStandaloneTitles.has(item.title) ||
							genericSupplementalTitlePattern.test(item.title) ||
							repeatedSuffixPattern.test(item.title) ||
							badArtifactPattern.test(item.title)
								? [
										`${entry.id} | ${item.module} | ${item.title}`
									]
								: []
						)
					: []
			);
			const corpus = loadedCourses
				.map(({ course }) =>
					course
						? allCourseItemTitles(course)
								.map(item => item.title)
								.join("\n")
						: ""
				)
				.join("\n");
			const dataScienceCourse = loadedCourses.find(
				({ entry }) => entry.id === "data-science-in-python"
			)?.course;
			const dataScienceText = dataScienceCourse
				? allCourseText(dataScienceCourse)
				: "";

			expect(badTitles).toEqual([]);
			expect(corpus).toContain(
				"Transfer Practice: Setup, Editors, and Asset Workflow"
			);
			expect(corpus).toContain(
				"Review: CSV Summaries and Sanity Checks"
			);
			expect(corpus).toContain(
				"Transfer Practice: CSV Summaries and Sanity Checks"
			);
			expect(dataScienceText).not.toContain("remote-safe investigation writeup");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"replaces generic linked-project boilerplate with concrete project guidance",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");

			expect(corpus).not.toMatch(
				/The project should prove the module concept/i
			);
			expect(corpus).not.toMatch(
				/Read the starter and identify the expected inputs/i
			);
			expect(corpus).not.toMatch(
				/Compare with the reference solution only after a working draft exists/i
			);
			expect(corpus).not.toMatch(/Reference solution link/i);
			expect(corpus).not.toMatch(/Solution-Link/i);
			expect(corpus).not.toMatch(/reference solution/i);
			expect(corpus).not.toMatch(
				/Until this project is split into separate starter and solution folders/i
			);
			expect(corpus).not.toMatch(/no separate solution link/i);
			expect(corpus).not.toMatch(/canonical reference\/source location/i);
			expect(corpus).not.toMatch(/starter[-/ ]and[-/ ]solution/i);
			expect(corpus).not.toMatch(/starter\/solution/i);
			expect(corpus).not.toMatch(/finished solution/i);
			expect(corpus).not.toMatch(/same learning goal/i);
			expect(corpus).not.toMatch(/staff[- ]review/i);
			expect(corpus).not.toMatch(/staff-facing/i);
			expect(corpus).not.toMatch(/source-parity/i);
			expect(corpus).not.toMatch(/remediation list/i);
			expect(corpus).not.toMatch(/course notes show/i);
			expect(corpus).not.toMatch(/where visibility controls support/i);
			expect(corpus).not.toMatch(/\*\*Learning scope:\*\*/i);
			expect(corpus).not.toMatch(/These gaps identify/i);
			expect(corpus).not.toMatch(/\*\*Skills to strengthen:\*\*/i);
			expect(corpus).not.toMatch(/\*\*Materials to prepare:\*\*/i);
			expect(corpus).not.toMatch(/before starting a module/i);
			expect(corpus).not.toMatch(
				/Tooling, Materials, and Source Preparation/i
			);
			expect(corpus).not.toMatch(/Learning Roadmap and Sequencing/i);
			expect(corpus).not.toMatch(/Complete the linked/i);
			expect(corpus).not.toMatch(
				/with visible behavior and verification evidence/i
			);
			expect(corpus).not.toMatch(
				/fork(?:ing)? https:\/\/codepen\.io\/junilearning/i
			);
			expect(corpus).not.toMatch(
				/starter at https:\/\/codepen\.io\/junilearning/i
			);
			expect(corpus).not.toMatch(
				/\b(?:a AI|a Algebra|a object|a array|an Java|an Python|an C\+\+)\b/i
			);
			expect(corpus).toContain("opening the starter resource");
			expect(corpus).toContain("Open the starter resource");
			expect(corpus).toContain(
				"as an AI/Python implementation checkpoint"
			);
			expect(corpus).toContain(
				"Complete **PTJ0 Positioning and Workflow Translation** as a Java implementation checkpoint that exposes class responsibilities, public behavior, and one edge case"
			);
			expect(corpus).toContain(
				"Build the web development applied challenge for **JSM1 Fundamentals Review** as a browser-visible feature with clear state, interaction, and error-handling evidence"
			);
			expect(corpus).toContain(
				"Solve the USACO implementation checkpoint for **USB0 Setup and Contest Workflow** with exact input/output behavior, a traceable invariant, and evidence from sample plus custom cases"
			);
			expect(corpus).toContain(
				"Turn **Images and Sprites** into a core build checkpoint with a reproducible run, visible diagnostics, and a named success condition"
			);
			expect(corpus).not.toMatch(
				/Open the starter and name the concrete inputs, outputs, state changes, data structures, or system boundaries involved/
			);
			expect(corpus).not.toMatch(
				/Implement the missing behavior in small runnable steps, checking the result after each meaningful change/
			);
			expect(corpus).not.toMatch(
				/Test a normal path, a boundary or failure path, and one case tied directly to the module's main concept/
			);
			expect(corpus).not.toMatch(
				/Check the draft against the expected behavior after a working version exists; record one difference that affects correctness, readability, robustness, or design/
			);
			expect(corpus).toContain(
				"Identify the feature user interaction, state change, DOM/canvas/API output, and visible error or empty state"
			);
			expect(corpus).toContain(
				"For this option, translate the prompt into input format, output format, constraints, and invariant"
			);
			expect(corpus).toContain(
				"For this option, state the local scope, target, starting state, allowed tools, and stop condition"
			);
			expect(corpus).toContain(
				"After the page behavior works, compare against the reference and record one difference in UI state, validation, accessibility, or error handling"
			);
			expect(corpus).not.toMatch(
				/After the code compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage/
			);
			expect(corpus).toContain(
				"Use the reference after the program has fresh compile/run evidence, then record one difference in class responsibility or API shape"
			);
			expect(corpus).toContain(
				"After the solution samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling"
			);
			expect(corpus).toContain(
				"After the local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path"
			);
			expect(corpus).not.toMatch(
				/The artifact demonstrates the module concept through behavior, output, tests, traces, or another concrete result/
			);
			expect(corpus).not.toMatch(
				/The boundary case is named explicitly and is not only the provided sample/
			);
			expect(corpus).not.toMatch(
				/The final note identifies one implementation, debugging, or reasoning choice that mattered/
			);
			expect(corpus).not.toMatch(
				/Add one additional method, test, or subclass\/record use case while preserving the public behavior already built/
			);
			expect(corpus).not.toMatch(
				/Add a debug or benchmark mode that exposes an internal state, memory decision, or performance tradeoff/
			);
			expect(corpus).not.toMatch(
				/Add one small feature that requires reusing the same concept in a new situation rather than only decorating the output/
			);
			expect(corpus).not.toMatch(
				/Add one variant that changes a constraint without changing the core concept/
			);
			expect(corpus).not.toMatch(
				/Change one constraint, case, representation, or requirement while preserving the same core concept/
			);
			expect(corpus).not.toMatch(
				/Change one value, representation, constraint, or error pattern while preserving the same underlying rule/
			);
			expect(corpus).not.toMatch(
				/Change one rule, control, state transition, collision case, scoring rule, or player-feedback requirement while preserving the same play goal/
			);
			expect(corpus).not.toMatch(
				/Change one environment assumption, command option, configuration, rollback path, or reproducibility check while preserving the same system goal/
			);
			expect(corpus).not.toMatch(
				/The Java code compiles cleanly and the expected behavior is visible through output, tests, or method calls/
			);
			expect(corpus).not.toMatch(
				/The code compiles from a clean run and the expected behavior is visible in output or tests/
			);
			expect(corpus).not.toMatch(
				/Use Java syntax and object boundaries deliberately: method contracts, object state, collection choices, and compile-run feedback should all be visible in the finished artifact/
			);
			expect(corpus).not.toMatch(
				/Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities\./
			);
			expect(corpus).not.toMatch(
				/Define the classes, object state, method inputs, return values, and expected console or test output\./
			);
			expect(corpus).not.toMatch(
				/Key terms, a worked example, and one quick transfer check connect this idea to the module project/
			);
			expect(corpus).not.toMatch(
				/The build should make clear what is being created, what constraints matter, and what evidence will prove the work is correct/
			);
			expect(corpus).not.toMatch(
				/Review the result against the original goal and record at least one improvement or bug fix/
			);
			expect(corpus).not.toMatch(
				/Attempt the prompt independently first, then use the result to identify whether the issue is vocabulary, tracing, syntax, design, or test coverage/
			);
			expect(corpus).not.toMatch(
				/Record the specific misconception, complete one focused remediation problem, and revisit the same skill before moving to a more complex project/
			);
			expect(corpus).not.toMatch(
				/Science explanation: Anchor the activity in scientific explanation: observable phenomena, models, data, vocabulary, and claim-evidence-reasoning/
			);
			expect(corpus).not.toMatch(
				/The explanation names the phenomenon, the model or data source, and the target vocabulary/
			);
			expect(corpus).not.toMatch(
				/The explanation identifies the main function, loop, or data structure that drives the result/
			);
			expect(corpus).not.toMatch(
				/Name the input values, helper functions or loops, data structures, and printed output before coding/
			);
			expect(corpus).toContain(
				"The program demonstrates the required Java behavior without relying on stale build output or hidden IDE state"
			);
			expect(corpus).toContain(
				"Map the program into Java responsibilities before coding: constructor data, method parameters, return values, stored state, and any collection shape"
			);
			expect(corpus).not.toContain(
				"Map Java/C++ bridge PTJ0 Positioning and Workflow Translation into Java responsibilities before coding"
			);
			expect(corpus).toContain(
				"The page or app shows the expected state change, output, validation, or canvas behavior"
			);
			expect(corpus).not.toContain(
				"The JSS4 Combining Loops and Variables page or app shows the expected state change"
			);
			expect(corpus).not.toContain(
				"The JSM1 Fundamentals Review page or app shows the expected state change"
			);
			expect(corpus).toContain(
				"The submitted program matches the required input/output format exactly"
			);
			expect(corpus).toContain(
				"The lab boundary, target behavior, and evidence source are explicit"
			);
			expect(corpus).not.toContain(
				"Extend the Java work with one additional method and a test or console trace that proves its contract"
			);
			expect(corpus).toContain(
				"Extend the object-design task with one additional method and a test or console trace that proves its contract"
			);
			expect(corpus).toContain(
				"Produce **PTJ1 Functions, Parameters, and Return Types Transfer Practice** with a named Java type boundary, observable behavior, and evidence from a normal case plus a boundary case"
			);
			expect(corpus).not.toMatch(/\bSupplemental Practice\s+[2-9]\b/i);
			expect(corpus).not.toMatch(/\bSupplemental\s+[2-9]\b/i);
			expect(corpus).not.toContain(
				"Define the Project: Function Port Pack (PTJ1 Functions, Parameters, and Return Types) hosts, addresses, ports, routes, protocols, and trust boundaries before running diagnostics"
			);
			expect(corpus).toContain(
				"Add one transfer case to the program that changes the input, representation, or success condition"
			);
			expect(corpus).toContain(
				"Add one rule, control, level, reset, or feedback variation while preserving the main play goal"
			);
			expect(corpus).toContain(
				"Change one rule or control in the checkpoint while preserving the same play goal"
			);
			expect(corpus).toContain(
				"Change one success condition in the checkpoint and compare it with the original version"
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps internal implementation-planning scaffolds out of visible course text",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");

			expect(corpus).not.toMatch(/Implementation Studio/i);
			expect(corpus).not.toMatch(/Full Lesson Authoring Pack/i);
			expect(corpus).not.toMatch(
				/Source and Asset Parity Implementation/i
			);
			expect(corpus).not.toMatch(
				/Standards, Source, Assessment, and Safety Backbone/i
			);
			expect(corpus).not.toMatch(/Module Backlog and Sequencing/i);
			expect(corpus).not.toMatch(/Ready-to-Author Checklist/i);
			expect(corpus).not.toMatch(/Planning Project:/i);
			expect(corpus).not.toMatch(/\*\*Course scope:\*\*/i);
			expect(corpus).not.toMatch(
				/defines the target artifact, required behavior, and core concepts needed/i
			);
			expect(corpus).not.toMatch(
				/linked starter provides the implementation artifact/i
			);
			expect(corpus).not.toMatch(/Implementation Lab/i);
			expect(corpus).not.toMatch(/Pattern Applied Lab/i);
			expect(corpus).not.toMatch(/: Applied Lab\b/i);
			expect(corpus).not.toMatch(/\bApplied Lab\b/);
			expect(corpus).not.toMatch(/\bstable course ID\b/i);
			expect(corpus).not.toMatch(/\bscript-only snapshots\b/i);
			expect(corpus).not.toMatch(/\bfuture course updates\b/i);
			expect(corpus).not.toMatch(/\bUnity modules should move\b/i);
			expect(corpus).toContain("Applied lab");
			expect(corpus).toContain("applied challenge");
			expect(corpus).toContain("Course Roadmap");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated planning and reference material in appendices",
		async () => {
			const generatedReferenceTitlePatterns = [
				/^Standards Map$/,
				/^Course Roadmap$/,
				/^Project Practice Guide$/,
				/^Remote Resource Bank$/,
				/Project Taxonomy and Assessment Implementation$/,
				/^Elementary Science Grade-Band Paths$/,
				/^C\+\+ Levels 1-3 Concept Matrix and Placement$/,
				/^Modern Three-Course C\+\+ Spine$/,
				/^AP CSA Exam Alignment and FRQ Practice Map$/,
				/^Dataset, Model, and Evaluation Catalog$/,
				/Systems and Security Lab Safety Policy$/,
				/Toolchain and Version Assumptions$/,
				/^Standards-Mapped Algebra Architecture$/,
				/^K-2 and 3-5 Zoom-Safe Science Scope Map$/,
				/^Middle School Integrated Science 6-8 Scope Map$/,
				/^Data Science, AI Foundations, and Machine Learning Boundary Map$/,
				/Defensive Lab Contract$/
			];
			const courses = await Promise.all(
				courseCatalog.map(async entry => ({
					entry,
					course: await loadRawCourse(entry.id)
				}))
			);
			const generatedReferenceModules = courses.flatMap(
				({ entry, course }) =>
					(course?.modules ?? [])
						.filter(module =>
							generatedReferenceTitlePatterns.some(pattern =>
								pattern.test(module.title)
							)
						)
						.map(module => ({
							courseId: entry.id,
							kind: module.kind,
							title: module.title
						}))
			);
			const coreGeneratedReferences = generatedReferenceModules.filter(
				module => module.kind !== "appendix"
			);

			expect(generatedReferenceModules.length).toBeGreaterThan(100);
			expect(coreGeneratedReferences).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"uses course-family support text instead of the generic fallback",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");

			expect(corpus).not.toMatch(
				/module's core concept, a concrete worked example, and a testable artifact/i
			);
			expect(corpus).not.toMatch(/the work should be able to describe/i);
			expect(corpus).not.toMatch(
				/turn the prompt into a concrete artifact/i
			);
			expect(corpus).not.toMatch(
				/The core vocabulary, one concrete example/i
			);
			expect(corpus).not.toMatch(/The sequence moves from vocabulary/i);
			expect(corpus).not.toMatch(
				/Restate the prompt as a short checklist/i
			);
			expect(corpus).not.toMatch(
				/Normal, boundary, and awkward cases have been checked/i
			);
			expect(corpus).not.toMatch(
				/Mixing up values, references, and state; using the wrong loop condition/i
			);
			expect(corpus).not.toMatch(/fresh the starting point is/i);
			expect(corpus).not.toMatch(/The sequence begins with/i);
			expect(corpus).not.toMatch(/\band and\b/i);
			expect(corpus).not.toMatch(/\bafter already write\b/i);
			expect(corpus).not.toMatch(/\byounger explain\b/i);
			expect(corpus).not.toMatch(/\bshow the modern correction\b/i);
			expect(corpus).not.toMatch(/\bwhere nothing should happen\b/i);
			expect(corpus).not.toMatch(/\bwhere no change should happen\b/i);
			expect(corpus).not.toMatch(/\bcase where nothing should happen\b/i);
			expect(corpus).not.toMatch(
				/\bcase where no change should happen\b/i
			);
			expect(corpus).not.toMatch(/\bshould show\./i);
			expect(corpus).not.toMatch(
				/\bshould be rejected or handled carefully\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould be small enough to trace by hand\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould measure, predict, classify, search, or compare before implementation begins\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould stay current when the course depends\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould produce one runnable artifact\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould answer a practical engineering question\b/i
			);
			expect(corpus).not.toMatch(/\bshould increase independence\b/i);
			expect(corpus).not.toMatch(/\bMake Scratch game design:/i);
			expect(corpus).not.toMatch(
				/\bStart from a small working case, then add one improvement that still reflects Scratch game design:/i
			);
			expect(corpus).not.toMatch(
				/\bMake one design or reasoning choice explicit, test it, and show its effect in the final artifact\b/i
			);
			expect(corpus).not.toMatch(
				/\bIdentify the input or starting state, the main transformation, and the output or conclusion tied to Scratch game design:/i
			);
			expect(corpus).toContain(
				"an ignored-input case where the state remains unchanged"
			);
			expect(corpus).toContain(
				"one case that leaves the structure unchanged"
			);
			expect(corpus).toContain("**Focus:** Scratch game design:");
			expect(corpus).toContain(
				"Choose one design or reasoning decision in the project"
			);
			expect(corpus).not.toMatch(/\bRecovered\b/);
			expect(corpus).not.toMatch(
				/recovered (?:course|lesson|applications|results|examples)/i
			);
			expect(corpus).toContain("rerun cleanly with predictable output");
			expect(corpus).toContain("PyGame development");
			expect(corpus).toContain("Swift app development");
			expect(corpus).toContain("Linux systems practice");
			expect(corpus).toContain("network systems practice");
			expect(corpus).toContain("AP CSA Java reasoning");
			expect(corpus).toContain("competitive-programming discipline");
			expect(corpus).toContain("mathematical reasoning");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps expanded physics and Scratch modules specific instead of duplicated filler", async () => {
		const courseIds = [
			"intro-to-physics",
			"physics-level-2",
			"scratch-level-1",
			"scratch-level-2"
		];
		const courses = await Promise.all(
			courseIds.map(id => loadRawCourse(id))
		);

		for (const [index, course] of courses.entries()) {
			expect(course, courseIds[index]).not.toBeNull();
			if (!course) continue;

			const moduleTitles = course.modules.map(module => module.title);
			expect(new Set(moduleTitles).size, courseIds[index]).toBe(
				moduleTitles.length
			);
			expect(allCourseText(course), courseIds[index]).not.toMatch(
				/This lab states the target artifact|A representative .* example names the key inputs|Create an original variation inspired by .*Implementation Lab/i
			);
		}
	});

	it("keeps Scratch support text focused on playable projects instead of generic file or lab wording", async () => {
		const courses = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("Scratch game design");
		expect(corpus).toContain("green-flag state");
		expect(corpus).toContain("event or state logic");
		expect(corpus).not.toMatch(
			/module's core concept, a concrete worked example, and a testable artifact/i
		);
		expect(corpus).not.toMatch(/expected file format/i);
		expect(corpus).not.toMatch(/malformed or missing data/i);
	});

	it("does not treat console input/output lessons as file parsing work", async () => {
		const courses = await Promise.all([
			loadRawCourse("java-level-1"),
			loadRawCourse("ap-computer-science-a"),
			loadRawCourse("c-level-1")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("values are typed by the user");
		expect(corpus).not.toMatch(
			/Variables(?:, Types, Strings, and Input\/Output| and Input\/Output)[\s\S]{0,2500}expected file format/i
		);
		expect(corpus).not.toMatch(
			/APCS1 Variables and Input\/Output[\s\S]{0,2500}expected file format/i
		);
	});

	it("does not treat multi-file source organization as data-file parsing", async () => {
		const course = await loadRawCourse("c-level-1");
		expect(course).not.toBeNull();

		const item = findItem(course!, /Multi-File Class Implementation/);
		expect(item.content).toContain("declarations belong in headers");
		expect(item.content).toContain("linker behavior");
		expect(item.content).not.toMatch(/expected file format/i);
	});

	it("guards against raw generated grammar artifacts in course sources", () => {
		const sourcePaths = [
			"src/stores/courses/cpp-level-2.ts",
			"src/stores/courses/java-level-1.ts",
			"src/stores/courses/course-implementation-artifacts.ts",
			"src/stores/courses/java-level-3.ts",
			"src/stores/courses/machine-learning.ts",
			"src/stores/courses/public-pathways.ts",
			"src/stores/courses/design-patterns-in-java.ts",
			"src/stores/courses/design-patterns-in-cpp.ts",
			"src/stores/courses/low-level-security-part-2.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/Repo Extension,\s*,/);
		expect(corpus).not.toMatch(/Before any model is trained, Inspect/);
		expect(corpus).not.toMatch(/Trace before running and to identify/);
		expect(corpus).not.toMatch(/and Classify them/);
		expect(corpus).not.toMatch(/C\+\+ Learn/);
		expect(corpus).not.toMatch(/In C\+\+, Explicitly/);
		expect(corpus).not.toMatch(/Visible pattern: This as/);
		expect(corpus).not.toMatch(/Teach patterns through small before/);
		expect(corpus).not.toMatch(/Teach accuracy, precision, recall/);
		expect(corpus).not.toMatch(
			/Students arriving from the Python sequence/
		);
		expect(corpus).not.toMatch(/show the modern correction/);
		expect(corpus).not.toMatch(/younger learners can explain/);
	});

	it("keeps C++ and design-pattern course source copy course-facing", () => {
		const sourcePaths = [
			"src/stores/courses/cpp-level-1.ts",
			"src/stores/courses/cpp-level-2.ts",
			"src/stores/courses/design-patterns-in-java.ts",
			"src/stores/courses/design-patterns-in-cpp.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/\bTeach\b/);
		expect(corpus).not.toMatch(/\bstudents?\b/i);
	});

	it("keeps visible course source copy free of instructor-action artifacts", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(/\bTeach\b/);
		expect(corpus).not.toMatch(/\bRequire\b/);
		expect(corpus).not.toMatch(/\bEncourage\b/);
		expect(corpus).not.toMatch(/This section covers students/);
		expect(corpus).not.toMatch(/\bUnderstand why/);
		expect(corpus).not.toMatch(
			/for strengthen the existing javascript courses/i
		);
		expect(corpus).not.toMatch(/for good practical projects/i);
		expect(corpus).not.toMatch(/for suggested advanced strand/i);
		expect(corpus).not.toMatch(/for integration with network topics/i);
		expect(corpus).not.toMatch(/\band pair them\b/);
		expect(corpus).not.toMatch(/\bthen connect that difference\b/);
		expect(corpus).not.toMatch(/\bthen show how\b/);
		expect(corpus).not.toMatch(/\bso students\b/i);
		expect(corpus).not.toMatch(/\bstudents can compare\b/i);
		expect(corpus).not.toMatch(/\bstudents can see\b/i);
		expect(corpus).not.toMatch(/\bstudents stop\b/i);
		expect(corpus).not.toMatch(/\bstudents learn\b/i);
		expect(corpus).not.toMatch(/\bstudents start\b/i);
		expect(corpus).not.toMatch(/\bforcing students\b/i);
		expect(corpus).not.toMatch(/Visible pattern: That/);
		expect(corpus).not.toMatch(
			/title:\s*"(?:Course Setup|Lesson|Concept Lesson|Data Mini Lesson):/i
		);
		expect(corpus).not.toMatch(/Use this as a dialogue-based checkpoint/i);
		expect(corpus).not.toMatch(/Pause whenever the student/i);
		expect(corpus).not.toMatch(
			/If (?:a|the) student (?:gets stuck|stalls)/i
		);
		expect(corpus).not.toMatch(/\bwhile the student (?:explains|talks)\b/i);
		expect(corpus).not.toMatch(
			/\bstudents (?:trace|identify|distinguish|draw|describe|choose|see)\b/i
		);
		expect(corpus).not.toMatch(/\bLet students\b/i);
		expect(corpus).not.toMatch(/\bwith your instructor\b/i);
		expect(corpus).not.toMatch(
			/Use the linked starter as a starting point/i
		);
		expect(corpus).not.toMatch(
			/same core idea with a different input, constraint, or edge case/i
		);
		expect(corpus).not.toMatch(/\*\*Use this section:\*\*/i);
		expect(corpus).not.toMatch(/\bComplete an extension project:/i);
		expect(corpus).not.toMatch(/\bThe finished project should\b/i);
		expect(corpus).not.toMatch(
			/\bThis module focuses on (?:turning|using|diagnosing|connecting|combining|organizing|mapping)\b/i
		);
		expect(corpus).not.toMatch(/\bThe work should make\b/i);
		expect(corpus).not.toMatch(/\bThe work should feel\b/i);
		expect(corpus).not.toMatch(/\bfirst (?:session|lesson)\b/i);
		expect(corpus).not.toMatch(/\bfinal-session surprise\b/i);
		expect(corpus).not.toMatch(/\bSession Workflow\b/i);
		expect(corpus).not.toMatch(/\bwhiteboard\b/i);
		expect(corpus).not.toMatch(/content:\s*""/);
	});

	it("keeps raw course copy neutral instead of audience-directed", () => {
		const corpus = rawCourseSourceCorpus();

		expect(corpus).not.toMatch(
			/\b(?:Ask|Have|Tell|Show|Teach|Train|Encourage|Remind|Make sure|Walk|Guide) (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\bso (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:student|students|learner|learners) (?:can|should|will|need|needs|must|learn|start|stop|understand|already|headed)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:for|when|once|before) (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:This (?:gives|teaches)|should force|force|train) students\b/i
		);
		expect(corpus).not.toMatch(
			/\bstudents (?:who|now|benefit|track|decide|optimize|move|reach|justify|encounter|use|begin)\b/i
		);
		expect(corpus).not.toMatch(/\bConnect with the learner\b/i);
		expect(corpus).not.toMatch(/(?:^|["'`]\s*)Not treat\b/im);
	});

	it("keeps raw display copy free of legacy platform-branded names", () => {
		const corpus = stripLinksFromSource(visibleCourseSourceCorpus());

		expect(corpus).not.toMatch(/\bJuni\b/i);
		expect(corpus).not.toMatch(/\bJunian\b/i);
		expect(corpus).not.toMatch(/single-folder Juni layout/i);
	});

	it("keeps JavaScript course project copy labeled as web development", () => {
		const corpus = [
			"src/stores/courses/javascript-level-1.ts",
			"src/stores/courses/javascript-level-2.ts"
		]
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/linked Java (?:core|transfer)/i);
		expect(corpus).not.toMatch(/courseFamily: "Java"/i);
		expect(corpus).toContain('courseFamily: "web development"');
	});

	it("keeps generated project guidance labels aligned to course families", () => {
		const courseFamilies = new Map([
			["src/stores/courses/ai-level-1.ts", "AI/Python"],
			["src/stores/courses/c-systems-engineering.ts", "C systems"],
			[
				"src/stores/courses/data-science-in-python.ts",
				"data science in Python"
			],
			["src/stores/courses/machine-learning.ts", "machine learning"],
			["src/stores/courses/network-security.ts", "network security"],
			["src/stores/courses/pygames.ts", "Python/PyGame"],
			[
				"src/stores/courses/python-to-java-and-cpp-bridge.ts",
				"Java/C++ bridge"
			],
			["src/stores/courses/usaco-bronze.ts", "USACO"],
			["src/stores/courses/usaco-silver.ts", "USACO"],
			["src/stores/courses/usaco-gold.ts", "USACO"]
		]);

		for (const [path, family] of courseFamilies) {
			const source = fs.readFileSync(path, "utf8");
			expect(source, path).toContain(`courseFamily: "${family}"`);
		}

		for (const path of [
			"src/stores/courses/usaco-bronze.ts",
			"src/stores/courses/usaco-silver.ts",
			"src/stores/courses/usaco-gold.ts"
		]) {
			const source = fs.readFileSync(path, "utf8");
			expect(source, path).not.toContain('courseFamily: "C++"');
		}

		expect(
			fs.readFileSync(
				"src/stores/courses/c-systems-engineering.ts",
				"utf8"
			)
		).not.toContain('courseFamily: "implementation"');
	});

	it("keeps older JavaScript and Python project prompts from collapsing to one-line tasks", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master"),
			loadRawCourse("python-level-1")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/Fix code solving a math problem\./);
		expect(corpus).not.toMatch(/Fix a simulated race that uses loops\./);
		expect(corpus).not.toMatch(/Fix code simulating a football drive\./);
		expect(corpus).not.toMatch(/Use a switch to map animals to sounds\./);
		expect(corpus).not.toMatch(/Fix code so a star appears on a snowman\./);
		expect(corpus).not.toMatch(
			/Fix output order of a stacked shield pattern\./
		);
		expect(corpus).not.toMatch(
			/Draw a car with D3 using rectangles and circles\./
		);
		expect(corpus).not.toMatch(/Build a chessboard with CSS Grid\./);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 1(?:-|–)4 on SELECT queries\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 6(?:-|–)7 on JOINs\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 8(?:-|–)12 \(nulls and more\)\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 13(?:-|–)18 on inserting and altering tables\./
		);
		expect(corpus).not.toMatch(
			/Draw a growing sequence of rotated squares\./
		);
		expect(corpus).not.toMatch(
			/Draw a staircase pattern that spirals outward\./
		);
		expect(corpus).toContain("query examples");
		expect(corpus).toContain("loop that changes size and rotation");
	});

	it("keeps Java Level 3 review modules substantive instead of one-line prompts", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Ask the user for several words, store them in descriptive variables/i
		);
		expect(corpus).not.toMatch(/Use this module as a review resource/i);
		expect(corpus).not.toMatch(
			/Learn how linear search checks items one by one/i
		);
		expect(corpus).not.toMatch(
			/Create a simple chatbot that asks several questions/i
		);
		expect(corpus).toContain(
			"Java programs move through a source-edit, compile, run, and observe cycle"
		);
		expect(corpus).toContain("Arrays are fixed-size ordered collections");
		expect(corpus).toContain(
			"Object-oriented Java is clearest when each class owns one coherent responsibility"
		);
		expect(corpus).toContain(
			"Recursive methods solve a problem by calling themselves on a smaller version of the same problem"
		);
		expect(corpus).toContain("Binary search relies on sorted data");
	});

	it("keeps Java Level 3 sorting modules substantive instead of one-line prompts", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Learn how selection sort repeatedly finds the smallest remaining element/i
		);
		expect(corpus).not.toMatch(
			/Implement selection sort using two `ArrayList`s/i
		);
		expect(corpus).not.toMatch(
			/Learn how bubble sort repeatedly swaps adjacent values/i
		);
		expect(corpus).not.toMatch(
			/Implement the helper method that merges two sorted lists/i
		);
		expect(corpus).not.toMatch(
			/Describe selection sort, predict the state of an array/i
		);
		expect(corpus).toContain(
			"Selection sort divides a collection into a sorted prefix and an unsorted remainder"
		);
		expect(corpus).toContain(
			"Bubble sort repeatedly compares adjacent values and swaps them when they are out of order"
		);
		expect(corpus).toContain(
			"Merge sort is a divide-and-conquer algorithm"
		);
		expect(corpus).toContain(
			"This review compares selection sort, insertion sort, bubble sort, and merge sort"
		);
	});

	it("keeps Java Level 3 advanced track source free of planning shorthand", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/java-level-3.ts",
			"utf8"
		);
		const advancedTrackSource = source.slice(
			source.indexOf(
				'title: "AJ19 Post-C++ Java Tooling, Testing, and Packages"'
			)
		);

		expect(advancedTrackSource).not.toMatch(/\bCover:/);
		expect(advancedTrackSource).not.toMatch(
			/Start with a small buggy service/i
		);
		expect(corpus).toContain(
			"Package-organized Java projects separate source roots, package names, public APIs, helper classes, build commands, and test entry points"
		);
		expect(corpus).toContain(
			"Generics are API contracts for reusable, type-safe code"
		);
		expect(corpus).toContain(
			"Java concurrency begins with bounded task execution rather than raw thread chaos"
		);
	});

	it("keeps early Python Turtle prompts structured around planning and verification", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const checks = [
			{
				title: /^GrS1 Supplemental Project 1: Turtle Recap$/,
				required: [
					"personal study guide",
					"filled shape",
					"uses a comment"
				]
			},
			{
				title: /Open Ended Project - Create a Drawing/,
				required: [
					"Plan the drawing",
					"`goto()`",
					"comments naming each part"
				]
			},
			{
				title: /^GrS2 Supplemental Project 7: Loops Recap$/,
				required: ["side count", "turn angle", "traced example"]
			},
			{
				title: /^GrS3 Supplemental Project 2: Debugging Practice$/,
				required: [
					"first error message",
					"rerun the program",
					"several things at once"
				]
			},
			{
				title: /Practice Project/,
				required: [
					"turn amount",
					"step length",
					"connected intentionally"
				]
			},
			{
				title: /Rainbow Ninja Star/,
				required: ["reassignment inside the loop", "color progression"]
			},
			{
				title: /Nested Loop Pattern/,
				required: ["outer loop", "inner loop", "comments naming"]
			},
			{
				title: /^GrS7 Project 1: Build a Neighborhood$/,
				required: [
					"drawHouse()",
					"different positions or sizes",
					"without duplicating"
				]
			},
			{
				title: /Make Your Own Function/,
				required: ["descriptive name", "call it more than once"]
			},
			{
				title: /^GrS8 Project 1: Event Listener Discovery$/,
				required: ["screen.onkey()", "screen.listen()", "callback"]
			},
			{
				title: /Fruit Stand/,
				required: ["own function", "Test every number key"]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(180);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}
	});

	it("keeps later Python Turtle game prompts structured around state and verification", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const checks = [
			{
				title: /^GrS9 Project 2: More Functions$/,
				required: [
					"parameter values",
					"different sizes",
					"Verify the design"
				]
			},
			{
				title: /^GrS9 Project 3: Polka Dots$/,
				required: [
					"mouse clicks",
					"click coordinates",
					"edges, and corners"
				]
			},
			{
				title: /^GrS13 Project 3: Fluid Motion$/,
				required: [
					"screen.tracer(0)",
					"screen.update()",
					"animation loop"
				]
			},
			{
				title: /^GrS13 Project 5: Turtle Collision$/,
				required: ["hitbox", "boundary cases", "barely touching"]
			},
			{
				title: /^GrS14 Supplemental Project 3: Pong$/,
				required: ["two paddles", "scoring", "reset after each point"]
			},
			{
				title: /^GrS14 Supplemental Project 5: Snake$/,
				required: [
					"body list",
					"self-collision",
					"game-over conditions"
				]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(220);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}
	});

	it("keeps PyGame lessons and projects structured instead of dense one-paragraph prompts", async () => {
		const course = await loadRawCourse("pygames");
		expect(course).not.toBeNull();

		const source = fs.readFileSync("src/stores/courses/pygames.ts", "utf8");
		const loadedCorpus = allCourseText(course!);
		const requiredSections = [
			"**Coordinate model:**",
			"**Position keywords:**",
			"**Practice checks:**",
			"**Starter example:**",
			"**Project goal:**",
			"**Implementation steps:**",
			"**Game objects and state:**",
			"**Build sequence:**",
			"**Double-jump prevention:**",
			"**One-time schedule:**",
			"**Repeated schedule:**",
			"**Shark behavior:**",
			"**Hiding mechanic:**",
			"**Projectile behavior:**",
			"**Laser list behavior:**",
			"**Alien behavior:**",
			"**Completion checks:**"
		];

		for (const phrase of requiredSections) {
			expect(source).toContain(phrase);
		}

		expect(source).not.toContain(
			"Create a simple top-down golf game where the player clicks to hit a ball toward a hole. Add Actors for a golf ball, hole, and flag."
		);
		expect(source).not.toContain(
			"Build a Fish Bowl game where a shark chases a diver and seaweed can hide the player. The finished Shark Chase or Fish Bowl game should make these behaviors clear"
		);
		expect(source).not.toContain(
			"Create a boss-style Space Battle where an alien ship with AI fires at the player. The finished game should make the alien behavior clear"
		);
		expect(loadedCorpus).toContain("The score changes only on collision");
		expect(loadedCorpus).toContain("Both projectile lists update safely");
	});

	it("keeps JavaScript normalization focused on web development instead of Java", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("web development workflow");
		expect(corpus).not.toContain("object-oriented Java design");
		expect(corpus).not.toContain("classes, method contracts, object state");
	});

	it("keeps legacy JavaScript web prompts specific enough to stand alone", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(
			/Practice selectors at https:\/\/flukeout\.github\.io\./
		);
		expect(corpus).not.toMatch(
			/Work through https:\/\/flexboxfroggy\.com\/ to learn flexbox\./
		);
		expect(corpus).not.toMatch(
			/Replicate the Berkshire Hathaway page using learned HTML\/CSS\./
		);
		expect(corpus).not.toMatch(
			/Add Material icons via dependency and use icons as scalable SVGs\./
		);
		expect(corpus).not.toMatch(
			/Use Materialize helpers to hide\/show content by screen size\./
		);
		expect(corpus).not.toMatch(
			/Build a message board storing posts as JSON, with inputs for URL, image, and title; render posts above the form\./
		);
		expect(corpus).not.toMatch(
			/Allow users to add comments to each post and display them beneath posts\./
		);
		expect(corpus).not.toMatch(
			/Define functions \(arrow syntax\), parameters vs arguments, closures, and calling order\./
		);
		expect(corpus).not.toMatch(
			/Draw a landscape using shapes and canvas techniques\./
		);
		expect(corpus).not.toMatch(
			/Repeated logic belongs in small reusable, well-named functions\./
		);
		expect(corpus).not.toMatch(
			/Explain APIs, requests, and why fetch is asynchronous\./
		);
		expect(corpus).toContain(
			"Use CSS Diner to practice selector precision"
		);
		expect(corpus).toContain(
			"Use Flexbox Froggy as a layout reasoning drill"
		);
		expect(corpus).toContain(
			"Functions turn a repeated process into a named operation"
		);
		expect(corpus).toContain(
			"Create a landscape scene with repeated canvas shapes"
		);
		expect(corpus).toContain(
			"Helper functions keep a program understandable by giving a name to repeated or low-level work"
		);
		expect(corpus).toContain(
			"API requests are asynchronous because the browser must wait for another service to respond"
		);
		expect(corpus).toContain(
			"The key skill is separating local page state from persisted remote state"
		);
		expect(corpus).toContain(
			"comments do not accidentally attach to the wrong item"
		);
	});

	it("keeps JavaScript Level 1 prompts student-readable and concrete", async () => {
		const course = await loadRawCourse(
			"javascript-level-1-javascript-superstar"
		);
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/Let the learner/i);
		expect(corpus).not.toMatch(/guide with questions/i);
		expect(corpus).not.toMatch(/Another review checkpoint/i);
		expect(corpus).not.toMatch(/Optional .* idea/i);

		const checks = [
			{
				title: /^Check-In #1 Overview$/,
				required: ["runnable example", "which fundamentals are fluent"]
			},
			{
				title: /^JSS1 Project 1: Welcome Survey$/,
				required: ["convert the numeric inputs", "one-letter food"]
			},
			{
				title: /^JSS2 Project 1: Tips and Taxes$/,
				required: [
					"intermediate tax and tip values",
					"decimal meal cost"
				]
			},
			{
				title: /^JSS3 Supplemental Project 2: Forgotten Math$/,
				required: ["without using `*`", "multiplying by 0"]
			},
			{
				title: /^JSS6 Project 2: FizzBuzz$/,
				required: ["combined 3-and-5 condition", "too early"]
			},
			{
				title: /^JSS7 Project 3: Pac-Man$/,
				required: ["missing slice", "wider and narrower mouth"]
			},
			{
				title: /^JSS12 Project 2: My Hobby Table$/,
				required: ["thead", "readable without relying only on color"]
			},
			{
				title: /^JSS14 Project 3: Dynamic Components$/,
				required: [
					"three Materialize JavaScript components",
					"after a page refresh"
				]
			},
			{
				title: /^JSS15 Supplemental Project 3: Jun-E-Commerce$/,
				required: [
					"featured products",
					"call-to-action",
					"narrow screen"
				]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(180);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}
	});

	it("keeps low-level security projects evidence-based instead of generic starter boilerplate", async () => {
		const courses = await Promise.all([
			loadRawCourse("low-level-security"),
			loadRawCourse("low-level-security-part-2")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/Complete the linked security lab/i);
		expect(corpus).not.toMatch(
			/The project should prove the module concept/i
		);
		expect(corpus).not.toMatch(/Read the starter and identify/i);
		expect(corpus).toContain(
			"produces defensive evidence, not just a passing program"
		);
		expect(corpus).toContain("**Focus:**");
		expect(corpus).toContain("local lab boundary");
		expect(corpus).toContain("does not target public systems");
		expect(corpus).toContain("reachability, attacker-controlled input");
		expect(corpus).toContain("sanitizer output");
	});

	it("keeps low-level security implementation labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/low-level-security.ts",
			"src/stores/courses/low-level-security-part-2.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).toContain("securityLabConceptContent");
		expect(corpus).toContain("securityLabExampleContent");
		expect(corpus).toContain("securityLabReviewContent");
	});

	it("keeps systems and web implementation labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/assembly.ts",
			"src/stores/courses/c-systems-engineering.ts",
			"src/stores/courses/linux-systems.ts",
			"src/stores/courses/network-security.ts",
			"src/stores/courses/network-systems.ts",
			"src/stores/courses/web-development-foundations.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).toContain("buildImplementationLabGuidance");
		expect(corpus).toContain("Assembly Lab 15: Implementation Lab");
		expect(corpus).toContain("Systems Build 14: Implementation Lab");
		expect(corpus).toContain("Full Stack Web Lab 14: Implementation Lab");
	});

	it("keeps AI, data, and machine learning implementation labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/ai-level-1.ts",
			"src/stores/courses/data-science-in-python.ts",
			"src/stores/courses/machine-learning.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).not.toMatch(/\(COPY\)/i);
		expect(corpus).not.toContain("ai search lab");
		expect(corpus).not.toContain("data analysis lab");
		expect(corpus).toContain("AI Search Lab 13: Implementation Lab");
		expect(corpus).toContain("Data Analysis Lab 11: Implementation Lab");
		expect(corpus).toContain("The Marble Game AI: Implementation Lab");
		expect(corpus).toContain("KNN Car Classification: Implementation Lab");
		expect(corpus).toContain("buildImplementationLabGuidance");
	});

	it("keeps Data Science applied studios named and distinct in the loaded course", async () => {
		const course = await loadRawCourse("data-science-in-python");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Data Analysis Lab 1[1-7]: Implementation Lab/
		);
		expect(corpus).not.toMatch(/complete build-and-review sequence/i);
		expect(corpus).not.toMatch(/open-ended placeholder/i);
		expect(corpus).not.toMatch(/vague enrichment/i);

		const expectedModules = [
			"CSV Summaries and Sanity Checks",
			"Cleaning Missing and Invalid Rows",
			"Grouped Summaries by Category",
			"Visualization Choice and Chart Integrity",
			"Reproducible Mini Reports",
			"Lightweight Dashboards and Filters",
			"Capstone Data Story Readiness"
		];

		for (const expectedModule of expectedModules) {
			expect(
				course!.modules.some(module =>
					module.title.includes(expectedModule)
				),
				expectedModule
			).toBe(true);
		}

		for (const expectedItemTitle of [
			"CSV Summary Builder",
			"Min-Max and Outlier Extension",
			"Median and Mode Practice",
			"Cleaning Report Builder",
			"Chart Integrity Build",
			"Filtered Summary Export",
			"Capstone Readiness Brief",
			"Capstone Scope Review"
		]) {
			expect(
				allCourseItemTitles(course!).some(({ title }) =>
					title.includes(expectedItemTitle)
				),
				expectedItemTitle
			).toBe(true);
		}
		expect(
			allCourseItemTitles(course!).filter(
				({ title }) => title === "Review and Reflection"
			)
		).toEqual([]);

		for (const phrase of [
			"empty-dataset behavior",
			"Cleaning is an analytical decision",
			"Grouped summaries answer different questions",
			"A chart is an argument",
			"rerun the analysis",
			"A dashboard is useful",
			"A capstone data story begins"
		]) {
			expect(corpus).toContain(phrase);
		}
	});

	it("keeps visible implementation-lab course sources free of generated filler", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).not.toMatch(/java foundations build/);
		expect(corpus).not.toMatch(/c algorithm lab/);
		expect(corpus).not.toMatch(/pattern implementation lab/);
		expect(corpus).not.toMatch(/refactoring clinic/);
		expect(corpus).not.toMatch(/language bridge lab/);
		expect(corpus).not.toMatch(/title:\s*"images:/);
		expect(corpus).not.toMatch(/PyGames\/tree\/main\/[^"\n]* /);
	});

	it("keeps visible support sections from regressing to generic filler", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(
			/Focus on common mistakes (?:that appear )?in? ?[^.]+\. Diagnose a broken attempt, repair it, and explain why the fix works\./
		);
		expect(corpus).not.toMatch(
			/Break [^.]+ into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built\./
		);
		expect(corpus).not.toMatch(
			/Finish [^.]+ with a concise review of the required output, one alternate approach, and one specific improvement for a later revision\./
		);
		expect(corpus).not.toMatch(
			/Extend the work from [^.]+ with a tighter constraint, one extra feature, or a slightly more realistic input case\./
		);
		expect(corpus).toContain("buildSupportSectionGuidance");
		expect(corpus).toContain("is planned as a sequence of runnable checkpoints");
		expect(corpus).toContain("ends with a concrete verification pass");
		expect(corpus).toContain(
			"compares the expected result with what actually happened"
		);
		expect(corpus).toContain("extends the ${courseFamily} work");
	});

	it(
		"keeps linked course projects from loading as blank placeholder cards",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const linkedItems = courses.flatMap(course =>
				course
					? course.modules.flatMap(module =>
							[
								...module.curriculum,
								...module.supplementalProjects
							].filter(
								item => item.projectLink || item.solutionLink
							)
						)
					: []
			);

			expect(linkedItems.length).toBeGreaterThan(0);

			for (const item of linkedItems) {
				expect(item.content.trim(), item.title).not.toBe("");
				expect(item.content, item.title).not.toMatch(
					/Use the linked starter as a starting point/i
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps Java graphics code links on the source repository",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const links = courses.flatMap((course, index) =>
				course
					? courseItemLinks(courseCatalog[index].id, course)
					: []
			);
			const legacyJavaGraphicsLinks = links.filter(({ link }) =>
				/^https:\/\/static\.junilearning\.com\/java1\/.+\.java$/i.test(
					link
				)
			);
			const expectedSourceLinks = [
				"graphics/JS2_Basic_Shapes.java",
				"graphics/JS2_Happy_Graphics.java",
				"graphics/JS3_Which_Shape.java",
				"graphics/JS4_Paintball.java",
				"graphics/JS6_Picasso.java"
			];

			expect(legacyJavaGraphicsLinks).toEqual([]);
			for (const sourcePath of expectedSourceLinks) {
				expect(
					links.some(({ link }) =>
						link ===
						`https://github.com/instruction-material/Java-Level-1/blob/main/${sourcePath}`
					),
					sourcePath
				).toBe(true);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps loaded course module and item titles unique within their visible scope",
		async () => {
			const duplicateLabels: string[] = [];

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course, entry.id).not.toBeNull();
				if (!course) continue;

				const moduleTitleCounts = new Map<string, number>();
				for (const module of course.modules) {
					const title = module.title.trim();
					moduleTitleCounts.set(
						title,
						(moduleTitleCounts.get(title) ?? 0) + 1
					);

					const itemTitleCounts = new Map<string, number>();
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const itemTitle = item.title.trim();
						itemTitleCounts.set(
							itemTitle,
							(itemTitleCounts.get(itemTitle) ?? 0) + 1
						);
					}

					for (const [itemTitle, count] of itemTitleCounts) {
						if (count > 1) {
							duplicateLabels.push(
								`${entry.id} / ${module.title} / ${itemTitle} (${count})`
							);
						}
					}
				}

				for (const [moduleTitle, count] of moduleTitleCounts) {
					if (count > 1) {
						duplicateLabels.push(
							`${entry.id} / ${moduleTitle} (${count})`
						);
					}
				}
			}

			expect(duplicateLabels).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps loaded course titles concise and generated math support grammar neutral",
		async () => {
			const longItemTitles: string[] = [];
			const redundantGenericTitles: string[] = [];
			const nestedBoldProjectGoals: string[] = [];
			const nestedBoldStudioGoals: string[] = [];
			const repeatedStudioTitles: string[] = [];
			const studioParentheticalResidue: string[] = [];
			const studioArticleGrammarResidue: string[] = [];
			const genericFocusedPracticeTitles: string[] = [];
			const genericExtensionProjectTitles: string[] = [];
			const repeatedWords: string[] = [];
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");
			const genericTitleSuffix =
				/(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Standards Practice Set|Supplemental(?: Project| Practice)? [23]|Verification and Reflection)$/i;
			const genericColonTitlePattern =
				/^.+:\s*(?:Applied Challenge|Core Project|Extension Challenge|Supplemental(?: Project| Practice)? [2-9])$/i;
			const generatedSupplementalResiduePattern =
				/\bsupplemental\s+[2-9]\b/i;
			const nestedBoldProjectGoalPattern =
				/\*\*Goal:\*\*\s+\*\*[^*\n]{1,180}\*\*/;
			const nestedBoldStudioGoalPattern =
				/\*\*(?:Applied studio|Applied lab):\*\*\s+\*\*[^*\n]{1,180}\*\*/;
			const repeatedWordPattern = /\b([A-Za-z][A-Za-z-]{3,})\s+\1\b/i;

			for (const [courseIndex, course] of courses.entries()) {
				expect(course, courseCatalog[courseIndex].id).not.toBeNull();
				if (!course) continue;

				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						if (item.title.length > 105) {
							longItemTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (item.title === "Focused Practice") {
							genericFocusedPracticeTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (item.title === "Extension Project") {
							genericExtensionProjectTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							genericTitleSuffix.test(item.title) &&
							(item.title.startsWith(`${module.title}:`) ||
								item.title.startsWith(
									`${course.name}: ${module.title}`
								))
						) {
							redundantGenericTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							genericColonTitlePattern.test(item.title) ||
							generatedSupplementalResiduePattern.test(item.title)
						) {
							redundantGenericTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (nestedBoldProjectGoalPattern.test(item.content)) {
							nestedBoldProjectGoals.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (nestedBoldStudioGoalPattern.test(item.content)) {
							nestedBoldStudioGoals.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							/^\*\*(?:Applied studio|Applied lab):/i.test(
								item.content
							)
						) {
							const escapedItemTitle = item.title.replace(
								/[.*+?^${}()|[\]\\]/g,
								"\\$&"
							);
							const repeatCount = (
								item.content.match(
									new RegExp(escapedItemTitle, "g")
								) ?? []
							).length;
							if (repeatCount > 1) {
								repeatedStudioTitles.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} (${repeatCount})`
								);
							}
							if (
								/the (?:studio|lab) \([^)]{3,80}\)/i.test(
									item.content
								)
							) {
								studioParentheticalResidue.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
								);
							}
							const awkwardStudioGrammar = item.content.match(
								/\b(?:smallest complete|minimum working|complete) the (?:studio|lab)(?: artifact)?\b/i
							);
							if (awkwardStudioGrammar) {
								studioArticleGrammarResidue.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${awkwardStudioGrammar[0]}`
								);
							}
						}
						const repeatedWordMatch =
							item.content.match(repeatedWordPattern);
						if (repeatedWordMatch) {
							repeatedWords.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${repeatedWordMatch[0]}`
							);
						}
					}
				}
			}

			expect(longItemTitles).toEqual([]);
			expect(redundantGenericTitles).toEqual([]);
			expect(nestedBoldProjectGoals).toEqual([]);
			expect(nestedBoldStudioGoals).toEqual([]);
			expect(repeatedStudioTitles).toEqual([]);
			expect(studioParentheticalResidue).toEqual([]);
			expect(studioArticleGrammarResidue).toEqual([]);
			expect(genericFocusedPracticeTitles).toEqual([]);
			expect(genericExtensionProjectTitles).toEqual([]);
			expect(repeatedWords).toEqual([]);
			expect(corpus).not.toMatch(/focused practice checkpoint/i);
			expect(corpus).not.toMatch(/should use the checkpoint/i);
			expect(corpus).not.toMatch(/\bThe checkpoint should\b/i);
			expect(corpus).not.toMatch(/\bmodule idea\b/i);
			expect(corpus).not.toMatch(/\bThe final note should\b/i);
			expect(corpus).not.toMatch(/\bThe final note names\b/i);
			expect(corpus).not.toMatch(/\bThe final note identifies\b/i);
			expect(corpus).not.toMatch(/\bThe extension should\b/i);
			expect(corpus).not.toMatch(/\bThe extension stresses\b/i);
			expect(corpus).not.toMatch(/typical the response example/i);
			expect(corpus).not.toMatch(/the response known values/i);
			expect(corpus).not.toMatch(/the response answer/i);
			expect(corpus).not.toMatch(/the response reason/i);
			expect(corpus).not.toMatch(/\bthe A, B, C, D example\b/i);
			expect(corpus).not.toMatch(/\bThis section for\b/i);
			expect(corpus).not.toMatch(/\*\*Course focus:\*\* This section/i);
			expect(corpus).not.toMatch(
				/\*\*(?:Applied studio|Applied lab):\*\* The (?:studio|lab) produces/i
			);
			expect(corpus).not.toMatch(
				/^Represent the module with at least one graph/im
			);
			expect(corpus).not.toMatch(/\*\*Completion check:\*\*/i);
			expect(corpus).not.toMatch(/\bcore project focus:/i);
			expect(corpus).not.toMatch(/\bRun the local the\b/i);
			expect(corpus).not.toMatch(/\b(?:connectings|mappings)\b/i);
			expect(corpus).not.toMatch(
				/\bThis module focuses on (?:combine|connect|diagnose|map|organize|turn|use)\b/i
			);
			expect(corpus).toContain(
				"**Source map:** Scratch Level 1 uses these standards"
			);
			expect(corpus).toContain(
				"**Applied studio:** Mini Game Polish Studio produces a playable Scratch project"
			);
			expect(corpus).toContain(
				"Create a representation for Momentum, Impulse, and Collisions with at least one graph"
			);
			expect(corpus).toContain(
				"**Focus:** state representation, actions, goal tests, search strategy"
			);
			expect(corpus).toContain("Work a typical example");
			expect(corpus).toContain("Modeling or Error Analysis");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps course expansion templates from regenerating instructor-action copy", () => {
		const corpus = [
			"src/stores/courses/course-implementation-artifacts.ts",
			"src/stores/courses/research-expansions.ts"
		]
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/\bTeach\b/);
		expect(corpus).not.toMatch(/Teach students/i);
		expect(corpus).not.toMatch(/Instructor Note/i);
		expect(corpus).not.toMatch(/\*\*Learning sequence:\*\*/i);
		expect(corpus).not.toMatch(/\*\*Completion check:\*\*/i);
		expect(corpus).not.toMatch(/\bUse .* supplemental projects\b/i);
	});

	it("adds project requirements and completion checks to thin legacy Python project prompts", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Goal:**");
		expect(calendarMachine.content).toContain("**Outcome:**");
		expect(calendarMachine.content).toContain("Test zero days");
		expect(calendarMachine.content).toContain("**Checkpoints:**");
	});

	it(
		"keeps short project-like items backed by review structure",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(async entry => ({
					id: entry.id,
					course: await loadRawCourse(entry.id)
				}))
			);
			const reviewStructurePattern =
				/\*\*(?:Outcome|Required outcome|Success criteria|Completion checks|Checkpoints|Extension):\*\*/i;
			const weakItems = courses.flatMap(({ id, course }) =>
				(course?.modules ?? []).flatMap(module =>
					[
						...module.curriculum.map(item => ({
							section: "curriculum",
							item
						})),
						...module.supplementalProjects.map(item => ({
							section: "supplementalProjects",
							item
						}))
					].flatMap(({ section, item }) => {
						const projectLike =
							isProjectLikeTitle(item.title) ||
							Boolean(item.projectLink || item.solutionLink);
						const shortWithoutReview =
							projectLike &&
							wordCount(item.content) < 95 &&
							!reviewStructurePattern.test(item.content);

						return shortWithoutReview
							? [
									`${id} | ${module.title} | ${section} | ${item.title} | ${wordCount(item.content)} words`
								]
							: [];
					})
				)
			);

			expect(weakItems).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps every core module backed by a visible lesson structure",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(async entry => ({
					id: entry.id,
					course: await loadRawCourse(entry.id)
				}))
			);
			const missingBackbone = courses.flatMap(({ id, course }) =>
				(course?.modules ?? [])
					.filter(module => module.kind !== "appendix")
					.filter(
						module =>
							!module.curriculum.some(item =>
								lessonBackbonePattern.test(item.content)
							)
					)
					.map(module => `${id} | ${module.title}`)
			);

			expect(missingBackbone).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("preserves structured guidance after UI course-store normalization", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Goal:**");
		expect(calendarMachine.content).toContain("**Outcome:**");
		expect(calendarMachine.content.length).toBeGreaterThan(500);
	});

	it("formats grouped lesson arcs as readable ordered markdown lists", async () => {
		const store = useCoursesStore();
		const [
			course,
			scratchCourse,
			scratchLevel2,
			machineLearning,
			aiLevel1
		] = await Promise.all([
			store.loadCourseById("python-level-3"),
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2"),
			loadRawCourse("machine-learning"),
			loadRawCourse("ai-level-1")
		]);
		expect(course).not.toBeNull();
		expect(scratchCourse).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(machineLearning).not.toBeNull();
		expect(aiLevel1).not.toBeNull();

		const lessonArc = findItem(
			course!,
			/Core Concepts/,
			/Core topics in this module:/
		);

		expect(lessonArc.content).toMatch(
			/Core topics in this module:\n\n1\. \*\*Introductions & Setup\*\*/
		);
		expect(lessonArc.content).toMatch(/\n2\. \*\*.+\*\*\n\s+/);
		expect(lessonArc.content).not.toMatch(/1\) .+; 2\)/s);
		expect(lessonArc.content).not.toMatch(/This lesson arc covers/i);

		const scratchStudio = scratchCourse!.modules
			.find(module => module.title === "GS16 Debugging and Remix Studio")
			?.curriculum.find(item => item.title === "Core Concepts");

		expect(scratchStudio).toBeDefined();
		expect(scratchStudio!.content).toContain("\n   **Checkpoints:**\n   -");
		expect(scratchStudio!.content).toContain(
			"**Extension:** Add a broadcast, backdrop change, or sprite interaction that reuses the same event logic."
		);
		expect(scratchStudio!.content).toContain(
			"\n\n2. **Design and Planning Map**"
		);
		expect(scratchStudio!.content).not.toContain(
			"Concept Path (GS16 Debugging and Remix Studio)"
		);
		expect(scratchStudio!.content).not.toMatch(
			/\n \n\n\*\*Checkpoints:\*\*/
		);

		const scratchBridge = scratchCourse!.modules
			.find(
				module => module.title === "GS17 Text-Based Programming Bridge"
			)
			?.curriculum.find(item => item.title === "Core Concepts");
		expect(scratchBridge).toBeDefined();
		expect(scratchBridge!.content).toContain(
			"Scratch blocks can be translated into text-code ideas"
		);
		expect(scratchBridge!.content).not.toMatch(/\bconnectings\b/i);

		const scratchLevel2Bridge = scratchLevel2!.modules
			.find(
				module => module.title === "GM15 Text-Based Programming Bridge"
			)
			?.curriculum.find(item => item.title === "Core Concepts");
		expect(scratchLevel2Bridge).toBeDefined();
		expect(scratchLevel2Bridge!.content).toContain(
			"Advanced Scratch concepts map directly to Python readiness"
		);
		expect(scratchLevel2Bridge!.content).not.toMatch(/\bmappings\b/i);

		const platformerPal = findItem(scratchLevel2!, /Platformer Pal/);
		expect(platformerPal.content).toMatch(/^1\. Inspect/m);
		expect(platformerPal.content).toMatch(/\n2\. When the green flag/);
		expect(platformerPal.content).not.toMatch(
			/1\. Inspect[^\n]+ 2\. When the green flag/
		);

		const neuralNetworks = machineLearning!.modules
			.find(module => module.title === "ML4 Neural Networks")
			?.curriculum.find(item => item.title === "Core Concepts");
		expect(neuralNetworks).toBeDefined();
		expect(neuralNetworks!.content).toContain(
			"A sigmoid graph is useful here because the sigmoid function always returns a value between 0 and 1."
		);
		expect(neuralNetworks!.content).toContain("**Details:**");
		expect(neuralNetworks!.content).not.toMatch(
			/value between 0 and\s+\n\s*\n\s*1\. Some common activation/
		);

		const aiLandscape = aiLevel1!.modules
			.find(
				module =>
					module.title ===
					"Unit 1: AI Landscape and State Representation"
			)
			?.curriculum.find(item => item.title === "Core Concepts");
		expect(aiLandscape).toBeDefined();
		expect(aiLandscape!.content).toContain(
			"Strong representations are easy to inspect"
		);
		expect(aiLandscape!.content).toContain(
			"once the necessary information has been identified"
		);
		expect(aiLandscape!.content).not.toMatch(/\bcourse should\b/i);
		expect(aiLandscape!.content).not.toMatch(/\bShow why\b/);
	});

	it("contextualizes generated studio support without repeated generic scaffolding", async () => {
		const [dataScience, scratchLevel1, webDevelopment, lowLevelSecurity] =
			await Promise.all([
				loadRawCourse("data-science-in-python"),
				loadRawCourse("scratch-level-1"),
				loadRawCourse("web-development-foundations"),
				loadRawCourse("low-level-security")
			]);
		expect(dataScience).not.toBeNull();
		expect(scratchLevel1).not.toBeNull();
		expect(webDevelopment).not.toBeNull();
		expect(lowLevelSecurity).not.toBeNull();

		const csvStudio = findItem(
			dataScience!,
			/^Concept Path$/,
			/CSV loading, numeric summaries/
		);
		expect(csvStudio.content).toContain(
			"before interpreting the average.\n\n**Expected outcome:**"
		);
		expect(csvStudio.content).toContain(
			"Include one small hand-checkable case before accepting any larger dataset result.\n\n**Result quality:**"
		);
		expect(csvStudio.content).not.toContain(
			"any larger dataset result is accepted.\n\n**Readable output:**"
		);
		expect(csvStudio.content).toContain(
			"- Name the dataset or search space, target question, feature or column choices, and comparison point."
		);
		expect(csvStudio.content).not.toContain(
			"Define the Concept Path for DSP10"
		);

		const scratchStudio = scratchLevel1!.modules
			.find(module => module.title === "GS16 Debugging and Remix Studio")
			?.curriculum.find(item => item.title === "Core Concepts");
		expect(scratchStudio).toBeDefined();
		expect(scratchStudio.content).toContain(
			"The studio starting position, visible state, score or timer, and reset behavior are predictable"
		);
		expect(scratchStudio.content).toContain(
			"Compare the studio against the original goal and record at least one improvement or bug fix"
		);
		expect(scratchStudio.content).not.toContain(
			"Check Concept Path against the stated success criteria"
		);

		const webStudio = findItem(
			webDevelopment!,
			/Full-Stack Web Lab 15: Core Concepts/
		);
		expect(webStudio.content).toContain(
			"Identify the lab user interaction, state change, DOM/canvas/API output, and visible loading, empty, or error state."
		);
		expect(webStudio.content).toContain(
			"Implement one visible behavior at a time and inspect the page, console, network panel, or local server after each change."
		);
		expect(webStudio.content).not.toContain(
			"smallest the browser-visible path"
		);
		expect(webStudio.content).not.toContain(
			"Name the Full-Stack Web Lab 15 Core Concepts route or component"
		);

		const securityStudio = findItem(
			lowLevelSecurity!,
			/Low-Level Security Lab 9: Core Concepts/
		);
		expect(securityStudio.content).toContain(
			"Name the allowed target, disallowed actions, evidence source, stop condition, and defensive purpose."
		);
		expect(securityStudio.content).not.toContain(
			"For Low-Level Security Lab 9 Core Concepts, state the authorized local lab boundary"
		);

		const corpus = [
			allCourseText(dataScience),
			allCourseText(scratchLevel1),
			allCourseText(webDevelopment),
			allCourseText(lowLevelSecurity)
		].join("\n");
		expect(corpus).not.toContain(
			"- Requirements, evidence, and success criteria are specific enough to review later."
		);
		expect(corpus).not.toContain(
			"- The final note explains what changed, what was proven, and what limitation remains."
		);
	});

	it("keeps refactoring clinics concept-specific instead of repeated design-pattern filler", async () => {
		const course = await loadRawCourse("design-patterns-in-java-part-2");
		expect(course).not.toBeNull();

		const clinicConcepts = [11, 12, 13, 14, 15, 16, 17].map(clinic =>
			findItem(
				course!,
				new RegExp(`Refactoring Clinic ${clinic}: Core Concepts`)
			)
		);

		expect(new Set(clinicConcepts.map(item => item.content)).size).toBe(7);
		expect(clinicConcepts[0].content).toContain("feature envy");
		expect(clinicConcepts[0].content).toContain("Extract Class");
		expect(clinicConcepts[1].content).toContain(
			"Replace Conditional with Polymorphism"
		);
		expect(clinicConcepts[2].content).toContain(
			"Introduce Parameter Object"
		);
		expect(clinicConcepts[3].content).toContain("Replace Temp with Query");
		expect(clinicConcepts[4].content).toContain("Template Method");
		expect(clinicConcepts[5].content).toContain("Null Object");
		expect(clinicConcepts[6].content).toContain(
			"multi-smell sequencing"
		);

		for (const item of clinicConcepts) {
			expect(item.content).not.toContain(
				"object roles, collaboration boundaries, before-and-after coupling"
			);
		}
	});

	it("formats inline project steps and support labels as readable markdown blocks", async () => {
		const [scratchLevel1, scratchLevel2, pygames] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2"),
			loadRawCourse("pygames")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(pygames).not.toBeNull();

		const spinner = findItem(scratchLevel1!, /Spinner/);
		expect(spinner.content).toContain(
			"**Goal:** Build a spinner that responds to the green flag"
		);
		expect(spinner.content).toContain("**Event behaviors:**");
		expect(spinner.content).toContain(
			"When the spacebar is pressed, point the arrow toward the mouse"
		);
		expect(spinner.content).toContain("**Evidence target:**");
		expect(spinner.content).not.toContain(
			"It's time to build a fun spinner"
		);
		expect(spinner.content).not.toContain("Build a working result for");

		const imagesReview = findItem(pygames!, /Review: Images and Sprites/);
		expect(imagesReview.content).toContain(
			"PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback"
		);
		expect(imagesReview.content).not.toContain("Scratch game design");

		const rainbowFill = findItem(pygames!, /Rainbow Fill/);
		expect(rainbowFill.content).toContain("**Outcome:**");
		expect(rainbowFill.content).toContain(
			"Define the project's visible state"
		);
		expect(rainbowFill.content).toContain("**Checkpoints:**");
		expect(rainbowFill.content).toContain(
			"The final explanation names the game loop behavior"
		);
		expect(rainbowFill.content).toContain("**Extension:**");
		expect(rainbowFill.content).not.toContain("Define The project");

		const wheel = findItem(scratchLevel2!, /Wheel of Fortune/);
		expect(wheel.content).toContain(
			"**Lists and variables:**\n- A word-bank list stores possible secret words"
		);
		expect(wheel.content).toContain("**Game flow:**");
		expect(wheel.content).not.toMatch(/\band and\b/i);
	});

	it("keeps generated project support from using robotic or malformed goal text", async () => {
		for (const { id } of courseCatalog) {
			const course = await loadRawCourse(id);
			expect(course).not.toBeNull();
			const text = allCourseText(course);

			expect(text).not.toContain("Build a working result for");
			expect(text).not.toMatch(/\ba extension\b/i);
			expect(text).not.toMatch(/that shows .* through Java/i);
		}
	});

	it("keeps machine learning projects structured instead of wall-of-text notebook prompts", async () => {
		const course = await loadRawCourse("machine-learning");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/machine-learning.ts",
			"utf8"
		);

		const requiredSections = [
			"**Setup:**",
			"**Exploration:**",
			"**Algorithm steps:**",
			"**Model steps:**",
			"**Transfer check:**",
			"**Text preprocessing:**",
			"**Neuron model:**",
			"**Worked example:**",
			"**Network shape:**",
			"**Linear baseline:**",
			"**Polynomial model:**",
			"**Model comparison:**",
			"**Evaluation:**",
			"**Model choices:**",
			"**Scoping checks:**",
			"**Notebook workflow:**",
			"**Portfolio framing:**"
		];

		for (const section of requiredSections) {
			expect(source).toContain(section);
		}

		expect(source).not.toContain(
			"Using Google Colab and the Kaggle customer segmentation dataset, build k-means clustering from scratch"
		);
		expect(source).not.toContain(
			"Use Naive Bayes to classify emails as spam or not spam with a realistic text dataset. In Colab"
		);
		expect(source).not.toContain(
			"In Colab, build a neural network to classify weather images (rainy, sunny, cloudy, sunrise). Upload"
		);

		const customerSegmentation = findItem(course!, /Customer Segmentation/);
		expect(customerSegmentation.content).toContain(
			"The algorithm is run more than once so random initialization is visible"
		);

		const spamClassification = findItem(course!, /Email Spam/);
		expect(spamClassification.content).toContain(
			"Name one risk of relying only on accuracy or only on word counts"
		);

		const masterProject = findItem(course!, /Master Project Planning/);
		expect(masterProject.content).toContain(
			"The result can be evaluated with an appropriate metric"
		);
	});

	it("keeps Scratch project prompts structured instead of inline numbered walls", async () => {
		const [scratchLevel1, scratchLevel2] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();

		const levelOneSource = fs.readFileSync(
			"src/stores/courses/scratch-level-1.ts",
			"utf8"
		);
		const levelTwoSource = fs.readFileSync(
			"src/stores/courses/scratch-level-2.ts",
			"utf8"
		);
		const source = `${levelOneSource}\n${levelTwoSource}`;

		const requiredSections = [
			"**Project goal:** Help the wizard collect potions",
			"**Project goal:** Use arrow-key movement and compound condition checks",
			"**Butterfly controls:**",
			"**State to track:**",
			"**Lists and variables:**",
			"**Custom blocks to build:**",
			"**Function design:**",
			"**Function set:**",
			"**Function roles:**",
			"**Level structure:**",
			"**Pal movement:**",
			"**Level transitions:**"
		];

		for (const section of requiredSections) {
			expect(source).toContain(section);
		}

		expect(source).not.toContain(
			"Play through the demo and identify the game elements that need to be programmed"
		);
		expect(source).not.toContain(
			"Use the arrow keys to help the baby chick find its parents.\\n1. Program the chick"
		);
		expect(source).not.toContain(
			"Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses"
		);
		expect(source).not.toContain(
			"Build a platformer where Pal collects magic keys and moves through multiple levels.\\n1. Inspect"
		);

		const saveTheWizard = findItem(scratchLevel1!, /Save the Wizard/);
		expect(saveTheWizard.content).toContain(
			"The level variable should change exactly once per collision event"
		);

		const babyChick = findItem(scratchLevel2!, /Baby Chick/);
		expect(babyChick.content).toContain(
			"The chick must update its message correctly as it moves between the four possible touching states"
		);

		const rockPaperScissors = findItem(
			scratchLevel2!,
			/Rock Paper Scissors/
		);
		expect(rockPaperScissors.content).toContain(
			"handle invalid input, ties, and all six non-tie matchups"
		);

		const platformerPal = findItem(scratchLevel2!, /Platformer Pal/);
		expect(platformerPal.content).toContain(
			"Each level should reset cleanly, use the correct broadcast, and avoid running old level scripts"
		);
	});

	it("neutralizes repetitive generated supplemental project wording", async () => {
		const [scratchLevel1, scratchLevel2, webDevelopment] =
			await Promise.all([
				loadRawCourse("scratch-level-1"),
				loadRawCourse("scratch-level-2"),
				loadRawCourse("web-development-foundations")
			]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(webDevelopment).not.toBeNull();

		const scratchCorpus = [
			allCourseText(scratchLevel1),
			allCourseText(scratchLevel2)
		].join("\n");

		expect(scratchCorpus).not.toMatch(/Repeat the core ideas from/i);
		expect(scratchCorpus).not.toMatch(
			/Create an original variation inspired by/i
		);
		expect(scratchCorpus).toContain(
			"Practice GS1 Starting in Scratch on a focused smaller problem"
		);
		expect(scratchCorpus).toContain(
			"Design a small original variation of GS1 Starting in Scratch"
		);
		expect(allCourseText(webDevelopment)).not.toMatch(/\bbut Now\b/);
	});

	it("keeps generated concept and supplemental titles concise", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const corpus = allCourseText(course);

		expect(corpus).toContain("Core Concepts");
		expect(corpus).toContain("Input Variation Practice");
		expect(corpus).not.toContain("Applied Challenge");
		expect(corpus).not.toMatch(/Core Concepts and Learning Sequence/i);
		expect(corpus).not.toMatch(
			/Application, Misconceptions, and Readiness Check/i
		);
		expect(corpus).not.toMatch(/Transfer or Extension Project/i);
	});

	it("keeps generated safety and resource cards substantive", async () => {
		const [networkSecurity, dataScience, elementaryScience] =
			await Promise.all([
				loadRawCourse("network-security"),
				loadRawCourse("data-science-in-python"),
				loadRawCourse("elementary-science")
			]);
		expect(networkSecurity).not.toBeNull();
		expect(dataScience).not.toBeNull();
		expect(elementaryScience).not.toBeNull();

		const scopeSheet = findItem(
			networkSecurity!,
			/Safety Project: Threat Model and Scope Sheet/
		);
		const responsibleUse = findItem(
			dataScience!,
			/Boundary Project: Responsible-Use Card/
		);
		const readinessCard = findItem(
			dataScience!,
			/Catalog Project: Dataset Readiness Card/
		);
		const elementaryCorpus = allCourseText(elementaryScience);

		expect(scopeSheet.content).toContain("**Include:**");
		expect(scopeSheet.content).toContain("reset path");
		expect(responsibleUse.content).toContain("possible harm");
		expect(responsibleUse.content).toContain("human review step");
		expect(readinessCard.content).toMatch(/one sanity check/i);
		expect(elementaryCorpus).not.toMatch(
			/same learning goal[\s\S]{0,120}same learning goal/i
		);
		expect(elementaryCorpus).toContain("shared online material");
	});

	it(
		"keeps generated architecture modules reader-facing",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");

			const internalPhrases = [
				/\binstructor\b/i,
				/\byour student\b/i,
				/\bask the student\b/i,
				/\bhave the student\b/i,
				/\bsession notes?\b/i,
				/\bHQ Support\b/i,
				/\bSlack\b/i,
				/\bJuni\b/i,
				/\bJunian\b/i,
				/\bJuni whiteboard\b/i,
				/\bRecording Studio\b/i,
				/\bteacher\b/i,
				/\bportal\b/i,
				/\b(?:ask|have|let|encourage|show|teach|tell|guide|help)\s+(?:the\s+)?(?:students?|learners?)\b/i,
				/\b(?:students?|learners?)\s+(?:explain|write|build|practice|reason|understand|inspect|trace|identify|distinguish|compare|create|use|complete)\b/i,
				/This lesson arc covers/i,
				/Use this as one/i,
				/Treat this as/i,
				/\bfuture lesson writing\b/i,
				/\bfamily can tell\b/i
			];

			for (const phrase of internalPhrases)
				expect(corpus).not.toMatch(phrase);

			expect(corpus).not.toMatch(/The goal is to be able to/i);
			expect(corpus).not.toMatch(/\bensure to [a-z]/i);
			expect(corpus).not.toMatch(
				/with a clear input, process, and output path that makes .+ easier to inspect/i
			);
			expect(corpus).not.toMatch(
				/is strongest when the key terms, one traced example, and one nearby transfer case are connected clearly/i
			);
			expect(corpus).not.toMatch(
				/Core vocabulary for .+ one representative example, and a nearby variation/i
			);
			expect(corpus).not.toMatch(
				/connects to .+ through named inputs or state, one step-by-step example, and one changed second case/i
			);
			expect(corpus).not.toMatch(/Summarize [^\n.]+ by naming/i);
			expect(corpus).not.toMatch(
				/A complete check for [^\n.]+ names [^\n.]+, (?:demonstrating|explaining|checking|separating|showing|identifying)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ (?:becomes useful when|is checked by|connects the main terms to)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* (?:Use|Turn|Produce|Complete|Build|Implement|Develop|Create|Finish|Refine) \*\*[^*]+\*\* (?:to turn the module concept|with a stated goal|as a focused checkpoint|around one concrete behavior)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* \*\*[^*]+\*\* (?:makes [^\n.]+ inspectable|needs an observable result|has a clear input, process, and output path)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* (?:The core vocabulary for|Define the terms that matter for|[^\n.]+ makes [^\n.]+ concrete through a rule or model)/i
			);
			expect(corpus).not.toMatch(
				/A complete response for [^\n.]+ names [^\n.]+, (?:identifies|explains|solves|traces|checks|shows|separates|demonstrates|records)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* \*\*[^*]+\*\* produces a visible result for [^\n.]+: one ordinary path/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* The (?:class exercise|code checkpoint|object-design task|practice build|type-model task|method-contract exercise|API checkpoint|object-state build|collection exercise|Java design task|project|activity|program|analysis|work) (?:turns|makes|shows|grows|applies|includes|demonstrates|connects|documents|produces|ends|centers)\b/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* [^\n.]+ starts with the relevant parts of [^\n.]+, then follows one concrete example through a changed case/i
			);
			expect(corpus).not.toMatch(/\bmakes the central decision for\b/i);
			expect(corpus).not.toMatch(/\bMake the central decision for\b/);
			expect(corpus).not.toMatch(
				/\bconnects the prompt requirements to\b/i
			);
			expect(corpus).not.toMatch(
				/\bConnect the prompt requirements to\b/
			);
			expect(corpus).not.toMatch(
				/\bDocument the input, process, and output path\b/
			);
			expect(corpus).not.toMatch(/\bFinish with an observable result\b/);
			expect(corpus).not.toMatch(
				/\bends with an observable result, a checked assumption, and evidence tied to\b/i
			);
			expect(corpus).not.toMatch(
				/\bdocuments the input, process, and output path\b/i
			);
			expect(corpus).not.toMatch(
				/\bturns [^\n.]{1,160} into a usable model by pairing the rule with a worked example\b/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ needs one worked example/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ starts with the terms needed/i
			);
			expect(corpus).not.toMatch(
				/\bThis module focuses on (?:turn|connect|use|map|combine|organize|diagnose)\b/i
			);
			expect(corpus).not.toMatch(/\bThe work should make\b/i);
			expect(corpus).not.toMatch(
				/\b(?:broadcasts|colors|controls|variables|functions|lists|loops|keys|sprites|values|items|rules|tests|checks|steps|modules|projects|examples|conditions|outcomes|details|rings|halves|layers|errors|commands|labels|questions|methods|records|arrays) makes\b/i
			);
			expect(corpus).not.toMatch(
				/\bworking artifact with explicit requirements\b/i
			);
			expect(corpus).not.toMatch(/\bUse this [^.]+ baseline\b/i);
			expect(corpus).not.toMatch(/\bThe signature project should\b/i);
			expect(corpus).not.toMatch(/\bThe final artifact should\b/i);
			expect(corpus).not.toMatch(
				/\bprerequisite modules, project ladder, and assessment model should already be practiced\b/i
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("normalizes legacy platform-branded project names in loaded copy", async () => {
		const courses = await Promise.all([
			loadRawCourse("python-level-2"),
			loadRawCourse("python-level-3"),
			loadRawCourse("data-science-in-python"),
			loadRawCourse("ai-level-1"),
			loadRawCourse("java-level-3"),
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/\bJuni\b/i);
		expect(corpus).not.toMatch(/\bJunian\b/i);
		expect(corpus).not.toMatch(/single-folder Juni layout/i);
		expect(corpus).toContain("Archery Simulator");
		expect(corpus).toContain("Word Translator with File I/O");
		expect(corpus).toContain("Fictional Language Verifier");
		expect(corpus).toContain("Command Assistant");
		expect(corpus).toContain("Theme Park Planner");
		expect(corpus).toContain("Book Rule System");
		expect(corpus).toContain("Bakery Model");
		expect(corpus).toContain("Mini Search Engine");
		expect(corpus).toContain("Restaurant Splash Page");
		expect(corpus).toContain("News Homepage");
		expect(corpus).toContain("Department Store Discounts");
		expect(corpus).toContain("single-folder legacy layout");
		expect(corpus).toContain("a word-translation function");
	});

	it(
		"keeps generated support text aligned to the course domain",
		async () => {
			const mathAndScienceCourses = await Promise.all([
				loadRawCourse("algebra-1a"),
				loadRawCourse("algebra-1b"),
				loadRawCourse("algebra-2a"),
				loadRawCourse("algebra-2b"),
				loadRawCourse("elementary-science"),
				loadRawCourse("middle-school-integrated-science"),
				loadRawCourse("intro-to-chemistry"),
				loadRawCourse("intro-to-physics"),
				loadRawCourse("physics-level-2")
			]);
			const mathScienceCorpus = mathAndScienceCourses
				.map(allCourseText)
				.join("\n");

			expect(mathScienceCorpus).not.toMatch(/wrong loop or condition/i);
			expect(mathScienceCorpus).not.toMatch(/assuming hidden state/i);
			expect(mathScienceCorpus).not.toMatch(
				/syntax, design, or test coverage/i
			);
			expect(mathScienceCorpus).not.toMatch(/authorized scope/i);
			expect(mathScienceCorpus).not.toMatch(/input shape/i);
			expect(mathScienceCorpus).toContain(
				"vocabulary, representation choice, algebraic procedure"
			);

			const allCourses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const allCorpus = allCourses.map(allCourseText).join("\n");
			expect(allCorpus).not.toMatch(
				/Common pitfalls:\*\* Common mistakes include/i
			);
			expect(allCorpus).not.toMatch(
				/Modify the prompt so it still uses the same concept/i
			);

			const nonSecurityCourses = allCourses.filter(
				(_course, index) =>
					![
						"network-security",
						"low-level-security",
						"low-level-security-part-2",
						"rust-systems-security"
					].includes(courseCatalog[index].id)
			);
			expect(
				nonSecurityCourses.map(allCourseText).join("\n")
			).not.toMatch(/authorized scope/i);

			const swift = await loadRawCourse("intro-to-swift-app-development");
			expect(swift).not.toBeNull();
			const swiftCorpus = allCourseText(swift);
			expect(swiftCorpus).toMatch(/unclear state ownership/i);
			expect(swiftCorpus).not.toMatch(/Remote investigation/i);
			expect(swiftCorpus).not.toMatch(/Science explanation/i);
			expect(swiftCorpus).not.toMatch(/CER checkpoint/i);
			expect(swiftCorpus).not.toMatch(/wrong loop condition/i);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps algebra supplemental projects specific, neutral, and topic-aware",
		async () => {
			const courses = await Promise.all([
				loadRawCourse("algebra-1a"),
				loadRawCourse("algebra-1b"),
				loadRawCourse("algebra-2a"),
				loadRawCourse("algebra-2b")
			]);
			const corpus = courses.map(allCourseText).join("\n");
			const supplementalCorpus = courses
				.flatMap(course =>
					course!.modules.flatMap(module =>
						module.supplementalProjects.map(item => item.content)
					)
				)
				.join("\n");

			expect(corpus).not.toMatch(/Develop an application task/i);
			expect(corpus).not.toMatch(
				/Connect .* to a modeling or error-analysis task/i
			);
			expect(corpus).not.toMatch(
				/Turn .* into a compact standards-aligned practice set/i
			);
			expect(corpus).not.toMatch(
				/Apply .* in a modeling, graphing, or error-analysis context/i
			);
			expect(corpus).not.toMatch(/\ba Algebra/i);
			expect(corpus).not.toMatch(/asked students to/i);
			expect(corpus).not.toMatch(/asked learners to/i);
			expect(corpus).not.toMatch(/preparing students to/i);

			expect(supplementalCorpus).toContain("**Steps:**");
			expect(supplementalCorpus).toContain(
				"movement between a rate table"
			);
			expect(supplementalCorpus).toContain("sign error in factoring");
			expect(supplementalCorpus).toContain(
				"testing one value inside the solution set"
			);
			expect(supplementalCorpus).toContain("tracking inputs and outputs");
			expect(supplementalCorpus).toContain("extraneous solution");
			expect(supplementalCorpus).toContain("population, depreciation");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated architecture and capstone cards substantive",
		async () => {
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const terseFormulaicCards: string[] = [];
			const corpus = courses.map(allCourseText).join("\n");

			for (const [courseIndex, course] of courses.entries()) {
				expect(course).not.toBeNull();

				for (const module of course!.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const text = item.content.replace(/\s+/g, " ").trim();

						if (
							text.length < 420 &&
							/^\*\*(?:Goal|Concept path|Readiness map|Project goal):\*\*/i.test(
								text
							)
						) {
							terseFormulaicCards.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${text.length}`
							);
						}
					}
				}
			}

			expect(terseFormulaicCards).toEqual([]);
			expect(corpus).toContain("**Anchor structure:**");
			expect(corpus).toContain("**Data-story structure:**");
			expect(corpus).toContain("**Gate sequence:**");
			expect(corpus).toContain("**Option A: Relic Runner:**");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("formats authored lesson setup text as neutral student-readable sections", async () => {
		const course = await loadRawCourse("c-level-1");
		expect(course).not.toBeNull();

		const setup = findItem(course!, /Program Setup/);

		expect(setup.content).toContain("This lesson begins with");
		expect(setup.content).toContain("**Key topics:**");
		expect(setup.content).toContain("- `#include`");
		expect(setup.content).toContain("**Practice target:**");
		expect(setup.content).not.toMatch(/Start with|Cover:|Students should/);
		expect(setup.content).not.toMatch(/\*\*Learning sequence:\*\*/);
	});

	it("adds AP-specific scaffolding to terse AP Computer Science A algorithm projects", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const binarySearch = findItem(
			course!,
			/Binary Search/,
			/\*\*Goal:\*\*/
		);

		expect(binarySearch.content).toContain("AP CSA Java reasoning");
		expect(binarySearch.content).toContain(
			"State the sorted-data precondition"
		);
		expect(binarySearch.content).toContain(
			"Trace at least one search by recording the low, high, and middle indices at each step"
		);
	});

	it("adds an AP Computer Science A pacing track guide", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const guideItem = findItem(course!, /Track Guide/);
		const guidePath = "public/course-assets/apcs/apcs-pacing-tracks.md";
		const guide = fs.readFileSync(guidePath, "utf8");

		expect(guideItem.datasetLink).toBe(
			"/course-assets/apcs/apcs-pacing-tracks.md"
		);
		expect(guideItem.content).toContain("Slow/Supported");
		expect(guideItem.content).toContain("Fast/Quick");
		expect(guide).toContain(
			"Use this readme to choose a route through AP Computer Science A"
		);
		expect(guide).toMatch(/\|\s*Quick Track\s*\|\s*Fast\s*\|/);
		expect(guide).toMatch(/\|\s*Standard Track\s*\|\s*Medium\s*\|/);
		expect(guide).toMatch(/\|\s*Supported Track\s*\|\s*Slow\s*\|/);
		expect(guide).toMatch(/\|\s*Challenge Track\s*\|\s*Hard\s*\|/);
		expect(guide).toMatch(/\|\s*Slow \/ Easy\s*\|\s*Supported Track\s*\|/);
		expect(guide).toMatch(/\|\s*Fast \/ Quick\s*\|\s*Quick Track\s*\|/);
		expect(guide).toMatch(/\|\s*Hard\s*\|\s*Challenge Track\s*\|/);
		expect(guide).toContain("How To Use This Guide");
		expect(guide).toContain("Track Labels At A Glance");
		expect(guide).toContain("Course Track Cards");
		expect(guide).toContain("Track Recipes");
		expect(guide).toContain("Module Decisions By Track");
		expect(guide).toContain("Quick Route For A Strong Python/C++ Learner");
		expect(guide).toContain("Fast Placement Decision");
		expect(guide).toContain("Placement Checkpoints");
		expect(guide).toContain("The track can change during the course");
		expect(guide).toContain("Supported / Slow Track");
		expect(guide).toContain("Quick / Fast Track");
		expect(guide).toContain("Challenge / Hard Track");
		expect(guide).toContain("Exam / Score Track");
		expect(guide).toContain("Default sequence:");
		expect(guide).toContain("Advancement rule:");
		expect(guide).toContain("Today-Ready Recommendation");
		expect(guide).toContain("APCS5/APCS6");
		expect(guide).toContain("Generics, interfaces, records");
		expect(guide).not.toMatch(/Instructor Note|HQ Support|Slack|Juni/i);
		expect(guide).not.toMatch(/\bRequire\b|\bEncourage\b|\binstructor\b/i);
	});

	it(
		"keeps science investigations explicitly remote-safe and evidence-based",
		async () => {
			const courses = await Promise.all([
				loadRawCourse("elementary-science"),
				loadRawCourse("middle-school-integrated-science"),
				loadRawCourse("intro-to-physics"),
				loadRawCourse("intro-to-chemistry"),
				loadRawCourse("physics-level-2")
			]);
			const corpus = courses.map(allCourseText).join("\n");

			expect(corpus).toContain("**Investigation:**");
			expect(corpus).not.toContain(
				"The activity does not require beakers, kits, or household materials; any physical demonstration is optional and replaceable with a diagram or data table"
			);
			expect(corpus).not.toContain(
				"**Output:** Complete a claim-evidence-reasoning response, a labeled diagram or data table, and one prediction about a changed condition"
			);
			expect(corpus).not.toContain(
				"The activity should rely on accessible remote evidence"
			);
			expect(corpus).not.toContain(
				"uses shared-screen materials, notes, paper, pencil, and"
			);
			expect(corpus).toMatch(
				/No beakers, kits, or required household materials are needed|Physical supplies are optional only|shared digital resources|accessible remote evidence/
			);
			expect(corpus).toContain("claim-evidence-reasoning");
			expect(corpus).not.toContain(
				"Anchor the activity in web development workflow"
			);
			expect(corpus).not.toMatch(
				/motion[^.\n]{0,120}particles, formulas, reactions|graph[^.\n]{0,120}particles, formulas, reactions/i
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps Intro to Chemistry authored, deduplicated, and resource-specific", async () => {
		const course = await loadRawCourse("intro-to-chemistry");
		expect(course).not.toBeNull();

		const moduleTitles = course!.modules.map(module => module.title);
		const duplicateTitles = moduleTitles.filter(
			(title, index) => moduleTitles.indexOf(title) !== index
		);
		const text = allCourseText(course);
		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const linkedItems = items.filter(
			item => item.mediaLink || item.datasetLink || item.solutionLink
		);
		const thinItems = items.filter(item => item.content.length < 650);
		const localMaterialLinks = items.filter(item =>
			item.datasetLink?.includes("chemistry-materials-pack.md")
		);
		const answerKeyLinks = items.filter(item =>
			item.solutionLink?.includes("chemistry-rubrics-answer-key.md")
		);
		const phetLinks = new Set(
			items
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(duplicateTitles).toEqual([]);
		expect(text).not.toMatch(
			/Implementation Studio|Full Lesson Authoring Pack/i
		);
		expect(text).not.toMatch(
			/Standards and Scope Expansion|Module Backlog/i
		);
		expect(text).not.toMatch(/Source and Asset Parity Implementation/i);
		expect(text).not.toMatch(/Guide students|Require students|Push them/i);
		expect(text).not.toContain("CHM0");
		expect(items.length).toBeGreaterThanOrEqual(78);
		expect(thinItems).toEqual([]);
		expect(linkedItems).toHaveLength(items.length);
		expect(localMaterialLinks.length).toBeGreaterThan(36);
		expect(answerKeyLinks.length).toBeGreaterThan(28);
		expect(phetLinks.size).toBeGreaterThanOrEqual(7);
		expect(course!.modules.at(-1)?.kind).toBe("appendix");

		const normalizedCourse =
			await useCoursesStore().loadCourseById("intro-to-chemistry");
		expect(normalizedCourse!.modules.at(-1)?.kind).toBe("appendix");

		expect(text).toContain("Phase Diagrams as Maps of Conditions");
		expect(text).toContain(
			"Gas Pressure, Volume, Temperature, and Collisions"
		);
		expect(text).toContain("Naming Compounds from Formula Patterns");
		expect(text).toContain("Checkpoint: Atomic Structure");
		expect(text).toContain("Checkpoint: Energy, Phase Change, and Gases");
		expect(text).toContain("Checkpoint: Quantitative Chemistry Reasoning");
		expect(text).toContain("Checkpoint: Capstone Defense");
		expect(text).toContain("Reaction Energy and Rates");
		expect(text).toContain("Redox, Batteries, and Electron Transfer");
		expect(text).toContain("Remote-Safe Investigation Checklist");
		expect(text).toContain("Chemistry Explanation Rubric");
		expect(text).toContain("CHM10 Advanced Chemistry Map");
		expect(text).toContain("Reference Appendix: Chemistry Resource Bank");
		expect(text).toContain("Stoichiometry Error Analysis");
		expect(text).toContain("Original Phenomena Case Library");
		expect(text).toMatch(/original project source index/i);
		expect(text).toContain("Everyday Chemistry Observation Log");
		expect(text).toContain("Material Sorting Challenge");
		expect(text).toContain("Heating and Cooling Diary");
		expect(text).toContain("Reaction Detective Board");
		expect(text).toContain("Kitchen Chemistry Sort");
		expect(text).toContain("Chemistry in Your World Showcase");
		expect(text).toContain("Course Map and Learning Workflow");
		expect(text).toContain("Atom Simulation and Atom Builder Challenge");
		expect(text).toContain("Water Tension Experiment");
		expect(text).toContain("Making a DIY Lava Lamp");
		expect(text).toContain("Making Oobleck Case Analysis");
		expect(text).toContain("States of Matter Simulation Report");
		expect(text).toContain("Exploration of the Periodic Table");
		expect(text).toContain("Name Making with the Periodic Table");
		expect(text).toContain("Introduction to Chemical Reactions");
		expect(text).toContain("Elephant Toothpaste Case Analysis");
		expect(text).toContain("Making a Volcano Case Analysis");
		expect(text).toContain("Making Invisible Ink Case Analysis");
		expect(text).toContain("Solution Simulation");
		expect(text).toContain("Separating Mixtures");
		expect(text).toContain("Model Your Own Reaction");
		expect(text).toContain("water cohesion and surface tension");
		expect(text).toContain("elephant toothpaste");
		expect(text).toContain("baking-soda volcanoes");
		expect(text).toContain("invisible ink");
		expect(text).toContain("PBS/ChemThink atom simulation");
		expect(text).toContain("PBS periodic table interactive");
		expect(text).toContain("JavaLab dissolution simulation");
		expect(text).toContain("PubChem periodic table");
		expect(text).toContain("Periodic Table Reference Set");
		expect(text).toContain("Royal Society of Chemistry periodic table");
		expect(text).toContain("IUPAC periodic table");
		expect(text).not.toMatch(/\. the activity claim/);
		expect(text).not.toMatch(
			/\b(?:A complete|The final|Final) the activity (?:result|note|response|answer|explanation|work)\b/i
		);
		expect(text).not.toMatch(
			/\*\*Reference purpose:\*\*[^\n]+ \*\*(?:Resource bank|Reference links|Use):\*\*/
		);
		expect(text).toContain(
			"Limiting Reactants, Leftovers, and Heat Released"
		);
		expect(text).toContain("1.5 mol O₂");
		expect(text).toContain("285.8 kJ");

		const coreReferences = findItem(course!, /Core Chemistry References/);
		expect(coreReferences.content).toMatch(
			/\*\*Reference purpose:\*\*[\s\S]+?\n\n\*\*Resource bank:\*\*/
		);
		expect(coreReferences.content).toMatch(/\n\n\*\*Use:\*\*/);

		const periodicTableReferences = findItem(
			course!,
			/^Periodic Table Reference Set$/
		);
		expect(periodicTableReferences.content).toMatch(
			/\*\*Reference purpose:\*\*[\s\S]+?\n\n\*\*Reference links:\*\*/
		);
		expect(periodicTableReferences.content).toMatch(
			/response\. The activity claim answers/
		);

		const bondEnergyLesson = items.find(
			item => item.title === "Bond Energies and Reaction Estimates"
		);
		expect(bondEnergyLesson?.content).toContain("| Bond | kJ/mol |");
		expect(bondEnergyLesson?.content).toContain("**Reading the table:**");
		expect(bondEnergyLesson?.content).not.toMatch(/\|\s*\|\s*\|/);
	});

	it("keeps Intro to Chemistry local asset fragments backed by real headings", async () => {
		const course = await loadRawCourse("intro-to-chemistry");
		expect(course).not.toBeNull();

		const materialHeadings = markdownHeadingSlugs(
			"public/course-assets/chemistry/chemistry-materials-pack.md"
		);
		const answerHeadings = markdownHeadingSlugs(
			"public/course-assets/chemistry/chemistry-rubrics-answer-key.md"
		);
		const missingFragments: string[] = [];

		for (const module of course!.modules) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				for (const link of [item.datasetLink, item.solutionLink]) {
					if (!link?.startsWith("/course-assets/chemistry/"))
						continue;
					if (!link.includes("#")) continue;

					const [path, hash] = link.split("#", 2);
					const headingSet = path.includes("materials-pack")
						? materialHeadings
						: answerHeadings;

					if (!headingSet.has(hash)) {
						missingFragments.push(`${item.title}: ${link}`);
					}
				}
			}
		}

		expect(missingFragments).toEqual([]);
	});

	it(
		"keeps every local markdown course asset link backed by a real file and heading fragment",
		async () => {
			const missingAssets: string[] = [];
			const missingFragments: string[] = [];
			const headingCache = new Map<string, Set<string>>();

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course).not.toBeNull();

				for (const resource of courseItemLinks(entry.id, course!)) {
					const parsed = parseCourseAssetUrl(resource.link);
					if (!parsed) continue;

					const assetPath = `public${parsed.path}`;
					if (!fs.existsSync(assetPath)) {
						missingAssets.push(
							`${resource.course} / ${resource.module} / ${resource.item}: ${resource.link}`
						);
						continue;
					}

					if (!parsed.hash) continue;

					let headings = headingCache.get(assetPath);
					if (!headings) {
						headings = markdownHeadingSlugs(assetPath);
						headingCache.set(assetPath, headings);
					}

					if (!headings.has(parsed.hash)) {
						missingFragments.push(
							`${resource.course} / ${resource.module} / ${resource.item}: ${resource.link}`
						);
					}
				}
			}

			expect(missingAssets).toEqual([]);
			expect(missingFragments).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps physics addendum guidance topic-specific instead of template-generated", async () => {
		const courseIds = ["intro-to-physics", "physics-level-2"];
		const genericMisconceptionTemplate =
			/formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system/i;
		const genericCheckpointTemplate =
			/core quantities, system boundary, and model assumption are identified/i;
		const genericCurriculumTemplates = [
			/usable physics model rather than a memorized list/i,
			/Build the model by first naming the system/i,
			/Each example should include a diagram or table/i,
			/Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case/i,
			/State what stays the same, what changes, which assumption is most fragile/i,
			/Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note/i
		];

		for (const courseId of courseIds) {
			const course = await loadRawCourse(courseId);
			expect(course).not.toBeNull();

			const diagnostics = course!.modules.flatMap(module =>
				module.supplementalProjects
					.filter(item => item.title === "Diagnostic Checkpoint")
					.map(item => item.content)
			);
			const misconceptions = course!.modules.flatMap(module =>
				module.supplementalProjects
					.filter(item => item.title === "Common Pitfalls")
					.map(item => item.content)
			);
			const combined = [...diagnostics, ...misconceptions].join("\n");
			const courseText = allCourseText(course);
			const source = fs.readFileSync(
				`src/stores/courses/${
					courseId === "intro-to-physics"
						? "intro-to-physics"
						: "physics-level-2"
				}.ts`,
				"utf8"
			);

			expect(combined).not.toMatch(genericMisconceptionTemplate);
			expect(combined).not.toMatch(genericCheckpointTemplate);
			expect(combined).not.toMatch(/\bWatch for\b/i);
			expect(courseText).toContain("Common Pitfalls");
			expect(courseText).not.toContain("Misconception Watchlist");
			expect(source).not.toMatch(/\bWatch for\b/i);
			expect(source).not.toMatch(/The correction should replace/i);
			expect(source).not.toContain("Misconception Watchlist");
			for (const pattern of genericCurriculumTemplates) {
				expect(courseText).not.toMatch(pattern);
			}
			expect(new Set(diagnostics).size).toBe(diagnostics.length);
			expect(new Set(misconceptions).size).toBe(misconceptions.length);
		}

		const physics2 = await loadRawCourse("physics-level-2");
		expect(
			findItem(physics2!, /Common Pitfalls/, /Bernoulli-style reasoning/)
				.content
		).toContain("continuum models break down");
	});

	it("turns applied studio labs into explicit studio specifications", async () => {
		const course = await loadRawCourse("low-level-security");
		expect(course).not.toBeNull();

		const studioItem = course!.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.content.includes("**Studio focus:**"));

		expect(studioItem?.content).toContain("**Build steps:**");
		expect(studioItem?.content).toContain("**Checkpoints:**");
		expect(studioItem?.content).toMatch(/authorization|authorized/i);
		expect(studioItem?.content).toMatch(/local (lab|evidence|target)/i);
	});
});
