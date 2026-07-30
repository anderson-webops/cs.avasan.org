import { ClassroomUsageDaily } from "../models/schemas/ClassroomUsageDaily.js";

interface CountQuery {
	exec: () => Promise<number>;
}

interface DeleteQuery {
	exec: () => Promise<{
		acknowledged: boolean;
		deletedCount: number;
	}>;
}

export interface ClassroomUsagePurgeModel {
	countDocuments: (filter: Record<string, never>) => CountQuery;
	deleteMany: (filter: Record<string, never>) => DeleteQuery;
}

export interface ClassroomUsagePurgeReceipt {
	deletedCount: number;
	recordsBefore: number;
	recordsRemaining: number;
}

/**
 * Permanently remove the anonymous aggregate collection and verify the primary
 * database is empty. This intentionally has no HTTP route; it is called only
 * by the authenticated deployment operator through the isolated tools image.
 */
export async function purgeClassroomAnalyticsRecords(
	model: ClassroomUsagePurgeModel = ClassroomUsageDaily as unknown as ClassroomUsagePurgeModel
): Promise<ClassroomUsagePurgeReceipt> {
	const recordsBefore = await model.countDocuments({}).exec();
	const deletion = await model.deleteMany({}).exec();
	if (!deletion.acknowledged) {
		throw new Error("MongoDB did not acknowledge the analytics deletion.");
	}

	const recordsRemaining = await model.countDocuments({}).exec();
	if (recordsRemaining !== 0) {
		throw new Error(`Analytics deletion verification failed: ${recordsRemaining} records remain.`);
	}

	return {
		deletedCount: deletion.deletedCount,
		recordsBefore,
		recordsRemaining
	};
}
