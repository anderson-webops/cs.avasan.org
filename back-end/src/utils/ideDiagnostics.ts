import { z } from "zod";

const version = z
	.string()
	.regex(/^(?:unknown|not-loaded|\d+(?:\.\d+){0,3})$/)
	.max(40);
const revision = z.string().regex(/^(?:unknown|[a-f0-9]{40})$/);
export const ideDiagnosticSchema = z
	.object({
		schemaVersion: z.literal(1),
		referenceID: z.uuid(),
		site: z
			.url()
			.max(200)
			.refine((value) => {
				try {
					const url = new URL(value);
					return ["https:", "http:"].includes(url.protocol) && url.origin === value;
				}
				catch { return false; }
			}),
		release: z.string().regex(/^(?:unreleased|v2\.\d+\.\d+)$/),
		revision,
		browser: z
			.object({
				name: z.enum(["Chrome", "Edge", "Firefox", "Safari", "Other"]),
				version
			})
			.strict(),
		runtime: z
			.object({
				engine: z.enum(["pyodide", "java-preview"]),
				version,
				pythonVersion: version,
				adapterRevision: revision,
				blueJVersion: z.literal("unknown")
			})
			.strict(),
		mode: z.enum([
			"python",
			"turtle",
			"pgzero",
			"data",
			"java",
			"karel",
			"bluej"
		]),
		stage: z.enum([
			"idle",
			"loading-runtime",
			"loading-packages",
			"loading-assets",
			"preparing",
			"executing",
			"rendering",
			"saving",
			"importing",
			"exporting",
			"completed",
			"stopped"
		]),
		category: z.enum([
			"none",
			"student-code",
			"ide-runtime",
			"needs-review"
		]),
		errorType: z.enum([
			"None",
			"SyntaxError",
			"IndentationError",
			"TabError",
			"NameError",
			"UnboundLocalError",
			"TypeError",
			"ValueError",
			"IndexError",
			"KeyError",
			"ZeroDivisionError",
			"AttributeError",
			"ImportError",
			"ModuleNotFoundError",
			"EOFError",
			"AssertionError",
			"RecursionError",
			"RuntimeError",
			"MemoryError",
			"JavaDiagnostic",
			"MissingSourceFile",
			"UnknownError"
		]),
		stack: z
			.array(
				z
					.object({
						scope: z.enum(["project", "python-runtime", "browser"]),
						module: z.enum(["turtle", "pygame", "python-runtime", "python-worker", "java-runtime", "workspace"]).optional(),
						line: z.number().int().min(1).max(10000000),
						column: z.number().int().min(1).max(10000000).optional()
					})
					.strict()
			)
			.max(20)
	})
	.strict();

export const ideReportSchema = z
	.object({
		diagnostics: ideDiagnosticSchema,
		// Explicitly authored, previewed text, never automatic console/source output.
		description: z.string().trim().max(1200),
		previewConfirmed: z.literal(true)
	})
	.strict();

export const ideReportRetentionSeconds = 90 * 24 * 60 * 60;
