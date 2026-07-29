import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentManagement from "@/components/StudentManagement.vue";
import {
	createAdminStudent,
	fetchAdminStudents,
	resetAdminStudentAccess,
	setAdminStudentActive
} from "@/modules/studentAccounts";
import { useAppStore } from "@/stores/app";

vi.mock("@/modules/studentAccounts", () => ({
	createAdminStudent: vi.fn(),
	fetchAdminStudents: vi.fn(),
	resetAdminStudentAccess: vi.fn(),
	setAdminStudentActive: vi.fn()
}));

const student = {
	_id: "student-1",
	username: "maria-7",
	active: true
};

describe("StudentManagement", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.mocked(fetchAdminStudents).mockResolvedValue([]);
	});

	function mountManagement() {
		return mount(StudentManagement, {
			global: {
				stubs: {
					StudentProjectReview: {
						props: ["studentId", "username"],
						template:
							'<div data-testid="project-review">{{ username }}</div>'
					}
				}
			}
		});
	}

	it("requires Julio's password and shows a new access code only transiently", async () => {
		vi.mocked(createAdminStudent).mockResolvedValueOnce({
			student,
			accessCode: "CODE-ONLY-ONCE"
		});
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper.get("#new-student-username").setValue("Maria-7");
		await wrapper.get("form").trigger("submit.prevent");
		expect(createAdminStudent).not.toHaveBeenCalled();

		await wrapper
			.get("#create-student-teacher-password")
			.setValue("julio-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(createAdminStudent).toHaveBeenCalledWith(
			"maria-7",
			"julio-password"
		);
		expect(wrapper.text()).toContain("CODE-ONLY-ONCE");
		expect(wrapper.text()).toContain("maria-7");
		expect(
			(
				wrapper.get("#create-student-teacher-password")
					.element as HTMLInputElement
			).value
		).toBe("");

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Dismiss")
			?.trigger("click");
		expect(wrapper.text()).not.toContain("CODE-ONLY-ONCE");
	});

	it("warns before reset and clears Julio's password after generating a code", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([student]);
		vi.mocked(resetAdminStudentAccess).mockResolvedValueOnce({
			student,
			accessCode: "RESET-CODE"
		});
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Reset access")
			?.trigger("click");

		expect(wrapper.text()).toContain("invalidates the current password");
		const passwordInput = wrapper.get(
			`#reset-teacher-password-${student._id}`
		);
		await passwordInput.setValue("julio-password");
		await wrapper
			.findAll("form")
			.find(form => form.text().includes("Create new code"))
			?.trigger("submit.prevent");
		await flushPromises();

		expect(resetAdminStudentAccess).toHaveBeenCalledWith(
			student._id,
			"julio-password"
		);
		expect(wrapper.text()).toContain("RESET-CODE");
		expect(
			wrapper.find(`#reset-teacher-password-${student._id}`).exists()
		).toBe(false);
	});

	it("disables and re-enables students without offering deletion", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([student]);
		vi.mocked(setAdminStudentActive).mockResolvedValueOnce({
			...student,
			active: false
		});
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Disable")
			?.trigger("click");
		await flushPromises();

		expect(setAdminStudentActive).toHaveBeenCalledWith(student._id, false);
		expect(wrapper.text()).toContain("Disabled");
		expect(wrapper.text()).toContain("Enable");
		expect(wrapper.text()).not.toMatch(/Delete|Remove/);
		expect(wrapper.get('[data-testid="project-review"]').text()).toBe(
			"maria-7"
		);
	});

	it("shows which credentials need Julio's attention", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([
			{
				...student,
				credentialState: "password",
				passwordSetAt: "2026-07-29T12:00:00.000Z"
			},
			{
				...student,
				_id: "student-2",
				username: "liam-4",
				credentialState: "expired-code",
				accessCodeExpiresAt: "2026-07-28T12:00:00.000Z"
			},
			{
				...student,
				_id: "student-3",
				username: "ava-2",
				credentialState: "none"
			},
			{
				...student,
				_id: "student-4",
				username: "noah-5",
				credentialState: "setup",
				accessCodeExpiresAt: "2026-07-29T14:30:00.000Z"
			}
		]);

		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain("Password set");
		expect(wrapper.text()).toContain("Access code expired — reset access");
		expect(wrapper.text()).toContain("Needs access reset");
		expect(wrapper.text()).toContain(
			"Password setup in progress — expires"
		);
		expect(
			wrapper
				.findAll(".student-management__credential")
				.find(credential =>
					credential.text().includes("Password setup in progress")
				)
				?.classes()
		).toContain("is-warning");
	});

	it("shows date-only sign-in and project activity in Julio's roster", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([
			{
				...student,
				lastLoginAt: "2026-07-28T22:45:00.000Z",
				lastProjectSavedAt: "2026-07-29T12:30:00.000Z",
				projectCount: 3
			}
		]);

		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.get('[data-testid="student-project-count"]').text()).toBe(
			"3"
		);
		expect(wrapper.get('[data-testid="student-last-sign-in"]').text()).toBe(
			"Jul 28, 2026"
		);
		expect(
			wrapper.get('[data-testid="student-last-project-save"]').text()
		).toBe("Jul 29, 2026");
		expect(wrapper.text()).not.toMatch(/\b\d{1,2}:\d{2}\b/);
	});

	it("clears the roster and a revealed code when Admin authorization expires", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		vi.mocked(createAdminStudent).mockResolvedValueOnce({
			student,
			accessCode: "CODE-ONLY-ONCE"
		});
		vi.mocked(setAdminStudentActive).mockRejectedValueOnce({
			response: {
				status: 403,
				data: { message: "Not logged in or session expired" }
			}
		});
		const wrapper = mountManagement();
		await flushPromises();
		await wrapper.get("#new-student-username").setValue("Maria-7");
		await wrapper
			.get("#create-student-teacher-password")
			.setValue("julio-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();
		expect(wrapper.text()).toContain("CODE-ONLY-ONCE");

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Disable")
			?.trigger("click");
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
		expect(wrapper.text()).not.toContain("CODE-ONLY-ONCE");
		expect(wrapper.text()).not.toContain("maria-7");
	});
});
