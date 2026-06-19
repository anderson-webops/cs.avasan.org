import type { PythonIdeFile } from "@/modules/pythonIde";

const PYTHON_EXTENSION_RE = /\.py$/i;
const FROM_IMPORT_MODULE_RE =
	/^from\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+import\b/;
const PYTHON_IDENTIFIER_RE = /^[A-Z_]\w*$/i;
const PYTHON_IMPORT_KEYWORD = "import";
const PYTHON_IMPORT_SEPARATOR_RE = /\s*,\s*/;
const PYTHON_IMPORT_ALIAS_RE = /\s+as\s+/i;
const PYTHON_MODULE_SEPARATOR_RE = /\./;
const PYTHON_LINE_CONTINUATION_RE = /\\\s*$/;
const PYTHON_TRIPLE_QUOTE_DELIMITERS = ['"""', "'''"] as const;
type PythonTripleQuoteDelimiter =
	(typeof PYTHON_TRIPLE_QUOTE_DELIMITERS)[number];

function isPythonFileName(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

function codeBeforeComment(line: string) {
	return line.split("#")[0] ?? "";
}

function lineContinues(line: string) {
	return PYTHON_LINE_CONTINUATION_RE.test(codeBeforeComment(line));
}

function withoutLineContinuation(line: string) {
	return codeBeforeComment(line)
		.replace(PYTHON_LINE_CONTINUATION_RE, "")
		.trim();
}

function importedTopLevelModulesFromLine(line: string) {
	const trimmed = line.trim();
	const fromMatch = trimmed.match(FROM_IMPORT_MODULE_RE);
	if (fromMatch) {
		return [fromMatch[1].split(PYTHON_MODULE_SEPARATOR_RE)[0]].filter(
			moduleName => PYTHON_IDENTIFIER_RE.test(moduleName)
		);
	}

	if (!trimmed.startsWith(PYTHON_IMPORT_KEYWORD)) return [];
	const importWhitespace = trimmed.charAt(PYTHON_IMPORT_KEYWORD.length);
	if (importWhitespace !== " " && importWhitespace !== "\t") return [];

	return trimmed
		.slice(PYTHON_IMPORT_KEYWORD.length)
		.split("#")[0]
		.split(PYTHON_IMPORT_SEPARATOR_RE)
		.map(
			specifier =>
				specifier
					.split(PYTHON_IMPORT_ALIAS_RE)[0]
					.trim()
					.split(PYTHON_MODULE_SEPARATOR_RE)[0]
		)
		.filter(moduleName => PYTHON_IDENTIFIER_RE.test(moduleName));
}

function nextTripleQuoteDelimiter(
	line: string,
	activeDelimiter: PythonTripleQuoteDelimiter | null
) {
	let delimiter = activeDelimiter;
	let offset = 0;
	const lineCode = codeBeforeComment(line);

	while (offset < lineCode.length) {
		if (delimiter) {
			const closingIndex = lineCode.indexOf(delimiter, offset);
			if (closingIndex === -1) return delimiter;
			offset = closingIndex + delimiter.length;
			delimiter = null;
			continue;
		}

		let nextIndex = -1;
		let nextDelimiter: PythonTripleQuoteDelimiter | null = null;
		for (const candidate of PYTHON_TRIPLE_QUOTE_DELIMITERS) {
			const candidateIndex = lineCode.indexOf(candidate, offset);
			if (
				candidateIndex !== -1 &&
				(nextIndex === -1 || candidateIndex < nextIndex)
			) {
				nextIndex = candidateIndex;
				nextDelimiter = candidate;
			}
		}
		if (!nextDelimiter) return null;

		delimiter = nextDelimiter;
		offset = nextIndex + nextDelimiter.length;
	}

	return delimiter;
}

export function pythonIdeImportedTopLevelModules(files: PythonIdeFile[]) {
	const modules = new Set<string>();
	let activeMultilineStringDelimiter: PythonTripleQuoteDelimiter | null =
		null;
	let continuedLine = "";

	for (const line of files
		.filter(file => isPythonFileName(file.name))
		.map(file => file.content)
		.join("\n")
		.split("\n")) {
		const startsInsideMultilineString =
			activeMultilineStringDelimiter !== null;
		activeMultilineStringDelimiter = nextTripleQuoteDelimiter(
			line,
			activeMultilineStringDelimiter
		);
		if (!startsInsideMultilineString) {
			if (continuedLine) {
				continuedLine =
					`${continuedLine} ${withoutLineContinuation(line)}`.trim();
				if (lineContinues(line)) continue;

				for (const moduleName of importedTopLevelModulesFromLine(
					continuedLine
				))
					modules.add(moduleName);
				continuedLine = "";
				continue;
			}

			if (lineContinues(line)) {
				continuedLine = withoutLineContinuation(line);
				continue;
			}

			for (const moduleName of importedTopLevelModulesFromLine(line))
				modules.add(moduleName);
		}
	}

	if (continuedLine) {
		for (const moduleName of importedTopLevelModulesFromLine(continuedLine))
			modules.add(moduleName);
	}

	return modules;
}
