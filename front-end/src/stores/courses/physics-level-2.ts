import type { RawCourse } from "./types";

export const physicsLevel2Course: RawCourse = {
	name: "Physics Level 2",
	modules: [
		{
			title: "PHY6 Advanced Kinematics",
			curriculum: [
				{
					title: "Introductions and Course Expectations",
					content:
						"This course builds on Intro to Physics and assumes comfort with algebra, basic graph reading, and fundamental trigonometry. Use vectors, components, and multi-step reasoning to describe motion more precisely than in the introductory course."
				},
				{
					title: "Position, Velocity, and Acceleration as Functions",
					content:
						"Study motion with equations, graphs, and verbal descriptions. Compare average versus instantaneous velocity, interpret slopes and areas on motion graphs, and connect changing acceleration to curved position and velocity graphs."
				},
				{
					title: "Project: Motion Graph Detective",
					content:
						"Given several position-time and velocity-time graphs, reconstruct the object's story, estimate turning points, and identify when the object is speeding up, slowing down, or reversing direction."
				},
				{
					title: "Vectors and Two-Dimensional Motion",
					content:
						"Break motion into horizontal and vertical components, add vectors tip-to-tail, and use sine and cosine to move between magnitudes, angles, and components."
				},
				{
					title: "Project: Rescue Drone Navigation",
					content:
						"Plan the path of a drone moving through wind by combining horizontal and vertical velocity components. Use trigonometry to compare intended motion with actual displacement."
				},
				{
					title: "Project: Launch Analysis",
					content:
						"Analyze projectile-style motion by separating the horizontal and vertical directions, predicting time in the air, peak height, and landing distance, then comparing predictions with collected data or simulation results."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY7 Advanced Forces",
			curriculum: [
				{
					title: "Forces as Vectors",
					content:
						"Treat forces as vector quantities that can reinforce, oppose, or redirect one another. Compare net force with individual forces and connect the result to the object's acceleration."
				},
				{
					title: "Newton's Laws in Multi-Force Systems",
					content:
						"Move beyond single-force examples by analyzing tension, applied force, normal force, gravity, and drag in the same problem. Use Newton's laws to explain why balanced forces produce no acceleration while unbalanced forces do."
				},
				{
					title: "Free-Body Diagrams",
					content:
						"Create clear force diagrams that isolate one object at a time, label every external force, choose axes strategically, and avoid mixing real forces with motion arrows."
				},
				{
					title: "Project: Tug-of-War Lab",
					content:
						"Model a tug-of-war match by comparing individual pulls, the rope's tension, and the motion of the center marker. Use free-body diagrams to justify when the system stays still and when it accelerates."
				},
				{
					title: "Project: Elevator Forces Revisited",
					content:
						"Return to the elevator scenario from Intro to Physics and analyze it quantitatively. Relate the scale reading to the normal force and explain why apparent weight changes during upward and downward acceleration."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY8 Friction and Inclined Planes",
			curriculum: [
				{
					title: "Static and Kinetic Friction",
					content:
						"Compare static friction, which adjusts up to a maximum value to prevent slipping, with kinetic friction, which acts while surfaces slide past one another. Discuss how both depend on the nature of the surfaces and the normal force."
				},
				{
					title: "Inclined Plane Geometry",
					content:
						"Use trigonometry to resolve the force of gravity into components parallel and perpendicular to a ramp. Connect the ramp angle to how strongly gravity pulls an object down the slope and into the surface."
				},
				{
					title: "Force Diagrams on a Ramp",
					content:
						"Draw a complete free-body diagram for an object on an incline, including gravity, normal force, friction, and any applied force. Choose axes along and perpendicular to the ramp so the equations match the geometry."
				},
				{
					title: "Project: Will the Block Slip?",
					content:
						"Given a block resting on a ramp, calculate the component of gravity down the slope, compare it with the maximum static friction, and predict whether the block remains at rest or begins to move."
				},
				{
					title: "Project: Sliding Crate Investigation",
					content:
						"Model a crate sliding down a rough ramp. Use the force diagram and component equations to calculate the normal force, friction force, net force, and acceleration."
				},
				{
					title: "Project: Ramp Design Challenge",
					content:
						"Design a ramp that either keeps an object stationary or lets it slide at a chosen acceleration. Justify the design with a labeled diagram, trig-based force components, and Newton's second law."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY9 Gravity and Circular Motion",
			curriculum: [
				{
					title: "Gravity as a Universal Force",
					content:
						"Go deeper into gravity by comparing near-Earth motion with planetary and orbital motion. Treat gravity as an interaction between masses rather than only as a downward pull near the ground."
				},
				{
					title: "Project: Planetary Gravity Comparison",
					content:
						"Estimate how gravitational pull changes with mass and distance, then compare the effect on a person, satellite, or probe in different environments."
				},
				{
					title: "Centripetal Motion and Inward Net Force",
					content:
						"Revisit circular motion with a stronger emphasis on force. Identify the inward net force required for turning motion and compare circular motion at constant speed with straight-line motion at the same speed."
				},
				{
					title: "Project: Loop-the-Loop Analysis",
					content:
						"Study a car or rider moving through a vertical loop. Use force diagrams at the top, side, and bottom of the loop to reason about speed, normal force, and the conditions needed to stay on the track."
				},
				{
					title: "Project: Orbit Planner",
					content:
						"Model a satellite in circular orbit and explain how gravitational force supplies the inward acceleration. Compare low and high orbits and interpret what changes when orbital radius changes."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY10 Work, Energy, and Power",
			curriculum: [
				{
					title: "Work and Energy Transfer",
					content:
						"Introduce work as the transfer of energy by a force acting through a distance. Distinguish between situations where a force is present and situations where that force actually transfers energy."
				},
				{
					title: "Energy Conservation with and without Friction",
					content:
						"Extend the intro energy unit by quantifying changes in kinetic, gravitational potential, elastic, and thermal energy. Compare ideal systems with real systems that lose mechanical energy to friction."
				},
				{
					title: "Project: Ramp Energy Audit",
					content:
						"Track an object moving down a ramp and account for every major energy change. Compare an ideal no-friction prediction with a rough-ramp prediction that includes thermal energy."
				},
				{
					title: "Power and Rate of Energy Use",
					content:
						"Study power as the rate of doing work or transferring energy. Compare tasks that require the same work but different amounts of time, and connect power to machine and athlete performance."
				},
				{
					title: "Project: Pendulum and Spring Systems",
					content:
						"Analyze systems that trade energy back and forth between forms over time, and explain where the energy goes when the motion gradually dies out."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PHY11 Master Project",
			curriculum: [
				{
					title: "Master Project: Physics Modeling Challenge",
					content:
						"Design a multi-step physics investigation or model that combines at least two major topics from the course, such as motion and forces, gravity and circular motion, or ramps and energy."
				},
				{
					title: "Data, Assumptions, and Error Analysis",
					content:
						"State assumptions clearly, estimate uncertainty, compare predictions with results, and explain where simplified models differ from real-world behavior."
				},
				{
					title: "Communication and Defense of Results",
					content:
						"Present the final model or experiment with diagrams, calculations, and written or spoken reasoning. Emphasize not just the answer, but why the model works and what its limits are."
				},
				{
					title: "Course Recap",
					content:
						"Review the deeper physics ideas from the course, including vector motion, multi-force systems, friction on ramps, circular motion, gravity, work, energy, power, and modeling with trigonometry."
				}
			],
			supplementalProjects: []
		}
	]
};
