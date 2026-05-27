import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadAdminRecipients } from "../src/utils/adminRecipients.js";

const originalJson = process.env.ADMIN_MAIL_RECIPIENTS_JSON;
const originalLegacyJson = process.env.ADMIN_RECIPIENTS_JSON;
const originalFile = process.env.ADMIN_MAIL_RECIPIENTS_FILE;

function clearRecipientEnv() {
	delete process.env.ADMIN_MAIL_RECIPIENTS_JSON;
	delete process.env.ADMIN_RECIPIENTS_JSON;
	delete process.env.ADMIN_MAIL_RECIPIENTS_FILE;
}

describe("admin recipient configuration", () => {
	afterEach(() => {
		if (originalJson === undefined) {
			delete process.env.ADMIN_MAIL_RECIPIENTS_JSON;
		}
		else {
			process.env.ADMIN_MAIL_RECIPIENTS_JSON = originalJson;
		}

		if (originalLegacyJson === undefined) {
			delete process.env.ADMIN_RECIPIENTS_JSON;
		}
		else {
			process.env.ADMIN_RECIPIENTS_JSON = originalLegacyJson;
		}

		if (originalFile === undefined) {
			delete process.env.ADMIN_MAIL_RECIPIENTS_FILE;
		}
		else {
			process.env.ADMIN_MAIL_RECIPIENTS_FILE = originalFile;
		}
	});

	it("loads recipients from JSON stored in server-side configuration", () => {
		clearRecipientEnv();
		process.env.ADMIN_MAIL_RECIPIENTS_JSON = JSON.stringify([
			{
				name: "Test Recipient",
				emails: ["Primary@Example.invalid", "primary@example.invalid", "cc@example.invalid"]
			}
		]);

		expect(loadAdminRecipients()).toEqual([
			{
				name: "Test Recipient",
				emails: ["primary@example.invalid", "cc@example.invalid"]
			}
		]);
	});

	it("loads recipients from a server-side JSON file when configured", () => {
		clearRecipientEnv();
		const dir = mkdtempSync(join(tmpdir(), "classes-admin-recipients-"));
		const file = join(dir, "recipients.json");
		writeFileSync(
			file,
			JSON.stringify([{ name: "File Recipient", emails: ["file@example.invalid"] }])
		);
		process.env.ADMIN_MAIL_RECIPIENTS_FILE = file;

		try {
			expect(loadAdminRecipients()).toEqual([
				{ name: "File Recipient", emails: ["file@example.invalid"] }
			]);
		}
		finally {
			rmSync(dir, { force: true, recursive: true });
		}
	});

	it("rejects malformed recipient configuration", () => {
		clearRecipientEnv();
		process.env.ADMIN_MAIL_RECIPIENTS_JSON = JSON.stringify([
			{ name: "Broken Recipient", emails: ["not-an-email"] }
		]);

		expect(() => loadAdminRecipients()).toThrow(
			"Admin recipient configuration is invalid"
		);
	});
});
