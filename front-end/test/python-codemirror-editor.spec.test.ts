import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
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

		expect(editorSource).toContain("basicSetup");
		expect(editorSource).toContain("python()");
		expect(editorSource).toContain("indentWithTab");
		expect(editorSource).toContain("EditorState.allowMultipleSelections");
		expect(editorSource).toContain("wrapSelection");
		expect(editorSource).toContain("syntaxHighlighting");
		expect(editorSource).toContain("BracketPairColorPlugin");
		expect(editorSource).toContain("cm-bracket-pair-1");
	});
});
