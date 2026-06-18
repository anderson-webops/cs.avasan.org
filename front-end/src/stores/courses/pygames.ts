import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const pyGamesCourse: RawCourse = {
	name: "PyGames",
	modules: [
		{
			title: "PyG0 Setup, Editors, and Asset Workflow",
			curriculum: [
				{
					title: "Mu, VS Code, and PyCharm",
					content:
						"Compare the three main editor paths directly. `Mu` works best when setup friction matters most, `VS Code` is the standard path for debugging and file management, and `PyCharm` is the advanced Python-specific option once a fuller IDE is useful."
				},
				{
					title: "Asset Folder Layout",
					content:
						"Standardize the project layout early with `images`, `sounds`, `music`, and per-project files. Asset management is part of game engineering, not a side issue to debug only after the game logic is written."
				},
				{
					title: "Early Debugging Habits",
					content:
						"Rerun quickly, read tracebacks, and check asset paths, image names, and event handlers early. Most PyGame frustration comes from input, timing, or asset-loading mistakes that become easy to diagnose once the habit is built."
				},
				{
					title: "From One File to Organized Games",
					content:
						"Frame the course as a progression from tiny one-file experiments into larger games with cleaner helper functions, clear state variables, and reusable subsystems. Key idea: From the beginning that code organization matters as projects grow."
				},
				{
					title: "PyG0 Setup, Editors, and Asset Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG0 Setup, Editors, and Asset Workflow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/music"
				}
			],
			supplementalProjects: [
				{
					title: "PyG0 Setup, Editors, and Asset Workflow: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "PyG0 Setup, Editors, and Asset Workflow",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/music"
				},
				{
					title: "Setup, Editors, and Asset Workflow Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG0 Setup, Editors, and Asset Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-01-pyg0-setup-editors-and-asset-workflow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-01-pyg0-setup-editors-and-asset-workflow-supplemental-2/solution"
				},
				{
					title: "Setup, Editors, and Asset Workflow Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG0 Setup, Editors, and Asset Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-02-pyg0-setup-editors-and-asset-workflow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-02-pyg0-setup-editors-and-asset-workflow-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG1 Object-Oriented Programming: Actors",
			curriculum: [
				{
					title: "PyGame Setup with Mu",
					content:
						'Install the Mu editor from https://codewith.mu and switch it to PyGame mode using the "Mode" button. Confirm the mu_code folder exists and help find and move it to an easy-to-access location. Download the assets zip from https://static.classes.jacobdanderson.net/assets.zip, unzip it, and move the images, sounds, and music folders into mu_code. Create a new file alien.py in mu_code. If Mu cannot be installed, use PyCharm with pip install pgzero, import pgzrun, and pgzrun.go(), and keep images in an images folder and sounds in a sounds folder.'
				},
				{
					title: "Actors",
					content:
						'Define WIDTH = 400 and HEIGHT = 300 (all caps) at the top of the file to set the window size. An object groups data and functions, similar to a turtle object with position, color, and movement functions. The Actor object represents players, enemies, and collectibles; it has x, y, and an image, plus methods like draw() and collision helpers. Create an alien actor with alien = Actor("alien"). Define def draw(): and inside call screen.clear() then alien.draw(). Add an update() function that moves the alien, e.g. alien.x += 5. Experiment with changing x and y, positive vs negative values, and different speeds.'
				},
				{
					title: "Position Keywords",
					content: `**Coordinate model:** Pygame Zero uses a screen grid where \`(0, 0)\` is the top-left corner. The x-coordinate increases to the right, and the y-coordinate increases downward.

**Position keywords:** Actors and rectangles can be positioned with named anchor points such as \`topleft\`, \`topright\`, \`bottomleft\`, \`bottomright\`, \`midtop\`, \`midleft\`, \`midright\`, \`midbottom\`, and \`center\`. For example, \`alien.bottomleft = (0, HEIGHT)\` places the alien's lower-left corner at the lower-left edge of the window.

**Practice checks:**
- Move the same alien with at least three different position keywords and describe which anchor point is being controlled.
- Compare changing \`alien.x\` directly with changing \`alien.center\` or \`alien.bottomleft\`.
- Improve wrapping logic so the alien fully leaves the screen before reappearing: \`if alien.left > WIDTH: alien.right = 0\` in \`update()\`.`
				},
				{
					title: "Global Variables & Bouncing",
					content:
						"Global variables are defined outside a function. Create a global speed variable, e.g. xspeed = 5, and use it in update() with alien.x += xspeed. When modifying a global inside a function, declare it with global xspeed at the top of update(). Instead of wrapping, make the alien bounce off a wall by flipping the sign of xspeed when the alien hits an edge, e.g. when alien.right >= WIDTH, set xspeed = -xspeed."
				},
				{
					title: "PyG1 Project 1: Rainbow Fill",
					content:
						"Create a project where rows of color scroll across the screen. Use random.randint() if needed and a list of colors. In draw(), clear the screen and fill it with rectangles or strips of varying colors from a list. Each frame, update the list or indices so the colors appear to move or cycle.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_rainbow_fill.mp4"
				},
				{
					title: "PyG1 Project 2: Bouncing Alien",
					content:
						"Reuse the alien actor and give it dynamic attributes alien.xspeed and alien.yspeed. In update(), move the alien with alien.x += alien.xspeed and alien.y += alien.yspeed. When the alien hits the left/right or top/bottom edges, reverse the appropriate speed to make it bounce. Optional: start the alien in a random position and slightly increase its speed each time it hits a wall.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_bouncing_alien.mp4"
				},
				{
					title: "PyG1 Project 3: Wandering Ball",
					content:
						"Create a ball actor at the center of the screen. Define global xspeed and yspeed, and a helper resetBall() that moves the ball back to the center and assigns random non-zero speeds. In update(), move the ball using xspeed and yspeed, and when it goes offscreen call resetBall() to restart with new speeds. Challenge: ensure neither speed is ever zero so the ball always moves.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_wandering_ball.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Object Oriented Programming: Actors: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Object Oriented Programming: Actors",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Object Oriented Programming: Actors Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG1 Object-Oriented Programming: Actors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-03-pyg1-object-oriented-programming-actors-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-03-pyg1-object-oriented-programming-actors-supplemental-2/solution"
				},
				{
					title: "Object Oriented Programming: Actors Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG1 Object-Oriented Programming: Actors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-04-pyg1-object-oriented-programming-actors-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-04-pyg1-object-oriented-programming-actors-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG2 Event Handling",
			curriculum: [
				{
					title: "Keyboard Events",
					content:
						'Event listeners are code that runs when specific events happen. on_key_down(key) is called when a key is pressed. First, move the alien on any key press, then restrict it with if key == keys.RIGHT: so it only moves right with the right arrow. For continuous movement, check in update() with if keyboard.right: to keep moving while the key is held. Use alien.angle = 180 when "w" is pressed, alien.angle = 0 (or similar) on "s" to reset, and alien.angle += 5 / alien.angle -= 5 on "a" and "d" to rotate left and right. Use on_key_up(key) when responding to key releases, e.g. move the alien up 10 pixels when the space key is released.'
				},
				{
					title: "Mouse Events",
					content:
						'Use on_mouse_down(pos, button) to react when the mouse is pressed. Make the alien look hurt when clicked with alien.image = "alien_hurt". Use alien.collidepoint(pos) so the change only happens when the alien itself is clicked, and button == mouse.LEFT to limit behavior to left-clicks. Play a sound with sounds.eep.play(). Use on_mouse_up() to reset the alien image back to normal so it only looks hurt while the button is down. Implement on_mouse_move(pos) so the alien follows the mouse by setting alien.x and alien.y (or alien.pos) equal to the mouse coordinates.'
				},
				{
					title: "PyG2 Project 1: Arrow Point",
					content:
						"Create an arrow actor that always points toward the mouse. Use keyboard events to move the arrow if desired, and update arrow.angle so it faces the mouse position. Compute the angle based on the relative position of the mouse to the arrow and set or adjust arrow.angle accordingly.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_arrow_point.mp4"
				},
				{
					title: "PyG2 Project 2: Apple Collector",
					content:
						"Create an apple actor positioned randomly on the screen. Implement on_mouse_down(pos, button) to check if the click is on the apple; if so, move the apple to a new random position and optionally increase a score counter and play a sound. Draw the score text in the corner of the screen so the player can track how many apples they have collected.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_apple_collector.mp4"
				},
				{
					title: "PyG2 Project 3: Art Box",
					content:
						'Create a box actor that can be dragged and recolored. Use a global boolean like box_grab which is True when the mouse is held down over the box and False otherwise. In on_mouse_move(pos), move the box with the mouse only if box_grab is true. Store image names for different colors in a list and track the current index. Change the box\'s image when "a" or "d" is pressed by decrementing or incrementing the index, wrapping it around so it stays within the list\'s bounds.',
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_art_box.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Event Handling: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Event Handling",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Event Handling Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG2 Event Handling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-05-pyg2-event-handling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-05-pyg2-event-handling-supplemental-2/solution"
				},
				{
					title: "Event Handling Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG2 Event Handling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-06-pyg2-event-handling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-06-pyg2-event-handling-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG3 Object-Oriented Programming: Advanced Actors",
			curriculum: [
				{
					title: "ZRect Class",
					content: `**Concept focus:** A \`ZRect\` represents a rectangle with position, width, and height. Rectangles are useful for drawing simple shapes, building invisible hitboxes, and checking overlaps.

**Starter example:**
- Define \`WIDTH\` and \`HEIGHT\`.
- Create a rectangle with \`box = ZRect((100, 100), (50, 50))\`.
- In \`draw()\`, use \`screen.draw.rect(box, (255, 0, 0))\` to draw a red rectangle.

**Practice checks:**
- Change the rectangle's position, width, and height and predict the visual result before running.
- Experiment with RGB color values such as \`(255, 0, 0)\`, \`(0, 255, 0)\`, and \`(0, 0, 255)\`.
- Create one rectangle that covers the whole screen and another that covers only half.
- Use position keywords such as \`box.center\` and \`box.topleft\` to connect ZRects back to Actor positioning.`
				},
				{
					title: "PyG3 Project 1: ZRect Art",
					content:
						"Create an empty list to store ZRects. Use a for loop to create 10 rectangles with random positions and sizes and append each to the list. In draw(), loop through the list and draw every rectangle with random colors (random r, g, and b values between 0 and 255). This produces a randomized art piece each frame.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Colliderect and Contains",
					content:
						"Create a randomBox ZRect with size 50×50 at a random position and a middleBox ZRect centered on the screen with size 200×200. In draw(), use middleBox.colliderect(randomBox) to check if they overlap; draw randomBox blue when colliding, red otherwise, and always draw middleBox to visualize the area. Add on_mouse_down(pos, button) to move randomBox to the mouse position on click and test collision. Then replace colliderect with contains to see the difference between overlapping and being fully inside another rectangle. Mention that these functions also work for actors: if actor1.colliderect(actor2): ...."
				},
				{
					title: "PyG3 Project 2: Light Control",
					content:
						'Create a bulb actor centered on the screen and a battery actor near the top-left. In on_mouse_move(pos, buttons), move the battery to the mouse position only when the left mouse button is held. In update(), check if the bulb and battery collide; set the bulb image to an "on" version when colliding and an "off" version otherwise. In draw(), draw both actors so it looks like the battery powers the bulb when it touches.',
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Dynamic Attributes",
					content:
						"Using many global variables for per-actor data does not scale. Instead, create dynamic attributes on actors, such as ball.xspeed = 10 and ball.yspeed = 5, and in update() move with ball.x += ball.xspeed and ball.y += ball.yspeed. Use dynamic attributes for values tied to a single actor (speed, lives, color), and reserve globals for overall game state like score, timers, or isGameOver."
				},
				{
					title: "PyG3 Project 3: Beach Ball Chase",
					content: `**Project goal:** Build a small chase game that uses dynamic actor attributes, keyboard input, collision checks, and score display.

**Implementation steps:**
- Create an alien Actor controlled by the player.
- Create a beach ball Actor with a random starting position.
- Store the ball's movement as dynamic attributes such as \`ball.xspeed\` and \`ball.yspeed\`.
- In \`update()\`, move the alien with the arrow keys and move the ball using its speed attributes.
- Bounce the ball off the window edges by reversing the relevant speed.
- When the alien collides with the ball, increase \`score\` and move the ball to a new random position.
- In \`draw()\`, draw both actors and show the score with \`screen.draw.text(str(score), (10, 10))\`.

**Completion checks:** The score changes only on collision, the ball never becomes stuck on an edge, and the code is split into helper functions for keyboard input, ball movement, and collision handling.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_3_beach_ball_chase.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PYG3 Supplemental Project 1: Asteroid Dodge",
					content:
						"Build a game where a player-controlled actor dodges falling asteroid actors. Asteroids spawn at random x positions at the top and move downward; if the player collides with an asteroid, the game ends or the player loses a life. Track how long the player survives or how many asteroids they dodge.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Object Oriented Programming: Advanced Actors Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG3 Object-Oriented Programming: Advanced Actors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-07-pyg3-object-oriented-programming-advanced-actors/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-07-pyg3-object-oriented-programming-advanced-actors/solution"
				},
				{
					title: "Object Oriented Programming: Advanced Actors Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG3 Object-Oriented Programming: Advanced Actors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-08-pyg3-object-oriented-programming-advanced-actors/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-08-pyg3-object-oriented-programming-advanced-actors/solution"
				}
			]
		},
		{
			title: "PyG4 Managing Multiple Objects: Collectibles",
			curriculum: [
				{
					title: "Lists of Actors",
					content:
						"Lists let us manage many objects at once. Define WIDTH and HEIGHT, then create an empty list aliens = []. Use a loop to create 10 alien actors, give each xspeed = 5, and append them to the list. In draw(), use for alien in aliens: alien.draw(). In update(), move each alien with alien.x += alien.xspeed and reverse its direction when it hits a screen edge by flipping alien.xspeed. Notice the pattern of per-actor dynamic attributes plus list loops."
				},
				{
					title: "PyG4 Project 1: Bouncy Ball Room",
					content:
						"Create many ball actors with random starting x and y positions and random xspeed and yspeed attributes, storing them in a list. In draw(), loop through and draw each ball. In update(), move each ball and bounce it off the walls using ball.top, ball.bottom, ball.left, and ball.right, reversing the appropriate speed when a wall is hit. For ball–ball collisions, write checkBallCollision(b1, b2) to reverse both balls' speeds when they collide, and call it within a nested loop over all pairs of balls.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_bouncy_ball_room.mp4"
				},
				{
					title: "PyG4 Project 2: Falling Squares",
					content:
						"Build a column of colored squares that fall down the screen together. Create a resetSquares() function that moves all squares back to the top and scrambles their colors or order using a list of allowed x-positions. Call resetSquares() when the blue square is clicked or when the row reaches the bottom. Use a speed variable to control fall speed and increase it each time the blue square is clicked so the game becomes more challenging.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_falling_squares.mp4"
				},
				{
					title: "PyG4 Project 3: Jewel Catch",
					content:
						"Create a spaceship actor controlled with left/right arrow keys and prevent it from leaving the screen. Set the background to white with screen.fill((255, 255, 255)). Create a list of 5 gem actors and 4 bomb actors at random x positions, each with a random xspeed between 1 and 3. In update(), move gems and bombs downward while also sliding them left/right, reversing horizontal direction when they hit the sides. Write checkGemCollision(gem) to reset a gem to the top when it hits the bottom or is caught by the rocket, awarding 5 points on catch. Write checkBombCollision(bomb) to reset bombs from the bottom or when they hit the rocket, subtracting 10 points on a hit.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_jewel_catch.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Managing Multiple Objects: Collectibles: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Managing Multiple Objects: Collectibles",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Managing Multiple Objects: Collectibles Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG4 Managing Multiple Objects: Collectibles",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-09-pyg4-managing-multiple-objects-collectibles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-09-pyg4-managing-multiple-objects-collectibles-supplemental-2/solution"
				},
				{
					title: "Managing Multiple Objects: Collectibles Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG4 Managing Multiple Objects: Collectibles",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-10-pyg4-managing-multiple-objects-collectibles-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-10-pyg4-managing-multiple-objects-collectibles-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1: Actors, Events, ZRects, Collectibles",
			curriculum: [
				{
					title: "Check-In #1: Actors",
					content:
						'Actors-1: Set up the PyGame window with width 500 and height 400. Actors-2/3: Define what an actor is and create alien = Actor("alien"). Actors-4: Place the alien so it starts in the bottom-right corner of the screen. Actors-5/6: Draw the alien on the screen using draw() and alien.draw(). Actors-7: Define and explain global variables by creating xspeed and yspeed. Actors-8/9: Use yspeed to move the alien upwards and make it bounce off the top edge using speed reversal.'
				},
				{
					title: "Check-In #1: Event Listeners",
					content:
						"Event Listeners-1: Define an event listener and name at least two types already used (keyboard and mouse). Event Listeners-2/3: Make the alien change orientation or direction based on the arrow keys, and bounce it back on screen whenever it leaves the window. Event Listeners-4/5/6: When the left mouse button is clicked, move the alien to the clicked position using the mouse coordinates."
				},
				{
					title: "Check-In #1: ZRect and Dynamic Attributes",
					content:
						"ZRect-1: Define what a ZRect is and when it is useful. ZRect-2/3/4: Create a blue ZRect of width 50 and height 50 at a random position and draw it to the screen. ZRect-5: Describe what dynamic attributes are and how they help attach data like speed or color to a specific object. ZRect-6: Use dynamic attributes to move the blue ZRect up and down the screen. ZRect-7: When the alien collides with the ZRect, change its color to a random one. ZRect-8: Compare how program behavior changes if .colliderect() is replaced with .contains()."
				},
				{
					title: "Check-In #1: Collectibles",
					content:
						"Collectibles-1: Describe why multiple boxes on screen need a shared structure and how lists help manage them. Collectibles-2/3: Create 10 blue ZRects, store them in a list, move them in random directions, and make them bounce off the edges of the screen. Collectibles-4: When any box collides with the alien, change its color to a random one. Collectibles-5: When boxes collide with each other, make them bounce off each other by reversing their speeds."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a game where an alien collects coins. Coins increase the score by 1 when collected. Add three red blocks that move up and down the screen; if the alien touches a red block, the player loses 10 points and the alien resets to a random position. Structure the game using actors, lists, and collision checks.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Actors, Events, ZRects, Collectibles: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle:
							"Check In #1: Actors, Events, ZRects, Collectibles",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Check In #1: Actors, Events, ZRects, Collectibles Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #1: Actors, Events, ZRects, Collectibles",
						itemTitle:
							"Check In #1: Actors, Events, ZRects, Collectibles Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-11-check-in-1-actors-events-zrects-collectibles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-11-check-in-1-actors-events-zrects-collectibles-supplemental-2/solution"
				},
				{
					title: "Check In #1: Actors, Events, ZRects, Collectibles Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #1: Actors, Events, ZRects, Collectibles",
						itemTitle:
							"Check In #1: Actors, Events, ZRects, Collectibles Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-12-check-in-1-actors-events-zrects-collectibles-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-12-check-in-1-actors-events-zrects-collectibles-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG5 Physics",
			curriculum: [
				{
					title: "Gravity and Wind",
					content: `**Concept focus:** Forces change speed over time. In this lesson, gravity pulls an object downward by increasing vertical speed, while wind pushes sideways by changing horizontal speed.

**Practice sequence:**
- Start a new project and create a ball Actor using the "beach_ball" image.
- Add dynamic attributes \`ball.xspeed\` and \`ball.yspeed\`, starting with \`ball.yspeed = 3\`.
- Define \`draw()\` and \`update()\` so \`ball.x\` and \`ball.y\` are updated every frame.
- Add \`GRAVITY = 0.1\` and update vertical speed before changing position: \`ball.yspeed += GRAVITY\`.
- Predict the ball's vertical speed after 10 and 20 updates, then test different gravity values.
- Make the ball bounce off the floor by reversing \`yspeed\` when it passes the bottom and clamping it with \`ball.bottom = HEIGHT\`.
- Add \`WIND = 0.05\` and update horizontal speed with \`ball.xspeed += WIND\`.
- Compare positive, negative, and zero wind values, then notice how update order and rounding can make bounce heights drift over time.`
				},
				{
					title: "PyG5 Project 1: Keep Up",
					content:
						"Build a click-based juggling game where the player keeps a ball in the air. Create a ball Actor with dynamic xspeed and yspeed and global variables GRAVITY and score. In draw(), clear the screen, draw the score text, and draw the ball. In update(), apply GRAVITY to yspeed, update the ball's x and y with xspeed and yspeed, and make it bounce off the floor and optionally the top. Add wall-bounce logic on the left and right edges, for example: if ball.right > WIDTH: ball.right = WIDTH; ball.xspeed = -ball.xspeed, and similarly for ball.left < 0. Implement on_mouse_down(pos) so that if ball.collidepoint(pos) is True, the ball's yspeed is set to -3, xspeed is set to a random value between -15 and 15, and score is incremented. Tweak speeds and gravity so the game feels fair but challenging.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_keep_up.mp4"
				},
				{
					title: "Friction",
					content:
						"Friction is a force that slows moving objects when they are in contact with a surface. Create a ball Actor whose bottom touches the bottom of the screen with dynamic attributes xspeed and yspeed, setting xspeed = 10 and yspeed = 0. Define a global FRICTION = 0.95 and in update() multiply ball.xspeed and ball.yspeed by FRICTION each frame before updating position. Observe that fast motion slows quickly while slow motion tapers off gently when multiplying by a value slightly less than 1. Experiment with different starting speeds and friction values, including cases where FRICTION is closer to 1 (gentle slowing), much lower (rapid stop), and greater than 1 (the ball speeds up instead of slowing down), then decide which feels realistic for games."
				},
				{
					title: "PyG5 Project 2: Golf",
					content: `**Project goal:** Create a top-down golf game where the player clicks to hit a ball toward a hole and tries to finish in as few strokes as possible.

**Game objects and state:**
- Add Actors for the golf ball, hole, and flag.
- Give the ball dynamic movement attributes: \`ball.xspeed\` and \`ball.yspeed\`.
- Create global values for \`FRICTION\` and \`strokes\`.
- Place the hole near the center of the course and the flag above it.

**Implementation steps:**
- In \`draw()\`, set the background with \`screen.fill((50, 100, 50))\`, draw the stroke count, and draw the hole, flag, and ball.
- In \`update()\`, multiply the ball's speeds by friction, update its position, and bounce it off the walls.
- In \`on_mouse_down(pos)\`, allow a hit only when the ball is nearly stopped, such as \`abs(ball.xspeed) < 0.5\` and \`abs(ball.yspeed) < 0.5\`.
- Convert the click position into velocity, for example \`ball.xspeed = (mouseX - ball.x) / 10\` and \`ball.yspeed = (mouseY - ball.y) / 10\`.
- Increment \`strokes\` each time a valid hit is made.
- Detect when the ball reaches the hole and handle a win state, reset, or next level.

**Completion checks:** The ball cannot be hit repeatedly while still moving, friction gradually slows the ball, wall bounces keep it on screen, and the stroke count changes only after a valid shot.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_golf.mp4"
				},
				{
					title: "PyG5 Project 3: Ball Pit",
					content:
						"Simulate a ball pit with many bouncing balls. Create a list containing 10 ball Actors at random positions and give each ball random dynamic xspeed and yspeed. Define global GRAVITY and FRICTION. In draw(), loop through the list and draw each ball. In update(), for each ball add GRAVITY to its yspeed, multiply both xspeed and yspeed by FRICTION, update its position, and bounce it off the edges, reversing speed and clamping the ball back on screen when it goes out of bounds. Implement on_key_down(key) so that pressing the space bar randomizes the position and speed of all balls. Add on_mouse_down(pos) to loop through the balls and, when collidepoint(pos) is True for a ball, assign it a new random xspeed and yspeed to make it shoot off in a new direction.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_ball_pit.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Physics: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Physics",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Physics Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG5 Physics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-13-pyg5-physics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-13-pyg5-physics-supplemental-2/solution"
				},
				{
					title: "Physics Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG5 Physics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-14-pyg5-physics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-14-pyg5-physics-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG6 Managing Multiple Objects: Obstacles and Surfaces",
			curriculum: [
				{
					title: "Platforms with ZRect",
					content: `**Concept focus:** A \`ZRect\` can act as a solid platform that blocks or supports an Actor. Platform movement depends on gravity, horizontal input, collision correction, and a state flag for whether the player is on the ground.

**Build sequence:**
- Create a floor rectangle at the bottom of the screen: \`floor = ZRect((0, HEIGHT - 20), (WIDTH, 20))\`.
- In \`draw()\`, draw the floor with \`screen.draw.filled_rect(floor, (255, 255, 255))\`.
- Create an alien Actor with dynamic \`alien.xspeed\` and \`alien.yspeed\`.
- Add global \`GRAVITY\` and \`FRICTION\`.
- In \`update()\`, apply gravity to \`alien.yspeed\`, apply friction to \`alien.xspeed\`, and update \`alien.x\` and \`alien.y\`.
- Add collision correction: when \`alien.colliderect(floor)\`, set \`alien.bottom = floor.top\` and \`alien.yspeed = 0\`.
- Add left and right movement with keyboard input.
- Add jumping with the space key.

**Double-jump prevention:** Track \`alien.onground\`. Jump only when \`keyboard.space and alien.onground\` is true, set \`alien.onground = False\` when jumping, and set it back to true only inside the platform-collision logic.

**Completion checks:** The alien lands on the platform instead of falling through it, can move left and right, can jump from the platform, and cannot double jump in midair.`
				},
				{
					title: "Moving Platforms",
					content: `**Concept focus:** Moving platforms use the same rectangle and collision ideas as static platforms, but each platform also needs speed and boundary values.

**Horizontal platform sequence:**
- Shorten the floor platform to 200 pixels wide.
- Give it a dynamic speed such as \`floor.xspeed = 2\`.
- In \`update()\`, move it with \`floor.x += floor.xspeed\` and observe that it eventually leaves the screen.
- Add dynamic bounds such as \`floor.leftlimit = 0\` and \`floor.rightlimit = WIDTH\`.
- Bounce at the right edge with \`if floor.right > floor.rightlimit: floor.right = floor.rightlimit; floor.xspeed = -floor.xspeed\`.
- Add the matching left-edge condition for \`floor.left < floor.leftlimit\`.

**Extensions:** Change the limits so the platform stays only on the right side or in the center third of the screen. Add \`yspeed\`, \`toplimit\`, and \`bottomlimit\` to support vertical or diagonal movement.

**Completion checks:** The platform stays inside its assigned bounds, reverses direction cleanly at each limit, and can move independently of the alien.`
				},
				{
					title: "PyG6 Project 1: Stay on the Platform",
					content: `**Project goal:** Create a survival game where the player must stay on an increasingly difficult moving platform.

**Objects and state:**
- Make one platform with dynamic \`xspeed\`, \`yspeed\`, \`leftlimit\`, \`rightlimit\`, \`toplimit\`, and \`bottomlimit\`.
- Create an alien Actor with \`xspeed\`, \`yspeed\`, and \`onground\`.
- Create global values such as \`lose = False\` and \`score = 0\`.

**Update loop:**
- Apply gravity and friction to the alien.
- Process keyboard input for movement and jumping.
- Move the alien by its speeds.
- Move the platform and bounce it within its limits.
- Handle platform collision by setting \`alien.bottom\` to the platform's top, \`alien.yspeed = 0\`, and \`alien.onground = True\`.
- Wrap gameplay logic in \`if not lose:\` so movement stops when the game is over.
- Increase platform speed over time.
- Set \`lose = True\` if the alien falls off the bottom of the screen.

**Draw loop:** Draw the alien, platform, and score while the game is active. When \`lose\` is true, show the final score and a clear "Game Over" message.

**Completion checks:** The platform speed ramps up over time, the alien can land and jump correctly, the score reflects survival time, and the game-over state stops normal movement.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_stay_on_the_platform.mp4"
				},
				{
					title: "Multiple Platforms with Lists",
					content: `**Concept focus:** A list makes platform logic scalable. Instead of writing separate collision and draw code for each platform, every platform can follow the same shared pattern.

**Setup sequence:**
- Create an empty \`platforms\` list.
- Add a floor platform plus two smaller platforms, such as \`platform1\` and \`platform2\`, above it.
- In \`draw()\`, loop through \`platforms\` and draw each one.
- Reuse the existing alien, gravity, friction, and jumping code.

**Collision sequence:**
- At the start of \`update()\`, set \`alien.onground = False\`.
- Loop through each platform \`p\`.
- Use a downward-motion check such as \`if alien.colliderect(p) and alien.yspeed >= 0:\`.
- Snap the alien onto the platform with \`alien.bottom = p.top\`, set \`alien.yspeed = 0\`, and set \`alien.onground = True\`.
- The \`alien.yspeed >= 0\` condition prevents the alien from snapping to a platform while jumping upward through it.

**Moving-platform sequence:** After creating the platforms, loop through them to set default \`p.xspeed\`, \`p.yspeed\`, and boundary attributes. Then manually customize speeds or limits for any moving platforms. In \`update()\`, move each platform and bounce it inside its own limits.

**Completion checks:** All platforms are drawn from the list, the alien can land on any platform, upward jumps do not cause false snapping, and moving platforms reuse the same update logic as static ones.`
				},
				{
					title: "PyG6 Project 2: Platformer Game",
					content: `**Project goal:** Design and build a full platformer level with static platforms, at least one moving platform, a player start, and a collectible goal.

**Planning and layout:**
- Sketch a level layout, for example with https://aggie.io or a simple drawing tool.
- Include at least 8 platforms.
- Include at least 1 moving platform.
- Mark the alien's start position.
- Mark the diamond's goal position.
- Convert the drawing into a list of \`ZRect\` platforms.

**Implementation sequence:**
- Write \`draw()\` first and run the game to verify platform positions.
- Add dynamic motion attributes to selected platforms.
- Add \`update()\` logic so moving platforms stay within their limits.
- Add an alien Actor that can walk and jump on platforms.
- Reset the alien to the start when it falls off the screen.
- Add a diamond Actor using the \`"diamond_s"\` image at the goal location.

**Win state:** Create a global \`gameOver\` flag initially set to false and another variable to track whether the diamond has been collected. When the alien touches the diamond, set \`gameOver\` to true, hide the diamond, and display a "You Win" message instead of the regular game view.

**Completion checks:** The level matches the planned layout, moving platforms stay bounded, falling resets the alien, and collecting the diamond produces a clear win state.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_platformer_game.mp4"
				},
				{
					title: "PyG6 Project 3: Falling Jump",
					content: `**Project goal:** Create an endless survival game where platforms fall and the player must keep bouncing upward.

**Platform setup:**
- Start with an empty \`platforms\` list.
- Use a loop to create 10 \`ZRect\` platforms at random horizontal positions.
- Give each platform dynamic attributes such as \`yspeed\` and \`color\`.
- Store color as an RGB tuple, such as \`(r, g, b)\`.
- Append each platform to \`platforms\`.
- Define \`draw()\` to draw every platform from the list.

**Gameplay sequence:**
- Add an alien Actor that moves left and right.
- Apply gravity so the alien falls when unsupported.
- In \`update()\`, move each platform downward by \`yspeed\`.
- When a platform goes below the bottom edge, send it back to the top with a new random x-position.
- When the alien lands on a platform, set its vertical speed to a negative value so it bounces upward.

**Game-over behavior:** Create a global \`gameOver\` flag. When true, stop motion and show a "Game Over" message in \`draw()\`.

**Completion checks:** Platforms recycle cleanly, bounce behavior is consistent, unsupported falling can end the game, and bounce strength plus platform speed feel fair but challenging.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_falling_jump.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Managing Multiple Objects: Obstacles and Surfaces: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle:
							"Managing Multiple Objects: Obstacles and Surfaces",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Managing Multiple Objects: Obstacles and Surfaces Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG6 Managing Multiple Objects: Obstacles and Surfaces",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-15-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-15-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-2/solution"
				},
				{
					title: "Managing Multiple Objects: Obstacles and Surfaces Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"PyG6 Managing Multiple Objects: Obstacles and Surfaces",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-16-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-16-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2: Gravity, Friction, Platforms",
			curriculum: [
				{
					title: "Check-In #2: Gravity (Bigfoot Game)",
					content:
						"Gravity-setup: Start from the Bigfoot starter game (check_in_2_starter.py) and inspect the code so the movement logic is clear before adding gravity. Gravity-1: Identify the global variables and dynamic attributes needed to add gravity, such as a global gravity value and a yspeed attribute on Bigfoot; xspeed is optional. Gravity-2: Add these variables to the game. Gravity-3: In update(), apply gravity to Bigfoot by increasing yspeed and updating his y position. Gravity-4: Add code to stop Bigfoot at the floor instead of letting him fall through. Gravity-5: Add an event listener so pressing the up arrow makes Bigfoot jump."
				},
				{
					title: "Check-In #2: Friction (Shuffleboard Game)",
					content:
						"Friction-setup: Use the Shuffleboard starter game. The goal is to tweak friction so the puck stops at the center of the bullseye. Friction-1: Create global variable(s) to represent friction. Friction-2: Modify update() so friction gradually reduces the puck's speed by multiplying its velocity by a friction factor each frame. Friction-3: Tweak the friction value (roughly around 0.967) so the puck slows and stops in the bullseye's center, discussing how changing this value affects motion."
				},
				{
					title: "Check-In #2: Single Platforms",
					content:
						"Platforms-1: Decide how to represent a platform in code (e.g. a ZRect or actor) and how to add it to a game. Platforms-2: In the Bigfoot game, create a 200x20 platform in the middle of the screen and draw it. Platforms-3/4: Add collision logic so Bigfoot can jump onto and stand on the platform: check if his feet intersect the platform from above, snap his bottom to the platform top, and set his vertical speed to 0. Platforms-5: Make the platform move horizontally and bounce off walls by adding a dynamic xspeed attribute and reversing it at screen edges."
				},
				{
					title: "Check-In #2: Many Platforms",
					content:
						"Many-1: Store many platforms using a list. Many-setup: Make a copy of the Bigfoot game file for a version with multiple platforms. Many-2: Create a list of 10 platforms with random sizes, positions, and colors and store the color as a dynamic attribute. Many-3: Modify draw() to draw all platforms using their color attributes. Many-4: Update collision logic so Bigfoot can stand on any platform in the list, not just one."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						'Modify one of the Bigfoot games so pressing the "f" key flips gravity upside down. When gravity is reversed, Bigfoot should fall upward without leaving the screen; adjust collision so he can stand against the top or bottom surfaces appropriately. Optionally, flip Bigfoot\'s sprite with bigfoot.angle = 180 when gravity is reversed and make moving platforms behave correctly with inverted gravity.',
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Gravity, Friction, Platforms: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle:
							"Check In #2: Gravity, Friction, Platforms",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Check In #2: Gravity, Friction, Platforms Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #2: Gravity, Friction, Platforms",
						itemTitle:
							"Check In #2: Gravity, Friction, Platforms Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-17-check-in-2-gravity-friction-platforms-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-17-check-in-2-gravity-friction-platforms-supplemental-2/solution"
				},
				{
					title: "Check In #2: Gravity, Friction, Platforms Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #2: Gravity, Friction, Platforms",
						itemTitle:
							"Check In #2: Gravity, Friction, Platforms Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-18-check-in-2-gravity-friction-platforms-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-18-check-in-2-gravity-friction-platforms-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG7 Levels and System Control",
			curriculum: [
				{
					title: "Game Screens with gameState",
					content:
						'Multiple game screens such as start, play, pause, and end can be represented with a state variable. Create an alien Actor in the center of the screen and a global string gameState = "start". In on_key_down(), when the space key is pressed, change gameState to "play". In draw(), use if/else on gameState so that when gameState is "start" you show only text like "Press Space to Play!" and when it is "play" you draw the alien and hide the start text. This pattern extends to pause and game-over screens later, and using a small set of string states keeps the logic organized.'
				},
				{
					title: "Time Module and Pausing",
					content: `**Concept focus:** Python's \`time\` module provides utilities for working with real time. In a game loop, timing code affects not only one object, but the whole update cycle.

**Practice sequence:**
- Import \`time\` at the top of the file.
- Start with a simple alien-running game where the alien moves toward the right edge.
- When the alien reaches the right edge, call \`time.sleep(1)\` before resetting the alien to the left.
- Observe that the pause freezes the whole game, including input and animation.

**Design note:** \`time.sleep()\` is acceptable for a tiny transition or demonstration, but it is usually not the best choice for live gameplay because it blocks the event loop. Later projects should prefer clock scheduling when the game needs to keep updating while a delay is in progress.`
				},
				{
					title: "Clock Scheduling in Pygame Zero",
					content: `**Concept focus:** Pygame Zero's \`clock\` schedules functions without freezing the game. Scheduled callbacks are better than \`time.sleep()\` when animation and input should continue.

**One-time schedule:**
- Create an alien that changes to a "hurt" image when clicked.
- Define \`setAlienNormal()\` to restore the alien's normal image.
- In the click handler, call \`clock.schedule_unique(setAlienNormal, 1.0)\` so the hurt image lasts one second while the game keeps running.

**Repeated schedule:**
- Define \`moveRandom()\` to move the alien to a random screen position.
- When the player presses space, call \`clock.schedule_interval(moveRandom, 0.5)\` so the alien teleports every half second.
- When the player presses "s", call \`clock.unschedule(moveRandom)\` to stop the repeated movement.

**Key distinction:** \`schedule_unique\` runs once after a delay, \`schedule_interval\` runs repeatedly, and \`unschedule\` cancels scheduled callbacks.`
				},
				{
					title: "PyG7 Project 1: Alien Catch",
					content:
						"Build a game that uses multiple screens and timing to challenge the player's reactions. The finished Alien Catch game should make its screen flow and speed changes easy to explain. Implement a start screen where the user presses Enter to begin (keyboard.RETURN or keyboard.kp_enter depending on the key). In play mode, have an alien move horizontally across the screen while the player presses space to stop the alien. If the alien stops on top of a target square, the player gains a point and the alien's speed increases; otherwise, the player loses a life. Before each new run, use time.sleep or a clock-based delay to pause for one second so the player can prepare. Track lives with a global variable and, when lives reach zero, switch gameState to an end screen where the player can press Enter/Return to play again or Escape to quit using quit().",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_7_alien_catch.mp4"
				},
				{
					title: "PyG7 Project 2: Beach Ball Dodge",
					content: `**Project goal:** Create a survival game where a blue square dodges moving beach balls while scheduled functions track difficulty and survival time.

**Core screens and controls:**
- Add a start screen controlled by the space key.
- In play mode, move a blue square with the arrow keys.
- Move beach balls horizontally across the screen as hazards.
- When the player collides with a beach ball, switch to an end screen.

**Scheduled behavior:**
- Create \`increaseSize()\`, using \`inflate_ip(w, l)\` to grow the square.
- Schedule \`increaseSize()\` with \`clock.schedule_interval(increaseSize, 5)\` so the square gets larger every five seconds.
- Create \`increaseTimer()\`, increment a timer variable, and schedule it once per second.
- Start the scheduled functions only when gameplay begins.
- Cancel or stop scheduled callbacks once the game ends so old timers do not keep modifying the next run.

**Completion checks:** The end screen displays survival time, the square growth is visible, scheduled callbacks do not duplicate after restarting, and the player can restart with space or quit with Escape.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Level Design Concepts",
					content:
						"Levels keep games challenging by changing layout, difficulty, or goals over time. Pre-generated levels use fixed layouts, specific enemy or power-up locations, and designed maps; randomized levels spawn enemies or collectibles at random positions or times. Many games mix both approaches by using a pre-built map with some random enemy or item spawns. A global level variable can track the current level and drive logic such as difficulty, spawn rates, and layout changes. Connect this to gameState so it is clear which screen is active versus which level is being played."
				},
				{
					title: "PyG7 Project 3: Number Count",
					content: `**Project goal:** Implement a memory and timing game that uses levels, music, difficulty selection, and multiple screens.

**Screen flow and setup:**
- On the start screen, let the player select easy, medium, or hard difficulty.
- Initialize the player with 3 lives and 3 numbered blocks in level 1.
- Use \`music.play("tune.mp3")\` for background music.

**Level behavior:**
- For each level, display purple tiles that show numbers in order.
- After the player clicks the tile labeled "1", hide the numbers on the other tiles and start a timer.
- Track the next expected number with a variable.
- When the player clicks the correct tile, play a chime and keep that tile's number visible.
- Store and increment the current level, then scale the number of tiles as levels increase.

**Ending behavior:**
- When time runs out, reduce lives by one.
- When lives reach zero, show a game-over screen with options to play again or quit using space and Escape.
- When all 15 levels are completed, show a winning end screen with a short congratulatory message and restart options.

**Completion checks:** Difficulty affects the challenge, level state changes predictably, incorrect timing reduces lives, correct clicks preserve visible numbers, and both win and loss screens can restart cleanly.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_7_number_count.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Levels and System Control: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Levels and System Control",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Levels and System Control Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG7 Levels and System Control",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-19-pyg7-levels-and-system-control-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-19-pyg7-levels-and-system-control-supplemental-2/solution"
				},
				{
					title: "Levels and System Control Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG7 Levels and System Control",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-20-pyg7-levels-and-system-control-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-20-pyg7-levels-and-system-control-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG8 Game Elements: Projectiles",
			curriculum: [
				{
					title: "Single Projectile Mechanics",
					content: `**Concept focus:** Projectiles are common game elements such as bullets, arrows, or magic spells. The key pattern is that a projectile has an inactive state, a fired state, movement while active, and a reset condition before it can be fired again.

**Practice sequence:**
- Create a simple scene with an alien Actor on the left side of the screen.
- Define a ZRect p representing a projectile with a small width and height, such as 10x10.
- Add a global boolean fired = False to track whether the projectile is currently in flight.
- In on_key_down(key), when space is pressed and fired is False, set fired = True and position p at the alien's current location.
- In update(), if fired is False, keep p locked to the alien and do not draw it; if fired is True, move p to the right each frame.
- In draw(), only draw the projectile when fired is True.
- When p reaches the right edge of the screen, reset fired to False so the player can fire again.
- Connect this pattern to any weapon or spell that must return or reset before firing again.`
				},
				{
					title: "PyG8 Project 1: Target Shoot",
					content: `**Project goal:** Develop a ninja-target shooting game using one reusable projectile.

**Core setup:**
- Add a start screen where the player presses Enter to begin.
- Create a ninja Actor that can move left, move right, and jump on platforms using the arrow keys and space bar.
- Add one ninja-star projectile.
- Track the direction the ninja is facing with a property or state variable.

**Projectile behavior:**
- Fire the ninja star in the direction the ninja is facing when space is pressed.
- Prevent firing a new star until the current star hits something or leaves the screen.
- Use the ninja's facing direction to set the projectile's x speed.
- When the star collides with a target, a platform, or the edge of the screen, hide it and reset it to the ninja.
- Move the target to a new location when it is hit.

**Win and loss behavior:** Track how many targets are hit. The win condition is 10 hits before time runs out; otherwise, display a loss message on an end screen. Allow restarting from the end screen and quitting with Escape.

**Completion checks:** Only one star can be active at a time, projectile direction follows the ninja's facing state, target hits are counted accurately, and the game has clear start, win, loss, restart, and quit behavior.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_8_target_shoot.mp4"
				},
				{
					title: "Multiple Projectiles with Lists",
					content: `**Concept focus:** Many games allow multiple bullets, lasers, or spells to exist at the same time. A list is the natural structure because each projectile follows the same update and draw pattern while keeping its own position.

**Practice sequence:**
- Create a global list named \`projectiles\`.
- In \`on_key_down(key)\`, whenever space is pressed, create a new projectile at the firing origin and append it to \`projectiles\`.
- Represent each projectile as a small ZRect or Actor, depending on what fits the game.
- In \`update()\`, loop through \`projectiles\` and move each projectile in the appropriate direction.
- In \`draw()\`, loop through \`projectiles\` and draw each projectile.
- Remove a projectile when it reaches the edge of the screen so the list does not grow forever.
- Use a safe removal pattern, such as building a new list of still-active projectiles or iterating over a copy, so the code does not modify the same list it is currently looping through.`
				},
				{
					title: "PyG8 Project 2: Asteroid Shoot",
					content: `**Project goal:** Create a bottom-shooter game where a rocket fires multiple lasers at falling asteroids.

**Core setup:**
- Add a start screen that requires pressing Enter to begin.
- Create a rocket Actor at the bottom of the screen.
- Move the rocket left and right with the arrow keys.
- Create multiple asteroid Actors that fall from the top of the screen.

**Laser list behavior:**
- Create a \`player_lasers\` list.
- When space is pressed, append a new laser starting at the rocket's position.
- In \`update()\`, move each laser upward.
- Remove lasers that leave the top of the screen.
- When a laser collides with an asteroid, remove the laser and reset the asteroid to a random top position. Check that the laser is still in the list before removing it to avoid duplicate-removal errors.

**Difficulty and ending:** End the game if an asteroid reaches the bottom or collides with the rocket. Increase asteroid speed every five seconds to ramp up difficulty. At game over, display survival time and allow restarting with Enter or quitting with Escape.

**Completion checks:** Laser creation and removal do not corrupt the list, asteroids reset on hits, difficulty increases over time, and both asteroid-bottom and rocket-collision failures end the game cleanly.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_8_asteroid_shoot.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Game Elements: Projectiles: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Game Elements: Projectiles",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Game Elements: Projectiles Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG8 Game Elements: Projectiles",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-21-pyg8-game-elements-projectiles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-21-pyg8-game-elements-projectiles-supplemental-2/solution"
				},
				{
					title: "Game Elements: Projectiles Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG8 Game Elements: Projectiles",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-22-pyg8-game-elements-projectiles-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-22-pyg8-game-elements-projectiles-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG9 Game Elements: Enemy AI",
			curriculum: [
				{
					title: "PyG9 Project 1: Shark Chase (Fish Bowl)",
					content: `**Project goal:** Build a Fish Bowl game where a shark chases a diver, fish increase the score, and seaweed can hide the player.

**Player and motion:**
- Create a diver Actor controlled with the arrow keys.
- Apply gravity and friction in both x and y directions for an underwater feel.
- Prevent the diver from leaving the screen.

**Shark behavior:**
- Add a shark Actor with dynamic \`shark.xspeed\` and \`shark.yspeed\`.
- First test the shark with fixed speeds so movement and wall behavior are easy to debug.
- Define \`setDirection()\` to compute speeds that move the shark toward the diver's current position. This is similar to the vector math used in the Golf project to move a ball toward a click.
- Use \`clock.schedule_interval(setDirection, 1.0)\` so the shark retargets the diver every second instead of every frame.

**Hiding mechanic:**
- Add a seaweed Actor.
- Modify \`setDirection()\` so that if the diver is fully inside the seaweed, the shark receives random speeds instead of targeting the diver. This simulates the shark losing sight of the player.

**Scoring and ending:** Create a school of fish that swim across the screen and award points when collected. Add game-over logic when the shark catches the diver and use clear game-state values for play, win, loss, or restart screens.

**Completion checks:** The diver controls are responsive, the shark visibly retargets over time, seaweed changes the shark behavior, fish collection changes the score, and the game reaches a clear end state on collision.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_9_shark_chase.mp4"
				},
				{
					title: "PyG9 Project 2: Space Battle",
					content: `**Project goal:** Create a boss-style Space Battle where an alien ship fires at the player while the player fires back.

**Alien behavior:**
- Create an alien Actor with dynamic \`xspeed\` and \`health\`.
- Move the alien horizontally and bounce it off the walls.
- Increase the alien's speed each time it changes direction.
- Create an \`enemy_lasers\` list to hold enemy projectiles.
- Define \`alien_shoot()\` to spawn a new laser from the alien and append it to \`enemy_lasers\`.
- Schedule \`alien_shoot()\` at several different intervals, such as 1.0, 1.3, and 0.6 seconds, so shots do not line up predictably.

**Player behavior:**
- Create a player rocket at the bottom of the screen with a health attribute.
- Move the rocket left and right with the arrow keys.
- Create a \`player_lasers\` list.
- Add a new player laser on each valid space press.

**Collision and ending:** In \`update()\`, move all lasers, remove offscreen lasers, and check collisions. Player lasers that hit the alien reduce alien health; enemy lasers that hit the player reduce player health. End the game when either health reaches zero and display a win or loss message.

**Completion checks:** Both projectile lists update safely, alien firing feels semi-random, health changes only on hits, and the win/loss result matches which ship reaches zero health first.`,
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_9_space_battle.mp4"
				},
				{
					title: "Game Elements: Enemy AI: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Game Elements: Enemy AI",
						section: "planning"
					})
				},
				{
					title: "Game Elements: Enemy AI: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Game Elements: Enemy AI",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Game Elements: Enemy AI: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Game Elements: Enemy AI",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Game Elements: Enemy AI Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG9 Game Elements: Enemy AI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-23-pyg9-game-elements-enemy-ai-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-23-pyg9-game-elements-enemy-ai-supplemental-2/solution"
				},
				{
					title: "Game Elements: Enemy AI Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG9 Game Elements: Enemy AI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-24-pyg9-game-elements-enemy-ai-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-24-pyg9-game-elements-enemy-ai-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #3: System Control, Projectiles, Enemy AI",
			curriculum: [
				{
					title: "Check-In #3: System Control",
					content:
						"Start from the rocket-and-targets starter code (check_in_3_starter.py) where the rocket moves left and right with arrow keys. Steps 1/2 add a start screen so the game only begins when Enter is pressed; before that, draw a start message and ignore normal game updates. Step 3 identifies the tool used to schedule future events, such as PyGame Zero's clock or timers. Steps 4/5 use a scheduled event to move the targets to new random positions every 5 seconds. Step 6 adds logic that can cancel or stop this repeating movement when needed, such as after a win condition."
				},
				{
					title: "Check-In #3: Projectiles and Enemy AI",
					content:
						"Projectiles-1: When the space key is pressed, fire a laser from the spaceship. Move the laser upwards (or toward the target) and make the target disappear when hit. Initially, restrict to one laser at a time. Projectiles-2/3/4: Update the code to support multiple simultaneous lasers, typically by storing them in a list and iterating to move and draw them. Projectiles-5: Choose one target and make it exhibit simple AI: it should continuously move toward the spaceship while still relocating to a random position every few seconds and resetting properly when shot."
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Extend the Shark Chase game by adding a crab enemy that patrols along the bottom of the ocean. The crab should move left and right following the diver's horizontal position. If the crab touches the diver while the diver is not hiding in seaweed, the game should end. Bonus: if the diver is hiding in seaweed, make the crab move away instead of toward the diver, and occasionally have the crab jump using the game clock to schedule jumps.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Check In #3: System Control, Projectiles, Enemy AI: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle:
							"Check In #3: System Control, Projectiles, Enemy AI",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Check In #3: System Control, Projectiles, Enemy AI: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle:
							"Check In #3: System Control, Projectiles, Enemy AI",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Check In #3: System Control, Projectiles, Enemy AI Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #3: System Control, Projectiles, Enemy AI",
						itemTitle:
							"Check In #3: System Control, Projectiles, Enemy AI Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-25-check-in-3-system-control-projectiles-enemy-ai-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-25-check-in-3-system-control-projectiles-enemy-ai-supplemental-2/solution"
				},
				{
					title: "Check In #3: System Control, Projectiles, Enemy AI Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle:
							"Check-In #3: System Control, Projectiles, Enemy AI",
						itemTitle:
							"Check In #3: System Control, Projectiles, Enemy AI Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-26-check-in-3-system-control-projectiles-enemy-ai-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-26-check-in-3-system-control-projectiles-enemy-ai-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG10 Ninja Versus Alien",
			curriculum: [
				{
					title: "PyG10 Project 1: Ninja Versus Alien",
					content:
						"Use Ninja Versus Alien as a capstone that combines movement, physics, projectiles, enemy AI, and game states. Start by reviewing the finished behavior and planning the structure. Identify all actors, such as ninja, alien, projectiles, platforms, and power-ups. Decide which actors use gravity and friction, and where lists are needed for multiple projectiles or enemies. Build the game by reusing patterns from previous modules: platforming movement and jumping for the ninja, projectiles for both players, enemy AI for the alien, score and health tracking, and `gameState` for start, play, and end screens. Reason through each subsystem, then connect movement, shooting, collisions, scoring, and win/lose behavior into a complete game.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_10_alien_vs_ninja.mp4"
				},
				{
					title: "Ninja Versus Alien: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Ninja Versus Alien",
						section: "debugging"
					})
				},
				{
					title: "Ninja Versus Alien: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Ninja Versus Alien",
						section: "planning"
					})
				},
				{
					title: "Ninja Versus Alien: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Ninja Versus Alien",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Ninja Versus Alien: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Ninja Versus Alien",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Ninja Versus Alien Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG10 Ninja Versus Alien",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-27-pyg10-ninja-versus-alien-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-27-pyg10-ninja-versus-alien-supplemental-2/solution"
				},
				{
					title: "Ninja Versus Alien Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG10 Ninja Versus Alien",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-28-pyg10-ninja-versus-alien-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-28-pyg10-ninja-versus-alien-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG11 Space Invaders",
			curriculum: [
				{
					title: "PyG11 Project 1: Space Invaders",
					content:
						"Create a Space Invaders–style game that reviews everything learned in the course. Start by planning the implementation and identifying the key actors: player rocket, alien rows or grids, barriers, lasers, and possibly power-ups. Decide how the alien fleets move as a group and change direction, what happens when barriers are hit, and how many screens the game has (start, play, end). Implement the game as independently as possible, reusing building blocks from earlier projects: lists for aliens and projectiles, collision detection, health or lives, scoring, gameState, and possibly levels where alien speed ramps up or formation patterns change. Think about code organization, such as grouping alien movement logic and separating player control from enemy AI.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_11_space_invaders.mp4"
				},
				{
					title: "Space Invaders: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Space Invaders",
						section: "debugging"
					})
				},
				{
					title: "Space Invaders: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Space Invaders",
						section: "planning"
					})
				},
				{
					title: "Space Invaders: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Space Invaders",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Space Invaders: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "Space Invaders",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Space Invaders Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG11 Space Invaders",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-29-pyg11-space-invaders-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-29-pyg11-space-invaders-supplemental-2/solution"
				},
				{
					title: "Space Invaders Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG11 Space Invaders",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-30-pyg11-space-invaders-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-30-pyg11-space-invaders-supplemental-3/solution"
				}
			]
		},
		{
			title: "PyG12 Master Project",
			curriculum: [
				{
					title: "Recap & Readiness Check",
					content:
						"Review what went into building Space Invaders and identify which parts of the course felt strongest and which parts still need reinforcement. Use that reflection to decide whether the next step should be Python Level 2 or additional PyGame fundamentals practice."
				},
				{
					title: "PyG12 Project 1: Master Project",
					content:
						"Scope and build an original Master Project that showcases everything learned. Start by identifying favorite game mechanics and brainstorming ideas that fit the available project window. Once a concept is chosen, write out the steps needed to program the project, including actors, physics, projectiles, screens, levels, and any AI behaviors desired. Aim for independent implementation with the shared work focused on planning, debugging, and architectural decisions rather than typing every line. A focused project that spans about two weeks of work is usually a better fit than an oversized idea that cannot be finished cleanly."
				},
				{
					title: "Bonus Concepts for Assets",
					content:
						"If the project uses images or sounds outside the provided asset bank, prototype with temporary assets first and then replace them with final files later. Resize image files so they match practical sprite sizes, crop or normalize sounds when needed, and explore the PyGame Zero documentation for ideas such as more advanced input, music control, and simple particle effects that can make the Master Project feel more polished."
				},
				{
					title: "Master Project Presentation",
					content:
						"Once the project reaches a solid milestone, present the game and explain the concept, how the code is structured, what problems were solved along the way, and which course concepts were used (actors, physics, projectiles, AI, game states, and levels). Treat the result as a portfolio-quality project summary rather than as a casual show-and-tell."
				},
				{
					title: "Course Recap & Next Course",
					content:
						"Wrap up by recapping the main ideas from the entire PyGame course: actors, events, physics, platforms, projectiles, enemy AI, levels, and game states. Then connect those habits directly to Python Level 2: lists of actors, dictionaries for state, helper functions for logic separation, and classes for larger projects all transfer cleanly into the next Python course."
				},
				{
					title: "Bridge to Larger Python Projects",
					content:
						"Make the transition explicit from game-specific code to broader Python engineering. Leave knowing how to break a large project into helpers, how to move from one-file scripts toward more organized structures, and why the PyGames course is a stepping stone rather than a side branch."
				},
				{
					title: "PyG12 Master Project: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG12 Master Project",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/sounds"
				}
			],
			supplementalProjects: [
				{
					title: "PyG12 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "PyGame",
						moduleTitle: "PyG12 Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/sounds"
				},
				{
					title: "Master Project Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG12 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-31-pyg12-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-31-pyg12-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "PyG12 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-32-pyg12-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-32-pyg12-master-project-supplemental-3/solution"
				}
			]
		},
		{
			title: "Images and Sprites: Implementation Lab",
			curriculum: [
				{
					title: "Images and Sprites: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Images and Sprites: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Images and Sprites: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/images"
				},
				{
					title: "Images and Sprites: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Images and Sprites: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/images"
				},
				{
					title: "Images and Sprites Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-33-applied-studio-17-images-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-33-applied-studio-17-images-supplemental-2/solution"
				},
				{
					title: "Images and Sprites Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Python/PyGame",
						moduleTitle: "Images and Sprites: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-34-applied-studio-17-images-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/PyGames/tree/main/PG-34-applied-studio-17-images-supplemental-3/solution"
				}
			]
		}
	]
};
