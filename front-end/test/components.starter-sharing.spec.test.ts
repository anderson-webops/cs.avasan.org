import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/modules/classroomUsage", () => ({ reportClassroomUsage: vi.fn() }));

async function mountStarter() {
	const pinia = createPinia();
	setActivePinia(pinia);
	vi.spyOn(useCoursesStore(), "loadCourseById").mockResolvedValue({
		id: "scratch-level-1",
		name: "Scratch Level 1: Classroom Edition",
		modules: [
			{
				id: "events",
				title: "Events",
				curriculum: [
					{
						id: "animate-word",
						title: "Animate Your Name",
						content: "**Assignment:** Make one letter move.",
						projectLink: "/ide?mode=scratch&starter=animate-word"
					}
				],
				supplementalProjects: []
			}
		]
	});
	const wrapper = mount(CourseExplorer, {
		global: {
			plugins: [pinia],
			stubs: {
				CodePreview: true,
				CourseAssetPreview: true,
				LazyMarkdownContent: true
			}
		}
	});
	await flushPromises();
	return wrapper;
}

describe("Copy starter link", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		window.history.replaceState({}, "", "/");
	});

	it("copies only a public starter URL and explains that edits are not shared", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		window.history.replaceState(
			{},
			"",
			"/?studentID=private-id&code=private-code"
		);
		const wrapper = await mountStarter();
		await wrapper.get(".is-starter-share").trigger("click");
		await flushPromises();
		expect(writeText).toHaveBeenCalledWith(
			`${window.location.origin}/ide?mode=scratch&starter=animate-word`
		);
		expect(
			wrapper.get(".starter-share-result [role=status]").text()
		).toContain("not edited work");
		expect(wrapper.find(".starter-share-result input").exists()).toBe(
			false
		);
		wrapper.unmount();
	});

	it("offers a readonly manual-copy fallback when clipboard permission is denied", async () => {
		vi.stubGlobal("navigator", {
			clipboard: {
				writeText: vi.fn().mockRejectedValue(new Error("Denied"))
			}
		});
		const wrapper = await mountStarter();
		await wrapper.get(".is-starter-share").trigger("click");
		await flushPromises();
		const input = wrapper.get<HTMLInputElement>(
			".starter-share-result input"
		);
		expect(input.attributes("readonly")).toBeDefined();
		expect(input.element.value).toBe(
			`${window.location.origin}/ide?mode=scratch&starter=animate-word`
		);
		expect(
			wrapper.get(".starter-share-result [role=status]").text()
		).toContain("Copy the starter link below");
		wrapper.unmount();
	});
});
