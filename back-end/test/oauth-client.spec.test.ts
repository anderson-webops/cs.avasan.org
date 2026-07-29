import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const openIdMocks = vi.hoisted(() => ({
	authorizationCodeGrant: vi.fn(),
	buildAuthorizationUrl: vi.fn(),
	calculatePKCECodeChallenge: vi.fn(),
	clientSecretPost: vi.fn(),
	discovery: vi.fn(),
	randomPKCECodeVerifier: vi.fn()
}));

const joseMocks = vi.hoisted(() => ({
	importPKCS8: vi.fn(),
	jwtCalls: [] as Array<[string, unknown]>,
	sign: vi.fn()
}));

vi.mock("openid-client", () => ({
	authorizationCodeGrant: openIdMocks.authorizationCodeGrant,
	buildAuthorizationUrl: openIdMocks.buildAuthorizationUrl,
	calculatePKCECodeChallenge: openIdMocks.calculatePKCECodeChallenge,
	ClientSecretPost: openIdMocks.clientSecretPost,
	discovery: openIdMocks.discovery,
	randomPKCECodeVerifier: openIdMocks.randomPKCECodeVerifier
}));

vi.mock("jose", () => ({
	importPKCS8: joseMocks.importPKCS8,
	SignJWT: class SignJWT {
		constructor(payload: unknown) {
			joseMocks.jwtCalls.push(["constructor", payload]);
		}

		setAudience(value: unknown) {
			joseMocks.jwtCalls.push(["audience", value]);
			return this;
		}

		setExpirationTime(value: unknown) {
			joseMocks.jwtCalls.push(["expiration", value]);
			return this;
		}

		setIssuedAt() {
			joseMocks.jwtCalls.push(["issuedAt", true]);
			return this;
		}

		setIssuer(value: unknown) {
			joseMocks.jwtCalls.push(["issuer", value]);
			return this;
		}

		setProtectedHeader(value: unknown) {
			joseMocks.jwtCalls.push(["protectedHeader", value]);
			return this;
		}

		setSubject(value: unknown) {
			joseMocks.jwtCalls.push(["subject", value]);
			return this;
		}

		sign(key: unknown) {
			joseMocks.jwtCalls.push(["sign", key]);
			return joseMocks.sign(key);
		}
	}
}));

const {
	createOAuthAuthorizationRequest,
	exchangeOAuthAuthorizationCode,
	resetOAuthClientCacheForTests
} = await import("../src/utils/oauthClient.js");

const originalEnvironment = {
	APPLE_OAUTH_CLIENT_ID: process.env.APPLE_OAUTH_CLIENT_ID,
	APPLE_OAUTH_KEY_ID: process.env.APPLE_OAUTH_KEY_ID,
	APPLE_OAUTH_PRIVATE_KEY: process.env.APPLE_OAUTH_PRIVATE_KEY,
	APPLE_OAUTH_TEAM_ID: process.env.APPLE_OAUTH_TEAM_ID,
	CLASSROOM_ORIGIN: process.env.CLASSROOM_ORIGIN,
	GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	NODE_ENV: process.env.NODE_ENV,
	STUDENT_OAUTH_ENABLED: process.env.STUDENT_OAUTH_ENABLED
};

describe("student OAuth provider client runtime", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		joseMocks.jwtCalls.length = 0;
		resetOAuthClientCacheForTests();
		process.env.NODE_ENV = "development";
		process.env.CLASSROOM_ORIGIN = "https://classes.example.test";
		process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client";
		process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-secret";
		process.env.APPLE_OAUTH_CLIENT_ID = "classes.web";
		process.env.APPLE_OAUTH_KEY_ID = "APPLEKEY";
		process.env.APPLE_OAUTH_TEAM_ID = "APPLETEAM";
		process.env.APPLE_OAUTH_PRIVATE_KEY =
			"-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----";
		process.env.STUDENT_OAUTH_ENABLED = "true";

		openIdMocks.clientSecretPost.mockImplementation(secret => ({
			method: "client_secret_post",
			secret
		}));
		openIdMocks.discovery.mockImplementation(
			async (_issuer: URL, clientID: string) => ({
				clientMetadata: () => ({ client_id: clientID })
			})
		);
		openIdMocks.randomPKCECodeVerifier.mockReturnValue("pkce-verifier");
		openIdMocks.calculatePKCECodeChallenge.mockResolvedValue(
			"pkce-challenge"
		);
		openIdMocks.buildAuthorizationUrl.mockImplementation(
			(_configuration, parameters: Record<string, string>) => {
				const url = new URL(
					"https://provider.example.test/authorize"
				);
				for (const [key, value] of Object.entries(parameters)) {
					url.searchParams.set(key, value);
				}
				return url;
			}
		);
		joseMocks.importPKCS8.mockResolvedValue("private-signing-key");
		joseMocks.sign.mockResolvedValue("short-lived-apple-client-secret");
	});

	afterAll(() => {
		for (const [key, value] of Object.entries(originalEnvironment)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	});

	it("builds Google authorization with state, nonce, S256 PKCE, and no profile scope", async () => {
		const request = await createOAuthAuthorizationRequest(
			"google",
			"oauth-state",
			"oauth-nonce"
		);

		expect(request.codeVerifier).toBe("pkce-verifier");
		expect(request.redirectUrl.searchParams.get("state")).toBe(
			"oauth-state"
		);
		expect(request.redirectUrl.searchParams.get("nonce")).toBe(
			"oauth-nonce"
		);
		expect(request.redirectUrl.searchParams.get("code_challenge")).toBe(
			"pkce-challenge"
		);
		expect(
			request.redirectUrl.searchParams.get("code_challenge_method")
		).toBe("S256");
		expect(request.redirectUrl.searchParams.get("redirect_uri")).toBe(
			"https://classes.example.test/api/students/oauth/google/callback"
		);
		expect(request.redirectUrl.searchParams.get("scope")).toBe("openid");
		expect(request.redirectUrl.searchParams.get("prompt")).toBe(
			"select_account"
		);
		expect(request.redirectUrl.searchParams.has("email")).toBe(false);
		expect(request.redirectUrl.searchParams.has("profile")).toBe(false);
		expect(openIdMocks.clientSecretPost).toHaveBeenCalledWith(
			"google-secret"
		);
	});

	it("generates a short-lived Apple client secret and requests form-post mode without email or name", async () => {
		const request = await createOAuthAuthorizationRequest(
			"apple",
			"oauth-state",
			"oauth-nonce"
		);

		expect(joseMocks.importPKCS8).toHaveBeenCalledWith(
			expect.stringContaining("BEGIN PRIVATE KEY"),
			"ES256"
		);
		expect(joseMocks.jwtCalls).toEqual(expect.arrayContaining([
			["protectedHeader", { alg: "ES256", kid: "APPLEKEY" }],
			["issuer", "APPLETEAM"],
			["audience", "https://appleid.apple.com"],
			["subject", "classes.web"],
			["sign", "private-signing-key"]
		]));
		expect(openIdMocks.clientSecretPost).toHaveBeenCalledWith(
			"short-lived-apple-client-secret"
		);
		expect(request.redirectUrl.searchParams.get("response_mode")).toBe(
			"form_post"
		);
		expect(request.redirectUrl.searchParams.get("scope")).toBe("openid");
		expect(request.redirectUrl.searchParams.get("redirect_uri")).toBe(
			"https://classes.example.test/api/students/oauth/apple/callback"
		);
	});

	it("passes state, nonce, PKCE, and ID-token checks to the provider client", async () => {
		const claims = { sub: "provider-subject" };
		openIdMocks.authorizationCodeGrant.mockResolvedValue({
			claims: () => claims
		});
		const callback = new URL(
			"https://classes.example.test/api/students/oauth/google/callback?code=code&state=state"
		);

		await expect(exchangeOAuthAuthorizationCode("google", callback, {
			codeVerifier: "verifier",
			nonce: "nonce",
			state: "state"
		})).resolves.toBe(claims);
		expect(openIdMocks.authorizationCodeGrant).toHaveBeenCalledWith(
			expect.anything(),
			callback,
			{
				expectedNonce: "nonce",
				expectedState: "state",
				idTokenExpected: true,
				pkceCodeVerifier: "verifier"
			}
		);
	});
});
