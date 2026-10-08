/* Adapter for the locally served Scratch GUI distribution. */
(() => {
	"use strict";
	const origin = document.body.dataset.parentOrigin;
	const channel = document.body.dataset.channel;
	const send = (type, extra = {}) =>
		parent.postMessage(
			{ source: "classes-scratch", channel, type, ...extra },
			origin
		);
	let vm;
	let busy = false;
	let pending;
	let changed = false;
	const pressedKeys = new Map();
	const keyData = event => ({
		key: event.key && event.key !== "Dead" ? event.key : event.keyCode
	});
	// One physical key can produce multiple logical keys while Shift changes.
	// Retain each value that Scratch accepted until its keyup or cleanup.
	const keyIdentity = event => String(keyData(event).key).toUpperCase();
	function releaseKeys() {
		for (const key of pressedKeys.values())
			vm?.postIOData("keyboard", { ...key, isDown: false });
		pressedKeys.clear();
	}
	function focusStage(event) {
		// Scratch prevents the stage's default mouse focus transfer. Focus
		// this opaque frame, not its canvas: the GUI expects keys on body.
		if (vm?.renderer?.canvas && event.target === vm.renderer.canvas)
			window.focus();
	}
	document.addEventListener("mousedown", focusStage, true);
	document.addEventListener("touchstart", focusStage, {
		capture: true,
		passive: true
	});
	document.addEventListener(
		"keydown",
		event => {
			// Observe only keys accepted by Scratch's own keyboard handler.
			// Do not forward or consume editor fields, shortcuts or parent keys.
			if (
				!vm ||
				(event.target !== document &&
					event.target !== document.body &&
					!(event.target instanceof SVGElement))
			)
				return;
			pressedKeys.set(keyIdentity(event), keyData(event));
		},
		true
	);
	document.addEventListener(
		"keyup",
		event => {
			pressedKeys.delete(keyIdentity(event));
		},
		true
	);
	window.addEventListener("blur", releaseKeys);
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) releaseKeys();
	});
	const limit = 20 * 1024 * 1024;
	const error = () =>
		send("error", {
			message:
				"Scratch could not open that project. Try a smaller .sb3 file or reload the editor."
		});
	try {
		const storage = new GUI.ScratchStorage();
		for (const asset of GUI.buildDefaultProject()) {
			storage.builtinHelper._store(
				storage.AssetType[asset.assetType],
				storage.DataFormat[asset.dataFormat],
				asset.data,
				asset.id
			);
		}
		// Only standard public library assets may be fetched, without credentials.
		const libraryUrl = asset => {
			if (
				!/^[a-f0-9]{32}$/.test(asset.assetId) ||
				!/^(svg|png|jpg|jpeg|wav|mp3)$/.test(asset.dataFormat)
			)
				throw new Error("Invalid library asset");
			return `https://assets.scratch.mit.edu/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`;
		};
		storage.addWebStore(
			[
				storage.AssetType.ImageVector,
				storage.AssetType.ImageBitmap,
				storage.AssetType.Sound
			],
			libraryUrl
		);
		const config = {
			storage: {
				scratchStorage: storage,
				getLibraryAssetUrl: (assetId, dataFormat) =>
					libraryUrl({ assetId, dataFormat }),
				saveProject: async () => {
					throw new Error("Use Download project to save locally.");
				}
			}
		};
		const state = new GUI.EditorState(
			{ locale: "en", showTelemetryModal: false },
			() => config
		);
		const container = document.getElementById("scratch-root");
		GUI.setAppElement(container);
		const editor = GUI.createStandaloneRoot(state, container);
		async function load(bytes) {
			releaseKeys();
			if (!vm || busy) {
				pending = bytes;
				return;
			}
			busy = true;
			try {
				vm.stopAll();
				await vm.loadProject(bytes);
				vm.setEditingTarget(
					vm.runtime.targets.find(target => !target.isStage)?.id ||
						vm.runtime.targets[0].id
				);
				changed = false;
				send("loaded");
			} catch {
				error();
			} finally {
				busy = false;
			}
		}
		editor.render({
			projectId: "0",
			canSave: false,
			canCreateNew: false,
			canShare: false,
			canUseCloud: false,
			backpackVisible: false,
			showComingSoon: false,
			canEditTitle: false,
			basePath: new URL("vendor/", new URL("/scratch-runtime/", origin))
				.href,
			onVmInit(value) {
				releaseKeys();
				vm = value;
			},
			onProjectLoaded() {
				if (!vm) return;
				vm.runtime.on("PROJECT_CHANGED", () => {
					if (!busy && !changed) {
						changed = true;
						send("changed");
					}
				});
				send("ready", { version: "15.1.1" });
				if (pending) {
					const bytes = pending;
					pending = null;
					void load(bytes);
				}
			}
		});
		window.addEventListener("message", async event => {
			const data = event.data;
			if (
				event.source !== parent ||
				event.origin !== origin ||
				data?.channel !== channel ||
				data?.source !== "classes-scratch-host"
			)
				return;
			if (
				data.type === "load" &&
				data.bytes instanceof ArrayBuffer &&
				data.bytes.byteLength <= limit
			)
				await load(data.bytes);
			if (data.type === "stop") {
				releaseKeys();
				vm?.stopAll();
			}
			if (data.type === "download" && vm && !busy) {
				try {
					const blob = await vm.saveProjectSb3();
					if (blob.size > limit) throw new Error("Project too large");
					send("download", { bytes: await blob.arrayBuffer() });
					changed = false;
				} catch {
					error();
				}
			}
		});
		window.addEventListener("pagehide", () => {
			releaseKeys();
			vm?.stopAll();
			editor.unmount();
		});
	} catch {
		error();
	}
})();
