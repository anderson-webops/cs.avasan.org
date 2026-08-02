import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import {
	currentStudentOAuthReturnTo,
	fetchStudentOAuthProviderAvailability,
	startStudentOAuthConnection,
	studentOAuthSignInHref
} from "@/modules/studentOAuth";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn()
	}
}));

describe("student OAuth API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.history.replaceState({}, "", "/ide");
	});

	it("normalizes provider availability to booleans", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { apple: 1, google: true }
		});

		await expect(fetchStudentOAuthProviderAvailability()).resolves.toEqual({
			apple: false,
			google: true
		});
		expect(api.get).toHaveBeenCalledWith("/students/oauth/providers");
	});

	it("starts repeat sign-in without a username or access code", () => {
		window.history.replaceState(
			{},
			"",
			"/ide?studentOAuthStatus=success&tab=files#editor"
		);

		const href = studentOAuthSignInHref("google");
		const target = new URL(href, window.location.origin);

		expect(target.pathname).toBe("/api/students/oauth/google/start");
		expect(target.searchParams.get("returnTo")).toBe(
			"/ide?tab=files#editor"
		);
		expect(target.searchParams.has("username")).toBe(false);
		expect(target.searchParams.has("accessCode")).toBe(false);
	});

	it("connects a provider through the setup session only", async () => {
		window.history.replaceState(
			{},
			"",
			"/?course=python-1&studentOAuthError=cancelled"
		);
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { authorizationUrl: "https://accounts.example/authorize" }
		});

		await expect(startStudentOAuthConnection("apple")).resolves.toBe(
			"https://accounts.example/authorize"
		);
		expect(api.post).toHaveBeenCalledWith("/students/oauth/apple/connect", {
			returnTo: "/?course=python-1"
		});
		const requestBody = vi.mocked(api.post).mock.calls[0]?.[1];
		expect(requestBody).not.toHaveProperty("username");
		expect(requestBody).not.toHaveProperty("accessCode");
	});

	it("removes callback markers from return locations", () => {
		window.history.replaceState(
			{},
			"",
			"/student-privacy?studentOAuthError=provider_error&notice=1#accounts"
		);

		expect(currentStudentOAuthReturnTo()).toBe(
			"/student-privacy?notice=1#accounts"
		);
	});
});
