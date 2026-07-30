import type { Types } from "mongoose";

export interface IStudent {
	_id: Types.ObjectId;
	username: string;
	passwordHash?: string;
	accessCodeHash?: string;
	pendingSetupCodeHash?: string;
	accessCodeExpiresAt?: Date;
	externalAuthProvider?: "apple" | "google";
	externalAuthSubjectHash?: string;
	active: boolean;
	sessionVersion: number;
	failedLoginAttempts: number;
	lockedUntil?: Date;
	activeProjectCount: number;
	activeProjectBytes: number;
	passwordSetAt?: Date;
	lastLoginAt?: Date;
	lastPasswordSetupRequestID?: string;
	dataDeletionPendingAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
