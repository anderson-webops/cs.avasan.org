interface PyodideStandardLibraryAPI {
	runPython: (code: string) => unknown;
}

let standardLibraryModulesPromise: Promise<Set<string>> | null = null;

export function resetPythonStandardLibraryModuleCache() {
	standardLibraryModulesPromise = null;
}

export function pythonStandardLibraryModules(
	pyodide: PyodideStandardLibraryAPI
) {
	standardLibraryModulesPromise ??= Promise.resolve().then(() => {
		const modulesJson = pyodide.runPython(`
import json as __classes_json
import sys as __classes_sys
__classes_json.dumps(sorted(getattr(__classes_sys, "stdlib_module_names", ())))
`);
		const modules = JSON.parse(String(modulesJson)) as unknown;
		if (!Array.isArray(modules)) return new Set<string>();
		return new Set(
			modules.filter(
				(moduleName): moduleName is string =>
					typeof moduleName === "string" && !!moduleName
			)
		);
	});

	return standardLibraryModulesPromise;
}
