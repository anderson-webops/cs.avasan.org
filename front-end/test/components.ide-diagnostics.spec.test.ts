import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import IdeDiagnosticsControls from "@/components/IdeDiagnosticsControls.vue";
import { createIdeDiagnostics } from "@/modules/ideDiagnostics";

const mocks = vi.hoisted(() => ({ post: vi.fn(), copy: vi.fn() }));
vi.mock("@/api", () => ({ api: { post: mocks.post } }));

beforeEach(() => {
	vi.clearAllMocks();
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: { writeText: mocks.copy }
	});
	HTMLDialogElement.prototype.showModal = function () {
		this.open = true;
	};
	HTMLDialogElement.prototype.close = function () {
		this.open = false;
	};
});
afterEach(() => {
	document.body.innerHTML = "";
});

describe("IDE report consent", () => {
	it("copies safely without making a request, then sends exactly the confirmed preview", async () => {
		const wrapper = mount(IdeDiagnosticsControls, {
			attachTo: document.body,
			props: {
				capture: () =>
					createIdeDiagnostics(
						"bluej",
						"importing",
						null,
						"not-loaded"
					)
			}
		});
		await wrapper.findAll("button")[0].trigger("click");
		expect(mocks.copy).toHaveBeenCalledOnce();
		expect(mocks.post).not.toHaveBeenCalled();
		await wrapper.findAll("button")[1].trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain("Desktop BlueJ");
		const submit = wrapper
			.findAll("button")
			.find(button => button.text() === "Submit report")!;
		expect(submit.attributes("disabled")).toBeDefined();
		await wrapper.find("textarea").setValue("Canvas did not move.");
		await wrapper.findAll('input[type="checkbox"]')[1].setValue(true);
		const expected = JSON.parse(wrapper.find("pre").text());
		mocks.post.mockResolvedValueOnce({
			data: { referenceID: expected.diagnostics.referenceID }
		});
		await submit.trigger("click");
		await flushPromises();
		expect(mocks.post).toHaveBeenCalledWith("/ide-reports", expected, {
			timeout: 15000
		});
		expect(wrapper.text()).toContain(
			`Report saved. Reference: ${expected.diagnostics.referenceID}`
		);
		wrapper.unmount();
	});
	it("allows stack removal, invalidates consent after edits, and preserves exact retries", async () => {
		const snapshot = createIdeDiagnostics(
			"python",
			"executing",
			{
				category: "student-code",
				errorType: "NameError",
				stack: [{ scope: "project", line: 4 }]
			},
			"3.14.0"
		);
		const wrapper = mount(IdeDiagnosticsControls, {
			props: { capture: () => snapshot }
		});
		await wrapper.findAll("button")[1].trigger("click");
		await flushPromises();
		const checks = wrapper.findAll('input[type="checkbox"]');
		await checks[1].setValue(true);
		await checks[0].setValue(false);
		expect((checks[1].element as HTMLInputElement).checked).toBe(false);
		expect(
			JSON.parse(wrapper.find("pre").text()).diagnostics.stack
		).toEqual([]);
		await checks[1].setValue(true);
		mocks.post.mockRejectedValueOnce(new Error("offline"));
		const submit = wrapper
			.findAll("button")
			.find(button => button.text() === "Submit report")!;
		await submit.trigger("click");
		await flushPromises();
		expect(wrapper.find("fieldset").attributes("disabled")).toBeDefined();
		mocks.post.mockResolvedValueOnce({
			data: { referenceID: snapshot.referenceID }
		});
		await submit.trigger("click");
		await flushPromises();
		expect(mocks.post.mock.calls[0]).toEqual(mocks.post.mock.calls[1]);
		wrapper.unmount();
	});
	it("provides a local preview if clipboard access is denied", async () => {
		mocks.copy.mockRejectedValueOnce(new Error("denied"));
		const wrapper = mount(IdeDiagnosticsControls, {
			props: {
				capture: () =>
					createIdeDiagnostics("turtle", "idle", null, "not-loaded")
			}
		});
		await wrapper.findAll("button")[0].trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain("Clipboard is unavailable");
		expect(wrapper.find("dialog").element.open).toBe(true);
		expect(mocks.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
});
