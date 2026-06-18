export interface PythonSyntaxToken {
	kind:
		| "builtin"
		| "comment"
		| "decorator"
		| "function"
		| "keyword"
		| "number"
		| "operator"
		| "plain"
		| "property"
		| "string";
	text: string;
}

const pythonKeywords = new Set([
	"False",
	"None",
	"True",
	"and",
	"as",
	"assert",
	"async",
	"await",
	"break",
	"case",
	"class",
	"continue",
	"def",
	"del",
	"elif",
	"else",
	"except",
	"finally",
	"for",
	"from",
	"global",
	"if",
	"import",
	"in",
	"is",
	"lambda",
	"match",
	"nonlocal",
	"not",
	"or",
	"pass",
	"raise",
	"return",
	"try",
	"while",
	"with",
	"yield"
]);

const pythonBuiltins = new Set([
	"ArithmeticError",
	"AssertionError",
	"AttributeError",
	"BaseException",
	"Exception",
	"False",
	"IndexError",
	"KeyError",
	"NameError",
	"None",
	"RuntimeError",
	"StopIteration",
	"SyntaxError",
	"True",
	"TypeError",
	"ValueError",
	"abs",
	"all",
	"any",
	"bool",
	"chr",
	"dict",
	"dir",
	"enumerate",
	"filter",
	"float",
	"format",
	"help",
	"input",
	"int",
	"isinstance",
	"len",
	"list",
	"map",
	"max",
	"min",
	"object",
	"open",
	"pow",
	"print",
	"range",
	"repr",
	"reversed",
	"round",
	"set",
	"sorted",
	"str",
	"sum",
	"super",
	"tuple",
	"type",
	"zip"
]);

const numberPattern =
	/^(?:0x[\da-f](?:_?[\da-f])*|0b[01](?:_?[01])*|0o[0-7](?:_?[0-7])*|\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:e[+-]?\d(?:_?\d)*)?j?|\.\d(?:_?\d)*(?:e[+-]?\d(?:_?\d)*)?j?)/i;
const operatorPattern = /[+\-*/%=&|^~<>!:.,;()[\]{}]/;
const pythonStringPrefixPattern = /^[rubf]{0,2}['"]/i;
const whitespacePattern = /\s/;
const digitPattern = /\d/;
const identifierStartPattern = /[a-z_]/i;
const identifierPartPattern = /\w/;

export function highlightPythonCode(source: string) {
	const lines = source.split("\n");
	const highlightedLines: PythonSyntaxToken[][] = [];
	let multilineStringDelimiter = "";

	for (const line of lines) {
		const result = highlightPythonLine(line, multilineStringDelimiter);
		highlightedLines.push(result.tokens);
		multilineStringDelimiter = result.multilineStringDelimiter;
	}

	return highlightedLines;
}

export function highlightPythonCodeAsHtml(source: string) {
	return highlightPythonCode(source)
		.map(line =>
			line
				.map(
					token =>
						`<span class="syntax-token syntax-token--${token.kind}">${escapeHtml(token.text)}</span>`
				)
				.join("")
		)
		.join("\n");
}

function highlightPythonLine(line: string, multilineStringDelimiter: string) {
	const tokens: PythonSyntaxToken[] = [];
	let index = 0;

	while (index < line.length) {
		if (multilineStringDelimiter) {
			const closeIndex = line.indexOf(multilineStringDelimiter, index);
			const endIndex =
				closeIndex === -1
					? line.length
					: closeIndex + multilineStringDelimiter.length;
			pushToken(tokens, "string", line.slice(index, endIndex));
			index = endIndex;
			if (closeIndex !== -1) multilineStringDelimiter = "";
			continue;
		}

		const current = line[index];
		if (!current) break;

		if (isWhitespace(current)) {
			const next = consumeWhile(line, index, isWhitespace);
			pushToken(tokens, "plain", line.slice(index, next));
			index = next;
			continue;
		}

		if (current === "#") {
			pushToken(tokens, "comment", line.slice(index));
			break;
		}

		if (current === "@") {
			const decoratorEnd = consumeWhile(
				line,
				index + 1,
				isIdentifierPart
			);
			pushToken(tokens, "decorator", line.slice(index, decoratorEnd));
			index = decoratorEnd;
			continue;
		}

		const stringStart = pythonStringStartAt(line, index);
		if (stringStart) {
			const stringResult = consumePythonString(line, index, stringStart);
			pushToken(tokens, "string", line.slice(index, stringResult.end));
			multilineStringDelimiter = stringResult.multilineStringDelimiter;
			index = stringResult.end;
			continue;
		}

		if (
			isDigit(current) ||
			(current === "." && isDigit(line[index + 1] ?? ""))
		) {
			const numberMatch = line.slice(index).match(numberPattern);
			if (numberMatch?.[0]) {
				pushToken(tokens, "number", numberMatch[0]);
				index += numberMatch[0].length;
				continue;
			}
		}

		if (isIdentifierStart(current)) {
			const identifierEnd = consumeWhile(
				line,
				index + 1,
				isIdentifierPart
			);
			const word = line.slice(index, identifierEnd);
			const previousSignificant = previousSignificantCharacter(
				line,
				index
			);
			const nextSignificant = nextSignificantCharacter(
				line,
				identifierEnd
			);

			if (pythonKeywords.has(word)) {
				pushToken(tokens, "keyword", word);
			} else if (pythonBuiltins.has(word)) {
				pushToken(tokens, "builtin", word);
			} else if (previousSignificant === ".") {
				pushToken(tokens, "property", word);
			} else if (nextSignificant === "(") {
				pushToken(tokens, "function", word);
			} else {
				pushToken(tokens, "plain", word);
			}

			index = identifierEnd;
			continue;
		}

		if (isOperator(current)) {
			const next = consumeWhile(line, index, isOperator);
			pushToken(tokens, "operator", line.slice(index, next));
			index = next;
			continue;
		}

		pushToken(tokens, "plain", current);
		index += 1;
	}

	return { tokens, multilineStringDelimiter };
}

function pushToken(
	tokens: PythonSyntaxToken[],
	kind: PythonSyntaxToken["kind"],
	text: string
) {
	if (!text) return;
	const previous = tokens[tokens.length - 1];
	if (previous?.kind === kind) {
		previous.text += text;
		return;
	}
	tokens.push({ kind, text });
}

function consumeWhile(
	text: string,
	start: number,
	predicate: (char: string) => boolean
) {
	let index = start;
	while (index < text.length && predicate(text[index] ?? "")) index += 1;
	return index;
}

function escapeHtml(text: string) {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function isIdentifierStart(char: string) {
	return identifierStartPattern.test(char);
}

function isIdentifierPart(char: string) {
	return identifierPartPattern.test(char);
}

function isDigit(char: string) {
	return digitPattern.test(char);
}

function isOperator(char: string) {
	return operatorPattern.test(char);
}

function isWhitespace(char: string) {
	return whitespacePattern.test(char);
}

function nextSignificantCharacter(text: string, start: number) {
	const next = consumeWhile(text, start, isWhitespace);
	return text[next] ?? "";
}

function previousSignificantCharacter(text: string, start: number) {
	let index = start - 1;
	while (index >= 0 && isWhitespace(text[index] ?? "")) index -= 1;
	return text[index] ?? "";
}

function pythonStringStartAt(text: string, start: number) {
	const prefixMatch = text
		.slice(start, start + 3)
		.match(pythonStringPrefixPattern);
	if (!prefixMatch?.[0]) return null;
	const quote = prefixMatch[0].at(-1) ?? "";
	const prefixLength = prefixMatch[0].length - 1;
	return {
		prefixLength,
		quote,
		delimiter: text.startsWith(quote.repeat(3), start + prefixLength)
			? quote.repeat(3)
			: quote
	};
}

function consumePythonString(
	text: string,
	start: number,
	stringStart: { delimiter: string; prefixLength: number; quote: string }
) {
	const contentStart = start + stringStart.prefixLength;
	const delimiter = stringStart.delimiter;

	if (delimiter.length === 3) {
		const closeIndex = text.indexOf(delimiter, contentStart + 3);
		return {
			end: closeIndex === -1 ? text.length : closeIndex + 3,
			multilineStringDelimiter: closeIndex === -1 ? delimiter : ""
		};
	}

	let index = contentStart + 1;
	while (index < text.length) {
		const char = text[index];
		if (char === "\\") {
			index += 2;
			continue;
		}
		if (char === stringStart.quote) {
			index += 1;
			break;
		}
		index += 1;
	}

	return {
		end: index,
		multilineStringDelimiter: ""
	};
}
