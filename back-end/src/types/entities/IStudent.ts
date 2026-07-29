import type { Types } from "mongoose";

export interface IStudent {
	_id: Types.ObjectId;
	username: string;
	passwordHash?: string;
	accessCodeHash?: string;
	pendingSetupCodeHash?: string;
	accessCodeExpiresAt?: Date;
	active: boolean;
	sessionVersion: number;
	failedLoginAttempts: number;
	lockedUntil?: Date;
	activeProjectCount: number;
	activeProjectBytes: number;
	passwordSetAt?: Date;
	lastLoginAt?: Date;
	lastPasswordSetupRequestID?: string;
	createdAt: Date;
	updatedAt: Date;
}
