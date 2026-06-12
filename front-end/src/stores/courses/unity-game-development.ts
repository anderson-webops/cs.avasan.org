import type { RawCourse } from "./types";

function repo(folder: string) {
	return `https://github.com/instruction-material/Unity-Game-Development/tree/main/${folder}`;
}

export const unityGameDevelopmentCourse: RawCourse = {
	name: "Unity Game Development",
	modules: [
		{
			title: "GD6 Collision, Collection, and Platformer Mechanics",
			curriculum: [
				{
					title: "GD6.1 Collision Commotion",
					content:
						"Use a small C# script snapshot to reason about collisions, movement, and trigger-style game events before working in a full Unity scene.",
					projectLink: repo("UGD-06-01-collision-commotion")
				},
				{
					title: "GD6.2 Collecting Coins",
					content:
						"Track collectible state and connect collision events to score changes. Identify the object responsible for detecting a pickup and the object responsible for storing the score.",
					projectLink: repo("UGD-06-02-collecting-coins")
				},
				{
					title: "GD6.3 Collecting Colliding Chaos",
					content:
						"Combine movement, collisions, and collectible logic in one constrained practice project. Test at least two collision cases and explain which script owns each behavior.",
					projectLink: repo("UGD-06-03-collecting-colliding-chaos")
				}
			],
			supplementalProjects: [
				{
					title: "Module 3 Supplemental 1",
					content:
						"Use the paired starter and review snapshots as extra collision and object-state practice before moving into UI text work.",
					projectLink: repo("UGD-03-supplemental-1-starter"),
					solutionLink: repo("UGD-03-supplemental-1-solution")
				},
				{
					title: "Module 3 Supplemental 2",
					content:
						"Extend the module mechanics with one additional game-rule constraint, then compare against the solution snapshot.",
					projectLink: repo("UGD-03-supplemental-2-starter"),
					solutionLink: repo("UGD-03-supplemental-2-solution")
				}
			]
		},
		{
			title: "GD7 UI Text and Start Flow",
			curriculum: [
				{
					title: "GD7.1 Displaying Text",
					content:
						"Introduce a simple game manager and player script split for displaying game state through on-screen text.",
					projectLink: repo("UGD-07-01-displaying-text")
				},
				{
					title: "GD7.2 Changing Text",
					content:
						"Update text in response to gameplay events. Describe what causes the text to change and where that state is stored.",
					projectLink: repo("UGD-07-02-changing-text")
				},
				{
					title: "GD7.3 Start Button",
					content:
						"Add a start-button flow and separate pre-game state from active gameplay. The goal is clean UI-driven state transitions.",
					projectLink: repo("UGD-07-03-start-button")
				},
				{
					title: "GD7.4 User-Friendly Platformer",
					content:
						"Combine UI feedback and player control into a more polished platformer snapshot with clearer player-facing state.",
					projectLink: repo("UGD-07-04-user-friendly-platformer")
				}
			],
			supplementalProjects: [
				{
					title: "Module 3 Supplemental 2 Alternate",
					content:
						"Use the alternate supplemental snapshot for additional UI and event-flow practice.",
					projectLink: repo(
						"UGD-03-supplemental-2-alternate-starter"
					),
					solutionLink: repo(
						"UGD-03-supplemental-2-alternate-solution"
					)
				}
			]
		},
		{
			title: "GD8 Boundaries, Win States, and Hazards",
			curriculum: [
				{
					title: "GD8.1 Out of Bounds",
					content:
						"Detect when a player leaves the playable space and decide how the game should respond.",
					projectLink: repo("UGD-08-01-out-of-bounds")
				},
				{
					title: "GD8.2 Winning and Restarting",
					content:
						"Connect a win condition to a restart flow so students can reason about level state and reset behavior.",
					projectLink: repo("UGD-08-02-winning-and-restarting")
				},
				{
					title: "GD8.3 Killer Objects",
					content:
						"Introduce hazard objects and failure states while keeping the player script responsibilities clear.",
					projectLink: repo("UGD-08-03-killer-objects")
				}
			],
			supplementalProjects: []
		},
		{
			title: "Module 4 Projects",
			curriculum: [
				{
					title: "Module 4 Project 1",
					content:
						"Build a small game-mechanics project that combines movement, state updates, and player feedback.",
					projectLink: repo("UGD-04-project-1")
				},
				{
					title: "Module 4 Project 2",
					content:
						"Extend the module project with a second mechanic or rule and document the behavior change.",
					projectLink: repo("UGD-04-project-2")
				}
			],
			supplementalProjects: []
		},
		{
			title: "Module 5 Projects",
			curriculum: [
				{
					title: "Module 5 Project 1",
					content:
						"Use the first capstone snapshot to organize a more complete game loop and test the major state transitions.",
					projectLink: repo("UGD-05-project-1")
				},
				{
					title: "Module 5 Project 2",
					content:
						"Use the final project snapshot to refine gameplay behavior, UI feedback, and restart or completion flow.",
					projectLink: repo("UGD-05-project-2")
				}
			],
			supplementalProjects: []
		}
	]
};
