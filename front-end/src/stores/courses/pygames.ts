import type { RawCourse } from "./types";

export const pyGamesCourse: RawCourse = {
	name: "PyGames",
	modules: [
		{
			title: "PyG0 Setup, Editors, and Asset Workflow",
			curriculum: [
				{
					title: "Mu, VS Code, and PyCharm",
					content:
						"Compare the three main editor paths directly. Start younger or newer students in `Mu` when setup friction matters most, move most students to `VS Code` for better debugging and file management, and keep `PyCharm` as the advanced Python-specific option once the student is comfortable with a fuller IDE."
				},
				{
					title: "Asset Folder Layout",
					content:
						"Standardize the project layout early with `images`, `sounds`, `music`, and per-project files. The course should treat asset management as part of game engineering rather than a side issue students only debug after the game logic is written."
				},
				{
					title: "Early Debugging Habits",
					content:
						"Teach students to rerun quickly, read tracebacks, and check asset paths, image names, and event handlers early. Most PyGame frustration comes from input, timing, or asset-loading mistakes that become easy to diagnose once the student builds the habit."
				},
				{
					title: "From One File to Organized Games",
					content:
						"Frame the course as a progression from tiny one-file experiments into larger games with cleaner helper functions, clear state variables, and reusable subsystems. Students should know from the beginning that code organization matters as projects grow."
				}
			],
			supplementalProjects: []
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
						'Define WIDTH = 400 and HEIGHT = 300 (all caps) at the top of the file to set the window size. Explain that an object groups data and functions (like the turtle object: position, color, movement functions). Introduce the Actor object for players, enemies, and collectibles; it has x, y, and an image, plus methods like draw() and collision helpers. Create an alien actor with alien = Actor("alien"). Define def draw(): and inside call screen.clear() then alien.draw(). Add an update() function that moves the alien, e.g. alien.x += 5. Experiment with changing x and y, positive vs negative values, and different speeds.'
				},
				{
					title: "Position Keywords",
					content:
						"Explain that the coordinate system starts at (0, 0) in the top-left, with y increasing downward. Show position keywords like topleft, topright, bottomleft, bottomright, midtop, midleft, midright, midbottom, and center. Place the alien with alien.bottomleft = (0, HEIGHT) or other keywords and let the experiment. Improve wrapping logic so the alien fully leaves the screen before reappearing: use if alien.left > WIDTH: alien.right = 0 in update()."
				},
				{
					title: "Global Variables & Bouncing",
					content:
						"Introduce global variables as those defined outside a function. Create a global speed variable, e.g. xspeed = 5, and use it in update() with alien.x += xspeed. When modifying a global inside a function, declare it with global xspeed at the top of update(). Instead of wrapping, make the alien bounce off a wall by flipping the sign of xspeed when the alien hits an edge, e.g. when alien.right >= WIDTH, set xspeed = -xspeed."
				},
				{
					title: "PyG1 Project 1: Rainbow Fill",
					content:
						"Create a project where rows of color scroll across the screen. Use random.randint() if needed and a list of colors. In draw(), clear the screen and fill it with rectangles or strips of varying colors from a list. Each frame, update the list or indices so the colors appear to move or cycle.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG1-Rainbow-Fill.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_rainbow_fill.mp4"
				},
				{
					title: "PyG1 Project 2: Bouncing Alien",
					content:
						"Reuse the alien actor and give it dynamic attributes alien.xspeed and alien.yspeed. In update(), move the alien with alien.x += alien.xspeed and alien.y += alien.yspeed. When the alien hits the left/right or top/bottom edges, reverse the appropriate speed to make it bounce. Optional: start the alien in a random position and slightly increase its speed each time it hits a wall.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG1-Bouncing-Alien.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_bouncing_alien.mp4"
				},
				{
					title: "PyG1 Project 3: Wandering Ball",
					content:
						"Create a ball actor at the center of the screen. Define global xspeed and yspeed, and a helper resetBall() that moves the ball back to the center and assigns random non-zero speeds. In update(), move the ball using xspeed and yspeed, and when it goes offscreen call resetBall() to restart with new speeds. Challenge: ensure neither speed is ever zero so the ball always moves.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG1-Wandering-Ball.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_1_wandering_ball.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG2 Event Handling",
			curriculum: [
				{
					title: "Keyboard Events",
					content:
						'Introduce event listeners as code that runs when specific events happen. Show on_key_down(key) which is called when a key is pressed. First, move the alien on any key press, then restrict it with if key == keys.RIGHT: so it only moves right with the right arrow. For continuous movement, check in update() with if keyboard.right: to keep moving while the key is held. Use alien.angle = 180 when "w" is pressed, alien.angle = 0 (or similar) on "s" to reset, and alien.angle += 5 / alien.angle -= 5 on "a" and "d" to rotate left and right. Use on_key_up(key) when you need to respond to key releases, e.g. move the alien up 10 pixels when the space key is released.'
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
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG2-Arrow-Point.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_arrow_point.mp4"
				},
				{
					title: "PyG2 Project 2: Apple Collector",
					content:
						"Create an apple actor positioned randomly on the screen. Implement on_mouse_down(pos, button) to check if the click is on the apple; if so, move the apple to a new random position and optionally increase a score counter and play a sound. Draw the score text in the corner of the screen so the player can track how many apples they have collected.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG2-Apple-Collector.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_apple_collector.mp4"
				},
				{
					title: "PyG2 Project 3: Art Box",
					content:
						'Create a box actor that can be dragged and recolored. Use a global boolean like box_grab which is True when the mouse is held down over the box and False otherwise. In on_mouse_move(pos), move the box with the mouse only if box_grab is true. Store image names for different colors in a list and track the current index. Change the box\'s image when "a" or "d" is pressed by decrementing or incrementing the index, wrapping it around so it stays within the list\'s bounds.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG2-Art-Box.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_2_art_box.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG3 Object-Oriented Programming: Advanced Actors",
			curriculum: [
				{
					title: "ZRect Class",
					content:
						"Explain that a ZRect object represents a rectangle with position, width, and height, and can be used to draw shapes and detect overlaps. Define WIDTH and HEIGHT, then create a rectangle with box = ZRect((100, 100), (50, 50)). In draw(), use screen.draw.rect(box, (255, 0, 0)) to draw a red rectangle. Experiment with different colors using (r, g, b) values and practice creating rectangles that cover the whole screen or only half. Show that ZRects support the same position keywords as actors (e.g. box.center, box.topleft)."
				},
				{
					title: "PyG3 Project 1: ZRect Art",
					content:
						"Create an empty list to store ZRects. Use a for loop to create 10 rectangles with random positions and sizes and append each to the list. In draw(), loop through the list and draw every rectangle with random colors (random r, g, and b values between 0 and 255). This produces a randomized art piece each frame.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG3-ZRect-Art.py"
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
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG3-Light-Control.py"
				},
				{
					title: "Dynamic Attributes",
					content:
						"Explain that using many global variables for per-actor data doesn't scale. Instead, create dynamic attributes on actors, such as ball.xspeed = 10 and ball.yspeed = 5, and in update() move with ball.x += ball.xspeed and ball.y += ball.yspeed. Use dynamic attributes for values tied to a single actor (speed, lives, color), and reserve globals for overall game state like score, timers, or isGameOver."
				},
				{
					title: "PyG3 Project 3: Beach Ball Chase",
					content:
						"Create an alien actor (controlled by the player) and a ball actor with random position and random xspeed and yspeed dynamic attributes. In update(), move the alien with arrow keys (up/down/left/right) and move the ball by its speeds, bouncing it off the walls. When the alien collides with the ball, increase a score variable and move the ball to a new random position. In draw(), draw both actors and display the score at the top-left using screen.draw.text(str(score), (10, 10)). Encourage breaking logic into helper functions for keyboard input, ball movement, and collision checks.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG3-Beach-Ball-Chase.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_3_beach_ball_chase.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PYG3 Supplemental Project 1: Asteroid Dodge",
					content:
						"Build a game where a player-controlled actor dodges falling asteroid actors. Asteroids spawn at random x positions at the top and move downward; if the player collides with an asteroid, the game ends or the player loses a life. Track how long the player survives or how many asteroids they dodge.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG3-Asteroid-Dodge.py"
				}
			]
		},
		{
			title: "PyG4 Managing Multiple Objects: Collectibles",
			curriculum: [
				{
					title: "Lists of Actors",
					content:
						"Explain that lists let us manage many objects at once. Define WIDTH and HEIGHT, then create an empty list aliens = []. Use a loop to create 10 alien actors, give each xspeed = 5, and append them to the list. In draw(), use for alien in aliens: alien.draw(). In update(), move each alien with alien.x += alien.xspeed and reverse its direction when it hits a screen edge by flipping alien.xspeed. Emphasize the pattern of per-actor dynamic attributes plus list loops."
				},
				{
					title: "PyG4 Project 1: Bouncy Ball Room",
					content:
						"Create many ball actors with random starting x and y positions and random xspeed and yspeed attributes, storing them in a list. In draw(), loop through and draw each ball. In update(), move each ball and bounce it off the walls using ball.top, ball.bottom, ball.left, and ball.right, reversing the appropriate speed when a wall is hit. For ball–ball collisions, write checkBallCollision(b1, b2) to reverse both balls' speeds when they collide, and call it within a nested loop over all pairs of balls.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG4-Bouncy-Ball-Room.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_bouncy_ball_room.mp4"
				},
				{
					title: "PyG4 Project 2: Falling Squares",
					content:
						"Build a column of colored squares that fall down the screen together. Create a resetSquares() function that moves all squares back to the top and scrambles their colors or order using a list of allowed x-positions. Call resetSquares() when the blue square is clicked or when the row reaches the bottom. Use a speed variable to control fall speed and increase it each time the blue square is clicked so the game becomes more challenging.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG4-Falling-Squares.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_falling_squares.mp4"
				},
				{
					title: "PyG4 Project 3: Jewel Catch",
					content:
						"Create a spaceship actor controlled with left/right arrow keys and prevent it from leaving the screen. Set the background to white with screen.fill((255, 255, 255)). Create a list of 5 gem actors and 4 bomb actors at random x positions, each with a random xspeed between 1 and 3. In update(), move gems and bombs downward while also sliding them left/right, reversing horizontal direction when they hit the sides. Write checkGemCollision(gem) to reset a gem to the top when it hits the bottom or is caught by the rocket, awarding 5 points on catch. Write checkBombCollision(bomb) to reset bombs from the bottom or when they hit the rocket, subtracting 10 points on a hit.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG4-Jewel-Catch.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_4_jewel_catch.mp4"
				}
			],
			supplementalProjects: []
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
						"ZRect-1: Ask what a ZRect is and when it is useful. ZRect-2/3/4: Create a blue ZRect of width 50 and height 50 at a random position and draw it to the screen. ZRect-5: Ask what dynamic attributes are and how they help attach data like speed or color to a specific object. ZRect-6: Use dynamic attributes to move the blue ZRect up and down the screen. ZRect-7: When the alien collides with the ZRect, change its color to a random one. ZRect-8: Discuss how program behavior changes if .colliderect() is replaced with .contains()."
				},
				{
					title: "Check-In #1: Collectibles",
					content:
						"Collectibles-1: Ask what happens when we want multiple boxes on screen and how lists help manage them. Collectibles-2/3: Create 10 blue ZRects, store them in a list, move them in random directions, and make them bounce off the edges of the screen. Collectibles-4: When any box collides with the alien, change its color to a random one. Collectibles-5: When boxes collide with each other, make them bounce off each other by reversing their speeds."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a game where an alien collects coins. Coins increase the score by 1 when collected. Add three red blocks that move up and down the screen; if the alien touches a red block, the player loses 10 points and the alien resets to a random position. Discuss how to structure the game using actors, lists, and collision checks.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/Check-in-1-Additional-Practice-Solution.py"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG5 Physics",
			curriculum: [
				{
					title: "Gravity and Wind",
					content:
						'Explain forces as changes in speed over time, focusing on gravity pulling objects downward and wind pushing sideways. Start a new project and create a ball Actor using the "beach_ball" image with dynamic attributes ball.xspeed and ball.yspeed, setting ball.yspeed = 3. Define draw() and update() so that ball.x and ball.y are updated each frame. Add a global GRAVITY = 0.1 and, at the top of update(), do ball.yspeed += GRAVITY before updating ball.y so the ball accelerates downward. Discuss what the ball\'s speed would be after 10 and 20 updates and experiment with different GRAVITY values. Then make the ball bounce off the floor by reversing yspeed when it goes off the bottom of the screen and clamping it back in with ball.bottom = HEIGHT. Introduce a WIND global (e.g., WIND = 0.05) and add ball.xspeed += WIND in update() to push the ball sideways; experiment with positive, negative, and zero WIND values and talk about how update order and rounding can cause bounce heights to drift over time.'
				},
				{
					title: "PyG5 Project 1: Keep Up",
					content:
						"Build a click-based juggling game where the player keeps a ball in the air. Create a ball Actor with dynamic xspeed and yspeed and global variables GRAVITY and score. In draw(), clear the screen, draw the score text, and draw the ball. In update(), apply GRAVITY to yspeed, update the ball\'s x and y with xspeed and yspeed, and make it bounce off the floor and optionally the top. Add wall-bounce logic on the left and right edges, for example: if ball.right > WIDTH: ball.right = WIDTH; ball.xspeed = -ball.xspeed, and similarly for ball.left < 0. Implement on_mouse_down(pos) so that if ball.collidepoint(pos) is True, the ball\'s yspeed is set to -3, xspeed is set to a random value between -15 and 15, and score is incremented. Tweak speeds and gravity so the game feels fair but challenging.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG5-Keep-Up.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_keep_up.mp4"
				},
				{
					title: "Friction",
					content:
						"Introduce friction as a force that slows moving objects when they are in contact with a surface. Create a ball Actor whose bottom touches the bottom of the screen with dynamic attributes xspeed and yspeed, setting xspeed = 10 and yspeed = 0. Define a global FRICTION = 0.95 and in update() multiply ball.xspeed and ball.yspeed by FRICTION each frame before updating position. Observe that fast motion slows quickly while slow motion tapers off gently when multiplying by a value slightly less than 1. Experiment with different starting speeds and friction values, including cases where FRICTION is closer to 1 (gentle slowing), much lower (rapid stop), and greater than 1 (the ball speeds up instead of slowing down) and discuss which feels realistic for games."
				},
				{
					title: "PyG5 Project 2: Golf",
					content:
						"Create a simple top-down golf game where the player clicks to hit a ball toward a hole. Add Actors for a golf ball, hole, and flag. Give the ball dynamic xspeed and yspeed and create global FRICTION and strokes variables. Place the hole in the center and the flag above it. In draw(), set the background with screen.fill((50, 100, 50)), draw the stroke count in the top-left corner, and draw the hole, flag, and ball. In update(), apply friction to the ball, update its position based on xspeed and yspeed, and make it bounce off the walls. Implement on_mouse_down(pos) so that if the ball is essentially stopped (abs(xspeed) and abs(yspeed) < 0.5), clicking sets ball.xspeed = (mouseX - ball.x) / 10 and ball.yspeed = (mouseY - ball.y) / 10, where mouseX and mouseY come from pos, and increments strokes by 1. Detect when the ball reaches the hole and handle a win state, resetting or advancing as desired.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG5-Golf.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_golf.mp4"
				},
				{
					title: "PyG5 Project 3: Ball Pit",
					content:
						"Simulate a ball pit with many bouncing balls. Create a list containing 10 ball Actors at random positions and give each ball random dynamic xspeed and yspeed. Define global GRAVITY and FRICTION. In draw(), loop through the list and draw each ball. In update(), for each ball add GRAVITY to its yspeed, multiply both xspeed and yspeed by FRICTION, update its position, and bounce it off the edges, reversing speed and clamping the ball back on screen when it goes out of bounds. Implement on_key_down(key) so that pressing the space bar randomizes the position and speed of all balls. Add on_mouse_down(pos) to loop through the balls and, when collidepoint(pos) is True for a ball, assign it a new random xspeed and yspeed to make it shoot off in a new direction.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG5-Ball-Pit.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_5_ball_pit.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG6 Managing Multiple Objects: Obstacles and Surfaces",
			curriculum: [
				{
					title: "Platforms with ZRect",
					content:
						"Introduce ZRect for solid platforms that a character can stand on. Create a floor ZRect at the bottom of the screen using floor = ZRect((0, HEIGHT - 20), (WIDTH, 20)) and draw it in draw() with screen.draw.filled_rect(floor, (255, 255, 255)). Create an alien Actor in the center with dynamic xspeed and yspeed. Add global GRAVITY and FRICTION and in update() apply gravity to yspeed, friction to xspeed, and update alien.x and alien.y so the alien falls through the floor. Then implement platform collision with if alien.colliderect(floor): alien.bottom = floor.top; alien.yspeed = 0 so the alien stands on the floor. Add keyboard.left and keyboard.right controls that adjust xspeed, and implement jumping with a space key. To prevent double jumps, create alien.onground = False, change the jump condition to if keyboard.space and alien.onground and set alien.onground = False when jumping, and set alien.onground = True inside the platform collision logic. Test that the alien can only jump when standing on the platform."
				},
				{
					title: "Moving Platforms",
					content:
						"Teach how to make platforms move and bounce between limits. Shorten the floor platform to 200 pixels wide and give it a dynamic floor.xspeed = 2. In update(), move it with floor.x += floor.xspeed and observe that it disappears off the right side. Add dynamic bounds floor.leftlimit = 0 and floor.rightlimit = WIDTH and, in update(), bounce with if floor.right > floor.rightlimit: floor.right = floor.rightlimit; floor.xspeed = -floor.xspeed and a similar condition when floor.left < floor.leftlimit. Experiment with different limits so the platform stays only on the right side or in the center third of the screen. Add yspeed, toplimit, and bottomlimit attributes to support vertical and diagonal motion and bounce vertically in a similar way."
				},
				{
					title: "PyG6 Project 1: Stay on the Platform",
					content:
						'Create a game where the player must stay on an increasingly difficult moving platform. Make a platform with dynamic xspeed, yspeed, leftlimit, rightlimit, toplimit, and bottomlimit and an alien Actor with xspeed, yspeed, and onground. Define update() to apply gravity and friction to the alien, process keyboard input to move and jump, move the alien by its speeds, move the platform and bounce it within its limits, and handle platform collision by setting alien.bottom to the platform\'s top, alien.yspeed = 0, and alien.onground = True. Define draw() to draw the alien, platform, and score text in the top-left. Create global lose = False and score = 0 and in update() declare them global, wrap all movement and game logic in if not lose:, increase the platform speed over time, and set lose = True if the alien falls off the bottom of the screen. Increment score each update or based on survival time. In draw(), show only the score and a "Game Over" message when lose is True.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG6-Stay-on-the-Platform.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_stay_on_the_platform.mp4"
				},
				{
					title: "Multiple Platforms with Lists",
					content:
						"Teach managing many platforms with a list. Create an empty list platforms and add a floor platform plus two smaller platforms (platform1 and platform2) above it. In draw(), loop through platforms and draw each one. Reuse your alien, gravity, friction, and jumping code. In update(), before checking collisions, set alien.onground = False. Then loop through platforms and use if alien.colliderect(p) and alien.yspeed >= 0: alien.bottom = p.top; alien.yspeed = 0; alien.onground = True so the alien snaps to the top of any platform it lands on while moving downward. Discuss how this prevents snapping when jumping up through a platform. Next, loop through platforms after creating them to set p.xspeed = 0 and p.yspeed = 0 for all; then manually set xspeed and yspeed for any moving platforms. Add limits with p.leftlimit = 0, p.rightlimit = WIDTH, p.toplimit = 0, and p.bottomlimit = HEIGHT in the same loop and, in update(), move each platform and bounce it inside its limits. Emphasize how using a list scales to many platforms with little extra code."
				},
				{
					title: "PyG6 Project 2: Platformer Game",
					content:
						'Design and build a full platformer level. Start by sketching a level layout (for example using https://aggie.io) including at least 8 platforms, at least 1 moving platform, a start position for the alien, and a diamond. Convert the drawing into a list of ZRects for platforms, then write draw() and run to verify platform positions. Add dynamic motion attributes to selected platforms and update() logic so they move and stay within their limits. Add an alien Actor that can walk and jump on platforms and resets to the start when it falls off the screen. Add a diamond Actor using the "diamond_s" image at the goal location. Create a global gameOver flag initially False and another variable to track whether the diamond has been collected. When the alien touches the diamond, set gameOver to True, hide the diamond, and display a "Game Over" or "You Win" text instead of the regular game view.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG6-Platformer-Game.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_platformer_game.mp4"
				},
				{
					title: "PyG6 Project 3: Falling Jump",
					content:
						'Create an endless survival game with falling platforms. Start with an empty platforms list and a loop that creates 10 ZRects at random horizontal positions. For each platform, add dynamic attributes yspeed and color (an (r, g, b) tuple) and append it to platforms. Define draw() to draw all platforms. Add an alien Actor that moves left and right, is affected by gravity, and falls off-screen if unsupported. In update(), move each platform downward by its yspeed and when a platform goes below the bottom, send it back to the top with a new random position. Implement collision so that when the alien lands on a platform its yspeed becomes a negative value (a bounce). Create a global gameOver flag that, when True, stops motion and triggers a "Game Over" message in draw(). Tune bounce strength and platform speeds until the difficulty feels fair but challenging.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG6-Falling-Jump.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_6_falling_jump.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-In #2: Gravity, Friction, Platforms",
			curriculum: [
				{
					title: "Check-In #2: Gravity (Bigfoot Game)",
					content:
						"Gravity-setup: Start from the Bigfoot starter game (check_in_2_starter.py) and walk through the code so the understands how Bigfoot moves left and right with the arrow keys. Gravity-1: Ask what global variables and dynamic attributes are needed to add gravity (a global gravity and a yspeed attribute on Bigfoot; xspeed is optional). Gravity-2: Add these variables to the game. Gravity-3: In update(), apply gravity to Bigfoot by increasing yspeed and updating his y position. Gravity-4: Add code to stop Bigfoot at the floor instead of letting him fall through. Gravity-5: Add an event listener so pressing the up arrow makes Bigfoot jump."
				},
				{
					title: "Check-In #2: Friction (Shuffleboard Game)",
					content:
						"Friction-setup: Use the Shuffleboard starter game. The goal is to tweak friction so the puck stops at the center of the bullseye. Friction-1: Create global variable(s) to represent friction. Friction-2: Modify update() so friction gradually reduces the puck's speed by multiplying its velocity by a friction factor each frame. Friction-3: Tweak the friction value (roughly around 0.967) so the puck slows and stops in the bullseye's center, discussing how changing this value affects motion."
				},
				{
					title: "Check-In #2: Single Platforms",
					content:
						"Platforms-1: Ask how to represent a platform in code (e.g. a ZRect or actor) and how to add it to a game. Platforms-2: In the Bigfoot game, create a 200×20 platform in the middle of the screen and draw it. Platforms-3/4: Add collision logic so Bigfoot can jump onto and stand on the platform: check if his feet intersect the platform from above, snap his bottom to the platform top, and set his vertical speed to 0. Platforms-5: Make the platform move horizontally and bounce off walls by adding a dynamic xspeed attribute and reversing it at screen edges."
				},
				{
					title: "Check-In #2: Many Platforms",
					content:
						"Many-1: Discuss how to store many platforms using a list. Many-setup: Make a copy of the Bigfoot game file for a version with multiple platforms. Many-2: Create a list of 10 platforms with random sizes, positions, and colors and store the color as a dynamic attribute. Many-3: Modify draw() to draw all platforms using their color attributes. Many-4: Update collision logic so Bigfoot can stand on any platform in the list, not just one."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						'Modify one of the Bigfoot games so pressing the "f" key flips gravity upside down. When gravity is reversed, Bigfoot should fall upward without leaving the screen; adjust collision so he can stand against the top or bottom surfaces appropriately. Optionally, flip Bigfoot\'s sprite with bigfoot.angle = 180 when gravity is reversed and make moving platforms behave correctly with inverted gravity.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/Check-in-2-Additional-Practice-Solution.py"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG7 Levels and System Control",
			curriculum: [
				{
					title: "Game Screens with gameState",
					content:
						'Introduce the concept of multiple game screens such as start, play, pause, and end. Create an alien Actor in the center of the screen and a global string gameState = "start". In on_key_down(), when the space key is pressed, change gameState to "play". In draw(), use if/else on gameState so that when gameState is "start" you show only text like "Press Space to Play!" and when it is "play" you draw the alien and hide the start text. Discuss how this pattern can extend to pause and game-over screens later and why using a small set of string states keeps the logic organized.'
				},
				{
					title: "Time Module and Pausing",
					content:
						"Explain that Python\'s time module provides utilities for working with real time. Import time at the top of the file. Modify a simple alien-running game so that when the alien reaches the right edge of the screen, the game pauses for one second before resetting the alien to the left. Use time.sleep(1) to introduce a blocking delay and discuss its limitations: it freezes the entire game loop and is only appropriate for brief transitions or very simple effects."
				},
				{
					title: "Clock Scheduling in Pygame Zero",
					content:
						'Show how to schedule functions without freezing the game using Pygame Zero\'s clock. Create an alien that can be clicked to change its image to a "hurt" version. Define setAlienNormal() to restore the alien\'s normal image. Replace any time.sleep calls with clock.schedule_unique(setAlienNormal, 1.0) in the click handler so the alien looks hurt for one second while the game keeps running. Next, define moveRandom() to move the alien to a random screen position and use clock.schedule_interval(moveRandom, 0.5) when the player presses space so the alien teleports every half second. Add clock.unschedule(moveRandom) when the player presses "s" to stop the movement. Emphasize that schedule_unique runs once after a delay, schedule_interval runs repeatedly, and unschedule cancels scheduled callbacks.'
				},
				{
					title: "PyG7 Project 1: Alien Catch",
					content:
						"Build a game that uses multiple screens and timing to challenge the player\'s reactions. Show the final Alien Catch solution and discuss how many screens it has and how alien speed changes. Implement a start screen where the user presses Enter to begin (keyboard.RETURN or keyboard.kp_enter depending on the key). In play mode, have an alien move horizontally across the screen while the player presses space to stop the alien. If the alien stops on top of a target square, the player gains a point and the alien\'s speed increases; otherwise, the player loses a life. Before each new run, use time.sleep or a clock-based delay to pause for one second so the player can prepare. Track lives with a global variable and, when lives reach zero, switch gameState to an end screen where the player can press Enter/Return to play again or Escape to quit using quit().",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG7-Alien-Catch.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_7_alien_catch.mp4"
				},
				{
					title: "PyG7 Project 2: Beach Ball Dodge",
					content:
						"Create a survival game where a blue square dodges moving beach balls while two scheduled functions track difficulty and time. Show the final Beach Ball Dodge solution and identify its screens, components, and how the square changes over time. Implement a start screen controlled by the space key. In play mode, let the player move a blue square using the arrow keys while beach balls move horizontally across the screen. Create increaseSize(), which uses inflate_ip(w, l) to grow the square, and schedule it with clock.schedule_interval(increaseSize, 5) so the square increases in size every 5 seconds. Create increaseTimer(), which increments a timer variable and schedule it every second to track survival time. Ensure these scheduled functions start only when the game starts and are cancelled or stopped once the game ends. When the player collides with a beach ball, show an end screen displaying how long they lasted, and allow them to restart with space or quit with Escape.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG7-Beach-Ball-Dodge.py"
				},
				{
					title: "Level Design Concepts",
					content:
						"Discuss levels as a way to keep games challenging. Explain pre-generated levels (fixed layouts, specific enemy or power-up locations, designed maps) versus randomized levels (enemies or collectibles spawn at random positions or times). Point out that many games mix both approaches, using a pre-built map with some random enemy or item spawns. Introduce a global level variable to track the current level and show how it can drive logic such as difficulty, spawn rates, and layout changes. Connect this to gameState so it\'s clear which screen is active versus which level is being played."
				},
				{
					title: "PyG7 Project 3: Number Count",
					content:
						'Implement a memory and timing game that uses levels, music, and multiple screens. Show the final Number Count solution and discuss its components, how they interact, and how many screens it includes. On the start screen, let the player select easy, medium, or hard difficulty. Initialize the player with 3 lives and 3 numbered blocks in level 1. For each level, display purple tiles that show numbers in order; after the player clicks the tile labeled "1", hide numbers on the other tiles and start a timer. Track which number the player should click next with a variable and, when they click correctly, play a chime and keep that tile\'s number visible. Use music.play("tune.mp3") for background music. When time runs out, reduce lives by one; when lives reach zero, show a game-over screen where the player can choose to play again or quit with the space and Escape keys. When the player completes all 15 levels, show a winning end screen with a congratulatory message and restart options. Discuss how to store and increment the level and how to scale the number of tiles with each level.',
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG7-Number-Count.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_7_number_count.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG8 Game Elements: Projectiles",
			curriculum: [
				{
					title: "Single Projectile Mechanics",
					content:
						'Introduce projectiles as common game elements such as bullets, arrows, or magic spells. Create a simple scene with an alien Actor on the left side of the screen. Define a ZRect p representing a projectile with a small width and height (e.g., 10x10). Add a global boolean fired = False to track whether the projectile is currently in flight. In on_key_down(key), when space is pressed and fired is False, set fired = True and position p at the alien\'s current location. In update(), if fired is False, keep p locked to the alien and do not draw it; if fired is True, move p to the right each frame. In draw(), only draw the projectile when fired is True. When p reaches the right edge of the screen, reset fired to False so the player can fire again. Discuss how this pattern can generalize to any weapon or spell that must "return" before firing again.'
				},
				{
					title: "PyG8 Project 1: Target Shoot",
					content:
						"Develop a ninja-target shooting game using a single reusable projectile. Show the finished Target Shoot solution and discuss its components and how many screens it has. Add a start screen where the player presses Enter to begin. Create a ninja Actor that can move left, right, and jump on platforms using the arrow keys and space bar. Add a ninja star projectile that fires in the direction the ninja is facing when space is pressed and prevent firing a new star until the current one hits something or leaves the screen. Track the direction of the ninja with a property (e.g., facing left or right) and use it to set the projectile\'s x speed. When the star collides with a target, a platform, or the edge of the screen, hide it and reset it to the ninja so another shot can be fired. Move the target to a new location when it is hit. Track how many targets are hit; require the player to hit 10 targets before time runs out to win, otherwise display a loss message on an end screen. Allow restarting from the end screen and quitting with Escape.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG8-Target-Shoot.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_8_target_shoot.mp4"
				},
				{
					title: "Multiple Projectiles with Lists",
					content:
						"Explain that many games allow firing multiple bullets at once and that storing projectiles in a list is the natural solution. Create a global list projectiles. In on_key_down(key), whenever space is pressed, build a new projectile (e.g., a small ZRect or Actor) at the firing origin and append it to projectiles. In update(), loop through projectiles and advance each projectile in the appropriate direction. In draw(), iterate through projectiles and draw each one. Add logic so that if a projectile reaches the end of the screen, it is removed from the list to free memory and avoid clutter. Discuss safe removal patterns (such as building a new list or iterating over a copy) so the does not modify the list while iterating over it in a naive for-loop."
				},
				{
					title: "PyG8 Project 2: Asteroid Shoot",
					content:
						"Create a classic bottom-shooter game where a rocket fires multiple lasers at falling asteroids. Show the final Asteroid Shoot solution and identify its main components and interactions. Add a start screen that requires pressing Enter to start. Create a rocket Actor at the bottom of the screen that moves left and right with the arrow keys. Create a list player_lasers; when space is pressed, append a new laser to this list starting at the rocket\'s position. In update(), move lasers upward and remove any that leave the top of the screen. Create multiple asteroid Actors falling from the top; when a laser collides with an asteroid, remove the laser (checking it is still in the list to avoid errors) and reset the asteroid to a random position at the top. If any asteroid reaches the bottom or collides with the rocket, end the game. Increase asteroid speed every five seconds to ramp up difficulty. At game over, display how long the player survived and allow restarting with Enter and quitting with Escape.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG8-Asteroid-Shoot.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_8_asteroid_shoot.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG9 Game Elements: Enemy AI",
			curriculum: [
				{
					title: "PyG9 Project 1: Shark Chase (Fish Bowl)",
					content:
						"Build a Fish Bowl game where a shark chases a diver and seaweed can hide the player. Show the completed Shark Chase or Fish Bowl solution and ask how the diver is controlled, what happens when fish are collected, what happens when the shark catches the diver, how the shark behaves, and what happens when the player goes behind seaweed. Create a diver Actor controlled with the arrow keys; apply gravity and friction in both x and y directions for an underwater feel and prevent the diver from leaving the screen. Add a shark Actor with dynamic xspeed and yspeed; first test it by giving fixed speeds and moving it each frame. Define setDirection() to compute xspeed and yspeed so the shark moves toward the diver's current position (similar to the vector math used in the Golf project to move the ball toward a click). Use clock.schedule_interval(setDirection, 1.0) so the shark retargets the diver every second. Add a seaweed Actor and modify setDirection() so that if the diver is fully inside the seaweed, the shark's xspeed and yspeed become random values, simulating the shark \"losing sight\" of the player. Add game-over logic when the shark catches the diver and any needed gameState variables. Create a school of fish that swim across the screen and award points when the diver collects them, showing the score on screen.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG9-Shark-Chase.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_9_shark_chase.mp4"
				},
				{
					title: "PyG9 Project 2: Space Battle",
					content:
						"Create a boss-style Space Battle where an alien ship with AI fires at the player. Show the final Space Battle solution and discuss how the alien acts and how the lasers are created and stored. Create an alien Actor with dynamic xspeed and health that moves horizontally and bounces off the walls, speeding up each time it changes direction. Create a list enemy_lasers to hold enemy projectiles. Define alien_shoot() to spawn a new laser from the alien and add it to enemy_lasers. To simulate random firing, schedule alien_shoot() at several different intervals (e.g., 1.0, 1.3, 0.6 seconds) so the shots do not line up predictably. Create a player rocket at the bottom of the screen with a health attribute and allow it to move left and right with the arrow keys. Create a list player_lasers and add a new laser on each space press. In update(), move all lasers, remove them when they go offscreen, and check collisions: player lasers hitting the alien reduce its health; enemy lasers hitting the player reduce the player\'s health. End the game when either health reaches zero and display a win or loss message. Treat this as a simple AI that reacts by shooting at semi-random times and moving in a pattern.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG9-Space-Battle.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_9_space_battle.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-In #3: System Control, Projectiles, Enemy AI",
			curriculum: [
				{
					title: "Check-In #3: System Control",
					content:
						"System Control-setup: Start from the rocket-and-targets starter code (check_in_3_starter.py) where the rocket moves left and right with arrow keys. System Control-1/2: Add a start screen so the game only begins when the user presses Enter; before that, draw a start message and ignore normal game updates. System Control-3: Ask what tool is used to schedule events in the future (PyGame Zero's clock or timers). System Control-4/5: Use a scheduled event to move the targets to new random positions every 5 seconds. System Control-6: Add logic that can cancel or stop this repeating movement when needed (for example, after a win condition)."
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
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/Check-in-3-Solution.py"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG10 Ninja Versus Alien",
			curriculum: [
				{
					title: "PyG10 Project 1: Ninja Versus Alien",
					content:
						"Use Ninja Versus Alien as a capstone that combines movement, physics, projectiles, enemy AI, and game states. Show the finished game and plan the structure together. Identify all actors (such as ninja, alien, projectiles, platforms, and power-ups), which ones use gravity and friction, and where lists are needed (for multiple projectiles or enemies). Implement the game largely on your own, reusing patterns from previous modules: platforming movement and jumping for the ninja, projectiles for both players, enemy AI for the alien, score and health tracking, and gameState for start, play, and end screens. Reason through each subsystem (movement, shooting, collisions, scoring, win/lose) and wire them together into a complete game.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG10-Ninja-Versus-Alien.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_10_alien_vs_ninja.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG11 Space Invaders",
			curriculum: [
				{
					title: "PyG11 Project 1: Space Invaders",
					content:
						"Create a Space Invaders–style game that reviews everything learned in the course. Show the finished Space Invaders solution and plan the implementation together. Identify the key actors (player rocket, alien rows or grids, barriers, lasers, and possibly power-ups), how the alien fleets move as a group and change direction, what happens when barriers are hit, and how many screens the game has (start, play, end). Implement the game as independently as possible, reusing building blocks from earlier projects: lists for aliens and projectiles, collision detection, health or lives, scoring, gameState, and possibly levels where alien speed ramps up or formation patterns change. Think about code organization, such as grouping alien movement logic and separating player control from enemy AI.",
					solutionLink:
						"https://github.com/instruction-material/PyGames/blob/main/PyG11-Space-Invaders.py",
					mediaLink:
						"https://static.classes.jacobdanderson.net/pyg_11_space_invaders.mp4"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PyG12 Master Project",
			curriculum: [
				{
					title: "Recap & Readiness Check",
					content:
						"Review what went into building Space Invaders and identify which parts of the course felt strongest and which parts still need reinforcement. Use that reflection to decide whether the student is ready to move on to Python Level 2 or should spend more time strengthening the PyGame fundamentals."
				},
				{
					title: "PyG12 Project 1: Master Project",
					content:
						"Scope and build an original Master Project that showcases everything learned. Start by discussing favorite games and brainstorming ideas that fit within the course time frame. Once a concept is chosen, write out the steps needed to program the project, including actors, physics, projectiles, screens, levels, and any AI behaviors desired. Aim to implement the project as independently as possible, using class time for planning, debugging, and architectural decisions rather than typing every line. A focused project that spans about two weeks of work is usually a better fit than an oversized idea that cannot be finished cleanly."
				},
				{
					title: "Bonus Concepts for Assets",
					content:
						"If the project uses images or sounds outside the provided asset bank, prototype with placeholder assets first and then replace them with final files later. Resize images so they match practical sprite sizes, crop or normalize sounds when needed, and explore the PyGame Zero documentation for ideas such as more advanced input, music control, and simple particle effects that can make the Master Project feel more polished."
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
						"Make the transition explicit from game-specific code to broader Python engineering. Students should leave knowing how to break a large project into helpers, how to move from one-file scripts toward more organized structures, and why the PyGames course is a stepping stone rather than a side branch."
				}
			],
			supplementalProjects: []
		}
	]
};
