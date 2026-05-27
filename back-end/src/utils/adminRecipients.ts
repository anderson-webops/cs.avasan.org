import { readFileSync } from "node:fs";
import { env } from "node:process";
import { z } from "zod";

export interface AdminRecipient {
	name: string;
	emails: string[];
}

const AdminRecipientSchema = z.object({
	name: z.string().trim().min(1),
	emails: z.array(z.string().trim().email()).min(1)
});

const AdminRecipientsSchema = z.array(AdminRecipientSchema);

function sourceRecipientConfig(): string {
	if (env.ADMIN_MAIL_RECIPIENTS_FILE) {
		return readFileSync(env.ADMIN_MAIL_RECIPIENTS_FILE, "utf8");
	}

	return env.ADMIN_MAIL_RECIPIENTS_JSON
		|| env.ADMIN_RECIPIENTS_JSON
		|| "[]";
}

export function loadAdminRecipients(): AdminRecipient[] {
	const rawConfig = sourceRecipientConfig().trim();
	if (!rawConfig) return [];

	let parsedJson: unknown;
	try {
		parsedJson = JSON.parse(rawConfig);
	}
	catch {
		throw new Error(
			"ADMIN_MAIL_RECIPIENTS_JSON must be valid JSON or ADMIN_MAIL_RECIPIENTS_FILE must point to a JSON file."
		);
	}

	const parsed = AdminRecipientsSchema.safeParse(parsedJson);
	if (!parsed.success) {
		throw new Error(
			`Admin recipient configuration is invalid: ${parsed.error.issues
				.map(issue => `${issue.path.join(".") || "root"} ${issue.message}`)
				.join("; ")}`
		);
	}

	return parsed.data.map(recipient => ({
		name: recipient.name.trim(),
		emails: [
			...new Set(
				recipient.emails.map(email => email.trim().toLowerCase())
			)
		]
	}));
}
