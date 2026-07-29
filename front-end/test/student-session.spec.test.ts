import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	startStudentSessionLifecycle,
	STUDENT_SESSION_VALIDATION_LEASE_MS
} from "@/modules/studentSession";

const student = {
	_id: "student-a",
	username: "maria-7",
	active: true
};

function lifecycleStore() {
	const store = {
		currentAdmin: null,
		currentUser: { ...student },
		studentSessionRevalidating: false,
		studentSessionValidatedAt: 10_000,
		cancelStudentSessionRevalidation: vi.fn(() => {
			store.studentSessionRevalidating = false;
		}),
		hideStudentSession: vi.fn((expectedStudentID?: string | null) => {
			const studentID =
				store.currentUser?._id ?? expectedStudentID ?? null;
			if (!studentID) return null;
			store.currentUser = null;
			store.studentSessionRevalidating = true;
			store.studentSessionValidatedAt = 0;
			return studentID;
		}),
		revalidateStudentSession: vi.fn(async (_studentID: string) => true)
	};
	return store;
}

describe("Student session lifecycle", () => {
	let stopLifecycle: (() => void) | undefined;

	beforeEach(() => {
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

	it("hides student identity immediately when a current tab becomes hidden", () => {
		const store = lifecycleStore();
		stopLifecycle = startStudentSessionLifecycle(store, {
			now: () => 10_001
		});

		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden"
		});
		document.dispatchEvent(new Event("visibilitychange"));

		expect(store.currentUser).toBeNull();
		expect(store.studentSessionRevalidating).toBe(true);
		expect(store.hideStudentSession).toHaveBeenCalledWith(null);
		expect(store.revalidateStudentSession).not.toHaveBeenCalled();
	});

	it("restores only the exact hidden student after a visible revalidation", async () => {
		const store = lifecycleStore();
		let resolveValidation: (() => void) | undefined;
		store.revalidateStudentSession.mockImplementationOnce(
			async expectedStudentID => {
				await new Promise<void>(resolve => {
					resolveValidation = resolve;
				});
				if (expectedStudentID !== student._id) return false;
				store.currentUser = { ...student };
				store.studentSessionRevalidating = false;
				store.studentSessionValidatedAt = 20_000;
				return true;
			}
		);
		stopLifecycle = startStudentSessionLifecycle(store, {
			now: () => 10_001
		});

		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden"
		});
		document.dispatchEvent(new Event("visibilitychange"));
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});
		document.dispatchEvent(new Event("visibilitychange"));

		expect(store.revalidateStudentSession).toHaveBeenCalledWith(
			student._id
		);
		expect(store.currentUser).toBeNull();

		resolveValidation?.();
		await flushPromises();
		expect(store.currentUser?._id).toBe(student._id);
		expect(store.studentSessionRevalidating).toBe(false);
	});

	it("hides a stale focused student before its lease probe", () => {
		const store = lifecycleStore();
		stopLifecycle = startStudentSessionLifecycle(store, {
			now: () =>
				store.studentSessionValidatedAt +
				STUDENT_SESSION_VALIDATION_LEASE_MS +
				1
		});

		window.dispatchEvent(new Event("focus"));

		expect(store.currentUser).toBeNull();
		expect(store.studentSessionRevalidating).toBe(true);
		expect(store.revalidateStudentSession).toHaveBeenCalledWith(
			student._id
		);
	});
});
