import type { MyCsLesson } from "./mycs-types";

export const myCsIntroEventsLoops: MyCsLesson[] = [
	{
		id: "mycs-why-cs",
		title: "Why CS Matters: Precise Instructions",
		sourcePath: "/unit0/0-1",
		destination: "s1-events",
		content: `**Model:** An algorithm is an ordered plan. A program expresses instructions a computer can execute. Compare “draw a shape” with “draw a square, then put a dot inside it.”

**Build:** Describe a small drawing without showing it. First, your partner follows without asking questions; repeat with clarifying questions allowed. Compare the drawings, improve an ambiguous instruction, then swap roles.

**Hard:** Choose something useful or creative you would like to make with code. Describe its input and what should happen.

**Check:** A second attempt follows your revised instructions more closely. Explain why precision and order matter.`
	},
	{
		id: "mycs-cup-code",
		title: "Cup Code: Write, Run and Repair",
		sourcePath: "/unit0/0-2",
		destination: "s1-events",
		content: `**Model:** A robot follows a limited instruction language rather than guessing your intention. Agree on symbols for picking up, moving and placing a cup.

**Build:** Draw or arrange a small target stack using cups or paper symbols. Write a sequence in your agreed language. Give the sequence, not the target, to a partner. Have your partner execute one instruction at a time, compare the result with the target, and repair one missing or incorrect step.

**Hard:** Design a different target that uses the same instruction language.

**Check:** Running the repaired sequence reaches the same target again. Point to where you encoded instructions and your partner decoded them.`
	},
	{
		id: "mycs-pair-programming",
		title: "Pair Programming: Two Useful Roles",
		sourcePath: "/unit0/0-4",
		destination: "s1-events",
		starter: "animate-word",
		content: `**Model:** The driver operates the keyboard and mouse. The navigator checks the plan, predicts the next action and notices mistakes. Both discuss decisions before changing code.

**Build:** Choose one small change in Animate Your Name. Agree on the expected result. One partner makes the change while the other describes how to test it. Run that test, then swap roles before making a second change.

**Hard:** Let your partner test the project using only the directions you wrote.

**Check:** Both partners can explain a change and its test. Name one thing you did well and one thing to improve. Discuss asking for help without taking over.`
	},
	{
		id: "mycs-growth-mindset",
		title: "Growth Mindset: Try a Different Approach",
		sourcePath: "/unit0/0-3",
		destination: "s1-events",
		content: `**Model:** A failed first attempt gives information. Replace “I cannot do this” with a specific next action, such as “I will test the event block by itself.”

**Build:** Pick a small classroom challenge that is not working yet. Describe what you expected and what actually happened. Choose one change or a smaller test, then try again. Ask a partner for a suggestion if needed. Keep a working version before adding more.

**Hard:** Compare two approaches and explain which gave clearer information.

**Check:** Describe an approach you changed, not only whether you finished. Explain how a mistake helped you choose your next test.`
	},
	{
		id: "mycs-scratch-housekeeping",
		title: "Scratch Tinkering and Saving",
		sourcePath: "/unit0/0-5",
		destination: "s1-events",
		starter: "blank",
		content: `**Model:** Connect an event to one action, then run it. Connected blocks execute in order from top to bottom. A saved project is useful only if it opens again.

**Build:** Open a blank project without signing in. Connect an event to a Motion, Looks or Sound action and explain what happens. Add another action after it. Download the project with a recognizable filename, then reopen that file to confirm your change was saved.

**Hard:** Try the same event with two different action sequences.

**Check:** The reopened file preserves your work. Identify the event, actions and order. Add run instructions and credit any approved assets or help. No public sharing or account is required.`
	},
	{
		id: "mycs-events-unplugged",
		title: "Act Out Events and Parallel Actions",
		sourcePath: "/unit1/1-1",
		destination: "s1-events",
		content: `**Model:** A cue starts an action. Two characters can respond to the same cue at once while each follows an ordered script.

**Build:** Choose a director and two actors, or use paper characters on a table. Give each character a short sequence starting on the director's cue. Run both scripts together, then return the characters to their starting positions. Add a different cue that starts only one character's next action.

**Hard:** Let one character send a cue that starts the other's response.

**Check:** Identify each event and the action it starts. Show an ordered sequence, two simultaneous actions and a reset.`
	},
	{
		id: "mycs-animate-word",
		title: "Animate a Word: Follow the Sequence",
		sourcePath: "/unit1/1-2",
		destination: "s1-events",
		starter: "animate-word",
		content: `**Model:** Clicking one letter can start that letter's script. Connected actions run in order; another event can start a different script.

**Build:** Use Animate Your Name and choose a word to animate. A real name is not required. Keep one letter's working example. Add a reaction to another letter using its own event. Make a short two-action sequence, predict the order and run it.

**Hard:** Swap the actions and compare the result without adding loops or broadcasts yet.

**Check:** Clicking the chosen letter starts its intended reaction. Explain which event begins the script and why changing block order changes the result.`
	},
	{
		id: "mycs-xy-grid",
		title: "Coordinates: Set or Change?",
		sourcePath: "/unit1/1-3",
		destination: "s1-position",
		starter: "dress-up",
		content: `**Model:** Set x to 100 chooses a particular horizontal position. Change x by 10 moves relative to the current position, so repeating it has a cumulative effect.

**Build:** Save a separate Robot Dress-Up remix. Drag an accessory to a start position and record x and y before moving it elsewhere. Compare setting x to the same value twice with changing x by the same amount twice. Restore your recorded start.

**Hard:** Compare go to with a timed glide, then make a click send the sprite to all four stage corners in order.

**Check:** Predict final positions before running the blocks. Explain which coordinates restore the start and which describe the destination.`
	},
	{
		id: "mycs-sprite-interactions",
		title: "Sprite Interactions: Say, Wait and Respond",
		sourceSite: "student",
		sourcePath: "/unit1/1-3b",
		destination: "s1-dialogue",
		starter: "conversation",
		content: `**Model:** Two sprites can run separate scripts after the same key event. Timed say and wait blocks let one speak while the other waits, rather than both speaking over each other.

**Build:** Save a separate Robot Conversation remix. Give two sprites the same key event and plan a short exchange. Use timed say and wait blocks to coordinate their turns. Change one wait and predict what will overlap before running it. Restore positions and speech on the flag.

**Hard:** Make one clicked object broadcast a new cue. Have another sprite receive it, play an approved sound and glide to the object. Compare this with timed waits.

**Check:** One input triggers both scripts, turns occur in the planned order, and resetting is reliable. Explain which scripts run in parallel.`
	},
	{
		id: "mycs-events-reset-checkpoint",
		title: "Events and Reset: Debugging Checkpoint",
		sourcePath: "/unit1/1-5",
		destination: "s1-position",
		content: `**Model:** A useful bug report states the input, expected result and actual result. Test one short script before changing many blocks.

**Build:** Ask a partner to test your saved movement or reset project without coaching. Choose one confusing behavior. Describe what should happen and what actually happens, then isolate the relevant event and actions. Make one repair, repeat the test and add a short comment explaining the repaired script.

**Hard:** Find a second correct way to produce the same behavior.

**Check:** Show the test passing and explain why it failed before. Describe an event, ordered sequence, simultaneous actions, coordinates and reset in your project.`
	},
	{
		id: "mycs-broadcast-dance",
		title: "Dance Party: One Cue, Several Sprites",
		sourcePath: "/unit1/1-7",
		destination: "s1-dialogue",
		starter: "conversation",
		content: `**Model:** A sprite broadcasts a named message. Every script waiting for that exact message can begin. A receiver for another message should not respond.

**Build:** Save a separate Robot Conversation remix with four sprites and a party backdrop. Make one clicked sprite broadcast a dance cue. Give three others matching receive scripts with different moves. Test that an unrelated message stays quiet. Restore everyone's positions on the flag.

**Hard:** Let movement and approved music run separately. Use a second message to change the backdrop or an effect.

**Check:** One click starts all matching listeners, not the unrelated listener. Explain how separate scripts can run together and which sprite sends the message.`
	},
	{
		id: "mycs-virtual-pet",
		title: "Virtual Pet: Objects Send Messages",
		sourcePath: "/unit1/1-8",
		destination: "s1-dialogue",
		starter: "conversation",
		content: `**Model:** An apple sprite can broadcast a food cue when clicked. The pet's matching receive script decides its reaction. Sender and receiver own different parts of the behavior.

**Build:** Keep Robot Conversation as a working reference and save a separate pet remix. Choose a pet and two objects using your own art or approved editor assets. Make each object send a different message. Have the pet perform an appropriate short reaction to each.

**Hard:** Add a flag reset that restores the pet and both objects before another run.

**Check:** Each object triggers its intended reaction. Point to the sender and receiver for each message, then test restarting.`
	},
	{
		id: "mycs-virtual-pet-extension",
		title: "Virtual Pet: Add and Explain One Behavior",
		sourcePath: "/unit1/1-9-virtual-pet",
		destination: "s1-dialogue",
		content: `**Model:** Extend the same pet rather than starting again. A new message needs a clear purpose and must not accidentally trigger another reaction.

**Build:** Reopen your saved pet. Extend it to four different interactions, describing each trigger and response. Keep earlier behaviors working, add player directions, and test each interaction and reset with a partner.

**Hard:** After learning variables, let one value remember hunger or tiredness. Explain how an interaction changes it and how the flag resets it.

**Check:** Demonstrate what you added and identify the responsible blocks. Explain what you would improve with more time. Save this as a separate version of the same project.`
	},
	{
		id: "mycs-messages-checkpoint",
		title: "Messages and Parallel Actions: Checkpoint",
		sourcePath: "/unit1/1-10-assessments",
		destination: "s1-dialogue",
		content: `**Model:** Explain intended behavior before looking at code. More than one correct implementation may exist, so test whether the result meets the goal.

**Build:** Choose your saved conversation, party or pet remix and explain its cues to a partner. Have the partner test each cue, simultaneous behavior and restart. Compare debugging strategies if something fails. Repair one issue and add a comment helping another person understand a script.

**Hard:** Offer one specific, useful suggestion after trying a partner's project locally.

**Check:** Trace a message from its sender to every intended receiver. Demonstrate a repaired behavior and explain its reset. Public posting is not required.`
	},
	{
		id: "mycs-maze-route",
		title: "Maze Route: Plan Before Moving",
		sourceSite: "student",
		sourcePath: "/unit1/1-6",
		destination: "s1-conditions",
		starter: "maze-reset",
		content: `**Model:** A route is an ordered list of moves. Predict the path one action at a time instead of changing unrelated blocks. An event starts each movement action.

**Build:** Use the existing Maze Checkpoint, keeping its working controls and reset. Locate the start and goal. Describe a short route, then try its moves in order. Compare the intended path with the sprite's actual movement. If a wall sends you back, identify the move that needs changing before trying again.

**Hard:** Find another working route or explain why a proposed route fails.

**Check:** Reach the goal, restart and repeat your route. Explain one event and why move order matters. This uses the local maze, not an imported set of ten mazes.`
	},
	{
		id: "mycs-loop-dance",
		title: "Unplugged Loops: Shorten a Dance Algorithm",
		sourcePath: "/unit-2/2-1",
		destination: "s1-loops",
		content: `**Model:** Four identical clap instructions can be written as repeat 4: clap. The shorter description should produce four actions, not one or five.

**Build:** Write a tiny dance or tabletop movement sequence with repeated steps. Replace a repeated part with a counted loop and predict the total actions. Swap algorithms with a partner, perform them safely and compare the original sequence with the loop version.

**Hard:** Put two different actions inside one repeat and predict how their order changes the routine.

**Check:** Your loop produces the same actions as the expanded list. Explain when a fixed count is useful and when a behavior should continue until stopped.`
	},
	{
		id: "mycs-five-costumes",
		title: "Draw and Animate Five Costumes",
		sourcePath: "/unit-2/2-2-draw-sprite",
		destination: "s1-loops",
		starter: "dance-loop",
		content: `**Model:** Each costume is a frame. A wait near 0.1 seconds gives roughly ten costume changes per second. Start on costume 1 before advancing through the remaining costumes.

**Build:** Save a Repeat Dance remix. Paint a sprite costume, duplicate it and change it slightly; continue until you have five costumes. Set the starting costume on the flag, then use next costume and a short wait in a counted loop. Trace costume numbers to choose a count ending on your intended final costume.

**Hard:** Compare shorter and longer waits.

**Check:** Restarting shows the same first frame and intended ending. Explain the timing difference. Edit sprite costumes, not extra stage backdrops.`
	},
	{
		id: "mycs-animation-effects",
		title: "Animation: Repeat, Forever and Gradual Effects",
		sourcePath: "/unit-2/2-3",
		destination: "s1-loops",
		content: `**Model:** Repeat stops after a chosen number of passes. Forever continues until stopped. A small size or effect change inside a loop accumulates each pass.

**Build:** Reopen your costume animation and choose its starting and ending appearance. Add two storytelling techniques, such as gradual growth, a changing visual effect, an approved sound or a backdrop. Trace the costume or effect value through several iterations. Compare counted repeat with forever and choose the loop matching your plan.

**Hard:** Offset two sprites' timing so they do not perform every movement together.

**Check:** The animation starts predictably and stops or continues as intended. Explain the loop count and one cumulative effect.`
	},
	{
		id: "mycs-vector-bitmap",
		title: "Costume Art: Bitmap or Vector?",
		sourcePath: "/unit-2/2-4",
		destination: "s1-loops",
		starter: "blank",
		content: `**Model:** A bitmap represents colored pixels; enlarging it can reveal squares. Vector shapes describe lines and curves that resize cleanly. Choose a mode for the job rather than calling one always better.

**Build:** Create your own simple shape in the costume editor and compare bitmap and vector editing. Enlarge each version and describe its outline. Make or alter a vector costume, duplicate it and animate a small change.

**Hard:** For a wing or foot, choose a contact or pivot point that stays consistent between costumes.

**Check:** Explain a use for pixel detail and a use for scalable shapes. Play the sequence and check that the intended contact point does not jump.`
	},
	{
		id: "mycs-costumes-checkpoint",
		title: "Costumes and Loops: Debugging Checkpoint",
		sourcePath: "/unit-2/2-5-assessments",
		destination: "s1-loops",
		content: `**Model:** Trace a small animation segment by hand: starting costume, one loop pass, next costume and wait. Compare your prediction with the stage.

**Build:** Ask a partner to test your saved animation's start, intermediate frames and ending. Choose one mistake or confusing transition. Isolate its script and predict one pass before changing it. Repair the behavior, repeat the test and annotate the script so another learner can understand it.

**Hard:** Compare another working repair and explain its tradeoff.

**Check:** Show a prediction matching the running project. Explain whether the count, wait or starting costume caused the issue. Keep your original working file as a reference.`
	},
	{
		id: "mycs-fish-choir",
		title: "Fish Choir: Repeat a Sound Pattern",
		sourcePath: "/unit-2/2-8",
		destination: "s1-loops",
		starter: "blank",
		content: `**Model:** A short sound sequence can repeat as a pattern. A clicked character can change appearance so the player sees that the click was received.

**Build:** Create three original or approved sprites and give them meaningful names. Make one click event play a short pattern using approved sounds already available in your editor. Repeat it a chosen number of times and change the sprite's appearance as feedback. Reuse the working pattern on another sprite and change its sound or rhythm.

**Hard:** If your approved editor provides Music, try notes or drums, choose different instruments and compare tempos.

**Check:** Predict and count pattern repetitions. A partner can tell which sprite responded. Explain what you reused and changed.`
	},
	{
		id: "mycs-sound-party",
		title: "Sound Party: Explore and Edit Sounds",
		sourcePath: "/unit-2/2-9",
		destination: "s1-loops",
		content: `**Model:** Sounds can come from an approved library, a sound-editor variation, or notes and drums when available. Uploading and recording are optional.

**Build:** Continue your saved choir or dance remix. Use an approved sound already available in the editor. Make a variation with an operation such as trimming or fading, then choose separate events to trigger the original and edited versions.

**Hard:** Add a small note or drum pattern if your approved editor provides the Music extension. Compare the different sound sources.

**Check:** Demonstrate the original and edited sounds, describe the change, and test each trigger. No microphone permission, personal recording or external audio download is required.`
	},
	{
		id: "mycs-music-animation-plan",
		title: "Music Animation: Plan the Story and Timing",
		sourcePath: "/unit-2/2-11",
		destination: "s1-loops",
		starter: "blank",
		content: `**Model:** A short music animation has a planned sequence: what appears first, when the scene changes and how it ends. Audio and visuals need an intentional timing relationship.

**Build:** Choose an original or separately approved sound. If none is ready, plan the visuals before adding audio. Sketch a storyboard showing backdrop and sprite actions at each moment. List any required asset credits. Build the first visual sequence in a separate project; keep a continuous soundtrack on the stage rather than moving it between characters.

**Hard:** Plan a repeated visual pattern matching the sound's rhythm.

**Check:** Explain the planned timing and identify which assets are yours or need permission. Do not convert or download commercial songs.`
	},
	{
		id: "mycs-music-animation-finish",
		title: "Music Animation: Build, Critique and Revise",
		sourcePath: "/unit-2/2-12",
		destination: "s1-loops",
		content: `**Model:** Continue the same storyboard. Backdrop changes set scenes; sprite hide/show and costume changes reveal actions at chosen times.

**Build:** Use only your own or approved audio and choose a short section. Animate the backdrop and one or two sprites. Use loops for repeated actions, then reset visible sprites and scenes on the flag. Ask a partner for one specific timing or storytelling suggestion and revise your project.

**Hard:** Expand to three sprites and three backdrops, use two different movement blocks, and make the story clear with sound muted.

**Check:** Restarting is predictable and the ending is clear. Explain a revision and one useful loop. Download and reopen the result. A short clip still needs appropriate reuse rights.`
	},
	{
		id: "mycs-animation-review",
		title: "Animation and Sound: Explain Your Choices",
		sourcePath: "/unit-2/2-10-assessments",
		destination: "s1-loops",
		content: `**Model:** Describe an animation using loop, sequence, reset, frame and frame rate. Bitmap and vector describe artwork representation, not whether it can be animated.

**Build:** Demonstrate your saved animation or sound remix to a partner. Ask them to test the start, repeated action, timing and ending without coaching. Compare predictions with the result. Explain your artwork and timing choices, then repair or improve one behavior using the feedback.

**Hard:** Predict how changing the wait or loop count affects the animation, then test.

**Check:** Identify a frame, explain playback timing and trace one loop. Explain your bitmap or vector choice and show a reliable reset.`
	}
];
