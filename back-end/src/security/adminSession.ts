import type { CustomSession } from "../types/session/CustomSession.js";

export const ADMIN_ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000;
export const ADMIN_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function adminSessionTimingIsCurrent(
	session: CustomSession,
	now = Date.now()
): boolean {
	return Number.isSafeInteger(session.adminExpiresAt)
		&& (session.adminExpiresAt ?? 0) > now
		&& Number.isSafeInteger(session.adminLastActivityAt)
		&& now - (session.adminLastActivityAt ?? 0)
		< ADMIN_INACTIVITY_TIMEOUT_MS;
}
