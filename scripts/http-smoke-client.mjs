import { Buffer } from "node:buffer";
import http from "node:http";
import https from "node:https";

const MAX_SMOKE_RESPONSE_BYTES = 20 * 1024 * 1024;
const MAX_SAME_ORIGIN_REDIRECTS = 5;
const redirectStatuses = new Set([301, 302, 303, 307, 308]);

function responseHeader(headers, name) {
	const value = headers[name.toLowerCase()];
	if (Array.isArray(value)) return value.join(", ");
	return value ?? null;
}

async function requestOnce(
	url,
	{
		body,
		deadlineAt,
		headers = {},
		method = "GET",
		timeoutMs = 15_000
	} = {}
) {
	const client = url.protocol === "https:" ? https : http;
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		throw new Error(`Unsupported smoke-test protocol: ${url.protocol}`);
	}

	return await new Promise((resolve, reject) => {
		const remainingMs = Math.max(0, (deadlineAt ?? Date.now() + timeoutMs) - Date.now());
		let completed = false;
		let deadlineTimer;
		const finish = (callback) => {
			if (completed) return;
			completed = true;
			if (deadlineTimer) clearTimeout(deadlineTimer);
			callback();
		};
		const request = client.request(
			url,
			{
				headers: {
					"Cache-Control": "no-cache",
					...headers
				},
				method
			},
			(response) => {
				const chunks = [];
				let responseBytes = 0;

				response.on("data", (chunk) => {
					responseBytes += chunk.length;
					if (responseBytes > MAX_SMOKE_RESPONSE_BYTES) {
						request.destroy(
							new Error(`Response from ${url.href} exceeded ${MAX_SMOKE_RESPONSE_BYTES} bytes.`)
						);
						return;
					}
					chunks.push(chunk);
				});
				response.on("end", () => {
					const responseBody = Buffer.concat(chunks).toString("utf8");
					const status = response.statusCode ?? 0;
					finish(() =>
						resolve({
							headers: {
								get: name => responseHeader(response.headers, name)
							},
							json: async () => JSON.parse(responseBody),
							ok: status >= 200 && status < 300,
							status,
							text: async () => responseBody
						})
					);
				});
				response.on("error", (error) => {
					finish(() =>
						reject(
							new Error(`Response from ${url.href} failed.`, {
								cause: error
							})
						)
					);
				});
			}
		);

		if (remainingMs === 0) {
			finish(() => reject(new Error(`Request to ${url.href} timed out after ${timeoutMs} ms.`)));
			request.destroy();
			return;
		}
		deadlineTimer = setTimeout(() => {
			request.destroy(new Error(`Request to ${url.href} timed out after ${timeoutMs} ms.`));
		}, remainingMs);
		deadlineTimer.unref();
		request.on("error", (error) => {
			finish(() =>
				reject(
					new Error(
						`Request to ${url.href} failed: ${error instanceof Error ? error.message : String(error)}`,
						{ cause: error }
					)
				)
			);
		});
		if (body !== undefined) request.write(body);
		request.end();
	});
}

function redirectedRequest(response, url, options) {
	if (!redirectStatuses.has(response.status)) return null;
	const location = response.headers.get("location");
	if (!location) return null;

	const nextUrl = new URL(location, url);
	if (nextUrl.origin !== url.origin) {
		throw new Error(`Refused cross-origin smoke-test redirect from ${url.href} to ${nextUrl.href}.`);
	}

	const nextOptions = {
		...options,
		headers: { ...options.headers }
	};
	if (
		response.status === 303
		|| ((response.status === 301 || response.status === 302)
			&& options.method === "POST")
	) {
		nextOptions.body = undefined;
		nextOptions.method = "GET";
		for (const name of Object.keys(nextOptions.headers)) {
			if (
				name.toLowerCase() === "content-length"
				|| name.toLowerCase() === "content-type"
			) {
				delete nextOptions.headers[name];
			}
		}
	}

	return {
		options: nextOptions,
		url: nextUrl
	};
}

export async function smokeRequest(input, options = {}) {
	const initialUrl = input instanceof URL ? input : new URL(input);
	const redirect = options.redirect ?? "follow";
	if (redirect !== "follow" && redirect !== "manual") {
		throw new Error("Smoke-test redirect mode must be follow or manual.");
	}

	let currentUrl = initialUrl;
	const timeoutMs = options.timeoutMs ?? 15_000;
	let currentOptions = {
		...options,
		body: options.body,
		deadlineAt: Date.now() + timeoutMs,
		headers: { ...options.headers },
		method: (options.method ?? "GET").toUpperCase(),
		timeoutMs
	};
	for (let redirectCount = 0; redirectCount <= MAX_SAME_ORIGIN_REDIRECTS; redirectCount += 1) {
		const response = await requestOnce(currentUrl, currentOptions);
		if (redirect === "manual") return response;

		const redirected = redirectedRequest(response, currentUrl, currentOptions);
		if (!redirected) return response;
		if (redirectCount === MAX_SAME_ORIGIN_REDIRECTS) {
			throw new Error(
				`Smoke-test redirect limit of ${MAX_SAME_ORIGIN_REDIRECTS} exceeded at ${currentUrl.href}.`
			);
		}
		currentUrl = redirected.url;
		currentOptions = redirected.options;
	}

	throw new Error("Unreachable smoke-test redirect state.");
}

export function smokeErrorMessage(error) {
	if (!(error instanceof Error)) return String(error);

	const detail = error.stack || error.message;
	const cause = error.cause;
	if (!(cause instanceof Error)) return detail;
	return `${detail}\nCaused by: ${cause.stack || cause.message}`;
}
