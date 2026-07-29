import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { reportClassroomUsage } from "@/modules/classroomUsage";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		put: vi.fn()
	}
}));

vi.mock("@/modules/classroomUsage", () => ({
	reportClassroomUsage: vi.fn()
}));

const expectedCourses = [
	["scratch-level-1", "Scratch Level 1"],
	["scratch-level-2", "Scratch Level 2"],
	["python-level-1", "Python Level 1"],
	["python-level-2", "Python Level 2: Classroom Edition"],
	["pygames", "PyGames: Classroom Edition"]
];
const expectedArchivedCourses = [
	["python-level-2-archive", "Python Level 2 — archived original"],
	["pygames-archive", "PyGames — archived original"]
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
						content: "Build a small project and test what happens."
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

	async function mountPublicCatalog() {
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
			props: { publicCatalog: true },
			global: {
				plugins: [pinia],
				stubs: {
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

	it("offers five current courses plus separate archived references", async () => {
		const { loadCourse, wrapper } = await mountPublicCatalog();
		const options = wrapper
			.findAll("#course-select option")
			.map(option => [option.attributes("value"), option.text()]);

		expect(options).toEqual([...expectedCourses, ...expectedArchivedCourses]);
		expect(
			wrapper
				.findAll("#course-select optgroup")
				.map(group => group.attributes("label"))
		).toEqual(["Current courses", "Archived reference versions"]);
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
		expect(wrapper.get(".course-hero h2").text()).toBe(
			"PyGames: Classroom Edition"
		);
		expect(reportClassroomUsage).toHaveBeenCalledWith(
			"course-open",
			"pygames"
		);
		expect(wrapper.text()).not.toContain("Course preview");
		expect(wrapper.text()).not.toContain("Use the browser workspace");
	});

	it("marks an original course as an archived teacher reference", async () => {
		const { loadCourse, wrapper } = await mountPublicCatalog();

		await wrapper
			.get("#course-select")
			.setValue("python-level-2-archive");
		await flushPromises();

		expect(loadCourse).toHaveBeenCalledWith("python-level-2-archive");
		expect(wrapper.get(".course-archive-notice").text()).toContain(
			"Archived original for teacher reference"
		);
	});
});
