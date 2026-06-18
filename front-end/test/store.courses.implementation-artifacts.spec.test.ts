import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";
import {
	courseContentOnlySourcePolicies,
	courseImplementationSourceRepos,
	courseToolchainAssumptions
} from "@/stores/courses/course-implementation-artifacts";
import { researchBackedExpansionCourseIds } from "@/stores/courses/research-expansions";

const authoredLearnerCourseIds = new Set(["intro-to-chemistry"]);
const COURSE_SWEEP_TIMEOUT = 180000;
const pythonLevel2SplitSourceFolders = new Set([
	"PS-Check-in-1",
	"PS-Check-in-2",
	"PS1-Index-Picker",
	"PS1-Mad-Libs",
	"PS1-Relay-Race",
	"PS1-Space-Mountain",
	"PS1-Tip-Calculator",
	"PS10-Field-Day",
	"PS10-Field-Day-II",
	"PS10-Todo-List",
	"PS11-Bank-Account",
	"PS11-Calculator",
	"PS12-Type-Racer",
	"PS13-Advanced-Typewriter-Monkeys",
	"PS14-Advanced-Blackjack",
	"PS14-Game-of-War",
	"PS14-Mastermind",
	"PS14-Simple-Blackjack",
	"PS2-Calendar-Machine",
	"PS2-Change-Machine",
	"PS2-Crazy-Nametags",
	"PS2-Double-or-Nothing",
	"PS2-For-Loop-Fun",
	"PS2-Interest-Aggregator",
	"PS2-Juni-Archery",
	"PS2-Multiplication-Tables",
	"PS2-Password-Guesser",
	"PS3-ASCII-Art",
	"PS3-Caesar-Cipher",
	"PS3-Nested-Boxes",
	"PS3-Password-Cracker",
	"PS3-Simple-Cipher",
	"PS3-Uppercase-to-Lowercase",
	"PS4-Carnival-Strength-Tester",
	"PS4-Credit-Card-Validator",
	"PS4-FizzBuzz",
	"PS4-Joes-Donuts-Opening-Day",
	"PS4-Number-Guesser",
	"PS4-Relay-Race-Statistics",
	"PS4-Rock-Paper-Scissors",
	"PS4-Test-Statistics",
	"PS5-Coin-Flipper",
	"PS5-Dice-Roller",
	"PS5-Functions-Practice",
	"PS5-Juni-Latin",
	"PS5-Number-Games",
	"PS5-Parameter-Tracing",
	"PS5-Squawka-Zilly-Floog",
	"PS6-Basketball-Stars",
	"PS6-Build-a-Song",
	"PS6-Card-Shuffler",
	"PS6-Dog-Breeds",
	"PS6-Lists-Practice-1",
	"PS6-Tower-of-Terror",
	"PS7-Dictionaries-Practice",
	"PS7-Test-Scores",
	"PS9-Class-Registration-II",
	"PS9-Favorite-Foods",
	"PS9-Sets-Practice",
	"PS9-Wheel-of-Fortune"
]);

async function requireCourse(courseId: string) {
	const course = await loadRawCourse(courseId);
	expect(course, courseId).not.toBeNull();
	return course!;
}

async function requireAuthoredCourse(courseId: string) {
	const entry = courseCatalog.find(courseEntry => courseEntry.id === courseId);
	expect(entry, courseId).toBeDefined();
	return entry!.load();
}

function allText(course: Awaited<ReturnType<typeof requireCourse>>) {
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

function coreModules(course: Awaited<ReturnType<typeof requireCourse>>) {
	return course.modules.filter(module => module.kind !== "appendix");
}

function courseItems(course: Awaited<ReturnType<typeof requireCourse>>) {
	return course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function authoredCourseItems(
	course: Awaited<ReturnType<typeof requireAuthoredCourse>>
) {
	return course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function expectAuthoredSourcePair(
	course: Awaited<ReturnType<typeof requireAuthoredCourse>>,
	title: string,
	projectPath: string,
	solutionPath: string
) {
	const item = authoredCourseItems(course).find(
		courseItem => courseItem.title === title
	);

	expect(item, title).toBeDefined();
	expect(item?.projectLink, title).toContain(projectPath);
	expect(item?.solutionLink, title).toContain(solutionPath);
}

describe("implemented course development artifacts", () => {
	it(
		"keeps course-development planning scaffolds internal while retaining metadata",
		async () => {
			for (const courseId of [
				...researchBackedExpansionCourseIds,
				"python-to-java-and-cpp-bridge"
			]) {
				const course = await requireCourse(courseId);
				const text = allText(course);

				expect(course.developmentMetadata, courseId).toBeDefined();
				expect(
					course.developmentMetadata?.standards.length,
					courseId
				).toBeGreaterThan(0);
				expect(text, courseId).not.toContain(
					"Full Lesson Authoring Pack"
				);
				expect(text, courseId).not.toContain(
					"Full Lesson Project: Transfer Task"
				);
				expect(text, courseId).not.toContain("Implementation Studio");
				expect(text, courseId).not.toContain(
					"defines the target artifact, required behavior, and core concepts needed"
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"ensures every core module has at least two supplemental project/checkpoint options",
		async () => {
			for (const { id } of courseCatalog) {
				const course = await requireCourse(id);
				const underfilled = coreModules(course).filter(
					module => module.supplementalProjects.length < 2
				);

				expect(underfilled, id).toHaveLength(0);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("implements the algebra project taxonomy decision in supplemental project slots", async () => {
		for (const courseId of [
			"algebra-1a",
			"algebra-1b",
			"algebra-2a",
			"algebra-2b"
		]) {
			const course = await requireCourse(courseId);
			const text = allText(course);

			expect(text).toContain(
				"Project Taxonomy and Assessment Implementation"
			);
			expect(text).toContain("Structure Decision");
			expect(
				coreModules(course).every(
					module => module.supplementalProjects.length >= 2
				),
				courseId
			).toBe(true);
		}
	});

	it(
		"adds science resource banks and the elementary grade-band decision",
		async () => {
			for (const courseId of [
				"elementary-science",
				"middle-school-integrated-science",
				"intro-to-physics",
				"physics-level-2"
			]) {
				const course = await requireCourse(courseId);
				const text = allText(course);

				expect(text, courseId).toContain("Remote Resource Bank");
				expect(text, courseId).toContain("PhET");
				expect(text, courseId).toMatch(
					/does not require (?:beakers|household materials|physical lab supplies)|No physical lab supplies are required|No required project depends/i
				);
				expect(
					course.modules.some(module =>
						[
							...module.curriculum,
							...module.supplementalProjects
						].some(item => item.mediaLink || item.datasetLink)
					),
					courseId
				).toBe(true);
			}

			const chemistryText = allText(
				await requireCourse("intro-to-chemistry")
			);
			expect(chemistryText).toContain("CHM10 Advanced Chemistry Map");
			expect(chemistryText).toContain(
				"Reference Appendix: Chemistry Resource Bank"
			);
			expect(chemistryText).toContain("Core Chemistry References");
			expect(chemistryText).toContain(
				"Remote-Safe Investigation Checklist"
			);

			expect(
				allText(await requireCourse("elementary-science"))
			).toContain("Decision: Keep One Course with K-2 and 3-5 Paths");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("rebuilds Unity around a full Unity 6.3 LTS module sequence", async () => {
		const course = await requireCourse("unity-game-development");
		const text = allText(course);
		const rebuiltModules = course.modules.filter(module =>
			module.title.startsWith("UGD")
		);

		expect(text).toContain("Unity 6.3 LTS");
		expect(rebuiltModules.length).toBeGreaterThanOrEqual(7);
		expect(
			rebuiltModules.every(
				module => module.supplementalProjects.length >= 2
			)
		).toBe(true);
		expect(text).toContain("UGD6 Capstone Production");
		expect(JSON.stringify(course)).toContain("UGD-full-project-starter");
		expect(JSON.stringify(course)).toContain("UGD-full-project-solution");
	});

	it("keeps Unity source-readiness scripts aligned with canonical full-project folder names", () => {
		const scriptCorpus = [
			"scripts/generate-course-development-artifacts.mts",
			"scripts/sync-course-source-readiness.mts"
		]
			.map(file => readFileSync(file, "utf8"))
			.join("\n");

		expect(scriptCorpus).toContain("UGD-full-project-starter");
		expect(scriptCorpus).toContain("UGD-full-project-solution");
		expect(scriptCorpus).not.toContain("UGD-FullProject-Starter");
		expect(scriptCorpus).not.toContain("UGD-FullProject-Solution");
	});

	it("adds AP CSA alignment, C++ concept matrix, datasets, and safety policy modules", async () => {
		expect(allText(await requireCourse("ap-computer-science-a"))).toContain(
			"AP CSA Exam Alignment and FRQ Practice Map"
		);
		expect(allText(await requireCourse("cpp-level-3"))).toContain(
			"CS235/CS236-Inspired Mini Build"
		);
		expect(allText(await requireCourse("machine-learning"))).toContain(
			"Dataset, Model, and Evaluation Catalog"
		);
		expect(
			allText(await requireCourse("data-science-in-python"))
		).toContain("NOAA daily weather observations");
		expect(allText(await requireCourse("network-security"))).toContain(
			"Systems and Security Lab Safety Policy"
		);
		expect(allText(await requireCourse("low-level-security"))).toContain(
			"owned local fixtures"
		);
	});

	it("records source repo policy metadata without visible source-parity scaffolds", async () => {
		for (const [courseId, repo] of Object.entries(
			courseImplementationSourceRepos
		)) {
			const course = await requireCourse(courseId);
			const text = allText(course);

			expect(
				course.developmentMetadata?.sourcePolicy,
				courseId
			).toContain(`https://github.com/instruction-material/${repo}`);
			expect(text, courseId).not.toContain(
				"Source and Asset Parity Implementation"
			);
			expect(text, courseId).not.toContain("Canonical Source Repository");
		}
	});

	it("keeps Java design-pattern courses source-backed by the shared Java Level 3 repo", async () => {
		for (const courseId of [
			"design-patterns-in-java",
			"design-patterns-in-java-part-2"
		]) {
			const course = await requireCourse(courseId);

			expect(courseImplementationSourceRepos[courseId], courseId).toBe(
				"Java-Level-3"
			);
			expect(
				course.developmentMetadata?.sourcePolicy,
				courseId
			).toContain("https://github.com/instruction-material/Java-Level-3");
			expect(
				courseContentOnlySourcePolicies[courseId],
				courseId
			).toBeUndefined();
		}
	});

	it("links Python Level 1 Turtle projects to starter and solution folders", async () => {
		const serializedCourse = JSON.stringify(
			await requireCourse("python-level-1")
		);

		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/solution"
		);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GrS3-Random-Walk/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GrS3-Random-Walk/solution"
		);
		expect(serializedCourse).not.toContain(
			"Python-Level-1/blob/main/GrS1-Turtle-Exporation-All-Star/solution/main.py"
		);
		expect(serializedCourse).not.toContain(
			"Python-Level-1/blob/main/GrS3-Random-Walk/solution/main.py"
		);
	});

	it("keeps Python Level 1 source links pointed at starter or solution folders", async () => {
		const serializedCourse = JSON.stringify(
			await requireCourse("python-level-1")
		);
		const rootOnlyLinks = [
			...serializedCourse.matchAll(
				/https:\/\/github\.com\/instruction-material\/Python-Level-1\/tree\/main\/([^"]+)/g
			)
		]
			.map(match => match[1].replace(/\\+$/, ""))
			.filter(
				urlPath =>
					!urlPath.endsWith("/starter") &&
					!urlPath.endsWith("/solution")
			);

		expect(rootOnlyLinks).toHaveLength(0);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GrS2-Basic-Shapes/solution"
		);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/Reflection-Template-Updated/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-1/tree/main/GRS-Check-in-Three-Updated/solution"
		);
	});

	it("keeps authored starter and solution records explicit before normalization", async () => {
		const pythonLevel1 = await requireAuthoredCourse("python-level-1");
		const pythonLevel2 = await requireAuthoredCourse("python-level-2");
		const pythonLevel3 = await requireAuthoredCourse("python-level-3");
		const bridgeCourse = await requireAuthoredCourse(
			"python-to-java-and-cpp-bridge"
		);
		const cppLevel2 = await requireAuthoredCourse("cpp-level-2");
		const aiLevel1 = await requireAuthoredCourse("ai-level-1");
		const javaLevel3 = await requireAuthoredCourse("java-level-3");
		const machineLearning = await requireAuthoredCourse("machine-learning");

		expectAuthoredSourcePair(
			pythonLevel1,
			"Check-In #1 Reflection",
			"Python-Level-1/tree/main/Reflection-Template-Updated/starter",
			"Python-Level-1/tree/main/Reflection-Template-Updated/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel1,
			"GrS5 Supplemental Project 4: Turtle Race",
			"Python-Level-1/tree/main/Turtle-Race-Starter/starter",
			"Python-Level-1/tree/main/Turtle-Race-Starter/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel1,
			"GrS9 Supplemental Project 3: Pyramid with Functions",
			"Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/starter",
			"Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel2,
			"Parameter Tracing",
			"Python-Level-2/tree/main/PS5-Parameter-Tracing/starter",
			"Python-Level-2/tree/main/PS5-Parameter-Tracing/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel2,
			"PS9 Supplemental Project 2: Class Registration II",
			"Python-Level-2/tree/main/PS9-Class-Registration-II/starter",
			"Python-Level-2/tree/main/PS9-Class-Registration-II/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel2,
			"PS13 Supplemental Project 2: Advanced Typewriter Monkeys",
			"Python-Level-2/tree/main/PS13-Advanced-Typewriter-Monkeys/starter",
			"Python-Level-2/tree/main/PS13-Advanced-Typewriter-Monkeys/solution"
		);
		expectAuthoredSourcePair(
			pythonLevel3,
			"AM6 Project 3: Function Analysis",
			"Python-Level-3/tree/main/AM6-Function-Analysis/starter",
			"Python-Level-3/tree/main/AM6-Function-Analysis/solution"
		);
		expectAuthoredSourcePair(
			bridgeCourse,
			"Project: Starter Source Review",
			"Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
			"Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
		);
		expectAuthoredSourcePair(
			cppLevel2,
			"Pointer Basics, Aliasing, and Failure Modes",
			"CPP-Level-2/tree/main/CPPM1-Pointers-Starter",
			"CPP-Level-2/tree/main/CPPM1-Pointers"
		);
		expectAuthoredSourcePair(
			cppLevel2,
			"Raw Arrays: Verification Drill",
			"CPP-Level-2/tree/main/CPPM2-Array-Practice-Starter",
			"CPP-Level-2/tree/main/CPPM2-Array-Practice"
		);
		expectAuthoredSourcePair(
			aiLevel1,
			"Capstone Option: Maze Solver Showcase",
			"AI-Level-1/tree/main/FAI9-Maze-Solver-Starter",
			"AI-Level-1/tree/main/FAI9-Maze-Solver"
		);
		expectAuthoredSourcePair(
			javaLevel3,
			"AJ14 Project 3: BST Clear and Remove",
			"Java-Level-3/tree/main/AJ14-BST-Starter",
			"Java-Level-3/tree/main/AJ14-BST"
		);
		expectAuthoredSourcePair(
			javaLevel3,
			"AJ17 Project 3: Finding Shortest Paths",
			"Java-Level-3/tree/main/AJ17-Street-Searcher-Starter",
			"Java-Level-3/tree/main/AJ17-Street-Searcher"
		);
		expectAuthoredSourcePair(
			machineLearning,
			"ML7.5 Model Evaluation, Comparison, and Dataset Strategy: Core Project",
			"AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
			"AI-Level-2/tree/main/ML5-Simple-Linear-Regression"
		);
		expectAuthoredSourcePair(
			machineLearning,
			"Customer Segmentation Starter Build: Core Project",
			"AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter",
			"AI-Level-2/tree/main/ML1-Customer-Segmentation"
		);
		expectAuthoredSourcePair(
			machineLearning,
			"Disney Movie Clustering Starter Build: Core Project",
			"AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter",
			"AI-Level-2/tree/main/ML1-Disney-Movie-Clustering"
		);
	});

	it("links the Python Level 3 bubble sort project to starter and solution folders", async () => {
		const serializedCourse = JSON.stringify(
			await requireCourse("python-level-3")
		);

		expect(serializedCourse).toContain(
			"Python-Level-3/tree/main/AM9-Bubble-Sort/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-3/tree/main/AM9-Bubble-Sort/solution"
		);
		expect(serializedCourse).not.toContain(
			"Python-Level-3/tree/main/AM9-Bubble-Sort\""
		);
	});

	it("keeps Python Level 3 source links pointed at starter or solution folders", async () => {
		const serializedCourse = JSON.stringify(
			await requireCourse("python-level-3")
		);
		const rootOnlyLinks = [
			...serializedCourse.matchAll(
				/https:\/\/github\.com\/instruction-material\/Python-Level-3\/tree\/main\/([^"]+)/g
			)
		]
			.map(match => match[1].replace(/\\+$/, ""))
			.filter(
				urlPath =>
					!urlPath.endsWith("/starter") &&
					!urlPath.endsWith("/solution")
			);

		expect(rootOnlyLinks).toHaveLength(0);
		expect(serializedCourse).toContain(
			"Python-Level-3/tree/main/AM1-Mad-Libs/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-3/tree/main/AM10-Merge-Sort/solution"
		);
		expect(serializedCourse).toContain(
			"Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-with-Forks/solution"
		);
	});

	it("keeps Python Level 2 split source links pointed at starter or solution folders", async () => {
		const serializedCourse = JSON.stringify(
			await requireCourse("python-level-2")
		);
		const rootOnlyLinks = [
			...serializedCourse.matchAll(
				/https:\/\/github\.com\/instruction-material\/Python-Level-2\/tree\/main\/([^"]+)/g
			)
		]
			.map(match => match[1].replace(/\\+$/, ""))
			.filter(urlPath => {
				const folder = urlPath.replace(/\/(?:starter|solution)$/, "");

				return (
					pythonLevel2SplitSourceFolders.has(folder) &&
					!urlPath.endsWith("/starter") &&
					!urlPath.endsWith("/solution")
				);
			});

		expect(rootOnlyLinks).toHaveLength(0);
		expect(serializedCourse).toContain(
			"Python-Level-2/tree/main/PS1-Mad-Libs/solution"
		);
		expect(serializedCourse).toContain(
			"Python-Level-2/tree/main/PS5-Parameter-Tracing/starter"
		);
		expect(serializedCourse).toContain(
			"Python-Level-2/tree/main/PS14-Mastermind/solution"
		);
	});

	it("keeps AP CSA learner source links on starter folders with staff solution links", async () => {
		const course = await requireCourse("ap-computer-science-a");
		const serializedCourse = JSON.stringify(course);
		const projectSolutionLinks = courseItems(course)
			.filter(item =>
				item.projectLink?.startsWith(
					"https://github.com/instruction-material/APCS/tree/main/"
				)
			)
			.filter(item => item.projectLink?.endsWith("/solution"))
			.map(item => item.title);
		const missingSolutionPairs = courseItems(course)
			.filter(item =>
				item.projectLink?.startsWith(
					"https://github.com/instruction-material/APCS/tree/main/"
				)
			)
			.filter(item => item.projectLink?.endsWith("/starter"))
			.filter(
				item =>
					item.solutionLink !==
					item.projectLink?.replace(/\/starter$/, "/solution")
			)
			.map(item => item.title);

		expect(projectSolutionLinks).toHaveLength(0);
		expect(missingSolutionPairs).toHaveLength(0);
		expect(serializedCourse).toContain(
			"APCS/tree/main/APCS1-Mad-Libs/starter"
		);
		expect(serializedCourse).toContain(
			"APCS/tree/main/APCS1-Mad-Libs/solution"
		);
		expect(serializedCourse).toContain(
			"APCS/tree/main/APCS17-Decode/starter"
		);
		expect(serializedCourse).toContain(
			"APCS/tree/main/APCS17-Decode/solution"
		);
	});

	it("keeps cross-course split-folder source references out of ambiguous roots", async () => {
		const javaLevel1 = JSON.stringify(await requireCourse("java-level-1"));
		const javaLevel3 = JSON.stringify(await requireCourse("java-level-3"));
		const scratchLevel1 = JSON.stringify(
			await requireCourse("scratch-level-1")
		);
		const scratchLevel2 = JSON.stringify(
			await requireCourse("scratch-level-2")
		);

		expect(javaLevel1).toContain(
			"APCS/tree/main/APCS-Check-in-1/starter"
		);
		expect(javaLevel1).toContain(
			"APCS/tree/main/APCS-Check-in-1/solution"
		);
		expect(javaLevel1).not.toContain(
			"APCS/tree/main/APCS-Check-in-1\""
		);
		expect(javaLevel3).toContain(
			"Java-Level-3/tree/main/AJ20-Generic-Repository/starter"
		);
		expect(javaLevel3).toContain(
			"Java-Level-3/tree/main/AJ20-Generic-Repository/solution"
		);
		expect(javaLevel3).not.toContain(
			"Java-Level-3/tree/main/AJ20-Generic-Repository\""
		);
		for (const serializedCourse of [scratchLevel1, scratchLevel2]) {
			expect(serializedCourse).toContain(
				"Python-Level-2/tree/main/PS12-Type-Racer/starter"
			);
			expect(serializedCourse).not.toContain(
				"Python-Level-2/tree/main/PS12-Type-Racer\""
			);
		}
	});

	it("keeps USACO source links pointed at starter and solution folders", async () => {
		for (const [courseId, repo, sampleFolder] of [
			["usaco-bronze", "USACO-Bronze", "UB1-Square-Pasture"],
			["usaco-silver", "USACO-Silver", "US25-Why-Did-the-Cow-Cross-the-Road-II"],
			["usaco-gold", "USACO-Gold", "UG1-Dynamic-Programming-with-Fibonacci"]
		] as const) {
			const course = await requireCourse(courseId);
			const serializedCourse = JSON.stringify(course);
			const rootOnlyLinks = [
				...serializedCourse.matchAll(
					new RegExp(
						`https://github\\.com/instruction-material/${repo}/tree/main/([^"]+)`,
						"g"
					)
				)
			]
				.map(match => match[1].replace(/\\+$/, ""))
				.filter(
					urlPath =>
						!urlPath.endsWith("/starter") &&
						!urlPath.endsWith("/solution")
				);
			const missingSolutionPairs = courseItems(course)
				.filter(item =>
					item.projectLink?.startsWith(
						`https://github.com/instruction-material/${repo}/tree/main/`
					)
				)
				.filter(item => item.projectLink?.endsWith("/starter"))
				.filter(
					item =>
						item.solutionLink !==
						item.projectLink?.replace(/\/starter$/, "/solution")
				)
				.map(item => item.title);

			expect(rootOnlyLinks, courseId).toHaveLength(0);
			expect(missingSolutionPairs, courseId).toHaveLength(0);
			expect(serializedCourse).toContain(
				`${repo}/tree/main/${sampleFolder}/starter`
			);
			expect(serializedCourse).toContain(
				`${repo}/tree/main/${sampleFolder}/solution`
			);
		}
	});

	it("records source policy decisions for content-only or composed courses", async () => {
		for (const courseId of Object.keys(courseContentOnlySourcePolicies)) {
			if (authoredLearnerCourseIds.has(courseId)) continue;

			const course = await requireCourse(courseId);
			const text = allText(course);

			expect(course.developmentMetadata?.sourcePolicy, courseId).toBe(
				courseContentOnlySourcePolicies[courseId]
			);
			expect(text, courseId).not.toContain(
				"Source and Asset Parity Implementation"
			);
			expect(text, courseId).not.toContain(
				"Canonical Source or Asset Policy"
			);
		}
	});

	it("adds toolchain/version assumption modules where the reports required them", async () => {
		for (const courseId of Object.keys(courseToolchainAssumptions)) {
			const text = allText(await requireCourse(courseId));

			expect(text, courseId).toContain(
				"Toolchain and Version Assumptions"
			);
			expect(text, courseId).toContain("Setup Assumptions");
		}
	});

	it(
		"attaches standards, source, assessment, toolchain, safety, and capstone metadata to every course",
		async () => {
			for (const { id } of courseCatalog) {
				const course = await requireCourse(id);
				const metadata = course.developmentMetadata;

				expect(metadata, id).toBeDefined();
				expect(metadata?.standards.length, id).toBeGreaterThan(0);
				expect(metadata?.sourcePolicy, id).toBeTruthy();
				expect(
					metadata?.assessmentCadence.length,
					id
				).toBeGreaterThanOrEqual(4);
				expect(metadata?.toolchain.length, id).toBeGreaterThanOrEqual(
					2
				);
				expect(
					metadata?.safetyPolicy.length,
					id
				).toBeGreaterThanOrEqual(2);
				expect(
					metadata?.courseBoundaries.length,
					id
				).toBeGreaterThanOrEqual(2);
				expect(
					metadata?.capstoneExpectations.length,
					id
				).toBeGreaterThanOrEqual(2);
				expect(
					metadata?.recommendedNextWork.length,
					id
				).toBeGreaterThanOrEqual(3);
				expect(allText(course), id).not.toContain(
					"Standards, Source, Assessment, and Safety Backbone"
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("implements current AP CSA four-unit and digital FRQ alignment", async () => {
		const course = await requireCourse("ap-computer-science-a");
		const text = allText(course);

		expect(text).toContain("Unit 1 Using Objects and Methods");
		expect(text).toContain("Unit 2 Selection and Iteration");
		expect(text).toContain("Unit 3 Class Creation");
		expect(text).toContain("Unit 4 Data Collections");
		expect(text).toContain("FRQ Family 3 Data Analysis with ArrayList");
		expect(text).toContain("typed responses without compiler feedback");
		expect(course.developmentMetadata?.standards).toContain(
			"College Board AP Computer Science A CED, Fall 2025 / May 2026 framework."
		);
	});

	it("adds course-specific architecture for algebra, advanced Python, C++, Java, data/AI/ML, science, systems, and Unity", async () => {
		for (const courseId of [
			"algebra-1a",
			"algebra-1b",
			"algebra-2a",
			"algebra-2b"
		]) {
			const text = allText(await requireCourse(courseId));

			expect(text, courseId).toContain(
				"Standards-Mapped Algebra Architecture"
			);
			expect(text, courseId).toContain("Course Item Labels");
			expect(text, courseId).toContain(
				"Required Anchor and Extension Projects"
			);
		}

		expect(allText(await requireCourse("python-level-3"))).toContain(
			"Advanced Python Algorithm and Engineering Studio"
		);
		expect(allText(await requireCourse("python-level-3"))).toContain(
			"Local Document Search Engine"
		);

		for (const courseId of ["c-level-1", "cpp-level-2", "cpp-level-3"]) {
			const text = allText(await requireCourse(courseId));

			expect(text, courseId).toContain("Modern Three-Course C++ Spine");
			expect(text, courseId).toContain("Manual Memory Safety Rule");
		}

		for (const courseId of [
			"java-level-1",
			"java-level-2",
			"java-level-3",
			"java-without-graphics",
			"java-with-graphics"
		]) {
			expect(allText(await requireCourse(courseId)), courseId).toContain(
				"Bridge"
			);
		}

		for (const courseId of [
			"data-science-in-python",
			"ai-level-1",
			"machine-learning"
		]) {
			expect(allText(await requireCourse(courseId)), courseId).toContain(
				"Data Science, AI Foundations, and Machine Learning Boundary Map"
			);
		}

		expect(allText(await requireCourse("elementary-science"))).toContain(
			"K-2 and 3-5 Zoom-Safe Science Scope Map"
		);
		expect(
			allText(await requireCourse("middle-school-integrated-science"))
		).toContain("Middle School Integrated Science 6-8 Scope Map");

		for (const courseId of [
			"linux-systems",
			"network-systems",
			"network-security",
			"c-systems-engineering",
			"assembly",
			"low-level-security",
			"low-level-security-part-2",
			"rust-systems-security"
		]) {
			expect(allText(await requireCourse(courseId)), courseId).toContain(
				"Defensive Lab Contract"
			);
		}

		const unityText = allText(
			await requireCourse("unity-game-development")
		);

		expect(unityText).toContain(
			"UGD7 Testing, Profiling, Builds, CI, and Asset Pipeline"
		);
		expect(unityText).toContain(
			"UGD8 Full-Project Starter and Review Repository Plan"
		);
		expect(unityText).toContain("current full-project baseline");
	}, 30000);

	it(
		"backfills reference solution links for source-backed project links",
		async () => {
			for (const courseId of Object.keys(
				courseImplementationSourceRepos
			)) {
				const course = await requireCourse(courseId);
				const missingSolutionItems = course.modules.flatMap(module =>
					[
						...module.curriculum,
						...module.supplementalProjects
					].filter(
						item =>
							item.projectLink?.includes(
								"github.com/instruction-material/"
							) && !item.solutionLink
					)
				);

				expect(missingSolutionItems, courseId).toHaveLength(0);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);
});
