import type { RawCourse } from "./types";

export const pythonToJavaAndCppBridgeCourse: RawCourse = {
	name: "Python to Java and C++ Bridge",
	modules: [
		{
			title: "PTJ0 Positioning and Workflow Translation",
			curriculum: [
				{
					title: "Why Typed Languages Feel Harder at First",
					content:
						"Frame the bridge as a translation problem, not a full restart. Students already know variables, loops, functions, and objects from Python; the new challenge is stronger type declarations, compilation, braces, semicolons, and more explicit project structure."
				},
				{
					title: "Compiled vs. Interpreted Workflows",
					content:
						"Compare Python's quick script loop with Java and C++ compile-run cycles. Students should practice treating compiler errors as structured feedback rather than as proof that the language is hostile."
				},
				{
					title: "Blocks, Braces, and Signatures",
					content:
						"Translate indentation-based thinking into braces and method signatures. Emphasize that typed syntax adds ceremony, but the underlying control flow is still the same. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "What Transfers Cleanly from Python",
					content:
						"Make the transfer explicit: loops, conditionals, string processing, decomposition into helper functions, and object modeling still matter. The bridge should preserve student confidence by showing where the mental model still applies."
				},
				{
					title: "PTJ0 Positioning and Workflow Translation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Syntax Translation Warmup",
					content:
						"Port several tiny Python snippets into typed Java and C++ starter files so students can compare variables, conditionals, loops, and return statements side by side. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/solution"
				},
				{
					title: "src",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ0 Positioning and Workflow Translation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ1-Syntax-Translation-Warmup/starter"
				},
				{
					title: "Positioning and Workflow Translation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ0 Positioning and Workflow Translation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-ptj0-positioning-and-workflow-translation-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-ptj0-positioning-and-workflow-translation-supple/solution"
				}
			]
		},
		{
			title: "PTJ1 Functions, Parameters, and Return Types",
			curriculum: [
				{
					title: "From def to Method Signatures",
					content:
						"Map Python's `def` syntax to Java methods and C++ functions. Students should be able to read the parameter types and return type before reading the body. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Void, Value Returns, and Compile-Time Mismatches",
					content:
						"Practice spotting the common mistakes that typed languages catch immediately: returning the wrong type, forgetting a return statement, or passing the wrong argument type. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Reading Compiler Feedback Productively",
					content:
						"Have students work through small broken examples where a missing semicolon, bad type, or mismatched brace causes several errors. The skill is to find the first real error and ignore the noise that cascades after it."
				},
				{
					title: "Functions, Parameters, and Return Types: Verification and Reflection",
					content:
						"Close PTJ1 Functions, Parameters, and Return Types by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "PTJ1 Functions, Parameters, and Return Types: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Function Port Pack",
					content:
						"Translate a Python helper-function worksheet into Java and C++, preserving the same behavior while adding explicit parameter and return types. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ2-Function-Port-Pack/solution"
				},
				{
					title: "Functions, Parameters, and Return Types supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ1 Functions, Parameters, and Return Types. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-ptj1-functions-parameters-and-return-types-suppl/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-ptj1-functions-parameters-and-return-types-suppl/solution"
				},
				{
					title: "Functions, Parameters, and Return Types supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ1 Functions, Parameters, and Return Types. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-ptj1-functions-parameters-and-return-types-suppl/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-ptj1-functions-parameters-and-return-types-suppl/solution"
				}
			]
		},
		{
			title: "PTJ2 Collections, Strings, and Indexing",
			curriculum: [
				{
					title: "Lists vs. Arrays, ArrayLists, and Vectors",
					content:
						"Compare Python lists with Java arrays and `ArrayList`, then with C++ arrays and `vector`. Students should be able to explain which structure is fixed-size, which grows dynamically, and how indexing and methods differ."
				},
				{
					title: "String APIs and Slice Replacement",
					content:
						"Translate Python slicing habits into Java and C++ string methods. The bridge should make students slower but more deliberate about substring ranges, mutation rules, and off-by-one boundaries."
				},
				{
					title: "Bounds and Loop Discipline",
					content:
						"Use list and string loops to reinforce boundary conditions in typed languages. This is where a Python student can quickly become a stronger debugger if the translation is handled carefully."
				},
				{
					title: "Collections, Strings, and Indexing: Verification and Reflection",
					content:
						"Close PTJ2 Collections, Strings, and Indexing by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PTJ2 Collections, Strings, and Indexing: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Text and Collection Port Lab",
					content:
						"Port a Python list-and-string processing exercise into Java and C++ and compare how the same algorithm changes once indexing, arrays, and string APIs become more explicit. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ3-Text-and-Collection-Port-Lab/solution"
				},
				{
					title: "Collections, Strings, and Indexing supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ2 Collections, Strings, and Indexing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-ptj2-collections-strings-and-indexing-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-ptj2-collections-strings-and-indexing-supplement/solution"
				},
				{
					title: "Collections, Strings, and Indexing supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ2 Collections, Strings, and Indexing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-ptj2-collections-strings-and-indexing-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-ptj2-collections-strings-and-indexing-supplement/solution"
				}
			]
		},
		{
			title: "PTJ3 Classes and Objects across Languages",
			curriculum: [
				{
					title: "What Stays the Same in OOP",
					content:
						"Re-anchor classes in familiar Python ideas: objects still carry state, constructors still initialize that state, and methods still bundle behavior with data. The new work is mostly syntax and file organization."
				},
				{
					title: "Java Class Structure",
					content:
						"Introduce fields, constructors, getters, setters, and the role of access modifiers in Java. Students should see why Java looks more ceremonial while still describing a familiar object model."
				},
				{
					title: "C++ Class Structure and Header/Source Separation",
					content:
						"Introduce class declarations in header files and method definitions in source files. Emphasize that the split exists for organization and compilation reasons, not because the class model itself is conceptually different from Python."
				},
				{
					title: "Classes and Objects across Languages: Verification and Reflection",
					content:
						"Close PTJ3 Classes and Objects across Languages by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "PTJ3 Classes and Objects across Languages: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Shared Class Port",
					content:
						"Rewrite a small Python class such as `Pet`, `BankAccount`, or `Character` as both a Java class and a C++ header/source pair. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ4-Shared-Class-Port/solution"
				},
				{
					title: "Classes and Objects across Languages supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ3 Classes and Objects across Languages. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-ptj3-classes-and-objects-across-languages-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-ptj3-classes-and-objects-across-languages-supple/solution"
				},
				{
					title: "Classes and Objects across Languages supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ3 Classes and Objects across Languages. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-ptj3-classes-and-objects-across-languages-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-ptj3-classes-and-objects-across-languages-supple/solution"
				}
			]
		},
		{
			title: "PTJ4 Java-Specific Adaptation",
			curriculum: [
				{
					title: "Scanner, main, and Java Project Rhythm",
					content:
						"Practice `Scanner`, `public static void main`, and the file structure expected by early Java projects. This should make the first weeks of `Java Level 1` feel familiar instead of abrupt."
				},
				{
					title: "String Equality and Reference Habits",
					content:
						"Make `.equals()` versus `==` explicit for students coming from Python. This is one of the most important translation mistakes to prevent before the student enters the main Java course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Bridge Exit to Java Level 1",
					content:
						"By the end of the Java branch, students should be ready to write simple typed methods, use `Scanner`, and build a small class without getting stuck on boilerplate. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Java Specific Adaptation: Verification and Reflection",
					content:
						"Close PTJ4 Java-Specific Adaptation by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PTJ4 Java-Specific Adaptation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Python to Java Quiz Game",
					content:
						"Port a small Python quiz or Mad Libs program into Java and use it as the last pre-Java-Level-1 confidence check. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ5-Python-to-Java-Quiz-Game/solution"
				},
				{
					title: "Java Specific Adaptation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ4 Java-Specific Adaptation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX08-ptj4-java-specific-adaptation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX08-ptj4-java-specific-adaptation-supplemental-2/solution"
				},
				{
					title: "Java Specific Adaptation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ4 Java-Specific Adaptation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX09-ptj4-java-specific-adaptation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX09-ptj4-java-specific-adaptation-supplemental-3/solution"
				}
			]
		},
		{
			title: "PTJ5 C++-Specific Adaptation",
			curriculum: [
				{
					title: "Includes, std, and Console Streams",
					content:
						"Practice `#include`, `std::`, `cout`, and `cin` until the syntax stops feeling special. The first C++ goal is comfort with typed syntax and compilation, not early pointer complexity. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Vectors, References, and Pass-by-Value Intuition",
					content:
						"Introduce `vector` and the difference between passing by value and by reference without jumping ahead to the full pointer-heavy part of the C++ path. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Bridge Exit to C++ Level 1",
					content:
						"By the end of the C++ branch, students should be ready to work with console I/O, typed functions, vectors, and small classes, with pointers still deferred to the normal C++ course sequence."
				},
				{
					title: "C++ Specific Adaptation: Verification and Reflection",
					content:
						"Close PTJ5 C++-Specific Adaptation by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PTJ5 C++-Specific Adaptation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Python to C++ Console Port",
					content:
						"Port a small Python console game into C++ and use it as the last transition exercise before entering the main `C++ Level 1` path. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/PTJ6-Python-to-CPP-Console-Port/solution"
				},
				{
					title: "C++ Specific Adaptation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ5 C++-Specific Adaptation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX10-ptj5-c-specific-adaptation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX10-ptj5-c-specific-adaptation-supplemental-2/solution"
				},
				{
					title: "C++ Specific Adaptation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PTJ5 C++-Specific Adaptation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX11-ptj5-c-specific-adaptation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX11-ptj5-c-specific-adaptation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 7: language bridge lab 11",
			curriculum: [
				{
					title: "language bridge lab 11: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 7: language bridge lab 11, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 11: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 7: language bridge lab 11, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 11: Core Project",
					content:
						"Build the central artifact for Applied Studio 7: language bridge lab 11. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-language-bridge-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-language-bridge-lab-11/solution"
				},
				{
					title: "language bridge lab 11: Review and Reflection",
					content:
						"Close Applied Studio 7: language bridge lab 11 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 11: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 7: language bridge lab 11 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-language-bridge-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX01-language-bridge-lab-11/solution"
				},
				{
					title: "Applied Studio 7: language bridge lab 11 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 7: language bridge lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX12-applied-studio-7-language-bridge-lab-11-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX12-applied-studio-7-language-bridge-lab-11-suppleme/solution"
				},
				{
					title: "Applied Studio 7: language bridge lab 11 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 7: language bridge lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX13-applied-studio-7-language-bridge-lab-11-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX13-applied-studio-7-language-bridge-lab-11-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 8: language bridge lab 12",
			curriculum: [
				{
					title: "language bridge lab 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 8: language bridge lab 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 8: language bridge lab 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 8: language bridge lab 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-language-bridge-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-language-bridge-lab-12/solution"
				},
				{
					title: "language bridge lab 12: Review and Reflection",
					content:
						"Close Applied Studio 8: language bridge lab 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 8: language bridge lab 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-language-bridge-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX02-language-bridge-lab-12/solution"
				},
				{
					title: "Applied Studio 8: language bridge lab 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 8: language bridge lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX14-applied-studio-8-language-bridge-lab-12-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX14-applied-studio-8-language-bridge-lab-12-suppleme/solution"
				},
				{
					title: "Applied Studio 8: language bridge lab 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 8: language bridge lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX15-applied-studio-8-language-bridge-lab-12-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX15-applied-studio-8-language-bridge-lab-12-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 9: language bridge lab 13",
			curriculum: [
				{
					title: "language bridge lab 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 9: language bridge lab 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 9: language bridge lab 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 9: language bridge lab 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-language-bridge-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-language-bridge-lab-13/solution"
				},
				{
					title: "language bridge lab 13: Review and Reflection",
					content:
						"Close Applied Studio 9: language bridge lab 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 9: language bridge lab 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-language-bridge-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX03-language-bridge-lab-13/solution"
				},
				{
					title: "Applied Studio 9: language bridge lab 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 9: language bridge lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX16-applied-studio-9-language-bridge-lab-13-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX16-applied-studio-9-language-bridge-lab-13-suppleme/solution"
				},
				{
					title: "Applied Studio 9: language bridge lab 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 9: language bridge lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX17-applied-studio-9-language-bridge-lab-13-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX17-applied-studio-9-language-bridge-lab-13-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 10: language bridge lab 14",
			curriculum: [
				{
					title: "language bridge lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: language bridge lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: language bridge lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: language bridge lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-language-bridge-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-language-bridge-lab-14/solution"
				},
				{
					title: "language bridge lab 14: Review and Reflection",
					content:
						"Close Applied Studio 10: language bridge lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: language bridge lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-language-bridge-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX04-language-bridge-lab-14/solution"
				},
				{
					title: "Applied Studio 10: language bridge lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: language bridge lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX18-applied-studio-10-language-bridge-lab-14-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX18-applied-studio-10-language-bridge-lab-14-supplem/solution"
				},
				{
					title: "Applied Studio 10: language bridge lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: language bridge lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX19-applied-studio-10-language-bridge-lab-14-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX19-applied-studio-10-language-bridge-lab-14-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 11: language bridge lab 15",
			curriculum: [
				{
					title: "language bridge lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: language bridge lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: language bridge lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: language bridge lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-language-bridge-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-language-bridge-lab-15/solution"
				},
				{
					title: "language bridge lab 15: Review and Reflection",
					content:
						"Close Applied Studio 11: language bridge lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: language bridge lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-language-bridge-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX05-language-bridge-lab-15/solution"
				},
				{
					title: "Applied Studio 11: language bridge lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: language bridge lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX20-applied-studio-11-language-bridge-lab-15-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX20-applied-studio-11-language-bridge-lab-15-supplem/solution"
				},
				{
					title: "Applied Studio 11: language bridge lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: language bridge lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX21-applied-studio-11-language-bridge-lab-15-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX21-applied-studio-11-language-bridge-lab-15-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: language bridge lab 16",
			curriculum: [
				{
					title: "language bridge lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: language bridge lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: language bridge lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: language bridge lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-language-bridge-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-language-bridge-lab-16/solution"
				},
				{
					title: "language bridge lab 16: Review and Reflection",
					content:
						"Close Applied Studio 12: language bridge lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: language bridge lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-language-bridge-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX06-language-bridge-lab-16/solution"
				},
				{
					title: "Applied Studio 12: language bridge lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: language bridge lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX22-applied-studio-12-language-bridge-lab-16-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX22-applied-studio-12-language-bridge-lab-16-supplem/solution"
				},
				{
					title: "Applied Studio 12: language bridge lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: language bridge lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX23-applied-studio-12-language-bridge-lab-16-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX23-applied-studio-12-language-bridge-lab-16-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: language bridge lab 17",
			curriculum: [
				{
					title: "language bridge lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: language bridge lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "language bridge lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: language bridge lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "language bridge lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: language bridge lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-language-bridge-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-language-bridge-lab-17/solution"
				},
				{
					title: "language bridge lab 17: Review and Reflection",
					content:
						"Close Applied Studio 13: language bridge lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "language bridge lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: language bridge lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-language-bridge-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX07-language-bridge-lab-17/solution"
				},
				{
					title: "Applied Studio 13: language bridge lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: language bridge lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX24-applied-studio-13-language-bridge-lab-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX24-applied-studio-13-language-bridge-lab-17-supplem/solution"
				},
				{
					title: "Applied Studio 13: language bridge lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: language bridge lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX25-applied-studio-13-language-bridge-lab-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX25-applied-studio-13-language-bridge-lab-17-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: graphics",
			curriculum: [
				{
					title: "graphics: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: graphics, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "graphics: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: graphics, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "graphics: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: graphics. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/graphics"
				},
				{
					title: "graphics: Review and Reflection",
					content:
						"Close Applied Studio 14: graphics by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "graphics: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: graphics with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/graphics"
				},
				{
					title: "Applied Studio 14: graphics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: graphics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX26-applied-studio-14-graphics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX26-applied-studio-14-graphics-supplemental-2/solution"
				},
				{
					title: "Applied Studio 14: graphics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: graphics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX27-applied-studio-14-graphics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX27-applied-studio-14-graphics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: CPP practice",
			curriculum: [
				{
					title: "CPP practice: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: CPP practice, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "CPP practice: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: CPP practice, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "CPP practice: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: CPP practice. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP_practice"
				},
				{
					title: "CPP practice: Review and Reflection",
					content:
						"Close Applied Studio 15: CPP practice by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "CPP practice: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: CPP practice with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP_practice"
				},
				{
					title: "Applied Studio 15: CPP practice supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: CPP practice. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX28-applied-studio-15-cpp-practice-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX28-applied-studio-15-cpp-practice-supplemental-2/solution"
				},
				{
					title: "Applied Studio 15: CPP practice supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: CPP practice. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX29-applied-studio-15-cpp-practice-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX29-applied-studio-15-cpp-practice-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: J1X01 java foundations build 12",
			curriculum: [
				{
					title: "J1X01 java foundations build 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: J1X01 java foundations build 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X01 java foundations build 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: J1X01 java foundations build 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X01 java foundations build 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: J1X01 java foundations build 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X01-java-foundations-build-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X01-java-foundations-build-12/solution"
				},
				{
					title: "J1X01 java foundations build 12: Review and Reflection",
					content:
						"Close Applied Studio 16: J1X01 java foundations build 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X01 java foundations build 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: J1X01 java foundations build 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X01-java-foundations-build-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X01-java-foundations-build-12/solution"
				},
				{
					title: "Applied Studio 16: J1X01 java foundations build 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: J1X01 java foundations build 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX30-applied-studio-16-j1x01-java-foundations-build-1/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX30-applied-studio-16-j1x01-java-foundations-build-1/solution"
				},
				{
					title: "Applied Studio 16: J1X01 java foundations build 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: J1X01 java foundations build 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX31-applied-studio-16-j1x01-java-foundations-build-1/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX31-applied-studio-16-j1x01-java-foundations-build-1/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: c foundations build 13",
			curriculum: [
				{
					title: "c foundations build 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: c foundations build 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "c foundations build 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: c foundations build 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "c foundations build 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: c foundations build 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPX01-c-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPX01-c-foundations-build-13/solution"
				},
				{
					title: "c foundations build 13: Review and Reflection",
					content:
						"Close Applied Studio 17: c foundations build 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "c foundations build 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: c foundations build 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPX01-c-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPX01-c-foundations-build-13/solution"
				},
				{
					title: "Applied Studio 17: c foundations build 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: c foundations build 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX32-applied-studio-17-c-foundations-build-13-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX32-applied-studio-17-c-foundations-build-13-supplem/solution"
				},
				{
					title: "Applied Studio 17: c foundations build 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: c foundations build 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX33-applied-studio-17-c-foundations-build-13-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main/BRGX33-applied-studio-17-c-foundations-build-13-supplem/solution"
				}
			]
		}
	]
};
