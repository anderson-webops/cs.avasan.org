import process, { argv, env } from "node:process";
import mongoose from "mongoose";
import * as readlineSync from "readline-sync";

import {
	AdminPasswordRecoveryRefusal,
	requireAdminPasswordRecoveryDatabase,
	selectAdminPasswordRecoveryConnection
} from "./security/adminPasswordRecovery.js";
import { resetJulioAdminPassword } from "./services/adminPasswordRecovery.js";
import { readMongoSecret } from "./vaultClient.js";

async function main(): Promise<void> {
	try {
		const connection = await selectAdminPasswordRecoveryConnection(
			argv.slice(2),
			process.stdin.isTTY === true && process.stdout.isTTY === true,
			env,
			readMongoSecret
		);
		await mongoose.connect(connection.uri);
		requireAdminPasswordRecoveryDatabase(
			mongoose.connection.db?.databaseName
		);
		const email = readlineSync.question("Confirm Julio's existing email: ");
		const password = readlineSync.question(
			"New password (at least 14 characters): ",
			{
				hideEchoBack: true,
				mask: "",
				keepWhitespace: true
			}
		);
		const confirmation = readlineSync.question("Confirm new password: ", {
			hideEchoBack: true,
			mask: "",
			keepWhitespace: true
		});
		await resetJulioAdminPassword(email, password, confirmation);
		console.log(
			"Julio's password was reset. All previous Admin sessions are revoked; sign in again with the new password."
		);
	}
	catch (error) {
		if (error instanceof AdminPasswordRecoveryRefusal) {
			console.error(error.message);
		}
		else {
			// Driver/Vault errors may contain credentials; never print the error.
			console.error(
				"Teacher password recovery failed. Check the approved database configuration and account state; no success was confirmed."
			);
		}
		process.exitCode = 1;
	}
	finally {
		if (mongoose.connection.readyState !== 0) {
			try {
				await mongoose.disconnect();
			}
			catch {
				console.error(
					"Database disconnect failed after teacher password recovery."
				);
				process.exitCode = 1;
			}
		}
	}
}

void main();
