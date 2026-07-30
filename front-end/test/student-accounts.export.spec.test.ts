import { describe, expect, it, vi } from "vitest";

const apiPost = vi.fn();

vi.mock("@/api", () => ({
	api: {
		post: apiPost
	}
}));

const { exportAdminStudentRecords } = await import("@/modules/studentAccounts");

describe("student record export download", () => {
	it("keeps the streamed response as a Blob instead of parsing classroom records", async () => {
		const blob = new Blob(["streamed classroom export"], {
			type: "application/json"
		});
		apiPost.mockResolvedValueOnce({ data: blob });

		await expect(
			exportAdminStudentRecords("student-1", "julio-password")
		).resolves.toEqual({ blob });
		expect(apiPost).toHaveBeenCalledWith(
			"/admins/students/student-1/export",
			{ teacherPassword: "julio-password" },
			{ responseType: "blob" }
		);
	});
});
