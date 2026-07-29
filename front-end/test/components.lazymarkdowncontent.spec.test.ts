import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";

describe("LazyMarkdownContent.vue", () => {
	it("renders markdown tables as structured table elements", async () => {
		const wrapper = mount(LazyMarkdownContent, {
			props: {
				content: [
					"| Sample | Mass (g) | Temperature (C) |",
					"| --- | ---: | ---: |",
					"| Water | 24.8 | 22.0 |"
				].join("\n")
			}
		});

		await flushPromises();
		await vi.waitFor(() => {
			expect(wrapper.find("table").exists()).toBe(true);
		});

		const tableWrapper = wrapper.find(".markdown-table-scroll");
		expect(tableWrapper.exists()).toBe(true);
		expect(tableWrapper.attributes("tabindex")).toBe("0");
		expect(tableWrapper.find("table").exists()).toBe(true);
		expect(wrapper.findAll("th").map(cell => cell.text())).toEqual([
			"Sample",
			"Mass (g)",
			"Temperature (C)"
		]);
		expect(wrapper.findAll("td").map(cell => cell.text())).toEqual([
			"Water",
			"24.8",
			"22.0"
		]);
	});

	it("routes local course asset markdown links through the styled viewer", async () => {
		const wrapper = mount(LazyMarkdownContent, {
			props: {
				content:
					"[Measurement tables](" +
					"/course-assets/chemistry/chemistry-materials-pack.md#measurement-tables-and-unit-conversions" +
					") and [external](https://example.com/file.md)"
			}
		});

		await flushPromises();
		await vi.waitFor(() => {
			expect(wrapper.findAll("a")).toHaveLength(2);
		});

		const assetLink = wrapper.find("a");
		expect(assetLink.attributes("href")).toBe(
			"/course-resource?" +
				"asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23measurement-tables-and-unit-conversions"
		);
		expect(wrapper.find('a[href="https://example.com/file.md"]').exists()).toBe(
			true
		);
	});

	it("formats compact inline course steps as readable markdown lists", async () => {
		const wrapper = mount(LazyMarkdownContent, {
			props: {
				content: [
					"**Goal:** Build a small game. **Build steps:** 1. Create the player sprite. 2. Add keyboard movement. 3. Test the restart path. **Checkpoint:** The game restarts cleanly.",
					"**Checks:** - The normal path works. - One boundary case is tested."
				].join("\n")
			}
		});

		await flushPromises();
		await vi.waitFor(() => {
			expect(wrapper.find("ol").exists()).toBe(true);
			expect(wrapper.find("ul").exists()).toBe(true);
		});

		expect(wrapper.findAll("ol li").map(item => item.text())).toEqual([
			"Create the player sprite.",
			"Add keyboard movement.",
			"Test the restart path."
		]);
		expect(wrapper.findAll("ul li").map(item => item.text())).toEqual([
			"The normal path works.",
			"One boundary case is tested."
		]);
		expect(wrapper.text()).toContain("Checkpoint: The game restarts cleanly.");
	});

	it("does not split hyphenated project titles into fake bullet items", async () => {
		const wrapper = mount(LazyMarkdownContent, {
			props: {
				content: [
					"**Outcome:** - For Open Ended Project - Create a Drawing, identify the visible canvas behavior.",
					"- Run Open Ended Project - Create a Drawing with a Turtle plan.",
					"- Keep Open Ended Project - Create a Drawing debuggable."
				].join(" ")
			}
		});

		await flushPromises();
		await vi.waitFor(() => {
			expect(wrapper.find("ul").exists()).toBe(true);
		});

		expect(wrapper.findAll("ul li").map(item => item.text())).toEqual([
			"For Open Ended Project - Create a Drawing, identify the visible canvas behavior.",
			"Run Open Ended Project - Create a Drawing with a Turtle plan.",
			"Keep Open Ended Project - Create a Drawing debuggable."
		]);
		expect(wrapper.html()).not.toMatch(
			/Open Ended Project\s*<\/li>\s*<li>Create a Drawing/
		);
	});

	it("does not rewrite fenced code blocks while formatting compact course text", async () => {
		const wrapper = mount(LazyMarkdownContent, {
			props: {
				content: [
					"**Build steps:** 1. Read the setup. 2. Run the code.",
					"",
					"```python",
					"import turtle",
					"",
					"# Function definitions",
					"def draw_border():",
					"    for side in range(4):",
					"        turtle.forward(100)",
					"        turtle.left(90)",
					"",
					"# Continuous game logic",
					"while True:",
					"    draw_border()",
					"```"
				].join("\n")
			}
		});

		await flushPromises();
		await vi.waitFor(() => {
			expect(wrapper.find("ol").exists()).toBe(true);
			expect(wrapper.findAll("pre code")).toHaveLength(1);
		});

		const codeText = wrapper.find("pre code").text();
		expect(wrapper.get("pre").attributes("tabindex")).toBe("0");
		expect(codeText).toContain("# Function definitions");
		expect(codeText).toContain("def draw_border():");
		expect(codeText).toContain("# Continuous game logic");
		expect(codeText).toContain("while True:");
		expect(wrapper.findAll("pre code")).toHaveLength(1);
	});
});
