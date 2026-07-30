import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StudentManagement from "@/components/StudentManagement.vue";
import {
	correctAdminStudentUsername,
	createAdminStudent,
	deleteAdminStudentRecords,
	exportAdminStudentRecords,
	fetchAdminStudentDeletionReceipts,
	fetchAdminStudents,
	resetAdminStudentAccess,
	setAdminStudentActive
} from "@/modules/studentAccounts";
import { useAppStore } from "@/stores/app";

vi.mock("@/modules/studentAccounts", () => ({
	correctAdminStudentUsername: vi.fn(),
	createAdminStudent: vi.fn(),
	deleteAdminStudentRecords: vi.fn(),
	exportAdminStudentRecords: vi.fn(),
	fetchAdminStudentDeletionReceipts: vi.fn(),
	fetchAdminStudents: vi.fn(),
	resetAdminStudentAccess: vi.fn(),
	setAdminStudentActive: vi.fn()
}));

const student = {
	_id: "student-1",
	username: "maria-7",
	active: true
};
const deletionReceipt = {
	operationID: "01234567-89ab-4cde-8fab-0123456789ab",
	reason: "julio-request" as const,
	status: "completed" as const,
	subject: {
		studentID: "student-1",
		username: "maria-7"
	},
	requestedAt: "2026-07-29T12:00:00.000Z",
	completedAt: "2026-07-29T12:00:01.000Z",
	expiresAt: "2026-10-27T12:00:00.000Z",
	deletedRecords: {
		oauthAttempts: 1,
		projects: 2,
		reviews: 1,
		students: 1
	}
};

describe("StudentManagement", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.mocked(fetchAdminStudents).mockResolvedValue([]);
		vi.mocked(fetchAdminStudentDeletionReceipts).mockResolvedValue({
			receipts: [],
			retentionDays: 90
		});
	});

	function mountManagement(maintenanceOnly = false) {
		return mount(StudentManagement, {
			props: {
				maintenanceOnly
			},
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

	it("limits maintenance mode to retained-record request tools", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([
			{
				...student,
				credentialState: "password",
				projectCount: 2,
				retentionExpiresAt: "2026-10-27T12:00:00.000Z"
			}
		]);
		const wrapper = mountManagement(true);
		await flushPromises();
		const labels = wrapper
			.findAll(".student-management__student-actions button")
			.map(button => button.text());

		expect(wrapper.get("#student-management-title").text()).toBe(
			"Student records"
		);
		expect(wrapper.text()).toContain("configured retention period");
		expect(wrapper.find("#new-student-username").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Password set");
		expect(labels).toEqual([
			"Correct username",
			"Export records",
			"Delete records"
		]);
		expect(wrapper.find('[data-testid="project-review"]').exists()).toBe(
			false
		);
		expect(createAdminStudent).not.toHaveBeenCalled();
		expect(resetAdminStudentAccess).not.toHaveBeenCalled();
		expect(setAdminStudentActive).not.toHaveBeenCalled();
	});

	it("requires Julio's password and shows a new access code only transiently", async () => {
		vi.mocked(createAdminStudent).mockResolvedValueOnce({
			student,
			accessCode: "CODE-ONLY-ONCE"
		});
		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain(
			"Use a school-approved alias such as river-7"
		);
		expect(wrapper.text()).toContain(
			"Do not use a full name, email, birthdate, student number"
		);
		expect(
			wrapper.get("#new-student-username").attributes("aria-describedby")
		).toBe("new-student-username-hint");

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

		expect(wrapper.text()).toContain("invalidates any current password");
		expect(wrapper.text()).toContain(
			"disconnects any connected Google or Apple sign-in"
		);
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

	it("disables and re-enables students", async () => {
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
		expect(wrapper.get('[data-testid="project-review"]').text()).toBe(
			"maria-7"
		);
	});

	it("lets Julio correct an alias without replacing the student record", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([student]);
		vi.mocked(correctAdminStudentUsername).mockResolvedValueOnce({
			...student,
			username: "river-8"
		});
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Correct username")
			?.trigger("click");
		await wrapper
			.get(`#correct-username-${student._id}`)
			.setValue("River-8");
		await wrapper
			.get(`#correct-teacher-password-${student._id}`)
			.setValue("julio-password");
		await wrapper
			.findAll("form")
			.find(form => form.text().includes("Save correction"))
			?.trigger("submit.prevent");
		await flushPromises();

		expect(correctAdminStudentUsername).toHaveBeenCalledWith(
			student._id,
			"river-8",
			"julio-password"
		);
		expect(wrapper.text()).toContain(
			"Corrected maria-7 to river-8. The student was signed out."
		);
		expect(wrapper.get(".student-management__student h3").text()).toBe(
			"river-8"
		);
	});

	it("exports a complete record after Julio re-verifies", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([student]);
		vi.mocked(exportAdminStudentRecords).mockResolvedValueOnce({
			blob: new Blob(["streamed export"], {
				type: "application/json"
			})
		});
		vi.stubGlobal("URL", {
			...URL,
			createObjectURL: vi.fn(() => "blob:student-export"),
			revokeObjectURL: vi.fn()
		});
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Export records")
			?.trigger("click");
		await wrapper
			.get(`#export-teacher-password-${student._id}`)
			.setValue("julio-password");
		await wrapper
			.findAll("form")
			.find(form => form.text().includes("Download JSON"))
			?.trigger("submit.prevent");
		await flushPromises();

		expect(exportAdminStudentRecords).toHaveBeenCalledWith(
			student._id,
			"julio-password"
		);
		expect(click).toHaveBeenCalledOnce();
		expect(wrapper.text()).toContain("Exported maria-7.");
		expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
		vi.unstubAllGlobals();
	});

	it("requires username confirmation before permanent deletion", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([student]);
		vi.mocked(deleteAdminStudentRecords).mockResolvedValueOnce({
			deleted: true,
			deletedRecords: {
				oauthAttempts: 1,
				projects: 2,
				reviews: 1,
				students: 1
			},
			operation: {
				id: "delete-operation",
				kind: "student-record-delete",
				performedAt: "2026-07-29T12:00:00.000Z",
				performedBy: "Julio"
			},
			operatorFollowUp: {
				backupDeletionRequired: true,
				instruction: "Complete backup deletion."
			},
			receipt: deletionReceipt
		});
		vi.stubGlobal("URL", {
			...URL,
			createObjectURL: vi.fn(() => "blob:deletion-receipt"),
			revokeObjectURL: vi.fn()
		});
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);
		const wrapper = mountManagement();
		await flushPromises();

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Delete records")
			?.trigger("click");
		const deleteButton = wrapper
			.findAll("button")
			.find(button => button.text() === "Permanently delete");
		expect(deleteButton?.attributes("disabled")).toBeDefined();

		await wrapper
			.get(`#delete-confirmation-${student._id}`)
			.setValue(student.username);
		await wrapper
			.get(`#delete-teacher-password-${student._id}`)
			.setValue("julio-password");
		await wrapper
			.findAll("form")
			.find(form => form.text().includes("Permanently delete"))
			?.trigger("submit.prevent");
		await flushPromises();

		expect(deleteAdminStudentRecords).toHaveBeenCalledWith(
			student._id,
			student.username,
			"julio-password"
		);
		expect(wrapper.findAll(".student-management__student")).toHaveLength(0);
		expect(wrapper.text()).toContain("Operation delete-operation");
		expect(wrapper.text()).toContain("Recent deletion receipts");
		expect(wrapper.text()).toContain(deletionReceipt.operationID);
		expect(click).toHaveBeenCalledOnce();
		vi.unstubAllGlobals();
	});

	it("keeps recent subject-linked deletion receipts available to Julio", async () => {
		vi.mocked(fetchAdminStudentDeletionReceipts).mockResolvedValueOnce({
			receipts: [deletionReceipt],
			retentionDays: 90
		});
		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain("Recent deletion receipts");
		expect(wrapper.text()).toContain(
			"Completed receipts remain for 90 days"
		);
		expect(wrapper.text()).toContain("maria-7");
		expect(wrapper.text()).toContain(deletionReceipt.operationID);
		expect(wrapper.text()).toContain("Deleted by Julio");
		expect(
			wrapper
				.findAll("button")
				.some(button => button.text() === "Download receipt")
		).toBe(true);
	});

	it("shows unfinished receipts without inventing an expiry date", async () => {
		vi.mocked(fetchAdminStudentDeletionReceipts).mockResolvedValueOnce({
			receipts: [
				{
					...deletionReceipt,
					completedAt: null,
					deletedRecords: null,
					expiresAt: null,
					status: "needs-retry"
				}
			],
			retentionDays: 90
		});
		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain("Unfinished receipts remain");
		expect(wrapper.text()).toContain("kept until deletion is resolved");
		expect(wrapper.text()).not.toContain("available through Never");
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
			},
			{
				...student,
				_id: "student-5",
				username: "sofia-3",
				credentialState: "social",
				socialProviders: ["google"]
			},
			{
				...student,
				_id: "student-6",
				username: "mateo-8",
				credentialState: "social",
				socialProviders: ["apple"]
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
		expect(wrapper.text()).toContain("Google connected");
		expect(wrapper.text()).toContain("Apple connected");
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
				retentionExpiresAt: "2026-10-27T22:45:00.000Z",
				projectCount: 3
			}
		]);

		const wrapper = mountManagement();
		await flushPromises();

		expect(
			wrapper.get('[data-testid="student-project-count"]').text()
		).toBe("3");
		expect(wrapper.get('[data-testid="student-last-sign-in"]').text()).toBe(
			"Jul 28, 2026"
		);
		expect(
			wrapper.get('[data-testid="student-last-project-save"]').text()
		).toBe("Jul 29, 2026");
		expect(
			wrapper.get('[data-testid="student-retention-expiry"]').text()
		).toBe("Oct 27, 2026");
		expect(wrapper.text()).not.toMatch(/\b\d{1,2}:\d{2}\b/);
	});

	it("shows a stranded retention deletion for Julio to retry", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([
			{
				...student,
				active: false,
				deletionPending: true,
				retentionExpiresAt: "2026-07-29T12:00:00.000Z"
			}
		]);
		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain("Deletion needs retry");
		expect(
			wrapper
				.findAll("button")
				.find(button => button.text() === "Delete records")
				?.attributes("disabled")
		).toBeUndefined();
		expect(
			wrapper
				.findAll("button")
				.find(button => button.text() === "Correct username")
				?.attributes("disabled")
		).toBeDefined();
		expect(wrapper.find('[data-testid="project-review"]').exists()).toBe(
			false
		);
	});

	it("directs expired accounts to deletion instead of reset or reactivation", async () => {
		vi.mocked(fetchAdminStudents).mockResolvedValueOnce([
			{
				...student,
				active: false,
				credentialState: "password",
				retentionExpiresAt: new Date(Date.now() - 60_000).toISOString()
			}
		]);
		const wrapper = mountManagement();
		await flushPromises();
		const button = (label: string) =>
			wrapper
				.findAll("button")
				.find(candidate => candidate.text() === label);

		expect(wrapper.text()).toContain("Retention expired");
		expect(wrapper.text()).toContain("Retention expired — delete records");
		expect(
			button("Correct username")?.attributes("disabled")
		).toBeUndefined();
		expect(button("Reset access")?.attributes("disabled")).toBeDefined();
		expect(button("Enable")?.attributes("disabled")).toBeDefined();
		expect(
			button("Export records")?.attributes("disabled")
		).toBeUndefined();
		expect(
			button("Delete records")?.attributes("disabled")
		).toBeUndefined();
	});

	it("labels automatic retention receipts separately", async () => {
		vi.mocked(fetchAdminStudentDeletionReceipts).mockResolvedValueOnce({
			receipts: [
				{
					...deletionReceipt,
					reason: "retention-expiry"
				}
			],
			retentionDays: 90
		});
		const wrapper = mountManagement();
		await flushPromises();

		expect(wrapper.text()).toContain("Automatic retention deletion");
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
		vi.mocked(fetchAdminStudentDeletionReceipts).mockResolvedValueOnce({
			receipts: [deletionReceipt],
			retentionDays: 90
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
		expect(wrapper.text()).toContain(deletionReceipt.operationID);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Disable")
			?.trigger("click");
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
		expect(wrapper.text()).not.toContain("CODE-ONLY-ONCE");
		expect(wrapper.text()).not.toContain("maria-7");
		expect(wrapper.text()).not.toContain(deletionReceipt.operationID);
	});
});
