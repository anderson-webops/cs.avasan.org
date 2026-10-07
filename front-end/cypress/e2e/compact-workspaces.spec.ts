/// <reference types="cypress" />

context("Compact public classroom workspaces", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/api/**", { body: {} });
		cy.intercept("GET", "**/api/students/session", { body: { student: null, requiresPasswordSetup: false } });
		cy.intercept("POST", "**/api/**", { statusCode: 403, body: {} });
		cy.viewport(1440, 900);
	});
	it("puts course selection and search beside the lessons", () => {
		cy.visit("/");
		cy.get("#course-select").should("be.visible").find("option").should("have.length", 5);
		cy.get("#course-search").should("be.visible");
		cy.get(".course-toolbar-disclosure").should("not.exist");
		cy.contains("Start course").should("not.exist");
		cy.get(".site-nav").should("not.contain.text", "Graphing");
		cy.get(".site-nav").should("not.contain.text", "Join class");
	});
	it("keeps the anonymous IDE compact without losing project tools", () => {
		cy.visit("/ide");
		cy.get(".code-ide-workspace").should("have.class", "is-sidebar-collapsed");
		cy.contains("h1", "Code workspace").should("be.visible");
		cy.get('select[aria-label="Editor environment"]').should("be.visible");
		cy.get(".editor-toolbar").contains("button", "Run").should("be.visible");
		cy.get(".editor-toolbar").contains("button", "Save").should("be.visible");
		cy.contains("Storage:").should("not.exist");
		cy.contains("Protect local saves").should("not.exist");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").find('[aria-label="Download project ZIP"]').should("be.visible");
		cy.get(".ide-project-rename input").should("be.visible");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get('[aria-label="Expand project sidebar"]').click();
		cy.get(".code-ide-sidebar").should(sidebar => expect(sidebar[0].getBoundingClientRect().width).to.be.lessThan(240));
		cy.get(".workspace-type-control select").should("be.visible");
		cy.get('button[aria-label="More project options"]').should("be.visible");
		cy.window().then(win => expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2));
	});
	for (const width of [320, 390, 768]) {
		it("keeps essential IDE actions within a " + width + "px screen", () => {
			cy.viewport(width, 800);
			cy.visit("/ide");
			cy.get(".code-ide-workspace").should("be.visible");
			cy.get(".editor-actions").should(actions => {
				for (const control of actions[0].querySelectorAll("button")) {
					const box = control.getBoundingClientRect();
					expect(box.left).to.be.at.least(0);
					expect(box.right).to.be.at.most(width);
					expect(box.width).to.be.at.least(44);
					expect(box.height).to.be.at.least(44);
				}
			});
			cy.window().then(win => expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2));
			cy.get('button[aria-label="IDE settings"]').click();
			cy.get("#code-ide-settings-panel").should(panel => {
				const box = panel[0].getBoundingClientRect();
				expect(box.left).to.be.at.least(0);
				expect(box.right).to.be.at.most(width);
			});
		});
	}
});
