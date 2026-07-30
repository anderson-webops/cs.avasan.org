/// <reference types="cypress" />

const publicCourses = [
	"Scratch Level 1",
	"Scratch Level 2",
	"Python Level 1: Classroom Edition",
	"Python Level 2: Classroom Edition",
	"PyGames: Classroom Edition"
];

context("Public classroom navigation", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.intercept("GET", "/api/accounts/me", { body: {} });
		cy.intercept("GET", "/api/students/session", {
			body: {
				student: null,
				requiresPasswordSetup: false
			}
		});
		cy.visit("/");
	});

	it("loads Julio's public classroom", () => {
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
		cy.contains("h1", "Courses").should("be.visible");
		cy.contains("No student account is needed.").should("not.exist");
		cy.contains("button", "Student sign in").should("not.exist");
		cy.get("#course-select").should("be.visible");
	});

	it("keeps only the essential public navigation", () => {
		cy.get(".site-nav").contains("a:visible", "Courses").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
		cy.contains("h1", "Courses").should("be.visible");

		cy.get(".site-nav").contains("a:visible", "Python IDE").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/python-ide`);
		cy.contains("h1", "Python IDE").should("be.visible");

		cy.get(".site-nav").contains("a:visible", "Graphing").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/graph-sketcher`);
		cy.contains("h1", "Graph Sketcher").should("be.visible");
		cy.get(".site-nav").should("not.contain", "About");
		cy.get(".site-nav").should("not.contain", "Home");
	});

	it("publishes only Scratch, Python 1-2, and PyGames", () => {
		cy.get("#course-select option").should("have.length", 5);
		cy.get("#course-select option").then(options => {
			expect(
				[...options].map(option => option.textContent?.trim())
			).to.deep.equal(publicCourses);
		});
	});

	it("keeps teacher login off public navigation and available at /admin", () => {
		cy.get(".site-nav").should("not.contain", "Teacher log in");
		cy.visit("/admin");

		cy.contains("h1", "Admin").should("be.visible");
		cy.get("form").should("be.visible");
		cy.get('input[type="email"]').should("be.visible");
		cy.get('input[type="password"]').should("be.visible");
		cy.contains("button", "Log in").should("be.visible");
		cy.get('[role="dialog"]').should("not.exist");
		cy.contains("Sign up").should("not.exist");
		cy.contains("Book a Class").should("not.exist");
	});

	it("treats removed presentation pages as missing", () => {
		for (const path of ["/about", "/courses", "/profile"]) {
			cy.visit(path);
			cy.contains("h1", "Page not found").should("be.visible");
		}
	});
});
