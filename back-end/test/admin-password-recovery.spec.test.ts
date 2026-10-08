import argon2 from "argon2";
import { describe, expect, it, vi } from "vitest";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";
import {
	ADMIN_PASSWORD_RESET_CONFIRMATION,
	requireAdminPasswordRecoveryDatabase,
	requireAdminPasswordResetConfirmation,
	selectAdminPasswordRecoveryConnection
} from "../src/security/adminPasswordRecovery.js";
import type { AdminPasswordRecoveryModel } from "../src/services/adminPasswordRecovery.js";
import { resetJulioAdminPassword } from "../src/services/adminPasswordRecovery.js";

const replacement = "a private replacement passphrase";
const mongoUri =
	"mongodb://classroom@mongo/cs-avasan-org?authSource=cs-avasan-org";

function query<T>(value: T) {
	return { exec: vi.fn().mockResolvedValue(value) };
}

function fixture(overrides: Record<string, unknown> = {}) {
	const admin = {
		_id: ADMIN_SINGLETON_ID,
		name: "Julio",
		email: "julio@example.test",
		role: "admin",
		password: "existing-fixture-hash",
		sessionVersion: 4,
		...overrides
	};
	const countDocuments = vi.fn().mockReturnValue(query(1));
	const findOne = vi.fn().mockReturnValue(query(admin));
	const updateOne = vi.fn().mockReturnValue(
		query({
			acknowledged: true,
			matchedCount: 1,
			modifiedCount: 1
		})
	);
	return { admin, countDocuments, findOne, updateOne };
}

describe("operator-only Admin password recovery configuration", () => {
	it("requires exactly the explicit reset argument and an interactive terminal", () => {
		expect(() =>
			requireAdminPasswordResetConfirmation(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true
			)
		).not.toThrow();
		for (const arguments_ of [
			[],
			["--confirm"],
			[ADMIN_PASSWORD_RESET_CONFIRMATION, replacement]
		]) {
			expect(() =>
				requireAdminPasswordResetConfirmation(arguments_, true)
			).toThrow("without exactly");
		}
		expect(() =>
			requireAdminPasswordResetConfirmation(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				false
			)
		).toThrow("interactive terminal");
	});

	it("does not read Vault before confirmation and terminal checks pass", async () => {
		const readSecret = vi.fn();
		for (const [arguments_, interactive] of [
			[[], true],
			[[ADMIN_PASSWORD_RESET_CONFIRMATION], false]
		] as const) {
			await expect(
				selectAdminPasswordRecoveryConnection(
					arguments_,
					interactive,
					{},
					readSecret
				)
			).rejects.toThrow();
		}
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("uses the fork environment URI when Vault is not configured", async () => {
		const readSecret = vi.fn();
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				{ MONGODB_URI: mongoUri },
				readSecret
			)
		).resolves.toEqual({ source: "environment", uri: mongoUri });
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("uses Vault only at the fork-specific path and never falls back after an error", async () => {
		const environment = {
			MONGODB_URI: "mongodb://fallback-must-not-be-used/other",
			VAULT_ADDR: "https://vault.school.example",
			VAULT_ROLE_ID: "role",
			VAULT_SECRET_ID: "secret",
			VAULT_MONGODB_SECRET_PATH: "secret/data/cs.avasan.org/mongodb"
		};
		const readSecret = vi.fn().mockResolvedValue({ uri: mongoUri });
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				environment,
				readSecret
			)
		).resolves.toEqual({ source: "vault", uri: mongoUri });
		readSecret.mockRejectedValueOnce(new Error("Vault unavailable"));
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				environment,
				readSecret
			)
		).rejects.toThrow("Vault unavailable");
		readSecret.mockClear();
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				{
					...environment,
					VAULT_MONGODB_SECRET_PATH: "secret/data/upstream/mongodb"
				},
				readSecret
			)
		).rejects.toThrow("fork-specific Vault");
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("rejects partial Vault credentials and empty credential configuration", async () => {
		const readSecret = vi.fn();
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				{
					VAULT_ADDR: "https://vault.school.example",
					MONGODB_URI: mongoUri
				},
				readSecret
			)
		).rejects.toThrow("credentials are incomplete");
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				{},
				readSecret
			)
		).rejects.toThrow("MONGODB_URI is required");
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("confines either credential source to the fork database and authSource without leaking the URI", async () => {
		for (const uri of [
			"mongodb://secret-user:secret-password@mongo/classes?authSource=cs-avasan-org",
			"mongodb://secret-user:secret-password@mongo/cs-avasan-org?authSource=admin",
			"mongodb://secret-user:secret-password@mongo/cs-avasan-org?authSource=cs-avasan-org&authSource=admin",
			"mongodb://secret-user:secret-password@mongo/cs-avasan-org",
			"https://secret-user:secret-password@mongo/cs-avasan-org?authSource=cs-avasan-org",
			"malformed-secret-uri"
		]) {
			try {
				await selectAdminPasswordRecoveryConnection(
					[ADMIN_PASSWORD_RESET_CONFIRMATION],
					true,
					{ MONGODB_URI: uri },
					vi.fn()
				);
				throw new Error("expected refusal");
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toContain("fork-specific");
				expect((error as Error).message).not.toContain(uri);
				expect((error as Error).message).not.toContain(
					"secret-password"
				);
			}
		}
		await expect(
			selectAdminPasswordRecoveryConnection(
				[ADMIN_PASSWORD_RESET_CONFIRMATION],
				true,
				{ VAULT_ROLE_ID: "role", VAULT_SECRET_ID: "secret" },
				vi
					.fn()
					.mockResolvedValue({
						uri: "mongodb://upstream@mongo/classes?authSource=classes"
					})
			)
		).rejects.toThrow("fork-specific");
	});

	it("checks the actual connected database before any account access", () => {
		expect(() =>
			requireAdminPasswordRecoveryDatabase("cs-avasan-org")
		).not.toThrow();
		for (const databaseName of [undefined, "classes", "admin", "test"]) {
			expect(() =>
				requireAdminPasswordRecoveryDatabase(databaseName)
			).toThrow("exactly cs-avasan-org");
		}
	});
});

describe("resetting only Julio's existing Admin password", () => {
	it("requires a nonblank valid password and exact confirmation before querying accounts", async () => {
		const model = fixture();
		for (const [password, confirmation] of [
			["short", "short"],
			[" ".repeat(14), " ".repeat(14)],
			[replacement, "different confirmed passphrase"]
		]) {
			await expect(
				resetJulioAdminPassword(
					"julio@example.test",
					password,
					confirmation,
					model
				)
			).rejects.toThrow();
		}
		expect(model.countDocuments).not.toHaveBeenCalled();
		expect(model.updateOne).not.toHaveBeenCalled();
	});

	it("refuses zero or multiple Admins rather than provisioning or choosing one", async () => {
		for (const count of [0, 2]) {
			const model = fixture();
			model.countDocuments.mockReturnValue(query(count));
			await expect(
				resetJulioAdminPassword(
					"julio@example.test",
					replacement,
					replacement,
					model
				)
			).rejects.toThrow("exactly one existing");
			expect(model.findOne).not.toHaveBeenCalled();
			expect(model.updateOne).not.toHaveBeenCalled();
		}
	});

	it("requires the singleton identity, Julio name/Admin role, existing email, and stored hash", async () => {
		for (const overrides of [
			{ _id: "000000000000000000000002" },
			{ name: "Another teacher" },
			{ role: "tutor" },
			{ email: "someone-else@example.test" },
			{ password: "" }
		]) {
			const model = fixture(overrides);
			await expect(
				resetJulioAdminPassword(
					"julio@example.test",
					replacement,
					replacement,
					model
				)
			).rejects.toThrow("must match");
			expect(model.updateOne).not.toHaveBeenCalled();
		}
		const model = fixture();
		model.findOne.mockReturnValue(query(null));
		await expect(
			resetJulioAdminPassword(
				"julio@example.test",
				replacement,
				replacement,
				model
			)
		).rejects.toThrow("must match");
		model.findOne.mockReturnValue(query(model.admin));
		await expect(
			resetJulioAdminPassword("", replacement, replacement, model)
		).rejects.toThrow("must match");
		expect(model.updateOne).not.toHaveBeenCalled();
	});

	it("refuses malformed or unincrementable session versions", async () => {
		for (const sessionVersion of [
			-1,
			1.5,
			Number.NaN,
			Number.MAX_SAFE_INTEGER,
			null
		]) {
			const model = fixture({ sessionVersion });
			await expect(
				resetJulioAdminPassword(
					"julio@example.test",
					replacement,
					replacement,
					model as unknown as AdminPasswordRecoveryModel
				)
			).rejects.toThrow("invalid session version");
			expect(model.updateOne).not.toHaveBeenCalled();
		}
	});

	it("atomically hashes the replacement and revokes every older Admin session without other account changes", async () => {
		const model = fixture();
		await expect(
			resetJulioAdminPassword(
				" JULIO@example.test ",
				replacement,
				replacement,
				model
			)
		).resolves.toBeUndefined();
		expect(model.countDocuments).toHaveBeenCalledWith({});
		expect(model.findOne).toHaveBeenCalledWith({ _id: ADMIN_SINGLETON_ID });
		const [filter, update, options] = model.updateOne.mock.calls[0];
		expect(filter).toEqual({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			role: "admin",
			email: model.admin.email,
			password: model.admin.password,
			sessionVersion: 4
		});
		expect(update).toEqual({
			$set: {
				password: expect.stringMatching(/^\$argon2id\$/),
				passwordChangedAt: expect.any(Date)
			},
			$inc: { sessionVersion: 1 }
		});
		expect(await argon2.verify(update.$set.password, replacement)).toBe(
			true
		);
		expect(options).toEqual({ upsert: false, runValidators: true });
	});

	it("keeps the same safe legacy-zero filter used by Admin authentication", async () => {
		for (const sessionVersion of [0, undefined]) {
			const model = fixture({ sessionVersion });
			await resetJulioAdminPassword(
				"julio@example.test",
				replacement,
				replacement,
				model
			);
			expect(model.updateOne.mock.calls[0][0]).toHaveProperty("$or", [
				{ sessionVersion: 0 },
				{ sessionVersion: { $exists: false } }
			]);
		}
	});

	it("does not report success for concurrent state changes or unacknowledged/unmodified updates", async () => {
		for (const result of [
			{ acknowledged: false, matchedCount: 1, modifiedCount: 1 },
			{ acknowledged: true, matchedCount: 0, modifiedCount: 0 },
			{ acknowledged: true, matchedCount: 1, modifiedCount: 0 }
		]) {
			const model = fixture();
			model.updateOne.mockReturnValue(query(result));
			await expect(
				resetJulioAdminPassword(
					"julio@example.test",
					replacement,
					replacement,
					model
				)
			).rejects.toThrow("was not confirmed");
		}
	});
});
