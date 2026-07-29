/// <reference types="cypress" />

const publicCourses = [
	"Scratch Level 1",
	"Scratch Level 2",
	"Python Level 1",
	"Python Level 2",
	"PyGames"
];

context("Public classroom navigation", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.intercept("GET", "/api/accounts/me", { body: {} });
		cy.visit("/");
	});

	it("loads Julio's account-free classroom", () => {
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
		cy.contains("h1", "Make something").should("be.visible");
		cy.contains("Grade-school teacher Julio").should("be.visible");
		cy.contains("No student account").should("be.visible");
	});

	it("navigates among the public classroom pages", () => {
		cy.get(".site-nav").contains("a:visible", "Courses").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/courses`);
		cy.contains("h1", "Computer Science Courses").should("be.visible");

		cy.get(".site-nav").contains("a:visible", "Python IDE").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/python-ide`);
		cy.contains("h1", "Code, run, and draw in Python").should("be.visible");

		cy.get(".site-nav").contains("a:visible", "About Julio").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/about`);
		cy.contains("h1", "A teacher's small coding library").should(
			"be.visible"
		);

		cy.get(".site-nav").contains("a:visible", "Home").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
	});

	it("publishes only Scratch, Python 1-2, and PyGames", () => {
		cy.get(".site-nav").contains("a:visible", "Courses").click();

		cy.get("#course-select option").should("have.length", 5);
		cy.get("#course-select option").then(options => {
			expect([...options].map(option => option.textContent?.trim())).to.deep
				.equal(publicCourses);
		});
		cy.contains("Every course is available without a student account.").should(
			"be.visible"
		);
	});

	it("keeps teacher login off public navigation and available at /admin", () => {
		cy.get(".site-nav").should("not.contain", "Teacher log in");
		cy.visit("/admin");

		cy.get("#teacher-login-dialog")
			.should("be.visible")
			.and("have.attr", "role", "dialog");
		cy.contains(
			"This private sign-in is only for Julio, the teacher who maintains the course library."
		).should("be.visible");
		cy.contains("Students do not need an account.").should("be.visible");
		cy.contains("Sign up").should("not.exist");
		cy.contains("Book a Class").should("not.exist");
	});
});
