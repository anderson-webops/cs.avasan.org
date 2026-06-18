import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const javaLevel3Course: RawCourse = {
	name: "Java Level 3",
	modules: [
		{
			title: "AJ1 Review: Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content: `**Concept path:** Java programs move through a source-edit, compile, run, and observe cycle. A useful setup pass identifies where source files live, where compiled output appears, how the terminal reports errors, and how project folders separate one exercise from another.

**Practice targets:** Open a small Java project, identify the file containing the entry point, run it once unchanged, make one visible output change, run it again, and confirm that the displayed result came from the newest source file rather than stale output.

**Evidence target:** A reliable setup is visible when a small source change produces a predictable new console result and compile errors can be traced back to a specific file and line.`
				},
				{
					title: "Creating and Running a Java Program",
					content: `**Concept path:** A Java application starts from a class that contains the main method. The class name, file name, braces, method header, and statements work together to create the smallest runnable program.

**Practice targets:** Locate the class declaration, the main method header, and the first executable statement. Add several console outputs, distinguish fixed text from calculated values, and keep braces and semicolons aligned so the compiler can parse the program.

**Evidence target:** The program can be explained from file to class to main method to statement order, and each line of output can be traced to the exact statement that produced it.`
				},
				{
					title: "Compilation",
					content: `**Concept path:** Java source code is compiled before execution. Compilation catches syntax and type errors, then produces bytecode that the Java runtime executes. Runtime behavior begins only after the compiler accepts the source.

**Practice targets:** Create and fix common compile-time errors such as missing semicolons, mismatched braces, wrong capitalization, and incompatible assignments. Then compare them with runtime or logic errors where the program compiles but behaves incorrectly.

**Evidence target:** Error messages are useful when the filename, line number, symbol name, and surrounding code are read together instead of treating the first red message as a mystery.`
				},
				{
					title: "Variables, Primitive Data Types, and Strings",
					content: `**Concept path:** Variables name stored values, while types describe what operations are valid. Primitive types such as int, boolean, and double store direct values. String values are objects, so they support methods such as length(), charAt(), substring(), and equals().

**Practice targets:** Declare variables with meaningful names, update them safely, combine text with numeric values, and compare strings using equals() rather than ==. Include small checks for off-by-one indexing, integer division, and boolean expressions.

**Evidence target:** A strong solution makes each variable's role obvious, produces correct output for more than one input, and avoids relying on accidental string or numeric behavior.`
				},
				{
					title: "Input, Output, and Commenting",
					content: `**Concept path:** Console programs become interactive when Scanner reads typed input and output statements explain what is needed next. print() keeps output on the same line, println() ends the line, and comments preserve reasoning that is not obvious from code alone.

**Practice targets:** Read strings, integers, and decimal values; name prompts clearly; handle the common nextInt() then nextLine() newline issue; and keep comments focused on purpose, assumptions, or a non-obvious decision.

**Evidence target:** The program is readable from the console alone: prompts describe the expected input, output spacing is intentional, and comments clarify reasoning rather than repeating the statement literally.`
				},
				{
					title: "AJ1 Project 1: Mad Libs",
					content: `**Project target:** Build a console Mad Libs program that collects several typed words, stores each value in a descriptive variable, and inserts those values into a complete story.

**Build path:** Plan the story before coding so every blank has a clear part of speech. Then create prompts, read input with Scanner, combine fixed text with variables, and preserve spacing, punctuation, and line breaks.

**Evidence target:** The story remains readable after multiple runs with different inputs, and the source code clearly separates input collection from final story output.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "AJ1 Project 2: Chat Bot",
					content: `**Project target:** Create a console chatbot that collects responses, stores them in variables, and produces replies that depend on earlier input.

**Build path:** Keep each prompt short and specific, normalize text where needed, and use conditionals for at least a few different response paths. A fallback response keeps the conversation stable when input does not match the expected wording.

**Evidence target:** The chatbot has a repeatable conversation flow, at least one branch based on typed input, and output that makes sense even when responses vary.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chat-Bot"
				}
			],
			supplementalProjects: [
				{
					title: "Review: Variables, Strings, and Input: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Review: Variables, Strings, and Input",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "Review: Variables, Strings, and Input supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"AJ1 Review: Variables, Strings, and Input",
						itemTitle:
							"Review: Variables, Strings, and Input supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/solution"
				},
				{
					title: "Review: Variables, Strings, and Input supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"AJ1 Review: Variables, Strings, and Input",
						itemTitle:
							"Review: Variables, Strings, and Input supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ2 Review: Arrays and ArrayLists",
			curriculum: [
				{
					title: "Review Focus",
					content: `**Concept path:** Arrays and ArrayLists both store ordered collections, but they make different tradeoffs. Arrays have fixed length and direct indexed storage. ArrayLists resize and provide methods for insertion, removal, and replacement.

**Practice targets:** Compare length with size(), index access with get(), assignment with set(), and fixed storage with dynamic growth. Include at least one example where an array is the simpler structure and one where an ArrayList is more appropriate.

**Evidence target:** Collection code is strongest when index bounds, mutation points, and traversal order are visible and tested with empty, single-item, and multi-item cases.`
				},
				{
					title: "Arrays",
					content: `**Concept path:** Arrays are fixed-size ordered collections where every element has the same type. Indexing starts at 0, the final valid index is length - 1, and direct access is fast when the index is known.

**Practice targets:** Create arrays with explicit values and with a size only, fill them with loops, read and update individual elements, and print them with both standard loops and enhanced for loops where mutation is not needed.

**Evidence target:** Correct array code avoids off-by-one errors, handles the first and last element deliberately, and does not use an index outside the valid range.`
				},
				{
					title: "AJ2 Project 1: Array Practice",
					content: `**Project target:** Write a group of array utility methods that transform values, compute totals, generate random data, and summarize strings.

**Build path:** Keep each method responsible for one task: double numeric values, sum even numbers, generate random doubles, or total word lengths. Use parameters and return values so methods can be tested without rewriting the main method every time.

**Evidence target:** Each method has at least one normal case plus one edge case, such as an empty array, a one-element array, or an array with no even numbers.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice"
				},
				{
					title: "Two-Dimensional Arrays",
					content: `**Concept path:** A two-dimensional array is an array of rows, and each row contains elements at column indices. This structure is useful for grids, tables, matrices, maps, and board-like data.

**Practice targets:** Access a specific row and column, traverse by rows, traverse by columns when appropriate, and distinguish the number of rows from the number of columns. Include rectangular arrays as well as square arrays so the two dimensions are not accidentally treated as identical.

**Evidence target:** Nested-loop code is correct when the outer and inner bounds match the actual row and column lengths, not a memorized size.`
				},
				{
					title: "AJ2 Project 2: Two-Dimensional Array Practice",
					content: `**Project target:** Build utility methods for square grids and general matrices, including filling, printing, maximum search, random generation, and target search.

**Build path:** Use predictable small matrices before adding random values. Print intermediate grids in a readable row-and-column layout so incorrect indexing is visible.

**Evidence target:** The methods work for targets at the first cell, last cell, middle cells, and missing values, and maximum-value logic handles negative numbers as well as positive numbers.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice"
				},
				{
					title: "ArrayLists",
					content: `**Concept path:** ArrayLists are resizable lists backed by object references. They trade fixed-size simplicity for methods that make insertion, deletion, replacement, and dynamic growth easier.

**Practice targets:** Use add(), get(), set(), remove(), contains(), and size() in small examples. Pay special attention to removal while iterating because removing an item shifts later indices left.

**Evidence target:** ArrayList code is reliable when it clearly handles changing size, avoids skipped elements during removal, and chooses wrapper types such as Integer for primitive-style values.`
				},
				{
					title: "Primitive Wrapper Objects",
					content: `**Concept path:** Java generics work with reference types, so collections such as ArrayList use wrapper classes like Integer, Double, Boolean, and Character instead of primitive types directly. Autoboxing converts a primitive into its wrapper when needed, and unboxing converts it back.

**Practice targets:** Create ArrayList<Integer> and ArrayList<Double> examples, perform arithmetic with retrieved values, and identify where Java converts between primitive and wrapper forms automatically.

**Evidence target:** Code that uses wrappers well avoids null unboxing errors and keeps numeric intent clear despite the object wrapper around the value.`
				},
				{
					title: "AJ2 Project 3: ArrayList Practice",
					content: `**Project target:** Build ArrayList methods that filter values, search for a pair with a target relationship, remove an extreme value, and append summary data.

**Build path:** Use separate methods for filtering even numbers, checking for two values that sum to zero, removing the smallest value, and appending the total sum. Keep mutation explicit so it is clear which methods modify the original list.

**Evidence target:** The project handles duplicates, all-negative lists, all-positive lists, empty lists where relevant, and lists where the smallest value appears more than once.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "AJ2 Supplemental Project 1: Test Scores",
					content: `**Project target:** Store numeric test scores, compute summary statistics, and convert the average into a letter-grade category.

**Build path:** Validate the score range, calculate the total and average with clear numeric types, and use conditionals that make grade boundaries unambiguous.

**Evidence target:** Boundary cases such as exactly 90, exactly 80, a perfect score, and a low score produce the expected category.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores"
				},
				{
					title: "AJ2 Supplemental Project 2: Matrix Addition",
					content: `**Project target:** Add two matrices by combining entries at matching row and column positions.

**Build path:** Confirm that both matrices have compatible dimensions, traverse rows and columns with nested loops, and store each sum in a result matrix rather than overwriting input data too early.

**Evidence target:** The output matrix has the same dimensions as the inputs, and each cell can be verified by one hand calculation.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition"
				},
				{
					title: "AJ2 Supplemental Project 3: Sandwich Orders",
					content: `**Project target:** Model a sandwich order with an ArrayList of ingredients and convert that order into a compact representation.

**Build path:** Store available ingredients, collect selected ingredients, preserve ordering where it matters, and create abbreviations through a clear rule rather than hard-coded output only.

**Evidence target:** Repeated ingredients, missing ingredients, and differently ordered selections produce predictable results.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders"
				}
			]
		},
		{
			title: "AJ3 Review: Objects and Classes",
			curriculum: [
				{
					title: "Object-Oriented Programming",
					content: `**Concept path:** Object-oriented Java is clearest when each class owns one coherent responsibility. A class defines the fields and behavior available to its objects, while each object stores its own state.

**Practice targets:** Identify which data belongs in fields, which behavior belongs in methods, and which setup belongs in constructors. Separate object state from local variables so long-lived information is stored in the correct place.

**Evidence target:** A class is well-shaped when another file can create objects, call public methods, and understand the object state without directly editing private data.`
				},
				{
					title: "Public and Private Instance Variables",
					content: `**Concept path:** Encapsulation protects object state by keeping fields private and exposing controlled operations through methods. Public fields make quick experiments easy, but they also allow invalid state from anywhere in the program.

**Practice targets:** Convert public fields into private fields, add getters and setters where useful, and enforce at least one rule inside a setter or constructor.

**Evidence target:** Invalid values are rejected or normalized at the class boundary instead of requiring every caller to remember the same rule.`
				},
				{
					title: "Constructors",
					content: `**Concept path:** Constructors establish an object's starting state. A no-argument constructor provides a default setup, while overloaded constructors allow specific starting values.

**Practice targets:** Write multiple constructors for the same class, use this to resolve field and parameter names, and avoid duplicated setup logic when one constructor can delegate to another.

**Evidence target:** Every constructed object begins in a valid state, and object creation examples show why each constructor signature exists.`
				},
				{
					title: "Class Methods",
					content: `**Concept path:** Methods define what an object can do. Accessor methods expose state safely, mutator methods update state according to rules, and toString() creates a readable summary for debugging and display.

**Practice targets:** Write getters, setters, behavior methods, and a toString() method that includes the important fields without exposing implementation details unnecessarily.

**Evidence target:** Method calls read naturally from the outside of the class and keep state changes inside the class's rules.`
				},
				{
					title: "AJ3 Project 1: Student Class",
					content: `**Project target:** Create a Student class that stores identity and academic data with private fields and public methods.

**Build path:** Define fields, constructors, getters, setters, validation rules, and a toString() method. Then create several Student objects from main and update them through methods rather than direct field access.

**Evidence target:** The class supports valid object creation, readable output, controlled updates, and at least one rejected or corrected invalid value.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Static Variables and Methods",
					content: `**Concept path:** Static members belong to the class itself rather than to one object. They are useful for shared constants, class-wide counters, utility methods, and state that genuinely applies across all instances.

**Practice targets:** Add a static counter such as numStudents, update it during construction, expose it through a static getter, and compare it with an instance field that differs for each object.

**Evidence target:** The output distinguishes per-object state from class-wide state, and static data is not used as a shortcut for information that belongs in each object.`
				},
				{
					title: "Inheritance and Subclasses",
					content: `**Concept path:** Inheritance models an is-a relationship: a subclass is a more specific version of its superclass. The subclass inherits accessible behavior, can add new behavior, and can override methods when the general behavior is not specific enough.

**Practice targets:** Create a superclass with shared fields and methods, extend it with a subclass, call super() from the subclass constructor, and override one method with more specific behavior.

**Evidence target:** Shared behavior appears only once in the superclass, while subclass-specific details stay in the subclass.`
				},
				{
					title: "AJ3 Project 2: BakedGood Class",
					content: `**Project target:** Create a BakedGood model that can grow from a basic class into a small inheritance hierarchy.

**Build path:** Store common baked-good data such as name, ingredients, quantity, and size-related information. Then identify which behavior belongs to all baked goods and which behavior varies by subtype.

**Evidence target:** The base class is useful on its own as a shared model and also prepares cleanly for later abstract classes, interfaces, and enum-based constraints.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good"
				},
				{
					title: "Abstract Classes and Methods",
					content: `**Concept path:** Abstract classes define shared state or behavior while leaving some details incomplete. Abstract methods name behavior that every concrete subclass must provide.

**Practice targets:** Convert a general class into an abstract class, add an abstract method for price calculation, and implement that method in a concrete subclass such as Bread.

**Evidence target:** The abstract type captures common structure without pretending that every baked good uses the same pricing rule.`
				},
				{
					title: "Interfaces",
					content: `**Concept path:** Interfaces define capabilities without committing to one inheritance tree. A class can implement an interface to promise that certain methods exist, even when the class already extends another type.

**Practice targets:** Create a ForSale-style interface, implement its methods, and use Comparable or Comparator to order baked goods by a meaningful property such as ingredient count or price.

**Evidence target:** Interface-based code can operate on any object that provides the promised behavior, not just one specific class name.`
				},
				{
					title: "Enums",
					content: `**Concept path:** Enums represent a fixed set of named choices. They make code safer than loose strings when only a small number of values are valid.

**Practice targets:** Replace string-based categories with enum constants such as loaf sizes, pass enum values through constructors, and use switch expressions or conditionals where behavior depends on the chosen constant.

**Evidence target:** Invalid category names cannot be created by typo, and every valid enum value has a clear meaning in the program.`
				}
			],
			supplementalProjects: [
				{
					title: "Review: Objects and Classes: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Review: Objects and Classes",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Review: Objects and Classes supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ3 Review: Objects and Classes",
						itemTitle: "Review: Objects and Classes supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/solution"
				},
				{
					title: "Review: Objects and Classes supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ3 Review: Objects and Classes",
						itemTitle: "Review: Objects and Classes supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ4 Recursion",
			curriculum: [
				{
					title: "Recursion",
					content: `**Concept path:** Recursive methods solve a problem by calling themselves on a smaller version of the same problem. Each method needs a base case that stops the chain and a recursive case that moves toward that stop condition.

**Practice targets:** Identify the base case, identify what gets smaller, trace several calls by hand, and compare the recursive solution with an iterative loop when both versions are reasonable.

**Evidence target:** A recursive method is valid when every allowed input eventually reaches a base case and each returned value contributes to the larger answer correctly.`
				},
				{
					title: "Sum of the First N Numbers",
					content: `**Concept path:** Summing the first n numbers is a compact recursion example because sum(n) can be described as n plus sum(n - 1), with sum(1) as a natural stopping point.

**Practice targets:** Trace sum(4) or sum(5) as a stack of calls, then unwind the returns in the opposite direction. Compare that trace with a loop that accumulates the same total.

**Evidence target:** The trace shows both the downward call phase and the upward return phase, not just the final numeric answer.`
				},
				{
					title: "Call Stack",
					content: `**Concept path:** Every method call gets a stack frame containing its local variables and return location. Recursion creates many frames, so missing or unreachable base cases can produce stack overflow.

**Practice targets:** Draw stack frames for a short recursive call, label the parameter values in each frame, and identify exactly where execution resumes after a recursive call returns.

**Evidence target:** Stack reasoning explains why recursion can be elegant but not free: each call has memory and control-flow overhead.`
				},
				{
					title: "AJ4 Project 1: Recursion Practice",
					content: `**Project target:** Implement several recursive methods that use different recursive patterns: numeric countdown, digit decomposition, branching recursion, and string narrowing.

**Build path:** Create methods for exponents, factorials, digit sums, Fibonacci numbers, and palindrome checking. For each method, write the base case first, then define how the input moves closer to it.

**Evidence target:** Each method includes small test calls whose answers can be checked mentally, plus at least one edge case such as zero, one, an empty string, or a one-character string.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "AJ4 Project 2: Divisible by 7",
					content: `**Project target:** Implement a recursive divisibility-by-7 test that reduces a large number into a smaller value while preserving whether divisibility holds.

**Build path:** Encode the divisibility rule carefully, print or trace intermediate values during early testing, and stop at a small enough base case to decide true or false.

**Evidence target:** The method agrees with direct modulo checks for several positive numbers, including values that are divisible by 7, not divisible by 7, and already small.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7"
				}
			],
			supplementalProjects: [
				{
					title: "Recursion: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Recursion",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "Recursion supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ4 Recursion",
						itemTitle: "Recursion supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/solution"
				},
				{
					title: "Recursion supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ4 Recursion",
						itemTitle: "Recursion supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ5 Linear Search and Big-O Notation",
			curriculum: [
				{
					title: "Linear Search",
					content: `**Concept path:** Linear search scans a collection one item at a time. It works on unsorted data, sorted data, arrays, ArrayLists, and many other sequential structures because it makes no ordering assumption.

**Practice targets:** Trace searches where the target is first, middle, last, and missing. Return either the matching index, the matching value, or a boolean result depending on the method contract.

**Evidence target:** Runtime reasoning distinguishes best case, worst case, and average case rather than treating every search as the same amount of work.`
				},
				{
					title: "AJ5 Project 1: Linear Search Implementation",
					content: `**Project target:** Implement a linear search method with a clear contract: return the target index when found and -1 when absent.

**Build path:** Traverse from left to right, check each element once, return immediately when the target is found, and return -1 only after the loop finishes without a match.

**Evidence target:** Tests cover the first index, a later index, repeated values, a missing value, and an empty array if the method accepts one.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Introduction to Big-O Analysis",
					content: `**Concept path:** Big-O notation describes how runtime or memory use grows as input size grows. It ignores constant factors and lower-order terms so algorithms can be compared by their long-term growth pattern.

**Practice targets:** Classify constant, logarithmic, linear, linearithmic, quadratic, and exponential patterns. Simplify expressions by keeping the dominant term and dropping constants.

**Evidence target:** A runtime claim is tied to a counted operation, a variable input size, and a reason the dominant term controls growth.`
				},
				{
					title: "AJ5 Project 2: Big-O Practice",
					content: `**Project target:** Analyze runtime expressions and connect each simplified Big-O result to a concrete algorithm pattern.

**Build path:** For each expression, identify the dominant term, remove constants, and explain what kind of code shape could produce that growth, such as one loop, nested loops, repeated halving, or recursive branching.

**Evidence target:** The explanation is stronger than the label alone because it links the notation to a real control-flow pattern.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Linear Search and Big O Notation: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Linear Search and Big O Notation",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Linear Search and Big O Notation supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ5 Linear Search and Big-O Notation",
						itemTitle:
							"Linear Search and Big O Notation supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/solution"
				},
				{
					title: "Linear Search and Big O Notation supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ5 Linear Search and Big-O Notation",
						itemTitle:
							"Linear Search and Big O Notation supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ6 Binary Search",
			curriculum: [
				{
					title: "Binary Search",
					content: `**Concept path:** Binary search relies on sorted data. Each comparison with the middle element eliminates half of the remaining search interval because the sorted order proves where the target cannot be.

**Practice targets:** Trace low, high, and mid values for found and missing targets. Include cases where the target is below all values, above all values, at the first element, and at the last element.

**Evidence target:** Correct binary search reasoning always names the sorted-data precondition and explains why each discarded half is safe to ignore.`
				},
				{
					title: "AJ6 Project 1: Binary Search with Iteration",
					content: `**Project target:** Implement iterative binary search with lower and upper bounds that shrink after every comparison.

**Build path:** Initialize bounds, calculate the midpoint safely, compare the middle value with the target, update one bound, and stop when the target is found or the interval becomes empty.

**Evidence target:** Tests cover odd and even array lengths, missing values, boundary values, and arrays with one element.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration"
				},
				{
					title: "AJ6 Project 2: Binary Search with Recursion",
					content: `**Project target:** Implement recursive binary search using either bounds parameters or smaller subarrays.

**Build path:** Treat an empty interval as the missing-target base case, treat a matching midpoint as the found-target base case, and recurse only into the half where the target could still exist.

**Evidence target:** The recursive version produces the same answers as the iterative version and terminates for missing targets as well as found targets.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Recursion",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Recursion"
				},
				{
					title: "Binary Search Big-O Analysis",
					content: `**Concept path:** Binary search has logarithmic runtime because each unsuccessful comparison halves the remaining search interval. Doubling the input size adds about one more comparison rather than doubling the work.

**Practice targets:** Compare the maximum number of checks for arrays of size 8, 16, 32, and 1024. Then contrast that growth with linear search on the same sizes.

**Evidence target:** The analysis connects repeated halving to logarithms and also names the cost of the precondition: the data must already be sorted or sorted before searching.`
				},
				{
					title: "AJ6 Project 3: Precise Square Roots",
					content: `**Project target:** Use binary-search reasoning on a numeric interval to approximate square roots.

**Build path:** Maintain low and high numeric bounds, test the midpoint by squaring it, and shrink the interval until the approximation reaches the chosen precision.

**Evidence target:** The method handles perfect squares, non-perfect squares, values between 0 and 1, and values greater than 1 with a documented precision tolerance.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Precision-Square-Root",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Precision-Square-Root"
				}
			],
			supplementalProjects: [
				{
					title: "Binary Search: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Binary Search",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration"
				},
				{
					title: "Binary Search supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ6 Binary Search",
						itemTitle: "Binary Search supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-09-aj6-binary-search-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-09-aj6-binary-search-supplemental-2/solution"
				},
				{
					title: "Binary Search supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ6 Binary Search",
						itemTitle: "Binary Search supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-10-aj6-binary-search-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-10-aj6-binary-search-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: `**Check-in target:** This review connects recursion, time complexity, linear search, and binary search into one algorithmic reasoning checkpoint.

**Practice targets:** Explain what the code does, trace the important variables, identify the stopping condition, and connect the implementation to its runtime.

**Evidence target:** Strong answers include both the result and the reason: what value is returned or printed, why termination occurs, and how input size changes the amount of work.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1"
				},
				{
					title: "Check-In #1: Recursion",
					content: `**Concept path:** Recursion questions test the ability to identify a base case, verify progress toward it, and trace how values return through the call stack.

**Practice targets:** Analyze recursive string length, Pascal-style recurrence, and recursive printing. Look for unchanged recursive calls because they signal infinite recursion.

**Evidence target:** A correct trace shows the order of calls and the order of returns; for printing methods, it also shows whether output occurs before or after the recursive call.`
				},
				{
					title: "Check-In #1: Time Complexity",
					content: `**Concept path:** Time-complexity questions reduce code or formulas to growth categories. The key is identifying which operation is being counted and how many times it runs as input grows.

**Practice targets:** Simplify expressions, compare best and worst cases, and classify loops, nested loops, repeated halving, and recursive branching.

**Evidence target:** Each answer includes a short reason tied to a loop bound, recursive split, or counted operation rather than only the final notation.`
				},
				{
					title: "Check-In #1: Linear Search",
					content: `**Concept path:** Linear search is useful when no sorted-order guarantee exists or when the collection is small enough that a simple scan is appropriate.

**Practice targets:** Complete unfinished search code, identify the return value for found and missing targets, and describe best case and worst case in terms of target position.

**Evidence target:** The implementation does not return "missing" too early and does not read beyond the final valid index.`
				},
				{
					title: "Check-In #1: Binary Search",
					content: `**Concept path:** Binary search combines sorted-data reasoning with careful bound updates. Small off-by-one mistakes can skip the target or create a loop that never ends.

**Practice targets:** Complete iterative and recursive versions, trace low, high, and mid, and compare logarithmic growth with the linear growth of a full scan.

**Evidence target:** The algorithm handles missing values and boundary values while preserving the sorted-data precondition.`
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: `**Project target:** Compare observed search times for linear search and binary search across many repeated runs.

**Build path:** Generate or load a large sorted array, select targets in several positions, time many searches with millisecond or nanosecond timestamps, and average results to reduce noise.

**Evidence target:** The written comparison separates measured timing from theoretical Big-O and explains why small runs may not visibly match the long-term growth prediction.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check In #1",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1"
				},
				{
					title: "Check In #1 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-11-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-11-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-12-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-12-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ7 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content: `**Concept path:** Selection sort divides a collection into a sorted prefix and an unsorted remainder. Each pass selects the smallest or largest remaining value and moves it into the next final position.

**Practice targets:** Trace the sorted boundary, the current candidate index, and the swap at the end of each pass. Include lists that are already sorted, reverse sorted, random, and contain duplicate values.

**Evidence target:** A correct trace shows that one more element reaches its final position after every outer-loop pass, even when the rest of the list is still unsorted.`
				},
				{
					title: "AJ7 Project 1: Selection Sort",
					content: `**Project target:** Implement selection sort and make the pass-by-pass behavior visible enough to debug.

**Build path:** Generate test values, find the smallest remaining value during each pass, move or swap it into the next sorted position, and print the list after selected passes while the algorithm is being verified.

**Evidence target:** Tests cover random values, duplicates, negative values, an already sorted list, and a reverse-sorted list. The final list is sorted, and intermediate traces match the selection-sort invariant.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Selection-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Selection-Sort"
				},
				{
					title: "Selection Sort Big-O Analysis",
					content: `**Concept path:** Selection sort performs a full scan of the unsorted remainder on each pass. The number of comparisons forms a decreasing sum, which still grows quadratically with input size.

**Practice targets:** Count comparisons for small lists, then generalize the pattern to n values. Separate comparison cost from swap cost, because selection sort performs many comparisons but relatively few swaps.

**Evidence target:** The analysis distinguishes time complexity from space complexity and explains whether the chosen implementation sorts in place or builds a separate output list.`
				},
				{
					title: "Insertion Sort",
					content: `**Concept path:** Insertion sort grows a sorted prefix by taking the next unsorted value and shifting larger values to make room for it. It is especially useful for nearly sorted data because values often move only a short distance.

**Practice targets:** Trace the current value, the shifting index, and the sorted prefix after each pass. Compare behavior on sorted, nearly sorted, reverse-sorted, and duplicate-heavy lists.

**Evidence target:** A correct trace shows that the prefix is sorted after every pass, even though values to the right of the prefix have not been processed yet.`
				},
				{
					title: "AJ7 Project 2: Insertion Sort",
					content: `**Project target:** Implement in-place insertion sort on an array and compare how much movement different input orders create.

**Build path:** Store the current value, shift larger values one position to the right, insert the current value into the open position, and print enough intermediate states to confirm the sorted-prefix invariant.

**Evidence target:** Tests show minimal movement for sorted or nearly sorted input and much more movement for reverse-sorted input. The implementation handles duplicates without losing values.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Insertion-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Insertion-Sort"
				},
				{
					title: "Insertion Sort Big-O Analysis",
					content: `**Concept path:** Insertion sort has quadratic worst-case time, but its best case is linear when the input is already sorted. This makes input order more important for insertion sort than for selection sort.

**Practice targets:** Count comparisons and shifts separately for sorted, nearly sorted, and reverse-sorted examples. Then compare those counts with selection sort's more consistent comparison pattern.

**Evidence target:** The runtime explanation names both the best-case and worst-case conditions instead of assigning one fixed amount of work to every input.`
				}
			],
			supplementalProjects: [
				{
					title: "AJ7 Supplemental Project 1: Biggest to Smallest Bookshelf",
					content: `**Project target:** Sort a bookshelf represented by page counts or book records from largest to smallest.

**Build path:** Store the data in an ArrayList, adapt selection sort to choose the largest remaining value, and keep book identity attached to the page count when records include more than one field.

**Evidence target:** The output preserves every original book, orders equal page counts predictably, and explains how descending order changes the comparison from the ascending version.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Biggest-to-Smallest-Bookshelf",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Biggest-to-Smallest-Bookshelf"
				},
				{
					title: "Selection and Insertion Sort supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ7 Selection and Insertion Sort",
						itemTitle:
							"Selection and Insertion Sort supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-13-aj7-selection-and-insertion-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-13-aj7-selection-and-insertion-sort-supplemental-2/solution"
				},
				{
					title: "Selection and Insertion Sort supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ7 Selection and Insertion Sort",
						itemTitle:
							"Selection and Insertion Sort supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-14-aj7-selection-and-insertion-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-14-aj7-selection-and-insertion-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ8 Bubble Sort",
			curriculum: [
				{
					title: "Bubble Sort",
					content: `**Concept path:** Bubble sort repeatedly compares adjacent values and swaps them when they are out of order. After each full pass, one extreme value has moved into its final region.

**Practice targets:** Trace adjacent comparisons, swaps, and the sorted tail after each pass. Include an early-stop flag so a pass with no swaps can end the algorithm.

**Evidence target:** The trace explains why the inner loop can shrink after each pass and why a no-swap pass proves the list is already sorted.`
				},
				{
					title: "AJ8 Project 1: Bubble Sort Implementation",
					content: `**Project target:** Implement bubble sort, then improve the implementation by reducing unnecessary comparisons.

**Build path:** Begin with a clear adjacent-swap implementation, verify it on small printed lists, then add a shrinking inner bound and an optional swapped flag for early termination.

**Evidence target:** The project shows the same final sorted result before and after optimization, while the optimized version performs fewer comparisons on already sorted or nearly sorted input.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort"
				},
				{
					title: "Bubble Sort Big-O Analysis",
					content: `**Concept path:** Bubble sort is quadratic in the average and worst case because adjacent comparisons happen across many passes. With an early-stop flag, its best case can be linear for already sorted input.

**Practice targets:** Count comparisons and swaps separately, then compare bubble sort with selection sort and insertion sort on sorted, reverse-sorted, and random lists.

**Evidence target:** The analysis identifies the optimization's benefit without overstating it: bubble sort remains inefficient for large random lists even when simple improvements are added.`
				},
				{
					title: "AJ8 Project 2: Alphabetical Order",
					content: `**Project target:** Adapt bubble sort from numeric values to strings so words can be ordered alphabetically.

**Build path:** Store words in an ArrayList<String>, compare adjacent words with compareTo(), swap out-of-order strings, and decide how capitalization or punctuation will be handled.

**Evidence target:** Tests include lowercase words, mixed-case words if supported, repeated words, and words that are already in order. The comparison rule is stated clearly enough to explain any surprising order.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Alphabetical-Order-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Alphabetical-Order"
				}
			],
			supplementalProjects: [
				{
					title: "Bubble Sort: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Bubble Sort",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort"
				},
				{
					title: "Bubble Sort supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ8 Bubble Sort",
						itemTitle: "Bubble Sort supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-15-aj8-bubble-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-15-aj8-bubble-sort-supplemental-2/solution"
				},
				{
					title: "Bubble Sort supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ8 Bubble Sort",
						itemTitle: "Bubble Sort supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-16-aj8-bubble-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-16-aj8-bubble-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ9 Merge Sort",
			curriculum: [
				{
					title: "Merge Sort",
					content: `**Concept path:** Merge sort is a divide-and-conquer algorithm. It recursively splits a list into smaller pieces, treats one-element lists as already sorted, and merges sorted pieces back into a sorted result.

**Practice targets:** Draw the split tree and the merge steps for a short list. Keep the divide phase separate from the conquer phase so the recursion structure is clear.

**Evidence target:** The explanation shows why merge sort is not just "sorting twice": the merge step depends on both halves already being sorted.`
				},
				{
					title: "AJ9 Project 1: Merge Method",
					content: `**Project target:** Implement the merge helper that combines two sorted lists into one sorted output list.

**Build path:** Track one index for each input list, repeatedly copy the smaller current value, and append the remainder of the non-empty list after the other list is exhausted.

**Evidence target:** The method works for empty lists, one empty list, duplicates, negative values, and uneven list lengths. A failing input where either half is unsorted is recognized as a precondition issue.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge"
				},
				{
					title: "AJ9 Project 2: Split Method",
					content: `**Project target:** Build the recursive split phase that divides a list until each sublist is small enough to be considered sorted.

**Build path:** Define the base case for size 0 or 1, calculate the middle index, create left and right sublists, and recursively split each side.

**Evidence target:** Printed or logged structure shows that every original value appears in exactly one leaf sublist, with no lost or duplicated values during splitting.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Split",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Split"
				},
				{
					title: "AJ9 Project 3: Merge Sort",
					content: `**Project target:** Combine recursive splitting and the merge helper into a complete merge sort implementation.

**Build path:** Return immediately for lists of size 0 or 1, recursively sort the left and right halves, then merge the sorted halves into a new sorted list.

**Evidence target:** The implementation produces sorted output for random, sorted, reverse-sorted, duplicate-heavy, and small edge-case lists, and the original size is preserved.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge-Sort"
				},
				{
					title: "Merge Sort Big-O Analysis",
					content: `**Concept path:** Merge sort performs logarithmically many split levels, and each level performs linear merge work. The result is O(n log n) time for typical implementations.

**Practice targets:** Count split levels for powers of two, identify the linear work at each level, and compare the growth with quadratic sorting algorithms on larger input sizes.

**Evidence target:** The analysis includes both time and space costs: merge sort is faster on large random lists than simple quadratic sorts, but it usually requires extra storage for temporary lists or arrays.`
				}
			],
			supplementalProjects: [
				{
					title: "Merge Sort: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Merge Sort",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge"
				},
				{
					title: "Merge Sort supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ9 Merge Sort",
						itemTitle: "Merge Sort supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-17-aj9-merge-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-17-aj9-merge-sort-supplemental-2/solution"
				},
				{
					title: "Merge Sort supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ9 Merge Sort",
						itemTitle: "Merge Sort supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-18-aj9-merge-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-18-aj9-merge-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content: `**Check-in target:** This review compares selection sort, insertion sort, bubble sort, and merge sort by behavior, implementation pattern, and runtime growth.

**Practice targets:** Trace each algorithm on a short list, name its invariant, identify the source of its runtime cost, and compare how input order affects the amount of work.

**Evidence target:** Strong comparisons explain not only which algorithm is faster, but why its control flow produces that growth pattern.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2"
				},
				{
					title: "Check-In #2: Selection Sort",
					content: `**Concept path:** Selection sort questions focus on selecting an extreme value from the unsorted region and placing it into the next final position.

**Practice targets:** Predict the array state after specific passes, complete missing loop logic, and identify whether the implementation sorts in place or creates a separate result.

**Evidence target:** The answer names the sorted boundary and explains why the selected value is final after the pass ends.`
				},
				{
					title: "Check-In #2: Insertion Sort",
					content: `**Concept path:** Insertion sort questions focus on the sorted prefix and the shifts needed to insert the next value.

**Practice targets:** Trace several passes, complete the shifting loop, and compare best-case and worst-case behavior with selection sort.

**Evidence target:** The trace preserves all values during shifting and shows the current value being inserted into the correct open position.`
				},
				{
					title: "Check-In #2: Bubble Sort",
					content: `**Concept path:** Bubble sort questions focus on adjacent swaps, pass boundaries, and optimization through shrinking bounds or early stopping.

**Practice targets:** Complete nested-loop logic, identify when a swap occurs, and reason about how many passes are needed before the sorted region is guaranteed.

**Evidence target:** The explanation connects adjacent swaps to sorted-tail growth and distinguishes best-case behavior from average or worst-case behavior.`
				},
				{
					title: "Check-In #2: Merge Sort",
					content: `**Concept path:** Merge sort questions test both recursive structure and the merge precondition that each half is already sorted.

**Practice targets:** Merge sorted sublists by hand, complete base-case and recursive-call logic, and explain why the algorithm grows as O(n log n).

**Evidence target:** The answer separates the cost of dividing from the cost of merging and avoids treating merge sort as another quadratic pass-based sort.`
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: `**Project target:** Measure several sorting algorithms on different input sizes and compare observed timing with theoretical runtime.

**Build path:** Generate repeatable input arrays, run each algorithm multiple times, average the timing results, and test several sizes large enough for growth patterns to become visible.

**Evidence target:** The comparison explains measurement noise, input-order effects, and the difference between timing a small example and analyzing asymptotic growth.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check In #2",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2"
				},
				{
					title: "Check In #2 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-19-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-19-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-20-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-20-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ10 Sustainable Programming",
			curriculum: [
				{
					title: "Nested Classes",
					content:
						"Compare static nested classes and inner classes, and learn when a HAS-A relationship makes nested classes a good fit."
				},
				{
					title: "AJ10 Project 1: Bakery Model",
					content:
						"Use nested classes to model a bakery, its workers, and its baked goods, then collect input and print the resulting bakery state.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery"
				},
				{
					title: "Generics",
					content:
						"Learn how generic type placeholders such as `T` let one class work with many kinds of data without committing to a concrete type in advance."
				},
				{
					title: "AJ10 Project 2: Anything Array",
					content:
						"Create a generic `Node`-style wrapper class, test it with several object types, and store those generic nodes inside an array.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Anything-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Anything-Array"
				},
				{
					title: "Exception Handling",
					content:
						"Review checked versus runtime exceptions, custom exceptions, `try-catch` blocks, and the difference between handling an exception immediately and declaring it with `throws`."
				},
				{
					title: "AJ10 Project 3: Exception Practice",
					content:
						"Handle file, input, null, and arithmetic exceptions, and create a custom `DivideByZeroException` for more precise error reporting.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exception-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exception-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Sustainable Programming: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Sustainable Programming",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery"
				},
				{
					title: "Sustainable Programming supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ10 Sustainable Programming",
						itemTitle: "Sustainable Programming supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-21-aj10-sustainable-programming-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-21-aj10-sustainable-programming-supplemental-2/solution"
				},
				{
					title: "Sustainable Programming supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ10 Sustainable Programming",
						itemTitle: "Sustainable Programming supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-22-aj10-sustainable-programming-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-22-aj10-sustainable-programming-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ11 Linked Lists",
			curriculum: [
				{
					title: "Introduction to Linked Lists",
					content:
						"Compare linked lists with arrays and `ArrayList`s, focusing on how nodes and references make insertion and deletion easier at the cost of direct indexing."
				},
				{
					title: "Singly Linked Lists",
					content:
						"Review heads, nodes, links, and one-directional traversal in a singly linked list."
				},
				{
					title: "AJ11 Project 1: Singly Linked List",
					content:
						"Implement a singly linked list from starter code, write its inner `Node` class, and build out the methods defined in the interface.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List"
				},
				{
					title: "Doubly Linked Lists",
					content:
						"Compare doubly linked lists with singly linked lists, focusing on head and tail references plus links in both directions."
				},
				{
					title: "AJ11 Project 2: Doubly Linked List",
					content:
						"Extend the linked list implementation to support both next and previous links, a tail reference, and more efficient inserts and deletions.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Doubly-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Doubly-Linked-List"
				}
			],
			supplementalProjects: [
				{
					title: "Linked Lists: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Linked Lists",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List"
				},
				{
					title: "Linked Lists supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ11 Linked Lists",
						itemTitle: "Linked Lists supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-23-aj11-linked-lists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-23-aj11-linked-lists-supplemental-2/solution"
				},
				{
					title: "Linked Lists supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ11 Linked Lists",
						itemTitle: "Linked Lists supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-24-aj11-linked-lists-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-24-aj11-linked-lists-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ12 Stacks and Queues",
			curriculum: [
				{
					title: "Stacks",
					content:
						"Learn how stacks use Last In First Out behavior and support operations such as `push`, `pop`, `top`, and `empty`."
				},
				{
					title: "AJ12 Project 1: Implementing a Stack",
					content:
						"Implement a stack with array storage, a top pointer, and checks for overflow and underflow.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Stack-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Stack"
				},
				{
					title: "Queues",
					content:
						"Learn how queues use First In First Out behavior and support `enqueue`, `dequeue`, `front`, and `empty`."
				},
				{
					title: "AJ12 Project 2: Implementing a Queue",
					content:
						"Implement a queue using an array with wrapping indices so that the structure behaves like a circular buffer.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Queue-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Queue"
				}
			],
			supplementalProjects: [
				{
					title: "AJ12 Supplemental Project 1: Valid Parentheses",
					content:
						"Use a stack to determine whether parentheses, brackets, and braces are balanced and properly nested.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Valid-Parentheses",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Valid-Parentheses"
				},
				{
					title: "AJ12 Supplemental Project 2: Calculator with Stacks",
					content:
						"Build a stack-based calculator that treats operators as commands acting on the most recently entered numbers.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Calculator-with-Stacks",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Calculator-with-Stacks"
				},
				{
					title: "AJ12 Supplemental Project 3: Implementing a Deque",
					content:
						"Extend queue ideas into a double-ended queue implemented with a circular array.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Deque-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Deque"
				}
			]
		},
		{
			title: "AJ13 Priority Queues and Maps",
			curriculum: [
				{
					title: "Priority Queues",
					content:
						"Learn how priority queues differ from regular queues by removing highest-priority items first rather than strictly honoring insertion order."
				},
				{
					title: "Using a Java Priority Queue",
					content:
						"Practice the Java `PriorityQueue` API, including adding, peeking, polling, removing, iterating, checking membership, and converting the queue into an array.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Priority-Queue"
				},
				{
					title: "AJ13 Project 1: Class Rank",
					content:
						"Create a `Student` class and a comparator that orders `Student` objects by GPA, then use a priority queue to print the records from highest GPA to lowest.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Class-Rank",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Class-Rank"
				},
				{
					title: "Maps",
					content:
						"Review key-value storage with maps, compare ordered and unordered implementations, and practice the core operations for insertion, retrieval, updates, and iteration."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice the Java `Map` API with `HashMap` and `TreeMap`, including creation, insertion, lookup, removal, and iteration through keys and values.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Maps"
				},
				{
					title: "AJ13 Project 2: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and identify the most frequent character.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Letter-Frequencies",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Letter-Frequencies"
				}
			],
			supplementalProjects: [
				{
					title: "Priority Queues and Maps: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Priority Queues and Maps",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Priority-Queue"
				},
				{
					title: "Priority Queues and Maps supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ13 Priority Queues and Maps",
						itemTitle: "Priority Queues and Maps supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-25-aj13-priority-queues-and-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-25-aj13-priority-queues-and-maps-supplemental-2/solution"
				},
				{
					title: "Priority Queues and Maps supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ13 Priority Queues and Maps",
						itemTitle: "Priority Queues and Maps supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-26-aj13-priority-queues-and-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-26-aj13-priority-queues-and-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Check-In #3 Overview",
					content:
						"Use this check-in to revisit sustainable programming ideas, linked lists, stacks, queues, priority queues, and maps through a mix of short explanations and code extensions.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3"
				},
				{
					title: "Check-In #3: Sustainable Programming",
					content:
						"Review nested classes, generics, and exception handling by building a nested `Riddle` class, a generic `Triple` class, and custom exception logic."
				},
				{
					title: "Check-In #3: Linked Lists",
					content:
						"Compare singly and doubly linked lists, complete `Node` class structures, add methods such as `indexOf()` and `remove()`, and test those methods on real lists."
				},
				{
					title: "Check-In #3: Stacks",
					content:
						"Review stack operations, LIFO behavior, and how stacks can process edit-style input such as backspaces in a stream of key presses."
				},
				{
					title: "Check-In #3: Queues",
					content:
						"Review queue operations, FIFO behavior, the idea of a priority queue, and examples where queue-based processing is useful."
				},
				{
					title: "Check-In #3: Maps",
					content:
						"Review map creation, iteration, membership checks, duplicate-key behavior, and practical use cases for key-value storage."
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Take a queue of names, reverse it with a stack, then sort it alphabetically with a priority queue, printing the queue after each transformation.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Additional-Practice-Project-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #3: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check In #3",
						section: "extension"
					}),
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3"
				},
				{
					title: "Check In #3 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #3",
						itemTitle: "Check In #3 supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-27-check-in-3-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-27-check-in-3-supplemental-2/solution"
				},
				{
					title: "Check In #3 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #3",
						itemTitle: "Check In #3 supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-28-check-in-3-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-28-check-in-3-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ14 Binary Search Trees",
			curriculum: [
				{
					title: "Trees",
					content:
						"Core tree vocabulary includes nodes, edges, parents, children, ancestors, descendants, leaves, roots, height, and subtrees."
				},
				{
					title: "Binary Search Trees",
					content:
						"Review how BSTs organize values so smaller items go left and larger items go right, enabling efficient search, insert, and remove operations."
				},
				{
					title: "BST Practice Problems",
					content:
						"Practice inserting and deleting nodes from drawn binary search trees and reason through in-order predecessor replacement."
				},
				{
					title: "AJ14 Project 1: BST Basic Implementation",
					content:
						"Write the `Node` inner class, core BST instance variables, and basic methods such as insert and membership testing.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-Basic-BST"
				},
				{
					title: "Depth First Search",
					content:
						"Use depth-first traversal to print a BST in preorder, inorder, and postorder, and understand how each traversal changes only the print order, not the path taken through the tree."
				},
				{
					title: "AJ14 Project 2: BST Traversals",
					content:
						"Implement preorder, inorder, and postorder traversals and use inorder traversal to define `toString()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Traversals",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Traversals"
				},
				{
					title: "AJ14 Project 3: BST Clear and Remove",
					content:
						"Add recursive clear and remove operations to the BST, including removal cases for nodes with zero, one, or two children.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST"
				}
			],
			supplementalProjects: [
				{
					title: "Binary Search Trees: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Binary Search Trees",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-Basic-BST"
				},
				{
					title: "Binary Search Trees supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ14 Binary Search Trees",
						itemTitle: "Binary Search Trees supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-29-aj14-binary-search-trees-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-29-aj14-binary-search-trees-supplemental-2/solution"
				},
				{
					title: "Binary Search Trees supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ14 Binary Search Trees",
						itemTitle: "Binary Search Trees supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-30-aj14-binary-search-trees-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-30-aj14-binary-search-trees-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ15 Hash Tables",
			curriculum: [
				{
					title: "Hash Tables",
					content:
						"Learn how hash tables implement maps by storing key-value pairs in buckets chosen by hash functions, ideally enabling near-constant-time lookup."
				},
				{
					title: "Writing a Hash Function",
					content:
						"Review the properties of good hash functions, polynomial combinations, and how modulo compression maps a hash code into the table's bounds."
				},
				{
					title: "Dealing with Collisions",
					content:
						"Compare separate chaining with open addressing, and focus on linear probing plus tombstones as the strategy used in this course."
				},
				{
					title: "Rehashing",
					content:
						"Track load factor and resize the table when it becomes too full by rehashing items into a larger prime-sized array."
				},
				{
					title: "AJ15 Project 1: HashMap",
					content:
						"Implement a custom `HashMap` with linear probing, tombstones, rehashing, and the usual map operations.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map"
				},
				{
					title: "AJ15 Project 2: Mini Search Engine",
					content:
						"Use the custom `HashMap`, file reading, and string splitting to build a simple keyword search engine over a text corpus of URLs and tags.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Search-Engine-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Search-Engine"
				}
			],
			supplementalProjects: [
				{
					title: "Hash Tables: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Hash Tables",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map"
				},
				{
					title: "Hash Tables supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ15 Hash Tables",
						itemTitle: "Hash Tables supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-31-aj15-hash-tables-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-31-aj15-hash-tables-supplemental-2/solution"
				},
				{
					title: "Hash Tables supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ15 Hash Tables",
						itemTitle: "Hash Tables supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-32-aj15-hash-tables-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-32-aj15-hash-tables-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ16 Graphs",
			curriculum: [
				{
					title: "Graphs",
					content:
						"Learn how graphs use vertices and edges to represent relationships, and compare directed, undirected, weighted, and tree-like graph structures."
				},
				{
					title: "Representing a Graph",
					content:
						"Compare adjacency lists, adjacency matrices, and incidence lists, and discuss when each representation is most useful."
				},
				{
					title: "AJ16 Project 1: Basic Graph Implementation",
					content:
						"Implement a graph with a `HashMap` of adjacency lists, add vertices and edges, and test the result through a `toString()` method and a simple main program.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Simple-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Simple-Graph"
				},
				{
					title: "Dijkstra's Shortest Path Algorithm",
					content:
						"Learn how Dijkstra's algorithm uses distances, visited vertices, and a priority queue to find shortest paths in weighted graphs with positive edge weights."
				},
				{
					title: "AJ16 Project 2: Dijkstra's Shortest Path",
					content:
						"Use a completed `Vertex` class, an adjacency matrix, and a priority queue to compute shortest paths and reconstruct the shortest path tree.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Dijkstras-Shortest-Path-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Dijkstras-Shortest-Path"
				}
			],
			supplementalProjects: [
				{
					title: "AJ16 Supplemental Project 1: Eulerian Mail Circuit",
					content:
						"Use graph traversal and vertex degree analysis to determine whether a graph has a Eulerian path, a Eulerian cycle, or neither.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Eulerian-Mail-Circuit",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Eulerian-Mail-Circuit"
				},
				{
					title: "Graphs supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ16 Graphs",
						itemTitle: "Graphs supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-33-aj16-graphs-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-33-aj16-graphs-supplemental-2/solution"
				},
				{
					title: "Graphs supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ16 Graphs",
						itemTitle: "Graphs supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-34-aj16-graphs-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-34-aj16-graphs-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #4",
			curriculum: [
				{
					title: "Check-In #4 Overview",
					content:
						"Use this final check-in to review binary search trees, hash tables, and graphs, along with the main vocabulary and algorithm ideas from those topics.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4"
				},
				{
					title: "Check-In #4: Binary Search Trees",
					content:
						"Review BST ordering rules, traversal orders, insertion and deletion practice, and why BSTs are useful for ordered lookup structures."
				},
				{
					title: "Check-In #4: Hash Tables",
					content:
						"Explain how hash tables work, compute load factors, compare collision-handling strategies, and identify when rehashing is necessary."
				},
				{
					title: "Check-In #4: Graphs",
					content:
						"Define graphs and graph vocabulary, build adjacency lists and matrices, compare sparse versus dense representations, and describe Dijkstra's algorithm at a high level."
				},
				{
					title: "Check-In #4: Additional Practice Project",
					content:
						"Extend a BST with a breadth-first search method that prints nodes level by level using a queue.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #4: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check In #4",
						section: "extension"
					}),
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4"
				},
				{
					title: "Check In #4 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #4",
						itemTitle: "Check In #4 supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-35-check-in-4-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-35-check-in-4-supplemental-2/solution"
				},
				{
					title: "Check In #4 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Check-In #4",
						itemTitle: "Check In #4 supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-36-check-in-4-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-36-check-in-4-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ17 Master Project: Google Maps",
			curriculum: [
				{
					title: "Introduction to Street Searcher",
					content:
						"Review a Google-Maps-style shortest path tool that loads locations and distances into a weighted graph and uses Dijkstra's algorithm to find routes."
				},
				{
					title: "AJ17 Project 1: Weighted Graph",
					content:
						"Create a weighted graph implementation that will support the street searcher project.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph"
				},
				{
					title: "AJ17 Project 2: Loading Data",
					content:
						"Read location data from files, store locations in a `HashMap`, and connect those locations in the weighted graph using location names as vertices.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Loading-Data-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Loading-Data"
				},
				{
					title: "AJ17 Project 3: Finding Shortest Paths",
					content:
						"Complete the street searcher by running Dijkstra's algorithm on the loaded graph, printing the shortest path, and refining the user interface and error handling.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including recursion, searching, sorting, OOP review, generics, exceptions, linked lists, stacks, queues, priority queues, maps, trees, hash tables, and graphs."
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Google Maps: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Master Project: Google Maps",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph"
				},
				{
					title: "Master Project: Google Maps supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ17 Master Project: Google Maps",
						itemTitle: "Master Project: Google Maps supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-37-aj17-master-project-google-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-37-aj17-master-project-google-maps-supplemental-2/solution"
				},
				{
					title: "Master Project: Google Maps supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ17 Master Project: Google Maps",
						itemTitle: "Master Project: Google Maps supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-38-aj17-master-project-google-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-38-aj17-master-project-google-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ18 Repo Extension, Starter, and Capstone Library",
			curriculum: [
				{
					title: "Classify the Extra Java Level 3 Folders",
					content:
						"The remaining `Java-Level-3` folders are a mix of starter scaffolds, reference implementations, and optional advanced labs. The public course surfaces the useful ones without forcing every starter and check-in into the core path."
				},
				{
					title: "Data-Structures Reinforcement without Clutter",
					content:
						"Use the extra linked-list, stack, queue, hash-table, and graph folders for more depth on one structure family after the main module is already complete."
				},
				{
					title: "Capstone Support Material",
					content:
						"Keep the `AJ17` starters and side folders visible as capstone support, not as hidden repo drift. The Google Maps branch should have supporting scaffolds that are easy to find when deeper extension work is useful."
				},
				{
					title: "Repo Extension, Starter, and Capstone Library: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"Repo Extension, Starter, and Capstone Library",
						section: "verification"
					})
				},
				{
					title: "AJ18 Repo Extension, Starter, and Capstone Library: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"AJ18 Repo Extension, Starter, and Capstone Library",
						itemTitle:
							"AJ18 Repo Extension, Starter, and Capstone Library: Core Project",
						projectKind: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exceptions"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: Exceptions Reference Lab",
					content:
						"Use the standalone exceptions folder for a cleaner error-handling example than the larger bakery or data-structures projects.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exceptions"
				},
				{
					title: "Extension: Nested Classes",
					content:
						"Nested classes provide an optional design extension for understanding how helper types can live inside larger structures.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Nested-Classes"
				},
				{
					title: "Reference: Node Class",
					content:
						"Keep the node-class reference visible because it supports the linked-list, tree, and graph sections that arrive later in the course.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Node-Class"
				},
				{
					title: "Extension: Separate Chaining Hash Table",
					content:
						"The separate-chaining implementation adds one more explicit collision-handling model beyond the main hash-map work.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Separate-Chaining-Hash-Table"
				},
				{
					title: "Reference: Open Addressing Hash Tables",
					content:
						"Keep the open-addressing reference alongside separate chaining to compare the main collision strategies directly.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Open-Addressing-Reference"
				},
				{
					title: "Extension: Google Maps Showcase",
					content:
						"Use the repo's Google Maps branch as a stronger capstone framing example once the weighted-graph and street-searcher work is complete.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Google-Maps"
				},
				{
					title: "Starter: Street Searcher",
					content:
						"Expose the starter variant so the capstone path can be re-entered from a scaffold instead of only from the completed version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher-Starter"
				},
				{
					title: "Starter: Master Project",
					content:
						"Use the final master-project starter as an additional capstone scaffold beyond the main public sequence.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Master-Project-Starter"
				}
			]
		},
		{
			title: "AJ19 Post-C++ Java Tooling, Testing, and Packages",
			curriculum: [
				{
					title: "Positioning the Advanced Java Track",
					content:
						"Use this track after `C++ Level 3` when the next Java step needs real engineering weight rather than another syntax review. Prerequisite comfort: classes, data structures, recursion, file-backed command programs, parsing, and medium-size program organization. The new Java-specific goals are repeatable builds, packages, testable services, standard-library fluency, safer APIs, and capstone-scale architecture."
				},
				{
					title: "Packages, Builds, and Test Boundaries",
					content:
						"Move from single-folder Java exercises to package-organized projects. Cover: source roots, package names, public APIs, helper classes, command-line or IDE builds, JUnit-style test thinking even when using simple assertions, and why a program that is easy to test is usually easier to extend. Model logic should stay separate from console input."
				},
				{
					title: "AJ19 Project 1: Tested Gradebook Service",
					content:
						"Build a package-organized gradebook service with students, assignments, score validation, weighted averages, and a small test harness. The console runner should be thin; the gradebook logic should be independently testable.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ19-Tested-Gradebook-Service"
				},
				{
					title: "AJ19 Project 2: Command Parser Test Harness",
					content:
						"Write a command parser for a small CLI and test it without running the whole application. Parse valid commands, reject malformed commands, and explain where validation belongs.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ19-Command-Parser-Test-Harness"
				}
			],
			supplementalProjects: [
				{
					title: "AJ19 Project 3: Characterization Test Bug Fix",
					content:
						"Start with a small buggy service, write characterization tests that pin down the current behavior, then make a safe fix and update the tests only when the intended behavior is clear.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ19-Characterization-Test-Bug-Fix"
				}
			]
		},
		{
			title: "AJ20 Generics, Interfaces, and Collection API Design",
			curriculum: [
				{
					title: "Generics as API Contracts",
					content:
						"This section covers generics as a way to write reusable, type-safe APIs, not as angle-bracket decoration. Cover: generic classes, bounded type parameters, generic methods, why raw types lose safety, and how good generic APIs make invalid combinations hard to express."
				},
				{
					title: "Interfaces, Comparators, and Collection Choices",
					content:
						"Use interfaces to separate what a component promises from how it stores data. Cover: `Comparable`, `Comparator`, `List`, `Set`, `Map`, `Queue`, `PriorityQueue`, iteration order, uniqueness, lookup behavior, and choosing a collection based on required operations rather than habit."
				},
				{
					title: "Records as Immutable Data Carriers",
					content:
						"Java `record` types are useful for small immutable data carriers. Cover the generated constructor, accessors, `equals`, `hashCode`, and `toString`; compact constructors for validation; records implementing interfaces; and why normal classes are still better for mutable objects, inheritance hierarchies, or behavior-heavy domain models."
				},
				{
					title: "AJ20 Project 1: Generic Repository and Query Filters",
					content:
						"Build a generic in-memory repository that stores Java `record` objects by ID through a shared interface, supports filtering with predicates, and exposes only safe collection views. Explain the type parameter, what invariants the repository protects, and why records fit immutable snapshot-style data.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ20-Generic-Repository"
				},
				{
					title: "AJ20 Project 2: Comparator-Driven Priority Scheduler",
					content:
						"Create a scheduler that can order tasks by deadline, importance, duration, or a custom comparator. Compare `PriorityQueue`, sorted lists, and maps before choosing the main representation.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ20-Comparator-Priority-Scheduler"
				}
			],
			supplementalProjects: [
				{
					title: "AJ20 Project 3: Type-Safe Plugin Registry",
					content:
						"Design a small registry of named tools or commands with a shared interface. The challenge is to keep registration flexible without falling back to raw `Object` values or unsafe casts.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ20-Type-Safe-Plugin-Registry"
				}
			]
		},
		{
			title: "AJ21 Streams, Files, and Data Pipelines",
			curriculum: [
				{
					title: "File-Backed Data Pipelines",
					content:
						"Connect Java file I/O to prior parser and persistence habits from C++. Cover: reading lines, validating records, representing bad rows, writing clean output, preserving original data when import fails, and keeping parsing separate from reporting."
				},
				{
					title: "Lambdas, Streams, and Readable Transformations",
					content:
						"Lambdas and streams are tools for clear transformations over collections. Cover: `map`, `filter`, `sorted`, `collect`, grouping, custom comparators, and when an explicit loop is still better because the stateful logic would make a stream harder to read."
				},
				{
					title: "AJ21 Project 1: Log Analyzer Pipeline",
					content:
						"Read a text log, parse valid rows, collect invalid rows, group events by type, compute summary statistics, and print a stable report. Implement the first version with loops and then refactor part of it to streams.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ21-Log-Analyzer-Pipeline"
				},
				{
					title: "AJ21 Project 2: CSV Import Validator",
					content:
						"Build a CSV-style importer for records with required fields, type checks, duplicate detection, and a rejected-row report. The program should never corrupt the accepted-data set when a later row fails.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ21-CSV-Import-Validator"
				}
			],
			supplementalProjects: [
				{
					title: "AJ21 Project 3: Report Builder Refactor",
					content:
						"Take a messy report generator and refactor it into parsing, aggregation, formatting, and output stages. Skill target: Swap one stage without rewriting the whole pipeline.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ21-Report-Builder-Refactor"
				}
			]
		},
		{
			title: "AJ22 Concurrency, Services, and Capstone Architecture",
			curriculum: [
				{
					title: "Executors, Tasks, and Shared-State Discipline",
					content:
						"Concurrency is introduced through bounded task execution rather than raw thread chaos. Cover: `Runnable`, `Callable`, `ExecutorService`, futures, immutable task inputs, synchronized shared state when necessary, and why most bugs come from unclear ownership of mutable data."
				},
				{
					title: "Capstone Architecture and Java-Specific Readiness",
					content:
						"Close the advanced Java track by requiring architecture decisions: packages, service boundaries, interfaces, data models, test harnesses, error handling, and one concurrency or event-processing component. Be ready afterward for serious Java design-pattern work, larger data-structure projects, or a service/application course."
				},
				{
					title: "AJ22 Project 1: Concurrent Task Runner",
					content:
						"Build a task runner that accepts jobs, executes them with a small executor pool, records success or failure, and prints a final report in deterministic order. Explain which data is shared and how they kept it safe.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ22-Concurrent-Task-Runner"
				},
				{
					title: "AJ22 Project 2: Event-Driven Simulation Capstone",
					content:
						"Build a medium-size simulation such as a tournament scheduler, delivery dispatch board, library queue, or course registration system. It must include packages, interfaces, persistent input/output, tests or test harnesses, and a clear event loop or task-processing model.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ22-Event-Driven-Simulation-Capstone"
				}
			],
			supplementalProjects: [
				{
					title: "AJ22 Project 3: Capstone Extension Review",
					content:
						"Perform a structured second pass on the capstone: identify one class that does too much, one API that leaks representation details, and one missing test or manual verification case, then fix the most important issue.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ22-Capstone-Extension-Review"
				}
			]
		}
	]
};
