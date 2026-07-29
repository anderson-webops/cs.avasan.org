import { zipSync } from "fflate";

const legacyGraph = `<?xml version="1.0" encoding="UTF-8"?>
<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1">
	<graph>
		<vertex id="v1" x="1" y="2" />
	</graph>
</document>`;

context("Graph Sketcher browser workspace", () => {
	it("imports a legacy archive in the worker and clears it for the next student", () => {
		const archive = zipSync({
			"Project/contents.xml": new TextEncoder().encode(legacyGraph)
		});

		cy.visit("/graph-sketcher");
		cy.get("input[aria-label='Open or import a graph project']")
			.should("be.enabled")
			.selectFile(
				{
					contents: Cypress.Buffer.from(archive),
					fileName: "classroom.ograph",
					mimeType: "application/zip"
				},
				{ force: true }
			);

		cy.contains(
			"Imported classroom.ograph without modifying the original file."
		).should("be.visible");
		cy.get("#canvas-title").should("contain.text", "classroom");

		cy.contains("button", "Clear for next student").click();
		cy.contains("button", "Confirm clear").click();
		cy.contains(
			"Cleared this tab's graph. It is ready for the next student."
		).should("be.visible");
		cy.window().should(window => {
			expect(
				window.sessionStorage.getItem(
					"cs-avasan-graph-sketcher-session-v1"
				)
			).to.equal(null);
		});
	});
});
