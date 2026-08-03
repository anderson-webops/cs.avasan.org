import { describe, expect, it, vi } from "vitest";
import {
	assetHttpStatusError,
	isRetryableAssetRequestError,
	RetryableAssetRequestError,
	runAssetNetworkRequest
} from "../scripts/asset-network-retry.mjs";

describe("asset network retry", () => {
	it("retries a bounded number of transient failures", async () => {
		const operation = vi
			.fn()
			.mockRejectedValueOnce(
				Object.assign(new Error("connect timeout"), {
					code: "ETIMEDOUT"
				})
			)
			.mockRejectedValueOnce(assetHttpStatusError("download", 503))
			.mockResolvedValue("archive");
		const onRetry = vi.fn();
		const waitForDelay = vi.fn().mockResolvedValue(undefined);

		await expect(
			runAssetNetworkRequest("asset download", operation, {
				onRetry,
				retryDelaysMs: [10, 20],
				timeoutMs: 1_000,
				waitForDelay
			})
		).resolves.toBe("archive");
		expect(operation).toHaveBeenCalledTimes(3);
		expect(waitForDelay).toHaveBeenNthCalledWith(1, 10);
		expect(waitForDelay).toHaveBeenNthCalledWith(2, 20);
		expect(onRetry).toHaveBeenCalledTimes(2);
	});

	it("does not retry permanent HTTP or integrity failures", async () => {
		const waitForDelay = vi.fn().mockResolvedValue(undefined);
		for (const error of [
			assetHttpStatusError("download", 404),
			new Error("SHA-256 verification failed")
		]) {
			const operation = vi.fn().mockRejectedValue(error);
			await expect(
				runAssetNetworkRequest("asset download", operation, {
					retryDelaysMs: [10, 20],
					timeoutMs: 1_000,
					waitForDelay
				})
			).rejects.toBe(error);
			expect(operation).toHaveBeenCalledTimes(1);
		}
		expect(waitForDelay).not.toHaveBeenCalled();
	});

	it("recognizes nested Node fetch connection failures", () => {
		const nested = Object.assign(new Error("fetch failed"), {
			cause: {
				errors: [
					Object.assign(new Error("IPv4 timeout"), {
						code: "ETIMEDOUT"
					}),
					Object.assign(new Error("IPv6 unavailable"), {
						code: "ENETUNREACH"
					})
				]
			}
		});

		expect(isRetryableAssetRequestError(nested)).toBe(true);
		expect(isRetryableAssetRequestError(new Error("bad checksum"))).toBe(
			false
		);
	});

	it("treats request timeouts as retryable", async () => {
		const operation = vi.fn(
			signal =>
				new Promise((_resolve, reject) => {
					signal.addEventListener("abort", () => {
						reject(new DOMException("aborted", "AbortError"));
					});
				})
		);

		await expect(
			runAssetNetworkRequest("asset metadata request", operation, {
				retryDelaysMs: [],
				timeoutMs: 5
			})
		).rejects.toBeInstanceOf(RetryableAssetRequestError);
		expect(operation).toHaveBeenCalledTimes(1);
	});
});
