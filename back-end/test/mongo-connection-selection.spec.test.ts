import { describe, expect, it, vi } from "vitest";
import { selectMongoConnection } from "../src/security/mongoConnection.js";
import { vaultAddress } from "../src/vaultClient.js";

describe("Mongo credential source selection", () => {
	it("uses the dedicated environment URI when Vault is not requested", async () => {
		const readSecret = vi.fn();
		await expect(
			selectMongoConnection({ MONGODB_URI: "mongodb://application-user@mongo/classroom" }, readSecret)
		).resolves.toEqual({
			source: "environment",
			uri: "mongodb://application-user@mongo/classroom"
		});
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("fails closed instead of falling back after an explicit Vault error", async () => {
		const readSecret = vi.fn().mockRejectedValue(new Error("Vault unavailable"));
		await expect(
			selectMongoConnection(
				{
					MONGODB_URI: "mongodb://fallback-must-not-be-used",
					VAULT_ADDR: "https://vault.school.example",
					VAULT_ROLE_ID: "role",
					VAULT_SECRET_ID: "secret"
				},
				readSecret
			)
		).rejects.toThrow("Vault unavailable");
		expect(readSecret).toHaveBeenCalledTimes(1);
	});

	it("rejects a partial Vault setup before any network request", async () => {
		const readSecret = vi.fn();
		await expect(
			selectMongoConnection(
				{
					MONGODB_URI: "mongodb://fallback-must-not-be-used",
					VAULT_ADDR: "https://vault.school.example"
				},
				readSecret
			)
		).rejects.toThrow("AppRole credentials are incomplete");
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("reports Vault only when the Vault read actually supplied the URI", async () => {
		await expect(
			selectMongoConnection(
				{
					VAULT_ADDR: "https://vault.school.example",
					VAULT_ROLE_ID: "role",
					VAULT_SECRET_ID: "secret"
				},
				vi.fn().mockResolvedValue({
					uri: "mongodb://vault-application-user@mongo/classroom"
				})
			)
		).resolves.toEqual({
			source: "vault",
			uri: "mongodb://vault-application-user@mongo/classroom"
		});
	});
});

describe("Vault transport boundary", () => {
	it("requires HTTPS for a remote production Vault", () => {
		expect(() => vaultAddress("http://vault.school.example:8200", "production")).toThrow("must use HTTPS");
		expect(vaultAddress("https://vault.school.example:8200", "production")).toBe(
			"https://vault.school.example:8200"
		);
	});

	it("allows plaintext only for an explicit loopback Vault", () => {
		expect(vaultAddress("http://127.0.0.1:8200", "production")).toBe("http://127.0.0.1:8200");
		expect(vaultAddress("http://localhost:8200", "production")).toBe("http://localhost:8200");
	});

	it("rejects credentials, paths, query strings, and fragments", () => {
		for (const value of [
			"https://user:pass@vault.example",
			"https://vault.example/v1",
			"https://vault.example?token=x",
			"https://vault.example/#token"
		]) {
			expect(() => vaultAddress(value, "production")).toThrow("only an HTTP(S) origin");
		}
	});
});
