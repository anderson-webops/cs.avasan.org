import process, { argv, env } from "node:process";
import mongoose from "mongoose";

import { purgeClassroomAnalyticsRecords } from "./services/classroomAnalyticsPurge.js";
import "dotenv/config";

const REQUIRED_CONFIRMATION = "--confirm-delete-all-classroom-analytics";

async function main(): Promise<void> {
	if (!argv.slice(2).includes(REQUIRED_CONFIRMATION)) {
		console.error(`Refusing permanent deletion without ${REQUIRED_CONFIRMATION}.`);
		process.exitCode = 1;
		return;
	}

	const mongoUri = env.MONGODB_URI?.trim();
	if (!mongoUri) {
		console.error("MONGODB_URI is required.");
		process.exitCode = 1;
		return;
	}

	try {
		await mongoose.connect(mongoUri);
		const receipt = await purgeClassroomAnalyticsRecords();
		console.log(
			`Deleted ${receipt.deletedCount} anonymous aggregate rows; verified ${receipt.recordsRemaining} remain.`
		);
	}
	catch {
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
