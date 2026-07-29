export function readTrustProxySetting(
	configuredHops: string | undefined
): false | number {
	if (configuredHops === undefined || configuredHops.trim() === "") {
		return false;
	}

	if (!/^[1-9]\d*$/.test(configuredHops)) {
		throw new Error("TRUST_PROXY_HOPS must be a positive integer when configured.");
	}

	const hops = Number(configuredHops);
	if (!Number.isSafeInteger(hops) || hops > 10) {
		throw new Error("TRUST_PROXY_HOPS must be between 1 and 10.");
	}

	return hops;
}
