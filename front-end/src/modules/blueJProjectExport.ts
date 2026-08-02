import type { PythonIdeFile, PythonIdeProject } from "@/modules/pythonIde";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import {
	isPythonIdeJavaFile,
	isPythonIdeTextFile,
	isValidPythonFileName
} from "@/modules/pythonIde";

const BLUEJ_PROJECT_FILE_NAME = "package.bluej";
const BLUEJ_README_FILE_NAME = "README.TXT";
const BLUEJ_HOME_URL = "https://www.bluej.org/";
const BLUEJ_SOURCE_URL = "https://github.com/k-pet-group/BlueJ-Greenfoot";
const JAVA_IDENTIFIER_RE = /^[A-Z_$][\w$]*$/i;
const DEFAULT_BLUEJ_EXPORT_MAX_FILES = 40;
const DEFAULT_BLUEJ_EXPORT_MAX_TEXT_FILE_BYTES = 512 * 1024;
const DEFAULT_BLUEJ_IMPORT_MAX_ARCHIVE_BYTES = 4 * 1024 * 1024;
const DEFAULT_BLUEJ_IMPORT_MAX_FILES = 40;
const DEFAULT_BLUEJ_IMPORT_MAX_TEXT_FILE_BYTES = 512 * 1024;

export { BLUEJ_HOME_URL, BLUEJ_SOURCE_URL };

export interface BlueJProjectExportFile {
	name: string;
	content: string;
}

export interface BlueJProjectImportResult {
	files: PythonIdeFile[];
	hasBlueJPackage: boolean;
	skippedFiles: string[];
}

export interface BlueJProjectImportOptions {
	maxArchiveBytes?: number;
	maxFiles?: number;
	maxTextFileBytes?: number;
}

interface PrefilteredBlueJArchiveFile {
	archivePath: string;
	reason?: "outside BlueJ project" | "too large" | "too many files";
}

function safeBlueJProjectName(value: string) {
	const normalized = value
		.trim()
		.replaceAll(/[^\w-]+/g, "-")
		.replaceAll(/^-+|-+$/g, "");
	return normalized || "classes-bluej-project";
}

function boundedBlueJImportLimit(value: number | undefined, fallback: number) {
	if (value === undefined) return fallback;
	if (!Number.isFinite(value) || value < 1) return fallback;
	return Math.floor(value);
}

function boundedBlueJImportArchiveByteLimit(value: number | undefined) {
	return Math.min(
		boundedBlueJImportLimit(value, DEFAULT_BLUEJ_IMPORT_MAX_ARCHIVE_BYTES),
		DEFAULT_BLUEJ_IMPORT_MAX_ARCHIVE_BYTES
	);
}

function blueJArchiveByteLimitLabel(value: number) {
	return `${value.toLocaleString()} byte${value === 1 ? "" : "s"}`;
}

export function blueJProjectArchiveName(
	project: Pick<PythonIdeProject, "title">
) {
	return `${safeBlueJProjectName(project.title)}.zip`;
}

function blueJProjectFolderName(project: Pick<PythonIdeProject, "title">) {
	return safeBlueJProjectName(project.title);
}

function javaClassNameForBlueJTarget(fileName: string) {
	return (
		fileName
			.split("/")
			.filter(Boolean)
			.at(-1)
			?.replace(/\.java$/i, "") ?? ""
	);
}

function isBlueJTargetJavaFile(file: PythonIdeFile) {
	if (!isPythonIdeJavaFile(file.name) || file.name.includes("/"))
		return false;
	return JAVA_IDENTIFIER_RE.test(javaClassNameForBlueJTarget(file.name));
}

function blueJTargetLines(file: PythonIdeFile, index: number) {
	const targetNumber = index + 1;
	const column = index % 4;
	const row = Math.floor(index / 4);
	const name = javaClassNameForBlueJTarget(file.name);
	return [
		`target${targetNumber}.height=50`,
		`target${targetNumber}.name=${name}`,
		`target${targetNumber}.naviview.expanded=true`,
		`target${targetNumber}.showInterface=false`,
		`target${targetNumber}.type=ClassTarget`,
		`target${targetNumber}.width=${Math.max(80, name.length * 9)}`,
		`target${targetNumber}.x=${80 + column * 150}`,
		`target${targetNumber}.y=${70 + row * 110}`
	];
}

export function createBlueJPackageFile(files: PythonIdeFile[]) {
	const javaFiles = files.filter(isBlueJTargetJavaFile);
	return [
		"#BlueJ package file",
		"editor.fx.0.height=0",
		"editor.fx.0.width=0",
		"editor.fx.0.x=0",
		"editor.fx.0.y=0",
		"objectbench.height=96",
		"objectbench.width=760",
		"package.divider.horizontal=0.6",
		"package.divider.vertical=0.84",
		"package.editor.height=520",
		"package.editor.width=820",
		"package.editor.x=40",
		"package.editor.y=40",
		"package.frame.height=720",
		"package.frame.width=960",
		"package.numDependencies=0",
		`package.numTargets=${javaFiles.length}`,
		"package.showExtends=true",
		"package.showUses=true",
		"project.charset=UTF-8",
		"readme.height=58",
		"readme.name=@README",
		"readme.width=47",
		"readme.x=10",
		"readme.y=10",
		...javaFiles.flatMap(blueJTargetLines),
		""
	].join("\n");
}

function defaultBlueJReadme(project: Pick<PythonIdeProject, "title">) {
	return `BlueJ project exported from the IDE.

Project: ${project.title || "Untitled Java Project"}

Open this ZIP in BlueJ with File > Open Project, or unzip it and open the project folder.
BlueJ: ${BLUEJ_HOME_URL}
BlueJ source: ${BLUEJ_SOURCE_URL}
`;
}

function isWithinBlueJExportByteLimit(content: string) {
	if (content.length > DEFAULT_BLUEJ_EXPORT_MAX_TEXT_FILE_BYTES) return false;
	return (
		new TextEncoder().encode(content).byteLength <=
		DEFAULT_BLUEJ_EXPORT_MAX_TEXT_FILE_BYTES
	);
}

function isBlueJExportableTextFile(file: PythonIdeFile) {
	return (
		file.encoding !== "base64" &&
		isValidPythonFileName(file.name) &&
		isPythonIdeTextFile(file.name) &&
		file.name.toLowerCase() !== BLUEJ_PROJECT_FILE_NAME &&
		isWithinBlueJExportByteLimit(file.content)
	);
}

function blueJExportFileName(file: PythonIdeFile) {
	return file.name.toUpperCase() === BLUEJ_README_FILE_NAME
		? BLUEJ_README_FILE_NAME
		: file.name;
}

export function createBlueJProjectFiles(
	project: Pick<PythonIdeProject, "files" | "title">
): BlueJProjectExportFile[] {
	const files: BlueJProjectExportFile[] = [];
	const usedFileNames = new Set<string>();

	for (const file of project.files) {
		if (files.length >= DEFAULT_BLUEJ_EXPORT_MAX_FILES) break;
		if (!isBlueJExportableTextFile(file)) continue;

		const name = blueJExportFileName(file);
		if (usedFileNames.has(name)) continue;

		usedFileNames.add(name);
		files.push({
			name,
			content: file.content
		});
	}

	if (!usedFileNames.has(BLUEJ_README_FILE_NAME)) {
		files.push({
			name: BLUEJ_README_FILE_NAME,
			content: defaultBlueJReadme(project)
		});
	}

	files.push({
		name: BLUEJ_PROJECT_FILE_NAME,
		content: createBlueJPackageFile(files)
	});

	return files;
}

export function createBlueJProjectArchive(project: PythonIdeProject) {
	const folderName = blueJProjectFolderName(project);
	const entries = Object.fromEntries(
		createBlueJProjectFiles(project).map(file => [
			`${folderName}/${file.name}`,
			strToU8(file.content)
		])
	);
	return zipSync(entries);
}

function normalizedBlueJArchivePath(value: string) {
	return value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
}

function blueJArchivePathSegments(value: string) {
	return normalizedBlueJArchivePath(value).split("/").filter(Boolean);
}

function commonBlueJArchiveRoot(paths: string[]) {
	const segmentLists = paths
		.map(blueJArchivePathSegments)
		.filter(segments => segments.length > 1 && segments[0] !== "__MACOSX");
	if (!segmentLists.length) return "";

	const root = segmentLists[0]?.[0] ?? "";
	if (!root || root === "." || root === ".." || root.startsWith("."))
		return "";
	return segmentLists.every(segments => segments[0] === root) ? root : "";
}

function blueJArchiveProjectPath(archivePath: string, commonRoot: string) {
	const segments = blueJArchivePathSegments(archivePath);
	if (!segments.length || segments[0] === "__MACOSX") return "";
	if (commonRoot && segments[0] === commonRoot) segments.shift();
	return segments.join("/");
}

function blueJArchiveCandidateProjectPaths(archivePath: string) {
	const segments = blueJArchivePathSegments(archivePath);
	const candidates = [segments.join("/")];
	if (segments.length > 1 && segments[0] !== "__MACOSX") {
		candidates.push(segments.slice(1).join("/"));
	}
	return candidates.filter(Boolean);
}

function isBlueJArchivePackagePath(projectPath: string) {
	return projectPath.toLowerCase() === BLUEJ_PROJECT_FILE_NAME;
}

function blueJArchivePackageRoot(archivePath: string) {
	const segments = blueJArchivePathSegments(archivePath);
	if (!segments.length || segments[0] === "__MACOSX") return null;
	if (isBlueJArchiveMetadataPath(segments.join("/"))) return null;
	if (segments.at(-1)?.toLowerCase() !== BLUEJ_PROJECT_FILE_NAME) return null;
	return segments.slice(0, -1).join("/");
}

function collectBlueJPackageRoots(archiveBytes: Uint8Array) {
	const roots = new Set<string>();
	unzipSync(archiveBytes, {
		filter(file) {
			const root = blueJArchivePackageRoot(file.name);
			if (root !== null) roots.add(root);
			return false;
		}
	});
	return Array.from(roots);
}

function isInsideBlueJArchiveRoot(archivePath: string, root: string) {
	if (!root) return true;
	const normalizedArchivePath = normalizedBlueJArchivePath(archivePath);
	return (
		normalizedArchivePath === root ||
		normalizedArchivePath.startsWith(`${root}/`)
	);
}

function isBlueJArchiveMetadataPath(projectPath: string) {
	const segments = projectPath.split("/").filter(Boolean);
	const normalizedSegments = segments.map(segment => segment.toLowerCase());
	const fileName = normalizedSegments.at(-1);
	return (
		normalizedSegments.includes("__macosx") ||
		normalizedSegments.some(segment => segment.startsWith("._")) ||
		fileName === ".ds_store"
	);
}

export function blueJProjectTitleFromArchiveName(fileName: string) {
	const baseName = fileName
		.split(/[\\/]/)
		.pop()
		?.replace(/\.zip$/i, "")
		.replaceAll(/[-_]+/g, " ")
		.trim();
	if (!baseName) return "Imported BlueJ Project";
	return /bluej/i.test(baseName) ? baseName : `${baseName} BlueJ Project`;
}

export function importBlueJProjectArchive(
	archiveBytes: Uint8Array,
	options: BlueJProjectImportOptions = {}
): BlueJProjectImportResult {
	const maxArchiveBytes = boundedBlueJImportArchiveByteLimit(
		options.maxArchiveBytes
	);
	if (archiveBytes.byteLength > maxArchiveBytes) {
		throw new Error(
			`BlueJ ZIP is larger than ${blueJArchiveByteLimitLabel(maxArchiveBytes)}.`
		);
	}

	const maxFiles = boundedBlueJImportLimit(
		options.maxFiles,
		DEFAULT_BLUEJ_IMPORT_MAX_FILES
	);
	const maxTextFileBytes = boundedBlueJImportLimit(
		options.maxTextFileBytes,
		DEFAULT_BLUEJ_IMPORT_MAX_TEXT_FILE_BYTES
	);
	const packageRoots = collectBlueJPackageRoots(archiveBytes);
	const blueJProjectRoot = packageRoots.length === 1 ? packageRoots[0]! : "";
	const archivePathsForRoot: string[] = [];
	const prefilteredSkippedFiles: PrefilteredBlueJArchiveFile[] = [];
	const files: PythonIdeFile[] = [];
	const skippedFiles: string[] = [];
	const usedFileNames = new Set<string>();
	let hasBlueJPackage = false;
	let extractedFileCount = 0;

	const archive = unzipSync(archiveBytes, {
		filter(file) {
			const archivePath = normalizedBlueJArchivePath(file.name);
			if (!archivePath || archivePath.endsWith("/")) return false;

			const candidateProjectPaths =
				blueJArchiveCandidateProjectPaths(archivePath);
			if (
				candidateProjectPaths.some(isBlueJArchiveMetadataPath) ||
				!candidateProjectPaths.length
			) {
				return false;
			}
			if (candidateProjectPaths.some(isBlueJArchivePackagePath)) {
				archivePathsForRoot.push(archivePath);
				hasBlueJPackage = true;
				return false;
			}
			if (
				candidateProjectPaths.some(projectPath => {
					const lowerPath = projectPath.toLowerCase();
					return (
						lowerPath.endsWith(".ctxt") || lowerPath === "team.defs"
					);
				})
			) {
				return false;
			}
			const hasImportableTextPath = candidateProjectPaths.some(
				projectPath =>
					isValidPythonFileName(projectPath) &&
					isPythonIdeTextFile(projectPath)
			);
			if (!hasImportableTextPath) {
				prefilteredSkippedFiles.push({ archivePath });
				return false;
			}
			if (
				blueJProjectRoot &&
				!isInsideBlueJArchiveRoot(archivePath, blueJProjectRoot)
			) {
				prefilteredSkippedFiles.push({
					archivePath,
					reason: "outside BlueJ project"
				});
				return false;
			}

			archivePathsForRoot.push(archivePath);
			if (file.originalSize > maxTextFileBytes) {
				prefilteredSkippedFiles.push({
					archivePath,
					reason: "too large"
				});
				return false;
			}
			if (extractedFileCount >= maxFiles) {
				prefilteredSkippedFiles.push({
					archivePath,
					reason: "too many files"
				});
				return false;
			}

			extractedFileCount += 1;
			return true;
		}
	});
	const archivePaths = Object.keys(archive).filter(
		path => !normalizedBlueJArchivePath(path).endsWith("/")
	);
	const commonRoot =
		blueJProjectRoot || commonBlueJArchiveRoot(archivePathsForRoot);

	for (const archivePath of archivePaths) {
		const projectPath = blueJArchiveProjectPath(archivePath, commonRoot);
		if (!projectPath) continue;

		const lowerPath = projectPath.toLowerCase();
		if (isBlueJArchiveMetadataPath(projectPath)) continue;
		if (isBlueJArchivePackagePath(lowerPath)) {
			hasBlueJPackage = true;
			continue;
		}
		if (lowerPath.endsWith(".ctxt") || lowerPath === "team.defs") continue;

		if (
			!isValidPythonFileName(projectPath) ||
			!isPythonIdeTextFile(projectPath)
		) {
			skippedFiles.push(projectPath);
			continue;
		}
		if (usedFileNames.has(projectPath)) continue;
		if (archive[archivePath]!.byteLength > maxTextFileBytes) {
			skippedFiles.push(`${projectPath} (too large)`);
			continue;
		}
		if (files.length >= maxFiles) {
			skippedFiles.push(`${projectPath} (too many files)`);
			continue;
		}

		usedFileNames.add(projectPath);
		files.push({
			name: projectPath,
			content: strFromU8(archive[archivePath]!),
			encoding: "text"
		});
	}

	for (const skippedFile of prefilteredSkippedFiles) {
		const projectPath = blueJArchiveProjectPath(
			skippedFile.archivePath,
			commonRoot
		);
		if (!projectPath || isBlueJArchiveMetadataPath(projectPath)) continue;
		skippedFiles.push(
			skippedFile.reason
				? `${projectPath} (${skippedFile.reason})`
				: projectPath
		);
	}

	return {
		files,
		hasBlueJPackage,
		skippedFiles
	};
}
