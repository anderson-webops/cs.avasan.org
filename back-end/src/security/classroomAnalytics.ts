export const DEFAULT_CLASSROOM_ANALYTICS_RETENTION_DAYS = 90;
export const MIN_CLASSROOM_ANALYTICS_RETENTION_DAYS = 7;
export const MAX_CLASSROOM_ANALYTICS_RETENTION_DAYS = 90;

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
