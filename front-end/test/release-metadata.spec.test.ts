import { describe, expect, it } from "vitest";
import { releaseMetadata } from "../scripts/write-release-metadata.mjs";

describe("release metadata", () => {
	it("normalizes a release version and records the exact source revision", () => {
		expect(
			releaseMetadata({
				CS_RELEASE_VERSION: "v1.2.3",
				SOURCE_REVISION: "a".repeat(40)
			})
		).toEqual({
			revision: "a".repeat(40),
			version: "1.2.3"
		});
	});

	it("uses a reproducible local-build default without enabling classroom features", () => {
		expect(
			releaseMetadata(
				{
					VITE_CLASSROOM_PRIVACY_APPROVED: "true",
					VITE_CLASSROOM_USAGE_ENABLED: "true",
					VITE_STUDENT_ACCOUNTS_ENABLED: "true"
				},
				"1.0.0"
			)
		).toEqual({
			revision: "unknown",
			version: "1.0.0"
		});
	});

	it("uses Netlify's full commit reference when SOURCE_REVISION is absent", () => {
		expect(
			releaseMetadata(
				{ COMMIT_REF: "b".repeat(40) },
				"1.0.0"
			)
		).toEqual({
			revision: "b".repeat(40),
			version: "1.0.0"
		});
	});

	it.each([
		[
			{ CS_RELEASE_VERSION: "latest", SOURCE_REVISION: "a".repeat(40) },
			"CS_RELEASE_VERSION"
		],
		[
			{ CS_RELEASE_VERSION: "1.2.3", SOURCE_REVISION: "short" },
			"SOURCE_REVISION"
		],
		[
			{ COMMIT_REF: "A".repeat(40) },
			"SOURCE_REVISION"
		]
	])("rejects ambiguous release metadata", (environment, message) => {
		expect(() => releaseMetadata(environment, "1.0.0")).toThrow(message);
	});
});
