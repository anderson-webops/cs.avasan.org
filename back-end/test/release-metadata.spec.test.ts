import { describe, expect, it } from "vitest";
import {
	DEFAULT_CS_RELEASE_VERSION,
	readReleaseMetadata
} from "../src/security/releaseMetadata.js";

describe("API release metadata", () => {
	it("normalizes the version and records the exact source revision", () => {
		expect(
			readReleaseMetadata({
				CS_RELEASE_VERSION: "v1.2.3",
				SOURCE_REVISION: "a".repeat(40)
			})
		).toEqual({
			revision: "a".repeat(40),
			version: "1.2.3"
		});
	});

	it("uses safe defaults when deployment identity is absent", () => {
		expect(
			readReleaseMetadata({
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
				CLASSROOM_PRIVACY_APPROVED: "true",
				STUDENT_ACCOUNTS_ENABLED: "true"
			})
		).toEqual({
			revision: "unknown",
			version: DEFAULT_CS_RELEASE_VERSION
		});
	});

	it.each([
		[{ CS_RELEASE_VERSION: "latest" }, "CS_RELEASE_VERSION"],
		[{ SOURCE_REVISION: "short" }, "SOURCE_REVISION"],
		[{ SOURCE_REVISION: "A".repeat(40) }, "SOURCE_REVISION"]
	])("rejects ambiguous release metadata", (environment, message) => {
		expect(() => readReleaseMetadata(environment)).toThrow(message);
	});
});
