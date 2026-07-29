import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import AdminProfile from "@/components/AdminProfile.vue";
import { useAppStore } from "@/stores/app";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		put: vi.fn()
	}
}));

describe("Julio teacher profile", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("presents the admin-backed identity as the sole teacher account", () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mount(AdminProfile, {
			global: { stubs: { AccountSecurity: true } }
		});

		expect(wrapper.text()).toContain("Julio's private settings");
		expect(wrapper.text()).toContain("Sole account");
		expect(wrapper.text()).toContain("julio@example.com");
		expect(wrapper.text()).not.toMatch(/Student|Tutor|Directory|Mail/i);
	});

	it("saves Julio's display name through the teacher account endpoint", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		vi.mocked(api.put).mockResolvedValueOnce({ data: {} });
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				currentAdmin: {
					_id: "julio",
					name: "Mr. Julio",
					email: "julio@example.com",
					editAdmins: false,
					saveEdit: "Save"
				}
			}
		});

		const wrapper = mount(AdminProfile, {
			global: { stubs: { AccountSecurity: true } }
		});
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Edit display name")
			?.trigger("click");
		await wrapper.get("#teacher-name").setValue("Mr. Julio");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Save name")
			?.trigger("click");
		await flushPromises();

		expect(api.put).toHaveBeenCalledWith("/admins/julio", {
			name: "Mr. Julio"
		});
		expect(api.get).toHaveBeenCalledWith("/admins/loggedin");
		expect(wrapper.text()).toContain("Name updated.");
	});
});
