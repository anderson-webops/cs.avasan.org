import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportClassroomUsage } from "@/modules/classroomUsage";

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
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		window.sessionStorage.clear();
		setNavigatorPrivacySignal("doNotTrack", null);
		setNavigatorPrivacySignal("msDoNotTrack", null);
		setNavigatorPrivacySignal("globalPrivacyControl", false);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));
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

	it("removes an unknown course instead of sending arbitrary data", async () => {
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

	it.each([
		["Do Not Track", "doNotTrack", "1"],
		["legacy Do Not Track", "msDoNotTrack", "yes"],
		["Global Privacy Control", "globalPrivacyControl", true]
	] as const)("does not report when %s is enabled", async (_label, key, value) => {
		setNavigatorPrivacySignal(key, value);

		await reportClassroomUsage("ide-open", "pygames");

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it("does not report until classroom usage collection is enabled", async () => {
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "false");

		await reportClassroomUsage("course-open", "python-level-1");

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});

	it("fails silently when reporting is unavailable", async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"));

		await expect(
			reportClassroomUsage("ide-open", "python-level-2")
		).resolves.toBeUndefined();
	});
});
