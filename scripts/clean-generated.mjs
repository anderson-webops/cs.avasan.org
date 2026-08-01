import { lstat, readFile, rm } from "node:fs/promises";
import { isAbsolute, parse, relative, resolve, sep } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const EXPECTED_PACKAGE_NAME = "classes-monorepo";
const workspaceRoot = resolve(import.meta.dirname, "..");

export const GENERATED_PATHS = Object.freeze([
	"back-end/coverage",
	"back-end/dist",
	"coverage",
	"dist",
	"front-end/coverage",
	"front-end/dist",
	"front-end/playwright-report",
	"front-end/test-results"
]);

function pathEscapesWorkspace(relativePath) {
	return (
		isAbsolute(relativePath)
		|| relativePath === ".."
		|| relativePath.startsWith(`..${sep}`)
	);
}

export function cleanupTarget(root, generatedPath) {
	const resolvedRoot = resolve(root);
	if (resolvedRoot === parse(resolvedRoot).root) {
		throw new Error("Refusing to clean from a filesystem root.");
	}
	if (!GENERATED_PATHS.includes(generatedPath)) {
		throw new Error(`Refusing to clean a path that is not approved: ${generatedPath}`);
	}

	const target = resolve(resolvedRoot, generatedPath);
	const relativeTarget = relative(resolvedRoot, target);
	if (!relativeTarget || pathEscapesWorkspace(relativeTarget)) {
		throw new Error(`Refusing to clean a path outside the workspace: ${target}`);
	}
	return target;
}

async function lstatIfPresent(target) {
	try {
		return await lstat(target);
	}
	catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
			return null;
		}
		throw error;
	}
}

async function assertWorkspaceIdentity(root) {
	const rootStats = await lstat(root);
	if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
		throw new Error("Refusing to clean from a non-directory or symbolic-link workspace root.");
	}

	const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
	const workspaces = Array.isArray(packageJson.workspaces) ? packageJson.workspaces : [];
	if (
		packageJson.name !== EXPECTED_PACKAGE_NAME
		|| !workspaces.includes("front-end")
		|| !workspaces.includes("back-end")
	) {
		throw new Error("Refusing to clean a directory that is not the expected classes workspace.");
	}
}

async function assertNoSymlinkSegments(root, target) {
	let current = root;
	for (const segment of relative(root, target).split(sep)) {
		current = resolve(current, segment);
		const stats = await lstatIfPresent(current);
		if (!stats) return;
		if (stats.isSymbolicLink()) {
			throw new Error(`Refusing to clean through a symbolic link: ${current}`);
		}
	}
}

export async function cleanGenerated({
	root = workspaceRoot,
	remove = rm,
	log = message => console.log(message)
} = {}) {
	const resolvedRoot = resolve(root);
	if (resolvedRoot === parse(resolvedRoot).root) {
		throw new Error("Refusing to clean from a filesystem root.");
	}
	await assertWorkspaceIdentity(resolvedRoot);

	const targets = GENERATED_PATHS.map(generatedPath => ({
		generatedPath,
		target: cleanupTarget(resolvedRoot, generatedPath)
	}));
	for (const { target } of targets) {
		await assertNoSymlinkSegments(resolvedRoot, target);
	}

	for (const { generatedPath, target } of targets) {
		await remove(target, { force: true, recursive: true });
		log(`Cleaned ${generatedPath}`);
	}
}

const invokedUrl = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedUrl) {
	await cleanGenerated();
}
