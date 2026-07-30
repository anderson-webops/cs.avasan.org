import { afterEach, describe, expect, it, vi } from "vitest";
import {
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
		expect(classroomUsageIsEnabled()).toBe(true);
		expect(studentAccountsAreEnabled()).toBe(false);

		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		expect(studentRecordMaintenanceIsEnabled()).toBe(true);
		expect(studentAccountsAreEnabled()).toBe(true);
		expect(studentOAuthIsEnabled()).toBe(true);
		expect(classroomUsageIsEnabled()).toBe(true);
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
