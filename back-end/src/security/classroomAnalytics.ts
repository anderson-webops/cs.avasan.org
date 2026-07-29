import { Buffer } from "node:buffer";

export const DEFAULT_CLASSROOM_ANALYTICS_RETENTION_DAYS = 90;
export const MIN_CLASSROOM_ANALYTICS_RETENTION_DAYS = 7;
export const MAX_CLASSROOM_ANALYTICS_RETENTION_DAYS = 90;
export const MIN_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES = 32;

export function readClassroomAnalyticsRetentionDays(
	value: string | undefined
): number {
	if (value === undefined || value.trim() === "") {
		return DEFAULT_CLASSROOM_ANALYTICS_RETENTION_DAYS;
	}

	const retentionDays = Number(value);
	if (
		!Number.isSafeInteger(retentionDays)
		|| retentionDays < MIN_CLASSROOM_ANALYTICS_RETENTION_DAYS
		|| retentionDays > MAX_CLASSROOM_ANALYTICS_RETENTION_DAYS
	) {
		throw new Error(
			"CLASSROOM_ANALYTICS_RETENTION_DAYS must be an integer from "
			+ `${MIN_CLASSROOM_ANALYTICS_RETENTION_DAYS} to `
			+ `${MAX_CLASSROOM_ANALYTICS_RETENTION_DAYS}.`
		);
	}

	return retentionDays;
}

export function readClassroomAnalyticsServiceKey(
	value: string | undefined
): string | undefined {
	if (value === undefined || value.trim() === "") return undefined;
	if (
		Buffer.byteLength(value, "utf8")
		< MIN_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES
	) {
		throw new Error(
			"CLASSROOM_ANALYTICS_SERVICE_KEY must be at least "
			+ `${MIN_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES} UTF-8 bytes.`
		);
	}

	return value;
}
