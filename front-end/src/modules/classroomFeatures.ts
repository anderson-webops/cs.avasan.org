function enabled(value: string | undefined) {
	return value?.trim().toLowerCase() === "true";
}

export function schoolPrivacyContact() {
	return (import.meta.env.VITE_SCHOOL_PRIVACY_CONTACT ?? "").trim();
}

function privacyIsApproved() {
	return enabled(import.meta.env.VITE_CLASSROOM_PRIVACY_APPROVED);
}

/**
 * Frontend features fail closed independently from the API. Production must
 * set approval, a direct privacy contact, and each desired feature flag in
 * both the frontend build and backend runtime.
 */
export function studentAccountsAreEnabled() {
	return (
		privacyIsApproved() &&
		!!schoolPrivacyContact() &&
		enabled(import.meta.env.VITE_STUDENT_ACCOUNTS_ENABLED)
	);
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
		!!schoolPrivacyContact() &&
		enabled(import.meta.env.VITE_CLASSROOM_USAGE_ENABLED)
	);
}
