import type { RawCourse } from "./types";

export const introToPhysicsCourse: RawCourse = {
	name: "Intro to Physics",
	modules: [
		{
			title: "PHY1 Kinematics",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"Get familiar with the learner portal, the whiteboard-based workflow, and the big ideas of the course. This module introduces kinematics: the study of motion and how it changes over time."
				},
				{
					title: "Project: Track Star vs. Marathon Runner",
					content:
						"Compare two runners using different ways of describing motion, including speed, time, distance, displacement, velocity, and acceleration. Build a chart, decide which measurements matter most in each case, and defend a conclusion with evidence."
				},
				{
					title: "Project: Bouncy Ball Toss",
					content:
						"Explore how position, velocity, and acceleration relate to one another by making predictions about a tossed ball, then testing those ideas with a real-world throw. Track which quantities stay constant, which change steadily, and which reverse direction."
				},
				{
					title: "Project: Air Traffic Control",
					content:
						"Use a plane-and-wind scenario to compare speed with velocity and to reason about how multiple motions combine. Introduce the idea that the plane's new motion depends on both its original velocity and the wind's effect."
				},
				{
					title: "Project: Merry-Go-Round Mania",
					content:
						"Investigate circular motion by drawing velocity and acceleration vectors for a rider on a merry-go-round. Compare constant speed with changing velocity, and identify centripetal acceleration as inward acceleration toward the center of the circle."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY2 Forces",
			curriculum: [
				{
					title: "Project: Runaway Train",
					content:
						"Brainstorm different ways to stop a runaway train, then compare the ideas by focusing on force, acceleration, and inertia. Use the scenario to introduce Newton's first and second laws of motion."
				},
				{
					title: "Project: Test of Strength",
					content:
						"Hold an object in the air, describe why it does not move, and identify the forces acting on it. Create a force diagram and connect the result to balanced forces and Newton's third law."
				},
				{
					title: "Project: Newton's Laws Madlibs",
					content:
						"Review Newton's three laws by completing and then remixing their wording. Pick one law, change part of it, and imagine how the world would behave differently if that new rule were true."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY3 Gravity",
			curriculum: [
				{
					title: "Project: Your Weight on Another Planet",
					content:
						"Compare how weight changes across planets and other bodies in the solar system, then form a hypothesis about how gravity depends on the mass of the object being stood on and the surrounding environment."
				},
				{
					title: "Project: Galileo's Ball Drop",
					content:
						"Predict what happens when two objects of different weights are dropped together, then test the prediction experimentally. Use the results to connect gravity, acceleration, and the difference between mass and weight."
				},
				{
					title: "Project: Elevator Experiment",
					content:
						"Design an experiment using an elevator, a scale, and a mass measurement tool to figure out why people can feel heavier or lighter while moving. Use the scenario to introduce apparent weight and normal force."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY4 Energy",
			curriculum: [
				{
					title: "Project: Find the Energy",
					content:
						"Study everyday examples such as bowling, braking, skiing, and basketball to trace where energy goes as it changes form. Compare gravitational potential, kinetic or mechanical, thermal, and other forms of energy."
				},
				{
					title: "Project: Half-Pipe Skaters",
					content:
						"Use a half-pipe simulation inspired by Galileo's ramp experiments to estimate and test how potential, kinetic, and thermal energy change as a skater moves. Compare ramps with and without friction and predict how the skater will travel."
				},
				{
					title: "Project: Pendulum Design",
					content:
						"Analyze a pendulum as a system that exchanges energy between different forms while swinging. Then design a pendulum that could swing indefinitely by identifying and counteracting the sources of energy loss."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY5 Master Project",
			curriculum: [
				{
					title: "Master Project: A Grand Experiment",
					content:
						"Design and carry out an original physics experiment based on one of the course themes. Start with a focused question, build a testable hypothesis, create a repeatable experiment, collect observations, and explain whether the results support the original idea."
				},
				{
					title: "Scientific Method and Communication",
					content:
						"Use the full experiment cycle: question, hypothesis, test, repetition, interpretation, and communication. Share the final experiment in a short report or video that explains the setup, outcome, and reasoning."
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including motion, force, gravity, energy, experiments, and the scientific method."
				}
			],
			supplementalProjects: []
		}
	]
};
