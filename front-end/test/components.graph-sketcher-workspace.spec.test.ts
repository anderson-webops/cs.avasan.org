import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GraphSketcherWorkspace from "@/components/GraphSketcherWorkspace.vue";
import {
	createBlankGraphDocument,
	graphDocumentToJson,
	MAX_GRAPH_DOCUMENT_BYTES,
	MAX_GRAPH_EXPRESSION_LENGTH
} from "@/modules/graphSketcher";
import { GRAPH_SKETCHER_SESSION_STORAGE_KEY } from "@/modules/graphSketcherSafety";

function installSessionStorageStub() {
	const values = new Map<string, string>();
	Object.defineProperty(window, "sessionStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => values.set(key, value)
		}
	});
}

function buttonWithText(wrapper: ReturnType<typeof mount>, label: string) {
	const button = wrapper
		.findAll("button")
		.find(candidate => candidate.text().trim() === label);
	expect(button, `Expected a "${label}" button`).toBeDefined();
	return button!;
}

function toolButtonWithText(wrapper: ReturnType<typeof mount>, label: string) {
	const button = wrapper
		.findAll(".graph-tools__list button")
		.find(candidate => candidate.text().trim().endsWith(label));
	expect(button, `Expected a "${label}" graph tool`).toBeDefined();
	return button!;
}

enableAutoUnmount(afterEach);

describe("GraphSketcherWorkspace.vue", () => {
	beforeEach(() => {
		vi.useRealTimers();
		installSessionStorageStub();
		window.sessionStorage.clear();
	});

	it("renders a complete client-side graphing workspace", async () => {
		const wrapper = mount(GraphSketcherWorkspace);

		expect(wrapper.get("h1").text()).toBe("Graph Sketcher");
		expect(wrapper.get("svg[role='img']").attributes("tabindex")).toBe("0");
		expect(wrapper.text()).toContain("Open / import");
		expect(wrapper.text()).toContain("Download project");
		expect(wrapper.text()).toContain("Clear for next student");
		expect(wrapper.text()).toContain("Plot a function");
		expect(
			wrapper
				.get("[aria-label='Graph project actions']")
				.attributes("role")
		).toBe("group");
		expect(
			wrapper.get("[aria-label='Graph view controls']").attributes("role")
		).toBe("group");

		await buttonWithText(wrapper, "Style").trigger("click");
		expect(wrapper.text()).toContain("Add linear best fit");

		await buttonWithText(wrapper, "Graph").trigger("click");
		expect(wrapper.text()).toContain("Original source");
		expect(wrapper.text()).toContain("Linux desktop port");
	});

	it("exposes keyboard-operable inspector tabs and their panels", async () => {
		const wrapper = mount(GraphSketcherWorkspace, {
			attachTo: document.body
		});

		try {
			const dataTab = wrapper.get("#graph-inspector-tab-data");
			expect(dataTab.attributes("aria-selected")).toBe("true");
			expect(dataTab.attributes("aria-controls")).toBe(
				"graph-inspector-panel-data"
			);
			expect(dataTab.attributes("tabindex")).toBe("0");
			expect(
				wrapper
					.get("#graph-inspector-panel-data")
					.attributes("aria-labelledby")
			).toBe("graph-inspector-tab-data");
			for (const tab of ["data", "style", "axes", "graph"]) {
				const tabButton = wrapper.get(`#graph-inspector-tab-${tab}`);
				const panelId = tabButton.attributes("aria-controls");
				expect(panelId).toBe(`graph-inspector-panel-${tab}`);
				expect(wrapper.find(`#${panelId}`).exists()).toBe(true);
			}
			expect(wrapper.get("#graph-inspector-panel-data").isVisible()).toBe(
				true
			);
			expect(
				wrapper.get("#graph-inspector-panel-style").isVisible()
			).toBe(false);

			await dataTab.trigger("keydown", { key: "ArrowRight" });
			await wrapper.vm.$nextTick();

			const styleTab = wrapper.get("#graph-inspector-tab-style");
			expect(styleTab.attributes("aria-selected")).toBe("true");
			expect(styleTab.attributes("tabindex")).toBe("0");
			expect(dataTab.attributes("tabindex")).toBe("-1");
			expect(document.activeElement?.id).toBe(
				"graph-inspector-tab-style"
			);
			expect(
				wrapper.get("#graph-inspector-panel-style").attributes("role")
			).toBe("tabpanel");
			expect(wrapper.get("#graph-inspector-panel-data").isVisible()).toBe(
				false
			);
			expect(
				wrapper.get("#graph-inspector-panel-style").isVisible()
			).toBe(true);

			await styleTab.trigger("keydown", { key: "End" });
			await wrapper.vm.$nextTick();
			expect(
				wrapper
					.get("#graph-inspector-tab-graph")
					.attributes("aria-selected")
			).toBe("true");
		} finally {
			wrapper.unmount();
		}
	});

	it("plots equations and keeps keyboard scrolling inside the canvas", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const equation = wrapper
			.findAll("input")
			.find(input => input.attributes("placeholder") === "sin(x) + 0.5x");
		expect(equation).toBeDefined();
		expect(equation!.attributes("maxlength")).toBe(
			String(MAX_GRAPH_EXPRESSION_LENGTH)
		);
		await equation.setValue("x^2 - 4");
		await buttonWithText(wrapper, "Plot function").trigger("click");

		expect(wrapper.text()).toContain("y = x^2 - 4");
		expect(wrapper.text()).toContain("Plotted y = x^2 - 4");

		const canvas = wrapper.get("svg[role='img']");
		const event = new KeyboardEvent("keydown", {
			key: "ArrowDown",
			cancelable: true
		});
		canvas.element.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	it("creates an editable point series when a generated curve is active", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		const pointButton = wrapper
			.findAll("button")
			.find(candidate => candidate.text().includes("Point"));
		expect(pointButton).toBeDefined();
		await pointButton!.trigger("click");

		const canvas = wrapper.get("svg[role='img']");
		Object.defineProperty(canvas.element, "getBoundingClientRect", {
			configurable: true,
			value: () => ({
				bottom: 600,
				height: 600,
				left: 0,
				right: 900,
				top: 0,
				width: 900,
				x: 0,
				y: 0,
				toJSON: () => ({})
			})
		});
		canvas.element.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 450,
				clientY: 300
			})
		);
		await wrapper.vm.$nextTick();

		expect(canvas.attributes("aria-label")).toContain(
			"4 series and 654 points"
		);
		expect(wrapper.text()).toContain("Added a point to Points 4.");
		expect(wrapper.text()).toContain("Editable points for Points 4");
	});

	it("keeps generated curves read-only and duplicates editable snapshots", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		await buttonWithText(wrapper, "Data").trigger("click");

		expect(wrapper.text()).toContain("Generated points are read-only.");
		expect(wrapper.find(".graph-data-table").exists()).toBe(false);

		await buttonWithText(wrapper, "Duplicate").trigger("click");

		expect(wrapper.find(".graph-data-table").exists()).toBe(true);
		expect(wrapper.text()).toContain("Editable points for y = sin(x) copy");
	});

	it("restores graph projects saved only for the current tab", async () => {
		window.sessionStorage.setItem(
			GRAPH_SKETCHER_SESSION_STORAGE_KEY,
			JSON.stringify({
				schemaVersion: 1,
				title: "My saved graph",
				series: [],
				annotations: []
			})
		);

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("My saved graph");
		expect(wrapper.text()).toContain(
			"Restored the graph saved in this tab."
		);
		expect(wrapper.text()).toContain("Saved for this tab");
	});

	it("flushes pending tab saves when the workspace closes", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Add").trigger("click");
		wrapper.unmount();

		const saved = window.sessionStorage.getItem(
			GRAPH_SKETCHER_SESSION_STORAGE_KEY
		);
		expect(
			JSON.parse(saved ?? "{}").series.map(
				(series: { name: string }) => series.name
			)
		).toContain("Series 3");
	});

	it("clears the tab for the next student without saving the blank graph", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Add").trigger("click");
		wrapper.unmount();
		expect(
			window.sessionStorage.getItem(GRAPH_SKETCHER_SESSION_STORAGE_KEY)
		).not.toBeNull();

		const nextWrapper = mount(GraphSketcherWorkspace);
		await nextWrapper.vm.$nextTick();
		const equation = nextWrapper
			.findAll("input")
			.find(input => input.attributes("placeholder") === "sin(x) + 0.5x");
		const pastedRows = nextWrapper.get("textarea[placeholder^='Time,']");
		await equation!.setValue("x^2 + private");
		await pastedRows.setValue("private,classroom,data");
		await toolButtonWithText(nextWrapper, "Text").trigger("click");
		const labelDraft = nextWrapper.get(".graph-tool-draft input");
		await labelDraft.setValue("private label");
		await buttonWithText(nextWrapper, "New").trigger("click");
		await buttonWithText(nextWrapper, "Clear for next student").trigger(
			"click"
		);
		await buttonWithText(nextWrapper, "Confirm clear").trigger("click");
		await nextWrapper.vm.$nextTick();

		expect(nextWrapper.text()).toContain(
			"Cleared this tab's graph. It is ready for the next student."
		);
		expect(nextWrapper.text()).toContain("No graph saved in this tab");
		expect(
			window.sessionStorage.getItem(GRAPH_SKETCHER_SESSION_STORAGE_KEY)
		).toBeNull();
		expect((equation!.element as HTMLInputElement).value).toBe("sin(x)");
		expect((pastedRows.element as HTMLTextAreaElement).value).toBe("");
		expect(
			toolButtonWithText(nextWrapper, "Select").attributes("aria-pressed")
		).toBe("true");
		expect(
			nextWrapper
				.findAll(".graph-tools__history button")[0]
				.attributes("disabled")
		).toBeDefined();
		expect(buttonWithText(nextWrapper, "New").text()).toBe("New");
		await toolButtonWithText(nextWrapper, "Text").trigger("click");
		expect(
			(
				nextWrapper.get(".graph-tool-draft input")
					.element as HTMLInputElement
			).value
		).toBe("Label");
	});

	it("does not restore an in-flight import after clearing for the next student", async () => {
		let resolveText: ((value: string) => void) | undefined;
		const delayedText = new Promise<string>(resolve => {
			resolveText = resolve;
		});
		const importedDocument = createBlankGraphDocument();
		importedDocument.title = "Previous student's private graph";

		const wrapper = mount(GraphSketcherWorkspace);
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		Object.defineProperty(input.element, "files", {
			configurable: true,
			value: [
				{
					arrayBuffer: vi.fn(),
					name: "private.graphsketch",
					size: 100,
					text: () => delayedText
				}
			]
		});

		await input.trigger("change");
		await buttonWithText(wrapper, "Clear for next student").trigger(
			"click"
		);
		await buttonWithText(wrapper, "Confirm clear").trigger("click");
		resolveText?.(graphDocumentToJson(importedDocument));
		await delayedText;
		await new Promise(resolve => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).not.toContain(
			"Previous student's private graph"
		);
		expect(wrapper.text()).toContain(
			"Cleared this tab's graph. It is ready for the next student."
		);
		expect(
			window.sessionStorage.getItem(GRAPH_SKETCHER_SESSION_STORAGE_KEY)
		).toBeNull();
	});

	it("reports when tab storage is unavailable", async () => {
		vi.useFakeTimers();
		Object.defineProperty(window, "sessionStorage", {
			configurable: true,
			value: {
				getItem: () => null,
				removeItem: vi.fn(),
				setItem: () => {
					throw new Error("blocked");
				}
			}
		});
		const wrapper = mount(GraphSketcherWorkspace);

		await vi.runAllTimersAsync();
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("Tab save unavailable");
		expect(wrapper.text()).toContain(
			"The graph is open, but this tab could not save it."
		);
		wrapper.unmount();
		vi.useRealTimers();
	});

	it("rejects oversized files before reading their contents", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();
		const text = vi.fn();
		const arrayBuffer = vi.fn();
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		Object.defineProperty(input.element, "files", {
			configurable: true,
			value: [
				{
					arrayBuffer,
					name: "too-large.csv",
					size: MAX_GRAPH_DOCUMENT_BYTES + 1,
					text
				}
			]
		});

		await input.trigger("change");

		expect(text).not.toHaveBeenCalled();
		expect(arrayBuffer).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain(
			"The graph file is larger than the 8 MB browser limit."
		);
	});
});
