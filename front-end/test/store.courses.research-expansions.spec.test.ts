import { describe, expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";
import { researchBackedExpansionProfiles } from "@/stores/courses/research-expansions";

const COURSE_SWEEP_TIMEOUT = 180000;
const listFields = [
	"gaps",
	"topics",
	"moduleAdditions",
	"projectTypes",
	"assessments",
	"materials"
] as const;

describe("published course research expansions", () => {
	it("keeps expansion metadata deduplicated for the five published courses", () => {
		const failures: string[] = [];

		for (const { id } of courseCatalog) {
			const profile = researchBackedExpansionProfiles[id];
			if (!profile) {
				failures.push(`${id}: missing profile`);
				continue;
			}

			for (const field of listFields) {
				const values = profile[field].map(value =>
					value.trim().toLowerCase()
				);
				if (new Set(values).size !== values.length) {
					failures.push(`${id}: duplicate ${field}`);
				}
			}
		}

		expect(failures).toEqual([]);
	});

	it(
		"retains standards, roadmap, and project-practice references",
		async () => {
			for (const { id } of courseCatalog) {
				const course = await loadRawCourse(id);
				const titles = course?.modules.map(module => module.title) ?? [];

				expect(course, id).not.toBeNull();
				expect(titles, id).toEqual(
					expect.arrayContaining([
						"Standards Map",
						"Course Roadmap",
						"Project Practice Guide"
					])
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);
});
