import { randomBytes } from "node:crypto";
import argon2 from "argon2";

export const ACCESS_CODE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
export const MIN_STUDENT_PASSWORD_LENGTH = 10;
export const MAX_STUDENT_PASSWORD_LENGTH = 128;
export const STUDENT_SETUP_SESSION_MS = 30 * 60 * 1000;
export const STUDENT_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
export const STUDENT_ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000;

const STUDENT_USERNAME_RE = /^[a-z][a-z0-9-]{2,23}$/;
const ACCESS_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const ACCESS_CODE_SYMBOL_COUNT = 20;
const DUMMY_SECRET = "not-a-real-student-credential";
const dummyCredentialHash = argon2.hash(DUMMY_SECRET);

export function normalizeStudentUsername(value: string): string {
	return value.trim().toLowerCase();
}

export function isValidStudentUsername(value: unknown): value is string {
	return typeof value === "string"
		&& STUDENT_USERNAME_RE.test(normalizeStudentUsername(value));
}

export function isValidStudentPassword(value: unknown): value is string {
	return typeof value === "string"
		&& value.length >= MIN_STUDENT_PASSWORD_LENGTH
		&& value.length <= MAX_STUDENT_PASSWORD_LENGTH
		&& value.trim().length > 0;
}

/**
 * Twenty independently sampled symbols from a 31-character alphabet provide
 * more than 99 bits of entropy. Characters commonly confused by children
 * (0/O and 1/I/L) are excluded, and grouping makes codes easier to read aloud.
 */
export function generateStudentAccessCode(): string {
	let value = "";
	const unbiasedByteCeiling = Math.floor(256 / ACCESS_CODE_ALPHABET.length)
		* ACCESS_CODE_ALPHABET.length;

	while (value.length < ACCESS_CODE_SYMBOL_COUNT) {
		for (const byte of randomBytes(ACCESS_CODE_SYMBOL_COUNT)) {
			if (byte >= unbiasedByteCeiling) continue;
			value += ACCESS_CODE_ALPHABET[byte % ACCESS_CODE_ALPHABET.length];
			if (value.length === ACCESS_CODE_SYMBOL_COUNT) break;
		}
	}

	return value.match(/.{1,4}/g)?.join("-") ?? value;
}

export function normalizeStudentAccessCode(value: string): string {
	return value.replace(/[\s-]+/g, "").toUpperCase();
}

export function studentAccessCodeExpiry(now = new Date()): Date {
	return new Date(now.getTime() + ACCESS_CODE_LIFETIME_MS);
}

export function hashStudentCredential(value: string): Promise<string> {
	return argon2.hash(value);
}

export async function verifyStudentCredential(
	hash: string | undefined,
	value: string
): Promise<boolean> {
	const credentialHash = hash ?? await dummyCredentialHash;
	try {
		return await argon2.verify(credentialHash, value);
	}
	catch {
		return false;
	}
}
