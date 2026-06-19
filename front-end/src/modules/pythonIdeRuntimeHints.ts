export const PYODIDE_VERSION = "314.0.0";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
export const PYODIDE_SCRIPT_SRC = `${PYODIDE_INDEX_URL}pyodide.js`;
export const PYODIDE_MODULE_SRC = `${PYODIDE_INDEX_URL}pyodide.mjs`;

const PYODIDE_CDN_ORIGIN = "https://cdn.jsdelivr.net";

interface PythonRuntimeResourceHint {
	rel: string;
	href: string;
	as?: string;
	crossOrigin?: string;
}

const PYTHON_RUNTIME_CONNECTION_HINTS: PythonRuntimeResourceHint[] = [
	{ rel: "dns-prefetch", href: "//cdn.jsdelivr.net" },
	{
		rel: "preconnect",
		href: PYODIDE_CDN_ORIGIN,
		crossOrigin: "anonymous"
	}
];

const PYTHON_RUNTIME_RESOURCE_HINTS: PythonRuntimeResourceHint[] = [
	...PYTHON_RUNTIME_CONNECTION_HINTS,
	{
		rel: "preload",
		href: PYODIDE_SCRIPT_SRC,
		as: "script",
		crossOrigin: "anonymous"
	}
];

function appendPythonRuntimeResourceHints(hints: PythonRuntimeResourceHint[]) {
	if (typeof document === "undefined") return;

	for (const hint of hints) {
		const existing = document.querySelector(
			`link[rel="${hint.rel}"][href="${hint.href}"]`
		);
		if (existing) continue;
		const link = document.createElement("link");
		link.rel = hint.rel;
		link.href = hint.href;
		if (hint.as) link.setAttribute("as", hint.as);
		if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
		document.head.append(link);
	}
}

export function primePythonRuntimeConnection() {
	appendPythonRuntimeResourceHints(PYTHON_RUNTIME_CONNECTION_HINTS);
}

export function warmPythonRuntimeResources() {
	appendPythonRuntimeResourceHints(PYTHON_RUNTIME_RESOURCE_HINTS);
}
