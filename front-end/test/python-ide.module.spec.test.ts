import { describe, expect, it } from "vitest";
import {
	createPythonIdeProject,
	dataScienceStarterCode,
	getPythonIdeModeLabel,
	isValidPythonFileName,
	normalizePythonFileName,
	pythonIdeLibrarySupport,
	pgzeroStarterCode
} from "../src/modules/pythonIde";

describe("python IDE project helpers", () => {
	it("creates data/AI notebook starter projects", () => {
		const project = createPythonIdeProject("data");

		expect(project.mode).toBe("data");
		expect(project.title).toBe("Data / AI Notebook");
		expect(project.files[0]?.content).toBe(dataScienceStarterCode);
		expect(project.files[0]?.content).toContain("pandas");
		expect(project.files[0]?.content).toContain("plt.bar");
	});

	it("creates PyGame Zero starter projects", () => {
		const project = createPythonIdeProject("pgzero");

		expect(project.mode).toBe("pgzero");
		expect(project.title).toBe("PyGame Zero Game");
		expect(project.files[0]?.content).toBe(pgzeroStarterCode);
		expect(project.files[0]?.content).toContain("Actor(");
		expect(project.files[0]?.content).toContain("pgzrun.go()");
	});

	it("labels supported runtime modes", () => {
		expect(getPythonIdeModeLabel("data")).toBe("Data / AI");
		expect(getPythonIdeModeLabel("python")).toBe("Python");
		expect(getPythonIdeModeLabel("turtle")).toBe("Turtle");
		expect(getPythonIdeModeLabel("pgzero")).toBe("PyGame Zero");
	});

	it("documents browser and local course-library support", () => {
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "Data science stack" &&
					entry.status === "browser"
			)
		).toBe(true);
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "TensorFlow / Keras" &&
					entry.status === "local"
			)
		).toBe(true);
	});

	it("normalizes Python file names without accepting unsafe names", () => {
		expect(normalizePythonFileName("helper tools")).toBe(
			"helper_tools.py"
		);
		expect(isValidPythonFileName("helper_tools.py")).toBe(true);
		expect(isValidPythonFileName("../helper.py")).toBe(false);
	});
});
