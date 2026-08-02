import { describe, expect, it } from "vitest";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import type { PythonIdeProject } from "../src/modules/pythonIde";
import {
	BLUEJ_HOME_URL,
	BLUEJ_SOURCE_URL,
	blueJProjectArchiveName,
	blueJProjectTitleFromArchiveName,
	createBlueJProjectArchive,
	createBlueJProjectFiles,
	importBlueJProjectArchive
} from "../src/modules/blueJProjectExport";

function javaProject(
	overrides: Partial<Pick<PythonIdeProject, "files" | "title">> = {}
): PythonIdeProject {
	return {
		_id: "local-bluej",
		activeFileName: "Main.java",
		files: [
			{
				content:
					'public class Main { public static void main(String[] args) { System.out.println("Hi"); } }\n',
				name: "Main.java"
			}
		],
		mode: "java",
		title: "BlueJ Java Project",
		...overrides
	};
}

describe("BlueJ project import and export", () => {
	it("exports a bounded BlueJ-ready project archive", () => {
		const source = javaProject();
		const archive = unzipSync(createBlueJProjectArchive(source));
		const names = Object.keys(archive).sort();

		expect(blueJProjectArchiveName(source)).toBe("BlueJ-Java-Project.zip");
		expect(names).toEqual([
			"BlueJ-Java-Project/Main.java",
			"BlueJ-Java-Project/README.TXT",
			"BlueJ-Java-Project/package.bluej"
		]);
		expect(strFromU8(archive["BlueJ-Java-Project/package.bluej"]!)).toContain(
			"package.numTargets=1"
		);
		expect(strFromU8(archive["BlueJ-Java-Project/README.TXT"]!)).toContain(
			"exported from the IDE"
		);
	});

	it("normalizes README names and omits unsafe or binary files", () => {
		const files = createBlueJProjectFiles(
			javaProject({
				files: [
					{ content: "class Main {}\n", name: "Main.java" },
					{ content: "Teacher notes\n", name: "readme.txt" },
					{ content: "AAEC", encoding: "base64", name: "photo.png" },
					{ content: "nope", name: "../secret.java" }
				]
			})
		);

		expect(files.map(file => file.name)).toEqual([
			"Main.java",
			"README.TXT",
			"package.bluej"
		]);
		expect(files.find(file => file.name === "README.TXT")?.content).toBe(
			"Teacher notes\n"
		);
	});

	it("imports only safe text files from the BlueJ project root", () => {
		const archive = zipSync({
			"Student-Lab/Main.java": strToU8("class Main {}\n"),
			"Student-Lab/README.TXT": strToU8("Open this in BlueJ.\n"),
			"Student-Lab/package.bluej": strToU8("#BlueJ package file\n"),
			"Student-Lab/Main.ctxt": strToU8("generated metadata"),
			"Other/Outside.java": strToU8("class Outside {}\n"),
			"Student-Lab/image.png": new Uint8Array([0, 1, 2])
		});
		const result = importBlueJProjectArchive(archive);

		expect(result.hasBlueJPackage).toBe(true);
		expect(result.files.map(file => file.name)).toEqual([
			"Main.java",
			"README.TXT"
		]);
		expect(result.skippedFiles).toContain(
			"Other/Outside.java (outside BlueJ project)"
		);
		expect(result.skippedFiles).toContain("image.png");
	});

	it("enforces archive, file-count, and text-size limits", () => {
		expect(() =>
			importBlueJProjectArchive(new Uint8Array(2), {
				maxArchiveBytes: 1
			})
		).toThrow("larger than 1 byte");

		const archive = zipSync({
			"Lab/A.java": strToU8("class A {}"),
			"Lab/B.java": strToU8("class B {}"),
			"Lab/package.bluej": strToU8("#BlueJ package file")
		});
		const result = importBlueJProjectArchive(archive, {
			maxFiles: 1,
			maxTextFileBytes: 128
		});

		expect(result.files).toHaveLength(1);
		expect(result.skippedFiles).toContain("B.java (too many files)");
	});

	it("uses portable imported titles and reviewed BlueJ links", () => {
		expect(blueJProjectTitleFromArchiveName("Student-Lab.zip")).toBe(
			"Student Lab BlueJ Project"
		);
		expect(BLUEJ_HOME_URL).toBe("https://www.bluej.org/");
		expect(BLUEJ_SOURCE_URL).toBe(
			"https://github.com/k-pet-group/BlueJ-Greenfoot"
		);
	});
});
