import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentProjectReview from "@/components/StudentProjectReview.vue";
import {
	createPythonIdeProjectReview,
	fetchManagedPythonIdeProject,
	fetchManagedPythonIdeProjects,
	updatePythonIdeProjectReview
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";

vi.mock("@/modules/pythonIde", () => ({
	createPythonIdeProjectReview: vi.fn(),
	fetchManagedPythonIdeProject: vi.fn(),
	fetchManagedPythonIdeProjects: vi.fn(),
	isPythonIdeBinaryAssetFile: vi.fn(() => false),
	updatePythonIdeProjectReview: vi.fn()
}));

const project = {
	_id: "project-1",
	title: "Loops",
	mode: "python" as const,
	files: [{ name: "main.py", content: 'print("student")' }],
	activeFileName: "main.py",
	updatedAt: "2026-07-29T12:00:00.000Z"
};

const review = {
	_id: "review-1",
	sourceProject: project._id,
	title: project.title,
	mode: project.mode,
	files: [{ name: "main.py", content: 'print("student")' }],
	activeFileName: "main.py",
	reviewerRole: "admin" as const,
	visibleToStudent: false,
	note: "",
	sourceUpdatedAt: project.updatedAt,
	updatedAt: "2026-07-29T12:01:00.000Z"
};

describe("StudentProjectReview", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.mocked(fetchManagedPythonIdeProjects).mockResolvedValue([
			{
				project: {
					...project,
					files: [],
					remoteContentLoaded: false
				},
				review: null
			}
		]);
		vi.mocked(fetchManagedPythonIdeProject).mockResolvedValue({
			project: { ...project, remoteContentLoaded: true },
			review: null
		});
	});

	it("edits a teacher copy without overwriting the student original", async () => {
		vi.mocked(createPythonIdeProjectReview).mockResolvedValueOnce({
			project,
			review
		});
		vi.mocked(updatePythonIdeProjectReview).mockImplementationOnce(
			async (_studentID, _projectID, _reviewID, payload) => ({
				project,
				review: {
					...review,
					files: payload.files ?? review.files
				}
			})
		);
		const wrapper = mount(StudentProjectReview, {
			props: {
				studentId: "student-1",
				username: "maria-7"
			}
		});

		const details = wrapper.get("details");
		(details.element as HTMLDetailsElement).open = true;
		await details.trigger("toggle");
		await flushPromises();

		expect(fetchManagedPythonIdeProjects).toHaveBeenCalledWith("student-1");
		expect(fetchManagedPythonIdeProject).toHaveBeenCalledWith(
			"student-1",
			project._id
		);
		expect(wrapper.text()).toContain('print("student")');
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Create teacher copy")
			?.trigger("click");
		await flushPromises();

		const teacherEditor = wrapper.get(
			'textarea[aria-label="Edit teacher copy"]'
		);
		await teacherEditor.setValue('print("teacher suggestion")');
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Save teacher copy")
			?.trigger("click");
		await flushPromises();

		expect(updatePythonIdeProjectReview).toHaveBeenCalledWith(
			"student-1",
			project._id,
			review._id,
			expect.objectContaining({
				files: [
					expect.objectContaining({
						name: "main.py",
						content: 'print("teacher suggestion")'
					})
				]
			})
		);
		expect(wrapper.text()).toContain('print("student")');
		expect(project.files[0]?.content).toBe('print("student")');
	});

	it("clears loaded projects when Admin authorization expires", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		vi.mocked(fetchManagedPythonIdeProjects).mockResolvedValueOnce([
			{
				project: {
					...project,
					files: [],
					remoteContentLoaded: false
				},
				review: {
					...review,
					files: [],
					note: undefined,
					remoteContentLoaded: false
				}
			}
		]);
		vi.mocked(fetchManagedPythonIdeProject).mockResolvedValueOnce({
			project: { ...project, remoteContentLoaded: true },
			review: { ...review, remoteContentLoaded: true }
		});
		vi.mocked(updatePythonIdeProjectReview).mockRejectedValueOnce({
			response: {
				status: 403,
				data: { message: "Teacher session required" }
			}
		});
		const wrapper = mount(StudentProjectReview, {
			props: {
				studentId: "student-1",
				username: "maria-7"
			}
		});
		const details = wrapper.get("details");
		(details.element as HTMLDetailsElement).open = true;
		await details.trigger("toggle");
		await flushPromises();
		expect(wrapper.text()).toContain('print("student")');

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Save teacher copy")
			?.trigger("click");
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
		expect(wrapper.text()).not.toContain('print("student")');
	});

	it("loads only the selected project body and evicts the previous body", async () => {
		const secondProject = {
			...project,
			_id: "project-2",
			title: "Functions",
			files: [{ name: "main.py", content: 'print("second")' }]
		};
		vi.mocked(fetchManagedPythonIdeProjects).mockResolvedValueOnce([
			{
				project: {
					...project,
					files: [],
					remoteContentLoaded: false
				},
				review: null
			},
			{
				project: {
					...secondProject,
					files: [],
					remoteContentLoaded: false
				},
				review: null
			}
		]);
		vi.mocked(fetchManagedPythonIdeProject)
			.mockResolvedValueOnce({
				project: { ...project, remoteContentLoaded: true },
				review: null
			})
			.mockResolvedValueOnce({
				project: {
					...secondProject,
					remoteContentLoaded: true
				},
				review: null
			});
		const wrapper = mount(StudentProjectReview, {
			props: {
				studentId: "student-1",
				username: "maria-7"
			}
		});

		const details = wrapper.get("details");
		(details.element as HTMLDetailsElement).open = true;
		await details.trigger("toggle");
		await flushPromises();
		expect(wrapper.text()).toContain('print("student")');
		expect(wrapper.text()).not.toContain('print("second")');

		await wrapper.get("select").setValue("project-2");
		await flushPromises();

		expect(fetchManagedPythonIdeProject).toHaveBeenLastCalledWith(
			"student-1",
			"project-2"
		);
		expect(wrapper.text()).toContain('print("second")');
		expect(wrapper.text()).not.toContain('print("student")');
	});

	it("does not reveal a previous student’s project after the component changes students", async () => {
		vi.mocked(fetchManagedPythonIdeProjects).mockImplementation(
			async studentID =>
				studentID === "student-1"
					? [
							{
								project: {
									...project,
									files: [],
									remoteContentLoaded: false
								},
								review: null
							}
						]
					: []
		);
		let resolveOldStudentDetail:
			| ((value: {
					project: typeof project & { remoteContentLoaded: true };
					review: null;
			  }) => void)
			| undefined;
		vi.mocked(fetchManagedPythonIdeProject).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolveOldStudentDetail = resolve;
				})
		);
		const wrapper = mount(StudentProjectReview, {
			props: {
				studentId: "student-1",
				username: "maria-7"
			}
		});

		const details = wrapper.get("details");
		(details.element as HTMLDetailsElement).open = true;
		await details.trigger("toggle");
		await vi.waitFor(() => {
			expect(fetchManagedPythonIdeProject).toHaveBeenCalledWith(
				"student-1",
				project._id
			);
		});
		expect(fetchManagedPythonIdeProject).toHaveBeenCalledTimes(1);

		await wrapper.setProps({
			studentId: "student-2",
			username: "devon-4"
		});
		resolveOldStudentDetail?.({
			project: { ...project, remoteContentLoaded: true },
			review: null
		});
		await flushPromises();

		expect(fetchManagedPythonIdeProject).toHaveBeenCalledTimes(1);
		expect(wrapper.text()).not.toContain('print("student")');
		expect(wrapper.text()).not.toContain("Loops");
	});
});
