import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StudentAccess from "@/components/StudentAccess.vue";
import {
	fetchStudentSession,
	setStudentPassword,
	signInStudent,
	signOutStudent
} from "@/modules/studentAccounts";
import {
	fetchStudentOAuthProviderAvailability,
	navigateToStudentOAuth,
	startStudentOAuthConnection,
	studentOAuthSignInHref
} from "@/modules/studentOAuth";
import {
	broadcastStudentSessionEnded,
	cancelStudentLogoutInOtherTabs,
	subscribeToStudentSessionChanged
} from "@/modules/studentSessionBroadcast";
import {
	endStudentSessionHandoff,
	prepareStudentSessionHandoff,
	resumeStudentSessionHandoff
} from "@/modules/studentSessionHandoff";
import { useAppStore } from "@/stores/app";

vi.mock("@/modules/studentAccounts", () => ({
	fetchStudentSession: vi.fn(),
	refreshStudentSessionActivity: vi.fn(),
	setStudentPassword: vi.fn(),
	signInStudent: vi.fn(),
	signOutStudent: vi.fn()
}));
vi.mock("@/modules/studentOAuth", () => ({
	emptyStudentOAuthProviderAvailability: {
		apple: false,
		google: false
	},
	fetchStudentOAuthProviderAvailability: vi.fn(),
	navigateToStudentOAuth: vi.fn(),
	startStudentOAuthConnection: vi.fn(),
	studentOAuthErrorMessages: {
		already_signed_in: "Another account is already signed in.",
		cancelled: "Google or Apple sign-in was cancelled.",
		identity_conflict:
			"That Google or Apple account is already connected to another student.",
		link_expired: "That connection request expired.",
		not_linked: "That provider account is not connected yet.",
		provider_error: "Provider sign-in failed.",
		provider_unavailable: "That provider is unavailable."
	},
	studentOAuthSignInHref: vi.fn(
		provider => `/api/students/oauth/${provider}/start?returnTo=%2F`
	)
}));
vi.mock("@/modules/studentSessionBroadcast", () => ({
	broadcastStudentSessionChanged: vi.fn(),
	broadcastStudentSessionEnded: vi.fn(),
	broadcastTrustedStudentActivity: vi.fn(),
	cancelStudentLogoutInOtherTabs: vi.fn(),
	prepareStudentLogoutInOtherTabs: vi.fn(),
	subscribeToStudentActivity: vi.fn(() => vi.fn()),
	subscribeToStudentSessionChanged: vi.fn(() => vi.fn())
}));
vi.mock("@/modules/studentSessionHandoff", () => ({
	endStudentSessionHandoff: vi.fn(),
	isStudentSessionHandoffError: vi.fn(() => false),
	prepareStudentSessionHandoff: vi.fn(),
	resumeStudentSessionHandoff: vi.fn(),
	suspendStudentSessionHandoff: vi.fn(async () => undefined),
	studentSessionHandoffErrorMessage: "Student project handoff failed."
}));

const student = {
	_id: "student-1",
	username: "maria-7",
	active: true
};

describe("StudentAccess", () => {
	beforeEach(() => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv("VITE_STUDENT_OAUTH_ENABLED", "true");
		setActivePinia(createPinia());
		vi.clearAllMocks();
		window.sessionStorage.clear();
		window.history.replaceState({}, "", "/");
		vi.mocked(fetchStudentOAuthProviderAvailability).mockResolvedValue({
			apple: false,
			google: false
		});
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	function mountAccess() {
		return mount(StudentAccess, {
			global: {
				plugins: [createPinia()]
			}
		});
	}

	it("asks shared browsers not to retain student credentials", async () => {
		vi.mocked(signInStudent).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		expect(wrapper.get("form").attributes("autocomplete")).toBe("off");
		expect(
			wrapper.get("#student-username").attributes("autocomplete")
		).toBe("off");
		expect(wrapper.get("#student-secret").attributes("autocomplete")).toBe(
			"off"
		);
		expect(wrapper.get(".student-access__privacy").attributes("href")).toBe(
			"/student-privacy"
		);

		await wrapper.get("#student-username").setValue("maria-7");
		await wrapper.get("#student-secret").setValue("one-time-code");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get("form").attributes("autocomplete")).toBe("off");
		expect(
			wrapper.get("#student-new-password").attributes("autocomplete")
		).toBe("off");
		expect(
			wrapper.get("#student-confirm-password").attributes("autocomplete")
		).toBe("off");
	});

	it("signs in with a username and password or access code", async () => {
		vi.mocked(signInStudent).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: false
		});
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		await wrapper.get("#student-username").setValue("  maria-7 ");
		await wrapper.get("#student-secret").setValue("one-time-code");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(signInStudent).toHaveBeenCalledWith("maria-7", "one-time-code");
		expect(wrapper.text()).toContain("maria-7");
		expect(wrapper.text()).toContain("Sign out");
		expect(wrapper.find("#student-secret").exists()).toBe(false);
	});

	it("starts repeat provider sign-in without using entered credentials", async () => {
		vi.mocked(fetchStudentOAuthProviderAvailability).mockResolvedValueOnce({
			apple: true,
			google: true
		});
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		await flushPromises();
		await wrapper.get("#student-username").setValue("maria-7");
		await wrapper.get("#student-secret").setValue("not-sent");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign in with Google")
			?.trigger("click");

		expect(studentOAuthSignInHref).toHaveBeenCalledWith("google");
		expect(navigateToStudentOAuth).toHaveBeenCalledWith(
			"/api/students/oauth/google/start?returnTo=%2F"
		);
		expect(startStudentOAuthConnection).not.toHaveBeenCalled();
		expect(signInStudent).not.toHaveBeenCalled();
	});

	it("offers provider connection only after Julio's code creates a setup session", async () => {
		vi.mocked(fetchStudentOAuthProviderAvailability).mockResolvedValueOnce({
			apple: true,
			google: true
		});
		vi.mocked(signInStudent).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: true
		});
		vi.mocked(startStudentOAuthConnection).mockResolvedValueOnce(
			"https://accounts.example/authorize"
		);
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		await flushPromises();
		expect(wrapper.text()).not.toContain("Connect Google");

		await wrapper.get("#student-username").setValue("maria-7");
		await wrapper.get("#student-secret").setValue("julio-one-time-code");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.text()).toContain("Choose how to sign in");
		expect(wrapper.text()).toContain("Connect Google");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Connect Google")
			?.trigger("click");
		await flushPromises();

		expect(startStudentOAuthConnection).toHaveBeenCalledWith("google");
		expect(navigateToStudentOAuth).toHaveBeenCalledWith(
			"https://accounts.example/authorize"
		);
		expect(startStudentOAuthConnection).toHaveBeenCalledTimes(1);
	});

	it("accepts and removes a successful provider callback marker", async () => {
		window.history.replaceState(
			{},
			"",
			"/python-ide?studentOAuthStatus=success&tab=files"
		);
		vi.mocked(fetchStudentSession).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: false
		});
		const app = useAppStore();
		const wrapper = mount(StudentAccess);
		await flushPromises();

		expect(fetchStudentSession).toHaveBeenCalledOnce();
		expect(app.currentUser?._id).toBe(student._id);
		expect(app.studentRequiresPasswordSetup).toBe(false);
		expect(window.location.pathname).toBe("/python-ide");
		expect(window.location.search).toBe("?tab=files");
		expect(wrapper.text()).toContain("maria-7");
	});

	it("shows a safe provider callback error and removes it from the URL", async () => {
		window.history.replaceState(
			{},
			"",
			"/?studentOAuthError=not_linked&course=python-1"
		);
		const wrapper = mount(StudentAccess);
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toContain("not connected");
		expect(window.location.search).toBe("?course=python-1");
		expect(fetchStudentSession).not.toHaveBeenCalled();
	});

	it("requires a new password after an access-code sign in", async () => {
		vi.mocked(signInStudent).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: true
		});
		vi.mocked(setStudentPassword).mockImplementationOnce(
			async (_password, requestID) => ({
				student: {
					...student,
					passwordSetAt: "2026-07-29T13:00:00.000Z"
				},
				requiresPasswordSetup: false,
				passwordSetupRequestID: requestID
			})
		);
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		await wrapper.get("#student-username").setValue("maria-7");
		await wrapper.get("#student-secret").setValue("one-time-code");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.text()).toContain("Create your password");
		await wrapper.get("#student-new-password").setValue("new-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("different-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"The passwords do not match."
		);
		expect(setStudentPassword).not.toHaveBeenCalled();

		await wrapper
			.get("#student-confirm-password")
			.setValue("new-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(setStudentPassword).toHaveBeenCalledWith(
			"new-passphrase",
			expect.stringMatching(/^[A-Za-z0-9_-]{32,128}$/)
		);
		expect(wrapper.text()).toContain("maria-7");
		expect(wrapper.text()).not.toContain("Create your password");
	});

	it("recovers a one-use access-code sign in when its response is lost", async () => {
		vi.mocked(signInStudent).mockRejectedValueOnce(
			new Error("connection reset after sign in")
		);
		vi.mocked(fetchStudentSession).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: true
		});
		const app = useAppStore();
		const wrapper = mount(StudentAccess);

		await wrapper.get("button").trigger("click");
		await wrapper.get("#student-username").setValue("maria-7");
		await wrapper.get("#student-secret").setValue("one-use-code");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(fetchStudentSession).toHaveBeenCalledOnce();
		expect(app.currentUser?._id).toBe(student._id);
		expect(app.studentRequiresPasswordSetup).toBe(true);
		expect(wrapper.text()).toContain("Create your password");
		expect(wrapper.find('[role="alert"]').exists()).toBe(false);
	});

	it("recovers a successful password save when the response is lost", async () => {
		vi.mocked(setStudentPassword)
			.mockRejectedValueOnce(new Error("connection reset after save"))
			.mockImplementationOnce(async (_password, requestID) => ({
				student: {
					...student,
					passwordSetAt: "2026-07-29T13:00:00.000Z"
				},
				requiresPasswordSetup: false,
				passwordSetupRequestID: requestID
			}));
		const app = useAppStore();
		app.setStudentSession({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper.get("#student-new-password").setValue("new-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("new-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(setStudentPassword).toHaveBeenNthCalledWith(
			1,
			"new-passphrase",
			expect.stringMatching(/^[A-Za-z0-9_-]{32,128}$/)
		);
		const requestID = vi.mocked(setStudentPassword).mock.calls[0]?.[1];
		expect(setStudentPassword).toHaveBeenNthCalledWith(
			2,
			"new-passphrase",
			requestID
		);
		expect(fetchStudentSession).not.toHaveBeenCalled();
		expect(app.studentRequiresPasswordSetup).toBe(false);
		expect(app.currentUser?._id).toBe(student._id);
		expect(wrapper.find('[role="alert"]').exists()).toBe(false);
		expect(wrapper.text()).toContain("Password saved.");
	});

	it("reuses the exact setup request after an inconclusive retry", async () => {
		vi.mocked(setStudentPassword)
			.mockRejectedValueOnce(new Error("connection reset after save"))
			.mockRejectedValueOnce(new Error("recovery retry unavailable"))
			.mockImplementationOnce(async (_password, requestID) => ({
				student,
				requiresPasswordSetup: false,
				passwordSetupRequestID: requestID
			}));
		const app = useAppStore();
		app.setStudentSession({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper.get("#student-new-password").setValue("new-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("new-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		const firstRequestID = vi.mocked(setStudentPassword).mock.calls[0]?.[1];
		expect(wrapper.get("#student-new-password").element).toHaveProperty(
			"value",
			"new-passphrase"
		);

		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(setStudentPassword).toHaveBeenNthCalledWith(
			3,
			"new-passphrase",
			firstRequestID
		);
		expect(app.studentRequiresPasswordSetup).toBe(false);
	});

	it("does not confirm a restored request marker with a different password", async () => {
		const requestID = "12345678-1234-1234-1234-123456789012";
		window.sessionStorage.setItem(
			`cs-avasan-student-password-setup-request:${student._id}`,
			requestID
		);
		vi.mocked(setStudentPassword).mockRejectedValueOnce({
			response: {
				data: {
					message:
						"That password does not match the original setup request."
				},
				status: 409
			}
		});
		const app = useAppStore();
		app.setStudentSession({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper
			.get("#student-new-password")
			.setValue("different-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("different-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(setStudentPassword).toHaveBeenCalledWith(
			"different-passphrase",
			requestID
		);
		expect(fetchStudentSession).not.toHaveBeenCalled();
		expect(app.studentRequiresPasswordSetup).toBe(true);
		expect(wrapper.get("#student-new-password").element).toHaveProperty(
			"value",
			"different-passphrase"
		);
		expect(wrapper.get('[role="alert"]').text()).toContain(
			"does not match"
		);
	});

	it("clears setup secrets and retry markers before another student", async () => {
		const firstStudent = {
			...student,
			_id: "student-setup-a",
			username: "maria-7"
		};
		const secondStudent = {
			...student,
			_id: "student-setup-b",
			username: "liam-4"
		};
		const firstRequestKey =
			"cs-avasan-student-password-setup-request:student-setup-a";
		window.sessionStorage.setItem(
			firstRequestKey,
			"12345678-1234-1234-1234-123456789012"
		);
		const app = useAppStore();
		app.setStudentSession({
			student: firstStudent,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper
			.get("#student-new-password")
			.setValue("first-student-password");
		await wrapper
			.get("#student-confirm-password")
			.setValue("first-student-password");
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		await flushPromises();

		expect(window.sessionStorage.getItem(firstRequestKey)).toBeNull();

		app.setCurrentAdmin(null);
		app.setStudentSession({
			student: secondStudent,
			requiresPasswordSetup: true
		});
		await flushPromises();

		expect(wrapper.get("#student-new-password").element).toHaveProperty(
			"value",
			""
		);
		expect(wrapper.get("#student-confirm-password").element).toHaveProperty(
			"value",
			""
		);
	});

	it("does not apply a delayed password response after Julio takes over", async () => {
		let resolvePassword:
			| ((session: {
					passwordSetupRequestID: string;
					requiresPasswordSetup: false;
					student: typeof student & { passwordSetAt: string };
			  }) => void)
			| null = null;
		vi.mocked(setStudentPassword).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolvePassword = resolve;
				})
		);
		const app = useAppStore();
		app.setStudentSession({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper.get("#student-new-password").setValue("new-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("new-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();
		const requestID = vi.mocked(setStudentPassword).mock.calls[0]?.[1];
		expect(requestID).toMatch(/^[A-Za-z0-9_-]{32,128}$/);

		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		resolvePassword?.({
			student: {
				...student,
				passwordSetAt: "2026-07-29T13:00:00.000Z"
			},
			requiresPasswordSetup: false,
			passwordSetupRequestID: requestID!
		});
		await flushPromises();

		expect(app.currentAdmin?._id).toBe("julio");
		expect(app.currentUser).toBeNull();
		expect(wrapper.text()).not.toContain("Password saved.");
	});

	it("does not probe a definitive password-setup rejection", async () => {
		vi.mocked(setStudentPassword).mockRejectedValueOnce({
			response: {
				data: { message: "Password was rejected." },
				status: 400
			}
		});
		const app = useAppStore();
		app.setStudentSession({
			student,
			requiresPasswordSetup: true
		});
		const wrapper = mount(StudentAccess);

		await wrapper.get("#student-new-password").setValue("new-passphrase");
		await wrapper
			.get("#student-confirm-password")
			.setValue("new-passphrase");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(fetchStudentSession).not.toHaveBeenCalled();
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Password was rejected."
		);
	});

	it("uses a generic sign-in error and clears the submitted secret", async () => {
		vi.mocked(signInStudent).mockRejectedValueOnce({
			response: {
				data: { message: "student does not exist" },
				status: 403
			}
		});
		const wrapper = mountAccess();

		await wrapper.get("button").trigger("click");
		await wrapper.get("#student-username").setValue("unknown");
		await wrapper.get("#student-secret").setValue("wrong-secret");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Couldn’t sign in. Check your username and password or access code."
		);
		expect(
			(wrapper.get("#student-secret").element as HTMLInputElement).value
		).toBe("");
		expect(wrapper.text()).not.toContain("student does not exist");
		expect(fetchStudentSession).not.toHaveBeenCalled();
	});

	it("signs out a student without exposing Julio's admin controls", async () => {
		vi.mocked(signOutStudent).mockResolvedValueOnce();
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		const wrapper = mount(StudentAccess);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign out")
			?.trigger("click");
		await flushPromises();

		expect(signOutStudent).toHaveBeenCalledOnce();
		expect(app.currentUser).toBeNull();
		expect(wrapper.text()).toContain("Student sign in");
		expect(wrapper.text()).not.toContain("Admin");
	});

	it("resumes only when a rejected sign-out still has the same full student", async () => {
		vi.mocked(signOutStudent).mockRejectedValueOnce(
			new Error("connection reset during sign out")
		);
		vi.mocked(fetchStudentSession).mockResolvedValueOnce({
			student,
			requiresPasswordSetup: false
		});
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		const wrapper = mount(StudentAccess);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign out")
			?.trigger("click");
		await flushPromises();

		expect(fetchStudentSession).toHaveBeenCalledOnce();
		expect(app.currentUser?._id).toBe(student._id);
		expect(cancelStudentLogoutInOtherTabs).toHaveBeenCalledWith(
			student._id
		);
		expect(resumeStudentSessionHandoff).toHaveBeenCalledWith(student._id);
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Couldn’t sign out. Try again."
		);
	});

	it("finishes a rejected sign-out when the server confirms no student", async () => {
		vi.mocked(signOutStudent).mockRejectedValueOnce(
			new Error("response lost after sign out")
		);
		vi.mocked(fetchStudentSession).mockResolvedValueOnce({
			student: null,
			requiresPasswordSetup: false
		});
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		const wrapper = mount(StudentAccess);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign out")
			?.trigger("click");
		await flushPromises();

		expect(app.currentUser).toBeNull();
		expect(endStudentSessionHandoff).toHaveBeenCalledWith(student._id);
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
		expect(wrapper.text()).toContain("Signed out.");
	});

	it("hides the workspace when a rejected sign-out cannot be probed", async () => {
		vi.mocked(signOutStudent).mockRejectedValueOnce(
			new Error("response lost after sign out")
		);
		vi.mocked(fetchStudentSession).mockRejectedValueOnce(
			new Error("session probe unavailable")
		);
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		const wrapper = mount(StudentAccess);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign out")
			?.trigger("click");
		await flushPromises();

		expect(app.currentUser).toBeNull();
		expect(endStudentSessionHandoff).toHaveBeenCalledWith(student._id);
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Couldn’t confirm sign-out. Your workspace is hidden. Reload before continuing."
		);
		expect(wrapper.get("#student-access-panel").exists()).toBe(true);
	});

	it("automatically signs out a full student after 30 minutes idle", async () => {
		vi.useFakeTimers();
		try {
			vi.mocked(signOutStudent).mockResolvedValueOnce();
			const app = useAppStore();
			app.setStudentSession({ student, requiresPasswordSetup: false });
			mount(StudentAccess);

			await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

			expect(signOutStudent).toHaveBeenCalledOnce();
			expect(app.currentUser).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it("does not restart student inactivity across repeated session checks", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-29T12:00:00.000Z"));
		try {
			vi.mocked(signOutStudent).mockResolvedValueOnce();
			const app = useAppStore();
			app.setStudentSession({ student, requiresPasswordSetup: false });
			const wrapper = mount(StudentAccess);

			for (let check = 0; check < 31; check += 1) {
				await vi.advanceTimersByTimeAsync(59_000);
				if (!app.currentUser) break;
				app.hideStudentSession(student._id);
				await wrapper.vm.$nextTick();
				app.setStudentSession({
					student,
					requiresPasswordSetup: false
				});
				await wrapper.vm.$nextTick();
			}
			await flushPromises();

			expect(Date.now()).toBeGreaterThanOrEqual(
				Date.parse("2026-07-29T12:30:00.000Z")
			);
			expect(signOutStudent).toHaveBeenCalledOnce();
			expect(app.currentUser).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it("lets a setup-only student sign out without calling project APIs", async () => {
		vi.mocked(signOutStudent).mockResolvedValueOnce();
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: true });
		const wrapper = mount(StudentAccess);

		await wrapper
			.findAll("button")
			.find(button => button.text() === "Sign out")
			?.trigger("click");
		await flushPromises();

		expect(signOutStudent).toHaveBeenCalledOnce();
		expect(prepareStudentSessionHandoff).not.toHaveBeenCalled();
		expect(app.currentUser).toBeNull();
	});

	it("does not run project handoff before Julio replaces a setup-only session", async () => {
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: true });

		await expect(app.prepareStudentSessionExit()).resolves.toBeNull();

		expect(prepareStudentSessionHandoff).not.toHaveBeenCalled();
		expect(app.currentUser?._id).toBe(student._id);
	});

	it("expires an abandoned access-code setup after 30 minutes", async () => {
		vi.useFakeTimers();
		try {
			vi.mocked(signOutStudent).mockResolvedValueOnce();
			const app = useAppStore();
			app.setStudentSession({ student, requiresPasswordSetup: true });
			mount(StudentAccess);

			await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

			expect(signOutStudent).toHaveBeenCalledOnce();
			expect(prepareStudentSessionHandoff).not.toHaveBeenCalled();
			expect(app.currentUser).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it("retains setup identity when the automatic sign-out request fails", async () => {
		vi.useFakeTimers();
		try {
			vi.mocked(signOutStudent).mockRejectedValueOnce(
				new Error("connection lost")
			);
			const app = useAppStore();
			app.setStudentSession({ student, requiresPasswordSetup: true });
			const wrapper = mount(StudentAccess);

			await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

			expect(signOutStudent).toHaveBeenCalledOnce();
			expect(app.currentUser?._id).toBe(student._id);
			expect(app.studentRequiresPasswordSetup).toBe(true);
			expect(wrapper.get('[role="alert"]').text()).toBe(
				"Access-code setup expired, but sign-out could not finish. Try again."
			);
		} finally {
			vi.useRealTimers();
		}
	});

	it("clears an old identity before accepting a session change from another tab", async () => {
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		vi.spyOn(app, "bootstrapSession").mockImplementation(async () => {
			app.setStudentSession({
				student: {
					_id: "student-2",
					username: "liam-4",
					active: true
				},
				requiresPasswordSetup: false
			});
		});
		mount(StudentAccess);
		const sessionChangedListener = vi
			.mocked(subscribeToStudentSessionChanged)
			.mock.calls.at(-1)?.[0];

		sessionChangedListener?.({
			type: "student-session-changed",
			authLevel: "full",
			nonce: "change-1",
			studentID: "student-2"
		});
		await flushPromises();

		expect(endStudentSessionHandoff).toHaveBeenCalledWith("student-1");
		expect(app.currentUser?._id).toBe("student-2");
	});

	it("does not hydrate another identity into a hidden tab", async () => {
		const app = useAppStore();
		app.setStudentSession({ student, requiresPasswordSetup: false });
		const bootstrapSession = vi
			.spyOn(app, "bootstrapSession")
			.mockResolvedValue(undefined);
		mount(StudentAccess);
		const sessionChangedListener = vi
			.mocked(subscribeToStudentSessionChanged)
			.mock.calls.at(-1)?.[0];
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden"
		});

		sessionChangedListener?.({
			type: "student-session-changed",
			authLevel: "full",
			nonce: "hidden-change",
			studentID: "student-2"
		});
		await flushPromises();

		expect(endStudentSessionHandoff).toHaveBeenCalledWith(student._id);
		expect(bootstrapSession).not.toHaveBeenCalled();
		expect(app.currentUser).toBeNull();
		expect(app.currentAdmin).toBeNull();
	});

	it("keeps its cross-tab session coordinator active for Julio", async () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		mount(StudentAccess);
		const sessionChangedListener = vi
			.mocked(subscribeToStudentSessionChanged)
			.mock.calls.at(-1)?.[0];

		sessionChangedListener?.({
			type: "student-session-changed",
			authLevel: "none",
			nonce: "admin-ended",
			studentID: null
		});
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
	});
});
