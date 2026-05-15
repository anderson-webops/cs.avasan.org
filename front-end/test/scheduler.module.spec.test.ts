import { describe, expect, it } from "vitest";
import {
	buildSchedulerEmbedUrl,
	schedulerEmbedThemeMessageSource,
	schedulerEmbedThemeType,
	schedulerUrl
} from "@/modules/scheduler";

describe("scheduler embed helpers", () => {
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

	it("exposes the theme message contract used by the iframe", () => {
		expect(schedulerEmbedThemeMessageSource).toBe(
			"classes.jacobdanderson.net"
		);
		expect(schedulerEmbedThemeType).toBe("scheduler:theme");
	});
});
