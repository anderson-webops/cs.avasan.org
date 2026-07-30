import { describe, expect, it, vi } from "vitest";
import { purgeClassroomAnalyticsRecords } from "../src/services/classroomAnalyticsPurge.js";

function query<T>(value: T) {
	return { exec: vi.fn().mockResolvedValue(value) };
}

describe("classroom analytics operational purge", () => {
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
