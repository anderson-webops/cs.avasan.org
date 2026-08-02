import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const releaseRoot = resolve(process.argv[2] || ".");
const manifest = JSON.parse(
	readFileSync(resolve(releaseRoot, "native-release.json"), "utf8")
);
const publicRelease = JSON.parse(
	readFileSync(resolve(releaseRoot, "public/release.json"), "utf8")
);

function fail(message) {
	throw new Error(`Native release preflight failed: ${message}`);
}

if (
	manifest.version !== process.env.CS_RELEASE_VERSION
	|| manifest.revision !== process.env.SOURCE_REVISION
	|| publicRelease.version !== manifest.version
	|| publicRelease.revision !== manifest.revision
) {
	fail("release identity is inconsistent");
}

for (const [name, builtValue] of Object.entries(manifest.buildConfig ?? {})) {
	if ((process.env[name]?.trim() ?? "") !== builtValue) {
		fail(`the canonical ${name} setting changed without a frontend rebuild`);
	}
}

const vaultRequested = ["VAULT_ADDR", "VAULT_ROLE_ID", "VAULT_SECRET_ID"]
	.some(name => Boolean(process.env[name]?.trim()));
if (vaultRequested) {
	if (!process.env.VAULT_ROLE_ID?.trim() || !process.env.VAULT_SECRET_ID?.trim()) {
		fail("Vault AppRole credentials are incomplete");
	}
	if (
		(process.env.VAULT_MONGODB_SECRET_PATH?.trim() || "secret/data/cs.avasan.org/mongodb")
		!== "secret/data/cs.avasan.org/mongodb"
	) {
		fail("Vault must use the fork-specific MongoDB secret path");
	}
}
else {
	const uri = process.env.MONGODB_URI?.trim();
	if (!uri) fail("MONGODB_URI is missing and Vault is not configured");
	let parsed;
	try {
		parsed = new URL(uri);
	}
	catch {
		fail("MONGODB_URI is invalid");
	}
	if (
		!parsed
		|| !["mongodb:", "mongodb+srv:"].includes(parsed.protocol)
		|| parsed.pathname !== "/cs-avasan-org"
		|| parsed.searchParams.get("authSource") !== "cs-avasan-org"
	) {
		fail("MongoDB must use the fork-specific cs-avasan-org database and authSource");
	}
}
