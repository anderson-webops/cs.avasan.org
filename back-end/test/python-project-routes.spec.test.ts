import type { Server } from "node:http";
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
	app.use(express.json());
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
