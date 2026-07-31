// vaultClient.ts
import { env } from "node:process";

export const DEFAULT_MONGODB_SECRET_PATH = "secret/data/cs.avasan.org/mongodb";
const VAULT_REQUEST_TIMEOUT_MS = 10_000;
const MAX_VAULT_RESPONSE_BYTES = 1024 * 1024;
const LOOPBACK_VAULT_HOSTS = new Set(["127.0.0.1", "[::1]", "localhost"]);

export function vaultAddress(value = env.VAULT_ADDR, nodeEnvironment = env.NODE_ENV): string {
	const configured = value?.trim() || "http://127.0.0.1:8200";
	let parsed: URL;
	try {
		parsed = new URL(configured);
	}
	catch {
		throw new Error("VAULT_ADDR must be a valid HTTP(S) origin");
	}
	if (
		!["http:", "https:"].includes(parsed.protocol)
		|| parsed.username
		|| parsed.password
		|| (parsed.pathname !== "/" && parsed.pathname !== "")
		|| parsed.search
		|| parsed.hash
	) {
		throw new Error("VAULT_ADDR must contain only an HTTP(S) origin");
	}
	if (
		nodeEnvironment === "production"
		&& parsed.protocol !== "https:"
		&& !LOOPBACK_VAULT_HOSTS.has(parsed.hostname)
	) {
		throw new Error("Production VAULT_ADDR must use HTTPS unless it is loopback");
	}
	return parsed.origin;
}

export function mongodbSecretPath(): string {
	const configured = env.VAULT_MONGODB_SECRET_PATH?.trim() || DEFAULT_MONGODB_SECRET_PATH;
	const normalized = configured.replace(/^\/+/, "").replace(/^v1\//, "").replace(/\/+$/, "");
	const segments = normalized.split("/");

	if (
		!normalized
		|| !/^[\w./-]+$/.test(normalized)
		|| segments.some(segment => !segment || segment === "." || segment === "..")
	) {
		throw new Error("VAULT_MONGODB_SECRET_PATH is invalid");
	}

	return normalized;
}

export async function readBoundedVaultJson(response: Response, responseName: string): Promise<unknown> {
	if (!response.body) {
		throw new Error(`${responseName} response did not include a body.`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let responseBytes = 0;
	let responseText = "";
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			responseBytes += value.byteLength;
			if (responseBytes > MAX_VAULT_RESPONSE_BYTES) {
				await reader.cancel();
				throw new Error(`${responseName} response exceeded the safe size limit.`);
			}
			responseText += decoder.decode(value, { stream: true });
		}
		responseText += decoder.decode();
	}
	catch (error) {
		if (error instanceof Error && error.message === `${responseName} response exceeded the safe size limit.`) {
			throw error;
		}
		throw new Error(`${responseName} response could not be read.`);
	}

	try {
		return JSON.parse(responseText) as unknown;
	}
	catch {
		throw new Error(`${responseName} response was not valid JSON.`);
	}
}

async function vaultLogin(): Promise<string> {
	const roleId = env.VAULT_ROLE_ID?.trim();
	const secretId = env.VAULT_SECRET_ID?.trim();
	if (!roleId || !secretId) {
		throw new Error("Vault AppRole credentials are not configured");
	}

	const response = await fetch(`${vaultAddress()}/v1/auth/approle/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ role_id: roleId, secret_id: secretId }),
		redirect: "error",
		signal: AbortSignal.timeout(VAULT_REQUEST_TIMEOUT_MS)
	});
	if (!response.ok) {
		throw new Error(`Vault login failed with status ${response.status}`);
	}

	const data = (await readBoundedVaultJson(response, "Vault login")) as {
		auth?: { client_token?: unknown };
	};
	if (typeof data.auth?.client_token !== "string" || !data.auth.client_token.trim()) {
		throw new Error("Vault login response did not include a token");
	}
	return data.auth.client_token.trim();
}

export async function readMongoSecret(): Promise<{ uri: string }> {
	const token = await vaultLogin();
	const response = await fetch(`${vaultAddress()}/v1/${mongodbSecretPath()}`, {
		headers: { "X-Vault-Token": token },
		redirect: "error",
		signal: AbortSignal.timeout(VAULT_REQUEST_TIMEOUT_MS)
	});
	if (!response.ok) {
		throw new Error(`Vault read failed with status ${response.status}`);
	}

	const data = (await readBoundedVaultJson(response, "Vault secret")) as {
		data?: { data?: { uri?: unknown } };
	};
	const uri = data.data?.data?.uri;
	if (typeof uri !== "string" || !uri.trim()) {
		throw new Error("Vault MongoDB secret did not include a URI");
	}
	return { uri: uri.trim() };
}
