import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { fetchAdminRecipients } from "@/modules/adminRecipients";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn()
	}
}));

describe("admin recipient client", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loads admin recipients from the authenticated backend endpoint", async () => {
		(api.get as any).mockResolvedValueOnce({
			data: {
				recipients: [
					{ name: "Test Recipient", emails: ["primary@example.invalid"] }
				]
			}
		});

		await expect(fetchAdminRecipients()).resolves.toEqual([
			{ name: "Test Recipient", emails: ["primary@example.invalid"] }
		]);
		expect(api.get).toHaveBeenCalledWith("/admin-mail/recipients", {
			withCredentials: true
		});
	});

	it("returns an empty list for malformed but successful responses", async () => {
		(api.get as any).mockResolvedValueOnce({ data: { recipients: null } });

		await expect(fetchAdminRecipients()).resolves.toEqual([]);
	});
});
