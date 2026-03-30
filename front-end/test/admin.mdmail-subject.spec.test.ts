import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MdMail from "@/pages/admin/mdmail.vue";

describe("Admin mail subject line", () => {
	it("allows manual editing of the subject", async () => {
		const wrapper = mount(MdMail);
		const subjectInput = wrapper.find('#subject-input');

		await subjectInput.setValue("Custom Subject line");
		expect((subjectInput.element as HTMLInputElement).value).toBe("Custom Subject line");
	});

	it("auto-fills the subject when a date is selected", async () => {
		const wrapper = mount(MdMail);
		const dateInput = wrapper.find('#subject-date-input');
		const subjectInput = wrapper.find('#subject-input');

		// 2024-03-30
		await dateInput.setValue("2024-03-30");
		await dateInput.trigger("change");

		expect((subjectInput.element as HTMLInputElement).value).toBe("Session Notes (03/30)");
	});

	it("allows manual edit after date selection", async () => {
		const wrapper = mount(MdMail);
		const dateInput = wrapper.find('#subject-date-input');
		const subjectInput = wrapper.find('#subject-input');

		// 1. Pick a date
		await dateInput.setValue("2024-03-30");
		await dateInput.trigger("change");
		expect((subjectInput.element as HTMLInputElement).value).toBe("Session Notes (03/30)");

		// 2. Manually edit
		await subjectInput.setValue("Session Notes (03/30) - Special Class");
		expect((subjectInput.element as HTMLInputElement).value).toBe("Session Notes (03/30) - Special Class");

		// 3. Changing date should still update it (as requested: "Otherwise keep default behavior")
		await dateInput.setValue("2024-03-31");
		await dateInput.trigger("change");
		expect((subjectInput.element as HTMLInputElement).value).toBe("Session Notes (03/31)");
	});
});
