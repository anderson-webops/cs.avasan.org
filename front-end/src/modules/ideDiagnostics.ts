import { PYODIDE_VERSION } from "@/modules/pythonIdeRuntimeHints";

export type IdeStage =
	| "idle"
	| "loading-runtime"
	| "loading-packages"
	| "loading-assets"
	| "preparing"
	| "executing"
	| "rendering"
	| "saving"
	| "importing"
	| "exporting"
	| "completed"
	| "stopped";
export type IdeCategory =
	"none" | "student-code" | "ide-runtime" | "needs-review";
export type IdeMode =
	"python" | "turtle" | "pgzero" | "data" | "java" | "karel" | "bluej";
export type IdeStackModule =
	| "turtle"
	| "pygame"
	| "python-runtime"
	| "python-worker"
	| "java-runtime"
	| "workspace";
export interface SafeStackFrame {
	module?: IdeStackModule;
	scope: "project" | "python-runtime" | "browser";
	line: number;
	column?: number;
}
export const pythonErrorTypes = [
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
	"MemoryError"
] as const;
export type IdeErrorType =
	| (typeof pythonErrorTypes)[number]
	| "None"
	| "JavaDiagnostic"
	| "MissingSourceFile"
	| "UnknownError";
export interface IdeFailure {
	errorType: IdeErrorType;
	category: IdeCategory;
	stack: SafeStackFrame[];
}

/**
 * Extract only numeric locations. Never retain messages, function names,
 * source lines, filenames, URLs, local paths, or printed/private values.
 */
export function sanitizeIdeError(
	error: unknown,
	stage: IdeStage,
	mode: IdeMode
): IdeFailure {
	const raw = (
		error instanceof Error
			? `${error.message}\n${error.stack ?? ""}`
			: String(error)
	).slice(0, 32000);
	if (/^Add a \.(?:java|py) file before running this project\.$/.test(raw)) {
		return {
			errorType: "MissingSourceFile",
			category: "student-code",
			stack: []
		};
	}
	const stack: SafeStackFrame[] = [];
	let errorType: IdeErrorType = "UnknownError";
	for (const line of raw.split("\n")) {
		const pythonType = line.trim().match(/^([A-Za-z]+Error)(?::|$)/)?.[1];
		if (
			pythonErrorTypes.includes(
				pythonType as (typeof pythonErrorTypes)[number]
			)
		) {
			errorType = pythonType as IdeErrorType;
		}
		const pythonFrame = line.match(
			/^\s*File "([^"]{1,500})", line (\d{1,7})/
		);
		const jsFrame = line.match(
			/(?:\.m?js|\.ts|\.vue):(\d{1,7}):(\d{1,7})\)?$/
		);
		if (stack.length >= 20) continue;
		if (pythonFrame && Number(pythonFrame[2]) > 0) {
			const path = pythonFrame[1];
			const runtime =
				/(?:^|\/)(?:_classes_[^/]+|turtle|pygame|pgzrun)\.py$/.test(
					path
				) || path.startsWith("/lib/");
			stack.push({
				...(runtime && /(?:^|\/)turtle\.py$/.test(path)
					? { module: "turtle" as const }
					: {}),
				...(runtime &&
				/(?:^|\/)(?:pygame|_classes_pgzero)\.py$/.test(path)
					? { module: "pygame" as const }
					: {}),
				scope: runtime ? "python-runtime" : "project",
				line: Number(pythonFrame[2])
			});
		} else if (
			jsFrame &&
			Number(jsFrame[1]) > 0 &&
			Number(jsFrame[2]) > 0
		) {
			const moduleName = line.match(
				/\/(CodeIdeWorkspace|pythonIdeRuntime|python-ide-runtime|pythonIdePlainWorker|javaIdeRuntime)(?:-[\w-]{8,32})?\.(?:vue|ts|js):\d+:\d+\)?$/
			)?.[1];
			const modules: Record<string, IdeStackModule> = {
				CodeIdeWorkspace: "workspace",
				pythonIdeRuntime: "python-runtime",
				"python-ide-runtime": "python-runtime",
				pythonIdePlainWorker: "python-worker",
				javaIdeRuntime: "java-runtime"
			};
			stack.push({
				...(moduleName ? { module: modules[moduleName] } : {}),
				scope: "browser",
				line: Number(jsFrame[1]),
				column: Number(jsFrame[2])
			});
		}
	}
	const pythonFrames = stack.filter(frame => frame.scope !== "browser");
	const pythonOrigin = pythonFrames.at(-1)?.scope;
	let category: IdeCategory = "needs-review";
	if (
		[
			"loading-runtime",
			"loading-assets",
			"preparing",
			"exporting",
			"saving"
		].includes(stage)
	) {
		category = "ide-runtime";
	} else if (pythonOrigin === "python-runtime") {
		category = "ide-runtime";
	} else if (
		stage === "executing" &&
		pythonOrigin === "project" &&
		pythonErrorTypes.includes(
			errorType as (typeof pythonErrorTypes)[number]
		) &&
		!["MemoryError", "RuntimeError"].includes(errorType)
	) {
		category = "student-code";
	}
	// Java preview diagnostics include unsupported features as well as mistakes.
	if (
		["java", "karel", "bluej"].includes(mode) &&
		!(error instanceof Error)
	) {
		errorType = "JavaDiagnostic";
		if (
			stage === "executing" &&
			/^(?:Scanner (?:input ran out|could not read)|Random\.nextInt\(bound\) requires a positive bound)/.test(
				raw
			)
		) {
			category = "student-code";
		}
	}
	return { errorType, category, stack };
}

export function browserVersion(userAgent: string) {
	for (const [name, pattern] of [
		["Edge", /Edg\/(\d+(?:\.\d+){0,3})/],
		["Firefox", /(?:Firefox|FxiOS)\/(\d+(?:\.\d+){0,3})/],
		["Chrome", /(?:Chrome|CriOS)\/(\d+(?:\.\d+){0,3})/],
		["Safari", /Version\/(\d+(?:\.\d+){0,3})/]
	] as const) {
		if (name === "Safari" && !userAgent.includes("Safari")) continue;
		const match = userAgent.slice(0, 1000).match(pattern);
		if (match) return { name, version: match[1] };
	}
	return { name: "Other" as const, version: "unknown" };
}

export function safeRuntimeVersion(value: unknown) {
	return typeof value === "string" &&
		value.length <= 40 &&
		/^\d+(?:\.\d+){0,3}$/.test(value)
		? value
		: "unknown";
}

export function createIdeDiagnostics(
	mode: IdeMode,
	stage: IdeStage,
	failure: IdeFailure | null,
	pythonVersion: string
) {
	const build =
		typeof __CLASSES_BUILD__ === "undefined"
			? { release: "unreleased", revision: "unknown" }
			: __CLASSES_BUILD__;
	const java = ["java", "karel", "bluej"].includes(mode);
	return {
		schemaVersion: 1 as const,
		referenceID: crypto.randomUUID(),
		site: window.location.origin,
		...build,
		browser: browserVersion(navigator.userAgent),
		runtime: {
			engine: java ? ("java-preview" as const) : ("pyodide" as const),
			version: java ? "unknown" : PYODIDE_VERSION,
			pythonVersion: java ? "not-loaded" : pythonVersion,
			adapterRevision: build.revision,
			blueJVersion: "unknown" as const
		},
		mode,
		stage,
		...(failure ?? {
			category: "none" as const,
			errorType: "None" as const,
			stack: []
		})
	};
}

export type IdeDiagnostics = ReturnType<typeof createIdeDiagnostics>;

export const ideCategoryLabels: Record<IdeCategory, string> = {
	none: "No captured error",
	"student-code": "Likely programming error",
	"ide-runtime": "IDE or runtime issue",
	"needs-review": "Needs review"
};
