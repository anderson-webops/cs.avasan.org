import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentProjectReview from "@/components/StudentProjectReview.vue";
import {
	createPythonIdeProjectReview,
	fetchManagedPythonIdeProjects,
	updatePythonIdeProjectReview
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";

vi.mock("@/modules/pythonIde", () => ({
	createPythonIdeProjectReview: vi.fn(),
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
			{ project, review: null }
		]);
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
			{ project, review }
		]);
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
});
