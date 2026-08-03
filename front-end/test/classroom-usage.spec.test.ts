import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	reportClassroomUsage,
	type ClassroomUsageEvent
} from "@/modules/classroomUsage";

function setNavigatorPrivacySignal(
	name: "doNotTrack" | "globalPrivacyControl" | "msDoNotTrack",
	value: boolean | string | null
) {
	Object.defineProperty(navigator, name, {
		configurable: true,
		value
	});
}

describe("privacy-first classroom usage", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-29T20:15:00.000Z"));
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "test-policy-1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-07-29"
		);
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Test operator contact"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Test approved provider notice"
		);
		window.sessionStorage.clear();
		setNavigatorPrivacySignal("doNotTrack", null);
		setNavigatorPrivacySignal("msDoNotTrack", null);
		setNavigatorPrivacySignal("globalPrivacyControl", false);
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.unstubAllEnvs();
		vi.useRealTimers();
		window.sessionStorage.clear();
	});

	it("sends only a whitelisted course and deduplicates by UTC date", async () => {
		await reportClassroomUsage("course-open", "python-level-1");
		await reportClassroomUsage("course-open", "python-level-1");

		expect(fetch).toHaveBeenCalledOnce();
		expect(fetch).toHaveBeenCalledWith(
			"/api/classroom-usage",
			expect.objectContaining({
				body: JSON.stringify({
					siteID: "cs",
					event: "course-open",
					courseId: "python-level-1"
				}),
				credentials: "omit",
				headers: {
					"Content-Type": "application/json",
					"X-Classroom-Request": "1"
				},
				method: "POST",
				mode: "same-origin",
				redirect: "error",
				referrerPolicy: "no-referrer"
			})
		);
		expect([...Object.keys(window.sessionStorage)]).toEqual([
			"cs-avasan:classroom-usage:2026-07-29:course-open:python-level-1"
		]);
	});

	it("does not attach untrusted course input to an IDE count", async () => {
		await reportClassroomUsage(
			"ide-open",
			"student-name-or-untrusted-value"
		);

		const request = vi.mocked(fetch).mock.calls[0];
		expect(JSON.parse(String(request?.[1]?.body))).toEqual({
			siteID: "cs",
			event: "ide-open"
		});
		expect(String(request?.[1]?.body)).not.toContain(
			"student-name-or-untrusted-value"
		);
	});

	it("does not attach a course to an IDE count", async () => {
		await reportClassroomUsage("ide-open", "python-level-2");
		await reportClassroomUsage("ide-open", "pygames");

		expect(fetch).toHaveBeenCalledOnce();
		expect(
			JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body))
		).toEqual({
			siteID: "cs",
			event: "ide-open"
		});
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe("attempted");
	});

	it("drops an unsupported runtime event", async () => {
		await reportClassroomUsage(
			"student-name" as ClassroomUsageEvent,
			"python-level-1"
		);

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it("drops an unknown course instead of sending arbitrary data", async () => {
		await reportClassroomUsage("course-open", "student-name");

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it.each([
		["Do Not Track", "doNotTrack", "1"],
		["legacy Do Not Track", "msDoNotTrack", "yes"],
		["Global Privacy Control", "globalPrivacyControl", true]
	] as const)(
		"does not report when %s is enabled",
		async (_label, key, value) => {
			setNavigatorPrivacySignal(key, value);

			await reportClassroomUsage("ide-open", "pygames");

			expect(fetch).not.toHaveBeenCalled();
			expect(window.sessionStorage.length).toBe(0);
		}
	);

	it("does not report until classroom usage collection is enabled", async () => {
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "false");

		await reportClassroomUsage("course-open", "python-level-1");

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it("does not report when approval or the direct contact is missing", async () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "false");
		await reportClassroomUsage("course-open", "python-level-1");
		expect(fetch).not.toHaveBeenCalled();

		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_SCHOOL_PRIVACY_CONTACT", "");
		await reportClassroomUsage("course-open", "python-level-1");
		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it("does not retry after an unsuccessful response", async () => {
		vi.mocked(fetch)
			.mockResolvedValueOnce(new Response(null, { status: 503 }))
			.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await reportClassroomUsage("ide-open", "python-level-2");
		await reportClassroomUsage("ide-open", "pygames");

		expect(fetch).toHaveBeenCalledOnce();
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe("attempted");
	});

	it("retains its attempt marker after a rejected response", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response(null, { status: 400 })
		);

		await reportClassroomUsage("ide-open", "python-level-2");

		expect(fetch).toHaveBeenCalledOnce();
		expect(window.sessionStorage.length).toBe(1);
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe("attempted");
	});

	it("deduplicates concurrent reports while delivery is pending", async () => {
		let finishRequest: ((response: Response) => void) | undefined;
		vi.mocked(fetch).mockImplementationOnce(
			() =>
				new Promise<Response>(resolve => {
					finishRequest = resolve;
				})
		);

		const firstReport = reportClassroomUsage("ide-open");
		await reportClassroomUsage("ide-open");

		expect(fetch).toHaveBeenCalledOnce();
		finishRequest?.(new Response(null, { status: 204 }));
		await firstReport;
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe("attempted");
	});

	it("does not retry after any marker written by an earlier version", async () => {
		window.sessionStorage.setItem(
			"cs-avasan:classroom-usage:2026-07-29:ide-open:none",
			`pending:${Date.now() - 30_001}`
		);

		await reportClassroomUsage("ide-open");

		expect(fetch).not.toHaveBeenCalled();
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe(`pending:${Date.now() - 30_001}`);
	});

	it("does not retry after a static HTML fallback", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response("<!doctype html>", {
				headers: { "Content-Type": "text/html" },
				status: 200
			})
		);

		await reportClassroomUsage("ide-open", "python-level-2");
		await reportClassroomUsage("ide-open", "python-level-2");

		expect(fetch).toHaveBeenCalledOnce();
		expect(window.sessionStorage.length).toBe(1);
	});

	it("fails silently when reporting is unavailable", async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"));

		await expect(
			reportClassroomUsage("ide-open", "python-level-2")
		).resolves.toBeUndefined();
		expect(window.sessionStorage.length).toBe(1);
		expect(
			window.sessionStorage.getItem(
				"cs-avasan:classroom-usage:2026-07-29:ide-open:none"
			)
		).toBe("attempted");
	});
});
