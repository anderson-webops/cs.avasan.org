// src/types/session/express-session.d.ts

// noinspection JSUnusedGlobalSymbols // These are used/included by tsconfig.json
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../entities/IAdmin.js";
import type { IStudent } from "../entities/IStudent.js";
import type { ITutor } from "../entities/ITutor.js";
import type { IUser } from "../entities/IUser.js";

/**
 * Extend express-session's SessionData interface
 */
declare module "express-session" {
		interface SessionData {
			adminID?: string;
			adminExpiresAt?: number;
			adminLastActivityAt?: number;
			adminSessionVersion?: number;
			studentID?: string;
			studentExpiresAt?: number;
			studentSessionVersion?: number;
		studentAuthLevel?: "setup" | "full";
		studentSetupExpiresAt?: number;
		studentLastActivityAt?: number;
	}
}

/**
 * Extend Express's Request interface. Tutor and student request fields remain
 * typed for source compatibility with downstream-unmounted legacy modules.
 */
declare global {
	namespace Express {
		interface Request {
			currentAdmin?: HydratedDocument<IAdmin>;
			currentStudent?: HydratedDocument<IStudent>;
			currentTutor?: HydratedDocument<ITutor>;
			currentUser?: HydratedDocument<IUser>;
		}
	}
}
