import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";

const wrappers: ReturnType<typeof mount>[] = [];
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()));
function mountDisclosure(props = {}) {
	const wrapper = mount(WorkspaceDisclosure, {
		props: { label: "Student account", ...props },
		attachTo: document.body,
		slots: { default: '<input aria-label="Account value" />' }
	});
	wrappers.push(wrapper);
	return wrapper;
}

describe("WorkspaceDisclosure", () => {
	it("replaces native triangle disclosures throughout the application", () => {
		const sourceRoot = join(process.cwd(), "src");
		const files = readdirSync(sourceRoot, { recursive: true })
			.map(String)
			.filter(file => file.endsWith(".vue"));
		for (const file of files) {
			const source = readFileSync(join(sourceRoot, file), "utf8");
			expect(source, file).not.toMatch(
				/<(?:details|summary)\b|HTMLDetailsElement/
			);
		}
	});
	it("uses a labeled button, stable linkage, and reversible mounted content", async () => {
		const wrapper = mountDisclosure();
		const trigger = wrapper.get("button");
		const content = wrapper.get(".workspace-disclosure__content");
		expect(wrapper.find("details, summary").exists()).toBe(false);
		expect(trigger.attributes("aria-expanded")).toBe("false");
		expect(trigger.attributes("aria-controls")).toBe(
			content.attributes("id")
		);
		expect(content.isVisible()).toBe(false);
		await trigger.trigger("click");
		expect(trigger.text()).toContain("Hide");
		expect(content.isVisible()).toBe(true);
		await wrapper.get("input").setValue("Unsaved change");
		await trigger.trigger("click");
		await trigger.trigger("click");
		expect(wrapper.get<HTMLInputElement>("input").element.value).toBe(
			"Unsaved change"
		);
		expect(wrapper.emitted("toggle")).toEqual([[true], [false], [true]]);
	});
	it("closes on Escape and returns focus to its action button", async () => {
		const wrapper = mountDisclosure();
		await wrapper.get("button").trigger("click");
		wrapper.get<HTMLInputElement>("input").element.focus();
		await wrapper.get("input").trigger("keydown", { key: "Escape" });
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("false");
		expect(document.activeElement).toBe(wrapper.get("button").element);
	});
	it("dismisses a popover outside but not inside, including focus navigation", async () => {
		const wrapper = mountDisclosure({ popover: true });
		await wrapper.get("button").trigger("click");
		await wrapper.get("input").trigger("pointerdown");
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("true");
		document.body.dispatchEvent(
			new Event("pointerdown", { bubbles: true })
		);
		await wrapper.vm.$nextTick();
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("false");
		await wrapper.get("button").trigger("click");
		await wrapper
			.get("input")
			.trigger("focusout", { relatedTarget: document.body });
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("false");
	});
	it("can begin open and still close without a parent model listener", async () => {
		const wrapper = mountDisclosure({ open: true });
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("true");
		await wrapper.get("button").trigger("click");
		expect(wrapper.get("button").attributes("aria-expanded")).toBe("false");
	});
	it("shows embedded tools without adding another control", () => {
		const wrapper = mountDisclosure({ embedded: true });
		expect(wrapper.find("button").exists()).toBe(false);
		expect(wrapper.get("input").isVisible()).toBe(true);
	});
});
