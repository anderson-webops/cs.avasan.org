import type { Request, RequestHandler } from "express";
import { env } from "node:process";
import bodyParser from "body-parser";
import { ipKeyGenerator } from "express-rate-limit";

/**
 * A project may contain 12,000,000 UTF-16 code units. JSON can expand one
 * code unit to a six-byte escape (for example, a control character), so the
 * parser needs a little more than 72 MB for the largest valid payload plus its
 * file names and metadata.
 */
export const DEFAULT_PROJECT_JSON_BODY_LIMIT = "80mb";
export const HEAVY_PROJECT_PAYLOAD_THRESHOLD_BYTES = 4 * 1024 * 1024;
export const MAX_CONCURRENT_HEAVY_PROJECT_PAYLOADS = 1;
export const MAX_CONCURRENT_HEAVY_PROJECT_PAYLOADS_PER_IDENTITY = 1;
export const MAX_CONCURRENT_NORMAL_PROJECT_PAYLOADS = 8;
export const MAX_CONCURRENT_NORMAL_PROJECT_PAYLOADS_PER_IDENTITY = 2;

interface ProjectPayloadConcurrencyOptions {
	globalLimit?: number;
	heavyThresholdBytes?: number;
	normalGlobalLimit?: number;
	normalPerIdentityLimit?: number;
	perIdentityLimit?: number;
}

export function isHeavyProjectPayload(
	req: Request,
	thresholdBytes = HEAVY_PROJECT_PAYLOAD_THRESHOLD_BYTES
): boolean {
	const transferEncoding = req.get("transfer-encoding");
	if (transferEncoding) return true;

	const contentEncoding = req.get("content-encoding")?.trim().toLowerCase();
	if (contentEncoding && contentEncoding !== "identity") return true;

	const rawContentLength = req.get("content-length")?.trim();
	if (!rawContentLength || !/^\d+$/.test(rawContentLength)) return true;

	const contentLength = Number(rawContentLength);
	return !Number.isSafeInteger(contentLength)
		|| contentLength > thresholdBytes;
}

/**
 * Bind the expensive-body tier to the identity established by validStudent or
 * validAdmin. Forwarding headers are only a fallback for defensive reuse
 * outside those authenticated route stacks.
 */
export function projectPayloadIdentity(req: Request): string {
	const studentID = req.currentStudent?._id?.toString();
	if (studentID) return `student:${studentID}`;

	const adminID = req.currentAdmin?._id?.toString();
	if (adminID) return `admin:${adminID}`;

	return `network:${ipKeyGenerator(
		req.ip || req.socket.remoteAddress || "unknown"
	)}`;
}

export function createProjectJsonParser(
	limit = env.PYTHON_IDE_PROJECT_BODY_LIMIT || DEFAULT_PROJECT_JSON_BODY_LIMIT
): RequestHandler {
	// Browser project writes are uncompressed. Refusing request compression
	// prevents a small declared body from inflating into an 80 MB allocation.
	return bodyParser.json({ inflate: false, limit });
}

/**
 * Admit one heavy body process-wide. Small bodies retain a wider classroom
 * tier, but one identity cannot create an unbounded sub-threshold allocation
 * burst. A slot remains held through the response because the parsed body
 * remains reachable while the controller validates and writes it.
 */
export function createProjectPayloadConcurrencyGuard(
	options: ProjectPayloadConcurrencyOptions = {}
): RequestHandler {
	const globalLimit = options.globalLimit
		?? MAX_CONCURRENT_HEAVY_PROJECT_PAYLOADS;
	const heavyThresholdBytes = options.heavyThresholdBytes
		?? HEAVY_PROJECT_PAYLOAD_THRESHOLD_BYTES;
	const normalGlobalLimit = options.normalGlobalLimit
		?? MAX_CONCURRENT_NORMAL_PROJECT_PAYLOADS;
	const normalPerIdentityLimit = options.normalPerIdentityLimit
		?? MAX_CONCURRENT_NORMAL_PROJECT_PAYLOADS_PER_IDENTITY;
	const perIdentityLimit = options.perIdentityLimit
		?? MAX_CONCURRENT_HEAVY_PROJECT_PAYLOADS_PER_IDENTITY;
	const activeByIdentity = new Map<string, {
		heavy: number;
		normal: number;
	}>();
	let activeHeavyTotal = 0;
	let activeNormalTotal = 0;

	return (req, res, next) => {
		const isHeavy = isHeavyProjectPayload(req, heavyThresholdBytes);
		const identity = projectPayloadIdentity(req);
		const activeForIdentity = activeByIdentity.get(identity)
			?? { heavy: 0, normal: 0 };
		const rejected = isHeavy
			? (
					activeHeavyTotal >= globalLimit
					|| activeForIdentity.heavy + activeForIdentity.normal
					>= perIdentityLimit
				)
			: (
					activeNormalTotal >= normalGlobalLimit
					|| activeForIdentity.heavy > 0
					|| activeForIdentity.normal >= normalPerIdentityLimit
				);
		if (rejected) {
			res.setHeader("Retry-After", "1");
			res.status(429).json({
				message: isHeavy
					? "Another large project save is already in progress. Try again shortly."
					: "Too many project saves are already in progress. Try again shortly."
			});
			return;
		}

		if (isHeavy) {
			activeHeavyTotal += 1;
			activeForIdentity.heavy += 1;
		}
		else {
			activeNormalTotal += 1;
			activeForIdentity.normal += 1;
		}
		activeByIdentity.set(identity, activeForIdentity);
		let released = false;
		const release = () => {
			if (released) return;
			released = true;
			const current = activeByIdentity.get(identity);
			if (isHeavy) {
				activeHeavyTotal -= 1;
				if (current) current.heavy -= 1;
			}
			else {
				activeNormalTotal -= 1;
				if (current) current.normal -= 1;
			}
			if (!current || current.heavy + current.normal <= 0) {
				activeByIdentity.delete(identity);
			}
			else {
				activeByIdentity.set(identity, current);
			}
		};
		req.once("aborted", release);
		res.once("close", release);
		res.once("finish", release);

		try {
			next();
		}
		catch (error) {
			release();
			throw error;
		}
	};
}
