import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "../src/stores/courses";
import { courseCatalog } from "../src/stores/courses/index";
import {
	scratchFrameDocument,
	scratchDownloadName
} from "../src/modules/scratch/frame";
import { scratchLevel1ClassroomCourse } from "../src/stores/courses/scratch-level-1-classroom";
import { myCsDressUpGuide } from "../src/stores/courses/scratch-mycs-dress-up";

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
			module.curriculum.filter(
				item =>
					item.projectLink &&
					item.id !== "scratch-classroom-independent-game"
			)
		);
		expect(projects).toHaveLength(12);
		expect(projects.map(project => project.id)).toEqual([
			"animate-word",
			"two-arrows",
			"third-direction",
			"click-reactions",
			"dress-up",
			"scene-switch",
			"conversation",
			"dance-loop",
			"patrol",
			"maze-reset",
			"click-score",
			"collect-game"
		]);
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
			expect(project.projectLink).toBe(
				`/ide?mode=scratch&starter=${project.id}`
			);
			expect(project.solutionLink).toBeUndefined();
		}
	});
	it("shows the scoped, attributed MyCS lab only with the original Dress-Up starter", async () => {
		setActivePinia(createPinia());
		const course =
			await useCoursesStore().loadCourseById("scratch-level-1");
		const items =
			course?.modules.flatMap(module => module.curriculum) ?? [];
		const dressUp = items.find(item => item.id === "dress-up");

		expect(dressUp?.title).toBe("Robot Dress-Up");
		expect(dressUp?.content).toContain(myCsDressUpGuide);
		expect(dressUp?.projectLink).toBe("/ide?mode=scratch&starter=dress-up");
		expect(dressUp?.content).toContain("/scratch-projects/dress-up.sb3");
		for (const expected of [
			"**Adapted Dress-Up lab**",
			"Click Hat",
			"when this sprite clicked",
			"when green flag clicked",
			"Record Badge's starting x/y",
			"Drag Badge into place and record its destination x/y",
			"Use the start in its green-flag reset and the destination in its click-to-glide script",
			"For Hard, complete Boots yourself",
			"show your completed accessories reaching their chosen positions",
			"moves immediately",
			"takes time",
			"layering changes overlap, not coordinates",
			"Run, change, and reset twice",
			"Explain each event"
		]) {
			expect(dressUp?.content).toContain(expected);
		}
		expect(
			items.filter(item => item.content.includes(myCsDressUpGuide))
		).toHaveLength(1);
		expect(dressUp?.solutionLink).toBeUndefined();
		expect(dressUp?.playableSolutionEmbedUrl).toBeUndefined();
		expect(dressUp?.datasetLink).toBeUndefined();
		expect(dressUp?.mediaLink).toBeUndefined();
	});
	it("bounds the adapted guide and keeps exact source credit and license scope", () => {
		const visibleText = myCsDressUpGuide
			.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
			.replace(/[*`]/g, "");
		expect(visibleText.trim().split(/\s+/).length).toBeLessThanOrEqual(190);
		expect(myCsDressUpGuide).toContain(
			"SFUSD CS team's MyCS 1.4: Dress Up"
		);
		expect(myCsDressUpGuide).toContain("Harvey Mudd's MyCS");
		expect(myCsDressUpGuide).toContain(
			"Shortened and rewritten for our existing original Robot starter"
		);
		expect(myCsDressUpGuide).toContain("no endorsement implied");
		expect(myCsDressUpGuide).toContain("Only this marked teaching guide");
		expect(myCsDressUpGuide).toContain(
			"not the whole course, software, or original starter assets"
		);
		expect(
			[...myCsDressUpGuide.matchAll(/\]\((https:[^)]+)\)/g)].map(
				match => match[1]
			)
		).toEqual([
			"https://sites.google.com/a/sfusd.edu/mycs-teacher/unit1/1-4",
			"https://creativecommons.org/licenses/by-nc-sa/4.0/"
		]);
		expect(myCsDressUpGuide).not.toMatch(
			/<\s*(iframe|img|video|audio|script)|!\[/i
		);
		expect(myCsDressUpGuide).not.toMatch(
			/scratch\.mit\.edu\/projects|\.(sb3|gif|mp4|webm)\b/i
		);
	});
	it("launches independent work without starter scripts or a solution", () => {
		const independent = scratchLevel1ClassroomCourse.modules
			.flatMap(module => module.curriculum)
			.find(item => item.id === "scratch-classroom-independent-game");
		expect(independent?.projectLink).toBe(
			"/ide?mode=scratch&starter=blank"
		);
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
