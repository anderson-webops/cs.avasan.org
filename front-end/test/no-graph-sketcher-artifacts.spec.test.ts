import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	retiredGraphSketcherArtifacts,
	verifyNoRetiredGraphSketcherArtifacts
} from "../scripts/verify-no-graph-sketcher.mjs";

const tempDirs: string[] = [];

describe("retired CS Graph Sketcher artifacts", () => {
	afterEach(async () => {
		await Promise.all(
			tempDirs
				.splice(0)
				.map(directory =>
					rm(directory, { force: true, recursive: true })
				)
		);
	});

	async function temporaryDist() {
		const directory = await mkdtemp(
			join(tmpdir(), "cs-no-graph-sketcher-")
		);
		tempDirs.push(directory);
		await mkdir(join(directory, "assets"), { recursive: true });
		return directory;
	}

	it("allows Math-only Graph wording without shipping the CS runtime", async () => {
		const directory = await temporaryDist();
		await writeFile(
			join(directory, "index.html"),
			"<p>Graph Sketcher is hosted only on math.avasan.org.</p>"
		);

		await expect(retiredGraphSketcherArtifacts(directory)).resolves.toEqual(
			[]
		);
		await expect(
			verifyNoRetiredGraphSketcherArtifacts(directory)
		).resolves.toBeUndefined();
	});

	it("rejects retired routes, bundles, workers, licenses, and project markers", async () => {
		const directory = await temporaryDist();
		await writeFile(
			join(directory, "graph-sketcher.html"),
			"retired route"
		);
		await writeFile(
			join(directory, "assets", "application.js"),
			"const key = 'cs-avasan-graph-sketcher-session-v1';"
		);

		await expect(retiredGraphSketcherArtifacts(directory)).resolves.toEqual(
			["content:assets/application.js", "path:graph-sketcher.html"]
		);
		await expect(
			verifyNoRetiredGraphSketcherArtifacts(directory)
		).rejects.toThrow("retired Graph Sketcher artifacts");
	});

	it("keeps the deleted CS source and public artifacts absent", async () => {
		for (const relativePath of [
			"docs/graph-sketcher-browser-port.md",
			"docs/third-party/graphsketcher-omni-source-license.txt",
			"front-end/public/licenses/graphsketcher-omni-source-license.txt",
			"front-end/src/components/GraphSketcherWorkspace.vue",
			"front-end/src/modules/graphSketcher.ts",
			"front-end/src/modules/graphSketcherArchive.ts",
			"front-end/src/modules/graphSketcherFiles.ts",
			"front-end/src/modules/graphSketcherSafety.ts",
			"front-end/src/pages/graph-sketcher.vue",
			"front-end/src/workers/graphSketcherArchive.worker.ts",
			"scripts/production-graph-sketcher-smoke.mjs"
		]) {
			await expect(
				access(resolve(__dirname, "../..", relativePath))
			).rejects.toThrow();
		}
	});

	it("runs the retired-artifact gate in every frontend build", async () => {
		const packageSource = JSON.parse(
			await readFile(resolve(__dirname, "../package.json"), "utf8")
		) as {
			scripts: { build: string };
		};

		expect(packageSource.scripts.build).toContain(
			"node scripts/verify-no-graph-sketcher.mjs"
		);
	});

	it("checks stale normalized route artifacts in CI and production smoke", async () => {
		const [ciSource, smokeSource] = await Promise.all([
			readFile(
				resolve(__dirname, "../../.github/workflows/ci.yml"),
				"utf8"
			),
			readFile(
				resolve(__dirname, "../../scripts/post-deploy-smoke.mjs"),
				"utf8"
			)
		]);

		expect(ciSource).toContain("/graph-sketcher/index.html");
		expect(smokeSource).toContain('"/graph-sketcher/index.html"');
		for (const retiredArtifact of [
			"/assets/GraphSketcherWorkspace-retired.js",
			"/assets/graphSketcherArchive.worker-retired.js",
			"/assets/graph-sketcher-retired.js"
		]) {
			expect(ciSource).toContain(retiredArtifact);
			expect(smokeSource).toContain(`"${retiredArtifact}"`);
		}
	});
});
