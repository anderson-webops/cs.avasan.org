import type { Plugin } from "vite";
import { prepareScratchEditor } from "./prepare-editor.mjs";

/** Stage only public editor assets; no user code is evaluated during builds. */
export function scratchEditorPlugin(): Plugin {
	return {
		name: "scratch-classroom-assets",
		async buildStart() {
			if (!process.env.VITEST) await prepareScratchEditor();
		},
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				if (request.url?.startsWith("/scratch-runtime/")) {
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader(
						"Cross-Origin-Resource-Policy",
						"cross-origin"
					);
				}
				next();
			});
		}
	};
}
