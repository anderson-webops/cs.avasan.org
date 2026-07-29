import { Buffer } from "node:buffer";

export function readBooleanSetting(
	value: string | undefined,
	name: string
): boolean {
	if (value === undefined || value.trim() === "") return false;

	switch (value.trim().toLowerCase()) {
		case "1":
		case "true":
		case "yes":
			return true;
		case "0":
		case "false":
		case "no":
			return false;
		default:
			throw new Error(`${name} must be true or false when configured.`);
	}
}

export const PRODUCTION_CLASSROOM_ORIGIN = "https://cs.avasan.org";
export const MIN_PRODUCTION_SESSION_SECRET_BYTES = 32;

export function readSessionSecret(
	value: string | undefined,
	isProduction: boolean
): string {
	if (!value || value.trim() === "") {
		throw new Error("Missing SESSION_SECRET");
	}
	if (
		isProduction
		&& Buffer.byteLength(value, "utf8") < MIN_PRODUCTION_SESSION_SECRET_BYTES
	) {
		throw new Error(
			`SESSION_SECRET must be at least ${MIN_PRODUCTION_SESSION_SECRET_BYTES} UTF-8 bytes in production.`
		);
	}

	return value;
}

export function readClassroomOrigin(
	value: string | undefined,
	isProduction: boolean
): string | undefined {
	const configured = value?.trim();
	if (!configured) {
		return isProduction ? PRODUCTION_CLASSROOM_ORIGIN : undefined;
	}

	let parsed: URL;
	try {
		parsed = new URL(configured);
	}
	catch {
		throw new Error("CLASSROOM_ORIGIN must be a valid web origin.");
	}

	if (
		parsed.origin === "null"
		|| (parsed.protocol !== "http:" && parsed.protocol !== "https:")
		|| parsed.username
		|| parsed.password
		|| (parsed.pathname !== "/" && parsed.pathname !== "")
		|| parsed.search
		|| parsed.hash
	) {
		throw new Error("CLASSROOM_ORIGIN must contain only a web origin.");
	}
	if (isProduction && parsed.protocol !== "https:") {
		throw new Error("CLASSROOM_ORIGIN must use HTTPS in production.");
	}

	return parsed.origin;
}
