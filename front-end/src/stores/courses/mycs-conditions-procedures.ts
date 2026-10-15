import type { MyCsLesson } from "./mycs-types";

export const myCsConditionsProcedures: MyCsLesson[] = [
	{
		id: "mycs-conditional-cards",
		title: "Conditional Cards",
		sourcePath: "/unit3/3-1",
		destination: "s1-conditions",
		content: `**Model:** Say a rule such as “If the card is red, clap.” Predict what happens for a red card and a black card before drawing.

**Build:** Work with a partner. Write one IF rule, then an IF–ELSE rule with a different action for each outcome. Take turns drawing cards and following the written instructions exactly.

**Hard:** Replace the card test with a die comparison. Change just the comparison and predict which rolls follow each branch.

**Check:** Try an example that makes each condition true and false. Explain which action belongs to which branch and what the simple IF does when its condition is false.`
	},
	{
		id: "mycs-race-to-finish",
		title: "Race to the Finish: Plan and Build",
		sourcePath: "/unit3/3-2",
		relatedSourcePaths: ["/unit3/3-3"],
		destination: "s1-conditions",
		starter: "blank",
		content: `**Model:** Sketch two racers and a finish line. Describe the starting positions, each player's key and the winning condition in plain-language steps before coding.

**Build:** Draw original racers, name them clearly and make the finish line a separate sprite. Add movement controls, a repeated finish check and a visible winning reaction. The green flag restores the starting scene.

**Hard:** Add a third racer or an animation at the finish. If your finish line is painted on the backdrop instead, explain which sensing test must change.

**Check:** Race from both starting positions, reach the finish and restart twice. Ask a partner to play using only your instructions, then improve one confusing detail.`
	},
	{
		id: "mycs-hover-reactions",
		title: "Hover Reactions",
		sourcePath: "/unit3/3-4",
		destination: "s1-conditions",
		starter: "click-reactions",
		content: `**Model:** Compare clicking a robot with moving the pointer over it without clicking. These are different inputs; predict which one starts the supplied click script.

**Build:** Keep that example. Give another sprite a forever loop containing IF–ELSE. When it touches the mouse pointer, show one costume, effect or message; otherwise restore its normal appearance.

**Hard:** Add a second sprite with its own two reactions. Make each response understandable without relying only on color.

**Check:** Move the pointer onto and away from each sprite several times without clicking. Demonstrate both branches, then press Stop and restart. Explain why checking only once on the flag would miss later pointer movement.`
	},
	{
		id: "mycs-branching-stage",
		title: "Two Sides of the Stage",
		sourcePath: "/unit3/3-7",
		destination: "s2-conditions",
		starter: "blank",
		content: `**Model:** Find a pointed Boolean reporter and place it in an IF–ELSE condition. Compare its true-or-false result with the number reported by x position.

**Build:** Move a sprite left and right. Repeatedly choose one backdrop when x is greater than zero and another otherwise. Write down your prediction for a negative x, zero and a positive x before testing.

**Hard:** Express the same two-way choice using NOT. Compare the result rather than assuming different-looking scripts must behave differently.

**Check:** Test all three positions and restart. Trace which branch runs each time. Explain what happens at the boundary and why both possible outcomes need deliberate behavior.`
	},
	{
		id: "mycs-line-follower",
		title: "Line-Follower Simulation",
		sourcePath: "/unit3/3-8",
		destination: "s2-simulation",
		starter: "blank",
		content: `**Model:** Draw a thick black path and an original small sprite with distinct colored marks at its front, left and right. Predict which mark touches the line on a straight section or corner.

**Build:** Write a rule table for each mark touching black and for the Stage edge. Use color-is-touching-color reporters and the eyedropper. In a loop, adjust direction from the sensed case, then move a small step. Reset position and direction on the flag.

**Hard:** Add a tighter-cornered backdrop. Compare independent IF tests with nested IF–ELSE so only one movement rule runs in each iteration.

**Check:** Test straight sections, corners, edges and a changed path. Explain a failure and repair. Identify the environmental input that changes the simulated route.`
	},
	{
		id: "mycs-five-slide-story",
		title: "Five-Slide Story",
		sourcePath: "/unit3/3-9",
		destination: "s1-dialogue",
		starter: "scene-switch",
		content: `**Model:** Plan five original backdrops that tell a short fictional story. Describe what Previous and Next should do at the first slide, middle slides and last slide.

**Build:** Add clearly named next and previous broadcasts. Use conditions to prevent moving beyond the endpoints. Give one character a check that shows it only on its chosen backdrop and hides it elsewhere.

**Hard:** Let several sprites respond differently to the same named message. Add a visible instruction or endpoint message without overlapping dialogue.

**Check:** Visit every slide, try both controls at the endpoints and restart. Explain which scripts receive each message and why a sprite does not react to unrelated broadcasts.`
	},
	{
		id: "mycs-maze-planning",
		title: "Maze Design: Plan and Controls",
		sourcePath: "/maze/4-1",
		destination: "s1-conditions",
		starter: "maze-reset",
		content: `**Model:** Inspect the working maze starter, then sketch a different route. Write a plan for the player's controls, start, goal and wall reaction before changing anything.

**Build:** Make a second version with an original maze backdrop and clearly named hero and goal. Keep wall and path colors distinct. Verify four-way movement before adding another rule. Backdrop art belongs on the Stage, not on the hero.

**Hard:** Compare key-pressed scripts with continuous key sensing. Choose controls that feel understandable and explain your choice.

**Check:** Reach every intended corridor with your hero's current size. Test up, down, left, right and restart. Ask a partner to identify the goal from your instructions.`
	},
	{
		id: "mycs-maze-collision",
		title: "Maze Design: Repeated Collision Checks",
		sourcePath: "/maze/4-2",
		destination: "s1-conditions",
		content: `**Model:** Reopen your saved maze and start away from a wall. Predict why a wall test that runs only once on the flag would fail when the hero reaches the wall later.

**Build:** Keep the existing controls and put wall sensing in a repeated check. Use the eyedropper to choose the exact wall color. Give goal contact its own clear response rather than confusing it with wall contact.

**Hard:** Compare waiting until a condition becomes true with repeatedly checking IF. Explain what other scripts can do while one script waits.

**Check:** Test open path, each wall direction and the goal. Restart after each outcome. Demonstrate that the collision rule still works long after the initial flag event.`
	},
	{
		id: "mycs-maze-treasure",
		title: "Maze Design: Treasure and Score",
		sourcePath: "/maze/4-3",
		destination: "s1-variables",
		content: `**Model:** Add one original treasure sprite to your saved maze. Decide what the player should see when it is collected before introducing a score.

**Build:** Make that treasure disappear when touched and return on the flag. Once this works, reset Score to zero and increase it once per collected treasure. Duplicate the working treasure to add more items.

**Hard:** Build up to five treasures. Allow the ending only when the hero touches the goal AND has collected them all. Keep a clear message for unfinished collection.

**Check:** Stay on a treasure's position and confirm it cannot score repeatedly. Collect in a different order, try reaching the goal early and restart. Explain which event changes the variable.`
	},
	{
		id: "mycs-maze-challenges",
		title: "Maze Design: Obstacles and Time",
		sourcePath: "/maze/4-4",
		destination: "s1-variables",
		content: `**Model:** Reopen your saved maze and decide whether a patrolling obstacle, countdown or both would make its rules more interesting. Write the win and lose conditions first.

**Build:** Add one moving obstacle with a chosen bounce or wrap rule. Create a countdown variable, reset it on the flag and reduce it at a readable interval. Make the ending stop the relevant gameplay scripts.

**Hard:** Add another level using a named broadcast. Hide the old-level sprites, show the next-level sprites and restore the first level on the flag.

**Check:** Test wall contact, obstacle contact, reaching the goal and time reaching zero. Restart after each ending. Explain how every position, visible sprite and variable returns to its initial state.`
	},
	{
		id: "mycs-boolean-cards",
		title: "Boolean Rules: AND, OR and NOT",
		sourcePath: "/unit4/4-1",
		destination: "s2-conditions",
		content: `**Model:** Use two neutral card properties, such as red and picture card. Predict a combined rule before revealing a card; avoid rules that ask classmates for personal information.

**Build:** Write an AND rule, an OR rule and a NOT rule. With a partner, find examples where neither property, only the first, only the second and both are true. Record each prediction and observation.

**Hard:** Add a repeated scoring rule for a short card game. Exchange rules with another pair without explaining them aloud first.

**Check:** Explain how OR behaves when both properties are true. Point to a test that distinguishes AND from OR, then describe exactly which condition NOT reverses.`
	},
	{
		id: "mycs-rocket-safety",
		title: "Rocket Launch Safety Gate",
		sourcePath: "/unit4/4-2-rocket-ship",
		destination: "s2-conditions",
		starter: "blank",
		content: `**Model:** Draw an original rocket, pilot and safety switch. State the rule: the rocket launches only when the pilot is ready AND the safety switch is on.

**Build:** Use touching-Pilot sensing and a clicked safety switch's stored state. Make those conditions work separately before combining them. Give launch an obvious reaction, explain a blocked launch and reset positions and safety state on the flag.

**Hard:** Add a NOT condition such as “not under repair.” Compare an experimental OR version, then restore the intended safety rule.

**Check:** Test all four ready/on combinations, not just a successful launch. Record the expected and observed behavior. Explain why allowing either requirement alone would change the game's rule.`
	},
	{
		id: "mycs-scripted-chat",
		title: "A Scripted Conversation",
		sourcePath: "/unit4/4-3-lets-chat",
		destination: "s2-strings",
		starter: "blank",
		content: `**Model:** Plan a fictional character that asks for a pretend animal or color. Explain that this is a local scripted program, not a person or an intelligent assistant.

**Build:** Use ask and answer, then join the response into a sentence. Ask a second neutral question and observe which answer is currently stored. Keep any earlier response you need in a clearly named variable.

**Hard:** Use repeat until to accept one of a few preset choices, with a clear retry prompt. Do not ask for names, contact details, secrets or real personal information.

**Check:** Try an allowed choice and an unexpected response. Restart and verify old answers are not accidentally reused. Identify the exact rules behind the apparent conversation.`
	},
	{
		id: "mycs-local-phrase-lookup",
		title: "Local Phrase Lookup",
		sourcePath: "/unit4/4-4-translator",
		destination: "s2-strings",
		starter: "blank",
		content: `**Model:** This is an offline adaptation of the translator idea, not an automatic translation or speech service. Make a short table of fixed phrases and carefully checked translations.

**Build:** Ask the user to choose one phrase from your table. Compare that choice and display its stored partner. For any other input, explain that your program only knows the listed phrases. Keep all choices and responses inside the project.

**Hard:** Store corresponding phrases in two lists and retrieve both using the same index. Add clear input validation.

**Check:** Test every listed phrase and an unknown phrase. Explain the program's limits. Do not enable network Translate or Text-to-Speech extensions for this activity; their service-dependent version still needs separate review.`
	},
	{
		id: "mycs-variable-envelopes",
		title: "Variable Envelopes",
		sourcePath: "/unit5/5-1",
		destination: "s1-variables",
		content: `**Model:** Label three envelopes Animal, Place and Food. Put one original word card in each and use the stored words in a sentence your group writes.

**Build:** Replace the Animal card with a different word, removing the old card first. Read the same sentence frame again. Repeat with another envelope and notice what stays the same and what changes.

**Hard:** Add a number envelope for a pretend game score. Compare replacing its card with adding one to the current number; these are different operations.

**Check:** Explain the difference between a variable's name and its current value. Demonstrate that updating one envelope changes only that part of the sentence and does not keep both old and new values.`
	},
	{
		id: "mycs-original-word-story",
		title: "An Original Fill-in-the-Blank Story",
		sourcePath: "/unit5/5-2",
		destination: "s1-variables",
		starter: "blank",
		content: `**Model:** Write two short original fictional sentences and replace two words with general labels such as Animal and Action. Do not copy a published story, song lyric or commercial activity sheet.

**Build:** Ask for one pretend word, immediately store answer in a named variable, then ask for the second word and store it separately. Use join blocks to tell the completed story.

**Hard:** Add a third blank or offer preset word choices. Keep each stored value separate from the answer reporter, which changes after every question.

**Check:** Enter two visibly different words and confirm both survive in the final story. Run again with new inputs and explain how one sentence frame can create many outcomes.`
	},
	{
		id: "mycs-game-variable-choice",
		title: "Improve a Game with a Variable",
		sourcePath: "/unit5/5-3",
		destination: "s1-variables",
		content: `**Model:** Play your saved local game and name one rule that a variable could improve: score, lives, time remaining or movement speed. Explain why that change helps the player.

**Build:** Add one clearly named variable and reset it on the flag. Connect its change to a specific gameplay event. For a catching game, count catches; for a clicking game, count valid clicks; for a maze, track collected treasure.

**Hard:** Add a second variable and a visible ending message. Make gameplay stop accepting points after the ending.

**Check:** Predict a short sequence of actions and its final value, then test it. Check repeated contact, the ending boundary and restarting. Keep the earlier working game as a separate saved file.`
	},
	{
		id: "mycs-multiplication-game",
		title: "Multiplication Game",
		sourcePath: "/unit5/5-4",
		destination: "s2-math",
		starter: "blank",
		content: `**Model:** Plan one round in plain language: choose two numbers, form the question, get an answer, compare it with the product and report the result. Choose a small number range you can check accurately.

**Build:** Store the two random numbers and expected product in named variables. Ask the question using join, compare answer with the expected value and update Score only for the intended result. Make one round work before adding a loop.

**Hard:** Ask several questions and display a final score. Explain how changing the number range changes difficulty without rewriting the whole program.

**Check:** Test a correct answer, a wrong answer, a fresh question and restart. Explain why the saved product must match the numbers currently shown.`
	},
	{
		id: "mycs-scrolling-flight",
		title: "Scrolling Flight: Scenery and Lives",
		sourcePath: "/unit5/5-6",
		relatedSourcePaths: ["/unit5/5-7"],
		destination: "s2-master",
		starter: "blank",
		content: `**Model:** Sketch a flight scene where the hero stays at one horizontal position while original building and cloud sprites move left. Predict how this creates the appearance of travel.

**Build:** First make scenery wrap from left to right, with slower clouds and changing building costumes. Then add gravity, a jump key and lives or health. Choose a clear collision response and ending.

**Hard:** Add a short protected interval after a hit so one sustained contact cannot remove every life. Explain when to stop one script versus all gameplay.

**Check:** Watch several scenery cycles, test jumping and collision, reach the ending and restart. Confirm all scenery, hero position and lives reset. Save before each new feature.`
	},
	{
		id: "mycs-shopping-list",
		title: "Shopping List",
		sourcePath: "/unit5/5-8",
		destination: "s2-lists",
		starter: "blank",
		content: `**Model:** Compare a variable holding one pretend item with a list holding several. Number the entries and predict which item a given index selects.

**Build:** Add a mode variable selected by Add and Remove buttons. Clicking an item adds or removes it according to that mode. Get one original item working, then three more. Clicking Cart reports the list and its length. Reset the list and mode on the flag.

**Hard:** Give items pretend prices and begin with ten credits. A valid addition spends credits; an actual removal returns that item's price. Never refund an absent item.

**Check:** Add, remove, try an absent item and restart. Verify duplicates and remaining credits. Explain how deletion shifts later indices.`
	},
	{
		id: "mycs-paired-list-quiz",
		title: "Paired-List Quiz",
		sourcePath: "/unit5/5-9",
		destination: "s2-lists",
		starter: "blank",
		content: `**Model:** Write three original questions and their checked answers in two numbered columns. Explain why question 2 must match answer 2 rather than just any answer.

**Build:** Create Questions and Answers lists with matching lengths and order. Use one index to retrieve a question and its expected answer. Ask the question, compare the response and give clear feedback. Make one round work before cycling through the lists.

**Hard:** Add a score or a random valid index. Keep the paired data together when editing; do not copy classmates' projects or personal quiz content.

**Check:** Test every question, an incorrect response and restart. Deliberately inspect list lengths and index boundaries. Explain how a mismatched index would change the result.`
	},
	{
		id: "mycs-procedure-recipes",
		title: "Reusable Command Recipes",
		sourcePath: "/unit6/6-1",
		destination: "s2-functions",
		content: `**Model:** Write a short sequence of safe desk actions or paper-cup moves. Give that sequence a descriptive name and have a partner perform it when you call the name.

**Build:** Create a longer plan that calls your named sequence twice. Trace entering the sequence, following its steps and returning to the next instruction. Compare this with writing out every step twice.

**Hard:** Add an input such as a repetition count. Demonstrate the same named procedure with two different supplied values.

**Check:** Let another pair follow only your written instructions. Identify an unclear step and revise it. Explain which part defines the reusable procedure and which parts call it.`
	},
	{
		id: "mycs-stamp-art",
		title: "Stamp Art",
		sourcePath: "/unit6/6-2",
		destination: "s2-functions",
		starter: "blank",
		content: `**Model:** Add the Pen extension and stamp an original costume once. Move the sprite away: the stamped pixels remain, but they are not a new programmable sprite.

**Build:** Reset with erase all, then repeat a short move, turn and stamp sequence to make a pattern. Change one value at a time and compare the results. A turn near 137.5 degrees can produce an interesting spiral arrangement.

**Hard:** Put the repeated drawing sequence in a named custom block, or make a pointer-following stamp brush with a small wait.

**Check:** Explain the difference between sprite, stamp and clone. Stop and restart twice; old drawings should clear. If you added a custom block, demonstrate that editing its definition changes every later call to it.`
	},
	{
		id: "mycs-animation-procedures",
		title: "Jump and Spin Procedures",
		sourcePath: "/unit6/6-3",
		relatedSourcePaths: ["/unit6/6-4"],
		destination: "s2-functions",
		starter: "blank",
		content: `**Model:** Make a short motion sequence, then identify the actions you would otherwise copy to repeat it. Give the reusable behavior a meaningful custom-block name.

**Build:** Create Jump with a height input and Spin with a degrees input. Make each work once, then create an original animation using at least four calls with varied inputs. Trace where execution returns after each call.

**Hard:** Add another input or a new animation cycle. Compare calling a custom block inside one sprite with broadcasting a message to several sprites.

**Check:** Point to the parameter in the definition and the argument in a call. Test two values, predictable starting positions and restart. Explain one improvement that requires editing the procedure only once.`
	},
	{
		id: "mycs-pen-procedure-art",
		title: "Pen Art with a Shape Procedure",
		sourcePath: "/unit6/6-6",
		destination: "s2-functions",
		starter: "blank",
		content: `**Model:** Add the current Pen extension. Try pen down, a movement, pen up and erase all. Observe that moving with the pen raised does not connect two separate drawings.

**Build:** Draw one regular polygon, then move its code into a named custom block without inputs. Call that block repeatedly, turning between calls to create a ring of shapes. Choose original colors, line widths and spacing.

**Hard:** Use Space to draw and arrows to reposition with the pen raised. Change the regular polygon, predicting its exterior turn from 360 divided by the number of sides.

**Check:** Explain the inner shape repetition and outer pattern repetition. Restart to confirm old marks clear and the pen begins in a known position and state.`
	},
	{
		id: "mycs-parameter-shape-maker",
		title: "Shape Maker with Inputs",
		sourcePath: "/unit6/6-7",
		relatedSourcePaths: ["/unit6/6-8"],
		destination: "s2-functions",
		starter: "blank",
		content: `**Model:** Compare drawing a triangle and square. Identify the changing side count and the repeated movement pattern they can share.

**Build:** Define MakeShape with a sides input. Repeat that many times, moving a fixed distance and turning 360 divided by sides. Ask for a whole-number side count from three to eight; validate before drawing.

**Hard:** Add a list of shape names for your allowed counts. Map each side count to the correct list index and display the name. Add a side-length input if the core check works.

**Check:** Test several valid shapes plus zero, a fraction and an out-of-range response. Trace the argument entering the parameter. Explain why invalid input must not reach division or list lookup.`
	},
	{
		id: "mycs-generative-art",
		title: "Rule-Based Generative Art",
		sourcePath: "/unit6/6-9",
		destination: "s2-functions",
		starter: "blank",
		content: `**Model:** Choose an original drawing rule and identify which parts stay fixed and which may vary. Generative art here means code following your rules, not an online image service.

**Build:** Create a drawing procedure using the Pen extension. Give it a bounded input such as size or turn amount, then call it with random values inside your chosen limits. Use a finite repeat count so the result remains easy to inspect.

**Hard:** Coordinate two drawing scripts and explain which actions can run in parallel. Keep each sprite's reset and pen behavior deliberate.

**Check:** Run twice and describe both the shared rule and differing outcomes. Stop, clear and restart. Explain how your parameter limits keep the artwork within the intended design.`
	},
	{
		id: "mycs-top-five-list",
		title: "Top Five: Store and Present a List",
		sourcePath: "/unit5/5-8",
		sourceSite: "student",
		destination: "s2-lists",
		starter: "blank",
		content: `**Model:** Choose a fictional category such as space vehicles or imaginary animals. Write five original entries and number them in the order you want to present them.

**Build:** Store those entries in a list. Have a sprite introduce the category and present one indexed item at a time. Keep the list contents separate from the script that displays them, then replace one item without rewriting the whole presentation.

**Hard:** Let the user choose a valid position or present the entries in reverse order. Explain what your index variable means.

**Check:** Verify the first entry, last entry and every position between them. Try an invalid choice and restart. Explain how the same presentation script can work with a different original list.`
	},
	{
		id: "mycs-conditions-checkpoint-one",
		title: "Checkpoint: Conditions and Rechecking",
		sourcePath: "/unit3/3-5-assessments",
		destination: "s1-conditions",
		content: `**Model:** Choose a saved race, hover or maze project. Write a small table containing a condition, when it is checked and the intended visible response.

**Build:** Test one true case and one false case. Then change the scene after startup and see whether the condition is still being checked. Record a prediction, observation and any repair in your own words.

**Hard:** Ask a partner to change one harmless value in a second copy. Diagnose the difference without replacing all the code.

**Check:** Explain an event, a repeated check and a branch in your project. Demonstrate restarting. Give one specific improvement suggestion to a partner, then revise your project using their feedback.`
	},
	{
		id: "mycs-conditions-checkpoint-two",
		title: "Checkpoint: Branches, Boundaries and Messages",
		sourcePath: "/unit3/3-10-assessments",
		destination: "s2-conditions",
		content: `**Model:** Reopen your branching scene, slideshow or line-follower project. Identify an input boundary or transition that might reveal a bug.

**Build:** Write expected results for both branches and the boundary itself. Run those tests, then trace the blocks responsible for each observation. If messages are involved, list which sprites listen for the exact message name.

**Hard:** Compare two scripts that appear to express the same rule. Find a test that could distinguish them rather than judging only their appearance.

**Check:** Explain your condition's true-or-false value, the selected branch and the resulting action. Show a restart and one completed repair. Share the test strategy, not another learner's answers or project file.`
	},
	{
		id: "mycs-maze-checkpoint",
		title: "Checkpoint: Maze State and Restart",
		sourcePath: "/maze/4-5",
		destination: "s1-variables",
		content: `**Model:** Draw a table for your maze's start, normal play, wall contact and ending. Include hero position, treasure visibility and any score, lives or timer you added.

**Build:** Have a partner follow those scenarios using only your player instructions. Record any mismatch between the written rule and observed result. Fix one mismatch in a separate saved version.

**Hard:** Try reaching the goal before collecting everything, staying on a collectible and restarting immediately after losing. Explain why these are different tests.

**Check:** Demonstrate repeated collision checking and a complete green-flag reset. Explain the event that changes each variable. Give precise feedback about one confusing interaction, then show how you improved it.`
	},
	{
		id: "mycs-booleans-checkpoint",
		title: "Checkpoint: Compound Conditions and Input",
		sourcePath: "/unit4/4-5-assessments",
		destination: "s2-conditions",
		content: `**Model:** Choose a compound rule from your rocket or another saved project. Name its two component conditions without yet changing the code.

**Build:** Predict and test all four combinations of those conditions. Compare the written game rule with the observed behavior. If your project asks a question, also test an allowed response and an unexpected response.

**Hard:** Temporarily replace AND with OR in a copy. Find a case that exposes the difference, then restore the intended rule. Explain what NOT changes when added to one component.

**Check:** Trace the tested condition, chosen branch and visible result. Document one debugging step and ask a partner whether your instructions make the rule clear.`
	},
	{
		id: "mycs-variables-checkpoint-one",
		title: "Checkpoint: Values, Names and Updates",
		sourcePath: "/unit5/5-5",
		destination: "s1-variables",
		content: `**Model:** Pick a saved story or game and list its variables. Beside each name, write what the value represents and the initial value you expect.

**Build:** Predict a short sequence of inputs and variable changes. Run it, observing each update. For a story, check that a later answer does not overwrite a word you meant to save. For a game, check exactly which action earns a point.

**Hard:** Compare replacing a value with increasing it. Change one update in a copy and describe the resulting behavior before restoring it.

**Check:** Explain one variable's purpose, current value and reset. Demonstrate an unexpected input or repeated action, repair one problem and show the improved result to a partner.`
	},
	{
		id: "mycs-lists-checkpoint",
		title: "Checkpoint: Lists and Matching Indices",
		sourcePath: "/unit5/5-10",
		destination: "s2-lists",
		content: `**Model:** Reopen your shopping list, phrase table or paired-list quiz. Draw its stored entries with their current index numbers.

**Build:** Predict the effects of adding, removing or retrieving one item. Test the first and last valid positions and decide how your program should handle an invalid choice. For paired lists, verify corresponding items stay aligned.

**Hard:** Edit one list in a copy without updating its partner. Design a test that reveals the mismatch, then repair the data or validation.

**Check:** Explain why one variable and a list solve different storage problems. Demonstrate restart and one boundary test. Record the cause of a discovered bug and the evidence that your correction works.`
	},
	{
		id: "mycs-procedures-checkpoint-one",
		title: "Checkpoint: Procedure Calls and Flow",
		sourcePath: "/unit6/6-5",
		destination: "s2-functions",
		content: `**Model:** Choose a custom block from your animation or drawing project. Point to its definition and two places that call it.

**Build:** Trace a short script on paper: enter the call, follow the procedure, return and continue. Predict the visible outcome, run it and compare. Explain which repeated code the procedure replaces.

**Hard:** Call the block with two different arguments. Describe which parameter receives each value and what behavior should change. Repair an unclear name or duplicated sequence in a saved copy.

**Check:** Demonstrate a predictable restart and explain a case where editing the definition improves several calls. Ask a partner to follow your trace and identify one step that needs clearer documentation.`
	},
	{
		id: "mycs-procedures-checkpoint-two",
		title: "Checkpoint: Parameters and Robust Drawing",
		sourcePath: "/unit6/6-10",
		destination: "s2-functions",
		content: `**Model:** Reopen Shape Maker or your generative-art project. List its procedure inputs, acceptable values and reset behavior before adding another feature.

**Build:** Predict two valid calls and one invalid input. Test the calls and show how invalid input is rejected before drawing, division or list access. Trace the argument entering its parameter and the return to the calling script.

**Hard:** Add one useful parameter or compare a procedure with a broadcast. Explain the scope and purpose of each rather than assuming they are interchangeable.

**Check:** Stop, clear and restart twice. Explain which rules stay fixed and which outcomes vary. Present one repair with its test evidence and use a partner's feedback to improve the instructions.`
	}
];
