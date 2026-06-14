import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";

const testDir = dirname(fileURLToPath(import.meta.url));
const frontEndDir = resolve(testDir, "..");
const repoRoot = resolve(frontEndDir, "..");
const coursesSourceDir = resolve(frontEndDir, "src/stores/courses");
const COURSE_SWEEP_TIMEOUT = 180000;

const forbiddenStudentFacingPatterns = [
	/\bTeaching flow\b/i,
	/\binstructor-led\b/i,
	/\bInstructor Note\b/i,
	/\bfor instructor(?:s)?\b/i,
	/\bAsk the student\b/i,
	/\bAsk students\b/i,
	/\bAsk them\b/i,
	/\bHave the student\b/i,
	/\bHave students\b/i,
	/\bhave students\b/i,
	/\bhave them\b/i,
	/\bLet the student\b/i,
	/\blet the student\b/i,
	/\binstructor-provided\b/i,
	/\binstructor-approved\b/i,
	/\binstructor-authored\b/i,
	/\binstructor references\b/i,
	/\bteacher-provided\b/i,
	/\bteacher requirement\b/i,
	/\bstudent-facing\b/i,
	/\bstudents should\b/i,
	/\bstudents? will\b/i,
	/\bstudents? can (?:inspect|see|trace|identify|distinguish|explain|compare|build|create|use|practice|complete)\b/i,
	/\bstudents? must\b/i,
	/\bstudents? need to\b/i,
	/\bthe student can\b/i,
	/\bthe student should\b/i,
	/\bthe student tests\b/i,
	/\bThey should\b/,
	/\bStudents often\b/i,
	/\bstudents often\b/i,
	/\bLearners often\b/i,
	/\blearners often\b/i,
	/\blearners? will\b/i,
	/\blearners? can (?:inspect|see|trace|identify|distinguish|explain|compare|build|create|use|practice|complete)\b/i,
	/\blearners? must\b/i,
	/\blearners? need to\b/i,
	/\btutor-ready\b/i,
	/\btutor-visible\b/i,
	/\btutor notes\b/i,
	/\btutor\b/i,
	/\bthe tutor should\b/i,
	/\bThe tutor should\b/i,
	/\binstructor\b/i,
	/\bteacher\b/i,
	/\bCover:\b/i,
	/\bSet expectations\b/i,
	/\bOptional observations may be assigned\b/i,
	/\bThe expected result should\b/i,
	/\bthe expected result should\b/i,
	/\bshould force (?:students?|learners?) to\b/i,
	/\bshould make [^.]{0,80}visible\b/i,
	/\bshould feel like\b/i,
	/\bCourse scope:\b/i,
	/\bGaps to close:\b/i,
	/\bTopic backlog:\b/i,
	/\bModule Backlog\b/i,
	/\bReady-to-Author\b/i,
	/\bPlanning Project\b/i,
	/\bplanned lesson\b/i,
	/\bfuture module\b/i,
	/\bthen ask\b/i,
	/\bIf the struggles\b/i,
	/\bDiscuss with the\b/i,
	/\bHave click on\b/i,
	/\bTalk about how\b/i,
	/\bPoint out that\b/i,
	/\bMake sure to explain that\b/i,
	/\bShow the an example\b/i,
	/\bintroduce the to the various\b/i,
	/\byou can use as guidance\b/i,
	/\bCreate a new Scratch project\. Using this project as (?:a )?rough guide, introduce\b/i,
	/\bWatch for\b/i,
	/\bwatch for\b/i,
	/\bStart with\b/i,
	/\bStart with vocabulary\b/i,
	/This lesson arc covers these sections in sequence/i,
	/(?:^|\n|\*\*[^*]+:\*\*\s)(?:Introduce|Teach|Cover|Set expectations)\b/,
	/\bwithout copying\b/i
];

const forbiddenRawGeneratedPatterns = [
	/Implementation Studio/i,
	/defines the target artifact, required behavior, and core concepts needed/i,
	/linked starter provides the implementation artifact/i,
	/Supplemental project connected to/i,
	/teacher-provided/i,
	/Recording Studio/i,
	/\bA student should\b/i,
	/\bThe student should\b/i,
	/\bstudents should\b/i,
	/Use the linked starter and solution/i,
	/Have students finish the missing implementation/i,
	/Close .* by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass\./i,
	/Anchor the lesson in one concrete example/i,
	/Have students test at least one custom case/i,
	/Introduce the main goal of Applied Studio/i,
	/Build the central artifact for Applied Studio/i,
	/Break the work into a small sequence/i,
	/Applied Studio \d+/i,
	/recovered source/i,
	/source dump/i,
	/original screenshots/i,
	/missing reference images/i,
	/Use the placeholder below/i,
	/answer-key notes/i,
	/qualitative prompts/i,
	/\bthey will have to program\b/i,
	/\bwhat we will need to code\b/i,
	/\bmistakes common mistakes\b/i,
	/\bBe able to\b/,
	/\bSilver Not\b/i,
	/\band should see warnings\b/i,
	/\bstudent-led\b/i,
	/\bShow the a picture\b/i,
	/\bshow the how\b/i,
	/\bdelete of all a list\b/i,
	/\bShow students\b/i,
	/\bEncourage students\b/i,
	/\bCheck whether students can\b/i,
	/\bAsk them\b/i,
	/\bTeach students to\b/i,
	/\bTeach each\b/i,
	/\bRequire students to\b/i,
	/\bMake students explain\b/i,
	/\bGive examples where students must\b/i,
	/\bTeach managing\b/i,
	/\bIf the struggles\b/i,
	/\bshow the the\b/i,
	/\bthe the understands\b/i,
	/\bInstructional note\b/i,
	/\bteacher-authored\b/i,
	/missing-image-placeholder\.svg/i,
	/\bplaceholder image below\b/i,
	/\bcourse placeholder asset\b/i
];

const rawCourseFiles = readdirSync(coursesSourceDir)
	.filter(file => file.endsWith(".ts"))
	.filter(
		file => !["index.ts", "normalization.ts", "types.ts"].includes(file)
	)
	.map(file => resolve(coursesSourceDir, file));

function snippet(value: string, pattern: RegExp) {
	const match = value.match(pattern);

	if (!match || match.index === undefined) {
		return value.slice(0, 180).replace(/\s+/g, " ");
	}

	const start = Math.max(0, match.index - 70);
	return value.slice(start, start + 180).replace(/\s+/g, " ");
}

describe("student-facing course copy", () => {
	it("keeps generated boilerplate and recovery notes out of raw course source", () => {
		const files = [
			...rawCourseFiles,
			resolve(
				repoRoot,
				"front-end/scripts/materialize-course-expansions.ts"
			)
		];
		const failures: string[] = [];

		for (const file of files) {
			const source = readFileSync(file, "utf8");

			for (const pattern of forbiddenRawGeneratedPatterns) {
				if (!pattern.test(source)) continue;

				failures.push(
					`${file.replace(`${repoRoot}/`, "")}: ${snippet(source, pattern)}`
				);
			}
		}

		expect(failures).toEqual([]);
	});

	it("keeps internal planning markdown out of the course source directory", () => {
		const planningFiles = readdirSync(coursesSourceDir).filter(
			file =>
				file.endsWith("-expansion-audit-plan.md") ||
				file.endsWith("-repo-alignment-plan.md") ||
				file.endsWith("rework-plan.md")
		);
		const privatePlanningDir = resolve(
			repoRoot,
			"no-include/course-planning"
		);

		expect(planningFiles).toEqual([]);
		expect(existsSync(privatePlanningDir)).toBe(true);
	});

	it(
		"keeps visible catalog lessons neutral instead of instructor-facing",
		async () => {
			const failures: string[] = [];

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);

				if (!course) {
					failures.push(`${entry.id}: failed to load`);
					continue;
				}

				for (const module of course.modules) {
					const fields = [
						{
							label: "module title",
							value: module.title
						},
						...module.curriculum.flatMap(item => [
							{
								label: `curriculum title: ${item.title}`,
								value: item.title
							},
							{
								label: `curriculum content: ${item.title}`,
								value: item.content
							}
						]),
						...module.supplementalProjects.flatMap(item => [
							{
								label: `supplemental title: ${item.title}`,
								value: item.title
							},
							{
								label: `supplemental content: ${item.title}`,
								value: item.content
							}
						])
					];

					for (const field of fields) {
						for (const pattern of forbiddenStudentFacingPatterns) {
							if (!pattern.test(field.value)) continue;

							failures.push(
								`${entry.id} / ${module.title} / ${field.label}: ${snippet(field.value, pattern)}`
							);
						}
					}
				}
			}

			expect(failures).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);
});
