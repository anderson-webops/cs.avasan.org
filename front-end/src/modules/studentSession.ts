import type { Admin, User } from "@/stores/app";

export const STUDENT_SESSION_VALIDATION_LEASE_MS = 60_000;
const STUDENT_SESSION_LEASE_CHECK_MS = 1_000;

interface StudentSessionLifecycleStore {
	currentAdmin: Admin | null;
	currentUser: User | null;
	studentSessionRevalidating: boolean;
	studentSessionValidatedAt: number;
	hideStudentSession: (expectedStudentID?: string | null) => string | null;
	cancelStudentSessionRevalidation: () => void;
	revalidateStudentSession: (expectedStudentID: string) => Promise<boolean>;
}

interface StudentSessionLifecycleOptions {
	leaseMs?: number;
	now?: () => number;
}

export function startStudentSessionLifecycle(
	store: StudentSessionLifecycleStore,
	options: StudentSessionLifecycleOptions = {}
): () => void {
	if (typeof window === "undefined" || typeof document === "undefined") {
		return () => undefined;
	}

	const leaseMs = options.leaseMs ?? STUDENT_SESSION_VALIDATION_LEASE_MS;
	const now = options.now ?? Date.now;
	let suspendedStudentID: string | null = null;
	let validation: Promise<void> | null = null;
	let pageIsHidden = document.visibilityState !== "visible";
	let resumeValidationRequired = false;
	let stopped = false;

	function cancelForAdminSession() {
		if (!store.currentAdmin) return false;
		suspendedStudentID = null;
		store.cancelStudentSessionRevalidation();
		return true;
	}

	function hideStudentContent(): string | null {
		if (cancelForAdminSession()) return null;
		const hiddenStudentID = store.hideStudentSession(suspendedStudentID);
		if (hiddenStudentID) suspendedStudentID = hiddenStudentID;
		return suspendedStudentID;
	}

	function revalidate(force: boolean): void {
		if (stopped || pageIsHidden || cancelForAdminSession()) return;
		const expectedStudentID = store.currentUser?._id ?? suspendedStudentID;
		if (!expectedStudentID || validation) return;

		const leaseIsCurrent =
			store.currentUser &&
			now() - store.studentSessionValidatedAt < leaseMs;
		if (!force && leaseIsCurrent) return;

		hideStudentContent();
		validation = store
			.revalidateStudentSession(expectedStudentID)
			.then(() => undefined)
			.finally(() => {
				validation = null;
				if (pageIsHidden || stopped) return;
				if (resumeValidationRequired) {
					resumeValidationRequired = false;
					revalidate(true);
					return;
				}
				if (suspendedStudentID === expectedStudentID) {
					suspendedStudentID = null;
				}
			});
	}

	function onPageHide(): void {
		pageIsHidden = true;
		resumeValidationRequired = false;
		hideStudentContent();
	}

	function onPageShow(): void {
		pageIsHidden = false;
		if (validation) {
			resumeValidationRequired = true;
			return;
		}
		revalidate(true);
	}

	function onVisibilityChange(): void {
		if (document.visibilityState !== "visible") {
			pageIsHidden = true;
			resumeValidationRequired = false;
			hideStudentContent();
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

	window.addEventListener("pagehide", onPageHide);
	window.addEventListener("pageshow", onPageShow);
	window.addEventListener("focus", onFocus);
	document.addEventListener("visibilitychange", onVisibilityChange);
	const leaseCheck = window.setInterval(
		() => {
			if (document.visibilityState === "visible") revalidate(false);
		},
		Math.min(leaseMs, STUDENT_SESSION_LEASE_CHECK_MS)
	);

	return () => {
		stopped = true;
		window.clearInterval(leaseCheck);
		window.removeEventListener("pagehide", onPageHide);
		window.removeEventListener("pageshow", onPageShow);
		window.removeEventListener("focus", onFocus);
		document.removeEventListener("visibilitychange", onVisibilityChange);
	};
}
