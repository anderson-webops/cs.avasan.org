// src/types/session/CustomSession.ts
export interface CustomSession {
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
