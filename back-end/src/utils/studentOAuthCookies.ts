import type { Response } from "express";
import type { ExternalIdentityProvider } from "../types/entities/IExternalIdentity.js";
import { oauthAuthOrigin } from "./oauthProviderConfig.js";

export const STUDENT_OAUTH_ATTEMPT_LIFETIME_MS = 10 * 60 * 1000;

function browserBindingCookieName(provider: ExternalIdentityProvider) {
	return `cs_avasan_student_oauth_${provider}`;
}

function browserBindingCookiePath(provider: ExternalIdentityProvider) {
	return `/api/students/oauth/${provider}`;
}

function browserBindingCookieOptions(provider: ExternalIdentityProvider) {
	return {
		httpOnly: true,
		path: browserBindingCookiePath(provider),
		sameSite: provider === "apple" ? "none" as const : "lax" as const,
		secure: provider === "apple" || oauthAuthOrigin().startsWith("https://")
	};
}

export function setStudentOAuthBrowserBinding(
	res: Response,
	provider: ExternalIdentityProvider,
	binding: string
) {
	res.cookie(browserBindingCookieName(provider), binding, {
		...browserBindingCookieOptions(provider),
		maxAge: STUDENT_OAUTH_ATTEMPT_LIFETIME_MS
	});
}

export function clearStudentOAuthBrowserBinding(
	res: Response,
	provider: ExternalIdentityProvider
) {
	res.clearCookie(
		browserBindingCookieName(provider),
		browserBindingCookieOptions(provider)
	);
}

export function clearStudentOAuthBrowserBindings(res: Response) {
	clearStudentOAuthBrowserBinding(res, "apple");
	clearStudentOAuthBrowserBinding(res, "google");
}

export function studentOAuthBrowserBindingFromRequest(
	req: { get: (name: string) => string | undefined },
	provider: ExternalIdentityProvider
) {
	const cookieHeader = req.get("cookie");
	if (!cookieHeader) return null;

	for (const pair of cookieHeader.split(";")) {
		const separator = pair.indexOf("=");
		if (separator < 0) continue;
		const key = pair.slice(0, separator).trim();
		if (key !== browserBindingCookieName(provider)) continue;
		const rawValue = pair.slice(separator + 1).trim();
		try {
			return decodeURIComponent(rawValue);
		}
		catch {
			return null;
		}
	}

	return null;
}
