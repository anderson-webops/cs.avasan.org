import type { Request } from "express";

const DAY_MS = 24 * 60 * 60 * 1000;

export function studentRecordRetentionExpiry(retentionDays: number, from = new Date()): Date {
	if (!Number.isSafeInteger(retentionDays) || retentionDays <= 0) {
		throw new Error("A positive student record retention period is required.");
	}
	return new Date(from.getTime() + retentionDays * DAY_MS);
}

export function studentRecordRetentionDaysForRequest(req: Request): number {
	const value = req.app.locals.studentRecordRetentionDays as unknown;
	if (!Number.isSafeInteger(value) || (value as number) <= 0) {
		throw new Error("Student record retention is not configured for this runtime.");
	}
	return value as number;
}

export function studentRecordRetentionFieldsForRequest(
	req: Request,
	from = new Date()
): { retentionExpiresAt: Date; retentionPolicyDays: number } {
	const retentionPolicyDays = studentRecordRetentionDaysForRequest(req);
	return {
		retentionExpiresAt: studentRecordRetentionExpiry(retentionPolicyDays, from),
		retentionPolicyDays
	};
}
