import { describe, expect, it } from "vitest";
import {
	highlightPythonCode,
	highlightPythonCodeAsHtml
} from "../src/modules/pythonSyntaxHighlighting";

function flattenedKinds(source: string) {
	return highlightPythonCode(source)
		.flat()
		.map(token => [token.kind, token.text]);
}

describe("python syntax highlighting", () => {
	it("classifies common Python syntax groups", () => {
		expect(
			flattenedKinds("def greet(name):\n    print(f\"Hi {name}\")  # say hi")
		).toEqual([
			["keyword", "def"],
			["plain", " "],
			["function", "greet"],
			["operator", "("],
			["plain", "name"],
			["operator", "):"],
			["plain", "    "],
			["builtin", "print"],
			["operator", "("],
			["string", "f\"Hi {name}\""],
			["operator", ")"],
			["plain", "  "],
			["comment", "# say hi"]
		]);
	});

	it("keeps triple-quoted strings colored across lines", () => {
		expect(flattenedKinds("text = \"\"\"hello\nworld\"\"\"\nprint(text)")).toEqual([
			["plain", "text "],
			["operator", "="],
			["plain", " "],
			["string", "\"\"\"hello"],
			["string", "world\"\"\""],
			["builtin", "print"],
			["operator", "("],
			["plain", "text"],
			["operator", ")"]
		]);
	});

	it("escapes rendered code before creating highlight markup", () => {
		expect(highlightPythonCodeAsHtml("print('<tag>')")).toContain(
			"&lt;tag&gt;"
		);
		expect(highlightPythonCodeAsHtml("print('&')")).toContain("&amp;");
	});
});
