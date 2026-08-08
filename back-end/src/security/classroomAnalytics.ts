export const MIN_CLASSROOM_ANALYTICS_RETENTION_DAYS = 7;
export const MAX_CLASSROOM_ANALYTICS_RETENTION_DAYS = 90;

export function assertRetainedClassroomAnalyticsHasRetentionPeriod(
	retentionDays: number | null,
	retainedRowsExist: boolean
): void {
	if (retainedRowsExist && retentionDays === null) {
		throw new Error(
			"Anonymous classroom analytics rows remain, but CLASSROOM_ANALYTICS_RETENTION_DAYS is not configured. Refusing to start with retained analytics outside an approved retention policy."
		);
	}
}

export function readClassroomAnalyticsRetentionDays(
	value: string | undefined,
	required = false
): number | null {
	const clean = value?.trim() ?? "";
	if (!clean) {
		if (required) {
			throw new Error(
				"CLASSROOM_ANALYTICS_RETENTION_DAYS is required before classroom analytics can be enabled."
			);
		}
		return null;
	}

	const retentionDays = Number(clean);
	if (
		!/^(?:[7-9]|[1-8]\d|90)$/.test(clean)
		|| !Number.isSafeInteger(retentionDays)
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
