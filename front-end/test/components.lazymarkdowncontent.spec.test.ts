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
});
