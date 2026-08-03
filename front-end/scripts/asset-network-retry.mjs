const RETRYABLE_NETWORK_ERROR_CODES = new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ECONNRESET",
	"EHOSTDOWN",
	"EHOSTUNREACH",
	"ENETDOWN",
	"ENETUNREACH",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_SOCKET"
]);

export class RetryableAssetRequestError extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "RetryableAssetRequestError";
	}
}

export function assetHttpStatusError(label, status) {
	const ErrorType = isRetryableHttpStatus(status)
		? RetryableAssetRequestError
		: Error;
	return new ErrorType(`${label} failed with status ${status}`);
}

export function isRetryableAssetRequestError(error, seen = new Set()) {
	if (!error || (typeof error !== "object" && typeof error !== "function")) {
		return false;
	}
	if (seen.has(error)) return false;
	seen.add(error);

	if (error instanceof RetryableAssetRequestError) return true;
	if (error.name === "AbortError") return true;
	if (
		typeof error.code === "string" &&
		RETRYABLE_NETWORK_ERROR_CODES.has(error.code)
	) {
		return true;
	}
	if (isRetryableAssetRequestError(error.cause, seen)) return true;
	if (
		Array.isArray(error.errors) &&
		error.errors.some(nestedError =>
			isRetryableAssetRequestError(nestedError, seen)
		)
	) {
		return true;
	}
	return false;
}

export async function runAssetNetworkRequest(
	label,
	operation,
	{
		onRetry = () => undefined,
		retryDelaysMs = [],
		timeoutMs,
		waitForDelay = delay
	}
) {
	const maximumAttempts = retryDelaysMs.length + 1;
	for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
		try {
			return await runWithTimeout(label, operation, timeoutMs);
		} catch (error) {
			if (
				attempt === maximumAttempts ||
				!isRetryableAssetRequestError(error)
			) {
				throw error;
			}

			const delayMs = retryDelaysMs[attempt - 1];
			onRetry({ attempt, delayMs, error, maximumAttempts });
			await waitForDelay(delayMs);
		}
	}

	throw new Error(`${label} exhausted its retry attempts`);
}

function isRetryableHttpStatus(status) {
	return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function runWithTimeout(label, operation, timeoutMs) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await operation(controller.signal);
	} catch (error) {
		if (controller.signal.aborted) {
			throw new RetryableAssetRequestError(
				`${label} timed out after ${timeoutMs} ms`,
				{ cause: error }
			);
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}

async function delay(delayMs) {
	await new Promise(resolve => setTimeout(resolve, delayMs));
}
