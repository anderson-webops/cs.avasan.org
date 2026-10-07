import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { reportClassroomUsage } from "@/modules/classroomUsage";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/modules/classroomUsage", () => ({
	reportClassroomUsage: vi.fn()
}));

const expectedCourses = [
	["scratch-level-1", "Scratch Level 1: Classroom Edition"],
	["scratch-level-2", "Scratch Level 2"],
	["python-level-1", "Python Level 1: Classroom Edition"],
	["python-level-2", "Python Level 2: Classroom Edition"],
	["pygames", "PyGames: Classroom Edition"]
];
function installLocalStorageStub() {
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => values.set(key, value)
		}
	});
}

function courseDefinition(id: string, name: string) {
	return {
		id,
		name,
		modules: [
			{
				id: `${id}-module`,
				title: "First steps",
				curriculum: [
					{
						id: `${id}-lesson`,
						title: "Try one idea",
						content:
							"**Objective:** Understand events. **Assignment:** Build a small project and test what happens. **Optional:** Add sound.",
						playableSolutionEmbedUrl:
							id === "scratch-level-1"
								? "https://scratch.mit.edu/projects/297735619/embed"
								: undefined
					}
				],
				supplementalProjects: [
					{
						id: `${id}-project`,
						title: "Project: Make it yours",
						content: "Change one detail and run the project again."
					}
				]
			}
		]
	};
}

describe("CourseExplorer public catalog", () => {
	it("separates assignments, supplemental projects and learning context", async () => {
		const { wrapper } = await mountPublicCatalog();
		const view = (label: string) =>
			wrapper
				.findAll(".lesson-view-toggle button")
				.find(button => button.text() === label)!;
		expect(view("Projects").attributes("aria-pressed")).toBe("true");
		expect(wrapper.find(".reader-link-groups").exists()).toBe(false);
		expect(wrapper.get(".assignment-content").text()).toContain(
			"Build a small project"
		);
		expect(wrapper.get(".assignment-content").text()).not.toContain(
			"Understand events"
		);
		expect(wrapper.get(".assignment-aside.is-optional").text()).toContain(
			"Add sound"
		);
		expect(wrapper.find(".lesson-card.is-supplemental").exists()).toBe(
			false
		);
		await view("Supplemental Projects").trigger("click");
		expect(wrapper.get(".lesson-card.is-supplemental").text()).toContain(
			"Make it yours"
		);
		expect(wrapper.get("#lesson-view-content").text()).not.toContain(
			"Try one idea"
		);
		await view("Learn").trigger("click");
		expect(wrapper.get(".learning-card").text()).toContain(
			"Understand events"
		);
		expect(wrapper.find(".assignment-content").exists()).toBe(false);
		wrapper.unmount();
	});

	beforeEach(() => {
		vi.clearAllMocks();
		installLocalStorageStub();
		window.localStorage.clear();
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		window.localStorage.clear();
		window.history.replaceState({}, "", "/");
		vi.restoreAllMocks();
	});

	async function mountPublicCatalog(attach = false) {
		const pinia = createPinia();
		setActivePinia(pinia);
		const coursesStore = useCoursesStore();
		const loadCourse = vi
			.spyOn(coursesStore, "loadCourseById")
			.mockImplementation(async id => {
				const summary = [
					...coursesStore.courses,
					...coursesStore.archivedCourses
				].find(course => course.id === id);
				return summary
					? (courseDefinition(summary.id, summary.name) as any)
					: null;
			});

		const wrapper = mount(CourseExplorer, {
			attachTo: attach ? document.body : undefined,
			global: {
				plugins: [pinia],
				stubs: {
					teleport: true,
					CodePreview: true,
					CourseAssetPreview: true,
					LazyMarkdownContent: {
						props: ["content"],
						template: "<p>{{ content }}</p>"
					}
				}
			}
		});
		await flushPromises();
		return { loadCourse, wrapper };
	}

	it("keeps compact course controls visible while the lesson is available", async () => {
		const { wrapper } = await mountPublicCatalog(true);
		expect(wrapper.find(".reader-link-groups").exists()).toBe(false);
		expect(wrapper.find(".section-count").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Jump to project");
		expect(wrapper.find(".course-toolbar-disclosure").exists()).toBe(false);
		expect(wrapper.get("#course-select").isVisible()).toBe(true);
		expect(wrapper.get("#course-reader-panel").text()).toContain(
			"Try one idea"
		);
		expect(wrapper.get(".outline-toggle").attributes("aria-expanded")).toBe(
			"false"
		);
		await wrapper.get(".outline-toggle").trigger("click");
		expect(wrapper.get(".outline-toggle").attributes("aria-expanded")).toBe(
			"true"
		);
		await wrapper.get(".outline-button").trigger("click");
		await flushPromises();
		expect(wrapper.get(".outline-toggle").attributes("aria-expanded")).toBe(
			"false"
		);
		expect(document.activeElement).toBe(
			wrapper.get("#course-reader-panel").element
		);
		wrapper.unmount();
	});
	it("opens lesson navigation for search results", async () => {
		const { wrapper } = await mountPublicCatalog();
		await wrapper.get("#course-search").setValue("Try one idea");
		expect(wrapper.get(".outline-toggle").attributes("aria-expanded")).toBe(
			"true"
		);
		expect(wrapper.get(".course-outline").classes()).toContain("is-open");
		wrapper.unmount();
	});
	it("offers exactly the five public classroom courses", async () => {
		const { loadCourse, wrapper } = await mountPublicCatalog();
		const options = wrapper
			.findAll("#course-select option")
			.map(option => [option.attributes("value"), option.text()]);

		expect(options).toEqual(expectedCourses);
		expect(
			wrapper
				.findAll("#course-select optgroup")
				.map(group => group.attributes("label"))
		).toEqual(["Current courses"]);
		expect(wrapper.text()).toContain("Scratch Level 1");
		expect(wrapper.text()).not.toContain("Course preview");
		expect(wrapper.find(".course-stats").exists()).toBe(false);
		expect(wrapper.find("#learner-select").exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(
			/assigned courses|learner context|log in|sign up/i
		);
		expect(wrapper.text()).not.toContain("Done");
		expect(loadCourse).toHaveBeenCalledWith("scratch-level-1");
		expect(reportClassroomUsage).toHaveBeenCalledWith(
			"course-open",
			"scratch-level-1"
		);
	});

	it("switches directly between public courses", async () => {
		const { loadCourse, wrapper } = await mountPublicCatalog();

		await wrapper.get("#course-select").setValue("pygames");
		await flushPromises();

		expect(loadCourse).toHaveBeenCalledWith("pygames");
		expect(wrapper.get("#course-select option:checked").text()).toBe(
			"PyGames: Classroom Edition"
		);
		expect(reportClassroomUsage).toHaveBeenCalledWith(
			"course-open",
			"pygames"
		);
		expect(wrapper.text()).not.toContain("Course preview");
		expect(wrapper.text()).not.toContain("Use the browser workspace");
	});

	it("loads a playable Scratch solution only after the learner asks", async () => {
		const { wrapper } = await mountPublicCatalog();

		expect(wrapper.find("iframe").exists()).toBe(false);
		expect(wrapper.find('a[href*="scratch.mit.edu"]').exists()).toBe(false);
		await wrapper.get(".is-playable-solution").trigger("click");
		await flushPromises();

		const frame = wrapper.get("iframe");
		expect(frame.attributes("src")).toBe(
			"https://scratch.mit.edu/projects/297735619/embed"
		);
		expect(frame.attributes("referrerpolicy")).toBe("no-referrer");
		expect(frame.attributes("sandbox")).toBe(
			"allow-scripts allow-same-origin"
		);

		await wrapper.get(".dialog-close").trigger("click");
		await flushPromises();
		expect(wrapper.find("iframe").exists()).toBe(false);
	});

	it("searches the visible public course content without an account", async () => {
		const { wrapper } = await mountPublicCatalog();

		await wrapper.get("#course-search").setValue("not in this course");
		await flushPromises();

		expect(wrapper.text()).toContain("No matches yet");
		expect(wrapper.text()).not.toContain(
			"Build a small project and test what happens."
		);

		await wrapper.get(".clear-search").trigger("click");
		await flushPromises();

		expect(wrapper.text()).toContain(
			"Build a small project and test what happens."
		);
	});

	it("contains no retired tutor or legacy-user service calls", () => {
		const source = [
			"../src/components/CourseExplorer.vue",
			"../src/stores/app.ts",
			"../src/stores/courses.ts"
		]
			.map(file =>
				readFileSync(resolve(import.meta.dirname, file), "utf8")
			)
			.join("\n");

		expect(source).not.toMatch(/\/tutors(?:\/|["'`])/);
		expect(source).not.toMatch(/\/users(?:\/|["'`])/);
		expect(source).not.toContain("currentTutor");
		expect(source).not.toContain("courseProgress");
		expect(source).toContain("currentUser");
		expect(source).toContain("currentAdmin");
	});
});
