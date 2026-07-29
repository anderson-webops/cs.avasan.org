import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { useEditable } from "@/composables/useEditable";
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

describe("useEditable teacher profile support", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("updates Julio through the admin-backed teacher account", async () => {
		const app = useAppStore();
		const { save } = useEditable("admin");
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		vi.mocked(api.put).mockResolvedValueOnce({ data: {} });

		await save(julio);

		expect(api.post).not.toHaveBeenCalled();
		expect(api.put).toHaveBeenCalledWith("/admins/julio", julio);
		expect(app.currentAdmin).toEqual(julio);
		expect(app.currentUser).toBeNull();
		expect(app.currentTutor).toBeNull();
	});
});
