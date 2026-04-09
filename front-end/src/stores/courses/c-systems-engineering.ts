import type { RawCourse, RawCourseModuleItem } from "./types";

const C_SYSTEMS_ENGINEERING_REPO
	= "https://github.com/instruction-material/C-Systems-Engineering/tree/main";

function starterRepoLink(projectId: string) {
	return `${C_SYSTEMS_ENGINEERING_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${C_SYSTEMS_ENGINEERING_REPO}/${projectId}/solution`;
}

function projectItem(
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

function engineeringNotebook(
	unitTitle: string,
	focus: string
): RawCourseModuleItem {
	return {
		title: `Engineering Notebook: ${unitTitle}`,
		content: `Keep a short engineering notebook for ${unitTitle.toLowerCase()} that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on ${focus} so students build the habit of explaining systems behavior instead of only trusting output.`
	};
}

function toolDrill(commandName: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Tool Drill: ${commandName}`,
		content: `Start the lesson by running ${commandName} and asking students to predict what useful evidence it should provide. ${prompt}`
	};
}

function byteView(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Printed Byte View: ${title}`,
		content: `Stop after the main exercise and print the relevant bytes or bit groups before moving on. ${prompt}`
	};
}

export const cSystemsEngineeringCourse: RawCourse = {
	name: "C Systems Engineering",
	modules: [
		{
			title: "CSE0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDEs and Core Toolchain",
					content:
						"Standardize on `CLion` or `VS Code` and make the real requirement the underlying toolchain rather than the editor itself. Students should verify `clang --version`, `cmake --version`, and `lldb --version` or an equivalent GCC and GDB toolchain before the course depends on debugging, binary inspection, or sanitizer-backed runs."
				},
				{
					title: "macOS and Windows Setup Walkthroughs",
					content:
						"On macOS, install Apple command-line tools with `xcode-select --install`, then confirm CMake and LLDB are available. On Windows, prefer WSL2 with Ubuntu so the compilation, filesystem, and debugger workflow stays close to the Unix-style environment used by the rest of the course."
				},
				{
					title: "Course Positioning and Prerequisites",
					content:
						"Position the course as the next low-level step after `C++ Level 1`, with C used to expose memory, representation, and data movement more directly. Students should already be comfortable with variables, loops, functions, arrays, and pointers before the course adds stricter debugging and more explicit lifetime management."
				},
				{
					title: "Core Outcomes and Daily Working Habits",
					content:
						"Set the expectation that students will read binary and hexadecimal representations, use bitwise operators confidently, reason about layout and lifetime, and build small systems-style tools in C. Every unit should pair the abstract idea with a printed byte or memory view plus a short written explanation of why the code works."
				}
			],
			supplementalProjects: [
				engineeringNotebook(
					"Setup and Tooling",
					"toolchain identity, compiler/debugger verification, and the difference between editing and building"
				),
				toolDrill(
					"clang --version",
					"Ask students which part of the output identifies the compiler family and why that matters when comparing warnings, sanitizers, or generated binaries."
				)
			]
		},
		{
			title: "Unit 1: Why C for Systems Work",
			curriculum: [
				{
					title: "Translation Units, Compilation, and Linking",
					content:
						"Teach C as a language that becomes useful when students understand how source files become object files and how those objects are linked into a program. The goal is not linker trivia for its own sake, but a grounded model of where declarations, definitions, and build artifacts live."
				},
				{
					title: "Runtime Model Compared to Higher-Level Languages",
					content:
						"Compare C's runtime model to higher-level environments that hide allocation, object layout, and dispatch details. Students should understand that C gives fewer automatic protections but a clearer view of data movement and memory representation, which is exactly why it is valuable for systems work."
				},
				{
					title: "Headers, Source Files, and Observable Build Boundaries",
					content:
						"Use a small multi-file example to show what belongs in a header versus a source file and why duplicate definitions or missing declarations produce concrete compiler or linker failures. This builds an engineering mindset around build boundaries rather than only around syntax."
				},
				{
					title: "Why This Course Uses Small Utilities Instead of Giant Apps",
					content:
						"Reinforce that the course is about engineering fundamentals: bytes, layout, parsing, invariants, and observability. Small CLI tools are a better classroom than oversized UI-heavy apps because each byte and each assumption can be inspected directly."
				}
			],
			supplementalProjects: [
				engineeringNotebook(
					"Why C for Systems Work",
					"source-to-binary boundaries, declarations vs definitions, and what the runtime model exposes"
				),
				toolDrill(
					"nm",
					"Use a tiny compiled example so students can see that functions and globals become named symbols rather than magical language objects."
				)
			]
		},
		{
			title: "Unit 2: Binary, Hex, and Number Representation",
			curriculum: [
				{
					title: "Bits, Nibbles, Bytes, and Words",
					content:
						"Teach binary representation at the physical grouping level first: bits form nibbles, nibbles form bytes, and bytes are the practical units students will keep seeing in memory dumps and file formats. This removes the intimidation factor from later byte-level work."
				},
				{
					title: "Decimal, Binary, and Hex Conversions",
					content:
						"Practice converting small values across decimal, binary, and hexadecimal until students can move between them without guessing. Hex should feel like a readable shorthand for groups of four bits, not like an unrelated numbering system."
				},
				{
					title: "Signed vs Unsigned Integers and Two's Complement",
					content:
						"Show that the same 16 bits can name one unsigned value and one signed value, then connect that idea to two's complement and the meaning of the top bit. Students should be able to explain signedness as an interpretation rule rather than as a different kind of memory."
				},
				projectItem(
					"Project: Hex and Binary Inspector",
					"Use the inspector lab to print one value in decimal, hex, and grouped binary, then compare its signed and unsigned 16-bit interpretations. The project should make two's complement visible and should force students to talk about nibbles and bytes explicitly instead of hand-waving about 'the number.'",
					"CSE1-Hex-and-Binary-Inspector"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Binary, Hex, and Number Representation",
					"signedness, top-bit meaning, and how grouped bits map cleanly to hex digits"
				),
				byteView(
					"One Value, Three Views",
					"Print the same value in decimal, hex, and binary and ask students to mark which bit groups become which hex digits."
				)
			]
		},
		{
			title: "Unit 3: Bitwise Operations",
			curriculum: [
				{
					title: "AND, OR, XOR, NOT, and Shifts",
					content:
						"Teach the bitwise operators as data-shaping tools rather than as abstract truth tables alone. Students should know what gets cleared with AND, what gets set with OR, what toggles with XOR, and why left and right shifts only make sense when they can describe the bit movement clearly."
				},
				{
					title: "Masking, Flag Extraction, and Bit Packing",
					content:
						"Use realistic packed bytes and small protocol-style fields to show why systems code compresses multiple meanings into one byte or word. The emphasis is on reading and writing masks deliberately, not on memorizing operator precedence without context."
				},
				{
					title: "XOR as a Reversible Byte-Level Transform",
					content:
						"Give XOR special attention because it shows up in parity, toggling, checksums, and simple reversible transforms. Students should explain in plain language why `x ^ k ^ k` returns the original byte instead of treating XOR as a magic classroom trick."
				},
				projectItem(
					"Project: Bitflag Configuration Parser",
					"Use the bitflag parser to unpack a compact configuration byte into readable feature toggles and a small mode field. The key lesson is that one byte can carry multiple meanings safely when the masks and shifts are explicit.",
					"CSE2-Bitflag-Configuration-Parser"
				),
				projectItem(
					"Project: XOR Encoder Decoder",
					"Use the XOR lab to compare the original bytes, encoded bytes, and decoded bytes for the same message. Require students to explain why the transform is reversible and what XOR is really doing to each bit.",
					"CSE3-XOR-Encoder-Decoder"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Bitwise Operations",
					"mask design, packed fields, and why each operator changes the bits the way it does"
				),
				byteView(
					"Flag Byte Breakdown",
					"Print one packed byte and have students label which bit or bit range controls each named feature."
				)
			]
		},
		{
			title: "Unit 4: Memory and Layout",
			curriculum: [
				{
					title: "Addresses and Pointer Arithmetic",
					content:
						"Use arrays and pointer arithmetic to show that addresses move in element-sized steps rather than in vague 'next item' intuition. Students should learn to connect pointer movement directly to type size and memory layout."
				},
				{
					title: "Stack vs Heap vs Static Storage",
					content:
						"Introduce the main storage regions as different lifetime stories: static data lasts for the process, stack data follows scope, and heap data follows explicit allocation and free rules. This framing pays off later when bugs are really lifetime mistakes with visible memory consequences."
				},
				{
					title: "Alignment, Padding, Arrays, and Struct Layout",
					content:
						"Teach struct layout with `sizeof`, `offsetof`, and printed addresses so students can see where padding appears and why alignment exists. The course should avoid treating struct size as mysterious compiler behavior when it can be measured directly."
				},
				projectItem(
					"Project: Memory Visualizer for Arrays and Structs",
					"Use the memory visualizer to print stack, heap, and static addresses alongside member offsets in a small struct. Students should identify likely padding and explain why adjacent array elements move by one element size rather than one byte.",
					"CSE4-Memory-Visualizer"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Memory and Layout",
					"storage duration, member offsets, and why alignment changes total struct size"
				),
				byteView(
					"Struct Layout Check",
					"Have students mark the probable padding bytes between fields after printing the offsets and total size."
				)
			]
		},
		{
			title: "Unit 5: Strings and Byte Buffers",
			curriculum: [
				{
					title: "C Strings vs Raw Byte Arrays",
					content:
						"Teach C strings as one special convention built on top of bytes: a sequence terminated by `\\0`. Students should understand that a byte buffer is not automatically a string and that treating arbitrary bytes like text is a fast path to truncated reads or misleading output."
				},
				{
					title: "Length vs Capacity and Null Termination",
					content:
						"Separate the number of meaningful characters from the size of the allocated buffer. Students should be able to explain why a destination buffer needs capacity-aware copying and where the terminator ends up after a safe copy."
				},
				{
					title: "Safe Copy Patterns and Byte Dumps",
					content:
						"Model fixed-buffer copy rules that preserve space for the terminator and then inspect the actual bytes after the copy. This makes the difference between 'I think it copied safely' and 'I can prove what is in memory' much more concrete."
				},
				projectItem(
					"Project: Byte Buffer Workbench",
					"Use the byte-buffer lab to compare a safe fixed-size text copy with a raw packet buffer that contains non-text bytes and an embedded zero. The project should force students to justify why `strlen` is valid for one buffer and a bad assumption for the other.",
					"CSE5-Byte-Buffer-Workbench"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Strings and Byte Buffers",
					"terminators, capacity checks, and why byte dumps tell a truer story than text output alone"
				),
				byteView(
					"String vs Packet Buffer",
					"Print both buffers byte by byte and ask students where the first `0x00` matters and where it does not."
				)
			]
		},
		{
			title: "Unit 6: Files, Streams, and Parsing",
			curriculum: [
				{
					title: "FILE Pointers, Buffered I O, and Binary vs Text Modes",
					content:
						"Introduce `FILE *` as the basic stream handle for structured reading and writing. Students should know when text parsing is appropriate, when binary formats are more stable, and why checking return values matters more than assuming the file behaved as expected."
				},
				{
					title: "Reading Structured Data One Field at a Time",
					content:
						"Use small record formats to show why systems code often reads fields explicitly instead of trusting compiler-dependent struct layout on disk. This connects file parsing directly to endianness, checksums, and later protocol work."
				},
				{
					title: "Checksums, Validation, and Parse Boundaries",
					content:
						"Teach validation as part of parsing, not as an optional afterthought. Students should reject bad magic values, mismatched checksums, or truncated records before they start treating bytes as trustworthy data."
				},
				projectItem(
					"Project: Packet Serializer Deserializer",
					"Use the packet lab to write a compact record into an explicit little-endian byte format, then validate and parse it back into readable fields. The lesson is that stable on-the-wire or on-disk formats come from explicit serialization, not from dumping a struct blindly.",
					"CSE6-Packet-Serializer-Deserializer"
				),
				projectItem(
					"Project: Fixed Size Log File Reader",
					"Use the log-reader lab to generate a small binary log file, read each fixed-size record through `FILE *`, and validate its checksum before printing a summary. This makes binary parsing, validation, and repeated record handling visible in one place.",
					"CSE8-Fixed-Size-Log-File-Reader"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Files, Streams, and Parsing",
					"record boundaries, validation order, and why bad input must be rejected before decoding proceeds"
				),
				toolDrill(
					"hexdump -C",
					"Use a small sample file so students can connect the printed bytes in the file directly to the fields their parser extracts."
				)
			]
		},
		{
			title: "Unit 7: Dynamic Memory and Lifetime",
			curriculum: [
				{
					title: "malloc, calloc, realloc, and free",
					content:
						"Teach the heap allocation calls as explicit ownership decisions instead of as generic ways to 'make more memory.' Students should know which call zeroes memory, which one resizes an existing region, and why every successful allocation needs a clear path to cleanup."
				},
				{
					title: "Ownership and Lifetime Invariants",
					content:
						"Frame lifetime as an invariant story: who owns the allocation, who may borrow it temporarily, and when the program considers it invalid. This prepares students to reason about leaks, invalid frees, and stale pointers before those bugs become difficult to debug."
				},
				{
					title: "Leaks, Double Frees, and Invalid Access",
					content:
						"Use small examples to show how heap bugs usually come from broken lifetime rules rather than from the allocator itself being mysterious. Students should be able to describe the failure in terms of ownership and cleanup instead of only saying the program crashed."
				},
				projectItem(
					"Project: Dynamic Ring Buffer",
					"Use the ring-buffer lab to make heap ownership concrete with allocation, resize logic, queue state, and cleanup. The project should force students to keep head, count, capacity, and final `free` responsibilities straight.",
					"CSE7-Dynamic-Ring-Buffer"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Dynamic Memory and Lifetime",
					"allocation ownership, resize rules, and what cleanup path makes the data structure safe to destroy"
				),
				toolDrill(
					"lldb",
					"Pause a small heap-using program and inspect the pointer values so students connect lifetime bugs to real addresses instead of abstract warnings."
				)
			]
		},
		{
			title: "Unit 8: Function Pointers and Dispatch",
			curriculum: [
				{
					title: "Callbacks and Function Pointer Basics",
					content:
						"Teach function pointers as stored behavior that lets one part of the program call another indirectly. Students do not need exotic syntax games; they need a practical model of callbacks, handlers, and how code can be selected by data."
				},
				{
					title: "Dispatch Tables and State Machines",
					content:
						"Show how a table of handlers or a small state machine can replace long chains of conditionals once a program starts reacting to modes, commands, or parsed tokens. This keeps the lesson engineering-focused and ties directly to protocol parsing or event-driven systems."
				},
				{
					title: "Event-Driven Patterns at a Beginner-Friendly Scale",
					content:
						"Use tiny examples such as a command decoder or mode-driven output formatter to make dispatch observable. The point is to show how systems code often maps values to actions explicitly instead of hiding all behavior in one large control block."
				},
				{
					title: "Design Exercise: Command Handler Table",
					content:
						"Have students sketch a command table for a toy parser and explain which inputs map to which handlers. The exercise should make indirect control flow feel understandable before students encounter it in larger programs."
				}
			],
			supplementalProjects: [
				engineeringNotebook(
					"Function Pointers and Dispatch",
					"which values select which handlers and why a dispatch table can be clearer than a giant if-else chain"
				),
				byteView(
					"Command Byte to Handler",
					"Use one compact command field and ask students to describe how the parser will turn that value into a handler decision."
				)
			]
		},
		{
			title: "Unit 9: Data Structures in C",
			curriculum: [
				{
					title: "Dynamic Arrays, Linked Lists, and Ring Buffers",
					content:
						"Compare the main beginner-friendly C data structures by the questions they answer well: contiguous storage, cheap appends, cheap front removal, or stable node insertion. Students should learn to justify the structure choice instead of treating every container as a generic list."
				},
				{
					title: "Hash Tables at a Beginner-Friendly Level",
					content:
						"Introduce hash tables conceptually as key-to-slot mapping with collision handling, without turning the lesson into a full algorithm course. The goal is to show why systems tools often need fast lookup and what tradeoffs that introduces in C."
				},
				{
					title: "Data Structure Invariants Are Part of the Design",
					content:
						"Teach students to name invariants such as valid count ranges, non-null storage after initialization, or head and tail relationships. This helps them debug the structure by reasoning about what must stay true, not only by staring at code."
				},
				projectItem(
					"Project Pass: Extend the Dynamic Ring Buffer",
					"Return to the ring-buffer lab and use it as the main data-structure case study for invariants, queue order, and resizing behavior. Students should treat the structure as a maintained system with rules, not as a one-off container that 'seems to work.'",
					"CSE7-Dynamic-Ring-Buffer"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Data Structures in C",
					"container choice, invariants, and what evidence shows the structure is preserving logical order"
				),
				toolDrill(
					"watch",
					"Use repeated output from a small structure test so students can observe count, head, or capacity changes over time instead of after the fact."
				)
			]
		},
		{
			title: "Unit 10: Engineering Math in Code",
			curriculum: [
				{
					title: "Fixed Point Thinking Instead of Immediate Floats",
					content:
						"Teach students to represent some physical quantities in scaled integers when exact decimal storage is not available or when deterministic transforms matter. This keeps the math connected to systems constraints instead of assuming floating-point is always the default answer."
				},
				{
					title: "Overflow-Aware Arithmetic and Range Checks",
					content:
						"Make students think about maximum values before they multiply, shift, or convert units. Systems code often fails not because the formula is wrong, but because the input range was never checked before the formula ran."
				},
				{
					title: "Unit Conversion Reliability",
					content:
						"Use temperature, voltage, or timing conversions to show why a conversion routine is an engineering artifact, not just a math exercise. Students should validate ranges, choose units deliberately, and explain the scaling used in the code."
				},
				{
					title: "Numeric Error and Approximation",
					content:
						"Introduce the idea that some transforms are exact and some are approximations, especially when integer division or fixed-point rounding is involved. The important skill is to state the approximation clearly and bound the expected error."
				}
			],
			supplementalProjects: [
				engineeringNotebook(
					"Engineering Math in Code",
					"scaling choices, overflow checks, and why the chosen units make the transform safer to reason about"
				),
				byteView(
					"Scaled Integer Transform",
					"Print one scaled integer before and after a conversion and ask students where truncation or rounding could appear."
				)
			]
		},
		{
			title: "Unit 11: Systems Tooling",
			curriculum: [
				{
					title: "Compiler Flags and Warning Discipline",
					content:
						"Treat compiler flags as engineering policy rather than optional noise. Students should get used to `-Wall`, `-Wextra`, and `-Wpedantic`, and should see warnings as evidence of assumptions that need to be checked before the code deserves trust."
				},
				{
					title: "Debuggers, Sanitizers, and Evidence-Driven Diagnosis",
					content:
						"Use `lldb` or `gdb` plus sanitizers to show that low-level bugs become much easier to understand when the tooling points at the exact failing access or bad lifetime event. The course should reward observation and reproduction instead of guess-and-retry debugging."
				},
				{
					title: "Binary Inspection with objdump and nm",
					content:
						"Introduce `objdump` or `llvm-objdump` and `nm` as ways to inspect the built artifact itself. Students should understand that systems engineering includes observing the binary, not only the source, especially when they want to confirm symbols, sections, or compiled layout choices."
				},
				{
					title: "Tooling Pass on a Real Utility",
					content:
						"Use one of the earlier projects to inspect warnings, run under the debugger, and compare the file bytes or symbols against the source expectations. This keeps the tooling lesson grounded in code students already know rather than in synthetic debugging puzzles."
				}
			],
			supplementalProjects: [
				engineeringNotebook(
					"Systems Tooling",
					"which tool produced the most useful evidence for a given bug or observation and why"
				),
				toolDrill(
					"llvm-objdump -t",
					"Run it on one of the built labs so students can connect source names to symbol-table evidence in the compiled output."
				)
			]
		},
		{
			title: "Unit 12: Capstone Engineering Utility",
			curriculum: [
				{
					title: "Scope a Robust CLI Utility",
					content:
						"Frame the capstone as a careful utility that reads structured input, validates it, transforms it, and writes trustworthy output. The challenge is not adding every possible feature; it is building a small tool whose invariants and failure cases are clearly understood."
				},
				{
					title: "Read Input, Validate Early, Transform Deliberately",
					content:
						"Require students to validate each row or record before it enters the main transform path. This is the capstone version of the whole course philosophy: bytes and fields should become trusted data only after the code has checked the boundaries and assumptions explicitly."
				},
				{
					title: "Write Output That Another Tool Could Trust",
					content:
						"Students should produce normalized output with stable formatting, explicit derived fields, and clear handling of invalid input. The capstone should feel like a utility another engineer could actually use or extend rather than like a classroom printout."
				},
				projectItem(
					"Project: Capstone Telemetry Transform CLI",
					"Use the capstone CLI to read structured telemetry input, validate ranges, apply fixed-point transforms, and write normalized output. This project should tie together representation, parsing, validation, numeric care, and low-level engineering habits in one small but defensible utility.",
					"CSE9-Capstone-Telemetry-Transform-CLI"
				)
			],
			supplementalProjects: [
				engineeringNotebook(
					"Capstone Engineering Utility",
					"input validation order, derived-field logic, and why the final output format is trustworthy"
				),
				byteView(
					"Capstone Input and Output",
					"Pick one sample row and explain how each field changes from input form to output form, including any scaling, masking, or validation rule."
				)
			]
		}
	]
};
