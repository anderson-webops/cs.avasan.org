import { afterEach, describe, expect, it, vi } from "vitest";
import {
	classroomAnalyticsRetentionDays,
	classroomPrivacyPolicyEffectiveDate,
	classroomPrivacyPolicyVersion,
	classroomUsageIsEnabled,
	studentAccountsAreEnabled,
	studentOAuthIsEnabled,
	studentRecordMaintenanceIsEnabled
} from "@/modules/classroomFeatures";

describe("frontend classroom privacy gates", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("fails closed by default", () => {
		expect(classroomAnalyticsRetentionDays()).toBeNull();
		expect(classroomPrivacyPolicyVersion()).toBe("");
		expect(classroomPrivacyPolicyEffectiveDate()).toBe("");
		expect(studentAccountsAreEnabled()).toBe(false);
		expect(studentOAuthIsEnabled()).toBe(false);
		expect(studentRecordMaintenanceIsEnabled()).toBe(false);
		expect(classroomUsageIsEnabled()).toBe(false);
	});

	it("requires approval and a direct contact in addition to feature flags", () => {
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv("VITE_STUDENT_OAUTH_ENABLED", "true");
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Test operator contact"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Test approved provider notice"
		);
		expect(classroomUsageIsEnabled()).toBe(false);
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "2026-08-02.1");
		expect(classroomUsageIsEnabled()).toBe(false);
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-08-02"
		);
		expect(classroomPrivacyPolicyVersion()).toBe("2026-08-02.1");
		expect(classroomPrivacyPolicyEffectiveDate()).toBe("2026-08-02");
		expect(classroomUsageIsEnabled()).toBe(false);
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", "45");
		expect(classroomAnalyticsRetentionDays()).toBe(45);
		expect(classroomUsageIsEnabled()).toBe(true);
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		expect(studentRecordMaintenanceIsEnabled()).toBe(true);
		expect(studentAccountsAreEnabled()).toBe(true);
		expect(studentOAuthIsEnabled()).toBe(true);
		expect(classroomUsageIsEnabled()).toBe(true);
	});

	it.each([
		["unsafe version", "policy/1", "2026-08-02"],
		["overlong version", `v${"1".repeat(64)}`, "2026-08-02"],
		["bad date shape", "policy-1", "2026-8-2"],
		["impossible date", "policy-1", "2025-02-29"],
		["year zero", "policy-1", "0000-01-01"]
	])("fails closed for %s", (_label, version, effectiveDate) => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", "45");
		vi.stubEnv("VITE_SCHOOL_PRIVACY_CONTACT", "School privacy contact");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE", "Operator notice");
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Service-provider notice"
		);
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", version);
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			effectiveDate
		);

		expect(classroomUsageIsEnabled()).toBe(false);
	});

	it("keeps optional features hidden before the policy effective date", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", "45");
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		vi.stubEnv("VITE_SCHOOL_PRIVACY_CONTACT", "School privacy contact");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE", "Operator notice");
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Service-provider notice"
		);
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "policy-1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2999-01-01"
		);

		expect(studentAccountsAreEnabled()).toBe(false);
		expect(classroomUsageIsEnabled()).toBe(false);
	});

	it("accepts only a canonical whole-number analytics retention period from 7 through 90", () => {
		for (const value of ["7", "45", "90"]) {
			vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", value);
			expect(classroomAnalyticsRetentionDays()).toBe(Number(value));
		}
		for (const value of ["6", "07", "90.0", "9e1", "+45", "91"]) {
			vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", value);
			expect(classroomAnalyticsRetentionDays()).toBeNull();
		}
	});

	it("never enables OAuth without optional accounts", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Test operator contact"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Test approved provider notice"
		);
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "2026-08-02.1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-08-02"
		);
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "false");
		vi.stubEnv("VITE_STUDENT_OAUTH_ENABLED", "true");
		expect(studentOAuthIsEnabled()).toBe(false);
	});

	it("keeps Julio's record maintenance available after public accounts are disabled", () => {
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "false");
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");

		expect(studentAccountsAreEnabled()).toBe(false);
		expect(studentOAuthIsEnabled()).toBe(false);
		expect(studentRecordMaintenanceIsEnabled()).toBe(true);

		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "29");
		expect(studentRecordMaintenanceIsEnabled()).toBe(false);
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "366");
		expect(studentRecordMaintenanceIsEnabled()).toBe(false);
	});
});
