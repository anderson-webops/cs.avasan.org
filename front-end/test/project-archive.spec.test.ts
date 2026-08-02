import { describe, expect, it } from "vitest";
import { strFromU8, unzipSync } from "fflate";
import type { PythonIdeProject } from "../src/modules/pythonIde";
import {
	createProjectArchive,
	projectArchiveName
} from "../src/modules/projectArchive";

function project(
	overrides: Partial<Pick<PythonIdeProject, "files" | "title">> = {}
) {
	return {
		files: [{ name: "main.py", content: 'print("hello")\n' }],
		title: "My Python Project",
		...overrides
	};
}

describe("IDE project archives", () => {
	it("downloads one-file projects as a project-named ZIP", () => {
		const source = project();
		const archive = unzipSync(createProjectArchive(source));

		expect(projectArchiveName(source)).toBe("My Python Project.zip");
		expect(Object.keys(archive)).toEqual([
			"My Python Project/main.py"
		]);
		expect(strFromU8(archive["My Python Project/main.py"]!)).toBe(
			'print("hello")\n'
		);
	});

	it("keeps multi-file project paths and binary assets", () => {
		const source = project({
			files: [
				{ name: "game.py", content: "PLAYER_SPEED = 5\n" },
				{ name: "settings.json", content: '{"volume": 0.5}\n' },
				{
					name: "images/player.png",
					content: "AAEC/w==",
					encoding: "base64"
				}
			],
			title: "Arcade Game"
		});
		const archive = unzipSync(createProjectArchive(source));

		expect(Object.keys(archive).sort()).toEqual([
			"Arcade Game/game.py",
			"Arcade Game/images/player.png",
			"Arcade Game/settings.json"
		]);
		expect(Array.from(archive["Arcade Game/images/player.png"]!)).toEqual([
			0, 1, 2, 255
		]);
	});

	it("uses a portable project title for the archive and folder", () => {
		const source = project({ title: '  Student: Shapes / Motion?.zip  ' });
		const archive = unzipSync(createProjectArchive(source));

		expect(projectArchiveName(source)).toBe(
			"Student-Shapes-Motion.zip"
		);
		expect(Object.keys(archive)).toEqual([
			"Student-Shapes-Motion/main.py"
		]);
		expect(projectArchiveName(project({ title: "CON" }))).toBe(
			"CON-project.zip"
		);
	});

	it("rejects missing files and unsafe archive paths", () => {
		expect(() => createProjectArchive(project({ files: [] }))).toThrow(
			"does not contain any files"
		);
		expect(() =>
			createProjectArchive(
					project({
						files: [{ name: "../secret.py", content: "" }]
					})
			)).toThrow("unsafe project file path");
	});
});
