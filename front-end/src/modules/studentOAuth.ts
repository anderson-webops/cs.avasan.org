import { api } from "@/api";

export const studentOAuthProviders = ["google", "apple"] as const;
export type StudentOAuthProvider = (typeof studentOAuthProviders)[number];

export interface StudentOAuthProviderAvailability {
	apple: boolean;
	google: boolean;
}

export const emptyStudentOAuthProviderAvailability: StudentOAuthProviderAvailability =
	{
		apple: false,
		google: false
	};

export const studentOAuthErrorMessages: Record<string, string> = {
	already_signed_in:
		"Another account is already signed in. Sign out before switching students.",
	cancelled: "Google or Apple sign-in was cancelled.",
	identity_conflict:
		"That Google or Apple account is already connected to another student.",
	link_expired:
		"That connection request expired. Sign in again with the username and one-time code from Julio.",
	not_linked:
		"That Google or Apple account is not connected yet. Sign in with the username and one-time code from Julio first.",
	provider_error:
		"Google or Apple could not complete sign-in. Please try again.",
	provider_unavailable: "That sign-in provider is not currently available."
};

export async function fetchStudentOAuthProviderAvailability() {
	const { data } = await api.get<StudentOAuthProviderAvailability>(
		"/students/oauth/providers"
	);
	return {
		apple: data.apple === true,
		google: data.google === true
	};
}

export function currentStudentOAuthReturnTo() {
	if (typeof window === "undefined") return "/";

	const current = new URL(window.location.href);
	current.searchParams.delete("studentOAuthError");
	current.searchParams.delete("studentOAuthStatus");
	return `${current.pathname}${current.search}${current.hash}`;
}

export function studentOAuthSignInHref(provider: StudentOAuthProvider) {
	const parameters = new URLSearchParams({
		returnTo: currentStudentOAuthReturnTo()
	});
	return `/api/students/oauth/${provider}/start?${parameters.toString()}`;
}

export async function startStudentOAuthConnection(
	provider: StudentOAuthProvider
) {
	const { data } = await api.post<{ authorizationUrl: string }>(
		`/students/oauth/${provider}/connect`,
		{
			returnTo: currentStudentOAuthReturnTo()
		}
	);
	return data.authorizationUrl;
}

export function navigateToStudentOAuth(authorizationUrl: string) {
	window.location.assign(authorizationUrl);
}
