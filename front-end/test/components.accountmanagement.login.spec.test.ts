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
		const wrapper = mount(AccountManagement, { attachTo: document.body });
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

		await wrapper.get("#admin-email").setValue(julio.email);
		await wrapper.get("#admin-password").setValue(passphrase);
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
		expect(wrapper.get("#admin-password").element).toHaveProperty("value", "");
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

		await wrapper.get("#admin-email").setValue("student@example.com");
		await wrapper.get("#admin-password").setValue("not-a-teacher");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"This sign-in is available only to Julio."
		);
		expect(app.currentAdmin).toBeNull();
		expect(wrapper.text()).not.toMatch(/Sign up|Create account/i);
		wrapper.unmount();
	});

	it("renders only the inline login controls", () => {
		const { wrapper } = mountLogin();

		expect(wrapper.get('label[for="admin-email"]').text()).toBe("Email");
		expect(wrapper.get('label[for="admin-password"]').text()).toBe("Password");
		expect(wrapper.get('input[name="remember"]').exists()).toBe(true);
		expect(wrapper.get('button[type="submit"]').text()).toBe("Log in");
		expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
		expect(wrapper.find('button[type="button"]').exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(
			/Student|Tutor|Sign up|Create account|Cancel/i
		);
		wrapper.unmount();
	});

	it("submits the remember preference", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				currentAdmin: {
					_id: "julio",
					name: "Julio",
					email: "julio@example.com"
				}
			}
		});
		const { wrapper } = mountLogin();

		await wrapper.get("#admin-email").setValue("julio@example.com");
		await wrapper.get("#admin-password").setValue("teacher-password");
		await wrapper.get('input[name="remember"]').setValue(true);
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{
				email: "julio@example.com",
				password: "teacher-password",
				remember: true
			},
			{ withCredentials: true }
		);
		wrapper.unmount();
	});
});
