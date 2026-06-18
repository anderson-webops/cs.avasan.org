import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EditorSelection, EditorState } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import {
	canSkipExistingClosingToken,
	pythonIdeCompletionSource,
	pythonIdeCompletionsForMode,
	pythonNewlineIndentText
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
	it("mounts CodeMirror instead of the old textarea highlight overlay", () => {
		const pageSource = sourceFile("../src/pages/python-ide.vue");

		expect(pageSource).toContain("createPythonCodeMirrorExtensions");
		expect(pageSource).toContain("new EditorView");
		expect(pageSource).toContain("codeEditorHostRef");
		expect(pageSource).toContain("class=\"code-editor-host\"");
		expect(pageSource).not.toContain("highlightPythonCodeAsHtml");
		expect(pageSource).not.toContain("code-editor-highlight");
		expect(pageSource).not.toContain("handleCodeEditorKeyDown");
	});

	it("enables Python parsing and typical IDE editing behavior", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");
		const pageSource = sourceFile("../src/pages/python-ide.vue");

		expect(editorSource).toContain("basicSetup");
		expect(editorSource).toContain("python()");
		expect(editorSource).toContain("indentWithTab");
		expect(editorSource).toContain("EditorState.allowMultipleSelections");
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
		expect(pageSource).toContain(
			"mode: selectedProject.value?.mode ?? \"python\""
		);
	});

	it("offers course-runtime completions by immutable project mode", () => {
		expect(
			pythonIdeCompletionsForMode("pgzero").map(option => option.label)
		).toEqual(
			expect.arrayContaining([
				"Actor",
				"HEIGHT",
				"WIDTH",
				"keyboard",
				"pgzrun",
				"screen"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "screen.draw").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining(["filled_rect", "line", "text"])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "player").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["colliderect", "draw", "pos"]));
		expect(
			pythonIdeCompletionsForMode("turtle", "screen").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["bgcolor", "onkey", "ontimer"]));
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
					doc: "\"hello\"",
					selection: { anchor: "\"hello".length }
				}),
				"\""
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
				"\""
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
});
