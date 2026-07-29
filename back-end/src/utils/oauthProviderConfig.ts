import type { ExternalIdentityProvider } from "../types/entities/IExternalIdentity.js";
import { Buffer } from "node:buffer";
import { env } from "node:process";
import {
	PRODUCTION_CLASSROOM_ORIGIN,
	readBooleanSetting,
	readClassroomOrigin
} from "../security/environment.js";

const DEFAULT_DEVELOPMENT_CLASSROOM_ORIGIN = "http://127.0.0.1:3333";

interface GoogleOAuthCredentials {
	clientID: string;
	clientSecret: string;
}

interface AppleOAuthCredentials {
	clientID: string;
	keyID: string;
	privateKey: string;
	teamID: string;
}

export type OAuthProviderCredentials
	= | { provider: "apple"; credentials: AppleOAuthCredentials }
		| { provider: "google"; credentials: GoogleOAuthCredentials };

function configuredValue(value: string | undefined) {
	const normalized = value?.trim();
	return normalized || null;
}

function applePrivateKey() {
	const encoded = configuredValue(env.APPLE_OAUTH_PRIVATE_KEY_BASE64);
	if (encoded) {
		const decoded = Buffer.from(encoded, "base64").toString("utf8").trim();
		return decoded.includes("-----BEGIN PRIVATE KEY-----")
			&& decoded.includes("-----END PRIVATE KEY-----")
			? decoded
			: null;
	}

	const inline = configuredValue(env.APPLE_OAUTH_PRIVATE_KEY);
	const decoded = inline?.replaceAll("\\n", "\n") ?? null;
	return decoded?.includes("-----BEGIN PRIVATE KEY-----")
		&& decoded.includes("-----END PRIVATE KEY-----")
		? decoded
		: null;
}

export function oauthProviderCredentials(
	provider: ExternalIdentityProvider
): OAuthProviderCredentials | null {
	if (
		!readBooleanSetting(
			env.STUDENT_OAUTH_ENABLED,
			"STUDENT_OAUTH_ENABLED"
		)
	) {
		return null;
	}

	if (provider === "google") {
		const clientID = configuredValue(env.GOOGLE_OAUTH_CLIENT_ID);
		const clientSecret = configuredValue(env.GOOGLE_OAUTH_CLIENT_SECRET);
		if (!clientID || !clientSecret) return null;
		return {
			provider,
			credentials: { clientID, clientSecret }
		};
	}

	const clientID = configuredValue(env.APPLE_OAUTH_CLIENT_ID);
	const keyID = configuredValue(env.APPLE_OAUTH_KEY_ID);
	const privateKey = applePrivateKey();
	const teamID = configuredValue(env.APPLE_OAUTH_TEAM_ID);
	if (!clientID || !keyID || !privateKey || !teamID) return null;
	return {
		provider,
		credentials: { clientID, keyID, privateKey, teamID }
	};
}

export function enabledOAuthProviders() {
	return {
		apple: !!oauthProviderCredentials("apple"),
		google: !!oauthProviderCredentials("google")
	};
}

export function oauthAuthOrigin() {
	const isProduction = env.NODE_ENV === "production";
	return readClassroomOrigin(env.CLASSROOM_ORIGIN, isProduction)
		?? (isProduction
			? PRODUCTION_CLASSROOM_ORIGIN
			: DEFAULT_DEVELOPMENT_CLASSROOM_ORIGIN);
}

export function oauthCallbackUrl(provider: ExternalIdentityProvider) {
	return new URL(
		`/api/students/oauth/${provider}/callback`,
		oauthAuthOrigin()
	).toString();
}

export function normalizeOAuthReturnTo(value: unknown) {
	if (
		typeof value !== "string"
		|| value.length === 0
		|| value.length > 500
		|| !value.startsWith("/")
		|| value.startsWith("//")
		|| value.includes("\\")
	) {
		return "/";
	}

	try {
		const origin = oauthAuthOrigin();
		const destination = new URL(value, origin);
		if (
			destination.origin !== origin
			|| destination.pathname.startsWith("/api")
		) {
			return "/";
		}
		return `${destination.pathname}${destination.search}${destination.hash}`;
	}
	catch {
		return "/";
	}
}
