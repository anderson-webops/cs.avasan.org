import type { MyCsLesson } from "./mycs-types";

export const myCsFoundationsCapstones: MyCsLesson[] = [
	{
		id: "mycs-computer-definition",
		title: "What Makes a Computer?",
		sourcePath: "intersessions/what-is-a-computer/a-1",
		destination: "s1-events",
		content: `### Model
Think about a game console: a controller provides input, its program processes information, and the screen produces output. Some information is stored for later.

### Build
On paper, sort six everyday objects into “computer,” “not a computer,” or “not sure.” For each choice, identify input, processing, storage, and output. Explain your reasoning to a partner and revise one choice after listening.

### Hard
Choose an object without a screen. Could it still contain a computer? Support your answer with evidence.

### Check
Explain why having a screen or using electricity alone does not make something a computer.`
	},
	{
		id: "mycs-computer-components",
		title: "Inside a Computer",
		sourcePath: "intersessions/what-is-a-computer/a-2",
		destination: "s1-events",
		content: `### Model
Follow a pretend key press: the keyboard supplies input, the processor follows instructions, memory holds working information, and the display shows output.

### Build
Draw and label a processor, working memory, storage, one input device, and one output device. Trace how they cooperate when a program opens a saved picture. Trade explanations with a partner.

### Hard
Write exact instructions for arranging three paper shapes. Let a partner follow them literally, then improve any ambiguous step.

### Check
Distinguish working memory from saved storage and explain how components work together. Use diagrams or pictures from Julio; do not open electrical equipment.`
	},
	{
		id: "mycs-computer-history",
		title: "Explore Computer History",
		sourcePath: "intersessions/what-is-a-computer/a-3",
		destination: "s1-events",
		content: `### Model
Compare an early room-sized computer with a modern handheld device. Ask what changed in size, speed, power use, cost, and who could use it.

### Build
Using a timeline selected by Julio, choose four computing developments. Make a small timeline with a date, a source, and a sentence explaining each change. Compare your choices with a partner.

### Hard
Investigate how replacing vacuum tubes with transistors changed computer design. Explain one benefit without claiming that every kind of computer changed at once.

### Check
Verify dates against your source, distinguish evidence from guesses, and describe one change that made computers more accessible.`
	},
	{
		id: "mycs-encoding-decoding",
		title: "Encode and Decode a Message",
		sourcePath: "intersessions/binary/b-1",
		destination: "s1-events",
		content: `### Model
Write an invented message such as “RED ROBOT.” Shift each letter three places through the alphabet, wrapping around after Z. A partner reverses the shift to decode it.

### Build
Agree on a letter-shift rule and exchange two short, school-appropriate invented messages on paper. Include enough information for your partner to decode them. Test a message containing Z.

### Hard
Compare replacing letters with translating a sentence between languages. Why can word-for-word translation lose the intended meaning?

### Check
Explain encoding and decoding, show the same rule working both ways, and identify why a simple classroom cipher should not protect real passwords or private information.`
	},
	{
		id: "mycs-binary-counting",
		title: "Count with Binary Cards",
		sourcePath: "intersessions/binary/b-2",
		destination: "s1-events",
		content: `### Model
Make five paper cards worth 16, 8, 4, 2, and 1. A visible card means 1; a hidden card means 0. To show ten, turn on 8 and 2: 01010.

### Build
Take turns choosing numbers from zero to thirty-one. Consider the largest card first, keep it if it fits, subtract its value, and continue. Have a partner add the visible values to check each answer.

### Hard
Predict the next card and the largest number six cards can represent. Explain the pattern.

### Check
Show zero, ten, and thirty-one, then explain why each card doubles the previous value.`
	},
	{
		id: "mycs-binary-media",
		title: "Represent Text, Pictures, and Sound",
		sourcePath: "intersessions/binary/b-3",
		destination: "s1-events",
		content: `### Model
A shared code can represent letters with numbers. A tiny black-and-white picture can use 1 for a filled square and 0 for an empty square.

### Build
Choose two paper activities: encode an invented word using an agreed letter-number table, draw and encode a small pixel picture, or represent a simple pattern of high and low sounds. Give a partner the decoding rule and test whether they reconstruct your message.

### Hard
Explain what extra information a decoder needs, such as picture width, timing, or the letter table.

### Check
Distinguish your custom classroom code from standard ASCII. Explain how different kinds of information can be represented by numbers.`
	},
	{
		id: "mycs-internet-messages",
		title: "Act Out an Internet Message",
		sourcePath: "intersessions/the-internet/c-1",
		destination: "s1-events",
		content: `### Model
An address identifies a destination. A message may travel through several connected devices rather than directly from one person to another.

### Build
Use paper cards for a sender, destination, address directory, and routers. Split an invented message into numbered pieces. Pass the pieces along different classroom paths and reconstruct them at the destination. Use fictional labels, not real accounts or network addresses.

### Hard
Block one paper route. Find another path, then decide how the receiver notices a missing or out-of-order piece.

### Check
Explain the roles of addresses and routing. Identify which parts of the classroom model simplify how the real internet works.`
	},
	{
		id: "mycs-search-strategy",
		title: "Make a Search Plan",
		sourcePath: "intersessions/the-internet/c-2",
		destination: "s1-events",
		content: `### Model
Turn a broad question into a focused one. “Computers” is broad; “How do computer keyboards send input?” suggests more useful search terms.

### Build
Choose a non-personal research question. Write what you need to learn, select keywords, consider suitable sources, compare what you find, and revise the search. Use sources approved by Julio or printed examples. Record the source of each useful fact.

### Hard
Compare two sources that disagree. Check who produced them, when they were updated, and what evidence supports their claims.

### Check
Explain how you refined a search instead of accepting the first result. Do not enter private information or create an account for this activity.`
	},
	{
		id: "mycs-makey-exploration",
		title: "Optional Physical Lab: Makey Makey",
		sourcePath: "intersessions/makey-makey/e-1",
		destination: "s2-review",
		content: `### Model
In this optional physical activity with Julio, explore a Makey Makey acting as a keyboard input device. It requires the board, its USB cable, clips, and conductive materials approved by Julio.

### Build
Predict which supplied objects will act as controls. With Julio supervising setup, test each object, record the result, and explain how completing the circuit triggers an input. Follow the device's safety guidance.

### Hard
Design a simple controller that someone else can use comfortably. Invite a partner to test it and suggest an improvement.

### Check
Separate the physical input from the program's response. This activity needs equipment and setup with Julio; it is not a project the classroom editor can supply by itself.`
	},
	{
		id: "mycs-makey-scratch",
		title: "Optional Physical Lab: Control a Scratch Game",
		sourcePath: "intersessions/makey-makey/e-2",
		destination: "s2-review",
		content: `### Model
Choose an existing Scratch game with arrow-key or space-key events. Test its keyboard controls first, then have Julio demonstrate the same inputs through a Makey Makey.

### Build
This optional activity with Julio requires a Makey Makey kit and approved materials. Reuse your own game, identify its event blocks, and plan a physical control for each action. Test one input at a time before combining them.

### Hard
Ask a partner to test the controller without your explanation. Improve the labels or layout using their feedback.

### Check
Explain how a physical action becomes a key event and then a program response. Equipment and supervised setup are required; no extra hardware connection is activated here.`
	},
	{
		id: "mycs-microbit-exploration",
		title: "Optional Physical Lab: Meet the micro:bit",
		sourcePath: "intersessions/microbit/f-1-microbits",
		destination: "s2-review",
		content: `### Model
Julio demonstrates a micro:bit as a small computer with inputs, processing, and outputs. Pressing a button can make a pattern appear on its LED display.

### Build
For this optional physical activity with Julio, use a micro:bit, the appropriate cable, and Julio's selected micro:bit editor. Identify two inputs and one output, plan a button response, and test it with supervision. Follow the hardware safety guide before transferring a program.

### Hard
Change one input or output and predict how the behavior will differ before testing it.

### Check
Explain how the device follows your program. The classroom Scratch editor does not compile or install micro:bit firmware; this lab needs separate equipment and software.`
	},
	{
		id: "mycs-microbit-pet",
		title: "Optional Physical Lab: Design a Pet",
		sourcePath: "intersessions/microbit/f-2-microbits",
		destination: "s2-functions",
		content: `### Model
Design for a user's needs, not only your own idea. Invent a character who wants a quiet pet that responds when a button is pressed.

### Build
In this optional lab with Julio, sketch two possible pets, choose one, and plan its input and response. With a micro:bit, battery pack, craft materials, and Julio's selected editor, build a supervised prototype. Keep the power switch and battery accessible.

### Hard
Ask a partner to test whether the pet meets the fictional character's needs. Revise the design and explain the change.

### Check
Describe the input, processing, and output separately. Physical construction and micro:bit programming require equipment and separate software, not the classroom Scratch editor.`
	},
	{
		id: "mycs-microbit-fidget",
		title: "Optional Physical Lab: Fidget Controller",
		sourcePath: "intersessions/microbit/f-3-microbits",
		destination: "s2-functions",
		content: `### Model
Map different inputs to different outputs: a button press shows one LED pattern, while a tilt shows another. Plan these event-response pairs before building.

### Build
This optional lab with Julio needs a micro:bit, suitable power, craft materials, and a separate micro:bit editor selected by Julio. Create and test two event handlers first. Build a case that lets the intended user operate the controls and reach the power switch.

### Hard
Add up to four distinct inputs and outputs. Test each alone, then check whether the controls interfere with one another.

### Check
Explain each event-response pair and describe a design improvement after testing. Hardware and firmware setup are supervised separately, not provided by this classroom editor.`
	},
	{
		id: "mycs-microbit-random",
		title: "Optional Physical Lab: Random Answers",
		sourcePath: "intersessions/microbit/f-4-microbits",
		destination: "s2-functions",
		content: `### Model
Plan a pretend fortune-teller: an input triggers a random choice, then an if/else selects one of two symbols. Predictions are a game, not real advice.

### Build
In this optional physical lab with Julio, use a micro:bit and Julio's selected micro:bit editor. Write pseudocode for a shake event, a random two-way choice, and two display outputs. Test repeatedly and record the outcomes without expecting perfect alternation.

### Hard
Plan how a variable or list could choose among more than two responses. Explain what would need to change.

### Check
Distinguish randomness from a fixed sequence and explain the conditional. This lab requires supervised hardware and separate programming software; the classroom Scratch editor does not install it.`
	},
	{
		id: "mycs-research-issue",
		title: "Plan a Project That Helps Someone",
		sourcePath: "midtermfinal-projects/research-your-issue",
		destination: "s2-master",
		content: `### Model
Consider an issue such as reducing classroom waste. Narrow it to one problem a program could explain or help address, rather than trying to solve everything at once.

### Build
Brainstorm several issues, group similar ideas, and choose one. Research sources approved by Julio, noting where each fact came from. Identify an intended audience, write a specific problem statement, and sketch a possible game, story, or interactive explanation. Discuss the plan with Julio before coding.

### Hard
Connect your idea to a relevant UN Sustainable Development Goal and compare local and wider perspectives. Verify current evidence instead of repeating old statistics.

### Check
State who the project helps, what it will do, and one achievable success test. Use invented examples, not classmates' private experiences.`
	},
	{
		id: "mycs-midterm-planning",
		title: "Midpoint Project: Plan, Build, Improve",
		sourcePath: "midtermfinal-projects/midterm-project",
		destination: "s2-master",
		starter: "blank",
		content: `### Model
Plan a small interactive game, animation, or story that combines skills you already know. Sketch the scene and explain the purpose, controls, and blocks to Julio before starting.

### Build
Use at least two sprites and a backdrop. Provide clear start instructions, reset the project to its starting state, and add a keyboard or sprite-click interaction. Use a loop and a condition with sensing. Share the work with a partner when available, testing each part as you add it.

### Hard
Let two classmates test the project and give feedback on what works, what is confusing, and what could improve. Choose one revision.

### Check
Restart twice, verify the controls and reset, and explain how your revision improved the experience.`
	},
	{
		id: "mycs-final-project",
		title: "Final Project: Make a Useful Interactive",
		sourcePath: "midtermfinal-projects/final-project",
		destination: "s2-master",
		starter: "blank",
		content: `### Model
Choose a meaningful problem and an audience. Sketch a manageable interactive project that explains the issue or helps someone respond to it. Get Julio's feedback before coding.

### Build
Include at least two sprites, a backdrop, clear starting instructions, and meaningful interaction. Use a variable, loops, and conditionals where they help. Organize reusable behavior into your own blocks, and add comments explaining important decisions. Build and test in small stages.

### Hard
Invite two testers to try the project. Record useful feedback, improve one confusing or unfinished part, and explain the revision. Credit any material you are permitted to reuse.

### Check
Demonstrate the intended benefit, controls, reliable restart, and how your code uses variables and reusable blocks. Keep all examples free of private personal information.`
	},
	{
		id: "mycs-local-sound-selector",
		title: "Local Sound Selector",
		sourcePath: "intersessions/g-1",
		sourceSite: "student",
		destination: "s2-strings",
		starter: "blank",
		content: `### Model
Plan a small sound menu: ask for a choice, store the answer in a variable, and select the matching sound already in your project.

### Build
Add three short original tones or other sounds you have permission to use. Give them clear names. Ask for a sound choice, save the answer, and use conditions to play the matching local sound. Show a helpful message when the choice is not recognized.

### Hard
Allow more than one spelling for a choice, or repeat the menu until the user chooses to stop.

### Check
Test every valid choice and an unknown choice. Explain where the input is stored and how your program decides which sound to play.`
	},
	{
		id: "mycs-local-sound-playlist",
		title: "Local Sound Playlist",
		sourcePath: "unit5/g-2",
		sourceSite: "student",
		destination: "s2-lists",
		starter: "blank",
		content: `### Model
A list stores several sound names. An index identifies one item; choosing a random valid index selects one sound from the list.

### Build
Use short original tones or other sounds you have permission to use, all stored in your project. Create a list containing their exact names. Add a control that checks whether the list is empty, chooses a random number from one to the list length, and plays that item.

### Hard
Add controls to add or delete an entry, then check that random selection still stays within the current list length.

### Check
Test an empty list, one item, and several items. Explain why choosing an index beyond the list length cannot select a valid sound.`
	}
];
