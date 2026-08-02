import { describe, expect, it, vi } from "vitest";
import {
	CLASSROOM_ANALYTICS_PURGE_CONFIRMATION,
	requireClassroomAnalyticsCollectionDisabled,
	requireClassroomAnalyticsDatabase,
	requireExactClassroomAnalyticsPurgeConfirmation,
	selectClassroomAnalyticsPurgeConnection
} from "../src/security/classroomAnalyticsPurge.js";
import { purgeClassroomAnalyticsRecords } from "../src/services/classroomAnalyticsPurge.js";

function query<T>(value: T) {
	return { exec: vi.fn().mockResolvedValue(value) };
}

describe("classroom analytics operational purge", () => {
	it("requires the one exact destructive confirmation argument", () => {
		expect(() =>
			requireExactClassroomAnalyticsPurgeConfirmation([
				CLASSROOM_ANALYTICS_PURGE_CONFIRMATION
			])
		).not.toThrow();

		for (const arguments_ of [
			[],
			["--confirm"],
			[CLASSROOM_ANALYTICS_PURGE_CONFIRMATION, "--extra"]
		]) {
			expect(() =>
				requireExactClassroomAnalyticsPurgeConfirmation(arguments_)
			).toThrow("without exactly");
		}
	});

	it("refuses unless collection is explicitly false", () => {
		for (const disabled of ["false", " FALSE "]) {
			expect(() =>
				requireClassroomAnalyticsCollectionDisabled(disabled)
			).not.toThrow();
		}
		for (const enabledOrMissing of [undefined, "", "true", "0", "no"]) {
			expect(() =>
				requireClassroomAnalyticsCollectionDisabled(enabledOrMissing)
			).toThrow("must be explicitly false");
		}
	});

	it("uses the direct application URI only when Vault is not requested", async () => {
		const readSecret = vi.fn();
		await expect(
			selectClassroomAnalyticsPurgeConnection(
				[CLASSROOM_ANALYTICS_PURGE_CONFIRMATION],
				{
					CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "false",
					MONGODB_URI:
						"mongodb://classroom@mongo/cs-avasan-org?authSource=cs-avasan-org"
				},
				readSecret
			)
		).resolves.toEqual({
			source: "environment",
			uri: "mongodb://classroom@mongo/cs-avasan-org?authSource=cs-avasan-org"
		});
		expect(readSecret).not.toHaveBeenCalled();
	});

	it("uses Vault fail-closed instead of a configured fallback URI", async () => {
		const readSecret = vi.fn().mockResolvedValue({
			uri: "mongodb://vault@mongo/cs-avasan-org?authSource=cs-avasan-org"
		});
		await expect(
			selectClassroomAnalyticsPurgeConnection(
				[CLASSROOM_ANALYTICS_PURGE_CONFIRMATION],
				{
					CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "false",
					MONGODB_URI: "mongodb://must-not-be-used/other",
					VAULT_ADDR: "https://vault.school.example",
					VAULT_ROLE_ID: "role",
					VAULT_SECRET_ID: "secret"
				},
				readSecret
			)
		).resolves.toEqual({
			source: "vault",
			uri: "mongodb://vault@mongo/cs-avasan-org?authSource=cs-avasan-org"
		});
		expect(readSecret).toHaveBeenCalledTimes(1);
	});

	it("requires the actual connected fork database before deletion", () => {
		expect(() =>
			requireClassroomAnalyticsDatabase("cs-avasan-org")
		).not.toThrow();
		for (const databaseName of [undefined, "test", "classes"]) {
			expect(() =>
				requireClassroomAnalyticsDatabase(databaseName)
			).toThrow("exactly cs-avasan-org");
		}
	});

	it("deletes every anonymous aggregate and verifies the collection is empty", async () => {
		const countDocuments = vi.fn().mockReturnValueOnce(query(17)).mockReturnValueOnce(query(0));
		const deleteMany = vi.fn().mockReturnValue(query({ acknowledged: true, deletedCount: 17 }));

		await expect(
			purgeClassroomAnalyticsRecords({
				countDocuments,
				deleteMany
			})
		).resolves.toEqual({
			deletedCount: 17,
			recordsBefore: 17,
			recordsRemaining: 0
		});
		expect(countDocuments).toHaveBeenNthCalledWith(1, {});
		expect(deleteMany).toHaveBeenCalledWith({});
		expect(countDocuments).toHaveBeenNthCalledWith(2, {});
	});

	it("fails if MongoDB does not acknowledge the deletion", async () => {
		const countDocuments = vi.fn().mockReturnValue(query(3));
		const deleteMany = vi.fn().mockReturnValue(query({ acknowledged: false, deletedCount: 0 }));

		await expect(
			purgeClassroomAnalyticsRecords({
				countDocuments,
				deleteMany
			})
		).rejects.toThrow("did not acknowledge");
		expect(countDocuments).toHaveBeenCalledTimes(1);
	});

	it("fails closed when verification still finds records", async () => {
		const countDocuments = vi.fn().mockReturnValueOnce(query(3)).mockReturnValueOnce(query(1));
		const deleteMany = vi.fn().mockReturnValue(query({ acknowledged: true, deletedCount: 2 }));

		await expect(
			purgeClassroomAnalyticsRecords({
				countDocuments,
				deleteMany
			})
		).rejects.toThrow("1 records remain");
	});
});
