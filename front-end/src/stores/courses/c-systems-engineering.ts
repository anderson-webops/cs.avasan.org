import type { RawCourse } from "./types";

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
				},
				{
					title: "CSE0 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-cse0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-cse0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Setup and Tooling",
					content:
						"Keep a short engineering notebook for setup and tooling that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on toolchain identity, compiler/debugger verification, and the difference between editing and building so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-cse0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-cse0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CSE0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-cse0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-cse0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CSE0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-cse0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-cse0-setup-and-tooling-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 1: Why C for Systems Work: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-1-why-c-for-systems-work/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-1-why-c-for-systems-work/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Why C for Systems Work",
					content:
						"Keep a short engineering notebook for why c for systems work that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on source-to-binary boundaries, declarations vs definitions, and what the runtime model exposes so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-1-why-c-for-systems-work/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-1-why-c-for-systems-work/solution"
				},
				{
					title: "Unit 1: Why C for Systems Work supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Why C for Systems Work. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-unit-1-why-c-for-systems-work-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-unit-1-why-c-for-systems-work-supplemental-2/solution"
				},
				{
					title: "Unit 1: Why C for Systems Work supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Why C for Systems Work. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-unit-1-why-c-for-systems-work-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-unit-1-why-c-for-systems-work-supplemental-3/solution"
				}
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
				{
					title: "Project: Hex and Binary Inspector",
					content:
						"Use the inspector lab to print one value in decimal, hex, and grouped binary, then compare its signed and unsigned 16-bit interpretations. The project should make two's complement visible and should force students to talk about nibbles and bytes explicitly instead of hand-waving about 'the number.'",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Binary, Hex, and Number Representation",
					content:
						"Keep a short engineering notebook for binary, hex, and number representation that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on signedness, top-bit meaning, and how grouped bits map cleanly to hex digits so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/solution"
				},
				{
					title: "Unit 2: Binary, Hex, and Number Representation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Binary, Hex, and Number Representation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-unit-2-binary-hex-and-number-representation-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX05-unit-2-binary-hex-and-number-representation-supp/solution"
				},
				{
					title: "Unit 2: Binary, Hex, and Number Representation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Binary, Hex, and Number Representation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-2-binary-hex-and-number-representation-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX06-unit-2-binary-hex-and-number-representation-supp/solution"
				}
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
				{
					title: "Project: Bitflag Configuration Parser",
					content:
						"Use the bitflag parser to unpack a compact configuration byte into readable feature toggles and a small mode field. The key lesson is that one byte can carry multiple meanings safely when the masks and shifts are explicit.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/solution"
				},
				{
					title: "Project: XOR Encoder Decoder",
					content:
						"Use the XOR lab to compare the original bytes, encoded bytes, and decoded bytes for the same message. Require students to explain why the transform is reversible and what XOR is really doing to each bit.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE3-XOR-Encoder-Decoder/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE3-XOR-Encoder-Decoder/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Bitwise Operations",
					content:
						"Keep a short engineering notebook for bitwise operations that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on mask design, packed fields, and why each operator changes the bits the way it does so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/solution"
				},
				{
					title: "Unit 3: Bitwise Operations supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: Bitwise Operations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-3-bitwise-operations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-3-bitwise-operations-supplemental-2/solution"
				},
				{
					title: "Unit 3: Bitwise Operations supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: Bitwise Operations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-3-bitwise-operations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-3-bitwise-operations-supplemental-3/solution"
				}
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
				{
					title: "Project: Memory Visualizer for Arrays and Structs",
					content:
						"Use the memory visualizer to print stack, heap, and static addresses alongside member offsets in a small struct. Students should identify likely padding and explain why adjacent array elements move by one element size rather than one byte.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Memory and Layout",
					content:
						"Keep a short engineering notebook for memory and layout that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on storage duration, member offsets, and why alignment changes total struct size so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/solution"
				},
				{
					title: "Unit 4: Memory and Layout supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: Memory and Layout. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-4-memory-and-layout-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-4-memory-and-layout-supplemental-2/solution"
				},
				{
					title: "Unit 4: Memory and Layout supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: Memory and Layout. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX10-unit-4-memory-and-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX10-unit-4-memory-and-layout-supplemental-3/solution"
				}
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
				{
					title: "Project: Byte Buffer Workbench",
					content:
						"Use the byte-buffer lab to compare a safe fixed-size text copy with a raw packet buffer that contains non-text bytes and an embedded zero. The project should force students to justify why `strlen` is valid for one buffer and a bad assumption for the other.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Strings and Byte Buffers",
					content:
						"Keep a short engineering notebook for strings and byte buffers that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on terminators, capacity checks, and why byte dumps tell a truer story than text output alone so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/solution"
				},
				{
					title: "Unit 5: Strings and Byte Buffers supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Strings and Byte Buffers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX11-unit-5-strings-and-byte-buffers-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX11-unit-5-strings-and-byte-buffers-supplemental-2/solution"
				},
				{
					title: "Unit 5: Strings and Byte Buffers supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Strings and Byte Buffers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX12-unit-5-strings-and-byte-buffers-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX12-unit-5-strings-and-byte-buffers-supplemental-3/solution"
				}
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
				{
					title: "Project: Packet Serializer Deserializer",
					content:
						"Use the packet lab to write a compact record into an explicit little-endian byte format, then validate and parse it back into readable fields. The lesson is that stable on-the-wire or on-disk formats come from explicit serialization, not from dumping a struct blindly.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/solution"
				},
				{
					title: "Project: Fixed Size Log File Reader",
					content:
						"Use the log-reader lab to generate a small binary log file, read each fixed-size record through `FILE *`, and validate its checksum before printing a summary. This makes binary parsing, validation, and repeated record handling visible in one place.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE8-Fixed-Size-Log-File-Reader/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE8-Fixed-Size-Log-File-Reader/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Files, Streams, and Parsing",
					content:
						"Keep a short engineering notebook for files, streams, and parsing that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on record boundaries, validation order, and why bad input must be rejected before decoding proceeds so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/solution"
				},
				{
					title: "Unit 6: Files, Streams, and Parsing supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Files, Streams, and Parsing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX13-unit-6-files-streams-and-parsing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX13-unit-6-files-streams-and-parsing-supplemental-2/solution"
				},
				{
					title: "Unit 6: Files, Streams, and Parsing supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Files, Streams, and Parsing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX14-unit-6-files-streams-and-parsing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX14-unit-6-files-streams-and-parsing-supplemental-3/solution"
				}
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
				{
					title: "Project: Dynamic Ring Buffer",
					content:
						"Use the ring-buffer lab to make heap ownership concrete with allocation, resize logic, queue state, and cleanup. The project should force students to keep head, count, capacity, and final `free` responsibilities straight.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Dynamic Memory and Lifetime",
					content:
						"Keep a short engineering notebook for dynamic memory and lifetime that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on allocation ownership, resize rules, and what cleanup path makes the data structure safe to destroy so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				},
				{
					title: "Unit 7: Dynamic Memory and Lifetime supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Dynamic Memory and Lifetime. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX15-unit-7-dynamic-memory-and-lifetime-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX15-unit-7-dynamic-memory-and-lifetime-supplemental-/solution"
				},
				{
					title: "Unit 7: Dynamic Memory and Lifetime supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Dynamic Memory and Lifetime. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX16-unit-7-dynamic-memory-and-lifetime-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX16-unit-7-dynamic-memory-and-lifetime-supplemental-/solution"
				}
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
				},
				{
					title: "Unit 8: Function Pointers and Dispatch: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-8-function-pointers-and-dispatch/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-8-function-pointers-and-dispatch/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Function Pointers and Dispatch",
					content:
						"Keep a short engineering notebook for function pointers and dispatch that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on which values select which handlers and why a dispatch table can be clearer than a giant if-else chain so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-8-function-pointers-and-dispatch/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX07-unit-8-function-pointers-and-dispatch/solution"
				},
				{
					title: "Unit 8: Function Pointers and Dispatch supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Function Pointers and Dispatch. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX17-unit-8-function-pointers-and-dispatch-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX17-unit-8-function-pointers-and-dispatch-supplement/solution"
				},
				{
					title: "Unit 8: Function Pointers and Dispatch supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Function Pointers and Dispatch. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX18-unit-8-function-pointers-and-dispatch-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX18-unit-8-function-pointers-and-dispatch-supplement/solution"
				}
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
				{
					title: "Project Pass: Extend the Dynamic Ring Buffer",
					content:
						"Return to the ring-buffer lab and use it as the main data-structure case study for invariants, queue order, and resizing behavior. Students should treat the structure as a maintained system with rules, not as a one-off container that 'seems to work.'",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Data Structures in C",
					content:
						"Keep a short engineering notebook for data structures in c that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on container choice, invariants, and what evidence shows the structure is preserving logical order so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				},
				{
					title: "Unit 9: Data Structures in C supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Data Structures in C. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX19-unit-9-data-structures-in-c-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX19-unit-9-data-structures-in-c-supplemental-2/solution"
				},
				{
					title: "Unit 9: Data Structures in C supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Data Structures in C. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX20-unit-9-data-structures-in-c-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX20-unit-9-data-structures-in-c-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 10: Engineering Math in Code: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-10-engineering-math-in-code/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-10-engineering-math-in-code/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Engineering Math in Code",
					content:
						"Keep a short engineering notebook for engineering math in code that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on scaling choices, overflow checks, and why the chosen units make the transform safer to reason about so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-10-engineering-math-in-code/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX08-unit-10-engineering-math-in-code/solution"
				},
				{
					title: "Unit 10: Engineering Math in Code supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: Engineering Math in Code. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX21-unit-10-engineering-math-in-code-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX21-unit-10-engineering-math-in-code-supplemental-2/solution"
				},
				{
					title: "Unit 10: Engineering Math in Code supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: Engineering Math in Code. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX22-unit-10-engineering-math-in-code-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX22-unit-10-engineering-math-in-code-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 11: Systems Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-11-systems-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-11-systems-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Systems Tooling",
					content:
						"Keep a short engineering notebook for systems tooling that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on which tool produced the most useful evidence for a given bug or observation and why so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-11-systems-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX09-unit-11-systems-tooling/solution"
				},
				{
					title: "Unit 11: Systems Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Systems Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX23-unit-11-systems-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX23-unit-11-systems-tooling-supplemental-2/solution"
				},
				{
					title: "Unit 11: Systems Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Systems Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX24-unit-11-systems-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX24-unit-11-systems-tooling-supplemental-3/solution"
				}
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
				{
					title: "Project: Capstone Telemetry Transform CLI",
					content:
						"Use the capstone CLI to read structured telemetry input, validate ranges, apply fixed-point transforms, and write normalized output. This project should tie together representation, parsing, validation, numeric care, and low-level engineering habits in one small but defensible utility.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Capstone Engineering Utility",
					content:
						"Keep a short engineering notebook for capstone engineering utility that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on input validation order, derived-field logic, and why the final output format is trustworthy so students build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/solution"
				},
				{
					title: "Unit 12: Capstone Engineering Utility supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Capstone Engineering Utility. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX25-unit-12-capstone-engineering-utility-supplementa/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX25-unit-12-capstone-engineering-utility-supplementa/solution"
				},
				{
					title: "Unit 12: Capstone Engineering Utility supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Capstone Engineering Utility. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX26-unit-12-capstone-engineering-utility-supplementa/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX26-unit-12-capstone-engineering-utility-supplementa/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: systems build 14",
			curriculum: [
				{
					title: "systems build 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: systems build 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "systems build 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: systems build 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "systems build 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: systems build 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-systems-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-systems-build-14/solution"
				},
				{
					title: "systems build 14: Review and Reflection",
					content:
						"Close Applied Studio 14: systems build 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "systems build 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: systems build 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-systems-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX01-systems-build-14/solution"
				},
				{
					title: "Applied Studio 14: systems build 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: systems build 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX27-applied-studio-14-systems-build-14-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX27-applied-studio-14-systems-build-14-supplemental-/solution"
				},
				{
					title: "Applied Studio 14: systems build 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: systems build 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX28-applied-studio-14-systems-build-14-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX28-applied-studio-14-systems-build-14-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: systems build 15",
			curriculum: [
				{
					title: "systems build 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: systems build 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "systems build 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: systems build 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "systems build 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: systems build 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-systems-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-systems-build-15/solution"
				},
				{
					title: "systems build 15: Review and Reflection",
					content:
						"Close Applied Studio 15: systems build 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "systems build 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: systems build 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-systems-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX02-systems-build-15/solution"
				},
				{
					title: "Applied Studio 15: systems build 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: systems build 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX29-applied-studio-15-systems-build-15-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX29-applied-studio-15-systems-build-15-supplemental-/solution"
				},
				{
					title: "Applied Studio 15: systems build 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: systems build 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX30-applied-studio-15-systems-build-15-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX30-applied-studio-15-systems-build-15-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: systems build 16",
			curriculum: [
				{
					title: "systems build 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: systems build 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "systems build 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: systems build 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "systems build 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: systems build 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-systems-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-systems-build-16/solution"
				},
				{
					title: "systems build 16: Review and Reflection",
					content:
						"Close Applied Studio 16: systems build 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "systems build 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: systems build 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-systems-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX03-systems-build-16/solution"
				},
				{
					title: "Applied Studio 16: systems build 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: systems build 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX31-applied-studio-16-systems-build-16-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX31-applied-studio-16-systems-build-16-supplemental-/solution"
				},
				{
					title: "Applied Studio 16: systems build 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: systems build 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX32-applied-studio-16-systems-build-16-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX32-applied-studio-16-systems-build-16-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: systems build 17",
			curriculum: [
				{
					title: "systems build 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: systems build 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "systems build 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: systems build 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "systems build 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: systems build 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-systems-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-systems-build-17/solution"
				},
				{
					title: "systems build 17: Review and Reflection",
					content:
						"Close Applied Studio 17: systems build 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "systems build 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: systems build 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-systems-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX04-systems-build-17/solution"
				},
				{
					title: "Applied Studio 17: systems build 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: systems build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX33-applied-studio-17-systems-build-17-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX33-applied-studio-17-systems-build-17-supplemental-/solution"
				},
				{
					title: "Applied Studio 17: systems build 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: systems build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX34-applied-studio-17-systems-build-17-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSEX34-applied-studio-17-systems-build-17-supplemental-/solution"
				}
			]
		}
	]
};
