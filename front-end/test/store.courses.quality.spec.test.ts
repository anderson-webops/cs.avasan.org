import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";
import { slugMarkdownHeading } from "@/modules/courseAssetPreview";

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
			expect(corpus).toContain(
				"as a working artifact with visible behavior and verification evidence"
			);
			expect(corpus).toContain(
				"Test a normal path, a boundary or failure path"
			);
			expect(corpus).toContain(
				"The artifact demonstrates the module concept through behavior, output, tests, traces, or another concrete result"
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
			expect(corpus).toContain("Applied Lab");
			expect(corpus).toContain("Learning Roadmap and Sequencing");
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
			expect(corpus).toContain("PyGame development");
			expect(corpus).toContain("Swift app development");
			expect(corpus).toContain("Linux systems practice");
			expect(corpus).toContain("network systems practice");
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
		expect(corpus).toContain("green flag starts");
		expect(corpus).toContain("event/state logic");
		expect(corpus).not.toMatch(/module's core concept, a concrete worked example, and a testable artifact/i);
		expect(corpus).not.toMatch(/expected file format/i);
		expect(corpus).not.toMatch(/malformed or missing data/i);
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
				required: ["personal study guide", "filled shape", "uses a comment"]
			},
			{
				title: /Open Ended Project - Create a Drawing/,
				required: ["Plan the drawing", "`goto()`", "comments naming each part"]
			},
			{
				title: /^GrS2 Supplemental Project 7: Loops Recap$/,
				required: ["side count", "turn angle", "traced example"]
			},
			{
				title: /^GrS3 Supplemental Project 2: Debugging Practice$/,
				required: ["first error message", "rerun the program", "several things at once"]
			},
			{
				title: /Practice Project/,
				required: ["turn amount", "step length", "connected intentionally"]
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
				required: ["drawHouse()", "different positions or sizes", "without duplicating"]
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
				required: ["parameter values", "different sizes", "Verify the design"]
			},
			{
				title: /^GrS9 Project 3: Polka Dots$/,
				required: ["mouse clicks", "click coordinates", "edges, and corners"]
			},
			{
				title: /^GrS13 Project 3: Fluid Motion$/,
				required: ["screen.tracer(0)", "screen.update()", "animation loop"]
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
				required: ["body list", "self-collision", "game-over conditions"]
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
		expect(corpus).toContain("Use CSS Diner to practice selector precision");
		expect(corpus).toContain("Use Flexbox Froggy as a layout reasoning drill");
		expect(corpus).toContain(
			"The key skill is separating local page state from persisted remote state"
		);
		expect(corpus).toContain(
			"comments do not accidentally attach to the wrong item"
		);
	});

	it("keeps JavaScript Level 1 prompts student-readable and concrete", async () => {
		const course = await loadRawCourse("javascript-level-1-javascript-superstar");
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
				required: ["intermediate tax and tip values", "decimal meal cost"]
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
				required: ["three Materialize JavaScript components", "after a page refresh"]
			},
			{
				title: /^JSS15 Supplemental Project 3: Jun-E-Commerce$/,
				required: ["featured products", "call-to-action", "narrow screen"]
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
		expect(corpus).toContain("State the local lab boundary");
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

		expect(corpus).not.toMatch(/Data Analysis Lab 1[1-7]: Implementation Lab/);
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
				course!.modules.some(module => module.title.includes(expectedModule)),
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
		const course = await store.loadCourseById("python-level-3");
		expect(course).not.toBeNull();

		const lessonArc = findItem(
			course!,
			/Core Concepts and Learning Sequence/,
			/Core topics in this module:/
		);

		expect(lessonArc.content).toMatch(
			/Core topics in this module:\n\n1\. \*\*Introductions & Setup\*\*/
		);
		expect(lessonArc.content).toMatch(/\n2\. \*\*.+\*\*\n\s+/);
		expect(lessonArc.content).not.toMatch(/1\) .+; 2\)/s);
		expect(lessonArc.content).not.toMatch(/This lesson arc covers/i);
	});

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
		expect(binarySearch.content).toContain("Trace at least one search");
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
			expect(corpus).toContain(
				"The activity does not require beakers, kits, or household materials"
			);
			expect(corpus).toContain("claim-evidence-reasoning");
			expect(corpus).not.toContain(
				"Anchor the activity in web development workflow"
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
		expect(studioItem?.content).toContain(
			"approved local or owned targets"
		);
	});
});
