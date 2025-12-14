// components/accountmanagement.login.spec.test.ts
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import AccountManagement from "../src/components/AccountManagement.vue";
import { useAppStore } from "../src/stores/app";
import * as apiMod from "../src/api";

// Mock the axios client we export from "@/api"
vi.mock("@/api", () => {
	const mock = {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { baseURL: "/api", withCredentials: true }
	};
	return { api: mock };
});

describe("AccountManagement.vue login (happy path)", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("logs in a user, updates the store, and closes the login modal", async () => {
		const app = useAppStore();
		// Open the login modal (component checks app.loginBlock)
		app.setLoginBlock(true);

		// Mock /accounts/login result with a user
		(apiMod.api.post as any).mockResolvedValueOnce({
			data: {
				currentUser: {
					_id: "u123",
					name: "User",
					email: "user@example.com",
					age: 20,
					state: "GA"
				}
			}
		});

		const wrapper = mount(AccountManagement);

		// Fill form and submit
		await wrapper.get("#uname").setValue("user@example.com");
		await wrapper.get("#psw1").setValue("secret");
		await wrapper.get("form").trigger("submit.prevent");

		// Assert API call
		expect(apiMod.api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{ email: "user@example.com", password: "secret", remember: false },
			{ withCredentials: true }
		);

		// Store updated with currentUser and modal closed
		expect(app.currentUser?.email).toBe("user@example.com");
		expect(app.loginBlock).toBe(false);

		// Buttons reflect logged-in state (Logout visible, Login/Signup hidden)
		// These live in TheHeader normally, but AccountManagement just closes the modal.
		// So we assert modal visibility based on class toggling.
		const modal = wrapper.find(".loginForm.modal");
		expect(modal.exists()).toBe(true);
		// When closed, the "showLogin" class should be absent:
		expect(modal.classes()).not.toContain("showLogin");
	});
});
