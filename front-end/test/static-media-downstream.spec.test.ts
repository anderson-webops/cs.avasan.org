import { describe, expect, it } from "vitest";
import {
	STATIC_MEDIA_BASE,
	canonicalStaticMediaUrl,
	normalizeStaticMediaUrlsInText
} from "../src/stores/courses/staticMedia";

describe("downstream static media", () => {
	it("canonicalizes inherited course links to the Avasan asset host", () => {
		expect(STATIC_MEDIA_BASE).toBe("https://static.cs.avasan.org");
		expect(
			canonicalStaticMediaUrl(
				"https://static.classes.jacobdanderson.net/example.gif"
			)
		).toBe("https://static.cs.avasan.org/example.gif");
		expect(
			normalizeStaticMediaUrlsInText(
				"Demo: https://static.classes.jacobdanderson.net/example.gif"
			)
		).toBe("Demo: https://static.cs.avasan.org/example.gif");
	});
});
