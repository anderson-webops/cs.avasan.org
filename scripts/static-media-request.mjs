const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 250;

function isRetryableStatus(status) {
	return status === 429 || (status >= 500 && status <= 599);
}

function defaultSleep(delayMs) {
	return new Promise(resolve => setTimeout(resolve, delayMs));
}

async function cancelResponseBody(response) {
	try {
		await response.body?.cancel();
	}
	catch {
		// A best-effort cleanup must not hide the response that triggered a retry.
	}
}

export async function fetchWithRetry(url, init, options = {}) {
	const {
		fetchImpl = globalThis.fetch,
		maxAttempts = DEFAULT_MAX_ATTEMPTS,
		retryDelayMs = DEFAULT_RETRY_DELAY_MS,
		sleep = defaultSleep
	} = options;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			const response = await fetchImpl(url, init);
			if (!isRetryableStatus(response.status) || attempt === maxAttempts) {
				return response;
			}

			await cancelResponseBody(response);
		}
		catch (error) {
			if (attempt === maxAttempts) throw error;
		}

		await sleep(retryDelayMs * 2 ** (attempt - 1));
	}

	throw new Error("Static media request exhausted its retry attempts");
}

export async function requestStaticMedia(url, options = {}) {
	let response = await fetchWithRetry(url, { method: "HEAD" }, options);
	if (response.status === 405 || response.status === 403) {
		response = await fetchWithRetry(
			url,
			{
				headers: { Range: "bytes=0-0" },
				method: "GET"
			},
			options
		);
	}

	return response;
}
