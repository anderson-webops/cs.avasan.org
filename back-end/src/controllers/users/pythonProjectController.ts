import type { RequestHandler } from "express";
import type { IPythonProject, PythonProjectFile, PythonProjectMode } from "../../types/entities/IPythonProject.js";
import type { IPythonProjectReview, PythonProjectReviewRole } from "../../types/entities/IPythonProjectReview.js";
import { Buffer } from "node:buffer";
import { Types } from "mongoose";
import { z } from "zod";
import { PythonProject } from "../../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../../models/schemas/PythonProjectReview.js";
import { Student } from "../../models/schemas/Student.js";

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
const MAX_ACTIVE_PROJECTS = 25;
const MAX_ACTIVE_PROJECT_BYTES = 32 * 1024 * 1024;
const DEFAULT_PROJECT_PAGE_SIZE = 10;
const MAX_PROJECT_PAGE_SIZE = 25;
const APPROVED_STARTER_URL_HOSTS = new Set([
	"cs.avasan.org",
	"static.cs.avasan.org",
	"github.com",
	"raw.githubusercontent.com"
]);
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

function isApprovedStarterUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === "https:" && APPROVED_STARTER_URL_HOSTS.has(url.hostname.toLowerCase());
	}
	catch {
		return false;
	}
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

const projectPayloadSchema = z
	.object({
		title: z.string().trim().min(1).max(120).optional(),
		mode: projectModeSchema.optional(),
		files: projectFilesSchema.optional(),
		activeFileName: z.string().trim().min(1).max(80).optional(),
		courseID: z.string().trim().min(1).max(120).optional(),
		courseProjectKey: z.string().trim().min(1).max(240).optional(),
		courseProjectTitle: z.string().trim().min(1).max(160).optional(),
		starterLabel: z.string().trim().min(1).max(80).optional(),
		starterUrl: z
			.string()
			.trim()
			.url()
			.max(500)
			.refine(isApprovedStarterUrl, "Starter URL must use HTTPS on an approved classroom source host")
			.optional(),
		importID: z
			.string()
			.trim()
			.min(3)
			.max(128)
			.regex(/^[\w.:-]+$/)
	})
	.strict();
const projectUpdatePayloadSchema = projectPayloadSchema
	.omit({ importID: true })
	.extend({
		expectedUpdatedAt: z.string().datetime({ offset: true })
	})
	.strict();
const projectDeletePayloadSchema = z
	.object({
		expectedUpdatedAt: z.string().datetime({ offset: true })
	})
	.strict();
const projectReviewPayloadSchema = z.object({
	files: projectFilesSchema.optional(),
	activeFileName: z.string().trim().min(1).max(80).optional(),
	visibleToStudent: z.boolean().optional(),
	note: z.string().trim().max(20000).optional()
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
		importID: project.importID,
		byteCount: storedProjectByteCount(project),
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	};
}

function serializePythonProjectMetadata(project: IPythonProject) {
	return {
		_id: project._id.toString(),
		title: project.title,
		mode: project.mode,
		activeFileName: project.activeFileName,
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl,
		importID: project.importID,
		byteCount: Number.isSafeInteger(project.byteCount) && project.byteCount >= 0 ? project.byteCount : undefined,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	};
}

function serializePythonProjectReview(review: IPythonProjectReview) {
	return {
		_id: review._id.toString(),
		sourceProject: review.sourceProject.toString(),
		title: review.title,
		mode: review.mode,
		files: review.files,
		activeFileName: review.activeFileName,
		courseID: review.courseID,
		courseProjectKey: review.courseProjectKey,
		courseProjectTitle: review.courseProjectTitle,
		reviewerRole: review.reviewerRole,
		reviewerName: review.reviewerName,
		lastEditedByRole: review.lastEditedByRole,
		lastEditedByName: review.lastEditedByName,
		visibleToStudent: review.visibleToStudent,
		note: review.note ?? "",
		sourceUpdatedAt: review.sourceUpdatedAt,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt
	};
}

function serializePythonProjectReviewMetadata(review: IPythonProjectReview) {
	return {
		_id: review._id.toString(),
		sourceProject: review.sourceProject.toString(),
		title: review.title,
		mode: review.mode,
		activeFileName: review.activeFileName,
		courseID: review.courseID,
		courseProjectKey: review.courseProjectKey,
		courseProjectTitle: review.courseProjectTitle,
		reviewerRole: review.reviewerRole,
		reviewerName: review.reviewerName,
		lastEditedByRole: review.lastEditedByRole,
		lastEditedByName: review.lastEditedByName,
		visibleToStudent: review.visibleToStudent,
		sourceUpdatedAt: review.sourceUpdatedAt,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt
	};
}

function paginationFromRequest(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const pageValue = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page;
	const pageSizeValue = Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize;
	const page = pageValue === undefined ? 1 : Number(pageValue);
	const pageSize = pageSizeValue === undefined ? DEFAULT_PROJECT_PAGE_SIZE : Number(pageSizeValue);

	if (
		!Number.isSafeInteger(page)
		|| page < 1
		|| page > MAX_ACTIVE_PROJECTS
		|| !Number.isSafeInteger(pageSize)
		|| pageSize < 1
		|| pageSize > MAX_PROJECT_PAGE_SIZE
	) {
		res.status(400).json({
			message: `Pagination requires page from 1 to ${MAX_ACTIVE_PROJECTS} and pageSize from 1 to ${MAX_PROJECT_PAGE_SIZE}.`
		});
		return null;
	}

	return {
		page,
		pageSize,
		skip: (page - 1) * pageSize
	};
}

function paginatedResult<T>(items: T[], pagination: { page: number; pageSize: number }) {
	const hasMore = items.length > pagination.pageSize;
	return {
		hasMore,
		page: pagination.page,
		pageSize: pagination.pageSize,
		items: hasMore ? items.slice(0, pagination.pageSize) : items
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

function calculateProjectByteCount(files: PythonProjectFile[]): number {
	return files.reduce(
		(total, file) => total + Buffer.byteLength(file.name, "utf8") + Buffer.byteLength(file.content, "utf8"),
		0
	);
}

function storedProjectByteCount(project: IPythonProject): number {
	return Number.isSafeInteger(project.byteCount) && project.byteCount >= 0
		? project.byteCount
		: calculateProjectByteCount(project.files);
}

function isDuplicateKeyError(error: unknown): boolean {
	return (
		typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000
	);
}

async function reserveStudentProjectQuota(
	studentID: Types.ObjectId,
	projectDelta: 0 | 1,
	byteDelta: number
): Promise<boolean> {
	const result = await Student.updateOne(
		{
			_id: studentID,
			active: true,
			$expr: {
				$and: [
					{
						$lte: [
							{
								$add: [{ $ifNull: ["$activeProjectCount", 0] }, projectDelta]
							},
							MAX_ACTIVE_PROJECTS
						]
					},
					{
						$lte: [
							{
								$add: [{ $ifNull: ["$activeProjectBytes", 0] }, byteDelta]
							},
							MAX_ACTIVE_PROJECT_BYTES
						]
					}
				]
			}
		},
		{
			$inc: {
				activeProjectCount: projectDelta,
				activeProjectBytes: byteDelta
			}
		}
	);
	return result.modifiedCount === 1;
}

async function releaseStudentProjectQuota(
	studentID: Types.ObjectId,
	projectDelta: 0 | 1,
	byteDelta: number
): Promise<boolean> {
	const result = await Student.updateOne(
		{
			_id: studentID,
			activeProjectCount: { $gte: projectDelta },
			activeProjectBytes: { $gte: byteDelta }
		},
		{
			$inc: {
				activeProjectCount: -projectDelta,
				activeProjectBytes: -byteDelta
			}
		}
	);
	return result.modifiedCount === 1;
}

function sendQuotaConflict(res: Parameters<RequestHandler>[1]) {
	return res.status(409).json({
		message: "Each student can save up to 25 active projects or 32 MiB total."
	});
}

function sendSaveConflict(res: Parameters<RequestHandler>[1]) {
	return res.status(409).json({
		message: "This project changed elsewhere. Reload it and try again."
	});
}

const PROJECT_OPTIONAL_FIELDS = [
	"courseID",
	"courseProjectKey",
	"courseProjectTitle",
	"starterLabel",
	"starterUrl"
] as const;
const REVIEW_OPTIONAL_FIELDS = [
	"courseID",
	"courseProjectKey",
	"courseProjectTitle",
	"reviewerName",
	"lastEditedBy",
	"lastEditedByRole",
	"lastEditedByName"
] as const;

function restoreOptionalFields(
	source: object,
	fields: readonly string[],
	set: Record<string, unknown>,
	unset: Record<string, 1>
) {
	const values = source as Record<string, unknown>;
	for (const field of fields) {
		if (values[field] === undefined) {
			unset[field] = 1;
		}
		else {
			set[field] = values[field];
		}
	}
}

function projectRestoreUpdate(project: IPythonProject) {
	const $set: Record<string, unknown> = {
		activeFileName: project.activeFileName,
		byteCount: storedProjectByteCount(project),
		files: project.files,
		importID: project.importID,
		mode: project.mode,
		title: project.title,
		updatedAt: project.updatedAt
	};
	const $unset: Record<string, 1> = { deletedAt: 1 };
	restoreOptionalFields(project, PROJECT_OPTIONAL_FIELDS, $set, $unset);
	return { $set, $unset };
}

function reviewRestoreUpdate(review: IPythonProjectReview) {
	const $set: Record<string, unknown> = {
		activeFileName: review.activeFileName,
		files: review.files,
		mode: review.mode,
		note: review.note ?? "",
		sourceUpdatedAt: review.sourceUpdatedAt,
		title: review.title,
		updatedAt: review.updatedAt,
		visibleToStudent: review.visibleToStudent
	};
	const $unset: Record<string, 1> = { deletedAt: 1 };
	restoreOptionalFields(review, REVIEW_OPTIONAL_FIELDS, $set, $unset);
	return { $set, $unset };
}

function updateMatched(result: { matchedCount?: number; modifiedCount?: number }) {
	return result.matchedCount === 1 || result.modifiedCount === 1;
}

async function restoreDeleteTombstones(project: IPythonProject, review: IPythonProjectReview | null, deletedAt: Date) {
	const restoreOperations: Array<Promise<boolean>> = [
		PythonProject.updateOne(
			{
				_id: project._id,
				deletedAt,
				user: project.user
			},
			projectRestoreUpdate(project),
			{ timestamps: false }
		).then(updateMatched)
	];

	if (review) {
		restoreOperations.push(
			PythonProjectReview.updateOne(
				{
					_id: review._id,
					deletedAt,
					sourceProject: project._id,
					user: project.user
				},
				reviewRestoreUpdate(review),
				{ timestamps: false }
			).then(updateMatched)
		);
	}

	const restored = await Promise.allSettled(restoreOperations);
	return restored.every(result => result.status === "fulfilled" && result.value);
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

function getStudentIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramStudentID = req.params.studentID;
	const studentID = Array.isArray(paramStudentID) ? paramStudentID[0] : paramStudentID;

	if (typeof studentID !== "string" || !Types.ObjectId.isValid(studentID)) {
		res.status(400).json({ message: "Invalid student ID" });
		return null;
	}

	return studentID;
}

function getReviewIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramReviewID = req.params.reviewID;
	const reviewID = Array.isArray(paramReviewID) ? paramReviewID[0] : paramReviewID;

	if (typeof reviewID !== "string" || !Types.ObjectId.isValid(reviewID)) {
		res.status(400).json({ message: "Invalid review ID" });
		return null;
	}

	return reviewID;
}

function actingReviewer(req: Parameters<RequestHandler>[0]): {
	id: Types.ObjectId;
	name: string;
	role: PythonProjectReviewRole;
} | null {
	if (req.currentAdmin) {
		return {
			id: req.currentAdmin._id,
			name: req.currentAdmin.name,
			role: "admin"
		};
	}

	return null;
}

async function findManagedPythonProjectStudent(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const studentID = getStudentIDParam(req, res);
	if (!studentID) return null;

	const student = await Student.findById(studentID).select("+dataDeletionPendingAt");
	if (!student) {
		res.sendStatus(404);
		return null;
	}
	if (student.dataDeletionPendingAt) {
		res.status(409).json({
			message: "Permanent deletion is pending for this student."
		});
		return null;
	}

	if (req.currentAdmin) return student;
	res.status(403).json({ message: "Teacher session required" });
	return null;
}

async function findOwnedProject(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return null;

	const studentID = req.currentStudent?._id;
	if (!studentID) {
		res.status(403).json({ message: "Student session required" });
		return null;
	}

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		deletedAt: { $exists: false },
		user: studentID
	});

	if (!project) {
		res.sendStatus(404);
		return null;
	}

	return project;
}

export const listPythonProjects: RequestHandler = async (req, res) => {
	const studentID = req.currentStudent?._id;
	if (!studentID) return res.status(403).json({ message: "Student session required" });
	const pagination = paginationFromRequest(req, res);
	if (!pagination) return;

	const projects = await PythonProject.find({
		deletedAt: { $exists: false },
		user: studentID
	})
		.select("-files")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.skip)
		.limit(pagination.pageSize + 1);
	const page = paginatedResult(projects, pagination);

	res.json({
		hasMore: page.hasMore,
		page: page.page,
		pageSize: page.pageSize,
		projects: page.items.map(serializePythonProjectMetadata)
	});
};

export const getPythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;
	res.json({ project: serializePythonProject(project) });
};

export const listVisiblePythonProjectReviews: RequestHandler = async (req, res) => {
	const studentID = req.currentStudent?._id;
	if (!studentID) return res.status(403).json({ message: "Student session required" });
	const pagination = paginationFromRequest(req, res);
	if (!pagination) return;

	const activeProjects = await PythonProject.find({
		deletedAt: { $exists: false },
		user: studentID
	})
		.select("_id")
		.limit(MAX_ACTIVE_PROJECTS);
	const reviews = await PythonProjectReview.find({
		deletedAt: { $exists: false },
		sourceProject: { $in: activeProjects.map(project => project._id) },
		user: studentID,
		visibleToStudent: true
	})
		.select("-files -note")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.skip)
		.limit(pagination.pageSize + 1);
	const page = paginatedResult(reviews, pagination);

	res.json({
		hasMore: page.hasMore,
		page: page.page,
		pageSize: page.pageSize,
		reviews: page.items.map(serializePythonProjectReviewMetadata)
	});
};

export const getVisiblePythonProjectReview: RequestHandler = async (req, res) => {
	const studentID = req.currentStudent?._id;
	if (!studentID) return res.status(403).json({ message: "Student session required" });
	const reviewID = getReviewIDParam(req, res);
	if (!reviewID) return;

	const review = await PythonProjectReview.findOne({
		_id: new Types.ObjectId(reviewID),
		deletedAt: { $exists: false },
		user: studentID,
		visibleToStudent: true
	});
	if (!review) return res.sendStatus(404);
	const projectExists = await PythonProject.exists({
		_id: review.sourceProject,
		deletedAt: { $exists: false },
		user: studentID
	});
	if (!projectExists) return res.sendStatus(404);

	res.json({ review: serializePythonProjectReview(review) });
};

export const listManagedPythonProjects: RequestHandler = async (req, res) => {
	const student = await findManagedPythonProjectStudent(req, res);
	if (!student) return;
	const pagination = paginationFromRequest(req, res);
	if (!pagination) return;

	const projects = await PythonProject.find({
		deletedAt: { $exists: false },
		user: student._id
	})
		.select("-files")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.skip)
		.limit(pagination.pageSize + 1);
	const page = paginatedResult(projects, pagination);
	const reviews = await PythonProjectReview.find({
		deletedAt: { $exists: false },
		sourceProject: { $in: page.items.map(project => project._id) },
		user: student._id
	})
		.select("-files -note")
		.sort({ updatedAt: -1, _id: -1 })
		.limit(page.pageSize);
	const reviewsByProject = new Map(
		reviews.map(review => [review.sourceProject.toString(), serializePythonProjectReviewMetadata(review)])
	);

	res.json({
		hasMore: page.hasMore,
		page: page.page,
		pageSize: page.pageSize,
		projects: page.items.map(project => ({
			project: serializePythonProjectMetadata(project),
			review: reviewsByProject.get(project._id.toString()) ?? null
		}))
	});
};

export const getManagedPythonProject: RequestHandler = async (req, res) => {
	const student = await findManagedPythonProjectStudent(req, res);
	if (!student) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		deletedAt: { $exists: false },
		user: student._id
	});
	if (!project) return res.sendStatus(404);
	const review = await PythonProjectReview.findOne({
		deletedAt: { $exists: false },
		sourceProject: project._id,
		user: student._id
	});

	res.json({
		project: serializePythonProject(project),
		review: review ? serializePythonProjectReview(review) : null
	});
};

export const createPythonProject: RequestHandler = async (req, res) => {
	const studentID = req.currentStudent?._id;
	if (!studentID) return res.status(403).json({ message: "Student session required" });

	const parsed = projectPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const files = normalizeProjectFiles(parsed.data.files);
	const activeFileName = normalizeActiveFileName(parsed.data.activeFileName, files);
	const byteCount = calculateProjectByteCount(files);
	const importID = parsed.data.importID;

	try {
		const existing = await PythonProject.findOne({ user: studentID, importID });
		if (existing) {
			if (existing.deletedAt) {
				return res.status(409).json({
					message: "A deleted project already used this import ID."
				});
			}
			return res.json({
				idempotentReplay: true,
				project: serializePythonProject(existing)
			});
		}

		const reserved = await reserveStudentProjectQuota(studentID, 1, byteCount);
		if (!reserved) return sendQuotaConflict(res);

		try {
			const project = await PythonProject.create({
				user: studentID,
				title: parsed.data.title ?? "Untitled Python Project",
				mode: parsed.data.mode ?? "python",
				files,
				activeFileName,
				courseID: parsed.data.courseID,
				courseProjectKey: parsed.data.courseProjectKey,
				courseProjectTitle: parsed.data.courseProjectTitle,
				starterLabel: parsed.data.starterLabel,
				starterUrl: parsed.data.starterUrl,
				importID,
				byteCount
			});

			return res.status(201).json({
				idempotentReplay: false,
				project: serializePythonProject(project)
			});
		}
		catch (error) {
			const released = await releaseStudentProjectQuota(studentID, 1, byteCount);
			if (!released) {
				return res.status(500).json({
					message: "Project quota could not be recovered after the save failed."
				});
			}
			if (isDuplicateKeyError(error)) {
				const existing = await PythonProject.findOne({ user: studentID, importID });
				if (existing && !existing.deletedAt) {
					return res.json({
						idempotentReplay: true,
						project: serializePythonProject(existing)
					});
				}
				if (existing?.deletedAt) {
					return res.status(409).json({
						message: "A deleted project already used this import ID."
					});
				}
			}
			throw error;
		}
	}
	catch {
		return res.status(500).json({ message: "Project could not be saved." });
	}
};

export const createPythonProjectReview: RequestHandler = async (req, res) => {
	const student = await findManagedPythonProjectStudent(req, res);
	if (!student) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;
	const reviewer = actingReviewer(req);
	if (!reviewer) return res.status(403).json({ message: "Teacher session required" });

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		deletedAt: { $exists: false },
		user: student._id
	});
	if (!project) return res.sendStatus(404);

	const existingReview = await PythonProjectReview.findOne({
		deletedAt: { $exists: false },
		user: student._id,
		sourceProject: project._id
	});
	if (existingReview) {
		return res.json({
			project: serializePythonProject(project),
			review: serializePythonProjectReview(existingReview)
		});
	}

	const files = normalizeProjectFiles(project.files);
	const review = await PythonProjectReview.create({
		user: student._id,
		sourceProject: project._id,
		title: project.title,
		mode: project.mode,
		files,
		activeFileName: normalizeActiveFileName(project.activeFileName, files),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		reviewer: reviewer.id,
		reviewerRole: reviewer.role,
		reviewerName: reviewer.name,
		lastEditedBy: reviewer.id,
		lastEditedByRole: reviewer.role,
		lastEditedByName: reviewer.name,
		visibleToStudent: false,
		note: "",
		sourceUpdatedAt: project.updatedAt
	});

	res.status(201).json({
		project: serializePythonProject(project),
		review: serializePythonProjectReview(review)
	});
};

export const updatePythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;

	const parsed = projectUpdatePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const expectedUpdatedAt = new Date(parsed.data.expectedUpdatedAt);
	if (project.updatedAt.getTime() !== expectedUpdatedAt.getTime()) {
		return sendSaveConflict(res);
	}

	const nextFiles = parsed.data.files ? normalizeProjectFiles(parsed.data.files) : project.files;
	const nextActiveFileName = normalizeActiveFileName(parsed.data.activeFileName ?? project.activeFileName, nextFiles);
	const oldByteCount = storedProjectByteCount(project);
	const nextByteCount = calculateProjectByteCount(nextFiles);
	const byteDelta = nextByteCount - oldByteCount;
	const positiveByteDelta = Math.max(0, byteDelta);
	let quotaReserved = false;
	let updateApplied = false;

	try {
		if (positiveByteDelta > 0) {
			quotaReserved = await reserveStudentProjectQuota(project.user, 0, positiveByteDelta);
			if (!quotaReserved) return sendQuotaConflict(res);
		}

		const updatedAt = new Date(Math.max(Date.now(), expectedUpdatedAt.getTime() + 1));
		const set: Record<string, unknown> = {
			activeFileName: nextActiveFileName,
			byteCount: nextByteCount,
			updatedAt
		};
		if (parsed.data.title !== undefined) set.title = parsed.data.title;
		if (parsed.data.mode !== undefined) {
			set.mode = parsed.data.mode as PythonProjectMode;
		}
		if (parsed.data.files !== undefined) set.files = nextFiles;
		if (parsed.data.courseID !== undefined) set.courseID = parsed.data.courseID;
		if (parsed.data.courseProjectKey !== undefined) {
			set.courseProjectKey = parsed.data.courseProjectKey;
		}
		if (parsed.data.courseProjectTitle !== undefined) {
			set.courseProjectTitle = parsed.data.courseProjectTitle;
		}
		if (parsed.data.starterLabel !== undefined) {
			set.starterLabel = parsed.data.starterLabel;
		}
		if (parsed.data.starterUrl !== undefined) set.starterUrl = parsed.data.starterUrl;

		const updated = await PythonProject.findOneAndUpdate(
			{
				_id: project._id,
				deletedAt: { $exists: false },
				updatedAt: expectedUpdatedAt,
				user: project.user
			},
			{ $set: set },
			{
				new: true,
				runValidators: true,
				timestamps: false
			}
		);
		if (!updated) {
			if (quotaReserved && !(await releaseStudentProjectQuota(project.user, 0, positiveByteDelta))) {
				return res.status(500).json({
					message: "Project quota could not be recovered after the save conflicted."
				});
			}
			return sendSaveConflict(res);
		}
		updateApplied = true;

		if (byteDelta < 0 && !(await releaseStudentProjectQuota(project.user, 0, -byteDelta))) {
			return res.status(500).json({
				message: "Project was saved, but its quota could not be reconciled."
			});
		}

		return res.json({ project: serializePythonProject(updated) });
	}
	catch {
		if (quotaReserved && !updateApplied) {
			try {
				await releaseStudentProjectQuota(project.user, 0, positiveByteDelta);
			}
			catch {
				// Preserve the original failure response. An over-counted quota
				// fails closed and can be reconciled administratively.
			}
		}
		return res.status(500).json({ message: "Project could not be saved." });
	}
};

export const updatePythonProjectReview: RequestHandler = async (req, res) => {
	const student = await findManagedPythonProjectStudent(req, res);
	if (!student) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;
	const reviewID = getReviewIDParam(req, res);
	if (!reviewID) return;
	const reviewer = actingReviewer(req);
	if (!reviewer) return res.status(403).json({ message: "Teacher session required" });

	const parsed = projectReviewPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid review payload", issues: parsed.error.issues });
	}

	const [project, review] = await Promise.all([
		PythonProject.findOne({
			_id: new Types.ObjectId(projectID),
			deletedAt: { $exists: false },
			user: student._id
		}),
		PythonProjectReview.findOne({
			_id: new Types.ObjectId(reviewID),
			deletedAt: { $exists: false },
			user: student._id,
			sourceProject: new Types.ObjectId(projectID)
		})
	]);
	if (!project || !review) return res.sendStatus(404);

	const nextFiles = parsed.data.files ? normalizeProjectFiles(parsed.data.files) : review.files;
	const nextActiveFileName = normalizeActiveFileName(parsed.data.activeFileName ?? review.activeFileName, nextFiles);

	if (parsed.data.files) review.files = nextFiles;
	if (parsed.data.visibleToStudent !== undefined) review.visibleToStudent = parsed.data.visibleToStudent;
	if (parsed.data.note !== undefined) review.note = parsed.data.note;
	review.activeFileName = nextActiveFileName;
	review.lastEditedBy = reviewer.id;
	review.lastEditedByRole = reviewer.role;
	review.lastEditedByName = reviewer.name;

	await review.save();
	res.json({
		project: serializePythonProject(project),
		review: serializePythonProjectReview(review)
	});
};

export const deletePythonProject: RequestHandler = async (req, res) => {
	const parsed = projectDeletePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid project deletion payload",
			issues: parsed.error.issues
		});
	}

	const project = await findOwnedProject(req, res);
	if (!project) return;

	const expectedUpdatedAt = new Date(parsed.data.expectedUpdatedAt);
	if (project.updatedAt.getTime() !== expectedUpdatedAt.getTime()) {
		return sendSaveConflict(res);
	}

	const deletedAt = new Date(Math.max(Date.now(), expectedUpdatedAt.getTime() + 1));
	const byteCount = storedProjectByteCount(project);
	try {
		const tombstone = await PythonProject.findOneAndUpdate(
			{
				_id: project._id,
				deletedAt: { $exists: false },
				updatedAt: expectedUpdatedAt,
				user: project.user
			},
			{
				$set: {
					activeFileName: DEFAULT_PROJECT_FILE.name,
					byteCount: 0,
					deletedAt,
					files: [],
					mode: "python",
					title: "Deleted project",
					updatedAt: deletedAt
				},
				$unset: {
					courseID: 1,
					courseProjectKey: 1,
					courseProjectTitle: 1,
					starterLabel: 1,
					starterUrl: 1
				}
			},
			{ new: true, timestamps: false }
		);
		if (!tombstone) return sendSaveConflict(res);

		let review: IPythonProjectReview | null;
		try {
			review = await PythonProjectReview.findOneAndUpdate(
				{
					deletedAt: { $exists: false },
					sourceProject: project._id,
					user: project.user
				},
				{
					$set: {
						activeFileName: DEFAULT_PROJECT_FILE.name,
						deletedAt,
						files: [],
						mode: "python",
						note: "",
						sourceUpdatedAt: deletedAt,
						title: "Deleted project review",
						updatedAt: deletedAt,
						visibleToStudent: false
					},
					$unset: {
						courseID: 1,
						courseProjectKey: 1,
						courseProjectTitle: 1,
						lastEditedBy: 1,
						lastEditedByName: 1,
						lastEditedByRole: 1,
						reviewerName: 1
					}
				},
				{ new: false, timestamps: false }
			);
		}
		catch {
			await restoreDeleteTombstones(project, null, deletedAt);
			return res.status(500).json({
				message: "Project could not be deleted."
			});
		}

		let released = false;
		try {
			released = await releaseStudentProjectQuota(project.user, 1, byteCount);
		}
		catch {
			await restoreDeleteTombstones(project, review, deletedAt);
			return res.status(500).json({
				message: "Project could not be deleted because its quota could not be reconciled."
			});
		}
		if (!released) {
			await restoreDeleteTombstones(project, review, deletedAt);
			return res.status(500).json({
				message: "Project could not be deleted because its quota could not be reconciled."
			});
		}

		await Promise.allSettled([
			PythonProjectReview.deleteOne({
				deletedAt,
				sourceProject: project._id,
				user: project.user
			}),
			PythonProject.deleteOne({
				_id: project._id,
				deletedAt,
				user: project.user
			})
		]);

		return res.sendStatus(204);
	}
	catch {
		return res.status(500).json({ message: "Project could not be deleted." });
	}
};
