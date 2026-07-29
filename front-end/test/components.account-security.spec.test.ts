import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import { broadcastStudentSessionEnded } from "@/modules/studentSessionBroadcast";
import { useAppStore } from "@/stores/app";

vi.mock("@/api", () => ({
	api: {
		delete: vi.fn(),
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn()
	}
}));

vi.mock("@/modules/studentSessionBroadcast", () => ({
	broadcastStudentSessionChanged: vi.fn(),
	broadcastStudentSessionEnded: vi.fn(),
	cancelStudentLogoutInOtherTabs: vi.fn(),
	prepareStudentLogoutInOtherTabs: vi.fn()
}));

describe("AccountSecurity", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("uses entity-specific password control ids without email mutation", () => {
		const first = mount(AccountSecurity, {
			props: {
				entityId: "julio-primary"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				entityId: "julio-backup"
			}
		});

		expect(first.find("label").attributes("for")).toBe(
			"account-security-admin-julio-primary-current-password"
		);
		expect(second.find("label").attributes("for")).toBe(
			"account-security-admin-julio-backup-current-password"
		);
		expect(
			first
				.find(
					"#account-security-admin-julio-primary-current-password"
				)
				.exists()
		).toBe(true);
		expect(
			second
				.find(
					"#account-security-admin-julio-backup-current-password"
				)
				.exists()
		).toBe(true);
		expect(first.get("h2").text()).toBe("Change password");
		expect(first.text()).not.toMatch(/Email|Update email/i);
		expect(api.post).not.toHaveBeenCalled();
		expect(first.text()).not.toMatch(/Student|Tutor|whenever you need/i);
	});

	it("notifies every tab after Julio changes his password", async () => {
		const changedJulio = {
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			passwordChangedAt: "2026-07-29T11:00:00.000Z",
			editAdmins: false,
			saveEdit: "Save"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				currentAdmin: changedJulio,
				message: "Password updated successfully."
			}
		});
		const wrapper = mount(AccountSecurity, {
			props: {
				entityId: "julio-primary"
			}
		});

		await wrapper
			.get("#account-security-admin-julio-primary-current-password")
			.setValue("old-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-new-password")
			.setValue("new-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-confirm-password")
			.setValue("new-teacher-password");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Update password")
			?.trigger("click");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/changePassword/julio-primary",
			{
				currentPassword: "old-teacher-password",
				newPassword: "new-teacher-password"
			},
			{ timeout: 30_000 }
		);
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
		expect(wrapper.text()).toContain("Password updated successfully.");
		expect(useAppStore().currentAdmin?.passwordChangedAt).toBe(
			changedJulio.passwordChangedAt
		);
	});

	it("clears all passwords before the change response settles", async () => {
		const changedJulio = {
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			passwordChangedAt: "2026-07-29T11:00:00.000Z",
			editAdmins: false,
			saveEdit: "Save"
		};
		let resolvePasswordChange:
			| ((value: {
					data: {
						currentAdmin: typeof changedJulio;
						message: string;
					};
			  }) => void)
			| undefined;
		vi.mocked(api.post).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolvePasswordChange = resolve;
				})
		);
		const wrapper = mount(AccountSecurity, {
			props: { entityId: changedJulio._id }
		});
		const inputs = wrapper.findAll('input[type="password"]');
		await inputs[0]!.setValue("old-teacher-password");
		await inputs[1]!.setValue("new-teacher-password");
		await inputs[2]!.setValue("new-teacher-password");

		await wrapper.get("button").trigger("click");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/changePassword/julio-primary",
			{
				currentPassword: "old-teacher-password",
				newPassword: "new-teacher-password"
			},
			{ timeout: 30_000 }
		);
		for (const input of inputs) {
			expect(input.element).toHaveProperty("value", "");
		}

		resolvePasswordChange?.({
			data: {
				currentAdmin: changedJulio,
				message: "Password updated successfully."
			}
		});
		await flushPromises();
	});

	it("accepts a lost password-change response only when Julio is still confirmed", async () => {
		const julio = {
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			passwordChangedAt: "2026-07-29T10:00:00.000Z",
			editAdmins: false,
			saveEdit: "Save"
		};
		const changedJulio = {
			...julio,
			passwordChangedAt: "2026-07-29T11:00:00.000Z"
		};
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("password response lost")
		);
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { currentAdmin: changedJulio }
		});
		const wrapper = mount(AccountSecurity, {
			props: {
				entityId: julio._id
			}
		});

		await wrapper
			.get("#account-security-admin-julio-primary-current-password")
			.setValue("old-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-new-password")
			.setValue("new-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-confirm-password")
			.setValue("new-teacher-password");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Update password")
			?.trigger("click");
		await flushPromises();

		expect(api.get).toHaveBeenCalledWith("/admins/loggedin");
		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
		expect(wrapper.text()).toContain("Password updated successfully.");
	});

	it("never reports success when a lost response leaves passwordChangedAt unchanged", async () => {
		const julio = {
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			passwordChangedAt: "2026-07-29T10:00:00.000Z",
			editAdmins: false,
			saveEdit: "Save"
		};
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("password response lost")
		);
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { currentAdmin: julio }
		});
		const wrapper = mount(AccountSecurity, {
			props: {
				entityId: julio._id
			}
		});

		await wrapper
			.get("#account-security-admin-julio-primary-current-password")
			.setValue("old-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-new-password")
			.setValue("new-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-confirm-password")
			.setValue("new-teacher-password");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Update password")
			?.trigger("click");
		await flushPromises();

		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(broadcastStudentSessionEnded).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain(
			"Password change could not be confirmed."
		);
		expect(wrapper.text()).not.toContain("Password updated successfully.");
	});

	it("clears every password after a definitive password rejection", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		vi.mocked(api.post).mockRejectedValueOnce({
			response: {
				data: { message: "Current password is incorrect." },
				status: 400
			}
		});
		const wrapper = mount(AccountSecurity, {
			props: { entityId: "julio-primary" }
		});
		const inputs = wrapper.findAll('input[type="password"]');
		await inputs[0]!.setValue("old-teacher-password");
		await inputs[1]!.setValue("new-teacher-password");
		await inputs[2]!.setValue("new-teacher-password");

		await wrapper.get("button").trigger("click");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Current password is incorrect."
		);
		for (const input of inputs) {
			expect(input.element).toHaveProperty("value", "");
		}
		expect(api.get).not.toHaveBeenCalled();
	});

	it("clears every password after local password validation fails", async () => {
		const wrapper = mount(AccountSecurity, {
			props: { entityId: "julio-primary" }
		});
		const inputs = wrapper.findAll('input[type="password"]');
		await inputs[0]!.setValue("old-teacher-password");

		await wrapper.get("button").trigger("click");
		await wrapper.vm.$nextTick();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"New password is required."
		);
		for (const input of inputs) {
			expect(input.element).toHaveProperty("value", "");
		}

		await inputs[0]!.setValue("old-teacher-password");
		await inputs[1]!.setValue("new-teacher-password");
		await inputs[2]!.setValue("different-teacher-password");

		await wrapper.get("button").trigger("click");
		await wrapper.vm.$nextTick();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"New passwords do not match."
		);
		for (const input of inputs) {
			expect(input.element).toHaveProperty("value", "");
		}
		expect(api.post).not.toHaveBeenCalled();
	});

	it("clears typed passwords when the Admin identity changes", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		const wrapper = mount(AccountSecurity, {
			props: { entityId: "julio-primary" }
		});
		const inputs = wrapper.findAll('input[type="password"]');
		for (const input of inputs) {
			await input.setValue("teacher-password");
		}

		app.setCurrentAdmin(null);
		await wrapper.vm.$nextTick();

		for (const input of inputs) {
			expect(input.element).toHaveProperty("value", "");
		}
	});

	it("hides all Admin data when a lost password change cannot be confirmed", async () => {
		const julio = {
			_id: "julio-primary",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		app.setUsers([
			{
				_id: "student-private",
				username: "maria-7",
				active: true
			}
		]);
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("password response lost")
		);
		vi.mocked(api.get).mockRejectedValueOnce(
			new Error("Admin probe unavailable")
		);
		const wrapper = mount(AccountSecurity, {
			props: {
				entityId: julio._id
			}
		});

		await wrapper
			.get("#account-security-admin-julio-primary-current-password")
			.setValue("old-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-new-password")
			.setValue("new-teacher-password");
		await wrapper
			.get("#account-security-admin-julio-primary-confirm-password")
			.setValue("new-teacher-password");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Update password")
			?.trigger("click");
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
		expect(app.users).toEqual([]);
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
	});
});
