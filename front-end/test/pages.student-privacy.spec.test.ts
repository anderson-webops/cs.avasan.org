import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import StudentPrivacyPage from "@/pages/student-privacy.vue";

describe("student privacy page", () => {
	it("explains the classroom's minimal collection in plain language", () => {
		const wrapper = mount(StudentPrivacyPage);
		const text = wrapper.text();

		expect(wrapper.get("h1").text()).toBe("Student privacy");
		expect(text).toContain("anonymous daily totals");
		expect(text).toContain("up to 90 days");
		expect(text).toContain("up to five minutes");
		expect(text).toContain("not added to classroom analytics");
		expect(text).toContain("Graph work saved in browser tabs");
		expect(text).toContain("when a tab is duplicated");
		expect(text).toContain("every open or duplicated Graph Sketcher tab");
		expect(text).toContain("Clear for next student");
		expect(text).toContain(
			"not sent to the classroom server, student accounts, or analytics"
		);
		expect(text).toContain("username and no email");
		expect(text).toContain(
			"Access codes are used only to set up a password"
		);
		expect(text).toContain("Julio can view saved projects");
		expect(text).toContain("There are no ads");
		expect(text).toContain("cross-site tracking");
		expect(text).toContain("session replay");
		expect(text).toContain("keystroke tracking");
		expect(text).toContain("access, correct, export, or delete");
		expect(text).toContain(
			"school or district contact information provided with student access"
		);
		expect(text).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
	});
});
