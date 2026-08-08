import { describe, expect, it } from "vitest";
import {
	classroomPrivacyPolicyEffectiveDate,
	classroomPrivacyPolicyVersion,
	readClassroomPrivacySettings
} from "../src/security/classroomPrivacy.js";

const approvedPublicPolicy = {
	CLASSROOM_PRIVACY_APPROVED: "true",
	CLASSROOM_PRIVACY_OPERATOR_NOTICE:
		"Operator, address, phone, and email.",
	CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE: "2026-08-02",
	CLASSROOM_PRIVACY_POLICY_VERSION: "2026-08-02.1",
	CLASSROOM_SERVICE_PROVIDER_NOTICE:
		"Approved hosting provider stores classroom records.",
	SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100"
};

describe("classroom privacy rollout configuration", () => {
	it("fails closed when no optional student-data features are configured", () => {
		expect(readClassroomPrivacySettings({})).toEqual({
			analyticsCollectionEnabled: false,
			analyticsRetentionDays: null,
			operatorNotice: null,
			privacyPolicyEffectiveDate: null,
			privacyPolicyVersion: null,
			schoolPrivacyContact: null,
			serviceProviderNotice: null,
			studentAccountsEnabled: false,
			studentOAuthEnabled: false,
			studentRecordRetentionDays: null
		});
	});

	it.each([
		["student accounts", { STUDENT_ACCOUNTS_ENABLED: "true" }],
		[
			"classroom analytics",
			{ CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true" }
		]
	])("requires explicit approval before enabling %s", (_label, settings) => {
		expect(() =>
			readClassroomPrivacySettings({
				SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
				...settings
			})
		).toThrow(/CLASSROOM_PRIVACY_APPROVED/);
	});

	it("requires a direct contact after approval", () => {
		expect(() =>
			readClassroomPrivacySettings({
				CLASSROOM_PRIVACY_APPROVED: "true",
				STUDENT_ACCOUNTS_ENABLED: "true"
			})
		).toThrow(/SCHOOL_PRIVACY_CONTACT/);
	});

	it("does not allow OAuth without the account feature", () => {
		expect(() =>
			readClassroomPrivacySettings({
				CLASSROOM_PRIVACY_APPROVED: "true",
				SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
				STUDENT_OAUTH_ENABLED: "true"
			})
		).toThrow(/STUDENT_ACCOUNTS_ENABLED/);
	});

	it.each([
		[
			"operator notice",
			{
				CLASSROOM_SERVICE_PROVIDER_NOTICE:
					"Approved hosting provider stores classroom records."
			},
			/CLASSROOM_PRIVACY_OPERATOR_NOTICE/
		],
		[
			"service-provider notice",
			{
				CLASSROOM_PRIVACY_OPERATOR_NOTICE:
					"Operator, address, phone, and email."
			},
			/CLASSROOM_SERVICE_PROVIDER_NOTICE/
		]
	])("requires a reviewed public %s", (_label, extra, expected) => {
		expect(() =>
			readClassroomPrivacySettings({
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
				CLASSROOM_PRIVACY_APPROVED: "true",
				SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
				...extra
			})
		).toThrow(expected);
	});

	it.each([
		[
			"version",
			{ CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE: "2026-08-02" },
			/CLASSROOM_PRIVACY_POLICY_VERSION/
		],
		[
			"effective date",
			{ CLASSROOM_PRIVACY_POLICY_VERSION: "2026-08-02.1" },
			/CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE/
		]
	])("requires a public policy %s", (_label, policyMetadata, expected) => {
		expect(() =>
			readClassroomPrivacySettings({
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
				CLASSROOM_PRIVACY_APPROVED: "true",
				CLASSROOM_PRIVACY_OPERATOR_NOTICE:
					"Operator, address, phone, and email.",
				CLASSROOM_SERVICE_PROVIDER_NOTICE:
					"Approved hosting provider stores classroom records.",
				SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
				...policyMetadata
			})
		).toThrow(expected);
	});

	it.each([
		["version whitespace", "policy version", "2026-08-02"],
		["version punctuation", "policy/1", "2026-08-02"],
		["version length", `v${"1".repeat(64)}`, "2026-08-02"],
		["date shape", "policy-1", "2026-8-2"],
		["impossible date", "policy-1", "2025-02-29"],
		["year zero", "policy-1", "0000-01-01"]
	])("rejects invalid policy metadata: %s", (_label, version, effectiveDate) => {
		expect(() =>
			readClassroomPrivacySettings({
				CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE: effectiveDate,
				CLASSROOM_PRIVACY_POLICY_VERSION: version
			})
		).toThrow(/CLASSROOM_PRIVACY_POLICY_(?:VERSION|EFFECTIVE_DATE)/);
	});

	it("accepts a real leap-day policy effective date", () => {
		expect(classroomPrivacyPolicyVersion(" policy-1 ")).toBe("policy-1");
		expect(classroomPrivacyPolicyEffectiveDate(" 2024-02-29 ")).toBe(
			"2024-02-29"
		);
		expect(readClassroomPrivacySettings({
			CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE: "2024-02-29",
			CLASSROOM_PRIVACY_POLICY_VERSION: "policy-1"
		})).toMatchObject({
			privacyPolicyEffectiveDate: "2024-02-29",
			privacyPolicyVersion: "policy-1"
		});
	});

	it("fails closed when an optional feature is requested before the policy effective date", () => {
		expect(() =>
			readClassroomPrivacySettings({
				...approvedPublicPolicy,
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
				CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE: "2999-01-01"
			})
		).toThrow(/cannot be in the future/);
	});

	it("requires the approved bounded retention period for each retained feature", () => {
		const approvedNotices = approvedPublicPolicy;
		expect(() =>
			readClassroomPrivacySettings({
				...approvedNotices,
				STUDENT_ACCOUNTS_ENABLED: "true"
			})
		).toThrow(/STUDENT_RECORD_RETENTION_DAYS/);
		expect(() =>
			readClassroomPrivacySettings({
				...approvedNotices,
				STUDENT_ACCOUNTS_ENABLED: "true",
				STUDENT_RECORD_RETENTION_DAYS: "366"
			})
		).toThrow(/30 to 365/);
		expect(() =>
			readClassroomPrivacySettings({
				...approvedNotices,
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true"
			})
		).toThrow(/CLASSROOM_ANALYTICS_RETENTION_DAYS/);
		expect(() =>
			readClassroomPrivacySettings({
				...approvedNotices,
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
				CLASSROOM_ANALYTICS_RETENTION_DAYS: "91"
			})
		).toThrow(/7 to 90/);
		expect(readClassroomPrivacySettings({
			...approvedNotices,
			CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
			CLASSROOM_ANALYTICS_RETENTION_DAYS: "45"
		})).toMatchObject({
			analyticsCollectionEnabled: true,
			analyticsRetentionDays: 45,
			studentRecordRetentionDays: null
		});
	});

	it("enables only the explicitly approved feature set", () => {
		expect(readClassroomPrivacySettings({
			CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
			CLASSROOM_ANALYTICS_RETENTION_DAYS: "45",
			...approvedPublicPolicy,
			STUDENT_ACCOUNTS_ENABLED: "true",
			STUDENT_OAUTH_ENABLED: "false",
			STUDENT_RECORD_RETENTION_DAYS: "90"
		})).toEqual({
			analyticsCollectionEnabled: true,
			analyticsRetentionDays: 45,
			operatorNotice: "Operator, address, phone, and email.",
			privacyPolicyEffectiveDate: "2026-08-02",
			privacyPolicyVersion: "2026-08-02.1",
			schoolPrivacyContact: "School privacy office, 555-0100",
			serviceProviderNotice:
				"Approved hosting provider stores classroom records.",
			studentAccountsEnabled: true,
			studentOAuthEnabled: false,
			studentRecordRetentionDays: 90
		});
	});
});
