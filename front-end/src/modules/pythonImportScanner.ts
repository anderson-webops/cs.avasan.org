import type { PythonIdeFile } from "@/modules/pythonIde";

const PYTHON_EXTENSION_RE = /\.py$/i;
const FROM_IMPORT_MODULE_RE =
	/^from\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+import\b/;
const PYTHON_IDENTIFIER_RE = /^[A-Z_]\w*$/i;
const PYTHON_IMPORT_KEYWORD = "import";
const PYTHON_IMPORT_SEPARATOR_RE = /\s*,\s*/;
const PYTHON_IMPORT_ALIAS_RE = /\s+as\s+/i;
const PYTHON_MODULE_SEPARATOR_RE = /\./;

function isPythonFileName(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
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

export function pythonIdeImportedTopLevelModules(files: PythonIdeFile[]) {
	const modules = new Set<string>();

	for (const line of files
		.filter(file => isPythonFileName(file.name))
		.map(file => file.content)
		.join("\n")
		.split("\n")) {
		for (const moduleName of importedTopLevelModulesFromLine(line))
			modules.add(moduleName);
	}

	return modules;
}
