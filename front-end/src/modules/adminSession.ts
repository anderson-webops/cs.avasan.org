import type { Admin } from "@/stores/app";
import { api } from "@/api";

export const ADMIN_SESSION_VALIDATION_LEASE_MS = 60_000;
const ADMIN_SESSION_LEASE_CHECK_MS = 1_000;
const ADMIN_ACTIVITY_HEARTBEAT_THROTTLE_MS = 5 * 60_000;
const ADMIN_ACTIVITY_HEARTBEAT_RETRY_MS = 60_000;

interface AdminSessionLifecycleStore {
	currentAdmin: Admin | null;
	adminSessionValidatedAt: number;
	hideAdminSession: (expectedAdminID?: string | null) => string | null;
	revalidateAdminSession: (expectedAdminID: string) => Promise<boolean>;
}

interface AdminSessionClearStore {
	clearSession: () => void;
}

interface AdminSessionLifecycleOptions {
	isTrustedEvent?: (event: Event) => boolean;
	leaseMs?: number;
	now?: () => number;
	pathname?: () => string;
}

function errorResponse(caught: unknown) {
	if (
		!caught ||
		typeof caught !== "object" ||
		!("response" in caught) ||
		!caught.response ||
		typeof caught.response !== "object"
	) {
		return null;
	}

	const response = caught.response as {
		data?: { message?: unknown };
		status?: unknown;
	};
	return {
		message:
			typeof response.data?.message === "string"
				? response.data.message
				: "",
		status: typeof response.status === "number" ? response.status : null
	};
}

export function isAdminSessionAuthorizationError(caught: unknown): boolean {
	const response = errorResponse(caught);
	if (!response) return false;
	if (response.status === 401) return true;
	if (response.status !== 403) return false;
	if (!response.message) return true;

	return /(?:admin|teacher) session required|admin account not found|not logged in|session expired|not authorized/i.test(
		response.message
	);
}

export function clearAdminSessionOnAuthorizationError(
	caught: unknown,
	store: AdminSessionClearStore
): boolean {
	if (!isAdminSessionAuthorizationError(caught)) return false;
	store.clearSession();
	return true;
}

export function startAdminSessionLifecycle(
	store: AdminSessionLifecycleStore,
	options: AdminSessionLifecycleOptions = {}
): () => void {
	if (typeof window === "undefined" || typeof document === "undefined") {
		return () => undefined;
	}

	const leaseMs = options.leaseMs ?? ADMIN_SESSION_VALIDATION_LEASE_MS;
	const now = options.now ?? Date.now;
	const isTrustedEvent =
		options.isTrustedEvent ?? ((event: Event) => event.isTrusted);
	const pathname = options.pathname ?? (() => window.location.pathname);
	let suspendedAdminID: string | null = null;
	let validation: Promise<void> | null = null;
	let activityHeartbeatInFlight = false;
	let lastActivityHeartbeatAt = Number.NEGATIVE_INFINITY;
	let pageIsHidden = false;
	let resumeValidationRequired = false;
	let stopped = false;

	function hideAdminContent(): string | null {
		const hiddenAdminID = store.hideAdminSession(suspendedAdminID);
		if (hiddenAdminID) suspendedAdminID = hiddenAdminID;
		return suspendedAdminID;
	}

	function revalidate(force: boolean): void {
		if (stopped || pageIsHidden) return;
		const expectedAdminID = store.currentAdmin?._id ?? suspendedAdminID;
		if (!expectedAdminID || validation) return;

		const leaseIsCurrent =
			store.currentAdmin &&
			now() - store.adminSessionValidatedAt < leaseMs;
		if (!force && leaseIsCurrent) return;

		hideAdminContent();
		validation = store
			.revalidateAdminSession(expectedAdminID)
			.then(() => undefined)
			.finally(() => {
				validation = null;
				if (pageIsHidden) return;
				if (resumeValidationRequired) {
					resumeValidationRequired = false;
					revalidate(true);
					return;
				}
				if (suspendedAdminID === expectedAdminID) {
					suspendedAdminID = null;
				}
			});
	}

	function onPageHide(): void {
		pageIsHidden = true;
		resumeValidationRequired = false;
		hideAdminContent();
	}

	function onPageShow(event: PageTransitionEvent): void {
		pageIsHidden = false;
		if (validation) {
			resumeValidationRequired = true;
			return;
		}
		revalidate(event.persisted);
	}

	function onVisibilityChange(): void {
		if (document.visibilityState !== "visible") {
			pageIsHidden = true;
			resumeValidationRequired = false;
			hideAdminContent();
			return;
		}

		pageIsHidden = false;
		if (validation) {
			resumeValidationRequired = true;
			return;
		}
		revalidate(true);
	}

	function onFocus(): void {
		revalidate(false);
	}

	function onTrustedAdminActivity(event: Event): void {
		if (
			stopped ||
			pageIsHidden ||
			document.visibilityState !== "visible" ||
			!store.currentAdmin ||
			!isTrustedEvent(event) ||
			pathname().replace(/\/+$/, "") !== "/admin"
		) {
			return;
		}

		const at = now();
		if (
			activityHeartbeatInFlight ||
			at - lastActivityHeartbeatAt < ADMIN_ACTIVITY_HEARTBEAT_THROTTLE_MS
		) {
			return;
		}

		lastActivityHeartbeatAt = at;
		activityHeartbeatInFlight = true;
		void api
			.get("/admins/loggedin", {
				headers: { "X-Admin-Activity": "1" },
				timeout: 30_000
			})
			.catch(() => {
				lastActivityHeartbeatAt =
					at -
					ADMIN_ACTIVITY_HEARTBEAT_THROTTLE_MS +
					ADMIN_ACTIVITY_HEARTBEAT_RETRY_MS;
			})
			.finally(() => {
				activityHeartbeatInFlight = false;
			});
	}

	window.addEventListener("pagehide", onPageHide);
	window.addEventListener("pageshow", onPageShow);
	window.addEventListener("focus", onFocus);
	window.addEventListener("keydown", onTrustedAdminActivity);
	window.addEventListener("pointerdown", onTrustedAdminActivity, {
		passive: true
	});
	window.addEventListener("touchstart", onTrustedAdminActivity, {
		passive: true
	});
	document.addEventListener("visibilitychange", onVisibilityChange);
	const leaseCheck = window.setInterval(
		() => {
			if (document.visibilityState === "visible") revalidate(false);
		},
		Math.min(leaseMs, ADMIN_SESSION_LEASE_CHECK_MS)
	);

	return () => {
		stopped = true;
		window.clearInterval(leaseCheck);
		window.removeEventListener("pagehide", onPageHide);
		window.removeEventListener("pageshow", onPageShow);
		window.removeEventListener("focus", onFocus);
		window.removeEventListener("keydown", onTrustedAdminActivity);
		window.removeEventListener("pointerdown", onTrustedAdminActivity);
		window.removeEventListener("touchstart", onTrustedAdminActivity);
		document.removeEventListener("visibilitychange", onVisibilityChange);
	};
}
