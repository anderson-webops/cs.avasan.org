import type { RequestHandler } from "express";
import type { IPythonProject, PythonProjectFile, PythonProjectMode } from "../../types/entities/IPythonProject.js";
import { Types } from "mongoose";
import { z } from "zod";
import { PythonProject } from "../../models/schemas/PythonProject.js";

const PYTHON_FILE_NAME_RE = /^[A-Za-z_][\w.-]*\.py$/;
const MAX_PROJECT_FILES = 24;
const MAX_FILE_LENGTH = 80_000;
const MAX_PROJECT_LENGTH = 500_000;
const DEFAULT_PROJECT_FILE = {
	name: "main.py",
	content: "print(\"Hello, Python!\")\n"
};

const projectModeSchema = z.enum(["python", "turtle"]);
const projectFileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1)
		.max(80)
		.regex(PYTHON_FILE_NAME_RE, "Use a Python filename like main.py"),
	content: z.string().max(MAX_FILE_LENGTH)
});
const projectFilesSchema = z
	.array(projectFileSchema)
	.min(1)
	.max(MAX_PROJECT_FILES)
	.refine(
		files =>
			files.reduce((total, file) => total + file.name.length + file.content.length, 0)
			<= MAX_PROJECT_LENGTH,
		`Project files must be ${MAX_PROJECT_LENGTH} characters or less in total`
	);

const projectPayloadSchema = z.object({
	title: z.string().trim().min(1).max(120).optional(),
	mode: projectModeSchema.optional(),
	files: projectFilesSchema.optional(),
	activeFileName: z.string().trim().min(1).max(80).optional()
});

function serializePythonProject(project: IPythonProject) {
	return {
		_id: project._id.toString(),
		title: project.title,
		mode: project.mode,
		files: project.files,
		activeFileName: project.activeFileName,
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
			content: file.content
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

	const projects = await PythonProject.find({ user: userID })
		.sort({ updatedAt: -1 })
		.limit(100);

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
		activeFileName
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
