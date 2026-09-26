/* Scratch's preferences expect browser storage. In this opaque frame they are
 * deliberately ephemeral and cannot access the site's cookies or accounts. */
(() => {
	"use strict";
	Object.defineProperty(document, "cookie", { get: () => "", set: () => {} });
	for (const name of ["localStorage", "sessionStorage"]) {
		const entries = new Map();
		Object.defineProperty(window, name, {
			value: {
				getItem: key => entries.get(String(key)) ?? null,
				setItem: (key, value) => {
					if (String(value).length < 100000 && entries.size < 100)
						entries.set(String(key), String(value));
				},
				removeItem: key => entries.delete(String(key)),
				clear: () => entries.clear(),
				key: index => [...entries.keys()][index] ?? null,
				get length() {
					return entries.size;
				}
			}
		});
	}
})();
