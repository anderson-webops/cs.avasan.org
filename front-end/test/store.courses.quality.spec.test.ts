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

describe("course text quality normalization", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
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
			expect(corpus).toContain("Applied lab");
			expect(corpus).toContain("applied challenge");
			expect(corpus).toContain("Course Roadmap");
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
			loadRawCourse("java-level-1-java-superstar"),
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
		expect(corpus).not.toMatch(/content:\s*""/);
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
		expect(corpus).toContain(
			"Use CSS Diner to practice selector precision"
		);
		expect(corpus).toContain(
			"Use Flexbox Froggy as a layout reasoning drill"
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
		expect(corpus).toContain("Plan **");
		expect(corpus).toContain("Finish **");
		expect(corpus).toContain("Extend **");
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
			const repeatedWords: string[] = [];
			const courses = await Promise.all(
				courseCatalog.map(entry => loadRawCourse(entry.id))
			);
			const corpus = courses.map(allCourseText).join("\n");
			const genericTitleSuffix =
				/(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Standards Practice Set|Supplemental(?: Project| Practice)? [23]|Verification and Reflection)$/i;
			const nestedBoldProjectGoalPattern =
				/\*\*Project goal:\*\*\s+\*\*[^*\n]{1,180}\*\*/;
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
						if (
							genericTitleSuffix.test(item.title) &&
							(item.title.startsWith(`${module.title}:`) ||
								item.title.startsWith(`${course.name}: ${module.title}`))
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
	});

	it("adds project requirements and completion checks to thin legacy Python project prompts", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Project goal:**");
		expect(calendarMachine.content).toContain("**Required outcome:**");
		expect(calendarMachine.content).toContain("Test zero days");
		expect(calendarMachine.content).toContain("**Completion checks:**");
	});

	it("preserves structured guidance after UI course-store normalization", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Project goal:**");
		expect(calendarMachine.content).toContain("**Required outcome:**");
		expect(calendarMachine.content.length).toBeGreaterThan(500);
	});

	it("formats grouped lesson arcs as readable ordered markdown lists", async () => {
		const store = useCoursesStore();
		const [course, scratchCourse, machineLearning, aiLevel1] =
			await Promise.all([
				store.loadCourseById("python-level-3"),
				loadRawCourse("scratch-level-1"),
				loadRawCourse("machine-learning"),
				loadRawCourse("ai-level-1")
			]);
		expect(course).not.toBeNull();
		expect(scratchCourse).not.toBeNull();
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
		expect(scratchStudio!.content).toContain(
			"\n   **Completion checks:**\n   -"
		);
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
			/\n \n\n\*\*Completion checks:\*\*/
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
			"once the structure's required information is identified"
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
			"It's time to build a fun spinner:\n\n1. When the green flag is clicked"
		);
		expect(spinner.content).toContain(
			"towards the mouse.\n\n**Project goal:**"
		);
		expect(spinner.content).toContain(
			"enough structure, naming, and evidence to support Scratch game design"
		);
		expect(spinner.content).toContain("\n\n**Required outcome:**");
		expect(spinner.content).not.toContain("Build a working result for");

		const imagesReview = findItem(pygames!, /Images and Sprites: Review/);
		expect(imagesReview.content).toContain(
			"PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback"
		);
		expect(imagesReview.content).not.toContain("Scratch game design");

		const wheel = findItem(scratchLevel2!, /Wheel of Fortune/);
		expect(wheel.content).toContain(
			"secret word.\n\n1. Construct a word bank"
		);
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
		expect(corpus).toContain("Applied Challenge");
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

		expect(scopeSheet.content).toContain("**Required fields:**");
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
				/\bJuni whiteboard\b/i,
				/\bRecording Studio\b/i,
				/\bteacher\b/i,
				/\bportal\b/i,
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
				/\*\*Project goal:\*\* (?:Use|Turn|Produce|Complete|Build|Implement|Develop|Create|Finish|Refine) \*\*[^*]+\*\* (?:to turn the module concept|with a stated goal|as a focused checkpoint|around one concrete behavior)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Project goal:\*\* \*\*[^*]+\*\* (?:makes [^\n.]+ inspectable|needs an observable result|has a clear input, process, and output path)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* (?:The core vocabulary for|Define the terms that matter for|[^\n.]+ makes [^\n.]+ concrete through a rule or model)/i
			);
			expect(corpus).not.toMatch(
				/A complete response for [^\n.]+ names [^\n.]+, (?:identifies|explains|solves|traces|checks|shows|separates|demonstrates|records)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Project goal:\*\* \*\*[^*]+\*\* produces a visible result for [^\n.]+: one ordinary path/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* [^\n.]+ starts with the relevant parts of [^\n.]+, then follows one concrete example through a changed case/i
			);
			expect(corpus).not.toMatch(
				/\bThis module focuses on (?:turn|connect|use|map|combine|organize|diagnose)\b/i
			);
			expect(corpus).not.toMatch(/\bThe work should make\b/i);
			expect(corpus).not.toMatch(
				/\bprerequisite modules, project ladder, and assessment model should already be practiced\b/i
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

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
			/\*\*Project goal:\*\*/
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

			expect(corpus).toContain("**Remote investigation:**");
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
		expect(text).toContain(
			"Limiting Reactants, Leftovers, and Heat Released"
		);
		expect(text).toContain("1.5 mol O₂");
		expect(text).toContain("285.8 kJ");

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
					.filter(item => item.title === "Misconception Watchlist")
					.map(item => item.content)
			);
			const combined = [...diagnostics, ...misconceptions].join("\n");
			const courseText = allCourseText(course);

			expect(combined).not.toMatch(genericMisconceptionTemplate);
			expect(combined).not.toMatch(genericCheckpointTemplate);
			expect(combined).not.toMatch(/\bWatch for\b/i);
			for (const pattern of genericCurriculumTemplates) {
				expect(courseText).not.toMatch(pattern);
			}
			expect(new Set(diagnostics).size).toBe(diagnostics.length);
			expect(new Set(misconceptions).size).toBe(misconceptions.length);
		}

		const physics2 = await loadRawCourse("physics-level-2");
		expect(
			findItem(
				physics2!,
				/Misconception Watchlist/,
				/Bernoulli-style reasoning/
			).content
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

		expect(studioItem?.content).toContain("**Build sequence:**");
		expect(studioItem?.content).toContain("**Completion checks:**");
		expect(studioItem?.content).toMatch(/authorization|authorized/i);
		expect(studioItem?.content).toMatch(/local (lab|evidence|target)/i);
	});
});
