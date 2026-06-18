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

function flattenedBracketPairs(source: string) {
	return highlightPythonCode(source)
		.flat()
		.filter(token => token.kind === "bracket")
		.map(token => [token.text, token.bracketPair, token.bracketColor]);
}

describe("python syntax highlighting", () => {
	it("classifies common Python syntax groups", () => {
		expect(
			flattenedKinds("def greet(name):\n    print(f\"Hi {name}\")  # say hi")
		).toEqual([
			["keyword", "def"],
			["plain", " "],
			["function", "greet"],
			["bracket", "("],
			["plain", "name"],
			["bracket", ")"],
			["operator", ":"],
			["plain", "    "],
			["builtin", "print"],
			["bracket", "("],
			["string", "f\"Hi {name}\""],
			["bracket", ")"],
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
			["bracket", "("],
			["plain", "text"],
			["bracket", ")"]
		]);
	});

	it("assigns the same color class to each matched bracket pair", () => {
		expect(flattenedBracketPairs("print(items[0])")).toEqual([
			["(", 1, "hsl(137.5 95% 74%)"],
			["[", 2, "hsl(275.0 95% 74%)"],
			["]", 2, "hsl(275.0 95% 74%)"],
			[")", 1, "hsl(137.5 95% 74%)"]
		]);
	});

	it("uses different pair ids for nearby sibling brackets", () => {
		expect(flattenedBracketPairs("first = (1)\nsecond = [2]")).toEqual([
			["(", 1, "hsl(137.5 95% 74%)"],
			[")", 1, "hsl(137.5 95% 74%)"],
			["[", 2, "hsl(275.0 95% 74%)"],
			["]", 2, "hsl(275.0 95% 74%)"]
		]);
	});

	it("does not color brackets inside strings or comments as pairs", () => {
		expect(flattenedBracketPairs("print(']')  # (")).toEqual([
			["(", 1, "hsl(137.5 95% 74%)"],
			[")", 1, "hsl(137.5 95% 74%)"]
		]);
	});

	it("escapes rendered code before creating highlight markup", () => {
		expect(highlightPythonCodeAsHtml("print('<tag>')")).toContain(
			"&lt;tag&gt;"
		);
		expect(highlightPythonCodeAsHtml("print('&')")).toContain("&amp;");
	});

	it("renders bracket pair classes in the highlight markup", () => {
		const html = highlightPythonCodeAsHtml("print(items[0])");
		expect(html).toContain("syntax-token--bracket-matched");
		expect(html).toContain("syntax-token--bracket-pair-2");
		expect(html).toContain("--syntax-bracket-color: hsl(275.0 95% 74%)");
	});
});
