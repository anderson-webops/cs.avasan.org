function enabled(value: string | undefined) {
	return value?.trim().toLowerCase() === "true";
}

const MAX_PUBLIC_NOTICE_LENGTH = 2_000;
const MIN_STUDENT_RECORD_RETENTION_DAYS = 30;
const MAX_STUDENT_RECORD_RETENTION_DAYS = 365;

function publicNotice(value: string | undefined) {
	const notice = value?.trim() ?? "";
	return notice && notice.length <= MAX_PUBLIC_NOTICE_LENGTH ? notice : "";
}

export function schoolPrivacyContact() {
	return (import.meta.env.VITE_SCHOOL_PRIVACY_CONTACT ?? "").trim();
}

export function classroomPrivacyOperatorNotice() {
	return publicNotice(import.meta.env.VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE);
}

export function classroomServiceProviderNotice() {
	return publicNotice(import.meta.env.VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE);
}

export function studentRecordRetentionDays() {
	const value = (
		import.meta.env.VITE_STUDENT_RECORD_RETENTION_DAYS ?? ""
	).trim();
	if (!/^\d{2,3}$/.test(value)) return null;
	const days = Number(value);
	return Number.isSafeInteger(days) &&
		days >= MIN_STUDENT_RECORD_RETENTION_DAYS &&
		days <= MAX_STUDENT_RECORD_RETENTION_DAYS
		? days
		: null;
}

function privacyIsApproved() {
	return enabled(import.meta.env.VITE_CLASSROOM_PRIVACY_APPROVED);
}

function publicNoticeIsComplete() {
	return Boolean(
		schoolPrivacyContact() &&
		classroomPrivacyOperatorNotice() &&
		classroomServiceProviderNotice()
	);
}

/**
 * Frontend features fail closed independently from the API. Production must
 * set approval, the reviewed public notices, and each desired feature flag in
 * both the frontend build and backend runtime. Accounts additionally require
 * the school-selected bounded retention period.
 */
export function studentAccountsAreEnabled() {
	return (
		privacyIsApproved() &&
		publicNoticeIsComplete() &&
		studentRecordRetentionDays() !== null &&
		enabled(import.meta.env.VITE_STUDENT_ACCOUNTS_ENABLED)
	);
}

/**
 * Julio's private Admin page must remain able to service access, correction,
 * export, and deletion requests for retained records after public student
 * accounts are disabled. A valid retention period is the explicit signal that
 * this maintenance-only surface is still required.
 */
export function studentRecordMaintenanceIsEnabled() {
	return studentRecordRetentionDays() !== null;
}

export function studentOAuthIsEnabled() {
	return (
		studentAccountsAreEnabled() &&
		enabled(import.meta.env.VITE_STUDENT_OAUTH_ENABLED)
	);
}

export function classroomUsageIsEnabled() {
	return (
		privacyIsApproved() &&
		publicNoticeIsComplete() &&
		enabled(import.meta.env.VITE_CLASSROOM_USAGE_ENABLED)
	);
}
