import process, { env } from "node:process";
import mongoose from "mongoose";
import * as readlineSync from "readline-sync";

import { Admin } from "./models/schemas/Admin.js";
import { ADMIN_SINGLETON_ID } from "./security/adminIdentity.js";
import {
	isValidTeacherPassword,
	MIN_TEACHER_PASSWORD_LENGTH
} from "./security/passwordPolicy.js";
import "dotenv/config";

const TEACHER_NAME = "Julio";

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

async function main(): Promise<void> {
	const mongoUri = env.MONGODB_URI?.trim();
	if (!mongoUri) {
		console.error("MONGODB_URI is required.");
		process.exitCode = 1;
		return;
	}

	try {
		await mongoose.connect(mongoUri);

		const existingAdminCount = await Admin.countDocuments({}).exec();
		if (existingAdminCount > 0) {
			console.error("Teacher provisioning refused because an Admin account already exists.");
			process.exitCode = 1;
			return;
		}

		const email = normalizeEmail(readlineSync.question("Julio's email: "));
		const password = readlineSync.question("Julio's password: ", {
			hideEchoBack: true
		});

		if (!email || !email.includes("@") || !isValidTeacherPassword(password)) {
			console.error(
				`A valid email and password of at least ${MIN_TEACHER_PASSWORD_LENGTH} characters are required.`
			);
			process.exitCode = 1;
			return;
		}

		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: TEACHER_NAME,
			email,
			password,
			editAdmins: false,
			saveEdit: "Edit",
			role: "admin"
		});

		await admin.save();
		console.log("Julio's teacher account was provisioned.");
	}
	catch {
		// Do not print connection errors: they can contain database credentials.
		console.error("Teacher provisioning failed. Check database connectivity and account state.");
		process.exitCode = 1;
	}
	finally {
		if (mongoose.connection.readyState !== 0) {
			try {
				await mongoose.disconnect();
			}
			catch {
				console.error("Database disconnect failed after teacher provisioning.");
				process.exitCode = 1;
			}
		}
	}
}

void main();
