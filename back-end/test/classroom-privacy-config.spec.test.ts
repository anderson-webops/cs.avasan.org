import { describe, expect, it } from "vitest";
import {
	readClassroomPrivacySettings
} from "../src/security/classroomPrivacy.js";

describe("classroom privacy rollout configuration", () => {
	it("fails closed when no optional student-data features are configured", () => {
		expect(readClassroomPrivacySettings({})).toEqual({
			analyticsCollectionEnabled: false,
			schoolPrivacyContact: null,
			studentAccountsEnabled: false,
			studentOAuthEnabled: false
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

	it("enables only the explicitly approved feature set", () => {
		expect(readClassroomPrivacySettings({
			CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
			CLASSROOM_PRIVACY_APPROVED: "true",
			SCHOOL_PRIVACY_CONTACT: "School privacy office, 555-0100",
			STUDENT_ACCOUNTS_ENABLED: "true",
			STUDENT_OAUTH_ENABLED: "false"
		})).toEqual({
			analyticsCollectionEnabled: true,
			schoolPrivacyContact: "School privacy office, 555-0100",
			studentAccountsEnabled: true,
			studentOAuthEnabled: false
		});
	});
});
