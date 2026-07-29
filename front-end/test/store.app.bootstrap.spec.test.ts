// test/store.app.bootstrap.spec.test.ts
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../src/stores/app";
import * as apiMod from "../src/api";

// mock axios client
vi.mock("@/api", () => {
	const mock = {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn()
	};
	return { api: mock };
});

describe("app store bootstrapSession()", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("hydrates Julio's teacher account through the admin session", async () => {
		(apiMod.api.get as any)
			.mockResolvedValueOnce({ data: { adminID: "julio" } })
			.mockResolvedValueOnce({
				data: {
					currentAdmin: {
						_id: "julio",
						name: "Julio",
						email: "julio@example.com"
					}
				}
			});

		const app = useAppStore();
		await app.bootstrapSession();

		expect(apiMod.api.get).toHaveBeenNthCalledWith(1, "/accounts/me");
		expect(apiMod.api.get).toHaveBeenNthCalledWith(2, "/admins/loggedin");
		expect(app.currentAdmin?._id).toBe("julio");
		expect(app.currentUser).toBeNull();
		expect(app.currentTutor).toBeNull();
	});

	it("clears session on error", async () => {
		(apiMod.api.get as any).mockRejectedValueOnce(new Error("no cookie"));

		const app = useAppStore();
		await app.bootstrapSession();

		expect(app.currentAdmin).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(app.currentUser).toBeNull();
	});
});
