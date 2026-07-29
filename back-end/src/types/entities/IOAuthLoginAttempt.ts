import type { Types } from "mongoose";
import type { ExternalIdentityProvider } from "./IExternalIdentity.js";

export const oauthLoginModes = ["signin", "link"] as const;

export type OAuthLoginMode = (typeof oauthLoginModes)[number];

export interface IOAuthLoginAttempt {
	browserBindingHash: string;
	codeVerifier: string;
	expiresAt: Date;
	mode: OAuthLoginMode;
	nonce: string;
	provider: ExternalIdentityProvider;
	returnTo: string;
	stateHash: string;
	studentID?: Types.ObjectId;
	studentSessionVersion?: number;
	createdAt: Date;
	updatedAt: Date;
}
