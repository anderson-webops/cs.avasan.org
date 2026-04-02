import type { RawCourse } from "./types";

export const scratchLevel2Course: RawCourse = {
	name: "Scratch Level 2",
	modules: [
		{
			title: "Check-in #1",
			curriculum: [
				{
					title: "Check-in #1: Nested Loops",
					solutionLink: "https://scratch.mit.edu/projects/341945558/",
					content: `Create a new blank project in Scratch, and name it "Check-in #1".
Nested-1: What is a loop? What do we call it when we put a loop inside of another loop?
Nested-2: Add a sprite to your project and have it play a sound when the spacebar is pressed. Put a repeat 3 around the sound block and then a repeat 2 around the whole thing. Before you run the code, can you figure out how many times the sprite will make the sound?
Nested-3: When the green flag is clicked, draw a triangle. Turn 60 degrees and draw another triangle. Can you use a repeat to make a hexagon of triangles?
Note: You can draw this shape using the annotation tool on the screen for clarity.
Nested-4: Draw another, bigger hexagon around the first one. Can you do this by putting a loop around your existing code?`
				},
				{
					title: "Check-in #1: Cloning",
					solutionLink: "https://scratch.mit.edu/projects/341945558/",
					content: `Cloning-1: How can we duplicate sprites and make the duplicates do different things?
Cloning-2,3: Move your drawing code so that when the green flag is clicked, the parent sprite makes clones of itself every 2 seconds and the clones go to a random position and draw the hexagon shape.
Cloning-4: Make sure to show the clones when they are created and then delete them when they\'re done. What should we do with the sprite that isn\'t doing anything?`
				},
				{
					title: "Check-in #1: Complex Conditionals",
					solutionLink: "https://scratch.mit.edu/projects/341945558/",
					content: `Complex-1: What block would you use if you wanted to check if two things are true in the same if/then block?
Complex-2: What about if you wanted to check if, given two things, at least one of them is true?
Complex-3: What about if you wanted to check if a condition isn\'t true?
Complex-ALL: Using complex conditionals, update your code so that the clones that are in the top right portion of the screen all have a blue pen color. (Hint: You may have to use coordinates!) Now, can you add code so that each of the four quadrants uses a different pen color?`
				},
				{
					title: "Check-in #1: Additional Practice Project",
					projectLink: "https://scratch.mit.edu/projects/386649746/",
					solutionLink: "https://scratch.mit.edu/projects/386368696/",
					content: `Use a variable to make the owl count from 1 to 50.
Add a conditional so that if the spacebar or the up arrow is pressed, the owl says something instead of the number.
Add a conditional so that if the mouse pointer is on the owl, it gets shy and doesn\'t say anything at all!`
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-in #2",
			curriculum: [
				{
					title: "Check-in #2: Strings",
					solutionLink: "https://scratch.mit.edu/projects/342645999/",
					content: `Create a new blank project in Scratch, and name it "Check-in #2".
Strings-1: What does the word “string” mean in Scratch?
Strings-2: Add the Andie sprite to your project. When the 1 key is pressed, have him ask the user what their name is. Once the user responds, have him say “Hello [your name]” using one say block.
Strings-3,4: Report to the user the first letter of their name and how many letters are in their name.`
				},
				{
					title: "Check-in #2: Mathematical Operators and Randomness",
					solutionLink: "https://scratch.mit.edu/projects/342645999/",
					content: `Math-1: How can we perform operations on numbers in Scratch? Can you show me where these blocks are?
Math-2: When the 2 key is pressed, make Andie say the result of adding together 5 and 6!
Math-3,4: Create a random number between 1 and 20 and store it in a variable. If the number is less than 10, have Andie say “Wow, that\'s a small number!” otherwise, say “Whoa, that\'s a big number!”
Math-5: What is the mod block? Use it to report to the user the remainder of dividing any two numbers you want!`
				},
				{
					title: "Check-in #2: Lists",
					solutionLink: "https://scratch.mit.edu/projects/342645999/",
					content: `Lists-1: What do you use lists for in Scratch?
Lists-2,3: Change the name of each of Andie's costumes to match the action that each costume is performing ("pass", "shoot", etc). Can you create a list called “actions” and add each of the names of Andie\'s different costumes to it when the 3 key is pressed?
Lists-4: Make Andie say the second thing in the list.
Lists-5: Tell the user what actions Andie can perform by looping through the list.
Lists-6: Once you\'ve reported all of Andie\'s actions to the user, ask which action they would like to see and switch his costume to this action! If you haven\'t already, how do we make sure the list is cleared so we don\'t add duplicate items to the list when the 3 key is pressed?`
				},
				{
					title: "Check-in #2: Functions",
					solutionLink: "https://scratch.mit.edu/projects/342645999/",
					content: `Functions-1: What are functions in Scratch? Where can we create our own blocks in scratch?
Functions-2: Create a function called “Score!”, which changes Andie\'s costume, makes him say “Woohoo!” and play a clapping sound.
Functions-3: Make Andie score when the spacebar is pressed.
Functions-4: Create another function called “Find Multiples” that takes one number input and says the first 10 multiples of that number for one second each.
Functions-5: When the spacebar is pressed, make Andie say the multiples of a random number from 1 to 10.`
				},
				{
					title: "Check-in #2: Additional Practice Project",
					projectLink: "https://scratch.mit.edu/projects/386649865/",
					solutionLink: "https://scratch.mit.edu/projects/386376803/",
					content: `Add one of the dancing sprites to the project and create a function that loops through all of their costumes.
Add a number input that says how many seconds they should dance for in total. Can you use a division operator in the wait block to make sure they\'re dancing for the right number of seconds? Hint: Think about how long they should spend on each costume to add up to the right number of seconds.
When the green flag is pressed, make your sprite dance for 3 seconds.
When they\'re done dancing, ask the user to tell you their favorite dance move by the costume number. Get their top five favorites.
Create a function that loops through this list of favorite dance moves.
Make your sprite dance these moves forever!`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GM1 Review: Events, Loops, Conditionals, & Broadcasting",
			curriculum: [
				{
					title: "Event listeners",
					content: `What do you think an event listener is? An event listener is a way to make our sprite wait and listen until a certain event happens, and then it will react to that event in the way we tell it to.
Can you remember any of the event listeners that you used to make the Hungry Hippo game? Click on the Events section. There were the when green flag clicked and when arrow key pressed blocks. Talk about how these blocks made the sprite do something in response to a certain event, whether it is the green flag being clicked or a certain key being pressed.
View CS Training's Code`
				},
				{
					title: "GM1 Project 1: Dragonfly Events",
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/",
					content: `1. When the green flag is clicked, make the dragonfly go to a random spot on the stage.
2. When the arrow keys are pressed, make the dragonfly move 20 steps in that direction.
3. When the dragonfly is clicked, make it change its color.
4. When the space bar is pressed, make the dragonfly make a popping sound.
5. When 1 is pressed, make the dragonfly "pop" and then go to a random position.
6. When 2 is pressed, make the dragonfly say something ("Buzzzz", for example).
7. When 3 is pressed, make the background change.
Challenge: can you add another sprite that is moves around using the WASD keys?
View CS Training's Code`
				},
				{
					title: "Loops",
					content: `When have you heard the word "loop" before? What do you think loops are for in programming? Loops let us repeat code however many times we want!
Discuss with the why loops might be helpful. For example, we don\'t have to copy our code a bunch of times, we can keep our code simpler, and some things would be impossible without loops (i.e. things that happen forever).
Open a new Scratch project. Have click on the Control section and look at the repeat and forever blocks. Discuss what these might be used for. Point out that both of these blocks have a "mouth" where we can insert other code blocks to be repeated!
Show the an example of repeating the move __ steps and turn ___ degrees blocks. Start with the repeat block and then try the forever block.
View CS Training's Code`
				},
				{
					title: "GM1 Project 2: Drawing Mouse",
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/",
					content: `1. Add an event listener so that when the flag is clicked, everything gets erased.
2. Add an event listener so that when the 1 key is pressed, the mouse draws a square (using a loop) in a random location.
3. Add a similar set of blocks so that the mouse draws a triangle.
4. Add a similar set of blocks so that the mouse draws a circle.
5. What other shapes can you create? Make some other sets of blocks that draw other shapes (e.g. an octagon, a star, etc.).
View CS Training's Code`
				},
				{
					title: "Conditionals",
					content: `In programming, a lot of the time we only want something to happen if something else is true or has been done. A conditional statement is something that needs be met in order for something else to happen.
Discuss with the about "conditionals" in real life, emphasizing the if/then aspect of such situations. Some examples include: If you eat your dinner, then you can have dessert. If you get your homework done, then you can play videogames. If it is cold outside, then you need to wear a jacket.
In addition, usually when we are checking a condition, there is more than one thing that can happen as a response to that condition. This is when a if... then... else conditional statement might come into use!
Open a new Scratch project. Take the time to introduce the to the various conditional blocks, in addition to asking for user input. Here are some rough projects you can use as guidance: if/then, if/then/else, user input.
View CS Training's Code`
				},
				{
					title: "GM1 Project 3: Math Facts",
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/",
					content: `1. When 1 is pressed, have Gobo ask a question like "What's 9-7?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.
2. When is 2 is pressed, have Gobo ask a question like "What's a number less than 0?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.
3. When 3 is pressed, have Gobo ask a harder math question that allows the user to keep answering until the answer is correct. Gobo should indicate each time whether the answer was correct or incorrect.
View CS Training's Code`
				},
				{
					title: "Variables",
					content: `Variables are places that we store information that can change. Variables can store words, numbers, etc. Variables are helpful when we want to keep track of something like a score or time.
Open a new Scratch project. Have click on the Variables section and show them how to make a variable and use the set __ to __ and change __ by __ blocks.
Using a repeat block, make the cat say the numbers 1 to 10 (one by one). Here is a reference project.
Ask to figure out how to make the cat count backward from 10 to 0, and then how to count backward from 100 to 0 by 10s.
View CS Training's Code`
				},
				{
					title: "GM1 Project 4: Speed Click",
					projectLink: "https://scratch.mit.edu/projects/299327014/",
					solutionLink: "https://scratch.mit.edu/projects/299311602/",
					content: `Let's make a game: you get 10 seconds to click on the button as many times as you can. When the time is up, you can't click on the button anymore!
1. Make a variable to keep track of the number of clicks.
2. Use an event listener so that when the sprite is clicked, the variable goes up by one. Make the button switch to the pressed costume and make a sound, too!
3. Make a variable that keeps track of time.
4. When the green flag is clicked, make the timer start from 10 and count down to 0.
5. Before the timer starts, make the button say "Ready...", "Set...", and "Go!" for one second each.
6. When time runs out, make the button hide. Remember, if we make it hide when the game is over, that means that we need to show it when the game starts.
View CS Training's Code`
				},
				{
					title: "Message Broadcasting",
					content: `Previously, we learned about how to use conditional statements to do something if something else happens. However, we haven't learned how to make this work across different sprites. For example, we might want a sprite to say something once another sprite is done moving. In these situations, we use message broadcasting.
Open a new Scratch project. Have click on the Events section and and look at the broadcast __ when I receive __ blocks. Explain that broadcasting is a way that sprites can send each other messages to trigger/start certain parts of our code.
and
Using this project as a rough guide, show the how to make the ball start bouncing only after the cat is done talking.
View CS Training's Code`
				},
				{
					title: "GM1 Project 5: Dance Off",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/",
					content: `It's dancing time! Let's give each sprite a turn to "perform" on the stage.
1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.
2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!
3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays some dancing music forever. When Champ is done dancing, broadcast a message that stops the music.
4. Can you make it so that the lights change, too? How about some clapping once everyone is done?
View CS Training's Code`
				},
				{
					title: "GM1 Project 6: Hedgehog Race",
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/",
					content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.
View CS Training's Code`
				},
				{
					title: "GM1 Project 7: Asteroid Dodge",
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/",
					content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GM2 Nested Loops",
			curriculum: [
				{
					title: "Nested loops",
					content: `Review what a loop is (there should be familiarity with the repeat block in Scratch). What does the word "nested" mean? Think of Russian nesting dolls: nested means something placed inside another thing. Thus, nested loops are loops inside of other loops!
Why might we want to use nested loops?
View CS Training's Code`
				},
				{
					title: "GM2 Project 1: Square Inception",
					projectLink: "https://scratch.mit.edu/projects/306391834/",
					solutionLink: "https://scratch.mit.edu/projects/306394145/",
					content: `1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first small square in the bottom right quadrant. (Make sure the canvas is erased and the cat's pen is down before he starts drawing.)
2. Next, program the cat to draw the medium square, and then the large square.
3. After the cat has drawn these three squares in the bottom right quadrant, have him turn 90 degrees and change his pen color by 25.
4. Using nested loops, program the cat to draw the squares in the other three quadrants as well.
5. Try to use a variable that stores the side length of the square to simplify your code even further.
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM2 Project 2: Pyramid",
					projectLink: "https://scratch.mit.edu/projects/307922307",
					solutionLink: "https://scratch.mit.edu/projects/307918456",
					content: `1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first tiny triangle. (Make sure before he starts drawing, he starts at (0,120), pointing in direction 150 degrees, with his pen down.)
2. Next, program the cat to draw a slightly larger triangle, and then an even slightly larger triangle.
3. Using nested loops and a variable, draw 15 total triangles to make the pyramid!
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM2 Supplemental Project 1: Playing Baseball",
					projectLink: "https://scratch.mit.edu/projects/334075920",
					solutionLink: "https://scratch.mit.edu/projects/334073245/",
					content: `1. Start by setting the pitcher\'s costume to the first one, make him say “Batter up!”, and then cycle through all of his costumes. Send a message broadcast when he\'s done pitching and wait for the batter.
2. When the batter receives the message, make her cycle through all of her costumes.
3. How many strikes until the batter\'s out? Repeat your code this many times.`
				},
				{
					title: "GM2 Supplemental Project 2: Grid",
					projectLink: "https://scratch.mit.edu/projects/334073152/",
					solutionLink: "https://scratch.mit.edu/projects/334067890/",
					content: `Let\'s draw a grid!
1. Start by thinking about how we could draw one row of squares. What would we need to change after drawing each square? How many loops would we need?
2. Make the pencil start at (-200, 150) and draw 8 squares with a side length of 50 from left to right across the screen.
3. How might we make several rows of squares? What would we repeat? What would need to change?
4. Make the pencil draw 6 rows of squares from the top to the bottom of the screen.`
				},
				{
					title: "GM2 Supplemental Project 3: Rainbow Flower",
					projectLink: "https://scratch.mit.edu/projects/335808333/",
					solutionLink: "https://scratch.mit.edu/projects/335807180/",
					content: `Draw a beautiful rainbow flower!
1. When the green flag is clicked, make the pencil sprite go to the center of the screen and put the pen down.
2. Start by programming the code for a circle and then take a look at the turn block. What would happen if we changed the amount we were turning? What would happen if we changed the amount we turned each time we turned? Try to make a variable that keeps track of the angle we turn and increase it by 1 each time we go through the loop.
3. After you're done experimenting in step 2, set up the code so that the angle starts at 0 degrees and repeat 40 times to get a really pretty looking spiral!
4. Now that we have one petal of our flower, can you make the other six? Think about how we have to start from the center of the flower and move outwards each time.
5. Change the pen color after each petal to get a rainbow colored flower!`
				}
			]
		},
		{
			title: "GM3 Complex Conditionals",
			curriculum: [
				{
					title: "Complex conditionals",
					content: `Review with the what a conditional is (they should have familiarity with the if __ then __ and if __ then __ else __ blocks in Scratch). Often, we don\'t decide to do something because of just one thing; sometimes we want something to happen when two or more things are true at the same time, or when either one thing or another thing are true!
Open a new Scratch project. Using this project as a rough guide, introduce the and , or , and not blocks.
View CS Training's Code`
				},
				{
					title: "GM3 Project 1: Color Spotter",
					projectLink: "https://scratch.mit.edu/projects/306694840/",
					solutionLink: "https://scratch.mit.edu/projects/306689852/",
					content: `1. Program controls for the cat so that he moves around on the screen when you press the arrow keys.
2. Using conditionals, program the cat to say "I'm touching red and blue" if he is touching red and blue.
3. Add similar conditionals for if he is touching red and yellow, and blue and yellow.
4. If the cat is touching all three colors, make him say "I'm touching all 3 colors!"
5. If the cat is touching no colors, make him say "I'm touching no colors!"
6. If the cat is touching any one of the colors, make him say "I'm touching a color!"
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM3 Project 2: Strength Tester",
					projectLink: "https://scratch.mit.edu/projects/307992404/",
					solutionLink: "https://scratch.mit.edu/projects/307934264/",
					content: `1. When the green flag is clicked, make the button say "Click me to see how strong you are!"
2. When the button is clicked, make it broadcast the message "How strong"
3. When the arrow receives this message, make it go to (-130, -160), pick a random number between 0 and 300, and move up by this amount.
4. Based on the random number, make the button say one of at least five different messages, like "You're the strongest person ever!" or "It looks like you need to go to the gym!"
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM3 Supplemental Project 1: Baby Chick",
					projectLink: "https://scratch.mit.edu/projects/335794156/",
					solutionLink: "https://scratch.mit.edu/projects/335790153/",
					content: `Use the arrow keys to help the baby chick find its parents!
1. Program the chick so that you can move it up/down/left/right with the arrow keys.
2. When the green flag is clicked, make the rooster point to the right and then move him back and forth across the screen forever. (Hint: Make him turn 180 degrees randomly as he's walking!)
3. Repeat step 2 for the hen.
4. Now, we\'re going to program the chick to know when it is with its parents! If it\'s touching both of its parents, make it say “I love my parents!”, if it\'s just touching its mom, make it say “Hi, Mom!”, if it\'s just touching its dad, make it say “Hi, Dad!”, and if it\'s not touching either, make it say “Where are my parents?”`
				},
				{
					title: "GM3 Supplemental Project 2: Save the Butterfly",
					projectLink: "https://scratch.mit.edu/projects/335798048",
					solutionLink: "https://scratch.mit.edu/projects/335794365",
					content: `Use the left and right arrow keys to help the butterfly escape the hungry frog!
1. When the green flag is pressed, make the butterfly go to (-60, 0) and the frog go to (-170, 0).
2. Next, the frog should say “I\'m hungry”, “Ooh, a butterfly!”, and “I\'m coming to get you!” for two seconds each.
3. After the frog broadcasts, it should start moving a random number of steps from 0 to 3 for the rest of the game. To make the game harder, you can increase the number of steps!
4. Let\'s help the butterfly escape! When it receives that the game has started, use the “wait until” block to make it move forward 5 steps when the user alternates between clicking the left and right key.
5. You might be able to cheat and hold down both keys, so think about how you could use complex conditionals to fix this!
6. If the butterfly is touching the frog, make it stop the other scripts, broadcast that you lost the game, and then hide (that means we need to show it at the beginning).
7. If the butterfly touches the dark purple tree on the other side of the screen, make it broadcast that you won the game and glide off the screen.
8. When the frog receives these win and lose broadcasts, make it stop the other scripts and respond accordingly to its meal!`
				}
			]
		},
		{
			title: "GM4 Cloning",
			curriculum: [
				{
					title: "Cloning",
					content: `Sometimes in our projects or games, we want to have one sprite that's duplicated many times, doing slightly different things. We can make clones or copies of this sprite in our code.
Create a new Scratch project. Using this project as rough guide, introduce the create clone of myself, when I start as a clone , and delete this clone blocks.
Most of the time we don\'t want to see the original sprite, since the clones are doing the things we actually want! Show how to “hide” the parent and “show” the clones.
View CS Training's Code`
				},
				{
					title: "GM4 Project 1: Jackson Pollock Clones",
					projectLink: "https://scratch.mit.edu/projects/307580100/",
					solutionLink: "https://scratch.mit.edu/projects/307575111/",
					content: `1. Start by making the parent pencil create clones of itself continuously.
2. When a clone is created, make it go to a random location, choose a random size and color, and then glide to another random location. Be sure to use the pen block that sets a color using a number, not the block that takes a color as an input. If the wrong block is used, only shades of blue will appear.
Challenge: Make the brush strokes look more realistic with slightly varying angles, colors, and widths.
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM4 Project 2: Rainy Day",
					projectLink: "https://scratch.mit.edu/projects/307634451/",
					solutionLink: "https://scratch.mit.edu/projects/307629921/",
					content: `1. Program the umbrella so that it can be moved with the left and right arrow keys.
2. Program the chick to continuously move forward in little steps and bounce if it hits a wall. Also make the chick switch directions randomly, once every few steps.
3. Program the rain drop to create clones of itself continuously.
4. When a clone is created, it should fall from the sky. Think about what should happen when it touches the chick and when the clone should be deleted, and add these scenarios into your code.
5. Keep track of the number of times the chick got wet, and give the player 60 seconds to protect the chick as much as possible!
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM4 Supplemental Project 1: Fruity Fest",
					projectLink: "https://scratch.mit.edu/projects/336915372/",
					solutionLink: "https://scratch.mit.edu/projects/336928836/",
					content: `1. Set up the parrot to move around with the up/down/left/right arrow keys.
2. Set up the fruit so that a clone is created every second. Each clone should be a random piece of fruit, and it should show up in a random location!
3. Keep track of the total amount of fruit the parrot collects, and end the game and display the fruit platter once the parrot collects 10 pieces.`
				}
			]
		},
		{
			title: "GM5 Strings",
			curriculum: [
				{
					title: "Strings",
					content: `In programming, we work with different kinds of information, or data, that is stored inside of variables. Up until now, we\'ve mainly focused on numbers inside of variables. What kind of things have we done when working with numbers inside of variables? For example, we've kept track of a score and timer, we've added numbers together, and we've checked to see which of two numbers is bigger or smaller.
Another kind of information that we use a lot when coding is words and letters, which we call strings. If the struggles with the terminology of string, you can have them visualize spelling words with letters from a can of Alphabet Soup. We could (with a lot of messiness) put a thread through a bunch of letters to string them together into a word!
Create a new Scratch project. Using this project as a rough guide, introduce the join __ __, letter __ of __, and length of __ blocks. Make sure to explain that the length of a string in programming includes spaces and all other characters.
View CS Training's Code`
				},
				{
					title: "GM5 Project 1: Security Bot",
					projectLink: "https://scratch.mit.edu/projects/308722400/",
					solutionLink: "https://scratch.mit.edu/projects/308717171/",
					content: `The robot is protecting the city! Make his ask three questions (using the string blocks) to help him keep out intruders.
1. Program the robot to ask for the user's name, and make him reply, "Nice to meet you, _____"
2. Program the robot to ask for a word that starts with "q" and tell the user if they answered correctly.
3. Program the robot to ask for a 7-letter word and tell the user if they answered correctly.
4. Program the robot to ask for a word that ends in "y" and tell the user if they answered correctly.
Challenge: Program the robot to ask for a 6-letter word that starts with "a" and tell the user if they answered correctly.
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM5 Project 2: Spelling Bee",
					projectLink: "https://scratch.mit.edu/projects/357452950/",
					solutionLink: "https://scratch.mit.edu/projects/357452924/",
					content: `1. When 1 is pressed, ask the user for a word and spell out the word letter by letter. e.x. C-O-D-I-N-G
2. When 2 is pressed, ask the user for a word and spell out all but the first letter. e.x. O-D-I-N-G
3. When 3 is pressed, ask the user for a word and spell out all but the last letter. e.x. C-O-D-I-N
4. When 4 is pressed, ask the user for a word and spell out all but the first and last letters. e.x. O-D-I-N
5. When 5 is pressed, ask the user for a word and spell out every other letter. e.x. C-D-N
6. When 6 is pressed, ask the user for a word and spell out the word backward. e.x. G-N-I-D-O-C
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM5 Supplemental Project 1: Crazy Country",
					projectLink: "https://scratch.mit.edu/projects/338824789",
					solutionLink: "https://scratch.mit.edu/projects/338828947/",
					content: `Create your own fictional crazy country, with its own leader and activity its citizens are known for!
1. Ask the user for the name of the country and save it.
2. Similarly, ask and save the leader of the country and the primary activity the country is known for.
3. Report this information back to the user using the "say" and "join" blocks.
Challenge: Try to accomplish step 3 using one "say" block with many "join" blocks.`
				},
				{
					title: "GM5 Supplemental Project 2: Beary Spelly",
					projectLink: "https://scratch.mit.edu/projects/338829500",
					solutionLink: "https://scratch.mit.edu/projects/338832976",
					content: `Build a spelling test for yourself to practice your spelling!
1. The starter code already has a secret word picked out and saved in the Secret Word variable for you.
2. Add the Text to Speech extension and speak the secret word to the user.
3. Ask the user to enter each letter of the word one by one. If the letter is correct, speak "Correct!" Otherwise end the game. (Hint: think about how to repeat through the word letter by letter.)
4. If the user has spelled the entire word correctly, speak "You spelled [secret word] correctly! Great work!"`
				}
			]
		},
		{
			title: "GM6 Mathematical Operators",
			curriculum: [
				{
					title: "Mathematical Operators",
					content: `What are you learning in math class right now? Allude to how a computer could help with these topics. Computers get their name from the word compute , since they can compute the answer to math problems for us!
Create a new Scratch project. Open the Operators section, and experiment with how different mathematical operations can be performed with these blocks.
View CS Training's Code`
				},
				{
					title: "GM6 Project 1: Calculator",
					projectLink: "https://scratch.mit.edu/projects/357453092/",
					solutionLink: "https://scratch.mit.edu/projects/357453067/",
					content: `1. Ask the user for the first number, the second number, and the operation (+, -, *, or /). Store each of them in variables.
2. Using conditionals, depending on what the user entered, have the calculator say the answer!
Challenge: Add "remainder" as an operation option. For example, the remainder when 10 is divided by 3 is 1.
Challenge #2: Add exponent (^) as operation option. For example, 2^3 = 8.
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM6 Project 2: FizzBuzz",
					projectLink: "https://scratch.mit.edu/projects/357453182/",
					solutionLink: "https://scratch.mit.edu/projects/357453140/",
					content: `1. Program the butterfly to count from 1 to 50.
2. If the number is a multiple of 3, instead of saying the number, make the butterfly say Fizz!
3. If the number is a multiple of 5, instead of saying the number, make the butterfly say Buzz!
4. If the number is a multiple of 3 and 5, instead of saying the number (or any other word), make the butterfly say Fizzbuzz!
The first few numbers in the sequence are: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz...
Finally, share the project!
View CS Training's Code`
				}
			],
			supplementalProjects: [
				{
					title: "GM6 Supplemental Project 1: Times Tables",
					projectLink: "https://scratch.mit.edu/projects/338508588/",
					solutionLink: "https://scratch.mit.edu/projects/338505545/",
					content: `Let\'s test how well Scratch knows his times tables!
1. Start by asking the user which number they want to know the multiples of.
2. Create a variable to keep track of what we will be multiplying by and set it to 1.
3. Say the product of the user\'s answer and our variable, and then increase our variable by 1. Repeat this to get Scratch to say the first ten multiples!
Challenge: Have Scratch also ask the user how many multiples the user wants to hear, and update your code accordingly.`
				},
				{
					title: "GM6 Supplemental Project 2: Stamping with Dotty",
					projectLink: "https://scratch.mit.edu/projects/341759115",
					solutionLink: "https://scratch.mit.edu/projects/338501835/",
					content: `Help Dotty graph the absolute value function!
1. When the green flag is clicked, make Dotty go to the center of the screen and ask what x coordinate she should go to.
2. First, change her x-coordinate to the user\'s answer, then change her y-coordinate to the absolute value of the answer (hint: this is a mathematical operator).
3. Make her say what her new coordinates are and then leave a stamp with the pen tool.
4. Repeat this code 10 times so that we graph 10 points of the function.
5. Next, make Dotty go to (-180,180), put the pen down, and then repeatedly increase the x position by 1 and update the y position to be the absolute value of the x position.`
				}
			]
		},
		{
			title: "GM7 Lists",
			curriculum: [
				{
					title: "Lists",
					content: `Earlier, we learned about strings, which are a way to put single letters and symbols together and store them in variables. What if we wanted to store a whole bunch of different numbers or words together at once? We can store those kinds of things in another type of variable, called a list.
In real life, what might you put into a list? For example: groceries, your favorite sports, places you've lived, the names of your family members.
In programming, we put items into lists so that we can conveniently look through them in our programs!
Create a new Scratch project. Using this project as a rough guide, show the how to create a list, add elements to a list, get the length of a list, and delete of all a list.
View CS Training's Code`
				},
				{
					title: "GM7 Project 1: Bucket List",
					projectLink: "https://scratch.mit.edu/projects/308826506/",
					solutionLink: "https://scratch.mit.edu/projects/308824008/",
					content: `Have you ever heard of a “bucket list”? It\'s a list of things you want to do in life some day! Let\'s make a program that stores those things in a list, and then repeats it back to us.
1. When the green flag is clicked, have the cat ask, “Tell me 5 things on your bucket list!”
2. Program the cat to repeat this five times, adding the user's response to the list each time.
3. Now that the list is complete, have the cat loop through the list and repeat each bucket list item back to us.
Challenge: Change the code so that instead of asking for five items, the cat will keep asking for new things to put on the list until the user types “stop."
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM7 Project 2: List Practice",
					projectLink: "https://scratch.mit.edu/projects/315090026/",
					solutionLink: "https://scratch.mit.edu/projects/315051160/",
					content: `1. When the spacebar is pressed, make the cat ask, “What number do you want to add to the list?” Add the number the user enters to the list.
2. When the green flag is clicked, delete everything in the list.
3. When the 1 key is pressed, program the cat to read the list normally, saying each number in the list for 1 second.
4. When the 2 key is pressed, program the cat to read each number in the list doubled.
5. When the 3 key is pressed, program the cat to read the list backwards.
6. When the 4 key is pressed, program the cat to read each number and then whether the number is odd or even (e.g.: “1, Odd, 14, Even,...”).
Say every other number in the list
Say every number in the list, multiplied by 10
Say each number and then turn that many degrees to the right
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM7 Project 3: Music Memory",
					projectLink: "https://scratch.mit.edu/projects/309658040/",
					solutionLink: "https://scratch.mit.edu/projects/309653930/",
					content: `How good is your memory? The keyboard will play a series of notes, and you have to repeat them back correctly!
1. Make the keyboard introduce the game and say “Ready... Set... Go!”
2. Program the keyboard to say and play 3 random notes, adding these notes to a "solution" list.
3. Ask the user to type in their note guesses, one note at a time, adding these notes to a "guess" list.
4. If an incorrect note is typed in, game over!
5. If the user types in all the correct notes, make the game start over with the keyboard playing one more note than last time.
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM7 Supplemental Project 1: Multiple Magic",
					projectLink: "https://scratch.mit.edu/projects/337820507",
					solutionLink: "https://scratch.mit.edu/projects/337817856",
					content: `Build a game for yourself to test how quickly you can calculate multiples of a number!
1. When the green flag is pressed, create a variable and set it to a random number between 1 and 10. This will be the number we want multiples of.
2. Make a list to keep track of which multiples the player has entered, and a variable to keep track of their score.
3. Have the wizard introduce the game and then start asking for multiples of your number continuously.
4. Check if their answer is a multiple of that number, and also check if this multiple has already been entered. Play a noise, update the score, and update the list accordingly, depending on whether their guess counts toward their score.
5. It would be more challenging if this game were timed! Create a timer variable and give the user 30 seconds to play the game.`
				},
				{
					title: "GM7 Supplemental Project 2: Wheel of Fortune",
					projectLink: "https://scratch.mit.edu/projects/340691786",
					solutionLink: "https://scratch.mit.edu/projects/342643080",
					content: `Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses to guess every letter of the secret word.
1. Construct a word bank using a list, from which the computer will choose a random word of at the beginning of each game.
2. Once the secret word is decided, add all the letters of the word to a new list and count the total number of unique letters in the word. Use this variable to keep track of the total number of letters the user needs to guess correctly. As you are adding the letters, make sure you don't add the same letter twice.
3. Ask the user to guess a letter. If they guess a letter that is in the secret word (and they have not already guessed this letter), add this letter to the guess list and and update the variable you are using to keep track of how many correct guesses the user has made.
4. Allow the user a certain number of guesses to win the game (for example, the length of the word, plus 5).
5. The user wins the game if they have correctly guessed all of the letters in the word, and they lose if they run out of guesses!`
				}
			]
		},
		{
			title: "GM8 Functions",
			curriculum: [
				{
					title: "Functions",
					content: `We're going to learn how to make our own custom blocks in Scratch! When we make a block, we make a special set of instructions that have a name and can take in some specific inputs. If we want the sprite to use the instructions, we just use that new block. This custom block we create is called a function.
Using this project as a rough guide, show the the My Blocks section and guide them through creating and using an adding block like the one in the example. We can name the function with the label text, and choose what kind of information we can put into the function (e.g. numbers, words, conditions).
It is particularly important the the understands the difference between defining a function (or custom block) with the given inputs, and using that function in our code with specific inputs.
Making our own blocks can help us make our code look more organized. For example, in the Music Memory game, we could have divided our code up into functions to make it a bit easier to read! You may choose to work through editing the Music Memory game to simplify it with functions now or later, like in this project.
View CS Training's Code`
				},
				{
					title: "GM8 Project 1: My First Functions",
					projectLink: "https://scratch.mit.edu/projects/315773207",
					solutionLink: "https://scratch.mit.edu/projects/315770711/",
					content: `1. Create a function that makes the cat speak a given number of times (the input will be the number of times).
2. Create a function that makes the cat draw a square of a given size (the input will be the side length of the square).
3. Create a function that makes the cat jump (the input will be the height of the jump).
4. Create a function that makes the cat teleport by making the cat spin in a circle, go to a random spot with a sound effect, and then spin again (no inputs).
5. When the green flag is clicked, use these functions to make the cat jump 100 steps, speak 3 times, draw a square of size 100, teleport, and then draw another square.
Finally, share the project!
View CS Training's Code`
				},
				{
					title: "GM8 Project 2: Talent Show II",
					projectLink: "https://scratch.mit.edu/projects/309293557",
					solutionLink: "https://scratch.mit.edu/projects/309287208/",
					content: `Our talented cat is at it again, ready to perform his many talents! Create functions for each of his talents, so that the user can have some input into his performance.
1. Create functions for each of the cat's talents, such as playing a song with an inputted number of notes, or spinning in the air an inputted number of times. Create at least four talents of your choosing.
2. When the green flag is clicked, make the cat start his talent show. He should ask the user which talent to perform, and then he should ask the user for the input that function needs.
Finally, share the project!
View CS Training's Code`
				}
			],
			supplementalProjects: [
				{
					title: "GM8 Supplemental Project 1: Extra Functions",
					projectLink: "https://scratch.mit.edu/projects/339918479",
					solutionLink: "https://scratch.mit.edu/projects/339602908",
					content: `1. Write a function that draws a shape! It should take in as input the number of sides and the size of each side. To calculate how many degrees to turn after drawing each side, use 360 divided by the number of sides.
2. Write a function that takes in a starting number and an ending number, and make the function count from a starting number up to (and including) an ending number. (Challenge: If the ending number is smaller than the starting number, make it count down from the starting number.)
3. Write a function that takes in two numbers and reports the result of addition, subtraction, multiplication, and division with the two numbers. (Challenge: calculate the average of the two numbers as well.)
4. Write a function that takes in a number and says the first 10 multiples of that number. (Challenge: take in a number of multiples as another input, and say that many multiples of the number.)`
				},
				{
					title: "GM8 Supplemental Project 2: Rock Paper Scissors",
					projectLink: "https://scratch.mit.edu/projects/339972570/",
					solutionLink: "https://scratch.mit.edu/projects/339731727/",
					content: `Let\'s play rock, paper, scissors!
1. Take a look at the final project and then look at the code provided for you. All of the pink function blocks are the functions you need to write!
2. The “get computer answer” function should randomly pick rock, paper, or scissors and store it in a variable. Try using a list to do this!
3. The “get player answer” function will ask the player for rock, paper, or scissors and store it in a variable. If the user inputs something else, make sure to keep asking until they input either rock, paper, or scissors.
4. The “find winner” function needs to look at the two different answers and determines the winner. Remember, rock beats scissors, scissors beat paper, and paper beats rock!
5. You might also find it helpful to write functions for player wins, computer wins, and tie.`
				}
			]
		},
		{
			title: "GM9 Fish Food",
			curriculum: [
				{
					title: "GM9 Project 1: Fish Food",
					solutionLink: "https://scratch.mit.edu/projects/468227197",
					content: `Play through the demo and identify the different elements of the game to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a blank Scratch project and add a comment in the project to write out the different steps of what we will need to code. This is created from a blank project in preparation for the Master Project. Set up custom sprites and backdrops to create Fish Food.
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM9 Supplemental Project 1: Platformer Pal",
					projectLink: "https://scratch.mit.edu/projects/343651574/",
					solutionLink: "https://scratch.mit.edu/projects/343348430/",
					content: `Help our pal collect the magic keys and to get through the levels of this platformer!
1. Take a look at the backdrops for each level and notice how they will all involve different code. Let\'s make message broadcasts for each level so that we can organize our code a little bit better.
2. When the green flag is clicked, switch the backdrop to Level 1 and broadcast Level 1.
3. When Pal receives Level 1, we should tell it where to go on the stage. Now, we need a forever loop that tells Pal to stay on the ground and move with the arrow keys. It might help to separate this code into functions.
4. To make Pal stay on the ground, we want it to move down if it\'s not touching green. (Hint: try using a "repeat until" block.)
5. Pal should move left and right using the left and right arrow keys.
6. If the user presses the up arrow key, make Pal jump. To make Pal jump, increase its y position and let it move left and right. (Challenge: Try to make it so Pal can\'t jump through platforms.)
7. Choose where you want the magical key to be placed for Level 1, and tell it to go there when it receives the message broadcast.
8. When Pal gets to the key, switch to the next backdrop, broadcast the next level, and stop the Level 1 script.
9. Repeat all of the same steps for Level 2, but this time make sure that when Pal touches the brown pitfall, it falls down and broadcasts to restart the level.
10. Repeat all of the same steps for Level 3, but this time make sure to tell the teleporters where to go, and make Pal go to teleporter out when it touches teleporter in.
11. When the user collects the key on Level 3, broadcast the end of the game and switch the backdrop.
12. Add any sounds or other special effects you want to the game!`
				}
			]
		},
		{
			title: "GM10 Treasure Cave",
			curriculum: [
				{
					title: "GM10 Project 1: Treasure Cave",
					projectLink: "https://scratch.mit.edu/projects/315336651/",
					solutionLink: "https://scratch.mit.edu/projects/309661591/",
					content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.
Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GM10 Supplemental Project 1: Fruit Ninja",
					projectLink: "https://scratch.mit.edu/projects/346953687/",
					solutionLink: "https://scratch.mit.edu/projects/348994271/",
					content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
				Create a comment in the project to write out the different steps of what we will need to code.`
				}
			]
		},
		{
			title: "GM11 Master Project",
			curriculum: [
				{
					title: "GM11 Project 1: Master Project",
					content: `For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate. Make sure to include lists and functions in the project.
				Once there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
				Create a new Scratch project and add a comment to write out the different steps of what we will need to code.
				Program the game as independently as possible! As described above, this may take approximately two classes to complete.`
				},
				{
					title: "Master Project Presentation",
					content: `Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.
				Another way to celebrate the project is by sharing it with friends or family.`
				},
				{
					title: "Course Recap",
					content: `We've learned a lot over these past few months! Can you recap the different topics we learned in this course?
				Help come up with a list of coding concepts they\'ve learned through Scratch. It might be helpful to look back at the module titles or code from previous projects they\'ve created.
				If anything is missing, make sure the list includes conditionals, XY coordinates, variables, event listeners, loops, and functions.
				Great job! Many of these concepts from Scratch will be used in Python as well. Let's take a closer look at the next course.
				Discuss the next course: Python Level 1. In Python Level 1, we will learn our first programming language that requires us to fully type out our code instead of using blocks! However, we are going to use a lot of the same concepts we've already become comfortable with in Scratch.
				View CS Training's Code`
				},
				{
					title: "Optional Extra Practice: Typing Games",
					content: `This optional section is for those transitioning from Scratch into Python Level 1.
				The purpose is to prepare for block-based to text-based coding and to assess typing and computer literacy skills.
				If someone is advanced, has strong typing skills, or is not taking a text based programming language as their next course, you may skip this activity at your discretion.
				These typing games are optional and don\'t all need to be completed. Choose games that are interesting and move on once there has been 15-20 minutes of practice, or if already a strong typist.
				Feel free to skip to the intermediate typing games if older than 6.
				One of the biggest differences between Python and Scratch is that we\'ll need to type our code out rather than using blocks. Let\'s play a few games to practice typing as we prepare ourselves to write Python code.
				Beginner Typing Games:
				Practice with the Keyboard - Typing Letters
				Navigate to https://scratch.mit.edu/projects/214833806/and practice typing letters. Try to reach 10 points!
				Practice with the Keyboard - Typing Numbers
				Navigate to https://scratch.mit.edu/projects/214828609/ and practice typing numbers. Try to reach 10 points!
				Practice with the Keyboard - Typing Letters Race
				Navigate to https://www.nitrotype.com/. See if you can type letters faster than your opponent and win the race.
				Intermediate Typing Games
				Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
				Ghost Typing: https://www.abcya.com/games/ghost_typing
				Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice
				Advanced Typing Games
				Typing Rocket: https://www.abcya.com/games/typing_rocket
				Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer
				`
				}
			],
			supplementalProjects: []
		}
	]
};
