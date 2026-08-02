import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	stat,
	writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	SITEMAP_EXCLUDED_ROUTES,
	SITE_URL,
	generateProductionSitemap,
	sitemapOptions
} from "../scripts/sitemap.mts";
import { rewriteStaticHead } from "../scripts/static-head.mts";
import {
	NOT_FOUND_ROUTE,
	includedStaticRoutes
} from "../scripts/static-route-selection.mts";

const tempDirs: string[] = [];

describe("static route normalization", () => {
	afterEach(async () => {
		await Promise.all(
			tempDirs
				.splice(0)
				.map(tempDir => rm(tempDir, { recursive: true, force: true }))
		);
	});

	it("creates nested index files for clean static URLs", async () => {
		const tempDir = await mkdtemp(join(tmpdir(), "classes-routes-"));
		tempDirs.push(tempDir);
		const { normalizeStaticRoutes } =
			(await import("../scripts/normalize-static-routes.mjs")) as {
				normalizeStaticRoutes: (targetDistDir: string) => Promise<void>;
			};

		await writeFile(join(tempDir, "index.html"), "<main>Home</main>");
		await writeFile(
			join(tempDir, "course-resource.html"),
			"<main>Course Resource</main>"
		);
		await writeFile(join(tempDir, "admin.html"), "<main>Admin</main>");
		await writeFile(
			join(tempDir, "games.html"),
			"<main>Classroom games</main>"
		);
		await mkdir(join(tempDir, "games"), { recursive: true });
		await writeFile(
			join(tempDir, "games", "pond-paddlers.html"),
			"<main>Pond Paddlers</main>"
		);
		await mkdir(join(tempDir, "course-assets", "reference"), {
			recursive: true
		});
		await writeFile(
			join(tempDir, "course-assets", "reference", "example.html"),
			"<main>Downloadable course asset</main>"
		);
		await mkdir(join(tempDir, ".vite"), { recursive: true });
		await writeFile(
			join(tempDir, ".vite", "ssr-manifest.json"),
			'{"internal":"build metadata"}'
		);
		await writeFile(
			join(tempDir, "404.html"),
			"<main>Page not found</main>"
		);

		await normalizeStaticRoutes(tempDir);
		await normalizeStaticRoutes(tempDir);

		await expect(
			readFile(join(tempDir, "course-resource", "index.html"), "utf8")
		).resolves.toBe("<main>Course Resource</main>");
		await expect(
			readFile(join(tempDir, "admin", "index.html"), "utf8")
		).resolves.toBe("<main>Admin</main>");
		await expect(
			readFile(join(tempDir, "games", "index.html"), "utf8")
		).resolves.toBe("<main>Classroom games</main>");
		await expect(
			readFile(
				join(tempDir, "games", "pond-paddlers", "index.html"),
				"utf8"
			)
		).resolves.toBe("<main>Pond Paddlers</main>");
		for (const legacyDocument of [
			"admin.html",
			"course-resource.html",
			"games.html",
			join("games", "pond-paddlers.html")
		]) {
			await expect(stat(join(tempDir, legacyDocument))).rejects.toThrow();
		}
		await expect(
			stat(join(tempDir, "index", "index.html"))
		).rejects.toThrow();
		await expect(
			stat(join(tempDir, "404", "index.html"))
		).rejects.toThrow();
		await expect(
			stat(
				join(
					tempDir,
					"course-assets",
					"reference",
					"example",
					"index.html"
				)
			)
		).rejects.toThrow();
		await expect(readFile(join(tempDir, "404.html"), "utf8")).resolves.toBe(
			"<main>Page not found</main>"
		);
		await expect(stat(join(tempDir, ".vite"))).rejects.toThrow();
	});

	it("adds one static error document without rendering dynamic route patterns", () => {
		expect(
			includedStaticRoutes([
				"/",
				"/admin",
				"/:all(.*)*",
				NOT_FOUND_ROUTE
			])
		).toEqual(["/", "/admin", NOT_FOUND_ROUTE]);
	});

	it.each([
		[
			"/404",
			"Page Not Found | Classes with Julio",
			"noindex,nofollow",
			"https://cs.avasan.org/404"
		],
		[
			"/",
			"Classes with Julio",
			"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
			"https://cs.avasan.org/"
		],
		[
			"/ide",
			"IDE | Classes with Julio",
			"noindex,nofollow",
			"https://cs.avasan.org/ide"
		],
		[
			"/course-resource",
			"Course Resource | Classes with Julio",
			"noindex,nofollow",
			"https://cs.avasan.org/course-resource"
		],
		[
			"/admin",
			"Teacher Admin | Classes with Julio",
			"noindex,nofollow",
			"https://cs.avasan.org/admin"
		],
		[
			"/student-privacy",
			"Student Privacy | Classes with Julio",
			"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
			"https://cs.avasan.org/student-privacy"
		]
	])(
		"writes the route-aware static head for %s",
		(path, title, robots, canonicalUrl) => {
			const html = rewriteStaticHead(
				[
					"<!doctype html><html><head>",
					"<title>Generic title</title>",
					'<meta content="index,follow" name="robots">',
					'<meta name="robots" content="stale">',
					'<link href="https://example.com/old" rel="canonical">',
					'<link rel="canonical" href="https://example.com/duplicate">',
					"</head><body></body></html>"
				].join(""),
				path
			);

			expect(html).toContain(`<title>${title}</title>`);
			expect(html).toContain(`<meta content="${robots}" name="robots">`);
			expect(html).toContain(
				`<link href="${canonicalUrl}" rel="canonical">`
			);
			expect(html.match(/<title>/g)).toHaveLength(1);
			expect(html.match(/name="robots"/g)).toHaveLength(1);
			expect(html.match(/rel="canonical"/g)).toHaveLength(1);
		}
	);

	it("applies the static head rewrite during every SSG page render", async () => {
		const configSource = await readFile(
			resolve(__dirname, "../vite.config.mts"),
			"utf8"
		);

		expect(configSource).toContain("onPageRendered(route, html)");
		expect(configSource).toContain("rewriteStaticHead(html, route)");
	});

	it("configures the production sitemap without localhost or private routes", () => {
		const options = sitemapOptions();
		const calls: unknown[] = [];

		generateProductionSitemap(options => calls.push(options));

		expect(options.hostname).toBe(SITE_URL);
		expect(options.hostname).toBe("https://cs.avasan.org");
		expect(options.hostname).not.toContain("localhost");
		expect(options.generateRobotsTxt).toBe(false);
		expect(options.exclude).toEqual(SITEMAP_EXCLUDED_ROUTES);
		expect(options.exclude).toEqual([
			"/404",
			"/admin",
			"/bluej",
			"/course-resource",
			"/ide",
			"/python-ide",
			"/games",
			"/games/pond-paddlers",
			"/games/crosswalk-critters",
			"/games/machine-workshop",
			"/games/comet-hopper"
		]);
		expect(calls).toEqual([options]);
	});
});
