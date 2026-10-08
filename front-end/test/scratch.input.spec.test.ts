import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const adapterSource = readFileSync(
	resolve(__dirname, "../public/scratch-runtime/editor.js"),
	"utf8"
);
const origin = "https://example.test";
const channel = "scratch-input-test";

interface AdapterEvent {
	target?: unknown;
	key?: string;
	code?: string;
	keyCode?: number;
	ctrlKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	preventDefault?: ReturnType<typeof vi.fn>;
	source?: unknown;
	origin?: string;
	data?: Record<string, unknown>;
}

type Listener = (event: AdapterEvent) => unknown;

function eventTarget() {
	const listeners = new Map<
		string,
		{ listener: Listener; capture: boolean }[]
	>();
	return {
		listeners,
		addEventListener(
			type: string,
			listener: Listener,
			options?: boolean | { capture?: boolean }
		) {
			const entries = listeners.get(type) || [];
			entries.push({
				listener,
				capture:
					typeof options === "boolean"
						? options
						: Boolean(options?.capture)
			});
			listeners.set(type, entries);
		},
		removeEventListener(type: string, listener: Listener) {
			listeners.set(
				type,
				(listeners.get(type) || []).filter(
					entry => entry.listener !== listener
				)
			);
		},
		async emit(type: string, event: AdapterEvent = {}) {
			for (const { listener } of listeners.get(type) || [])
				await listener(event);
		}
	};
}

function fixture(initialize = true) {
	class ScratchSvgElement {}
	const stage = {};
	const body = { dataset: { parentOrigin: origin, channel } };
	const document = {
		...eventTarget(),
		body,
		hidden: false,
		visibilityState: "visible",
		getElementById: () => ({})
	};
	const window = { ...eventTarget(), focus: vi.fn() };
	const parent = { postMessage: vi.fn() };
	const vm = {
		renderer: { canvas: stage },
		postIOData: vi.fn(),
		stopAll: vi.fn(),
		loadProject: vi.fn(async () => {}),
		setEditingTarget: vi.fn(),
		runtime: {
			on: vi.fn(),
			targets: [
				{ id: "stage", isStage: true },
				{ id: "sprite", isStage: false }
			]
		}
	};
	let options!: {
		onVmInit: (value: typeof vm) => void;
		onProjectLoaded: () => void;
	};
	const editor = {
		render: vi.fn(value => {
			options = value;
			if (initialize) {
				options.onVmInit(vm);
				options.onProjectLoaded();
			}
		}),
		unmount: vi.fn()
	};
	class ScratchStorage {
		builtinHelper = { _store: vi.fn() };
		AssetType = {
			ImageVector: "vector",
			ImageBitmap: "bitmap",
			Sound: "sound"
		};
		DataFormat = {};
		addWebStore = vi.fn();
	}
	const GUI = {
		ScratchStorage,
		EditorState: class {},
		buildDefaultProject: () => [],
		setAppElement: vi.fn(),
		createStandaloneRoot: () => editor
	};
	runInNewContext(adapterSource, {
		GUI,
		document,
		window,
		parent,
		SVGElement: ScratchSvgElement,
		URL,
		ArrayBuffer
	});
	const key = (
		target: unknown = body,
		extra: Partial<AdapterEvent> = {}
	) => ({
		target,
		key: "ArrowRight",
		code: "ArrowRight",
		keyCode: 39,
		ctrlKey: false,
		altKey: false,
		metaKey: false,
		shiftKey: false,
		preventDefault: vi.fn(),
		...extra
	});
	const hostMessage = (type: string, extra: Record<string, unknown> = {}) =>
		window.emit("message", {
			source: parent,
			origin,
			data: { source: "classes-scratch-host", channel, type, ...extra }
		});
	return {
		document,
		window,
		parent,
		vm,
		stage,
		body,
		editor,
		options,
		key,
		hostMessage,
		ScratchSvgElement
	};
}

describe("Scratch stage input adapter", () => {
	it("focuses only the VM stage in capture phase without replacing mouse handling", async () => {
		const f = fixture();
		for (const type of ["mousedown", "touchstart"]) {
			expect(
				f.document.listeners.get(type)?.some(entry => entry.capture)
			).toBe(true);
			for (const target of [{}, f.body, new f.ScratchSvgElement()]) {
				await f.document.emit(type, {
					target,
					preventDefault: vi.fn()
				});
			}
			const preventDefault = vi.fn();
			await f.document.emit(type, { target: f.stage, preventDefault });
			expect(preventDefault).not.toHaveBeenCalled();
		}
		expect(f.window.focus).toHaveBeenCalledTimes(2);
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		expect(
			f.parent.postMessage.mock.calls.map(([message]) => message.type)
		).toEqual(["ready"]);
	});

	it("does not steal focus or track keys before the VM initializes", async () => {
		const f = fixture(false);
		await f.document.emit("mousedown", { target: f.stage });
		await f.document.emit("keydown", f.key());
		await f.window.emit("blur");
		expect(f.window.focus).not.toHaveBeenCalled();
		expect(f.vm.postIOData).not.toHaveBeenCalled();
	});

	it("leaves keydown delivery to Scratch and releases accepted held keys once on blur", async () => {
		const f = fixture();
		for (const target of [f.body, f.document, new f.ScratchSvgElement()]) {
			const event = f.key(target);
			await f.document.emit("keydown", event);
			expect(event.preventDefault).not.toHaveBeenCalled();
		}
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		await f.window.emit("blur");
		expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith("keyboard", {
			key: "ArrowRight",
			isDown: false
		});
		await f.window.emit("blur");
		expect(f.vm.postIOData).toHaveBeenCalledTimes(1);
	});

	it("drops released keys even when keyup targets an editor input", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key());
		await f.document.emit("keyup", f.key({ tagName: "INPUT" }));
		await f.window.emit("blur");
		expect(f.vm.postIOData).not.toHaveBeenCalled();
	});

	it("does not track editor typing, controls or canvas targets", async () => {
		const f = fixture();
		for (const target of [
			{ tagName: "INPUT" },
			{ tagName: "TEXTAREA" },
			{ isContentEditable: true },
			{ tagName: "BUTTON" },
			{},
			f.stage
		])
			await f.document.emit("keydown", f.key(target));
		await f.window.emit("blur");
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		expect(f.window.focus).not.toHaveBeenCalled();
	});

	it.each(["ctrlKey", "altKey", "metaKey"] as const)(
		"tracks %s body keys accepted by Scratch without forwarding or consuming them",
		async modifier => {
			const f = fixture();
			const event = f.key(f.body, { [modifier]: true });
			await f.document.emit("keydown", event);
			expect(f.vm.postIOData).not.toHaveBeenCalled();
			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(f.window.focus).not.toHaveBeenCalled();
			await f.window.emit("blur");
			expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith(
				"keyboard",
				{
					key: "ArrowRight",
					isDown: false
				}
			);
		}
	);

	it("releases each held key when the document becomes hidden, not when visible", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key());
		await f.document.emit(
			"keydown",
			f.key(f.body, { key: "a", code: "KeyA", keyCode: 65 })
		);
		await f.document.emit("visibilitychange");
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		f.document.hidden = true;
		f.document.visibilityState = "hidden";
		await f.document.emit("visibilitychange");
		expect(f.vm.postIOData.mock.calls).toEqual([
			["keyboard", { key: "ArrowRight", isDown: false }],
			["keyboard", { key: "a", isDown: false }]
		]);
		await f.window.emit("blur");
		expect(f.vm.postIOData).toHaveBeenCalledTimes(2);
	});

	it("tracks logical keys without depending on a physical event.code", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key(f.body, { code: "" }));
		await f.document.emit("keyup", f.key(f.body, { code: "" }));
		await f.window.emit("blur");
		expect(f.vm.postIOData).not.toHaveBeenCalled();
	});

	it("releases both logical keys when Shift changes a held physical key", async () => {
		const f = fixture();
		await f.document.emit(
			"keydown",
			f.key(f.body, { key: "1", code: "Digit1", keyCode: 49 })
		);
		await f.document.emit(
			"keydown",
			f.key(f.body, {
				key: "!",
				code: "Digit1",
				keyCode: 49,
				shiftKey: true
			})
		);
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		await f.window.emit("blur");
		expect(f.vm.postIOData.mock.calls).toEqual([
			["keyboard", { key: "1", isDown: false }],
			["keyboard", { key: "!", isDown: false }]
		]);
	});

	it("does not forget an earlier logical key when its shifted key is released", async () => {
		const f = fixture();
		await f.document.emit(
			"keydown",
			f.key(f.body, { key: "1", code: "Digit1", keyCode: 49 })
		);
		await f.document.emit(
			"keydown",
			f.key(f.body, {
				key: "!",
				code: "Digit1",
				keyCode: 49,
				shiftKey: true
			})
		);
		await f.document.emit(
			"keyup",
			f.key(f.body, {
				key: "!",
				code: "Digit1",
				keyCode: 49,
				shiftKey: true
			})
		);
		await f.window.emit("blur");
		expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith("keyboard", {
			key: "1",
			isDown: false
		});
	});

	it.each([
		["a", "A"],
		["A", "a"]
	])(
		"matches %s keydown with %s keyup as the same Scratch letter",
		async (downKey, upKey) => {
			const f = fixture();
			await f.document.emit(
				"keydown",
				f.key(f.body, { key: downKey, code: "KeyA", keyCode: 65 })
			);
			await f.document.emit(
				"keyup",
				f.key(f.body, { key: upKey, code: "KeyA", keyCode: 65 })
			);
			await f.window.emit("blur");
			expect(f.vm.postIOData).not.toHaveBeenCalled();
		}
	);

	it.each(["Dead", "", undefined])(
		"matches Scratch's keyCode fallback when event.key is %s",
		async key => {
			const f = fixture();
			await f.document.emit("keydown", f.key(f.body, { key }));
			expect(f.vm.postIOData).not.toHaveBeenCalled();
			await f.window.emit("blur");
			expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith(
				"keyboard",
				{
					key: 39,
					isDown: false
				}
			);
		}
	);

	it("releases the old VM's held keys before replacing it", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key());
		const replacement = { ...f.vm, postIOData: vi.fn() };
		f.options.onVmInit(replacement);
		expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith("keyboard", {
			key: "ArrowRight",
			isDown: false
		});
		await f.window.emit("blur");
		expect(replacement.postIOData).not.toHaveBeenCalled();
	});

	it.each(["stop", "load"])(
		"releases held keys before a host %s operation",
		async type => {
			const f = fixture();
			await f.document.emit("keydown", f.key());
			await f.hostMessage(
				type,
				type === "load" ? { bytes: new ArrayBuffer(1) } : {}
			);
			expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith(
				"keyboard",
				{
					key: "ArrowRight",
					isDown: false
				}
			);
			expect(f.vm.postIOData.mock.invocationCallOrder[0]).toBeLessThan(
				f.vm.stopAll.mock.invocationCallOrder[0]
			);
			expect(f.vm.stopAll).toHaveBeenCalledTimes(1);
			if (type === "load") {
				expect(f.vm.loadProject).toHaveBeenCalledTimes(1);
				expect(f.vm.setEditingTarget).toHaveBeenCalledWith("sprite");
			}
			await f.window.emit("blur");
			expect(f.vm.postIOData).toHaveBeenCalledTimes(1);
		}
	);

	it("ignores unauthenticated host messages without resetting input", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key());
		await f.window.emit("message", {
			source: {},
			origin,
			data: { source: "classes-scratch-host", channel, type: "stop" }
		});
		expect(f.vm.stopAll).not.toHaveBeenCalled();
		expect(f.vm.postIOData).not.toHaveBeenCalled();
		await f.window.emit("blur");
		expect(f.vm.postIOData).toHaveBeenCalledTimes(1);
	});

	it("releases held keys on pagehide before stopping and unmounting the editor", async () => {
		const f = fixture();
		await f.document.emit("keydown", f.key());
		await f.window.emit("pagehide");
		expect(f.vm.postIOData).toHaveBeenCalledExactlyOnceWith("keyboard", {
			key: "ArrowRight",
			isDown: false
		});
		expect(f.vm.postIOData.mock.invocationCallOrder[0]).toBeLessThan(
			f.vm.stopAll.mock.invocationCallOrder[0]
		);
		expect(f.vm.stopAll).toHaveBeenCalledTimes(1);
		expect(f.editor.unmount).toHaveBeenCalledTimes(1);
	});
});
