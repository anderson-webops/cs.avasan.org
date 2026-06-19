import type { RequestHandler } from "express";
import type { IPythonProject, PythonProjectFile, PythonProjectMode } from "../../types/entities/IPythonProject.js";
import { Types } from "mongoose";
import { z } from "zod";
import { PythonProject } from "../../models/schemas/PythonProject.js";

const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|json|md|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const PYTHON_FILE_NAME_RE = /\.py$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const RUNTIME_RESERVED_ROOTS = new Set(["keras", "pgzero", "tensorflow"]);
const MAX_PROJECT_FILES = 40;
const MAX_FILE_LENGTH = 3_000_000;
const MAX_PROJECT_LENGTH = 12_000_000;
const DEFAULT_PROJECT_FILE: PythonProjectFile = {
	name: "main.py",
	content: ""
};

function isRuntimeReservedProjectPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/").toLowerCase();
	if (!normalized) return false;
	if (RUNTIME_RESERVED_FILE_NAMES.has(normalized)) return true;

	const root = normalized.split("/")[0] ?? "";
	return RUNTIME_RESERVED_ROOTS.has(root);
}

function isSafeProjectFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//")) return false;

	const segments = value.split("/");
	if (
		segments.some(segment => !segment || segment === "." || segment === ".." || !SAFE_FILE_SEGMENT_RE.test(segment))
	) {
		return false;
	}

	if (isRuntimeReservedProjectPath(value)) return false;

	if (PYTHON_FILE_NAME_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

const projectModeSchema = z.enum(["data", "pgzero", "python", "turtle"]);
const projectFileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1)
		.max(80)
		.refine(
			isSafeProjectFileName,
			"Use a safe .py file, root data/text file, or images/, sounds/, or music/ asset file that does not use a runtime-reserved module name"
		),
	content: z.string().max(MAX_FILE_LENGTH),
	encoding: z.enum(["text", "base64"]).optional()
});
const projectFilesSchema = z
	.array(projectFileSchema)
	.min(1)
	.max(MAX_PROJECT_FILES)
	.refine(
		files => files.reduce((total, file) => total + file.name.length + file.content.length, 0) <= MAX_PROJECT_LENGTH,
		`Project files must be ${MAX_PROJECT_LENGTH} characters or less in total`
	)
	.refine(
		files => files.some(file => PYTHON_FILE_NAME_RE.test(file.name)),
		"Project must include at least one Python file"
	);

const projectPayloadSchema = z.object({
	title: z.string().trim().min(1).max(120).optional(),
	mode: projectModeSchema.optional(),
	files: projectFilesSchema.optional(),
	activeFileName: z.string().trim().min(1).max(80).optional(),
	courseID: z.string().trim().min(1).max(120).optional(),
	courseProjectKey: z.string().trim().min(1).max(240).optional(),
	courseProjectTitle: z.string().trim().min(1).max(160).optional(),
	starterLabel: z.string().trim().min(1).max(80).optional(),
	starterUrl: z.string().trim().url().max(500).optional()
});

function serializePythonProject(project: IPythonProject) {
	return {
		_id: project._id.toString(),
		title: project.title,
		mode: project.mode,
		files: project.files,
		activeFileName: project.activeFileName,
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	};
}

function normalizeProjectFiles(files: PythonProjectFile[] | undefined) {
	const sourceFiles = files?.length ? files : [DEFAULT_PROJECT_FILE];
	const seen = new Set<string>();
	const cleanFiles: PythonProjectFile[] = [];

	for (const file of sourceFiles) {
		const name = file.name.trim();
		if (seen.has(name)) continue;
		seen.add(name);
		cleanFiles.push({
			name,
			content: file.content,
			encoding: file.encoding ?? "text"
		});
	}

	return cleanFiles.length ? cleanFiles : [DEFAULT_PROJECT_FILE];
}

function normalizeActiveFileName(activeFileName: string | undefined, files: PythonProjectFile[]) {
	const fileNames = new Set(files.map(file => file.name));
	if (activeFileName && fileNames.has(activeFileName)) return activeFileName;
	return files[0]?.name ?? DEFAULT_PROJECT_FILE.name;
}

function getProjectIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramProjectID = req.params.projectID;
	const projectID = Array.isArray(paramProjectID) ? paramProjectID[0] : paramProjectID;

	if (typeof projectID !== "string" || !Types.ObjectId.isValid(projectID)) {
		res.status(400).json({ message: "Invalid project ID" });
		return null;
	}

	return projectID;
}

async function findOwnedProject(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return null;

	const userID = req.currentUser?._id;
	if (!userID) {
		res.status(403).json({ message: "Student session required" });
		return null;
	}

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		user: userID
	});

	if (!project) {
		res.sendStatus(404);
		return null;
	}

	return project;
}

export const listPythonProjects: RequestHandler = async (req, res) => {
	const userID = req.currentUser?._id;
	if (!userID) return res.status(403).json({ message: "Student session required" });

	const projects = await PythonProject.find({ user: userID }).sort({ updatedAt: -1 }).limit(100);

	res.json({ projects: projects.map(serializePythonProject) });
};

export const createPythonProject: RequestHandler = async (req, res) => {
	const userID = req.currentUser?._id;
	if (!userID) return res.status(403).json({ message: "Student session required" });

	const parsed = projectPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const files = normalizeProjectFiles(parsed.data.files);
	const activeFileName = normalizeActiveFileName(parsed.data.activeFileName, files);
	const project = await PythonProject.create({
		user: userID,
		title: parsed.data.title ?? "Untitled Python Project",
		mode: parsed.data.mode ?? "python",
		files,
		activeFileName,
		courseID: parsed.data.courseID,
		courseProjectKey: parsed.data.courseProjectKey,
		courseProjectTitle: parsed.data.courseProjectTitle,
		starterLabel: parsed.data.starterLabel,
		starterUrl: parsed.data.starterUrl
	});

	res.status(201).json({ project: serializePythonProject(project) });
};

export const updatePythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;

	const parsed = projectPayloadSchema.partial().safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const nextFiles = parsed.data.files ? normalizeProjectFiles(parsed.data.files) : project.files;
	const nextActiveFileName = normalizeActiveFileName(parsed.data.activeFileName ?? project.activeFileName, nextFiles);

	if (parsed.data.title) project.title = parsed.data.title;
	if (parsed.data.mode) project.mode = parsed.data.mode as PythonProjectMode;
	if (parsed.data.files) project.files = nextFiles;
	if (parsed.data.courseID) project.courseID = parsed.data.courseID;
	if (parsed.data.courseProjectKey) project.courseProjectKey = parsed.data.courseProjectKey;
	if (parsed.data.courseProjectTitle) project.courseProjectTitle = parsed.data.courseProjectTitle;
	if (parsed.data.starterLabel) project.starterLabel = parsed.data.starterLabel;
	if (parsed.data.starterUrl) project.starterUrl = parsed.data.starterUrl;
	project.activeFileName = nextActiveFileName;

	await project.save();
	res.json({ project: serializePythonProject(project) });
};

export const deletePythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;

	await project.deleteOne();
	res.sendStatus(204);
};
