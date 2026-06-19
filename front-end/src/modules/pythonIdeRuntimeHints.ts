export const PYODIDE_VERSION = "314.0.0";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
export const PYODIDE_SCRIPT_SRC = `${PYODIDE_INDEX_URL}pyodide.js`;

const PYODIDE_CDN_ORIGIN = "https://cdn.jsdelivr.net";

interface PythonRuntimeResourceHint {
	rel: string;
	href: string;
	as?: string;
	crossOrigin?: string;
}

const PYTHON_RUNTIME_RESOURCE_HINTS: PythonRuntimeResourceHint[] = [
	{ rel: "dns-prefetch", href: "//cdn.jsdelivr.net" },
	{
		rel: "preconnect",
		href: PYODIDE_CDN_ORIGIN,
		crossOrigin: "anonymous"
	},
	{
		rel: "preload",
		href: PYODIDE_SCRIPT_SRC,
		as: "script",
		crossOrigin: "anonymous"
	}
];

export function warmPythonRuntimeResources() {
	if (typeof document === "undefined") return;

	for (const hint of PYTHON_RUNTIME_RESOURCE_HINTS) {
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
