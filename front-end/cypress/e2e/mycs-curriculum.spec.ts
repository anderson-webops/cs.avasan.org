/// <reference types="cypress" />

interface MyCsGuideScenario {
	courseId: string;
	moduleTitle: string;
	sourceUrl: string;
	starter?: string;
	title: string;
}

const guideScenarios: MyCsGuideScenario[] = [
	{
		courseId: "scratch-level-1",
		moduleTitle: "5. Conditions and decisions",
		sourceUrl: "https://sites.google.com/a/sfusd.edu/mycs-teacher/maze/4-2",
		title: "MyCS: Maze Design: Repeated Collision Checks"
	},
	{
		courseId: "scratch-level-2",
		moduleTitle: "GM3 Complex Conditionals",
		sourceUrl:
			"https://sites.google.com/a/sfusd.edu/mycs-teacher/unit3/3-7",
		starter: "blank",
		title: "MyCS: Two Sides of the Stage"
	}
];

context("MyCS choices in the existing public classroom courses", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/api/**", { body: {} });
		cy.intercept("GET", "**/api/students/session", {
			body: { student: null, requiresPasswordSetup: false }
		});
		cy.intercept("POST", "**/api/**", { statusCode: 403, body: {} });
	});

	for (const width of [1440, 390]) {
		it(`renders credited anonymous guides without resetting a continuation at ${width}px`, () => {
			cy.viewport(width, 900);
			for (const guide of guideScenarios) {
				cy.visit(`/#${guide.courseId}`);
				cy.get("#course-select").should("have.value", guide.courseId);
				cy.get("#course-select option").should("have.length", 5);
				if (width === 390) {
					cy.get("button.outline-toggle")
						.should("be.visible")
						.should("have.attr", "aria-expanded", "false")
						.click()
						.should("have.attr", "aria-expanded", "true");
				}
				cy.contains(".outline-button", guide.moduleTitle)
					.scrollIntoView()
					.should("be.visible")
					.click();
				cy.get("#course-reader-panel h3").should(
					"have.text",
					guide.moduleTitle
				);
				if (width === 390) {
					cy.get("button.outline-toggle").should(
						"have.attr",
						"aria-expanded",
						"false"
					);
				}
				cy.get(".lesson-view-toggle")
					.contains("button", "Supplemental Projects")
					.click()
					.should("have.attr", "aria-pressed", "true");

				cy.contains(".lesson-card h5", guide.title)
					.closest(".lesson-card")
					.scrollIntoView()
					.should("have.class", "is-supplemental")
					.within(() => {
						cy.contains("strong", "Model:").should("be.visible");
						cy.contains("strong", "Build:").should("be.visible");
						cy.contains("h6", "Optional · Hard").should(
							"be.visible"
						);
						cy.contains("h6", "Check").should("be.visible");
						cy.contains("strong", "Source and reuse:").should(
							"be.visible"
						);
						cy.contains("a", "SFUSD CS team’s MyCS")
							.should("be.visible")
							.and("have.attr", "href", guide.sourceUrl);
						cy.contains("a", "CC BY-NC-SA 4.0")
							.should("be.visible")
							.and(
								"have.attr",
								"href",
								"https://creativecommons.org/licenses/by-nc-sa/4.0/"
							);
						if (guide.starter) {
							cy.get(
								`a.resource-link[href="/ide?mode=scratch&starter=${guide.starter}"]`
							).should("be.visible");
						} else {
							cy.get('a[href^="/ide"], .is-starter-share').should(
								"not.exist"
							);
						}
					});
				cy.contains("button", "Student sign in").should("not.exist");
			}
		});
	}
});
