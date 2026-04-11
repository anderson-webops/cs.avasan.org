import type { RawCourse, RawCourseModuleItem } from "./types";

const PYTHON_TO_TYPED_BRIDGE_REPO =
	"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main";

function starterRepoLink(projectId: string) {
	return `${PYTHON_TO_TYPED_BRIDGE_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${PYTHON_TO_TYPED_BRIDGE_REPO}/${projectId}/solution`;
}

function pairedProject(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(projectId),
		solutionLink: solutionRepoLink(projectId)
	};
}

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
						"Translate indentation-based thinking into braces and method signatures. Emphasize that typed syntax adds ceremony, but the underlying control flow is still the same."
				},
				{
					title: "What Transfers Cleanly from Python",
					content:
						"Make the transfer explicit: loops, conditionals, string processing, decomposition into helper functions, and object modeling still matter. The bridge should preserve student confidence by showing where the mental model still applies."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Syntax Translation Warmup",
					"Port several tiny Python snippets into typed Java and C++ starter files so students can compare variables, conditionals, loops, and return statements side by side.",
					"PTJ1-Syntax-Translation-Warmup"
				)
			]
		},
		{
			title: "PTJ1 Functions, Parameters, and Return Types",
			curriculum: [
				{
					title: "From def to Method Signatures",
					content:
						"Map Python's `def` syntax to Java methods and C++ functions. Students should be able to read the parameter types and return type before reading the body."
				},
				{
					title: "Void, Value Returns, and Compile-Time Mismatches",
					content:
						"Practice spotting the common mistakes that typed languages catch immediately: returning the wrong type, forgetting a return statement, or passing the wrong argument type."
				},
				{
					title: "Reading Compiler Feedback Productively",
					content:
						"Have students work through small broken examples where a missing semicolon, bad type, or mismatched brace causes several errors. The skill is to find the first real error and ignore the noise that cascades after it."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Function Port Pack",
					"Translate a Python helper-function worksheet into Java and C++, preserving the same behavior while adding explicit parameter and return types.",
					"PTJ2-Function-Port-Pack"
				)
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
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Text and Collection Port Lab",
					"Port a Python list-and-string processing exercise into Java and C++ and compare how the same algorithm changes once indexing, arrays, and string APIs become more explicit.",
					"PTJ3-Text-and-Collection-Port-Lab"
				)
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
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Shared Class Port",
					"Rewrite a small Python class such as `Pet`, `BankAccount`, or `Character` as both a Java class and a C++ header/source pair.",
					"PTJ4-Shared-Class-Port"
				)
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
						"Make `.equals()` versus `==` explicit for students coming from Python. This is one of the most important translation mistakes to prevent before the student enters the main Java course."
				},
				{
					title: "Bridge Exit to Java Level 1",
					content:
						"By the end of the Java branch, students should be ready to write simple typed methods, use `Scanner`, and build a small class without getting stuck on boilerplate."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Python to Java Quiz Game",
					"Port a small Python quiz or Mad Libs program into Java and use it as the last pre-Java-Level-1 confidence check.",
					"PTJ5-Python-to-Java-Quiz-Game"
				)
			]
		},
		{
			title: "PTJ5 C++-Specific Adaptation",
			curriculum: [
				{
					title: "Includes, std, and Console Streams",
					content:
						"Practice `#include`, `std::`, `cout`, and `cin` until the syntax stops feeling special. The first C++ goal is comfort with typed syntax and compilation, not early pointer complexity."
				},
				{
					title: "Vectors, References, and Pass-by-Value Intuition",
					content:
						"Introduce `vector` and the difference between passing by value and by reference without jumping ahead to the full pointer-heavy part of the C++ path."
				},
				{
					title: "Bridge Exit to C++ Level 1",
					content:
						"By the end of the C++ branch, students should be ready to work with console I/O, typed functions, vectors, and small classes, with pointers still deferred to the normal C++ course sequence."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Python to C++ Console Port",
					"Port a small Python console game into C++ and use it as the last transition exercise before entering the main `C++ Level 1` path.",
					"PTJ6-Python-to-CPP-Console-Port"
				)
			]
		}
	]
};
