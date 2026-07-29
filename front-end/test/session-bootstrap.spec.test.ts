import { describe, expect, it, vi } from "vitest";
import { startSessionBootstrap } from "@/modules/sessionBootstrap";

describe("session bootstrap startup", () => {
	it("starts hydration without blocking the public app shell", () => {
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});
		const bootstrapSession = vi.fn(
			() => new Promise<void>(() => undefined)
		);

		const result = startSessionBootstrap({ bootstrapSession });

		expect(result).toBeUndefined();
		expect(bootstrapSession).toHaveBeenCalledOnce();
	});

	it("does not hydrate private identity into a hidden page", () => {
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "hidden"
		});
		const bootstrapSession = vi.fn(async () => undefined);

		startSessionBootstrap({ bootstrapSession });

		expect(bootstrapSession).not.toHaveBeenCalled();
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible"
		});
		document.dispatchEvent(new Event("visibilitychange"));
		expect(bootstrapSession).toHaveBeenCalledOnce();
	});
});
