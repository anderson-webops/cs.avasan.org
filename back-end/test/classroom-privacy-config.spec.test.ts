import { describe, expect, it } from "vitest";
import {
	readClassroomPrivacySettings
} from "../src/security/classroomPrivacy.js";

describe("classroom privacy rollout configuration", () => {
	it("fails closed when no optional student-data features are configured", () => {
		expect(readClassroomPrivacySettings({})).toEqual({
			analyticsCollectionEnabled: false,
			operatorNotice: null,
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

	it("requires an explicit bounded retention period only for accounts", () => {
		const approvedNotices = {
			CLASSROOM_PRIVACY_APPROVED: "true",
			CLASSROOM_PRIVACY_OPERATOR_NOTICE:
				"Operator, address, phone, and email.",
			CLASSROOM_SERVICE_PROVIDER_NOTICE:
				"Approved hosting provider stores classroom records.",
			SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100"
		};
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
		expect(
			readClassroomPrivacySettings({
				...approvedNotices,
				CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true"
			}).studentRecordRetentionDays
		).toBeNull();
	});

	it("enables only the explicitly approved feature set", () => {
		expect(readClassroomPrivacySettings({
			CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
			CLASSROOM_PRIVACY_APPROVED: "true",
			CLASSROOM_PRIVACY_OPERATOR_NOTICE:
				"Operator, address, phone, and email.",
			CLASSROOM_SERVICE_PROVIDER_NOTICE:
				"Approved hosting provider stores classroom records.",
			SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
			STUDENT_ACCOUNTS_ENABLED: "true",
			STUDENT_OAUTH_ENABLED: "false",
			STUDENT_RECORD_RETENTION_DAYS: "90"
		})).toEqual({
			analyticsCollectionEnabled: true,
			operatorNotice: "Operator, address, phone, and email.",
			schoolPrivacyContact: "School privacy office, 555-0100",
			serviceProviderNotice:
				"Approved hosting provider stores classroom records.",
			studentAccountsEnabled: true,
			studentOAuthEnabled: false,
			studentRecordRetentionDays: 90
		});
	});
});
