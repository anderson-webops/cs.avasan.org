import { api } from "@/api";

export interface StudentAccount {
	_id: string;
	username: string;
	active: boolean;
	credentialState?:
		"access-code" | "expired-code" | "none" | "password" | "setup";
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
