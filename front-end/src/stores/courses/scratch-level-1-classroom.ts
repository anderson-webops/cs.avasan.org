import type { RawCourse } from "./types";
import projects from "../../../scripts/scratch/projects.json";

const units = [...new Set(projects.map(project => project.unit))];
const introductions: Record<string, string> = {
	"Events and movement":
		"The first example contains just four blocks. An event is the trigger; the block beneath it is the action. Predict, press a key, then change one value. Keep the original working script beside your addition.",
	"Position and reset":
		"Drag a sprite to the place you want it, read x and y, and only then choose a motion block. Use the green flag to restore the starting scene and a click event to act. Compare an immediate go to with a timed glide. A layer block changes overlap, not position.",
	"Dialogue and scenes":
		"The stage owns backdrops; sprites own their own scripts. First use an event to change scenes. Then use a named broadcast to hand the next turn to another sprite. Run two scripts together and notice why a wait or message matters.",
	"Loops and animation":
		"First build a short sequence that works once. Put that sequence inside repeat when you know the count, or forever until you press Stop. Predict the final direction and use a wait to make the intermediate actions visible.",
	"Conditions and decisions":
		"An if block asks a true-or-false question. Keep movement events working while a separate loop checks the wall. Compare touching a wall with touching the goal. Only add and/or after each individual condition works.",
	"Variables and games":
		"A variable remembers a value between events. Choose a meaningful name, reset it on the flag, and change it at exactly the event that earns a point. Combine earlier skills into a game whose rules you can explain to a partner."
};

export const scratchLevel1ClassroomCourse: RawCourse = {
	name: "Scratch Level 1: Classroom Edition",
	modules: units.map((unit, index) => ({
		id: `scratch-classroom-${index + 1}`,
		title: `${index + 1}. ${unit}`,
		estimatedTime:
			"One or two class meetings; advance after the checks work",
		keyBlocks: ["Run and predict", "Normal", "Hard", "Explain and test"],
		curriculum: [
			{
				id: `scratch-classroom-${index + 1}-intro`,
				title: `${unit}: Start Here`,
				content: `**Concept focus:** ${introductions[unit]}\n\n**Class routine:** Run the supplied example together, predict one change, complete **Normal**, and demonstrate the check. **Hard** extends the same project after a working checkpoint. You can also contribute original costumes or backgrounds: show the difference between bitmap and vector art, and use actual transparency rather than a checkerboard drawn into the image.\n\nDownload a starter below or open it in the website IDE. At the end of class, download your own .sb3 file with a recognizable name. Reopen it to verify the saved copy. Use your school's approved Scratch-compatible tool when required.`
			},
			...projects
				.filter(project => project.unit === unit)
				.map(project => ({
					id: project.id,
					title: project.name,
					learningPath: "core" as const,
					projectLink: `/ide?mode=scratch&starter=${project.id}`,
					content: `**Concept:** ${project.concept}\n\n[Download the starter (.sb3)](/scratch-projects/${project.id}.sb3). Open it with **Open .sb3**, or import it into a Scratch-compatible classroom editor.\n\n**Normal:** ${project.normal}\n\n**Hard:** ${project.hard}\n\n**Check:** ${project.check}\n\n**Explain:** Point to the blocks you changed. Predict what would happen if one value or event changed, then test your prediction. Keep the supplied working scripts as examples rather than replacing the whole project.`
				}))
		],
		supplementalProjects: [
			{
				id: `scratch-classroom-${index + 1}-practice`,
				title: `${unit}: Remix Practice`,
				content:
					"Reopen your saved project and make a second version with your own art, names, or scene. Keep the original Normal behavior working. Ask a partner to test the check without coaching, then fix one confusing behavior and explain the repair."
			}
		]
	}))
};
