import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

export async function normalizeStaticRoutes(targetDistDir = distDir) {
	const entries = await fs.readdir(targetDistDir, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".html")) {
			continue;
		}

		const routeName = entry.name.slice(0, -".html".length);
		if (routeName === "index" || routeName === "404") {
			continue;
		}

		const routeDirectory = path.join(targetDistDir, routeName);
		const targetIndexPath = path.join(routeDirectory, "index.html");

		await fs.mkdir(routeDirectory, { recursive: true });
		await fs.copyFile(path.join(targetDistDir, entry.name), targetIndexPath);
		console.log(
			`[normalize-static-routes] wrote ${path.relative(targetDistDir, targetIndexPath)}`
		);
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await normalizeStaticRoutes();
}
