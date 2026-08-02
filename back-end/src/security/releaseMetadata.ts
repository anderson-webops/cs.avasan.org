const releaseVersionPattern
	= /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const sourceRevisionPattern = /^(?:[0-9a-f]{40}|unknown)$/;

export const DEFAULT_CS_RELEASE_VERSION = "2.7.106";

export interface ReleaseMetadata {
	revision: string;
	version: string;
}

export function readReleaseMetadata(
	environment: Record<string, string | undefined>,
	defaultVersion = DEFAULT_CS_RELEASE_VERSION
): ReleaseMetadata {
	const version = (
		environment.CS_RELEASE_VERSION?.trim() || defaultVersion
	).replace(/^v/, "");
	const revision = environment.SOURCE_REVISION?.trim() || "unknown";

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
