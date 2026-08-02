import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import StudentPrivacyPage from "@/pages/student-privacy.vue";

describe("student privacy page", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("explains the classroom's minimal collection in plain language", () => {
		const wrapper = mount(StudentPrivacyPage);
		const text = wrapper.text();

		expect(wrapper.get("h1").text()).toBe("Student privacy");
		expect(text).toContain("anonymous daily totals");
		expect(text).toContain("CS and Math sites");
		expect(text).toContain("Graph Sketcher opening on the Math site");
		expect(text).toContain("logically expire");
		expect(text).toContain("excluded from reports");
		expect(text).toContain("physical removal may happen briefly later");
		expect(text).toContain("up to five minutes");
		expect(text).toContain("deleted when that five-minute window ends");
		expect(text).toContain("not added to classroom analytics");
		expect(text).toContain("fixed course ID");
		expect(text).toContain("Do Not Track");
		expect(text).toContain("Global Privacy Control");
		expect(text).toContain("marks a count as attempted before sending");
		expect(text).toContain("does not retry after an error");
		expect(text).toContain("prevents an uncertain response");
		expect(text).toContain("Math graph work saved in browser tabs");
		expect(text).toContain("when a tab is duplicated");
		expect(text).toContain(
			"every open or duplicated Math Graph Sketcher tab"
		);
		expect(text).toContain("Clear for next student");
		expect(text).toContain("IDE work saved in a shared browser");
		expect(text).toContain("follow Julio’s instructions");
		expect(text).toContain("Close every IDE tab");
		expect(text).toContain("Classroom games");
		expect(text).toContain(
			"do not save game play, send answers or scores"
		);
		expect(text).toContain("random preset animal alias");
		expect(text).toContain("submitted answer is checked and then discarded");
		expect(text).toContain("There is no student name, account link, chat");
		expect(text).toContain("stay only in the running server’s memory");
		expect(text).toContain("ends within two hours");
		expect(text).toContain(
			"network address in server memory for up to five minutes"
		);
		expect(text).toContain("one-way seat-cookie hash for up to one minute");
		expect(text).toContain("Pond Paddlers room and seat");
		expect(text).toContain("Pond Paddlers security counters");
		expect(text).toContain(
			"Python-family projects already saved to a signed-in account are not part of the browser-local workspace"
		);
		expect(text).toContain(
			"Java, Karel, and BlueJ projects always remain in browser storage"
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
		expect(text).toContain("does not request the student’s provider email");
		expect(text).toContain(
			"may transiently receive a provider token response"
		);
		expect(text).toContain("does not persist provider tokens");
		expect(text).toContain(
			"file names, source code or encoded project assets"
		);
		expect(text).toContain("separate review copy");
		expect(text).toContain("failed-login counter");
		expect(text).toContain("random password-setup request marker");
		expect(text).toContain("tab’s session storage");
		expect(text).toContain("ends with the tab session");
		expect(text).toContain("PKCE verifier");
		expect(text).toContain("expires after 10 minutes");
		expect(text).toContain("signed, secure browser cookie");
		expect(text).toContain("30 minutes without activity");
		expect(text).toContain("after 8 hours");
		expect(text).toContain(
			"does not send the student’s classroom username"
		);
		expect(text).toContain("Julio can view those projects");
		expect(text).toContain("short-lived deletion receipt");
		expect(text).toContain("internal account ID");
		expect(text).toContain("excluded from Admin after 90 days");
		expect(text).toContain("has no database-expiry deadline");
		expect(text).toContain("After deletion completes");
		expect(text).toContain("Accounts remain disabled");
		expect(text).toContain("No default is assumed");
		expect(text).toContain("deletion tombstone");
		expect(text).toContain("Deleted-account write gate");
		expect(text).toContain("process-lifetime tombstone");
		expect(text).toContain("Anonymous classroom totals");
		expect(text).toContain(
			"Browser-local Math Graph and anonymous IDE work"
		);
		expect(text).toContain("does not include a password");
		expect(text).toContain("internal student account ID");
		expect(text).toContain("up to 15 minutes");
		expect(text).toContain("not added to analytics or the student record");
		expect(text).toContain("There are no ads");
		expect(text).toContain("cross-site tracking");
		expect(text).toContain("session replay");
		expect(text).toContain("keystroke tracking");
		expect(text).toContain("are not public");
		expect(text).toContain(
			"access or export retained account and project records"
		);
		expect(text).toContain(
			"correct the school-approved username alias associated with them"
		);
		expect(text).toContain(
			"signed-in student can edit that student’s own saved project titles, code, and files"
		);
		expect(text).toContain(
			"Admin correction tool changes only the approved alias"
		);
		expect(text).toContain(
			"does not rewrite a student’s project content or review copies"
		);
		expect(text).not.toContain("access, correct, export, or delete");
		expect(text).toContain("refuse further account collection or use");
		expect(text).toContain(
			"still use public courses, browser-local IDE saves, and Math's Graph Sketcher"
		);
		expect(text).toContain("identify every operator");
		expect(text).toContain("name each approved infrastructure");
		expect(text).toContain(
			"school or district contact information provided with student access"
		);
		expect(text).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
	});

	it("renders only the reviewed operator, provider, contact, and retention values", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Reviewed operator name, postal address, phone, and email"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Reviewed provider, purpose, and data categories"
		);
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"Reviewed school request channel"
		);
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");

		const text = mount(StudentPrivacyPage).text();

		expect(text).toContain(
			"Reviewed operator name, postal address, phone, and email"
		);
		expect(text).toContain(
			"Reviewed provider, purpose, and data categories"
		);
		expect(text).toContain("Reviewed school request channel");
		expect(text).toContain("90 days after Julio creates the account");
		expect(text).toContain("Startup and hourly cleanup");
		expect(text).toContain("receives one full 90-day period");
		expect(text).toContain("does not delete a record immediately");
		expect(text).not.toContain("No default is assumed");
	});

	it("discloses active retention while accounts are in maintenance mode", () => {
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");

		const text = mount(StudentPrivacyPage).text();

		expect(text).toContain("The initial deadline is 90 days");
		expect(text).toContain("automatically deleted after 90 days");
		expect(text).toContain(
			"If student account routes are later disabled while records remain in retention maintenance"
		);
		expect(text).toContain(
			"alias correction, export, and permanent deletion remain available to Julio"
		);
		expect(text).toContain(
			"Student sign-in, project editing, and project-review tools do not"
		);
		expect(text).toContain(
			"Julio does not rewrite retained student code in Admin"
		);
		expect(text).not.toContain("No default is assumed");
	});
});
