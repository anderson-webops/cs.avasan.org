import type { ClientRateLimitInfo, Options, Store } from "express-rate-limit";

interface ExactExpiryClient {
	resetTime: Date;
	timeout: ReturnType<typeof setTimeout>;
	totalHits: number;
}

/**
 * An in-process fixed-window store that removes each key when its own window
 * ends. express-rate-limit's default MemoryStore intentionally keeps a
 * previous generation for up to a second window; that is useful for efficient
 * cleanup but is longer than this classroom's disclosed security retention.
 */
export class ExactExpiryRateLimitStore implements Store {
	readonly localKeys = true;
	private readonly clients = new Map<string, ExactExpiryClient>();
	private windowMs = 60_000;

	init(options: Options): void {
		this.windowMs = options.windowMs;
	}

	get(key: string): ClientRateLimitInfo | undefined {
		const client = this.liveClient(key);
		if (!client) return undefined;
		return {
			resetTime: new Date(client.resetTime),
			totalHits: client.totalHits
		};
	}

	increment(key: string): ClientRateLimitInfo {
		let client = this.liveClient(key);
		if (!client) {
			const resetTime = new Date(Date.now() + this.windowMs);
			const timeout = setTimeout(() => {
				const current = this.clients.get(key);
				if (current?.resetTime.getTime() === resetTime.getTime()) {
					this.clients.delete(key);
				}
			}, this.windowMs);
			timeout.unref?.();
			client = {
				resetTime,
				timeout,
				totalHits: 0
			};
			this.clients.set(key, client);
		}

		client.totalHits += 1;
		return {
			resetTime: new Date(client.resetTime),
			totalHits: client.totalHits
		};
	}

	decrement(key: string): void {
		const client = this.liveClient(key);
		if (client && client.totalHits > 0) client.totalHits -= 1;
	}

	resetKey(key: string): void {
		const client = this.clients.get(key);
		if (client) clearTimeout(client.timeout);
		this.clients.delete(key);
	}

	resetAll(): void {
		for (const client of this.clients.values()) {
			clearTimeout(client.timeout);
		}
		this.clients.clear();
	}

	shutdown(): void {
		this.resetAll();
	}

	private liveClient(key: string): ExactExpiryClient | undefined {
		const client = this.clients.get(key);
		if (!client) return undefined;
		if (client.resetTime.getTime() > Date.now()) return client;
		this.resetKey(key);
		return undefined;
	}
}
