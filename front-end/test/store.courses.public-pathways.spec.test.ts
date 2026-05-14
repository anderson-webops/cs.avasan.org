import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PathwaysPage from "@/pages/pathways.vue";
import { courseCatalog } from "@/stores/courses/index";
import {
	coursePublicPathwayByCourseId,
	coursePublicPathways
} from "@/stores/courses/public-pathways";

function pathwayText(pathwayId: string) {
	const pathway = coursePublicPathways.find(pathway => pathway.id === pathwayId);
	if (!pathway) throw new Error(`Missing public pathway ${pathwayId}`);
	return JSON.stringify(pathway);
}

describe("public course pathways", () => {
	it("covers every visible catalog course exactly once", () => {
		const catalogIds = courseCatalog.map(course => course.id).sort();
		const pathwayIds = coursePublicPathways
			.flatMap(pathway => pathway.courseIds)
			.sort();
		const duplicateIds = pathwayIds.filter(
			(courseId, index) => pathwayIds.indexOf(courseId) !== index
		);

		expect(duplicateIds).toEqual([]);
		expect(pathwayIds).toEqual(catalogIds);

		for (const courseId of catalogIds) {
			expect(coursePublicPathwayByCourseId.get(courseId), courseId).toBeDefined();
		}
	});

	it("keeps pathway entries substantive enough for public inspection", () => {
		for (const pathway of coursePublicPathways) {
			expect(pathway.title, pathway.id).toBeTruthy();
			expect(pathway.audience.length, pathway.id).toBeGreaterThan(80);
			expect(pathway.prerequisiteSummary.length, pathway.id).toBeGreaterThan(60);
			expect(pathway.outcomes.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.sequencingNotes.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.projectExpectations.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.assessmentStyle.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.sourceAndTooling.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.safetyAndAccess.length, pathway.id).toBeGreaterThanOrEqual(3);
			expect(pathway.expansionBacklog.length, pathway.id).toBeGreaterThanOrEqual(3);
		}
	});

	it("captures the high-priority research constraints that were easy to miss", () => {
		expect(coursePublicPathways.find(pathway => pathway.id === "scratch-early-cs")?.priority).toBe("urgent");
		expect(pathwayText("scratch-early-cs")).toMatch(/blocks-to-pseudocode|pseudocode/i);

		expect(pathwayText("web-javascript")).toMatch(/async|fetch/i);
		expect(pathwayText("web-javascript")).toMatch(/accessibility/i);
		expect(pathwayText("web-javascript")).toMatch(/HTTP|OWASP|deployment/i);

		expect(pathwayText("game-development")).toMatch(/Build Profiles/i);
		expect(pathwayText("game-development")).toMatch(/Input System/i);
		expect(pathwayText("game-development")).toMatch(/Git LFS|asset attribution|CI/i);

		expect(pathwayText("security")).toMatch(/Prohibited/i);
		expect(pathwayText("security")).toMatch(/local fixtures|owned targets|provided captures/i);
		expect(pathwayText("security")).toMatch(/evidence, impact, and mitigation/i);

		expect(pathwayText("ap-csa")).toMatch(/College Board/i);
		expect(pathwayText("ap-csa")).toMatch(/Bluebook|digital AP/i);
		expect(pathwayText("ap-csa")).toMatch(/FRQ|MCQ/i);

		expect(pathwayText("usaco")).toMatch(/P1, one P2, and one P3/i);
		expect(pathwayText("usaco")).toMatch(/USACO Official|USACO Guide/i);
		expect(pathwayText("usaco")).toMatch(/postmortem/i);

		expect(pathwayText("data-ai-ml")).toMatch(/Iris|Palmer Penguins/i);
		expect(pathwayText("data-ai-ml")).toMatch(/train\/test|confusion matrix/i);
		expect(pathwayText("data-ai-ml")).toMatch(/model card/i);

		expect(pathwayText("science")).toMatch(/No required beakers/i);
		expect(pathwayText("science")).toMatch(/claim-evidence-reasoning|CER/i);
	});

	it("renders the public pathway page with priorities, coverage, and key course families", () => {
		const wrapper = mount(PathwaysPage);

		expect(wrapper.text()).toContain("A public map of what each course family is meant to become.");
		expect(wrapper.text()).toContain("Scratch and Early Computer Science");
		expect(wrapper.text()).toContain("JavaScript and Web Development");
		expect(wrapper.text()).toContain("AP Computer Science A");
		expect(wrapper.text()).toContain("Network, Low-Level, and Systems Security");
		expect(wrapper.text()).toContain("Courses covered");
	});
});
