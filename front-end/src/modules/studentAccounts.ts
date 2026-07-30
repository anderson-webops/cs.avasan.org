import { api } from "@/api";

export interface StudentAccount {
	_id: string;
	username: string;
	active: boolean;
	credentialState?:
		| "access-code"
		| "expired-code"
		| "none"
		| "password"
		| "setup"
		| "social";
	socialProviders?: ("apple" | "google")[];
	accessCodeExpiresAt?: string | null;
	passwordSetAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
	lastLoginAt?: string | null;
	projectCount?: number;
	lastProjectSavedAt?: string | null;
}

export interface StudentSession {
	student: StudentAccount | null;
	requiresPasswordSetup: boolean;
	passwordSetupRequestID?: string | null;
}

export interface AuthenticatedStudentSession extends StudentSession {
	student: StudentAccount;
}

export interface StudentAccessCode {
	student: StudentAccount;
	accessCode: string;
}

export interface StudentRecordDownload {
	blob: Blob;
}

export interface StudentDeletionReceipt {
	operationID: string;
	status: "completed" | "in-progress" | "needs-retry";
	subject: {
		studentID: string;
		username: string;
	};
	requestedAt: string;
	completedAt: string | null;
	expiresAt: string;
	deletedRecords: {
		oauthAttempts: number;
		projects: number;
		reviews: number;
		students: number;
	} | null;
}

export async function fetchStudentSession(passwordSetupRequestID?: string) {
	const { data } = passwordSetupRequestID
		? await api.get<StudentSession>("/students/session", {
				headers: {
					"X-Password-Setup-Request-ID": passwordSetupRequestID
				}
			})
		: await api.get<StudentSession>("/students/session");
	return data;
}

export async function refreshStudentSessionActivity() {
	const { data } = await api.get<StudentSession>("/students/session", {
		headers: { "X-Student-Activity": "1" }
	});
	return data;
}

export async function signInStudent(username: string, secret: string) {
	const { data } = await api.post<AuthenticatedStudentSession>(
		"/students/session",
		{
			username,
			secret
		}
	);
	return data;
}

export async function setStudentPassword(password: string, requestID: string) {
	const { data } = await api.put<AuthenticatedStudentSession>(
		"/students/session/password",
		{ password, requestID }
	);
	return data;
}

export async function signOutStudent() {
	await api.delete("/students/session");
}

export async function fetchAdminStudents() {
	const { data } = await api.get<{ students: StudentAccount[] }>(
		"/admins/students"
	);
	return data.students;
}

export async function fetchAdminStudentDeletionReceipts() {
	const { data } = await api.get<{
		receipts: StudentDeletionReceipt[];
		retentionDays: number;
	}>("/admins/student-deletion-receipts");
	return data;
}

export async function createAdminStudent(
	username: string,
	teacherPassword: string
) {
	const { data } = await api.post<StudentAccessCode>("/admins/students", {
		username,
		teacherPassword
	});
	return data;
}

export async function setAdminStudentActive(
	studentID: string,
	active: boolean
) {
	const { data } = await api.patch<{ student: StudentAccount }>(
		`/admins/students/${studentID}`,
		{ active }
	);
	return data.student;
}

export async function resetAdminStudentAccess(
	studentID: string,
	teacherPassword: string
) {
	const { data } = await api.post<StudentAccessCode>(
		`/admins/students/${studentID}/access-code`,
		{ teacherPassword }
	);
	return data;
}

export async function exportAdminStudentRecords(
	studentID: string,
	teacherPassword: string
) {
	const { data } = await api.post<Blob>(
		`/admins/students/${studentID}/export`,
		{ teacherPassword },
		{ responseType: "blob" }
	);
	return { blob: data as unknown as Blob } satisfies StudentRecordDownload;
}

export async function deleteAdminStudentRecords(
	studentID: string,
	confirmUsername: string,
	teacherPassword: string
) {
	const { data } = await api.delete<{
		deleted: true;
		deletedRecords: {
			oauthAttempts: number;
			projects: number;
			reviews: number;
			students: number;
		};
		operatorFollowUp: {
			backupDeletionRequired: true;
			instruction: string;
		};
		operation: {
			id: string;
			kind: "student-record-delete";
			performedBy: "Julio";
			performedAt: string;
		};
		receipt: StudentDeletionReceipt;
	}>(`/admins/students/${studentID}`, {
		data: { confirmUsername, teacherPassword }
	});
	return data;
}
