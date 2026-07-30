import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import StudentPrivacyPage from "@/pages/student-privacy.vue";

describe("student privacy page", () => {
	it("explains the classroom's minimal collection in plain language", () => {
		const wrapper = mount(StudentPrivacyPage);
		const text = wrapper.text();

		expect(wrapper.get("h1").text()).toBe("Student privacy");
		expect(text).toContain("anonymous daily totals");
		expect(text).toContain("CS and Math sites");
		expect(text).toContain("Graph Sketcher opening on the Math site");
		expect(text).toContain("up to 90 days");
		expect(text).toContain("up to five minutes");
		expect(text).toContain("deleted when that five-minute window ends");
		expect(text).toContain("not added to classroom analytics");
		expect(text).toContain("fixed course ID");
		expect(text).toContain("Do Not Track");
		expect(text).toContain("Global Privacy Control");
		expect(text).toContain("marks a count as attempted before sending");
		expect(text).toContain("does not retry after an error");
		expect(text).toContain("prevents an uncertain response");
		expect(text).toContain("Graph work saved in browser tabs");
		expect(text).toContain("when a tab is duplicated");
		expect(text).toContain("every open or duplicated Graph Sketcher tab");
		expect(text).toContain("Clear for next student");
		expect(text).toContain("Python work saved in a shared browser");
		expect(text).toContain("follow Julio’s instructions");
		expect(text).toContain("Close every Python IDE tab");
		expect(text).toContain(
			"Projects already saved to a signed-in account are not part of the browser-local workspace"
		);
		expect(text).not.toContain("Clear browser projects for next student");
		expect(text).toContain(
			"not sent to the classroom server, student accounts, or analytics"
		);
		expect(text).toContain("username and no email");
		expect(text).toContain("school-approved alias");
		expect(text).toContain("roster mapping stays");
		expect(text).toContain(
			"one-time code before creating a password or connecting"
		);
		expect(text).toContain("hash of that provider’s opaque account");
		expect(text).toContain(
			"does not request or store the student’s provider email"
		);
		expect(text).toContain("provider access tokens");
		expect(text).toContain(
			"does not send the student’s classroom username"
		);
		expect(text).toContain("Julio can view saved projects");
		expect(text).toContain("short-lived deletion receipt");
		expect(text).toContain("internal account ID");
		expect(text).toContain("deletion counts for up to 90 days");
		expect(text).toContain("does not include a password");
		expect(text).toContain("internal student account ID");
		expect(text).toContain("up to 15 minutes");
		expect(text).toContain("not added to analytics or the student record");
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
