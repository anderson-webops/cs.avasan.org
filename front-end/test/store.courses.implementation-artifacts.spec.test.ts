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

async function requireCourse(courseId: string) {
	const course = await loadRawCourse(courseId);
	expect(course, courseId).not.toBeNull();
	return course!;
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
		"ensures every visible module has at least two supplemental project/checkpoint options",
		async () => {
			for (const { id } of courseCatalog) {
				const course = await requireCourse(id);
				const underfilled = course.modules.filter(
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
				course.modules.every(
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

				expect(text, courseId).toContain(
					"Science Resource Shortlist and Remote Lab Bank"
				);
				expect(text, courseId).toContain("PhET");
				expect(text, courseId).toContain(
					"The activity does not require household materials"
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
			for (const courseId of Object.keys(courseImplementationSourceRepos)) {
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
