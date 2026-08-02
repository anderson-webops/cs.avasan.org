import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const publicDir = path.resolve(__dirname, "../public");

async function collectPublicDirectoryNames() {
	const entries = await fs.readdir(publicDir, { withFileTypes: true });
	return new Set(
		entries.filter(entry => entry.isDirectory()).map(entry => entry.name)
	);
}

async function collectRouteDocuments(
	directory,
	ignoredRootDirectories,
	relativeDirectory = ""
) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const routeDocuments = [];

	for (const entry of entries) {
		const relativePath = path.join(relativeDirectory, entry.name);
		if (entry.isDirectory()) {
			if (
				relativeDirectory === "" &&
				ignoredRootDirectories.has(entry.name)
			) {
				continue;
			}
			routeDocuments.push(
				...(await collectRouteDocuments(
					path.join(directory, entry.name),
					ignoredRootDirectories,
					relativePath
				))
			);
		} else if (entry.isFile() && entry.name.endsWith(".html")) {
			routeDocuments.push(relativePath);
		}
	}

	return routeDocuments;
}

export async function normalizeStaticRoutes(targetDistDir = distDir) {
	const ignoredRootDirectories = await collectPublicDirectoryNames();
	ignoredRootDirectories.add(".vite");
	ignoredRootDirectories.add("assets");
	const routeDocuments = await collectRouteDocuments(
		targetDistDir,
		ignoredRootDirectories
	);

	for (const relativeSourcePath of routeDocuments) {
		const fileName = path.basename(relativeSourcePath);
		if (fileName === "index.html" || relativeSourcePath === "404.html") {
			continue;
		}

		const routeName = relativeSourcePath.slice(0, -".html".length);
		const routeDirectory = path.join(targetDistDir, routeName);
		const targetIndexPath = path.join(routeDirectory, "index.html");

		await fs.mkdir(routeDirectory, { recursive: true });
		await fs.copyFile(
			path.join(targetDistDir, relativeSourcePath),
			targetIndexPath
		);
		console.log(
			`[normalize-static-routes] wrote ${path.relative(targetDistDir, targetIndexPath)}`
		);
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await normalizeStaticRoutes();
}
