import type { Request as ExpressRequest, RequestHandler, Response } from "express";
import type { ExternalIdentityProvider } from "../../types/entities/IExternalIdentity.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Buffer } from "node:buffer";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { OAuthLoginAttempt } from "../../models/schemas/OAuthLoginAttempt.js";
import { Student } from "../../models/schemas/Student.js";
import { acquireStudentDataWriteLease } from "../../security/studentDataWriteBarrier.js";
import { createOAuthAuthorizationRequest, exchangeOAuthAuthorizationCode } from "../../utils/oauthClient.js";
import {
	enabledOAuthProviders,
	normalizeOAuthReturnTo,
	oauthAuthOrigin,
	oauthCallbackUrl,
	oauthProviderCredentials
} from "../../utils/oauthProviderConfig.js";
import {
	clearStudentOAuthBrowserBinding,
	clearStudentOAuthBrowserBindings,
	setStudentOAuthBrowserBinding,
	STUDENT_OAUTH_ATTEMPT_LIFETIME_MS,
	studentOAuthBrowserBindingFromRequest
} from "../../utils/studentOAuthCookies.js";
import { hasLiveAuthenticatedIdentity, setStudentIdentity } from "./studentController.js";

const OAUTH_TOKEN_PATTERN = /^[\w~-]{32,256}$/u;
const OAUTH_SUBJECT_MAX_LENGTH = 255;

type OAuthErrorCode
	= | "already_signed_in"
		| "cancelled"
		| "identity_conflict"
		| "link_expired"
		| "not_linked"
		| "provider_error"
		| "provider_unavailable";

function isProvider(value: unknown): value is ExternalIdentityProvider {
	return value === "apple" || value === "google";
}

function hashSecret(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

function externalSubjectHash(provider: ExternalIdentityProvider, subject: string) {
	return hashSecret(`${provider}\0${subject}`);
}

function secureHashMatch(candidate: string, expectedHash: string) {
	if (!OAUTH_TOKEN_PATTERN.test(candidate) || !/^[a-f\d]{64}$/iu.test(expectedHash)) {
		return false;
	}
	const candidateHash = Buffer.from(hashSecret(candidate), "hex");
	const expected = Buffer.from(expectedHash, "hex");
	return candidateHash.length === expected.length && timingSafeEqual(candidateHash, expected);
}

function requestParameter(req: ExpressRequest, key: string) {
	const value = req.method === "POST" ? req.body?.[key] : req.query[key];
	return typeof value === "string" ? value : null;
}

function callbackRequest(provider: ExternalIdentityProvider, req: ExpressRequest): globalThis.Request | URL {
	if (req.method !== "POST") {
		const callbackUrl = new URL(oauthCallbackUrl(provider));
		for (const key of ["code", "error", "error_description", "state"]) {
			const value = req.query[key];
			if (typeof value === "string") callbackUrl.searchParams.set(key, value);
		}
		return callbackUrl;
	}

	const body = new URLSearchParams();
	for (const key of ["code", "error", "error_description", "state"]) {
		const value = req.body?.[key];
		if (typeof value === "string") body.set(key, value);
	}
	return new globalThis.Request(oauthCallbackUrl(provider), {
		body,
		headers: { "content-type": "application/x-www-form-urlencoded" },
		method: "POST"
	});
}

function withOAuthResult(returnTo: string, key: "studentOAuthError" | "studentOAuthStatus", value: string) {
	const destination = new URL(returnTo, oauthAuthOrigin());
	destination.searchParams.delete("studentOAuthError");
	destination.searchParams.delete("studentOAuthStatus");
	destination.searchParams.set(key, value);
	return `${destination.pathname}${destination.search}${destination.hash}`;
}

function redirectWithError(res: Response, returnTo: string, errorCode: OAuthErrorCode) {
	return res.redirect(303, withOAuthResult(returnTo, "studentOAuthError", errorCode));
}

function logOAuthFailure(provider: ExternalIdentityProvider, error: unknown) {
	const category = error instanceof Error ? error.name : "UnknownError";
	console.error(`Student OAuth ${provider} sign-in failed (${category}).`);
}

function duplicateKeyError(error: unknown) {
	return (
		typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000
	);
}

async function createAttempt(
	res: Response,
	provider: ExternalIdentityProvider,
	returnTo: string,
	linkProof?: {
		studentID: string;
		studentSessionVersion: number;
	}
) {
	const state = randomBytes(32).toString("base64url");
	const nonce = randomBytes(32).toString("base64url");
	const browserBinding = randomBytes(32).toString("base64url");
	clearStudentOAuthBrowserBindings(res);

	try {
		const authorization = await createOAuthAuthorizationRequest(provider, state, nonce);
		await OAuthLoginAttempt.create({
			browserBindingHash: hashSecret(browserBinding),
			codeVerifier: authorization.codeVerifier,
			expiresAt: new Date(Date.now() + STUDENT_OAUTH_ATTEMPT_LIFETIME_MS),
			mode: linkProof ? "link" : "signin",
			nonce,
			provider,
			returnTo,
			stateHash: hashSecret(state),
			...(linkProof ?? {})
		});
		setStudentOAuthBrowserBinding(res, provider, browserBinding);
		return authorization.redirectUrl.toString();
	}
	catch (error) {
		await OAuthLoginAttempt.deleteOne({
			provider,
			stateHash: hashSecret(state)
		})
			.exec()
			.catch(() => undefined);
		clearStudentOAuthBrowserBinding(res, provider);
		throw error;
	}
}

export const getStudentOAuthProviders: RequestHandler = (_req, res) => {
	res.json(enabledOAuthProviders());
};

export const startStudentOAuthSignIn: RequestHandler = async (req, res) => {
	const provider = req.params.provider;
	const returnTo = normalizeOAuthReturnTo(req.query.returnTo);
	if (!isProvider(provider) || !oauthProviderCredentials(provider)) {
		return redirectWithError(res, returnTo, "provider_unavailable");
	}
	if (await hasLiveAuthenticatedIdentity(req)) {
		clearStudentOAuthBrowserBindings(res);
		return redirectWithError(res, returnTo, "already_signed_in");
	}

	try {
		const authorizationUrl = await createAttempt(res, provider, returnTo);
		return res.redirect(302, authorizationUrl);
	}
	catch (error) {
		logOAuthFailure(provider, error);
		return redirectWithError(res, returnTo, "provider_error");
	}
};

export const connectStudentOAuthProvider: RequestHandler = async (req, res) => {
	const provider = req.params.provider;
	const returnTo = normalizeOAuthReturnTo(req.body?.returnTo);
	if (!isProvider(provider) || !oauthProviderCredentials(provider)) {
		return res.status(503).json({
			message: "That sign-in provider is not currently available."
		});
	}
	if (
		!req.body
		|| typeof req.body !== "object"
		|| Array.isArray(req.body)
		|| Object.keys(req.body).some(key => key !== "returnTo")
	) {
		return res.status(400).json({
			message: "Only the return destination is accepted."
		});
	}

	const session = req.session as CustomSession | undefined;
	if (
		!session?.studentID
		|| session.studentAuthLevel !== "setup"
		|| !Number.isSafeInteger(session.studentSessionVersion)
		|| !Number.isSafeInteger(session.studentSetupExpiresAt)
		|| (session.studentSetupExpiresAt ?? 0) <= Date.now()
	) {
		clearStudentOAuthBrowserBindings(res);
		return res.status(403).json({
			message: "Student setup session expired."
		});
	}

	const student = await Student.findOne({
		_id: session.studentID,
		accessCodeExpiresAt: { $gt: new Date() },
		active: true,
		externalAuthProvider: { $exists: false },
		externalAuthSubjectHash: { $exists: false },
		pendingSetupCodeHash: { $exists: true },
		sessionVersion: session.studentSessionVersion
	})
		.select("+sessionVersion +pendingSetupCodeHash")
		.exec();
	if (!student) {
		clearStudentOAuthBrowserBindings(res);
		return res.status(403).json({
			message: "Student setup session expired."
		});
	}

	try {
		const authorizationUrl = await createAttempt(res, provider, returnTo, {
			studentID: student._id.toString(),
			studentSessionVersion: student.sessionVersion
		});
		return res.json({ authorizationUrl });
	}
	catch (error) {
		logOAuthFailure(provider, error);
		return res.status(502).json({
			message: "Could not start Google or Apple sign-in."
		});
	}
};

export const finishStudentOAuth: RequestHandler = async (req, res) => {
	const provider = req.params.provider;
	if (!isProvider(provider) || !oauthProviderCredentials(provider)) {
		return redirectWithError(res, "/", "provider_unavailable");
	}
	if (provider === "apple" && req.method === "POST" && !req.is("application/x-www-form-urlencoded")) {
		return res.sendStatus(415);
	}

	const state = requestParameter(req, "state");
	if (!state || !OAUTH_TOKEN_PATTERN.test(state)) {
		clearStudentOAuthBrowserBinding(res, provider);
		return redirectWithError(res, "/", "provider_error");
	}

	const attempt = await OAuthLoginAttempt.findOne({
		expiresAt: { $gt: new Date() },
		provider,
		stateHash: hashSecret(state)
	})
		.select("+browserBindingHash +codeVerifier +nonce +stateHash" + " +studentID +studentSessionVersion")
		.exec();
	const returnTo = normalizeOAuthReturnTo(attempt?.returnTo);
	const browserBinding = studentOAuthBrowserBindingFromRequest(req, provider);
	if (!attempt || !browserBinding || !secureHashMatch(browserBinding, attempt.browserBindingHash)) {
		clearStudentOAuthBrowserBinding(res, provider);
		return redirectWithError(res, returnTo, attempt?.mode === "link" ? "link_expired" : "provider_error");
	}

	const consumedAttempt = await OAuthLoginAttempt.findOneAndDelete({
		_id: attempt._id,
		expiresAt: { $gt: new Date() }
	})
		.select("+browserBindingHash +codeVerifier +nonce +stateHash" + " +studentID +studentSessionVersion")
		.exec();
	clearStudentOAuthBrowserBindings(res);
	if (!consumedAttempt) {
		return redirectWithError(res, returnTo, attempt.mode === "link" ? "link_expired" : "provider_error");
	}

	const providerError = requestParameter(req, "error");
	if (providerError) {
		const cancelled = providerError === "access_denied" || providerError === "user_cancelled_authorize";
		return redirectWithError(res, returnTo, cancelled ? "cancelled" : "provider_error");
	}
	if (consumedAttempt.mode === "signin" && (await hasLiveAuthenticatedIdentity(req))) {
		return redirectWithError(res, returnTo, "already_signed_in");
	}

	let releaseLinkWriteLease: (() => void) | null = null;
	if (consumedAttempt.mode === "link") {
		if (!consumedAttempt.studentID || !Number.isSafeInteger(consumedAttempt.studentSessionVersion)) {
			return redirectWithError(res, returnTo, "link_expired");
		}
		releaseLinkWriteLease = acquireStudentDataWriteLease(consumedAttempt.studentID.toString().toLowerCase());
		if (!releaseLinkWriteLease) {
			return redirectWithError(res, returnTo, "link_expired");
		}
	}

	try {
		const claims = await exchangeOAuthAuthorizationCode(provider, callbackRequest(provider, req), {
			codeVerifier: consumedAttempt.codeVerifier,
			nonce: consumedAttempt.nonce,
			state
		});
		const subject = typeof claims.sub === "string" ? claims.sub.trim() : "";
		if (!subject || subject.length > OAUTH_SUBJECT_MAX_LENGTH) {
			return redirectWithError(res, returnTo, "provider_error");
		}
		const subjectHash = externalSubjectHash(provider, subject);
		const authenticatedAt = new Date();

		let authenticatedStudent;
		if (consumedAttempt.mode === "link") {
			try {
				authenticatedStudent = await Student.findOneAndUpdate(
					{
						_id: consumedAttempt.studentID,
						accessCodeExpiresAt: { $gt: authenticatedAt },
						active: true,
						externalAuthProvider: { $exists: false },
						externalAuthSubjectHash: { $exists: false },
						pendingSetupCodeHash: { $exists: true },
						sessionVersion: consumedAttempt.studentSessionVersion
					},
					{
						$inc: { sessionVersion: 1 },
						$set: {
							externalAuthProvider: provider,
							externalAuthSubjectHash: subjectHash,
							failedLoginAttempts: 0,
							lastLoginAt: authenticatedAt
						},
						$unset: {
							accessCodeHash: 1,
							accessCodeExpiresAt: 1,
							lastPasswordSetupRequestID: 1,
							lockedUntil: 1,
							passwordHash: 1,
							passwordSetAt: 1,
							pendingSetupCodeHash: 1
						}
					},
					{ new: true }
				).select("+sessionVersion");
			}
			catch (error) {
				if (duplicateKeyError(error)) {
					return redirectWithError(res, returnTo, "identity_conflict");
				}
				throw error;
			}
			if (!authenticatedStudent) {
				return redirectWithError(res, returnTo, "link_expired");
			}
		}
		else {
			authenticatedStudent = await Student.findOneAndUpdate(
				{
					active: true,
					externalAuthProvider: provider,
					externalAuthSubjectHash: subjectHash
				},
				{
					$inc: { sessionVersion: 1 },
					$set: {
						failedLoginAttempts: 0,
						lastLoginAt: authenticatedAt
					},
					$unset: { lockedUntil: 1 }
				},
				{ new: true }
			).select("+sessionVersion");
			if (!authenticatedStudent) {
				return redirectWithError(res, returnTo, "not_linked");
			}
		}

		if (!setStudentIdentity(req, authenticatedStudent, "full")) {
			return redirectWithError(res, returnTo, "provider_error");
		}
		return res.redirect(
			303,
			withOAuthResult(returnTo, "studentOAuthStatus", consumedAttempt.mode === "link" ? "linked" : "success")
		);
	}
	catch (error) {
		logOAuthFailure(provider, error);
		return redirectWithError(res, returnTo, "provider_error");
	}
	finally {
		releaseLinkWriteLease?.();
	}
};
