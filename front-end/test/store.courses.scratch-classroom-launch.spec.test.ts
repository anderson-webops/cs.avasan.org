import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";

describe("Scratch Level 1 classroom launch", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("starts with a working play-first activity and leveled success paths", () => {
		const launch = scratchLevel1Course.modules[0];

		expect(launch?.title).toBe("GS0 Play, Notice, and Change");
		expect(launch?.estimatedTime).toBe("30–40 minutes");
		expect(launch?.keyBlocks).toEqual(expect.arrayContaining([
			"when green flag clicked",
			"play sound",
			"forever"
		]));

		const playFirst = launch?.curriculum.find(
			item => item.title === "Play first – Bouncy Ball Room"
		);
		expect(playFirst).toMatchObject({
			learningPath: "core",
			solutionLink: "https://scratch.mit.edu/projects/287922077/"
		});
		expect(playFirst?.projectLink).toBeUndefined();
		expect(playFirst?.content).toContain("**First 10 minutes:**");
		expect(playFirst?.content).toContain(
			"Press Space to move and bounce the ball."
		);

		expect(
			launch?.curriculum.find(item => item.title === "Make one small change")
		).toMatchObject({
			learningPath: "core",
			projectLink: "https://scratch.mit.edu/projects/304003593/",
			content: expect.stringContaining(
				"One working change completes this activity"
			)
		});
		expect(
			launch?.supplementalProjects.map(item => item.learningPath)
		).toEqual(["choice", "challenge"]);
		expect(JSON.stringify(launch)).toContain(
			"right-click an empty white area of the Code workspace"
		);
		expect(JSON.stringify(launch)).toContain("choose **Add Comment**");
		expect(JSON.stringify(launch)).toContain(
			"drag the comment onto a block to attach it"
		);
	});

	it("keeps the anonymous launch concise while exposing only the lazy player", async () => {
		const course = await useCoursesStore().loadCourseById("scratch-level-1");
		const launch = course?.modules.find(
			module => module.title === "GS0 Play, Notice, and Change"
		);
		const playFirst = launch?.curriculum.find(
			item => item.title === "Play first – Bouncy Ball Room"
		);
		const makeOneChange = launch?.curriculum.find(
			item => item.title === "Make one small change"
		);
		const visibleLaunchText = [
			...(launch?.curriculum ?? []),
			...(launch?.supplementalProjects ?? [])
		]
			.map(item => item.content)
			.join("\n");

		expect(playFirst).toMatchObject({
			playableSolutionEmbedUrl:
				"https://scratch.mit.edu/projects/287922077/embed"
		});
		expect(playFirst?.solutionLink).toBeUndefined();
		expect(playFirst?.projectLink).toBeUndefined();
		expect(makeOneChange).toMatchObject({
			projectLink: "https://scratch.mit.edu/projects/304003593/"
		});
		expect(makeOneChange?.solutionLink).toBeUndefined();
		expect(makeOneChange?.playableSolutionEmbedUrl).toBeUndefined();
		expect(visibleLaunchText).not.toContain("Scratch game design:");
		expect(visibleLaunchText).not.toContain("**Focus:**");
		expect(visibleLaunchText).not.toContain("**Failure modes:**");
	});

	it("provides the transcript-guided coordinate catcher progression", () => {
		const coordinates = scratchLevel1Course.modules.find(
			module => module.title === "GS8 X & Y Coordinates"
		);
		const catcher = coordinates?.curriculum.find(
			item => item.title === "Guided warm-up – Coordinate Catcher"
		);

		expect(catcher?.learningPath).toBe("core");
		for (const expected of [
			"Press X or Y to move.",
			"set x to answer",
			"set y to answer",
			"touching frog?",
			"if",
			"forever",
			"set x to 5",
			"change x by 5",
			"light-blue Sensing blocks",
			"purple Looks block",
			"orange Control blocks",
			"Select the collectible before adding or choosing its catch sound."
		]) {
			expect(catcher?.content).toContain(expected);
		}
		expect(catcher?.projectLink).toBeUndefined();
		expect(catcher?.solutionLink).toBeUndefined();

		const bugEater = coordinates?.curriculum.find(
			item => item.title === "Project 1 – Bug Eater"
		);
		for (const expected of [
			"What X should I go to?",
			"set x to answer",
			"What Y should I go to?",
			"set y to answer",
			"Select the collectible, open its Sounds tab",
			"if touching Frog?",
			"random position",
			"play the sound selected for that sprite"
		]) {
			expect(bugEater?.content).toContain(expected);
		}
		expect(bugEater?.content).not.toMatch(
			/click-to-move|praying mantis|broadcast|score|timer/iu
		);
	});

	it("does not import the Math-only Scratch graphing project", () => {
		expect(JSON.stringify(scratchLevel1Course)).not.toContain("1367463968");
		expect(JSON.stringify(scratchLevel1Course.modules[0])).not.toContain(
			"287924505"
		);
	});
});
