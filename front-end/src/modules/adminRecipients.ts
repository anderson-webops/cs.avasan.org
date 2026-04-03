export interface AdminRecipient {
	name: string;
	emails: string[];
}

export const ADMIN_RECIPIENTS: AdminRecipient[] = [
	{ name: "Recipient 1", emails: ["recipient-1@example.invalid"] },
	{ name: "Recipient 2", emails: ["recipient-2@example.invalid", "recipient-2@example.invalid"] },
	{ name: "Recipient 3", emails: ["recipient-3@example.invalid"] },
	{ name: "Recipient 4", emails: ["recipient-4@example.invalid"] },
	{ name: "Recipient 5", emails: ["recipient-5@example.invalid"] },
	{ name: "Recipient 6", emails: ["recipient-6@example.invalid"] },
	{
		name: "Test",
		emails: ["classes@jacobdanderson.net", "classes@jacobdanderson.net"]
	}
];

export const ADMIN_RECIPIENT_NAMES = ADMIN_RECIPIENTS.map(
	recipient => recipient.name
);
