// test/store.app.bootstrap.spec.test.ts
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { broadcastStudentSessionEnded } from "@/modules/studentSessionBroadcast";
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

vi.mock("@/modules/studentSessionBroadcast", () => ({
	broadcastStudentSessionChanged: vi.fn(),
	broadcastStudentSessionEnded: vi.fn(),
	cancelStudentLogoutInOtherTabs: vi.fn(),
	prepareStudentLogoutInOtherTabs: vi.fn()
}));

describe("app store bootstrapSession()", () => {
	beforeEach(() => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
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
	});

	it("hydrates a student session without creating a teacher session", async () => {
		(apiMod.api.get as any)
			.mockResolvedValueOnce({ data: { adminID: null } })
			.mockResolvedValueOnce({
				data: {
					student: {
						_id: "student-1",
						username: "maria-7",
						active: true
					},
					requiresPasswordSetup: true
				}
			});

		const app = useAppStore();
		await app.bootstrapSession();

		expect(apiMod.api.get).toHaveBeenNthCalledWith(1, "/accounts/me");
		expect(apiMod.api.get).toHaveBeenNthCalledWith(2, "/students/session");
		expect(app.currentUser?.username).toBe("maria-7");
		expect(app.studentRequiresPasswordSetup).toBe(true);
		expect(app.currentAdmin).toBeNull();
	});

	it("keeps a visitor logged out when no student session exists", async () => {
		(apiMod.api.get as any)
			.mockResolvedValueOnce({ data: { adminID: null } })
			.mockResolvedValueOnce({
				data: {
					student: null,
					requiresPasswordSetup: false
				}
			});

		const app = useAppStore();
		await app.bootstrapSession();

		expect(app.currentAdmin).toBeNull();
		expect(app.currentUser).toBeNull();
		expect(app.studentRequiresPasswordSetup).toBe(false);
	});

	it("clears session on error", async () => {
		(apiMod.api.get as any).mockRejectedValueOnce(new Error("no cookie"));

		const app = useAppStore();
		await app.bootstrapSession();

		expect(app.currentAdmin).toBeNull();
		expect(app.currentUser).toBeNull();
		expect(app.studentRequiresPasswordSetup).toBe(false);
	});

	it("clears the cached Admin identity when a later bootstrap probe fails", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		(apiMod.api.get as any).mockRejectedValueOnce(
			new Error("session probe unavailable")
		);

		await app.bootstrapSession();

		expect(app.currentAdmin).toBeNull();
		expect(app.sessionBootstrapStatus).toBe("failed");
	});

	it("does not let a delayed bootstrap overwrite an interactive login", async () => {
		let resolveBootstrap:
			| ((value: {
					data: {
						adminID: null;
					};
			  }) => void)
			| undefined;
		(apiMod.api.get as any).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolveBootstrap = resolve;
				})
		);
		const app = useAppStore();
		const bootstrap = app.bootstrapSession();

		app.setStudentSession({
			student: {
				_id: "student-new",
				username: "liam-4",
				active: true
			},
			requiresPasswordSetup: false
		});
		resolveBootstrap?.({ data: { adminID: null } });
		await bootstrap;

		expect(app.currentUser?._id).toBe("student-new");
		expect(app.currentAdmin).toBeNull();
		expect(apiMod.api.get).toHaveBeenCalledOnce();
	});

	it("sets a new student password and clears the setup requirement", async () => {
		const requestID = "12345678-1234-1234-1234-123456789012";
		(apiMod.api.put as any).mockResolvedValueOnce({
			data: {
				student: {
					_id: "student-1",
					username: "maria-7",
					active: true,
					passwordSetAt: "2026-07-29T13:00:00.000Z"
				},
				requiresPasswordSetup: false,
				passwordSetupRequestID: requestID
			}
		});

		const app = useAppStore();
		app.setStudentSession({
			student: {
				_id: "student-1",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: true
		});

		await app.completeStudentPassword(
			"long-student-passphrase",
			requestID
		);

		expect(apiMod.api.put).toHaveBeenCalledWith(
			"/students/session/password",
			{ password: "long-student-passphrase", requestID }
		);
		expect(app.currentUser?.passwordSetAt).toBe(
			"2026-07-29T13:00:00.000Z"
		);
		expect(app.studentRequiresPasswordSetup).toBe(false);
	});

	it("retains the Admin identity after rejected logout only when Julio is confirmed", async () => {
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		(apiMod.api.delete as any).mockRejectedValueOnce(
			new Error("logout response lost")
		);
		(apiMod.api.get as any)
			.mockResolvedValueOnce({ data: { adminID: julio._id } })
			.mockResolvedValueOnce({ data: { currentAdmin: julio } });
		const app = useAppStore();
		app.setCurrentAdmin(julio);

		await app.logout();

		expect(apiMod.api.get).toHaveBeenNthCalledWith(1, "/accounts/me");
		expect(apiMod.api.get).toHaveBeenNthCalledWith(
			2,
			"/admins/loggedin"
		);
		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(broadcastStudentSessionEnded).not.toHaveBeenCalled();
	});

	it("clears Admin data after rejected logout when Julio is not confirmed", async () => {
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		(apiMod.api.delete as any).mockRejectedValueOnce(
			new Error("logout response lost")
		);
		(apiMod.api.get as any).mockResolvedValueOnce({
			data: { adminID: null }
		});
		const app = useAppStore();
		app.setCurrentAdmin(julio);

		await app.logout();

		expect(app.currentAdmin).toBeNull();
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
	});
});
