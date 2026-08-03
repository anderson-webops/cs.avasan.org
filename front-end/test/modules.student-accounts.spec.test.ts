import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import {
	createAdminStudent,
	fetchStudentSession,
	refreshStudentSessionActivity,
	resetAdminStudentAccess,
	setAdminStudentActive,
	setAdminStudentRecordPreservation,
	setStudentPassword,
	signInStudent
} from "@/modules/studentAccounts";

vi.mock("@/api", () => ({
	api: {
		delete: vi.fn(),
		get: vi.fn(),
		patch: vi.fn(),
		post: vi.fn(),
		put: vi.fn()
	}
}));

const student = {
	_id: "student-1",
	username: "maria-7",
	active: true
};

describe("student account API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("uses one secret field for a password or one-time access code", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { student, requiresPasswordSetup: true }
		});

		await signInStudent("maria-7", "one-time-code");

		expect(api.post).toHaveBeenCalledWith("/students/session", {
			username: "maria-7",
			secret: "one-time-code"
		});
	});

	it("sends a new password only to the setup endpoint", async () => {
		vi.mocked(api.put).mockResolvedValueOnce({
			data: { student, requiresPasswordSetup: false }
		});

		await setStudentPassword(
			"student-passphrase",
			"12345678-1234-1234-1234-123456789012"
		);

		expect(api.put).toHaveBeenCalledWith("/students/session/password", {
			password: "student-passphrase",
			requestID: "12345678-1234-1234-1234-123456789012"
		});
	});

	it("touches activity only on the explicit trusted heartbeat request", async () => {
		vi.mocked(api.get)
			.mockResolvedValueOnce({
				data: { student, requiresPasswordSetup: false }
			})
			.mockResolvedValueOnce({
				data: { student, requiresPasswordSetup: false }
			})
			.mockResolvedValueOnce({
				data: {
					student,
					requiresPasswordSetup: false,
					passwordSetupRequestID:
						"12345678-1234-1234-1234-123456789012"
				}
			});

		await fetchStudentSession();
		await refreshStudentSessionActivity();
		await fetchStudentSession(
			"12345678-1234-1234-1234-123456789012"
		);

		expect(api.get).toHaveBeenNthCalledWith(1, "/students/session");
		expect(api.get).toHaveBeenNthCalledWith(2, "/students/session", {
			headers: { "X-Student-Activity": "1" }
		});
		expect(api.get).toHaveBeenNthCalledWith(3, "/students/session", {
			headers: {
				"X-Password-Setup-Request-ID":
					"12345678-1234-1234-1234-123456789012"
			}
		});
	});

	it("requires Julio's password for creation and access reset", async () => {
		vi.mocked(api.post)
			.mockResolvedValueOnce({
				data: { student, accessCode: "FIRST-CODE" }
			})
			.mockResolvedValueOnce({
				data: { student, accessCode: "RESET-CODE" }
			});

		await createAdminStudent("maria-7", "julio-password");
		await resetAdminStudentAccess(student._id, "julio-password");

		expect(api.post).toHaveBeenNthCalledWith(1, "/admins/students", {
			username: "maria-7",
			teacherPassword: "julio-password"
		});
		expect(api.post).toHaveBeenNthCalledWith(
			2,
			`/admins/students/${student._id}/access-code`,
			{ teacherPassword: "julio-password" }
		);
	});

	it("enables or disables a student without a delete request", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce({
			data: { student: { ...student, active: false } }
		});

		await setAdminStudentActive(student._id, false);

		expect(api.patch).toHaveBeenCalledWith(
			`/admins/students/${student._id}`,
			{ active: false }
		);
		expect(api.delete).not.toHaveBeenCalled();
	});

	it("uses Julio's password to place a fixed-purpose preservation hold", async () => {
		const recordPreservation = {
			active: true,
			events: [
				{ action: "placed" as const, at: "2026-08-02T15:00:00.000Z" }
			],
			placedAt: "2026-08-02T15:00:00.000Z",
			purpose: "ferpa-inspection-review" as const,
			releasedAt: null
		};
		vi.mocked(api.put).mockResolvedValueOnce({
			data: { recordPreservation }
		});

		await expect(
			setAdminStudentRecordPreservation(
				student._id,
				true,
				"julio-password"
			)
		).resolves.toEqual(recordPreservation);

		expect(api.put).toHaveBeenCalledWith(
			`/admins/students/${student._id}/record-preservation`,
			{ active: true, teacherPassword: "julio-password" }
		);
	});
});
