export const externalIdentityProviders = ["apple", "google"] as const;

export type ExternalIdentityProvider
	= (typeof externalIdentityProviders)[number];
