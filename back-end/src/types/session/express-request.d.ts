// noinspection JSUnusedGlobalSymbols // This file is included by tsconfig.json
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../entities/IAdmin.js";
import type { IStudent } from "../entities/IStudent.js";

/**
 * Extend Express's Request interface with the two authenticated identities
 * supported by this classroom.
 */
declare global {
	namespace Express {
		interface Request {
			currentAdmin?: HydratedDocument<IAdmin>;
			currentStudent?: HydratedDocument<IStudent>;
		}
	}
}
