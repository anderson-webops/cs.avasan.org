import type { Server } from "node:http";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createPythonProject,
	deletePythonProject,
	updatePythonProject
} from "../src/controllers/users/pythonProjectController.js";

const modelMocks = vi.hoisted(() => ({
	studentUpdateOne: vi.fn(),
	pythonProjectCreate: vi.fn(),
	pythonProjectDeleteOne: vi.fn(),
	pythonProjectFindOne: vi.fn(),
	pythonProjectFindOneAndUpdate: vi.fn(),
	pythonProjectUpdateOne: vi.fn(),
	pythonProjectReviewDeleteOne: vi.fn(),
	pythonProjectReviewFindOneAndUpdate: vi.fn(),
	pythonProjectReviewUpdateOne: vi.fn()
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		updateOne: modelMocks.studentUpdateOne
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		create: modelMocks.pythonProjectCreate,
		deleteOne: modelMocks.pythonProjectDeleteOne,
		findOne: modelMocks.pythonProjectFindOne,
		findOneAndUpdate: modelMocks.pythonProjectFindOneAndUpdate,
		updateOne: modelMocks.pythonProjectUpdateOne
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		deleteOne: modelMocks.pythonProjectReviewDeleteOne,
		findOneAndUpdate: modelMocks.pythonProjectReviewFindOneAndUpdate,
		updateOne: modelMocks.pythonProjectReviewUpdateOne
	}
}));

const studentID = new Types.ObjectId();
const projectID = new Types.ObjectId();
const createdAt = new Date("2026-06-18T11:00:00.000Z");
const updatedAt = new Date("2026-06-18T12:00:00.000Z");

function makeProject(overrides: Record<string, unknown> = {}) {
	return {
		_id: projectID,
		user: studentID,
		title: "Saved project",
		mode: "python",
		files: [{ name: "main.py", content: "print('saved')\n", encoding: "text" }],
		activeFileName: "main.py",
		importID: "browser-import:saved",
		byteCount: 22,
		createdAt,
		updatedAt,
		...overrides
	};
}

function makeReview(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		user: studentID,
		sourceProject: projectID,
		title: "Saved project review",
		mode: "python",
		files: [{ name: "main.py", content: "# Julio's note\n", encoding: "text" }],
		activeFileName: "main.py",
		reviewer: new Types.ObjectId(),
		reviewerRole: "admin",
		reviewerName: "Julio",
		visibleToStudent: true,
		note: "Keep practicing.",
		sourceUpdatedAt: updatedAt,
		createdAt,
		updatedAt,
		...overrides
	};
}

async function withPythonProjectRoute<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
	app.use((req: any, _res, next) => {
		req.currentStudent = { _id: studentID };
		next();
	});
	app.post("/students/projects", createPythonProject);
	app.put("/students/projects/:projectID", updatePythonProject);
	app.delete("/students/projects/:projectID", deletePythonProject);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function projectJson(
	baseUrl: string,
	method: "DELETE" | "POST" | "PUT",
	body: unknown,
	id?: Types.ObjectId
) {
	const suffix = id ? `/${id.toString()}` : "";
	return fetch(`${baseUrl}/students/projects${suffix}`, {
		body: JSON.stringify(body),
		headers: { "content-type": "application/json" },
		method
	});
}

describe("Python project routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.studentUpdateOne.mockResolvedValue({ modifiedCount: 1 });
		modelMocks.pythonProjectCreate.mockImplementation(async payload => makeProject({
			_id: new Types.ObjectId(),
			...payload
		}));
		modelMocks.pythonProjectDeleteOne.mockResolvedValue({ deletedCount: 1 });
		modelMocks.pythonProjectFindOne.mockResolvedValue(null);
		modelMocks.pythonProjectFindOneAndUpdate.mockResolvedValue(null);
		modelMocks.pythonProjectUpdateOne.mockResolvedValue({ modifiedCount: 1 });
		modelMocks.pythonProjectReviewDeleteOne.mockResolvedValue({ deletedCount: 1 });
		modelMocks.pythonProjectReviewFindOneAndUpdate.mockResolvedValue(null);
		modelMocks.pythonProjectReviewUpdateOne.mockResolvedValue({ modifiedCount: 1 });
	});

	it("accepts nested Python package files and records their UTF-8 byte usage", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				activeFileName: "package/util.py",
				files: [
					{ content: "", name: "package/__init__.py" },
					{ content: "def run():\n\treturn 1\n", name: "package/util.py" }
				],
				importID: "browser-import:one",
				mode: "python",
				title: "Package demo"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(body.idempotentReplay).toBe(false);
			const created = modelMocks.pythonProjectCreate.mock.calls[0]?.[0];
			expect(created).toMatchObject({
				activeFileName: "package/util.py",
				importID: "browser-import:one",
				user: studentID
			});
			expect(created.files).toEqual([
				{ content: "", encoding: "text", name: "package/__init__.py" },
				{
					content: "def run():\n\treturn 1\n",
					encoding: "text",
					name: "package/util.py"
				}
			]);
			expect(created.byteCount).toBe(
				Buffer.byteLength("package/__init__.py")
				+ Buffer.byteLength("package/util.py")
				+ Buffer.byteLength("def run():\n\treturn 1\n")
			);
			expect(body.project.byteCount).toBe(created.byteCount);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledWith(
				expect.objectContaining({
					_id: studentID,
					active: true,
					$expr: expect.any(Object)
				}),
				{
					$inc: {
						activeProjectBytes: created.byteCount,
						activeProjectCount: 1
					}
				}
			);
			const quotaFilter = JSON.stringify(modelMocks.studentUpdateOne.mock.calls[0]?.[0]);
			expect(quotaFilter).toContain("25");
			expect(quotaFilter).toContain(String(32 * 1024 * 1024));
		});
	});

	it("accepts the editor's 40-file limit and a 2 MB base64 asset", async () => {
		const files: Array<{
			content: string;
			encoding?: "base64";
			name: string;
		}> = Array.from({ length: 39 }, (_value, index) => ({
			content: `print(${index})\n`,
			name: index === 0 ? "main.py" : `helper_${index}.py`
		}));
		files.push({
			content: "A".repeat(Math.ceil((2 * 1024 * 1024) / 3) * 4),
			encoding: "base64",
			name: "images/player.png"
		});

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				files,
				importID: "browser-import:large",
				mode: "pgzero",
				title: "Large asset project"
			});

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					files: expect.arrayContaining([
						expect.objectContaining({
							encoding: "base64",
							name: "images/player.png"
						})
					])
				})
			);
		});
	});

	it("rejects unsafe files, starter hosts, and unknown create fields", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const body of [
				{
					files: [
						{ content: "print('ok')\n", name: "main.py" },
						{ content: "print('reserved')\n", name: "pygame.py" }
					],
					importID: "browser-import:unsafe-file"
				},
				{
					files: [{ content: "print('safe')\n", name: "main.py" }],
					importID: "browser-import:unsafe-starter",
					starterUrl: "https://attacker.example/starter.py"
				},
				{
					files: [{ content: "print('safe')\n", name: "main.py" }],
					importID: "browser-import:unknown-field",
					expectedUpdatedAt: updatedAt.toISOString()
				}
			]) {
				const response = await projectJson(baseUrl, "POST", body);
				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("requires a valid import ID before reserving project quota", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const importID of [undefined, "x", "spaces are unsafe"]) {
				const response = await projectJson(baseUrl, "POST", {
					files: [{ content: "print('safe')\n", name: "main.py" }],
					...(importID === undefined ? {} : { importID })
				});
				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.pythonProjectFindOne).not.toHaveBeenCalled();
		expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("mounts project write limiting and large parsers only after authentication", () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");
		const studentControllerSource = readFileSync(
			resolve(__dirname, "../src/controllers/students/studentController.ts"),
			"utf8"
		);
		const projectPayloadSource = readFileSync(
			resolve(__dirname, "../src/middleware/projectPayload.ts"),
			"utf8"
		);

		expect(serverSource).toContain("createProjectJsonParser()");
		expect(projectPayloadSource).toContain("PYTHON_IDE_PROJECT_BODY_LIMIT");
		expect(projectPayloadSource).toContain('"80mb"');
		expect(projectPayloadSource).toContain("inflate: false");
		expect(serverSource).toContain('["/students/projects", "/students/project-reviews"]');
		expect(serverSource).toContain("requireStudentContext");
		expect(serverSource).toMatch(
			/["']\/students\/projects["'],\s*limitProjectMutation\(studentProjectWriteLimiter\),\s*limitProjectMutation\(heavyProjectPayloadLimiter\),\s*limitProjectMutation\(projectPayloadConcurrencyGuard\),\s*parseProjectMutation/
		);
		expect(serverSource).toMatch(
			/validAdmin,\s*limitProjectMutation\(teacherProjectWriteLimiter\),\s*limitProjectMutation\(heavyProjectPayloadLimiter\),\s*limitProjectMutation\(projectPayloadConcurrencyGuard\),\s*parseProjectMutation/
		);
		expect(serverSource).toContain("validAdmin,");
		expect(serverSource).toContain('bodyParser.json({ limit: "1mb" })');
		expect(serverSource).not.toContain("bodyParser.urlencoded");
		expect(serverSource).not.toContain("maxAge:");
		expect(studentControllerSource).toContain("delete options.maxAge");
		expect(serverSource).toContain(
			"CROSS_SITE=true is not supported; classroom sessions must stay same-origin."
		);
		expect(serverSource).not.toContain('sameSite = "none"');
	});

	it("rejects a create when either atomic quota cap would be exceeded", async () => {
		modelMocks.studentUpdateOne.mockResolvedValueOnce({ modifiedCount: 0 });

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				files: [{ content: "print('safe')\n", name: "main.py" }],
				importID: "browser-import:over-quota",
				title: "One too many"
			});

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
		});
	});

	it("releases reserved quota when creation fails", async () => {
		modelMocks.pythonProjectCreate.mockRejectedValueOnce(new Error("write failed"));

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				files: [{ content: "print('safe')\n", name: "main.py" }],
				importID: "browser-import:write-failure"
			});

			expect(response.status).toBe(500);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledTimes(2);
			const reserved = modelMocks.studentUpdateOne.mock.calls[0]?.[1].$inc;
			expect(modelMocks.studentUpdateOne.mock.calls[1]?.[1]).toEqual({
				$inc: {
					activeProjectBytes: -reserved.activeProjectBytes,
					activeProjectCount: -1
				}
			});
		});
	});

	it("returns an active import retry without consuming quota twice", async () => {
		const existing = makeProject({ importID: "browser-import:retry" });
		modelMocks.pythonProjectFindOne.mockResolvedValueOnce(existing);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				files: [{ content: "print('retry')\n", name: "main.py" }],
				importID: "browser-import:retry"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.idempotentReplay).toBe(true);
			expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
			expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
		});
	});

	it("rejects reuse of a deleted import ID", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValueOnce(makeProject({
			deletedAt: new Date(),
			importID: "browser-import:deleted"
		}));

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				importID: "browser-import:deleted"
			});

			expect(response.status).toBe(409);
			expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
		});
	});

	it("settles a concurrent duplicate-import race idempotently", async () => {
		const duplicateError = Object.assign(new Error("duplicate"), { code: 11000 });
		const existing = makeProject({ importID: "browser-import:race" });
		modelMocks.pythonProjectFindOne
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(existing);
		modelMocks.pythonProjectCreate.mockRejectedValueOnce(duplicateError);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(baseUrl, "POST", {
				importID: "browser-import:race"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.idempotentReplay).toBe(true);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledTimes(2);
		});
	});

	it("requires the expected server timestamp on updates", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"PUT",
				{ title: "Changed" },
				projectID
			);

			expect(response.status).toBe(400);
			expect(modelMocks.pythonProjectFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("returns 409 without overwriting a stale update", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"PUT",
				{
					expectedUpdatedAt: new Date(updatedAt.getTime() - 1).toISOString(),
					title: "Stale"
				},
				projectID
			);

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("reserves growth and reverts it when an update races", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectFindOneAndUpdate.mockResolvedValueOnce(null);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"PUT",
				{
					expectedUpdatedAt: updatedAt.toISOString(),
					files: [{ content: "print('much longer saved text')\n", name: "main.py" }]
				},
				projectID
			);

			expect(response.status).toBe(409);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledTimes(2);
			const reserved = modelMocks.studentUpdateOne.mock.calls[0]?.[1].$inc;
			expect(reserved.activeProjectCount).toBe(0);
			expect(reserved.activeProjectBytes).toBeGreaterThan(0);
			expect(modelMocks.studentUpdateOne.mock.calls[1]?.[1].$inc).toEqual({
				activeProjectBytes: -reserved.activeProjectBytes,
				activeProjectCount: -0
			});
		});
	});

	it("updates only the expected revision and reports the new byte count", async () => {
		const original = makeProject();
		const replacementFiles = [
			{ content: "print('replacement is longer')\n", name: "main.py", encoding: "text" }
		];
		const replacementByteCount = Buffer.byteLength("main.py")
			+ Buffer.byteLength(replacementFiles[0]?.content ?? "");
		const updated = makeProject({
			byteCount: replacementByteCount,
			files: replacementFiles,
			updatedAt: new Date(updatedAt.getTime() + 1)
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(original);
		modelMocks.pythonProjectFindOneAndUpdate.mockResolvedValue(updated);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"PUT",
				{
					expectedUpdatedAt: updatedAt.toISOString(),
					files: replacementFiles,
					title: "Replacement"
				},
				projectID
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.project.byteCount).toBe(replacementByteCount);
			expect(modelMocks.pythonProjectFindOneAndUpdate).toHaveBeenCalledWith(
				{
					_id: projectID,
					deletedAt: { $exists: false },
					updatedAt,
					user: studentID
				},
				expect.objectContaining({
					$set: expect.objectContaining({
						byteCount: replacementByteCount,
						title: "Replacement",
						updatedAt: expect.any(Date)
					})
				}),
				{
					new: true,
					runValidators: true,
					timestamps: false
				}
			);
		});
	});

	it("requires exactly the expected server timestamp on deletes", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const body of [
				{},
				{ expectedUpdatedAt: "not-a-date" },
				{
					expectedUpdatedAt: updatedAt.toISOString(),
					unexpected: true
				}
			]) {
				const response = await projectJson(
					baseUrl,
					"DELETE",
					body,
					projectID
				);
				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.pythonProjectFindOne).not.toHaveBeenCalled();
		expect(modelMocks.pythonProjectFindOneAndUpdate).not.toHaveBeenCalled();
	});

	it("returns 409 without deleting a stale project revision", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{
					expectedUpdatedAt: new Date(updatedAt.getTime() - 1).toISOString()
				},
				projectID
			);

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectFindOneAndUpdate).not.toHaveBeenCalled();
			expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
		});
	});

	it("returns 409 when a project changes between the delete read and tombstone write", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectFindOneAndUpdate.mockResolvedValue(null);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{ expectedUpdatedAt: updatedAt.toISOString() },
				projectID
			);

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectReviewFindOneAndUpdate).not.toHaveBeenCalled();
			expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
		});
	});

	it("scrubs, releases quota, and hard-deletes the expected project and review", async () => {
		const project = makeProject();
		const review = makeReview();
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);
		modelMocks.pythonProjectFindOneAndUpdate.mockImplementation(
			async (_filter, update) => makeProject({
				deletedAt: update.$set.deletedAt,
				files: update.$set.files,
				updatedAt: update.$set.updatedAt
			})
		);
		modelMocks.pythonProjectReviewFindOneAndUpdate.mockResolvedValue(review);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{ expectedUpdatedAt: updatedAt.toISOString() },
				projectID
			);

			expect(response.status).toBe(204);
			const tombstoneAt =
				modelMocks.pythonProjectFindOneAndUpdate.mock.calls[0]?.[1].$set.deletedAt;
			expect(modelMocks.pythonProjectFindOneAndUpdate).toHaveBeenCalledWith(
				{
					_id: projectID,
					deletedAt: { $exists: false },
					updatedAt,
					user: studentID
				},
				{
					$set: {
						activeFileName: "main.py",
						byteCount: 0,
						deletedAt: tombstoneAt,
						files: [],
						mode: "python",
						title: "Deleted project",
						updatedAt: tombstoneAt
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
			expect(modelMocks.pythonProjectReviewFindOneAndUpdate).toHaveBeenCalledWith(
				{
					deletedAt: { $exists: false },
					sourceProject: projectID,
					user: studentID
				},
				expect.objectContaining({
					$set: expect.objectContaining({
						deletedAt: tombstoneAt,
						files: [],
						note: "",
						visibleToStudent: false
					})
				}),
				{ new: false, timestamps: false }
			);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledWith(
				{
					_id: studentID,
					activeProjectBytes: { $gte: 22 },
					activeProjectCount: { $gte: 1 }
				},
				{
					$inc: {
						activeProjectBytes: -22,
						activeProjectCount: -1
					}
				}
			);
			expect(modelMocks.pythonProjectReviewDeleteOne).toHaveBeenCalledWith({
				deletedAt: tombstoneAt,
				sourceProject: projectID,
				user: studentID
			});
			expect(modelMocks.pythonProjectDeleteOne).toHaveBeenCalledWith({
				_id: projectID,
				deletedAt: tombstoneAt,
				user: studentID
			});
		});
	});

	it("restores project and review content when quota release cannot be applied", async () => {
		const project = makeProject({
			courseID: "python-level-1",
			starterLabel: "Loops"
		});
		const review = makeReview({
			courseID: "python-level-1"
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);
		modelMocks.pythonProjectFindOneAndUpdate.mockImplementation(
			async (_filter, update) => makeProject({
				deletedAt: update.$set.deletedAt,
				files: [],
				updatedAt: update.$set.updatedAt
			})
		);
		modelMocks.pythonProjectReviewFindOneAndUpdate.mockResolvedValue(review);
		modelMocks.studentUpdateOne.mockResolvedValueOnce({ modifiedCount: 0 });

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{ expectedUpdatedAt: updatedAt.toISOString() },
				projectID
			);

			expect(response.status).toBe(500);
			const tombstoneAt =
				modelMocks.pythonProjectFindOneAndUpdate.mock.calls[0]?.[1].$set.deletedAt;
			expect(modelMocks.pythonProjectUpdateOne).toHaveBeenCalledWith(
				{
					_id: projectID,
					deletedAt: tombstoneAt,
					user: studentID
				},
				expect.objectContaining({
					$set: expect.objectContaining({
						byteCount: 22,
						courseID: "python-level-1",
						files: project.files,
						importID: project.importID,
						starterLabel: "Loops",
						updatedAt
					}),
					$unset: expect.objectContaining({ deletedAt: 1 })
				}),
				{ timestamps: false }
			);
			expect(modelMocks.pythonProjectReviewUpdateOne).toHaveBeenCalledWith(
				{
					_id: review._id,
					deletedAt: tombstoneAt,
					sourceProject: projectID,
					user: studentID
				},
				expect.objectContaining({
					$set: expect.objectContaining({
						courseID: "python-level-1",
						files: review.files,
						note: review.note,
						updatedAt
					}),
					$unset: expect.objectContaining({ deletedAt: 1 })
				}),
				{ timestamps: false }
			);
			expect(modelMocks.pythonProjectDeleteOne).not.toHaveBeenCalled();
			expect(modelMocks.pythonProjectReviewDeleteOne).not.toHaveBeenCalled();
		});
	});

	it("restores the project before quota changes when review scrubbing fails", async () => {
		const project = makeProject();
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);
		modelMocks.pythonProjectFindOneAndUpdate.mockImplementation(
			async (_filter, update) => makeProject({
				deletedAt: update.$set.deletedAt,
				files: [],
				updatedAt: update.$set.updatedAt
			})
		);
		modelMocks.pythonProjectReviewFindOneAndUpdate.mockRejectedValueOnce(
			new Error("review write failed")
		);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{ expectedUpdatedAt: updatedAt.toISOString() },
				projectID
			);

			expect(response.status).toBe(500);
			expect(modelMocks.pythonProjectUpdateOne).toHaveBeenCalledTimes(1);
			expect(modelMocks.studentUpdateOne).not.toHaveBeenCalled();
			expect(modelMocks.pythonProjectDeleteOne).not.toHaveBeenCalled();
		});
	});

	it("leaves only scrubbed TTL tombstones when a final hard purge fails", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectFindOneAndUpdate.mockImplementation(
			async (_filter, update) => makeProject({
				deletedAt: update.$set.deletedAt,
				files: [],
				updatedAt: update.$set.updatedAt
			})
		);
		modelMocks.pythonProjectReviewFindOneAndUpdate.mockResolvedValue(makeReview());
		modelMocks.pythonProjectDeleteOne.mockRejectedValueOnce(new Error("purge failed"));
		modelMocks.pythonProjectReviewDeleteOne.mockRejectedValueOnce(
			new Error("review purge failed")
		);

		await withPythonProjectRoute(async baseUrl => {
			const response = await projectJson(
				baseUrl,
				"DELETE",
				{ expectedUpdatedAt: updatedAt.toISOString() },
				projectID
			);

			expect(response.status).toBe(204);
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledTimes(1);
			expect(modelMocks.pythonProjectFindOneAndUpdate.mock.calls[0]?.[1].$set.files)
				.toEqual([]);
			expect(
				modelMocks.pythonProjectReviewFindOneAndUpdate.mock.calls[0]?.[1].$set.files
			).toEqual([]);
		});
	});
});
