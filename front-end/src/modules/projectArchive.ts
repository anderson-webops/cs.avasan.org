import type { PythonIdeFile, PythonIdeProject } from "@/modules/pythonIde";
import { strToU8, zipSync } from "fflate";

const FALLBACK_PROJECT_ARCHIVE_NAME = "Code Project";
const SAFE_ARCHIVE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const WINDOWS_RESERVED_FILE_NAME_RE =
	/^(?:aux|com[1-9]|con|lpt[1-9]|nul|prn)(?:\.|$)/i;

function removeControlCharacters(value: string) {
	return Array.from(value)
		.filter(character => {
			const codePoint = character.codePointAt(0) ?? 0;
			return codePoint >= 32 && codePoint !== 127;
		})
		.join("");
}

function safeProjectArchiveBaseName(value: string) {
	let name = removeControlCharacters(value)
		.trim()
		.replace(/\.zip$/i, "")
		.replaceAll(/[<>:"/\\|?*]+/g, "-")
		.replaceAll(/\s+/g, " ")
		.replaceAll(/-+/g, "-")
		.replaceAll(/\s*-\s*/g, "-")
		.replaceAll(/^[.\s-]+|[.\s-]+$/g, "")
		.slice(0, 100)
		.replaceAll(/[.\s-]+$/g, "");

	if (!name) name = FALLBACK_PROJECT_ARCHIVE_NAME;
	if (WINDOWS_RESERVED_FILE_NAME_RE.test(name)) name = `${name}-project`;
	return name;
}

function safeProjectArchiveFilePath(value: string) {
	if (
		!value ||
		value !== value.trim() ||
		value.startsWith("/") ||
		value.includes("\\") ||
		value.includes("//")
	) {
		throw new Error(
			`Cannot download unsafe project file path: ${value || "(empty)"}`
		);
	}

	const segments = value.split("/");
	if (
		segments.some(
			segment =>
				!segment ||
				segment === "." ||
				segment === ".." ||
				!SAFE_ARCHIVE_FILE_SEGMENT_RE.test(segment)
		)
	) {
		throw new Error(`Cannot download unsafe project file path: ${value}`);
	}

	return value;
}

function decodeBase64ProjectFile(file: PythonIdeFile) {
	const binary = atob(file.content.replaceAll(/\s+/g, ""));
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

function projectFileBytes(file: PythonIdeFile) {
	return file.encoding === "base64"
		? decodeBase64ProjectFile(file)
		: strToU8(file.content);
}

export function projectArchiveName(project: Pick<PythonIdeProject, "title">) {
	return `${safeProjectArchiveBaseName(project.title)}.zip`;
}

export function createProjectArchive(
	project: Pick<PythonIdeProject, "files" | "title">
) {
	if (!project.files.length) {
		throw new Error("This project does not contain any files to download.");
	}

	const projectFolder = safeProjectArchiveBaseName(project.title);
	const entries = Object.create(null) as Record<string, Uint8Array>;

	for (const file of project.files) {
		const filePath = safeProjectArchiveFilePath(file.name);
		const archivePath = `${projectFolder}/${filePath}`;
		if (entries[archivePath]) {
			throw new Error(
				`Cannot download duplicate project file: ${filePath}`
			);
		}
		entries[archivePath] = projectFileBytes(file);
	}

	return zipSync(entries);
}
