import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";
import { pythonLevel1PreviewRequirements } from "../scripts/python-level-1-preview-requirements";
import { loadRawCourse } from "../src/stores/courses/index";

describe("deferred Python Level 1 result previews", () => {
	it("keeps every request linked to a unique real public lesson", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();
		const publicItems = new Map(
			course!.modules.flatMap(module =>
				[...module.curriculum, ...module.supplementalProjects].map(
					item => [item.id, module.id]
				)
			)
		);
		const requirements = pythonLevel1PreviewRequirements();
		expect(requirements.length).toBeGreaterThan(0);
		expect(new Set(requirements.map(item => item.lessonId)).size).toBe(
			requirements.length
		);
		for (const requirement of requirements) {
			expect(requirement.courseId).toBe("python-level-1");
			expect(publicItems.get(requirement.lessonId)).toBe(
				requirement.moduleId
			);
			expect(requirement.status).toBe("waiting-for-material");
			expect(requirement).not.toHaveProperty("mediaLink");
		}
	});

	it("prioritizes the nine actual launch projects without inventing legacy media", () => {
		const launches = pythonLevel1PreviewRequirements().filter(item =>
			/^Launch Project \d:/.test(item.lessonTitle)
		);
		expect(launches).toHaveLength(9);
		expect(launches.map(item => item.lessonTitle)).toEqual([
			"Launch Project 1: Color Circle Art",
			"Launch Project 2: Picasso Keyboard Painter",
			"Launch Project 3: Triangle Motion",
			"Launch Project 4: Neon Trail Painter",
			"Launch Project 5: Firework Festival",
			"Launch Project 6: Spiral Galaxy",
			"Launch Project 7: Turtle Race Day",
			"Launch Project 8: Flower Garden Clicker",
			"Launch Project 9: Maze Explorer"
		]);
		for (const item of launches) {
			expect(item.priority).toBe("launch");
			expect(item.historicalFilename).toBeUndefined();
		}
	});

	it("does not mistake written reflections or one possible remix for a fixed output", () => {
		const requirements = pythonLevel1PreviewRequirements();
		for (const item of requirements) {
			expect(item.lessonTitle).not.toMatch(
				/recap|reflection|presentation/i
			);
			if (
				/open ended|master project|^launch remix:/i.test(
					item.lessonTitle
				)
			) {
				expect(item.materialKind).toBe("representative-remix");
			}
			if (item.historicalFilename) {
				expect(item.historicalFilename).toMatch(/^[^/]+\.(?:gif|mp4)$/);
			}
		}
	});

	it("keeps the copyable material-request inventory synchronized with its stable IDs", () => {
		const doc = readFileSync(
			path.resolve(
				process.cwd(),
				"../docs/python-level-1-preview-materials.md"
			),
			"utf8"
		);
		const inventoryRows = doc
			.split("\n")
			.filter(line => line.trim().startsWith("|"))
			.map(line =>
				line
					.split("|")
					.slice(1, -1)
					.map(cell => cell.trim())
			);
		const requirements = pythonLevel1PreviewRequirements();
		expect(doc).toContain(
			`following ${requirements.length} project/remix lessons`
		);
		for (const item of requirements) {
			const filename = item.historicalFilename
				? `\`${item.historicalFilename}\``
				: "New recording needed";
			expect(inventoryRows).toContainEqual([
				item.lessonTitle,
				`\`${item.lessonId}\``,
				filename
			]);
		}
	});

	it("refuses to silently publish a request that has lost its stable lesson ID", () => {
		expect(() =>
			pythonLevel1PreviewRequirements({
				name: "Broken fixture",
				modules: [
					{
						title: "Module",
						id: "module",
						curriculum: [
							{
								title: "Project: Missing ID",
								content: "Draw a shape."
							}
						],
						supplementalProjects: []
					}
				]
			})
		).toThrow("Preview material request needs a stable ID");
	});

	it("removes a deferred request once the matching approved media is mapped", () => {
		const requirements = pythonLevel1PreviewRequirements({
			name: "Media fixture",
			modules: [
				{
					id: "module",
					title: "Module",
					curriculum: [
						{
							id: "provided",
							title: "Project: Provided",
							content: "Draw a square.",
							mediaLink:
								"https://static.cs.avasan.org/approved-square.mp4"
						},
						{
							id: "pending",
							title: "Project: Pending",
							content: "Draw a triangle.",
							mediaLink: " "
						}
					],
					supplementalProjects: []
				}
			]
		});
		expect(requirements.map(item => item.lessonId)).toEqual(["pending"]);
	});
});
