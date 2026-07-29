// src/types/session/express-session.d.ts

// noinspection JSUnusedGlobalSymbols // These are used/included by tsconfig.json
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../entities/IAdmin.js";
import type { ITutor } from "../entities/ITutor.js";
import type { IUser } from "../entities/IUser.js";

/**
 * Extend express-session's SessionData interface
 */
declare module "express-session" {
	interface SessionData {
		adminID?: string;
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
			currentTutor?: HydratedDocument<ITutor>;
			currentUser?: HydratedDocument<IUser>;
		}
	}
}
