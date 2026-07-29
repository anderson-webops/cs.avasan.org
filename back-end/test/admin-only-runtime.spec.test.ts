import type { Server } from "node:http";
import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Admin } from "../src/models/schemas/Admin.js";
import { mountRuntimeAccountRoutes } from "../src/routes/runtimeAccountRoutes.js";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";

interface TestSession {
	adminID?: string;
	tutorID?: string;
	userID?: string;
}

async function withRuntime<T>(
	session: TestSession,
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use((req, _res, next) => {
		(req as any).session = { ...session };
		next();
	});
	mountRuntimeAccountRoutes(app);

	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function postJson(baseUrl: string, path: string, body: object): Promise<Response> {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
}

describe("Admin-only account runtime", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("does not mount HTTP account creation, account directories, or legacy account services", async () => {
		await withRuntime({}, async (baseUrl) => {
			const attempts = [
				fetch(`${baseUrl}/admins`, { method: "POST" }),
				fetch(`${baseUrl}/admins`),
				fetch(`${baseUrl}/admins/remove/${ADMIN_SINGLETON_ID}`, { method: "DELETE" }),
				fetch(`${baseUrl}/users`, { method: "POST" }),
				fetch(`${baseUrl}/tutors`, { method: "POST" }),
				fetch(`${baseUrl}/admin-mail`, { method: "POST" })
			];
			const responses = await Promise.all(attempts);

			expect(responses.map(response => response.status)).toEqual([
				404,
				404,
				404,
				404,
				404,
				404
			]);
		});
	});

	it("exposes only adminID from the current session", async () => {
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				tutorID: "legacy-tutor",
				userID: "legacy-user"
			},
			async (baseUrl) => {
				const response = await fetch(`${baseUrl}/accounts/me`);

				expect(response.status).toBe(200);
				await expect(response.json()).resolves.toEqual({
					adminID: ADMIN_SINGLETON_ID
				});
			}
		);
	});

	it("requires an authenticated Admin for email and password security changes", async () => {
		await withRuntime({}, async (baseUrl) => {
			const responses = await Promise.all([
				postJson(baseUrl, "/accounts/checkEmail", { email: "julio@example.org" }),
				postJson(baseUrl, `/accounts/changeEmail/${ADMIN_SINGLETON_ID}`, {
					email: "julio@example.org"
				}),
				postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
					currentPassword: "old",
					newPassword: "new"
				})
			]);

			expect(responses.map(response => response.status)).toEqual([403, 403, 403]);
		});
	});

	it("normalizes email and authenticates against the Admin model", async () => {
		const comparePassword = vi.fn().mockResolvedValue(true);
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			name: "Julio",
			email: "julio@example.org",
			comparePassword
		};
		const exec = vi.fn().mockResolvedValue(admin);
		const findOne = vi.spyOn(Admin, "findOne").mockReturnValue({ exec } as any);

		await withRuntime({}, async (baseUrl) => {
			const response = await postJson(baseUrl, "/accounts/login", {
				email: "  JULIO@EXAMPLE.ORG ",
				password: "correct horse battery staple"
			});

			expect(response.status).toBe(200);
			expect(findOne).toHaveBeenCalledWith({
				_id: ADMIN_SINGLETON_ID,
				email: "julio@example.org"
			});
			expect(comparePassword).toHaveBeenCalledWith("correct horse battery staple");
			await expect(response.json()).resolves.toMatchObject({
				currentAdmin: { name: "Julio", email: "julio@example.org" }
			});
		});
	});

	it("throttles repeated teacher login attempts", async () => {
		await withRuntime({}, async (baseUrl) => {
			const responses: Response[] = [];
			for (let attempt = 0; attempt < 11; attempt += 1) {
				responses.push(await postJson(baseUrl, "/accounts/login", {}));
			}

			expect(responses.slice(0, 10).every(response => response.status === 400)).toBe(true);
			expect(responses[10]?.status).toBe(429);
		});
	});

	it("rejects a short replacement teacher password", async () => {
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			comparePassword: vi.fn(),
			save: vi.fn()
		};
		vi.spyOn(Admin, "findById").mockReturnValue(Promise.resolve(admin) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async (baseUrl) => {
			const response = await postJson(
				baseUrl,
				`/accounts/changePassword/${ADMIN_SINGLETON_ID}`,
				{
					currentPassword: "old password",
					newPassword: "too short"
				}
			);

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				message: "New password must be at least 14 characters."
			});
			expect(admin.comparePassword).not.toHaveBeenCalled();
			expect(admin.save).not.toHaveBeenCalled();
		});
	});

	it("saves a valid replacement teacher password", async () => {
		const comparePassword = vi.fn().mockResolvedValue(true);
		const save = vi.fn().mockResolvedValue(undefined);
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			password: "old password hash",
			comparePassword,
			save
		};
		vi.spyOn(Admin, "findById").mockReturnValue(Promise.resolve(admin) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async (baseUrl) => {
			const response = await postJson(
				baseUrl,
				`/accounts/changePassword/${ADMIN_SINGLETON_ID}`,
				{
					currentPassword: "old password",
					newPassword: "a secure classroom passphrase"
				}
			);

			expect(response.status).toBe(200);
			expect(comparePassword).toHaveBeenCalledWith("old password");
			expect(admin.password).toBe("a secure classroom passphrase");
			expect(save).toHaveBeenCalledOnce();
		});
	});

	it("rejects a non-singleton Admin session before querying the database", async () => {
		const findById = vi.spyOn(Admin, "findById");

		await withRuntime({ adminID: "legacy-admin" }, async (baseUrl) => {
			const response = await fetch(`${baseUrl}/admins/loggedin`);

			expect(response.status).toBe(403);
			expect(findById).not.toHaveBeenCalled();
		});
	});

	it("allows only a self profile update", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			name: "Julio",
			email: "julio@example.org",
			save
		};
		vi.spyOn(Admin, "findById").mockReturnValue(Promise.resolve(admin) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async (baseUrl) => {
			const denied = await fetch(`${baseUrl}/admins/another-admin`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Someone Else", role: "owner" })
			});
			expect(denied.status).toBe(403);
			expect(save).not.toHaveBeenCalled();

			const allowed = await fetch(`${baseUrl}/admins/${ADMIN_SINGLETON_ID}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: " Julio ", role: "owner" })
			});
			expect(allowed.status).toBe(200);
			expect(admin.name).toBe("Julio");
			expect((admin as any).role).toBeUndefined();
			expect(save).toHaveBeenCalledOnce();
		});
	});
});
