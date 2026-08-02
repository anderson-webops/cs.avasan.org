import { java } from "@codemirror/lang-java";
import { EditorState } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import {
	createPythonCodeMirrorExtensions,
	javaIdeCompletionsForMode,
	javaSyntaxDiagnostics
} from "../src/modules/pythonCodeMirror";

describe("IDE Java and Karel editing", () => {
	it("loads the Java parser and editor extensions for Java-family projects", () => {
		const extensions = createPythonCodeMirrorExtensions({
			mode: "java",
			onChange: () => undefined,
			onCursorCountChange: () => undefined
		});

		expect(extensions.length).toBeGreaterThan(10);
		expect(
			javaSyntaxDiagnostics(
				EditorState.create({
					doc: "public class Main { public static void main(String[] args) {} }",
					extensions: [java()]
				})
			)
		).toEqual([]);
	});

	it("reports parser-backed Java syntax errors", () => {
		const diagnostics = javaSyntaxDiagnostics(
			EditorState.create({
				doc: "public class Main { public static void main(String[] args) {",
				extensions: [java()]
			})
		);

		expect(diagnostics.length).toBeGreaterThan(0);
		expect(diagnostics[0]).toMatchObject({
			message: "Java syntax error. Check this line before running the project.",
			severity: "error"
		});
	});

	it("offers standard Java imports without Karel-only imports", () => {
		const labels = javaIdeCompletionsForMode("java").map(
			completion => completion.label
		);

		expect(labels).toContain("import java.util.ArrayList");
		expect(labels).toContain("import java.io.FileReader");
		expect(labels).not.toContain("import kareltherobot.UrRobot");
	});

	it("offers the bounded Karel import and color vocabulary", () => {
		const labels = javaIdeCompletionsForMode("karel").map(
			completion => completion.label
		);
		const colorLabels = javaIdeCompletionsForMode("karel", "Color").map(
			completion => completion.label
		);

		expect(labels).toEqual(
			expect.arrayContaining([
				"import java.awt.Color",
				"import kareltherobot.Directions",
				"import kareltherobot.UrRobot",
				"import kareltherobot.World"
			])
		);
		expect(colorLabels).toEqual(
			expect.arrayContaining(["BLUE", "GREEN", "RED"])
		);
	});
});
