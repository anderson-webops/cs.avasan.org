import process, { argv, env } from "node:process";
import mongoose from "mongoose";

import {
	ClassroomAnalyticsPurgeRefusal,
	requireClassroomAnalyticsDatabase,
	selectClassroomAnalyticsPurgeConnection
} from "./security/classroomAnalyticsPurge.js";
import { purgeClassroomAnalyticsRecords } from "./services/classroomAnalyticsPurge.js";
import { readMongoSecret } from "./vaultClient.js";
import "dotenv/config";

async function main(): Promise<void> {
	try {
		const mongoConnection = await selectClassroomAnalyticsPurgeConnection(
			argv.slice(2),
			env,
			readMongoSecret
		);
		await mongoose.connect(mongoConnection.uri);
		requireClassroomAnalyticsDatabase(
			mongoose.connection.db?.databaseName
		);
		const receipt = await purgeClassroomAnalyticsRecords();
		if (receipt.recordsRemaining !== 0) {
			throw new Error("Classroom analytics purge did not verify zero records.");
		}
		console.log(
			`Deleted ${receipt.deletedCount} anonymous aggregate rows; verified ${receipt.recordsRemaining} remain.`
		);
	}
	catch (error) {
		if (error instanceof ClassroomAnalyticsPurgeRefusal) {
			console.error(error.message);
			process.exitCode = 1;
			return;
		}
		// Connection errors can include credentials, so keep operator output
		// deliberately generic.
		console.error(
			"Anonymous aggregate deletion failed. Check database connectivity and retry while collection is disabled."
		);
		process.exitCode = 1;
	}
	finally {
		if (mongoose.connection.readyState !== 0) {
			try {
				await mongoose.disconnect();
			}
			catch {
				console.error("Database disconnect failed after anonymous aggregate deletion.");
				process.exitCode = 1;
			}
		}
	}
}

void main();
