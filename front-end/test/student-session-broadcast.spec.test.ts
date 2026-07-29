import { afterEach, describe, expect, it, vi } from "vitest";

class MockBroadcastChannel {
	static instance: MockBroadcastChannel | null = null;

	readonly messages: unknown[] = [];
	private readonly listeners = new Set<(event: MessageEvent) => void>();

	constructor(readonly name: string) {
		MockBroadcastChannel.instance = this;
	}

	addEventListener(
		type: string,
		listener: (event: MessageEvent) => void
	) {
		if (type === "message") this.listeners.add(listener);
	}

	postMessage(message: unknown) {
		this.messages.push(message);
	}

	emit(message: unknown) {
		const event = new MessageEvent("message", { data: message });
		for (const listener of this.listeners) listener(event);
	}
}

describe("student session broadcast", () => {
	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.resetModules();
		MockBroadcastChannel.instance = null;
	});

	it("waits for a peer discovered just after logout preparation starts", async () => {
		vi.useFakeTimers();
		Object.defineProperty(window, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		Object.defineProperty(globalThis, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		const { prepareStudentLogoutInOtherTabs } = await import(
			"@/modules/studentSessionBroadcast"
		);

		let completed = false;
		const preparation = prepareStudentLogoutInOtherTabs("student-a").then(
			() => {
				completed = true;
			}
		);
		const channel = MockBroadcastChannel.instance;
		const prepareMessage = channel?.messages.find(
			(message): message is {
				requestID: string;
				type: "student-logout-prepare";
			} =>
				typeof message === "object" &&
				message !== null &&
				"type" in message &&
				message.type === "student-logout-prepare"
		);
		expect(prepareMessage).toBeDefined();

		await vi.advanceTimersByTimeAsync(100);
		channel?.emit({
			type: "student-logout-prepare-started",
			requestID: prepareMessage!.requestID,
			tabID: "new-peer"
		});
		await vi.advanceTimersByTimeAsync(200);
		expect(completed).toBe(false);

		channel?.emit({
			type: "student-logout-prepare-result",
			requestID: prepareMessage!.requestID,
			tabID: "new-peer",
			ok: true
		});
		await preparation;

		expect(completed).toBe(true);
	});

	it("keeps a BFCache tab present and reannounces it when restored", async () => {
		vi.useFakeTimers();
		Object.defineProperty(window, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		Object.defineProperty(globalThis, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		const { subscribeToStudentSessionChanged } = await import(
			"@/modules/studentSessionBroadcast"
		);
		const unsubscribe = subscribeToStudentSessionChanged(() => undefined);
		const channel = MockBroadcastChannel.instance!;
		channel.messages.splice(0);

		const cachedPageHide = new Event("pagehide");
		Object.defineProperty(cachedPageHide, "persisted", { value: true });
		window.dispatchEvent(cachedPageHide);

		expect(channel.messages).not.toContainEqual(
			expect.objectContaining({ type: "student-tab-goodbye" })
		);
		expect(channel.messages).toContainEqual(
			expect.objectContaining({ type: "student-tab-suspended" })
		);
		channel.messages.splice(0);
		await vi.advanceTimersByTimeAsync(30_000);
		expect(channel.messages).not.toContainEqual(
			expect.objectContaining({ type: "student-tab-present" })
		);

		window.dispatchEvent(new Event("pageshow"));
		expect(channel.messages).toContainEqual(
			expect.objectContaining({ type: "student-tab-hello" })
		);
		expect(channel.messages).toContainEqual(
			expect.objectContaining({ type: "student-tab-present" })
		);

		channel.messages.splice(0);
		await vi.advanceTimersByTimeAsync(30_000);
		expect(channel.messages).toContainEqual(
			expect.objectContaining({ type: "student-tab-present" })
		);

		const terminalPageHide = new Event("pagehide");
		Object.defineProperty(terminalPageHide, "persisted", { value: false });
		window.dispatchEvent(terminalPageHide);
		expect(channel.messages).toContainEqual(
			expect.objectContaining({ type: "student-tab-goodbye" })
		);
		unsubscribe();
	});

	it("requires a suspended peer even after its normal presence expires", async () => {
		vi.useFakeTimers();
		Object.defineProperty(window, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		Object.defineProperty(globalThis, "BroadcastChannel", {
			configurable: true,
			value: MockBroadcastChannel
		});
		const {
			prepareStudentLogoutInOtherTabs,
			subscribeToStudentSessionChanged
		} = await import("@/modules/studentSessionBroadcast");
		const unsubscribe = subscribeToStudentSessionChanged(() => undefined);
		const channel = MockBroadcastChannel.instance!;
		channel.emit({
			type: "student-tab-suspended",
			tabID: "cached-peer"
		});

		await vi.advanceTimersByTimeAsync(91_000);
		const preparation =
			prepareStudentLogoutInOtherTabs("student-a");
		const rejection = expect(preparation).rejects.toMatchObject({
			name: "StudentSessionHandoffError"
		});
		await vi.advanceTimersByTimeAsync(15_300);
		await rejection;

		const prepareMessage = channel.messages.find(
			(message): message is {
				requestID: string;
				type: "student-logout-prepare";
			} =>
				typeof message === "object" &&
				message !== null &&
				"type" in message &&
				message.type === "student-logout-prepare"
		);
		expect(prepareMessage).toBeDefined();
		unsubscribe();
	});
});
