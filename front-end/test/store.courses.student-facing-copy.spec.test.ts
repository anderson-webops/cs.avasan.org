import { describe, expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";

const forbiddenStudentFacingPatterns = [
	/\bTeaching flow\b/i,
	/\binstructor-led\b/i,
	/\bInstructor Note\b/i,
	/\bfor instructor(?:s)?\b/i,
	/\bAsk the student\b/i,
	/\bAsk students\b/i,
	/\bHave the student\b/i,
	/\bHave students\b/i,
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
	/\bthe student can\b/i,
	/\bthe student should\b/i,
	/\bthe student tests\b/i,
	/\btutor-ready\b/i,
	/\btutor-visible\b/i,
	/\btutor notes\b/i,
	/\bthe tutor should\b/i,
	/\bThe tutor should\b/i,
	/\bCover:\b/i,
	/\bThe expected result should\b/i,
	/\bthe expected result should\b/i,
	/\bWatch for\b/i,
	/\bwatch for\b/i,
	/\bStart with vocabulary\b/i,
	/\bwithout copying\b/i
];

function snippet(value: string, pattern: RegExp) {
	const match = value.match(pattern);

	if (!match || match.index === undefined) {
		return value.slice(0, 180).replace(/\s+/g, " ");
	}

	const start = Math.max(0, match.index - 70);
	return value.slice(start, start + 180).replace(/\s+/g, " ");
}

describe("student-facing course copy", () => {
	it("keeps visible catalog lessons neutral instead of instructor-facing", async () => {
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
	}, 30000);
});
