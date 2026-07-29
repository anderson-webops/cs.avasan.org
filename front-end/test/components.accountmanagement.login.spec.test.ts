import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import AccountManagement from "@/components/AccountManagement.vue";
import {
	broadcastStudentSessionChanged,
	broadcastStudentSessionEnded,
	cancelStudentLogoutInOtherTabs
} from "@/modules/studentSessionBroadcast";
import {
	endStudentSessionHandoff,
	resumeStudentSessionHandoff
} from "@/modules/studentSessionHandoff";
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
vi.mock("@/modules/studentSessionBroadcast", () => ({
	broadcastStudentSessionChanged: vi.fn(),
	broadcastStudentSessionEnded: vi.fn(),
	cancelStudentLogoutInOtherTabs: vi.fn(),
	prepareStudentLogoutInOtherTabs: vi.fn()
}));
vi.mock("@/modules/studentSessionHandoff", () => ({
	endStudentSessionHandoff: vi.fn(),
	prepareStudentSessionHandoff: vi.fn(),
	resumeStudentSessionHandoff: vi.fn(),
	suspendStudentSessionHandoff: vi.fn()
}));

describe("AccountManagement teacher login", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	function mountLogin() {
		const app = useAppStore();
		app.sessionBootstrapStatus = "ready";
		const wrapper = mount(AccountManagement, { attachTo: document.body });
		return { app, wrapper };
	}

	it("withholds teacher login until the shared session is confirmed", async () => {
		const app = useAppStore();
		const wrapper = mount(AccountManagement, {
			attachTo: document.body
		});

		expect(app.sessionBootstrapStatus).toBe("pending");
		expect(wrapper.find("form").exists()).toBe(false);
		expect(wrapper.text()).toContain("Checking the signed-in account");
		expect(api.post).not.toHaveBeenCalled();

		app.sessionBootstrapStatus = "failed";
		await wrapper.vm.$nextTick();
		expect(wrapper.find("form").exists()).toBe(false);
		expect(wrapper.get('[role="alert"]').text()).toContain(
			"Couldn’t confirm which account is signed in"
		);

		app.setStudentSession({
			student: {
				_id: "student-from-bootstrap",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: false
		});
		app.sessionBootstrapStatus = "ready";
		await wrapper.vm.$nextTick();

		expect(wrapper.find("form").exists()).toBe(true);
		wrapper.unmount();
	});

	it("logs Julio in as the sole teacher account", async () => {
		const passphrase = "teacher-login-test";
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { currentAdmin: julio }
		});
		const { app, wrapper } = mountLogin();

		await wrapper.get("#admin-email").setValue(julio.email);
		await wrapper.get("#admin-password").setValue(passphrase);
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{
				email: julio.email,
				password: passphrase
			},
			{ timeout: 30_000, withCredentials: true }
		);
		expect(app.currentAdmin).toEqual(julio);
		expect(app.currentUser).toBeNull();
		expect(app.currentTutor).toBeNull();
		expect(wrapper.get("#admin-password").element).toHaveProperty("value", "");
		wrapper.unmount();
	});

	it("clears Julio's password before the login response settles", async () => {
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		let resolveLogin:
			| ((value: { data: { currentAdmin: typeof julio } }) => void)
			| undefined;
		vi.mocked(api.post).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolveLogin = resolve;
				})
		);
		const { wrapper } = mountLogin();
		await wrapper.get("#admin-email").setValue(julio.email);
		await wrapper
			.get("#admin-password")
			.setValue("teacher-login-secret");

		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(api.post).toHaveBeenCalledWith(
			"/accounts/login",
			{
				email: julio.email,
				password: "teacher-login-secret"
			},
			{ timeout: 30_000, withCredentials: true }
		);
		expect(wrapper.get("#admin-password").element).toHaveProperty(
			"value",
			""
		);

		resolveLogin?.({ data: { currentAdmin: julio } });
		await flushPromises();
		wrapper.unmount();
	});

	it("rejects non-teacher login responses without exposing signup", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				currentUser: {
					_id: "student",
					name: "Student"
				}
			}
		});
		const { app, wrapper } = mountLogin();

		await wrapper.get("#admin-email").setValue("student@example.com");
		await wrapper.get("#admin-password").setValue("not-a-teacher");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"This sign-in is available only to Julio."
		);
		expect(app.currentAdmin).toBeNull();
		expect(wrapper.get("#admin-password").element).toHaveProperty(
			"value",
			""
		);
		expect(wrapper.text()).not.toMatch(/Sign up|Create account/i);
		wrapper.unmount();
	});

	it("clears Julio's password after a definitive login rejection", async () => {
		vi.mocked(api.post).mockRejectedValueOnce({
			response: {
				data: { message: "Incorrect email or password." },
				status: 401
			}
		});
		const { wrapper } = mountLogin();

		await wrapper.get("#admin-email").setValue("julio@example.com");
		await wrapper
			.get("#admin-password")
			.setValue("incorrect-teacher-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Incorrect email or password."
		);
		expect(wrapper.get("#admin-password").element).toHaveProperty(
			"value",
			""
		);
		expect(api.get).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("clears a typed password when the signed-in identity changes", async () => {
		const { app, wrapper } = mountLogin();
		await wrapper
			.get("#admin-password")
			.setValue("unsubmitted-teacher-password");

		app.setStudentSession({
			student: {
				_id: "student-new",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: false
		});
		await wrapper.vm.$nextTick();

		expect(wrapper.get("#admin-password").element).toHaveProperty(
			"value",
			""
		);
		wrapper.unmount();
	});

	it("renders only the inline login controls", () => {
		const { wrapper } = mountLogin();

		expect(wrapper.get('label[for="admin-email"]').text()).toBe("Email");
		expect(wrapper.get('label[for="admin-password"]').text()).toBe("Password");
		expect(wrapper.find('input[name="remember"]').exists()).toBe(false);
		expect(wrapper.get('button[type="submit"]').text()).toBe("Log in");
		expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
		expect(wrapper.find('button[type="button"]').exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(
			/Student|Tutor|Sign up|Create account|Cancel/i
		);
		wrapper.unmount();
	});

	it("announces Julio's login when it replaces a setup-only student session", async () => {
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { currentAdmin: julio }
		});
		const { app, wrapper } = mountLogin();
		app.setStudentSession({
			student: {
				_id: "student-setup",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: true
		});
		const finishSessionExit = vi.spyOn(app, "finishStudentSessionExit");

		await wrapper.get("#admin-email").setValue(julio.email);
		await wrapper.get("#admin-password").setValue("teacher-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(finishSessionExit).toHaveBeenCalledOnce();
		expect(broadcastStudentSessionChanged).toHaveBeenCalledWith(
			null,
			"admin"
		);
		expect(app.currentAdmin?._id).toBe("julio");
		expect(app.currentUser).toBeNull();
		wrapper.unmount();
	});

	it("accepts Julio when a lost login response already replaced a full student", async () => {
		const julio = {
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		};
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("login response lost")
		);
		vi.mocked(api.get)
			.mockResolvedValueOnce({ data: { adminID: julio._id } })
			.mockResolvedValueOnce({ data: { currentAdmin: julio } });
		const { app, wrapper } = mountLogin();
		app.setStudentSession({
			student: {
				_id: "student-full",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: false
		});

		await wrapper.get("#admin-email").setValue(julio.email);
		await wrapper.get("#admin-password").setValue("teacher-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(api.get).toHaveBeenNthCalledWith(1, "/accounts/me");
		expect(api.get).toHaveBeenNthCalledWith(2, "/admins/loggedin");
		expect(endStudentSessionHandoff).toHaveBeenCalledWith("student-full");
		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(app.currentUser).toBeNull();
		expect(broadcastStudentSessionChanged).toHaveBeenCalledWith(
			null,
			"admin"
		);
		expect(wrapper.find('[role="alert"]').exists()).toBe(false);
		wrapper.unmount();
	});

	it("resumes the old student only after a lost teacher login confirms that student", async () => {
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("login response lost")
		);
		vi.mocked(api.get)
			.mockResolvedValueOnce({ data: { adminID: null } })
			.mockResolvedValueOnce({
				data: {
					student: {
						_id: "student-full",
						username: "maria-7",
						active: true
					},
					requiresPasswordSetup: false
				}
			});
		const { app, wrapper } = mountLogin();
		app.setStudentSession({
			student: {
				_id: "student-full",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: false
		});

		await wrapper.get("#admin-email").setValue("julio@example.com");
		await wrapper.get("#admin-password").setValue("teacher-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(app.currentUser?._id).toBe("student-full");
		expect(app.currentAdmin).toBeNull();
		expect(cancelStudentLogoutInOtherTabs).toHaveBeenCalledWith(
			"student-full"
		);
		expect(resumeStudentSessionHandoff).toHaveBeenCalledWith(
			"student-full"
		);
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"login response lost"
		);
		wrapper.unmount();
	});

	it("hides the old student when a lost teacher login cannot be probed", async () => {
		vi.mocked(api.post).mockRejectedValueOnce(
			new Error("login response lost")
		);
		vi.mocked(api.get).mockRejectedValue(
			new Error("session probes unavailable")
		);
		const { app, wrapper } = mountLogin();
		app.setStudentSession({
			student: {
				_id: "student-full",
				username: "maria-7",
				active: true
			},
			requiresPasswordSetup: false
		});

		await wrapper.get("#admin-email").setValue("julio@example.com");
		await wrapper.get("#admin-password").setValue("teacher-password");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(app.currentUser).toBeNull();
		expect(app.currentAdmin).toBeNull();
		expect(endStudentSessionHandoff).toHaveBeenCalledWith("student-full");
		expect(broadcastStudentSessionEnded).toHaveBeenCalledOnce();
		expect(wrapper.get('[role="alert"]').text()).toBe(
			"Couldn’t confirm which account is signed in. Reload before continuing."
		);
		wrapper.unmount();
	});
});
