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

		cy.get(".site-nav").contains("a:visible", "IDE").click();
		cy.location("pathname").should("match", /^\/ide\/?$/);
		cy.contains("h1", "IDE").should("be.visible");
		cy.contains("Using a shared computer?").should("not.exist");
		cy.contains(
			"button",
			"Clear browser projects for next student"
		).should("not.exist");

		cy.get(".site-nav").contains("a:visible", "Games").click();
		cy.location("pathname").should("match", /^\/games\/?$/);
		cy.contains("h1", "Games").should("be.visible");
		for (const game of [
			"Pond Paddlers",
			"Crosswalk Critters",
			"Machine Workshop",
			"Comet Hopper",
			"T-Rex Runner"
		]) {
			cy.contains("a", game).should("be.visible");
		}

		cy.contains("a", "T-Rex Runner").click();
		cy.location("pathname").should("match", /^\/games\/t-rex-runner\/?$/);
		cy.contains("h1", "T-Rex Runner").should("be.visible");
		cy.get('iframe[title="T-Rex Runner game"]')
			.should("be.visible")
			.and("have.attr", "sandbox", "allow-scripts");
		cy.contains("button", "Stop game").should("be.visible");
		cy.contains("a", "All games").click();
		cy.contains("h1", "Games").should("be.visible");

		cy.get(".site-nav").should("not.contain", "Graphing");
		cy.get(".site-nav").should("not.contain", "About");
		cy.get(".site-nav").should("not.contain", "Home");
	});

	it("offers the complete IDE workspace and starter library", () => {
		cy.visit("/ide");
		cy.get(".workspace-type-control select option").then(options => {
			expect(
				[...options].map(option => option.textContent?.trim())
			).to.deep.equal([
				"Python",
				"Python Turtle",
				"PyGame Zero",
				"Data / AI",
				"Java",
				"Karel Java",
				"BlueJ Java"
			]);
		});

		cy.get('button[aria-label="More project options"]').click();
		cy.get(".project-create-menu button").then(buttons => {
			expect(
				[...buttons].map(button => button.textContent?.trim())
			).to.deep.equal([
				"Import BlueJ ZIP",
				"Color Circle Art",
				"Picasso Keyboard Painter",
				"Triangle Motion Starter",
				"Neon Trail Painter",
				"Firework Festival",
				"Spiral Galaxy",
				"Turtle Race Day",
				"Flower Garden Clicker",
				"Maze Explorer",
				"Classroom Turtle Studio",
				"Python Level 1 Outline",
				"PyGame Zero Outline",
				"Java Outline",
				"BlueJ Java Project",
				"Karel Java Outline",
				"Demo Python",
				"Demo Python Turtle",
				"Demo PyGame Zero",
				"Demo Data / AI",
				"Demo Java",
				"Demo Karel Java"
			]);
		});
	});

	it("keeps IDE controls usable across phone and tablet viewports", () => {
		cy.visit("/ide");
		for (const width of [320, 360, 390, 768]) {
			cy.viewport(width, 800);
			cy.get(".editor-actions").should(actions => {
				const viewportWidth =
					actions[0].ownerDocument.defaultView?.innerWidth;
				expect(viewportWidth).to.equal(width);
				for (const control of actions[0].querySelectorAll("button")) {
					const box = control.getBoundingClientRect();
					expect(box.left).to.be.at.least(0);
					expect(box.right).to.be.at.most(viewportWidth ?? 0);
					expect(box.width).to.be.at.least(44);
					expect(box.height).to.be.at.least(44);
				}
			});
			cy.document().should(document => {
				expect(document.documentElement.scrollWidth).to.be.at.most(
					document.documentElement.clientWidth
				);
			});
		}

		cy.viewport(320, 800);
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").should(panel => {
			const box = panel[0].getBoundingClientRect();
			expect(box.left).to.be.at.least(0);
			expect(box.right).to.be.at.most(320);
		});
	});

	it("opens a directly linked Data / AI demo in its requested workspace", () => {
		cy.visit("/ide/?mode=data&template=demo");
		cy.get(".workspace-type-control select").should("have.value", "data");
		cy.get(".project-button.is-active").should(
			"contain.text",
			"Data / AI Notebook"
		);
	});

	it("publishes only Scratch, Python 1-2, and PyGames", () => {
		cy.get("#course-select option").should("have.length", 5);
		cy.get("#course-select option").then(options => {
			expect(
				[...options].map(option => option.textContent?.trim())
			).to.deep.equal(publicCourses);
		});
	});

	it("renders curated course video and image media", () => {
		cy.visit("/#pygames");
		cy.get(
			'button[aria-label="Show module 3: PyG1 Object-Oriented Programming: Actors"]'
		).click();
		cy.contains("h5", "PyG1 Project 1: Rainbow Fill")
			.closest("article")
			.within(() => {
				cy.get(
					'video[aria-label="Demo video for PyG1 Project 1: Rainbow Fill"]',
					{ timeout: 15_000 }
				)
					.should("be.visible")
					.should(video => {
						const element = video[0] as HTMLVideoElement;
						expect(element.error).to.equal(null);
						expect(element.readyState).to.be.greaterThan(0);
						expect(element.videoWidth).to.be.greaterThan(0);
					});
				cy.get(
					'video[aria-label="Demo video for PyG1 Project 1: Rainbow Fill"] source'
				).should(
					"have.attr",
					"src",
					"https://static.cs.avasan.org/pyg_1_rainbow_fill.mp4"
				);
				cy.contains("Static asset pending").should("not.exist");
			});

		cy.visit("/#python-level-2");
		cy.get(
			'button[aria-label="Show module 2: PS1 Variables, Strings, and Input"]'
		).click();
		cy.contains("h5", "PS1 Project 1: Mad Libs")
			.closest("article")
			.within(() => {
				cy.get(
					'img[src="https://static.cs.avasan.org/ps1_mad_libs.gif"]',
					{ timeout: 15_000 }
				)
					.scrollIntoView()
					.should(image => {
						const element = image[0] as HTMLImageElement;
						expect(element.complete).to.equal(true);
						expect(element.naturalWidth).to.be.greaterThan(0);
						expect(element.naturalHeight).to.be.greaterThan(0);
					})
					.should("be.visible");
				cy.contains("Static asset pending").should("not.exist");
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
		for (const path of [
			"/about",
			"/courses",
			"/login",
			"/profile",
			"/graph-sketcher"
		]) {
			cy.visit(path, { failOnStatusCode: false });
			cy.contains("h1", "Page not found").should("be.visible");
			cy.contains("a", "View courses").should("be.visible");
		}
	});
});
