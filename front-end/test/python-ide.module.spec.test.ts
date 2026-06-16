import { describe, expect, it } from "vitest";
import {
	createPythonIdeProject,
	getPythonIdeModeLabel,
	isValidPythonFileName,
	normalizePythonFileName,
	pgzeroStarterCode
} from "../src/modules/pythonIde";

describe("python IDE project helpers", () => {
	it("creates PyGame Zero starter projects", () => {
		const project = createPythonIdeProject("pgzero");

		expect(project.mode).toBe("pgzero");
		expect(project.title).toBe("PyGame Zero Game");
		expect(project.files[0]?.content).toBe(pgzeroStarterCode);
		expect(project.files[0]?.content).toContain("Actor(");
		expect(project.files[0]?.content).toContain("pgzrun.go()");
	});

	it("labels supported runtime modes", () => {
		expect(getPythonIdeModeLabel("python")).toBe("Python");
		expect(getPythonIdeModeLabel("turtle")).toBe("Turtle");
		expect(getPythonIdeModeLabel("pgzero")).toBe("PyGame Zero");
	});

	it("normalizes Python file names without accepting unsafe names", () => {
		expect(normalizePythonFileName("helper tools")).toBe(
			"helper_tools.py"
		);
		expect(isValidPythonFileName("helper_tools.py")).toBe(true);
		expect(isValidPythonFileName("../helper.py")).toBe(false);
	});
});
