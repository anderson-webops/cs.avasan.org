import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import { OAuthLoginAttempt } from "../src/models/schemas/OAuthLoginAttempt.js";

const stateHash = "a".repeat(64);
const browserBindingHash = "b".repeat(64);
const nonce = "n".repeat(43);
const codeVerifier = "v".repeat(43);

function baseAttempt() {
	return {
		browserBindingHash,
		codeVerifier,
		expiresAt: new Date(Date.now() + 60_000),
		nonce,
		provider: "google" as const,
		returnTo: "/courses",
		stateHash
	};
}

describe("OAuth login attempt model", () => {
	it("accepts a provider-only sign-in attempt without student proof", async () => {
		const attempt = new OAuthLoginAttempt({
			...baseAttempt(),
			mode: "signin"
		});

		await expect(attempt.validate()).resolves.toBeUndefined();
	});

	it("requires a complete setup-session proof for a student link attempt", async () => {
		const complete = new OAuthLoginAttempt({
			...baseAttempt(),
			mode: "link",
			studentID: new Types.ObjectId(),
			studentSessionVersion: 0
		});
		await expect(complete.validate()).resolves.toBeUndefined();

		const incomplete = new OAuthLoginAttempt({
			...baseAttempt(),
			mode: "link",
			studentID: new Types.ObjectId()
		});
		await expect(incomplete.validate()).rejects.toMatchObject({
			errors: {
				mode: {
					message:
						"Student link attempts require a complete setup-session proof."
				}
			}
		});
	});

	it("rejects student proof on a normal provider sign-in attempt", async () => {
		const attempt = new OAuthLoginAttempt({
			...baseAttempt(),
			mode: "signin",
			studentID: new Types.ObjectId(),
			studentSessionVersion: 2
		});

		await expect(attempt.validate()).rejects.toMatchObject({
			errors: {
				mode: {
					message:
						"Student sign-in attempts cannot contain a setup-session proof."
				}
			}
		});
	});

	it("keeps secrets unselected and expires attempts with a TTL index", () => {
		for (const path of [
			"browserBindingHash",
			"codeVerifier",
			"nonce",
			"stateHash",
			"studentID",
			"studentSessionVersion"
		]) {
			expect(OAuthLoginAttempt.schema.path(path).options.select).toBe(false);
		}

		expect(OAuthLoginAttempt.schema.path("studentAccessCodeHash")).toBeUndefined();

		expect(OAuthLoginAttempt.schema.indexes()).toContainEqual([
			{ expiresAt: 1 },
			expect.objectContaining({ expireAfterSeconds: 0 })
		]);
	});
});
