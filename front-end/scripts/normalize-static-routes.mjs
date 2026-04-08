import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

async function normalizeStaticRoutes() {
	const entries = await fs.readdir(distDir, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".html")) {
			continue;
		}

		const routeName = entry.name.slice(0, -".html".length);
		const routeDirectory = path.join(distDir, routeName);
		const targetIndexPath = path.join(routeDirectory, "index.html");

		try {
			const routeDirectoryStats = await fs.stat(routeDirectory);
			if (!routeDirectoryStats.isDirectory()) {
				continue;
			}
		} catch {
			continue;
		}

		await fs.copyFile(path.join(distDir, entry.name), targetIndexPath);
		console.log(`[normalize-static-routes] wrote ${path.relative(distDir, targetIndexPath)}`);
	}
}

await normalizeStaticRoutes();
