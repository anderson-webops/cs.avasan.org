import { describe, expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";

const COURSE_SWEEP_TIMEOUT = 180000;

async function publishedCourse(id: string) {
	const course = await loadRawCourse(id);
	expect(course, id).not.toBeNull();
	return course!;
}

function courseItems(course: Awaited<ReturnType<typeof publishedCourse>>) {
	return course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

describe("published course implementation artifacts", () => {
	it(
		"keeps usable project resources in every published course",
		async () => {
			for (const { id } of courseCatalog) {
				const links = courseItems(await publishedCourse(id)).flatMap(
					item =>
						[
							item.projectLink,
							item.solutionLink,
							item.datasetLink,
							item.mediaLink
						].filter((link): link is string => Boolean(link))
				);

				expect(links.length, id).toBeGreaterThan(0);
				expect(
					links.every(
						link =>
							link.startsWith("https://") ||
							link.startsWith("/course-assets/") ||
							link.startsWith("/static/")
					),
					id
				).toBe(true);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it.each(["python-level-1", "python-level-2", "pygames"])(
		"keeps %s starter folders and teacher solution resources",
		async id => {
			const items = courseItems(await publishedCourse(id));
			const starters = items.filter(item =>
				item.projectLink?.endsWith("/starter")
			);
			const solutions = items.filter(item =>
				item.solutionLink?.includes("/solution")
			);

			expect(starters.length, id).toBeGreaterThan(0);
			expect(solutions.length, id).toBeGreaterThan(0);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it.each(["scratch-level-1", "scratch-level-2"])(
		"keeps %s linked to playable Scratch projects",
		async id => {
			const links = courseItems(await publishedCourse(id))
				.flatMap(item => [item.projectLink, item.solutionLink])
				.filter((link): link is string => Boolean(link));

			expect(
				links.some(link =>
					link.startsWith("https://scratch.mit.edu/projects/")
				),
				id
			).toBe(true);
		},
		COURSE_SWEEP_TIMEOUT
	);
});
