import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";

const releaseVersionPattern =
	/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const sourceRevisionPattern = /^(?:[0-9a-f]{40}|unknown)$/;

export function releaseMetadata(
	environment = process.env,
	defaultVersion = ""
) {
	const version = (
		environment.CS_RELEASE_VERSION?.trim() || defaultVersion
	).replace(/^v/, "");
	const revision =
		environment.SOURCE_REVISION?.trim() ||
		environment.COMMIT_REF?.trim() ||
		"unknown";

	if (!releaseVersionPattern.test(version)) {
		throw new Error(
			"CS_RELEASE_VERSION must be a semantic version such as 1.0.0."
		);
	}
	if (!sourceRevisionPattern.test(revision)) {
		throw new Error(
			"SOURCE_REVISION must be a full lowercase Git commit SHA."
		);
	}

	return {
		revision,
		version
	};
}

export async function writeReleaseMetadata(
	target = new URL("../dist/release.json", import.meta.url),
	environment = process.env,
	defaultVersion = ""
) {
	const metadata = releaseMetadata(environment, defaultVersion);
	await writeFile(target, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
	return metadata;
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	const rootPackage = JSON.parse(
		readFileSync(new URL("../../package.json", import.meta.url), "utf8")
	);
	await writeReleaseMetadata(undefined, process.env, rootPackage.version);
}
