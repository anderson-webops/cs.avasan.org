import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EditorSelection, EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { describe, expect, it, vi } from "vitest";
import {
	canSkipExistingClosingToken,
	pythonIdeCompletionSource,
	pythonIdeCompletionsForMode,
	pythonNewlineIndentText,
	pythonRuntimeDiagnosticForLine,
	pythonSyntaxDiagnostics
} from "../src/modules/pythonCodeMirror";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

function completionMatchBefore(doc: string, pos: number, expression: RegExp) {
	const prefix = doc.slice(0, pos);
	const match = prefix.match(expression);
	if (!match?.[0]) return null;
	return {
		from: pos - match[0].length,
		text: match[0],
		to: pos
	};
}

describe("python IDE CodeMirror editor", () => {
	it("does not eager-import IDE feature modules through the app plugin loader", () => {
		const mainSource = sourceFile("../src/main.ts");

		expect(mainSource).toContain('import: "install"');
		expect(mainSource).toContain("./modules/admin-guard.ts");
		expect(mainSource).toContain("./modules/i18n.ts");
		expect(mainSource).toContain("./modules/nprogress.ts");
		expect(mainSource).toContain("./modules/pinia.ts");
		expect(mainSource).not.toContain('"./modules/*.ts"');
		expect(mainSource).not.toContain("./modules/pythonCodeMirror.ts");
		expect(mainSource).not.toContain("./modules/pythonIdeRuntime.ts");
	});

	it("keeps the route page as a lightweight async workspace wrapper", () => {
		const routeSource = sourceFile("../src/pages/python-ide.vue");

		expect(routeSource).toContain("defineAsyncComponent");
		expect(routeSource).toContain(
			'() => import("@/components/PythonIdeWorkspace.vue")'
		);
		expect(routeSource).not.toContain("new EditorView");
		expect(routeSource).not.toContain("loadPythonIdeRuntime");
	});

	it("does not force CodeMirror through a fragile manual editor chunk", () => {
		const viteSource = sourceFile("../vite.config.mts");

		expect(viteSource).not.toContain('name: "python-ide-editor"');
		expect(viteSource).not.toContain(
			"test: /src\\/modules\\/pythonCodeMirror\\.ts$/"
		);
		expect(viteSource).toContain('name: "python-ide-runtime"');
	});

	it("does not import the heavy Pyodide runtime before running code", () => {
		const pageSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);
		const runtimeSource = sourceFile("../src/modules/pythonIdeRuntime.ts");
		const hintSource = sourceFile(
			"../src/modules/pythonIdeRuntimeHints.ts"
		);

		expect(pageSource).toContain("import { primePythonRuntimeConnection }");
		expect(pageSource).toContain("primePythonRuntimeConnection();");
		expect(pageSource).not.toContain("warmPythonRuntimeResources();");
		expect(pageSource).not.toContain(
			"loadPythonRuntimeModule().then(module => module.warmPythonRuntime())"
		);
		expect(pageSource).toContain(
			"if (!pythonRuntimeModulePromise) return;"
		);
		expect(pageSource).toContain("releaseLoadedPythonRuntimeCallbacks();");
		expect(runtimeSource).toContain("warmPythonRuntimeResources();");
		expect(hintSource).toContain(
			"export function primePythonRuntimeConnection"
		);
		expect(hintSource).toContain(
			"export function warmPythonRuntimeResources"
		);
		expect(hintSource).toContain("const PYTHON_RUNTIME_CONNECTION_HINTS");
		expect(hintSource).toContain("const PYTHON_RUNTIME_RESOURCE_HINTS");
		expect(hintSource).toContain(
			"https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/"
		);
	});

	it("mounts CodeMirror instead of the old textarea highlight overlay", () => {
		const pageSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);

		expect(pageSource).toContain("createPythonCodeMirrorExtensions");
		expect(pageSource).toContain("new EditorView");
		expect(pageSource).toContain("codeEditorHostRef");
		expect(pageSource).toContain('class="code-editor-host"');
		expect(pageSource).not.toContain("highlightPythonCodeAsHtml");
		expect(pageSource).not.toContain("code-editor-highlight");
		expect(pageSource).not.toContain("handleCodeEditorKeyDown");
	});

	it("enables Python parsing and typical IDE editing behavior", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");
		const pageSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);

		expect(editorSource).toContain("pythonEditorBaseSetup");
		expect(editorSource).toContain("lineNumbers()");
		expect(editorSource).toContain("history()");
		expect(editorSource).toContain("autocompletion()");
		expect(editorSource).toContain("highlightSelectionMatches()");
		expect(editorSource).not.toContain('from "codemirror"');
		expect(editorSource).toContain("python()");
		expect(editorSource).toContain("indentWithTab");
		expect(editorSource).toContain(
			"codeMirrorInsertNewlineAndIndent(view)"
		);
		expect(editorSource).toContain("insertPythonNewlineWithFallbackIndent");
		expect(editorSource).toContain("EditorState.allowMultipleSelections");
		expect(editorSource).toContain(".cm-panel.cm-search");
		expect(editorSource).toContain(".cm-foldPlaceholder");
		expect(editorSource).toContain("insertPythonNewlineAndIndent");
		expect(editorSource).toContain("wrapSelection");
		expect(editorSource).toContain("closingTokenSkipKeymap");
		expect(editorSource).toContain("pythonEditorActionKeymap");
		expect(editorSource).toContain("Mod-s");
		expect(editorSource).toContain("Mod-Enter");
		expect(editorSource).toContain("canSkipExistingClosingToken");
		expect(editorSource).toContain("syntaxHighlighting");
		expect(editorSource).toContain("BracketPairColorPlugin");
		expect(editorSource).toContain("cm-bracket-pair-1");
		expect(editorSource).toContain("pythonLanguage.data.of");
		expect(editorSource).toContain("pythonIdeCompletionSource");
		expect(editorSource).toContain("pythonSyntaxDiagnostics");
		expect(editorSource).toContain("linter(view =>");
		expect(editorSource).toContain("lintGutter({ hoverTime: 220 })");
		expect(pageSource).toContain(
			'mode: selectedProject.value?.mode ?? "python"'
		);
	});

	it("surfaces the built-in editor shortcuts in the IDE chrome", () => {
		const pageSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);

		expect(pageSource).toContain('class="editor-shortcuts"');
		expect(pageSource).toContain("Cmd/Ctrl+F opens search.");
		expect(pageSource).toMatch(/Cmd\/Ctrl\+Enter\s+runs the project\./);
		expect(pageSource).toContain("Cmd/Ctrl+S saves the project.");
		expect(pageSource).toContain("Tab indents; Shift+Tab dedents.");
		expect(pageSource).toMatch(
			/Alt\/Option-drag creates a\s+rectangular selection\./
		);
		expect(pageSource).toContain("Quotes and brackets wrap highlighted");
	});

	it("offers course-runtime completions by immutable project mode", () => {
		const pageSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);
		const toolbarSource =
			pageSource.match(
				/class="editor-toolbar"[\s\S]*?<div class="ide-grid">/
			)?.[0] ?? "";
		const createMenuSource =
			pageSource.match(
				/class="project-create-menu"[\s\S]*?<div class="project-list">/
			)?.[0] ?? "";

		expect(toolbarSource).not.toContain("<select");
		expect(toolbarSource).not.toContain("selectedProject.mode");
		expect(createMenuSource).toContain("createProjectFromMenu('python')");
		expect(createMenuSource).toContain("createProjectFromMenu('data')");
		expect(createMenuSource).toContain("createProjectFromMenu('turtle')");
		expect(createMenuSource).toContain("createProjectFromMenu('pgzero')");

		expect(
			pythonIdeCompletionsForMode("pgzero").map(option => option.label)
		).toEqual(
			expect.arrayContaining([
				"Actor",
				"Animation",
				"HEIGHT",
				"WIDTH",
				"animate",
				"keys",
				"keyboard",
				"on_key_up",
				"on_mouse_move",
				"pgzrun",
				"screen",
				"tone"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "screen.draw").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"circle",
				"filled_circle",
				"filled_rect",
				"line",
				"text"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "player").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"anchor",
				"angle_to",
				"bottomright",
				"clipline",
				"collideobjects",
				"colliderect",
				"distance_to",
				"draw",
				"pos",
				"topleft"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "rect").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"clamp",
				"clip",
				"clipline",
				"collidelist",
				"collideobjects",
				"fit",
				"normalize",
				"scale_by",
				"unionall"
			])
		);
		expect(
			pythonIdeCompletionsForMode("turtle", "screen").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["bgcolor", "onkey", "ontimer"]));
		expect(
			pythonIdeCompletionsForMode("turtle", "t").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"hideturtle",
				"isvisible",
				"shape",
				"showturtle"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "clock").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"schedule",
				"schedule_interval",
				"schedule_unique",
				"unschedule"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "keys").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"B",
				"F12",
				"K_1",
				"KP_ENTER",
				"LEFT",
				"LSHIFT",
				"SPACE",
				"UP",
				"Z"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "keymods").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["ALT", "CTRL", "SHIFT"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "mouse").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["LEFT", "WHEEL_DOWN", "WHEEL_UP"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "screen").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["bounds", "fill"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "music").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"fadeout",
				"get_volume",
				"is_playing",
				"pause",
				"play",
				"play_once",
				"queue",
				"set_volume",
				"stop",
				"unpause"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "tone").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["create", "play"]));
		expect(
			pythonIdeCompletionsForMode("data").map(option => option.label)
		).toEqual(
			expect.arrayContaining([
				"DecisionTreeClassifier",
				"pd",
				"plt",
				"st"
			])
		);
	});

	it("completes member names after a runtime receiver dot", () => {
		const doc = "screen.dr";
		const state = EditorState.create({ doc });
		const result = pythonIdeCompletionSource("pgzero")({
			explicit: false,
			pos: doc.length,
			state,
			matchBefore: expression =>
				completionMatchBefore(doc, doc.length, expression)
		});

		expect(result).not.toBeNull();
		expect(result?.from).toBe("screen.".length);
		expect(result?.options.map(option => option.label)).toEqual(
			expect.arrayContaining(["draw"])
		);
	});

	it("offers PyGame Zero asset completions for project and course assets", async () => {
		const assetCompletions = {
			images: ["student", "space-ship"],
			music: ["theme"],
			sounds: ["eep"]
		};
		const imageMemberLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"images",
			assetCompletions
		).map(option => option.label);
		const actorDoc = 'player = Actor("space';
		const actorState = EditorState.create({ doc: actorDoc });
		const actorCompletionSource = pythonIdeCompletionSource(
			"pgzero",
			() => assetCompletions
		);
		const actorResult = await actorCompletionSource({
			explicit: false,
			pos: actorDoc.length,
			state: actorState,
			matchBefore: expression =>
				completionMatchBefore(actorDoc, actorDoc.length, expression)
		});
		const musicDoc = 'music.play("th';
		const musicState = EditorState.create({ doc: musicDoc });
		const musicCompletionSource = pythonIdeCompletionSource(
			"pgzero",
			() => assetCompletions
		);
		const musicResult = await musicCompletionSource({
			explicit: false,
			pos: musicDoc.length,
			state: musicState,
			matchBefore: expression =>
				completionMatchBefore(musicDoc, musicDoc.length, expression)
		});
		const playOnceDoc = 'music.play_once("th';
		const playOnceResult = await musicCompletionSource({
			explicit: false,
			pos: playOnceDoc.length,
			state: EditorState.create({ doc: playOnceDoc }),
			matchBefore: expression =>
				completionMatchBefore(
					playOnceDoc,
					playOnceDoc.length,
					expression
				)
		});
		const queueDoc = 'music.queue("th';
		const queueResult = await musicCompletionSource({
			explicit: false,
			pos: queueDoc.length,
			state: EditorState.create({ doc: queueDoc }),
			matchBefore: expression =>
				completionMatchBefore(queueDoc, queueDoc.length, expression)
		});
		const imageSurfaceLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"images.student",
			assetCompletions
		).map(option => option.label);
		const soundMemberLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"sounds.eep",
			assetCompletions
		).map(option => option.label);

		expect(imageMemberLabels).toContain("student");
		expect(imageMemberLabels).not.toContain("space-ship");
		expect(actorResult?.from).toBe('player = Actor("'.length);
		expect(actorResult?.options.map(option => option.label)).toEqual(
			expect.arrayContaining(["space-ship", "student"])
		);
		expect(musicResult?.from).toBe('music.play("'.length);
		expect(musicResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(playOnceResult?.from).toBe('music.play_once("'.length);
		expect(playOnceResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(queueResult?.from).toBe('music.queue("'.length);
		expect(queueResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(imageSurfaceLabels).toEqual(
			expect.arrayContaining([
				"get_height",
				"get_rect",
				"get_size",
				"get_width"
			])
		);
		expect(soundMemberLabels).toEqual(
			expect.arrayContaining(["get_length", "play", "stop"])
		);
	});

	it("loads asset completions lazily for PyGame asset contexts", async () => {
		const assetCompletions = vi.fn(async () => ({
			images: ["alien"],
			sounds: ["eep"]
		}));
		const memberDoc = "screen.dr";
		const memberResult = pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: memberDoc.length,
			state: EditorState.create({ doc: memberDoc }),
			matchBefore: expression =>
				completionMatchBefore(memberDoc, memberDoc.length, expression)
		});

		expect(memberResult?.options.map(option => option.label)).toContain(
			"draw"
		);
		expect(assetCompletions).not.toHaveBeenCalled();

		const actorDoc = 'ship = Actor("al';
		const actorResult = await pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: actorDoc.length,
			state: EditorState.create({ doc: actorDoc }),
			matchBefore: expression =>
				completionMatchBefore(actorDoc, actorDoc.length, expression)
		});

		expect(assetCompletions).toHaveBeenCalledTimes(1);
		expect(actorResult?.options.map(option => option.label)).toContain(
			"alien"
		);

		const imageDoc = "images.al";
		const imageResult = await pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: imageDoc.length,
			state: EditorState.create({ doc: imageDoc }),
			matchBefore: expression =>
				completionMatchBefore(imageDoc, imageDoc.length, expression)
		});

		expect(assetCompletions).toHaveBeenCalledTimes(2);
		expect(imageResult?.options.map(option => option.label)).toContain(
			"alien"
		);
	});

	it("offers original Turtle shape completions inside shape calls", () => {
		const doc = 't.shape("cl';
		const state = EditorState.create({ doc });
		const result = pythonIdeCompletionSource("turtle")({
			explicit: false,
			pos: doc.length,
			state,
			matchBefore: expression =>
				completionMatchBefore(doc, doc.length, expression)
		});

		expect(result?.from).toBe('t.shape("'.length);
		expect(result?.options.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"arrow",
				"blank",
				"circle",
				"classic",
				"fancy",
				"square",
				"triangle",
				"turtle"
			])
		);
	});

	it("bounds custom bracket-pair colorization to the visible editor range", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");

		expect(editorSource).toContain("view.visibleRanges");
		expect(editorSource).toContain("bracketPairContextPadding");
		expect(editorSource).toContain("sliceString(contextFrom, contextTo)");
	});

	it("skips existing auto-inserted closing tokens instead of duplicating them", () => {
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "print()",
					selection: { anchor: "print(".length }
				}),
				")"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "items[0]",
					selection: { anchor: "items[0".length }
				}),
				"]"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "data = {name}",
					selection: { anchor: "data = {name".length }
				}),
				"}"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: '"hello"',
					selection: { anchor: '"hello'.length }
				}),
				'"'
			)
		).toBe(true);
	});

	it("only skips closers when every cursor is directly before the matching token", () => {
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "print(",
					selection: { anchor: "print(".length }
				}),
				")"
			)
		).toBe(false);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "name",
					selection: { anchor: 0, head: 4 }
				}),
				'"'
			)
		).toBe(false);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "() ()",
					extensions: [EditorState.allowMultipleSelections.of(true)],
					selection: EditorSelection.create([
						EditorSelection.cursor(1),
						EditorSelection.cursor(4)
					])
				}),
				")"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "() []",
					extensions: [EditorState.allowMultipleSelections.of(true)],
					selection: EditorSelection.create([
						EditorSelection.cursor(1),
						EditorSelection.cursor(4)
					])
				}),
				")"
			)
		).toBe(false);
	});

	it("indents one extra Python level after a colon", () => {
		const state = EditorState.create({
			doc: [
				"if ready:",
				"    for item in items:",
				"        print(item)"
			].join("\n")
		});

		expect(pythonNewlineIndentText(state, "if ready:".length)).toBe(
			"\n    "
		);
		expect(
			pythonNewlineIndentText(
				state,
				"if ready:\n    for item in items:".length
			)
		).toBe("\n        ");
		expect(
			pythonNewlineIndentText(
				state,
				"if ready:\n    for item in items:\n        print(item)".length
			)
		).toBe("\n        ");
	});

	it("surfaces parser-backed Python syntax diagnostics before run", () => {
		const validState = EditorState.create({
			doc: ["def move():", "    return 1"].join("\n"),
			extensions: [python()]
		});
		const invalidState = EditorState.create({
			doc: ["def move()", "    return 1"].join("\n"),
			extensions: [python()]
		});

		expect(pythonSyntaxDiagnostics(validState)).toEqual([]);
		const diagnostics = pythonSyntaxDiagnostics(invalidState);

		expect(diagnostics.length).toBeGreaterThan(0);
		expect(diagnostics[0]).toMatchObject({
			severity: "error",
			message:
				"Python syntax error. Check this line before running the project."
		});
		expect(diagnostics[0]?.to).toBeGreaterThanOrEqual(
			diagnostics[0]?.from ?? 0
		);
	});

	it("maps runtime traceback lines to editor diagnostics", () => {
		const state = EditorState.create({
			doc: ["total = 1", "print(total / 0)", "print('done')"].join("\n"),
			extensions: [python()]
		});

		const diagnostic = pythonRuntimeDiagnosticForLine(
			state,
			2,
			"ZeroDivisionError: division by zero"
		);

		expect(diagnostic).toMatchObject({
			from: state.doc.line(2).from,
			to: state.doc.line(2).to,
			severity: "error",
			source: "Python runtime",
			message: "ZeroDivisionError: division by zero"
		});
		expect(
			pythonRuntimeDiagnosticForLine(state, 0, "Invalid line")
		).toBeNull();
	});
});
