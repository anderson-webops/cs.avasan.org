import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import PathwaysPage from "@/pages/pathways.vue";
import { useAppStore } from "@/stores/app";
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
	beforeEach(() => {
		setActivePinia(createPinia());
	});

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
			expect(pathway.adminExpansionBacklog.length, pathway.id).toBeGreaterThanOrEqual(3);
		}
	});

	it("uses declarative public pathway wording instead of advisory scaffolding", () => {
		const corpus = JSON.stringify(coursePublicPathways);

		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).not.toMatch(/\bStudents entering\b/i);
	});

	it("captures the high-priority research constraints that were easy to miss", () => {
		expect(coursePublicPathways.find(pathway => pathway.id === "scratch-early-cs")?.adminPriority).toBe("urgent");
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
		expect(pathwayText("data-ai-ml")).toMatch(/NYC 311|NOAA Climate Data Online|OpenML/i);
		expect(pathwayText("data-ai-ml")).toMatch(/train\/test|confusion matrix/i);
		expect(pathwayText("data-ai-ml")).toMatch(/model card/i);

		expect(pathwayText("science")).toMatch(/No required beakers/i);
		expect(pathwayText("science")).toMatch(/NASA|NOAA|USGS|HHMI/i);
		expect(pathwayText("science")).toMatch(/claim-evidence-reasoning|CER/i);

		expect(pathwayText("systems-infrastructure")).toMatch(/safety matrix/i);
		expect(pathwayText("ap-csa")).toMatch(/42 MCQ \/ 4 FRQ/i);
		expect(pathwayText("usaco")).toMatch(/brute-force idea|target complexity/i);
	});

	it("renders the public pathway page with admin priorities, coverage, and key course families", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "admin-1",
			name: "Admin",
			email: "admin@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mount(PathwaysPage, {
			global: {
				plugins: [pinia]
			}
		});

		expect(wrapper.text()).toContain("Course Pathways");
		expect(wrapper.text()).toContain("Scratch and Early Computer Science");
		expect(wrapper.text()).toContain("JavaScript and Web Development");
		expect(wrapper.text()).toContain("AP Computer Science A");
		expect(wrapper.text()).toContain("Network, Low-Level, and Systems Security");
		expect(wrapper.text()).toContain("Courses covered");
		expect(wrapper.text()).toContain("Build next");
		expect(wrapper.text()).toContain("Expansion Backlog");
	});

	it("shows redacted public pathways to non-admin visitors", () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const wrapper = mount(PathwaysPage, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		expect(wrapper.text()).toContain("Course Pathways");
		expect(wrapper.text()).toContain("Scratch and Early Computer Science");
		expect(wrapper.text()).toContain("JavaScript and Web Development");
		expect(wrapper.text()).toContain("Assessment, tooling, and safety");
		expect(wrapper.text()).not.toContain("Build next");
		expect(wrapper.text()).not.toContain("Expansion Backlog");
	});
});
