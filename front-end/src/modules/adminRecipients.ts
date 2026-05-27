import { api } from "@/api";

export interface AdminRecipient {
	name: string;
	emails: string[];
}

interface AdminRecipientsResponse {
	recipients?: AdminRecipient[];
}

export async function fetchAdminRecipients(): Promise<AdminRecipient[]> {
	const { data } = await api.get<AdminRecipientsResponse>(
		"/admin-mail/recipients",
		{ withCredentials: true }
	);

	return Array.isArray(data.recipients) ? data.recipients : [];
}
