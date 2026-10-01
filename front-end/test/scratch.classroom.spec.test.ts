import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "../src/stores/courses";
import { courseCatalog } from "../src/stores/courses/index";
import {
	scratchFrameDocument,
	scratchDownloadName
} from "../src/modules/scratch/frame";
import { scratchLevel1ClassroomCourse } from "../src/stores/courses/scratch-level-1-classroom";

describe("Scratch classroom", () => {
	it("shows the full Normal and Hard instructions in the learner view", async () => {
		setActivePinia(createPinia());
		const entry = courseCatalog.find(
			course => course.name === "Scratch Level 1: Classroom Edition"
		);
		expect(entry).toBeDefined();
		const course = await useCoursesStore().loadCourseById(entry!.id);
		const first = course?.modules[0].curriculum.find(
			item => item.title === "Two Arrows"
		);
		expect(first?.content).toContain("**Normal:**");
		expect(first?.content).toContain("**Hard:**");
		expect(first?.content).toContain("**Check:**");
	});
	it("keeps a small, ordered core sequence and separate practice", () => {
		const projects = scratchLevel1ClassroomCourse.modules.flatMap(module =>
			module.curriculum.filter(item => item.projectLink && item.id !== "scratch-classroom-independent-game")
		);
		expect(projects).toHaveLength(12);
		expect(projects[0].title).toBe("Animate Your Name");
		expect(projects.at(-1)?.title).toBe("Build Your Collection Game");
		for (const project of projects) {
			expect(project.learningPath).toBe("core");
			expect(project.content).toContain("**Normal:**");
			expect(project.content).toContain("**Hard:**");
			expect(project.content).toContain("**Check:**");
			expect(project.projectLink).toMatch(
				/^\/ide\?mode=scratch&starter=[a-z-]+$/
			);
		}
	});
	it("launches independent work without starter scripts or a solution", () => {
		const independent = scratchLevel1ClassroomCourse.modules.flatMap(module => module.curriculum)
			.find(item => item.id === "scratch-classroom-independent-game");
		expect(independent?.projectLink).toBe("/ide?mode=scratch&starter=blank");
		expect(independent?.content).toContain("/scratch-projects/blank.sb3");
		expect(independent?.solutionLink).toBeUndefined();
	});
	it("limits frame resources to the editor and public Scratch assets", () => {
		const frame = scratchFrameDocument("https://example.test", "channel");
		expect(frame).toContain(
			"connect-src https://example.test/scratch-runtime/ https://assets.scratch.mit.edu;"
		);
		expect(frame).toContain("worker-src 'none'");
		expect(frame).toContain("form-action 'none'");
		expect(frame).not.toContain("/api/");
		expect(frame).toContain('data-channel="channel"');
	});
	it("creates reusable safe project filenames", () => {
		expect(scratchDownloadName("Robot dress-up")).toBe(
			"Robot dress-up.sb3"
		);
		expect(scratchDownloadName("a/b\\c\n")).toBe("a-b-c-.sb3");
		expect(scratchDownloadName("")).toBe("Scratch project.sb3");
	});
});
