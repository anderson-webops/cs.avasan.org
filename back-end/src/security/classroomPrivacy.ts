import { readBooleanSetting } from "./environment.js";

const MAX_PRIVACY_CONTACT_LENGTH = 500;

export interface ClassroomPrivacySettings {
	analyticsCollectionEnabled: boolean;
	schoolPrivacyContact: string | null;
	studentAccountsEnabled: boolean;
	studentOAuthEnabled: boolean;
}

export interface ClassroomPrivacyEnvironment {
	CLASSROOM_ANALYTICS_COLLECTION_ENABLED?: string;
	CLASSROOM_PRIVACY_APPROVED?: string;
	SCHOOL_PRIVACY_CONTACT?: string;
	STUDENT_ACCOUNTS_ENABLED?: string;
	STUDENT_OAUTH_ENABLED?: string;
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

/**
 * Resolve the three optional student-data features as a single fail-closed
 * rollout decision. A bare feature flag is insufficient: the school/district
 * approval flag and direct privacy contact must also be present.
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

	return {
		analyticsCollectionEnabled:
			privacyApproved && analyticsCollectionRequested,
		schoolPrivacyContact,
		studentAccountsEnabled:
			privacyApproved && studentAccountsRequested,
		studentOAuthEnabled:
			privacyApproved
			&& studentAccountsRequested
			&& studentOAuthRequested
	};
}
