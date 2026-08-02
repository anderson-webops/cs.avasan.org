import assert from "node:assert/strict";
// This executable root-level audit test intentionally uses Node's test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";
import {
	fetchWithRetry,
	requestStaticMedia
} from "../scripts/static-media-request.mjs";

function response(status) {
	return {
		body: null,
		ok: status >= 200 && status < 300,
		status
	};
}

function queuedFetch(results) {
	const calls = [];
	return {
		calls,
		fetchImpl: async (...args) => {
			calls.push(args);
			const result = results.shift();
			if (result instanceof Error) throw result;
			return result;
		}
	};
}

test("retries network errors before returning a successful response", async () => {
	const { calls, fetchImpl } = queuedFetch([
		new TypeError("temporary network failure"),
		response(200)
	]);
	const delays = [];

	const result = await fetchWithRetry(
		"https://static.example/course.pdf",
		{ method: "HEAD" },
		{
			fetchImpl,
			retryDelayMs: 10,
			sleep: async delayMs => delays.push(delayMs)
		}
	);

	assert.equal(result.status, 200);
	assert.equal(calls.length, 2);
	assert.deepEqual(delays, [10]);
});

test("retries HTTP 429 and 5xx responses with a bounded backoff", async () => {
	const { calls, fetchImpl } = queuedFetch([
		response(429),
		response(503),
		response(206)
	]);
	const delays = [];

	const result = await fetchWithRetry(
		"https://static.example/course.zip",
		{ method: "GET" },
		{
			fetchImpl,
			retryDelayMs: 25,
			sleep: async delayMs => delays.push(delayMs)
		}
	);

	assert.equal(result.status, 206);
	assert.equal(calls.length, 3);
	assert.deepEqual(delays, [25, 50]);
});

test("does not retry a real missing-asset response", async () => {
	const { calls, fetchImpl } = queuedFetch([response(404)]);
	const delays = [];

	const result = await requestStaticMedia(
		"https://static.example/missing.pdf",
		{
			fetchImpl,
			sleep: async delayMs => delays.push(delayMs)
		}
	);

	assert.equal(result.status, 404);
	assert.equal(calls.length, 1);
	assert.equal(calls[0][1].method, "HEAD");
	assert.deepEqual(delays, []);
});

test("preserves the range GET fallback for servers that reject HEAD", async () => {
	const { calls, fetchImpl } = queuedFetch([response(405), response(206)]);

	const result = await requestStaticMedia(
		"https://static.example/course.mp4",
		{ fetchImpl }
	);

	assert.equal(result.status, 206);
	assert.equal(calls.length, 2);
	assert.deepEqual(calls[0][1], { method: "HEAD" });
	assert.deepEqual(calls[1][1], {
		headers: { Range: "bytes=0-0" },
		method: "GET"
	});
});

test("stops after three consecutive network failures", async () => {
	const { calls, fetchImpl } = queuedFetch([
		new TypeError("network failure 1"),
		new TypeError("network failure 2"),
		new TypeError("network failure 3")
	]);
	const delays = [];

	await assert.rejects(
		fetchWithRetry(
			"https://static.example/course.pdf",
			{ method: "HEAD" },
			{
				fetchImpl,
				retryDelayMs: 5,
				sleep: async delayMs => delays.push(delayMs)
			}
		),
		/network failure 3/u
	);
	assert.equal(calls.length, 3);
	assert.deepEqual(delays, [5, 10]);
});
