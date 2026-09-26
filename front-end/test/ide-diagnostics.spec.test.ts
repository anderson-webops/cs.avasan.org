import { describe, expect, it } from "vitest";
import {
	browserVersion,
	createIdeDiagnostics,
	sanitizeIdeError
} from "@/modules/ideDiagnostics";
import { ideReportSchema } from "../../back-end/src/utils/ideDiagnostics";

describe("private IDE diagnostics", () => {
	it("treats a missing source file as a project issue rather than a runtime failure", () => {
		expect(sanitizeIdeError("Add a .java file before running this project.", "preparing", "karel")).toEqual({ errorType: "MissingSourceFile", category: "student-code", stack: [] });
	});
	it("removes source, values, names, file paths and query strings from Python/JS tracebacks", () => {
		const error = new Error(
			'Traceback (most recent call last):\n  File "/Users/student/private.py", line 12, in secret_name\n    print(secret_password)\nNameError: student@example.com password=supersecret'
		);
		error.stack =
			"at secretFunction (https://example.com/assets/ide.js?token=secret:100:2)\n at secret (https://example.com/assets/ide.js:101:3)";
		const safe = sanitizeIdeError(error, "executing", "python");
		expect(safe.category).toBe("student-code");
		expect(safe.errorType).toBe("NameError");
		expect(safe.stack).toEqual([
			{ scope: "project", line: 12 },
			{ scope: "browser", line: 101, column: 3 }
		]);
		expect(JSON.stringify(safe)).not.toMatch(
			/student@example|private|secret|example|print/
		);
	});
	it("distinguishes runtime shim errors, startup failures and uncertain Java preview diagnostics", () => {
		expect(
			sanitizeIdeError(
				'File "pygame.py", line 4\nAttributeError: private',
				"executing",
				"pgzero"
			).category
		).toBe("ide-runtime");
		expect(
			sanitizeIdeError(
				new TypeError("Failed to fetch secret URL"),
				"loading-runtime",
				"python"
			).category
		).toBe("ide-runtime");
		expect(
			sanitizeIdeError(
				'Scanner could not read int from "private"',
				"executing",
				"java"
			)
		).toMatchObject({
			category: "student-code",
			errorType: "JavaDiagnostic",
			stack: []
		});
		expect(
			sanitizeIdeError("made up student output", "executing", "turtle")
				.category
		).toBe("needs-review");
	});
	it("bounds large stacks and excludes unknown exception names", () => {
		const safe = sanitizeIdeError(
			`${'File "secret.py", line 1\n'.repeat(10000)}SecretError: private`,
			"executing",
			"python"
		);
		expect(safe.stack).toHaveLength(20);
		expect(safe.errorType).toBe("UnknownError");
	});
	it("records only browser family/version, not the raw user agent", () => {
		expect(
			browserVersion("Private device Chrome/148.0.1.2 Edg/148.0.2.3")
		).toEqual({ name: "Edge", version: "148.0.2.3" });
		expect(browserVersion("Version/26.1 Safari/605.1.15 private")).toEqual({
			name: "Safari",
			version: "26.1"
		});
		expect(browserVersion("private device")).toEqual({
			name: "Other",
			version: "unknown"
		});
	});
	it.each([
		"python",
		"turtle",
		"pgzero",
		"data",
		"java",
		"karel",
		"bluej"
	] as const)("produces a server-valid snapshot for %s", mode => {
		const diagnostics = createIdeDiagnostics(
			mode,
			"idle",
			null,
			"not-loaded"
		);
		expect(
			ideReportSchema.safeParse({
				diagnostics,
				description: "",
				previewConfirmed: true
			}).success
		).toBe(true);
		expect(diagnostics.site).not.toContain("?");
		expect(diagnostics.runtime.blueJVersion).toBe("unknown");
	});
});
