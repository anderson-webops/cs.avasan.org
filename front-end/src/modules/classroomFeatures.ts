function enabled(value: string | undefined) {
	return value?.trim().toLowerCase() === "true";
}

const MAX_PUBLIC_NOTICE_LENGTH = 2_000;
const MAX_PRIVACY_POLICY_VERSION_LENGTH = 64;
const MIN_STUDENT_RECORD_RETENTION_DAYS = 30;
const MAX_STUDENT_RECORD_RETENTION_DAYS = 365;

function publicNotice(value: string | undefined) {
	const notice = value?.trim() ?? "";
	return notice && notice.length <= MAX_PUBLIC_NOTICE_LENGTH ? notice : "";
}

function privacyPolicyVersion(value: string | undefined) {
	const version = value?.trim() ?? "";
	return version &&
		version.length <= MAX_PRIVACY_POLICY_VERSION_LENGTH &&
		/^[a-z\d][\w.-]*$/i.test(version)
		? version
		: "";
}

function privacyPolicyEffectiveDate(value: string | undefined) {
	const effectiveDate = value?.trim() ?? "";
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(effectiveDate);
	if (!match) return "";
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const daysInMonth = [
		31,
		leapYear ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	return year !== 0 &&
		month >= 1 &&
		month <= 12 &&
		day >= 1 &&
		day <= (daysInMonth[month - 1] ?? 0)
		? effectiveDate
		: "";
}

function currentCaliforniaDate(now = new Date()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "2-digit",
		timeZone: "America/Los_Angeles",
		year: "numeric"
	}).formatToParts(now);
	const value = (type: "day" | "month" | "year") =>
		parts.find(part => part.type === type)?.value ?? "";
	return `${value("year")}-${value("month")}-${value("day")}`;
}

export function schoolPrivacyContact() {
	return (import.meta.env.VITE_SCHOOL_PRIVACY_CONTACT ?? "").trim();
}

export function classroomPrivacyOperatorNotice() {
	return publicNotice(import.meta.env.VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE);
}

export function classroomPrivacyPolicyVersion() {
	return privacyPolicyVersion(
		import.meta.env.VITE_CLASSROOM_PRIVACY_POLICY_VERSION
	);
}

export function classroomPrivacyPolicyEffectiveDate() {
	return privacyPolicyEffectiveDate(
		import.meta.env.VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE
	);
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
	const effectiveDate = classroomPrivacyPolicyEffectiveDate();
	return Boolean(
		schoolPrivacyContact() &&
		classroomPrivacyOperatorNotice() &&
		classroomServiceProviderNotice() &&
		classroomPrivacyPolicyVersion() &&
		effectiveDate &&
		effectiveDate <= currentCaliforniaDate()
	);
}

/**
 * Frontend features fail closed independently from the API. Production must
 * set approval, the reviewed public notices and policy metadata, and each
 * desired feature flag in both the frontend build and backend runtime.
 * Accounts additionally require the school-selected bounded retention period.
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
 * Julio's private Admin page must remain able to service preservation, access,
 * correction, export, and deletion requests for retained records after public
 * student accounts are disabled. A valid retention period is the explicit
 * signal that this maintenance-only surface is still required.
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
