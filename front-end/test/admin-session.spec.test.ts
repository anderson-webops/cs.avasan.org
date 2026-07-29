import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import {
	ADMIN_SESSION_VALIDATION_LEASE_MS,
	isAdminSessionAuthorizationError,
	startAdminSessionLifecycle
} from "@/modules/adminSession";
import { useAppStore } from "@/stores/app";

vi.mock("@/api", () => ({
	api: {
		delete: vi.fn(),
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn()
	}
}));

vi.mock("@/modules/studentSessionBroadcast", () => ({
	broadcastStudentSessionChanged: vi.fn(),
	broadcastStudentSessionEnded: vi.fn(),
	cancelStudentLogoutInOtherTabs: vi.fn(),
	prepareStudentLogoutInOtherTabs: vi.fn()
}));

const julio = {
	_id: "julio",
	name: "Julio",
	email: "julio@example.com",
	passwordChangedAt: "2026-07-29T10:00:00.000Z",
	editAdmins: false,
	saveEdit: "Save"
};

describe("Admin session lifecycle", () => {
	let stopLifecycle: (() => void) | undefined;

	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});
	});

	afterEach(() => {
		stopLifecycle?.();
		stopLifecycle = undefined;
		vi.useRealTimers();
	});

	it("keeps ordinary focus changes visible while the validation lease is current", () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		const now = app.adminSessionValidatedAt + 1_000;
		stopLifecycle = startAdminSessionLifecycle(app, { now: () => now });

		window.dispatchEvent(new Event("focus"));

		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(app.adminSessionRevalidating).toBe(false);
		expect(api.get).not.toHaveBeenCalled();
	});

	it("sends only throttled trusted activity heartbeats from visible Admin pages", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-29T10:00:00.000Z"));
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		vi.mocked(api.get).mockResolvedValue({
			data: { currentAdmin: julio }
		});
		stopLifecycle = startAdminSessionLifecycle(app, {
			isTrustedEvent: event => event.type !== "pointerdown",
			leaseMs: 60 * 60_000,
			pathname: () => "/admin"
		});

		window.dispatchEvent(new Event("pointerdown"));
		expect(api.get).not.toHaveBeenCalled();

		window.dispatchEvent(new Event("keydown"));
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith("/admins/loggedin", {
			headers: { "X-Admin-Activity": "1" },
			timeout: 30_000
		});

		vi.mocked(api.get).mockClear();
		await vi.advanceTimersByTimeAsync(4 * 60_000);
		window.dispatchEvent(new Event("touchstart"));
		await flushPromises();
		expect(api.get).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(60_000);
		window.dispatchEvent(new Event("touchstart"));
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith("/admins/loggedin", {
			headers: { "X-Admin-Activity": "1" },
			timeout: 30_000
		});
	});

	it("does not send Admin activity from another route", () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		stopLifecycle = startAdminSessionLifecycle(app, {
			isTrustedEvent: () => true,
			pathname: () => "/"
		});

		window.dispatchEvent(new Event("keydown"));

		expect(api.get).not.toHaveBeenCalled();
	});

	it("hides a stale Admin workspace before probing and restores only Julio", async () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		app.setUsers([
			{ _id: "student-private", username: "maria-7", active: true }
		]);
		const now =
			app.adminSessionValidatedAt + ADMIN_SESSION_VALIDATION_LEASE_MS + 1;
		stopLifecycle = startAdminSessionLifecycle(app, { now: () => now });
		vi.mocked(api.get)
			.mockResolvedValueOnce({ data: { adminID: julio._id } })
			.mockResolvedValueOnce({ data: { currentAdmin: julio } });

		window.dispatchEvent(new Event("focus"));

		expect(app.currentAdmin).toBeNull();
		expect(app.users).toEqual([]);
		expect(app.adminSessionRevalidating).toBe(true);

		await flushPromises();

		expect(api.get).toHaveBeenNthCalledWith(1, "/accounts/me");
		expect(api.get).toHaveBeenNthCalledWith(2, "/admins/loggedin");
		expect(app.currentAdmin?._id).toBe(julio._id);
		expect(app.adminSessionRevalidating).toBe(false);
	});

	it("hides a visible Admin workspace when its lease expires without another event", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-29T10:00:00.000Z"));
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		app.setUsers([
			{ _id: "student-private", username: "maria-7", active: true }
		]);
		let resolveMarker:
			| ((value: { data: { adminID: string } }) => void)
			| undefined;
		vi.mocked(api.get)
			.mockImplementationOnce(
				() =>
					new Promise(resolve => {
						resolveMarker = resolve;
					})
			)
			.mockResolvedValueOnce({ data: { currentAdmin: julio } });
		stopLifecycle = startAdminSessionLifecycle(app);

		vi.advanceTimersByTime(ADMIN_SESSION_VALIDATION_LEASE_MS);

		expect(app.currentAdmin).toBeNull();
		expect(app.users).toEqual([]);
		expect(app.adminSessionRevalidating).toBe(true);
		resolveMarker?.({ data: { adminID: julio._id } });
		await flushPromises();
		expect(app.currentAdmin?._id).toBe(julio._id);
	});

	it("hides on pagehide and requires a fresh exact match after BFCache restore", async () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		app.setUsers([
			{ _id: "student-private", username: "maria-7", active: true }
		]);
		stopLifecycle = startAdminSessionLifecycle(app);

		window.dispatchEvent(new Event("pagehide"));

		expect(app.currentAdmin).toBeNull();
		expect(app.users).toEqual([]);
		expect(app.adminSessionRevalidating).toBe(true);

		vi.mocked(api.get)
			.mockResolvedValueOnce({ data: { adminID: julio._id } })
			.mockResolvedValueOnce({ data: { currentAdmin: julio } });
		const pageShow = new Event("pageshow") as PageTransitionEvent;
		Object.defineProperty(pageShow, "persisted", { value: true });
		window.dispatchEvent(pageShow);
		await flushPromises();

		expect(app.currentAdmin?._id).toBe(julio._id);
	});

	it("hides Admin data immediately when a current tab becomes hidden", () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		app.setUsers([
			{ _id: "student-private", username: "maria-7", active: true }
		]);
		stopLifecycle = startAdminSessionLifecycle(app, {
			now: () => app.adminSessionValidatedAt + 1
		});
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden"
		});

		document.dispatchEvent(new Event("visibilitychange"));

		expect(app.currentAdmin).toBeNull();
		expect(app.users).toEqual([]);
		expect(app.adminSessionRevalidating).toBe(true);
		expect(api.get).not.toHaveBeenCalled();
	});

	it("stays fail closed when a resume probe fails or identifies another session", async () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		stopLifecycle = startAdminSessionLifecycle(app);
		window.dispatchEvent(new Event("pagehide"));
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { adminID: "different-admin" }
		});
		const pageShow = new Event("pageshow") as PageTransitionEvent;
		Object.defineProperty(pageShow, "persisted", { value: true });
		window.dispatchEvent(pageShow);
		await flushPromises();

		expect(app.currentAdmin).toBeNull();
		expect(app.adminSessionRevalidating).toBe(false);
		expect(api.get).toHaveBeenCalledOnce();
	});

	it("revalidates a stale Admin when a hidden tab becomes visible", async () => {
		const app = useAppStore();
		app.setCurrentAdmin(julio);
		const now =
			app.adminSessionValidatedAt + ADMIN_SESSION_VALIDATION_LEASE_MS + 1;
		stopLifecycle = startAdminSessionLifecycle(app, { now: () => now });
		vi.mocked(api.get).mockRejectedValueOnce(new Error("offline"));
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});

		document.dispatchEvent(new Event("visibilitychange"));

		expect(app.currentAdmin).toBeNull();
		expect(app.adminSessionRevalidating).toBe(true);
		await flushPromises();
		expect(app.currentAdmin).toBeNull();
		expect(app.adminSessionRevalidating).toBe(false);
	});
});

describe("Admin authorization errors", () => {
	it("distinguishes an expired Admin session from a mistyped teacher password", () => {
		expect(
			isAdminSessionAuthorizationError({
				response: {
					status: 403,
					data: { message: "Not logged in or session expired" }
				}
			})
		).toBe(true);
		expect(
			isAdminSessionAuthorizationError({
				response: {
					status: 403,
					data: { message: "Teacher password is incorrect." }
				}
			})
		).toBe(false);
	});
});
