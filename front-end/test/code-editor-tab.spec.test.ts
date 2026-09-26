import { EditorState, type StateCommand } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import {
	codeEditorTabBinding,
	createPythonCodeMirrorExtensions
} from "../src/modules/pythonCodeMirror";
function run(state: EditorState, command: StateCommand) {
	let next = state;
	expect(
		command({
			state,
			dispatch: transaction => {
				next = transaction.state;
			}
		})
	).toBe(true);
	return next;
}
describe("IDE Tab indentation", () => {
	it.each(["python", "turtle", "pgzero", "data", "java", "karel"] as const)(
		"inserts at the caret in %s",
		mode => {
			const doc = "first line\n    second line";
			for (const cursor of [0, 3, doc.length]) {
				const state = EditorState.create({
					doc,
					selection: { anchor: cursor },
					extensions: createPythonCodeMirrorExtensions({ mode })
				});
				const next = run(state, codeEditorTabBinding.run);
				expect(next.doc.toString()).toBe(
					doc.slice(0, cursor) + "    " + doc.slice(cursor)
				);
				expect(next.selection.main.head).toBe(cursor + 4);
			}
		}
	);
	it("indents a partially selected line and dedents with Shift+Tab", () => {
		const state = EditorState.create({
			doc: "print(value)",
			selection: { anchor: 6, head: 11 },
			extensions: createPythonCodeMirrorExtensions({ mode: "python" })
		});
		const next = run(state, codeEditorTabBinding.run);
		expect(next.doc.toString()).toBe("    print(value)");
		expect(
			run(next, codeEditorTabBinding.shift as StateCommand).doc.toString()
		).toBe("print(value)");
	});
});
