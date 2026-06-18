import { describe, expect, it } from "vitest";
import {
	addAdjacentLineEditorSelections,
	deleteAtEditorSelections,
	editorPairForKey,
	indentEditorSelections,
	insertTextAtEditorSelections,
	lineEndEditorSelections,
	outdentEditorSelections,
	wrapEditorSelections
} from "../src/modules/textEditorShortcuts";

describe("text editor shortcuts", () => {
	it("indents a single cursor with four spaces", () => {
		const result = indentEditorSelections("print('hi')", [
			{ from: 0, to: 0 }
		]);

		expect(result.text).toBe("    print('hi')");
		expect(result.selections).toEqual([{ from: 4, to: 4 }]);
	});

	it("indents every selected line and keeps the expanded selection", () => {
		const text = "if ready:\nprint('yes')\nprint('done')";
		const selected = text.indexOf("print('done')");
		const result = indentEditorSelections(text, [
			{ from: 0, to: selected - 1 }
		]);

		expect(result.text).toBe(
			"    if ready:\n    print('yes')\nprint('done')"
		);
		expect(result.selections).toEqual([{ from: 0, to: selected + 7 }]);
	});

	it("outdents selected lines by one indentation step", () => {
		const result = outdentEditorSelections("    if ready:\n\tprint('yes')", [
			{ from: 0, to: "    if ready:\n\tprint('yes')".length }
		]);

		expect(result.text).toBe("if ready:\nprint('yes')");
		expect(result.selections).toEqual([{ from: 0, to: 22 }]);
	});

	it("wraps selected text with quotes instead of overwriting it", () => {
		const result = wrapEditorSelections("name = Jacob", [
			{ from: 7, to: 12 }
		], "\"", "\"");

		expect(result.text).toBe("name = \"Jacob\"");
		expect(result.selections).toEqual([{ from: 8, to: 13 }]);
	});

	it("inserts paired quotes at every cursor", () => {
		const result = wrapEditorSelections("a\nb", [
			{ from: 0, to: 0 },
			{ from: 2, to: 2 }
		], "'", "'");

		expect(result.text).toBe("''a\n''b");
		expect(result.selections).toEqual([
			{ from: 1, to: 1 },
			{ from: 5, to: 5 }
		]);
	});

	it("types through multiple cursor selections", () => {
		const result = insertTextAtEditorSelections("print()\nprint()", [
			{ from: 6, to: 6 },
			{ from: 14, to: 14 }
		], "\"hi\"");

		expect(result.text).toBe("print(\"hi\")\nprint(\"hi\")");
		expect(result.selections).toEqual([
			{ from: 10, to: 10 },
			{ from: 22, to: 22 }
		]);
	});

	it("deletes at multiple cursors without collapsing to one edit", () => {
		const result = deleteAtEditorSelections("cats\ndogs", [
			{ from: 4, to: 4 },
			{ from: 9, to: 9 }
		], "backward");

		expect(result.text).toBe("cat\ndog");
		expect(result.selections).toEqual([
			{ from: 3, to: 3 },
			{ from: 7, to: 7 }
		]);
	});

	it("creates line-end cursors for an Alt-Shift-I style selection", () => {
		expect(
			lineEndEditorSelections("first\nsecond\nthird", {
				from: 0,
				to: "first\nsecond".length
			})
		).toEqual([
			{ from: 5, to: 5 },
			{ from: 12, to: 12 }
		]);
	});

	it("adds adjacent-line cursors at the same column", () => {
		expect(
			addAdjacentLineEditorSelections("abc\nabcdef", [
				{ from: 2, to: 2 }
			], "down")
		).toEqual([
			{ from: 2, to: 2 },
			{ from: 6, to: 6 }
		]);
	});

	it("exposes common quote and bracket pairs", () => {
		expect(editorPairForKey("\"")).toEqual({ open: "\"", close: "\"" });
		expect(editorPairForKey("(")).toEqual({ open: "(", close: ")" });
		expect(editorPairForKey("x")).toBeNull();
	});
});
