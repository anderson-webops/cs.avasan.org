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
		document.body.innerHTML = "";
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

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

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

		expect(document.querySelector("#login-dialog")).toBeNull();
		wrapper.unmount();
	});

	it("renders login as an accessible dialog and switches to signup without dead links", async () => {
		const app = useAppStore();
		app.setLoginBlock(true);

		const wrapper = mount(AccountManagement, {
			attachTo: document.body,
			global: { stubs: { teleport: true } }
		});

		const dialog = document.querySelector("#login-dialog");
		expect(dialog?.getAttribute("role")).toBe("dialog");
		expect(dialog?.getAttribute("aria-modal")).toBe("true");
		expect(dialog?.getAttribute("aria-labelledby")).toBe(
			"login-dialog-title"
		);
		expect(document.querySelector('a[href="#"]')).toBeNull();

		const signUpButton = wrapper
			.findAll("button")
			.find(button => button.text() === "Sign up");
		if (!signUpButton) throw new Error("Sign up button was not rendered.");
		await signUpButton.trigger("click");

		expect(app.loginBlock).toBe(false);
		expect(app.signupBlock).toBe(true);
		expect(document.querySelector("#signup-dialog")).not.toBeNull();
		wrapper.unmount();
	});
});
