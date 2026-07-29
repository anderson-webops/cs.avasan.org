import type { IDToken } from "openid-client";
import type { ExternalIdentityProvider } from "../types/entities/IExternalIdentity.js";
import { importPKCS8, SignJWT } from "jose";
import {
	authorizationCodeGrant,
	buildAuthorizationUrl,
	calculatePKCECodeChallenge,
	ClientSecretPost,
	discovery,
	randomPKCECodeVerifier
} from "openid-client";
import {
	oauthCallbackUrl,
	oauthProviderCredentials
} from "./oauthProviderConfig.js";

const GOOGLE_ISSUER = new URL("https://accounts.google.com");
const APPLE_ISSUER = new URL("https://appleid.apple.com");
const APPLE_CLIENT_SECRET_LIFETIME_SECONDS = 5 * 60;
const APPLE_CONFIGURATION_CACHE_MS = 4 * 60 * 1000;

type ProviderConfiguration = Awaited<ReturnType<typeof discovery>>;

let googleConfiguration: Promise<ProviderConfiguration> | null = null;
let appleConfiguration:
	| {
		configuration: Promise<ProviderConfiguration>;
		expiresAt: number;
	}
	| null = null;

async function createAppleClientSecret() {
	const configured = oauthProviderCredentials("apple");
	if (!configured || configured.provider !== "apple") {
		throw new Error("Apple login is not configured");
	}

	const { clientID, keyID, privateKey, teamID } = configured.credentials;
	const signingKey = await importPKCS8(privateKey, "ES256");
	return new SignJWT({})
		.setProtectedHeader({ alg: "ES256", kid: keyID })
		.setIssuer(teamID)
		.setIssuedAt()
		.setExpirationTime(
			Math.floor(Date.now() / 1000)
			+ APPLE_CLIENT_SECRET_LIFETIME_SECONDS
		)
		.setAudience(APPLE_ISSUER.origin)
		.setSubject(clientID)
		.sign(signingKey);
}

async function discoverGoogle() {
	const configured = oauthProviderCredentials("google");
	if (!configured || configured.provider !== "google") {
		throw new Error("Google login is not configured");
	}

	const { clientID, clientSecret } = configured.credentials;
	return discovery(
		GOOGLE_ISSUER,
		clientID,
		{
			client_secret: clientSecret,
			redirect_uris: [oauthCallbackUrl("google")],
			response_types: ["code"]
		},
		ClientSecretPost(clientSecret)
	);
}

async function discoverApple() {
	const configured = oauthProviderCredentials("apple");
	if (!configured || configured.provider !== "apple") {
		throw new Error("Apple login is not configured");
	}

	const clientSecret = await createAppleClientSecret();
	return discovery(
		APPLE_ISSUER,
		configured.credentials.clientID,
		{
			client_secret: clientSecret,
			redirect_uris: [oauthCallbackUrl("apple")],
			response_types: ["code"]
		},
		ClientSecretPost(clientSecret)
	);
}

async function providerConfiguration(provider: ExternalIdentityProvider) {
	if (provider === "google") {
		googleConfiguration ??= discoverGoogle();
		try {
			return await googleConfiguration;
		}
		catch (error) {
			googleConfiguration = null;
			throw error;
		}
	}

	if (!appleConfiguration || appleConfiguration.expiresAt <= Date.now()) {
		appleConfiguration = {
			configuration: discoverApple(),
			expiresAt: Date.now() + APPLE_CONFIGURATION_CACHE_MS
		};
	}

	try {
		return await appleConfiguration.configuration;
	}
	catch (error) {
		appleConfiguration = null;
		throw error;
	}
}

export interface OAuthAuthorizationRequest {
	codeVerifier: string;
	redirectUrl: URL;
}

export async function createOAuthAuthorizationRequest(
	provider: ExternalIdentityProvider,
	state: string,
	nonce: string
): Promise<OAuthAuthorizationRequest> {
	const configuration = await providerConfiguration(provider);
	const codeVerifier = randomPKCECodeVerifier();
	const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
	const parameters: Record<string, string> = {
		client_id: configuration.clientMetadata().client_id,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		nonce,
		redirect_uri: oauthCallbackUrl(provider),
		response_type: "code",
		scope: "openid",
		state
	};

	if (provider === "apple") {
		parameters.response_mode = "form_post";
	}
	else {
		parameters.prompt = "select_account";
	}

	return {
		codeVerifier,
		redirectUrl: buildAuthorizationUrl(configuration, parameters)
	};
}

export async function exchangeOAuthAuthorizationCode(
	provider: ExternalIdentityProvider,
	callbackRequest: Request | URL,
	checks: {
		codeVerifier: string;
		nonce: string;
		state: string;
	}
): Promise<IDToken> {
	const configuration = await providerConfiguration(provider);
	const tokens = await authorizationCodeGrant(configuration, callbackRequest, {
		expectedNonce: checks.nonce,
		expectedState: checks.state,
		idTokenExpected: true,
		pkceCodeVerifier: checks.codeVerifier
	});
	const claims = tokens.claims();
	if (!claims) {
		throw new Error("The identity provider did not return an ID token");
	}
	return claims;
}

export function resetOAuthClientCacheForTests() {
	googleConfiguration = null;
	appleConfiguration = null;
}
