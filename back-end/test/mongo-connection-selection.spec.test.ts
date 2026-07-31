import { afterEach, describe, expect, it, vi } from "vitest";
import { selectMongoConnection } from "../src/security/mongoConnection.js";
import { readBoundedVaultJson, readMongoSecret, vaultAddress } from "../src/vaultClient.js";

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

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
		expect(vaultAddress("http://[::1]:8200", "production")).toBe("http://[::1]:8200");
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

describe("Vault response boundary", () => {
	it("rejects oversized and malformed JSON without including response content", async () => {
		await expect(
			readBoundedVaultJson(new Response("sensitive=".concat("x".repeat(1024 * 1024))), "Vault test")
		).rejects.toThrow("response exceeded the safe size limit");
		await expect(readBoundedVaultJson(new Response("{credential:secret}"), "Vault test")).rejects.toThrow(
			"response was not valid JSON"
		);
	});

	it("trims AppRole credentials and the returned URI while refusing redirects", async () => {
		vi.stubEnv("VAULT_ADDR", " https://vault.school.example ");
		vi.stubEnv("VAULT_ROLE_ID", " role-id ");
		vi.stubEnv("VAULT_SECRET_ID", " secret-id ");
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						auth: { client_token: " token-value " }
					}),
					{ status: 200 }
				)
			)
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						data: {
							data: {
								uri: " mongodb://classroom-user@mongo/cs-avasan-org "
							}
						}
					}),
					{ status: 200 }
				)
			);
		vi.stubGlobal("fetch", fetchMock);

		await expect(readMongoSecret()).resolves.toEqual({
			uri: "mongodb://classroom-user@mongo/cs-avasan-org"
		});
		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			"https://vault.school.example/v1/auth/approle/login",
			expect.objectContaining({
				body: JSON.stringify({
					role_id: "role-id",
					secret_id: "secret-id"
				}),
				redirect: "error"
			})
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			expect.any(String),
			expect.objectContaining({
				headers: { "X-Vault-Token": "token-value" },
				redirect: "error"
			})
		);
	});
});
