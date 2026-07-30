import { readBooleanSetting } from "./environment.js";

const MAX_PRIVACY_CONTACT_LENGTH = 500;
const MAX_PUBLIC_NOTICE_LENGTH = 2_000;
export const MIN_STUDENT_RECORD_RETENTION_DAYS = 30;
export const MAX_STUDENT_RECORD_RETENTION_DAYS = 365;

export interface ClassroomPrivacySettings {
	analyticsCollectionEnabled: boolean;
	operatorNotice: string | null;
	schoolPrivacyContact: string | null;
	serviceProviderNotice: string | null;
	studentAccountsEnabled: boolean;
	studentOAuthEnabled: boolean;
	studentRecordRetentionDays: number | null;
}

export interface ClassroomPrivacyEnvironment {
	CLASSROOM_ANALYTICS_COLLECTION_ENABLED?: string;
	CLASSROOM_PRIVACY_OPERATOR_NOTICE?: string;
	CLASSROOM_PRIVACY_APPROVED?: string;
	CLASSROOM_SERVICE_PROVIDER_NOTICE?: string;
	SCHOOL_PRIVACY_CONTACT?: string;
	STUDENT_ACCOUNTS_ENABLED?: string;
	STUDENT_OAUTH_ENABLED?: string;
	STUDENT_RECORD_RETENTION_DAYS?: string;
}

function privacyContact(value: string | undefined): string | null {
	const contact = value?.trim() ?? "";
	if (!contact) return null;
	if (contact.length > MAX_PRIVACY_CONTACT_LENGTH) {
		throw new Error(
			`SCHOOL_PRIVACY_CONTACT must be ${MAX_PRIVACY_CONTACT_LENGTH} characters or fewer.`
		);
	}
	return contact;
}

function publicNotice(
	value: string | undefined,
	name: "CLASSROOM_PRIVACY_OPERATOR_NOTICE" | "CLASSROOM_SERVICE_PROVIDER_NOTICE"
): string | null {
	const notice = value?.trim() ?? "";
	if (!notice) return null;
	if (notice.length > MAX_PUBLIC_NOTICE_LENGTH) {
		throw new Error(
			`${name} must be ${MAX_PUBLIC_NOTICE_LENGTH} characters or fewer.`
		);
	}
	return notice;
}

function studentRecordRetentionDays(
	value: string | undefined,
	required: boolean
): number | null {
	const clean = value?.trim() ?? "";
	if (!clean) {
		if (required) {
			throw new Error(
				"STUDENT_RECORD_RETENTION_DAYS is required before student accounts can be enabled."
			);
		}
		return null;
	}
	if (!/^\d{2,3}$/.test(clean)) {
		throw new Error(
			`STUDENT_RECORD_RETENTION_DAYS must be an integer from ${MIN_STUDENT_RECORD_RETENTION_DAYS} to ${MAX_STUDENT_RECORD_RETENTION_DAYS}.`
		);
	}
	const days = Number(clean);
	if (
		!Number.isSafeInteger(days)
		|| days < MIN_STUDENT_RECORD_RETENTION_DAYS
		|| days > MAX_STUDENT_RECORD_RETENTION_DAYS
	) {
		throw new Error(
			`STUDENT_RECORD_RETENTION_DAYS must be an integer from ${MIN_STUDENT_RECORD_RETENTION_DAYS} to ${MAX_STUDENT_RECORD_RETENTION_DAYS}.`
		);
	}
	return days;
}

/**
 * Resolve the three optional student-data features as a single fail-closed
 * rollout decision. A bare feature flag is insufficient: the school/district
 * approval flag, direct privacy contact, reviewed operator/provider notices,
 * and, for accounts, an explicit bounded retention period must also be present.
 */
export function readClassroomPrivacySettings(
	environment: ClassroomPrivacyEnvironment
): ClassroomPrivacySettings {
	const privacyApproved = readBooleanSetting(
		environment.CLASSROOM_PRIVACY_APPROVED,
		"CLASSROOM_PRIVACY_APPROVED"
	);
	const studentAccountsRequested = readBooleanSetting(
		environment.STUDENT_ACCOUNTS_ENABLED,
		"STUDENT_ACCOUNTS_ENABLED"
	);
	const studentOAuthRequested = readBooleanSetting(
		environment.STUDENT_OAUTH_ENABLED,
		"STUDENT_OAUTH_ENABLED"
	);
	const analyticsCollectionRequested = readBooleanSetting(
		environment.CLASSROOM_ANALYTICS_COLLECTION_ENABLED,
		"CLASSROOM_ANALYTICS_COLLECTION_ENABLED"
	);
	const schoolPrivacyContact = privacyContact(
		environment.SCHOOL_PRIVACY_CONTACT
	);
	const operatorNotice = publicNotice(
		environment.CLASSROOM_PRIVACY_OPERATOR_NOTICE,
		"CLASSROOM_PRIVACY_OPERATOR_NOTICE"
	);
	const serviceProviderNotice = publicNotice(
		environment.CLASSROOM_SERVICE_PROVIDER_NOTICE,
		"CLASSROOM_SERVICE_PROVIDER_NOTICE"
	);
	const anyStudentDataFeatureRequested = studentAccountsRequested
		|| studentOAuthRequested
		|| analyticsCollectionRequested;

	if (studentOAuthRequested && !studentAccountsRequested) {
		throw new Error(
			"STUDENT_OAUTH_ENABLED requires STUDENT_ACCOUNTS_ENABLED=true."
		);
	}
	if (anyStudentDataFeatureRequested && !privacyApproved) {
		throw new Error(
			"CLASSROOM_PRIVACY_APPROVED must be true before student accounts, OAuth, or classroom analytics can be enabled."
		);
	}
	if (anyStudentDataFeatureRequested && !schoolPrivacyContact) {
		throw new Error(
			"SCHOOL_PRIVACY_CONTACT is required before student accounts, OAuth, or classroom analytics can be enabled."
		);
	}
	if (anyStudentDataFeatureRequested && !operatorNotice) {
		throw new Error(
			"CLASSROOM_PRIVACY_OPERATOR_NOTICE is required before student accounts, OAuth, or classroom analytics can be enabled."
		);
	}
	if (anyStudentDataFeatureRequested && !serviceProviderNotice) {
		throw new Error(
			"CLASSROOM_SERVICE_PROVIDER_NOTICE is required before student accounts, OAuth, or classroom analytics can be enabled."
		);
	}
	const recordRetentionDays = studentRecordRetentionDays(
		environment.STUDENT_RECORD_RETENTION_DAYS,
		studentAccountsRequested
	);

	return {
		analyticsCollectionEnabled:
			privacyApproved && analyticsCollectionRequested,
		operatorNotice,
		schoolPrivacyContact,
		serviceProviderNotice,
		studentAccountsEnabled:
			privacyApproved && studentAccountsRequested,
		studentOAuthEnabled:
			privacyApproved
			&& studentAccountsRequested
			&& studentOAuthRequested,
		studentRecordRetentionDays: recordRetentionDays
	};
}
