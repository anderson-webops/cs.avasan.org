import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { resetCourseAssetPreviewCache } from "@/modules/courseAssetPreview";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		put: vi.fn()
	}
}));

function installLocalStorageStub() {
	const values = new Map<string, string>();

	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => {
				values.set(key, value);
			}
		}
	});
}

describe("CourseExplorer.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		resetCourseAssetPreviewCache();
		vi.useRealTimers();
		installLocalStorageStub();
		window.localStorage.clear();
		window.history.replaceState({}, "", "/courses");
	});

	afterEach(() => {
		vi.useRealTimers();
		window.localStorage.clear();
		window.history.replaceState({}, "", "/courses");
		vi.unstubAllGlobals();
	});

	it("renders course stats for an assigned learner without throwing", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];
		const firstItem = firstModule?.curriculum[0];

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress:
				firstModule && firstItem
					? [
							{
								courseId: assignedCourse.id,
								completedModuleIds: [firstModule.id],
								completedItemIds: [firstItem.id]
							}
						]
					: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Current course");
		});
		expect(wrapper.text()).toContain(assignedCourse.name);
		expect(wrapper.text()).toContain("Core lessons");
		expect(wrapper.text()).toContain("Projects");
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("links Python-family courses to the integrated Python IDE", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pythonCourse = coursesStore.courses.find(
			course => course.id === "python-level-1"
		);

		if (!pythonCourse) throw new Error("Expected Python Level 1 course.");

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: pythonCourse.id,
			name: pythonCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use Turtle to draw with coordinates.",
							id: "python-turtle-lesson",
							title: "Turtle Coordinates"
						}
					],
					id: "python-module-1",
					supplementalProjects: [],
					title: "Python Turtle"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pythonCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Open Turtle IDE");
		});

		const link = wrapper
			.findAll("a")
			.find(candidate => candidate.text() === "Open Turtle IDE");
		expect(link?.exists()).toBe(true);
		const href = link?.attributes("href") ?? "";
		const query = new URLSearchParams(href.split("?")[1] ?? "");
		expect(href.startsWith("/python-ide?")).toBe(true);
		expect(query.get("course")).toBe("python-level-1");
		expect(query.get("mode")).toBe("turtle");
	});

	it("counts reference appendices separately from core course work", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Core lesson content.",
							id: "lesson-1",
							title: "Core Lesson"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Core Module"
				},
				{
					curriculum: [
						{
							content: "Reference material.",
							id: "appendix-item",
							title: "Reference Item"
						}
					],
					id: "appendix-1",
					kind: "appendix",
					supplementalProjects: [],
					title: "Reference Appendix"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Reference Appendix");
		});

		expect(wrapper.find(".course-stats").text()).toContain("Modules1");
		expect(wrapper.find(".course-stats").text()).toContain("Appendices1");
		expect(wrapper.find(".course-stats").text()).toContain("Core lessons1");
		expect(wrapper.find(".course-stats").text()).toContain("Projects0");
		expect(wrapper.text()).toContain("Choose a section");
		expect(wrapper.text()).toContain("References");
		expect(
			wrapper
				.find('[aria-label="Show appendix 1: Reference Appendix"]')
				.exists()
		).toBe(true);
	});

	it("matches saved progress against stable ID aliases", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValueOnce({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					aliases: ["legacy-module-id"],
					curriculum: [
						{
							aliases: ["legacy-item-id"],
							content: "Read the starter and explain the result.",
							id: "stable-item-id",
							title: "Stable Lesson"
						}
					],
					id: "stable-module-id",
					supplementalProjects: [],
					title: "Stable Module"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [
				{
					courseId: assignedCourse.id,
					completedModuleIds: ["legacy-module-id"],
					completedItemIds: ["legacy-item-id"]
				}
			],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Stable Module");
		});
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("groups learner course dropdown options by current and past status", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pastCourse = coursesStore.courses[0];
		const currentCourse = coursesStore.courses[1];

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pastCourse.id, currentCourse.id],
			courseStatus: {
				[pastCourse.id]: "past",
				[currentCourse.id]: "current"
			},
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain(currentCourse.name);
		});

		const groups = wrapper.findAll("optgroup");
		expect(groups.map(group => group.attributes("label"))).toEqual([
			"Current courses",
			"Past courses"
		]);
		expect(
			wrapper.find<HTMLSelectElement>("#course-select").element.value
		).toBe(currentCourse.id);
		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Current course");
		});
	});

	it("lets staff mark selected learner progress with debounced autosave", async () => {
		vi.useFakeTimers();
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];

		if (!firstModule) throw new Error("Expected test course module.");

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});
		(api.put as any).mockResolvedValueOnce({ data: {} });

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});

		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Learner");
			expect(wrapper.text()).toContain(assignedCourse.name);
		});

		await wrapper.find(".progress-toggle.is-module input").setValue(true);
		expect(api.put).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(701);
		await flushPromises();

		expect(api.put).toHaveBeenCalledWith(
			"/users/learner-1/course-progress",
			{
				courseId: assignedCourse.id,
				completedModuleIds: [firstModule.id],
				completedItemIds: []
			}
		);
		expect(wrapper.text()).toContain("Saved");
	});

	it("restores staff learner, course, and module context on deep-link refresh", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const fallbackCourse = coursesStore.courses[0];
		const chemistryCourse = coursesStore.courses.find(
			course => course.id === "intro-to-chemistry"
		);

		if (!chemistryCourse)
			throw new Error("Expected Intro to Chemistry course.");

		const chemistryModuleId = "chm1-chemistry-basics";
		const chemistryItemId =
			"intro-to-chemistry-chm1-chemistry-basics-curriculum-mini-lab-diy-lava-lamp-and-density";
		const hashAnchor = `${chemistryModuleId}-${chemistryItemId}`;

		window.localStorage.setItem(
			"classes:course-explorer:selected-learner",
			"learner-chemistry"
		);
		window.localStorage.setItem(
			"classes:course-explorer:selected-course",
			chemistryCourse.id
		);
		window.localStorage.setItem(
			`classes:course-explorer:active-module:${chemistryCourse.id}`,
			chemistryModuleId
		);
		window.history.replaceState({}, "", `/courses#${hashAnchor}`);

		vi.spyOn(coursesStore, "loadCourseById").mockImplementation(
			async courseId => {
				if (courseId === chemistryCourse.id) {
					return {
						id: chemistryCourse.id,
						name: chemistryCourse.name,
						modules: [
							{
								curriculum: [
									{
										content:
											"Density predicts which liquid sits on top.",
										id: chemistryItemId,
										title: "Mini Lab: DIY Lava Lamp and Density"
									}
								],
								id: chemistryModuleId,
								supplementalProjects: [],
								title: "CHM1 Chemistry Basics"
							}
						]
					};
				}

				return {
					id: fallbackCourse.id,
					name: fallbackCourse.name,
					modules: [
						{
							curriculum: [
								{
									content: "Fallback content.",
									id: "fallback-item",
									title: "Fallback Lesson"
								}
							],
							id: "fallback-module",
							supplementalProjects: [],
							title: "Fallback Module"
						}
					]
				};
			}
		);

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 2,
			coursePermissions: [fallbackCourse.id, chemistryCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-fallback",
					name: "Fallback Learner",
					email: "fallback@example.com",
					age: 12,
					state: "GA",
					courseAccess: [fallbackCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				},
				{
					_id: "learner-chemistry",
					name: "Chemistry Learner",
					email: "chemistry@example.com",
					age: 13,
					state: "GA",
					courseAccess: [chemistryCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(
				wrapper.find<HTMLSelectElement>("#learner-select").element.value
			).toBe("learner-chemistry");
			expect(
				wrapper.find<HTMLSelectElement>("#course-select").element.value
			).toBe(chemistryCourse.id);
			expect(wrapper.text()).toContain(
				"Mini Lab: DIY Lava Lamp and Density"
			);
		});

		expect(wrapper.text()).toContain(
			"Showing module 1: CHM1 Chemistry Basics."
		);
		expect(coursesStore.loadCourseById).toHaveBeenCalledWith(
			chemistryCourse.id
		);
	});

	it("uses a course hash to choose the matching learner when no stored learner exists", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const fallbackCourse = coursesStore.courses[0];
		const chemistryCourse = coursesStore.courses.find(
			course => course.id === "intro-to-chemistry"
		);

		if (!chemistryCourse)
			throw new Error("Expected Intro to Chemistry course.");

		window.history.replaceState(
			{},
			"",
			"/courses#intro-to-chemistry-chm1-chemistry-basics"
		);

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: chemistryCourse.id,
			name: chemistryCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Chemistry basics content.",
							id: "chemistry-item",
							title: "Chemistry Basics Lesson"
						}
					],
					id: "chm1-chemistry-basics",
					supplementalProjects: [],
					title: "CHM1 Chemistry Basics"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 2,
			coursePermissions: [fallbackCourse.id, chemistryCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-fallback",
					name: "Fallback Learner",
					email: "fallback@example.com",
					age: 12,
					state: "GA",
					courseAccess: [fallbackCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				},
				{
					_id: "learner-chemistry",
					name: "Chemistry Learner",
					email: "chemistry@example.com",
					age: 13,
					state: "GA",
					courseAccess: [chemistryCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(
				wrapper.find<HTMLSelectElement>("#learner-select").element.value
			).toBe("learner-chemistry");
			expect(
				wrapper.find<HTMLSelectElement>("#course-select").element.value
			).toBe(chemistryCourse.id);
			expect(wrapper.text()).toContain("Chemistry Basics Lesson");
		});
	});

	it("renders starter code previews but hides solution previews for learners", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Build from the starter.",
							id: "starter-item",
							projectLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
							solutionLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution",
							title: "Starter Project"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Preview starter code");
		});

		expect(wrapper.text()).not.toContain("Preview solution code");
		expect(wrapper.text()).not.toContain("Solution repo");
	});

	it("renders non-file media resources as links instead of broken images", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const phetLink =
			"https://phet.colorado.edu/en/simulations/filter?subjects=middle-school";
		const youtubeLink = "https://youtu.be/qCuFjXGSVB4";
		const javalabLink = "https://javalab.org/en/dissolution_process_en/";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use a simulation resource.",
							id: "science-resource",
							mediaLink: phetLink,
							title: "Simulation Resource"
						},
						{
							content: "Review a safe demo video.",
							id: "video-resource",
							mediaLink: youtubeLink,
							title: "Video Resource"
						},
						{
							content: "Use an interactive chemistry simulation.",
							id: "interactive-resource",
							mediaLink: javalabLink,
							title: "Interactive Resource"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Simulation collection");
			expect(wrapper.text()).toContain("Demo video");
			expect(wrapper.text()).toContain("Interactive simulation");
		});

		for (const resourceLink of [phetLink, youtubeLink, javalabLink]) {
			const link = wrapper.find(`a[href="${resourceLink}"]`);
			expect(link.exists()).toBe(true);
			expect(wrapper.find(`img[src="${resourceLink}"]`).exists()).toBe(
				false
			);
		}
	});

	it("labels science reference links by purpose instead of calling every link a dataset", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const acsLink =
			"https://www.acs.org/education/whatischemistry/periodictable.html";
		const localMaterialLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data";
		const namingCardsLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#nomenclature-practice-cards";
		const answerKeyLink =
			"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key";
		const phetLink =
			"https://phet.colorado.edu/en/simulations/build-an-atom";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use chemistry references.",
							datasetLink: acsLink,
							id: "chemistry-resource",
							mediaLink: phetLink,
							title: "Chemistry Resource"
						},
						{
							content: "Use local chemistry materials.",
							datasetLink: localMaterialLink,
							id: "local-chemistry-material",
							solutionLink: answerKeyLink,
							title: "Local Chemistry Material"
						},
						{
							content: "Name chemistry formulas.",
							datasetLink: namingCardsLink,
							id: "naming-cards",
							title: "Naming Cards"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("ACS periodic table");
			expect(wrapper.text()).toContain("Heating curve data");
			expect(wrapper.text()).toContain("Naming cards");
			expect(wrapper.text()).toContain("PhET simulation");
			expect(wrapper.text()).toContain("Course asset");
		});

		for (const localAssetLink of [localMaterialLink, namingCardsLink]) {
			const rawAssetLink = wrapper.find(
				`a.resource-link[href="${localAssetLink}"]`
			);
			expect(rawAssetLink.exists()).toBe(false);
		}
		expect(wrapper.html()).toContain(
			"/course-resource?asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23heating-curve-data"
		);

		expect(wrapper.text()).not.toContain("Rubric / answer key");
		expect(wrapper.text()).not.toContain("Dataset");
	});

	it("renders local course asset fragments inside the course viewer", async () => {
		const fetcher = vi.fn(async () => ({
			ok: true,
			text: async () =>
				[
					"# Intro to Chemistry Remote Materials Pack",
					"",
					"## Measurement Tables and Unit Conversions",
					"",
					"Measurement text that should not appear in the section preview.",
					"",
					"## Heating Curve Data",
					"",
					"Flat regions can still involve energy transfer.",
					"",
					"## Capstone Evidence Seeds",
					"",
					"Capstone text that should not appear."
				].join("\n")
		})) as any;
		vi.stubGlobal("fetch", fetcher);

		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const materialLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Compare local chemistry data.",
							datasetLink: materialLink,
							id: "chemistry-material",
							solutionLink:
								"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key",
							title: "Chemistry Material"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("View Heating curve data");
		});

		expect(wrapper.text()).not.toContain("Rubric / answer key");
		expect(
			wrapper.html().indexOf("Compare local chemistry data.")
		).toBeLessThan(wrapper.html().indexOf("View Heating curve data"));

		await wrapper.find(".course-asset-preview-toggle").trigger("click");
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Course resource section");
			expect(wrapper.text()).toContain("Heating Curve Data");
			expect(wrapper.text()).toContain(
				"Flat regions can still involve energy transfer."
			);
		});

		const fullResourceLink = wrapper.find(
			".course-asset-preview-open-link"
		);
		expect(fullResourceLink.attributes("href")).toContain(
			"/course-resource?asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23heating-curve-data"
		);
		expect(fullResourceLink.attributes("href")).not.toBe(materialLink);

		expect(fetcher).toHaveBeenCalledWith(
			"/course-assets/chemistry/chemistry-materials-pack.md"
		);
		expect(wrapper.text()).not.toContain(
			"Measurement text that should not appear"
		);
		expect(wrapper.text()).not.toContain(
			"Capstone text that should not appear"
		);
	});

	it("renders solution code preview controls for staff course context", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content:
								"Compare the solution after attempting the starter.",
							id: "starter-item",
							projectLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
							solutionLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution",
							title: "Starter Project"
						},
						{
							content:
								"Compare local chemistry data against the rubric.",
							datasetLink:
								"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data",
							id: "chemistry-material",
							solutionLink:
								"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key",
							title: "Chemistry Material"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Preview code");
		});

		expect(wrapper.text()).toContain("Solution repo");
		expect(wrapper.text()).toContain("Heating curve data");
		expect(wrapper.text()).toContain("Rubric / answer key");
		expect(wrapper.text()).toContain("Course asset");
	});
});
