import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPythonProject } from "../src/controllers/users/pythonProjectController.js";

const modelMocks = vi.hoisted(() => ({
	pythonProjectCreate: vi.fn()
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		create: modelMocks.pythonProjectCreate
	}
}));

const userID = new Types.ObjectId();

async function withPythonProjectRoute<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
	app.use((req: any, _res, next) => {
		req.currentUser = {
			_id: userID
		};
		next();
	});
	app.post("/users/loggedin/python-projects", createPythonProject);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
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

async function postJson(baseUrl: string, body: unknown) {
	return fetch(`${baseUrl}/users/loggedin/python-projects`, {
		body: JSON.stringify(body),
		headers: {
			"content-type": "application/json"
		},
		method: "POST"
	});
}

describe("Python project routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.pythonProjectCreate.mockImplementation(async project => ({
			_id: new Types.ObjectId(),
			createdAt: new Date("2026-06-18T12:00:00.000Z"),
			updatedAt: new Date("2026-06-18T12:00:00.000Z"),
			...project
		}));
	});

	it("accepts nested Python package files for signed-in IDE projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				activeFileName: "package/util.py",
				files: [
					{
						content: "",
						name: "package/__init__.py"
					},
					{
						content: "def run():\n\treturn 1\n",
						name: "package/util.py"
					}
				],
				mode: "python",
				title: "Package demo"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "package/util.py",
					files: [
						{
							content: "",
							encoding: "text",
							name: "package/__init__.py"
						},
						{
							content: "def run():\n\treturn 1\n",
							encoding: "text",
							name: "package/util.py"
						}
					],
					user: userID
				})
			);
			expect(body.project.files.map((file: { name: string }) => file.name)).toEqual([
				"package/__init__.py",
				"package/util.py"
			]);
		});
	});

	it("accepts the editor's 40-file project limit", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const files = Array.from({ length: 40 }, (_value, index) => ({
				content: `print(${index})\n`,
				name: index === 0 ? "main.py" : `helper_${index}.py`
			}));
			const response = await postJson(baseUrl, {
				files,
				mode: "python",
				title: "Forty file project"
			});

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					files: expect.arrayContaining([expect.objectContaining({ name: "helper_39.py" })])
				})
			);
		});
	});

	it("rejects projects above the editor's 40-file project limit", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const files = Array.from({ length: 41 }, (_value, index) => ({
				content: `print(${index})\n`,
				name: index === 0 ? "main.py" : `helper_${index}.py`
			}));
			const response = await postJson(baseUrl, {
				files,
				mode: "python",
				title: "Too many files"
			});

			expect(response.status).toBe(400);
		});
	});

	it("accepts a base64 asset at the editor's 2 MB binary import limit", async () => {
		const twoMegabyteBase64 = "A".repeat(Math.ceil((2 * 1024 * 1024) / 3) * 4);

		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				files: [
					{
						content: "print('asset project')\n",
						name: "main.py"
					},
					{
						content: twoMegabyteBase64,
						encoding: "base64",
						name: "images/player.png"
					}
				],
				mode: "pgzero",
				title: "Large asset project"
			});

			expect(response.status).toBe(201);
			const createdProject = modelMocks.pythonProjectCreate.mock.calls.at(-1)?.[0];
			const assetFile = createdProject.files.find((file: { name: string }) => file.name === "images/player.png");
			expect(assetFile.encoding).toBe("base64");
			expect(assetFile.content).toHaveLength(twoMegabyteBase64.length);
		});
	});

	it("keeps a larger JSON parser limit scoped to Python IDE project routes", () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");

		expect(serverSource).toContain("PYTHON_IDE_PROJECT_BODY_LIMIT");
		expect(serverSource).toContain('"/users/loggedin/python-projects"');
		expect(serverSource).toContain("bodyParser.json({ limit: pythonProjectJsonBodyLimit })");
		expect(serverSource).toContain('bodyParser.json({ limit: "1mb" })');
	});

	it("rejects files that collide with browser runtime shim modules", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const reservedFileName of [
				"turtle.py",
				"pygame.py",
				"pgzrun.py",
				"keras.py",
				"keras/layers.py",
				"pgzero/builtins.py",
				"tensorflow/keras/__init__.py"
			]) {
				const response = await postJson(baseUrl, {
					files: [
						{
							content: "print('ok')\n",
							name: "main.py"
						},
						{
							content: "print('reserved')\n",
							name: reservedFileName
						}
					],
					mode: "python",
					title: "Reserved collision"
				});

				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});
});
