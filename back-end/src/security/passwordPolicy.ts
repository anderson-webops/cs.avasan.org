export const MIN_TEACHER_PASSWORD_LENGTH = 14;

export function isValidTeacherPassword(password: unknown): password is string {
	return typeof password === "string"
		&& password.length >= MIN_TEACHER_PASSWORD_LENGTH;
}
