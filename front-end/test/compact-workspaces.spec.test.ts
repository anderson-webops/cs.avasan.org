import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(__dirname, "../src", path), "utf8");

describe("compact classroom workspaces", () => {
	it("retains the anonymous classroom IDE and puts environment selection in each workspace", () => {
		const route = source("pages/ide.vue");
		expect(route).toContain('import("@/components/CodeIdeWorkspace.vue")');
		expect(route).not.toContain("AccountCodeIdeWorkspace");
		for (const component of ["CodeIdeWorkspace", "ScratchIdeWorkspace"])
			expect(source("components/" + component + ".vue")).toContain("<IdeEnvironmentSelect");
		expect(source("components/IdeEnvironmentSelect.vue")).toContain("Scratch blocks");
	});
	it("keeps rename and ZIP backup in settings, and starts with a compact collapsed explorer", () => {
		const workspace = source("components/CodeIdeWorkspace.vue");
		expect(workspace).toContain("const sidebarCollapsed = ref(true)");
		expect(workspace).not.toContain("Protect local saves");
		expect(workspace).not.toContain('class="project-title-field"');
		const panel = workspace.slice(workspace.indexOf('id="code-ide-settings-panel"'), workspace.indexOf(":disabled=\"isSaving\"", workspace.indexOf('id="code-ide-settings-panel"')));
		expect(panel).toContain('id="code-ide-project-title"');
		expect(panel).toContain('aria-label="Download project ZIP"');
		expect(workspace).toContain("selectedProject.courseProjectTitle");
		expect(workspace).toContain("registerStudentSessionHandoff");
		expect(workspace).toContain("Clear browser projects for next student");
	});
	it("puts courses and lesson search directly above the reader without a redundant hero", () => {
		const course = source("components/CourseExplorer.vue");
		expect(course).not.toContain('class="course-hero"');
		expect(course).not.toContain('class="course-toolbar-disclosure"');
		expect(course).toContain('<span class="sr-only">Course</span>');
		expect(course).toContain('id="course-search"');
	});
});
