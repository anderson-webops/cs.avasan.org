import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import AccountManagement from "@/components/AccountManagement.vue";
import { useAppStore } from "@/stores/app";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { baseURL: "/api", withCredentials: true }
	}
}));

describe("AccountManagement teacher login", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	function mountLogin() {
		const app = useAppStore();
		app.setLoginBlock(true);
		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});
		return { app, wrapper };
	}

	it("logs Julio in as the sole teacher account", async () => {
		const passphrase = "teacher-login-test";
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { currentAdmin: julio }
		});
		const { app, wrapper } = mountLogin();

		await wrapper.get("#teacher-email").setValue(julio.email);
		await wrapper.get("#teacher-password").setValue(passphrase);
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{
				email: julio.email,
				password: passphrase,
				remember: false
			},
			{ withCredentials: true }
		);
		expect(app.currentAdmin).toEqual(julio);
		expect(app.currentUser).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.loginBlock).toBe(false);
		expect(document.querySelector("#teacher-login-dialog")).toBeNull();
		wrapper.unmount();
	});

	it("rejects non-teacher login responses without exposing signup", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				currentUser: {
					_id: "student",
					name: "Student"
				}
			}
		});
		const { app, wrapper } = mountLogin();

		await wrapper.get("#teacher-email").setValue("student@example.com");
		await wrapper.get("#teacher-password").setValue("not-a-teacher");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"This sign-in is available only to Julio."
		);
		expect(app.currentAdmin).toBeNull();
		expect(app.loginBlock).toBe(true);
		expect(wrapper.text()).not.toMatch(/Sign up|Create account/i);
		wrapper.unmount();
	});

	it("renders an accessible teacher dialog and explains public access", () => {
		const { wrapper } = mountLogin();
		const dialog = document.querySelector("#teacher-login-dialog");

		expect(dialog?.getAttribute("role")).toBe("dialog");
		expect(dialog?.getAttribute("aria-modal")).toBe("true");
		expect(dialog?.getAttribute("aria-labelledby")).toBe(
			"teacher-login-dialog-title"
		);
		expect(wrapper.text()).toContain("Students do not need an account.");
		expect(document.querySelector('a[href="#"]')).toBeNull();
		expect(wrapper.text()).not.toMatch(/Sign up|Create account/i);
		wrapper.unmount();
	});
});
