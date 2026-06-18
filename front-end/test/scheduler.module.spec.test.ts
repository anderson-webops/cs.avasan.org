import { describe, expect, it } from "vitest";
import {
	buildSchedulerEmbedUrl,
	buildSchedulerUrl,
	DEFAULT_SCHEDULER_ORIGIN,
	normalizeSchedulerOrigin,
	SCHEDULER_ORIGIN,
	schedulerDnsPrefetchHref,
	schedulerEmbedThemeMessageSource,
	schedulerEmbedThemeType,
	schedulerManageBookingUrl,
	schedulerPortalUrl,
	schedulerUrl
} from "@/modules/scheduler";

describe("scheduler embed helpers", () => {
	it("defaults to the production scheduler service", () => {
		expect(SCHEDULER_ORIGIN).toBe(DEFAULT_SCHEDULER_ORIGIN);
		expect(schedulerUrl).toBe(`${DEFAULT_SCHEDULER_ORIGIN}/`);
		expect(schedulerDnsPrefetchHref).toBe(
			"//scheduler.classes.jacobdanderson.net"
		);
	});

	it("normalizes configured scheduler origins", () => {
		expect(normalizeSchedulerOrigin("http://localhost:5173/calendar")).toBe(
			"http://localhost:5173"
		);
		expect(normalizeSchedulerOrigin("scheduler.classes.jacobdanderson.net")).toBe(
			DEFAULT_SCHEDULER_ORIGIN
		);
		expect(normalizeSchedulerOrigin("ftp://example.invalid")).toBe(
			DEFAULT_SCHEDULER_ORIGIN
		);
	});

	it("builds an embedded scheduler URL without forcing a theme by default", () => {
		const url = new URL(buildSchedulerEmbedUrl());

		expect(url.toString()).toBe(`${schedulerUrl}?embed=1`);
		expect(url.searchParams.get("theme")).toBeNull();
	});

	it("passes the parent theme through the embed URL", () => {
		const url = new URL(buildSchedulerEmbedUrl("light"));

		expect(url.searchParams.get("embed")).toBe("1");
		expect(url.searchParams.get("theme")).toBe("light");
	});

	it("builds explicit scheduler subpaths for portal and manage flows", () => {
		expect(schedulerPortalUrl).toBe(`${DEFAULT_SCHEDULER_ORIGIN}/portal`);
		expect(schedulerManageBookingUrl).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/booking/manage`
		);
		expect(buildSchedulerUrl("portal")).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/portal`
		);
	});

	it("keeps scheduler URL search params on the configured scheduler origin", () => {
		const sampleSearchParam = "sample search param";
		const url = new URL(
			buildSchedulerUrl("/booking/manage", {
				empty: "",
				token: sampleSearchParam
			})
		);

		expect(url.origin).toBe(DEFAULT_SCHEDULER_ORIGIN);
		expect(url.pathname).toBe("/booking/manage");
		expect(url.searchParams.get("token")).toBe(sampleSearchParam);
		expect(url.searchParams.has("empty")).toBe(false);
	});

	it("does not allow arbitrary absolute URLs as scheduler paths", () => {
		expect(buildSchedulerUrl("https://example.invalid/portal")).toBe(
			schedulerUrl
		);
		expect(buildSchedulerUrl("//example.invalid/portal")).toBe(schedulerUrl);
	});

	it("exposes the theme message contract used by the iframe", () => {
		expect(schedulerEmbedThemeMessageSource).toBe(
			"classes.jacobdanderson.net"
		);
		expect(schedulerEmbedThemeType).toBe("scheduler:theme");
	});
});
