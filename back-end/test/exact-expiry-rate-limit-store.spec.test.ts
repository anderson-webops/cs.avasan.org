import type { Options } from "express-rate-limit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExactExpiryRateLimitStore } from "../src/security/exactExpiryRateLimitStore.js";

describe("exact-expiry rate-limit store", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("removes a key when that key's disclosed window ends", async () => {
		vi.useFakeTimers();
		const store = new ExactExpiryRateLimitStore();
		store.init({ windowMs: 5 * 60 * 1000 } as Options);

		expect(store.increment("198.51.100.5").totalHits).toBe(1);
		await vi.advanceTimersByTimeAsync(5 * 60 * 1000 - 1);
		expect(store.get("198.51.100.5")?.totalHits).toBe(1);
		await vi.advanceTimersByTimeAsync(1);
		expect(store.get("198.51.100.5")).toBeUndefined();
	});

	it("does not extend the original fixed window on later requests", async () => {
		vi.useFakeTimers();
		const store = new ExactExpiryRateLimitStore();
		store.init({ windowMs: 1_000 } as Options);

		store.increment("student:river");
		await vi.advanceTimersByTimeAsync(900);
		expect(store.increment("student:river").totalHits).toBe(2);
		await vi.advanceTimersByTimeAsync(100);
		expect(store.get("student:river")).toBeUndefined();
	});

	it("never creates a retained key during a decrement", () => {
		const store = new ExactExpiryRateLimitStore();
		store.init({ windowMs: 1_000 } as Options);

		store.decrement("missing");
		expect(store.get("missing")).toBeUndefined();
	});
});
