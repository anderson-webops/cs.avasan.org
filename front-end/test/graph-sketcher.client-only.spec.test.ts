import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
	return readdirSync(directory).flatMap(entry => {
		const path = join(directory, entry);
		const stats = statSync(path);
		if (stats.isDirectory()) return sourceFiles(path);
		return /\.(?:ts|js|vue)$/.test(entry) ? [path] : [];
	});
}

describe("Graph Sketcher runtime boundary", () => {
	it("loads the editor and runtime only from the frontend bundle", () => {
		const route = readFileSync(
			resolve(process.cwd(), "src/pages/graph-sketcher.vue"),
			"utf8"
		);
		const appShell = readFileSync(
			resolve(process.cwd(), "src/App.vue"),
			"utf8"
		);
		const component = readFileSync(
			resolve(process.cwd(), "src/components/GraphSketcherWorkspace.vue"),
			"utf8"
		);
		const runtime = [
			"graphSketcher.ts",
			"graphSketcherArchive.ts",
			"graphSketcherFiles.ts",
			"graphSketcherSafety.ts"
		]
			.map(file =>
				readFileSync(
					resolve(process.cwd(), "src/modules", file),
					"utf8"
				)
			)
			.join("\n");
		const worker = readFileSync(
			resolve(
				process.cwd(),
				"src/workers/graphSketcherArchive.worker.ts"
			),
			"utf8"
		);

		expect(route).toContain(
			'import("@/components/GraphSketcherWorkspace.vue")'
		);
		expect(component).toContain("All rendering, imports, and");
		expect(component).toContain("exports run in this browser.");
		expect(`${component}\n${runtime}\n${worker}`).not.toMatch(
			/\b(?:fetch|WebSocket|EventSource)\s*\(|\baxios\b|\/api\//
		);
		expect(appShell).not.toContain("cdn.jsdelivr.net");
		expect(runtime).not.toMatch(/\beval\s*\(|\bnew\s+Function\b/);
	});

	it("has no Graph Sketcher execution path in the backend", () => {
		const backendRoot = resolve(process.cwd(), "../back-end/src");
		const backendSource = sourceFiles(backendRoot)
			.map(file => readFileSync(file, "utf8"))
			.join("\n");

		expect(backendSource).not.toMatch(
			/GraphSketcher|graph-sketcher|graphsketch|\.ograph/i
		);
	});
});
