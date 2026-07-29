// vaultClient.ts
import { env } from "node:process";

export const DEFAULT_MONGODB_SECRET_PATH = "secret/data/cs.avasan.org/mongodb";

function vaultAddress(): string {
	return (env.VAULT_ADDR || "http://127.0.0.1:8200").replace(/\/+$/, "");
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

async function vaultLogin(): Promise<string> {
	const roleId = env.VAULT_ROLE_ID;
	const secretId = env.VAULT_SECRET_ID;
	if (!roleId || !secretId) {
		throw new Error("Vault AppRole credentials are not configured");
	}

	const response = await fetch(`${vaultAddress()}/v1/auth/approle/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ role_id: roleId, secret_id: secretId })
	});
	if (!response.ok) {
		throw new Error(`Vault login failed with status ${response.status}`);
	}

	const data = await response.json() as {
		auth?: { client_token?: unknown };
	};
	if (typeof data.auth?.client_token !== "string" || !data.auth.client_token) {
		throw new Error("Vault login response did not include a token");
	}
	return data.auth.client_token;
}

export async function readMongoSecret(): Promise<{ uri: string }> {
	const token = await vaultLogin();
	const response = await fetch(`${vaultAddress()}/v1/${mongodbSecretPath()}`, {
		headers: { "X-Vault-Token": token }
	});
	if (!response.ok) {
		throw new Error(`Vault read failed with status ${response.status}`);
	}

	const data = await response.json() as {
		data?: { data?: { uri?: unknown } };
	};
	const uri = data.data?.data?.uri;
	if (typeof uri !== "string" || !uri) {
		throw new Error("Vault MongoDB secret did not include a URI");
	}
	return { uri };
}
