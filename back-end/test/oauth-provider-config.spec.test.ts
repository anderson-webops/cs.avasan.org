import { Buffer } from "node:buffer";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
	enabledOAuthProviders,
	normalizeOAuthReturnTo,
	oauthAuthOrigin,
	oauthCallbackUrl,
	oauthProviderCredentials
} from "../src/utils/oauthProviderConfig.js";

const environmentKeys = [
	"APPLE_OAUTH_CLIENT_ID",
	"APPLE_OAUTH_KEY_ID",
	"APPLE_OAUTH_PRIVATE_KEY",
	"APPLE_OAUTH_PRIVATE_KEY_BASE64",
	"APPLE_OAUTH_TEAM_ID",
	"CLASSROOM_ORIGIN",
	"GOOGLE_OAUTH_CLIENT_ID",
	"GOOGLE_OAUTH_CLIENT_SECRET",
	"NODE_ENV",
	"STUDENT_OAUTH_ENABLED"
] as const;

const originalEnvironment = Object.fromEntries(
	environmentKeys.map(key => [key, process.env[key]])
);

function clearOAuthEnvironment() {
	for (const key of environmentKeys) delete process.env[key];
}

describe("student OAuth provider configuration", () => {
	beforeEach(clearOAuthEnvironment);

	afterAll(() => {
		clearOAuthEnvironment();
		for (const [key, value] of Object.entries(originalEnvironment)) {
			if (value !== undefined) process.env[key] = value;
		}
	});

	it("requires an explicit enable flag in addition to complete credentials", () => {
		process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client";
		process.env.APPLE_OAUTH_CLIENT_ID = "student-site";
		process.env.APPLE_OAUTH_KEY_ID = "APPLEKEY";
		process.env.APPLE_OAUTH_TEAM_ID = "APPLETEAM";

		expect(enabledOAuthProviders()).toEqual({
			apple: false,
			google: false
		});

		process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-secret";
		process.env.APPLE_OAUTH_PRIVATE_KEY_BASE64 = Buffer.from(
			"-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----"
		).toString("base64");

		expect(enabledOAuthProviders()).toEqual({
			apple: false,
			google: false
		});

		process.env.STUDENT_OAUTH_ENABLED = "true";
		expect(enabledOAuthProviders()).toEqual({
			apple: true,
			google: true
		});
		expect(oauthProviderCredentials("apple")).toEqual({
			provider: "apple",
			credentials: {
				clientID: "student-site",
				keyID: "APPLEKEY",
				privateKey:
					"-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
				teamID: "APPLETEAM"
			}
		});
	});

	it("uses the classroom origin and student-only callback paths", () => {
		process.env.NODE_ENV = "production";
		expect(oauthAuthOrigin()).toBe("https://cs.avasan.org");
		expect(oauthCallbackUrl("google")).toBe(
			"https://cs.avasan.org/api/students/oauth/google/callback"
		);
		expect(oauthCallbackUrl("apple")).toBe(
			"https://cs.avasan.org/api/students/oauth/apple/callback"
		);

		process.env.NODE_ENV = "development";
		process.env.CLASSROOM_ORIGIN = "http://127.0.0.1:4444";
		expect(oauthAuthOrigin()).toBe("http://127.0.0.1:4444");
		expect(oauthCallbackUrl("google")).toBe(
			"http://127.0.0.1:4444/api/students/oauth/google/callback"
		);
	});

	it("keeps OAuth redirects on a bounded non-API classroom path", () => {
		process.env.CLASSROOM_ORIGIN = "https://cs.avasan.org";

		expect(normalizeOAuthReturnTo("/courses?view=current#python")).toBe(
			"/courses?view=current#python"
		);
		expect(normalizeOAuthReturnTo("https://attacker.example")).toBe("/");
		expect(normalizeOAuthReturnTo("//attacker.example")).toBe("/");
		expect(normalizeOAuthReturnTo("/api/students/session")).toBe("/");
		expect(normalizeOAuthReturnTo("/courses\\attacker")).toBe("/");
		expect(normalizeOAuthReturnTo("x".repeat(501))).toBe("/");
	});
});
